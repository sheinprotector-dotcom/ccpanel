import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function initPageAnimations(root: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const q = gsap.utils.selector(root);

  q("[data-split]:not([data-split-manual])").forEach((el: HTMLElement) => {
    gsap.from(el.querySelectorAll(".split-inner"), {
      yPercent: 110,
      rotate: 4,
      duration: 1.1,
      ease: "expo.out",
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  q("[data-reveal]").forEach((el: HTMLElement) => {
    gsap.from(el, {
      y: Number(el.dataset.reveal) || 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: Number(el.dataset.delay) || 0,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  q("[data-stagger]").forEach((el: HTMLElement) => {
    gsap.from(el.children, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
    });
  });

  q("[data-img-reveal]").forEach((el: HTMLElement) => {
    const img = el.querySelector("img");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.3, ease: "expo.inOut" });
    if (img) tl.from(img, { scale: 1.3, duration: 1.6, ease: "expo.out" }, 0.2);
  });

  q("[data-parallax]").forEach((el: HTMLElement) => {
    const amount = Number(el.dataset.parallax) || 0.15;
    gsap.fromTo(el, { yPercent: -amount * 100 }, {
      yPercent: amount * 100,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
    });
  });

  q("[data-count]").forEach((el: HTMLElement) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? "";
    const counter = { v: 0 };
    gsap.to(counter, {
      v: end,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
      onUpdate: () => { el.textContent = `${Math.round(counter.v)}${suffix}`; },
    });
  });

  q("[data-line]").forEach((el: HTMLElement) => {
    gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
  });
}
