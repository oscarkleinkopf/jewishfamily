import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH_DIR = 'C:\\Users\\oscar\\.gemini\\antigravity\\brain\\c2067f73-9d0a-4a11-8dbb-031034822380\\scratch';
const FILES_TO_WATCH = ['index.html', 'styles.css', 'app.js', 'db.js', 'sampleData.js', 'README.md', 'package.json', 'backup.js'];

let debounceTimer = null;

function performBackup() {
  console.log(`\n⏰ [${new Date().toLocaleTimeString('es-ES')}] Cambio detectado! Realizando respaldo automático...`);

  // 1. Respaldo local en la carpeta scratch
  try {
    if (!fs.existsSync(SCRATCH_DIR)) {
      fs.mkdirSync(SCRATCH_DIR, { recursive: true });
    }

    for (const file of FILES_TO_WATCH) {
      if (fs.existsSync(file)) {
        const dest = path.join(SCRATCH_DIR, file);
        fs.copyFileSync(file, dest);
      }
    }
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
fs.watch('.', { recursive: false }, (eventType, filename) => {
  if (filename && FILES_TO_WATCH.includes(filename)) {
    console.log(`📝 Archivo modificado: ${filename}`);
    scheduleBackup();
  }
});
