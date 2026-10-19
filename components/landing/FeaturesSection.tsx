"use client";

import { motion } from "framer-motion";
import { Cpu, FileText, Target, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Cpu size={22} className="text-[#141414]" />,
    title: "Adaptive Gemini Scenarios",
    description: "Custom interview drills synthesized on demand for your exact target job role, tech stack, and seniority level.",
  },
  {
    icon: <FileText size={22} className="text-[#141414]" />,
    title: "STAR Framework Rubrics",
    description: "Evaluates situation framing, action conciseness, and measurable results. Delivers quantitative ratings alongside corrective notes.",
  },
  {
    icon: <Target size={22} className="text-[#141414]" />,
    title: "Cohort Benchmark Index",
    description: "Benchmark your communication pace, hesitation markers, and clarity against 10,000+ past successful candidate drills.",
  },
  {
    icon: <Sparkles size={22} className="text-[#141414]" />,
    title: "Autonomous Simulation Agent",
    description: "Trigger mock drills directly in Slack and WhatsApp for student batches without manual scheduling bottlenecks.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-[#fafafa] border-b border-[#e6e6e6]">
      <div className="max-w-[1200px] mx-auto">
        {/* Major Section Display Heading — Poppins 600 at 38px */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-poppins-display mb-4">
            Everything your career team needs from mock drills.
          </h2>
          <p className="text-[16px] text-[#545454] leading-relaxed font-sans">
            A quiet, engineered workspace to calibrate candidate communication, structure STAR delivery, and eliminate placement blind spots.
          </p>
        </div>

        {/* 4-Column Feature Card Grid — 10px Radius, #fafafa Surface, 48px Icon in #f0f0f0 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="card-grain flex flex-col justify-between hover:border-[#d6d6d6] transition-colors"
            >
              <div>
                {/* 48px Icon in #f0f0f0 rounded square */}
                <div className="w-12 h-12 rounded-[10px] bg-[#f0f0f0] flex items-center justify-center mb-6">
                  {feature.icon}
                </div>

                <h3 className="text-[17px] font-semibold text-[#141414] tracking-tight mb-2 font-sans">
                  {feature.title}
                </h3>
                <p className="text-[14px] text-[#545454] leading-[1.6] font-sans">
                  {feature.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#e6e6e6] flex items-center justify-between text-xs text-[#707070] font-mono">
                <span>MODULE 0{i + 1}</span>
                <span className="text-[#009959] font-sans font-medium">Active</span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Detail Callout — Atmospheric Wash Background with 14px Radius */}
        <div className="mt-12 rounded-[14px] bg-atmospheric-wash border border-[#e6e6e6] p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#009959] mb-1">
              Autonomous Cohort Drills
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#141414] tracking-tight mb-2 font-sans">
              Run AI-powered interview practice from Slack & WhatsApp.
            </h3>
            <p className="text-sm text-[#545454] leading-relaxed font-sans">
              Deploy our autonomous agent to run weekly student drills, collect voice transcripts, and forward STAR summaries to placement directors.
            </p>
          </div>
          <Link href="/agentic" className="btn-grain-primary whitespace-nowrap">
            <span>Explore Agentic System</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
