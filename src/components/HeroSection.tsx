import { ArrowIcon, HeroDNA } from "./icons";
import { type HeroConfig, type Theme } from "./types";

type HeroSectionProps = {
  theme: Theme;
  hero: HeroConfig;
};

export default function HeroSection({ theme, hero }: HeroSectionProps) {
  return (
    <section id="hero" className="d22-hero">
      <HeroDNA theme={theme} />
      <div className="d22-hero-overline">
        <span>{hero.overline}</span>
      </div>
      <h1>
        {hero.firstName} <span className="d22-gradient-text">{hero.lastName}</span>
      </h1>
      <p className="d22-hero-sub">{hero.subtitle}</p>
      <div className="d22-hero-actions">
        <a href={hero.primaryCta.href} className="d22-btn-primary">
          {hero.primaryCta.label}
          <ArrowIcon />
        </a>
        <a href={hero.secondaryCta.href} className="d22-btn-secondary">
          {hero.secondaryCta.label}
        </a>
      </div>
      <div className="d22-hero-scroll">
        <span>{hero.scrollLabel}</span>
        <div className="d22-hero-scroll-line" />
      </div>
    </section>
  );
}
