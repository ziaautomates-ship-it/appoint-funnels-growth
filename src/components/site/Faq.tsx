import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Display, Reveal, SectionLabel } from "./primitives";

const faqs = [
  {
    q: "How long before we see results?",
    a: "Most clients see the first qualified appointments within 7–14 days of launch. Predictable, compounding volume typically lands in month two once creative and audience data mature.",
  },
  {
    q: "Who is this for?",
    a: "Agencies, coaches, consultants, local businesses, home services, SaaS companies and ecommerce brands with an offer that already converts on sales calls.",
  },
  {
    q: "Do you guarantee appointments?",
    a: "We work to a clear appointment target agreed before launch, and we keep optimising until it is hit. What we guarantee is transparency: you see every metric, every week.",
  },
  {
    q: "How much ad budget do I need?",
    a: "We recommend a minimum of $2,000/month in ad spend to gather data quickly. Higher budgets simply accelerate learning and volume.",
  },
  {
    q: "How do we get started?",
    a: "Book a free strategy call. We audit your offer and funnel, map the appointment system, and give you the plan whether or not you work with us.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <Reveal>
          <SectionLabel>FAQ</SectionLabel>
          <Display className="mt-6">Questions, Answered</Display>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Still unsure? Book a call and we will answer everything in plain language.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="mb-3 overflow-hidden rounded-2xl border border-border bg-surface/60 px-6 backdrop-blur-sm transition-colors data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}