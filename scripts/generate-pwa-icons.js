/**
 * Genera iconos PWA a partir de public/logo.png
 * Uso: node scripts/generate-pwa-icons.js
 */
const fs = require('fs');
const path = require('path');

async function main() {
  const root = path.join(__dirname, '..');
  const logoPath = path.join(root, 'public', 'logo.png');
  const outDir = path.join(root, 'public', 'icons');

  if (!fs.existsSync(logoPath)) {
    console.error('No se encontró public/logo.png');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });

  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    // Fallback: copiar el logo a los tamaños requeridos
    console.warn('sharp no instalado — copiando logo.png como iconos (instala sharp para redimensionar).');
    for (const name of ['icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'apple-touch-icon.png']) {
      fs.copyFileSync(logoPath, path.join(outDir, name));
    }
    console.log('Iconos PWA listos (copia del logo).');
    return;
  }

  const sizes = [
    { file: 'icon-192.png', size: 192, padding: 0.08 },
    { file: 'icon-512.png', size: 512, padding: 0.08 },
    { file: 'icon-512-maskable.png', size: 512, padding: 0.18 },
    { file: 'apple-touch-icon.png', size: 180, padding: 0.08 },
  ];

  for (const { file, size, padding } of sizes) {
    const pad = Math.round(size * padding);
    const inner = size - pad * 2;
    const logo = await sharp(logoPath)
      .resize(inner, inner, { fit: 'contain', background: { r: 5, g: 5, b: 5, alpha: 1 } })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 5, g: 5, b: 5, alpha: 1 },
      },
    })
      .composite([{ input: logo, top: pad, left: pad }])
      .png()
      .toFile(path.join(outDir, file));

    console.log('OK', file);
  }

  console.log('Iconos PWA generados en public/icons/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
