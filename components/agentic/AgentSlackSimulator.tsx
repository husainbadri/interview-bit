"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Bot,
  AlertTriangle,
  Users,
  Briefcase,
  Hash,
  Clock,
  Check,
} from "lucide-react";

interface Scenario {
  id: string;
  label: string;
  icon: any;
  userPrompt: string;
  agentResponse: {
    title: string;
    summary: string;
    metrics: { label: string; value: string; status?: "positive" | "warning" | "neutral" }[];
    details: {
      type: "list" | "table";
      items: { name: string; score: number; flag: string; action: string }[];
    };
    agentActions: string[];
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "readiness-audit",
    label: "Diagnose Cohort Weak Spots",
    icon: AlertTriangle,
    userPrompt:
      "@CampusAgent which 15 students in the 2026 CS cohort need immediate practice before Friday's Fintech drive?",
    agentResponse: {
      title: "Fintech Readiness Diagnostic: 2026 CS Cohort",
      summary:
        "Audited 142 students against Stripe & Goldman Sachs interview rubrics. 15 candidates are currently below the 75% target threshold, primarily struggling with Distributed Concurrency and Eventual Consistency.",
      metrics: [
        { label: "Cohort Avg Readiness", value: "79.2%", status: "positive" },
        { label: "Flagged Below Target", value: "15 Students", status: "warning" },
        { label: "Critical Weak Spot", value: "Distributed DBs", status: "neutral" },
      ],
      details: {
        type: "table",
        items: [
          { name: "Aarav Sharma", score: 64, flag: "Concurrency deadlocks", action: "Assigned Drill" },
          { name: "Rohan Varma", score: 67, flag: "Transaction isolation", action: "Assigned Drill" },
          { name: "Meera Nair", score: 69, flag: "Rate limiting design", action: "Assigned Drill" },
          { name: "Siddharth Rao", score: 71, flag: "Idempotency handling", action: "Assigned Drill" },
        ],
      },
      agentActions: [
        "Sent customized 30-min Concurrency drills via WhatsApp",
        "Scheduled automated reminder for Thursday 6:00 PM",
        "Synced readiness logs to Placement Cell spreadsheet",
      ],
    },
  },
  {
    id: "run-campaign",
    label: "Deploy Mock Campaign in 1-Click",
    icon: Users,
    userPrompt:
      "@CampusAgent assign a 45-min System Design & Microservices mock interview to all Backend Track students.",
    agentResponse: {
      title: "System Design Mock Campaign Activated",
      summary:
        "Generated 88 role-adaptive mock sessions for Backend Track candidates. Calibrated difficulty based on each student's previous answers with dynamic follow-ups.",
      metrics: [
        { label: "Sessions Created", value: "88 Mock Rounds", status: "positive" },
        { label: "Deadline Set", value: "Tomorrow 11:59 PM", status: "neutral" },
        { label: "AI Evaluator", value: "Active (Gemini 1.5)", status: "positive" },
      ],
      details: {
        type: "list",
        items: [
          { name: "Kafka vs RabbitMQ messaging", score: 92, flag: "High relevance", action: "Included" },
          { name: "Database sharding strategies", score: 88, flag: "Adaptive follow-up", action: "Included" },
          { name: "Graceful degradation under load", score: 85, flag: "STAR evaluation", action: "Included" },
        ],
      },
      agentActions: [
        "Broadcasted personalized magic links to 88 student dashboards",
        "Enabled automatic audio transcription and STAR analysis",
        "Alerted department head with campaign tracking dashboard",
      ],
    },
  },
  {
    id: "shortlist-candidates",
    label: "Instant Recruiter Shortlist",
    icon: Briefcase,
    userPrompt:
      "@CampusAgent give me the top 5 placement-ready candidates for the Senior Frontend Engineer campus visit.",
    agentResponse: {
      title: "Top 5 Placement-Ready Frontend Candidates",
      summary:
        "Ranked candidates by technical accuracy, architectural explanations, communication clarity (STAR score), and problem-solving speed.",
      metrics: [
        { label: "Total Evaluated", value: "96 Candidates", status: "neutral" },
        { label: "Top Tier (Score >90%)", value: "11 Candidates", status: "positive" },
        { label: "Verification Level", value: "Proctored AI", status: "positive" },
      ],
      details: {
        type: "table",
        items: [
          { name: "Priya Sundaram", score: 96, flag: "Exceptional SSR/React 19 knowledge", action: "Dossier Ready" },
          { name: "Kabir Mehta", score: 94, flag: "Clean state architecture & testing", action: "Dossier Ready" },
          { name: "Ananya Joshi", score: 93, flag: "High-performance web vitals mastery", action: "Dossier Ready" },
          { name: "Devansh Patel", score: 91, flag: "Micro-frontend modular design", action: "Dossier Ready" },
        ],
      },
      agentActions: [
        "Compiled verified PDF Candidate Dossiers with video answer clips",
        "Generated shareable recruiter review link with password protection",
        "Emailed recruiter preview package to placement director",
      ],
    },
  },
];

