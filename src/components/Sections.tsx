import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Check, Copy, Plus, X } from '@phosphor-icons/react';
import { bibtex } from './bibtex';
import { honours, projects, publications, siteConfig } from './config';
import { authorParts, cv, isExternal, linkKind, tidy } from './content';
import { holdLight, useCopy } from './hooks';
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

/** An anchor id for a project, so a publication can point at it. */
const projectId = (p: Project) => `project-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

/** The project whose own citations name this publication, if any. */
const relatedProject = (item: Publication) => projects.find((p) => p.citations?.some((c) => c.includes(item.title)));

/** The citation exactly as the page shows it, in author (year) order. */
function citation(item: Publication) {
  const url = item.href ? new URL(item.href, 'https://russellday.dev').href : '';
  const venue = tidy(item.venue);
  return `${tidy(item.authors)} (${item.year}). ${tidy(item.title)}. ${venue}${/\.$/.test(venue) ? '' : '.'}${url ? ` ${url}` : ''}`;
}

/** Clipboard text: plain spaces, no invisible joiners. */
const plain = (text: string) => text.replace(/\u2060/g, '').replace(/\u00a0/g, ' ');

const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Opens a project's details, brings it to the middle of the screen and lights it. */
function showProject(id: string, behavior: ScrollBehavior) {
  const el = document.getElementById(id);
  if (!el?.matches('.project')) return null;
  const details = el.querySelector('details');
  if (details) details.open = true;
  el.scrollIntoView({ block: 'center', behavior });
  holdLight(el, behavior === 'smooth');
  return el;
}

/**
 * Related project: a real history step, so Back returns to the paper. The
 * paper's entry remembers the scroll position and which link was followed.
 */
function openProject(e: MouseEvent<HTMLAnchorElement>, id: string) {
  if (!document.getElementById(id)) return;
  // Let Ctrl/Cmd/Shift-click and middle-click open a new tab or window.
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  // This entry is now the paper's place: drop any project it was opened as,
  // so Back returns here rather than to that project.
  const state = { ...(history.state ?? {}) } as { project?: string };
  delete state.project;
  history.replaceState({ ...state, back: { y: window.scrollY, from: e.currentTarget.id } }, '');
  history.pushState({ project: id }, '', `#${id}`);
  showProject(id, still() ? 'instant' : 'smooth')
    ?.querySelector<HTMLElement>('summary')
    ?.focus({ preventScroll: true });
}

/** Input that means the reader has taken over the scroll position. */
const TAKE_OVER = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

/**
 * Back and Forward between a paper and its project, and an address with a
 * #fragment opened cold (a shared #project-… link, or #work). The page is
 * built after load, so the browser cannot scroll there by itself: place it,
 * and place it again while fonts settle the layout, until the reader takes
 * over. A spot the browser has already restored (a reload) is kept.
 */
function useHistoryAndHash() {
  useEffect(() => {
    let frame = 0;
    const onPop = (e: PopStateEvent) => {
      const s = e.state as { back?: { y: number; from: string }; project?: string } | null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (s?.project) {
          showProject(s.project, 'instant')
            ?.querySelector<HTMLElement>('summary')
            ?.focus({ preventScroll: true });
        } else if (s?.back) {
          window.scrollTo({ top: s.back.y, behavior: 'instant' });
          const from = document.getElementById(s.back.from);
          from?.focus({ preventScroll: true });
          holdLight(from?.closest<HTMLElement>('[data-entry]') ?? null);
        }
      });
    };
    window.addEventListener('popstate', onPop);

    let id = '';
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      // A malformed shared link: just open the page at the top.
    }
    let ro: ResizeObserver | null = null;
    let timer = 0;
    const stop = () => {
      ro?.disconnect();
      ro = null;
      window.clearTimeout(timer);
      for (const type of TAKE_OVER) window.removeEventListener(type, stop, true);
    };
    const place = () => {
      const el = document.getElementById(id);
      if (!el || showProject(id, 'instant')) return;
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      holdLight(el.querySelector<HTMLElement>('[data-entry]'));
    };
    if (id) {
      // A frame first, so the reading light is listening.
      frame = requestAnimationFrame(() => {
        if (!document.getElementById(id) || window.scrollY !== 0) return;
        place();
        if (document.getElementById(id)?.matches('.project')) {
          history.replaceState({ ...(history.state ?? {}), project: id }, '');
        }
        const main = document.getElementById('main');
        if (main && 'ResizeObserver' in window) {
          ro = new ResizeObserver(place);
          ro.observe(main);
        }
        for (const type of TAKE_OVER) window.addEventListener(type, stop, { capture: true, passive: true });
        timer = window.setTimeout(stop, 2500);
      });
    }
    return () => {
      cancelAnimationFrame(frame);
      stop();
      window.removeEventListener('popstate', onPop);
    };
  }, []);
}

