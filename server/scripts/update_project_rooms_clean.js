import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('server/scripts/subbarao_processed_manifest.json', 'utf8'));

let targetCode = fs.readFileSync('client/src/utils/projectRooms.js', 'utf8');

// Build the EXACT_PROJECT_ROOMS mapping lines for kachiguda-fusion-duplex-villa
let roomLines = `  // 8. Kachiguda Fusion Duplex Villa (K. Subba Rao - Exquisite Fusion of Modern & Desi in a 4BHK)\r\n  'kachiguda-fusion-duplex-villa': {\r\n`;

// Include hero and after
roomLines += `    // Hero & Transformation\r\n`;
roomLines += `    'subbarao_hero.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'subbarao_hero': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'bqtmsst1w8jjit2drtmq.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'bqtmsst1w8jjit2drtmq': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'subbarao_after.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'subbarao_after': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'unbmruocdxxhcb4wvn7e.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'unbmruocdxxhcb4wvn7e': 'Grand Duplex Living Hall & Architectural Staircase Vista',\r\n`;
roomLines += `    'subbarao_before.webp': 'Raw Site Shell & Structural Framing',\r\n`;
roomLines += `    'subbarao_before': 'Raw Site Shell & Structural Framing',\r\n`;
roomLines += `    'blohvaxle28zo18l7lug.jpg': 'Raw Site Shell & Structural Framing',\r\n`;
roomLines += `    'blohvaxle28zo18l7lug': 'Raw Site Shell & Structural Framing',\r\n\r\n`;

manifest.details.forEach(d => {
  const cldId = d.cloudinaryUrl.split('/').pop().split('.')[0];
  const safeBase = d.sourceFile.replace(/\.jpg$/i, '');
  const cleanBase = d.sourceFile.replace('Exquisite Fusion of Modern & Desi in a 4BHK-', '').replace(/\.jpg$/i, '');
  const safeRoom = d.room.replaceAll("'", "\\'");

  roomLines += `    // ${d.rank}. ${d.title}\r\n`;
  roomLines += `    'subbarao_gallery_${d.rank}.webp': '${safeRoom}',\r\n`;
  roomLines += `    'subbarao_gallery_${d.rank}': '${safeRoom}',\r\n`;
  roomLines += `    '${cldId}.jpg': '${safeRoom}',\r\n`;
  roomLines += `    '${cldId}': '${safeRoom}',\r\n`;
  roomLines += `    '${d.sourceFile}': '${safeRoom}',\r\n`;
  roomLines += `    '${safeBase}': '${safeRoom}',\r\n`;
  roomLines += `    '${cleanBase}': '${safeRoom}',\r\n\r\n`;
});

roomLines += `  },\r\n\r\n`;

// Start marker and end marker
const kachigudaIdx = targetCode.indexOf("'kachiguda-fusion-duplex-villa': {");
const startIdx = targetCode.lastIndexOf("// 8. Kachiguda", kachigudaIdx);
const endIdx = targetCode.indexOf("// 9. The Celestial Curve Villa");

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!', { startIdx, endIdx });
  process.exit(1);
}

targetCode = targetCode.substring(0, startIdx) + roomLines + targetCode.substring(endIdx);
console.log('✓ Successfully replaced item 8 in EXACT_PROJECT_ROOMS');

// Now add Subbarao handling in detectRoomFromFilename
const detectMarker = "// 4. Specific Dimmu Chachu Villa image mapping";
const detectIdx = targetCode.indexOf(detectMarker);

if (detectIdx !== -1) {
  let detectBlock = `  // 5. Specific Subbarao Kachiguda Duplex image mapping (26 4K images)\r\n  if (lower.includes('subbarao') || lower.includes('kachiguda')) {\r\n`;
  detectBlock += `    if (lower.includes('hero') || lower.includes('bqtmsst1w8jjit2drtmq') || lower.includes('after') || lower.includes('unbmruocdxxhcb4wvn7e')) return 'Grand Duplex Living Hall & Architectural Staircase Vista';\r\n`;
  detectBlock += `    if (lower.includes('before') || lower.includes('blohvaxle28zo18l7lug')) return 'Raw Site Shell & Structural Framing';\r\n`;

  manifest.details.forEach(d => {
    const cldId = d.cloudinaryUrl.split('/').pop().split('.')[0];
    const safeRoom = d.room.replaceAll("'", "\\'");
    detectBlock += `    if (lower.includes('gallery_${d.rank}') || lower.includes('${cldId}')) return '${safeRoom}';\r\n`;
  });
  detectBlock += `  }\r\n\r\n`;

  targetCode = targetCode.substring(0, detectIdx) + detectBlock + targetCode.substring(detectIdx);
  console.log('✓ Successfully injected Subbarao detect block in detectRoomFromFilename');
}

fs.writeFileSync('client/src/utils/projectRooms.js', targetCode, 'utf8');
console.log('✓ client/src/utils/projectRooms.js successfully saved!');
