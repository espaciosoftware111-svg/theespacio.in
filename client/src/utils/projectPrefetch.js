import axios from 'axios';
import { getOptimizedImageUrl } from './imageOptimizer.js';

export const PROJECT_SLUG_ALIASES = {
  // 1. Rajapushpa Provincia 3BHK / The Arcstone Residence, Narsingi
  'rajapushpa-provincia-3bhk': 'rajapushpa-provincia-3bhk',
  'rajapushpa-provincia': 'rajapushpa-provincia-3bhk',
  'rajapushpa': 'rajapushpa-provincia-3bhk',
  'provincia': 'rajapushpa-provincia-3bhk',
  'the-arcstone-residence': 'rajapushpa-provincia-3bhk',
  'the-arcstone-residence-narsingi': 'rajapushpa-provincia-3bhk',
  'narsingi-3bhk': 'rajapushpa-provincia-3bhk',
  'narsingi': 'rajapushpa-provincia-3bhk',
  'dharma-teja': 'rajapushpa-provincia-3bhk',
  'arcstone-residence': 'rajapushpa-provincia-3bhk',
  'arcstone': 'rajapushpa-provincia-3bhk',
  'indo-classical-elegance-3bhk': 'rajapushpa-provincia-3bhk',
  'indo-classical': 'rajapushpa-provincia-3bhk',

  // 2. My Home Sayuk 3BHK
  'my-home-sayuk-3bhk': 'my-home-sayuk-3bhk',
  'my-home-sayuk': 'my-home-sayuk-3bhk',
  'sayuk-3bhk': 'my-home-sayuk-3bhk',
  'sayuk': 'my-home-sayuk-3bhk',
  'the-lattice-retreat': 'my-home-sayuk-3bhk',
  'lattice-retreat': 'my-home-sayuk-3bhk',
  'lattice': 'my-home-sayuk-3bhk',

  // 3. Kokapet 2BHK (Nagesh)
  'kokapet-2bhk': 'kokapet-2bhk',
  'kokapet': 'kokapet-2bhk',
  'kokapet-nagesh': 'kokapet-2bhk',
  'the-boucle-residence': 'kokapet-2bhk',
  'boucle-residence': 'kokapet-2bhk',
  'boucle': 'kokapet-2bhk',

  // 4. Kokapet Urban 2BHK (Rahul / Aparna Zicon)
  'kokapet-urban-2bhk': 'kokapet-urban-2bhk',
  'kokapet-urban': 'kokapet-urban-2bhk',
  'kokapet-rahul': 'kokapet-urban-2bhk',
  'rahul': 'kokapet-urban-2bhk',
  'the-ivory-retreat': 'kokapet-urban-2bhk',
  'ivory-retreat': 'kokapet-urban-2bhk',
  'ivory': 'kokapet-urban-2bhk',
  'aparna-zicon-high-rise-2bhk': 'kokapet-urban-2bhk',
  'aparna-zicon': 'kokapet-urban-2bhk',
  'urban-contemporary-flat-2bhk': 'kokapet-urban-2bhk',

  // 5. Gandipet Modern Retro 2BHK (Kiran)
  'gandipet-modern-retro-2bhk': 'gandipet-modern-retro-2bhk',
  'gandipet-modern-retro': 'gandipet-modern-retro-2bhk',
  'gandipet': 'gandipet-modern-retro-2bhk',
  'gandipet-kiran': 'gandipet-modern-retro-2bhk',
  'kiran': 'gandipet-modern-retro-2bhk',
  'the-panelled-muse': 'gandipet-modern-retro-2bhk',
  'panelled-muse': 'gandipet-modern-retro-2bhk',
  'panelled': 'gandipet-modern-retro-2bhk',
  'modern-retro-haven-2bhk': 'gandipet-modern-retro-2bhk',

  // 6. Kondapur Minimalist 2BHK (Venkatesh)
  'kondapur-minimalist-2bhk': 'kondapur-minimalist-2bhk',
  'kondapur-minimalist': 'kondapur-minimalist-2bhk',
  'kondapur': 'kondapur-minimalist-2bhk',
  'kondapur-venkatesh': 'kondapur-minimalist-2bhk',
  'venkatesh': 'kondapur-minimalist-2bhk',
  'the-dusk-lounge': 'kondapur-minimalist-2bhk',
  'dusk-lounge': 'kondapur-minimalist-2bhk',
  'dusk': 'kondapur-minimalist-2bhk',
  'executive-2bhk-residence': 'kondapur-minimalist-2bhk',

  // 7. Gachibowli Minimalist Beige 2BHK (Koteswara)
  'gachibowli-minimalist-beige-2bhk': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli-minimalist-beige': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli-minimalist': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli': 'gachibowli-minimalist-beige-2bhk',
  'gachibowli-koteswara': 'gachibowli-minimalist-beige-2bhk',
  'koteswara': 'gachibowli-minimalist-beige-2bhk',
  'minimalist-beige-2bhk': 'gachibowli-minimalist-beige-2bhk',

  // 8. Kachiguda Fusion Duplex Villa (Subbarao)
  'kachiguda-fusion-duplex-villa': 'kachiguda-fusion-duplex-villa',
  'kachiguda-fusion-duplex': 'kachiguda-fusion-duplex-villa',
  'kachiguda-duplex': 'kachiguda-fusion-duplex-villa',
  'kachiguda': 'kachiguda-fusion-duplex-villa',
  'kachiguda-subbarao': 'kachiguda-fusion-duplex-villa',
  'subbarao': 'kachiguda-fusion-duplex-villa',
  'exquisite-duplex-fusion-4bhk': 'kachiguda-fusion-duplex-villa',
  'duplex': 'kachiguda-fusion-duplex-villa',

  // 9. Dimmu Chachu Luxury Villa
  'dimmu-chachu-luxury-villa': 'dimmu-chachu-luxury-villa',
  'dimmu-chachu': 'dimmu-chachu-luxury-villa',
  'dimmu': 'dimmu-chachu-luxury-villa',
  'the-celestial-curve-villa': 'dimmu-chachu-luxury-villa',
  'celestial-curve-villa': 'dimmu-chachu-luxury-villa',
  'celestial': 'dimmu-chachu-luxury-villa',
  'grand-3bhk-penthouse-luxe': 'dimmu-chachu-luxury-villa',

  // Project _id mappings
  'proj_1_rajapushpa_provincia': 'rajapushpa-provincia-3bhk',
  'proj_2_my_home_sayuk': 'my-home-sayuk-3bhk',
  'proj_3_kokapet_nagesh': 'kokapet-2bhk',
  'proj_4_kokapet_rahul': 'kokapet-urban-2bhk',
  'proj_5_gandipet_kiran': 'gandipet-modern-retro-2bhk',
  'proj_6_kondapur_venkatesh': 'kondapur-minimalist-2bhk',
  'proj_7_gachibowli_koteswara': 'gachibowli-minimalist-beige-2bhk',
  'proj_8_kachiguda_subbarao': 'kachiguda-fusion-duplex-villa',
  // 10. The Restful Home (Tellapur 2BHK - Dinesh & Sarvani)
  'the-restful-home-tellapur': 'the-restful-home-tellapur',
  'the-restful-home': 'the-restful-home-tellapur',
  'restful-home': 'the-restful-home-tellapur',
  'tellapur-2bhk': 'the-restful-home-tellapur',
  'tellapur': 'the-restful-home-tellapur',
  'dinesh-sarvani': 'the-restful-home-tellapur',

  // 11. Casa Alta Residence (Kali Mandir 3BHK - Prakash)
  'casa-alta-residence-kali-mandir': 'casa-alta-residence-kali-mandir',
  'casa-alta-residence': 'casa-alta-residence-kali-mandir',
  'casa-alta': 'casa-alta-residence-kali-mandir',
  'kali-mandir-3bhk': 'casa-alta-residence-kali-mandir',
  'kali-mandir': 'casa-alta-residence-kali-mandir',
  'prakash': 'casa-alta-residence-kali-mandir',

  // Project _id mappings
  'proj_1_rajapushpa_provincia': 'rajapushpa-provincia-3bhk',
  'proj_2_my_home_sayuk': 'my-home-sayuk-3bhk',
  'proj_3_kokapet_nagesh': 'kokapet-2bhk',
  'proj_4_kokapet_rahul': 'kokapet-urban-2bhk',
  'proj_5_gandipet_kiran': 'gandipet-modern-retro-2bhk',
  'proj_6_kondapur_venkatesh': 'kondapur-minimalist-2bhk',
  'proj_7_gachibowli_koteswara': 'gachibowli-minimalist-beige-2bhk',
  'proj_8_kachiguda_subbarao': 'kachiguda-fusion-duplex-villa',
  'proj_9_dimmu_chachu_residence': 'dimmu-chachu-luxury-villa',
  'proj_10_the_restful_home_tellapur': 'the-restful-home-tellapur',
  'proj_11_casa_alta_residence_kali_mandir': 'casa-alta-residence-kali-mandir',

  // Order number mappings
  '1': 'rajapushpa-provincia-3bhk',
  '2': 'my-home-sayuk-3bhk',
  '3': 'kokapet-2bhk',
  '4': 'kokapet-urban-2bhk',
  '5': 'gandipet-modern-retro-2bhk',
  '6': 'kondapur-minimalist-2bhk',
  '7': 'gachibowli-minimalist-beige-2bhk',
  '8': 'kachiguda-fusion-duplex-villa',
  '9': 'dimmu-chachu-luxury-villa',
  '10': 'the-restful-home-tellapur',
  '11': 'casa-alta-residence-kali-mandir'
};