export default function AgentSlackSimulator() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [channel, setChannel] = useState<"slack" | "whatsapp" | "teams">("slack");
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectScenario = (scenario: Scenario) => {
    if (scenario.id === activeScenario.id) return;
    setIsTyping(true);
    setActiveScenario(scenario);
    setTimeout(() => {
      setIsTyping(false);
    }, 350);
  };

  return (
    <section className="relative py-24 bg-[#fafafa] border-b border-[#e6e6e6] overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-[#f0f0f0] border border-[#e6e6e6] rounded-[10px] px-3.5 py-1 mb-4 text-xs font-medium text-[#545454] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#009959]" />
            <span>The Architectural Moat</span>
          </div>
          <h2 className="font-poppins-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141414] tracking-tight mb-4">
            Zero Dashboard Fatigue. <br />
            <span className="text-[#009959]">An Agentic Colleague in Your Messenger.</span>
          </h2>
          <p className="text-[#545454] text-base sm:text-[16px] leading-relaxed">
            Placement directors and department heads don&apos;t have time to navigate 20 tabs of spreadsheets. 
            Talk directly to your Campus AI Colleague in Slack, Teams, or WhatsApp to audit cohorts, assign drills, and shortlist students in seconds.
          </p>
        </div>

        {/* Interactive Command Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
          {SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = scenario.id === activeScenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#009959] text-[#fafafa] shadow-xs"
                    : "bg-[#f0f0f0] text-[#545454] border border-[#e6e6e6] hover:bg-[#e6e6e6] hover:text-[#141414]"
                }`}
              >
                <Icon size={14} className={isActive ? "text-[#fafafa]" : "text-[#009959]"} />
                {scenario.label}
              </button>
            );
          })}
        </div>

        {/* Messaging Container — 14px Grain Frame */}
        <div className="card-grain rounded-[14px] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] overflow-hidden bg-[#ffffff]">
          {/* Top Bar / Channel Selector */}
          <div className="bg-[#fafafa] border-b border-[#e6e6e6] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6e6e6] border border-[#d6d6d6]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6e6e6] border border-[#d6d6d6]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e6e6e6] border border-[#d6d6d6]" />
              </div>
              <div className="h-4 w-px bg-[#e6e6e6] mx-1" />
              <div className="flex items-center gap-2 text-xs font-mono text-[#545454]">
                <Hash size={14} className="text-[#009959]" />
                <span className="font-semibold text-[#141414]">placement-ops-agent</span>
                <span className="text-[#707070] hidden sm:inline">| Campus OS Workforce</span>
              </div>
            </div>

            {/* Platform toggles */}
            <div className="flex items-center gap-1 bg-[#f0f0f0] p-1 rounded-[10px] border border-[#e6e6e6] text-xs font-medium">
              <button
                onClick={() => setChannel("slack")}
                className={`px-3 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  channel === "slack" ? "bg-[#009959] text-white shadow-xs" : "text-[#545454] hover:text-[#141414]"
                }`}
              >
                Slack
              </button>
              <button
                onClick={() => setChannel("whatsapp")}
                className={`px-3 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  channel === "whatsapp" ? "bg-[#009959] text-white shadow-xs" : "text-[#545454] hover:text-[#141414]"
                }`}
              >
                WhatsApp
              </button>
              <button
                onClick={() => setChannel("teams")}
                className={`px-3 py-1 rounded-[8px] transition-colors cursor-pointer ${
                  channel === "teams" ? "bg-[#009959] text-white shadow-xs" : "text-[#545454] hover:text-[#141414]"
                }`}
              >
                Teams
              </button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="p-6 sm:p-8 space-y-6 min-h-[460px] bg-[#fafafa]">
            {/* User Message */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3.5"
            >
              <div className="w-8 h-8 rounded-[8px] bg-[#141414] text-[#fafafa] flex items-center justify-center font-bold text-xs flex-shrink-0">
                DIR
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-[#141414]">Placement Director</span>
                  <span className="text-[11px] text-[#707070] font-mono">10:42 AM</span>
                </div>
                <div className="bg-[#ffffff] border border-[#e6e6e6] rounded-[10px] p-3.5 text-sm text-[#141414] shadow-xs">
                  {activeScenario.userPrompt}
                </div>
              </div>
            </motion.div>

            {/* Agent Response */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3.5"
            >
              <div className="w-8 h-8 rounded-[8px] bg-[#009959] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="flex-1 max-w-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#141414]">Campus Agent</span>
                  <span className="bg-[#009959]/10 text-[#009959] text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-[6px]">
                    APP
                  </span>
                  <span className="text-[11px] text-[#707070] font-mono">10:42 AM</span>
                </div>

                {isTyping ? (
                  <div className="bg-[#ffffff] border border-[#e6e6e6] rounded-[10px] p-4 text-xs text-[#707070] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#009959] animate-ping" />
                    Querying placement database and synthesizing rubric evaluations...
                  </div>
                ) : (
                  <div className="bg-[#ffffff] border border-[#e6e6e6] rounded-[10px] p-5 sm:p-6 space-y-4 shadow-xs">
                    <div>
                      <h4 className="font-semibold text-base text-[#141414] mb-1">
                        {activeScenario.agentResponse.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#545454] leading-relaxed">
                        {activeScenario.agentResponse.summary}
                      </p>
                    </div>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {activeScenario.agentResponse.metrics.map((m, idx) => (
                        <div key={idx} className="bg-[#fafafa] border border-[#e6e6e6] p-3 rounded-[8px] text-center">
                          <span className="text-[10px] text-[#707070] font-mono uppercase block mb-1">
                            {m.label}
                          </span>
                          <span
                            className={`text-sm sm:text-base font-bold font-mono ${
                              m.status === "positive"
                                ? "text-[#009959]"
                                : m.status === "warning"
                                ? "text-[#b45309]"
                                : "text-[#141414]"
                            }`}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Table / List View */}
                    <div className="border border-[#e6e6e6] rounded-[8px] overflow-hidden text-xs">
                      <div className="bg-[#fafafa] px-3.5 py-2 font-mono font-semibold text-[#707070] border-b border-[#e6e6e6] flex justify-between">
                        <span>CANDIDATE & COHORT FOCUS</span>
                        <span>DIAGNOSTIC STATUS</span>
                      </div>
                      <div className="divide-y divide-[#e6e6e6]">
                        {activeScenario.agentResponse.details.items.map((item, idx) => (
                          <div key={idx} className="px-3.5 py-2.5 flex items-center justify-between bg-[#ffffff]">
                            <div>
                              <span className="font-semibold text-[#141414]">{item.name}</span>
                              <span className="text-[#707070] ml-2 font-mono">({item.flag})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-[#141414]">{item.score}%</span>
                              <span className="bg-[#009959]/10 text-[#009959] text-[10px] font-semibold px-2 py-0.5 rounded-[6px]">
                                {item.action}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Agent Actions Checklist */}
                    <div className="pt-2 border-t border-[#e6e6e6]">
                      <span className="text-[11px] font-mono uppercase text-[#707070] block mb-2">
                        AUTOMATED ACTIONS EXECUTED:
                      </span>
                      <div className="space-y-1.5">
                        {activeScenario.agentResponse.agentActions.map((action, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#545454]">
                            <Check size={13} className="text-[#009959] flex-shrink-0" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
