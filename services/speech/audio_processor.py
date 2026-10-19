import os
import shutil
import subprocess
import wave
from pathlib import Path
from typing import Tuple
from .config import settings

class AudioProcessor:
    @staticmethod
    def is_valid_extension(filename: str) -> bool:
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        return ext in settings.allowed_extensions

    @staticmethod
    def get_audio_duration_wave(wav_path: Path) -> float:
        try:
            with wave.open(str(wav_path), "rb") as wf:
                frames = wf.getnframes()
                rate = wf.getframerate()
                if rate > 0:
                    return round(frames / float(rate), 2)
        except Exception:
            pass
        return 0.0

    @classmethod
    def convert_to_wav_16k(cls, input_path: Path, output_path: Path) -> Tuple[bool, str, float]:
        """
        Converts audio to 16kHz mono 16-bit PCM WAV using ffmpeg.
        Returns (success, message, duration_seconds).
        """
        # Check if ffmpeg or avconv is available
        ffmpeg_bin = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg" or "/usr/local/bin/ffmpeg"
        
        if not os.path.exists(ffmpeg_bin) and not shutil.which("ffmpeg"):
            # Fallback: if already a WAV file, check if readable
            if input_path.suffix.lower() == ".wav":
                try:
                    shutil.copy(str(input_path), str(output_path))
                    duration = cls.get_audio_duration_wave(output_path)
                    return True, "WAV copied without ffmpeg", duration
                except Exception as e:
                    return False, f"FFmpeg not installed and WAV copy failed: {str(e)}", 0.0
            return False, "FFmpeg binary is required for audio format normalization", 0.0

        try:
            cmd = [
                ffmpeg_bin if os.path.exists(ffmpeg_bin) else "ffmpeg",
                "-y",                # Overwrite output if exists
                "-threads", "0",     # Multi-threaded conversion
                "-i", str(input_path),
                "-ac", "1",          # Mono channel
                "-ar", "16000",      # 16,000 Hz sample rate
                "-c:a", "pcm_s16le", # 16-bit PCM
                str(output_path)
            ]
            
            result = subprocess.run(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
                timeout=60
            )

            if result.returncode != 0:
                err_msg = result.stderr.decode("utf-8", errors="ignore")
                return False, f"FFmpeg conversion failed: {err_msg[:200]}", 0.0

            duration = cls.get_audio_duration_wave(output_path)
            return True, "Converted to 16kHz mono WAV", duration

        except subprocess.TimeoutExpired:
            return False, "Audio conversion timed out (>60s)", 0.0
        except Exception as e:
            return False, f"Audio processing error: {str(e)}", 0.0

    @staticmethod
    def cleanup_file(path: Path) -> None:
        try:
            if path and path.exists():
                path.unlink(missing_ok=True)
        except Exception:
            pass
