import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const SPEECH_SERVICE_URL = process.env.SPEECH_SERVICE_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const sessionId = (formData.get("sessionId") as string) || "";
    const questionId = (formData.get("questionId") as string) || "";
    const modelName = (formData.get("modelName") as string) || "";

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required for speech transcription" },
        { status: 400 }
      );
    }

    // Size limit: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (audioFile.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Audio file exceeds maximum size limit of 50MB" },
        { status: 400 }
      );
    }

    // Forward to Python faster-whisper service
    const pythonFormData = new FormData();
    pythonFormData.append("audio", audioFile, audioFile.name || "recording.webm");
    pythonFormData.append("session_id", sessionId);
    pythonFormData.append("question_id", questionId);
    pythonFormData.append("user_id", session.user.id || session.user.email || "guest");
    if (modelName) {
      pythonFormData.append("model_name", modelName);
    }

    const speechRes = await fetch(`${SPEECH_SERVICE_URL}/api/transcription/process`, {
      method: "POST",
      body: pythonFormData,
      // Allow up to 120s for processing large audio files
      signal: AbortSignal.timeout(120000),
    });

    if (!speechRes.ok) {
      const errData = await speechRes.json().catch(() => ({ detail: "Speech service error" }));
      return NextResponse.json(
        { error: errData.detail || "Failed to process audio with transcription engine" },
        { status: speechRes.status }
      );
    }

    const data = await speechRes.json();

    return NextResponse.json({
      success: true,
      transcriptionId: data.transcription_id,
      rawTranscript: data.raw_transcript,
      language: data.language,
      languageProbability: data.language_probability,
      modelName: data.model_name,
      processingTimeMs: data.processing_time_ms,
      metrics: data.metrics,
      segments: data.segments,
      wordTimestamps: data.word_timestamps,
    });
  } catch (error: any) {
    console.error("Transcription proxy error:", error);
    if (error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Speech transcription request timed out (>120s)" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      {
        error:
          "Speech transcription service is currently unavailable. Ensure the Python speech service is running on port 8000.",
      },
      { status: 503 }
    );
  }
}
