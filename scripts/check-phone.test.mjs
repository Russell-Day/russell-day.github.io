// node --test scripts/check-phone.test.mjs
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { PHONE, findPhones } from './check-phone.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-phone.mjs');
const FAKE = '(313) 555-0142';

// A one-page PDF whose text is `line`, with a correct xref table.
function pdf(line) {
  const esc = line.replace(/[\\()]/g, (c) => `\\${c}`);
  const stream = `BT /F1 12 Tf 72 720 Td (${esc}) Tj ET`;
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let out = '%PDF-1.4\n';
  const offsets = objs.map((o, i) => {
    const at = out.length;
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
    return at;
  });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  out += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
  out += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return out;
}

function site(files) {
  const dir = mkdtempSync(path.join(tmpdir(), 'check-phone-'));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    writeFileSync(path.join(dir, rel), body);
  }
  return dir;
}

const run = (dir) => spawnSync(process.execPath, [script, dir], { encoding: 'utf8' });

test('the pattern catches the usual ways of writing a number', () => {
  for (const s of [FAKE, '313-555-0142', '313.555.0142', '313 555 0142', '+1 313 555 0142', '+1-313-555-0142',
    '+1 (313) 555-0142', '+13135550142', '(313) 555‑0142', '313–555–0142',
    '313\u2212555\u22120142', '313\u2009555\u20090142', '313\u202f555\u202f0142']) {
    assert.ok([...`x ${s} x`.matchAll(PHONE)].length === 1, s);
  }
});

test('the pattern leaves dates, GPAs, versions and ids alone', () => {
  for (const s of ['Aug 2023 – May 2027', 'GPA 3.869/4.000', 'react@18.3.1', 'arXiv:2406.12345', 'AUC 0.89',
    'doi:10.1148/ryai.240123', '6, 1541508.', '1.234.567.8901', 'v3135550142', 'id 1700000000000']) {
    assert.deepEqual([...s.matchAll(PHONE)], [], s);
  }
});

test('a PDF with a phone number fails the check', (t) => {
  const dir = site({ 'cv/cv.pdf': pdf(`Jane Doe  ${FAKE}  jane@example.com`), 'index.html': '<p>hi</p>' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.equal(execFileSync('pdftotext', [path.join(dir, 'cv/cv.pdf'), '-'], { encoding: 'utf8' }).includes(FAKE), true);
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /cv\/cv\.pdf: \(313\) 555-0142/);
});

test('an HTML or JS file with a phone number fails the check', (t) => {
  const dir = site({ 'index.html': `<a href="tel:+13135550142">call</a>`, 'assets/app.js': 'const x="313-555-0142";' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const hits = findPhones(dir).map((h) => h.file).sort();
  assert.deepEqual(hits, ['assets/app.js', 'index.html']);
  assert.equal(run(dir).status, 1);
});

test('a clean site passes, images are skipped', (t) => {
  const dir = site({
    'index.html': '<title>Jane Doe</title><p>Aug 2023 – May 2027</p>',
    'cv/cv.pdf': pdf('Jane Doe  jane@example.com  example.dev'),
    'img/photo.png': Buffer.from('313-555-0142'),
  });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const r = run(dir);
  assert.equal(r.status, 0, r.stderr);
});

test('tel: links fail, bare ten digits included', (t) => {
  const dir = site({ 'index.html': '<a href="tel:3135550142">call</a>' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.deepEqual(findPhones(dir).map((h) => h.match), ['tel:3135550142']);
});

test('text files of any type are scanned, extensionless ones too', (t) => {
  const dir = site({ 'contact.csv': 'name,phone\nJane,313-555-0142\n', CNAME: '(313) 555-0142\n', 'feed.rss': '<x>313.555.0142</x>' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  assert.deepEqual(findPhones(dir).map((h) => h.file).sort(), ['CNAME', 'contact.csv', 'feed.rss']);
});

test('an unknown binary file fails the check instead of being skipped', (t) => {
  const dir = site({ 'data.bin': Buffer.from([0, 1, 2, 3]), 'index.html': '<p>hi</p>' });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const r = run(dir);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /data\.bin is binary/);
});

test('tel: forms with +, %2B or ( are caught; React\'s input-type table is not', () => {
  for (const s of ['tel:+13135550142', 'tel:%2B13135550142', 'tel:(313)5550142', 'tel://3135550142']) {
    assert.equal([...`href="${s}"`.matchAll(PHONE)].length, 1, s);
  }
  assert.deepEqual([...'{search:!0,tel:!0,text:!0}'.matchAll(PHONE)], []);
});
