import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import '../security.js';

const { escapeHtml, sanitizeUrl, parseBackupJson, BACKUP_ERROR } = globalThis.DorLDorSecurity;
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function validBackup(overrides = {}) {
  return {
    version: 1,
    members: [{ id: 'member-1', name: 'Sara Levy', relationship: 'Madre' }],
    events: [{ id: 'event-1', title: 'Jupá', description: 'Boda', date: '2008-06-15' }],
    shorashim: null,
    exportedAt: '2026-07-06T00:00:00.000Z',
    ...overrides
  };
}

test('escapeHtml encodes markup that would execute in innerHTML', () => {
  const payload = '<img src=x onerror="alert(1)">';
  const escaped = escapeHtml(payload);
  assert.equal(escaped.includes('<img'), false);
  assert.equal(escaped, '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');

  const template = `<h3>${escaped}</h3>`;
  assert.equal(template.includes('<script'), false);
  assert.match(template, /&lt;img/);
});

test('escapeHtml encodes attribute-breakout payloads', () => {
  const payload = '"><img src=x onerror=alert(1)>';
  const escaped = escapeHtml(payload);
  const html = `<img alt="${escaped}" src="https://example.com/a.jpg">`;
  assert.equal(html.includes('<img src=x'), false);
  assert.match(html, /&quot;&gt;&lt;img/);
});

test('sanitizeUrl allows http(s) and blob, rejects javascript and data', () => {
  assert.equal(
    sanitizeUrl('https://images.unsplash.com/photo-1?w=800', 'fallback'),
    'https://images.unsplash.com/photo-1?w=800'
  );
  assert.equal(sanitizeUrl('http://example.com/a.jpg', 'fallback'), 'http://example.com/a.jpg');
  assert.equal(sanitizeUrl('blob:https://localhost/abc', 'fallback'), 'blob:https://localhost/abc');
  assert.equal(sanitizeUrl('javascript:alert(1)', 'fallback'), 'fallback');
  assert.equal(sanitizeUrl('JAVASCRIPT:alert(1)', 'fallback'), 'fallback');
  assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>', 'fallback'), 'fallback');
  assert.equal(sanitizeUrl('vbscript:msgbox(1)', 'fallback'), 'fallback');
  assert.equal(sanitizeUrl('', 'fallback'), 'fallback');
});

test('parseBackupJson accepts a full export from this app', () => {
  const parsed = parseBackupJson(JSON.stringify(validBackup()));
  assert.equal(parsed.members[0].name, 'Sara Levy');
  assert.equal(parsed.events[0].title, 'Jupá');
});

test('parseBackupJson accepts XSS strings but does not treat them as markup', () => {
  const parsed = parseBackupJson(JSON.stringify(validBackup({
    events: [{
      id: 'event-xss',
      title: '<script>alert(1)</script>',
      description: '<img src=x onerror=alert(1)>',
      location: 'javascript:alert(1)',
      imageUrl: 'javascript:alert(1)'
    }]
  })));
  assert.equal(parsed.events[0].title, '<script>alert(1)</script>');
  const renderedTitle = `<h3>${escapeHtml(parsed.events[0].title)}</h3>`;
  assert.equal(renderedTitle.includes('<script>'), false);
  assert.equal(sanitizeUrl(parsed.events[0].imageUrl, 'safe'), 'safe');
});

test('parseBackupJson rejects empty or incomplete JSON before any import can run', () => {
  assert.throws(() => parseBackupJson('{}'), { message: BACKUP_ERROR });
  assert.throws(() => parseBackupJson('[]'), { message: BACKUP_ERROR });
  assert.throws(() => parseBackupJson('{not json'), { message: BACKUP_ERROR });
  assert.throws(() => parseBackupJson(JSON.stringify({ version: 1 })), { message: BACKUP_ERROR });
  assert.throws(() => parseBackupJson(JSON.stringify({ version: 1, members: [] })), { message: BACKUP_ERROR });
  assert.throws(() => parseBackupJson(JSON.stringify({ members: [], events: [] })), { message: BACKUP_ERROR });
});

test('parseBackupJson rejects malformed records', () => {
  assert.throws(
    () => parseBackupJson(JSON.stringify(validBackup({ members: [{ name: 'No id' }] }))),
    { message: BACKUP_ERROR }
  );
  assert.throws(
    () => parseBackupJson(JSON.stringify(validBackup({ events: [{ id: 'e1', title: 22 }] }))),
    { message: BACKUP_ERROR }
  );
  assert.throws(
    () => parseBackupJson(JSON.stringify(validBackup({
      members: [{ id: 'm1', name: 'A', avatar: { isBlob: true, type: 'image/png', data: '<script>' } }]
    }))),
    { message: BACKUP_ERROR }
  );
});

test('importDatabase validates JSON before clearing IndexedDB', () => {
  const source = readFileSync(join(root, 'db.js'), 'utf8');
  const importFn = source.slice(source.indexOf('async function importDatabase'));
  const parseIdx = importFn.indexOf('parseBackupJson');
  const prepareIdx = importFn.indexOf('prepareBackupForImport');
  const clearIdx = importFn.indexOf('clearAllData');
  assert.ok(parseIdx !== -1 && prepareIdx !== -1 && clearIdx !== -1);
  assert.ok(parseIdx < prepareIdx);
  assert.ok(prepareIdx < clearIdx);
});

test('html2pdf.js is pinned to the GHSA-w8x4-x68c-m6fc patched release', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const sw = readFileSync(join(root, 'sw.js'), 'utf8');
  assert.match(html, /html2pdf\.js\/0\.14\.0\/html2pdf\.bundle\.min\.js/);
  assert.equal(html.includes('html2pdf.js/0.10.1'), false);
  assert.match(sw, /html2pdf\.js\/0\.14\.0\/html2pdf\.bundle\.min\.js/);
});
