import { useLayoutEffect, useRef } from "react";
import { Zap } from "lucide-react";
import { gsap, ScrollTrigger } from "../../lib/motion";

export default function Marquee({ items, tone = "light" }: { items: string[]; tone?: "light" | "orange" }) {
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const loop = gsap.to(el, { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity() / 300;
          gsap.to(loop, { timeScale: gsap.utils.clamp(-6, 6, 1 + Math.abs(v)) * (self.direction === -1 ? -1 : 1), duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: self.direction === -1 ? -1 : 1, duration: 1.2, delay: 0.3 });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden border-y py-6 md:py-8 ${tone === "orange" ? "-rotate-1 border-orange bg-orange" : "border-line bg-panel/60"}`}>
      <div ref={track} className="flex w-max items-center gap-10 whitespace-nowrap md:gap-14">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className={`flex items-center gap-10 font-display text-2xl font-semibold md:gap-14 md:text-5xl ${tone === "orange" ? "text-white" : i % 2 ? "stroke-text" : "text-white"}`}>
            {item}
            <Zap size={26} className={tone === "orange" ? "text-ink" : "text-orange"} fill="currentColor" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
