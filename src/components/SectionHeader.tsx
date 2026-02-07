import { type SectionHeaderConfig } from "./types";

type SectionHeaderProps = {
  config: SectionHeaderConfig;
};

export default function SectionHeader({ config }: SectionHeaderProps) {
  return (
    <div className="d22-section-header">
      <div className="d22-section-label">
        <span className="d22-bp-tag">{config.basePair}</span>
        {config.label}
      </div>
      <h2 className="d22-section-title">{config.title}</h2>
      <div className="d22-section-divider" />
    </div>
  );
}
