import { honours, news, projects, profileImage, publications, siteConfig } from './config';
import type { Project, ExperienceItem, Publication } from './types';

const featured = [0, 3, 1];
const annotations: Record<string, string> = {
  [projects[3].title]: 'A photo is a much easier starting point than an empty spreadsheet. The workflow turns incoming donations into records that the team can review.',
  [projects[1].title]: 'The goal is less repetitive screening. Reviewers still get to inspect the decisions and resolve borderline papers.',
};
const shortDescriptions: Record<string, string> = {
  [projects[0].title]: 'Fine-tuning a small language model to extract survival predictors from bladder cancer records.',
  [projects[3].title]: 'Turning photos of donated medical supplies into reviewable inventory records.',
  [projects[1].title]: 'Helping researchers find relevant papers with less manual screening.',
};

function Signal({ index }: { index: number }) {
  return <svg className="work-signal" viewBox="0 0 54 48" aria-hidden="true"><path d={index === 1 ? 'M7 10 Q27 10 27 24 T47 24 M7 38 Q27 38 27 24' : 'M7 24 Q27 24 27 10 T47 10 M7 24 Q27 24 27 38 T47 38'} /><circle cx="7" cy={index === 1 ? 10 : 24} r="3" /><circle cx="27" cy="24" r="3" /><circle cx="47" cy={index === 1 ? 24 : 10} r="3" /><circle cx={index === 1 ? 7 : 47} cy="38" r="3" /></svg>;
}

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  return <details className="compact-project">
    <summary><Signal index={index} /><span className="compact-project-main"><span className="compact-project-org">{project.org}</span><strong>{project.title}</strong><span className="compact-project-description">{shortDescriptions[project.title] ?? project.description}</span></span><span className="compact-project-result"><strong>{project.metric}</strong><span>{project.metricLabel}</span></span><span className="disclosure-plus" aria-hidden="true">+</span></summary>
    <div className="compact-project-detail">
      {annotations[project.title] && <p className="project-margin-note">{annotations[project.title]}</p>}
      <p>{project.detailSummary}</p>
      <ul>{project.detailBullets?.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
      <div className="compact-project-links">{project.detailLinks?.length ? project.detailLinks.map(link => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} ↗</a>) : <a href={project.link} target="_blank" rel="noreferrer">Read the project ↗</a>}</div>
      {project.citations?.length ? <details className="project-citations"><summary>Citations</summary>{project.citations.map(citation => <p key={citation}>{citation}</p>)}</details> : null}
    </div>
  </details>;
}

export function DaylightWork() {
  return <section id="work" className="daylight-work"><div className="compact-section-heading"><h2>Selected projects</h2><span className="eyebrow">Open one to look closer ↙</span></div>
    {featured.map((index, i) => <ProjectEntry key={projects[index].title} project={projects[index]} index={i} />)}
    <details className="work-archive"><summary>Four more projects <span aria-hidden="true">↗</span><span className="archive-preview">Medical imaging, inventory, pricing & population health</span></summary><div>{projects.filter((_, i) => !featured.includes(i)).map((project, i) => <ProjectEntry key={project.title} project={project} index={i} />)}</div></details>
  </section>;
}

export function DaylightAbout() {
  return <section id="about" className="daylight-about"><div className="daylight-portrait"><img src={profileImage} alt="Russell Day" loading="lazy" /><span>Hi, I’m Russell.</span></div><div><h2>A little about me.</h2><p>I’m finishing a B.S. in data science with a minor in business, and through Michigan’s accelerated master’s program I’ve started an M.S. in computational medicine and bioinformatics. I’m also on a premedical track.</p><ul className="daylight-education">{siteConfig.about.education.map(item => <li key={item.degree}><strong>{item.degree}</strong><span>{item.school}</span><time>{item.period}</time></li>)}</ul><p>I also like figuring out what I can run on my own hardware. I’m building <span className="personal-word">Tedi</span>, a personal assistant that helps me organize my schedule, email, and tasks.</p><details className="personal-footnote"><summary>Tedi? Teddy? <span aria-hidden="true">+</span></summary><p>Tedi is the assistant. Teddy is my small, fluffy, very hyper dog. Ollie, my other dog, is much more composed.</p></details><p className="daylight-offline">Away from the keyboard: probably working on a ramen broth.</p></div></section>;
}

function Role({ item }: { item: ExperienceItem }) {
  return <details className="compact-role"><summary><span><strong>{item.org}</strong><span>{item.role}</span></span><time>{item.period}</time><span className="disclosure-plus" aria-hidden="true">+</span></summary><p>{item.description}</p></details>;
}

export function DaylightExperience() {
  return <section id="experience" className="daylight-experience"><div className="compact-section-heading"><h2>Where I’ve been.</h2><span className="eyebrow">Current roles, then most recent</span></div><div className="compact-roles">{siteConfig.experience.slice(0, 3).map(item => <Role key={`${item.org}-${item.role}`} item={item} />)}<details className="career-archive"><summary>Earlier experience <span aria-hidden="true">+</span></summary><div>{siteConfig.experience.slice(3).map(item => <Role key={`${item.org}-${item.role}`} item={item} />)}</div></details></div><div className="compact-leadership">{siteConfig.leadership.map(item => <p key={item.org}><strong>{item.role}</strong> · {item.org}</p>)}</div></section>;
}

const ownName = /(Day, R\.(?: G\.)?)/;

function Authors({ authors }: { authors: string }) {
  return <>{authors.split(ownName).map((part, i) => ownName.test(part) ? <strong key={i}>{part}</strong> : part)}</>;
}

function PublicationEntry({ item }: { item: Publication }) {
  return <li><span className="publication-authors"><Authors authors={item.authors} /> ({item.year}).</span> <cite>{item.title}.</cite> <span className="publication-venue">{item.venue}.</span>{item.href && <> <a href={item.href} target="_blank" rel="noreferrer">{item.linkLabel ?? 'Link'} ↗</a></>}</li>;
}

export function DaylightPublications() {
  return <section id="publications" className="daylight-publications"><div className="compact-section-heading"><h2>Publications & talks</h2><a className="eyebrow" href={siteConfig.cv.href} target="_blank" rel="noreferrer">Full list in my {siteConfig.cv.label} ↗</a></div>
    {publications.map(group => <div className="publication-group" key={group.group}><h3>{group.group}</h3><ol>{group.items.map(item => <PublicationEntry key={item.title} item={item} />)}</ol></div>)}
  </section>;
}

export function DaylightNews() {
  return <section id="news" className="daylight-news"><div className="compact-section-heading"><h2>News</h2><span className="eyebrow">Most recent first</span></div>
    <ul className="dated-list">{news.map(item => <li key={item.date + item.text}><time>{item.date}</time><span>{item.text}</span></li>)}</ul>
  </section>;
}

export function DaylightHonours() {
  return <section id="honours" className="daylight-honours"><div className="compact-section-heading"><h2>Honours</h2></div>
    <ul className="dated-list">{honours.map(item => <li key={item.title}><time>{item.date}</time><span><strong>{item.title}</strong> · {item.org}</span></li>)}</ul>
  </section>;
}
