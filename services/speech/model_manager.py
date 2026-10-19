import logging
import threading
from typing import Optional
from faster_whisper import WhisperModel
import os
from .config import settings

logger = logging.getLogger("speech_service.model_manager")

MODEL_ALIASES = {
    "base.en": "base.en",
    "base": "base",
    "small.en": "small.en",
    "small": "small",
    "openai/whisper-large-v3-turbo": "large-v3-turbo",
    "whisper-large-v3-turbo": "large-v3-turbo",
    "openai/whisper-large-v3": "large-v3",
    "whisper-large-v3": "large-v3",
    "openai/whisper-turbo": "turbo",
}

class WhisperModelManager:
    _instance: Optional["WhisperModelManager"] = None
    _lock: threading.Lock = threading.Lock()

    def __init__(self):
        self._model: Optional[WhisperModel] = None
        self._loaded_model_name: Optional[str] = None
        self._device: str = "cpu"
        self._compute_type: str = "int8"

    @classmethod
    def get_instance(cls) -> "WhisperModelManager":
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
            return cls._instance

    def _resolve_device_and_compute(self) -> tuple[str, str]:
        device = settings.whisper_device.lower()
        compute = settings.whisper_compute_type.lower()

        if device == "auto":
            try:
                import torch
                if torch.cuda.is_available():
                    device = "cuda"
                    compute = "float16" if compute == "auto" else compute
                else:
                    device = "cpu"
                    compute = "int8" if compute == "auto" else compute
            except ImportError:
                device = "cpu"
                compute = "int8" if compute == "auto" else compute
        else:
            if compute == "auto":
                compute = "float16" if device in ("cuda", "mps") else "int8"

        return device, compute

    def get_model(self, model_name: Optional[str] = None) -> WhisperModel:
        target_model = model_name or settings.whisper_model
        resolved_model = MODEL_ALIASES.get(target_model.strip(), target_model)

        with self._lock:
            if self._model is not None and self._loaded_model_name == target_model:
                return self._model

            device, compute_type = self._resolve_device_and_compute()
            self._device = device
            self._compute_type = compute_type

            logger.info(
                f"Loading Whisper model: '{resolved_model}' (alias of '{target_model}') on device='{device}', compute_type='{compute_type}'..."
            )
            print(
                f"[WhisperModelManager] Loading model: {resolved_model} (requested={target_model}, device={device}, compute={compute_type})"
            )

            # Initialize faster-whisper model
            # cpu_threads optimized for fast parallel CPU execution
            threads = min(8, os.cpu_count() or 4)
            self._model = WhisperModel(
                resolved_model,
                device=device,
                compute_type=compute_type,
                cpu_threads=threads,
                download_root=None
            )
            self._loaded_model_name = target_model
            logger.info(f"Model '{target_model}' loaded successfully.")
            return self._model

    def get_status(self) -> dict:
        return {
            "loaded_model": self._loaded_model_name,
            "configured_model": settings.whisper_model,
            "device": self._device,
            "compute_type": self._compute_type,
            "is_loaded": self._model is not None
        }

model_manager = WhisperModelManager.get_instance()
