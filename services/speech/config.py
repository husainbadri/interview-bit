import os
from pathlib import Path
from pydantic import BaseModel

class SpeechSettings(BaseModel):
    # Model configuration - base.en provides ~1.5-2s inference on CPU (10x faster than large-v3-turbo)
    whisper_model: str = os.getenv("WHISPER_MODEL", "base.en")
    whisper_device: str = os.getenv("WHISPER_DEVICE", "auto")
    whisper_compute_type: str = os.getenv("WHISPER_COMPUTE_TYPE", "auto")
    whisper_language: str = os.getenv("WHISPER_LANGUAGE", "auto")
    whisper_beam_size: int = int(os.getenv("WHISPER_BEAM_SIZE", "1"))
    whisper_vad_filter: bool = os.getenv("WHISPER_VAD_FILTER", "false").lower() == "true"
    enable_word_timestamps: bool = os.getenv("ENABLE_WORD_TIMESTAMPS", "false").lower() == "true"
    enable_segment_timestamps: bool = os.getenv("ENABLE_SEGMENT_TIMESTAMPS", "true").lower() == "true"

    # Audio & Upload storage
    upload_dir: Path = Path(os.getenv("SPEECH_UPLOAD_DIR", "/tmp/campus_os_audio"))
    max_file_size_mb: int = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
    allowed_extensions: set[str] = {"webm", "wav", "mp3", "m4a", "ogg", "mp4", "aac"}

    # Common filler words for speech diagnostics (especially in interview contexts and Indian English)
    filler_words: set[str] = {
        "uh", "um", "umm", "uhh", "er", "ah", "ahh",
        "like", "you know", "i mean", "actually", "basically",
        "literally", "sort of", "kind of", "right", "okay so",
        "so basically", "you see", "ya know"
    }

settings = SpeechSettings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
