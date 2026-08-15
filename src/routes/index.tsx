import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import VideoSection from "@/components/site/VideoSection";
import SystemSection from "@/components/site/SystemSection";
import StrategySection from "@/components/site/StrategySection";
import ResultsSection from "@/components/site/ResultsSection";
import IndustriesSection from "@/components/site/IndustriesSection";
import Testimonials from "@/components/site/Testimonials";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import ThemeSwitcher from "@/components/site/ThemeSwitcher";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Appoint Funnels — Client Acquisition On Autopilot" },
      {
        name: "description",
        content:
          "Book qualified appointments consistently with Meta Ads, high-converting funnels, and AI follow-up automation. Free strategy call.",
      },
      { property: "og:title", content: "Appoint Funnels — Client Acquisition On Autopilot" },
      {
        property: "og:description",
        content:
          "One proven system, three growth paths: Meta Ads, funnels, and AI automation for predictable appointments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <SystemSection />
        <StrategySection />
        <ResultsSection />
        <IndustriesSection />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <ThemeSwitcher />
      <Toaster />
    </div>
  );
}
