import os
import sys
import time
import subprocess
from pathlib import Path

# Add project root to sys.path so services.speech can be imported
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from services.speech.config import settings
from services.speech.audio_processor import AudioProcessor
from services.speech.vad import VoiceActivityDetector
from services.speech.model_manager import model_manager
from services.speech.transcriber import SpeechTranscriber

def generate_test_audio(output_wav: Path) -> bool:
    """
    Generates a realistic test speech audio with candidate speaking patterns:
    filler words ('uh', 'um', 'like', 'you know') and Indian English grammar.
    """
    temp_aiff = output_wav.with_suffix(".aiff")
    text_to_speak = (
        "I uh have worked in three company and I was um handling many project like you know distributed systems."
    )

    try:
        # Use macOS 'say' command to synthesize audio
        subprocess.run(["say", "-o", str(temp_aiff), text_to_speak], check=True, timeout=15)
        # Convert to 16kHz mono WAV using ffmpeg
        ok, msg, duration = AudioProcessor.convert_to_wav_16k(temp_aiff, output_wav)
        if temp_aiff.exists():
            temp_aiff.unlink()
        print(f"[Test Audio] Generated {output_wav.name} ({duration}s): '{text_to_speak}'")
        return ok
    except Exception as e:
        print(f"[Test Audio] Failed to generate speech audio via 'say': {e}")
        return False

def run_tests():
    print("=" * 60)
    print("RUNNING SPEECH-TO-TEXT INTEGRATION TESTS (faster-whisper)")
    print("=" * 60)

    test_wav = settings.upload_dir / "test_candidate_speech.wav"
    
    # 1. Generate audio
    ok = generate_test_audio(test_wav)
    if not ok or not test_wav.exists():
        print("ERROR: Test audio could not be generated.")
        sys.exit(1)

    # 2. Test AudioProcessor
    print("\n--- TEST 1: AudioProcessor ---")
    duration = AudioProcessor.get_audio_duration_wave(test_wav)
    print(f"Audio duration: {duration}s")
    assert duration > 1.0, f"Expected duration > 1s, got {duration}"
    print("✓ AudioProcessor test PASSED")

    # 3. Test VoiceActivityDetector
    print("\n--- TEST 2: VoiceActivityDetector ---")
    vad_res = VoiceActivityDetector.analyze_pauses_and_energy(test_wav)
    print(f"VAD speech ratio: {vad_res.get('speech_ratio')}, pauses: {vad_res.get('pause_count')}")
    assert vad_res.get("speech_ratio", 0) > 0, "Expected non-zero speech ratio"
    print("✓ VoiceActivityDetector test PASSED")

    # 4. Test Model Loading & faster-whisper Transcription
    print("\n--- TEST 3: WhisperModelManager & faster-whisper Transcription ---")
    print(f"Configured model: {settings.whisper_model}")
    print("Transcribing audio (preserving filler words and verbatim speech)...")
    
    t0 = time.time()
    res = SpeechTranscriber.transcribe(
        wav_path=test_wav,
        session_id="test_session_123",
        question_id="test_q_1",
        user_id="test_candidate"
    )
    elapsed = time.time() - t0

    print(f"\n--- TRANSCRIPTION RESULTS (Elapsed: {elapsed:.2f}s) ---")
    print(f"Raw Transcript:   '{res.raw_transcript}'")
    print(f"Model Used:       {res.model_name}")
    print(f"Detected Lang:    {res.language} (prob: {res.language_probability})")
    print(f"Speaking Rate:    {res.metrics.speaking_rate_wpm} WPM")
    print(f"Filler Words:     {res.metrics.filler_word_count} {res.metrics.filler_words}")
    print(f"Total Segments:   {len(res.segments)}")
    print(f"Total Words:      {len(res.word_timestamps)}")

    assert len(res.raw_transcript) > 0, "Transcript should not be empty"
    print("\n✓ SpeechTranscriber test PASSED")

    # Cleanup
    if test_wav.exists():
        test_wav.unlink()

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
