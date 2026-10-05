import axios from 'axios';
import fs from 'fs';
import path from 'path';

const filesJson = JSON.parse(fs.readFileSync('server/scripts/koteswara_extracted_files.json', 'utf8'));

async function downloadAll() {
  const outDir = path.resolve('temp_koteswara');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const cleaned = [];

  for (let i = 0; i < filesJson.length; i++) {
    const item = filesJson[i];
    // clean id (remove trailing -0 or -<num>)
    const id = item.id.replace(/-[0-9]+$/, '');
    const outPath = path.join(outDir, `${i + 1}_${item.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`);
    console.log(`[${i + 1}/${filesJson.length}] Downloading ${id} -> ${path.basename(outPath)}...`);

    try {
      if (!fs.existsSync(outPath)) {
        const res = await axios.get(`https://lh3.googleusercontent.com/d/${id}`, {
          responseType: 'arraybuffer',
          timeout: 25000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        fs.writeFileSync(outPath, res.data);
      }
      cleaned.push({
        index: i + 1,
        id,
        name: item.name,
        localFile: path.basename(outPath),
        sizeBytes: fs.statSync(outPath).size
      });
    } catch (err) {
      console.error(`Failed ${id}: ${err.message}`);
    }
  }

  fs.writeFileSync('server/scripts/koteswara_downloaded.json', JSON.stringify(cleaned, null, 2), 'utf8');
  console.log(`\nFinished downloading ${cleaned.length} images to ${outDir}!`);
}

downloadAll();
