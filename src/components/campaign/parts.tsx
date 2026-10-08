import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motionAllowed, useGlassTilt } from './motion';

export function BrandSymbol() {
  return <svg className="brand-symbol" viewBox="0 0 40 48" aria-hidden="true"><path fillRule="evenodd" d="M20 2 24 19 38 24 24 29 20 46 16 29 2 24 16 19ZM20 13l2 9 8 2-8 2-2 9-2-9-8-2 8-2Z" fill="currentColor"/></svg>;
}
export function Brand({ link = false }: { link?: boolean }) {
  const content = <><BrandSymbol/><span className="brand-name">NOIRÉA</span></>;
  return link ? <a href="#top" className="brand" aria-label="NOIRÉA home">{content}</a> : <div className="brand">{content}</div>;
}
export function Eyebrow({ children, line = true }: { children: ReactNode; line?: boolean }) {
  return <p className="eyebrow">{line && <span/>}{children}</p>;
}
export function CTA({ children, target, secondary = false }: { children: ReactNode; target: string; secondary?: boolean }) {
  return <Button asChild variant={secondary ? 'editorial' : 'campaign'} data-cursor="EXPLORE"><a href={target}>{children}<ArrowRight aria-hidden="true"/></a></Button>;
}

/** A bottle photograph with a glass-shaped layer of moving reflections and travelling amber light on top. */
export function BottleFigure({ src, alt, className = '', photoClass = '', cursor, lazy = true }: { src: string; alt: string; className?: string; photoClass?: string; cursor?: string; lazy?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGlassTilt(ref);
  return <div ref={ref} className={`bottle-figure ${className}`} data-cursor={cursor}>
    <div className="bottle-tilt" data-tilt>
      <div className={`bottle-photo ${photoClass}`}>
        <img src={src} alt={alt} width={1024} height={1536} loading={lazy ? 'lazy' : undefined} decoding="async"/>
        <div className="bottle-glass" aria-hidden="true"><i className="glass-streak"/><i className="glass-amber"/></div>
      </div>
    </div>
  </div>;
}

/**
 * A film plate: the clip itself, framed by a heavily blurred copy of its own frames so the picture
 * melts into the page instead of sitting in a player. `scrub` clips are driven by scroll, others loop in view.
 */
export function VideoPlate({ src, poster, label, mode = 'loop', videoRef, className = '' }: { src: string; poster: string; label: string; mode?: 'loop' | 'scrub'; videoRef?: RefObject<HTMLVideoElement | null>; className?: string }) {
  const own = useRef<HTMLVideoElement>(null);
  const video = videoRef ?? own;
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const clip = video.current;
    const glow = canvas.current?.getContext('2d');
    if (!clip || !glow || !canvas.current) return;
    const { width, height } = canvas.current;
    let visible = false; let last = 0; let frame = 0;
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || time - last < 70 || clip.readyState < 2) return;
      last = time; glow.drawImage(clip, 0, 0, width, height);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (mode === 'loop' && motionAllowed()) { if (visible) clip.play().catch(() => {}); else clip.pause(); }
    }, { threshold: 0.12 });
    observer.observe(clip);
    frame = requestAnimationFrame(draw);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [mode, video]);
  return <div className={`video-plate ${className}`}>
    <canvas ref={canvas} className="plate-ambient" width={40} height={42} aria-hidden="true"/>
    <video ref={video} className="plate-video" src={src} poster={poster} muted loop={mode === 'loop'} playsInline preload={mode === 'scrub' ? 'auto' : 'metadata'} width={960} height={1024} role="img" aria-label={label} disablePictureInPicture/>
  </div>;
}
