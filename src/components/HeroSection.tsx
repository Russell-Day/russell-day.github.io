import { type MouseEvent } from "react";
import { ArrowIcon, HeroNetwork } from "./icons";
import { type HeroConfig, type Theme } from "./types";

type HeroSectionProps = {
  theme: Theme;
  hero: HeroConfig;
};

const MAGNET_RANGE = 6;

function magnetMove(event: MouseEvent<HTMLAnchorElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const dx = (event.clientX - rect.left) / rect.width - 0.5;
  const dy = (event.clientY - rect.top) / rect.height - 0.5;
  el.style.setProperty("--tx", `${dx * MAGNET_RANGE * 2}px`);
  el.style.setProperty("--ty", `${dy * MAGNET_RANGE * 2}px`);
}

function magnetLeave(event: MouseEvent<HTMLAnchorElement>) {
  const el = event.currentTarget;
  el.style.setProperty("--tx", "0px");
  el.style.setProperty("--ty", "0px");
}

export default function HeroSection({ theme, hero }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="d22-hero"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--hpx",
          String((event.clientX - rect.left) / rect.width - 0.5)
        );
        event.currentTarget.style.setProperty(
          "--hpy",
          String((event.clientY - rect.top) / rect.height - 0.5)
        );
      }}
    >
      <HeroNetwork theme={theme} />
      <div className="d22-hero-overline">
        <span>{hero.overline}</span>
      </div>
      <h1>
        {hero.firstName} <span className="d22-gradient-text">{hero.lastName}</span>
      </h1>
      <p className="d22-hero-sub">{hero.subtitle}</p>
      <div className="d22-hero-actions">
        <a
          href={hero.primaryCta.href}
          className="d22-btn-primary d22-magnetic"
          onMouseMove={magnetMove}
          onMouseLeave={magnetLeave}
        >
          {hero.primaryCta.label}
          <ArrowIcon />
        </a>
        <a
          href={hero.secondaryCta.href}
          className="d22-btn-secondary d22-magnetic"
          onMouseMove={magnetMove}
          onMouseLeave={magnetLeave}
        >
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
