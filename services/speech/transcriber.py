import re
import time
import logging
from pathlib import Path
from typing import Dict, Any, List
from .config import settings
from .model_manager import model_manager
from .vad import VoiceActivityDetector
from .schemas import (
    TranscriptionResponse,
    SpeechMetrics,
    Segment,
    WordTimestamp
)

logger = logging.getLogger("speech_service.transcriber")

class SpeechTranscriber:
    @staticmethod
    def _extract_filler_words(text: str) -> Dict[str, Any]:
        """
        Detects verbatim filler words (uh, um, umm, like, you know, etc.)
        without altering the raw transcript.
        """
        text_lower = text.lower()
        filler_counts: Dict[str, int] = {}
        total_fillers = 0

        # Check multi-word fillers first
        multi_word = ["you know", "i mean", "sort of", "kind of", "so basically", "okay so", "ya know"]
        for phrase in multi_word:
            matches = re.findall(r"\b" + re.escape(phrase) + r"\b", text_lower)
            if matches:
                count = len(matches)
                filler_counts[phrase] = count
                total_fillers += count

        # Check single word fillers
        single_word = ["uh", "um", "umm", "uhh", "er", "ah", "ahh", "like", "actually", "basically", "literally"]
        for word in single_word:
            matches = re.findall(r"\b" + re.escape(word) + r"\b", text_lower)
            if matches:
                count = len(matches)
                filler_counts[word] = count
                total_fillers += count

        return {
            "total_count": total_fillers,
            "breakdown": filler_counts
        }

    @classmethod
    def transcribe(
        cls,
        wav_path: Path,
        session_id: str = "",
        question_id: str = "",
        user_id: str = "",
        model_name: str = ""
    ) -> TranscriptionResponse:
        start_time = time.time()

        # 1. Run non-aggressive pause and energy analysis
        vad_analysis = VoiceActivityDetector.analyze_pauses_and_energy(wav_path)
        pause_count = vad_analysis.get("pause_count", 0)

        # 2. Get loaded model
        model = model_manager.get_model(model_name or settings.whisper_model)

        # 3. Configure prompt to ensure Whisper retains verbatim speech, filler words, and Indian English syntax
        # Whisper's decoder conditioning uses the initial prompt to set vocabulary bias
        prompt = (
            "Verbatim interview transcript. Preserve all speech accurately, "
            "including filler words such as uh, um, umm, like, you know, ah, and hesitations. "
            "Do not fix grammatical errors. Do not remove repetitions or informal phrasing."
        )

        language = None if settings.whisper_language == "auto" else settings.whisper_language

        # 4. Transcribe using faster-whisper (optimized greedy decoding)
        segments_gen, info = model.transcribe(
            str(wav_path),
            beam_size=settings.whisper_beam_size,
            best_of=1,
            temperature=0.0,
            language=language,
            initial_prompt=prompt,
            word_timestamps=settings.enable_word_timestamps,
            vad_filter=settings.whisper_vad_filter,
            condition_on_previous_text=False  # Prevents repetitive hallucination loops
        )

        segments_list: List[Segment] = []
        all_word_timestamps: List[WordTimestamp] = []
        transcript_parts: List[str] = []

        seg_id = 0
        for seg in segments_gen:
            seg_text = seg.text.strip()
            if not seg_text:
                continue

            transcript_parts.append(seg_text)

            seg_words: List[WordTimestamp] = []
            if seg.words:
                for w in seg.words:
                    word_obj = WordTimestamp(
                        word=w.word.strip(),
                        start=round(w.start, 2),
                        end=round(w.end, 2),
                        probability=round(w.probability, 3)
                    )
                    seg_words.append(word_obj)
                    all_word_timestamps.append(word_obj)

            segments_list.append(
                Segment(
                    id=seg_id,
                    start=round(seg.start, 2),
                    end=round(seg.end, 2),
                    text=seg_text,
                    words=seg_words if seg_words else None,
                    avg_logprob=round(seg.avg_logprob, 3) if seg.avg_logprob is not None else None,
                    no_speech_prob=round(seg.no_speech_prob, 3) if seg.no_speech_prob is not None else None
                )
            )
            seg_id += 1

        raw_transcript = " ".join(transcript_parts).strip()
        processing_time_ms = int((time.time() - start_time) * 1000)

        # 5. Compute speech metrics
        words = raw_transcript.split()
        word_count = len(words)
        duration_sec = max(0.1, round(info.duration, 2)) if hasattr(info, "duration") and info.duration else 1.0

        # Speaking rate in Words Per Minute (WPM)
        speaking_rate_wpm = round((word_count / (duration_sec / 60.0)), 1) if duration_sec > 0 else 0.0

        filler_data = cls._extract_filler_words(raw_transcript)

        metrics = SpeechMetrics(
            word_count=word_count,
            speaking_rate_wpm=speaking_rate_wpm,
            filler_word_count=filler_data["total_count"],
            filler_words=filler_data["breakdown"],
            pause_count=pause_count,
            duration_seconds=duration_sec
        )

        import uuid
        transcription_id = f"tx_{uuid.uuid4().hex[:12]}"

        return TranscriptionResponse(
            transcription_id=transcription_id,
            session_id=session_id or None,
            question_id=question_id or None,
            user_id=user_id or None,
            raw_transcript=raw_transcript,
            language=info.language if hasattr(info, "language") else "en",
            language_probability=round(info.language_probability, 3) if hasattr(info, "language_probability") else 1.0,
            transcription_status="completed",
            model_name=model_manager.get_status()["loaded_model"] or settings.whisper_model,
            processing_time_ms=processing_time_ms,
            metrics=metrics,
            segments=segments_list,
            word_timestamps=all_word_timestamps
        )
