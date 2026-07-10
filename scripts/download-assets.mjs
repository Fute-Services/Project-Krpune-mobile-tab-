// Downloads all remote Cloudinary media listed in manifest into assets/remote/
// Run: node scripts/download-assets.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'scripts', 'media-urls.txt');
const outDir = path.join(root, 'assets', 'remote');
fs.mkdirSync(outDir, { recursive: true });

const urls = fs.readFileSync(manifestPath, 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(Boolean);

const basename = (u) => u.split('/').pop().split('?')[0];

let ok = 0, skip = 0, fail = 0;
const failures = [];

async function dl(url) {
  const name = basename(url);
  const dest = path.join(outDir, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) { skip++; return; }
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    ok++;
    console.log(`  ok  ${name} (${(buf.length/1024).toFixed(0)}KB)`);
  } catch (e) {
    fail++; failures.push(url + ' -> ' + e.message);
    console.log(`  FAIL ${name}: ${e.message}`);
  }
}

// small concurrency pool
const POOL = 6;
let i = 0;
async function worker() {
  while (i < urls.length) {
    const idx = i++;
    await dl(urls[idx]);
  }
}
console.log(`Downloading ${urls.length} assets -> ${outDir}`);
await Promise.all(Array.from({ length: POOL }, worker));
console.log(`\nDONE  ok=${ok} skip=${skip} fail=${fail}`);
if (failures.length) { console.log('Failures:\n' + failures.join('\n')); process.exitCode = 1; }
