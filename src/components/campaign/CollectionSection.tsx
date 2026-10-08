import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { expressions } from '@/lib/noirea';
import bottleReserve from '@/assets/noirea-bottle.webp';
import bottleOriginal from '@/assets/noirea-bottle-original.webp';
import bottleEdition from '@/assets/noirea-bottle-edition.webp';
import { BottleFigure, Eyebrow } from './parts';
import { riseLines, useSectionMotion } from './motion';

const bottles: Record<(typeof expressions)[number]['id'], string> = { original: bottleOriginal, reserve: bottleReserve, edition: bottleEdition };

/** A horizontal reel: one large bottle per frame, neighbours receding into the dark. Drag, swipe, scroll sideways or use the arrows. */
export function CollectionSection({ onDiscover }: { onDiscover: (index: number) => void }) {
  const reel = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const ref = useSectionMotion<HTMLElement>((motion, root) => {
    riseLines(motion, root.querySelector('.collection-title')!, { scrollTrigger: { trigger: root, start: 'top 75%', once: true } });
  });

  useEffect(() => {
    const track = reel.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    let frame = 0; let dragging = false; let startX = 0; let startLeft = 0;
    const update = () => {
      frame = 0;
      const middle = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0; let best = Infinity;
      slides.forEach((slide, i) => {
        const offset = (slide.offsetLeft + slide.offsetWidth / 2 - middle) / slide.offsetWidth;
        slide.style.setProperty('--o', offset.toFixed(3));
        slide.style.setProperty('--a', Math.min(1, Math.abs(offset)).toFixed(3));
        if (Math.abs(offset) < best) { best = Math.abs(offset); nearest = i; }
      });
      setIndex(nearest);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const settle = () => {
      const middle = track.scrollLeft + track.clientWidth / 2;
      const distance = (slide: HTMLElement) => Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
      const nearest = slides.reduce((closest, slide) => (distance(slide) < distance(closest) ? slide : closest));
      track.scrollTo({ left: nearest.offsetLeft - (track.clientWidth - nearest.offsetWidth) / 2, behavior: 'smooth' });
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || (event.target as Element).closest('button, a')) return;
      dragging = true; startX = event.clientX; startLeft = track.scrollLeft;
      track.classList.add('is-dragging'); track.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => { if (dragging) track.scrollLeft = startLeft - (event.clientX - startX); };
    const up = () => { if (!dragging) return; dragging = false; track.classList.remove('is-dragging'); settle(); };
    track.addEventListener('scroll', schedule, { passive: true });
    track.addEventListener('pointerdown', down); track.addEventListener('pointermove', move);
    track.addEventListener('pointerup', up); track.addEventListener('pointercancel', up);
    window.addEventListener('resize', schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule); track.removeEventListener('pointerdown', down); track.removeEventListener('pointermove', move);
      track.removeEventListener('pointerup', up); track.removeEventListener('pointercancel', up); window.removeEventListener('resize', schedule);
    };
  }, []);

  const goTo = (target: number) => {
    const track = reel.current;
    const slide = track?.children[(target + expressions.length) % expressions.length] as HTMLElement | undefined;
    if (track && slide) track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: 'smooth' });
  };

  return <section ref={ref} className="collection" id="collection" aria-labelledby="collection-title">
    <div className="collection-heading section-shell">
      <div><Eyebrow>10 / THE COLLECTION</Eyebrow><h2 className="section-title collection-title" id="collection-title">THREE EXPRESSIONS.<br/>ONE <em>SOUL.</em></h2></div>
      <p className="collection-count" aria-live="polite">0{index + 1}<span> / 0{expressions.length}</span></p>
    </div>
    <div className="collection-reel" ref={reel} role="group" aria-roledescription="carousel" aria-label="NOIRÉA expressions" tabIndex={0} data-cursor="DRAG" data-lenis-prevent-wheel>
      {expressions.map((expression, i) => <article className="collection-slide" key={expression.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${expressions.length}: NOIRÉA ${expression.name}`}>
        <p className="slide-ghost" aria-hidden="true">{expression.name.toUpperCase()}</p>
        <div className="slide-info slide-info-left"><Eyebrow line={false}>{expression.edition}</Eyebrow><h3>NOIRÉA<br/><em>{expression.name}</em></h3></div>
        <BottleFigure className="slide-figure" src={bottles[expression.id]} alt={`The NOIRÉA ${expression.name} decanter, an original concept bottle`} cursor="EXAMINE"/>
        <div className="slide-info slide-info-right"><p className="collection-age">{expression.age}</p><p className="slide-notes">{expression.aroma}</p><Button variant="editorial" onClick={() => onDiscover(i)} data-cursor="DISCOVER">DISCOVER <ArrowRight/></Button></div>
      </article>)}
    </div>
    <div className="collection-controls section-shell">
      <div className="reel-progress" aria-hidden="true"><i style={{ transform: `scaleX(${(index + 1) / expressions.length})` }}/></div>
      <div className="collection-arrows"><Button variant="navigation" aria-label="Previous expression" onClick={() => goTo(index - 1)}><ArrowLeft/></Button><Button variant="navigation" aria-label="Next expression" onClick={() => goTo(index + 1)}><ArrowRight/></Button></div>
    </div>
  </section>;
}
