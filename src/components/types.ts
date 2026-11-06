export type Theme = "dark" | "light";

export type EducationItem = {
  degree: string;
  school: string;
  period: string;
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

export type SiteConfig = {
  about: {
    photoImageKey: string;
    education: EducationItem[];
  };
  experience: ExperienceItem[];
  leadership: LeadershipItem[];
  contact: { links: ContactLink[] };
  cv: { href: string; label: string };
  footer: { label: string };
};

export type ProjectDetailLink = {
  label: string;
  href: string;
  description: string;
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
  detailLinks?: ProjectDetailLink[];
  citations?: string[];
};

export type Project = Omit<ProjectConfig, "imageKey"> & {
  image: string;
};

export type Publication = {
  authors: string;
  year: string;
  title: string;
  venue: string;
  href?: string;
  linkLabel?: string;
};

export type PublicationGroup = {
  group: string;
  items: Publication[];
};

export type NewsItem = {
  date: string;
  text: string;
};

export type Honour = {
  title: string;
  org: string;
  date: string;
};