/** A copy button whose label changes in place: every label shares one grid cell. */
function CopyButton({
  label,
  text,
  message,
  source,
}: {
  label: string;
  text: string;
  message: string;
  source?: () => Element | null;
}) {
  const { state, copy } = useCopy();
  return (
    <button type="button" className="cite-copy" data-state={state} onClick={() => copy(text, message, source?.())}>
      <span className="swap" aria-hidden="true">
        <Copy className="swap-a" size={16} weight="bold" />
        <Check className="swap-b" size={16} weight="bold" />
        <X className="swap-c" size={16} weight="bold" />
      </span>
      <span className="label-swap">
        <span className={state === 'idle' ? 'is-on' : undefined}>{label}</span>
        <span className={state === 'copied' ? 'is-on' : undefined}>Copied</span>
        <span className={state === 'failed' ? 'is-on' : undefined}>Copy failed</span>
      </span>
    </button>
  );
}

function Cite({ item, group, id, onKeyDown }: { item: Publication; group: string; id: string; onKeyDown: (e: KeyboardEvent) => void }) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const text = citation(item);
  const bib = bibtex(item, group);
  const project = relatedProject(item);
  return (
    <div className="cite" id={id} onKeyDown={onKeyDown}>
      <p className="cite-text" ref={textRef}>
        {text}
      </p>
      <div className="cite-actions">
        <CopyButton label="Copy citation" text={plain(text)} message="Citation copied" source={() => textRef.current} />
        {bib && <CopyButton label="Copy BibTeX" text={bib} message="BibTeX copied" />}
        {project && (
          <a
            className="cite-link"
            id={`${id}-related`}
            href={`#${projectId(project)}`}
            onClick={(e) => openProject(e, projectId(project))}
          >
            Related project: {project.title}
          </a>
        )}
      </div>
    </div>
  );
}

function PublicationEntry({ item, group, citable }: { item: Publication; group: string; citable: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Escape closes the citation and hands focus back to its button.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape' || !open) return;
    e.preventDefault();
    setOpen(false);
    toggleRef.current?.focus();
  };
  // The title comes first in the tab order; the grid puts Cite beside the year.
  return (
    <li className={citable ? 'entry pub has-cite' : 'entry pub'} data-entry>
      <span className="meta">{item.year}</span>
      <div className="body">
        <p className="title">{item.href ? <Dest href={item.href}>{tidy(item.title)}</Dest> : tidy(item.title)}</p>
        <Authors authors={item.authors} />
        <p className="sub venue">{tidy(item.venue)}</p>
      </div>
      {citable && (
        <>
          <button
            ref={toggleRef}
            type="button"
            className="cite-toggle"
            aria-label={`Cite: ${plain(tidy(item.title))}`}
            aria-expanded={open}
            aria-controls={id}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={onKeyDown}
          >
            Cite
            <Plus className="more-icon" size={14} weight="bold" aria-hidden="true" />
          </button>
          {open ? <Cite item={item} group={group} id={id} onKeyDown={onKeyDown} /> : <div id={id} hidden />}
        </>
      )}
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
              // Talks and panels are not citable works; everything else gets Cite.
              <PublicationEntry
                key={item.title}
                item={item}
                group={group.group}
                citable={!/invited|panel/i.test(group.group)}
              />
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
    <li className="entry project" data-entry id={projectId(project)}>
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
  useHistoryAndHash();
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
