import ind1 from "@/assets/ind-1.jpg";
import ind2 from "@/assets/ind-2.jpg";
import ind3 from "@/assets/ind-3.jpg";
import ind4 from "@/assets/ind-4.jpg";
import { Display, Reveal, SectionLabel } from "./primitives";

const images = [ind1, ind2, ind3, ind4];

const industries = [
  "Marketing Agencies",
  "Coaches",
  "Consultants",
  "Home Services",
  "Local Businesses",
  "Dentists",
  "Realtors",
  "SaaS Companies",
  "Ecommerce Brands",
  "Contractors",
  "Solar Companies",
  "Med Spas",
];

export default function IndustriesSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <SectionLabel>Industries</SectionLabel>
          <Display className="mt-6">Who Do We Serve?</Display>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {industries.map((name, i) => (
            <Reveal key={name} delay={(i % 4) * 0.08}>
              <article className="group relative aspect-4/5 overflow-hidden rounded-[1.5rem] border border-border transition-all duration-500 hover:border-primary/60 hover:shadow-[var(--glow-brand)]">
                <img
                  src={images[i % images.length]}
                  alt={`${name} industry`}
                  width={900}
                  height={1100}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-[1.1s] group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/25" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="display-xl text-2xl leading-tight sm:text-3xl">{name}</h3>
                  <span className="mt-2 block h-px w-0 bg-primary transition-all duration-500 group-hover:w-12" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}