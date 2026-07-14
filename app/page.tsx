import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features-section";
import { HighlightsSection } from "@/components/landing/highlights-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CommunitiesSection } from "@/components/landing/communities-section";
import { ReviewsSection } from "@/components/landing/reviews-section";
import { StatsSection } from "@/components/landing/stats-section";
import { getFeaturedReviews } from "@/lib/data/landing";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default async function LandingPage() {
  const reviews = await getFeaturedReviews();

  return (
    <main className="flex w-full flex-col">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HighlightsSection />
      <HowItWorksSection />
      <CommunitiesSection />
      <ReviewsSection reviews={reviews} />
      <StatsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
