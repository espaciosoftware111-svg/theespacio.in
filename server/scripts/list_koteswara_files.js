import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('temp_koteswara').filter(f => f.endsWith('.jpg'));

// Group by room from filename:
// Bedroom 0, 1, 2, 13, 14, 15, 16, 17, 18, 19, 20, 21
// Living room 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 22, 23, 24, 25, 26, 27

console.log('Total files:', files.length);
files.sort((a, b) => {
  const numA = parseInt(a.split('_')[0]);
  const numB = parseInt(b.split('_')[0]);
  return numA - numB;
});

files.forEach(f => {
  console.log(f);
});
