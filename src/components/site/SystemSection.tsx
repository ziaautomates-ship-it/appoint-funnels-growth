import { Bot, Megaphone, Route } from "lucide-react";
import { Display, Reveal, SectionLabel } from "./primitives";

const cards = [
  {
    icon: Megaphone,
    title: "Meta Ads",
    text: "Generate qualified leads consistently.",
  },
  {
    icon: Route,
    title: "Funnels",
    text: "Convert more visitors into booked appointments.",
  },
  {
    icon: Bot,
    title: "AI Automation",
    text: "Follow up instantly and increase show rates.",
  },
];

export default function SystemSection() {
  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <SectionLabel>One proven system</SectionLabel>
          <Display className="mt-6">One Proven System</Display>
          <p className="mt-6 text-lg text-muted-foreground">
            Three Growth Paths.
            <br />
            One Predictable Appointment Machine.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12}>
              <article className="group relative h-full overflow-hidden rounded-[1.75rem] border border-border bg-surface/60 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[var(--glow-brand)]">
                <div
                  aria-hidden
                  className="absolute -top-24 -right-24 h-52 w-52 rounded-full bg-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="display-xl relative mt-8 text-3xl">{c.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {c.text}
                </p>
                <span className="relative mt-8 block h-px w-full bg-border">
                  <span className="block h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                </span>
                <span className="relative mt-4 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  0{i + 1}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}