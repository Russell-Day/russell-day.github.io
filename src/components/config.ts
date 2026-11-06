import siteData from "../config/site.json";
import projectsData from "../config/projects.json";
import publicationsData from "../config/publications.json";
import honoursData from "../config/honours.json";
import headshot from "../images/headshot.webp";
import type {
  Honour,
  Project,
  PublicationGroup,
  SiteConfig,
} from "./types";

export const siteConfig = siteData as SiteConfig;
export const projects = projectsData as Project[];
export const publications = publicationsData as PublicationGroup[];
export const honours = honoursData as Honour[];
export const profileImage = headshot;
