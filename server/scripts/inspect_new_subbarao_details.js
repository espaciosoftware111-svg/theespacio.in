import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function main() {
  const manifest = JSON.parse(fs.readFileSync('temp_subbarao_new/manifest.json', 'utf8'));
  const details = [];

  for (const item of manifest) {
    const meta = await sharp(item.localPath).metadata();
    details.push({
      index: item.index,
      safeName: item.safeName,
      filename: item.filename,
      width: meta.width,
      height: meta.height,
      aspect: (meta.width / meta.height).toFixed(2),
      format: meta.format,
      sizeKB: Math.round(item.sizeBytes / 1024)
    });
  }

  console.table(details.map(d => ({
    idx: d.index,
    name: d.filename.replace('Exquisite Fusion of Modern & Desi in a 4BHK-', ''),
    w: d.width,
    h: d.height,
    aspect: d.aspect,
    size: d.sizeKB + 'KB'
  })));

  fs.writeFileSync('temp_subbarao_new/details.json', JSON.stringify(details, null, 2), 'utf8');
}

main().catch(console.error);
