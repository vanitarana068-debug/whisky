import { useEffect, useRef, useState, type RefObject } from 'react';
import { ArrowRight, ArrowLeft, ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { craftSteps, expressions } from '@/lib/noirea';
import originImage from '@/assets/noirea-highlands.webp';
import bottleImage from '@/assets/noirea-bottle.webp';
import distilleryImage from '@/assets/noirea-distillery.webp';
import bottleOriginal from '@/assets/noirea-bottle-original.webp';
import bottleEdition from '@/assets/noirea-bottle-edition.webp';
import { BottleFigure, Brand, BrandSymbol, CTA, Eyebrow } from './parts';
import { loadMotion, motionAllowed, smoothScroll, startSmoothScroll } from './motion';
import { HeroReveal } from './Hero';
import { StorySection } from './StorySection';
import { PourSection } from './PourSection';
import { ReserveSection } from './ReserveSection';
import { TastingSection } from './TastingSection';
import { MomentSection } from './MomentSection';
import { CollectionSection } from './CollectionSection';
import { FinaleSection } from './FinaleSection';

export { BrandSymbol };

const dialogBottles = { original: bottleOriginal, reserve: bottleImage, edition: bottleEdition } as const;

function Navbar({ onJournal }: { onJournal: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 70);
    handle(); window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);
  const close = () => menuRef.current?.close();
  return <>
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}><Brand link/><nav aria-label="Main navigation" className="desktop-nav">
      <Button asChild variant="navigation"><a href="#origin">Story</a></Button>
      <Button asChild variant="navigation"><a href="#craft">Craft</a></Button>
      <Button asChild variant="navigation"><a href="#collection">Collection</a></Button>
      <Button variant="navigation" onClick={onJournal}>Journal</Button>
      <Button asChild variant="navigation" className="nav-discover"><a href="#collection">Discover <ArrowUpRight size={12}/></a></Button>
    </nav><Button variant="navigation" className="menu-trigger" aria-label="Open menu" onClick={() => { smoothScroll.stop(); menuRef.current?.showModal(); }}><Menu/></Button></header>
    <dialog ref={menuRef} className="campaign-dialog mobile-menu" aria-label="Main navigation menu" onClose={() => smoothScroll.start()}><Brand/><Button className="dialog-close" variant="navigation" aria-label="Close menu" onClick={close}><X/></Button><nav aria-label="Mobile navigation">
      {['Story', 'Craft', 'Collection'].map(item => <Button asChild key={item} variant="navigation"><a href={`#${item === 'Story' ? 'origin' : item.toLowerCase()}`} onClick={close}>{item}</a></Button>)}
      <Button variant="navigation" onClick={() => { close(); onJournal(); }}>Journal</Button>
      <CTA target="#collection">DISCOVER <span onClick={close}/></CTA>
    </nav><Eyebrow line={false}>CRAFTED BEYOND TIME.</Eyebrow></dialog>
  </>;
}
function RevealSection() {
  return <section id="reveal" className="reveal-section section-shell" data-glow="30 55 0.1"><div data-reveal><BottleFigure className="reveal-figure scroll-bottle" src={bottleImage} alt="NOIRÉA Reserve architectural glass decanter with amber whisky and an original black-and-gold label" cursor="DETAILS"/><p className="caption">THE FIRST EXPRESSION — NOIRÉA RESERVE</p></div><div className="reveal-text" data-reveal><Eyebrow>01 / THE REVEAL</Eyebrow><h2 className="section-title">TIME LEAVES<br/>A <em>SIGNATURE.</em></h2><p className="editorial-copy">Some things cannot be hurried. A season. A memory. A spirit of uncommon depth. NOIRÉA is an imagined whisky house built on one belief: character is not made in a moment. It is earned over time.</p><div className="mt-7"><CTA secondary target="#origin">OUR STORY BEGINS HERE</CTA></div></div></section>;
}
function OriginSection() {
  return <section className="origin" id="origin"><img className="origin-image parallax-image" src={originImage} alt="The imagined Loch Veyr, surrounded by misty highlands, dark stone and still water" loading="lazy" width={1536} height={1024}/><div className="origin-content section-shell" data-reveal><Eyebrow>02 / THE ORIGIN</Eyebrow><h2 className="section-title">BORN FROM<br/>THE <em>LAND.</em></h2></div><div className="origin-bottom"><p className="editorial-copy" data-reveal>Beyond the last road, on the shores of the imagined Loch Veyr, our story takes root. Ancient stone. Clear spring water. Barley shaped by the wind. A place where silence is part of the recipe.</p><p className="coordinate">LOCH VEYR<br/>AN IMAGINED HIGHLAND PROVENANCE</p></div></section>;
}
function CraftTimeline() {
  return <section id="craft" className="craft section-shell" data-glow="50 20 0.08"><div className="section-heading" data-reveal><div><Eyebrow>04 / THE CRAFT</Eyebrow><h2 className="section-title">NOTHING RUSHED.<br/>NOTHING <em>COMPROMISED.</em></h2></div><p className="editorial-copy">Five movements. One philosophy.<br/>Give every detail the time it deserves.</p></div><div className="craft-sequence">{craftSteps.map((step, i) => <article className="craft-step" data-reveal key={step.title}><span className="step-number">0{i + 1}</span><h3>{step.title}</h3><p>{step.detail}</p><span className="step-material">{step.material}</span></article>)}</div></section>;
}
function TastingNotes({ expression = expressions[1] }: { expression?: typeof expressions[number] }) {
  return <dl className="tasting-notes">{[['AROMA', expression.aroma], ['PALATE', expression.palate], ['FINISH', expression.finish]].map(([label, text]) => <div className="tasting-note" key={label}><dt>{label}</dt><dd>{text}</dd></div>)}</dl>;
}
const details = [
  { id: 'whole', label: 'FORM', title: 'An architectural silhouette.', description: 'Quiet proportions. Sculpted shoulders. A vessel conceived to hold both spirit and light.' },
  { id: 'glass', label: 'GLASS', title: 'Light, given a shape.', description: 'Deep bevels and a substantial base reveal the amber within. Clarity without ornament.' },
  { id: 'label', label: 'LABEL', title: 'A signature, not a statement.', description: 'An ink-black label. A fine champagne rule. Four points for land, water, oak and time.' },
  { id: 'cap', label: 'CLOSURE', title: 'The final quiet detail.', description: 'A smoked mineral-finish closure, edged with a single champagne band. Nothing more.' },
  { id: 'liquid', label: 'AMBER', title: 'The colour of patience.', description: 'A rich amber imagined from years of conversation between oak and spirit.' },
  { id: 'packaging', label: 'CASE', title: 'An object to keep.', description: 'A graphite presentation case with our four-point symbol. Understated, tactile and enduring.' },
];
function BottleShowcase() {
  const [detail, setDetail] = useState(0);
  const current = details[detail]!;
  return <section id="bottle" className="details-section section-shell" data-glow="72 50 0.1"><div className="details-layout"><div className="details-copy" data-reveal><Eyebrow>08 / THE OBJECT</Eyebrow><h2 className="section-title">EVERY DETAIL<br/>HAS A <em>PURPOSE.</em></h2><p className="editorial-copy">A spirit of character deserves a vessel of equal intention.</p><div className="detail-selector" role="tablist" aria-label="Bottle details">{details.map((item, i) => <Button key={item.id} variant="navigation" className={i === detail ? 'selected' : ''} role="tab" aria-selected={i === detail} aria-controls="bottle-detail-panel" id={`detail-${item.id}`} onClick={() => setDetail(i)}>{item.label}</Button>)}</div><div className="detail-description" id="bottle-detail-panel" role="tabpanel" aria-labelledby={`detail-${current.id}`} aria-live="polite"><h3>{current.title}</h3><p>{current.description}</p></div></div><div className="inspection-stage" data-reveal>{current.id === 'packaging' ? <div className="packaging"><div className="packaging-box"><BrandSymbol/><span className="brand-name">NOIRÉA</span><p>RESERVE</p></div></div> : <BottleFigure className="showcase-figure" photoClass={`inspection-image inspect-${current.id}`} src={bottleImage} alt={`NOIRÉA bottle detail: ${current.title}`} cursor="EXAMINE"/>}<div className="inspect-controls"><Button variant="navigation" aria-label="Previous bottle detail" onClick={() => setDetail((detail + details.length - 1) % details.length)}><ArrowLeft/></Button><span>0{detail + 1} / 06</span><Button variant="navigation" aria-label="Next bottle detail" onClick={() => setDetail((detail + 1) % details.length)}><ArrowRight/></Button></div></div></div></section>;
}
function DistillerySection() {
  return <section id="distillery" className="distillery"><img className="distillery-image parallax-image" src={distilleryImage} width={1536} height={1024} loading="lazy" alt="Copper pot stills, oak barrels and ancient stone inside the fictional Veyr distillery"/><div className="distillery-content section-shell" data-reveal><Eyebrow>09 / THE DISTILLERY</Eyebrow><h2 className="section-title">CRAFTED WHERE<br/><em>PATIENCE</em> LIVES.</h2><p className="editorial-copy">Stone walls that keep the cold. Copper that carries the warmth. Oak that holds the years. In our imagined distillery, the most important ingredient is the one you cannot see.</p><div className="mt-7"><CTA secondary target="#philosophy">THE NOIRÉA PHILOSOPHY</CTA></div></div><p className="distillery-caption">THE VEYR DISTILLERY — A FICTIONAL PLACE, A TIMELESS IDEA</p></section>;
}
function PhilosophySection() {
  return <section id="philosophy" className="philosophy"><BrandSymbol/><h2><span data-reveal>WE DON’T RUSH</span><span data-reveal>WHAT <em>TIME</em></span><span data-reveal>CAN PERFECT.</span></h2><p>THE NOIRÉA PHILOSOPHY</p></section>;
}
function Footer({ onJournal }: { onJournal: () => void }) {
  return <footer className="footer section-shell"><div className="footer-top"><Brand link/><nav className="footer-links" aria-label="Footer navigation"><Button asChild variant="navigation"><a href="#origin">Our story</a></Button><Button asChild variant="navigation"><a href="#collection">Collection</a></Button><Button variant="navigation" onClick={onJournal}>Journal</Button></nav></div><div className="footer-bottom"><p>NOIRÉA is a fictional brand created as an independent design exploration. All spirits, places, stories and editions are imagined. No products are offered for sale.</p><span>© 2026 NOIRÉA · CRAFTED BEYOND TIME.</span></div></footer>;
}

