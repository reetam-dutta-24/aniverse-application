import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { HighlightsSection } from "@/components/landing/highlights-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CommunitiesSection } from "@/components/landing/communities-section";
import { StatsSection } from "@/components/landing/stats-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="flex w-full flex-col">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HighlightsSection />
      <HowItWorksSection />
      <CommunitiesSection />
      <StatsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
