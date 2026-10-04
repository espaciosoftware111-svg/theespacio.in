import fs from 'fs';

const data = JSON.parse(fs.readFileSync('temp_rahul/uploaded_data.json', 'utf8'));

const ORDERED_FILES = [
  { file: '29_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_5-20260810-122237.jpg', room: 'Clean Contemporary Living Lounge & Floating TV Console' },
  { file: '05_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_27-20260810-122243.jpg', room: 'Master Bedroom Suite & Bookmatched Marble Wall' },
  { file: '27_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_33-20260810-122245.jpg', room: 'Designer Sectional Lounge & Marble Coffee Table' },
  { file: '20_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg', room: 'Dining Suite & Backlit Marble Ganesha Shrine' },
  { file: '16_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_20-20260810-122237.jpg', room: 'Contemporary Modular Kitchen & Breakfast Counter' },
  { file: '21_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_10-20260810-122233.jpg', room: 'Living Room Panorama & Natural Light Vistas' },
  { file: '09_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_32-20260810-122244.jpg', room: 'Master Suite Symmetry & Halo LED Illumination' },
  { file: '12_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_8-20260810-122238.jpg', room: 'Celestial Kids Bedroom & Handcrafted Cosmic Mural' },
  { file: '26_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_31-20260810-122245.jpg', room: 'Foyer Art Console & Brass Ginkgo Wall Decor' },
  { file: '28_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_4-20260810-122232.jpg', room: 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents' },
  { file: '06_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_28-20260810-122245.jpg', room: 'Master Suite Integrated PC Workstation & Wardrobe' },
  { file: '22_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_11-20260810-122233.jpg', room: 'Designer Powder Vanity & Vertical Fluted Panelling' },
  { file: '10_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_6-20260810-122239.jpg', room: 'Kids Bedroom Bay Window Seating & Built-in Storage' },
  { file: '07_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_29-20260810-122245.jpg', room: 'Master Bedroom Dressing Mirror & Floating Vanity' },
  { file: '11_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_7-20260810-122239.jpg', room: 'Space Explorer Bunk & Ambient Sconce Lighting' },
  { file: '02_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_2-20260810-122236.jpg', room: 'Minimalist Study Desk & High-Gloss Display Ledge' },
  { file: '23_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_12-20260810-122233.jpg', room: 'Pooja Shrine Detail & Dual-Tier Marble Pedestal' },
  { file: '13_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_9-20260810-122235.jpg', room: 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation' },
  { file: '24_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_14-20260810-122233.jpg', room: 'Washbasin Vanity & Architectural Mirror Nook' },
  { file: '08_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_3-20260810-122234.jpg', room: 'Study Nook Ergonomic Workspace' },
  { file: '01_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_13-20260810-122234.jpg', room: 'Kids Space Suite Full Perspective' },
  { file: '15_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_18-20260810-122232.jpg', room: 'Modular Kitchen Prep Zone & Stainless Cooktop' },
  { file: '14_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_17-20260810-122232.jpg', room: 'Kitchen Storage & Soft-Close Cutlery Drawers' },
  { file: '18_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_22-20260810-122232.jpg', room: 'Kitchen Wall Units & Under-Cabinet Light Detail' },
  { file: '17_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_21-20260810-122232.jpg', room: 'Breakfast Island Corner & Overhead Shelving' },
  { file: '19_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_23-20260810-122232.jpg', room: 'Granite Countertop & Backsplash Detailing' },
  { file: '03_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_24-20260810-122233.jpg', room: 'Kids Bedroom Wardrobe Shutter Alignment' },
  { file: '04_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_25-20260810-122233.jpg', room: 'Kids Bedroom Perspective & Door Frame Fitout' },
  { file: '25_Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_19-20260810-122232.jpg', room: 'Dining & Kitchen Transition Perspective' }
];

const roomsObj = {};
data.items.forEach((it, idx) => {
  const room = ORDERED_FILES[idx]?.room || 'Interior Space';
  const cldId = it.url.split('/').pop().replace(/\.[^/.]+$/, '');
  roomsObj[it.url] = room;
  roomsObj[cldId] = room;
  roomsObj[cldId + '.jpg'] = room;
  roomsObj[cldId + '.png'] = room;
  roomsObj['rahul_gallery_' + (idx + 1) + '.webp'] = room;
  roomsObj['rahul_gallery_' + (idx + 1)] = room;
});

const beforeId = data.before.split('/').pop().replace(/\.[^/.]+$/, '');
const afterId = data.after.split('/').pop().replace(/\.[^/.]+$/, '');

roomsObj[data.before] = 'Raw Site Shell & Pre-Fitout Framing';
roomsObj[beforeId] = 'Raw Site Shell & Pre-Fitout Framing';
roomsObj[beforeId + '.jpg'] = 'Raw Site Shell & Pre-Fitout Framing';
roomsObj['rahul_before.webp'] = 'Raw Site Shell & Pre-Fitout Framing';
roomsObj['rahul_before'] = 'Raw Site Shell & Pre-Fitout Framing';

roomsObj[data.after] = 'Living Room Panorama & Natural Light Vistas';
roomsObj[afterId] = 'Living Room Panorama & Natural Light Vistas';
roomsObj[afterId + '.jpg'] = 'Living Room Panorama & Natural Light Vistas';
roomsObj['rahul_after.webp'] = 'Living Room Panorama & Natural Light Vistas';
roomsObj['rahul_after'] = 'Living Room Panorama & Natural Light Vistas';

fs.writeFileSync('temp_rahul/rooms_generated.json', JSON.stringify(roomsObj, null, 2));
console.log('Generated rooms mapping successfully with', Object.keys(roomsObj).length, 'entries');
