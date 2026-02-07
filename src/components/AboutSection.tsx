import { Fragment } from "react";
import SectionHeader from "./SectionHeader";
import {
  type AboutConfig,
  type MetricConfig,
  type RevealState,
  type SectionHeaderConfig,
} from "./types";

type AboutSectionProps = {
  reveal: RevealState;
  metricsReveal: RevealState;
  header: SectionHeaderConfig;
  about: AboutConfig;
  metrics: MetricConfig[];
  metricValues: number[];
  profileImage: string;
};

export default function AboutSection({
  reveal,
  metricsReveal,
  header,
  about,
  metrics,
  metricValues,
  profileImage,
}: AboutSectionProps) {
  return (
    <section id="about" className="d22-section">
      <div
        ref={reveal.ref}
        className={`d22-reveal ${reveal.visible ? "visible" : ""}`}
      >
        <SectionHeader config={header} />

        <div className="d22-about-grid">
          <div>
            <div className="d22-about-photo-wrap">
              <div className="d22-about-photo-glow" />
              <img src={profileImage} alt={about.photoAlt} className="d22-about-photo" />
            </div>
            <div className="d22-about-education">
              <div className="d22-about-education-label">{about.educationLabel}</div>
              <h4>{about.school}</h4>
              <p>
                {about.educationLines.map((line, index) => (
                  <Fragment key={`${line}-${index}`}>
                    {line}
                    {index < about.educationLines.length - 1 ? <br /> : null}
                  </Fragment>
                ))}
              </p>
              <div className="d22-gpa">{about.gpaDisplay}</div>
            </div>
          </div>

          <div className="d22-about-content">
            {about.paragraphs.slice(0, 2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="d22-pullquote">
              <p>"{about.quote}"</p>
            </div>

            {about.paragraphs.slice(2).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="d22-interest-tags">
              {about.interestTags.map((tag) => (
                <span className="d22-interest-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={metricsReveal.ref}
          className={`d22-metrics-row d22-reveal ${metricsReveal.visible ? "visible" : ""}`}
        >
          {metrics.map((metric, index) => (
            <div className="d22-metric-cell" key={metric.id}>
              <div className="d22-metric-value">
                {metricValues[index]?.toFixed(metric.decimals)}
                {metric.suffix}
              </div>
              <div className="d22-metric-label">{metric.label}</div>
              <div className="d22-metric-sub">{metric.subLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
