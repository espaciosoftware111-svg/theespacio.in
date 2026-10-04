import fs from 'fs';
import path from 'path';

const rooms = JSON.parse(fs.readFileSync('temp_rahul/rooms_generated.json', 'utf8'));

let snippet = "  'kokapet-urban-2bhk': {\n";
for (const [key, val] of Object.entries(rooms)) {
  snippet += `    '${key}': '${val}',\n`;
}
snippet += '  },';

const roomsFile = path.resolve('client', 'src', 'utils', 'projectRooms.js');
let fileContent = fs.readFileSync(roomsFile, 'utf8');

const regex = /  \/\/ 4\. The Ivory Retreat \(Kokapet Urban 2BHK\)\r?\n  'kokapet-urban-2bhk': \{[\s\S]*?  \},/;
const replacement = `  // 4. The Ivory Retreat (Kokapet Urban 2BHK)\n${snippet}`;

if (!regex.test(fileContent)) {
  console.error('Regex did not match projectRooms.js block!');
  process.exit(1);
}

fileContent = fileContent.replace(regex, replacement);
fs.writeFileSync(roomsFile, fileContent, 'utf8');
console.log('✓ Successfully updated client/src/utils/projectRooms.js!');
