import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function test() {
  const folderId = '1nILOljujwB7wC-tYidO24ACiPsIUmR7R';
  console.log(`Fetching Drive folder ${folderId}...`);
  const res = await axios.get(`https://drive.google.com/drive/folders/${folderId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  console.log('Status:', res.status, 'HTML length:', res.data.length);
  fs.writeFileSync('server/scripts/subbarao_drive_page.html', res.data, 'utf8');

  // Check for filenames in html
  const regex = /\["([a-zA-Z0-9_-]{28,35})","([^"]+?\.(?:jpg|jpeg|png|webp|heic|mp4|mov))"/gi;
  let match;
  const items = [];
  while ((match = regex.exec(res.data)) !== null) {
    items.push({ id: match[1], name: match[2] });
  }
  console.log('Direct filename matches:', items.length);
  items.forEach(it => console.log('  ', it.id, it.name));

  if (items.length === 0) {
    const nameMatches = [...res.data.matchAll(/([a-zA-Z0-9_ -]+\.(?:jpg|jpeg|png|webp|heic))/gi)].map(m => m[1]);
    console.log('Sample filenames found:', [...new Set(nameMatches)].slice(0, 15));
    
    // Look for file IDs
    const idMatches = [...res.data.matchAll(/"([a-zA-Z0-9_-]{33})"/g)].map(m => m[1]);
    const uniqueIds = [...new Set(idMatches)];
    console.log('Unique 33-char IDs found:', uniqueIds.length, uniqueIds.slice(0, 15));
  }
}

test().catch(e => console.error('Error:', e.message));
