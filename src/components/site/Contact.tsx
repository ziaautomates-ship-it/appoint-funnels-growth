import { ArrowRight, Clock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Btn, Display, Reveal, SectionLabel } from "./primitives";

const fieldClass =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none";

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-[130px] animate-drift"
      />
      <div className="mx-auto grid max-w-7xl items-start gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <SectionLabel>Contact</SectionLabel>
          <Display className="mt-6">Let&apos;s Grow Your Business.</Display>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Ready to build a predictable client acquisition system? Book your free strategy call
            today.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              { icon: Clock, text: "30-minute call, no pitch decks" },
              { icon: ShieldCheck, text: "Custom appointment plan you can keep" },
              { icon: Mail, text: "hello@appointfunnels.com" },
            ].map((item) => (
              <li key={item.text} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 text-sm text-muted-foreground">{item.text}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.14}>
          <form
            className="rounded-[1.75rem] border border-border bg-surface/60 p-7 backdrop-blur-xl sm:p-9"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitting(true);
              setTimeout(() => {
                setSubmitting(false);
                toast.success("Request received — we'll reach out within one business day.");
                (e.target as HTMLFormElement).reset();
              }, 600);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Name
                </label>
                <input id="name" name="name" required placeholder="Jane Doe" className={fieldClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="company" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Company
                </label>
                <input id="company" name="company" placeholder="Company name" className={fieldClass} />
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="revenue" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Monthly Revenue
                </label>
                <select id="revenue" name="revenue" defaultValue="" className={fieldClass}>
                  <option value="" disabled>
                    Select range
                  </option>
                  <option>Under $10k</option>
                  <option>$10k – $50k</option>
                  <option>$50k – $250k</option>
                  <option>$250k+</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your offer and goals"
                  className={fieldClass}
                />
              </div>
            </div>

            <Btn type="submit" className="mt-7 w-full py-4 text-base">
              {submitting ? "Sending…" : "Book Strategy Call"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Btn>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              We reply within one business day. No spam, ever.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}