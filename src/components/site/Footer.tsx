import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const links = [
  { label: "Services", href: "#services" },
  { label: "Case Studies", href: "#results" },
  { label: "About", href: "#home" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy Policy", href: "#contact" },
  { label: "Terms", href: "#contact" },
];

const socials = [
  { label: "LinkedIn", icon: Linkedin },
  { label: "Facebook", icon: Facebook },
  { label: "Instagram", icon: Instagram },
  { label: "YouTube", icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <a href="#home" className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">
              AF
            </span>
            <span className="truncate text-base font-semibold">Appoint Funnels</span>
          </a>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors hover:text-primary">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href="#contact"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          © 2026 Appoint Funnels
        </p>
      </div>
    </footer>
  );
}