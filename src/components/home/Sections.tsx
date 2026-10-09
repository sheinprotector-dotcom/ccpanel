import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Minus, Plus, Quote } from "lucide-react";
import { gsap } from "../../lib/motion";
import products, { categories } from "../../data/products";
import { certifications, faqs, industries, process, projects, services, testimonials, type Project } from "../../data/site";
import { ProductCard, SectionHeading } from "../kit";

export function ProductsShowcase({ limit = 8 }: { limit?: number }) {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const grid = useRef<HTMLDivElement>(null);
  const list = products.filter((p) => cat === "All" || p.category === cat).slice(0, limit);

  const choose = (c: (typeof categories)[number]) => {
    if (!grid.current) return setCat(c);
    gsap.to(grid.current.children, {
      y: 20, opacity: 0, duration: 0.25, stagger: 0.02, onComplete: () => {
        setCat(c);
        requestAnimationFrame(() => grid.current && gsap.fromTo(grid.current.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" }));
      },
    });
  };

  return (
    <section className="section-padding">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Engineered products" title="Twelve product lines. One standard of quality." text="From compact starter panels to 6300A power control centres, every product is built to IEC 61439 and your site conditions." />
          <Link to="/products" className="text-link" data-reveal="20">View all products <ArrowRight size={17} /></Link>
        </div>
        <div className="hide-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" data-reveal="20">
          {categories.map((c) => <button key={c} onClick={() => choose(c)} className={`chip shrink-0 ${cat === c ? "chip-active" : ""}`}>{c}</button>)}
        </div>
        <div ref={grid} className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" data-stagger>
          {list.map((p) => <ProductCard key={p.id} product={p} index={products.indexOf(p)} />)}
        </div>
      </div>
    </section>
  );
}

export function AboutBlock() {
  return (
    <section className="section-padding overflow-hidden">
      <div className="site-container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl" data-img-reveal>
            <img src="/images/engineers-testing.webp" alt="Powertech engineers testing an industrial control panel" className="h-[420px] w-full object-cover md:h-[560px]" loading="lazy" />
          </div>
          <div className="absolute -bottom-10 -right-2 w-[52%] overflow-hidden rounded-3xl border-4 border-ink md:-right-10" data-parallax="0.15">
            <img src="/images/wiring-closeup.webp" alt="Close-up of neatly ferruled panel wiring" className="aspect-square w-full object-cover" loading="lazy" />
          </div>
          <div className="glass absolute left-4 top-4 rounded-2xl p-5 md:left-6 md:top-6">
            <p className="font-display text-4xl font-bold text-orange"><span data-count="15" data-suffix="+">0</span></p>
            <p className="mt-1 text-xs uppercase tracking-[.16em] text-white">Years of engineering</p>
          </div>
        </div>
        <div className="pt-8 lg:pt-0">
          <SectionHeading eyebrow="About Powertech" title="From concept to commissioning, under one roof." />
          <p className="mt-6 leading-7 text-mist" data-reveal="24">Powertech Engineers is an integrated electrical engineering company delivering robust panel systems, factory automation and turnkey power distribution to businesses across India. Our 45,000 sq ft Vadodara facility brings design, fabrication, assembly and testing together, giving every client consistent quality and a single accountable partner.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" data-stagger>
            {["In-house CNC sheet metal", "Powder coating plant", "Busbar fabrication shop", "HV & IR test bay", "3D GA drawings", "Pan-India site teams"].map((x) => (
              <li key={x} className="flex items-center gap-3 text-sm font-medium text-white"><CheckCircle2 className="shrink-0 text-orange" size={18} />{x}</li>
            ))}
          </ul>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
            {[[500, "+", "Projects"], [250, "+", "Clients"], [98, "%", "On-time"]].map(([v, s, l]) => (
              <div key={String(l)}>
                <p className="font-display text-3xl font-bold text-white md:text-4xl"><span data-count={v} data-suffix={s}>0</span></p>
                <p className="mt-1 text-xs uppercase tracking-[.16em] text-mist">{l}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-ghost mt-10">Our story <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

function SpotCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div onMouseMove={move} className={`group relative overflow-hidden rounded-3xl border border-line bg-panel transition-colors duration-300 hover:border-orange/40 ${className}`}>
      <div className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function ServicesBlock() {
  return (
    <section className="section-padding bg-panel/40">
      <div className="site-container">
        <SectionHeading eyebrow="What we do" title="Complete electrical engineering, end to end." text="From panel fabrication to turnkey project execution, we take ownership at every stage of your power system." center />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {services.map(({ icon: Icon, title, text }, i) => (
            <SpotCard key={title} className="p-7">
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl bg-orange/10 text-orange transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-orange group-hover:text-white"><Icon size={26} strokeWidth={1.7} /></span>
                <span className="font-display text-sm font-semibold text-white/20">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessBlock() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth + 80;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.utils.toArray<HTMLElement>("[data-process-card]").forEach((card) => {
        gsap.from(card.querySelector("[data-num]"), { yPercent: 60, opacity: 0, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 90%", end: "left 50%", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden py-20 lg:flex lg:h-[100svh] lg:items-center lg:py-0">
      <div className="lg:w-full">
        <div className="site-container mb-12 flex flex-col justify-between gap-6 lg:mb-14 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="How we work" title="Six steps to a panel you can trust." />
          <p className="max-w-sm text-sm leading-6 text-mist" data-reveal="20">A disciplined, documented workflow that makes delivery predictable for consultants, contractors and plant owners.</p>
        </div>
        <div ref={track} className="flex flex-col gap-4 px-5 md:px-8 lg:w-max lg:flex-row lg:gap-5 lg:pl-[max(2rem,calc((100vw-1360px)/2+2rem))]">
          {process.map(({ icon: Icon, title, text }, i) => (
            <article key={title} data-process-card className="card relative flex flex-col overflow-hidden p-7 lg:h-[380px] lg:w-[380px] lg:p-9">
              <span data-num className="stroke-text pointer-events-none absolute -right-2 -top-6 font-display text-[140px] font-bold leading-none">{i + 1}</span>
              <span className="grid size-14 place-items-center rounded-2xl bg-orange text-white"><Icon size={26} /></span>
              <p className="mt-8 font-display text-xs font-semibold uppercase tracking-[.2em] text-orange lg:mt-auto">Step {String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndustriesBlock() {
  return (
    <section className="section-padding">
      <div className="site-container">
        <SectionHeading eyebrow="Industries served" title="Trusted where downtime is not an option." center />
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-5" data-stagger>
          {industries.map(({ icon: Icon, name }) => (
            <div key={name} className="group flex flex-col items-center justify-center gap-4 bg-ink px-4 py-10 text-center transition-colors duration-300 hover:bg-orange">
              <Icon size={30} strokeWidth={1.5} className="text-orange transition group-hover:scale-110 group-hover:text-white" />
              <p className="text-sm font-semibold text-white">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectCard({ project, tall = false, className = "" }: { project: Project; tall?: boolean; className?: string }) {
  return (
    <article className={`group relative overflow-hidden rounded-3xl bg-panel ${tall ? "h-[440px] md:h-[520px]" : "h-[420px]"} ${className}`} data-img-reveal>
      <img src={project.image} alt={project.name} loading="lazy" className="h-full w-full object-cover transition duration-[1.4s] ease-out group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
      <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">{project.category} · {project.year}</span>
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h3 className="text-2xl font-semibold">{project.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-mist"><MapPin size={15} className="text-orange" />{project.location}</p>
        <p className="mt-4 max-h-0 overflow-hidden text-sm text-white opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">{project.scope}</p>
      </div>
      <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-orange text-white opacity-0 transition duration-500 group-hover:opacity-100"><ArrowUpRight size={18} /></span>
    </article>
  );
}

export function ProjectsBlock() {
  return (
    <section className="section-padding bg-panel/40">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Selected work" title="Engineering that performs in the real world." />
          <Link to="/projects" className="text-link" data-reveal="20">All projects <ArrowRight size={17} /></Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <ProjectCard project={projects[0]} tall className="md:col-span-2" />
          <ProjectCard project={projects[1]} tall />
          <ProjectCard project={projects[2]} tall />
          <ProjectCard project={projects[3]} tall className="md:col-span-2" />
        </div>
      </div>
    </section>
  );
}

export function TestimonialsBlock() {
  const [i, setI] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const go = (dir: number) => {
    const next = (i + dir + testimonials.length) % testimonials.length;
    if (!card.current) return setI(next);
    gsap.to(card.current, { opacity: 0, x: -30 * dir, duration: 0.3, ease: "power2.in", onComplete: () => {
      setI(next);
      gsap.fromTo(card.current, { opacity: 0, x: 30 * dir }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" });
    } });
  };
  const t = testimonials[i];
  return (
    <section className="section-padding">
      <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
        <div>
          <SectionHeading eyebrow="Client voices" title="What plant heads say about us." />
          <div className="mt-8 flex gap-3" data-reveal="20">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="grid size-12 place-items-center rounded-full border border-line text-white transition hover:border-orange hover:bg-orange"><ChevronLeft size={20} /></button>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="grid size-12 place-items-center rounded-full border border-line text-white transition hover:border-orange hover:bg-orange"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="card relative overflow-hidden p-8 md:p-12" data-reveal="40">
          <Quote size={80} className="absolute -right-2 -top-2 text-orange/15" />
          <div ref={card} aria-live="polite">
            <p className="font-display text-xl leading-relaxed text-white md:text-[28px] md:leading-[1.4]">{`"${t.quote}"`}</p>
            <div className="mt-8 flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-orange font-display font-bold text-white">{t.name.split(" ").map((n) => n[0]).join("")}</span>
              <div><p className="font-semibold text-white">{t.name}</p><p className="text-sm text-mist">{t.role}</p></div>
            </div>
          </div>
          <div className="mt-8 flex gap-2">{testimonials.map((_, k) => <span key={k} className={`h-1 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-orange" : "w-4 bg-line"}`} />)}</div>
        </div>
      </div>
    </section>
  );
}

export function CertificationsBlock() {
  return (
    <section className="border-y border-line py-10">
      <div className="site-container flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <p className="shrink-0 text-xs font-semibold uppercase tracking-[.22em] text-mist">Quality & compliance</p>
        <div className="flex flex-wrap justify-center gap-2 md:justify-end" data-stagger>
          {certifications.map((c) => <span key={c} className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-white">{c}</span>)}
        </div>
      </div>
    </section>
  );
}

export function FaqBlock() {
  const [open, setOpen] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const toggle = (idx: number) => {
    const next = open === idx ? -1 : idx;
    refs.current.forEach((el, k) => {
      if (!el) return;
      gsap.to(el, { height: k === next ? "auto" : 0, opacity: k === next ? 1 : 0, duration: 0.5, ease: "power3.inOut" });
    });
    setOpen(next);
  };
  return (
    <section className="section-padding">
      <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <SectionHeading eyebrow="FAQ" title="Questions engineers ask us." text="Cannot find what you need? Our application engineers reply within one business day." />
        <div className="divide-y divide-line border-y border-line" data-stagger>
          {faqs.map((f, idx) => (
            <div key={f.q}>
              <button onClick={() => toggle(idx)} aria-expanded={open === idx} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="font-display text-lg font-semibold text-white md:text-xl">{f.q}</span>
                <span className={`grid size-9 shrink-0 place-items-center rounded-full border transition ${open === idx ? "border-orange bg-orange text-white" : "border-line text-white"}`}>{open === idx ? <Minus size={16} /> : <Plus size={16} />}</span>
              </button>
              <div ref={(el) => { refs.current[idx] = el; }} className="overflow-hidden" style={{ height: idx === 0 ? "auto" : 0, opacity: idx === 0 ? 1 : 0 }}>
                <p className="max-w-2xl pb-6 leading-7 text-mist">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
