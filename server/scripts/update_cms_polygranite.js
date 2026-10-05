import fs from 'fs';

const file = 'client/src/utils/cmsStore.js';
let content = fs.readFileSync(file, 'utf8');

const target = `              if (p && (p.slug === 'acrylic-luxe-collection' || p.materialCode === 'MAT-ACR-01')) {
                if (p.heroImage !== 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png') {
                  p.heroImage = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png';
                  p.image = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png';
                  updatedProd = true;
                }
              }`;

const replacement = `              if (p && (p.slug === 'acrylic-luxe-collection' || p.materialCode === 'MAT-ACR-01')) {
                if (p.heroImage !== 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png') {
                  p.heroImage = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png';
                  p.image = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png';
                  updatedProd = true;
                }
              }
              if (p && (p.slug === 'digital-korean-poly-granite' || p.materialCode === 'MAT-GNT-02')) {
                if (p.heroImage !== 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png') {
                  p.heroImage = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png';
                  p.image = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png';
                  updatedProd = true;
                }
              }`;

const normContent = content.replace(/\r\n/g, '\n');
const normTarget = target.replace(/\r\n/g, '\n');
const normReplacement = replacement.replace(/\r\n/g, '\n');

if (normContent.includes(normTarget)) {
  const isCRLF = content.includes('\r\n');
  let updated = normContent.replace(normTarget, normReplacement);
  if (isCRLF) updated = updated.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, updated, 'utf8');
  console.log('Successfully updated cmsStore.js with polygranite migration!');
} else {
  console.error('Target not found in cmsStore.js');
}