export const resolveCanonicalSlug = (rawSlug = '') => {
  if (!rawSlug) return 'rajapushpa-provincia-3bhk';
  const clean = String(rawSlug).trim().toLowerCase().replace(/\/+$/, '');
  return PROJECT_SLUG_ALIASES[clean] || clean;
};

export const findProjectMatch = (projectsList, resolvedSlug, cleanSlug) => {
  if (!Array.isArray(projectsList) || projectsList.length === 0) return null;
  const target = resolvedSlug || cleanSlug;

  // 1. Direct slug exact match
  let found = projectsList.find(p => p.slug === resolvedSlug || p.slug === cleanSlug);
  if (found) return found;

  // 2. Direct ID exact match
  found = projectsList.find(p => p._id === resolvedSlug || p._id === cleanSlug || p.id === resolvedSlug || p.id === cleanSlug);
  if (found) return found;

  // 3. Partial slug match
  if (cleanSlug && cleanSlug.length >= 3) {
    found = projectsList.find(p => p.slug && (p.slug.includes(cleanSlug) || cleanSlug.includes(p.slug)));
    if (found) return found;
  }

  // 4. Title slugified match
  if (cleanSlug) {
    found = projectsList.find(p => {
      if (!p.title) return false;
      const slugTitle = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return slugTitle.includes(cleanSlug) || cleanSlug.includes(slugTitle);
    });
    if (found) return found;
  }

  return null;
};

// Module-level in-memory cache for loaded projects (instant page switch)
export const projectDetailCache = new Map();

// Prefetch helper for instant detail view on hover/touch
export const prefetchProject = (slug) => {
  if (!slug) return;
  const clean = String(slug).trim().toLowerCase().replace(/\/+$/, '');
  const resolved = resolveCanonicalSlug(clean);
  if (projectDetailCache.has(resolved) || projectDetailCache.has(clean)) return;

  axios.get(`/api/projects/${resolved}`).then(response => {
    if (response.data?.success && response.data?.data) {
      projectDetailCache.set(resolved, response.data.data);
      projectDetailCache.set(clean, response.data.data);
      const hero = response.data.data.heroImage;
      if (hero) {
        const img = new Image();
        img.src = getOptimizedImageUrl(hero, 1400, 85);
      }
    }
  }).catch(() => {});
};
