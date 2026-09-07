import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/site/Navbar";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import ThemeSwitcher from "@/components/site/ThemeSwitcher";
import CalculatorApp from "@/components/calculator/CalculatorApp";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Growth Calculator — Appoint Funnels" },
      {
        name: "description",
        content:
          "Price a cold email, cold SMS, Meta Ads or call centre campaign, see guaranteed appointments, clients, ROI and timeline, then send the proposal.",
      },
      { property: "og:title", content: "Growth Calculator — Appoint Funnels" },
      {
        property: "og:description",
        content:
          "Build a personalised client acquisition plan with transparent investment, guarantees and ROI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <CalculatorApp />
        <Contact />
      </main>
      <Footer />
      <ThemeSwitcher />
      <Toaster />
    </div>
  );
}
