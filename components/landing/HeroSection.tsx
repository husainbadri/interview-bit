"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HeroSection() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const getStartedHref = isSignedIn ? "/dashboard" : "/login?callbackUrl=/dashboard";

  return (
    <section className="bg-[#fafafa] pt-28 pb-20 border-b border-[#e6e6e6] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Asymmetrical Hero Split: Text Left (42%), Product Screenshot Right (58%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Text & Dual Action Stack */}
          <div className="lg:col-span-5">
            {/* Trust Rating Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-[10px] bg-[#ffffff] border border-[#e6e6e6] shadow-[0px_1px_2px_rgba(0,0,0,0.03)] mb-6">
              <div className="flex items-center gap-0.5 text-[#009959]">
                <Star size={13} fill="#009959" />
                <Star size={13} fill="#009959" />
                <Star size={13} fill="#009959" />
                <Star size={13} fill="#009959" />
                <Star size={13} fill="#009959" />
              </div>
              <span className="w-1 h-1 rounded-full bg-[#d6d6d6]" />
              <span className="text-[13px] font-medium text-[#545454]">
                Rated 4.9/5 by 10,000+ candidates
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#141414] tracking-[-0.03em] leading-[1.14] mb-5 font-sans">
              Calibrated mock interviews for technical and product roles.
            </h1>

            {/* Body Copy */}
            <p className="text-[16px] sm:text-[17px] text-[#545454] leading-[1.62] mb-8 font-sans max-w-[500px]">
              The quiet, focused workspace for role-adaptive interview practice. Complete realistic drills,
              get immediate STAR framework evaluations, and track your readiness across cohorts.
            </p>

            {/* Dual Action Buttons — 10px Radius */}
            <div className="flex flex-wrap items-center gap-3 mb-9">
              <Link
                href={getStartedHref}
                className="btn-grain-primary text-[15px] py-3.5 px-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform"
              >
                <span>Start Practice Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/#question"
                className="btn-grain-secondary text-[15px] py-3.5 px-6 active:scale-[0.98] transition-transform"
              >
                <span>Explore Questions</span>
              </Link>
            </div>

            {/* Compliance & Verification Indicators */}
            <div className="pt-6 border-t border-[#e6e6e6] flex flex-wrap items-center gap-5 text-xs text-[#707070] font-mono">
              <span className="flex items-center gap-1.5 font-medium text-[#141414]">
                <ShieldCheck size={15} className="text-[#009959]" />
                GEMINI 1.5 PRO ENGINE
              </span>
              <span>•</span>
              <span className="font-medium text-[#141414]">STAR METHOD RUBRIC</span>
            </div>
          </div>

          {/* Right Column: Floating Product Screenshot Frame (14px Radius) */}
          <div className="lg:col-span-7">
            <div className="screenshot-grain overflow-hidden text-left bg-[#fafafa]">
              {/* Browser / App Chrome */}
              <div className="h-11 bg-[#f0f0f0] border-b border-[#e6e6e6] px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5] border border-black/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5] border border-black/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5] border border-black/10" />
                </div>
                <div className="text-[11px] sm:text-[12px] font-mono text-[#707070] tracking-tight truncate max-w-[130px] sm:max-w-none">
                  campus-os.internal / evaluation-session-042
                </div>
                <div className="text-[11px] font-medium text-[#009959] flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] bg-[#009959]/10 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009959] animate-pulse" />
                  Live Drill
                </div>
              </div>

              {/* Internal App Workspace */}
              <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
                {/* Active Scenario Title */}
                <div className="border-b border-[#e6e6e6] pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-semibold text-[#009959] bg-[#009959]/10 px-2 py-0.5 rounded-[6px]">
                      SENIOR LEVEL
                    </span>
                    <span className="text-xs text-[#707070] font-medium">Software Engineer · System Design</span>
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#141414] tracking-tight leading-snug">
                    &ldquo;Explain the difference between microservices and monolithic architecture. When would you choose one over the other?&rdquo;
                  </h3>
                </div>

                {/* Real-time Response & STAR Breakdown Split */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left Box: Candidate Transcript */}
                  <div className="bg-[#f0f0f0] rounded-[10px] p-4 border border-[#e6e6e6] flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-[#707070] uppercase tracking-wider mb-2 font-medium">
                        Candidate Transcript
                      </div>
                      <p className="text-[13px] text-[#313232] leading-relaxed font-sans">
                        &ldquo;In a monolith, all components share a single codebase and database. I recommend microservices when team boundaries require independent deployability and distinct scaling characteristics...&rdquo;
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#e6e6e6] flex items-center justify-between text-[11px] text-[#707070]">
                      <span>Speech Pace: 142 wpm</span>
                      <span className="text-[#009959] font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Clear Delivery
                      </span>
                    </div>
                  </div>

                  {/* Right Box: STAR Rubric Status */}
                  <div className="bg-[#f0f0f0] rounded-[10px] p-4 border border-[#e6e6e6] space-y-3">
                    <div className="text-[11px] font-mono text-[#707070] uppercase tracking-wider font-medium">
                      STAR Scoring Matrix
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#545454]">Situation & Task</span>
                        <span className="font-semibold text-[#141414] font-mono">9.4/10</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-[#009959] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#545454]">Action Specificity</span>
                        <span className="font-semibold text-[#009959] font-mono">9.0/10</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-[#009959] rounded-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[#545454]">Quantified Result</span>
                        <span className="font-semibold text-[#141414] font-mono">8.6/10</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                        <div className="w-[86%] h-full bg-[#009959] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Row */}
                <div className="pt-3 border-t border-[#e6e6e6] flex items-center justify-between text-xs text-[#707070]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#009959]" />
                    AI Co-Pilot: Active
                  </span>
                  <span className="font-mono text-[#009959] font-semibold">
                    STAR Grade: Exemplary (9.0)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Trust Strip */}
        <div className="mt-20 pt-10 border-t border-[#e6e6e6]">
          <p className="text-center text-xs uppercase tracking-widest text-[#707070] font-medium mb-8">
            Trusted by placement teams & career accelerators at 80+ institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-[#707070] text-[13px] font-semibold tracking-tight">
            <div className="flex items-center gap-2 hover:text-[#141414] transition-colors cursor-default">
              <span className="w-6 h-6 rounded-[6px] bg-[#f0f0f0] border border-[#e6e6e6] flex items-center justify-center font-bold text-[11px] text-[#141414]">IIT</span>
              <span>IIT DELHI</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#141414] transition-colors cursor-default">
              <span className="w-6 h-6 rounded-[6px] bg-[#f0f0f0] border border-[#e6e6e6] flex items-center justify-center font-bold text-[11px] text-[#141414]">BP</span>
              <span>BITS PILANI</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#141414] transition-colors cursor-default">
              <span className="w-6 h-6 rounded-[6px] bg-[#f0f0f0] border border-[#e6e6e6] flex items-center justify-center font-bold text-[11px] text-[#141414]">S</span>
              <span>STANFORD CODE LAB</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#141414] transition-colors cursor-default">
              <span className="w-6 h-6 rounded-[6px] bg-[#f0f0f0] border border-[#e6e6e6] flex items-center justify-center font-bold text-[11px] text-[#141414]">BV</span>
              <span>BERKELEY VENTURES</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#141414] transition-colors cursor-default">
              <span className="w-6 h-6 rounded-[6px] bg-[#f0f0f0] border border-[#e6e6e6] flex items-center justify-center font-bold text-[11px] text-[#141414]">CT</span>
              <span>COLUMBIA TALENT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
