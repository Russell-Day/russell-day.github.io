import siteData from "../config/site.json";
import projectsData from "../config/projects.json";
import blueprints from "../images/blueprints.png";
import headshot from "../images/headshot.jpg";
import pop_health from "../images/pop_health.png";
import systematic_review from "../images/systematic_review.png";
import { type Project, type ProjectConfig, type SiteConfig } from "./types";

const projectImageMap: Record<string, string> = {
  systematic_review,
  blueprints,
  pop_health,
};

const profileImageMap: Record<string, string> = {
  headshot,
};

export const siteConfig = siteData as SiteConfig;

export const projects: Project[] = (projectsData as ProjectConfig[]).map((project) => ({
  ...project,
  image: projectImageMap[project.imageKey] ?? systematic_review,
}));

export const profileImage =
  profileImageMap[siteConfig.about.photoImageKey] ?? headshot;