/** Page-wide choreography: smooth scroll, evolving light, line-by-line titles and depth for the unpinned sections. Pinned sections run their own timelines. */
function useCinematicMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!motionAllowed()) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;
    let stopScroll: (() => void) | undefined;
    loadMotion().then(async motion => {
      const root = ref.current;
      if (cancelled || !root) return;
      const { gsap, ScrollTrigger, SplitText } = motion;
      const stop = await startSmoothScroll(motion);
      if (cancelled) { stop(); return; }
      stopScroll = stop;
      context = gsap.context(() => {
        const ambient = root.querySelector('.ambient');
        gsap.utils.toArray<HTMLElement>('[data-glow]').forEach(section => {
          const [x, y, strength] = (section.dataset['glow'] ?? '50 40 0.06').split(' ').map(Number);
          ScrollTrigger.create({ trigger: section, start: 'top 60%', end: 'bottom 40%', onToggle: self => { if (self.isActive) gsap.to(ambient, { '--gx': x, '--gy': y, '--go': strength, duration: 2.6, ease: 'power2.out', overwrite: 'auto' }); } });
        });
        gsap.utils.toArray<HTMLElement>('.section-title').filter(title => !title.closest('.pin-track') && !title.classList.contains('collection-title')).forEach(title => {
          const lines = SplitText.create(title, { type: 'lines', mask: 'lines' }).lines;
          gsap.from(lines, { yPercent: 112, duration: 1.8, ease: 'power4.out', stagger: 0.14, scrollTrigger: { trigger: title, start: 'top 90%', once: true } });
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => gsap.from(el, { y: 28, opacity: 0.04, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 93%', once: true } }));
        gsap.utils.toArray<HTMLElement>('.bottle-figure').forEach(figure => gsap.fromTo(figure, { '--sx': 12 }, { '--sx': 88, ease: 'none', scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true } }));
        const media = gsap.matchMedia();
        media.add('(min-width: 701px)', () => {
          gsap.utils.toArray<HTMLElement>('.parallax-image').forEach(el => gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }));
          gsap.utils.toArray<HTMLElement>('.scroll-bottle .bottle-photo').forEach(el => gsap.fromTo(el, { rotationY: -13, rotation: -3, scale: 0.95 }, { rotationY: 12, rotation: 2, scale: 1.04, transformPerspective: 1200, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.8 } }));
        });
        return () => media.revert();
      }, root);
      document.fonts.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    });
    return () => { cancelled = true; context?.revert(); stopScroll?.(); };
  }, [ref]);
}
function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const move = (event: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.left = `${event.clientX}px`; ref.current.style.top = `${event.clientY}px`; ref.current.style.opacity = '1';
      const el = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-cursor]') : null;
      setLabel(el?.dataset['cursor'] ?? '');
    };
    const hide = () => { if (ref.current) ref.current.style.opacity = '0'; };
    window.addEventListener('mousemove', move, { passive: true }); document.addEventListener('mouseleave', hide);
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', hide); };
  }, []);
  return <div ref={ref} className={`custom-cursor ${label ? 'active' : ''}`} aria-hidden="true">{label && <span>{label}</span>}</div>;
}
export function Campaign() {
  const ref = useRef<HTMLDivElement>(null);
  const productDialog = useRef<HTMLDialogElement>(null);
  const journalDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  useCinematicMotion(ref);
  const chosen = expressions[selected]!;
  const onDiscover = (index: number) => { setSelected(index); smoothScroll.stop(); productDialog.current?.showModal(); };
  const onJournal = () => { smoothScroll.stop(); journalDialog.current?.showModal(); };
  return <div className="campaign" ref={ref}><div className="ambient" aria-hidden="true"/><div className="film-grain" aria-hidden="true"/><div className="intro-veil" aria-hidden="true"><BrandSymbol/></div><Navbar onJournal={onJournal}/><main><HeroReveal/><RevealSection/><OriginSection/><StorySection/><CraftTimeline/><PourSection/><ReserveSection/><TastingSection/><MomentSection/><BottleShowcase/><DistillerySection/><CollectionSection onDiscover={onDiscover}/><PhilosophySection/><FinaleSection/></main><Footer onJournal={onJournal}/><CustomCursor/>
    <dialog className="campaign-dialog" ref={productDialog} aria-labelledby="expression-title" onClose={() => smoothScroll.start()} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}><Button variant="navigation" className="dialog-close" aria-label="Close expression" onClick={() => productDialog.current?.close()}><X/></Button><div className="dialog-inner"><img src={dialogBottles[chosen.id]} width={1024} height={1536} loading="lazy" alt={`Original NOIRÉA ${chosen.name} bottle concept`}/><div><Eyebrow line={false}>{chosen.edition}</Eyebrow><h2 id="expression-title">NOIRÉA<br/><em>{chosen.name}</em></h2><p className="collection-age">{chosen.age}</p><p className="editorial-copy">{chosen.description}</p><TastingNotes expression={chosen}/><p className="dialog-disclosure">An imagined expression from a fictional whisky house. The three decanters share one design concept. Not available for purchase.</p></div></div></dialog>
    <dialog className="campaign-dialog" ref={journalDialog} aria-labelledby="journal-title" onClose={() => smoothScroll.start()}><Button variant="navigation" className="dialog-close" aria-label="Close journal" onClick={() => journalDialog.current?.close()}><X/></Button><div className="journal-inner"><Eyebrow>THE NOIRÉA JOURNAL</Eyebrow><h2 id="journal-title">NOTES ON <em>STILLNESS.</em></h2><article className="journal-article"><Eyebrow line={false}>01 / TIME</Eyebrow><h3>The art of doing less.</h3><p className="editorial-copy">In the imagined warehouses of Veyr, the years are not counted in production schedules. They are read in the grain of the oak, the changing light, the quiet deepening of a spirit. Patience is not an absence of work. It is the most exacting work of all.</p></article><article className="journal-article"><Eyebrow line={false}>02 / MATERIAL</Eyebrow><h3>Four elements. One signature.</h3><p className="editorial-copy">Land gives character. Water gives clarity. Oak gives depth. Time brings them together. The four points of the NOIRÉA symbol are a reminder that the simplest forms can hold the richest stories.</p></article><p className="dialog-disclosure">Fictional editorial essays for the NOIRÉA creative exploration.</p></div></dialog>
  </div>;
}
