import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SCRATCH_DIR = process.env.SCRATCH_DIR || 'C:\\Users\\oscar\\.gemini\\antigravity\\scratch\\jewishfamily';
const IGNORE_PATTERNS = ['.git', 'node_modules', '.env'];

console.log('🔄 Iniciando respaldo automático...\n');

// Función auxiliar para copiar archivos recursivamente
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
    console.log(`  ✓ Copiado a scratch local: ${path.relative(process.cwd(), src)}`);
  }
}

// 1. Respaldo local en la carpeta scratch
try {
  if (!fs.existsSync(SCRATCH_DIR)) {
    fs.mkdirSync(SCRATCH_DIR, { recursive: true });
  }

  copyRecursiveSync('.', SCRATCH_DIR);
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
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Respaldo en GitHub completado con éxito.\n');
  } else {
    console.log('  ℹ️  No hay cambios pendientes por commitear.');
  }
} catch (err) {
  console.error('❌ Error al sincronizar con GitHub:', err.message);
}

