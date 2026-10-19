"use client";

import { useEffect, useState } from "react";
import { Clock, Star, TrendingUp, CheckCircle2 } from "lucide-react";

interface CompletedSession {
  id: string;
  date: string;
  jobRole: string;
  avgScore: number;
  questionsAnswered: number;
  durationMinutes: number;
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    sessionsCompleted: 0,
    avgScore: "—",
    hoursPracticed: "0.0h",
    questionsAnswered: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("campus_os_completed_sessions");
      if (stored) {
        const sessions: CompletedSession[] = JSON.parse(stored);
        if (sessions.length > 0) {
          const totalQuestions = sessions.reduce(
            (sum, s) => sum + (s.questionsAnswered || 0),
            0
          );
          const totalMinutes = sessions.reduce(
            (sum, s) => sum + (s.durationMinutes || 0),
            0
          );
          const validScores = sessions.filter((s) => s.avgScore > 0);
          const avg =
            validScores.length > 0
              ? (
                  validScores.reduce((sum, s) => sum + s.avgScore, 0) /
                  validScores.length
                ).toFixed(1)
              : "—";

          setMetrics({
            sessionsCompleted: sessions.length,
            avgScore: avg,
            hoursPracticed: `${(totalMinutes / 60).toFixed(1)}h`,
            questionsAnswered: totalQuestions,
          });
        }
      }
    } catch (e) {
      console.error("Failed to load completed sessions from localStorage", e);
    }
  }, []);

  const stats = [
    {
      label: "Sessions Completed",
      value: metrics.sessionsCompleted.toString(),
      detail: "THIS MONTH",
      trend: metrics.sessionsCompleted > 0 ? "Active practice" : "0% vs last mo",
      icon: <CheckCircle2 size={17} className="text-[#009959]" />,
    },
    {
      label: "Avg. STAR Score",
      value: metrics.avgScore,
      detail: "BENCHMARK: 8.5",
      trend: metrics.avgScore !== "—" ? "Calibrated score" : "No data yet",
      icon: <Star size={17} className="text-[#009959]" />,
    },
    {
      label: "Hours Practiced",
      value: metrics.hoursPracticed,
      detail: "TOTAL DURATION",
      trend: "Target: 2.5h",
      icon: <Clock size={17} className="text-[#707070]" />,
    },
    {
      label: "Questions Answered",
      value: metrics.questionsAnswered.toString(),
      detail: "EVALUATED",
      trend: "500+ in bank",
      icon: <TrendingUp size={17} className="text-[#707070]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {stats.map(({ label, value, detail, trend, icon }) => (
        <div
          key={label}
          className="card-grain hover:border-[#d6d6d6] transition-colors p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#707070] tracking-wide uppercase truncate">
              {detail}
            </span>
            <div className="w-7 h-7 rounded-[8px] bg-[#f0f0f0] border border-[#e6e6e6] flex items-center justify-center shrink-0">
              {icon}
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight mb-2 font-mono">
            {value}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e6e6e6] text-xs">
            <span className="text-[#545454] font-medium">{label}</span>
            <span className="text-[#707070] font-mono text-[11px] whitespace-nowrap">
              {trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
