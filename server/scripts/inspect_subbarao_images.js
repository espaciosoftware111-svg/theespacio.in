import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function inspect() {
  const dir = path.resolve('temp_subbarao');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'));

  const details = [];
  for (const f of files) {
    const fullPath = path.join(dir, f);
    const meta = await sharp(fullPath).metadata();
    details.push({
      file: f,
      width: meta.width,
      height: meta.height,
      aspect: (meta.width / meta.height).toFixed(2),
      orientation: meta.width > meta.height ? 'Landscape' : meta.width < meta.height ? 'Portrait' : 'Square',
      sizeKB: Math.round(fs.statSync(fullPath).size / 1024)
    });
  }

  console.table(details);
  fs.writeFileSync(path.join(dir, 'images_meta.json'), JSON.stringify(details, null, 2));
}

inspect();
