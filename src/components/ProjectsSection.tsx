import { useEffect, useState } from "react";
import { ArrowIcon } from "./icons";
import SectionHeader from "./SectionHeader";
import { type Project, type RevealState, type SectionHeaderConfig } from "./types";

type ProjectsSectionProps = {
  reveal: RevealState;
  header: SectionHeaderConfig;
  projects: Project[];
  projectLinkLabel: string;
};

const citationNamePattern = /(Day,\sR\.?\s?G\.?)/gi;
const citationNameExactPattern = /^Day,\sR\.?\s?G\.?$/i;

function renderCitation(citation: string) {
  const parts = citation.split(citationNamePattern);

  return parts.map((part, index) =>
    citationNameExactPattern.test(part) ? (
      <strong className="d22-project-citation-highlight" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export default function ProjectsSection({
  reveal,
  header,
  projects,
  projectLinkLabel,
}: ProjectsSectionProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProject(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProject]);

  const citationList = activeProject
    ? activeProject.citations?.length
      ? activeProject.citations
      : activeProject.citation
        ? [activeProject.citation]
        : []
    : [];

  return (
    <>
      <section id="work" className="d22-section">
        <div
          ref={reveal.ref}
          className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
        >
          <SectionHeader config={header} />
          <div className="d22-projects-grid">
            {projects.map((project, index) => (
              <div
                className="d22-project-card"
                key={project.title}
                style={{ transitionDelay: `${index * 0.1}s` }}
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
                      onClick={() => setActiveProject(project)}
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

      {activeProject ? (
        <div
          className="d22-project-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="d22-project-modal-title"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="d22-project-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="d22-project-modal-close"
              aria-label="Close project details"
              onClick={() => setActiveProject(null)}
            >
              Close
            </button>
            <p className="d22-project-modal-org">{activeProject.org}</p>
            <h3 id="d22-project-modal-title" className="d22-project-modal-title">
              {activeProject.title}
            </h3>
            <p className="d22-project-modal-summary">
              {activeProject.detailSummary ?? activeProject.description}
            </p>
            {activeProject.detailBullets?.length ? (
              <ul className="d22-project-modal-bullets">
                {activeProject.detailBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {activeProject.detailLinks?.length ? (
              <div className="d22-project-modal-links">
                {activeProject.detailLinks.map((resource) => (
                  <a
                    key={`${activeProject.title}-${resource.label}`}
                    className="d22-project-modal-link"
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="d22-project-modal-link-label">
                      {resource.label}
                    </span>
                    <span className="d22-project-modal-link-description">
                      {resource.description}
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
            {citationList.length ? (
              <div className="d22-project-modal-citation">
                <p className="d22-project-modal-citation-label">Citations</p>
                <ul className="d22-project-modal-citation-list">
                  {citationList.map((citation, index) => (
                    <li key={`${citation}-${index}`}>{renderCitation(citation)}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

