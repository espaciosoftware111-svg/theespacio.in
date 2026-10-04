import fs from 'fs';
import path from 'path';

const projectRoomsPath = path.resolve('client', 'src', 'utils', 'projectRooms.js');
let projectRoomsContent = fs.readFileSync(projectRoomsPath, 'utf8');

// Replacement for gandipet-modern-retro-2bhk block in projectRooms.js
const gandipetBlockRegex = /  \/\/ 5\. The Panelled Muse \(Gandipet Modern Retro 2BHK\)[\s\S]*?  \},/;

const newGandipetBlock = `  // 5. The Panelled Muse (Gandipet Modern Retro 2BHK)
  'gandipet-modern-retro-2bhk': {
    // 1. Living Room TV Entertainment Feature Wall
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp': 'Living Room TV Feature Wall & Panelling',
    'kiran_gallery_2.webp': 'Living Room TV Feature Wall & Panelling',
    'kiran_gallery_2': 'Living Room TV Feature Wall & Panelling',

    // 2. Master Bedroom Suite - 3/4 Perspective
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_4.webp': 'Master Bedroom Suite & Accent Panelling',
    'kiran_gallery_4.webp': 'Master Bedroom Suite & Accent Panelling',
    'kiran_gallery_4': 'Master Bedroom Suite & Accent Panelling',

    // 3. Master Bedroom - Headboard Elevation
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_5.webp': 'Master Bedroom Headboard Elevation',
    'kiran_gallery_5.webp': 'Master Bedroom Headboard Elevation',
    'kiran_gallery_5': 'Master Bedroom Headboard Elevation',

    // 4. Living Room Media Credenza & Accent Chair
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_7.webp': 'Living Room Media Console & Accent Chair',
    'kiran_gallery_7.webp': 'Living Room Media Console & Accent Chair',
    'kiran_gallery_7': 'Living Room Media Console & Accent Chair',

    // 5. Master Suite & Full-Height Wardrobes
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_9.webp': 'Master Suite & Built-In Wardrobes',
    'kiran_gallery_9.webp': 'Master Suite & Built-In Wardrobes',
    'kiran_gallery_9': 'Master Suite & Built-In Wardrobes',

    // 6. Dining Suite & Illuminated Vitrine
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_12.webp': 'Dining Suite & Illuminated Vitrine',
    'kiran_gallery_12.webp': 'Dining Suite & Illuminated Vitrine',
    'kiran_gallery_12': 'Dining Suite & Illuminated Vitrine',

    // 7. Formal Living Lounge & Terracotta Sofa
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_14.webp': 'Formal Living Lounge & Terracotta Sofa',
    'kiran_gallery_14.webp': 'Formal Living Lounge & Terracotta Sofa',
    'kiran_gallery_14': 'Formal Living Lounge & Terracotta Sofa',

    // 8. Living Lounge & Foyer Transition
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_15.webp': 'Living Lounge & Foyer Transition',
    'kiran_gallery_15.webp': 'Living Lounge & Foyer Transition',
    'kiran_gallery_15': 'Living Lounge & Foyer Transition',

    // 9. Full Living Room Panorama & Balcony Vistas
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_16.webp': 'Living Room Panorama & Balcony Vistas',
    'kiran_gallery_16.webp': 'Living Room Panorama & Balcony Vistas',
    'kiran_gallery_16': 'Living Room Panorama & Balcony Vistas',

    // 10. Classic Boiserie Panelled Wall Elevation
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_17.webp': 'Classic Boiserie Panelled Feature Wall',
    'kiran_gallery_17.webp': 'Classic Boiserie Panelled Feature Wall',
    'kiran_gallery_17': 'Classic Boiserie Panelled Feature Wall',

    // 11. Designer Living Suite & Halo Chandelier
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_18.webp': 'Designer Living Suite & Halo Chandelier',
    'kiran_gallery_18.webp': 'Designer Living Suite & Halo Chandelier',
    'kiran_gallery_18': 'Designer Living Suite & Halo Chandelier',

    // 12. Executive Home Office & Library
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_21.webp': 'Executive Home Office & Library',
    'kiran_gallery_21.webp': 'Executive Home Office & Library',
    'kiran_gallery_21': 'Executive Home Office & Library',

    // 13. Bay Window Daybed & Reading Bench
    '/images/projects/gandipet_kiran_2bhk/kiran_gallery_24.webp': 'Bay Window Daybed & Reading Bench',
    'kiran_gallery_24.webp': 'Bay Window Daybed & Reading Bench',
    'kiran_gallery_24': 'Bay Window Daybed & Reading Bench',

    // Before & After and legacy Cloudinary keys
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791132839/espacio_gallery/mysq2iymi1lwd2lgk5v0.jpg': 'Raw Site Shell & Structural Framing',
    'mysq2iymi1lwd2lgk5v0': 'Raw Site Shell & Structural Framing',
    'mysq2iymi1lwd2lgk5v0.jpg': 'Raw Site Shell & Structural Framing',
    'kiran_before.webp': 'Raw Site Shell & Structural Framing',
    'kiran_before': 'Raw Site Shell & Structural Framing',
    'kiran_after.webp': 'Living Room TV Feature Wall & Panelling',
    'kiran_after': 'Living Room TV Feature Wall & Panelling',
    '5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png': 'Living Room TV Feature Wall & Panelling',
    '5d678d57-3ff6-4ce4-87fb-29b692a0cf84': 'Living Room TV Feature Wall & Panelling',
    'a59fb8f4-c200-468b-bf31-6e63302b0bed.png': 'Dining Suite & Illuminated Vitrine',
    'a59fb8f4-c200-468b-bf31-6e63302b0bed': 'Dining Suite & Illuminated Vitrine',
    '06c85c57-84c6-48b8-86df-c0cda8641627.png': 'Living Room Media Console & Accent Chair',
    '06c85c57-84c6-48b8-86df-c0cda8641627': 'Living Room Media Console & Accent Chair',
    'd03da20b-2b8e-467e-a0c1-e87c0fb81b13.png': 'Executive Home Office & Library',
    'd03da20b-2b8e-467e-a0c1-e87c0fb81b13': 'Executive Home Office & Library',
    'e5fd4044-dbc8-48e7-8269-3d107cc0c436.png': 'Master Bedroom Suite & Accent Panelling',
    'e5fd4044-dbc8-48e7-8269-3d107cc0c436': 'Master Bedroom Suite & Accent Panelling',
    '901c10b3-8957-4198-86c8-4589b1d42750.png': 'Master Suite & Built-In Wardrobes',
    '901c10b3-8957-4198-86c8-4589b1d42750': 'Master Suite & Built-In Wardrobes',
    '69fac825-2a00-4d3d-9f64-19d8336aa9ec.png': 'Bay Window Daybed & Reading Bench',
    '69fac825-2a00-4d3d-9f64-19d8336aa9ec': 'Bay Window Daybed & Reading Bench',
    '802e37b7-a758-4a54-bf4c-ac4666122714.png': 'Formal Living Lounge & Terracotta Sofa',
    '802e37b7-a758-4a54-bf4c-ac4666122714': 'Formal Living Lounge & Terracotta Sofa'
  },`;

if (gandipetBlockRegex.test(projectRoomsContent)) {
  projectRoomsContent = projectRoomsContent.replace(gandipetBlockRegex, newGandipetBlock);
  fs.writeFileSync(projectRoomsPath, projectRoomsContent, 'utf8');
  console.log('✓ Successfully updated projectRooms.js');
} else {
  console.error('Regex did not match in projectRooms.js');
  process.exit(1);
}
