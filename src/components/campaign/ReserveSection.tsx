import { reserveStages } from '@/lib/noirea';
import bottleImage from '@/assets/noirea-bottle.webp';
import { BottleFigure, Eyebrow } from './parts';
import { riseLines, useSectionMotion } from './motion';

/** How the bottle is lit at each stage: dim and distant when aged, fully present when revealed. */
const grade = [
  { filter: 'brightness(0.32) saturate(0.7) blur(3px)', scale: 0.84, rotation: -5, x: -4, halo: 0 },
  { filter: 'brightness(0.55) saturate(0.85) blur(1.5px)', scale: 0.91, rotation: -2.5, x: -1, halo: 0.25 },
  { filter: 'brightness(0.86) saturate(1) blur(0px)', scale: 0.98, rotation: 1, x: 2, halo: 0.55 },
  { filter: 'brightness(1.12) saturate(1.1) blur(0px)', scale: 1.05, rotation: 0, x: 0, halo: 1 },
];

export function ReserveSection() {
  const ref = useSectionMotion<HTMLElement>((motion, root) => {
    const { gsap } = motion;
    const stages = gsap.utils.toArray<HTMLElement>('.reserve-stage', root);
    const arrows = gsap.utils.toArray<HTMLElement>('.stage-arrow i', root);
    const photo = root.querySelector<HTMLElement>('.reserve-figure .bottle-photo')!;
    const halo = root.querySelector<HTMLElement>('.reserve-light')!;
    const first = grade[0]!;

    riseLines(motion, root.querySelector('.reserve-title')!, { scrollTrigger: { trigger: root, start: 'top 60%', once: true } });
    gsap.set(stages, { opacity: 0.16 });
    gsap.set(arrows, { scaleY: 0 });
    gsap.set('.stage-line', { opacity: 0, y: 10 });
    gsap.set(photo, { filter: first.filter, scale: first.scale, rotation: first.rotation, xPercent: first.x });
    gsap.set(halo, { opacity: first.halo });

    const film = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1.1 } });
    stages.forEach((stage, index) => {
      const at = index * 2.4 + 0.6;
      const state = grade[index]!;
      if (index > 0) {
        film.to(arrows[index - 1]!, { scaleY: 1, duration: 0.9, ease: 'power1.out' }, at - 0.7);
        film.to(stages[index - 1]!, { opacity: 0.34, duration: 1 }, at);
        film.to(stages[index - 1]!.querySelector('.stage-line'), { opacity: 0, y: -8, duration: 0.8 }, at - 0.2);
      }
      film.to(stage, { opacity: 1, duration: 1.2 }, at);
      film.to(stage.querySelector('.stage-line'), { opacity: 1, y: 0, duration: 1.2 }, at + 0.3);
      film.to(photo, { filter: state.filter, scale: state.scale, rotation: state.rotation, xPercent: state.x, duration: 2, ease: 'power1.inOut' }, at - 0.4);
      film.to(halo, { opacity: state.halo, duration: 2 }, at - 0.4);
    });
    film.to({}, { duration: 0.01 }, 10.2);
  });

  return <section ref={ref} id="reserve" className="reserve pin-track" aria-labelledby="reserve-title">
    <div className="pin-stage">
      <div className="reserve-light" aria-hidden="true"/>
      <div className="reserve-copy section-shell">
        <Eyebrow>06 / THE RESERVE</Eyebrow>
        <h2 className="reserve-title" id="reserve-title">NOIRÉA <em>RESERVE</em></h2>
        <p className="reserve-sub">An expression of patience, depth and precision.</p>
        <ol className="reserve-sequence">{reserveStages.map((stage, index) => <li className="reserve-stage" key={stage.word}>
          <span className="stage-word">{stage.word}</span>
          <span className="stage-line">{stage.line}</span>
          {index < reserveStages.length - 1 && <span className="stage-arrow" aria-hidden="true"><i/></span>}
        </li>)}</ol>
      </div>
      <BottleFigure className="reserve-figure" src={bottleImage} alt="The NOIRÉA Reserve decanter, deep amber glass with a black-and-gold label" cursor="EXAMINE"/>
    </div>
  </section>;
}
