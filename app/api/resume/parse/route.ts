import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const filename = file.name || "resume";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = "";

    if (filename.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
      // Dynamically require pdf-parse to avoid server startup issues
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      extractedText = data.text || "";
    } else {
      // Plain text, markdown, or other text documents
      extractedText = buffer.toString("utf-8");
    }

    // Clean up excessive whitespace
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!extractedText) {
      return NextResponse.json(
        { error: "Could not extract legible text from file. Please paste your resume text instead." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      text: extractedText,
      filename,
      characterCount: extractedText.length,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length,
    });
  } catch (error: any) {
    console.error("Resume parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume: " + (error?.message || "Unknown error") },
      { status: 500 }
    );
  }
}
