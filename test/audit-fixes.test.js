import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const app = readFileSync(join(root, 'app.js'), 'utf8');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const sample = readFileSync(join(root, 'sampleData.js'), 'utf8');
const db = readFileSync(join(root, 'db.js'), 'utf8');

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}`);
  assert.ok(start !== -1, `missing ${name}`);
  let brace = source.indexOf('{', start);
  let depth = 0;
  for (let i = brace; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

test('Hebcal fallbacks are "no disponible" with retry, never 18:15/19:10', () => {
  const zmanim = extractFunction(app, 'fetchHebcalZmanim');
  const unavailable = extractFunction(app, 'renderZmanimUnavailable');
  const clock = extractFunction(app, 'formatHebcalClock');
  assert.equal(zmanim.includes('18:15'), false);
  assert.equal(zmanim.includes('19:10'), false);
  assert.equal(unavailable.includes('18:15'), false);
  assert.equal(unavailable.includes('19:10'), false);
  assert.ok(unavailable.includes('no disponible'));
  assert.ok(unavailable.includes('retry-zmanim-btn'));
  assert.ok(zmanim.includes('retry-zmanim-btn') || unavailable.includes('retry-zmanim-btn'));

  const formatHebcalClock = new Function(`${clock}; return formatHebcalClock;`)();
  assert.equal(formatHebcalClock(null), 'no disponible');
  assert.equal(formatHebcalClock(''), 'no disponible');
  assert.equal(formatHebcalClock('18:15'), 'no disponible');
  assert.equal(formatHebcalClock('2026-11-15T18:42:00-03:00'), '18:42');
  assert.equal(formatHebcalClock('2026-11-15T19:10:00'), '19:10');
});

test('first run no longer writes the Levy seed; existing exact seed is only offered for removal', () => {
  const preload = extractFunction(app, 'checkAndPreloadSeedData');
  assert.equal(preload.includes('saveMember'), false);
  assert.equal(preload.includes('saveEvent'), false);
  assert.equal(preload.includes('saveShorashimProject'), false);
  assert.ok(preload.includes('offerDemoSeedRemoval'));
  assert.ok(sample.includes('DEMO_SEED_FINGERPRINT'));
  assert.equal(sample.includes('const INITIAL_MEMBERS'), false);
  assert.equal(sample.includes('const INITIAL_EVENTS'), false);
  assert.ok(html.includes('id="seed-data-banner"'));
  assert.ok(html.includes('id="remove-seed-data-btn"'));
  assert.ok(html.includes('id="keep-seed-data-btn"'));
  assert.equal(html.includes('Presentado por: David Levy'), false);
  assert.equal(app.includes("name: 'Familia Levy'"), false);
  assert.equal(app.includes('Varsovia, Polonia'), false);

  const isExactDemoSeed = new Function(
    `${sample}\n${extractFunction(app, 'isExactDemoSeed')}; return isExactDemoSeed;`
  )();
  const fingerprint = new Function(`${sample}; return DEMO_SEED_FINGERPRINT;`)();
  assert.equal(isExactDemoSeed(
    fingerprint.members,
    fingerprint.events,
    fingerprint.shorashim
  ), true);
  assert.equal(isExactDemoSeed(
    [...fingerprint.members, { id: 'member-extra', name: 'Usuario Real' }],
    fingerprint.events,
    fingerprint.shorashim
  ), false);
  assert.equal(isExactDemoSeed([], [], null), false);
});

test('add/edit modal title elements exist in the DOM cache and markup', () => {
  assert.ok(html.includes('id="event-modal-title"'));
  assert.ok(html.includes('id="member-modal-title"'));
  assert.ok(app.includes("eventModalTitle: document.getElementById('event-modal-title')"));
  assert.ok(app.includes("memberModalTitle: document.getElementById('member-modal-title')"));
});

test('oral history recordings are attached to event media on save', () => {
  assert.ok(app.includes('if (recordedAudioBlob)'));
  assert.ok(app.includes("type: 'audio'"));
  assert.ok(app.includes('historia-oral.webm'));
  assert.ok(app.includes('resetAudioRecorderUI'));
  assert.ok(app.includes('showExistingAudioPreview'));
});

test('importDatabase validates first and replaces data in one transaction', () => {
  const importFn = db.slice(
    db.indexOf('async function importDatabase'),
    db.indexOf('async function clearAllData')
  );
  assert.ok(importFn.indexOf('parseBackupJson') < importFn.indexOf('prepareBackupForImport'));
  assert.ok(importFn.indexOf('prepareBackupForImport') < importFn.indexOf('db.transaction'));
  assert.ok(importFn.indexOf('.clear()') < importFn.indexOf('.put('));
  assert.equal(importFn.includes('await clearAllData()'), false);
  assert.ok(importFn.includes('transaction.onabort'));
});

test('hebrew blessing strings contain no Arabic or Latin letters', () => {
  const values = [...sample.matchAll(/hebrew:\s*'((?:\\'|[^'])*)'/g)].map((match) => match[1]);
  assert.equal(values.length, 8);
  const arabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/u;
  const latin = /[A-Za-z]/;
  for (const value of values) {
    assert.equal(arabic.test(value), false, value);
    assert.equal(latin.test(value), false, value);
    assert.match(value, /[\u0590-\u05FF]/u);
  }
});
