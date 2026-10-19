import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateFeedback } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer, jobRole, metrics } = await req.json();

    if (!question || !answer || !jobRole) {
      return NextResponse.json(
        { error: "question, answer, and jobRole are required" },
        { status: 400 }
      );
    }

    const feedback = await generateFeedback(question, answer, jobRole, metrics);

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
