import case1 from "@/assets/case-1.jpg";
import case2 from "@/assets/case-2.jpg";
import case3 from "@/assets/case-3.jpg";
import { ArrowUpRight } from "lucide-react";
import { Display, Reveal, SectionLabel } from "./primitives";

const cases = [
  {
    img: case1,
    tag: "Marketing agency",
    metric: "$1.5M",
    metricLabel: "Revenue generated",
    sub: "4X ROAS across 9 months",
    text: "Rebuilt the acquisition engine around one offer, one funnel, and automated follow-up.",
  },
  {
    img: case2,
    tag: "Home services",
    metric: "600+",
    metricLabel: "Qualified appointments",
    sub: "12,000+ leads generated",
    text: "Paid traffic feeding a qualification funnel that filters before it books.",
  },
  {
    img: case3,
    tag: "Coaching business",
    metric: "87%",
    metricLabel: "Show rate",
    sub: "AI reminders across SMS + email",
    text: "Instant speed-to-lead replies plus multi-touch reminders killed no-shows.",
  },
];

export default function ResultsSection() {
  return (
    <section id="results" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-4xl">
          <SectionLabel>Results</SectionLabel>
          <Display className="mt-6 text-6xl sm:text-7xl lg:text-8xl xl:text-9xl">
            Client Acquisition
            <br />
            <span className="text-gradient-brand">Solved.</span>
          </Display>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {cases.map((c, i) => (
            <Reveal key={c.tag} delay={i * 0.12}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[var(--glow-brand)]">
                <div className="relative aspect-16/10 overflow-hidden">
                  <img
                    src={c.img}
                    alt={`${c.tag} case study visual`}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                    {c.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <div className="display-xl text-5xl text-primary">{c.metric}</div>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {c.metricLabel}
                  </p>
                  <p className="mt-4 text-sm font-medium">{c.sub}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.text}
                  </p>
                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    View case study
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}