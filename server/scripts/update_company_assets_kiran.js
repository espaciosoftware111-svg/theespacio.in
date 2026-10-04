import fs from 'fs';
import path from 'path';

const filePath = path.resolve('client', 'src', 'utils', 'companyAssets.js');
let code = fs.readFileSync(filePath, 'utf8');

const regex = /  \{\r?\n    id: 'gandipet-modern-retro-2bhk'[\s\S]*?  \},/;
const replacement = `  {
    id: 'gandipet-modern-retro-2bhk',
    title: 'The Panelled Muse',
    category: 'Residential',
    location: 'Gandipet, Hyderabad',
    scope: 'Interior Styling & Turnkey Carpentry',
    area: '1,750 sq.ft',
    timeline: '55 Days',
    heroImage: '/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp',
    description: 'A cozy interplay of mid-century aesthetics for Kiran Raja, rich natural walnut veneers, custom fluted wall paneling, and warm cove ambient illumination.',
    gallery: [
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_4.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_5.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_7.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_9.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_12.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_14.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_15.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_16.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_17.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_18.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_21.webp',
      '/images/projects/gandipet_kiran_2bhk/kiran_gallery_24.webp'
    ]
  },`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('✓ Successfully updated companyAssets.js');
} else {
  console.error('Regex did not match in companyAssets.js');
  process.exit(1);
}
