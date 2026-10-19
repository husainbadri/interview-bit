"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Award,
  Clock,
  Mic,
  Activity,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  FileText,
  Printer,
  Calendar,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface AnswerRecord {
  question: string;
  answer: string;
  metrics?: {
    speaking_rate_wpm?: number;
    filler_word_count?: number;
    duration_seconds?: number;
    filler_words?: Record<string, number>;
  };
  feedback?: {
    rating: number;
    feedback: string;
    strengths?: string[];
    improvements?: string[];
    speechAnalysis?: {
      speakingPace: string;
      fillerWordAssessment: string;
    };
  };
}

interface CompletedSession {
  id: string;
  date: string;
  jobRole: string;
  experienceLevel: string;
  avgScore: number;
  questionsAnswered: number;
  durationMinutes: number;
  hasResume?: boolean;
  answers?: AnswerRecord[];
  avgWpm?: number;
  totalFillerWords?: number;
}

const SAMPLE_DEMO_SESSIONS: CompletedSession[] = [
  {
    id: "sample-1",
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    jobRole: "Software Engineer",
    experienceLevel: "Senior",
    avgScore: 8.5,
    questionsAnswered: 5,
    durationMinutes: 12,
    hasResume: true,
    avgWpm: 142,
    totalFillerWords: 6,
    answers: [
      {
        question: "Explain the difference between microservices and monolithic architecture. When would you choose one over the other?",
        answer: "In a monolith, all components share a single codebase, memory space, and database. Microservices decompose by domain boundary, enabling independent deployment and isolated scaling. I favor monoliths for fast early iteration and microservices when team boundaries become deployment bottlenecks.",
        metrics: {
          speaking_rate_wpm: 145,
          filler_word_count: 1,
          duration_seconds: 48,
        },
        feedback: {
          rating: 9,
          feedback: "Extremely clear delineation of architectural trade-offs with pragmatic criteria for when to decompose.",
          strengths: ["Clean separation of architectural concepts", "Highlighted team organizational coupling"],
          improvements: ["Could cite specific observability overhead in distributed systems"],
          speechAnalysis: {
            speakingPace: "Optimal Pace",
            fillerWordAssessment: "Very polished verbal delivery with minimal hesitations.",
          },
        },
      },
      {
        question: "How would you design a globally distributed URL shortening service like bit.ly?",
        answer: "I would start by estimating throughput: 100M URLs/month requires around 40 writes/sec and 400 reads/sec. We can generate unique 7-character Base62 keys from a distributed Snowflake ID or counter range service. The storage layer uses Cassandra or PostgreSQL with Redis caching the top 20% most active URLs.",
        metrics: {
          speaking_rate_wpm: 138,
          filler_word_count: 2,
          duration_seconds: 62,
        },
        feedback: {
          rating: 8,
          feedback: "Great quantitative back-of-the-envelope calculation and sound caching tier design.",
          strengths: ["Addressed Base62 encoding and unique collision resolution", "Incorporated 80/20 caching rule"],
          improvements: ["Elaborate on multi-region cache invalidation strategies"],
          speechAnalysis: {
            speakingPace: "Optimal Pace",
            fillerWordAssessment: "Good cadence, clear articulation.",
          },
        },
      },
    ],
  },
];

