import { useEffect, useRef, type RefObject } from 'react';
import type Lenis from 'lenis';

export type Motion = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  SplitText: typeof import('gsap/SplitText').SplitText;
};

let loading: Promise<Motion> | undefined;
let lenis: Lenis | null = null;

export const motionAllowed = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(pointer: fine)').matches;

/** Loads GSAP once. Setting data-motion lets the stylesheet switch from the static layout to the pinned film layout. */
export function loadMotion() {
  loading ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
    Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]),
  ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    document.documentElement.dataset['motion'] = 'on';
    return { gsap, ScrollTrigger, SplitText };
  });
  return loading;
}

/** Lenis drives the page scroll; GSAP's ticker feeds it so scrubbed timelines stay in lockstep. */
export async function startSmoothScroll({ gsap, ScrollTrigger }: Motion) {
  const { default: LenisCtor } = await import('lenis');
  const instance = new LenisCtor({ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: -88, duration: 1.8 }, autoRaf: false });
  instance.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => instance.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis = instance;
  return () => { gsap.ticker.remove(tick); instance.destroy(); lenis = null; };
}

export const smoothScroll = {
  to(top: number) {
    if (lenis) lenis.scrollTo(top, { duration: 1.8 });
    else window.scrollTo({ top, behavior: 'smooth' });
  },
  stop: () => lenis?.stop(),
  start: () => lenis?.start(),
};

/** Runs `setup` once GSAP is ready, scoped to the returned ref and fully reverted on unmount. Skipped for reduced motion. */
export function useSectionMotion<T extends HTMLElement>(setup: (motion: Motion, root: T) => void | (() => void)) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!motionAllowed()) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    let teardown: void | (() => void);
    loadMotion().then(motion => {
      const root = ref.current;
      if (cancelled || !root) return;
      context = motion.gsap.context(() => { teardown = setup(motion, root); }, root);
    });
    return () => { cancelled = true; teardown?.(); context?.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/** Scroll progress (0–1) across a tall track whose stage is `position: sticky`. */
export function trackProgress({ ScrollTrigger }: Motion, track: Element, onUpdate: (progress: number) => void) {
  return ScrollTrigger.create({ trigger: track, start: 'top top', end: 'bottom bottom', onUpdate: self => onUpdate(self.progress), onRefresh: self => onUpdate(self.progress) });
}

/** Cursor- and hover-driven depth for a `.bottle-figure`: slow rotation plus a reflection streak that follows the pointer. */
export function useGlassTilt(ref: RefObject<HTMLElement | null>, range = 7) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || !finePointer()) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    loadMotion().then(({ gsap }) => {
      const tilt = el.querySelector<HTMLElement>('[data-tilt]');
      if (cancelled || !tilt) return;
      gsap.set(tilt, { transformPerspective: 1100, transformOrigin: '50% 55%' });
      const rotateY = gsap.quickTo(tilt, 'rotationY', { duration: 1.6, ease: 'power3.out' });
      const rotateX = gsap.quickTo(tilt, 'rotationX', { duration: 1.6, ease: 'power3.out' });
      const liftX = gsap.quickTo(tilt, 'scaleX', { duration: 1.4, ease: 'power3.out' });
      const liftY = gsap.quickTo(tilt, 'scaleY', { duration: 1.4, ease: 'power3.out' });
      const streak = gsap.quickTo(el, '--px', { duration: 1.3, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        rotateY(x * range * 2); rotateX(-y * range); liftX(1.025); liftY(1.025); streak(x * 90);
      };
      const leave = () => { rotateY(0); rotateX(0); liftX(1); liftY(1); streak(0); };
      el.addEventListener('pointermove', move, { passive: true });
      el.addEventListener('pointerleave', leave);
      dispose = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.killTweensOf([tilt, el]); };
    });
    return () => { cancelled = true; dispose?.(); };
  }, [ref, range]);
}

/** Splits a heading into masked lines that rise into place. */
export function riseLines({ gsap, SplitText }: Motion, el: Element, vars: gsap.TweenVars = {}) {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
  return gsap.from(split.lines, { yPercent: 112, duration: 1.8, ease: 'power4.out', stagger: 0.14, ...vars });
}
