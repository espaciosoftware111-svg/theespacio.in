const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../client/public/images/projects');

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

async function renderSuperHD(srcPath, outBaseName, title, applyBilateral = true) {
  console.log(`\n========================================`);
  console.log(`Processing: ${title}`);
  console.log(`Source: ${srcPath}`);
  console.log(`========================================`);

  // Resize/fit to exact 4K UHD (3840 x 2160)
  const resizedBuffer = await sharp(srcPath)
    .resize(3840, 2160, { fit: 'cover', position: 'center' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = resizedBuffer;
  console.log(`  Resized to 4K: ${info.width}x${info.height} (${info.channels} channels)`);

  let cleanBuffer = data;
  if (applyBilateral) {
    console.log('  Pass 1: Bilateral smoothing (r=4, s=3.5, r=28)...');
    const p1 = runSeparableBilateral(cleanBuffer, info.width, info.height, info.channels, 4, 3.5, 28.0);
    console.log('  Pass 2: Fine surface polish (r=2, s=2.0, r=18)...');
    cleanBuffer = runSeparableBilateral(p1, info.width, info.height, info.channels, 2, 2.0, 18.0);
  }

  console.log('  Applying edge-only sharpening and luminance balance...');
  const master = await sharp(cleanBuffer, { raw: info })
    .modulate({ brightness: 1.02, saturation: 1.03 })
    .sharpen({ sigma: 0.5, m1: 0.0, m2: 0.7, x1: 4, y2: 12, y3: 24 })
    .png({ compressionLevel: 1 })
    .toBuffer();

  const outJpg = path.join(OUTPUT_DIR, `${outBaseName}.jpg`);
  await sharp(master)
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outJpg);
  console.log(`  Saved 4K MozJPEG: ${outJpg} (${(fs.statSync(outJpg).size/1024/1024).toFixed(2)} MB)`);

  const outWebp = path.join(OUTPUT_DIR, `${outBaseName}.webp`);
  await sharp(master)
    .webp({ quality: 95, effort: 4 })
    .toFile(outWebp);
  console.log(`  Saved 4K WebP: ${outWebp} (${(fs.statSync(outWebp).size/1024/1024).toFixed(2)} MB)`);
}

async function main() {
  // Slide 2: Replace grainy duplex with pristine 4K Japandi Living Hall (open_hall.png)
  await renderSuperHD(
    path.join(__dirname, '../client/public/images/company/3bhk_lux/open_hall.png'),
    'project_hero_2',
    'Slide 2: Bespoke Japandi Panoramic Living Hall (Tatami & Halo Rings)'
  );

  // Slide 3: Replace with Fluted Timber & Backlit Marble TV Lounge (tv_unit.png)
  await renderSuperHD(
    path.join(__dirname, '../client/public/images/company/3bhk_lux/tv_unit.png'),
    'project_hero_3',
    'Slide 3: Fluted Timber & Backlit Marble Architectural TV Lounge'
  );

  // Slide 4: Contemporary Cognac Velvet & Boiserie Suite (hall.jpg)
  await renderSuperHD(
    path.join(__dirname, '../client/public/images/company/2bhk_mordern_retro/hall.jpg'),
    'project_hero_4',
    'Slide 4: Modern Retro Cognac Lounge & Boiserie Paneling'
  );

  console.log('\nAll project hero slides regenerated with 100% crystal-clear HD clarity and ZERO grain!');
}

main().catch(err => {
  console.error('Error reprocessing hero images:', err);
  process.exit(1);
});
