import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "./icons";
import SectionHeader from "./SectionHeader";
import { type Project, type RevealState, type SectionHeaderConfig } from "./types";

const metricPattern = /^([^0-9]*)([\d,.]+)(.*)$/;

function MetricBadge({ metric, metricLabel }: { metric: string; metricLabel: string }) {
  const match = metric.match(metricPattern);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const animatable = match !== null && Number.isFinite(target);
  const decimals = animatable && match![2].includes(".") ? 1 : 0;

  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(animatable ? 0 : null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animatable) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animatable]);

  useEffect(() => {
    if (!started || !animatable) return;
    let frameId = 0;
    const startTime = performance.now();
    const duration = 1100;
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Number((target * eased).toFixed(decimals)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [started, animatable, target, decimals]);

  return (
    <div className="d22-project-metric-badge" ref={ref}>
      <div className="metric-value">
        {animatable ? `${match![1]}${display?.toFixed(decimals) ?? 0}${match![3]}` : metric}
      </div>
      <div className="metric-label">{metricLabel}</div>
    </div>
  );
}

type ProjectsSectionProps = {
  reveal: RevealState;
  header: SectionHeaderConfig;
  projects: Project[];
  projectLinkLabel: string;
};

const authorNamePattern = /(Day,\sR\.?\s?G\.?)/gi;
const authorNameExact = /^Day,\sR\.?\s?G\.?$/i;

function highlightAuthor(citation: string) {
  return citation.split(authorNamePattern).map((part, index) =>
    authorNameExact.test(part) ? (
      <strong className="d22-project-citation-highlight" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

export default function ProjectsSection({
  reveal,
  header,
  projects,
  projectLinkLabel,
}: ProjectsSectionProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filterTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tag of project.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [projects]);

  const visibleProjects = activeFilter
    ? projects.filter((project) => project.tags.includes(activeFilter))
    : projects;

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const citations = selected?.citations ?? [];

  return (
    <Fragment>
      <section id="work" className="d22-section">
        <div
          ref={reveal.ref}
          className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
        >
          <SectionHeader config={header} />
          <div className="d22-project-filters" role="group" aria-label="Filter projects by tag">
            <button
              type="button"
              className={`d22-project-filter ${activeFilter === null ? "active" : ""}`}
              onClick={() => setActiveFilter(null)}
            >
              all · {projects.length}
            </button>
            {filterTags.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`d22-project-filter ${activeFilter === tag ? "active" : ""}`}
                onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="d22-projects-grid">
            {visibleProjects.map((project) => (
              <div
                className="d22-project-card"
                key={`${activeFilter ?? "all"}-${project.title}`}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const px = (event.clientX - rect.left) / rect.width;
                  const py = (event.clientY - rect.top) / rect.height;
                  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
                  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
                  event.currentTarget.style.setProperty("--ry", `${(px - 0.5) * 5}deg`);
                  event.currentTarget.style.setProperty("--rx", `${(0.5 - py) * 5}deg`);
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.setProperty("--rx", "0deg");
                  event.currentTarget.style.setProperty("--ry", "0deg");
                }}
              >
                <div className="d22-project-img-wrap">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="d22-project-img-overlay" />
                  <MetricBadge metric={project.metric} metricLabel={project.metricLabel} />
                </div>
                <div className="d22-project-body">
                  <div className="d22-project-tags">
                    {project.tags.map((tag) => (
                      <span className="d22-project-tag" key={`${project.title}-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="d22-project-title">{project.title}</h3>
                  <p className="d22-project-org">{project.org}</p>
                  <p className="d22-project-desc">{project.description}</p>
                  <div className="d22-project-actions">
                    <button
                      type="button"
                      className="d22-project-link d22-project-link-btn"
                      onClick={() => setSelected(project)}
                    >
                      {projectLinkLabel} <ArrowIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {selected ? (
        <div
          className="d22-project-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="d22-project-modal-title"
          onClick={() => setSelected(null)}
        >
          <div className="d22-project-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="d22-project-modal-close"
              aria-label="Close project details"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
            <p className="d22-project-modal-org">{selected.org}</p>
            <h3 id="d22-project-modal-title" className="d22-project-modal-title">
              {selected.title}
            </h3>
            <p className="d22-project-modal-summary">
              {selected.detailSummary ?? selected.description}
            </p>
            {selected.detailBullets?.length ? (
              <ul className="d22-project-modal-bullets">
                {selected.detailBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {selected.detailLinks?.length ? (
              <div className="d22-project-modal-links">
                {selected.detailLinks.map((link) => (
                  <a
                    className="d22-project-modal-link"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${selected.title}-${link.label}`}
                  >
                    <span className="d22-project-modal-link-label">{link.label}</span>
                    <span className="d22-project-modal-link-description">{link.description}</span>
                  </a>
                ))}
              </div>
            ) : null}
            {citations.length ? (
              <div className="d22-project-modal-citation">
                <p className="d22-project-modal-citation-label">Citations</p>
                <ul className="d22-project-modal-citation-list">
                  {citations.map((citation, index) => (
                    <li key={`${citation}-${index}`}>{highlightAuthor(citation)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Fragment>
  );
}
