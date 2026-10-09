import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cmsPath = path.resolve(__dirname, '../../client/src/utils/cmsStore.js');

let content = fs.readFileSync(cmsPath, 'utf8');

// Find start of DEFAULT_PROJECTS
const startMarker = 'export const DEFAULT_PROJECTS = [';
const endMarker = 'export const DEFAULT_PRODUCTS = [';

const sIdx = content.indexOf(startMarker);
const eIdx = content.indexOf(endMarker);

if (sIdx === -1 || eIdx === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

// Slice out the projects block (between '[' and '];\n\nexport const DEFAULT_PRODUCTS')
const rawProjectsBlock = content.substring(sIdx + startMarker.length, eIdx).trim();
// Remove trailing '];'
const cleanArrayString = rawProjectsBlock.replace(/\];?\s*$/, '');

// Parse DEFAULT_PROJECTS by evaluating in a function scope
const parsedProjects = eval(`([${cleanArrayString}])`);
console.log(`Parsed ${parsedProjects.length} existing default projects.`);

// Find the 7 remaining projects
const pCelestial = parsedProjects.find(p => p._id === 'proj_9_dimmu_chachu_residence' || p.slug === 'dimmu-chachu-luxury-villa');
const pCasaAlta = parsedProjects.find(p => p._id === 'proj_11_casa_alta_residence_kali_mandir' || p.slug === 'casa-alta-residence-kali-mandir');
const pPanelled = parsedProjects.find(p => p._id === 'proj_5_gandipet_kiran' || p.slug === 'gandipet-modern-retro-2bhk');
const pDusk = parsedProjects.find(p => p._id === 'proj_6_kondapur_venkatesh' || p.slug === 'kondapur-minimalist-2bhk');
const pGachibowli = parsedProjects.find(p => p._id === 'proj_7_gachibowli_koteswara' || p.slug === 'gachibowli-minimalist-beige-2bhk');
const pKachiguda = parsedProjects.find(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
const pRestful = parsedProjects.find(p => p._id === 'proj_10_the_restful_home_tellapur' || p.slug === 'the-restful-home-tellapur');

if (!pCelestial || !pCasaAlta || !pPanelled || !pDusk || !pGachibowli || !pKachiguda || !pRestful) {
  console.error('Could not find all 7 projects!', {
    pCelestial: !!pCelestial,
    pCasaAlta: !!pCasaAlta,
    pPanelled: !!pPanelled,
    pDusk: !!pDusk,
    pGachibowli: !!pGachibowli,
    pKachiguda: !!pKachiguda,
    pRestful: !!pRestful
  });
  process.exit(1);
}

// Update order and location
pCelestial.order = 1;
pCelestial.location = 'Kukatpally, Hyderabad';
pCelestial.title = 'The Celestial Curve Villa';

pCasaAlta.order = 2;
pCasaAlta.title = 'Casa Alta Residence';

pPanelled.order = 3;
pPanelled.title = 'The Panelled Muse';

pDusk.order = 4;
pDusk.title = 'The Dusk Lounge';

pGachibowli.order = 5;
pGachibowli.title = 'A 2BHK Residence, Gachibowli';

pKachiguda.order = 6;
pKachiguda.title = 'A Duplex Residence, Kachiguda';

pRestful.order = 7;
pRestful.title = 'The Restful Home';

const new7Projects = [
  pCelestial,
  pCasaAlta,
  pPanelled,
  pDusk,
  pGachibowli,
  pKachiguda,
  pRestful
];

const newDefaultProjectsCode = `export const DEFAULT_PROJECTS = ${JSON.stringify(new7Projects, null, 2)};\n\n`;

// Replace in content
content = content.substring(0, sIdx) + newDefaultProjectsCode + content.substring(eIdx);

// Now update getCMSData's STORAGE_KEYS.PROJECTS block
const projBlockStart = 'if (key === STORAGE_KEYS.PROJECTS && Array.isArray(data)) {';
const projBlockEnd = '// Sanitize gallery images and remove duplicates';

const pbS = content.indexOf(projBlockStart);
const pbE = content.indexOf(projBlockEnd);

if (pbS === -1 || pbE === -1) {
  console.error('getCMSData block markers not found!');
  process.exit(1);
}

const newCMSProjectBlock = `if (key === STORAGE_KEYS.PROJECTS && Array.isArray(data)) {
          let updated = false;

          const REMOVED_SLUGS = ['rajapushpa-provincia-3bhk', 'my-home-sayuk-3bhk', 'kokapet-2bhk', 'kokapet-urban-2bhk'];
          const REMOVED_IDS = ['proj_1_rajapushpa_provincia', 'proj_2_my_home_sayuk', 'proj_3_kokapet_nagesh', 'proj_4_kokapet_rahul'];

          // Strip removed projects
          if (data.some(p => p && (REMOVED_IDS.includes(p._id || p.id) || REMOVED_SLUGS.includes(p.slug) || (p.title && (p.title.includes('Boucle') || p.title.includes('Arcstone') || p.title.includes('Lattice') || p.title.includes('Ivory')))))) {
            data = data.filter(p => p && !REMOVED_IDS.includes(p._id || p.id) && !REMOVED_SLUGS.includes(p.slug) && !(p.title && (p.title.includes('Boucle') || p.title.includes('Arcstone') || p.title.includes('Lattice') || p.title.includes('Ivory'))));
            updated = true;
          }

          const CANONICAL_ORDER_MAP = {
            'dimmu-chachu-luxury-villa': 1,
            'proj_9_dimmu_chachu_residence': 1,
            'casa-alta-residence-kali-mandir': 2,
            'proj_11_casa_alta_residence_kali_mandir': 2,
            'gandipet-modern-retro-2bhk': 3,
            'proj_5_gandipet_kiran': 3,
            'kondapur-minimalist-2bhk': 4,
            'proj_6_kondapur_venkatesh': 4,
            'gachibowli-minimalist-beige-2bhk': 5,
            'proj_7_gachibowli_koteswara': 5,
            'kachiguda-fusion-duplex-villa': 6,
            'proj_8_kachiguda_subbarao': 6,
            'the-restful-home-tellapur': 7,
            'proj_10_the_restful_home_tellapur': 7
          };

          // Ensure all 7 canonical projects exist and have correct order and details
          for (const dp of DEFAULT_PROJECTS) {
            const existingIdx = data.findIndex(p => p && (p.slug === dp.slug || p._id === dp._id || p.id === dp._id));
            if (existingIdx === -1) {
              data.push(dp);
              updated = true;
            } else {
              const cur = data[existingIdx];
              const expectedOrder = CANONICAL_ORDER_MAP[dp.slug] || dp.order;
              if (cur.order !== expectedOrder) {
                cur.order = expectedOrder;
                updated = true;
              }
              if (dp.slug === 'dimmu-chachu-luxury-villa' && cur.location !== 'Kukatpally, Hyderabad') {
                cur.location = 'Kukatpally, Hyderabad';
                updated = true;
              }
              if (cur.title !== dp.title) {
                cur.title = dp.title;
                updated = true;
              }
            }
          }

          // Sort data by canonical sequence
          data.sort((a, b) => {
            const ordA = CANONICAL_ORDER_MAP[a.slug] || CANONICAL_ORDER_MAP[a._id] || Number(a.order) || 999;
            const ordB = CANONICAL_ORDER_MAP[b.slug] || CANONICAL_ORDER_MAP[b._id] || Number(b.order) || 999;
            return ordA - ordB;
          });

          \n          `;

content = content.substring(0, pbS) + newCMSProjectBlock + content.substring(pbE);

fs.writeFileSync(cmsPath, content, 'utf8');
console.log('✓ Successfully updated cmsStore.js with the 7 reordered projects!');
