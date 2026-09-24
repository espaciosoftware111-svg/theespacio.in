// Project Gallery Room Names Mapping & Resolution
// Replaces generic "Photo #1", "Photo #2" with authentic, luxury room titles

const EXACT_PROJECT_ROOMS = {
  // 1. The Arcstone Residence (Rajapushpa Provincia 3BHK)
  'rajapushpa-provincia-3bhk': {
    'rajapushpa_after.webp': 'Living Lounge',
    'rajapushpa_1.webp': 'Master Bedroom Suite',
    'rajapushpa_2.webp': 'Master Bedroom',
    'rajapushpa_3.webp': 'Kids Bedroom',
    'rajapushpa_4.webp': 'Kids Bedroom',
    'rajapushpa_5.webp': 'Master Bedroom Wardrobe',
    'rajapushpa_6.webp': 'Living Room Lounge',
    'rajapushpa_7.webp': 'Living Room & TV Wall',
    'rajapushpa_8.webp': 'Living Room & Foyer',
    'rajapushpa_9.webp': 'Living Room Chandelier',
    'rajapushpa_10.webp': 'Living Room Lounge',
    'rajapushpa_11.webp': 'Modular Kitchen',
    'rajapushpa_12.webp': 'Modular Kitchen',
    'rajapushpa_13.webp': 'Guest Bedroom',
    'rajapushpa_14.webp': 'Guest Bedroom',
    'rajapushpa_15.webp': 'Guest Bedroom Wardrobe',
    'rajapushpa_16.webp': 'Guest Bedroom Suite',
    'rajapushpa_17.webp': 'Pooja Mandir',
    'rajapushpa_18.webp': 'Utility & Laundry',
    'rajapushpa_19.webp': 'Guest Bedroom Vanity',
    'rajapushpa_20.webp': 'Master Bedroom Dressing'
  },

  // 2. The Lattice Retreat (My Home Sayuk 3BHK)
  'my-home-sayuk-3bhk': {
    'sayuk_after_open_hall.webp': 'Living Lounge & Japandi Deck',
    'sayuk_4.webp': 'Kitchen & Island Dining',
    'sayuk_5.webp': 'Living Room Lounge',
    'sayuk_6.webp': 'Living Room & Latticework',
    'sayuk_1.webp': 'Master Bedroom Suite',
    'sayuk_2.webp': 'Guest Bedroom',
    'sayuk_3.webp': 'Parents Bedroom',
    'sayuk_7.webp': 'TV Media Wall'
  },

  // 3. The Bouclé Residence (Kokapet 2BHK)
  'kokapet-2bhk': {
    'kokapet_after.webp': 'Living Room & Lounge',
    'kokapet_hall.webp': 'Living Hall & Foyer',
    'kokapet_tv_unit.webp': 'TV Entertainment Unit',
    'kokapet_kitchen.webp': 'Modular Kitchen',
    'kokapet_crockery.webp': 'Crockery Unit & Dining',
    'kokapet_master_bedroom.webp': 'Master Bedroom Suite',
    'kokapet_guest_bedroom.webp': 'Guest Bedroom Suite'
  },

  // 4. The Ivory Retreat (Kokapet Urban 2BHK)
  'kokapet-urban-2bhk': {
    'rahul_after.webp': 'Living Room & Lounge',
    'rahul_gallery_1.webp': 'Kids Bedroom & Study',
    'rahul_gallery_2.webp': 'Kids Bedroom & Study',
    'rahul_gallery_3.webp': 'Kids Bedroom',
    'rahul_gallery_4.webp': 'Kids Bedroom Wardrobe',
    'rahul_gallery_5.webp': 'Master Bedroom Suite',
    'rahul_gallery_6.webp': 'Master Bedroom Wall',
    'rahul_gallery_7.webp': 'Master Bedroom Wardrobe',
    'rahul_gallery_8.webp': 'Master Bedroom Dressing',
    'rahul_gallery_9.webp': 'Modular Kitchen',
    'rahul_gallery_10.webp': 'Modular Kitchen Counter',
    'rahul_gallery_11.webp': 'Modular Kitchen Overhead',
    'rahul_gallery_12.webp': 'Living Room TV Unit',
    'rahul_gallery_13.webp': 'Living Room Media Console',
    'rahul_gallery_14.webp': 'Foyer & Shoe Console',
    'rahul_gallery_15.webp': 'Dining Area',
    'rahul_gallery_16.webp': 'Dining & Crockery',
    'rahul_gallery_17.webp': 'Guest Bedroom',
    'rahul_gallery_18.webp': 'Guest Bedroom Wardrobe',
    'rahul_gallery_19.webp': 'Guest Bedroom Study',
    'rahul_gallery_20.webp': 'Balcony Lounge',
    'rahul_gallery_21.webp': 'Pooja Unit',
    'rahul_gallery_22.webp': 'Utility & Wash Area',
    'rahul_gallery_23.webp': 'Living Room Lounge',
    'rahul_gallery_24.webp': 'Living Room Lighting',
    'rahul_gallery_25.webp': 'Master Bedroom Suite',
    'rahul_gallery_26.webp': 'Master Bedroom Detail',
    'rahul_gallery_27.webp': 'Kids Study Corner',
    'rahul_gallery_28.webp': 'Kitchen Detail',
    'rahul_gallery_29.webp': 'Living Entrance'
  },

  // 5. The Panelled Muse (Gandipet Modern Retro 2BHK)
  'gandipet-modern-retro-2bhk': {
    'kiran_after.webp': 'Dining Area & Glass Partition',
    'kiran_gallery_1.webp': 'Master Bedroom',
    'kiran_gallery_2.webp': 'Living Room & TV Wall',
    'kiran_gallery_3.webp': 'Living Room Lounge',
    'kiran_gallery_4.webp': 'Living Room Panelling',
    'kiran_gallery_5.webp': 'Modular Kitchen',
    'kiran_gallery_6.webp': 'Modular Kitchen Cabinets',
    'kiran_gallery_7.webp': 'Home Office & Study',
    'kiran_gallery_8.webp': 'Home Office Desk',
    'kiran_gallery_9.webp': 'Master Bedroom Suite',
    'kiran_gallery_10.webp': 'Master Bedroom Wardrobe',
    'kiran_gallery_11.webp': 'Master Bedroom Vanity',
    'kiran_gallery_12.webp': 'Guest Bedroom',
    'kiran_gallery_13.webp': 'Guest Bedroom Wardrobe',
    'kiran_gallery_14.webp': 'Dining Area & Bar Unit',
    'kiran_gallery_15.webp': 'Crockery & Wine Rack',
    'kiran_gallery_16.webp': 'Pooja Corner',
    'kiran_gallery_17.webp': 'Balcony Deck Lounge',
    'kiran_gallery_18.webp': 'Foyer & Louvered Partition',
    'kiran_gallery_19.webp': 'Living Room Seating',
    'kiran_gallery_20.webp': 'Master Bedroom Wall Panel',
    'kiran_gallery_21.webp': 'Guest Bedroom Study',
    'kiran_gallery_22.webp': 'Kitchen Breakfast Counter',
    'kiran_gallery_23.webp': 'Living Room Chandelier',
    'kiran_gallery_24.webp': 'Utility Area'
  },

  // 6. The Dusk Lounge (Kondapur Minimalist 2BHK)
  'kondapur-minimalist-2bhk': {
    'venkatesh_after.webp': 'Living Lounge',
    'venkatesh_gallery_1.webp': 'Modular Kitchen & Pantry',
    'venkatesh_gallery_2.webp': 'Master Bedroom Wardrobe',
    'venkatesh_gallery_3.webp': 'Master Bedroom Wardrobe',
    'venkatesh_gallery_4.webp': 'Master Bedroom Suite',
    'venkatesh_gallery_5.webp': 'Master Bedroom Suite',
    'venkatesh_gallery_6.webp': 'Living Room & TV Unit',
    'venkatesh_gallery_7.webp': 'Living Room Media Console',
    'venkatesh_gallery_8.webp': 'Dining Area',
    'venkatesh_gallery_9.webp': 'Dining & Crockery Cabinet',
    'venkatesh_gallery_10.webp': 'Modular Kitchen Countertop',
    'venkatesh_gallery_11.webp': 'Modular Kitchen Hob & Chimney',
    'venkatesh_gallery_12.webp': 'Guest Bedroom',
    'venkatesh_gallery_13.webp': 'Guest Bedroom Wardrobe',
    'venkatesh_gallery_14.webp': 'Guest Bedroom Bed Wall',
    'venkatesh_gallery_15.webp': 'Foyer & Entryway',
    'venkatesh_gallery_16.webp': 'Pooja Unit',
    'venkatesh_gallery_17.webp': 'Balcony Lounge',
    'venkatesh_gallery_18.webp': 'Living Room Seating',
    'venkatesh_gallery_19.webp': 'Master Bedroom Vanity',
    'venkatesh_gallery_20.webp': 'Utility & Laundry',
    'venkatesh_gallery_21.webp': 'Master Bedroom Lighting'
  },

  // 7. Gachibowli Minimalist Beige 2BHK
  'gachibowli-minimalist-beige-2bhk': {
    'koteswara_after.webp': 'Master Bedroom Suite',
    'koteswara_gallery_1.webp': 'Living Room Lounge',
    'koteswara_gallery_2.webp': 'Living Room & TV Wall',
    'koteswara_gallery_3.webp': 'Living Room Media Console',
    'koteswara_gallery_4.webp': 'Modular Kitchen',
    'koteswara_gallery_5.webp': 'Modular Kitchen Cabinets',
    'koteswara_gallery_6.webp': 'Dining Area',
    'koteswara_gallery_7.webp': 'Dining & Crockery Unit',
    'koteswara_gallery_8.webp': 'Master Bedroom Wardrobe',
    'koteswara_gallery_9.webp': 'Master Bedroom Dressing',
    'koteswara_gallery_10.webp': 'Master Bedroom Headboard',
    'koteswara_gallery_11.webp': 'Guest Bedroom Suite',
    'koteswara_gallery_12.webp': 'Guest Bedroom Wardrobe',
    'koteswara_gallery_13.webp': 'Guest Bedroom Study',
    'koteswara_gallery_14.webp': 'Foyer & Shoe Rack',
    'koteswara_gallery_15.webp': 'Pooja Unit',
    'koteswara_gallery_16.webp': 'Balcony Garden Lounge',
    'koteswara_gallery_17.webp': 'Living Room Sofa',
    'koteswara_gallery_18.webp': 'Kitchen Breakfast Counter',
    'koteswara_gallery_19.webp': 'Master Bedroom Vanity',
    'koteswara_gallery_20.webp': 'Guest Bedroom Bed Wall',
    'koteswara_gallery_21.webp': 'Living Room Lighting',
    'koteswara_gallery_22.webp': 'Utility & Wash Area',
    'koteswara_gallery_23.webp': 'Dining Seating',
    'koteswara_gallery_24.webp': 'Modular Kitchen Pantry',
    'koteswara_gallery_25.webp': 'Master Bedroom View',
    'koteswara_gallery_26.webp': 'Living Room Corner',
    'koteswara_gallery_27.webp': 'Foyer Wall Accent',
    'koteswara_gallery_28.webp': 'Living Lounge Overview'
  },

  // 8. Kachiguda Fusion Duplex Villa
  'kachiguda-fusion-duplex-villa': {
    'subbarao_after.webp': 'Grand Living Lounge & Dining',
    'subbarao_gallery_1.webp': 'Living Room & Marble Wall',
    'subbarao_gallery_2.webp': 'Living Room TV Unit',
    'subbarao_gallery_3.webp': 'Formal Dining Lounge',
    'subbarao_gallery_4.webp': 'Dining Crockery Cabinet',
    'subbarao_gallery_5.webp': 'Modular Island Kitchen',
    'subbarao_gallery_6.webp': 'Modular Kitchen Countertop',
    'subbarao_gallery_7.webp': 'Master Bedroom Suite',
    'subbarao_gallery_8.webp': 'Master Bedroom Wardrobe',
    'subbarao_gallery_9.webp': 'Master Bedroom Dressing',
    'subbarao_gallery_10.webp': 'Parents Bedroom Suite',
    'subbarao_gallery_11.webp': 'Parents Bedroom Wardrobe',
    'subbarao_gallery_12.webp': 'Boys Bedroom & Study',
    'subbarao_gallery_13.webp': 'Boys Bedroom Bunk & Desk',
    'subbarao_gallery_14.webp': 'Duplex Staircase Lounge',
    'subbarao_gallery_15.webp': 'Upper Floor Living Lounge',
    'subbarao_gallery_16.webp': 'Pooja Mandir Suite',
    'subbarao_gallery_17.webp': 'Balcony Terrace Deck',
    'subbarao_gallery_18.webp': 'Foyer & Grand Entrance',
    'subbarao_gallery_19.webp': 'Guest Bedroom Suite',
    'subbarao_gallery_20.webp': 'Guest Bedroom Wardrobe',
    'subbarao_gallery_21.webp': 'Home Theater Lounge',
    'subbarao_gallery_22.webp': 'Utility & Wet Kitchen',
    'subbarao_gallery_23.webp': 'Master Bathroom Vanity',
    'subbarao_gallery_24.webp': 'Walk-In Dressing Room',
    'subbarao_gallery_25.webp': 'Dining Chandelier View',
    'subbarao_gallery_26.webp': 'Grand Living Hall Overview'
  },

  // 9. The Celestial Curve Villa (Dimmu Chachu Luxury Villa)
  'dimmu-chachu-luxury-villa': {
    'dimmu_05.webp': 'Double-Height Foyer & Grand Staircase',
    'dimmu_01.webp': 'Living Lounge & TV Media Wall',
    'dimmu_06.webp': 'Formal Lounge & Sculpted Wave Ceiling',
    'dimmu_03.webp': 'Upper Level Mezzanine & Chandelier',
    'dimmu_10.webp': 'High-Gloss Modular Kitchen',
    'dimmu_09.webp': 'Cricket Tribute Suite (Wide View)',
    'dimmu_08.webp': 'Cricket Tribute Suite & Custom Wardrobes',
    'dimmu_02.webp': 'Teal Master Suite & Bay Window Seating',
    'dimmu_07.webp': 'Teal Master Bedroom Daybed Nook',
    'dimmu_04.webp': 'Terracotta Guest Suite & Study Desk',
    '11vRjw6c7ggNcKN0lxai6ITtYi9pFAb90': 'Double-Height Foyer & Grand Staircase',
    '1-3G3pcdQjdfQdQIgV9_NiPVHug1jBEV-': 'Living Lounge & TV Media Wall',
    '1AU0ZTuIDg3GFVukC10lhQIL9ciUHOP6F': 'Formal Lounge & Sculpted Wave Ceiling',
    '1P7uXgbUY5Fxi1-PpHJMLMwJ3buW0--uZ': 'Upper Level Mezzanine & Chandelier',
    '1NSvtQJQT6yMaXzaKo0MuYCh6QASUpIar': 'High-Gloss Modular Kitchen',
    '1vBO1eqO5WOqGfwUH_SHVH7w4SDYW_F6K': 'Cricket Tribute Suite (Wide View)',
    '1DJKwU5PAkkFGGnh5USDg-X2x87ZIYFxc': 'Cricket Tribute Suite & Custom Wardrobes',
    '12NBwWBswtvKr0wNiU8qLvvzp6r4IX4mA': 'Teal Master Suite & Bay Window Seating',
    '1GftiecMuUOlfXEMdCtL6q0O5cpkrW2EF': 'Teal Master Bedroom Daybed Nook',
    '1smFAVnKujLD_imWl--XMcNFas-faQXc-': 'Terracotta Guest Suite & Study Desk'
  }
};

