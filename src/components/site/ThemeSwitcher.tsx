import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "blue", label: "Brand Blue", swatch: "#2596BE" },
  { id: "emerald", label: "Emerald", swatch: "#22B58A" },
  { id: "violet", label: "Violet", swatch: "#8B5CF6" },
  { id: "amber", label: "Amber", swatch: "#F5B32B" },
  { id: "crimson", label: "Crimson", swatch: "#E0413C" },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("blue");

  useEffect(() => {
    const saved = localStorage.getItem("af-theme") ?? "blue";
    setActive(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const pick = (id: string) => {
    setActive(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("af-theme", id);
  };

  return (
    <div className="fixed bottom-6 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass w-56 rounded-3xl p-4 shadow-[var(--shadow-soft)]"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Color theme
            </p>
            <ul className="flex flex-col gap-1">
              {themes.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => pick(t.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-sm transition-colors",
                      active === t.id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full ring-1 ring-white/20"
                      style={{ background: t.swatch }}
                    />
                    <span className="flex-1 text-left">{t.label}</span>
                    {active === t.id && <Check className="h-4 w-4 text-primary" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={open ? "Close theme picker" : "Open theme picker"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--glow-brand)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        {open ? <X className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
      </button>
    </div>
  );
}