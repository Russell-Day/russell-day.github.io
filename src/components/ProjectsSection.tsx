import { Fragment, useEffect, useState } from "react";
import { ArrowIcon } from "./icons";
import SectionHeader from "./SectionHeader";
import { type Project, type RevealState, type SectionHeaderConfig } from "./types";

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
          <div className="d22-projects-grid">
            {projects.map((project) => (
              <div
                className="d22-project-card"
                key={project.title}
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
                  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
                }}
              >
                <div className="d22-project-img-wrap">
                  <img src={project.image} alt={project.title} loading="lazy" />
                  <div className="d22-project-img-overlay" />
                  <div className="d22-project-metric-badge">
                    <div className="metric-value">{project.metric}</div>
                    <div className="metric-label">{project.metricLabel}</div>
                  </div>
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
