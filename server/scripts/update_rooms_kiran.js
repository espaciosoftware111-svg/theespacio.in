import fs from 'fs';
import path from 'path';

const filePath = path.resolve('client', 'src', 'utils', 'projectRooms.js');
let code = fs.readFileSync(filePath, 'utf8');

const needle = `'802e37b7-a758-4a54-bf4c-ac4666122714': 'Louvered Entrance Foyer & Balcony Deck'`;
const addition = `'802e37b7-a758-4a54-bf4c-ac4666122714': 'Louvered Entrance Foyer & Balcony Deck',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791132839/espacio_gallery/mysq2iymi1lwd2lgk5v0.jpg': 'Raw Site Shell & Structural Framing',
    'mysq2iymi1lwd2lgk5v0': 'Raw Site Shell & Structural Framing',
    'mysq2iymi1lwd2lgk5v0.jpg': 'Raw Site Shell & Structural Framing',
    'kiran_before.webp': 'Raw Site Shell & Structural Framing',
    'kiran_before': 'Raw Site Shell & Structural Framing',
    '48723afe-969c-4d67-8024-a74296aad3b2.png': 'Raw Site Shell & Structural Framing',
    '48723afe-969c-4d67-8024-a74296aad3b2': 'Raw Site Shell & Structural Framing'`;

if (code.includes(needle)) {
  code = code.replace(needle, addition);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Successfully updated projectRooms.js');
} else {
  console.error('Needle not found!');
  process.exit(1);
}
