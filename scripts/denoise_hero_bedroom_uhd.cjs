const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const HERO_DIR = path.join(__dirname, '../client/public/images/hero');
const BACKUP_DIR = path.join(HERO_DIR, 'backup');

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

  // Pass 1: Horizontal Pass
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

  // Pass 2: Vertical Pass
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

async function processHeroBedroomUHD() {
  console.log('=== Denoising hero_bedroom to pristine UHD quality ===');
  const sourceFile = path.join(BACKUP_DIR, 'hero_bedroom.jpg');
  
  // 1. Load 4K raw pixels
  const { data, info } = await sharp(sourceFile).raw().toBuffer({ resolveWithObject: true });
  console.log(`Loaded 4K buffer: ${info.width}x${info.height}`);

  // 2. Multi-stage bilateral denoise
  console.log('Running Pass 1: Wide-radius grain cluster elimination (r=5, s=4.2, r=34)...');
  const pass1 = runSeparableBilateral(data, info.width, info.height, info.channels, 5, 4.2, 34.0);

  console.log('Running Pass 2: Fine smoothing and surface perfection (r=3, s=2.5, r=22)...');
  const pass2 = runSeparableBilateral(pass1, info.width, info.height, info.channels, 3, 2.5, 22.0);

  // 3. Subtle brightness modulation + non-grain edge sharpening
  console.log('Applying brightness boost and edge-only clarity...');
  const masterBuffer = await sharp(pass2, { raw: info })
    .modulate({ brightness: 1.04 })
    .sharpen({ sigma: 0.6, m1: 0.0, m2: 0.8, x1: 5, y2: 15, y3: 30 })
    .png({ compressionLevel: 1 })
    .toBuffer();

  // 4. Save Master 4K JPEG (High quality 96, mozjpeg)
  console.log('Saving hero_bedroom.jpg...');
  await sharp(masterBuffer)
    .jpeg({ quality: 96, mozjpeg: true })
    .toFile(path.join(HERO_DIR, 'hero_bedroom.jpg'));

  // 5. Save Master 4K WebP (High quality 95, effort 6)
  console.log('Saving hero_bedroom.webp and hero_bedroom_4k.webp...');
  const webpDest = path.join(HERO_DIR, 'hero_bedroom.webp');
  const webp4kDest = path.join(HERO_DIR, 'hero_bedroom_4k.webp');
  await sharp(masterBuffer)
    .webp({ quality: 95, effort: 6 })
    .toFile(webpDest);
  fs.copyFileSync(webpDest, webp4kDest);

  // 6. Save Thumbnails
  console.log('Saving hero_bedroom thumbnails...');
  const thumbWidth = 1000;
  const thumbHeight = Math.round(thumbWidth * (info.height / info.width));
  const thumbWebpDest = path.join(HERO_DIR, 'hero_bedroom_thumb.webp');
  const thumb4kDest = path.join(HERO_DIR, 'hero_bedroom_4k_thumb.webp');
  const thumbJpgDest = path.join(HERO_DIR, 'hero_bedroom_thumb.jpg');

  await sharp(masterBuffer)
    .resize(thumbWidth, thumbHeight, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 92, effort: 5 })
    .toFile(thumbWebpDest);
  fs.copyFileSync(thumbWebpDest, thumb4kDest);

  await sharp(masterBuffer)
    .resize(1800, Math.round(1800 * (info.height / info.width)), { kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(thumbJpgDest);

  // 7. Save Mobile Landscape (2160px width)
  console.log('Saving hero_bedroom_mobile.webp...');
  const mobileDest = path.join(HERO_DIR, 'hero_bedroom_mobile.webp');
  await sharp(masterBuffer)
    .resize(2160, Math.round(2160 * (info.height / info.width)), { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 92, effort: 5 })
    .toFile(mobileDest);

  // 8. Save Portrait & 9:16 Mobile variants
  console.log('Saving portrait & 9:16 variants...');
  await sharp(masterBuffer)
    .resize(1080, 1920, { fit: 'cover', position: 'center' })
    .webp({ quality: 92, effort: 5 })
    .toFile(path.join(HERO_DIR, 'hero_bedroom_916.webp'));

  await sharp(masterBuffer)
    .resize(360, 640, { fit: 'cover', position: 'center' })
    .webp({ quality: 88, effort: 4 })
    .toFile(path.join(HERO_DIR, 'hero_bedroom_916_thumb.webp'));

  await sharp(masterBuffer)
    .resize(768, 1376, { fit: 'cover', position: 'center' })
    .webp({ quality: 90, effort: 5 })
    .toFile(path.join(HERO_DIR, 'hero_bedroom_portrait.webp'));

  await sharp(masterBuffer)
    .resize(600, 1067, { fit: 'cover', position: 'center' })
    .webp({ quality: 88, effort: 4 })
    .toFile(path.join(HERO_DIR, 'hero_bedroom_portrait_thumb.webp'));

  // Clean up test crop files
  const heroFiles = fs.readdirSync(HERO_DIR);
  heroFiles.forEach(f => {
    if (f.startsWith('test_') || f.startsWith('halo_') || f.startsWith('diff_')) {
      try {
        fs.unlinkSync(path.join(HERO_DIR, f));
      } catch {}
    }
  });

  console.log('=== hero_bedroom UHD Denoising Complete! ===');
}

processHeroBedroomUHD().catch(err => {
  console.error(err);
  process.exit(1);
});
