const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const root = path.join(__dirname, '..');
const src = path.join(root, 'public', 'icons', 'carrito-de-compras.png');
const out = path.join(root, 'public', 'icons', 'carrito-de-compras-white.png');

async function main() {
  if (!fs.existsSync(src)) {
    console.error('No existe', src);
    process.exit(1);
  }

  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    const lum = (r + g + b) / 3;
    if (a > 10 && lum < 180) {
      // líneas oscuras → blancas
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      // fondo claro → transparente
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(out);

  // También en /public para rutas cortas
  fs.copyFileSync(out, path.join(root, 'public', 'carrito-de-compras.png'));
  console.log('OK', out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
