import { type RefObject } from "react";

export type Theme = "dark" | "light";

export type NavLink = {
  label: string;
  href: string;
};

export type Cta = {
  label: string;
  href: string;
};

export type HeroConfig = {
  overline: string;
  firstName: string;
  lastName: string;
  subtitle: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  scrollLabel: string;
};

export type SectionHeaderConfig = {
  label: string;
  title: string;
  basePair: string;
};

export type AboutConfig = {
  photoAlt: string;
  photoImageKey: string;
  educationLabel: string;
  school: string;
  educationLines: string[];
  gpaDisplay: string;
  paragraphs: string[];
  quote: string;
  interestTags: string[];
};

export type MetricConfig = {
  id: string;
  target: number;
  decimals: number;
  duration: number;
  suffix: string;
  label: string;
  subLabel: string;
};

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description: string;
};

export type LeadershipItem = {
  role: string;
  org: string;
  description: string;
};

export type ContactLink = {
  type: "email" | "linkedin" | "github";
  href: string;
  label: string;
};

export type ContactConfig = {
  heading: string;
  subtitle: string;
  links: ContactLink[];
};

export type FooterConfig = {
  accent: string;
  label: string;
};

export type AgentHoverCardConfig = {
  displayName: string;
  persona: string;
  location: string;
  activity: string;
};

export type AgentDashboardConfig = {
  hoverCards: Record<string, AgentHoverCardConfig>;
};

export type SiteConfig = {
  brandName: string;
  navCtaLabel: string;
  projectLinkLabel: string;
  navLinks: NavLink[];
  sectionHeaders: {
    work: SectionHeaderConfig;
    about: SectionHeaderConfig;
    experience: SectionHeaderConfig;
    contact: SectionHeaderConfig;
  };
  hero: HeroConfig;
  about: AboutConfig;
  metrics: MetricConfig[];
  experience: ExperienceItem[];
  leadershipTitle: string;
  leadership: LeadershipItem[];
  agentDashboard: AgentDashboardConfig;
  contact: ContactConfig;
  footer: FooterConfig;
};

export type ProjectConfig = {
  title: string;
  org: string;
  description: string;
  imageKey: string;
  link: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  detailSummary?: string;
  detailBullets?: string[];
  detailLinks?: {
    label: string;
    href: string;
    description: string;
  }[];
  citation?: string;
  citations?: string[];
};

export type Project = Omit<ProjectConfig, "imageKey"> & {
  image: string;
};

export type RevealState = {
  ref: RefObject<HTMLDivElement>;
  visible: boolean;
};
