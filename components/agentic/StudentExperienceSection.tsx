"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Mic,
  FileCheck2,
  TrendingUp,
  BrainCircuit,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Code2,
  Volume2,
  ArrowRight,
} from "lucide-react";

interface Step {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  highlight: string;
  preview: {
    title: string;
    content: React.ReactNode;
  };
}

const STEPS: Step[] = [
  {
    id: "calibration",
    stepNumber: "01",
    title: "Dynamic Role Calibration",
    subtitle: "Tuned to actual hiring bars, not generic textbook trivia.",
    badge: "Adaptive Depth",
    description:
      "Select your targeted discipline and seniority. Our engine calibrates questions based on real interview rubrics from top tech firms, fintech leaders, and high-growth scaleups.",
    highlight: "Adjusts from entry-level foundational logic to Principal-level distributed systems trade-offs.",
    preview: {
      title: "Active Calibration Engine",
      content: (
        <div className="space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between bg-[#fafafa] p-3 rounded-[8px] border border-[#e6e6e6]">
            <span className="text-[#545454]">Target Role</span>
            <span className="text-[#141414] font-semibold flex items-center gap-1.5">
              <Code2 size={13} className="text-[#009959]" />
              Full Stack Engineer (Node + Next.js)
            </span>
          </div>
          <div className="flex items-center justify-between bg-[#fafafa] p-3 rounded-[8px] border border-[#e6e6e6]">
            <span className="text-[#545454]">Seniority Target</span>
            <span className="text-[#141414] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#009959]" />
              Junior (1-3 Years Experience)
            </span>
          </div>
          <div className="bg-[#fafafa] p-3.5 rounded-[8px] border border-[#e6e6e6]">
            <span className="text-[11px] font-mono text-[#009959] uppercase block mb-1">Synthesized Prompt:</span>
            <p className="text-[#141414] text-xs italic">
              &ldquo;How do you architect optimistic UI updates in React while ensuring state consistency if server mutations fail midway?&rdquo;
            </p>
          </div>
        </div>
      ),
    },
  },
  {
    id: "interview-room",
    stepNumber: "02",
    title: "The Realistic Practice Room",
    subtitle: "Experience authentic pressure before the actual round.",
    badge: "Speech + Code",
    description:
      "Practice with voice speech-to-text or structured keyboard entry. The simulator responds like a human interviewer, giving you realistic pacing, hesitation tolerance, and follow-up prompts.",
    highlight: "Eliminates interview day freeze by building muscle memory under timed conditions.",
    preview: {
      title: "Live Simulation Session",
      content: (
        <div className="space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between text-[#707070] border-b border-[#e6e6e6] pb-2">
            <span className="flex items-center gap-1.5 font-mono">
              <Clock size={12} className="text-[#009959]" /> Elapsed: 03:42
            </span>
            <span className="text-[#009959] flex items-center gap-1 font-mono">
              <Volume2 size={12} /> Audio Stream Active
            </span>
          </div>
          <div className="bg-[#fafafa] p-3 rounded-[8px] border border-[#e6e6e6] text-[#141414]">
            <p className="font-mono text-[10px] text-[#707070] uppercase mb-1">Candidate Answer Transcription:</p>
            <p className="text-xs text-[#545454] leading-relaxed">
              &ldquo;I use TanStack Query or React state to trigger immediate UI mutation with a rollback snapshot in cache. If the POST request responds with 500, I restore the previous state and trigger a discreet toast notification...&rdquo;
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] bg-[#009959]/10 border border-[#009959]/20 p-2 rounded-[8px] text-[#009959] font-mono">
            <span>Speech Cadence: 135 WPM</span>
            <span>Filler Words: 0 Detected</span>
          </div>
        </div>
      ),
    },
  },
  {
    id: "star-feedback",
    stepNumber: "03",
    title: "Granular STAR Evaluation",
    subtitle: "Actionable diagnostic rubrics, not vague scores.",
    badge: "Diagnostic Rubric",
    description:
      "Every response is parsed against the STAR framework (Situation, Task, Action, Result). Get line-by-line rewrite suggestions, vocabulary upgrades, and benchmark comparisons with peer cohorts.",
    highlight: "Identifies hidden gaps in executive presence and technical conciseness.",
    preview: {
      title: "STAR Diagnostic Report",
      content: (
        <div className="space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between bg-[#fafafa] p-3 rounded-[8px] border border-[#e6e6e6]">
            <div>
              <span className="text-[10px] text-[#707070] font-mono uppercase block">Overall STAR Score</span>
              <span className="text-lg font-bold font-mono text-[#009959]">9.2 / 10</span>
            </div>
            <span className="bg-[#009959]/10 text-[#009959] text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[6px]">
              TIER 1 READY
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#009959]/5 border border-[#009959]/20 p-2.5 rounded-[8px]">
              <span className="text-[10px] font-mono uppercase text-[#009959] block mb-1">Strengths</span>
              <p className="text-[#545454] text-[11px]">Clear rollback mechanism and optimistic concurrency handling.</p>
            </div>
            <div className="bg-[#d97706]/5 border border-[#d97706]/20 p-2.5 rounded-[8px]">
              <span className="text-[10px] font-mono uppercase text-[#b45309] block mb-1">Growth Area</span>
              <p className="text-[#545454] text-[11px]">Could quantify customer impact or error boundary behavior.</p>
            </div>
          </div>
        </div>
      ),
    },
  },
];

export default function StudentExperienceSection() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = STEPS[activeStepIndex];

  return (
    <section className="py-24 bg-[#fafafa] border-b border-[#e6e6e6] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-[10px] px-3.5 py-1 mb-4 text-xs font-medium text-[#545454] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
            <span>The Candidate Experience</span>
          </div>
          <h2 className="font-poppins-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141414] tracking-tight mb-4">
            How Students Master <br />
            <span className="text-[#009959]">High-Stakes Technical Rounds.</span>
          </h2>
          <p className="text-[#545454] text-base sm:text-[16px] leading-relaxed">
            From initial role calibration to granular STAR evaluations, Campus OS simulates real hiring loops with zero friction.
          </p>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`card-grain p-5 text-left transition-all cursor-pointer ${
                  isActive
                    ? "border-[#009959] ring-1 ring-[#009959] bg-[#ffffff]"
                    : "hover:border-[#d6d6d6]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-[#009959]">
                    STEP {step.stepNumber}
                  </span>
                  <span className="text-[11px] font-mono text-[#707070] bg-[#f0f0f0] px-2 py-0.5 rounded-[6px]">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-[#141414] mb-1">{step.title}</h3>
                <p className="text-xs text-[#545454] line-clamp-2">{step.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase */}
        <div className="card-grain p-8 sm:p-10 bg-[#ffffff] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009959] uppercase tracking-wider">
              <span>{activeStep.badge} ENGINE</span>
            </div>
            <h3 className="font-poppins-display text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight">
              {activeStep.title}
            </h3>
            <p className="text-sm sm:text-base text-[#545454] leading-relaxed">
              {activeStep.description}
            </p>
            <div className="bg-[#fafafa] border border-[#e6e6e6] p-4 rounded-[10px]">
              <span className="text-xs font-semibold text-[#141414] block mb-1">Key Advantage:</span>
              <p className="text-xs text-[#545454] leading-relaxed">{activeStep.highlight}</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="card-grain p-5 sm:p-6 bg-[#ffffff] border border-[#e6e6e6] shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e6e6e6]">
                <span className="text-xs font-mono uppercase text-[#707070]">
                  {activeStep.preview.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-[#009959]" />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeStep.preview.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
