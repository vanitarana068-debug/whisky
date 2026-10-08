import glassImage from '@/assets/noirea-glass.webp';
import { BrandSymbol, CTA } from './parts';
import { useSectionMotion } from './motion';

/** Almost total black. One glass, a little light passing through it, one sentence, one invitation — then the mark. */
export function FinaleSection() {
  const ref = useSectionMotion<HTMLElement>(({ gsap, SplitText }, root) => {
    const lines = SplitText.create('.finale-title', { type: 'lines', mask: 'lines' }).lines;
    gsap.set('.finale-glass', { opacity: 0, scale: 1.1 });
    gsap.set(lines, { yPercent: 112 });
    gsap.set('.finale-cta', { opacity: 0, y: 16 });
    gsap.set('.finale-logo', { opacity: 0, y: 14, letterSpacing: '0.5em' });
    gsap.set('.finale-logo .brand-symbol', { filter: 'drop-shadow(0 0 0 rgba(230,170,80,0))' });

    const film = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1.1 } });
    film.to('.finale-glass', { opacity: 1, scale: 1, duration: 1.8 }, 0.1)
      .to(lines, { yPercent: 0, duration: 1.4, stagger: 0.6, ease: 'power3.out' }, 1.6)
      .to('.finale-cta', { opacity: 1, y: 0, duration: 0.9 }, 2.8)
      .to('.finale-logo', { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 1.6 }, 4.4)
      .to('.finale-logo .brand-symbol', { filter: 'drop-shadow(0 0 14px rgba(230,170,80,.55))', duration: 1.4 }, 5.2)
      .to({}, { duration: 0.01 }, 7.99);
  });

  return <section ref={ref} className="finale pin-track" aria-labelledby="finale-title">
    <div className="pin-stage">
      <div className="finale-glass">
        <img src={glassImage} alt="A crystal tumbler of amber whisky with a single ice cube, lit softly from behind in near darkness" width={810} height={850} loading="lazy" decoding="async"/>
        <i className="finale-beam" aria-hidden="true"/>
      </div>
      <div className="finale-copy">
        <h2 className="finale-title" id="finale-title">SOME SPIRITS ARE TASTED.<br/><em>OTHERS ARE REMEMBERED.</em></h2>
        <div className="finale-cta"><CTA target="#collection">DISCOVER NOIRÉA</CTA></div>
      </div>
      <div className="finale-logo"><BrandSymbol/><span className="brand-name">NOIRÉA</span></div>
    </div>
  </section>;
}
