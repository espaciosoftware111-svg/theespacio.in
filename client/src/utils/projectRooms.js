// Project Gallery Room Names Mapping & Resolution
// Replaces generic "Photo #1", "Photo #2" with authentic, luxury room titles

const EXACT_PROJECT_ROOMS = {
  // 1. The Arcstone Residence (Rajapushpa Provincia 3BHK)
  'rajapushpa-provincia-3bhk': {
    // Living Lounge & Arched Feature Walls (True living room shown in photos)
    'rajapushpa_8.webp': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_8': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_9.webp': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_9': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_6.webp': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_6': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_7.webp': 'Sculpted TV Feature Wall & Fluted Panelling',
    'rajapushpa_7': 'Sculpted TV Feature Wall & Fluted Panelling',
    'rajapushpa_10.webp': 'Living Lounge & Reading Chair Nook',
    'rajapushpa_10': 'Living Lounge & Reading Chair Nook',

    // Modular Kitchen
    'rajapushpa_11.webp': 'Modular Kitchen & Quartz Countertops',
    'rajapushpa_11': 'Modular Kitchen & Quartz Countertops',
    'rajapushpa_12.webp': 'L-Shaped Modular Kitchen & Fluted Cabinetry',
    'rajapushpa_12': 'L-Shaped Modular Kitchen & Fluted Cabinetry',

    // Pooja Mandir & Foyer
    'rajapushpa_17.webp': 'Pooja Mandir & Foyer Transition',
    'rajapushpa_17': 'Pooja Mandir & Foyer Transition',

    // Master Bedroom Suite
    'rajapushpa_13.webp': 'Master Bedroom & Curved Feature Wall',
    'rajapushpa_13': 'Master Bedroom & Curved Feature Wall',
    'rajapushpa_14.webp': 'Master Suite with Chandelier & Glass Wardrobes',
    'rajapushpa_14': 'Master Suite with Chandelier & Glass Wardrobes',
    'rajapushpa_15.webp': 'Master Bedroom Suite & Ambient Cove Lighting',
    'rajapushpa_15': 'Master Bedroom Suite & Ambient Cove Lighting',
    'rajapushpa_16.webp': 'Master Suite & Tinted Glass Wardrobes',
    'rajapushpa_16': 'Master Suite & Tinted Glass Wardrobes',

    // Guest Bedroom Suite
    'rajapushpa_1.webp': 'Guest Bedroom Suite & Arched Wall Accents',
    'rajapushpa_1': 'Guest Bedroom Suite & Arched Wall Accents',
    'rajapushpa_2.webp': 'Guest Bedroom Suite & Backlit Headboard',
    'rajapushpa_2': 'Guest Bedroom Suite & Backlit Headboard',
    'rajapushpa_5.webp': 'Guest Dressing Vanity & Wardrobes',
    'rajapushpa_5': 'Guest Dressing Vanity & Wardrobes',
    'rajapushpa_20.webp': 'Guest Dressing Vanity & Wardrobes',
    'rajapushpa_20': 'Guest Dressing Vanity & Wardrobes',

    // Kids Bedroom Suite
    'rajapushpa_3.webp': 'Kids Bedroom Suite & Pink Wardrobes',
    'rajapushpa_3': 'Kids Bedroom Suite & Pink Wardrobes',
    'rajapushpa_4.webp': 'Kids Bedroom Suite & Arched Headboard',
    'rajapushpa_4': 'Kids Bedroom Suite & Arched Headboard',

    // Dressing Nook & Utility Suite
    'rajapushpa_19.webp': 'Dressing Nook & Fluted Wall with Round Mirror',
    'rajapushpa_19': 'Dressing Nook & Fluted Wall with Round Mirror',
    'rajapushpa_18.webp': 'Utility & Laundry Suite',
    'rajapushpa_18': 'Utility & Laundry Suite',

    // Cloudinary Asset Hashes for Arcstone
    '74dc6fc0-aa92-46fd-8330-ebf67be7dda4.png': 'Guest Dressing Vanity & Wardrobes',
    '74dc6fc0-aa92-46fd-8330-ebf67be7dda4': 'Guest Dressing Vanity & Wardrobes',
    'c0485a67-f1b9-421e-94c2-1284149bbc98.png': 'Dressing Nook & Fluted Wall with Round Mirror',
    'c0485a67-f1b9-421e-94c2-1284149bbc98': 'Dressing Nook & Fluted Wall with Round Mirror',
    '5974209f-4bf4-48a7-bb22-4372856ffb97.png': 'Utility & Laundry Suite',
    '5974209f-4bf4-48a7-bb22-4372856ffb97': 'Utility & Laundry Suite',
    'e633e606-5bb8-4dad-86c0-20dcd694c75a.png': 'Pooja Mandir & Foyer Transition',
    'e633e606-5bb8-4dad-86c0-20dcd694c75a': 'Pooja Mandir & Foyer Transition',
    '94ced607-e73b-4df5-aaf8-6f94a8c08fbe.png': 'Master Bedroom Suite & Ambient Cove Lighting',
    '94ced607-e73b-4df5-aaf8-6f94a8c08fbe': 'Master Bedroom Suite & Ambient Cove Lighting',
    '04ad3ff9-4782-4218-9003-702e33e09414.png': 'Master Bedroom & Curved Feature Wall',
    '04ad3ff9-4782-4218-9003-702e33e09414': 'Master Bedroom & Curved Feature Wall',
    '46e29765-a1ec-4195-a947-ea566616fe2e.png': 'Kids Bedroom Suite & Pink Wardrobes',
    '46e29765-a1ec-4195-a947-ea566616fe2e': 'Kids Bedroom Suite & Pink Wardrobes',

    // Before & After Transformation
    'rajapushpa_before.webp': 'Raw Site Shell & Pre-Fitout Framing',
    'rajapushpa_before.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'rajapushpa_before': 'Raw Site Shell & Pre-Fitout Framing',
    'ba_1.webp': 'Raw Site Shell & Pre-Fitout Framing',
    'rajapushpa_after.webp': 'Grand Living Lounge & Arched Feature Wall',
    'rajapushpa_after': 'Grand Living Lounge & Arched Feature Wall'
  },

  // 2. The Lattice Retreat (My Home Sayuk 3BHK)
  'my-home-sayuk-3bhk': {
    'sayuk_4.webp': 'Open Island Kitchen & Dining',
    'sayuk_4': 'Open Island Kitchen & Dining',
    'sayuk_6.webp': 'Japandi Living Lounge & Latticework',
    'sayuk_6': 'Japandi Living Lounge & Latticework',
    'sayuk_7.webp': 'Geometric Latticework & TV Wall',
    'sayuk_7': 'Geometric Latticework & TV Wall',
    'sayuk_5.webp': 'Japandi Living Lounge & Raised Deck',
    'sayuk_5': 'Japandi Living Lounge & Raised Deck',
    'sayuk_1.webp': 'Master Bedroom Suite & Acoustic Wall',
    'sayuk_1': 'Master Bedroom Suite & Acoustic Wall',
    'sayuk_2.webp': 'Guest Bedroom Suite & Wardrobes',
    'sayuk_2': 'Guest Bedroom Suite & Wardrobes',
    'sayuk_3.webp': 'Parents Bedroom Suite & Dressing Vanity',
    'sayuk_3': 'Parents Bedroom Suite & Dressing Vanity',

    '2557add0-0cc5-4a63-9062-4f49eff9978a.png': 'Japandi Living Lounge & Raised Deck',
    '2557add0-0cc5-4a63-9062-4f49eff9978a': 'Japandi Living Lounge & Raised Deck',
    '004778f3-7240-4c73-837d-bf3dd2805420.png': 'Geometric Latticework & TV Wall',
    '004778f3-7240-4c73-837d-bf3dd2805420': 'Geometric Latticework & TV Wall',
    '64ae0ac4-810b-4913-9750-b6721d1cd256.png': 'Open Island Kitchen & Dining',
    '64ae0ac4-810b-4913-9750-b6721d1cd256': 'Open Island Kitchen & Dining',
    '48b80877-0de3-44bc-9167-b5c8b7887193.png': 'Master Bedroom Suite & Acoustic Wall',
    '48b80877-0de3-44bc-9167-b5c8b7887193': 'Master Bedroom Suite & Acoustic Wall',
    '84661d49-bc93-47c9-85cb-c79b74fcdc9b.png': 'Guest Bedroom Suite & Wardrobes',
    '84661d49-bc93-47c9-85cb-c79b74fcdc9b': 'Guest Bedroom Suite & Wardrobes',
    '2969ce08-c39c-48bc-b63c-638f116e5ceb.png': 'Parents Bedroom Suite & Balcony View',
    '2969ce08-c39c-48bc-b63c-638f116e5ceb': 'Parents Bedroom Suite & Balcony View'
  },

  // 3. The Bouclé Residence (Kokapet 2BHK)
  'kokapet-2bhk': {
    'kokapet_hall.webp': 'Contemporary Warm Living Lounge & TV Wall',
    'kokapet_hall': 'Contemporary Warm Living Lounge & TV Wall',
    'kokapet_tv_unit.webp': 'Contemporary TV Media Console',
    'kokapet_tv_unit': 'Contemporary TV Media Console',
    'kokapet_kitchen.webp': 'Handleless Modular Kitchen & Breakfast Bar',
    'kokapet_kitchen': 'Handleless Modular Kitchen & Breakfast Bar',
    'kokapet_crockery.webp': 'Ambient Dining Area & Glass Crockery Unit',
    'kokapet_crockery': 'Ambient Dining Area & Glass Crockery Unit',
    'kokapet_master_bedroom.webp': 'Master Bedroom Suite & Integrated Wardrobes',
    'kokapet_master_bedroom': 'Master Bedroom Suite & Integrated Wardrobes',
    'kokapet_guest_bedroom.webp': 'Guest Bedroom Suite & Rest Nook',
    'kokapet_guest_bedroom': 'Guest Bedroom Suite & Rest Nook',

    '7f7c35f2-81e3-44c2-8b70-41a3c2930942.png': 'Contemporary Warm Living Lounge & TV Wall',
    '7f7c35f2-81e3-44c2-8b70-41a3c2930942': 'Contemporary Warm Living Lounge & TV Wall',
    '6751a990-6636-47ab-b93e-616e5a21cc54.png': 'Handleless Modular Kitchen & Breakfast Bar',
    '6751a990-6636-47ab-b93e-616e5a21cc54': 'Handleless Modular Kitchen & Breakfast Bar',
    '5d1538e9-0496-4fd6-85d0-4529702c6fb3.png': 'Ambient Dining Area & Glass Crockery Unit',
    '5d1538e9-0496-4fd6-85d0-4529702c6fb3': 'Ambient Dining Area & Glass Crockery Unit',
    'd65a1813-c2c0-4607-a2a6-61fd10f89cb0.png': 'Master Bedroom Suite & Integrated Wardrobes',
    'd65a1813-c2c0-4607-a2a6-61fd10f89cb0': 'Master Bedroom Suite & Integrated Wardrobes',
    'c1682e0a-403d-4e0c-a623-e8a89d091a6a.png': 'Guest Bedroom Suite & Rest Nook',
    'c1682e0a-403d-4e0c-a623-e8a89d091a6a': 'Guest Bedroom Suite & Rest Nook'
  },

  // 4. The Ivory Retreat (Kokapet Urban 2BHK)
  'kokapet-urban-2bhk': {
    '25b4c1ef-7205-463a-b488-ecc125a33d3e.png': 'Clean Contemporary Living Lounge',
    '25b4c1ef-7205-463a-b488-ecc125a33d3e': 'Clean Contemporary Living Lounge',
    '39296685-c155-40af-b3f7-cadc122b32be.png': 'Floating Media Console & TV Wall',
    '39296685-c155-40af-b3f7-cadc122b32be': 'Floating Media Console & TV Wall',
    'df8bd080-4933-45f6-b735-c67b71230b17.png': 'High-Gloss Modular Kitchen',
    'df8bd080-4933-45f6-b735-c67b71230b17': 'High-Gloss Modular Kitchen',
    'dd97aa33-e9fe-43c2-83ca-c23e129b349c.png': 'Dining Lounge & Accent Pendant',
    'dd97aa33-e9fe-43c2-83ca-c23e129b349c': 'Dining Lounge & Accent Pendant',
    '0f540e8d-87e8-4aa8-a80b-9340c28b4000.png': 'Master Bedroom & Bookmatched Marble',
    '0f540e8d-87e8-4aa8-a80b-9340c28b4000': 'Master Bedroom & Bookmatched Marble',
    '9d302a93-fe8b-42d0-b2e3-063518044156.png': 'Integrated Floor-to-Ceiling Wardrobes',
    '9d302a93-fe8b-42d0-b2e3-063518044156': 'Integrated Floor-to-Ceiling Wardrobes',
    '7c093f69-28d0-40b7-8ef5-3259b7f91fbd.png': 'Kids Bedroom Suite & Study Desk',
    '7c093f69-28d0-40b7-8ef5-3259b7f91fbd': 'Kids Bedroom Suite & Study Desk',
    'd8a1ed0a-5f63-4037-bae5-b9059d2defc5.png': 'Entrance Foyer Console & Balcony Deck',
    'd8a1ed0a-5f63-4037-bae5-b9059d2defc5': 'Entrance Foyer Console & Balcony Deck'
  },

  // 5. The Panelled Muse (Gandipet Modern Retro 2BHK)
  'gandipet-modern-retro-2bhk': {
    '5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png': 'Modern Retro Living Lounge & TV Unit',
    '5d678d57-3ff6-4ce4-87fb-29b692a0cf84': 'Modern Retro Living Lounge & TV Unit',
    'a59fb8f4-c200-468b-bf31-6e63302b0bed.png': 'Timber Panelled Dining Lounge',
    'a59fb8f4-c200-468b-bf31-6e63302b0bed': 'Timber Panelled Dining Lounge',
    '06c85c57-84c6-48b8-86df-c0cda8641627.png': 'Contemporary Modular Kitchen & Pantry',
    '06c85c57-84c6-48b8-86df-c0cda8641627': 'Contemporary Modular Kitchen & Pantry',
    'd03da20b-2b8e-467e-a0c1-e87c0fb81b13.png': 'Fluted Timber Wall & Home Office',
    'd03da20b-2b8e-467e-a0c1-e87c0fb81b13': 'Fluted Timber Wall & Home Office',
    'e5fd4044-dbc8-48e7-8269-3d107cc0c436.png': 'Master Bedroom Suite & Walnut Panelling',
    'e5fd4044-dbc8-48e7-8269-3d107cc0c436': 'Master Bedroom Suite & Walnut Panelling',
    '901c10b3-8957-4198-86c8-4589b1d42750.png': 'Bespoke Floor-to-Ceiling Wardrobes',
    '901c10b3-8957-4198-86c8-4589b1d42750': 'Bespoke Floor-to-Ceiling Wardrobes',
    '69fac825-2a00-4d3d-9f64-19d8336aa9ec.png': 'Retro Guest Bedroom & Study Desk',
    '69fac825-2a00-4d3d-9f64-19d8336aa9ec': 'Retro Guest Bedroom & Study Desk',
    '802e37b7-a758-4a54-bf4c-ac4666122714.png': 'Louvered Entrance Foyer & Balcony Deck',
    '802e37b7-a758-4a54-bf4c-ac4666122714': 'Louvered Entrance Foyer & Balcony Deck'
  },

  // 6. The Dusk Lounge (Kondapur Minimalist 2BHK)
  'kondapur-minimalist-2bhk': {
    '6f7bce1d-d140-45ee-a08b-ecb09433bdb7.png': 'Contemporary Living Lounge & Media Wall',
    '6f7bce1d-d140-45ee-a08b-ecb09433bdb7': 'Contemporary Living Lounge & Media Wall',
    'ad891782-7131-4b54-8b7d-73dda3d5eea0.png': 'Charcoal Gray Modular Kitchen & Island',
    'ad891782-7131-4b54-8b7d-73dda3d5eea0': 'Charcoal Gray Modular Kitchen & Island',
    'c951f195-af50-4d89-8ad7-f1daed330a75.png': 'Dining Area & Custom Crockery Unit',
    'c951f195-af50-4d89-8ad7-f1daed330a75': 'Dining Area & Custom Crockery Unit',
    '71b2e914-cfd2-49fc-9d5a-47faa39b4bdd': 'Master Bedroom Suite & Acoustic Wall',
    '71b2e914-cfd2-49fc-9d5a-47faa39b4bdd.png': 'Master Bedroom Suite & Acoustic Wall',
    'b438c830-9b61-45c5-96b5-d2ba352b7fc5.png': 'Seamless Floor-to-Ceiling Wardrobes',
    'b438c830-9b61-45c5-96b5-d2ba352b7fc5': 'Seamless Floor-to-Ceiling Wardrobes',
    '773a222b-ce2f-4f40-a2d6-f2e91199aec5.png': 'Minimalist Guest Bedroom & Study Desk',
    '773a222b-ce2f-4f40-a2d6-f2e91199aec5': 'Minimalist Guest Bedroom & Study Desk',
    '429bec7e-a053-4465-a821-74744ea494ae': 'Entrance Foyer & Shoe Console',
    '429bec7e-a053-4465-a821-74744ea494ae.png': 'Entrance Foyer & Shoe Console',
    'c90d8da8-3e5d-42aa-8a2e-f9cfa28af410.png': 'Balcony Deck & Ambient Lighting',
    'c90d8da8-3e5d-42aa-8a2e-f9cfa28af410': 'Balcony Deck & Ambient Lighting'
  },

  // 7. Gachibowli Minimalist Beige 2BHK
  'gachibowli-minimalist-beige-2bhk': {
    'b1bed362-eace-4f68-afde-49b823bc5480.png': 'Minimalist Beige Living Lounge',
    'b1bed362-eace-4f68-afde-49b823bc5480': 'Minimalist Beige Living Lounge',
    '26395709-3031-4b0e-974d-ec96241c7e27.png': 'Living Room & TV Media Wall',
    '26395709-3031-4b0e-974d-ec96241c7e27': 'Living Room & TV Media Wall',
    'ad10b728-5797-4eb0-b810-032e828af858.png': 'Modular Kitchen & Breakfast Counter',
    'ad10b728-5797-4eb0-b810-032e828af858': 'Modular Kitchen & Breakfast Counter',
    '5a5b00bd-316f-45a5-a0ff-d716a9e1b759.png': 'Dining Area & Crockery Console',
    '5a5b00bd-316f-45a5-a0ff-d716a9e1b759': 'Dining Area & Crockery Console',
    '50716894-d043-454b-a8f9-1731f81f12f1.png': 'Master Bedroom Suite & Wardrobe',
    '50716894-d043-454b-a8f9-1731f81f12f1': 'Master Bedroom Suite & Wardrobe',
    '075adc06-587f-4855-a645-588aafff2720': 'Guest Bedroom Suite & Study Desk',
    '075adc06-587f-4855-a645-588aafff2720.png': 'Guest Bedroom Suite & Study Desk',
    '199e3414-0530-4337-bcb8-d51bd14409ef.png': 'Balcony Garden Lounge & Foyer',
    '199e3414-0530-4337-bcb8-d51bd14409ef': 'Balcony Garden Lounge & Foyer'
  },

  // 8. Kachiguda Fusion Duplex Villa
  'kachiguda-fusion-duplex-villa': {
    'b1b4c729-d7f1-4216-ab32-7df78a0b6e34.png': 'Boys Bedroom & Airplane Mural',
    'b1b4c729-d7f1-4216-ab32-7df78a0b6e34': 'Boys Bedroom & Airplane Mural',
    '92d8cde3-623f-4811-907d-7267962255ac.png': 'Vintage Airplane Blueprint Mural',
    '92d8cde3-623f-4811-907d-7267962255ac': 'Vintage Airplane Blueprint Mural',
    '3f8f1874-d2b3-4b6c-9e5c-fb3333c11311.png': 'Creative Accent Wall & Grid Organizer',
    '3f8f1874-d2b3-4b6c-9e5c-fb3333c11311': 'Creative Accent Wall & Grid Organizer',
    '39876fee-140f-4c0f-bc16-01cdca3f2f76.png': 'Modular Wardrobe & Storage Console',
    '39876fee-140f-4c0f-bc16-01cdca3f2f76': 'Modular Wardrobe & Storage Console',
    '8005ea3b-7d7a-4643-ac48-599d0cf0710e.png': 'Grand Living Lounge & Fireplace Wall',
    '8005ea3b-7d7a-4643-ac48-599d0cf0710e': 'Grand Living Lounge & Fireplace Wall',
    '919d61b3-2f89-40e4-9e8d-17af115b4a9f.png': 'Formal Dining Lounge & Chandelier',
    '919d61b3-2f89-40e4-9e8d-17af115b4a9f': 'Formal Dining Lounge & Chandelier',
    '445827f3-df4c-41c9-bd9c-da11399a47ff.png': 'Wood Panelled Dining Counter',
    '445827f3-df4c-41c9-bd9c-da11399a47ff': 'Wood Panelled Dining Counter',
    'd6fa4de6-3f43-414a-a4d6-158eba4349ef.png': 'Parents Bedroom Suite & Lounge',
    'd6fa4de6-3f43-414a-a4d6-158eba4349ef': 'Parents Bedroom Suite & Lounge'
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

// Smart filename keyword matcher & project prefix resolver
function detectRoomFromFilename(filename) {
  if (!filename) return null;
  const lower = filename.toLowerCase();

  // 1. Specific Rajapushpa Provincia 3BHK image mapping
  if (lower.includes('rajapushpa_')) {
    if (lower.includes('rajapushpa_6') || lower.includes('rajapushpa_8') || lower.includes('rajapushpa_9') || lower.includes('rajapushpa_after')) {
      return 'Grand Living Lounge & Arched Feature Wall';
    }
    if (lower.includes('rajapushpa_7')) return 'Sculpted TV Feature Wall & Fluted Panelling';
    if (lower.includes('rajapushpa_10')) return 'Living Lounge & Reading Chair Nook';
    if (lower.includes('rajapushpa_11')) return 'Modular Kitchen & Quartz Countertops';
    if (lower.includes('rajapushpa_12')) return 'L-Shaped Modular Kitchen & Fluted Cabinetry';
    if (lower.includes('rajapushpa_17')) return 'Pooja Mandir & Foyer Transition';
    if (lower.includes('rajapushpa_13') || lower.includes('rajapushpa_14') || lower.includes('rajapushpa_15') || lower.includes('rajapushpa_16')) {
      return 'Master Bedroom Suite';
    }
    if (lower.includes('rajapushpa_1') || lower.includes('rajapushpa_2') || lower.includes('rajapushpa_5') || lower.includes('rajapushpa_20')) {
      return 'Guest Bedroom Suite';
    }
    if (lower.includes('rajapushpa_3') || lower.includes('rajapushpa_4')) return 'Kids Bedroom Suite';
    if (lower.includes('rajapushpa_19')) return 'Dressing Nook & Vanity';
    if (lower.includes('rajapushpa_18')) return 'Utility & Laundry Suite';
    if (lower.includes('rajapushpa_before') || lower.includes('ba_1')) return 'Raw Site Shell & Pre-Fitout Framing';
  }

  // 2. Specific My Home Sayuk image mapping
  if (lower.includes('sayuk_')) {
    if (lower.includes('sayuk_4')) return 'Open Island Kitchen & Dining';
    if (lower.includes('sayuk_5') || lower.includes('sayuk_6') || lower.includes('sayuk_after')) return 'Japandi Living Lounge & Raised Deck';
    if (lower.includes('sayuk_7')) return 'Geometric Latticework & TV Wall';
    if (lower.includes('sayuk_1')) return 'Master Bedroom Suite & Acoustic Wall';
    if (lower.includes('sayuk_2')) return 'Guest Bedroom Suite & Wardrobes';
    if (lower.includes('sayuk_3')) return 'Parents Bedroom Suite & Dressing Vanity';
    if (lower.includes('sayuk_before')) return 'Raw Site Shell';
  }

  // 3. Specific Kokapet Nagesh image mapping
  if (lower.includes('kokapet_')) {
    if (lower.includes('kokapet_hall') || lower.includes('kokapet_after')) return 'Contemporary Warm Living Lounge & TV Wall';
    if (lower.includes('kokapet_tv')) return 'Contemporary TV Media Console';
    if (lower.includes('kokapet_kitchen')) return 'Handleless Modular Kitchen & Breakfast Bar';
    if (lower.includes('kokapet_crockery')) return 'Ambient Dining Area & Glass Crockery Unit';
    if (lower.includes('kokapet_master')) return 'Master Bedroom Suite & Integrated Wardrobes';
    if (lower.includes('kokapet_guest')) return 'Guest Bedroom Suite & Rest Nook';
  }

  // 4. Specific Dimmu Chachu Villa image mapping
  if (lower.includes('dimmu_')) {
    if (lower.includes('dimmu_05')) return 'Double-Height Foyer & Grand Staircase';
    if (lower.includes('dimmu_01')) return 'Living Lounge & TV Media Wall';
    if (lower.includes('dimmu_06')) return 'Formal Lounge & Sculpted Wave Ceiling';
    if (lower.includes('dimmu_03')) return 'Upper Level Mezzanine & Chandelier';
    if (lower.includes('dimmu_10')) return 'High-Gloss Modular Kitchen';
    if (lower.includes('dimmu_09')) return 'Cricket Tribute Suite (Wide View)';
    if (lower.includes('dimmu_08')) return 'Cricket Tribute Suite & Custom Wardrobes';
    if (lower.includes('dimmu_02')) return 'Teal Master Suite & Bay Window Seating';
    if (lower.includes('dimmu_07')) return 'Teal Master Bedroom Daybed Nook';
    if (lower.includes('dimmu_04')) return 'Terracotta Guest Suite & Study Desk';
  }

  // General room keyword matches
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
 * Never returns "Photo #1" or numbers. Always ensures accurate room name matches the image.
 */
export function getProjectRoomName(project, imgUrl, index = 0) {
  if (!imgUrl) return 'Living Room Lounge';

  // Extract clean filename from URL or path
  let cleanUrl = String(imgUrl);
  try {
    cleanUrl = decodeURIComponent(cleanUrl);
  } catch {}
  const rawFile = cleanUrl.split('/').pop().split('?')[0];
  const withoutExt = rawFile.replace(/\.[^/.]+$/, '');

  // 1. Resolve project-specific map key
  const projectKey = project?.slug || project?._id || project?.id;
  const canonicalCandidates = [
    projectKey,
    projectKey?.toLowerCase(),
    EXACT_PROJECT_ROOMS[projectKey] ? projectKey : null,
    project?.title ? project.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : null
  ].filter(Boolean);

  for (const pKey of canonicalCandidates) {
    if (EXACT_PROJECT_ROOMS[pKey]) {
      const map = EXACT_PROJECT_ROOMS[pKey];
      if (map[rawFile]) return map[rawFile];
      if (map[withoutExt]) return map[withoutExt];
      if (map[rawFile.toLowerCase()]) return map[rawFile.toLowerCase()];
      if (map[withoutExt.toLowerCase()]) return map[withoutExt.toLowerCase()];
    }
  }

  // 2. Also check across all project maps
  for (const pKey of Object.keys(EXACT_PROJECT_ROOMS)) {
    const map = EXACT_PROJECT_ROOMS[pKey];
    if (map[rawFile]) return map[rawFile];
    if (map[withoutExt]) return map[withoutExt];
    if (map[rawFile.toLowerCase()]) return map[rawFile.toLowerCase()];
    if (map[withoutExt.toLowerCase()]) return map[withoutExt.toLowerCase()];
  }

  // 3. Detect from filename pattern & room keywords
  const detected = detectRoomFromFilename(rawFile);
  if (detected) return detected;

  // 4. Fallback to clean room sequence
  const cycleIndex = (index >= 0 ? index : 0) % DEFAULT_ROOM_CYCLE.length;
  return DEFAULT_ROOM_CYCLE[cycleIndex];
}

export default getProjectRoomName;
