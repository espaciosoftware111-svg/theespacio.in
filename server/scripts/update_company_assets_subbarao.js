import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('server/scripts/subbarao_processed_manifest.json', 'utf8'));

let assetsCode = fs.readFileSync('client/src/utils/companyAssets.js', 'utf8');

const updatedObj = {
  id: 'kachiguda-fusion-duplex-villa',
  title: 'A Duplex Residence, Kachiguda',
  category: 'Residential',
  location: 'Kachiguda, Hyderabad',
  scope: 'Architecture & Turnkey Interior',
  area: '3,800 sq.ft',
  timeline: '120 Days',
  heroImage: manifest.heroImage,
  description: "An exquisite fusion of contemporary luxury and Desi soul across a sprawling 4BHK duplex in Kachiguda, Hyderabad. Featuring a grand living hall with a floating linear fireplace and sculptural marble staircase, an open-concept dining pavilion with smart integrated appliances, a bespoke modular chef's kitchen, a serene parents' suite with traditional circular ink art and walk-in dressing lounge, and an aviation-themed boys' bedroom with a custom vintage aeronautical biplane blueprint mural.",
  gallery: manifest.images
};

const startMarker = "id: 'kachiguda-fusion-duplex-villa'";
const endMarker = "id: 'kokapet-urban-2bhk'";

const startIdx = assetsCode.indexOf(startMarker);
const endIdx = assetsCode.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found in companyAssets.js!', { startIdx, endIdx });
  process.exit(1);
}

const braceStart = assetsCode.lastIndexOf('{', startIdx);
const braceEnd = assetsCode.lastIndexOf('{', endIdx);

const formatted = JSON.stringify(updatedObj, null, 4).replace(/^/gm, '  ');

assetsCode = assetsCode.substring(0, braceStart) + formatted.trim() + ',\n  ' + assetsCode.substring(braceEnd);

fs.writeFileSync('client/src/utils/companyAssets.js', assetsCode, 'utf8');
console.log('✓ Successfully updated client/src/utils/companyAssets.js');
