import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { shouldIgnoreBackupEntry } from '../backup-ignore.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('backup ignore rules cover env variants and key material', () => {
  assert.equal(shouldIgnoreBackupEntry('.env'), true);
  assert.equal(shouldIgnoreBackupEntry('.env.local'), true);
  assert.equal(shouldIgnoreBackupEntry('.env.production'), true);
  assert.equal(shouldIgnoreBackupEntry('node_modules'), true);
  assert.equal(shouldIgnoreBackupEntry('.git'), true);
  assert.equal(shouldIgnoreBackupEntry('.netlify'), true);
  assert.equal(shouldIgnoreBackupEntry('id_rsa.pem'), true);
  assert.equal(shouldIgnoreBackupEntry('secret.key'), true);
  assert.equal(shouldIgnoreBackupEntry('app.js'), false);
  assert.equal(shouldIgnoreBackupEntry('db.js'), false);
});

test('backup scripts no longer run git add, commit, or push', () => {
  const backup = readFileSync(join(root, 'backup.js'), 'utf8');
  const watch = readFileSync(join(root, 'watch-backup.js'), 'utf8');
  for (const source of [backup, watch]) {
    assert.equal(source.includes('git add'), false);
    assert.equal(source.includes('git commit'), false);
    assert.equal(source.includes('git push'), false);
    assert.equal(source.includes('execSync'), false);
  }
});
