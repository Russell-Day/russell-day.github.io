import { useEffect, useRef } from "react";
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
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;
    let frameId = 0;
    const update = () => {
      frameId = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = (viewport * 0.8 - rect.top) / rect.height;
      el.style.setProperty("--tlp", String(Math.min(Math.max(progress, 0), 1)));
    };
    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section id="experience" className="d22-section">
      <div
        ref={reveal.ref}
        className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
      >
        <SectionHeader config={header} />

        <div className="d22-timeline" ref={timelineRef}>
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
