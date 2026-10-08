import { useEffect, useRef, useState } from 'react';
import { pourPhases } from '@/lib/noirea';
import scrubVideo from '@/assets/noirea-pour-scrub.mp4';
import pourPoster from '@/assets/noirea-pour-poster.webp';
import { Eyebrow, VideoPlate } from './parts';
import { motionAllowed, riseLines, trackProgress, useSectionMotion } from './motion';

/** The footage is mapped to scroll: tilt, pour, splash, settle and the slow move toward the filled glass all follow the reader's hand. */
export function PourSection() {
  const video = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState(0);

  // Without motion, rest on the finished pour rather than the first frame.
  useEffect(() => {
    const clip = video.current;
    if (!clip || motionAllowed()) return;
    const settle = () => { clip.currentTime = Math.max(0, clip.duration - 0.1); };
    if (clip.readyState >= 1) settle(); else clip.addEventListener('loadedmetadata', settle, { once: true });
    return () => clip.removeEventListener('loadedmetadata', settle);
  }, []);

  const ref = useSectionMotion<HTMLElement>((motion, root) => {
    const { gsap } = motion;
    const clip = video.current!;
    riseLines(motion, root.querySelector('.pour-title')!, { scrollTrigger: { trigger: root, start: 'top 60%', once: true } });
    gsap.from('.pour-copy .eyebrow, .pour-phases', { opacity: 0, y: 16, duration: 1.4, delay: 0.5, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 60%', once: true } });

    let target = 0; let shown = 0;
    trackProgress(motion, root, progress => {
      // Short holds at both ends so the first and last frames get a moment of stillness.
      target = Math.min(1, Math.max(0, (progress - 0.06) / 0.86));
      root.style.setProperty('--pour', progress.toFixed(4));
      setPhase(target < 0.3 ? 0 : target < 0.66 ? 1 : 2);
    });
    const tick = () => {
      shown += (target - shown) * 0.12;
      const time = shown * Math.max(0, (clip.duration || 0) - 0.04);
      if (clip.readyState >= 2 && !clip.seeking && Math.abs(clip.currentTime - time) > 0.018) clip.currentTime = time;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return <section ref={ref} id="pour" className="pour pin-track" aria-labelledby="pour-title">
    <div className="pin-stage">
      <VideoPlate className="pour-plate" mode="scrub" videoRef={video} src={scrubVideo} poster={pourPoster} label="Amber whisky pouring from a NOIRÉA decanter over a single ice cube into a crystal tumbler"/>
      <div className="pour-bloom" aria-hidden="true"/>
      <div className="pour-copy section-shell">
        <Eyebrow>05 / THE POUR</Eyebrow>
        <h2 className="section-title pour-title" id="pour-title">THE ART<br/>OF THE <em>POUR.</em></h2>
        <ol className="pour-phases" aria-label="Stages of the pour">{pourPhases.map((item, index) => <li key={item.label} className={index === phase ? 'is-active' : ''} aria-current={index === phase ? 'step' : undefined}><span>{item.numeral}</span><div><strong>{item.label}</strong><em>{item.line}</em></div></li>)}</ol>
      </div>
      <div className="pour-rail" aria-hidden="true"><i/></div>
    </div>
  </section>;
}
