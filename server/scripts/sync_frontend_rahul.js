import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('temp_rahul/uploaded_data.json', 'utf8'));

// 1. Update companyAssets.js
const companyAssetsPath = path.resolve('client', 'src', 'utils', 'companyAssets.js');
let caContent = fs.readFileSync(companyAssetsPath, 'utf8');

const caRegex = /id:\s*'kokapet-urban-2bhk'[\s\S]*?gallery:\s*\[[\s\S]*?\]\r?\n\s*\}/;
const newCaGallery = data.items.map(x => `      '${x.url}'`).join(',\n');
const newCaBlock = `id: 'kokapet-urban-2bhk',
    title: 'The Ivory Retreat',
    category: 'Residential',
    location: 'Kokapet, Hyderabad',
    scope: 'Bespoke Turnkey Modular Fitout',
    area: '1,450 sq.ft',
    timeline: '45 Days',
    heroImage: '${data.hero}',
    description: 'A luminous, modern 2BHK residence with bookmatched Italian marble wall, floating TV credenza, seamless modular kitchen, and celestial kids suite.',
    gallery: [
${newCaGallery}
    ]
  }`;

if (caRegex.test(caContent)) {
  caContent = caContent.replace(caRegex, newCaBlock);
  fs.writeFileSync(companyAssetsPath, caContent, 'utf8');
  console.log('✓ Successfully updated client/src/utils/companyAssets.js!');
} else {
  console.warn('Could not match companyAssets.js block');
}

console.log('All frontend assets synchronized!');
