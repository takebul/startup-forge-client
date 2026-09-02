/**
 * Generates src/app/favicon.ico for StartupForge.
 *
 * The mark mirrors the navbar brand logo exactly: a rounded-square tile with a
 * diagonal violet -> purple -> indigo gradient and a white lucide "Rocket" glyph.
 *
 * Renders a single source SVG to crisp PNGs at multiple sizes via sharp, then
 * packs them into a genuine multi-resolution .ico container.
 *
 * Run:  node scripts/generate-favicon.cjs
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Brand gradient stops (Tailwind violet-600 / purple-600 / indigo-600),
// diagonal bottom-left -> top-right to match `bg-gradient-to-tr` in the navbar.
// White lucide "Rocket" (v1.34) centered in a rounded app-icon tile.
const SVG = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tile" x1="40" y1="472" x2="472" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7C3AED"/>
      <stop offset="0.5" stop-color="#9333EA"/>
      <stop offset="1" stop-color="#4F46E5"/>
    </linearGradient>
    <radialGradient id="gloss" cx="0.3" cy="0.2" r="0.9">
      <stop stop-color="#FFFFFF" stop-opacity="0.26"/>
      <stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Gradient tile + subtle top-left gloss for depth -->
  <rect width="512" height="512" rx="114" fill="url(#tile)"/>
  <rect width="512" height="512" rx="114" fill="url(#gloss)"/>

  <!-- White rocket glyph (lucide Rocket), scaled 12.5x and centered -->
  <g transform="translate(106 106) scale(12.5)" fill="none" stroke="#FFFFFF"
     stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/>
    <path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>
  </g>
</svg>`;

// Favicon sizes to embed in the .ico (px).
const SIZES = [16, 32, 48, 64, 128, 256];

async function buildIco() {
  const svgBuffer = Buffer.from(SVG);

  // Rasterize the SVG to a PNG at each size (high density for a sharp downscale).
  const pngs = [];
  for (const size of SIZES) {
    const data = await sharp(svgBuffer, { density: 384 })
      .resize(size, size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
    pngs.push({ size, data });
  }

  // ICONDIR header (6 bytes).
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // image type: 1 = icon
  header.writeUInt16LE(pngs.length, 4); // number of images

  // One 16-byte ICONDIRENTRY per image, followed by the PNG payloads.
  const entries = [];
  let offset = header.length + pngs.length * 16;
  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 => 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 => 256)
    entry.writeUInt8(0, 2); // palette color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8); // size of PNG payload
    entry.writeUInt32LE(offset, 12); // offset to PNG payload
    entries.push(entry);
    offset += data.length;
  }

  const ico = Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
  const appIcoPath = path.join(__dirname, "..", "src", "app", "favicon.ico");
  const publicIcoPath = path.join(__dirname, "..", "public", "favicon.ico");
  fs.writeFileSync(appIcoPath, ico);
  fs.writeFileSync(publicIcoPath, ico);

  // Write discrete favicon sizes to public
  const p16 = pngs.find((p) => p.size === 16)?.data;
  const p32 = pngs.find((p) => p.size === 32)?.data;
  if (p16) fs.writeFileSync(path.join(__dirname, "..", "public", "favicon-16x16.png"), p16);
  if (p32) fs.writeFileSync(path.join(__dirname, "..", "public", "favicon-32x32.png"), p32);

  // Generate larger PWA and Apple touch icons
  const appleTouch = await sharp(svgBuffer, { density: 384 })
    .resize(180, 180, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, "..", "public", "apple-touch-icon.png"), appleTouch);

  const chrome192 = await sharp(svgBuffer, { density: 384 })
    .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, "..", "public", "android-chrome-192x192.png"), chrome192);

  const chrome512 = await sharp(svgBuffer, { density: 384 })
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(__dirname, "..", "public", "android-chrome-512x512.png"), chrome512);

  console.log("All public & app icons successfully regenerated for StartupForge!");
}

buildIco().catch((err) => {
  console.error("Failed to generate icons:", err);
  process.exit(1);
});
