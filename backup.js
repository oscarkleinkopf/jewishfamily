import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH_DIR = 'C:\\Users\\oscar\\.gemini\\antigravity\\brain\\c2067f73-9d0a-4a11-8dbb-031034822380\\scratch';
const FILES_TO_BACKUP = ['index.html', 'styles.css', 'app.js', 'db.js', 'sampleData.js', 'README.md', 'package.json', 'backup.js'];

console.log('🔄 Iniciando respaldo automático...\n');

// 1. Respaldo local en la carpeta scratch
try {
  if (!fs.existsSync(SCRATCH_DIR)) {
    fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  }

  for (const file of FILES_TO_BACKUP) {
    if (fs.existsSync(file)) {
      const dest = path.join(SCRATCH_DIR, file);
      fs.copyFileSync(file, dest);
      console.log(`  ✓ Copiado a scratch local: ${file}`);
    }
  }
  console.log('✅ Respaldo en carpeta scratch completado.\n');
} catch (err) {
  console.error('❌ Error al respaldar en carpeta scratch:', err.message);
}

// 2. Respaldo remoto en GitHub
try {
  console.log('📤 Sincronizando con GitHub...');
  execSync('git add .', { stdio: 'inherit' });
  
  const status = execSync('git status --porcelain').toString();
  if (status.trim()) {
    const commitMsg = `Respaldo automático - ${new Date().toLocaleString('es-ES')}`;
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });
  } else {
    console.log('  ℹ️  No hay cambios pendientes por commitear.');
  }

  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Respaldo en GitHub completado con éxito.\n');
} catch (err) {
  console.error('❌ Error al sincronizar con GitHub:', err.message);
}
