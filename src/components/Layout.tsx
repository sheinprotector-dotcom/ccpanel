import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ArrowRight, ArrowUpRight, Mail, MapPin, MessageCircle, Phone, Zap } from "lucide-react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, initPageAnimations } from "../lib/motion";
import { company } from "../data/site";
import products from "../data/products";

const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Clients", "/clients"],
  ["Contact", "/contact"],
] as const;

let lenis: Lenis | null = null;

export function Brand() {
  return (
    <Link to="/" className="inline-flex items-center gap-3" aria-label="Powertech Engineers home">
      <span className="relative grid size-10 place-items-center rounded-xl bg-orange text-white shadow-[0_0_30px_rgba(255,107,26,.45)]">
        <Zap size={20} fill="currentColor" />
      </span>
      <span className="leading-none">
        <strong className="block font-display text-[17px] font-bold tracking-[.06em] text-white">POWERTECH</strong>
        <span className="mt-1 block text-[9px] font-semibold tracking-[.42em] text-orange">ENGINEERS</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      if (!headerRef.current) return;
      const hide = y > lastY && y > 400 && !document.body.dataset.menuOpen;
      gsap.to(headerRef.current, { yPercent: hide ? -110 : 0, duration: 0.45, ease: "power3.out", overwrite: true });
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    if (open) {
      document.body.dataset.menuOpen = "1";
      lenis?.stop();
      gsap.set(menu, { display: "flex" });
      gsap.fromTo(menu, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "expo.inOut" });
      gsap.fromTo(menu.querySelectorAll("[data-menu-item]"), { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, delay: 0.3, duration: 0.7, ease: "expo.out" });
    } else {
      delete document.body.dataset.menuOpen;
      lenis?.start();
      gsap.to(menu, { clipPath: "circle(0% at 100% 0%)", duration: 0.5, ease: "expo.in", onComplete: () => { gsap.set(menu, { display: "none" }); } });
    }
  }, [open]);

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
        <nav className={`mx-auto flex h-16 max-w-[1360px] items-center justify-between rounded-2xl px-4 transition-all duration-500 md:h-[72px] md:px-6 ${scrolled || open ? "glass shadow-[0_20px_60px_rgba(0,0,0,.35)]" : "border border-transparent"}`} aria-label="Main navigation">
          <Brand />
          <div className="hidden items-center gap-1 xl:flex">
            {nav.map(([label, href]) => (
              <NavLink key={href} to={href} end={href === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>{label}</NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href={company.phoneHref} className="hidden items-center gap-2 text-sm font-medium text-white lg:flex"><Phone size={15} className="text-orange" />{company.phone}</a>
            <Link to="/contact" className="btn-primary !hidden !py-3 sm:!inline-flex lg:ml-4">Get a quote <ArrowRight size={15} /></Link>
            <button className="relative grid size-11 place-items-center rounded-xl border border-white/10 bg-white/5 xl:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu">
              <span className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-0.5 w-5 bg-white transition-all duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </nav>
      </header>
      <div id="mobile-menu" ref={menuRef} className="fixed inset-0 z-40 hidden flex-col justify-between overflow-y-auto bg-ink px-6 pb-10 pt-28 xl:hidden" style={{ clipPath: "circle(0% at 100% 0%)" }}>
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative flex flex-col">
          {nav.map(([label, href], i) => (
            <div key={href} className="overflow-hidden border-b border-line">
              <NavLink data-menu-item to={href} end={href === "/"} className={({ isActive }) => `flex items-center justify-between py-4 font-display text-3xl font-semibold ${isActive ? "text-orange" : "text-white"}`}>
                <span><span className="mr-4 align-middle text-xs text-mist">0{i + 1}</span>{label}</span>
                <ArrowUpRight size={22} className="text-mist" />
              </NavLink>
            </div>
          ))}
        </div>
        <div className="relative mt-10 space-y-3 text-sm text-mist" data-menu-item>
          <a href={company.phoneHref} className="flex items-center gap-3"><Phone size={16} className="text-orange" />{company.phone}</a>
          <a href={`mailto:${company.email}`} className="flex items-center gap-3"><Mail size={16} className="text-orange" />{company.email}</a>
          <Link to="/contact" className="btn-primary mt-4 w-full">Get a quote <ArrowRight size={16} /></Link>
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="site-container grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-[1.4fr_.7fr_1fr_1.1fr]">
        <div>
          <Brand />
          <p className="mt-6 max-w-sm text-sm leading-7 text-mist">Engineered electrical panels, automation and turnkey power solutions built for safer, smarter and more productive industries across India.</p>
          <a href={company.whatsapp} target="_blank" rel="noreferrer" className="btn-ghost mt-7 !py-3"><MessageCircle size={16} className="text-orange" /> Chat on WhatsApp</a>
        </div>
        <div>
          <h3 className="footer-title">Company</h3>
          <div className="footer-links">{nav.slice(1).map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</div>
        </div>
        <div>
          <h3 className="footer-title">Products</h3>
          <div className="footer-links">{products.slice(0, 7).map((p) => <Link key={p.slug} to={`/products/${p.slug}`}>{p.name}</Link>)}</div>
        </div>
        <div>
          <h3 className="footer-title">Get in touch</h3>
          <div className="space-y-4 text-sm text-mist">
            <p className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-orange" size={17} />{company.address}</p>
            <a className="flex gap-3 hover:text-white" href={company.phoneHref}><Phone className="shrink-0 text-orange" size={17} />{company.phone}</a>
            <a className="flex gap-3 hover:text-white" href={`mailto:${company.email}`}><Mail className="shrink-0 text-orange" size={17} />{company.email}</a>
          </div>
        </div>
      </div>
      <div className="site-container">
        <p className="stroke-text select-none whitespace-nowrap text-center font-display text-[17vw] font-bold leading-[0.8] md:text-[13.5vw]" aria-hidden="true">POWERTECH</p>
      </div>
      <div className="border-t border-line">
        <div className="site-container flex flex-col gap-2 py-6 text-xs text-mist sm:flex-row sm:justify-between">
          <p>© 2026 Powertech Engineers. All rights reserved.</p>
          <p>Reliable Power. Smarter Engineering.</p>
        </div>
      </div>
    </footer>
  );
}

function Preloader({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(counter, { v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => { if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0"); } })
      .to(el.querySelector("[data-bar]"), { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
      .to(el.querySelectorAll("[data-pre-text]"), { yPercent: -120, stagger: 0.05, duration: 0.6, ease: "expo.in" }, "+=0.1")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2");
    return () => { tl.kill(); };
  }, [onDone]);
  return (
    <div ref={ref} className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-6 md:p-12" style={{ clipPath: "inset(0 0 0% 0)" }} aria-hidden="true">
      <div className="overflow-hidden"><div data-pre-text><Brand /></div></div>
      <div>
        <div className="flex items-end justify-between overflow-hidden">
          <p data-pre-text className="max-w-xs font-display text-lg text-mist md:text-2xl">Energizing industrial systems</p>
          <span data-pre-text ref={countRef} className="font-display text-7xl font-bold text-white md:text-[160px] md:leading-none">000</span>
        </div>
        <div className="mt-6 h-px w-full bg-line"><div data-bar className="h-px origin-left scale-x-0 bg-orange shadow-[0_0_20px_#ff6b1a]" /></div>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => { if (ref.current) ref.current.style.transform = `scaleX(${self.progress})`; } });
    return () => st.kill();
  }, []);
  return <div ref={ref} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-orange" aria-hidden="true" />;
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || !ref.current) return;
    const el = ref.current;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 1 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const interactive = (e.target as HTMLElement).closest("a, button, canvas");
      gsap.to(el, { scale: interactive ? 2.6 : 1, duration: 0.3 });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className="cursor-dot size-3 rounded-full bg-white opacity-0" aria-hidden="true" />;
}

function FloatingContact() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a href={company.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_15px_40px_rgba(37,211,102,.35)] transition hover:scale-110">
        <MessageCircle size={24} />
      </a>
      <a href={company.phoneHref} aria-label="Call us" className="grid size-14 place-items-center rounded-full bg-orange text-white shadow-[0_15px_40px_rgba(255,107,26,.35)] transition hover:scale-110 md:hidden">
        <Phone size={22} />
      </a>
    </div>
  );
}

export function RootLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(() => sessionStorage.getItem("pt-loaded") === "1");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
  }, []);

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const parts = location.pathname.split("/").filter(Boolean).map((s) => s.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()));
    document.title = parts.length ? `${parts.reverse().join(" | ")} | Powertech Engineers` : "Powertech Engineers | Industrial Electrical Panels & Automation";
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (!loaded || !mainRef.current) return;
    const root = mainRef.current;
    const ctx = gsap.context(() => initPageAnimations(root), root);
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    window.addEventListener("load", refresh);
    return () => { ctx.revert(); window.clearTimeout(t); window.removeEventListener("load", refresh); };
  }, [location.pathname, loaded]);

  const finishLoading = useCallback(() => {
    sessionStorage.setItem("pt-loaded", "1");
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader onDone={finishLoading} />}
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main ref={mainRef} data-ready={loaded ? "1" : "0"}>
        <Outlet context={{ loaded }} />
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
