const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SERVICES_DIR = path.join(__dirname, '../client/public/images/services');
const BACKUP_DIR = path.join(SERVICES_DIR, 'backup');

function runSeparableBilateral(data, width, height, channels, radius, sigmaS, sigmaR) {
  const twoSigmaS2 = 2 * sigmaS * sigmaS;
  const twoSigmaR2 = 2 * sigmaR * sigmaR;
  const maxDistSq = 255 * 255 * 3;
  const rangeLut = new Float32Array(maxDistSq + 1);
  for (let d2 = 0; d2 <= maxDistSq; d2++) {
    rangeLut[d2] = Math.exp(-d2 / twoSigmaR2);
  }

  const spatialWeights = new Float32Array(2 * radius + 1);
  for (let d = -radius; d <= radius; d++) {
    spatialWeights[d + radius] = Math.exp(-(d * d) / twoSigmaS2);
  }

  // Pass 1: Horizontal
  const temp = Buffer.alloc(width * height * channels);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width * channels;
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + x * channels;
      const r0 = data[idx], g0 = data[idx + 1], b0 = data[idx + 2];
      let sR = 0, sG = 0, sB = 0, sW = 0;

      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= width) continue;
        const nIdx = rowOffset + nx * channels;
        const nr = data[nIdx], ng = data[nIdx + 1], nb = data[nIdx + 2];
        const dr = r0 - nr, dg = g0 - ng, db = b0 - nb;
        const cDistSq = dr * dr + dg * dg + db * db;
        const w = spatialWeights[dx + radius] * rangeLut[cDistSq];
        sR += nr * w; sG += ng * w; sB += nb * w; sW += w;
      }
      temp[idx] = Math.round(sR / sW);
      temp[idx + 1] = Math.round(sG / sW);
      temp[idx + 2] = Math.round(sB / sW);
      if (channels === 4) temp[idx + 3] = data[idx + 3];
    }
  }

  // Pass 2: Vertical
  const output = Buffer.alloc(width * height * channels);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r0 = temp[idx], g0 = temp[idx + 1], b0 = temp[idx + 2];
      let sR = 0, sG = 0, sB = 0, sW = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        const nIdx = (ny * width + x) * channels;
        const nr = temp[nIdx], ng = temp[nIdx + 1], nb = temp[nIdx + 2];
        const dr = r0 - nr, dg = g0 - ng, db = b0 - nb;
        const cDistSq = dr * dr + dg * dg + db * db;
        const w = spatialWeights[dy + radius] * rangeLut[cDistSq];
        sR += nr * w; sG += ng * w; sB += nb * w; sW += w;
      }
      output[idx] = Math.round(sR / sW);
      output[idx + 1] = Math.round(sG / sW);
      output[idx + 2] = Math.round(sB / sW);
      if (channels === 4) output[idx + 3] = temp[idx + 3];
    }
  }

  return output;
}

async function processImage(index, cropConfig) {
  const fileName = `service_hero_${index}.jpg`;
  const srcPath = path.join(BACKUP_DIR, fileName);
  console.log(`\n========================================`);
  console.log(`Processing ${fileName} (${index}/4)...`);
  console.log(`========================================`);

  const { data, info } = await sharp(srcPath).raw().toBuffer({ resolveWithObject: true });
  console.log(`  Loaded 4K buffer: ${info.width}x${info.height} (${info.channels} channels)`);

  console.log('  Pass 1: Broad cluster denoise (r=5, s=4.2, r=32)...');
  const pass1 = runSeparableBilateral(data, info.width, info.height, info.channels, 5, 4.2, 32.0);

  console.log('  Pass 2: Fine surface perfection (r=3, s=2.5, r=20)...');
  const pass2 = runSeparableBilateral(pass1, info.width, info.height, info.channels, 3, 2.5, 20.0);

  console.log('  Applying edge-only sharpening and subtle luxury contrast...');
  const masterBuffer = await sharp(pass2, { raw: info })
    .modulate({ brightness: 1.025 })
    .sharpen({ sigma: 0.55, m1: 0.0, m2: 0.75, x1: 5, y2: 12, y3: 25 })
    .png({ compressionLevel: 1 })
    .toBuffer();

  // Save 4K MozJPEG
  const outJpg = path.join(SERVICES_DIR, `service_hero_${index}.jpg`);
  console.log(`  Writing 4K MozJPEG: ${outJpg}`);
  await sharp(masterBuffer)
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outJpg);

  // Save 4K WebP
  const outWebp = path.join(SERVICES_DIR, `service_hero_${index}.webp`);
  console.log(`  Writing 4K WebP: ${outWebp}`);
  await sharp(masterBuffer)
    .webp({ quality: 95, effort: 6, smartSubsample: true })
    .toFile(outWebp);

  // Also write _4k.webp alias
  const outWebp4k = path.join(SERVICES_DIR, `service_hero_${index}_4k.webp`);
  await sharp(masterBuffer)
    .webp({ quality: 95, effort: 6, smartSubsample: true })
    .toFile(outWebp4k);

  // Generate 100% crop inspection sample
  const cropPath = path.join(__dirname, `../services_crop_${index}.png`);
  console.log(`  Generating 100% crop sample: ${cropPath}`);
  await sharp(masterBuffer)
    .extract(cropConfig)
    .toFile(cropPath);

  console.log(`  ✓ Completed ${fileName}`);
}

async function main() {
  const t0 = Date.now();
  console.log('Starting Services Hero 4-Image UHD Enhancement Pipeline...');

  const crops = [
    { left: 1000, top: 600, width: 900, height: 600 },  // Image 1: wood shelf, white wall, mirror/art
    { left: 1200, top: 500, width: 900, height: 600 },  // Image 2: green moulding wall, sofa top, plant
    { left: 1400, top: 500, width: 900, height: 600 },  // Image 3: sheer curtain, arch, sofa cushions
    { left: 1200, top: 600, width: 900, height: 600 },  // Image 4: kitchen cabinets, marble table, lighting
  ];

  for (let i = 1; i <= 4; i++) {
    await processImage(i, crops[i - 1]);
  }

  const durationSec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nAll 4 Services Hero images successfully enhanced to UHD in ${durationSec}s!`);
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});
