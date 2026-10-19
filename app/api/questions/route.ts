import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateInterviewQuestions } from "@/lib/ai/gemini";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobRole, experienceLevel, numberOfQuestions, resumeText } = await req.json();

    if (!jobRole || !experienceLevel) {
      return NextResponse.json(
        { error: "jobRole and experienceLevel are required" },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions(
      jobRole,
      experienceLevel,
      numberOfQuestions || 5,
      resumeText
    );

    if (!questions.length) {
      return NextResponse.json(
        { error: "Failed to generate questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions, jobRole, experienceLevel });
  } catch (error) {
    console.error("Questions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
