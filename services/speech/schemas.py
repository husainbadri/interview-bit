from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class WordTimestamp(BaseModel):
    word: str
    start: float
    end: float
    probability: float

class Segment(BaseModel):
    id: int
    start: float
    end: float
    text: str
    words: Optional[List[WordTimestamp]] = None
    avg_logprob: Optional[float] = None
    no_speech_prob: Optional[float] = None

class SpeechMetrics(BaseModel):
    word_count: int = 0
    speaking_rate_wpm: float = 0.0
    filler_word_count: int = 0
    filler_words: Dict[str, int] = Field(default_factory=dict)
    pause_count: int = 0
    duration_seconds: float = 0.0

class TranscriptionResponse(BaseModel):
    transcription_id: str
    session_id: Optional[str] = None
    question_id: Optional[str] = None
    user_id: Optional[str] = None
    raw_transcript: str
    language: str = "en"
    language_probability: float = 1.0
    transcription_status: str = "completed"
    model_name: str
    processing_time_ms: int
    metrics: SpeechMetrics
    segments: List[Segment] = Field(default_factory=list)
    word_timestamps: List[WordTimestamp] = Field(default_factory=list)

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None
