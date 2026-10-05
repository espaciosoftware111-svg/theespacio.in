import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('server/scripts/subbarao_processed_manifest.json', 'utf8'));

let cmsCode = fs.readFileSync('client/src/utils/cmsStore.js', 'utf8');

const updatedP8 = {
  "_id": "proj_8_kachiguda_subbarao",
  "order": 7,
  "title": "A Duplex Residence, Kachiguda",
  "slug": "kachiguda-fusion-duplex-villa",
  "category": "duplex",
  "area": "3,800 sq.ft.",
  "location": "Kachiguda, Hyderabad",
  "year": 2025,
  "style": "Modern & Desi 4BHK Fusion",
  "description": "An exquisite fusion of contemporary luxury and Desi soul across a sprawling 4BHK duplex in Kachiguda, Hyderabad. Featuring a grand living hall with a floating linear fireplace and sculptural marble staircase, an open-concept dining pavilion with smart integrated appliances, a bespoke modular chef's kitchen, a serene parents' suite with traditional circular ink art and walk-in dressing lounge, and an aviation-themed boys' bedroom with a custom vintage aeronautical biplane blueprint mural.",
  "story": {
    "vision": "To craft a multi-generational 4BHK duplex residence in Kachiguda where modern European minimalist aesthetics coalesce with Indian domestic warmth. The design centers around an expansive ground-floor living and entertainment zone, interconnected by a sweeping marble staircase with glass balustrades, creating seamless sightlines between the lounge, dining island, and culinary spaces.",
    "challenges": "Unifying the open-concept ground floor without acoustic reverberation between the entertainment lounge and culinary zones, while crafting deeply tailored atmospheres for each generation: an elegant, serene retreat for the parents with heritage 'Desi' artwork and rich walnut joinery, and an aspirational bedroom for the boys featuring authentic vintage technical illustrations.",
    "solutions": "Engineered acoustic fluted wall paneling, perimeter architectural coves, and recessed magnetic track lighting to softly define functional zones. Anchored the living hall with a floating media wall, roaring linear fireplace, and sculptural staircase. Commissioned a custom full-scale vintage French Nieuport biplane technical blueprint mural in the boys' suite, and designed a tranquil parents' sanctuary with solid walnut furniture, traditional circular ink mandala art, and a fluted walk-in dressing wardrobe.",
    "engineering": "Precision-engineered carpentry with PU and champagne gloss finishes, custom glass-and-brass stair balustrades, concealed ducted HVAC raceways, and smart digital integration across modular kitchen and wardrobe systems.",
    "outcome": "A tour-de-force of turnkey residential architecture. Flawless zero-tolerance millwork, imported Calacatta marble accents, integrated smart refrigeration, and bespoke lighting fixtures coalesce into an opulent, warm home delivered on schedule for K. Subba Rao and family."
  },
  "heroImage": manifest.heroImage,
  "gallery": manifest.images,
  "beforeImage": manifest.beforeImage,
  "afterImage": manifest.afterImage,
  "beforeImages": [manifest.beforeImage],
  "afterImages": [manifest.afterImage],
  "testimonialName": "K. Subba Rao",
  "testimonialProfession": "Homeowner, Kachiguda",
  "testimonialText": "ESPACIO brought our vision of a modern yet deeply comfortable 4BHK duplex to life. From the breathtaking ground-floor living hall with its linear fireplace and marble staircase to the aviation blueprint bedroom our sons adore and our own peaceful parents suite, every inch is engineered with supreme craftsmanship. The turnkey execution was flawless!",
  "testimonialRating": 5,
  "testimonial": {
    "name": "K. Subba Rao",
    "profession": "Homeowner, Kachiguda",
    "role": "Homeowner, Kachiguda, Hyderabad",
    "text": "ESPACIO brought our vision of a modern yet deeply comfortable 4BHK duplex to life. From the breathtaking ground-floor living hall with its linear fireplace and marble staircase to the aviation blueprint bedroom our sons adore and our own peaceful parents suite, every inch is engineered with supreme craftsmanship. The turnkey execution was flawless!",
    "rating": 5
  },
  "rooms": manifest.rooms,
  "featured": true,
  "status": "published"
};

const p8MarkerStart = '    "_id": "proj_8_kachiguda_subbarao",';
const p8MarkerEnd = '    "_id": "proj_9_dimmu_chachu_residence",';

const startIdx = cmsCode.indexOf(p8MarkerStart);
const endIdx = cmsCode.indexOf(p8MarkerEnd);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

// Find preceding '{'
const braceStart = cmsCode.lastIndexOf('{', startIdx);
// Find preceding '{' for p9
const braceEnd = cmsCode.lastIndexOf('{', endIdx);

const formattedP8 = JSON.stringify(updatedP8, null, 4).replace(/^/gm, '  ');

cmsCode = cmsCode.substring(0, braceStart) + formattedP8.trim() + ',\n  ' + cmsCode.substring(braceEnd);

fs.writeFileSync('client/src/utils/cmsStore.js', cmsCode, 'utf8');
console.log('✓ Successfully updated DEFAULT_PROJECTS[7] in client/src/utils/cmsStore.js');
