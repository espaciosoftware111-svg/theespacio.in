import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function downloadAll() {
  const listFile = 'server/scripts/new_subbarao_files.json';
  const files = JSON.parse(fs.readFileSync(listFile, 'utf8'));
  const outDir = path.resolve('temp_subbarao_new');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const downloaded = [];

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    // Clean up filename
    const safeName = `img_${i + 1}_` + item.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(outDir, safeName);
    console.log(`[${i + 1}/${files.length}] Downloading ${item.filename} (${item.id})...`);

    try {
      const res = await axios.get(`https://lh3.googleusercontent.com/d/${item.id}`, {
        responseType: 'arraybuffer',
        timeout: 45000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      fs.writeFileSync(outPath, Buffer.from(res.data));
      const stats = fs.statSync(outPath);
      downloaded.push({
        index: i + 1,
        id: item.id,
        filename: item.filename,
        safeName,
        localPath: outPath,
        sizeBytes: stats.size
      });
      console.log(`  ✓ Saved ${safeName} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`  ✗ Failed ${item.filename}: ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(downloaded, null, 2), 'utf8');
  console.log(`\nCompleted downloading ${downloaded.length}/${files.length} images to ${outDir}`);
}

downloadAll().catch(console.error);
