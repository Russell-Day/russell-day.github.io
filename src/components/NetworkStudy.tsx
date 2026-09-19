import { useEffect, useRef, useState } from 'react';
import { HeroNetwork } from './icons';

export default function NetworkStudy({ evening }: { evening: boolean }) {
  const [open, setOpen] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current;
    const svg = element?.querySelector('svg');
    if (!element || !svg) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    function sync() {
      if (preference.matches || !visible || document.hidden) svg?.pauseAnimations();
      else svg?.unpauseAnimations();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return <div ref={host} className={`network-study${open ? ' is-open' : ''}`}>
    <button className="network-study-trigger" aria-label="Explore the neural network" aria-expanded={open} aria-controls="network-study-note" onClick={() => setOpen(!open)}>
      <HeroNetwork theme={evening ? 'dark' : 'light'} colors={{ primary: evening ? '#e0c187' : '#aa7838', secondary: evening ? '#9bbccf' : '#6d91a6' }} />
      <span className="network-study-hint">Three kinds of information. One shared question. <span aria-hidden="true">{open ? '−' : '+'}</span></span>
    </button>
    <div className="network-study-note" id="network-study-note" hidden={!open}>
      <p>A sketch of multimodal research: language features from clinical records, measurements from images, and features learned by a neural network, brought together for survival modeling.</p>
      <p className="network-study-aside">The moving dots are an illustration, not a live prediction.</p>
      <a href="#work">See the clinical LLM project ↘</a>
    </div>
  </div>;
}
