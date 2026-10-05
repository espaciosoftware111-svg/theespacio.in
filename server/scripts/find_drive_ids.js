import fs from 'fs';

const html = fs.readFileSync('server/scripts/new_drive_page.html', 'utf8');

// Find occurrences of "Desi in a 4BHK" and inspect surrounding text
const idxs = [];
let pos = 0;
while ((pos = html.indexOf('Desi in a 4BHK', pos)) !== -1) {
  idxs.push(pos);
  pos += 'Desi in a 4BHK'.length;
}

console.log('Occurrences of "Desi in a 4BHK":', idxs.length);

// Print the context around the first 3 occurrences
idxs.slice(0, 3).forEach((idx, i) => {
  console.log(`\n--- Occurrence ${i + 1} (index ${idx}) ---`);
  console.log(html.substring(Math.max(0, idx - 150), Math.min(html.length, idx + 200)));
});
