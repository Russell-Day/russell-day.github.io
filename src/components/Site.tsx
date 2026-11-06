import { useEffect, useLayoutEffect, useRef } from 'react';
import { Check, Copy, Moon, X } from '@phosphor-icons/react';
import { profileImage, siteConfig } from './config';
import { EMAIL, NAME, cv, github, linkedin, tidy } from './content';
import { holdLight, useCopy, useMedia, usePassed, useReading, useTheme } from './hooks';
import { pulseLamp } from './lamp';
import { About, Experience, Honours, Research, Work } from './Sections';

// Bearing light. 戴光 means "bearing light": the motif is used twice and no
// more. 光 is amber in the name, and one thing is lit: the "Now" block at
// rest, then the entry being read (the one at the middle of the screen, or the
// one you hover, focus or tap). Everything that moves is that light: the lamp
// travelling between entries, the glow under the pointer, the evening switch,
// and 光 itself when you touch the name.

/** 戴光佑 with 光 ("light") picked out. */
function ZhName({ className, lit = true }: { className?: string; lit?: boolean }) {
  return (
    <span className={className} lang="zh-Hans">
      戴{lit ? <span className="guang">光</span> : '光'}佑
    </span>
  );
}

/**
 * The upright 戴光佑 beside the portrait. Touching it (click, tap, Enter or
 * Space) kindles 光 and brightens the lamp once. Holding it down warms 光
 * first, and the longer the hold, the brighter it kindles. It adds no visible
 * text, so the heading still reads "Russell Day 戴光佑".
 */
function Kindle() {
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef(0);
  const since = useRef(0); // when the current press began
  const heat = useRef({ value: 0, at: 0 }); // how long the last press was held
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const press = () => {
    since.current = performance.now();
    ref.current?.classList.add('is-pressing');
  };
  const cancel = () => {
    since.current = 0;
    ref.current?.classList.remove('is-pressing');
  };
  const release = () => {
    if (since.current) {
      const now = performance.now();
      heat.current = { value: Math.min(1, (now - since.current) / 1200), at: now };
    }
    cancel();
  };
  const kindle = () => {
    const b = ref.current;
    if (!b) return;
    release();
    const { value, at } = heat.current;
    heat.current = { value: 0, at: 0 };
    b.style.setProperty('--heat', performance.now() - at < 600 ? value.toFixed(2) : '0');
    b.classList.remove('is-kindled');
    void b.offsetWidth;
    b.classList.add('is-kindled');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => b.classList.remove('is-kindled'), 1400);
    pulseLamp();
  };
  return (
    <button
      ref={ref}
      type="button"
      className="name-zh kindle"
      aria-describedby="kindle-hint"
      onPointerDown={(e) => e.isPrimary && e.button === 0 && press()}
      onPointerUp={release}
      // Dragged off while held (a touch that turns into a scroll cancels).
      onPointerLeave={(e) => e.buttons !== 0 && cancel()}
      onPointerCancel={cancel}
      onKeyDown={(e) => e.key === ' ' && !e.repeat && press()}
      onBlur={cancel}
      onClick={kindle}
    >
      <ZhName className="kindle-text" />
    </button>
  );
}

function CopyEmail() {
  const { state, copy } = useCopy();
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={state === 'failed' ? 'Copy failed. Copy email address' : 'Copy email address'}
      data-state={state}
      onClick={(e) => {
        // The address takes the light, so the copy's pulse lands on it.
        const row = e.currentTarget.closest<HTMLElement>('.email-row');
        holdLight(row);
        void copy(EMAIL, 'Email address copied', row?.querySelector('.email'));
      }}
    >
      <span className="swap" aria-hidden="true">
        <Copy className="swap-a" size={18} weight="bold" />
        <Check className="swap-b" size={18} weight="bold" />
        <X className="swap-c" size={18} weight="bold" />
      </span>
    </button>
  );
}

const SECTIONS = ['research', 'work', 'experience', 'honours', 'about', 'contact'];

// Nav items and the sections each one covers.
const NAV: { id: string; label: string; covers: string[] }[] = [
  { id: 'research', label: 'Research', covers: ['research'] },
  { id: 'work', label: 'Work', covers: ['work'] },
  { id: 'experience', label: 'Experience', covers: ['experience', 'honours'] },
  { id: 'about', label: 'About', covers: ['about'] },
  { id: 'contact', label: 'Contact', covers: ['contact'] },
];

const role = siteConfig.experience[0];
// Now shows the degree in progress: the B.S. (the M.S. is the accelerated
// program on top of it), without the minor.
const degree =
  siteConfig.about.education.find((d) => d.degree.startsWith('B.S.')) ?? siteConfig.about.education[0];
