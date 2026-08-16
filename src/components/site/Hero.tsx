import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { useRef } from "react";
import { Btn, Counter, SectionLabel } from "./primitives";

const stats = [
  { value: 1.5, prefix: "$", suffix: "M", decimals: 1, label: "Revenue generated" },
  { value: 600, suffix: "+", label: "Qualified appointments" },
  { value: 4, suffix: "X", label: "Average ROAS" },
  { value: 87, suffix: "%", label: "Show rate" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative isolate overflow-hidden pt-36 pb-24 lg:pt-48">
      {/* animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
        <motion.div
          animate={{ y: [0, -26, 0], rotate: [0, 12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-[12%] hidden h-20 w-20 rounded-3xl border border-primary/30 bg-primary/5 backdrop-blur-sm lg:block"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -14, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-60 right-[10%] hidden h-28 w-28 rounded-full border border-primary/25 bg-primary/5 backdrop-blur-sm lg:block"
        />
      </div>

      <motion.div style={{ y, opacity }} className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Meta Ads · Funnels · AI Automation</SectionLabel>
          </motion.div>

          <h1 className="display-xl mt-8 text-[clamp(3.25rem,12vw,10.5rem)]">
            <motion.span
              className="block whitespace-nowrap"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              Client Acquisition
            </motion.span>
            <motion.span
              className="block text-gradient-brand"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              On Autopilot
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            We help agencies, local businesses, coaches, SaaS companies, and service providers book
            qualified appointments consistently using Meta Ads, AI automation, and high-converting
            sales funnels.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Btn>
              Book Your Strategy Call
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Btn>
            <Btn href="#results" variant="secondary">
              See Case Studies
            </Btn>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </span>
            Rated 4.9/5 by 120+ growth-focused businesses
          </motion.div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-surface/60 px-6 py-8 text-center backdrop-blur-sm">
              <div className="display-xl text-4xl text-primary sm:text-5xl">
                <Counter
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  decimals={s.decimals}
                />
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}