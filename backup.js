import fs from 'fs';
import path from 'path';
import { shouldIgnoreBackupEntry } from './backup-ignore.js';

const SCRATCH_DIR = process.env.SCRATCH_DIR || 'C:\\Users\\oscar\\.gemini\\antigravity\\scratch\\jewishfamily';

console.log('🔄 Iniciando respaldo local...\n');

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
    console.log(`  ✓ Copiado a scratch local: ${path.relative(process.cwd(), src)}`);
  }
}

try {
  if (!fs.existsSync(SCRATCH_DIR)) {
    fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  }

  copyRecursiveSync('.', SCRATCH_DIR);
  console.log('✅ Respaldo en carpeta scratch completado.\n');
  console.log('ℹ️  El push automático a GitHub se eliminó. Los commits deben hacerse a mano.');
} catch (err) {
  console.error('❌ Error al respaldar en carpeta scratch:', err.message);
}
