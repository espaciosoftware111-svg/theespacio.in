const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../client/public/images/projects');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const BACKUP_DIR = path.join(__dirname, '../client/public/images/company/_backups_projects_hero');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const IMAGES = [
  {
    id: 1,
    name: 'project_hero_1',
    title: 'Indo-Classical Elegance 3BHK Living & Dining Lounge',
    src: path.join(__dirname, '../client/public/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Guest_restaurant_19-20260810-120432.jpg'),
    crop: { left: 1400, top: 800, width: 600, height: 400 } // wall & TV & decor area
  },
  {
    id: 2,
    name: 'project_hero_2',
    title: 'Modern Desi Duplex 4BHK Grand Living Lounge',
    src: path.join(__dirname, '../client/public/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_8-20260813-110617.jpg'),
    crop: { left: 1600, top: 700, width: 600, height: 400 }
  },
  {
    id: 3,
    name: 'project_hero_3',
    title: 'Minimalist Beige 2BHK Contemporary Living Room',
    src: path.join(__dirname, '../client/public/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_6-20260810-124909.jpg'),
    crop: { left: 1500, top: 700, width: 600, height: 400 }
  },
  {
    id: 4,
    name: 'project_hero_4',
    title: '2BHK Modern Retro Louvered Living Suite',
    src: path.join(__dirname, '../client/public/images/company/2bhk_mordern_retro/hall_5.jpg'),
    crop: { left: 1400, top: 750, width: 600, height: 400 }
  }
];

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

async function processImage(item) {
  console.log(`\n========================================`);
  console.log(`Processing [${item.id}/4] ${item.name}: ${item.title}`);
  console.log(`Source: ${item.src}`);
  console.log(`========================================`);

  if (!fs.existsSync(item.src)) {
    throw new Error(`Source file does not exist: ${item.src}`);
  }

  // Backup original
  const backupPath = path.join(BACKUP_DIR, path.basename(item.src));
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(item.src, backupPath);
    console.log(`  Backed up original to: ${backupPath}`);
  }

  const { data, info } = await sharp(item.src).raw().toBuffer({ resolveWithObject: true });
  console.log(`  Loaded 4K buffer: ${info.width}x${info.height} (${info.channels} channels)`);

  console.log('  Pass 1: Broad cluster denoise (r=5, s=4.2, r=32)...');
  const t0 = Date.now();
  const pass1 = runSeparableBilateral(data, info.width, info.height, info.channels, 5, 4.2, 32.0);
  console.log(`    Pass 1 took ${((Date.now() - t0)/1000).toFixed(1)}s`);

  console.log('  Pass 2: Fine surface perfection (r=3, s=2.5, r=20)...');
  const t1 = Date.now();
  const pass2 = runSeparableBilateral(pass1, info.width, info.height, info.channels, 3, 2.5, 20.0);
  console.log(`    Pass 2 took ${((Date.now() - t1)/1000).toFixed(1)}s`);

  console.log('  Applying edge-only sharpening and subtle luxury contrast...');
  const masterSharp = sharp(pass2, { raw: info })
    .modulate({ brightness: 1.025 })
    .sharpen({ sigma: 0.55, m1: 0.0, m2: 0.75, x1: 5, y2: 12, y3: 25 });

  const masterBuffer = await masterSharp.png({ compressionLevel: 1 }).toBuffer();

  // Save 4K MozJPEG to projects dir
  const outJpg = path.join(OUTPUT_DIR, `${item.name}.jpg`);
  await sharp(masterBuffer)
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(outJpg);
  const jpgSizeMB = (fs.statSync(outJpg).size / (1024 * 1024)).toFixed(2);
  console.log(`  Saved 4K MozJPEG: ${outJpg} (${jpgSizeMB} MB)`);

  // Save 4K WebP to projects dir
  const outWebp = path.join(OUTPUT_DIR, `${item.name}.webp`);
  await sharp(masterBuffer)
    .webp({ quality: 95, effort: 4 })
    .toFile(outWebp);
  const webpSizeMB = (fs.statSync(outWebp).size / (1024 * 1024)).toFixed(2);
  console.log(`  Saved 4K WebP: ${outWebp} (${webpSizeMB} MB)`);

  // Also update original source file so any other references in the site get the HD crystal clear version
  await sharp(masterBuffer)
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(item.src);
  console.log(`  Updated original source: ${item.src}`);

  // Create before/after crop inspection
  const cropDir = path.join(OUTPUT_DIR, 'crops');
  if (!fs.existsSync(cropDir)) fs.mkdirSync(cropDir, { recursive: true });

  const beforeCrop = path.join(cropDir, `${item.name}_before_crop.png`);
  const afterCrop = path.join(cropDir, `${item.name}_after_crop.png`);

  await sharp(backupPath).extract(item.crop).png().toFile(beforeCrop);
  await sharp(masterBuffer).extract(item.crop).png().toFile(afterCrop);
  console.log(`  Saved 100% inspection crops in ${cropDir}`);
}

async function main() {
  console.log(`Starting UHD Enhancement for 4 Projects Hero Images...`);
  const startTime = Date.now();

  for (const item of IMAGES) {
    await processImage(item);
  }

  const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nAll 4 Projects Hero images successfully processed and enhanced in ${totalSec}s!`);
}

main().catch(err => {
  console.error('Error during processing:', err);
  process.exit(1);
});
