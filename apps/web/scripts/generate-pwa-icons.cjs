const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputPath = path.join(process.cwd(), 'public', 'favicon.png');

async function generateIcons() {
  const input = fs.readFileSync(inputPath);

  for (const size of sizes) {
    await sharp(input)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(process.cwd(), 'public', 'icons', `pwa-${size}x${size}.png`));
    console.log(`Generated pwa-${size}x${size}.png`);
  }
}

generateIcons().catch(console.error);