// Aliases by project _id
EXACT_PROJECT_ROOMS['proj_1_rajapushpa_provincia'] = EXACT_PROJECT_ROOMS['rajapushpa-provincia-3bhk'];
EXACT_PROJECT_ROOMS['proj_2_my_home_sayuk'] = EXACT_PROJECT_ROOMS['my-home-sayuk-3bhk'];
EXACT_PROJECT_ROOMS['proj_3_kokapet_nagesh'] = EXACT_PROJECT_ROOMS['kokapet-2bhk'];
EXACT_PROJECT_ROOMS['proj_4_kokapet_rahul'] = EXACT_PROJECT_ROOMS['kokapet-urban-2bhk'];
EXACT_PROJECT_ROOMS['proj_5_gandipet_kiran'] = EXACT_PROJECT_ROOMS['gandipet-modern-retro-2bhk'];
EXACT_PROJECT_ROOMS['proj_6_kondapur_venkatesh'] = EXACT_PROJECT_ROOMS['kondapur-minimalist-2bhk'];
EXACT_PROJECT_ROOMS['proj_7_gachibowli_koteswara'] = EXACT_PROJECT_ROOMS['gachibowli-minimalist-beige-2bhk'];
EXACT_PROJECT_ROOMS['proj_8_kachiguda_subbarao'] = EXACT_PROJECT_ROOMS['kachiguda-fusion-duplex-villa'];
EXACT_PROJECT_ROOMS['proj_9_dimmu_chachu_residence'] = EXACT_PROJECT_ROOMS['dimmu-chachu-luxury-villa'];

