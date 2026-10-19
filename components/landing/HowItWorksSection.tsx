"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Select Profile & Calibrate Seniority",
    description: "Choose your target role from 15+ functional domains. Calibrate experience from fresher to lead/principal level.",
    meta: "15+ Roles Supported",
  },
  {
    step: "02",
    title: "Execute Adaptive Practice Drill",
    description: "Respond to dynamically synthesized interview questions via voice or text. Receive immediate follow-up challenges.",
    meta: "3 to 10 Questions",
  },
  {
    step: "03",
    title: "Review STAR Diagnostic Report",
    description: "Inspect actionable scores across Situation, Task, Action, and Result with tailored recommendations for improvement.",
    meta: "Instant Breakdown",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="howitworks" className="py-24 px-6 bg-[#fafafa] border-b border-[#e6e6e6]">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Display Heading — Poppins 600 at 38px */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-poppins-display mb-4">
            How the simulation observatory operates.
          </h2>
          <p className="text-[16px] text-[#545454] leading-relaxed font-sans">
            A linear, high-fidelity practice loop designed to remove friction from mock interview preparation.
          </p>
        </div>

        {/* 3 Step Cards — 10px Radius, #fafafa Surface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.step}
              className="card-grain flex flex-col justify-between hover:border-[#d6d6d6] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#e6e6e6]">
                  <span className="font-mono text-xs text-[#707070] uppercase">
                    PHASE {step.step}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#009959]" />
                </div>

                <h3 className="text-[18px] font-semibold text-[#141414] tracking-tight mb-2 font-sans">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#545454] leading-[1.6] font-sans mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e6e6e6] flex items-center justify-between text-xs text-[#707070] font-mono">
                <span>STATUS: VERIFIED</span>
                <span className="text-[#009959] font-sans font-medium">{step.meta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
