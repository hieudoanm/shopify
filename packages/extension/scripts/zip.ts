import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const ROOT = path.resolve(__dirname, '..'); // extension package root
const OUTPUT = path.resolve(ROOT, 'download/shopify-detector.zip');

function assertExists(p: string) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing required path: ${p}`);
  }
}

async function zipExtension() {
  // required extension files
  const manifest = path.join(ROOT, 'manifest.json');
  const dist = path.join(ROOT, 'dist');
  const publicDir = path.join(ROOT, 'public');

  assertExists(manifest);
  assertExists(dist);
  assertExists(publicDir);

  const output = fs.createWriteStream(OUTPUT);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ Extension ZIP created`);
    console.log(`📦 ${archive.pointer()} bytes → ${OUTPUT}`);
  });

  archive.on('warning', (err) => {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn('⚠️ Warning:', err.message);
    } else {
      throw err;
    }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // ---- add extension files ----
  archive.file(manifest, { name: 'manifest.json' });
  archive.directory(dist, 'dist');
  archive.directory(publicDir, 'public');

  await archive.finalize();
}

zipExtension().catch((err) => {
  console.error('❌ ZIP failed:', err);
  process.exit(1);
});
