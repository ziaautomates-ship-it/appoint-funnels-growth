import { motion } from "framer-motion";
import {
  CalendarCheck,
  Filter,
  LayoutTemplate,
  MousePointerClick,
  PhoneCall,
  TrendingUp,
} from "lucide-react";
import { Display, Reveal, SectionLabel } from "./primitives";

const steps = [
  { icon: MousePointerClick, title: "Traffic", text: "Meta Ads put your offer in front of buyers." },
  { icon: LayoutTemplate, title: "Landing Page", text: "A focused page built to convert." },
  { icon: Filter, title: "Qualification", text: "Smart forms filter out tyre-kickers." },
  { icon: CalendarCheck, title: "Booking", text: "Calendar slots fill automatically." },
  { icon: PhoneCall, title: "Sales Call", text: "AI reminders lift show rates." },
  { icon: TrendingUp, title: "Revenue", text: "Predictable, trackable growth." },
];

export default function StrategySection() {
  return (
    <section id="process" className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <SectionLabel>Our strategy</SectionLabel>
          <Display className="mt-6">Our Strategy</Display>
          <p className="mt-6 text-lg text-muted-foreground">
            Six steps. Zero guesswork. Every stage measured.
          </p>
        </Reveal>

        <div className="relative mt-16 lg:mt-24">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[27px] w-px bg-border lg:left-1/2"
          />
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
            className="absolute top-0 bottom-0 left-[27px] w-px bg-gradient-to-b from-primary via-primary/60 to-transparent lg:left-1/2"
          />

          <ol className="space-y-10 lg:space-y-16">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <Reveal
                  delay={0.05}
                  y={40}
                  className={
                    i % 2 === 0
                      ? "lg:grid lg:grid-cols-2 lg:gap-16"
                      : "lg:grid lg:grid-cols-2 lg:gap-16"
                  }
                >
                  <div className={i % 2 === 0 ? "lg:pr-4" : "lg:col-start-2 lg:pl-4"}>
                    <div className="group relative ml-16 rounded-[1.5rem] border border-border bg-surface/60 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--glow-brand)] lg:ml-0">
                      <span
                        aria-hidden
                        className="absolute top-8 -left-16 grid h-14 w-14 place-items-center rounded-full border border-primary/40 bg-background text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground lg:hidden"
                      >
                        <s.icon className="h-5 w-5" />
                      </span>
                      <p className="text-xs uppercase tracking-[0.24em] text-primary">
                        Step {i + 1}
                      </p>
                      <h3 className="display-xl mt-3 text-3xl sm:text-4xl">{s.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
                <span
                  aria-hidden
                  className="absolute top-10 left-1/2 hidden h-14 w-14 -translate-x-1/2 place-items-center rounded-full border border-primary/40 bg-background text-primary lg:grid"
                >
                  <s.icon className="h-5 w-5" />
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}