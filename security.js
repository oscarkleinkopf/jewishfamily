/**
 * security.js
 * Shared sanitization and backup-validation helpers for Dor L'Dor.
 * Loaded as a classic browser script and as a Node ESM side-effect module.
 */
(function (global) {
  const BACKUP_ERROR = 'Archivo de copia de seguridad inválido.';
  const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

  function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeUrl(value, fallback) {
    const fallbackUrl = fallback == null ? '' : String(fallback);
    if (value == null) return fallbackUrl;
    const raw = String(value).trim();
    if (!raw) return fallbackUrl;
    if (raw.toLowerCase().startsWith('blob:')) return raw;
    try {
      const parsed = new URL(raw, 'https://dor-ldor.invalid');
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        return raw;
      }
    } catch {
      return fallbackUrl;
    }
    return fallbackUrl;
  }

  function isPlainObject(value) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  function assertOptionalString(value) {
    if (value != null && typeof value !== 'string') {
      throw new Error(BACKUP_ERROR);
    }
  }

  function assertOptionalStringArray(value) {
    if (value == null) return;
    if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
      throw new Error(BACKUP_ERROR);
    }
  }

  function isProbablyBase64Payload(data) {
    if (typeof data !== 'string' || data.length === 0) return false;
    const comma = data.indexOf(',');
    const payload = data.startsWith('data:') && comma !== -1 ? data.slice(comma + 1) : data;
    return /^[A-Za-z0-9+/=\s]+$/.test(payload);
  }

  function assertBlobInfo(value) {
    if (!isPlainObject(value) || value.isBlob !== true) {
      throw new Error(BACKUP_ERROR);
    }
    if (typeof value.type !== 'string' || !isProbablyBase64Payload(value.data)) {
      throw new Error(BACKUP_ERROR);
    }
  }

  function assertSafeKey(key) {
    if (typeof key !== 'string' || DANGEROUS_KEYS.has(key)) {
      throw new Error(BACKUP_ERROR);
    }
  }

  function validateMember(member) {
    if (!isPlainObject(member)) throw new Error(BACKUP_ERROR);
    if (typeof member.id !== 'string' || member.id.length === 0) throw new Error(BACKUP_ERROR);
    if (typeof member.name !== 'string') throw new Error(BACKUP_ERROR);
    ['hebrewName', 'relationship', 'birthDate', 'hebrewBirthDate', 'imageUrl'].forEach(assertOptionalStringFrom(member));
    if (member.avatar != null) {
      if (typeof member.avatar === 'string') {
        assertOptionalString(member.avatar);
      } else {
        assertBlobInfo(member.avatar);
      }
    }
  }

  function assertOptionalStringFrom(obj) {
    return (key) => assertOptionalString(obj[key]);
  }

  function validateMediaItem(item) {
    if (!isPlainObject(item)) throw new Error(BACKUP_ERROR);
    assertOptionalString(item.id);
    assertOptionalString(item.type);
    assertOptionalString(item.name);
    assertOptionalString(item.url);
    if (item.blob != null) {
      if (typeof item.blob === 'string') {
        assertOptionalString(item.blob);
      } else {
        assertBlobInfo(item.blob);
      }
    }
  }

  function validateEvent(event) {
    if (!isPlainObject(event)) throw new Error(BACKUP_ERROR);
    if (typeof event.id !== 'string' || event.id.length === 0) throw new Error(BACKUP_ERROR);
    if (typeof event.title !== 'string') throw new Error(BACKUP_ERROR);
    ['description', 'category', 'date', 'hebrewDate', 'location', 'imageUrl'].forEach(assertOptionalStringFrom(event));
    assertOptionalStringArray(event.taggedMembers);
    assertOptionalStringArray(event.linkedBlessings);
    if (event.media != null) {
      if (!Array.isArray(event.media)) throw new Error(BACKUP_ERROR);
      event.media.forEach(validateMediaItem);
    }
  }

  function validateShorashim(shorashim) {
    if (shorashim == null) return;
    if (!isPlainObject(shorashim)) throw new Error(BACKUP_ERROR);
    if (shorashim.tree != null) {
      if (!isPlainObject(shorashim.tree)) throw new Error(BACKUP_ERROR);
      Object.keys(shorashim.tree).forEach((key) => {
        assertSafeKey(key);
        const node = shorashim.tree[key];
        if (node == null) return;
        if (!isPlainObject(node)) throw new Error(BACKUP_ERROR);
        if (node.avatar != null && typeof node.avatar !== 'string') {
          assertBlobInfo(node.avatar);
        }
      });
    }
  }

  function validateBackup(data) {
    if (!isPlainObject(data)) throw new Error(BACKUP_ERROR);
    if (typeof data.version !== 'number' || !Number.isFinite(data.version)) {
      throw new Error(BACKUP_ERROR);
    }
    if (!Array.isArray(data.members) || !Array.isArray(data.events)) {
      throw new Error(BACKUP_ERROR);
    }
    data.members.forEach(validateMember);
    data.events.forEach(validateEvent);
    validateShorashim(data.shorashim);
    return data;
  }

  function parseBackupJson(jsonString) {
    if (typeof jsonString !== 'string' || jsonString.trim() === '') {
      throw new Error(BACKUP_ERROR);
    }
    let data;
    try {
      data = JSON.parse(jsonString);
    } catch {
      throw new Error(BACKUP_ERROR);
    }
    return validateBackup(data);
  }

  global.DorLDorSecurity = {
    BACKUP_ERROR,
    escapeHtml,
    sanitizeUrl,
    validateBackup,
    parseBackupJson
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
