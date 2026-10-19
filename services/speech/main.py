import os
import uuid
from pathlib import Path
from typing import Optional, Dict
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from .config import settings
from .schemas import TranscriptionResponse, ErrorResponse
from .audio_processor import AudioProcessor
from .transcriber import SpeechTranscriber
from .model_manager import model_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm model in memory on server start for instant inference
    print(f"[Campus OS Speech] Pre-warming Whisper model '{settings.whisper_model}'...")
    try:
        model_manager.get_model()
        print("[Campus OS Speech] Model warm-loaded and ready for instant inference.")
    except Exception as e:
        print(f"[Campus OS Speech] Warning: Model pre-warming deferred: {e}")
    yield

app = FastAPI(
    title="Campus OS Speech Transcription Service",
    description="High-accuracy verbatim speech recognition service powered by faster-whisper",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local development and Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for completed transcriptions and TTS audio
_transcription_cache: Dict[str, TranscriptionResponse] = {}
_tts_cache: Dict[str, bytes] = {}

@app.post("/api/tts")
async def text_to_speech(data: dict):
    """
    Generate natural neural audio speech for question readout.
    Streams MP3 bytes using Microsoft Edge Neural TTS voices.
    """
    text = (data.get("text") or "").strip()
    voice = data.get("voice") or "en-US-JennyNeural"
    if not text:
        raise HTTPException(status_code=400, detail="Text is required")

    import hashlib
    cache_key = hashlib.md5(f"{voice}:{text}".encode("utf-8")).hexdigest()
    if cache_key in _tts_cache:
        return Response(content=_tts_cache[cache_key], media_type="audio/mpeg")

    try:
        import edge_tts
        communicate = edge_tts.Communicate(text, voice)
        audio_data = bytearray()
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data.extend(chunk["data"])

        audio_bytes = bytes(audio_data)
        if len(_tts_cache) < 150:
            _tts_cache[cache_key] = audio_bytes
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        print(f"[TTS Error] {e}")
        raise HTTPException(status_code=500, detail=f"TTS synthesis error: {str(e)}")

@app.get("/health")
def health_check():
    """Service health and model readiness endpoint."""
    model_status = model_manager.get_status()
    return {
        "status": "healthy",
        "service": "campus-os-speech",
        "engine": "faster-whisper",
        **model_status
    }

@app.post(
    "/api/transcription/process",
    response_model=TranscriptionResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}}
)
async def process_transcription(
    background_tasks: BackgroundTasks,
    audio: UploadFile = File(...),
    session_id: Optional[str] = Form(""),
    question_id: Optional[str] = Form(""),
    user_id: Optional[str] = Form(""),
    model_name: Optional[str] = Form("")
):
    """
    Direct synchronous audio processing and verbatim transcription endpoint.
    Accepts audio file (WebM, WAV, MP3, M4A, etc.), converts to 16kHz mono,
    transcribes with faster-whisper, and returns raw transcript + speech metrics.
    """
    if not audio.filename:
        raise HTTPException(status_code=400, detail="Audio file must have a filename.")

    if not AudioProcessor.is_valid_extension(audio.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format. Allowed: {settings.allowed_extensions}"
        )

    # Save uploaded file to temp storage
    file_uuid = uuid.uuid4().hex
    raw_ext = audio.filename.rsplit(".", 1)[-1].lower() if "." in audio.filename else "webm"
    temp_input = settings.upload_dir / f"upload_{file_uuid}.{raw_ext}"
    temp_wav = settings.upload_dir / f"proc_{file_uuid}.wav"

    try:
        content = await audio.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

        max_bytes = settings.max_file_size_mb * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"Audio file exceeds maximum allowed size ({settings.max_file_size_mb}MB)."
            )

        with open(temp_input, "wb") as f:
            f.write(content)

        # Convert to 16kHz mono WAV
        ok, msg, duration = AudioProcessor.convert_to_wav_16k(temp_input, temp_wav)
        if not ok:
            raise HTTPException(status_code=400, detail=f"Audio conversion failed: {msg}")

        # Perform verbatim transcription with faster-whisper
        response = SpeechTranscriber.transcribe(
            wav_path=temp_wav,
            session_id=session_id or "",
            question_id=question_id or "",
            user_id=user_id or "",
            model_name=model_name or ""
        )

        # Cache response
        _transcription_cache[response.transcription_id] = response

        # Schedule temp files cleanup in background
        background_tasks.add_task(AudioProcessor.cleanup_file, temp_input)
        background_tasks.add_task(AudioProcessor.cleanup_file, temp_wav)

        return response

    except HTTPException:
        AudioProcessor.cleanup_file(temp_input)
        AudioProcessor.cleanup_file(temp_wav)
        raise
    except Exception as e:
        AudioProcessor.cleanup_file(temp_input)
        AudioProcessor.cleanup_file(temp_wav)
        raise HTTPException(status_code=500, detail=f"Transcription processing error: {str(e)}")

@app.post("/api/transcription/upload")
async def upload_audio_only(
    audio: UploadFile = File(...),
    session_id: Optional[str] = Form(""),
    question_id: Optional[str] = Form("")
):
    """
    Saves audio file and returns a reference for deferred/background processing.
    """
    if not audio.filename or not AudioProcessor.is_valid_extension(audio.filename):
        raise HTTPException(status_code=400, detail="Invalid audio file.")

    file_uuid = uuid.uuid4().hex
    raw_ext = audio.filename.rsplit(".", 1)[-1].lower() if "." in audio.filename else "webm"
    temp_input = settings.upload_dir / f"stored_{file_uuid}.{raw_ext}"

    content = await audio.read()
    with open(temp_input, "wb") as f:
        f.write(content)

    return {
        "upload_id": file_uuid,
        "file_name": audio.filename,
        "size_bytes": len(content),
        "session_id": session_id,
        "question_id": question_id,
        "status": "uploaded"
    }

@app.get("/api/transcription/{transcription_id}")
def get_transcription(transcription_id: str):
    """Retrieve previously processed transcription by ID."""
    if transcription_id not in _transcription_cache:
        raise HTTPException(status_code=404, detail="Transcription not found.")
    return _transcription_cache[transcription_id]

@app.delete("/api/transcription/{transcription_id}")
def delete_transcription(transcription_id: str):
    """Remove transcription from cache."""
    if transcription_id in _transcription_cache:
        del _transcription_cache[transcription_id]
        return {"status": "deleted", "id": transcription_id}
    raise HTTPException(status_code=404, detail="Transcription not found.")
