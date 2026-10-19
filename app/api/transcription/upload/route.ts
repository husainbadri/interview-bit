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

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    const pythonFormData = new FormData();
    pythonFormData.append("audio", audioFile, audioFile.name || "recording.webm");
    pythonFormData.append("session_id", sessionId);
    pythonFormData.append("question_id", questionId);

    const speechRes = await fetch(`${SPEECH_SERVICE_URL}/api/transcription/upload`, {
      method: "POST",
      body: pythonFormData,
    });

    if (!speechRes.ok) {
      const errData = await speechRes.json().catch(() => ({ detail: "Upload error" }));
      return NextResponse.json(
        { error: errData.detail || "Failed to upload audio" },
        { status: speechRes.status }
      );
    }

    const data = await speechRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Audio upload proxy error:", error);
    return NextResponse.json(
      { error: "Transcription service unavailable" },
      { status: 503 }
    );
  }
}
