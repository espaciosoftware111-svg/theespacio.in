import fs from 'fs';
import path from 'path';

const cloudinaryUrls = new Set();
function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== 'node_modules' && f !== '.git' && f !== '.gemini') scan(full);
    } else if (/\.(js|jsx|json|md)$/.test(f)) {
      const text = fs.readFileSync(full, 'utf8');
      const matches = text.match(/https:\/\/res\.cloudinary\.com\/[^\s\"\'\`]+/g);
      if (matches) {
        matches.forEach(m => {
          const clean = m.replace(/[\,\;\)\]\}]+$/, '');
          cloudinaryUrls.add(clean);
        });
      }
    }
  }
}
scan('client');
scan('server');
console.log('Total unique Cloudinary URLs:', cloudinaryUrls.size);
Array.from(cloudinaryUrls).forEach(u => console.log(u));
