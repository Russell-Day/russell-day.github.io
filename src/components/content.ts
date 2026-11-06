// Display helpers. Every fact on the page comes from src/config; nothing here
// adds one.
import { siteConfig } from './config';

export const NAME = 'Russell Day';
export const EMAIL = 'russday@umich.edu';

export const github = siteConfig.contact.links.find((l) => l.type === 'github')!;
export const linkedin = siteConfig.contact.links.find((l) => l.type === 'linkedin')!;
export const cv = siteConfig.cv;

/**
 * Display-only punctuation: no em or en dashes on the page. A spaced range
 * ("Nov 29 - Dec 3") gets no-break spaces and a word joiner (U+2060) after the
 * hyphen, since browsers may still break after a plain hyphen.
 */
export function tidy(text: string): string {
  return text
    .replace(/\s*—\s*/g, ', ')
    .replace(/\s+[–-]\s+/g, '\u00a0-\u2060\u00a0')
    .replace(/–/g, '-')
    .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d)/g, '$1\u00a0$2');
}

const SELF = /(Day, R\.(?: G\.)?)/;

/** Splits an author list so Russell's own name can be set apart. */
export function authorParts(authors: string): { text: string; self: boolean }[] {
  return authors
    .split(SELF)
    .filter(Boolean)
    .map((text) => ({ text, self: /^Day, R\.(?: G\.)?$/.test(text) }));
}

/** A short word for where a link goes, shown as part of the link. */
export function linkKind(href: string): string {
  if (/doi\.org\//.test(href)) return 'DOI';
  if (/\.pdf($|[?#])/i.test(href)) return 'PDF';
  if (/abstractsonline\.com|spie\.org\/.+\/presentation\//.test(href)) return 'Abstract';
  return 'Website';
}

export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
