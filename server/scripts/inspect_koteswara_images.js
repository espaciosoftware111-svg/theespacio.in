import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function inspectImages() {
  const dir = path.resolve('temp_koteswara');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

  const details = [];

  for (const f of files) {
    const filePath = path.join(dir, f);
    try {
      const meta = await sharp(filePath).metadata();
      const stats = await sharp(filePath).stats();
      // calculate brightness / colorfulness
      const brightness = stats.channels.map(c => c.mean).reduce((a, b) => a + b, 0) / stats.channels.length;
      details.push({
        file: f,
        width: meta.width,
        height: meta.height,
        aspectRatio: (meta.width / meta.height).toFixed(2),
        brightness: brightness.toFixed(1),
        sizeKb: (fs.statSync(filePath).size / 1024).toFixed(1)
      });
    } catch (e) {
      console.error(f, e.message);
    }
  }

  // Create an HTML preview page to inspect the images
  let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Koteswara Images Preview</title>
<style>
  body { font-family: sans-serif; background: #1a1a1a; color: #fff; padding: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .card { background: #2a2a2a; border-radius: 12px; overflow: hidden; padding: 10px; }
  img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; }
  h4 { margin: 8px 0 4px 0; font-size: 13px; word-break: break-all; }
  p { font-size: 11px; color: #aaa; margin: 0; }
</style>
</head>
<body>
<h1>Koteswara Rao (Gachibowli Minimalist Beige 2BHK) — 28 Images</h1>
<div class="grid">
`;

  for (const d of details) {
    html += `
  <div class="card">
    <img src="../temp_koteswara/${d.file}" />
    <h4>${d.file}</h4>
    <p>${d.width}x${d.height} (${d.aspectRatio}) | ${d.sizeKb} KB | Lum: ${d.brightness}</p>
  </div>`;
  }

  html += `</div></body></html>`;

  fs.writeFileSync('server/scripts/preview_koteswara.html', html, 'utf8');
  console.log(`Generated preview_koteswara.html with ${details.length} images`);
  console.log(JSON.stringify(details, null, 2));
}

inspectImages();
