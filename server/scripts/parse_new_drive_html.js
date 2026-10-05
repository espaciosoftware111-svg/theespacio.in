import fs from 'fs';

const html = fs.readFileSync('server/scripts/new_drive_page.html', 'utf8');

// Search for any image file names
const imageMatches = [...html.matchAll(/([a-zA-Z0-9_\- ()\.]+\.(?:jpe?g|png|webp|heic|mp4|mov))/gi)].map(m => m[1]);
const uniqueImages = [...new Set(imageMatches)];
console.log('Unique image filename matches found in HTML:', uniqueImages.length);
console.log(uniqueImages.slice(0, 30));

// Also let's check for Google Drive data chunks: _data_ or JS arrays
const driveIds = [...html.matchAll(/["']([a-zA-Z0-9_-]{33})["']/g)].map(m => m[1]);
const uniqueIds = [...new Set(driveIds)];
console.log('Unique 33-char IDs found:', uniqueIds.length);
console.log(uniqueIds.slice(0, 10));

// Let's find patterns like: [ "id", "filename", ... ] or similar
const arrayMatches = [...html.matchAll(/\["([a-zA-Z0-9_-]{25,40})","([^"]+)"/g)];
console.log('Array matches [id, name]:', arrayMatches.length);
const arrayItems = arrayMatches.map(m => ({ id: m[1], name: m[2] }));
const seen = new Set();
const dedup = arrayItems.filter(x => {
  if (seen.has(x.id)) return false;
  seen.add(x.id);
  return true;
});
console.log('Deduped array items:', dedup.length);
console.log(dedup.slice(0, 25));
