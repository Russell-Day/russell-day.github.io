import SectionHeader from "./SectionHeader";
import {
  type ExperienceItem,
  type LeadershipItem,
  type RevealState,
  type SectionHeaderConfig,
} from "./types";

type ExperienceSectionProps = {
  reveal: RevealState;
  header: SectionHeaderConfig;
  experience: ExperienceItem[];
  leadershipTitle: string;
  leadership: LeadershipItem[];
};

export default function ExperienceSection({
  reveal,
  header,
  experience,
  leadershipTitle,
  leadership,
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="d22-section">
      <div
        ref={reveal.ref}
        className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
      >
        <SectionHeader config={header} />

        <div className="d22-timeline">
          {experience.map((item) => (
            <div className="d22-timeline-item" key={`${item.role}-${item.org}`}>
              <div className="d22-timeline-node" />
              <div className="d22-timeline-card">
                <div className="d22-timeline-period">{item.period}</div>
                <div className="d22-timeline-role">{item.role}</div>
                <div className="d22-timeline-org">{item.org}</div>
                <p className="d22-timeline-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="d22-leadership-subtitle">{leadershipTitle}</div>
        <div className="d22-leadership-grid">
          {leadership.map((item) => (
            <div className="d22-leadership-card" key={`${item.role}-${item.org}`}>
              <div className="d22-leadership-role">{item.role}</div>
              <div className="d22-leadership-org">{item.org}</div>
              <p className="d22-leadership-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
