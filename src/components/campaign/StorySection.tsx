import { storyWords } from '@/lib/noirea';
import originImage from '@/assets/noirea-highlands.webp';
import distilleryImage from '@/assets/noirea-distillery.webp';
import bottleImage from '@/assets/noirea-bottle.webp';
import { Eyebrow } from './parts';
import { useSectionMotion } from './motion';

const backdrops = [originImage, distilleryImage, bottleImage];

/** One continuous beat: the title lifts away, then three words arrive one at a time while the world behind them changes. */
export function StorySection() {
  const ref = useSectionMotion<HTMLElement>(({ gsap, SplitText }, root) => {
    const head = root.querySelector<HTMLElement>('.story-head')!;
    const stage = root.querySelector<HTMLElement>('.pin-stage')!;
    const words = gsap.utils.toArray<HTMLElement>('.story-word', root);
    const layers = gsap.utils.toArray<HTMLElement>('.story-layer', root);
    const title = SplitText.create('.story-title', { type: 'words,chars', mask: 'chars' });
    const splits = words.map(word => SplitText.create(word, { type: 'chars', mask: 'chars' }));

    gsap.set(head, { yPercent: -50 });
    gsap.set(layers, { opacity: 0 });
    gsap.set('.story-line', { opacity: 0, y: 18 });
    splits.forEach(split => gsap.set(split.chars, { yPercent: 118 }));

    gsap.from(title.chars, { yPercent: 118, duration: 2, stagger: 0.045, ease: 'power4.out', scrollTrigger: { trigger: root, start: 'top 55%', once: true } });

    const film = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 1.1, invalidateOnRefresh: true } });
    film.fromTo(layers, { scale: 1.16 }, { scale: 1, duration: 10, ease: 'none' }, 0);
    film.to(head, { y: () => -(stage.clientHeight * 0.5 - Math.max(214, stage.clientHeight * 0.235)), scale: 0.36, duration: 1.5 }, 0.7);
    words.forEach((word, index) => {
      const at = 2.2 + index * 2;
      film.to(splits[index]!.chars, { yPercent: 0, duration: 1.5, stagger: 0.07, ease: 'power3.out' }, at);
      film.to(layers[index]!, { opacity: 1, duration: 1.8 }, at - 0.3);
      if (index > 0) {
        film.to(words[index - 1]!, { opacity: 0.2, duration: 1.1 }, at);
        film.to(layers[index - 1]!, { opacity: 0, duration: 1.8 }, at - 0.3);
      }
    });
    film.to('.story-line', { opacity: 1, y: 0, duration: 1.2 }, 8.5);
    film.to({}, { duration: 0.01 }, 9.99);
  });

  return <section ref={ref} id="story" className="story pin-track" aria-labelledby="story-title">
    <div className="pin-stage">
      <div className="story-bg" aria-hidden="true">
        {backdrops.map((src, index) => <div className="story-layer" key={index}><img src={src} alt="" width={1536} height={1024} loading="lazy" decoding="async"/></div>)}
        <div className="story-vignette"/>
      </div>
      <div className="story-kicker"><Eyebrow>03 / THE BELIEF</Eyebrow></div>
      <div className="story-head section-shell">
        <h2 className="story-title" id="story-title">CRAFTED BEYOND<br/><em>TIME.</em></h2>
      </div>
      <div className="story-body section-shell">
        <ol className="story-words">{storyWords.map(word => <li className="story-word" key={word}>{word}</li>)}</ol>
        <p className="story-line">An imagined house, built on three quiet truths.</p>
      </div>
    </div>
  </section>;
}
