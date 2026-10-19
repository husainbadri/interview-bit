"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

type FooterLinks = Record<string, { label: string; href: string; badge?: string }[]>;

const footerLinks: FooterLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#howitworks" },
    { label: "Question Library", href: "/dashboard/questions" },
    { label: "Practice Drill", href: "/dashboard/interview/new" },
  ],
  Platform: [
    { label: "Agentic Simulation", href: "/agentic" },
    { label: "STAR Diagnostics", href: "/dashboard" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Evaluation Rubrics", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "System Status", href: "#", badge: "OPERATIONAL" },
  ],
};

export default function Footer() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated";
  const ctaHref = isSignedIn ? "/dashboard" : "/login?callbackUrl=/dashboard";

  return (
    <footer className="bg-[#fafafa] border-t border-[#e6e6e6]">
      {/* Callout Banner — 10px Radius Card on #fafafa */}
      <div className="max-w-[1200px] mx-auto px-6 py-20 border-b border-[#e6e6e6]">
        <div className="card-grain p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#009959] mb-2 font-mono">
              DIRECT ACCESS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#141414] tracking-tight mb-2 font-sans">
              Calibrate your interview readiness today.
            </h2>
            <p className="text-[15px] text-[#545454] max-w-xl font-sans">
              Join thousands of candidates who practice with AI-generated drills and receive instant STAR diagnostic reports.
            </p>
          </div>

          <Link href={ctaHref} className="btn-grain-primary text-[14px] py-3 px-6 whitespace-nowrap">
            <span>Start Practice Free</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-[10px] bg-[#141414] text-[#fafafa] flex items-center justify-center font-semibold text-sm select-none">
                C
              </div>
              <span className="font-sans font-semibold text-[16px] tracking-[-0.02em] text-[#141414]">
                Campus OS
              </span>
            </Link>
            <p className="text-[14px] text-[#545454] leading-relaxed max-w-sm mb-4 font-sans">
              The quiet, near-monochrome productivity canvas for mock interviews, rubric evaluations, and career calibration.
            </p>
            <a
              href="mailto:support@campusos.com"
              className="text-xs font-mono text-[#707070] hover:text-[#009959] transition-colors"
            >
              support@campusos.com
            </a>
          </div>

          {/* Nav Categories */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#707070] mb-4 font-mono">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-[#545454] hover:text-[#141414] transition-colors inline-flex items-center gap-2 font-sans"
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="text-[10px] font-mono text-[#009959] bg-[#009959]/10 px-1.5 py-0.5 rounded-[4px]">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Utility Bar */}
        <div className="mt-16 pt-8 border-t border-[#e6e6e6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707070] font-mono">
          <p>© {new Date().getFullYear()} Campus OS. All rights reserved.</p>

          <div className="flex items-center gap-6 font-sans">
            <button className="hover:text-[#141414] cursor-pointer bg-transparent border-none p-0 text-xs text-[#707070]">
              Cookie Settings
            </button>
            <span>Powered by Next.js & Gemini 1.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
