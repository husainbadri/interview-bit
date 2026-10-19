"use client";

import {
  Cpu,
  Zap,
  FileSpreadsheet,
  MessageCircle,
  ShieldCheck,
  Workflow,
} from "lucide-react";

export default function BentoGridSection() {
  return (
    <section className="py-24 bg-[#fafafa] border-b border-[#e6e6e6] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-[10px] px-3.5 py-1 mb-4 text-xs font-medium text-[#545454] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
            <span>Enterprise Infrastructure</span>
          </div>
          <h2 className="font-poppins-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141414] tracking-tight mb-4">
            Engineered For Scale. <br />
            <span className="text-[#009959]">Built Around The Agentic Moat.</span>
          </h2>
          <p className="text-[#545454] text-base sm:text-[16px] leading-relaxed">
            Every layer of Campus OS is built to free placement officers and department heads from administrative friction,
            while giving students a measurable competitive advantage.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Large Featured Card (Spans 2 columns) */}
          <div className="md:col-span-2 card-grain p-8 sm:p-10 bg-[#ffffff] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-10 rounded-[10px] bg-[#009959]/10 border border-[#009959]/20 flex items-center justify-center text-[#009959]">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-mono bg-[#f0f0f0] text-[#545454] px-3 py-1 rounded-[10px] border border-[#e6e6e6]">
                  1-CLICK ORCHESTRATION
                </span>
              </div>

              <h3 className="font-poppins-display text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight mb-3">
                Autonomous Cohort Orchestration
              </h3>
              <p className="text-[#545454] text-sm sm:text-[15px] leading-relaxed max-w-xl mb-8">
                Assign 500 role-specific mock interviews across 8 engineering tracks with a single command. 
                The system automatically tailors question difficulty, sends WhatsApp reminders, enforces deadlines, and aggregates readiness scores without manual intervention.
              </p>
            </div>

            {/* Visual Micro-Dashboard in Bento */}
            <div className="bg-[#fafafa] border border-[#e6e6e6] rounded-[10px] p-5 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#545454] border-b border-[#e6e6e6] pb-3">
                <span className="font-semibold text-[#141414] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#009959] animate-pulse" />
                  Live Campaign: CS 2026 Placement Sprint
                </span>
                <span className="font-mono text-[#009959] font-semibold">482 / 500 Completed</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#ffffff] p-3 rounded-[8px] border border-[#e6e6e6]">
                  <span className="text-[10px] text-[#707070] font-mono uppercase block mb-1">Avg STAR Score</span>
                  <span className="text-lg font-bold font-mono text-[#141414]">8.4 / 10</span>
                </div>
                <div className="bg-[#ffffff] p-3 rounded-[8px] border border-[#e6e6e6]">
                  <span className="text-[10px] text-[#707070] font-mono uppercase block mb-1">Top Strength</span>
                  <span className="text-lg font-bold font-mono text-[#009959]">System Design</span>
                </div>
                <div className="bg-[#ffffff] p-3 rounded-[8px] border border-[#e6e6e6]">
                  <span className="text-[10px] text-[#707070] font-mono uppercase block mb-1">Auto Nudges</span>
                  <span className="text-lg font-bold font-mono text-[#141414]">18 Sent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento 2: Messaging-First Moat */}
          <div className="card-grain p-8 bg-[#ffffff] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#009959]/10 border border-[#009959]/20 flex items-center justify-center text-[#009959] mb-6">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-semibold text-xl text-[#141414] tracking-tight mb-2">
                No New Logins Needed
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed mb-6">
                Managers operate through Slack, Teams, or WhatsApp. Request candidate dossiers, view drill completion rates, and trigger follow-ups directly in your channel.
              </p>
            </div>
            <div className="bg-[#fafafa] border border-[#e6e6e6] rounded-[8px] p-3 text-xs font-mono text-[#545454]">
              <span className="text-[#009959] block mb-1 font-semibold">Slack Command:</span>
              &ldquo;/interview top-candidates --dept=CS&rdquo;
            </div>
          </div>

          {/* Bento 3: Multi-Modal AI Evaluation */}
          <div className="card-grain p-8 bg-[#ffffff] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#009959]/10 border border-[#009959]/20 flex items-center justify-center text-[#009959] mb-6">
                <Cpu size={20} />
              </div>
              <h3 className="font-semibold text-xl text-[#141414] tracking-tight mb-2">
                Multi-Modal Speech & Text
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed mb-6">
                Analyzes verbal cadence (WPM), speech hesitation, filler-word frequency, code architecture depth, and technical precision.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs bg-[#fafafa] p-2.5 rounded-[8px] border border-[#e6e6e6]">
                <span className="text-[#545454]">Audio Transcription</span>
                <span className="text-[#009959] font-mono font-semibold">99.4% Accuracy</span>
              </div>
              <div className="flex items-center justify-between text-xs bg-[#fafafa] p-2.5 rounded-[8px] border border-[#e6e6e6]">
                <span className="text-[#545454]">Hesitation Detection</span>
                <span className="text-[#141414] font-mono font-semibold">Real-Time</span>
              </div>
            </div>
          </div>

          {/* Bento 4: Anti-Cheat & Authenticity */}
          <div className="card-grain p-8 bg-[#ffffff] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#009959]/10 border border-[#009959]/20 flex items-center justify-center text-[#009959] mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-semibold text-xl text-[#141414] tracking-tight mb-2">
                Proctored & Verified
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed mb-6">
                Ensures authentic student answers. Tab-switch detection, AI plagiarism verification, and original voice answer timestamps protect credibility.
              </p>
            </div>
            <div className="bg-[#fafafa] border border-[#e6e6e6] rounded-[8px] p-3 text-xs text-[#009959] font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#009959]" />
              Verified Authenticity Index: 98.8%
            </div>
          </div>

          {/* Bento 5: Recruiter-Ready Dossiers */}
          <div className="card-grain p-8 bg-[#ffffff] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-[10px] bg-[#009959]/10 border border-[#009959]/20 flex items-center justify-center text-[#009959] mb-6">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="font-semibold text-xl text-[#141414] tracking-tight mb-2">
                Instant Recruiter Dossiers
              </h3>
              <p className="text-[#545454] text-sm leading-relaxed mb-6">
                When top tech companies visit campus, generate structured candidate talent dossiers with STAR scores and audio clips with 1 click.
              </p>
            </div>
            <div className="bg-[#fafafa] border border-[#e6e6e6] rounded-[8px] p-3 text-xs text-[#545454] flex items-center justify-between">
              <span>Ready for Export</span>
              <span className="text-[#009959] font-mono font-semibold">PDF / CSV / Link</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
