"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  BrainCircuit,
  Loader2,
  Briefcase,
  BarChart,
  ArrowRight,
  FileText,
  UploadCloud,
  CheckCircle2,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from "lucide-react";

const JOB_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Scientist",
  "Data Analyst",
  "UX/UI Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Marketing Manager",
  "Sales Manager",
  "HR / Talent Partner",
  "Business Analyst",
  "Project Manager",
];

const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher (0-1 years)", description: "Foundational knowledge and academic projects" },
  { value: "junior", label: "Junior (1-3 years)", description: "Applied programming and feature delivery" },
  { value: "mid-level", label: "Mid-level (3-5 years)", description: "Autonomous project ownership and problem solving" },
  { value: "senior", label: "Senior (5-8 years)", description: "System architecture, performance, and mentorship" },
  { value: "lead", label: "Lead / Principal (8+ years)", description: "Strategic technology choices and organizational impact" },
];

function NewInterviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobRole, setJobRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("junior");
  const [numQuestions, setNumQuestions] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTrigger, setActiveTrigger] = useState<"role" | "resume" | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const levelParam = searchParams.get("level");
    if (roleParam) {
      if (JOB_ROLES.includes(roleParam)) {
        setJobRole(roleParam);
      } else {
        setJobRole("custom");
        setCustomRole(roleParam);
      }
    }
    if (levelParam) {
      const match = EXPERIENCE_LEVELS.find(
        (l) =>
          l.value.toLowerCase() === levelParam.toLowerCase() ||
          l.label.toLowerCase().includes(levelParam.toLowerCase())
      );
      if (match) {
        setExperienceLevel(match.value);
      }
    }
  }, [searchParams]);

  // Resume states
  const [resumeMode, setResumeMode] = useState<"upload" | "paste">("upload");
  const [resumeText, setResumeText] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedRole = jobRole === "custom" ? customRole : jobRole;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const allowedExtensions = [".pdf", ".txt", ".md", ".json", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!allowedExtensions.includes(ext) && !file.type.includes("text") && !file.type.includes("pdf")) {
      toast.error("Please upload a PDF, TXT, or Markdown document.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setIsUploadingResume(true);
    setUploadedFilename(file.name);

    try {
      if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.type.startsWith("text/")) {
        const text = await file.text();
        if (text && text.trim().length > 20) {
          setResumeText(text.trim());
          toast.success(`Successfully parsed ${file.name}`);
          setIsUploadingResume(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to parse document");
      }

      const data = await res.json();
      setResumeText(data.text);
      toast.success(`Resume parsed: ${data.wordCount} words detected.`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not read resume. You can also paste the text directly.");
      setUploadedFilename("");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleClearResume = () => {
    setResumeText("");
    setUploadedFilename("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStart = async (mode: "role" | "resume") => {
    if (mode === "role") {
      if (!selectedRole.trim()) {
        toast.error("Please select or enter a target job role");
        return;
      }
      if (!experienceLevel) {
        toast.error("Please select an experience level");
        return;
      }
    } else if (mode === "resume") {
      if (!resumeText.trim()) {
        toast.error("Please upload your resume or paste experience text first");
        return;
      }
    }

    const targetRole = selectedRole.trim() || "Software Engineer";
    const targetLevel = experienceLevel || "mid-level";
    const targetResume = mode === "resume" ? resumeText.trim() : undefined;

    setIsLoading(true);
    setActiveTrigger(mode);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: targetRole,
          experienceLevel: targetLevel,
          numberOfQuestions: numQuestions,
          resumeText: targetResume,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate questions");

      const data = await res.json();
      sessionStorage.setItem(
        "interviewSession",
        JSON.stringify({
          jobRole: targetRole,
          experienceLevel: targetLevel,
          questions: data.questions,
          hasResume: Boolean(targetResume),
          resumeSummary: targetResume ? targetResume.slice(0, 300) : null,
        })
      );
      toast.success(
        mode === "resume"
          ? "Resume parsed! Starting tailored mock drill..."
          : "Simulation initialized. Starting drill..."
      );
      router.push("/dashboard/interview/session");
    } catch {
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setIsLoading(false);
      setActiveTrigger(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans pb-16">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#e6e6e6]">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[#f0f0f0] border border-[#e6e6e6] text-[#545454] text-xs font-medium tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
            Simulation Setup
          </span>
        </div>
        <h1 className="font-poppins-display text-3xl sm:text-4xl leading-tight text-[#141414] mb-2 font-bold tracking-tight">
          Configure your interview deck
        </h1>
        <p className="text-[#545454] text-[15px] max-w-3xl leading-relaxed">
          Select your target role and seniority on the left, or upload your resume on the right for an AI-tailored project drill.
        </p>
      </div>

      {/* Versatile Question Count Selector Bar (Shared across both tracks) */}
      <div className="card-grain p-6 sm:p-7 mb-8 bg-[#fafafa]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BrainCircuit size={18} className="text-[#009959]" />
            <span className="text-[#141414] font-semibold text-base">
              Simulation Depth (Question Count)
            </span>
          </div>

          {/* Stepper Controls & Counter Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setNumQuestions((prev) => Math.max(1, prev - 1))}
              disabled={numQuestions <= 1}
              className="w-7 h-7 rounded-[8px] border border-[#e6e6e6] hover:border-[#009959] hover:bg-[#009959]/5 text-[#141414] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Decrease question count"
            >
              <Minus size={13} />
            </button>

            <span className="min-w-[80px] text-center bg-[#009959]/10 text-[#009959] text-xs font-mono font-bold px-2.5 py-1 rounded-[8px]">
              {numQuestions} {numQuestions === 1 ? "Question" : "Questions"}
            </span>

            <button
              type="button"
              onClick={() => setNumQuestions((prev) => Math.min(12, prev + 1))}
              disabled={numQuestions >= 12}
              className="w-7 h-7 rounded-[8px] border border-[#e6e6e6] hover:border-[#009959] hover:bg-[#009959]/5 text-[#141414] flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Increase question count"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {/* Versatile Range Slider — freely moves before 4 down to 1 */}
        <div className="relative pt-1 pb-1">
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full accent-[#009959] h-2 bg-[#e6e6e6] rounded-lg cursor-pointer transition-all"
          />
        </div>

        {/* Scale Labels & Adaptive Time Estimate */}
        <div className="flex items-center justify-between text-[11px] text-[#707070] font-mono mt-1.5">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-[#141414]">01</span>
            <span>(RAPID WARMUP)</span>
          </span>
          <span className="text-[#009959] font-medium hidden sm:inline">
            {numQuestions === 1 && "⚡ ~2-3 min Quick Diagnostic"}
            {numQuestions === 2 && "⚡ ~5 min Warmup Drill"}
            {numQuestions === 3 && "🎯 ~8 min Focused Session"}
            {numQuestions === 4 && "🎯 ~10-12 min Targeted Practice"}
            {numQuestions === 5 && "⏱️ ~15 min Standard Interview"}
            {numQuestions >= 6 && numQuestions <= 8 && "📊 ~20-25 min In-Depth Loop"}
            {numQuestions >= 9 && "🏆 ~30+ min Full Mock Evaluation"}
          </span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-[#141414]">12</span>
            <span>(EXHAUSTIVE)</span>
          </span>
        </div>

        {/* Versatile Quick-Select Preset Chips */}
        <div className="mt-3 pt-3 border-t border-[#f0f0f0] flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase text-[#707070] mr-1">Presets:</span>
          {[
            { count: 1, label: "1 Q (Lightning)" },
            { count: 2, label: "2 Q (Warmup)" },
            { count: 3, label: "3 Q (Focused)" },
            { count: 5, label: "5 Q (Standard)" },
            { count: 8, label: "8 Q (In-Depth)" },
            { count: 10, label: "10 Q (Full Loop)" },
            { count: 12, label: "12 Q (Exhaustive)" },
          ].map(({ count, label }) => (
            <button
              key={count}
              type="button"
              onClick={() => setNumQuestions(count)}
              className={`px-2.5 py-1 rounded-[8px] text-xs font-mono transition-all cursor-pointer ${
                numQuestions === count
                  ? "bg-[#009959] text-white font-semibold shadow-xs"
                  : "bg-[#f0f0f0] text-[#545454] hover:bg-[#e6e6e6]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Grid: Left (Job Role & Level) | Right (Upload Resume) */}
      <style>{`
        .interview-deck-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: stretch;
        }
        @media (min-width: 960px) {
          .interview-deck-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
      <div className="interview-deck-grid">
        {/* =========================================================================
            LEFT SECTION: SELECT THE JOB ROLE & EXPERIENCE LEVEL
           ========================================================================= */}
        <div className="card-grain p-6 sm:p-8 bg-[#fafafa] flex flex-col justify-between border border-[#e6e6e6]">
          <div>
            {/* Section Header */}
            <div className="mb-6 pb-4 border-b border-[#e6e6e6]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-mono text-[#009959] bg-[#009959]/10 px-2 py-0.5 rounded-[6px] font-semibold uppercase">
                  Section 01 · Curated Track
                </span>
                <span className="text-xs font-mono text-[#707070]">INSTANT (1ms)</span>
              </div>
              <h2 className="text-xl font-bold text-[#141414] tracking-tight font-poppins-display">
                Select the Job Role & Level
              </h2>
              <p className="text-xs text-[#545454] mt-1 leading-relaxed">
                Choose a role and seniority tier to practice calibrated technical and behavioral questions from our curated repository.
              </p>
            </div>

            {/* Job Role Selection */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-[#141414] font-semibold text-sm mb-2.5">
                <Briefcase size={16} className="text-[#009959]" />
                Target Functional Role
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full bg-[#ffffff] border border-[#d6d6d6] focus:border-[#009959] focus:ring-1 focus:ring-[#009959] focus:outline-none rounded-[10px] px-3.5 py-2.5 text-[#141414] transition-colors text-sm font-sans cursor-pointer"
              >
                {JOB_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
                <option value="custom">Other (Custom Specification)</option>
              </select>

              {jobRole === "custom" && (
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems Infrastructure Architect"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="mt-2.5 w-full bg-[#ffffff] border border-[#d6d6d6] focus:border-[#009959] focus:ring-1 focus:ring-[#009959] focus:outline-none rounded-[10px] px-3.5 py-2.5 text-[#141414] placeholder-[#707070] transition-colors text-sm font-sans"
                />
              )}
            </div>

            {/* Experience Level Selection */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-[#141414] font-semibold text-sm mb-2.5">
                <BarChart size={16} className="text-[#009959]" />
                Experience Level
              </label>
              <div className="space-y-2">
                {EXPERIENCE_LEVELS.map(({ value, label, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setExperienceLevel(value)}
                    className={`w-full text-left flex items-center justify-between p-3.5 rounded-[10px] border transition-colors cursor-pointer ${
                      experienceLevel === value
                        ? "border-[#009959] bg-[#009959]/5"
                        : "border-[#e6e6e6] hover:border-[#d6d6d6] bg-[#ffffff]"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs text-[#141414]">{label}</p>
                      <p className="text-[11px] text-[#545454] mt-0.5">{description}</p>
                    </div>
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-colors ${
                        experienceLevel === value
                          ? "border-[#009959] bg-[#009959]"
                          : "border-[#d6d6d6]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Left Action Button: Start Role-Based Drill */}
          <div className="pt-4 mt-2 border-t border-[#e6e6e6]">
            <button
              type="button"
              onClick={() => handleStart("role")}
              disabled={isLoading}
              className="w-full btn-grain-primary py-3 px-4 text-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
            >
              {isLoading && activeTrigger === "role" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading Role Drill...</span>
                </>
              ) : (
                <>
                  <span>Start Role-Based Drill ({numQuestions}Q)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="text-[11px] text-[#707070] text-center mt-2 font-mono">
              Launches instantly using calibrated industry questions
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT SECTION: UPLOAD YOUR RESUME
           ========================================================================= */}
        <div className="card-grain p-6 sm:p-8 bg-[#fafafa] flex flex-col justify-between border-l-4 border-l-[#009959] border border-[#e6e6e6]">
          <div>
            {/* Section Header */}
            <div className="mb-6 pb-4 border-b border-[#e6e6e6]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-mono text-[#009959] bg-[#009959]/10 px-2 py-0.5 rounded-[6px] font-semibold uppercase flex items-center gap-1">
                  <Sparkles size={11} />
                  Section 02 · Resume Track
                </span>
                <span className="text-xs font-mono text-[#009959]">AI PROJECT DRILL</span>
              </div>
              <h2 className="text-xl font-bold text-[#141414] tracking-tight font-poppins-display">
                Upload Your Resume
              </h2>
              <p className="text-xs text-[#545454] mt-1 leading-relaxed">
                Upload your resume (.pdf, .txt, .md) or paste experience text. Gemini extracts your listed projects, tools, and technical decisions to ask direct probing questions.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setResumeMode("upload")}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
                  resumeMode === "upload"
                    ? "bg-[#141414] text-[#fafafa]"
                    : "bg-[#f0f0f0] text-[#545454] hover:bg-[#e6e6e6]"
                }`}
              >
                Upload Document (.pdf, .txt)
              </button>
              <button
                type="button"
                onClick={() => setResumeMode("paste")}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition-colors cursor-pointer ${
                  resumeMode === "paste"
                    ? "bg-[#141414] text-[#fafafa]"
                    : "bg-[#f0f0f0] text-[#545454] hover:bg-[#e6e6e6]"
                }`}
              >
                Paste Resume Text
              </button>
            </div>

            {/* Upload Document Mode */}
            {resumeMode === "upload" && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.json,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />

                {!resumeText ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-[#009959] bg-[#009959]/5"
                        : "border-[#d6d6d6] hover:border-[#009959] bg-[#ffffff]"
                    }`}
                  >
                    {isUploadingResume ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-6">
                        <Loader2 size={24} className="animate-spin text-[#009959]" />
                        <p className="text-xs text-[#545454] font-medium">Extracting text with PDF engine...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2.5 py-4">
                        <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#545454]">
                          <UploadCloud size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#141414]">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs text-[#707070] mt-0.5">
                            PDF, TXT, or Markdown documents (max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-[10px] bg-[#009959]/5 border border-[#009959]/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={18} className="text-[#009959]" />
                        <div>
                          <p className="text-sm font-semibold text-[#141414] truncate max-w-[200px] sm:max-w-xs">
                            {uploadedFilename || "Resume Profile Loaded"}
                          </p>
                          <p className="text-xs text-[#545454]">
                            {resumeText.split(/\s+/).filter(Boolean).length} words ready for project deep dive
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowResumePreview(!showResumePreview)}
                          className="text-xs text-[#009959] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {showResumePreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {showResumePreview ? "Hide" : "Preview"}
                        </button>
                        <button
                          type="button"
                          onClick={handleClearResume}
                          className="p-1 rounded-[6px] text-[#707070] hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-colors cursor-pointer"
                          title="Remove resume"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>

                    {showResumePreview && (
                      <div className="mt-3 pt-3 border-t border-[#009959]/20">
                        <textarea
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          rows={6}
                          className="w-full bg-[#ffffff] border border-[#d6d6d6] rounded-[8px] p-3 text-xs text-[#141414] font-mono leading-relaxed focus:border-[#009959] focus:outline-none"
                          placeholder="Resume text..."
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Paste Resume Text Mode */}
            {resumeMode === "paste" && (
              <div>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={6}
                  placeholder="Paste your resume sections, notable projects, technical stack, or work accomplishments here...&#10;&#10;Example:&#10;• Experience: 3 years at Acme Corp building real-time microservices in Go & Kubernetes&#10;• Projects: Designed low-latency message pipeline handling 50k req/s&#10;• Skills: Python, TypeScript, Docker, Redis, Distributed Systems"
                  className="w-full bg-[#ffffff] border border-[#d6d6d6] focus:border-[#009959] focus:ring-1 focus:ring-[#009959] focus:outline-none rounded-[10px] p-3.5 text-[#141414] placeholder-[#707070] transition-colors text-xs font-mono leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px] text-[#707070] mt-1.5 font-mono">
                  <span>{resumeText ? `${resumeText.split(/\s+/).filter(Boolean).length} words entered` : "Paste experience details above"}</span>
                  {resumeText && (
                    <button
                      type="button"
                      onClick={handleClearResume}
                      className="text-[#dc2626] hover:underline cursor-pointer"
                    >
                      Clear text
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Context Note */}
            <div className="mt-4 p-3 rounded-[8px] bg-[#ffffff] border border-[#e6e6e6] text-[11px] text-[#545454] flex items-center gap-2">
              <Sparkles size={14} className="text-[#009959] shrink-0" />
              <span>
                Gemini will cross-reference your resume against the selected role (<strong>{selectedRole}</strong> · <strong>{experienceLevel}</strong>).
              </span>
            </div>
          </div>

          {/* Right Action Button: Start Resume-Powered Drill */}
          <div className="pt-4 mt-6 border-t border-[#e6e6e6]">
            <button
              type="button"
              onClick={() => handleStart("resume")}
              disabled={isLoading || !resumeText.trim()}
              className="w-full btn-grain-primary py-3 px-4 text-sm justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
            >
              {isLoading && activeTrigger === "resume" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synthesizing Resume Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Start Resume-Powered Drill ({numQuestions}Q)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="text-[11px] text-[#707070] text-center mt-2 font-mono">
              {resumeText.trim()
                ? "Ready to synthesize deep questions from your actual projects"
                : "Upload or paste your resume to unlock this track"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto py-16 text-center">
          <Loader2 size={24} className="animate-spin text-[#009959] mx-auto mb-2" />
          <p className="text-xs text-[#545454] font-mono">INITIALIZING DRILL CONFIGURATION...</p>
        </div>
      }
    >
      <NewInterviewForm />
    </Suspense>
  );
}
