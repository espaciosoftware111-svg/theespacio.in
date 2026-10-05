import fs from 'fs';

const html = fs.readFileSync('server/scripts/new_drive_page.html', 'utf8');

// Regex to capture file id and filename
// Looking at the pattern:
// aria-label="... filename.ext Image Shared" ... ssk='...:([a-zA-Z0-9_-]{33})-...
// or data-id="([a-zA-Z0-9_-]{33})" ... data-tooltip="... filename.ext Image"
// Let's test regexes

const results = [];
const seenIds = new Set();

// Pattern 1: aria-label="([^"]+?\.(?:jpe?g|png|webp|heic))[^"]*"[^>]*ssk='[^']*?:([a-zA-Z0-9_-]{33})
const regex1 = /aria-label="([^"]+?\.(?:jpe?g|png|webp|heic))[^"]*"[^>]*ssk='[^']*?:([a-zA-Z0-9_-]{33})/gi;
let m;
while ((m = regex1.exec(html)) !== null) {
  const filename = m[1].replace(/&amp;/g, '&');
  const id = m[2];
  if (!seenIds.has(id)) {
    seenIds.add(id);
    results.push({ id, filename });
  }
}

console.log('Results from Pattern 1:', results.length);

// Also try Pattern 2: ([a-zA-Z0-9_-]{33})[^>]*data-tooltip="([^"]+?\.(?:jpe?g|png|webp|heic))
const regex2 = /([a-zA-Z0-9_-]{33})"[^>]*data-tooltip="([^"]+?\.(?:jpe?g|png|webp|heic))/gi;
while ((m = regex2.exec(html)) !== null) {
  const id = m[1];
  const filename = m[2].replace(/&amp;/g, '&');
  if (!seenIds.has(id)) {
    seenIds.add(id);
    results.push({ id, filename });
  }
}

console.log('Total unique files found:', results.length);
results.forEach((r, i) => console.log(`${i + 1}. [${r.id}] ${r.filename}`));

fs.writeFileSync('server/scripts/new_subbarao_files.json', JSON.stringify(results, null, 2), 'utf8');
