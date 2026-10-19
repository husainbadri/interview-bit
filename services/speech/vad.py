import wave
import numpy as np
from pathlib import Path
from typing import List, Tuple, Dict, Any

class VoiceActivityDetector:
    """
    Non-aggressive Voice Activity Detection (VAD) and speech pause analyzer.
    Preserves all hesitations, filler words, and natural pauses for interview evaluation.
    """

    @staticmethod
    def analyze_pauses_and_energy(
        wav_path: Path,
        silence_threshold_energy: float = 0.015,
        min_pause_duration_sec: float = 0.75
    ) -> Dict[str, Any]:
        """
        Calculates pause count and speech duration without modifying or clipping the audio.
        """
        try:
            with wave.open(str(wav_path), "rb") as wf:
                sample_rate = wf.getframerate()
                n_channels = wf.getnchannels()
                sampwidth = wf.getsampwidth()
                n_frames = wf.getnframes()
                
                if n_frames == 0 or sample_rate == 0:
                    return {"pause_count": 0, "speech_ratio": 0.0, "pauses": []}

                raw_bytes = wf.readframes(n_frames)

            # Convert to numpy float array
            if sampwidth == 2:
                audio_data = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0
            elif sampwidth == 1:
                audio_data = (np.frombuffer(raw_bytes, dtype=np.uint8).astype(np.float32) - 128.0) / 128.0
            else:
                audio_data = np.frombuffer(raw_bytes, dtype=np.int32).astype(np.float32) / 2147483648.0

            # If multi-channel, average to mono
            if n_channels > 1:
                audio_data = audio_data.reshape(-1, n_channels).mean(axis=1)

            # Frame size: 30ms (standard for VAD)
            frame_size = int(sample_rate * 0.03)
            num_frames = len(audio_data) // frame_size

            pauses = []
            current_pause_start = None
            total_speech_frames = 0

            for i in range(num_frames):
                frame = audio_data[i * frame_size : (i + 1) * frame_size]
                energy = float(np.sqrt(np.mean(frame**2)))
                time_sec = (i * frame_size) / sample_rate

                if energy < silence_threshold_energy:
                    if current_pause_start is None:
                        current_pause_start = time_sec
                else:
                    total_speech_frames += 1
                    if current_pause_start is not None:
                        pause_duration = time_sec - current_pause_start
                        if pause_duration >= min_pause_duration_sec:
                            pauses.append({
                                "start": round(current_pause_start, 2),
                                "end": round(time_sec, 2),
                                "duration": round(pause_duration, 2)
                            })
                        current_pause_start = None

            # Check trailing pause
            if current_pause_start is not None:
                final_time = len(audio_data) / sample_rate
                pause_duration = final_time - current_pause_start
                if pause_duration >= min_pause_duration_sec:
                    pauses.append({
                        "start": round(current_pause_start, 2),
                        "end": round(final_time, 2),
                        "duration": round(pause_duration, 2)
                    })

            speech_ratio = round(total_speech_frames / max(1, num_frames), 3)

            return {
                "pause_count": len(pauses),
                "speech_ratio": speech_ratio,
                "pauses": pauses
            }
        except Exception as e:
            return {
                "pause_count": 0,
                "speech_ratio": 1.0,
                "pauses": [],
                "error": str(e)
            }
