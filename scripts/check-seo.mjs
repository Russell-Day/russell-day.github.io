// npm run check:seo: builds the site into a temp folder and checks what search
// engines get without running JavaScript. Fails if the prerender step stops
// working, the Person data stops parsing, or the sitemap points at missing files.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (rel) => JSON.parse(readFileSync(path.join(root, rel), 'utf8'));
const site = readJson('src/config/site.json');
const publications = readJson('src/config/publications.json');
const projects = readJson('src/config/projects.json');

// Letters and digits only, so the page's display punctuation (dashes, no-break
// spaces, escaped quotes) doesn't matter when looking for a title.
const words = (s) => s.replace(/&[#\w]+;/g, ' ').replace(/<!-- -->/g, '').replace(/[^\p{L}\p{N}]+/gu, '');

const out = mkdtempSync(path.join(tmpdir(), 'check-seo-'));
const failures = [];
const check = (name, fn) => {
  try {
    fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`FAIL ${name}\n     ${err.message.split('\n').join('\n     ')}`);
  }
};

try {
  const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] });
  run(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'warn']);
  run(process.execPath, [path.join(root, 'scripts/prerender.mjs'), out]);

  const html = readFileSync(path.join(out, 'index.html'), 'utf8');
  const rootHtml = /<div id="root">([\s\S]*)<\/div>\s*<\/body>/.exec(html)?.[1] ?? '';
  const rootWords = words(rootHtml.replace(/<[^>]+>/g, ''));
  const pageUrl = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];

  check('index.html #root is prerendered', () => assert.ok(rootHtml.length > 1000, `#root holds ${rootHtml.length} chars`));

  check('every publication title is in the raw HTML', () => {
    const titles = publications.flatMap((g) => g.items.map((i) => i.title));
    assert.ok(titles.length > 0, 'publications.json has no titles');
    const missing = titles.filter((t) => !rootWords.includes(words(t)));
    assert.deepEqual(missing, []);
  });

  check('every project title is in the raw HTML', () => {
    const missing = projects.map((p) => p.title).filter((t) => !rootWords.includes(words(t)));
    assert.deepEqual(missing, []);
  });

  check('the CV and same-site PDFs are plain links', () => {
    const pdfs = [site.cv.href, ...publications.flatMap((g) => g.items.map((i) => i.href)), ...projects.map((p) => p.link)]
      .filter((h) => h && h.startsWith('/') && h.endsWith('.pdf'));
    const missing = [...new Set(pdfs)].filter((h) => !rootHtml.includes(`href="${h}"`));
    assert.deepEqual(missing, []);
  });

  check('Person JSON-LD parses and matches the config', () => {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.equal(blocks.length, 1, `${blocks.length} JSON-LD blocks`);
    const ld = JSON.parse(blocks[0][1]);
    assert.equal(ld['@type'], 'Person');
    assert.equal(ld.name, site.name);
    if (site.nameZh) assert.equal(ld.alternateName, site.nameZh);
    assert.equal(ld.url, pageUrl);
    const profiles = site.contact.links.filter((l) => /^https?:/.test(l.href)).map((l) => l.href);
    assert.deepEqual(ld.sameAs, profiles);
    // The image must be a file the build actually ships.
    const img = new URL(ld.image);
    assert.equal(img.origin, new URL(pageUrl).origin);
    assert.ok(existsSync(path.join(out, img.pathname)), `${img.pathname} is not in the build`);
  });

  check('sitemap.xml lists the home page and only files that ship', () => {
    const xml = readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.equal(locs[0], pageUrl);
    assert.ok(locs.includes(new URL(site.cv.href, pageUrl).href), 'CV missing');
    for (const loc of locs.slice(1)) {
      const p = new URL(loc).pathname;
      assert.ok(existsSync(path.join(out, p)), `${loc} has no file in the build`);
    }
  });

  check('robots.txt allows everything and names the sitemap', () => {
    const robots = readFileSync(path.join(out, 'robots.txt'), 'utf8');
    assert.match(robots, /^User-agent: \*$/m);
    assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m);
    assert.match(robots, new RegExp(`^Sitemap: ${new URL('sitemap.xml', pageUrl).href}$`, 'm'));
  });

  check('/cv/ redirects to the CV PDF', () => {
    const cvPage = readFileSync(path.join(out, 'cv/index.html'), 'utf8');
    assert.ok(cvPage.includes(`url=${site.cv.href}"`), 'no meta refresh to the CV');
    assert.ok(cvPage.includes(`<link rel="canonical" href="${new URL(site.cv.href, pageUrl).href}"`), 'no canonical to the CV');
    assert.ok(existsSync(path.join(out, site.cv.href)), 'CV PDF not in the build');
  });
} finally {
  rmSync(out, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nall SEO checks passed');
