import siteData from "../config/site.json";
import projectsData from "../config/projects.json";
import bfp_pricing from "../images/bfp_pricing.webp";
import paper_selection from "../images/paper_selection.webp";
import bfp_vision from "../images/bfp_vision.webp";
import blueprints from "../images/blueprints.webp";
import headshot from "../images/headshot.webp";
import pop_health from "../images/pop_health.webp";
import systematic_review from "../images/systematic_review.webp";
import { type Project, type ProjectConfig, type SiteConfig } from "./types";

const projectImageMap: Record<string, string> = {
  systematic_review,
  blueprints,
  pop_health,
  paper_selection,
  bfp_vision,
  bfp_pricing,
  // Placeholder until a dedicated image is generated (prompt in image-prompts.md).
  breast_cancer: bfp_vision,
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
