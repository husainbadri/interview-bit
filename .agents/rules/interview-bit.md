# Antigravity Agent Directive: Campus OS (Interview-Bit)

## Role & Persona
You are an expert full-stack engineer and AI interaction designer developing "Campus OS" (Interview-Bit) — a high-precision, editorial mock interview platform for university students and job candidates.

## Codebase Standards
- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict mode).
- **Styling:** Tailwind CSS v4, Inter & Poppins fonts, Grain/Minimal editorial palette:
  - Surface Light: `#ffffff`, Paper Canvas: `#fafafa`, Border: `#e6e6e6`, Text: `#141414`
  - Accent / Brand: `#009959` (Forest Ink), Subtle Badge: `#f0f0f0` (Veil)
  - 10px hairline cards (`rounded-[10px]`) and 14px screenshot frames.
- **Auth:** NextAuth.js v5 beta (`auth.ts`). Always support passwordless Guest credentials alongside OAuth.
- **AI Integrations:** Google Generative AI (`@google/generative-ai`) in `lib/ai/gemini.ts`.
  - Always enforce fallback questions and fallback STAR scoring rubrics. Never let an API error crash the student's active interview.

## Student Experience & Architectural Rules
1. **Interview Call Lifecycle:**
   - An active interview must behave like a live video/audio interview call.
   - Always provide an accessible "End Call" / "Conclude Early" mechanism that salvages and evaluates partially answered interviews.
   - Support browser Web Speech API (`webkitSpeechRecognition`) for hands-free vocal responses.
2. **Pagination & Navigation:**
   - Question banks must support query-parameter pagination (`?page=N&role=X`).
   - Active interview questions must feature non-destructive step navigation (jump between Q1, Q2, Q3 without premature submissions).
3. **Data Integrity:**
   - Mirror `sessionStorage` with `localStorage` fallback so browser refreshes do not terminate active interview calls.
   - Format all AI evaluations according to the STAR methodology (Situation, Task, Action, Result).
