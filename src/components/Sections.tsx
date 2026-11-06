import { Plus } from '@phosphor-icons/react';
import { honours, news, projects, publications, siteConfig } from './config';
import { authorParts, cv, isExternal, linkKind, tidy } from './content';
import type { Project, Publication } from './types';

/** Opens off-site links and files in a new tab; in-page links stay. */
function out(href: string) {
  return isExternal(href) || /\.pdf$/i.test(href) ? { target: '_blank', rel: 'noreferrer' } : {};
}

/** A link whose destination (DOI, Abstract, PDF, Website) is part of the link. */
function Dest({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a className="dest" href={href} {...out(href)}>
      <span className="dest-in">
        <span className="dest-text">{children}</span> <span className="kind">{linkKind(href)}</span>
      </span>
    </a>
  );
}

function Authors({ authors }: { authors: string }) {
  return (
    <p className="sub">
      {authorParts(tidy(authors)).map((part, i) =>
        part.self ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>,
      )}
    </p>
  );
}

function PublicationEntry({ item }: { item: Publication }) {
  return (
    <li className="entry" data-entry>
      <span className="meta">{item.year}</span>
      <div className="body">
        <p className="title">{item.href ? <Dest href={item.href}>{tidy(item.title)}</Dest> : tidy(item.title)}</p>
        <Authors authors={item.authors} />
        <p className="sub venue">{tidy(item.venue)}</p>
      </div>
    </li>
  );
}

export function Research() {
  return (
    <section id="research" className="section" aria-labelledby="research-title">
      <div className="section-head">
        <h2 id="research-title">Publications &amp; talks</h2>
        <a className="head-link" href={cv.href} target="_blank" rel="noreferrer">
          Full list in my {cv.label}
        </a>
      </div>
      {publications.map((group) => (
        <div className="group" key={group.group}>
          <h3 className="group-title">{group.group}</h3>
          <ol className="entries">
            {group.items.map((item) => (
              <PublicationEntry key={item.title} item={item} />
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}

// Plainer lines for the three lead projects and two margin notes, approved by
// Russell on 2026-09-24 (commit 915ec29).
const lead = [0, 3, 1];
const shortLine: Record<string, string> = {
  [projects[0].title]: 'Fine-tuning a small language model to extract survival predictors from bladder cancer records.',
  [projects[3].title]: 'Turning photos of donated medical supplies into reviewable inventory records.',
  [projects[1].title]: 'Helping researchers find relevant papers with less manual screening.',
};
const marginNote: Record<string, string> = {
  [projects[3].title]:
    'A photo is a much easier starting point than an empty spreadsheet. The workflow turns incoming donations into records that the team can review.',
  [projects[1].title]:
    'The goal is less repetitive screening. Reviewers still get to inspect the decisions and resolve borderline papers.',
};
const ordered = [...lead.map((i) => projects[i]), ...projects.filter((_, i) => !lead.includes(i))];

function ProjectEntry({ project }: { project: Project }) {
  const links = project.detailLinks?.length
    ? project.detailLinks
    : [{ label: 'Read the project', href: project.link, description: '' }];
  return (
    <li className="entry project" data-entry>
      <p className="meta metric">
        <span className="metric-value">{project.metric}</span>
        <span className="metric-label">{project.metricLabel}</span>
      </p>
      <div className="body">
        <p className="org">{project.org}</p>
        <h3 className="title">{project.title}</h3>
        <p className="desc">{shortLine[project.title] ?? project.description}</p>
        <details className="more">
          <summary>
            Details
            <Plus className="more-icon" size={16} weight="bold" aria-hidden="true" />
          </summary>
          <div className="more-body">
            {marginNote[project.title] && <p className="note">{marginNote[project.title]}</p>}
            {project.detailSummary && <p>{project.detailSummary}</p>}
            {project.detailBullets?.length ? (
              <ul>
                {project.detailBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
            <p className="links">
              {links.map((l) => (
                <Dest key={l.href + l.label} href={l.href}>
                  {l.label}
                </Dest>
              ))}
            </p>
          </div>
        </details>
      </div>
    </li>
  );
}

export function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title">Selected projects</h2>
      </div>
      <ol className="entries">
        {ordered.map((p) => (
          <ProjectEntry key={p.title} project={p} />
        ))}
      </ol>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="section-head">
        <h2 id="experience-title">Experience</h2>
      </div>
      <ol className="entries">
        {siteConfig.experience.map((item) => (
          <li className="entry" data-entry key={`${item.org}-${item.role}`}>
            <span className="meta">{tidy(item.period)}</span>
            <div className="body">
              <p className="title">{tidy(item.org)}</p>
              <p className="sub role">{item.role}</p>
              <p className="desc">{tidy(item.description)}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="group">
        <h3 className="group-title">Leadership</h3>
        <ul className="plain">
          {siteConfig.leadership.map((item) => (
            <li key={item.org}>
              <span className="meta" aria-hidden="true" />
              <p>
                <strong>{item.role}</strong>, {item.org}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Honours() {
  return (
    <section id="honours" className="section" aria-labelledby="honours-title">
      <div className="section-head">
        <h2 id="honours-title">Honours</h2>
      </div>
      <ul className="plain">
        {honours.map((item) => (
          <li key={item.title}>
            <span className="meta">{tidy(item.date)}</span>
            <p>
              <strong>{item.title}</strong>, {item.org}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="section-head">
        <h2 id="about-title">About</h2>
      </div>
      <div className="prose">
        <p>
          I’m finishing a B.S. in data science with a minor in business, and through Michigan’s accelerated
          master’s program I’ve started an M.S. in computational medicine and bioinformatics. I’m also on a
          premedical track.
        </p>
      </div>
      <ul className="plain education">
        {siteConfig.about.education.map((item) => (
          <li key={item.degree}>
            {/* A future end date already reads as expected; keeps the date column to one line. */}
            <span className="meta">{tidy(item.period.replace(/\s*\(expected\)/, ''))}</span>
            <p>
              <strong>{item.degree}</strong>
              <span className="sub">{item.school}</span>
            </p>
          </li>
        ))}
      </ul>
      <div className="prose">
        <p>
          I also like figuring out what I can run on my own hardware. I’m building Tedi, a personal assistant
          that helps me organize my schedule, email, and tasks.
        </p>
        <details className="aside">
          <summary>
            Tedi? Teddy?
            <Plus className="more-icon" size={16} weight="bold" aria-hidden="true" />
          </summary>
          <p>Tedi is the assistant. Teddy is my small, fluffy, very hyper dog. Ollie, my other dog, is much more composed.</p>
        </details>
        <p className="quiet">Away from the keyboard: probably working on a ramen broth.</p>
      </div>
    </section>
  );
}

export function News() {
  return (
    <section id="news" className="section" aria-labelledby="news-title">
      <div className="section-head">
        <h2 id="news-title">News</h2>
      </div>
      <ul className="plain">
        {news.map((item) => (
          <li key={item.date + item.text}>
            <span className="meta">{item.date}</span>
            <p>{tidy(item.text)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
