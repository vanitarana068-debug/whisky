import heroImage from '@/assets/noirea-campaign.webp';
import { CTA, Eyebrow } from './parts';
import { finePointer, useSectionMotion } from './motion';

/** [left %, top %, size px, depth layer, delay s, duration s] — fixed so server and client render the same markup. */
const motes = [
  [8, 72, 2, 0, 0, 22], [18, 30, 3, 1, 4, 26], [27, 82, 2, 0, 9, 24], [36, 18, 2, 2, 2, 30], [44, 58, 3, 1, 7, 28], [52, 86, 2, 0, 12, 23],
  [58, 24, 4, 2, 5, 32], [64, 70, 2, 1, 10, 27], [71, 40, 3, 0, 1, 25], [78, 12, 2, 2, 8, 29], [84, 64, 3, 1, 3, 26], [90, 34, 2, 0, 11, 24],
  [94, 78, 4, 2, 6, 31], [14, 52, 2, 2, 13, 28], [48, 38, 2, 1, 14, 24], [62, 90, 3, 0, 2, 27], [88, 14, 2, 1, 9, 22], [4, 18, 3, 0, 15, 30],
] as const;
const layerDepth = [0.5, 1, 2];

export function HeroReveal() {
  const ref = useSectionMotion<HTMLElement>(({ gsap }, root) => {
    const find = (selector: string) => root.querySelector<HTMLElement>(selector)!;
    const plate = find('.hero-plate');
    const scroller = find('.hero-scroll');
    const glass = find('.hero-glass');
    const layers = gsap.utils.toArray<HTMLElement>('.dust-layer', root);
    const teardown: (() => void)[] = [];

    gsap.from('.hero-content > *', { y: 18, opacity: 0, duration: 1.4, stagger: 0.16, delay: 0.7, ease: 'power2.out' });
    gsap.from('.hero-plate img', { opacity: 0, scale: 1.05, duration: 2.6, delay: 0.35, ease: 'power2.out' });
    gsap.from('.dust-layer', { opacity: 0, duration: 3, delay: 1.4, stagger: 0.4 });

    // The bottle drifts toward the viewer and its reflections cross the glass as the page scrolls away.
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 1.4 } })
      .fromTo(scroller, { scale: 1.06, yPercent: 0, rotationY: 0 }, { scale: 1.2, yPercent: 7, rotationY: -4, transformPerspective: 1500, transformOrigin: '72% 50%' }, 0)
      .fromTo(glass, { '--sx': 18 }, { '--sx': 88 }, 0)
      .to(find('.hero-content'), { yPercent: -14, opacity: 0 }, 0)
      .to(find('.hero-meta'), { opacity: 0 }, 0)
      .to(layers, { yPercent: (index: number) => -22 * (index + 1) }, 0);

    // Pointer-driven depth: each layer travels a different distance, so the bottle reads as sitting in space.
    if (finePointer()) {
      gsap.set(plate, { transformPerspective: 1500, transformOrigin: '70% 50%' });
      const move = {
        x: gsap.quickTo(plate, 'x', { duration: 2.2, ease: 'power3.out' }),
        y: gsap.quickTo(plate, 'y', { duration: 2.2, ease: 'power3.out' }),
        ry: gsap.quickTo(plate, 'rotationY', { duration: 2.4, ease: 'power3.out' }),
        rx: gsap.quickTo(plate, 'rotationX', { duration: 2.4, ease: 'power3.out' }),
        glassX: gsap.quickTo(glass, 'x', { duration: 2.6, ease: 'power3.out' }),
        streak: gsap.quickTo(glass, '--px', { duration: 1.8, ease: 'power3.out' }),
        dust: layers.map((layer, index) => ({ x: gsap.quickTo(layer, 'x', { duration: 2.8, ease: 'power3.out' }), y: gsap.quickTo(layer, 'y', { duration: 2.8, ease: 'power3.out' }), depth: layerDepth[index] ?? 1 })),
      };
      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        move.x(nx * -26); move.y(ny * -14); move.ry(nx * 4); move.rx(ny * -2.5);
        move.glassX(nx * -10); move.streak(nx * 70);
        move.dust.forEach(({ x, y, depth }) => { x(nx * -depth * 36); y(ny * -depth * 22); });
      };
      root.addEventListener('pointermove', onMove, { passive: true });
      teardown.push(() => root.removeEventListener('pointermove', onMove));
    }
    return () => teardown.forEach(off => off());
  });

  return <section ref={ref} className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-stage">
      <div className="hero-fit">
        <div className="hero-scroll">
          <div className="hero-plate">
            <img className="hero-media" src={heroImage} width={1536} height={1024} fetchPriority="high" alt="An original NOIRÉA Reserve bottle revealed by warm light against a black stone backdrop"/>
            <div className="hero-glass bottle-glass" aria-hidden="true"><i className="glass-streak"/><i className="glass-amber"/></div>
            <i className="hero-floor" aria-hidden="true"/>
          </div>
        </div>
      </div>
    </div>
    <div className="hero-dust" aria-hidden="true">
      {layerDepth.map((_, layer) => <div className="dust-layer" key={layer}>{motes.filter(mote => mote[3] === layer).map(([left, top, size, , delay, duration]) => <i key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `-${delay}s`, animationDuration: `${duration}s` }}/>)}</div>)}
    </div>
    <div className="hero-content section-shell"><Eyebrow>A STUDY IN PATIENCE</Eyebrow><h1 id="hero-title">CRAFTED<br/>BEYOND <em>TIME.</em></h1><p className="editorial-copy">An expression of patience, precision,<br/>and uncompromising craft.</p><div className="hero-actions"><CTA target="#craft">DISCOVER THE CRAFT</CTA><CTA target="#collection" secondary>EXPLORE THE COLLECTION</CTA></div></div>
    <div className="hero-meta"><a href="#reveal" className="scroll-prompt"><span className="scroll-line"/><span>SCROLL TO DISCOVER</span></a><span className="hero-edition"><strong>NOIRÉA RESERVE</strong><br/>A FICTIONAL SINGLE MALT WHISKY</span></div>
  </section>;
}
