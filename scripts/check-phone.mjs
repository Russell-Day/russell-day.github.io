// npm run check:phone [dir]: fails if any file the site ships (dist/ by default)
// holds something that looks like a phone number. Text files are read as they
// are; PDFs go through pdftotext. Runs before every deploy (predeploy).
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// US-style numbers: (313) 555-0142, 313-555-0142, 313.555.0142, 313 555 0142,
// +1 313 555 0142, +1-313-555-0142, +13135550142, tel: links. Separators include
// no-break and thin spaces and the dashes pdftotext can emit.
const sep = '[\\s.\\-\\u2010-\\u2015\\u2212\\u00a0\\u2009\\u202f]';
export const PHONE = new RegExp(
  `(?<![\\w.])(?:\\+1${sep}?)?(?:\\(\\d{3}\\)${sep}?|\\d{3}${sep})\\d{3}${sep}\\d{4}(?![\\w.])|\\+1\\d{10}(?!\\d)` +
    // Any tel: link with digits, bare ten-digit ones included (tel:3135550142).
    `|\\btel:(?:\\/\\/)?(?:\\+|%2[bB])?[\\s(]*\\d[^\\s"'<>]*`,
  'gu',
);

// Every file is read as text except these binary types. Any other file holding
// NUL bytes fails the check, so a new binary type gets looked at and listed here.
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.ico', '.bmp', '.woff', '.woff2',
  '.ttf', '.otf', '.eot', '.mp4', '.webm', '.mov', '.mp3', '.wav', '.ogg', '.zip', '.gz', '.br']);

const pdfText = (file) => {
  try {
    return execFileSync('pdftotext', ['-q', file, '-'], { encoding: 'utf8', maxBuffer: 64 << 20 });
  } catch (err) {
    throw new Error(`pdftotext failed on ${file} (${err.code ?? err.message}); install poppler-utils`);
  }
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

export function findPhones(dir) {
  const hits = [];
  for (const file of walk(dir)) {
    const ext = path.extname(file).toLowerCase();
    if (BINARY.has(ext)) continue;
    let text;
    if (ext === '.pdf') text = pdfText(file);
    else {
      const buf = readFileSync(file);
      if (buf.includes(0)) throw new Error(`${path.relative(dir, file)} is binary and not a known type; check it, then add ${ext || 'its name'} to BINARY`);
      text = buf.toString('utf8');
    }
    for (const m of text.matchAll(PHONE)) hits.push({ file: path.relative(dir, file), match: m[0] });
  }
  return hits;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const dir = path.resolve(process.argv[2] ?? path.join(root, 'dist'));
  try {
    const hits = findPhones(dir);
    if (hits.length) {
      for (const h of hits) console.error(`phone number in ${h.file}: ${h.match}`);
      process.exit(1);
    }
    console.log(`ok   no phone numbers in ${path.relative(root, dir) || dir}`);
  } catch (err) {
    console.error(`FAIL ${err.message}`);
    process.exit(1);
  }
}