// Smart filename keyword matcher
function detectRoomFromFilename(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('master_bed') || lower.includes('master-bed') || lower.includes('masterbed')) return 'Master Bedroom Suite';
  if (lower.includes('guest_bed') || lower.includes('guest-bed') || lower.includes('guestbed')) return 'Guest Bedroom Suite';
  if (lower.includes('kids_bed') || lower.includes('kids-bed') || lower.includes('boy') || lower.includes('children')) return 'Kids Bedroom';
  if (lower.includes('bed_room') || lower.includes('bedroom') || lower.includes('bed-room')) return 'Bedroom Suite';
  if (lower.includes('island_kitchen') || lower.includes('open_kitchen')) return 'Modular Island Kitchen';
  if (lower.includes('kitchen')) return 'Modular Kitchen';
  if (lower.includes('tv_unit') || lower.includes('tv-unit') || lower.includes('media_wall')) return 'TV Media Wall';
  if (lower.includes('crockery')) return 'Crockery & Dining';
  if (lower.includes('dining') || lower.includes('restaurant')) return 'Dining Area';
  if (lower.includes('open_hall') || lower.includes('hall')) return 'Living Hall';
  if (lower.includes('living')) return 'Living Room Lounge';
  if (lower.includes('pooja') || lower.includes('mandir')) return 'Pooja Mandir';
  if (lower.includes('wardrobe') || lower.includes('closet')) return 'Modular Wardrobe';
  if (lower.includes('vanity') || lower.includes('dressing')) return 'Dressing Vanity';
  if (lower.includes('balcony') || lower.includes('deck') || lower.includes('terrace')) return 'Balcony Lounge';
  if (lower.includes('study') || lower.includes('office') || lower.includes('workstation')) return 'Home Office & Study';
  if (lower.includes('foyer') || lower.includes('entry') || lower.includes('entrance')) return 'Entrance Foyer';
  if (lower.includes('utility') || lower.includes('laundry') || lower.includes('wash')) return 'Utility & Laundry';
  return null;
}

