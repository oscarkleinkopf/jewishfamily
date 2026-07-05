/**
 * db.js
 * Capa de persistencia local usando IndexedDB para la aplicación Dor L'Dor.
 * Configurada para ejecución directa en el navegador sin necesidad de servidor local.
 */

const DB_NAME = 'DorLDorDB';
const DB_VERSION = 1;

let dbInstance = null;

function initDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      return resolve(dbInstance);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error al abrir la base de datos:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('members')) {
        db.createObjectStore('members', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('shorashim')) {
        db.createObjectStore('shorashim', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });
}

// --- Operaciones de Miembros (Familia) ---

async function getMembers() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('members', 'readonly');
    const store = transaction.objectStore('members');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function saveMember(member) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('members', 'readwrite');
    const store = transaction.objectStore('members');
    const request = store.put(member);

    request.onsuccess = () => resolve(member);
    request.onerror = () => reject(request.error);
  });
}

async function deleteMember(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('members', 'readwrite');
    const store = transaction.objectStore('members');
    const request = store.delete(id);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

// --- Operaciones de Acontecimientos (Eventos) ---

async function getEvents() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('events', 'readonly');
    const store = transaction.objectStore('events');
    const request = store.getAll();

    request.onsuccess = () => {
      const events = request.result || [];
      events.sort((a, b) => new Date(b.date) - new Date(a.date));
      resolve(events);
    };
    request.onerror = () => reject(request.error);
  });
}

async function saveEvent(event) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');
    const request = store.put(event);

    request.onsuccess = () => resolve(event);
    request.onerror = () => reject(request.error);
  });
}

async function deleteEvent(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');
    const request = store.delete(id);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

// --- Operaciones de Shorashim ---

async function getShorashimProject() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('shorashim', 'readonly');
    const store = transaction.objectStore('shorashim');
    const request = store.get('project');

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function saveShorashimProject(projectData) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('shorashim', 'readwrite');
    const store = transaction.objectStore('shorashim');
    const data = { id: 'project', ...projectData };
    const request = store.put(data);

    request.onsuccess = () => resolve(data);
    request.onerror = () => reject(request.error);
  });
}

// --- Operaciones de Ajustes ---

async function getSetting(key) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('settings', 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(key);

    request.onsuccess = () => resolve(request.result ? request.result.value : null);
    request.onerror = () => reject(request.error);
  });
}

async function saveSetting(key, value) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('settings', 'readwrite');
    const store = transaction.objectStore('settings');
    const request = store.put({ key, value });

    request.onsuccess = () => resolve(value);
    request.onerror = () => reject(request.error);
  });
}

// --- Utilidades de Respaldo ---

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    if (!(blob instanceof Blob)) {
      return resolve(blob);
    }
    const reader = new FileReader();
    reader.onloadend = () => resolve({
      isBlob: true,
      type: blob.type,
      data: reader.result
    });
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(blobInfo) {
  if (!blobInfo || typeof blobInfo !== 'object' || !blobInfo.isBlob) {
    return blobInfo;
  }
  const base64Data = blobInfo.data;
  const contentType = blobInfo.type;
  
  const parts = base64Data.split(',');
  const byteCharacters = atob(parts[1] || parts[0]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

async function exportDatabase() {
  const members = await getMembers();
  const events = await getEvents();
  const shorashim = await getShorashimProject();
  
  const serializedMembers = await Promise.all(members.map(async (m) => {
    const memberCopy = { ...m };
    if (memberCopy.avatar && memberCopy.avatar instanceof Blob) {
      memberCopy.avatar = await blobToBase64(memberCopy.avatar);
    }
    return memberCopy;
  }));

  const serializedEvents = await Promise.all(events.map(async (e) => {
    const eventCopy = { ...e };
    if (eventCopy.media && Array.isArray(eventCopy.media)) {
      eventCopy.media = await Promise.all(eventCopy.media.map(async (item) => {
        const itemCopy = { ...item };
        if (itemCopy.blob && itemCopy.blob instanceof Blob) {
          itemCopy.blob = await blobToBase64(itemCopy.blob);
        }
        return itemCopy;
      }));
    }
    return eventCopy;
  }));

  const serializedShorashim = shorashim ? { ...shorashim } : null;
  if (serializedShorashim && serializedShorashim.tree) {
    for (const key in serializedShorashim.tree) {
      const node = serializedShorashim.tree[key];
      if (node && node.avatar && node.avatar instanceof Blob) {
        node.avatar = await blobToBase64(node.avatar);
      }
    }
  }

  return JSON.stringify({
    version: DB_VERSION,
    members: serializedMembers,
    events: serializedEvents,
    shorashim: serializedShorashim,
    exportedAt: new Date().toISOString()
  });
}

async function importDatabase(jsonString) {
  const data = JSON.parse(jsonString);
  const db = await initDB();

  await clearAllData();

  const transaction = db.transaction(['members', 'events', 'shorashim'], 'readwrite');
  
  if (data.members && Array.isArray(data.members)) {
    const memberStore = transaction.objectStore('members');
    for (const m of data.members) {
      if (m.avatar && typeof m.avatar === 'object' && m.avatar.isBlob) {
        m.avatar = base64ToBlob(m.avatar);
      }
      memberStore.put(m);
    }
  }

  if (data.events && Array.isArray(data.events)) {
    const eventStore = transaction.objectStore('events');
    for (const e of data.events) {
      if (e.media && Array.isArray(e.media)) {
        e.media = e.media.map((item) => {
          if (item.blob && typeof item.blob === 'object' && item.blob.isBlob) {
            item.blob = base64ToBlob(item.blob);
          }
          return item;
        });
      }
      eventStore.put(e);
    }
  }

  if (data.shorashim) {
    const shorashimStore = transaction.objectStore('shorashim');
    const sh = data.shorashim;
    if (sh.tree) {
      for (const key in sh.tree) {
        const node = sh.tree[key];
        if (node && node.avatar && typeof node.avatar === 'object' && node.avatar.isBlob) {
          node.avatar = base64ToBlob(node.avatar);
        }
      }
    }
    shorashimStore.put(sh);
  }

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}

async function clearAllData() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['members', 'events', 'shorashim'], 'readwrite');
    transaction.objectStore('members').clear();
    transaction.objectStore('events').clear();
    transaction.objectStore('shorashim').clear();

    transaction.oncomplete = () => resolve(true);
    transaction.onerror = () => reject(transaction.error);
  });
}
