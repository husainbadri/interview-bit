import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const SPEECH_SERVICE_URL = process.env.SPEECH_SERVICE_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { text, voice } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call speech service TTS endpoint
    const response = await fetch(`${SPEECH_SERVICE_URL}/api/tts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text.trim().slice(0, 1000), // Cap at 1000 chars for safety
        voice: voice || "en-US-JennyNeural",
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "TTS error");
      return NextResponse.json(
        { error: `TTS service returned ${response.status}: ${errText}` },
        { status: response.status }
      );
    }

    const audioArrayBuffer = await response.arrayBuffer();

    return new Response(audioArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioArrayBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error: any) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate speech audio" },
      { status: 500 }
    );
  }
}
