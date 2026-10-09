import { useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowRight, ArrowUpRight, Award, Bolt, Box, Building2, Check, CheckCircle2, Clock3, DoorOpen, Download, Gauge, Image as ImageIcon,
  Layers, Mail, MapPin, MessageCircle, Phone, Search, ShieldCheck,
} from "lucide-react";
import { gsap } from "../lib/motion";
import products, { categories } from "../data/products";
import { clients, company, projects, services } from "../data/site";
import ThreePanelScene, { type PanelSceneState } from "../components/ThreePanelScene";
import { CTA, PageHero, ProductCard, SectionHeading } from "../components/kit";
import {
  CertificationsBlock, FaqBlock, IndustriesBlock, ProcessBlock, ProjectCard, ServicesBlock, TestimonialsBlock,
} from "../components/home/Sections";
import Marquee from "../components/home/Marquee";

export { default as HomePage } from "./HomePage";

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Built on engineering. Driven by reliability." text="An Indian electrical engineering company helping industries power their operations with confidence since 2011." image="/images/engineers-testing.webp" />
      <section className="section-padding">
        <div className="site-container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="Our story" title="Powering progress since 2011." />
            <p className="mt-6 leading-7 text-mist" data-reveal="24">Powertech Engineers began with a clear purpose: to make industrial electrical systems safer, more efficient and easier to maintain. Today our multidisciplinary team supports projects across manufacturing, infrastructure, pharmaceuticals, water and commercial facilities.</p>
            <p className="mt-4 leading-7 text-mist" data-reveal="24">Our Vadodara facility brings design, fabrication, assembly and testing together under one roof, giving every customer consistent quality and a single accountable partner.</p>
            <div className="mt-10 grid grid-cols-2 gap-4" data-stagger>
              {[[120, "+", "Skilled professionals"], [12, "", "States served"], [45, "k", "Sq ft facility"], [500, "+", "Projects delivered"]].map(([v, s, l]) => (
                <div key={String(l)} className="card p-6">
                  <p className="font-display text-4xl font-bold text-white"><span data-count={v} data-suffix={s}>0</span></p>
                  <p className="mt-2 text-sm text-mist">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl" data-img-reveal>
              <img src="/images/hero-factory.webp" alt="Powertech manufacturing facility" className="h-[520px] w-full object-cover md:h-[620px]" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 left-4 right-4 rounded-3xl bg-orange p-7 md:left-auto md:right-8 md:max-w-sm">
              <p className="font-display text-lg font-semibold leading-7 text-white">{"\u201CWe engineer every panel as if our own operation depends on it.\u201D"}</p>
              <p className="mt-3 text-sm text-white/80">Vikram Shah, Founder & MD</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-panel/40">
        <div className="site-container">
          <SectionHeading eyebrow="What guides us" title="Principles behind every project." center />
          <div className="mt-14 grid gap-5 md:grid-cols-3" data-stagger>
            {([
              ["Our mission", "Deliver safe, efficient and scalable electrical systems that enable industries to operate at their best.", Bolt],
              ["Our vision", "Become India's most trusted engineering partner for intelligent power and industrial automation.", Gauge],
              ["Our promise", "Uncompromised workmanship, honest advice and responsive support through the asset lifecycle.", ShieldCheck],
            ] as const).map(([t, d, Icon]) => (
              <div key={t} className="card p-9">
                <span className="grid size-14 place-items-center rounded-2xl bg-orange text-white"><Icon size={26} /></span>
                <h3 className="mt-8 text-2xl font-semibold">{t}</h3>
                <p className="mt-4 text-sm leading-7 text-mist">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ProcessBlock />
      <CertificationsBlock />
      <TestimonialsBlock />
      <CTA />
    </>
  );
}

export function ProductsPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const filtered = products.filter((p) => (category === "All" || p.category === category) && `${p.name} ${p.shortDescription} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHero eyebrow="Products" title="Electrical & automation products." text="Twelve engineered product lines built around your load, process and operating environment. Every panel is designed, fabricated and tested in-house." image="/images/products/pcc-panel.webp" />
      <section className="pb-20 md:pb-28">
        <div className="site-container">
          <div className="sticky top-24 z-20 -mx-2 flex flex-col gap-4 rounded-2xl border border-line bg-ink/80 p-3 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="hide-scrollbar flex gap-2 overflow-x-auto">
              {categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={`chip shrink-0 ${category === c ? "chip-active" : ""}`}>{c}</button>)}
            </div>
            <label className="flex h-11 items-center gap-3 rounded-full border border-line bg-panel px-4 lg:min-w-72">
              <Search size={17} className="text-mist" aria-hidden="true" />
              <span className="sr-only">Search products</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
            </label>
          </div>
          <p className="mt-8 text-sm text-mist" aria-live="polite">Showing {filtered.length} engineered solutions</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} index={products.indexOf(p)} />)}
          </div>
          {!filtered.length && <div className="card mt-8 p-12 text-center text-mist">No products match your search.</div>}
        </div>
      </section>
      <CTA />
    </>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);
  const [view, setView] = useState<"3d" | "photo">("3d");
  const [open, setOpen] = useState(false);
  const sceneState = useRef<PanelSceneState>({ open: 0, explode: 0, spin: 0 });
  if (!product) return <NotFoundPage />;
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).concat(products.filter((p) => p.category !== product.category)).slice(0, 4);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    gsap.to(sceneState.current, { open: next ? 1 : 0, explode: next ? 0.6 : 0, duration: 1.4, ease: "power3.inOut" });
  };

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute right-0 top-20 size-[520px] rounded-full bg-orange/15 blur-[160px]" />
        <div className="site-container relative grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="stage-frame relative h-[440px] overflow-hidden rounded-[28px] border border-line sm:h-[560px]">
              {view === "3d" ? (
                <ThreePanelScene key="scene" model={product.model} code={product.slug.slice(0, 3).toUpperCase()} interactive autoRotate stateRef={sceneState} className="absolute inset-0" label={`Interactive 3D model of ${product.name}`} />
              ) : (
                <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
              )}
              <span className="absolute left-4 top-4 rounded-full bg-orange px-3 py-1.5 text-[11px] font-semibold text-white">{product.category}</span>
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-2">
                <div className="glass flex rounded-full p-1" role="tablist" aria-label="Product view">
                  <button role="tab" aria-selected={view === "3d"} onClick={() => setView("3d")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${view === "3d" ? "bg-orange text-white" : "text-mist"}`}><Box size={14} /> 3D model</button>
                  <button role="tab" aria-selected={view === "photo"} onClick={() => setView("photo")} className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${view === "photo" ? "bg-orange text-white" : "text-mist"}`}><ImageIcon size={14} /> Photo</button>
                </div>
                {view === "3d" && <button onClick={toggle} aria-pressed={open} className={`chip glass flex items-center gap-2 ${open ? "chip-active" : ""}`}>{open ? <Layers size={14} /> : <DoorOpen size={14} />} {open ? "Close panel" : "Look inside"}</button>}
              </div>
            </div>
          </div>
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-mist" data-reveal="16">
              <Link to="/" className="hover:text-white">Home</Link>/<Link to="/products" className="hover:text-white">Products</Link>/<span className="text-orange">{product.name}</span>
            </nav>
            <h1 className="mt-5 text-[42px] font-bold leading-[1] md:text-6xl" data-reveal="30">{product.name}</h1>
            <p className="mt-6 text-base leading-7 text-mist md:text-lg" data-reveal="24">{product.description}</p>
            <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-line bg-panel px-5 py-4" data-reveal="20">
              <Gauge size={20} className="text-orange" />
              <div><p className="text-[10px] uppercase tracking-[.2em] text-mist">Rating</p><p className="font-display text-lg font-semibold text-white">{product.rating}</p></div>
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2" data-stagger>
              {product.features.slice(0, 4).map((x) => <li key={x} className="flex items-center gap-3 text-sm font-medium text-white"><CheckCircle2 size={18} className="shrink-0 text-orange" />{x}</li>)}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3" data-reveal="20">
              <Link to="/contact" className="btn-primary">Request a quote <ArrowRight size={16} /></Link>
              <a href={`${company.whatsapp}?text=${encodeURIComponent(`Hi, I need a quote for ${product.name}`)}`} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle size={16} /> WhatsApp</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="site-container grid gap-6 lg:grid-cols-2">
          <div className="card p-7 md:p-10" data-reveal="40">
            <h2 className="text-2xl font-semibold">Technical specifications</h2>
            <dl className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {Object.entries(product.specifications).map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
                  <dt className="text-mist">{k}</dt><dd className="font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-mist">Specifications are indicative and customized to project requirements.</p>
            <Link to="/contact" className="btn-ghost mt-6 !py-3"><Download size={15} /> Request datasheet</Link>
          </div>
          <div className="grid gap-6">
            <div className="card p-7 md:p-10" data-reveal="40">
              <h2 className="text-2xl font-semibold">Key features</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {product.features.map((x) => <li key={x} className="flex gap-3 text-sm text-white"><Check size={18} className="mt-0.5 shrink-0 text-orange" />{x}</li>)}
              </ul>
            </div>
            <div className="card p-7 md:p-10" data-reveal="40">
              <h2 className="text-2xl font-semibold">Applications</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {product.applications.map((x) => <span key={x} className="rounded-full border border-line bg-ink px-4 py-2.5 text-sm font-medium text-white">{x}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="site-container">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Related" title="You may also need." />
            <Link to="/products" className="text-link hidden sm:inline-flex">All products <ArrowUpRight size={16} /></Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} index={products.indexOf(p)} />)}
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services" title="End-to-end electrical engineering services." text="Practical engineering expertise from the first site study through installation, commissioning and lifecycle support." image="/images/wiring-closeup.webp" />
      <ServicesBlock />
      <section className="section-padding">
        <div className="site-container grid items-center gap-14 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl" data-img-reveal>
            <img src="/images/engineers-testing.webp" alt="Engineers commissioning a control panel on site" className="h-[460px] w-full object-cover" loading="lazy" />
          </div>
          <div>
            <SectionHeading eyebrow="Service support" title="24/7 breakdown support when it matters most." text="Our annual maintenance contracts include thermography, torque checks, relay testing and priority breakdown response from engineers who know your system." />
            <ul className="mt-8 space-y-3" data-stagger>
              {["4-hour response in Gujarat and Maharashtra", "Thermal imaging and preventive maintenance", "Spare parts inventory for critical switchgear", "Detailed service reports after every visit"].map((x) => (
                <li key={x} className="flex items-center gap-3 text-white"><CheckCircle2 size={18} className="text-orange" />{x}</li>
              ))}
            </ul>
            <Link to="/contact" className="btn-primary mt-9">Book a site visit <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
      <ProcessBlock />
      <FaqBlock />
      <CTA />
    </>
  );
}

export function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const grid = useRef<HTMLDivElement>(null);
  const cats = ["All", "Industrial", "Commercial", "Infrastructure", "Automation"];
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  const choose = (c: string) => {
    setFilter(c);
    requestAnimationFrame(() => grid.current && gsap.fromTo(grid.current.children, { y: 40, opacity: 0, clipPath: "inset(0% 0% 0% 0% round 24px)" }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.7, ease: "power3.out" }));
  };
  return (
    <>
      <PageHero eyebrow="Projects" title="Projects engineered for performance." text="Selected power distribution, panel manufacturing and automation work delivered across India." image="/images/project-automotive.webp" />
      <section className="pb-20 md:pb-28">
        <div className="site-container">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto md:justify-center">
            {cats.map((c) => <button key={c} onClick={() => choose(c)} className={`chip shrink-0 ${filter === c ? "chip-active" : ""}`}>{c}</button>)}
          </div>
          <div ref={grid} className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => <ProjectCard key={p.name} project={p} />)}
          </div>
        </div>
      </section>
      <IndustriesBlock />
      <CTA />
    </>
  );
}

export function ClientsPage() {
  return (
    <>
      <PageHero eyebrow="Clients" title="Trusted across critical industries." text="Long-term engineering relationships built on reliable products, accountable delivery and responsive support." image="/images/project-commercial.webp" />
      <Marquee items={clients} />
      <section className="section-padding">
        <div className="site-container">
          <SectionHeading eyebrow="Partners in progress" title="Powering ambitious Indian businesses." center />
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-3 lg:grid-cols-4" data-stagger>
            {clients.map((name, i) => (
              <div key={name} className="group grid h-36 place-items-center bg-ink p-5 text-center transition-colors duration-300 hover:bg-panel">
                <div>
                  <Building2 className="mx-auto text-mist transition group-hover:text-orange" size={26} />
                  <p className="mt-3 font-display text-sm font-semibold tracking-wider text-white">{name}</p>
                  <span className="text-[10px] uppercase tracking-[.2em] text-mist">{["Manufacturing", "Infrastructure", "Process industry"][i % 3]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="site-container grid gap-5 md:grid-cols-3" data-stagger>
          {[[98, "%", "On-time project delivery"], [72, "%", "Business from repeat clients"], [12, "", "Industrial sectors served"]].map(([v, s, l]) => (
            <div key={String(l)} className="card p-8">
              <Award className="text-orange" size={28} />
              <p className="mt-6 font-display text-6xl font-bold text-white"><span data-count={v} data-suffix={s}>0</span></p>
              <p className="mt-3 text-sm uppercase tracking-wider text-mist">{l}</p>
            </div>
          ))}
        </div>
      </section>
      <TestimonialsBlock />
      <CTA />
    </>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's engineer your next solution." text="Share your requirement with our engineering team. We typically respond within one business day." image="/images/project-dg.webp" />
      <section className="pb-20 md:pb-28">
        <div className="site-container grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="space-y-4" data-stagger>
            {([
              [MapPin, "Visit our facility", company.address, undefined],
              [Phone, "Call us", company.phone, company.phoneHref],
              [Mail, "Email projects", company.email, `mailto:${company.email}`],
              [Clock3, "Working hours", company.hours, undefined],
            ] as const).map(([Icon, t, d, href]) => (
              <div key={t} className="card flex gap-4 p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange/10 text-orange"><Icon size={21} /></span>
                <div>
                  <h2 className="font-display text-base font-semibold text-white">{t}</h2>
                  {href ? <a href={href} className="mt-1 block text-sm leading-6 text-mist hover:text-orange">{d}</a> : <p className="mt-1 text-sm leading-6 text-mist">{d}</p>}
                </div>
              </div>
            ))}
            <a href={company.whatsapp} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-3xl bg-[#25D366] p-6 text-white">
              <span className="flex items-center gap-3 font-semibold"><MessageCircle size={22} /> Chat with us on WhatsApp</span><ArrowUpRight size={20} />
            </a>
          </div>
          <div className="card p-6 md:p-10" data-reveal="40">
            <h2 className="text-3xl font-bold">Request a quote</h2>
            <p className="mt-2 text-sm text-mist">Tell us a little about your application.</p>
            {sent ? (
              <div className="mt-8 rounded-2xl border border-line bg-ink p-10 text-center" role="status">
                <CheckCircle2 className="mx-auto text-orange" size={48} />
                <h3 className="mt-4 text-xl font-semibold">Thank you for your inquiry.</h3>
                <p className="mt-2 text-sm text-mist">Our project team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" placeholder="Your name" autoComplete="name" />
                <Field label="Company" name="company" placeholder="Company name" autoComplete="organization" />
                <Field label="Phone" name="phone" placeholder="+91" type="tel" autoComplete="tel" />
                <Field label="Email" name="email" placeholder="name@company.com" type="email" autoComplete="email" />
                <label className="sm:col-span-2">
                  <span className="form-label">Product / service</span>
                  <select name="interest" className="form-input">
                    {products.map((p) => <option key={p.slug}>{p.name}</option>)}
                    {services.map((s) => <option key={s.title}>{s.title}</option>)}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="form-label">Project requirement</span>
                  <textarea name="message" className="form-input min-h-36 resize-y" placeholder="Ratings, quantity, location or timeline..." required />
                </label>
                <button className="btn-primary w-full sm:col-span-2 sm:w-fit" type="submit">Submit inquiry <ArrowRight size={16} /></button>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="site-container overflow-hidden rounded-3xl border border-line" data-reveal="40">
          <iframe title="Powertech Engineers location map" src="https://www.google.com/maps?q=GIDC+Makarpura+Vadodara&output=embed" className="h-[380px] w-full grayscale invert-[.92] contrast-[.9]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}

function Field({ label, name, placeholder, type = "text", autoComplete }: { label: string; name: string; placeholder: string; type?: string; autoComplete?: string }) {
  return (
    <label>
      <span className="form-label">{label}</span>
      <input className="form-input" name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} required />
    </label>
  );
}

export function NotFoundPage() {
  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden px-4 pt-24 text-center">
      <div className="grid-bg absolute inset-0" />
      <div className="relative">
        <p className="text-gradient font-display text-[120px] font-bold leading-none md:text-[200px]">404</p>
        <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
        <p className="mt-3 text-mist">The page you are looking for may have moved.</p>
        <Link to="/" className="btn-primary mt-8">Back to home <ArrowRight size={16} /></Link>
      </div>
    </section>
  );
}
