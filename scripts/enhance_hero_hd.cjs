const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const HERO_DIR = path.join(__dirname, '../client/public/images/hero');
const BACKUP_DIR = path.join(HERO_DIR, 'backup');

/**
 * Fast 2-pass Separable Bilateral Filter
 * Smooths noise/grain on flat surfaces while preserving 100% of high-contrast edges.
 */
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

const IMAGES = [
  { name: 'hero_bedroom', radius: 3, sigmaS: 2.8, sigmaR: 26.0 },
  { name: 'hero_dining', radius: 3, sigmaS: 3.0, sigmaR: 28.0 },
  { name: 'hero_kitchen', radius: 3, sigmaS: 2.8, sigmaR: 25.0 },
  { name: 'hero_kids_bedroom', radius: 3, sigmaS: 3.0, sigmaR: 27.0 },
];

async function enhanceAll() {
  console.log('=== Starting ESPACIO Hero Image HD Enhancement ===');

  for (const img of IMAGES) {
    const startTime = Date.now();
    const sourceFile = path.join(BACKUP_DIR, `${img.name}.jpg`);
    console.log(`\nProcessing [${img.name}] from ${sourceFile}...`);

    // 1. Read raw pixels
    const { data, info } = await sharp(sourceFile)
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log(`  Dimensions: ${info.width}x${info.height}, channels: ${info.channels}`);

    // 2. Bilateral Denoising Pass
    console.log(`  Running bilateral filter (r=${img.radius}, s=${img.sigmaS}, r=${img.sigmaR})...`);
    const denoisedData = runSeparableBilateral(
      data,
      info.width,
      info.height,
      info.channels,
      img.radius,
      img.sigmaS,
      img.sigmaR
    );

    // 3. Create high-def sharpened master pipeline (m1=0 so flat areas stay smooth, m2=1.15 for edge clarity)
    const masterPipeline = sharp(denoisedData, { raw: info })
      .sharpen({ sigma: 0.8, m1: 0.0, m2: 1.15, x1: 4, y2: 12, y3: 25 });

    const masterPngBuffer = await masterPipeline.png({ compressionLevel: 1 }).toBuffer();

    // 4. Save Master 4K JPEG (High quality 95, mozjpeg)
    const jpgDest = path.join(HERO_DIR, `${img.name}.jpg`);
    await sharp(masterPngBuffer)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(jpgDest);
    console.log(`  Saved HD JPEG -> ${img.name}.jpg`);

    // 5. Save Master 4K WebP (High quality 94, effort 6)
    const webpDest = path.join(HERO_DIR, `${img.name}.webp`);
    const webp4kDest = path.join(HERO_DIR, `${img.name}_4k.webp`);
    await sharp(masterPngBuffer)
      .webp({ quality: 94, effort: 6 })
      .toFile(webpDest);
    fs.copyFileSync(webpDest, webp4kDest);
    console.log(`  Saved HD WebP -> ${img.name}.webp & ${img.name}_4k.webp`);

    // 6. Save Thumbnails (for hero glass card and previews)
    const thumbWidth = 1000;
    const thumbHeight = Math.round(thumbWidth * (info.height / info.width));
    const thumbWebpDest = path.join(HERO_DIR, `${img.name}_thumb.webp`);
    const thumb4kDest = path.join(HERO_DIR, `${img.name}_4k_thumb.webp`);
    const thumbJpgDest = path.join(HERO_DIR, `${img.name}_thumb.jpg`);

    await sharp(masterPngBuffer)
      .resize(thumbWidth, thumbHeight, { kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 92, effort: 5 })
      .toFile(thumbWebpDest);
    fs.copyFileSync(thumbWebpDest, thumb4kDest);

    await sharp(masterPngBuffer)
      .resize(1800, Math.round(1800 * (info.height / info.width)), { kernel: sharp.kernel.lanczos3 })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(thumbJpgDest);
    console.log(`  Saved Thumbnails -> ${img.name}_thumb.webp / .jpg`);

    // 7. Save Mobile Landscape (2160px width)
    const mobileDest = path.join(HERO_DIR, `${img.name}_mobile.webp`);
    await sharp(masterPngBuffer)
      .resize(2160, Math.round(2160 * (info.height / info.width)), { kernel: sharp.kernel.lanczos3 })
      .webp({ quality: 92, effort: 5 })
      .toFile(mobileDest);
    console.log(`  Saved Mobile Landscape -> ${img.name}_mobile.webp`);

    // 8. Save Portrait & 9:16 Mobile variants (1080x1920 & 768x1376)
    const v916Dest = path.join(HERO_DIR, `${img.name}_916.webp`);
    const v916ThumbDest = path.join(HERO_DIR, `${img.name}_916_thumb.webp`);
    const portraitDest = path.join(HERO_DIR, `${img.name}_portrait.webp`);
    const portraitThumbDest = path.join(HERO_DIR, `${img.name}_portrait_thumb.webp`);

    await sharp(masterPngBuffer)
      .resize(1080, 1920, { fit: 'cover', position: 'center' })
      .webp({ quality: 92, effort: 5 })
      .toFile(v916Dest);

    await sharp(masterPngBuffer)
      .resize(360, 640, { fit: 'cover', position: 'center' })
      .webp({ quality: 88, effort: 4 })
      .toFile(v916ThumbDest);

    await sharp(masterPngBuffer)
      .resize(768, 1376, { fit: 'cover', position: 'center' })
      .webp({ quality: 90, effort: 5 })
      .toFile(portraitDest);

    await sharp(masterPngBuffer)
      .resize(600, 1067, { fit: 'cover', position: 'center' })
      .webp({ quality: 88, effort: 4 })
      .toFile(portraitThumbDest);

    console.log(`  Saved 9:16 & Portrait -> ${img.name}_916.webp / portrait`);
    console.log(`  Completed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`);
  }

  // Clean up any test crops
  const heroFiles = fs.readdirSync(HERO_DIR);
  heroFiles.forEach(f => {
    if (f.startsWith('test_') || f.endsWith('_crop.png')) {
      fs.unlinkSync(path.join(HERO_DIR, f));
      console.log(`Cleaned up temp file: ${f}`);
    }
  });

  console.log('\n=== All 4 Hero Images Successfully Enhanced to Pristine HD Quality ===');
}

enhanceAll().catch(err => {
  console.error('Enhancement error:', err);
  process.exit(1);
});
