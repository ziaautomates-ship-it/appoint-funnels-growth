import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Chatbot from "@/components/site/Chatbot";
import { Display, SectionLabel } from "@/components/site/primitives";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Appoint Funnels" },
      { name: "description", content: "Read how Appoint Funnels handles customer information, examples, and dashboard demonstrations." },
      { property: "og:title", content: "Privacy Policy — Appoint Funnels" },
      { property: "og:description", content: "How Appoint Funnels handles customer information and demonstration data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-36 lg:px-8 lg:pt-44">
        <SectionLabel>Privacy</SectionLabel>
        <Display as="h1" className="mt-6">Privacy Policy.</Display>
        <p className="mt-7 text-sm text-muted-foreground">Last updated: September 12, 2026</p>
        <div className="mt-12 space-y-10 text-base leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">Dashboard and meeting demonstrations</h2>
            <p className="mt-3">
              Statistics shown on dashboards during meetings are illustrative examples and should not be treated as live, verified performance data. Some dates shown in those demonstrations may be inaccurate.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Customer privacy</h2>
            <p className="mt-3">
              Customer names may be changed, anonymized, or replaced in dashboards, presentations, and case-study materials to protect customer privacy.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Information you share</h2>
            <p className="mt-3">
              We use information submitted through our forms and calculators to respond to enquiries, prepare proposals, and provide requested services. We do not sell your personal information.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-3">Questions about this policy can be sent to hello@appointfunnels.com.</p>
          </section>
        </div>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}