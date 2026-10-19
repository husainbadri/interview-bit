import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import QuestionsPreviewSection from "@/components/landing/QuestionsPreviewSection";
import MissionSection from "@/components/landing/MissionSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#f6f5f4] text-[#000000] min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <QuestionsPreviewSection />
      <MissionSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
