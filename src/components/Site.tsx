import { useRef } from 'react';
import { Moon } from '@phosphor-icons/react';
import { profileImage, siteConfig } from './config';
import { EMAIL, NAME, cv, github, linkedin, tidy } from './content';
import { useMedia, usePassed, useReading, useTheme } from './hooks';
import { About, Experience, Honours, News, Research, Work } from './Sections';

// Bearing light. 戴光 means "bearing light": the motif is used twice and no
// more. 光 is amber in the name, and one thing is lit: the "Now" block at
// rest, then the entry being read (the one at the middle of the screen, or the
// one you hover or focus).

/** 戴光佑 with 光 ("light") picked out. */
function ZhName({ className, lit = true }: { className?: string; lit?: boolean }) {
  return (
    <span className={className} lang="zh-Hans">
      戴{lit ? <span className="guang">光</span> : '光'}佑
    </span>
  );
}

const SECTIONS = ['research', 'work', 'experience', 'honours', 'about', 'news', 'contact'];

// Nav items and the sections each one covers.
const NAV: { id: string; label: string; covers: string[]; nearOnPhone?: string[]; wide?: boolean }[] = [
  { id: 'research', label: 'Research', covers: ['research'] },
  { id: 'work', label: 'Work', covers: ['work'] },
  { id: 'experience', label: 'Experience', covers: ['experience', 'honours'] },
  { id: 'about', label: 'About', covers: ['about'], nearOnPhone: ['news'] },
  { id: 'news', label: 'News', covers: ['news'], wide: true },
  { id: 'contact', label: 'Contact', covers: ['contact'] },
];

const role = siteConfig.experience[0];
const degree = siteConfig.about.education[0];
const degreeEnd = /–\s*(.+?)\s*\(expected\)/.exec(degree.period)?.[1];

export default function Site() {
  const { evening, toggle } = useTheme();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const pastName = usePassed(nameRef);
  const current = useReading(SECTIONS);
  // Under 1024px News has no nav link, so About stands in for it.
  const wide = useMedia('(min-width: 1024px)');

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
          <nav className="nav" aria-label="Sections">
            {NAV.map((item) => {
              const here = !!current && item.covers.includes(current);
              const near = !wide && !!current && !!item.nearOnPhone?.includes(current);
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={item.wide ? 'wide-only' : undefined}
                  aria-current={here || near ? 'location' : undefined}
                  data-near={near ? 'true' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
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
        <section id="top" className="hero" aria-labelledby="name">
          <h1 id="name" className="name" ref={nameRef}>
            <span className="name-en">{NAME}</span> <ZhName className="name-zh" />
          </h1>
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
            I study data science and computational medicine at the University of Michigan and work on machine
            learning for clinical research. I’m interested in reducing the time clinicians and researchers spend on
            repetitive tasks.
          </p>
          <div className="now" data-rest-light>
            <p className="now-label">Now</p>
            <ul>
              <li>
                {role.role}, {tidy(role.org)}
              </li>
              <li>
                {degree.degree}
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
        <News />

        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <div className="section-head">
            <h2 id="contact-title">Say hello</h2>
          </div>
          <div className="prose">
            <p>I’m happy to talk research, compare notes on running models, or hear what you’re building.</p>
            <a className="email" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
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
    </>
  );
}
