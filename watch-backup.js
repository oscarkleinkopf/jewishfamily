import fs from 'fs';
import path from 'path';
import { shouldIgnoreBackupEntry } from './backup-ignore.js';

const SCRATCH_DIR = process.env.SCRATCH_DIR || 'C:\\Users\\oscar\\.gemini\\antigravity\\scratch\\jewishfamily';

let debounceTimer = null;

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      if (!shouldIgnoreBackupEntry(childItemName)) {
        copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
      }
    });
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function performBackup() {
  console.log(`\n⏰ [${new Date().toLocaleTimeString('es-ES')}] Cambio detectado! Realizando respaldo local...`);

  try {
    if (!fs.existsSync(SCRATCH_DIR)) {
      fs.mkdirSync(SCRATCH_DIR, { recursive: true });
    }
    copyRecursiveSync('.', SCRATCH_DIR);
    console.log('  ✓ Respaldo local en carpeta scratch actualizado.');
  } catch (err) {
    console.error('  ❌ Error en respaldo local:', err.message);
  }
}

function scheduleBackup() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performBackup();
  }, 3000);
}

console.log('👀 Observando cambios en los archivos del proyecto para respaldo local...');
console.log(`📁 Carpeta local: ${SCRATCH_DIR}`);
console.log('ℹ️  El push automático a GitHub se eliminó. Los commits deben hacerse a mano.\n');

performBackup();

fs.watch('.', { recursive: true }, (eventType, filename) => {
  if (filename) {
    const parts = filename.split(path.sep);
    if (!parts.some((part) => shouldIgnoreBackupEntry(part))) {
      console.log(`📝 Archivo modificado: ${filename}`);
      scheduleBackup();
    }
  }
});
