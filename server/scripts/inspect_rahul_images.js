import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function main() {
  const dir = path.resolve('temp_rahul');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
  const summary = [];

  for (const f of files) {
    const filePath = path.join(dir, f);
    const meta = await sharp(filePath).metadata();
    summary.push({
      file: f,
      width: meta.width,
      height: meta.height,
      orientation: meta.width >= meta.height ? 'landscape' : 'portrait',
      aspectRatio: (meta.width / meta.height).toFixed(2),
      sizeKB: Math.round(meta.size / 1024)
    });
  }

  console.log(JSON.stringify(summary, null, 2));
}

main().catch(console.error);
