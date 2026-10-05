import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function main() {
  const folderId = '13WzpzYT-gozJL6h0zjg08IUX1SnD61jb';
  console.log(`Fetching Drive folder ${folderId}...`);
  const res = await axios.get(`https://drive.google.com/drive/folders/${folderId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  console.log('Status:', res.status, 'HTML length:', res.data.length);
  fs.writeFileSync('server/scripts/new_drive_page.html', res.data, 'utf8');

  // Match items
  const regex = /\["([a-zA-Z0-9_-]{28,35})","([^"]+?\.(?:jpg|jpeg|png|webp|heic|mp4|mov))"/gi;
  let match;
  const items = [];
  const seen = new Set();
  while ((match = regex.exec(res.data)) !== null) {
    const id = match[1];
    const name = match[2];
    if (!seen.has(id)) {
      seen.add(id);
      items.push({ id, name });
    }
  }

  console.log(`Found ${items.length} files:`);
  items.forEach((it, idx) => console.log(`${idx + 1}. [${it.id}] ${it.name}`));

  fs.writeFileSync('server/scripts/new_drive_files.json', JSON.stringify(items, null, 2), 'utf8');
}

main().catch(console.error);
