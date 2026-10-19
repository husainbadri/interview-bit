"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "How does the AI evaluate my interview responses?",
    answer:
      "Our evaluation engine analyzes your transcript and audio responses against established industry rubrics. It assesses clarity, structure (such as STAR method usage), technical precision, and situational adaptability, delivering qualitative insights alongside quantitative scores.",
  },
  {
    question: "Is there a free tier available on Campus OS?",
    answer:
      "Yes. Every candidate can initiate up to 3 complete mock interview sessions with real-time feedback at no cost before upgrading to unlimited access.",
  },
  {
    question: "Which industries and job roles are supported?",
    answer:
      "Campus OS supports software engineering, frontend/backend development, product management, data science, machine learning, UX design, marketing, and people operations, with custom role ingestion for specialized corporate job descriptions.",
  },
  {
    question: "How accurate is the Gemini-powered feedback?",
    answer:
      "The grading model is calibrated with 10,000+ benchmark interview transcripts. Responses are scored against specific behavioral and architectural standards, achieving high consistency with experienced human interviewers.",
  },
  {
    question: "Can colleges and universities use Campus OS for cohort drills?",
    answer:
      "Yes. Placement directors and administrators can configure role difficulty, question counts, and domain focus, generating standardized practice drills for entire batches or individual students.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 bg-[#fafafa] border-b border-[#e6e6e6]">
      <div className="max-w-[1000px] mx-auto">
        {/* Major Section Display Heading — Poppins 600 at 38px */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-poppins-display mb-4">
            Frequently examined questions.
          </h2>
          <p className="text-[16px] text-[#545454] leading-relaxed font-sans">
            Common inquiries regarding platform evaluation mechanics, institutional cohorts, and grading accuracy.
          </p>
        </div>

        {/* FAQ Accordion List in a 10px Card */}
        <div className="card-grain divide-y divide-[#e6e6e6] p-0 overflow-hidden">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="p-6 transition-colors hover:bg-[#f0f0f0]/50">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-[16px] font-semibold text-[#141414] tracking-tight font-sans">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#707070] transition-transform duration-200 flex-shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-[#009959]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[14px] leading-[1.65] text-[#545454] pt-3 font-sans">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
