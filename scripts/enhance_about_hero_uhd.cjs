const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC_PATH = path.join(__dirname, '../client/public/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617.jpg');
const BACKUP_PATH = path.join(__dirname, '../client/public/images/company/_backups_projects_hero/about_hero_original.jpg');
const ABOUT_DIR = path.join(__dirname, '../client/public/images/about');
const CROPS_DIR = path.join(__dirname, '../client/public/images/about/crops');

if (!fs.existsSync(CROPS_DIR)) {
  fs.mkdirSync(CROPS_DIR, { recursive: true });
}

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
    }
  }

  return output;
}

async function main() {
  console.log('========================================');
  console.log('Enhancing About Hero Photo to 4K UHD...');
  console.log('Source:', SRC_PATH);
  console.log('========================================');

  if (!fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(SRC_PATH, BACKUP_PATH);
    console.log('Backed up original to:', BACKUP_PATH);
  }

  const { data, info } = await sharp(SRC_PATH).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  console.log(`Loaded ${info.width}x${info.height} raw buffer`);

  console.log('Pass 1: Broad cluster denoise (r=5, s=4.0, r=30.0)...');
  const t0 = Date.now();
  const p1 = runSeparableBilateral(data, info.width, info.height, info.channels, 5, 4.0, 30.0);
  console.log(`  Pass 1 took ${((Date.now() - t0)/1000).toFixed(1)}s`);

  console.log('Pass 2: Fine surface polish (r=3, s=2.5, r=20.0)...');
  const t1 = Date.now();
  const p2 = runSeparableBilateral(p1, info.width, info.height, info.channels, 3, 2.5, 20.0);
  console.log(`  Pass 2 took ${((Date.now() - t1)/1000).toFixed(1)}s`);

  console.log('Applying subtle brightness and gentle edge clarity...');
  const master = await sharp(p2, { raw: info })
    .modulate({ brightness: 1.025, saturation: 1.02 })
    .sharpen({ sigma: 0.45, m1: 0.0, m2: 0.35, x1: 5, y2: 12, y3: 24 })
    .png({ compressionLevel: 1 })
    .toBuffer();

  // Save to /images/about/about_hero.jpg and .webp
  const outJpg = path.join(ABOUT_DIR, 'about_hero.jpg');
  await sharp(master)
    .jpeg({ quality: 97, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outJpg);
  console.log(`Saved: ${outJpg} (${(fs.statSync(outJpg).size/1024/1024).toFixed(2)} MB)`);

  const outWebp = path.join(ABOUT_DIR, 'about_hero.webp');
  await sharp(master)
    .webp({ quality: 96, effort: 4 })
    .toFile(outWebp);
  console.log(`Saved: ${outWebp} (${(fs.statSync(outWebp).size/1024/1024).toFixed(2)} MB)`);

  // Also update original source paths
  fs.copyFileSync(outJpg, SRC_PATH);
  const srcWebp = SRC_PATH.replace(/\.jpg$/i, '.webp');
  if (fs.existsSync(srcWebp)) {
    fs.copyFileSync(outWebp, srcWebp);
  }
  console.log('Updated original source paths in company/duplex/');

  // Save 100% crops for inspection
  const crop1 = { left: 2100, top: 700, width: 600, height: 400 }; // window sky & curtain
  const crop2 = { left: 800, top: 400, width: 600, height: 400 };  // ceiling & cabinetry

  await sharp(outJpg).extract(crop1).png().toFile(path.join(CROPS_DIR, 'about_window_after_crop.png'));
  await sharp(outJpg).extract(crop2).png().toFile(path.join(CROPS_DIR, 'about_ceiling_after_crop.png'));
  console.log('Saved 100% inspection crops in:', CROPS_DIR);

  console.log('\nAbout Hero UHD enhancement complete!');
}

main().catch(err => {
  console.error('Error enhancing about hero:', err);
  process.exit(1);
});
