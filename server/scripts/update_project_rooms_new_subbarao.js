import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('server/scripts/subbarao_processed_manifest.json', 'utf8'));

let targetCode = fs.readFileSync('client/src/utils/projectRooms.js', 'utf8');

// Build the EXACT_PROJECT_ROOMS mapping lines for kachiguda-fusion-duplex-villa
let roomLines = `  // 8. Kachiguda Fusion Duplex Villa (K. Subba Rao - Exquisite Fusion of Modern & Desi in a 4BHK)\n  'kachiguda-fusion-duplex-villa': {\n`;

// Include hero and after
roomLines += `    // Hero & Transformation\n`;
roomLines += `    'subbarao_hero.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'subbarao_hero': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'bqtmsst1w8jjit2drtmq.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'bqtmsst1w8jjit2drtmq': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'subbarao_after.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'subbarao_after': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'unbmruocdxxhcb4wvn7e.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'unbmruocdxxhcb4wvn7e': 'Grand Duplex Living Hall & Architectural Staircase Vista',\n`;
roomLines += `    'subbarao_before.webp': 'Raw Site Shell & Structural Framing',\n`;
roomLines += `    'subbarao_before': 'Raw Site Shell & Structural Framing',\n`;
roomLines += `    'blohvaxle28zo18l7lug.jpg': 'Raw Site Shell & Structural Framing',\n`;
roomLines += `    'blohvaxle28zo18l7lug': 'Raw Site Shell & Structural Framing',\n\n`;

manifest.details.forEach(d => {
  const cldId = d.cloudinaryUrl.split('/').pop().split('.')[0];
  const safeBase = d.sourceFile.replace(/\.jpg$/i, '');
  const cleanBase = d.sourceFile.replace('Exquisite Fusion of Modern & Desi in a 4BHK-', '').replace(/\.jpg$/i, '');

  roomLines += `    // ${d.rank}. ${d.title}\n`;
  roomLines += `    'subbarao_gallery_${d.rank}.webp': '${d.room}',\n`;
  roomLines += `    'subbarao_gallery_${d.rank}': '${d.room}',\n`;
  roomLines += `    '${cldId}.jpg': '${d.room}',\n`;
  roomLines += `    '${cldId}': '${d.room}',\n`;
  roomLines += `    '${d.sourceFile}': '${d.room}',\n`;
  roomLines += `    '${safeBase}': '${d.room}',\n`;
  roomLines += `    '${cleanBase}': '${d.room}',\n\n`;
});

roomLines += `  },\n`;

// Replace in targetCode between 'kachiguda-fusion-duplex-villa': { and next project or EXACT_PROJECT_ROOMS['proj_8_kachiguda_subbarao']
const startIdx = targetCode.indexOf("// 8. Kachiguda Fusion Duplex Villa");
const endMarker = "EXACT_PROJECT_ROOMS['proj_8_kachiguda_subbarao']";
const endIdx = targetCode.indexOf(endMarker);

if (startIdx !== -1 && endIdx !== -1) {
  targetCode = targetCode.substring(0, startIdx) + roomLines + '\n' + targetCode.substring(endIdx);
  console.log('✓ Successfully replaced EXACT_PROJECT_ROOMS block for kachiguda-fusion-duplex-villa');
} else {
  console.error('Could not find start or end index for block replacement!');
  process.exit(1);
}

// Now update detectRoomFromFilename function in projectRooms.js
const detectStart = targetCode.indexOf("// 5. Specific Subbarao Kachiguda Duplex image mapping");
const detectEnd = targetCode.indexOf("// General room keyword matches", detectStart);

if (detectStart !== -1 && detectEnd !== -1) {
  let detectBlock = `  // 5. Specific Subbarao Kachiguda Duplex image mapping (26 4K images)\n  if (lower.includes('subbarao') || lower.includes('kachiguda')) {\n`;
  detectBlock += `    if (lower.includes('hero') || lower.includes('bqtmsst1w8jjit2drtmq') || lower.includes('after') || lower.includes('unbmruocdxxhcb4wvn7e')) return 'Grand Duplex Living Hall & Architectural Staircase Vista';\n`;
  detectBlock += `    if (lower.includes('before') || lower.includes('blohvaxle28zo18l7lug')) return 'Raw Site Shell & Structural Framing';\n`;

  manifest.details.forEach(d => {
    const cldId = d.cloudinaryUrl.split('/').pop().split('.')[0];
    detectBlock += `    if (lower.includes('gallery_${d.rank}') || lower.includes('${cldId}')) return '${d.room}';\n`;
  });
  detectBlock += `  }\n\n`;

  targetCode = targetCode.substring(0, detectStart) + detectBlock + targetCode.substring(detectEnd);
  console.log('✓ Successfully replaced detectRoomFromFilename block for Subbarao');
}

fs.writeFileSync('client/src/utils/projectRooms.js', targetCode, 'utf8');
console.log('✓ client/src/utils/projectRooms.js successfully saved!');
