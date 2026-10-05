import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function checkFolder(folderId) {
  try {
    const res = await axios.get(`https://drive.google.com/drive/folders/${folderId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log(`\n=== Folder ${folderId} (Status: ${res.status}) ===`);
    const titleMatch = res.data.match(/<title>([^<]+)<\/title>/);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

    // Extract file names / items
    const regex = /\["([a-zA-Z0-9_-]{28,})","([^"]+\.(?:jpg|jpeg|png|webp|mp4|mov))"/gi;
    let match;
    const items = [];
    while ((match = regex.exec(res.data)) !== null) {
      items.push({ id: match[1], name: match[2] });
    }
    console.log(`Direct filename matches: ${items.length}`);
    items.forEach(it => console.log(`  - ${it.id} : ${it.name}`));

    if (items.length === 0) {
      // Search for any filenames
      const nameMatches = [...res.data.matchAll(/([a-zA-Z0-9_ -]+\.(?:jpg|jpeg|png|webp|heic))/gi)].map(m => m[1]);
      console.log('Sample filenames found:', [...new Set(nameMatches)].slice(0, 15));
      
      // Look for _DRIVE_IVD or ds: arrays
      const idMatches = [...res.data.matchAll(/"([a-zA-Z0-9_-]{33})"/g)].map(m => m[1]);
      console.log('Sample 33-char IDs found:', [...new Set(idMatches)].slice(0, 15));
    }
  } catch (err) {
    console.error(`Error on folder ${folderId}:`, err.message);
  }
}

async function main() {
  await checkFolder('1_lR0dqPVqcpLXg9XB3xLpqQXCKwRiM8E');
  await checkFolder('1nILOljujwB7wC-tYidO24ACiPsIUmR7R');
}

main();
