import { useLayoutEffect, useRef } from "react";
import { gsap } from "../../lib/motion";
import products from "../../data/products";
import ThreePanelScene, { type PanelSceneState } from "../ThreePanelScene";

const model = products.find((p) => p.slug === "lt-control-panel")!.model;

const steps = [
  { n: "01", title: "2mm CRCA enclosure", text: "CNC punched, bent and welded sheet steel with 7-tank pre-treatment and 60 micron powder coating." },
  { n: "02", title: "Hinged, gasketed doors", text: "Neoprene gaskets and concealed hinges deliver IP54 to IP65 protection against dust and water." },
  { n: "03", title: "Switchgear & copper busbar", text: "Electrolytic-grade copper busbars, sleeved and supported on SMC insulators, rated up to 6300A." },
  { n: "04", title: "Dressed, ferruled wiring", text: "Every conductor ferruled, lugged and routed in PVC ducts, then HV and IR tested before dispatch." },
];

export default function Anatomy() {
  const root = useRef<HTMLElement>(null);
  const sceneState = useRef<PanelSceneState>({ open: 0, explode: 0, spin: 0 });

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");
      gsap.set(items, { opacity: 0.25 });
      gsap.set(items[0], { opacity: 1 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: "+=260%", scrub: 1, pin: true, anticipatePin: 1 },
      });
      tl.to(sceneState.current, { spin: 0.7, duration: 1, ease: "power1.inOut" })
        .to(items[0], { opacity: 0.25, duration: 0.2 }, 0.8)
        .to(items[1], { opacity: 1, duration: 0.2 }, 0.8)
        .to(sceneState.current, { open: 1, spin: 0.2, duration: 1, ease: "power2.inOut" }, 1)
        .to(items[1], { opacity: 0.25, duration: 0.2 }, 1.8)
        .to(items[2], { opacity: 1, duration: 0.2 }, 1.8)
        .to(sceneState.current, { explode: 0.6, spin: -0.4, duration: 1, ease: "power2.inOut" }, 2)
        .to(items[2], { opacity: 0.25, duration: 0.2 }, 2.8)
        .to(items[3], { opacity: 1, duration: 0.2 }, 2.8)
        .to(sceneState.current, { explode: 1, spin: 0.5, duration: 1, ease: "power2.inOut" }, 3)
        .to("[data-progress]", { scaleY: 1, ease: "none", duration: 4 }, 0);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex h-[100svh] items-center overflow-hidden bg-panel">
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="absolute bottom-0 left-1/3 size-[600px] rounded-full bg-orange/10 blur-[160px]" />
      <div className="site-container relative grid h-full items-center gap-4 py-20 lg:grid-cols-[1fr_1.2fr] lg:py-0">
        <div className="order-2 lg:order-1">
          <p className="eyebrow">Anatomy of a Powertech panel</p>
          <h2 className="section-title mt-4 hidden md:block">Built layer by layer, tested part by part.</h2>
          <div className="relative mt-6 flex gap-5 md:mt-10">
            <div className="relative w-px shrink-0 bg-line"><div data-progress className="absolute inset-0 origin-top scale-y-0 bg-orange" /></div>
            <ol className="space-y-4 md:space-y-7">
              {steps.map((s) => (
                <li key={s.n} data-step>
                  <p className="font-display text-xs font-semibold text-orange">{s.n}</p>
                  <h3 className="mt-1 text-lg font-semibold md:text-2xl">{s.title}</h3>
                  <p className="mt-1 hidden max-w-md text-sm leading-6 text-mist md:block">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative order-1 h-[42svh] lg:order-2 lg:h-[80svh]">
          <ThreePanelScene model={model} code="LT" stateRef={sceneState} className="absolute inset-0" label="3D LT panel opening to reveal its internal components" />
        </div>
      </div>
    </section>
  );
}
