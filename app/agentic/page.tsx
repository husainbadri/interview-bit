import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import AgenticHeroSection from "@/components/agentic/AgenticHeroSection";
import AgentSlackSimulator from "@/components/agentic/AgentSlackSimulator";
import StudentExperienceSection from "@/components/agentic/StudentExperienceSection";
import BentoGridSection from "@/components/agentic/BentoGridSection";
import InteractiveQuestionPreview from "@/components/agentic/InteractiveQuestionPreview";
import ComparisonSection from "@/components/agentic/ComparisonSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Agentic Mock Interview System | Campus OS",
  description:
    "An AI mock interview system for students, operated by an autonomous Agentic Employee right from Slack, Teams, and WhatsApp for placement directors and university managers.",
  openGraph: {
    title: "Agentic Mock Interview System | Campus OS",
    description:
      "For students: realistic role-adaptive interviews with STAR feedback. For managers: an autonomous AI colleague running cohort drills from Slack.",
  },
};

export default function AgenticLandingPage() {
  return (
    <main className="bg-[#fafafa] text-[#141414] min-h-screen selection:bg-[#009959] selection:text-[#fafafa]">
      {/* Universal Navigation */}
      <Navbar />

      {/* Hero Section */}
      <AgenticHeroSection />

      {/* The MOAT: The Agentic Employee in Slack/WhatsApp */}
      <div id="agent-simulator">
        <AgentSlackSimulator />
      </div>

      {/* The Student Experience Walkthrough */}
      <StudentExperienceSection />

      {/* Enterprise Infrastructure & Bento Grid */}
      <BentoGridSection />

      {/* Live Interactive Evaluation Widget */}
      <InteractiveQuestionPreview />

      {/* Legacy Portals vs Agentic System */}
      <ComparisonSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Universal Footer */}
      <Footer />
    </main>
  );
}
