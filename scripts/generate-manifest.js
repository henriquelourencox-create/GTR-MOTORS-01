import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read vehicles.ts to extract vehicles array or copy public/vehicles.json to dist
const publicManifest = path.join(rootDir, 'public', 'vehicles.json');
const distManifest = path.join(rootDir, 'dist', 'vehicles.json');
const distDir = path.join(rootDir, 'dist');

if (fs.existsSync(publicManifest)) {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  fs.copyFileSync(publicManifest, distManifest);
  console.log('✅ vehicles.json copiado com sucesso para dist/');
}