const DEFAULT_ROOM_CYCLE = [
  'Living Room Lounge',
  'Master Bedroom Suite',
  'Modular Kitchen',
  'Dining Lounge',
  'Guest Bedroom',
  'TV Entertainment Wall',
  'Kids Bedroom Suite',
  'Master Wardrobe & Vanity',
  'Balcony Lounge',
  'Pooja Mandir',
  'Entrance Foyer',
  'Utility & Laundry'
];

/**
 * Returns the luxury room title for a given project image.
 * Never returns "Photo #1" or numbers.
 */
export function getProjectRoomName(project, imgUrl, index = 0) {
  if (!imgUrl) return 'Living Room';

  // Extract clean filename from URL or path
  const filename = imgUrl.split('/').pop().split('?')[0];

  // 1. Check project-specific map
  const projectKey = project?.slug || project?._id || project?.id;
  if (projectKey && EXACT_PROJECT_ROOMS[projectKey]) {
    const map = EXACT_PROJECT_ROOMS[projectKey];
    if (map[filename]) return map[filename];
  }

  // Also check all project maps in case the image filename is unique
  for (const pKey of Object.keys(EXACT_PROJECT_ROOMS)) {
    if (EXACT_PROJECT_ROOMS[pKey][filename]) {
      return EXACT_PROJECT_ROOMS[pKey][filename];
    }
  }

  // 2. Detect from filename keywords
  const detected = detectRoomFromFilename(filename);
  if (detected) return detected;

  // 3. Fallback to clean room sequence
  const cycleIndex = (index >= 0 ? index : 0) % DEFAULT_ROOM_CYCLE.length;
  return DEFAULT_ROOM_CYCLE[cycleIndex];
}

export default getProjectRoomName;
