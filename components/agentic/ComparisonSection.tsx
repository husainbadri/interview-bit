"use client";

import { Check, X, Sparkles, Building2, Bot } from "lucide-react";

interface ComparisonRow {
  dimension: string;
  traditional: string;
  agentic: string;
  highlight?: boolean;
}

const COMPARISONS: ComparisonRow[] = [
  {
    dimension: "Administrative Workflow",
    traditional: "Placement cells juggle 15 spreadsheets, manual email follow-ups, and clunky LMS dashboards.",
    agentic: "A dedicated Agentic Colleague in Slack/WhatsApp executes cohort campaigns and nudges with 1 prompt.",
    highlight: true,
  },
  {
    dimension: "Question Engine",
    traditional: "Static banks of outdated multiple-choice questions that haven't changed in 4 years.",
    agentic: "Real-time AI calibrated to specific company hiring rubrics (Google, Stripe, Goldman Sachs, Startups).",
  },
  {
    dimension: "Feedback Depth",
    traditional: "Vague pass/fail percentages with zero actionable advice on how to improve.",
    agentic: "Granular STAR diagnostic, speech cadence (WPM) analysis, filler-word tracking, and rewrite suggestions.",
  },
  {
    dimension: "Cohort Visibility",
    traditional: "Blind spots until the actual placement season arrives and students fail round one.",
    agentic: "Continuous readiness index tracking with automated alerts when a cohort falls below target proficiency.",
  },
  {
    dimension: "Recruiter Engagement",
    traditional: "Forwarding hundreds of unfiltered PDFs that recruiters barely glance at.",
    agentic: "1-click verified candidate dossiers with STAR ratings and recorded answers ready for recruiters.",
  },
];

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-[#fafafa] font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-[10px] px-3.5 py-1 mb-4 text-xs font-medium text-[#545454] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
            <span>The Paradigm Shift</span>
          </div>
          <h2 className="font-poppins-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141414] tracking-tight mb-4">
            Legacy Portals vs. <br />
            <span className="text-[#009959]">The Agentic System.</span>
          </h2>
          <p className="text-[#545454] text-base sm:text-[16px] leading-relaxed">
            Why leading universities, bootcamps, and career accelerators are replacing static interview portals with Campus OS.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="card-grain rounded-[10px] overflow-hidden bg-[#ffffff] shadow-xs">
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#e6e6e6] bg-[#fafafa] text-xs uppercase font-mono font-semibold tracking-wider">
            <div className="p-4 sm:p-5 md:col-span-4 text-[#707070]">Capability</div>
            <div className="p-4 sm:p-5 md:col-span-4 text-[#545454] flex items-center gap-2 border-t md:border-t-0 md:border-l border-[#e6e6e6]">
              <Building2 size={14} className="text-[#707070]" />
              Traditional Campus LMS
            </div>
            <div className="p-4 sm:p-5 md:col-span-4 text-[#009959] flex items-center gap-2 border-t md:border-t-0 md:border-l border-[#e6e6e6] bg-[#009959]/5">
              <Bot size={14} className="text-[#009959]" />
              Campus OS Agentic System
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#e6e6e6] text-xs sm:text-sm">
            {COMPARISONS.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-12 transition-colors hover:bg-[#f0f0f0]/40 ${
                  row.highlight ? "bg-[#009959]/[0.02]" : ""
                }`}
              >
                {/* Dimension */}
                <div className="p-4 sm:p-5 md:col-span-4 font-semibold text-[#141414] flex items-center">
                  {row.dimension}
                </div>

                {/* Traditional */}
                <div className="p-4 sm:p-5 md:col-span-4 text-[#545454] md:border-l border-[#e6e6e6] flex items-start gap-2.5 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/20 flex items-center justify-center text-[#dc2626] flex-shrink-0 mt-0.5">
                    <X size={12} />
                  </div>
                  <span>{row.traditional}</span>
                </div>

                {/* Agentic */}
                <div className="p-4 sm:p-5 md:col-span-4 text-[#141414] md:border-l border-[#e6e6e6] flex items-start gap-2.5 leading-relaxed bg-[#009959]/[0.02]">
                  <div className="w-5 h-5 rounded-full bg-[#009959]/10 border border-[#009959]/20 flex items-center justify-center text-[#009959] flex-shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span className="font-medium">{row.agentic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
