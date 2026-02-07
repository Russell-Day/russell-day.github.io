import { type FooterConfig } from "./types";

type FooterSectionProps = {
  footer: FooterConfig;
};

export default function FooterSection({ footer }: FooterSectionProps) {
  return (
    <footer className="d22-footer">
      <p className="d22-footer-text">
        <span className="d22-footer-accent">{footer.accent}</span> - {footer.label}
      </p>
    </footer>
  );
}
