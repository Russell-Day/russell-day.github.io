import siteData from "../config/site.json";
import projectsData from "../config/projects.json";
import bfp_pricing from "../images/bfp_pricing.webp";
import bfp_vision from "../images/bfp_vision.webp";
import breast_cancer from "../images/breast_cancer.webp";
import blueprints from "../images/blueprints.webp";
import clinical_llm from "../images/clinical_llm.webp";
import headshot from "../images/headshot.webp";
import pop_health from "../images/pop_health.webp";
import systematic_review from "../images/systematic_review.webp";
import { type Project, type ProjectConfig, type SiteConfig } from "./types";

const projectImageMap: Record<string, string> = {
  clinical_llm,
  systematic_review,
  breast_cancer,
  blueprints,
  pop_health,
  bfp_vision,
  bfp_pricing,
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
