import pourVideo from '@/assets/noirea-pour.mp4';
import pourPoster from '@/assets/noirea-pour-poster.webp';
import { VideoPlate } from './parts';
import { useSectionMotion } from './motion';

/** A full-bleed film moment: a hairline of light widens like a shutter, the pour plays behind it, then the title arrives. */
export function MomentSection() {
  const ref = useSectionMotion<HTMLElement>(({ gsap, SplitText }, root) => {
    const frame = root.querySelector<HTMLElement>('.moment-frame')!;
    const plate = root.querySelector<HTMLElement>('.moment-frame .video-plate')!;
    const chars = SplitText.create('.moment-title', { type: 'words,chars', mask: 'chars' }).chars;

    gsap.set(frame, { clipPath: 'inset(48.6% 0% 48.6% 0%)' });
    gsap.set('.moment-hairline', { scaleX: 0, opacity: 1 });
    gsap.set(chars, { yPercent: 118 });
    gsap.set('.moment-kicker', { opacity: 0 });

    const film = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1.1 } });
    film.to('.moment-hairline', { scaleX: 1, duration: 1.2 }, 0)
      .to(frame, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2.6 }, 1)
      .to('.moment-hairline', { opacity: 0, duration: 0.8 }, 2.6)
      .fromTo(plate, { scale: 1.24 }, { scale: 1.02, duration: 6.4, ease: 'none' }, 1)
      .to('.moment-kicker', { opacity: 1, duration: 1 }, 3.2)
      .to(chars, { yPercent: 0, duration: 1.4, stagger: 0.045, ease: 'power3.out' }, 3.2)
      .to(frame, { opacity: 0, duration: 1.2 }, 6.6)
      .to('.moment-copy', { opacity: 0, duration: 0.9 }, 6.4)
      .to({}, { duration: 0.01 }, 7.79);
  });

  return <section ref={ref} id="moment" className="moment pin-track" aria-labelledby="moment-title">
    <div className="pin-stage">
      <div className="moment-frame">
        <VideoPlate className="moment-plate" src={pourVideo} poster={pourPoster} label="Whisky poured over ice into a crystal tumbler, in slow golden light"/>
        <div className="moment-scrim" aria-hidden="true"/>
      </div>
      <i className="moment-hairline" aria-hidden="true"/>
      <div className="moment-copy">
        <p className="moment-kicker eyebrow">NOIRÉA RESERVE</p>
        <h2 className="moment-title" id="moment-title">THE MOMENT OF REVELATION</h2>
      </div>
    </div>
  </section>;
}
