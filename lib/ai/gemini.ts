import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCuratedQuestionsForRole } from "@/lib/questions/curated";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
});

const MODELS_TO_TRY = [
  process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
];

async function callGeminiWithRetry(prompt: string): Promise<string | null> {
  for (const modelName of MODELS_TO_TRY) {
    try {
      const model = genAI.getGenerativeModel(
        { model: modelName },
        { timeout: 3500 }
      );
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (err: any) {
      console.warn(
        `[Gemini AI] Call failed for ${modelName} (${err?.status || err?.message}). Failing over immediately...`
      );
    }
  }
  return null;
}

function getFallbackQuestions(
  jobRole: string,
  experienceLevel: string,
  numberOfQuestions: number = 5,
  resumeText?: string
): string[] {
  const role = jobRole.trim() || "Software Engineer";
  const level = experienceLevel.trim() || "Mid-level";

  if (resumeText && resumeText.trim().length > 30) {
    const resumePool = [
      `Based on the key systems and projects highlighted in your resume as a ${role}, walk me through the architecture of the most technically demanding service you delivered.`,
      `Looking at the technologies listed on your resume, what were the primary technical trade-offs you evaluated when making your core design decisions?`,
      `Describe a high-stakes production incident or complex debugging challenge you solved in one of the recent systems detailed on your resume.`,
      `As a ${level} ${role}, how did you ensure test coverage, code quality, and low-latency performance across the initiatives mentioned in your background?`,
      `Describe a time in your past experience where you had to navigate ambiguous requirements or align disagreeing stakeholders on a technical direction.`,
      `If you were to re-architect the primary feature or infrastructure described in your resume from scratch today, what would you design differently?`,
      `How did you define and measure the quantitative business impact or latency improvements of the projects listed on your profile?`,
      `What is the most significant technical skill or architectural lesson you acquired during the projects outlined in your resume?`,
    ];
    return resumePool.slice(0, Math.min(numberOfQuestions, resumePool.length));
  }

  const genericPool = [
    `Can you describe your background and experience as a ${role}, and what core projects you have built?`,
    `What are the most critical technical skills, tools, or design patterns you rely on in your daily work as a ${role}?`,
    `Describe a complex problem or technical roadblock you encountered in a recent project. How did you diagnose and solve it?`,
    `As a ${level} professional, how do you approach architectural decisions, code quality, and testing?`,
    `How do you prioritize competing deadlines and manage technical debt when delivering features?`,
    `Tell me about a time you had a disagreement with a team member or stakeholder on a technical decision. How was it resolved?`,
    `What strategies do you use for performance optimization, error monitoring, and reliability in production?`,
    `How do you stay up-to-date with emerging tools, best practices, and ecosystem changes in your domain?`,
    `Describe how you collaborate across teams (with designers, product managers, and other engineers) to deliver value.`,
    `What is a major lesson or technical skill you learned recently that changed how you build systems?`,
  ];

  return genericPool.slice(0, Math.min(numberOfQuestions, genericPool.length));
}

export async function generateInterviewQuestions(
  jobRole: string,
  experienceLevel: string,
  numberOfQuestions: number = 5,
  resumeText?: string
): Promise<string[]> {
  // Ultra-fast path: If no resume provided, return calibrated role questions instantly (0ms delay)
  if (!resumeText || resumeText.trim().length < 20) {
    const curated = getCuratedQuestionsForRole(
      jobRole,
      experienceLevel,
      numberOfQuestions
    );
    if (curated.length >= numberOfQuestions) {
      return curated;
    }
  }

  const resumeSection =
    resumeText && resumeText.trim().length > 20
      ? `\nCANDIDATE RESUME / EXPERIENCE PROFILE:
"""
${resumeText.trim().slice(0, 4000)}
"""

CRITICAL RESUME-BASED INSTRUCTIONS:
- Directly analyze the candidate's actual projects, technologies, tools, and roles mentioned in the resume.
- Formulate realistic, highly tailored interview questions that drill down into the specific systems, metrics, architecture decisions, and technologies they claim to have worked on.
- Balance project-specific technical inquiries with behavioral questions about how they handled challenges or collaboration in those roles.
- Calibrate the difficulty to the ${experienceLevel} level for a ${jobRole}.`
      : `The questions should be relevant, challenging, and cover technical and behavioral aspects for a ${experienceLevel} ${jobRole} position.`;

  const prompt = `Generate ${numberOfQuestions} interview questions for a ${experienceLevel} ${jobRole} position.
${resumeSection}

Return ONLY a JSON array of strings with the questions, no additional text.
Example format: ["Question 1?", "Question 2?", "Question 3?"]`;

  try {
    const text = await callGeminiWithRetry(prompt);

    if (text) {
      const cleanText = text
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim();
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          const extracted = parsed
            .map((item) => {
              if (typeof item === "string") return item.trim();
              if (item && typeof item === "object") {
                return (
                  item.question ||
                  item.text ||
                  item.title ||
                  JSON.stringify(item)
                );
              }
              return String(item);
            })
            .filter((q) => Boolean(q) && q.length > 5);

          if (extracted.length > 0) {
            return extracted.slice(0, numberOfQuestions);
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to generate AI questions, using fallback:", error);
  }

  // Graceful fallback if AI is experiencing temporary high demand/outage
  console.log("Using fallback questions for", jobRole, experienceLevel);
  return getFallbackQuestions(jobRole, experienceLevel, numberOfQuestions, resumeText);
}

export async function generateFeedback(
  question: string,
  answer: string,
  jobRole: string,
  metrics?: {
    speakingRate?: number;
    fillerWordCount?: number;
    durationSeconds?: number;
  }
): Promise<{
  rating: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  speechAnalysis?: {
    speakingPace: string;
    fillerWordAssessment: string;
  };
}> {
  const speechContext = metrics
    ? `\nSpeech Delivery Metrics:
- Speaking Rate: ${metrics.speakingRate || "N/A"} WPM (target: 120-160 WPM)
- Filler Words Count: ${metrics.fillerWordCount ?? "N/A"}
- Duration: ${metrics.durationSeconds ? `${metrics.durationSeconds}s` : "N/A"}`
    : "";

  const prompt = `As an expert interviewer and communication evaluator for ${jobRole} positions, evaluate this candidate's interview answer.

Question: ${question}
Spoken Answer (Raw Verbatim Transcript): ${answer}${speechContext}

IMPORTANT EVALUATION RULES:
1. Analyze the candidate's answer exactly as spoken.
2. Do not rewrite, improve, correct, or paraphrase the candidate's transcript.
3. The transcript may contain grammatical errors, incomplete sentences, filler words (e.g. "uh", "um", "like", "you know"), repetitions, informal language, and speech-recognition artifacts.
4. Evaluate the candidate's grammar, fluency, vocabulary, clarity, relevance, completeness, sentence formation, and communication quality.
5. Preserve the candidate's original wording when quoting or providing examples.
6. Do not treat a grammatical mistake as a transcription error unless there is strong evidence that the speech recognition was incorrect.
7. If a phrase is uncertain, clearly mark it as uncertain instead of inventing a more polished sentence.

Provide a JSON response with:
- rating: number from 1-10
- feedback: objective overall feedback (2-3 sentences) evaluating both content and communication fidelity
- strengths: array of 2-3 key strengths in the answer (quote verbatim phrases where applicable)
- improvements: array of 2-3 areas to improve (grammar, structure, filler word reduction, or technical depth)
- speechAnalysis: object with:
    - speakingPace: "Too Fast", "Optimal Pace", "Too Slow", or "Not Recorded"
    - fillerWordAssessment: brief 1-sentence assessment of filler word usage and natural fluency

Return ONLY valid JSON, no additional text.`;

  try {
    const text = await callGeminiWithRetry(prompt);

    if (text) {
      const cleanText = text
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim();
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (error) {
    console.error("Failed to parse AI feedback:", error);
  }

  return {
    rating: 6,
    feedback:
      "Good effort on your response. Focus on providing structured answers with specific examples and measurable impact while maintaining concise delivery.",
    strengths: [
      "Demonstrated understanding of core concepts",
      "Communicated thoughts directly",
    ],
    improvements: [
      "Include more quantitative results or concrete metrics",
      "Structure responses using the STAR method (Situation, Task, Action, Result)",
    ],
    speechAnalysis: {
      speakingPace: metrics?.speakingRate && metrics.speakingRate > 170 ? "Too Fast" : metrics?.speakingRate && metrics.speakingRate < 110 ? "Too Slow" : "Optimal Pace",
      fillerWordAssessment: (metrics?.fillerWordCount || 0) > 4 ? "Consider pausing instead of using filler words." : "Good fluency with minimal filler words."
    }
  };
}
