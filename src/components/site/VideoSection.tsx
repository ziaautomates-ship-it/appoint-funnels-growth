import { motion } from "framer-motion";
import { Play } from "lucide-react";
import poster from "@/assets/video-poster.jpg";
import { Display, Reveal, SectionLabel } from "./primitives";

export default function VideoSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.35fr_1fr] lg:px-8">
        <Reveal>
          <div className="group relative overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-soft)]">
            <img
              src={poster}
              alt="Appoint Funnels team reviewing appointment campaign performance"
              width={1600}
              height={912}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute inset-0 grid place-items-center">
              <motion.button
                type="button"
                aria-label="Play overview video"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="relative grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-brand)] sm:h-24 sm:w-24"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                <Play className="relative h-7 w-7 fill-current" />
              </motion.button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <SectionLabel>Watch the walkthrough</SectionLabel>
          <Display className="mt-6 text-4xl sm:text-5xl lg:text-6xl">
            See the machine in motion
          </Display>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Watch how Appoint Funnels helps businesses generate qualified appointments consistently.
          </p>
          <ul className="mt-8 space-y-4">
            {["3 minute overview", "Real campaign dashboards", "No fluff, just the system"].map(
              (t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="h-px w-8 bg-primary" />
                  {t}
                </li>
              ),
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}