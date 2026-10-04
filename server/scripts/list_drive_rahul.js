import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function listFolder() {
  const folderId = '1taMXmKNXhyWtPLxALznvh_75IbKIJIn_';
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
  const res = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
  });

  const html = res.data;
  const regex = /data-id="([^"]+)"[^>]*data-name="([^"]+)"/g;
  let match;
  const files = [];
  while ((match = regex.exec(html)) !== null) {
    files.push({ id: match[1], name: match[2] });
  }

  // Also check if any additional files with alt regex
  if (files.length === 0) {
    const idRegex = /"https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/g;
    const ids = new Set();
    while ((match = idRegex.exec(html)) !== null) {
      ids.add(match[1]);
    }
    console.log('Found IDs via regex:', Array.from(ids));
  } else {
    console.log(`Found ${files.length} files:`);
    console.log(JSON.stringify(files, null, 2));
  }
}

listFolder().catch(console.error);