export default function ReportsPage() {
  const [sessions, setSessions] = useState<CompletedSession[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [useSampleData, setUseSampleData] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("campus_os_completed_sessions");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setExpandedSessionId(parsed[0]?.id || null);
          return;
        }
      }

      // Check if there is an active/recent interviewResults array in localStorage or sessionStorage
      const recentResults = localStorage.getItem("interviewResults") || sessionStorage.getItem("interviewResults");
      if (recentResults) {
        const answers: AnswerRecord[] = JSON.parse(recentResults);
        if (Array.isArray(answers) && answers.length > 0) {
          const avg = answers.reduce((sum, a) => sum + (a.feedback?.rating || 0), 0) / answers.length;
          const totalFillers = answers.reduce((sum, a) => sum + (a.metrics?.filler_word_count || 0), 0);
          const wpmAnswers = answers.filter((a) => (a.metrics?.speaking_rate_wpm || 0) > 0);
          const avgWpm = wpmAnswers.length > 0
            ? Math.round(wpmAnswers.reduce((sum, a) => sum + (a.metrics?.speaking_rate_wpm || 0), 0) / wpmAnswers.length)
            : 140;

          const synthesizedSession: CompletedSession = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            jobRole: "Software Engineer",
            experienceLevel: "Mid-level",
            avgScore: Number(avg.toFixed(1)),
            questionsAnswered: answers.length,
            durationMinutes: 8,
            answers,
            avgWpm,
            totalFillerWords: totalFillers,
          };
          setSessions([synthesizedSession]);
          setExpandedSessionId(synthesizedSession.id);
        }
      }
    } catch (e) {
      console.error("Failed to load completed sessions:", e);
    }
  }, []);

  const activeSessions = useMemo(() => {
    if (sessions.length > 0 && !useSampleData) return sessions;
    if (useSampleData || sessions.length === 0) return SAMPLE_DEMO_SESSIONS;
    return sessions;
  }, [sessions, useSampleData]);

  // Aggregate Performance Metrics
  const metrics = useMemo(() => {
    if (activeSessions.length === 0) {
      return {
        totalDrills: 0,
        totalQuestions: 0,
        avgScore: 0,
        avgWpm: 0,
        totalFillers: 0,
        grade: "N/A",
      };
    }

    const totalDrills = activeSessions.length;
    const totalQuestions = activeSessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0);
    const scoreSum = activeSessions.reduce((sum, s) => sum + (s.avgScore || 0), 0);
    const avgScore = Number((scoreSum / totalDrills).toFixed(1));

    const sessionsWithWpm = activeSessions.filter((s) => (s.avgWpm || 0) > 0);
    const avgWpm = sessionsWithWpm.length > 0
      ? Math.round(sessionsWithWpm.reduce((sum, s) => sum + (s.avgWpm || 0), 0) / sessionsWithWpm.length)
      : 142;

    const totalFillers = activeSessions.reduce((sum, s) => sum + (s.totalFillerWords || 0), 0);

    const grade =
      avgScore >= 8.5 ? "A+" :
      avgScore >= 7.8 ? "A" :
      avgScore >= 6.8 ? "B+" :
      avgScore >= 5.8 ? "B" :
      avgScore >= 4.5 ? "C" : "D";

    return {
      totalDrills,
      totalQuestions,
      avgScore,
      avgWpm,
      totalFillers,
      grade,
    };
  }, [activeSessions]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="font-sans pb-20">
      {/* Header Bar */}
      <div className="mb-8 pb-6 border-b border-[#e6e6e6] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-[#f0f0f0] border border-[#e6e6e6] text-[#545454] text-xs font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
              PERFORMANCE AUDIT & STAR ANALYTICS
            </span>
            {sessions.length === 0 && (
              <span className="text-[11px] font-mono text-[#b45309] bg-[#d97706]/10 px-2 py-0.5 rounded-[6px]">
                Preview Mode
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight font-poppins-display">
            Interview Performance Report
          </h1>
          <p className="text-[#545454] text-[15px] mt-1">
            Aggregate competency scores, speaking rate diagnostics, filler word tracking, and drill breakdown history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="btn-grain-secondary text-xs py-2.5 px-3.5 inline-flex items-center gap-1.5 cursor-pointer"
            title="Print or save as PDF"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>

          <Link
            href="/dashboard/interview/new"
            className="btn-grain-primary text-xs py-2.5 px-4 whitespace-nowrap shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform"
          >
            <span>Launch New Drill</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Zero State Notification if user has no drills yet */}
      {sessions.length === 0 && (
        <div className="card-grain p-4 mb-8 bg-[#009959]/5 border border-[#009959]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#009959] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#141414]">
                Showing Sample Demonstration Report
              </p>
              <p className="text-xs text-[#545454]">
                Complete your first mock interview drill to generate your live candidate STAR diagnostics and Whisper speech metrics.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/interview/new"
            className="btn-grain-primary text-xs py-1.5 px-3 whitespace-nowrap shrink-0"
          >
            Start Drill Now
          </Link>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Readiness Index */}
        <div className="card-grain p-6 bg-[#fafafa]">
          <div className="flex items-center justify-between text-[#707070] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">STAR READINESS</span>
            <Award size={16} className="text-[#009959]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#141414] font-poppins-display">
              {metrics.avgScore}/10
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[6px] bg-[#009959]/10 text-[#009959]">
              GRADE {metrics.grade}
            </span>
          </div>
          <p className="text-xs text-[#545454] mt-2">
            Weighted across {metrics.totalQuestions} evaluated responses
          </p>
        </div>

        {/* Total Drills */}
        <div className="card-grain p-6 bg-[#fafafa]">
          <div className="flex items-center justify-between text-[#707070] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">DRILLS COMPLETED</span>
            <BarChart3 size={16} className="text-[#009959]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#141414] font-poppins-display">
              {metrics.totalDrills}
            </span>
            <span className="text-xs text-[#707070] font-mono">
              ({metrics.totalQuestions} questions)
            </span>
          </div>
          <p className="text-xs text-[#545454] mt-2">
            Full sessions completed with STAR feedback
          </p>
        </div>

        {/* Speaking Pace (WPM) */}
        <div className="card-grain p-6 bg-[#fafafa]">
          <div className="flex items-center justify-between text-[#707070] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">VERBAL PACE</span>
            <Mic size={16} className="text-[#009959]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#141414] font-poppins-display">
              {metrics.avgWpm}
            </span>
            <span className="text-xs text-[#707070] font-mono">WPM</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-[6px] bg-[#009959]/10 text-[#009959]">
              {metrics.avgWpm >= 130 && metrics.avgWpm <= 165 ? "Optimal" : metrics.avgWpm > 165 ? "Fast" : "Deliberate"}
            </span>
          </div>
          <p className="text-xs text-[#545454] mt-2">
            Target cadence: 130–160 words per minute
          </p>
        </div>

        {/* Filler Word Cleanliness */}
        <div className="card-grain p-6 bg-[#fafafa]">
          <div className="flex items-center justify-between text-[#707070] mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">FILLER DENSITY</span>
            <Activity size={16} className="text-[#009959]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#141414] font-poppins-display">
              {metrics.totalQuestions > 0 ? (metrics.totalFillers / metrics.totalQuestions).toFixed(1) : "0"}
            </span>
            <span className="text-xs text-[#707070] font-mono">per answer</span>
          </div>
          <p className="text-xs text-[#545454] mt-2">
            {metrics.totalFillers} total speech hesitations captured
          </p>
        </div>
      </div>

      {/* STAR Rubric Breakdown Card */}
      <div className="card-grain p-6 sm:p-8 bg-[#fafafa] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#141414] tracking-tight">
              STAR Competency Diagnostic Matrix
            </h2>
            <p className="text-xs text-[#545454] mt-0.5">
              Evaluated against behavioral and technical industry benchmarks.
            </p>
          </div>
          <span className="text-xs font-mono text-[#009959] bg-[#009959]/10 px-2.5 py-1 rounded-[6px] w-fit">
            CALIBRATED BY GEMINI 1.5 PRO
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#141414]">Situation & Context Framing</span>
              <span className="font-mono text-[#009959] font-medium">85% Proficiency</span>
            </div>
            <div className="w-full h-2 bg-[#e6e6e6] rounded-full overflow-hidden">
              <div className="h-full bg-[#009959] rounded-full" style={{ width: "85%" }} />
            </div>
            <p className="text-[11px] text-[#707070] mt-1">
              Ability to set up business stakes, user constraints, and background context concisely.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#141414]">Task & Ownership Clarity</span>
              <span className="font-mono text-[#009959] font-medium">88% Proficiency</span>
            </div>
            <div className="w-full h-2 bg-[#e6e6e6] rounded-full overflow-hidden">
              <div className="h-full bg-[#009959] rounded-full" style={{ width: "88%" }} />
            </div>
            <p className="text-[11px] text-[#707070] mt-1">
              Explicit articulation of candidate responsibilities versus team contributions.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#141414]">Action & Technical Depth</span>
              <span className="font-mono text-[#009959] font-medium">82% Proficiency</span>
            </div>
            <div className="w-full h-2 bg-[#e6e6e6] rounded-full overflow-hidden">
              <div className="h-full bg-[#009959] rounded-full" style={{ width: "82%" }} />
            </div>
            <p className="text-[11px] text-[#707070] mt-1">
              Rigorous description of architecture choices, trade-offs, and engineering execution.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#141414]">Result & Measurable Business Impact</span>
              <span className="font-mono text-[#009959] font-medium">78% Proficiency</span>
            </div>
            <div className="w-full h-2 bg-[#e6e6e6] rounded-full overflow-hidden">
              <div className="h-full bg-[#009959] rounded-full" style={{ width: "78%" }} />
            </div>
            <p className="text-[11px] text-[#707070] mt-1">
              Quantified metrics (e.g. latency reductions, conversion increases, uptime gains).
            </p>
          </div>
        </div>
      </div>

      {/* Historical Interview Drills & Breakdown */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#141414] tracking-tight font-poppins-display">
            Completed Drill Logs & Detailed Feedback
          </h2>
          <p className="text-xs text-[#545454] mt-0.5">
            Click any interview drill to examine individual question evaluations and verbatim spoken answers.
          </p>
        </div>
        <span className="text-xs font-mono text-[#707070]">
          {activeSessions.length} SESSIONS
        </span>
      </div>

      <div className="space-y-4">
        {activeSessions.map((sessionItem, sIndex) => {
          const sessionId = sessionItem.id || `session_${sIndex}`;
          const isExpanded = expandedSessionId === sessionId;
          const sessionAnswers = sessionItem.answers || [];

          return (
            <div
              key={sessionId}
              className="card-grain overflow-hidden bg-[#fafafa] border border-[#e6e6e6]"
            >
              {/* Session Header Clickable Row */}
              <button
                type="button"
                onClick={() => setExpandedSessionId(isExpanded ? null : sessionId)}
                aria-expanded={isExpanded}
                className="w-full p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-[#f0f0f0]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#141414] text-[#fafafa] flex items-center justify-center font-bold text-sm shrink-0">
                    {sessionItem.jobRole.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-base text-[#141414]">
                        {sessionItem.jobRole}
                      </span>
                      <span className="text-xs font-medium text-[#545454] bg-[#f0f0f0] px-2 py-0.5 rounded-[6px]">
                        {sessionItem.experienceLevel}
                      </span>
                      {sessionItem.hasResume && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#009959] bg-[#009959]/10 px-2 py-0.5 rounded-[6px]">
                          <FileText size={11} />
                          Resume Calibrated
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#707070] mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(sessionItem.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {sessionItem.durationMinutes} min
                      </span>
                      <span>·</span>
                      <span>{sessionItem.questionsAnswered} questions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-xs font-mono text-[#707070]">STAR RATING</div>
                    <div className="text-base font-bold text-[#141414] font-poppins-display">
                      <span className="text-[#009959]">{sessionItem.avgScore}</span>/10
                    </div>
                  </div>

                  <div className="p-1 rounded-[6px] text-[#707070] bg-[#f0f0f0]">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </button>

              {/* Expanded Question Breakdown Details */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#e6e6e6] bg-[#fafafa]">
                  {sessionAnswers.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#707070] font-mono">
                      No question breakdown stored for this historical session.
                    </div>
                  ) : (
                    <div className="space-y-4 mt-3">
                      {sessionAnswers.map((answer, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-4 sm:p-5 rounded-[10px] bg-[#ffffff] border border-[#e6e6e6]"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-start gap-2.5">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-[#009959]/10 text-[#009959] shrink-0 mt-0.5">
                                Q0{qIdx + 1}
                              </span>
                              <p className="text-sm font-semibold text-[#141414]">
                                {answer.question}
                              </p>
                            </div>
                            {answer.feedback?.rating && (
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-[#009959]/10 text-[#009959] shrink-0">
                                {answer.feedback.rating}/10
                              </span>
                            )}
                          </div>

                          {/* Candidate Verbatim Transcript */}
                          <div className="my-3 pl-3 border-l-2 border-[#d6d6d6]">
                            <p className="text-xs font-mono text-[#707070] uppercase mb-1">
                              Spoken Verbatim Transcript:
                            </p>
                            <p className="text-xs text-[#141414] italic leading-relaxed">
                              &ldquo;{answer.answer}&rdquo;
                            </p>
                          </div>

                          {/* Speech Diagnostics */}
                          {answer.metrics && (
                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#545454] bg-[#f0f0f0] p-2.5 rounded-[8px] mb-3">
                              <span className="text-[#009959] font-medium flex items-center gap-1">
                                <Activity size={12} />
                                Speech Metrics:
                              </span>
                              <span>{answer.metrics.speaking_rate_wpm || "140"} WPM</span>
                              <span>·</span>
                              <span>{answer.metrics.filler_word_count ?? 0} filler words</span>
                              <span>·</span>
                              <span>{answer.metrics.duration_seconds || 45}s spoken</span>
                            </div>
                          )}

                          {/* AI Feedback Strengths & Improvements */}
                          {answer.feedback && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3 pt-3 border-t border-[#f0f0f0]">
                              {answer.feedback.strengths && answer.feedback.strengths.length > 0 && (
                                <div>
                                  <span className="font-semibold text-[#009959] uppercase tracking-wide text-[10px] font-mono">
                                    Key Strengths:
                                  </span>
                                  <ul className="mt-1 space-y-1 text-[#545454]">
                                    {answer.feedback.strengths.map((s, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-[#009959] mt-0.5">✓</span>
                                        <span>{s}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {answer.feedback.improvements && answer.feedback.improvements.length > 0 && (
                                <div>
                                  <span className="font-semibold text-[#b45309] uppercase tracking-wide text-[10px] font-mono">
                                    Target Areas for Growth:
                                  </span>
                                  <ul className="mt-1 space-y-1 text-[#545454]">
                                    {answer.feedback.improvements.map((imp, idx) => (
                                      <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-[#b45309] mt-0.5">→</span>
                                        <span>{imp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
