"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight } from "lucide-react";

const questionCategories = [
  {
    role: "Software Engineer",
    level: "Senior Level",
    sample: "Explain the difference between microservices and monolithic architecture. When would you choose one over the other?",
    domain: "SYSTEM ARCHITECTURE",
    tags: ["Distributed Systems", "Latency"],
  },
  {
    role: "Product Manager",
    level: "Mid-level",
    sample: "How do you prioritize features when you have limited engineering resources and multiple executive stakeholder requests?",
    domain: "PRODUCT STRATEGY",
    tags: ["RICE Framework", "Stakeholders"],
  },
  {
    role: "Data Scientist",
    level: "Junior / Associate",
    sample: "Walk me through how you would approach building a recommendation system from scratch with sparse telemetry data.",
    domain: "MACHINE LEARNING",
    tags: ["Cold Start", "Matrix Factorization"],
  },
  {
    role: "Marketing Manager",
    level: "Senior Level",
    sample: "Describe a multi-channel campaign you led. What metrics did you track and how did you measure incremental lift?",
    domain: "GROWTH ATTRIBUTION",
    tags: ["CAC/LTV", "Cohort Analysis"],
  },
  {
    role: "UX Designer",
    level: "Mid-level",
    sample: "How do you balance user needs with business requirements when they seem to conflict directly on monetization funnels?",
    domain: "PRODUCT DESIGN",
    tags: ["User Testing", "Conversion"],
  },
  {
    role: "HR / Talent Partner",
    level: "Senior Level",
    sample: "What strategies have you used to improve employee retention in a competitive, remote-first market during restructuring?",
    domain: "PEOPLE OPERATIONS",
    tags: ["Retention Index", "Culture"],
  },
];

export default function QuestionsPreviewSection() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const practiceHref = isSignedIn ? "/dashboard/interview/new" : "/login?callbackUrl=/dashboard/interview/new";

  return (
    <section id="question" className="py-24 px-6 bg-[#fafafa] border-b border-[#e6e6e6]">
      <div className="max-w-[1200px] mx-auto">
        {/* Major Section Display Heading — Poppins 600 at 38px */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-poppins-display mb-4">
            Curated repository of interview scenarios.
          </h2>
          <p className="text-[16px] text-[#545454] leading-relaxed font-sans">
            Examine representative interview questions calibrated across functional roles and difficulty tiers.
          </p>
        </div>

        {/* Question Cards Grid — 10px Radius, #fafafa Surface */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionCategories.map((item) => (
            <div
              key={item.role}
              className="card-grain flex flex-col justify-between hover:border-[#d6d6d6] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[11px] text-[#707070] uppercase">
                    {item.domain}
                  </span>
                  <span className="text-xs font-medium text-[#545454] bg-[#f0f0f0] px-2 py-0.5 rounded-[10px]">
                    {item.level}
                  </span>
                </div>

                <h3 className="text-[17px] font-semibold text-[#141414] tracking-tight mb-2 font-sans">
                  {item.role}
                </h3>

                <p className="text-[14px] text-[#545454] leading-[1.6] mb-6 font-sans italic">
                  &ldquo;{item.sample}&rdquo;
                </p>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[12px] font-medium text-[#545454] bg-[#f0f0f0] border border-[#e6e6e6] px-2.5 py-1 rounded-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#e6e6e6] flex items-center justify-between">
                  <Link
                    href={practiceHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#009959] hover:underline"
                  >
                    <span>Practice drill</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <span className="text-[11px] font-mono text-[#707070]">
                    GEMINI-EVAL
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
