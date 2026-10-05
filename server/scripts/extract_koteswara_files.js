import fs from 'fs';

const html = fs.readFileSync('server/scripts/koteswara_page.html', 'utf8');

// The pattern in HTML is:
// <div class="JxSEve" aria-label="<filename> Image Shared" data-handled-by-drag-and-drop="true" ssk='5:auSv138:<fileId>-0-16'>
const regex = /aria-label="([^"]+?)(?:\s+Image\s+Shared)?"\s+data-handled-by-drag-and-drop="true"\s+ssk='[^']*?:([a-zA-Z0-9_-]{28,35})-/g;
let m;
const files = [];
const seenIds = new Set();

while ((m = regex.exec(html)) !== null) {
  const name = m[1].trim();
  const id = m[2].trim();
  if (!seenIds.has(id)) {
    seenIds.add(id);
    files.push({ name, id });
  }
}

console.log(`Extracted ${files.length} files from Google Drive:`);
files.forEach((f, i) => {
  console.log(`[${i + 1}] ID: ${f.id} | Name: ${f.name}`);
});

fs.writeFileSync('server/scripts/koteswara_extracted_files.json', JSON.stringify(files, null, 2), 'utf8');
