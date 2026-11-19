// Structured data for search engines, built only from src/config: a Person
// with the same name, photo, current role and profile links the page shows.
import { profileImage, siteConfig } from './config';

/** schema.org Person for the page at `pageUrl` (the canonical URL). */
export function personJsonLd(pageUrl: string) {
  const abs = (href: string) => new URL(href, pageUrl).href;
  // The hero's "Now" block: the first experience entry and the B.S. school.
  const role = siteConfig.experience[0];
  const degree =
    siteConfig.about.education.find((d) => d.degree.startsWith('B.S.')) ?? siteConfig.about.education[0];
  const sameAs = siteConfig.contact.links.filter((l) => /^https?:\/\//.test(l.href)).map((l) => l.href);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    ...(siteConfig.nameZh ? { alternateName: siteConfig.nameZh } : {}),
    url: pageUrl,
    image: abs(profileImage),
    ...(role ? { jobTitle: role.role } : {}),
    affiliation: [
      ...(role ? [{ '@type': 'Organization', name: role.org }] : []),
      ...(degree ? [{ '@type': 'CollegeOrUniversity', name: degree.school }] : []),
    ],
    sameAs,
  };
}
