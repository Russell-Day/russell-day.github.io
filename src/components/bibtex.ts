// BibTeX for a publication, built only from its fields in publications.json.
// Anything that does not parse cleanly gets no BibTeX rather than a guess.
import type { Publication } from './types';

const SKIP = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'for', 'and', 'to', 'from', 'with', 'using', 'versus', 'vs']);

/** "Cross, A. G., Rain, U., & Muma, B." as BibTeX names, or null if it does not pair up. */
function names(authors: string) {
  const parts = authors
    .replace(/,?\s*&\s*/g, ', ')
    .split(/,\s*/)
    .map((p) => p.trim());
  if (parts.length % 2) return null;
  const out: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    if (!parts[i] || !/^(?:[A-Z]\.\s?)+$/.test(parts[i + 1])) return null;
    out.push(`${parts[i]}, ${parts[i + 1]}`);
  }
  return out;
}

const esc = (s: string) => s.replace(/[&%$#_]/g, '\\$&').replace(/\s*–\s*/g, '--');

/** First author's surname, the year, and the title's first two content words. */
function key(first: string, item: Publication) {
  const surname = first.split(',')[0].toLowerCase().replace(/[^a-z]/g, '');
  const words = item.title
    .split(/[^A-Za-z0-9]+/)
    .filter((w) => w && !SKIP.has(w.toLowerCase()))
    .slice(0, 2)
    .join('')
    .toLowerCase();
  return `${surname}${item.year}${words}`;
}

export function bibtex(item: Publication, group: string): string | null {
  const people = names(item.authors);
  if (!people) return null;
  const venue = item.venue.trim();
  let type: string;
  const fields: [string, string][] = [];

  if (/journal/i.test(group)) {
    const m = /^(.*?),\s*(\d+)(?:\((\d+)\))?,\s*(.+)$/.exec(venue);
    if (!m) return null;
    type = 'article';
    fields.push(['journal', m[1]], ['volume', m[2]]);
    if (m[3]) fields.push(['number', m[3]]);
    fields.push(['pages', m[4]]);
  } else if (/conference/i.test(group)) {
    const m = /^(.*?),\s*Proc\. SPIE (\d+),\s*(.*?)(?:\s*\((.+)\))?$/.exec(venue);
    if (!m) return null;
    type = 'inproceedings';
    fields.push(['booktitle', m[1]], ['series', 'Proc. SPIE'], ['volume', m[2]], ['address', m[3]]);
  } else if (/podium|poster/i.test(group)) {
    type = 'misc';
    fields.push(['howpublished', venue], ['note', group.replace(/s$/, '')]);
  } else {
    return null;
  }

  const doi = item.href && /doi\.org\/(.+)$/.exec(item.href)?.[1];
  const url = item.href && !doi ? new URL(item.href, 'https://russellday.dev').href : null;
  const all: [string, string][] = [
    ['author', people.join(' and ')],
    ['title', `{${item.title}}`],
    ...fields,
    ['year', item.year],
    ...(doi ? [['doi', doi] as [string, string]] : []),
    ...(url ? [['url', url] as [string, string]] : []),
  ];
  const width = Math.max(...all.map(([k]) => k.length));
  const lines = all.map(([k, v]) => `  ${k.padEnd(width)} = {${k === 'url' || k === 'doi' ? v : esc(v)}}`);
  return `@${type}{${key(people[0], item)},\n${lines.join(',\n')}\n}`;
}
