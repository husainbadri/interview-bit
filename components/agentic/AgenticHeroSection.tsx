"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Terminal, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AgenticHeroSection() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] pt-28 pb-20 font-sans border-b border-[#e6e6e6]">
      {/* Subtle atmospheric wash and paper grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0, 153, 89, 0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#e6e6e6 1px, transparent 1px), linear-gradient(90deg, #e6e6e6 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-[10px] px-3.5 py-1 mb-8 text-xs font-medium text-[#545454] uppercase tracking-wider"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
          <span>The Agentic Workforce Inside Campus OS</span>
        </motion.div>

        {/* Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-poppins-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-6 text-[#141414] tracking-tight"
        >
          The Mock Interview Platform <br />
          <span className="text-[#009959]">
            Students Actually Love.
          </span>
          <br />
          <span className="text-2xl sm:text-3xl md:text-4xl text-[#545454] font-normal tracking-normal block mt-3">
            Operated by an autonomous AI colleague right from your Slack.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-[17px] text-[#545454] max-w-3xl mx-auto mb-10 font-sans leading-relaxed"
        >
          <strong className="text-[#141414] font-semibold">For students:</strong> realistic, role-adaptive technical and behavioral rounds with line-by-line STAR feedback that eliminates interview anxiety. 
          <br className="hidden sm:inline" />
          <strong className="text-[#141414] font-semibold ml-1">For placement directors:</strong> an autonomous AI employee in your messenger who triggers cohort drills, audits readiness, and shortlists talent with single natural-language prompts.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-16"
        >
          <Link
            href="/dashboard/interview/new"
            className="btn-grain-primary text-sm py-3 px-6 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98]"
          >
            <span>Launch Student Simulator</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href="#agent-simulator"
            className="btn-grain-secondary text-sm py-3 px-6 active:scale-[0.98]"
          >
            <Terminal size={15} className="text-[#009959]" />
            <span>See Agent in Slack & WhatsApp</span>
          </a>
        </motion.div>

        {/* Social Proof & Trust Metrics Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="pt-8 border-t border-[#e6e6e6] grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-4xl mx-auto"
        >
          <div className="space-y-1">
            <span className="text-2xl font-bold font-mono text-[#141414] block">100k+</span>
            <span className="text-xs text-[#707070] font-sans">AI Mock Rounds Conducted</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold font-mono text-[#009959] block">87.4%</span>
            <span className="text-xs text-[#707070] font-sans">First-Round Pass Rate</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold font-mono text-[#141414] block">1-Prompt</span>
            <span className="text-xs text-[#707070] font-sans">Cohort Campaign Orchestration</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-bold font-mono text-[#141414] block">0 Portals</span>
            <span className="text-xs text-[#707070] font-sans">Operates in Slack & WhatsApp</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