const degreeName = degree.degree.split(',')[0];
const degreeEnd = /–\s*(.+?)\s*\(expected\)/.exec(degree.period)?.[1];

export default function Site() {
  const { evening, toggle } = useTheme();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const pastName = usePassed(nameRef);
  const current = useReading(SECTIONS);
  // The header brand shows 戴光佑 only from 1024px.
  const wide = useMedia('(min-width: 1024px)');
  const navRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  // One marker under the current nav item that slides from item to item.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const mark = markRef.current;
    if (!nav || !mark) return;
    let live = true;
    const place = () => {
      if (!live) return;
      const label = nav.querySelector<HTMLElement>('a[aria-current] .nav-label');
      if (!label || !label.offsetWidth) {
        mark.classList.remove('is-on');
        return;
      }
      const fresh = !mark.classList.contains('is-on');
      if (fresh) mark.classList.add('is-placing');
      mark.style.transform = `translate3d(${label.offsetLeft}px, ${label.offsetTop + label.offsetHeight + 6}px, 0) scaleX(${label.offsetWidth})`;
      if (fresh) {
        void mark.offsetWidth;
        mark.classList.remove('is-placing');
      }
      mark.classList.add('is-on');
    };
    place();
    void document.fonts?.ready.then(place);
    window.addEventListener('resize', place, { passive: true });
    return () => {
      live = false;
      window.removeEventListener('resize', place);
    };
  }, [current, wide]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="bar">
        <div className="bar-in">
          <a className="brand" href="#top" aria-label={`${NAME}, back to top`}>
            <span className="brand-en">{NAME}</span>
            {/* On phone the brand row scrolls away, so only desktop shows 戴光佑 here. */}
            {wide && <ZhName className={`brand-zh${pastName ? ' is-shown' : ''}`} />}
          </a>
          <nav className="nav" aria-label="Sections" ref={navRef}>
            {NAV.map((item) => {
              const here = !!current && item.covers.includes(current);
              return (
                <a key={item.id} href={`#${item.id}`} aria-current={here ? 'location' : undefined}>
                  <span className="nav-label">{item.label}</span>
                </a>
              );
            })}
            <span className="nav-mark" ref={markRef} aria-hidden="true" />
          </nav>
          <div className="tools">
            <a className="tool-cv" href={cv.href} target="_blank" rel="noreferrer">
              {cv.label}
            </a>
            <button
              type="button"
              className="theme"
              onClick={toggle}
              aria-pressed={evening}
              aria-label="Evening mode"
              title="Evening mode"
            >
              <Moon size={16} weight={evening ? 'fill' : 'bold'} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <div className="lamp" aria-hidden="true">
          <div className="lamp-glow" />
        </div>
        <section id="top" className="hero" aria-labelledby="name">
          <h1 id="name" className="name" ref={nameRef}>
            <span className="name-en">{NAME}</span> <Kindle />
          </h1>
          <span id="kindle-hint" hidden>
            Lights 光, the character for light
          </span>
          <img
            className="photo"
            src={profileImage}
            alt="Portrait of Russell Day"
            width={1200}
            height={1500}
            decoding="async"
            fetchPriority="high"
          />
          <p className="intro">
            Premed data science student at the University of Michigan, also in the accelerated M.S. in
            computational medicine. I build machine learning that cuts the time clinicians and researchers spend on
            repetitive work.
          </p>
          <div className="now" data-rest-light>
            <p className="now-label">Now</p>
            <ul>
              <li>
                {role.role}, {tidy(role.org)}
              </li>
              <li>
                {degreeName}
                {degreeEnd ? `, expected ${degreeEnd.replace(/ /g, '\u00a0')}` : ''}
              </li>
            </ul>
          </div>
          <div className="actions">
            <a className="btn" href={`mailto:${EMAIL}`}>
              Email me
            </a>
            <span className="action-links">
              <a href={cv.href} target="_blank" rel="noreferrer">
                {cv.label}
              </a>
              <a href={github.href} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={linkedin.href} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </span>
          </div>
        </section>

        <Research />
        <Work />
        <Experience />
        <Honours />
        <About />

        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <div className="section-head">
            <h2 id="contact-title">Say hello</h2>
          </div>
          <div className="prose">
            <p>I’m happy to talk research, compare notes on running models, or hear what you’re building.</p>
            <p className="email-row">
              <a className="email" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              <CopyEmail />
            </p>
            <p className="contact-links">
              <a href={linkedin.href} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a href={github.href} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={cv.href} target="_blank" rel="noreferrer">
                {cv.label}
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          {NAME} · <ZhName lit={false} /> · {siteConfig.footer.label}
        </p>
        <a href="#top">Back to the top</a>
      </footer>
      <p id="announce" className="sr-only" aria-live="polite" />
    </>
  );
}
