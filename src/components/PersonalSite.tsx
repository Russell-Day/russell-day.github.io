import { useState } from 'react';
import { siteConfig } from './config';
import './DesignExplorer.css';
import NetworkStudy from './NetworkStudy';
import { DaylightWork, DaylightAbout, DaylightExperience, DaylightPublications, DaylightNews, DaylightHonours } from './DaylightContent';

// index.html sets data-theme on <html> before first paint (stored choice, else
// the system preference); React starts from the same value so nothing flashes.
function startsInEvening() {
  return document.documentElement.dataset.theme === 'dark';
}

function rememberTheme(evening: boolean) {
  const theme = evening ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Private mode or blocked storage: the toggle still works for this visit.
  }
}

export default function PersonalSite() {
  const [evening, setEvening] = useState(startsInEvening);

  function toggleEvening() {
    const next = !evening;
    rememberTheme(next);
    setEvening(next);
  }

  return (
    <div className={`design-explorer direction-3${evening ? ' is-evening' : ''}`}>
      <div className="explore-shell">
        <header className="explore-header">
          <a className="explore-brand personal-wordmark" href="#home" aria-label="Russell Day — home">
            <span className="wordmark-first">russell</span>
            <span className="wordmark-last">day<span className="wordmark-dot">.</span></span>
          </a>
          <nav aria-label="Main navigation">
            <button className="daylight-mode" onClick={toggleEvening} aria-label={evening ? 'Switch to daylight' : 'Switch to evening'}>{evening ? '☾' : '☼'}</button>
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Say hello ↗</a>
          </nav>
        </header>
        <main>
          <section id="home" className="explore-hero">
            <div className="hero-writing">
              <div className="eyebrow hero-eyebrow">Data science & medicine / Michigan</div>
              <h1>Russell <em>Day.</em><span className="daylight-chinese">戴光佑</span></h1>
              <p className="hero-intro">I study data science and computational medicine at the University of Michigan and work on machine learning for clinical research. I’m interested in reducing the time clinicians and researchers spend on repetitive tasks.</p>
              <div className="hero-links">
                <a href="#work">Explore my work <span>↘</span></a>
                <a href="mailto:russday@umich.edu">Get in touch ↗</a>
                <a href="https://github.com/Russell-Day" target="_blank" rel="noreferrer">GitHub ↗</a>
                <a href={siteConfig.cv.href} target="_blank" rel="noreferrer">{siteConfig.cv.label} ↗</a>
              </div>
            </div>
            <NetworkStudy evening={evening} />
          </section>
          <div className="explore-divider" aria-hidden="true"><span>↓</span></div>
          <DaylightWork />
          <DaylightPublications />
          <DaylightNews />
          <DaylightAbout />
          <DaylightExperience />
          <DaylightHonours />
          <section id="contact" className="explore-contact">
            <span className="eyebrow">Leave a note</span>
            <h2>Say hello.</h2>
            <p>I’m happy to talk research, compare notes on running models, or hear what you’re building.</p>
            <a className="contact-email" href="mailto:russday@umich.edu">russday@umich.edu ↗</a>
            <div className="contact-socials">
              {siteConfig.contact.links.filter(link => link.type !== 'email').map(link => (
                <a href={link.href} key={link.type} target="_blank" rel="noreferrer">{link.type === 'github' ? 'GitHub' : 'LinkedIn'} ↗</a>
              ))}
              <a href={siteConfig.cv.href} target="_blank" rel="noreferrer">{siteConfig.cv.label} ↗</a>
            </div>
          </section>
        </main>
        <footer className="explore-footer"><span>Russell Day · 戴光佑 · {siteConfig.footer.label}</span><a href="#home">Back to the top ↑</a></footer>
      </div>
    </div>
  );
}
