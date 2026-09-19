import { useState } from 'react';
import { siteConfig } from './config';
import './DesignExplorer.css';
import NetworkStudy from './NetworkStudy';
import { DaylightWork, DaylightAbout, DaylightExperience } from './DaylightContent';

export default function PersonalSite() {
  const [evening, setEvening] = useState(false);

  return (
    <div className={`design-explorer direction-3${evening ? ' is-evening' : ''}`}>
      <div className="explore-shell">
        <header className="explore-header">
          <a className="explore-brand personal-wordmark" href="#home" aria-label="Russell Day — home">
            <span className="wordmark-first">russell</span>
            <span className="wordmark-last">day<span className="wordmark-dot">.</span></span>
          </a>
          <nav aria-label="Main navigation">
            <button className="daylight-mode" onClick={() => setEvening(!evening)} aria-label={evening ? 'Switch to daylight' : 'Switch to evening'}>{evening ? '☾' : '☼'}</button>
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
              <p className="hero-intro">I study data science at Michigan and build things at the intersection of machine learning and medicine. I’m interested in making the work around patient care a little easier.</p>
              <div className="hero-links">
                <a href="#work">Explore my work <span>↘</span></a>
                <a href="mailto:russday@umich.edu">Get in touch ↗</a>
                <a href="https://github.com/Russell-Day" target="_blank" rel="noreferrer">GitHub ↗</a>
              </div>
              <p className="hero-personal-note">Often fine-tuning a model. Occasionally, a ramen broth.</p>
            </div>
            <NetworkStudy evening={evening} />
          </section>
          <div className="explore-divider"><span>A few connections I’m working on</span><span>↓</span></div>
          <DaylightWork />
          <DaylightAbout />
          <DaylightExperience />
          <section id="contact" className="explore-contact">
            <span className="eyebrow">Leave a note</span>
            <h2>Say hello.</h2>
            <p>I’m happy to talk research, compare notes on running models, or hear what you’re building.</p>
            <a className="contact-email" href="mailto:russday@umich.edu">russday@umich.edu ↗</a>
            <div className="contact-socials">
              {siteConfig.contact.links.filter(link => link.type !== 'email').map(link => (
                <a href={link.href} key={link.type} target="_blank" rel="noreferrer">{link.type === 'github' ? 'GitHub' : 'LinkedIn'} ↗</a>
              ))}
            </div>
          </section>
        </main>
        <footer className="explore-footer"><span>Russell Day · 戴光佑</span><a href="#home">Back to the top ↑</a></footer>
      </div>
    </div>
  );
}
