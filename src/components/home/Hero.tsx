import { useLayoutEffect, useRef } from "react";
import { useOutletContext } from "react-router";
import { ArrowRight, ArrowDown, ShieldCheck } from "lucide-react";
import { gsap } from "../../lib/motion";
import ThreePanelScene, { type PanelSceneState } from "../ThreePanelScene";
import { MagneticButton, SplitText } from "../kit";
import products from "../../data/products";

const heroProduct = products.find((p) => p.slug === "pcc-panel")!;

const hud = [
  { k: "Busbar", v: "6300A", pos: "left-[4%] top-[18%]" },
  { k: "Fault level", v: "65kA / 1s", pos: "right-[4%] top-[30%]" },
  { k: "Enclosure", v: "IP54 CRCA", pos: "left-[10%] bottom-[22%]" },
];

export default function Hero() {
  const { loaded } = useOutletContext<{ loaded: boolean }>();
  const root = useRef<HTMLElement>(null);
  const sceneState = useRef<PanelSceneState>({ open: 0, explode: 0, spin: 0 });

  useLayoutEffect(() => {
    if (!loaded || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-hero-eyebrow]", { y: 20, opacity: 0, duration: 0.8 })
        .from("[data-hero-title] .split-inner", { yPercent: 115, rotate: 5, duration: 1.3, stagger: 0.06 }, "-=0.5")
        .from("[data-hero-copy]", { y: 30, opacity: 0, duration: 1 }, "-=0.9")
        .from("[data-hero-cta] > *", { y: 30, opacity: 0, stagger: 0.1, duration: 0.9 }, "-=0.8")
        .from("[data-hero-stage]", { opacity: 0, scale: 0.92, duration: 1.6 }, 0.1)
        .from("[data-hud]", { opacity: 0, y: 20, scale: 0.9, stagger: 0.15, duration: 0.9 }, "-=0.9")
        .from("[data-hero-stat]", { y: 40, opacity: 0, stagger: 0.08, duration: 1 }, "-=1")
        .to(sceneState.current, { open: 0.25, duration: 1.6, ease: "power3.inOut" }, "-=0.6");

      gsap.to("[data-hud]", { y: "+=10", duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.4 });

      gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } })
        .to("[data-hero-content]", { yPercent: -18, opacity: 0.2, ease: "none" }, 0)
        .to(sceneState.current, { open: 1, explode: 0.5, spin: 0.9, ease: "none" }, 0)
        .to("[data-hero-bg]", { yPercent: 18, scale: 1.08, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [loaded]);

  return (
    <section ref={root} className="noise relative min-h-[100svh] overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0 overflow-hidden">
        <img data-hero-bg src="/images/hero-factory.webp" alt="" className="h-full w-full scale-105 object-cover opacity-25" fetchPriority="high" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,transparent_0%,#070b12_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />
      <div className="grid-bg absolute inset-0" />
      <div className="absolute right-[10%] top-1/3 size-[520px] rounded-full bg-orange/20 blur-[160px]" />

      <div className="site-container relative grid min-h-[calc(100svh-8rem)] items-center gap-6 lg:grid-cols-[1fr_1.05fr]">
        <div data-hero-content className="relative z-10 pt-6 lg:pt-0">
          <p data-hero-eyebrow className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur">
            <ShieldCheck size={14} className="text-orange" /> ISO 9001:2015 certified panel builders
          </p>
          <h1 data-hero-title className="mt-7 text-[44px] font-bold leading-[0.98] sm:text-6xl lg:text-[84px]">
            <SplitText text="Engineering the" manual className="block" />
            <SplitText text="power behind" manual className="block text-gradient" />
            <SplitText text="Indian industry." manual className="block" />
          </h1>
          <p data-hero-copy className="mt-7 max-w-xl text-base leading-7 text-mist md:text-lg">
            LT, PCC, MCC, APFC and PLC automation panels designed, fabricated and tested under one roof, then commissioned on site by our own engineers.
          </p>
          <div data-hero-cta className="mt-9 flex flex-wrap gap-3">
            <MagneticButton to="/products">Explore products <ArrowRight size={16} /></MagneticButton>
            <MagneticButton to="/contact" variant="ghost">Request a quote</MagneticButton>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-7">
            {[["15+", "Years"], ["500+", "Projects"], ["12", "States"]].map(([v, k]) => (
              <div key={k} data-hero-stat>
                <dt className="sr-only">{k}</dt>
                <dd className="font-display text-3xl font-bold text-white md:text-4xl">{v}</dd>
                <p className="mt-1 text-xs uppercase tracking-[.18em] text-mist">{k}</p>
              </div>
            ))}
          </dl>
        </div>

        <div data-hero-stage className="relative h-[420px] sm:h-[520px] lg:h-[720px]">
          <ThreePanelScene model={heroProduct.model} code="PCC" stateRef={sceneState} className="absolute inset-0" label="3D model of a PCC power control centre panel" />
          {hud.map((h) => (
            <div key={h.k} data-hud className={`glass pointer-events-none absolute hidden rounded-2xl px-4 py-3 sm:block ${h.pos}`}>
              <p className="text-[10px] uppercase tracking-[.2em] text-mist">{h.k}</p>
              <p className="mt-1 font-display text-lg font-semibold text-white">{h.v}</p>
            </div>
          ))}
          <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[.25em] text-mist">Scroll to open the panel</p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <span className="grid size-12 place-items-center rounded-full border border-white/15 text-white"><ArrowDown size={18} className="animate-bounce" /></span>
      </div>
    </section>
  );
}
