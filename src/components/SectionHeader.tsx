import { type CSSProperties } from "react";
import { type SectionHeaderConfig } from "./types";

type SectionHeaderProps = {
  config: SectionHeaderConfig;
};

export default function SectionHeader({ config }: SectionHeaderProps) {
  return (
    <div className="d22-section-header">
      <div className="d22-section-label">
        <span>{config.label}</span>
        <span
          className="d22-eval-tag"
          style={{ "--n": config.evalTag.length } as CSSProperties}
          aria-hidden="true"
        >
          {config.evalTag}
        </span>
      </div>
      <h2 className="d22-section-title">{config.title}</h2>
    </div>
  );
}
