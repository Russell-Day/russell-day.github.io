import { ArrowIcon } from "./icons";
import SectionHeader from "./SectionHeader";
import { type Project, type RevealState, type SectionHeaderConfig } from "./types";

type ProjectsSectionProps = {
  reveal: RevealState;
  header: SectionHeaderConfig;
  projects: Project[];
  projectLinkLabel: string;
};

export default function ProjectsSection({
  reveal,
  header,
  projects,
  projectLinkLabel,
}: ProjectsSectionProps) {
  return (
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
                <a
                  href={project.link}
                  className="d22-project-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {projectLinkLabel} <ArrowIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
