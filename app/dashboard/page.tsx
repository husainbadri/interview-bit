import Link from "next/link";
import { auth } from "@/auth";
import { Plus, ArrowRight } from "lucide-react";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";

const recentRoles = [
  { role: "Software Engineer", level: "Senior", domain: "SYSTEM ARCHITECTURE" },
  { role: "Product Manager", level: "Mid-level", domain: "PRODUCT STRATEGY" },
  { role: "Data Scientist", level: "Junior", domain: "MACHINE LEARNING" },
];

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="font-sans">
      {/* Welcome Header */}
      <div className="mb-10 pb-6 border-b border-[#e6e6e6] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#009959] mb-1.5 font-semibold">
            CANDIDATE WORKSPACE
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141414] tracking-tight">
            Welcome back, {user?.name || "there"}
          </h1>
          <p className="text-[#545454] text-[15px] mt-1">
            Track your interview diagnostics, review STAR rubrics, and start a new simulation drill.
          </p>
        </div>

        <Link href="/dashboard/interview/new" className="btn-grain-primary text-sm py-2.5 px-4 whitespace-nowrap shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform">
          <Plus size={15} />
          <span>New Interview Drill</span>
        </Link>
      </div>

      {/* Dynamic KPI Stats Grid — Calculates from actual completed sessions */}
      <DashboardMetrics />

      {/* Main Action Callout — 10px Radius Card with Subtle Border */}
      <div className="card-grain p-8 sm:p-10 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-[#009959]">
        <div className="max-w-2xl">
          <div className="text-xs font-mono uppercase tracking-wider text-[#009959] mb-1.5 font-semibold">
            AI SIMULATION ENGINE
          </div>
          <h2 className="text-2xl font-bold text-[#141414] tracking-tight mb-2">
            Start a calibrated mock interview drill.
          </h2>
          <p className="text-[#545454] text-[15px] leading-relaxed">
            Configure target functional role and experience level. Our model synthesizes 3 to 10 adaptive questions with live STAR rubric scoring.
          </p>
        </div>

        <Link href="/dashboard/interview/new" className="btn-grain-primary py-3 px-6 whitespace-nowrap shadow-[0px_1px_2px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-transform">
          <Plus size={16} />
          <span>Launch Session</span>
        </Link>
      </div>

      {/* Popular Roles Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#141414] tracking-tight">
            Recommended Practice Tracks
          </h2>
          <Link
            href="/dashboard/questions"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#009959] hover:underline"
          >
            <span>View all questions</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentRoles.map(({ role, level, domain }) => (
            <Link
              key={role}
              href="/dashboard/interview/new"
              className="card-grain hover:border-[#d6d6d6] transition-colors flex flex-col justify-between group p-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-[#707070]">{domain}</span>
                  <span className="text-xs font-medium text-[#545454] bg-[#f0f0f0] border border-[#e6e6e6] px-2.5 py-0.5 rounded-[10px] whitespace-nowrap shrink-0">
                    {level}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#141414] tracking-tight mb-1">
                  {role}
                </h3>
              </div>

              <div className="pt-4 mt-6 border-t border-[#e6e6e6] flex items-center justify-between text-xs font-medium text-[#545454] group-hover:text-[#009959]">
                <span>Start Drill</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          href="/dashboard/questions"
          className="card-grain hover:border-[#d6d6d6] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-semibold text-[#141414] text-[16px] mb-1">Question Library</h3>
            <p className="text-xs sm:text-sm text-[#545454]">
              Browse 500+ calibrated questions across functional tracks
            </p>
          </div>
          <ArrowRight size={16} className="text-[#707070] group-hover:text-[#009959] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/agentic"
          className="card-grain hover:border-[#d6d6d6] transition-colors flex items-center justify-between group"
        >
          <div>
            <h3 className="font-semibold text-[#141414] text-[16px] mb-1">Agentic System</h3>
            <p className="text-xs sm:text-sm text-[#545454]">
              Autonomous placement coworker for Slack, Teams & WhatsApp
            </p>
          </div>
          <ArrowRight size={16} className="text-[#707070] group-hover:text-[#009959] group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
