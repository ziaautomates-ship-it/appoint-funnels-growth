import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Swatch = { id: string; label: string; l: number; c: number; h: number };

const HUE_NAMES = [
  "Crimson", "Ember", "Sunset", "Amber", "Gold", "Citrus",
  "Lime", "Fern", "Emerald", "Jade", "Teal", "Aqua",
  "Cyan", "Sky", "Azure", "Brand Blue", "Indigo", "Violet",
  "Purple", "Orchid", "Fuchsia", "Magenta", "Rose", "Ruby",
];

// 25 hue steps x 40 tone/saturation steps = 1000 colors
const HUE_STEPS = 25;
const TONE_STEPS = 40;

function buildPalette(): Swatch[] {
  const out: Swatch[] = [];
  for (let h = 0; h < HUE_STEPS; h++) {
    const hue = Math.round((360 / HUE_STEPS) * h + 18) % 360;
    const name = HUE_NAMES[Math.round((hue / 360) * HUE_NAMES.length) % HUE_NAMES.length];
    for (let t = 0; t < TONE_STEPS; t++) {
      const band = t % 8; // lightness band
      const sat = Math.floor(t / 8); // 5 saturation levels
      const l = 0.42 + band * 0.055;
      const c = sat === 0 ? 0.03 : 0.055 + sat * 0.045;
      out.push({
        id: `c-${hue}-${t}`,
        label: `${name} ${band + 1}${sat > 0 ? `\u00b7${sat + 1}` : ""}`,
        l: Number(l.toFixed(3)),
        c: Number(c.toFixed(3)),
        h: hue,
      });
    }
  }
  return out;
}

const DEFAULT_ID = "signature";

const SIGNATURE_SWATCH: Swatch = {
  id: DEFAULT_ID,
  label: "Signature Lime #DAFF10",
  l: 0.94,
  c: 0.221,
  h: 120,
};

function swatchToHex(s: Swatch): string {
  const el = document.createElement("span");
  el.style.color = `oklch(${s.l} ${s.c} ${s.h})`;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color;
  el.remove();
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m) return "#2596BE";
  const [r, g, b] = m.map(Number) as [number, number, number];
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  ).toUpperCase();
}

function applySwatch(s: Swatch) {
  const root = document.documentElement;
  root.removeAttribute("data-theme");
  root.style.setProperty("--primary", `oklch(${s.l} ${s.c} ${s.h})`);
  root.style.setProperty(
    "--primary-glow",
    `oklch(${Math.min(0.92, s.l + 0.12)} ${Math.max(0.02, s.c - 0.01)} ${s.h})`,
  );
  root.style.setProperty("--ring", `oklch(${s.l} ${s.c} ${s.h})`);
  root.style.setProperty(
    "--primary-foreground",
    s.l > 0.72 ? "oklch(0.145 0 0)" : "oklch(1 0 0)",
  );
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const palette = useMemo(() => [SIGNATURE_SWATCH, ...buildPalette()], []);
  const [active, setActive] = useState(DEFAULT_ID);
  const [hex, setHex] = useState("#DAFF10");
  const [hexes, setHexes] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const s of palette) map[s.id] = swatchToHex(s);
    setHexes(map);
    const saved = localStorage.getItem("af-theme");
    const found = palette.find((s) => s.id === saved);
    if (found) {
      setActive(found.id);
      applySwatch(found);
      setHex(swatchToHex(found));
    }
  }, [palette]);

  const pick = (s: Swatch) => {
    setActive(s.id);
    applySwatch(s);
    setHex(swatchToHex(s));
    localStorage.setItem("af-theme", s.id);
  };

  const activeSwatch = palette.find((s) => s.id === active);

  return (
    <div className="fixed bottom-6 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass w-[min(84vw,20rem)] rounded-3xl p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                1000 colors
              </p>
              <span className="text-[11px] text-muted-foreground">
                {activeSwatch?.label ?? "Custom"}{" "}
                <span className="font-semibold text-foreground">{hex}</span>
              </span>
            </div>
            <div className="grid max-h-[52vh] grid-cols-10 gap-1.5 overflow-y-auto pr-1">
              {palette.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  title={`${s.label} — ${hexes[s.id] ?? ""}`}
                  aria-label={`${s.label} ${hexes[s.id] ?? ""}`}
                  onClick={() => pick(s)}
                  className={cn(
                    "relative grid aspect-square place-items-center rounded-lg ring-1 ring-white/10 transition-transform duration-200 hover:scale-110",
                    active === s.id && "ring-2 ring-white",
                  )}
                  style={{ background: `oklch(${s.l} ${s.c} ${s.h})` }}
                >
                  {active === s.id && <Check className="h-3 w-3 text-white drop-shadow" />}
                </button>
              ))}
            </div>
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
      <span className="rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-foreground shadow-md backdrop-blur">
        {hex}
      </span>
    </div>
  );
}