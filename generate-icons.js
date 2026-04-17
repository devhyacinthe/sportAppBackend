const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, 'assets', 'logo.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generate() {
  // icon.png — 1024x1024, full rounded square
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'icon.png'));
  console.log('✓ icon.png');

  // adaptive-icon.png — 1024x1024, centered with padding (Android crops to circle/shape)
  const paddedSvg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" fill="#0f172a"/>
      <image href="data:image/svg+xml;base64,${svgBuffer.toString('base64')}"
             x="112" y="112" width="800" height="800"/>
    </svg>`;
  await sharp(Buffer.from(paddedSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(__dirname, 'assets', 'adaptive-icon.png'));
  console.log('✓ adaptive-icon.png');

  // splash-icon.png — 200x200, centered on transparent bg (Expo puts it on splash bg color)
  await sharp(svgBuffer)
    .resize(200, 200)
    .png()
    .toFile(path.join(__dirname, 'assets', 'splash-icon.png'));
  console.log('✓ splash-icon.png');

  // favicon.png — 64x64
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(__dirname, 'assets', 'favicon.png'));
  console.log('✓ favicon.png');

  console.log('\nTous les icônes générés avec succès !');
}

generate().catch(console.error);
