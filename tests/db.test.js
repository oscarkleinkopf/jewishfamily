import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

globalThis.DORLDOR_DB_NAME = 'DorLDorDBTest';
await import('../db.js');

const db = globalThis.DorLdorDb;

async function resetDatabase() {
  db.resetDbInstance();
  await new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(db.getDbName());
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

afterEach(async () => {
  await resetDatabase();
});

test('CRUD de miembros y eventos persiste en IndexedDB', async () => {
  await db.saveMember({ id: 'm1', name: 'David', relationship: 'Hijo', birthDate: '2013-06-18' });
  await db.saveEvent({ id: 'e-old', title: 'Jupá', category: 'Jupá / Boda', date: '2008-06-15' });
  await db.saveEvent({ id: 'e-new', title: 'Bar Mitzvá', category: 'Bar / Bat Mitzvá', date: '2026-06-18' });

  const members = await db.getMembers();
  const events = await db.getEvents();

  assert.equal(members.length, 1);
  assert.equal(members[0].name, 'David');
  assert.equal(events[0].id, 'e-new');
  assert.equal(events[1].id, 'e-old');

  await db.deleteMember('m1');
  assert.equal((await db.getMembers()).length, 0);
});

test('export/import redondea miembros, eventos y settings', async () => {
  await db.saveMember({ id: 'm1', name: 'Rajel', relationship: 'Madre', birthDate: '1978-08-05' });
  await db.saveSetting('app_theme', 'dark');
  const exported = await db.exportDatabase();
  const parsed = JSON.parse(exported);
  assert.equal(parsed.members[0].name, 'Rajel');
  assert.equal(parsed.settings.find((item) => item.key === 'app_theme').value, 'dark');

  await db.clearAllData();
  assert.equal((await db.getMembers()).length, 0);

  await db.importDatabase(exported);
  const members = await db.getMembers();
  const theme = await db.getSetting('app_theme');
  assert.equal(members[0].name, 'Rajel');
  assert.equal(theme, 'dark');
});

test('blobToBase64 y base64ToBlob conservan tipo y contenido', async () => {
  const original = new Blob(['hola-familia'], { type: 'text/plain' });
  const encoded = await db.blobToBase64(original);
  assert.equal(encoded.isBlob, true);
  assert.equal(encoded.type, 'text/plain');

  const restored = db.base64ToBlob(encoded);
  assert.equal(restored.type, 'text/plain');
  assert.equal(await restored.text(), 'hola-familia');
});
