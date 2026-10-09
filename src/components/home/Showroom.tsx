import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Box, DoorOpen, Hand, Layers } from "lucide-react";
import { gsap } from "../../lib/motion";
import products from "../../data/products";
import ThreePanelScene, { type PanelSceneState } from "../ThreePanelScene";
import { SectionHeading } from "../kit";

export default function Showroom() {
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(false);
  const [exploded, setExploded] = useState(false);
  const sceneState = useRef<PanelSceneState>({ open: 0, explode: 0, spin: 0 });
  const infoRef = useRef<HTMLDivElement>(null);
  const product = products[active];

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setOpen(false);
    setExploded(false);
    gsap.to(sceneState.current, { open: 0, explode: 0, duration: 0.4 });
  };

  useLayoutEffect(() => {
    if (!infoRef.current) return;
    gsap.fromTo(infoRef.current.querySelectorAll("[data-info]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: "power3.out" });
  }, [active]);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    gsap.to(sceneState.current, { open: next ? 1 : 0, duration: 1.4, ease: "power3.inOut" });
  };
  const toggleExplode = () => {
    const next = !exploded;
    setExploded(next);
    gsap.to(sceneState.current, { open: next ? 1 : open ? 1 : 0, explode: next ? 1 : 0, duration: 1.4, ease: "power3.inOut" });
    if (next) setOpen(true);
  };

  return (
    <section className="section-padding relative overflow-hidden" id="showroom">
      <div className="absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[160px]" />
      <div className="site-container relative">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Interactive 3D showroom" title="Inspect every panel from every angle." text="Drag to rotate, open the doors and explode the internals. Every model is generated live in your browser." />
          <p className="flex items-center gap-2 text-sm text-mist" data-reveal="20"><Hand size={16} className="text-orange" /> Drag the model to rotate</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[280px_1fr_320px]">
          <div className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:max-h-[640px] lg:flex-col lg:overflow-y-auto lg:px-0 lg:pr-1" role="tablist" aria-label="Choose a product" data-reveal="30">
            {products.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={active === i}
                onClick={() => select(i)}
                className={`group flex shrink-0 items-center gap-3 rounded-2xl border p-2.5 pr-4 text-left transition duration-300 ${active === i ? "border-orange bg-orange/10" : "border-line bg-panel hover:border-white/20"}`}
              >
                <img src={p.image} alt="" className="size-12 rounded-xl object-cover" loading="lazy" />
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[.16em] text-orange">{String(i + 1).padStart(2, "0")}</span>
                  <span className="block whitespace-nowrap text-sm font-semibold text-white">{p.name}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="stage-frame relative h-[440px] overflow-hidden rounded-[28px] border border-line sm:h-[560px] lg:h-[640px]" data-reveal="40">
            <ThreePanelScene model={product.model} code={product.slug.slice(0, 3).toUpperCase()} interactive autoRotate stateRef={sceneState} className="absolute inset-0" label={`Interactive 3D model of ${product.name}`} />
            <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.2em] text-white backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-green-400" /> Live render
            </div>
            <div className="absolute inset-x-4 bottom-4 flex flex-wrap justify-center gap-2">
              <button onClick={toggleOpen} aria-pressed={open} className={`chip glass flex items-center gap-2 ${open ? "chip-active" : ""}`}><DoorOpen size={15} /> {open ? "Close doors" : "Open doors"}</button>
              <button onClick={toggleExplode} aria-pressed={exploded} className={`chip glass flex items-center gap-2 ${exploded ? "chip-active" : ""}`}><Layers size={15} /> Exploded view</button>
            </div>
          </div>

          <div ref={infoRef} className="card flex flex-col p-6 md:p-7" data-reveal="50">
            <p data-info className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.2em] text-orange"><Box size={14} /> {product.category}</p>
            <h3 data-info className="mt-3 text-3xl font-bold">{product.name}</h3>
            <p data-info className="mt-3 text-sm leading-6 text-mist">{product.shortDescription}</p>
            <dl data-info className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {Object.entries(product.specifications).slice(0, 5).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-mist">{k}</dt>
                  <dd className="text-right font-semibold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div data-info className="mt-auto flex flex-col gap-2 pt-6">
              <Link to={`/products/${product.slug}`} className="btn-primary">Full specifications <ArrowUpRight size={16} /></Link>
              <Link to="/contact" className="btn-ghost">Get a quote</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
