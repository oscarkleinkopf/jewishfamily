/**
 * Shared ignore rules for local scratch backups.
 * Secrets and VCS metadata must never be copied into the scratch folder.
 */
const IGNORED_NAMES = new Set([
  '.git',
  'node_modules',
  '.env',
  '.netlify',
  '.ssh',
  'credentials.json'
]);

function shouldIgnoreBackupEntry(name) {
  if (!name) return false;
  const base = String(name).split(/[/\\]/).pop();
  if (!base) return false;
  if (IGNORED_NAMES.has(base)) return true;
  if (base.startsWith('.env.')) return true;
  if (base.endsWith('.pem') || base.endsWith('.key') || base.endsWith('.p12')) return true;
  return false;
}

export { IGNORED_NAMES, shouldIgnoreBackupEntry };
