// Post-build step: puts the rendered page into <outDir>/index.html so search
// engines (and anyone without JavaScript) get the full text and links, adds
// the Person structured data to <head>, and writes sitemap.xml.
//
//   node scripts/prerender.mjs [outDir]     (default: dist)
//
// The client entry (src/main.tsx) hydrates what this writes.
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(root, process.argv[2] ?? 'dist');
const EMPTY_ROOT = '<div id="root"></div>';

const readJson = (rel) => JSON.parse(readFileSync(path.join(root, rel), 'utf8'));

/** The canonical URL index.html declares; every absolute URL is built from it. */
function canonicalOf(html) {
  const m = /<link rel="canonical" href="([^"]+)"/.exec(html);
  if (!m) throw new Error('prerender: index.html has no <link rel="canonical">');
  return m[1];
}

/**
 * Pages for sitemap.xml: the home page, the CV, and every same-site file the
 * config links to (the paper PDFs). Each must exist in public/, so a broken
 * link fails the build instead of reaching Google.
 */
export function sitemapUrls(pageUrl) {
  const site = readJson('src/config/site.json');
  const hrefs = [site.cv.href];
  for (const group of readJson('src/config/publications.json')) {
    for (const item of group.items) if (item.href) hrefs.push(item.href);
  }
  for (const p of readJson('src/config/projects.json')) {
    hrefs.push(p.link, ...(p.detailLinks ?? []).map((l) => l.href));
  }
  const files = [...new Set(hrefs.filter((h) => h && h.startsWith('/') && !h.startsWith('//')))];
  for (const f of files) {
    if (!existsSync(path.join(root, 'public', f))) {
      throw new Error(`prerender: config links to ${f}, which is not in public/`);
    }
  }
  return [pageUrl, ...files.map((f) => new URL(f, pageUrl).href)];
}

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sitemapXml(urls) {
  const rows = urls.map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`;
}

async function main() {
  const indexPath = path.join(outDir, 'index.html');
  const html = await readFile(indexPath, 'utf8');
  if (!html.includes(EMPTY_ROOT)) {
    throw new Error(`prerender: ${indexPath} has no empty ${EMPTY_ROOT} (already prerendered?)`);
  }
  const pageUrl = canonicalOf(html);

  // Bundle the server entry with the same Vite setup as the client, so image
  // imports resolve to the same hashed /assets/ URLs.
  const ssrDir = await mkdtemp(path.join(tmpdir(), 'prerender-'));
  try {
    await build({
      root,
      logLevel: 'warn',
      ssr: { noExternal: true },
      build: {
        ssr: 'src/entry-server.tsx',
        outDir: ssrDir,
        emptyOutDir: true,
        copyPublicDir: false,
        rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
      },
    });
    const { render, personJsonLd } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.mjs')).href);

    const body = render();
    // "<" escaped so the JSON can never close the script tag early.
    const ld = JSON.stringify(personJsonLd(pageUrl), null, 2).replace(/</g, '\\u003c');
    const out = html
      .replace(EMPTY_ROOT, `<div id="root">${body}</div>`)
      .replace('</head>', `    <script type="application/ld+json">\n${ld}\n    </script>\n    </head>`);
    await writeFile(indexPath, out);

    const urls = sitemapUrls(pageUrl);
    await writeFile(path.join(outDir, 'sitemap.xml'), sitemapXml(urls));
    console.log(`prerender: ${path.relative(root, indexPath)} (${body.length} chars of HTML), sitemap.xml (${urls.length} URLs)`);
  } finally {
    await rm(ssrDir, { recursive: true, force: true });
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
