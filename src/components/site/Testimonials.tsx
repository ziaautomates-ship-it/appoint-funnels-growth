import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Star } from "lucide-react";
import { useState } from "react";
import { Display, Reveal, SectionLabel } from "./primitives";

const testimonials = [
  {
    quote:
      "We went from chasing referrals to a calendar that fills itself. 40 qualified calls in the first 30 days.",
    name: "Daniel R.",
    business: "Northline Roofing",
    initials: "DR",
    stat: "40 calls / 30 days",
  },
  {
    quote:
      "The follow-up automation alone paid for the retainer. Show rates jumped from 55% to 88%.",
    name: "Priya M.",
    business: "Elevate Coaching Co.",
    initials: "PM",
    stat: "88% show rate",
  },
  {
    quote:
      "Clean funnels, sharp creative, honest reporting. First agency that actually understood our offer.",
    name: "Marcus T.",
    business: "Verta SaaS",
    initials: "MT",
    stat: "4.2X ROAS",
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = testimonials[index]!;

  const go = (dir: number) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <SectionLabel>Testimonials</SectionLabel>
          <Display className="mt-6">What Clients Say</Display>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-border bg-surface/60 p-8 backdrop-blur-sm sm:p-12">
              <div className="flex text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8"
                >
                  <p className="text-2xl leading-snug font-medium sm:text-3xl">
                    “{active.quote}”
                  </p>
                  <footer className="mt-10 flex flex-wrap items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                      {active.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{active.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        {active.business}
                      </span>
                    </span>
                    <span className="ml-auto rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                      {active.stat}
                    </span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>

              <div className="mt-10 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => go(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => go(1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="ml-2 flex gap-1.5" aria-hidden>
                  {testimonials.map((t, i) => (
                    <span
                      key={t.name}
                      className={
                        i === index
                          ? "h-1.5 w-8 rounded-full bg-primary transition-all"
                          : "h-1.5 w-3 rounded-full bg-border transition-all"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={0.1}>
              <div className="group relative flex aspect-16/10 items-end overflow-hidden rounded-[1.75rem] border border-border bg-surface-2/60">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_65%)]"
                />
                <button
                  type="button"
                  aria-label="Play video testimonial"
                  className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-110"
                >
                  <Play className="h-6 w-6 fill-current" />
                </button>
                <p className="relative p-6 text-sm text-muted-foreground">
                  Video testimonial — Northline Roofing
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="rounded-[1.75rem] border border-border bg-surface/60 p-7 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Google Reviews</p>
                    <p className="text-xs text-muted-foreground">Verified client feedback</p>
                  </div>
                  <p className="display-xl text-4xl text-primary">4.9</p>
                </div>
                <div className="mt-5 flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-border">
                  {[
                    ["120+", "Reviews"],
                    ["98%", "Retention"],
                    ["11", "Industries"],
                  ].map(([v, l]) => (
                    <div key={l} className="bg-surface px-3 py-4 text-center">
                      <p className="display-xl text-2xl">{v}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}