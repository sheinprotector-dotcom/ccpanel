import { useRef, type ElementType, type MouseEvent, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import gsap from "gsap";
import type { Product } from "../data/products";

export function SplitText({ text, as: Tag = "span", className = "", manual = false }: { text: string; as?: ElementType; className?: string; manual?: boolean }) {
  const words = text.split(" ");
  return (
    <Tag className={className} data-split="" {...(manual ? { "data-split-manual": "" } : {})}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="split-word" aria-hidden="true">
          <span className="split-inner">{word}</span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

export function SectionHeading({ eyebrow, title, text, center = false, className = "" }: { eyebrow: string; title: string; text?: string; center?: boolean; className?: string }) {
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"} ${className}`}>
      <p className="eyebrow" data-reveal="20">{eyebrow}</p>
      <SplitText as="h2" text={title} className="section-title mt-5 block" />
      {text && <p className="mt-6 text-base leading-7 text-mist md:text-lg" data-reveal="24" data-delay="0.15">{text}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, image = "/images/hero-factory.webp" }: { eyebrow: string; title: string; text: string; image?: string }) {
  return (
    <section className="noise relative overflow-hidden pb-20 pt-40 md:pb-28 md:pt-52">
      <div className="absolute inset-0 overflow-hidden">
        <img src={image} alt="" className="h-[130%] w-full object-cover opacity-30" data-parallax="0.12" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/80 to-ink" />
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -left-40 top-20 size-[480px] rounded-full bg-orange/15 blur-[140px]" />
      <div className="site-container relative">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-mist" data-reveal="16">
          <Link to="/" className="hover:text-white">Home</Link><ChevronRight size={14} /><span className="text-orange">{eyebrow}</span>
        </nav>
        <SplitText as="h1" text={title} className="mt-6 block max-w-5xl text-[42px] font-bold leading-[1.02] md:text-[80px]" />
        <p className="mt-7 max-w-2xl text-base leading-7 text-mist md:text-lg" data-reveal="24" data-delay="0.2">{text}</p>
      </div>
    </section>
  );
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    gsap.to(el, { rotateY: (x - 0.5) * 10, rotateX: (0.5 - y) * 10, transformPerspective: 900, duration: 0.5, ease: "power2.out" });
  };
  const onLeave = () => ref.current && gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, .5)" });

  return (
    <article ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="product-card group relative overflow-hidden rounded-3xl border border-line bg-panel transition-colors hover:border-orange/40">
      <Link to={`/products/${product.slug}`} className="block focus-visible:outline-none" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-ink">
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">{String(index + 1).padStart(2, "0")}</span>
          <span className="absolute right-4 top-4 rounded-full bg-orange px-3 py-1.5 text-[11px] font-semibold text-white">{product.rating}</span>
        </div>
        <div className="relative p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[.2em] text-orange">{product.category}</p>
          <h3 className="mt-2 text-xl font-semibold">{product.name}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-mist">{product.shortDescription}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-orange">
            View details <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
        <span className="card-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>
    </article>
  );
}

export function MagneticButton({ to, children, variant = "primary", className = "" }: { to: string; children: ReactNode; variant?: "primary" | "ghost"; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out" });
  };
  const leave = () => ref.current && gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, .4)" });
  return (
    <Link ref={ref} to={to} onMouseMove={move} onMouseLeave={leave} className={`${variant === "primary" ? "btn-primary" : "btn-ghost"} ${className}`}>
      {children}
    </Link>
  );
}

export function CTA() {
  return (
    <section className="site-container py-20 md:py-28">
      <div className="noise relative overflow-hidden rounded-[32px] bg-orange px-6 py-16 md:px-16 md:py-24" data-reveal="60">
        <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-96 rounded-full bg-orange-deep blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="font-display text-xs font-semibold uppercase tracking-[.25em] text-white/80">Start your next project</p>
            <h2 className="mt-5 text-[34px] font-bold leading-[1.05] md:text-6xl">Need a reliable electrical engineering partner?</h2>
            <p className="mt-5 max-w-xl text-white/85">Share your single line diagram or load list and get a detailed technical and commercial offer within 48 hours.</p>
          </div>
          <Link to="/contact" className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-ink px-8 py-5 text-sm font-semibold text-white transition hover:bg-white hover:text-ink">
            Talk to our engineers <ArrowRight size={18} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
