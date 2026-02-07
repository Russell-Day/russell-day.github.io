import { useCallback, useEffect, useState } from "react";
import AboutSection from "./AboutSection";
import AgentDashboardSection from "./AgentDashboard";
import { profileImage, projects, siteConfig } from "./config";
import ContactSection from "./ContactSection";
import ExperienceSection from "./ExperienceSection";
import FooterSection from "./FooterSection";
import HeroSection from "./HeroSection";
import { useAnimatedMetrics, useScrollReveal } from "./hooks";
import Navigation from "./Navigation";
import ProjectsSection from "./ProjectsSection";
import { type Theme } from "./types";

export default function ComponentsPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("d22-theme") as Theme) || "dark";
    }
    return "dark";
  });

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const workReveal = useScrollReveal(0.1);
  const aboutReveal = useScrollReveal(0.1);
  const metricsReveal = useScrollReveal(0.2);
  const expReveal = useScrollReveal(0.1);
  const agentsReveal = useScrollReveal(0.1);
  const contactReveal = useScrollReveal(0.1);

  const metricValues = useAnimatedMetrics(siteConfig.metrics, metricsReveal.visible);

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("d22-theme", nextTheme);
  }, [theme]);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="d22-root" data-theme={theme}>
      <div className="d22-bg-helix" />

      <Navigation
        scrolled={scrolled}
        theme={theme}
        menuOpen={menuOpen}
        navLinks={siteConfig.navLinks}
        brandName={siteConfig.brandName}
        ctaLabel={siteConfig.navCtaLabel}
        onToggleTheme={toggleTheme}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={closeMenu}
      />

      <HeroSection theme={theme} hero={siteConfig.hero} />

      <ProjectsSection
        reveal={workReveal}
        header={siteConfig.sectionHeaders.work}
        projects={projects}
        projectLinkLabel={siteConfig.projectLinkLabel}
      />

      <AboutSection
        reveal={aboutReveal}
        metricsReveal={metricsReveal}
        header={siteConfig.sectionHeaders.about}
        about={siteConfig.about}
        metrics={siteConfig.metrics}
        metricValues={metricValues}
        profileImage={profileImage}
      />

      <ExperienceSection
        reveal={expReveal}
        header={siteConfig.sectionHeaders.experience}
        experience={siteConfig.experience}
        leadershipTitle={siteConfig.leadershipTitle}
        leadership={siteConfig.leadership}
      />

      <AgentDashboardSection reveal={agentsReveal} />

      <ContactSection
        reveal={contactReveal}
        header={siteConfig.sectionHeaders.contact}
        contact={siteConfig.contact}
      />

      <FooterSection footer={siteConfig.footer} />
    </div>
  );
}
