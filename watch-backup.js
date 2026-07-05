import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH_DIR = process.env.SCRATCH_DIR || 'C:\\Users\\oscar\\.gemini\\antigravity\\scratch\\jewishfamily';
const IGNORE_PATTERNS = ['.git', 'node_modules', '.env'];

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
      if (!IGNORE_PATTERNS.includes(childItemName)) {
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
  console.log(`\n⏰ [${new Date().toLocaleTimeString('es-ES')}] Cambio detectado! Realizando respaldo automático...`);

  // 1. Respaldo local en la carpeta scratch
  try {
    if (!fs.existsSync(SCRATCH_DIR)) {
      fs.mkdirSync(SCRATCH_DIR, { recursive: true });
    }
    copyRecursiveSync('.', SCRATCH_DIR);
    console.log('  ✓ Respaldo local en carpeta scratch actualizado.');
  } catch (err) {
    console.error('  ❌ Error en respaldo local:', err.message);
  }

  // 2. Respaldo remoto en GitHub
  try {
    execSync('git add .', { stdio: 'pipe' });
    const status = execSync('git status --porcelain').toString();

    if (status.trim()) {
      const commitMsg = `Respaldo automático - ${new Date().toLocaleString('es-ES')}`;
      execSync(`git commit -m "${commitMsg}"`, { stdio: 'pipe' });
      execSync('git push origin main', { stdio: 'pipe' });
      console.log('  ✓ Respaldo subido a GitHub (main).');
    } else {
      console.log('  ℹ️ Sin cambios pendientes para git.');
    }
  } catch (err) {
    console.error('  ❌ Error al empujar a GitHub:', err.message);
  }
}

function scheduleBackup() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    performBackup();
  }, 3000); // 3 segundos de debounce para evitar commits por cada pulsación
}

console.log('👀 Observando cambios en los archivos del proyecto para respaldo automático...');
console.log(`📁 Carpeta local: ${SCRATCH_DIR}`);
console.log('🐙 Repositorio: https://github.com/oscarkleinkopf/jewishfamily.git\n');

// Realizar un respaldo inicial al arrancar
performBackup();

// Vigilar cambios en la carpeta
fs.watch('.', { recursive: true }, (eventType, filename) => {
  if (filename) {
    const parts = filename.split(path.sep);
    if (!IGNORE_PATTERNS.some(ignore => parts.includes(ignore))) {
      console.log(`📝 Archivo modificado: ${filename}`);
      scheduleBackup();
    }
  }
});

