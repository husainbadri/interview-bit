"use client";

import { motion } from "framer-motion";

export default function MissionSection() {
  return (
    <section className="py-24 px-6 bg-[#fafafa] border-b border-[#e6e6e6]">
      <div className="max-w-[1000px] mx-auto text-center">
        <div className="mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#707070] block mb-3">
            INSTITUTIONAL PURPOSE
          </span>
          <h2 className="font-poppins-display mb-4">
            Democratizing diagnostic interview coaching.
          </h2>
        </div>

        <div className="card-grain p-8 sm:p-12 text-left relative bg-[#fafafa]">
          <p className="text-[17px] sm:text-[20px] leading-[1.65] text-[#141414] font-normal font-sans mb-8">
            &ldquo;At <span className="font-semibold text-[#009959]">Campus OS</span>, we view interview preparation as an empirical discipline. By coupling generative reasoning with structured STAR rubrics, we equip candidates with the articulate clarity and structural rigor required for premier technical, product, and leadership placements.&rdquo;
          </p>

          <div className="pt-6 border-t border-[#e6e6e6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#707070]">
            <span>CAMPUS OS RESEARCH & DEVELOPMENT</span>
            <span className="font-sans text-[#009959] font-medium">
              Calibrated with 80+ Placement Directors
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
