import { useState } from 'react';
import { tastingMoments } from '@/lib/noirea';
import { Eyebrow } from './parts';
import { riseLines, smoothScroll, trackProgress, useSectionMotion } from './motion';

/** [left %, delay s, duration s, size px] — fixed so server and client render the same markup. */
const embers = [[6, 0, 17, 2], [14, 5, 21, 3], [23, 11, 18, 2], [31, 3, 24, 3], [40, 8, 19, 2], [48, 14, 22, 4], [56, 2, 20, 2], [64, 9, 25, 3], [72, 6, 18, 2], [80, 13, 23, 3], [88, 4, 19, 2], [95, 10, 26, 4]] as const;

/** Three held breaths — aroma, palate, finish — each one relights the room behind it. */
export function TastingSection() {
  const [active, setActive] = useState(0);
  const ref = useSectionMotion<HTMLElement>((motion, root) => {
    riseLines(motion, root.querySelector('.taste-title')!, { scrollTrigger: { trigger: root, start: 'top 60%', once: true } });
    trackProgress(motion, root, progress => setActive(progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2));
  });

  const jumpTo = (index: number) => {
    const track = ref.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    smoothScroll.to(top + (track.offsetHeight - window.innerHeight) * ((index + 0.5) / tastingMoments.length));
  };

  return <section ref={ref} id="tasting" className="tasting pin-track" data-active={active} aria-labelledby="tasting-title">
    <div className="pin-stage">
      <div className="taste-atmos" aria-hidden="true">
        <i className="taste-blob blob-a"/><i className="taste-blob blob-b"/><i className="taste-blob blob-c"/>
        <div className="taste-embers">{embers.map(([left, delay, duration, size]) => <i key={left} style={{ left: `${left}%`, width: size, height: size, animationDelay: `-${delay}s`, animationDuration: `${duration}s` }}/>)}</div>
      </div>
      <div className="taste-head section-shell">
        <Eyebrow>07 / THE TASTING</Eyebrow>
        <h2 className="taste-title" id="tasting-title">THE SLOW<br/><em>UNFOLDING.</em></h2>
        <ol className="taste-index" aria-label="Tasting stages">{tastingMoments.map((moment, index) => <li key={moment.key}><button type="button" className={index === active ? 'is-active' : ''} aria-current={index === active ? 'step' : undefined} onClick={() => jumpTo(index)} data-cursor="TASTE"><span>0{index + 1}</span>{moment.label}</button></li>)}</ol>
      </div>
      <div className="taste-stage section-shell">
        {tastingMoments.map((moment, index) => <article className={`taste-pane ${index === active ? 'is-active' : ''}`} key={moment.key} aria-label={moment.label}>
          <h3>{moment.label}</h3>
          <ul className="taste-notes">{moment.notes.map((note, i) => <li key={note} style={{ ['--i' as string]: i }}>{note}</li>)}</ul>
          <p>{moment.line}</p>
        </article>)}
      </div>
    </div>
  </section>;
}
