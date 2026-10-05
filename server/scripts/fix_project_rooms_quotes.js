import fs from 'fs';

let code = fs.readFileSync('client/src/utils/projectRooms.js', 'utf8');
code = code.replaceAll("'Chef's Modular Kitchen & Quartz Countertops'", "'Chefs Modular Kitchen & Quartz Countertops'");
fs.writeFileSync('client/src/utils/projectRooms.js', code, 'utf8');
console.log('✓ Successfully fixed quotes in projectRooms.js');
