// Project Gallery Room Names Mapping & Resolution
// Replaces generic "Photo #1", "Photo #2" with authentic, luxury room titles

const EXACT_PROJECT_ROOMS = {
  // 1. The Arcstone Residence, Narsingi
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

    // Cloudinary Asset Hashes for Arcstone (Narsingi)
    'zvqkqqkpa6fdfojtaxxb.jpg': 'Grand Living Lounge & Arched Feature Wall',
    'zvqkqqkpa6fdfojtaxxb': 'Grand Living Lounge & Arched Feature Wall',
    'arcstone_narsingi_hall_main': 'Grand Living Lounge & Arched Feature Wall',
    'neljy4tkjufc3e2qm7oq.jpg': 'Living Lounge & Arched Feature Nook',
    'neljy4tkjufc3e2qm7oq': 'Living Lounge & Arched Feature Nook',
    'arcstone_narsingi_hall_2': 'Living Lounge & Arched Feature Nook',
    'loml95jqkz3mzvbr3z5g.jpg': 'Sculpted TV Media Wall & Fluted Panelling',
    'loml95jqkz3mzvbr3z5g': 'Sculpted TV Media Wall & Fluted Panelling',
    'arcstone_narsingi_hall_3': 'Sculpted TV Media Wall & Fluted Panelling',
    'boddxdbbkc3vvz1sccmn.jpg': 'Open Dining Area & Fluted Transition',
    'boddxdbbkc3vvz1sccmn': 'Open Dining Area & Fluted Transition',
    'arcstone_narsingi_hall_4': 'Open Dining Area & Fluted Transition',
    'koiive2gy5yw5rysfwcx.jpg': 'Living Lounge & Ambient Cove Lighting',
    'koiive2gy5yw5rysfwcx': 'Living Lounge & Ambient Cove Lighting',
    'arcstone_narsingi_hall_5': 'Living Lounge & Ambient Cove Lighting',
    'rublks3kk1u3skfbhbsb.jpg': 'Master Bedroom & Curved Feature Wall',
    'rublks3kk1u3skfbhbsb': 'Master Bedroom & Curved Feature Wall',
    'arcstone_narsingi_mbr_main': 'Master Bedroom & Curved Feature Wall',
    'uwnpmsvmh5atr54ma5ds.jpg': 'Master Suite with Chandelier & Glass Wardrobes',
    'uwnpmsvmh5atr54ma5ds': 'Master Suite with Chandelier & Glass Wardrobes',
    'arcstone_narsingi_mbr_2': 'Master Suite with Chandelier & Glass Wardrobes',
    'z4irutpzt2hw5qabd9cg.jpg': 'Master Suite Media Wall & Study Nook',
    'z4irutpzt2hw5qabd9cg': 'Master Suite Media Wall & Study Nook',
    'arcstone_narsingi_mbr_3': 'Master Suite Media Wall & Study Nook',
    'bnyefgrrc9mpjjen20tq.jpg': 'Master Bedroom Suite & Ambient Cove Lighting',
    'bnyefgrrc9mpjjen20tq': 'Master Bedroom Suite & Ambient Cove Lighting',
    'arcstone_narsingi_mbr_4': 'Master Bedroom Suite & Ambient Cove Lighting',
    'kuunw858ws3n2t4l88xa.jpg': 'Master Walk-In Wardrobe & Fluted Closets',
    'kuunw858ws3n2t4l88xa': 'Master Walk-In Wardrobe & Fluted Closets',
    'arcstone_narsingi_wic_main': 'Master Walk-In Wardrobe & Fluted Closets',
    'l0l52jndy37r67ld9dfl.jpg': 'Walk-In Wardrobe & Dressing Vanity',
    'l0l52jndy37r67ld9dfl': 'Walk-In Wardrobe & Dressing Vanity',
    'arcstone_narsingi_wic_2': 'Walk-In Wardrobe & Dressing Vanity',
    'nbvmn4dsrozpqpoaslf0.jpg': 'Modular Kitchen & Quartz Countertops',
    'nbvmn4dsrozpqpoaslf0': 'Modular Kitchen & Quartz Countertops',
    'arcstone_narsingi_kitchen_main': 'Modular Kitchen & Quartz Countertops',
    'vavkk9wt57fqv5uu1du1.jpg': 'L-Shaped Modular Kitchen & Fluted Cabinetry',
    'vavkk9wt57fqv5uu1du1': 'L-Shaped Modular Kitchen & Fluted Cabinetry',
    'arcstone_narsingi_kitchen_2': 'L-Shaped Modular Kitchen & Fluted Cabinetry',
    'sidf1hbm5mcum6plj4lc.jpg': 'Pooja Mandir & Foyer Transition',
    'sidf1hbm5mcum6plj4lc': 'Pooja Mandir & Foyer Transition',
    'arcstone_narsingi_puja_main': 'Pooja Mandir & Foyer Transition',
    'cldydk0ev0l4qejfq9on.jpg': 'Guest Bedroom Suite & Arched Wall Accents',
    'cldydk0ev0l4qejfq9on': 'Guest Bedroom Suite & Arched Wall Accents',
    'arcstone_narsingi_gbr_main': 'Guest Bedroom Suite & Arched Wall Accents',
    'ivclestyrevc8fsj3adp.jpg': 'Guest Bedroom Suite & Backlit Headboard',
    'ivclestyrevc8fsj3adp': 'Guest Bedroom Suite & Backlit Headboard',
    'arcstone_narsingi_gbr_2': 'Guest Bedroom Suite & Backlit Headboard',
    'jcm4du0ewbdu1mdnhzgv.jpg': 'Guest Dressing Vanity & Wardrobes',
    'jcm4du0ewbdu1mdnhzgv': 'Guest Dressing Vanity & Wardrobes',
    'arcstone_narsingi_gbr_3': 'Guest Dressing Vanity & Wardrobes',
    'p4gnc1zdgif0gngtqtro.jpg': 'Kids Bedroom Suite & Custom Headboard',
    'p4gnc1zdgif0gngtqtro': 'Kids Bedroom Suite & Custom Headboard',
    'arcstone_narsingi_bedroom_main': 'Kids Bedroom Suite & Custom Headboard',
    'xq85mtynhjvlp1tpvtld.jpg': 'Kids Bedroom Wardrobes & Study Desk',
    'xq85mtynhjvlp1tpvtld': 'Kids Bedroom Wardrobes & Study Desk',
    'arcstone_narsingi_bedroom_2': 'Kids Bedroom Wardrobes & Study Desk',
    'oofymnichjtynx4yrhzk.jpg': 'Utility & Laundry Suite',
    'oofymnichjtynx4yrhzk': 'Utility & Laundry Suite',
    'arcstone_narsingi_utility': 'Utility & Laundry Suite',

    // Cloudinary Asset Hashes for Arcstone (Legacy)
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
    'zcpjoiltra0js8hgh0om.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'zcpjoiltra0js8hgh0om': 'Raw Site Shell & Pre-Fitout Framing',
    'arcstone_narsingi_before_uhd_4k': 'Raw Site Shell & Pre-Fitout Framing',
    'r3g4jtdojchqkqvmlmgm.jpg': 'Luxury Suite Wardrobes & Fluted Dressing Vanity',
    'r3g4jtdojchqkqvmlmgm': 'Luxury Suite Wardrobes & Fluted Dressing Vanity',
    'arcstone_narsingi_after_uhd_4k': 'Luxury Suite Wardrobes & Fluted Dressing Vanity',
    'gmbbvqghe69pjdqdnxxy.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'gmbbvqghe69pjdqdnxxy': 'Raw Site Shell & Pre-Fitout Framing',
    'iv1psdr5b26t4kqynn3h.png': 'Luxury Suite Wardrobes & Fluted Dressing Vanity',
    'iv1psdr5b26t4kqynn3h': 'Luxury Suite Wardrobes & Fluted Dressing Vanity',
    'arcstone_narsingi_wardrobe_after': 'Luxury Suite Wardrobes & Fluted Dressing Vanity',
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
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051301/espacio_gallery/jydtlxt9xagokmv8cnuu.jpg': 'Clean Contemporary Living Lounge & Floating TV Console',
    'jydtlxt9xagokmv8cnuu': 'Clean Contemporary Living Lounge & Floating TV Console',
    'jydtlxt9xagokmv8cnuu.jpg': 'Clean Contemporary Living Lounge & Floating TV Console',
    'jydtlxt9xagokmv8cnuu.png': 'Clean Contemporary Living Lounge & Floating TV Console',
    'rahul_gallery_1.webp': 'Clean Contemporary Living Lounge & Floating TV Console',
    'rahul_gallery_1': 'Clean Contemporary Living Lounge & Floating TV Console',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051301/espacio_gallery/qozg8gen0pnh1k9kxryr.jpg': 'Master Bedroom Suite & Bookmatched Marble Wall',
    'qozg8gen0pnh1k9kxryr': 'Master Bedroom Suite & Bookmatched Marble Wall',
    'qozg8gen0pnh1k9kxryr.jpg': 'Master Bedroom Suite & Bookmatched Marble Wall',
    'qozg8gen0pnh1k9kxryr.png': 'Master Bedroom Suite & Bookmatched Marble Wall',
    'rahul_gallery_2.webp': 'Master Bedroom Suite & Bookmatched Marble Wall',
    'rahul_gallery_2': 'Master Bedroom Suite & Bookmatched Marble Wall',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051302/espacio_gallery/b2hyi3o44yobnzzynbfa.jpg': 'Designer Sectional Lounge & Marble Coffee Table',
    'b2hyi3o44yobnzzynbfa': 'Designer Sectional Lounge & Marble Coffee Table',
    'b2hyi3o44yobnzzynbfa.jpg': 'Designer Sectional Lounge & Marble Coffee Table',
    'b2hyi3o44yobnzzynbfa.png': 'Designer Sectional Lounge & Marble Coffee Table',
    'rahul_gallery_3.webp': 'Designer Sectional Lounge & Marble Coffee Table',
    'rahul_gallery_3': 'Designer Sectional Lounge & Marble Coffee Table',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051304/espacio_gallery/gt8aknxvw1e9v2dywgzi.jpg': 'Dining Suite & Backlit Marble Ganesha Shrine',
    'gt8aknxvw1e9v2dywgzi': 'Dining Suite & Backlit Marble Ganesha Shrine',
    'gt8aknxvw1e9v2dywgzi.jpg': 'Dining Suite & Backlit Marble Ganesha Shrine',
    'gt8aknxvw1e9v2dywgzi.png': 'Dining Suite & Backlit Marble Ganesha Shrine',
    'rahul_gallery_4.webp': 'Dining Suite & Backlit Marble Ganesha Shrine',
    'rahul_gallery_4': 'Dining Suite & Backlit Marble Ganesha Shrine',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051305/espacio_gallery/yocbcbuycsysstbt8j6k.jpg': 'Contemporary Modular Kitchen & Breakfast Counter',
    'yocbcbuycsysstbt8j6k': 'Contemporary Modular Kitchen & Breakfast Counter',
    'yocbcbuycsysstbt8j6k.jpg': 'Contemporary Modular Kitchen & Breakfast Counter',
    'yocbcbuycsysstbt8j6k.png': 'Contemporary Modular Kitchen & Breakfast Counter',
    'rahul_gallery_5.webp': 'Contemporary Modular Kitchen & Breakfast Counter',
    'rahul_gallery_5': 'Contemporary Modular Kitchen & Breakfast Counter',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051307/espacio_gallery/xeip5cg3agnlqw7rtymo.jpg': 'Living Room Panorama & Natural Light Vistas',
    'xeip5cg3agnlqw7rtymo': 'Living Room Panorama & Natural Light Vistas',
    'xeip5cg3agnlqw7rtymo.jpg': 'Living Room Panorama & Natural Light Vistas',
    'xeip5cg3agnlqw7rtymo.png': 'Living Room Panorama & Natural Light Vistas',
    'rahul_gallery_6.webp': 'Living Room Panorama & Natural Light Vistas',
    'rahul_gallery_6': 'Living Room Panorama & Natural Light Vistas',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051308/espacio_gallery/pkitdbjvwmh506kgt7r3.jpg': 'Master Suite Symmetry & Halo LED Illumination',
    'pkitdbjvwmh506kgt7r3': 'Master Suite Symmetry & Halo LED Illumination',
    'pkitdbjvwmh506kgt7r3.jpg': 'Master Suite Symmetry & Halo LED Illumination',
    'pkitdbjvwmh506kgt7r3.png': 'Master Suite Symmetry & Halo LED Illumination',
    'rahul_gallery_7.webp': 'Master Suite Symmetry & Halo LED Illumination',
    'rahul_gallery_7': 'Master Suite Symmetry & Halo LED Illumination',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051309/espacio_gallery/kxktcafgsng7vp2ktavy.jpg': 'Celestial Kids Bedroom & Handcrafted Cosmic Mural',
    'kxktcafgsng7vp2ktavy': 'Celestial Kids Bedroom & Handcrafted Cosmic Mural',
    'kxktcafgsng7vp2ktavy.jpg': 'Celestial Kids Bedroom & Handcrafted Cosmic Mural',
    'kxktcafgsng7vp2ktavy.png': 'Celestial Kids Bedroom & Handcrafted Cosmic Mural',
    'rahul_gallery_8.webp': 'Celestial Kids Bedroom & Handcrafted Cosmic Mural',
    'rahul_gallery_8': 'Celestial Kids Bedroom & Handcrafted Cosmic Mural',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051311/espacio_gallery/pimunyc8yfinkwkojz4h.jpg': 'Foyer Art Console & Brass Ginkgo Wall Decor',
    'pimunyc8yfinkwkojz4h': 'Foyer Art Console & Brass Ginkgo Wall Decor',
    'pimunyc8yfinkwkojz4h.jpg': 'Foyer Art Console & Brass Ginkgo Wall Decor',
    'pimunyc8yfinkwkojz4h.png': 'Foyer Art Console & Brass Ginkgo Wall Decor',
    'rahul_gallery_9.webp': 'Foyer Art Console & Brass Ginkgo Wall Decor',
    'rahul_gallery_9': 'Foyer Art Console & Brass Ginkgo Wall Decor',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051312/espacio_gallery/etchqkf6qf76ppnikq27.jpg': 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents',
    'etchqkf6qf76ppnikq27': 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents',
    'etchqkf6qf76ppnikq27.jpg': 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents',
    'etchqkf6qf76ppnikq27.png': 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents',
    'rahul_gallery_10.webp': 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents',
    'rahul_gallery_10': 'Sanctum Pooja Mandir with Laser-Cut Om & Swastik Accents',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051313/espacio_gallery/tg1eyyafstazwm617ogh.jpg': 'Master Suite Integrated PC Workstation & Wardrobe',
    'tg1eyyafstazwm617ogh': 'Master Suite Integrated PC Workstation & Wardrobe',
    'tg1eyyafstazwm617ogh.jpg': 'Master Suite Integrated PC Workstation & Wardrobe',
    'tg1eyyafstazwm617ogh.png': 'Master Suite Integrated PC Workstation & Wardrobe',
    'rahul_gallery_11.webp': 'Master Suite Integrated PC Workstation & Wardrobe',
    'rahul_gallery_11': 'Master Suite Integrated PC Workstation & Wardrobe',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051314/espacio_gallery/q1tagfvgfazx3db03snx.jpg': 'Designer Powder Vanity & Vertical Fluted Panelling',
    'q1tagfvgfazx3db03snx': 'Designer Powder Vanity & Vertical Fluted Panelling',
    'q1tagfvgfazx3db03snx.jpg': 'Designer Powder Vanity & Vertical Fluted Panelling',
    'q1tagfvgfazx3db03snx.png': 'Designer Powder Vanity & Vertical Fluted Panelling',
    'rahul_gallery_12.webp': 'Designer Powder Vanity & Vertical Fluted Panelling',
    'rahul_gallery_12': 'Designer Powder Vanity & Vertical Fluted Panelling',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051315/espacio_gallery/z8fr3mynv9jd6whbpjnc.jpg': 'Kids Bedroom Bay Window Seating & Built-in Storage',
    'z8fr3mynv9jd6whbpjnc': 'Kids Bedroom Bay Window Seating & Built-in Storage',
    'z8fr3mynv9jd6whbpjnc.jpg': 'Kids Bedroom Bay Window Seating & Built-in Storage',
    'z8fr3mynv9jd6whbpjnc.png': 'Kids Bedroom Bay Window Seating & Built-in Storage',
    'rahul_gallery_13.webp': 'Kids Bedroom Bay Window Seating & Built-in Storage',
    'rahul_gallery_13': 'Kids Bedroom Bay Window Seating & Built-in Storage',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051316/espacio_gallery/ymnore8wmb7pt2w8qfet.jpg': 'Master Bedroom Dressing Mirror & Floating Vanity',
    'ymnore8wmb7pt2w8qfet': 'Master Bedroom Dressing Mirror & Floating Vanity',
    'ymnore8wmb7pt2w8qfet.jpg': 'Master Bedroom Dressing Mirror & Floating Vanity',
    'ymnore8wmb7pt2w8qfet.png': 'Master Bedroom Dressing Mirror & Floating Vanity',
    'rahul_gallery_14.webp': 'Master Bedroom Dressing Mirror & Floating Vanity',
    'rahul_gallery_14': 'Master Bedroom Dressing Mirror & Floating Vanity',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051317/espacio_gallery/kkpzlguouw2l79qjvrw1.jpg': 'Space Explorer Bunk & Ambient Sconce Lighting',
    'kkpzlguouw2l79qjvrw1': 'Space Explorer Bunk & Ambient Sconce Lighting',
    'kkpzlguouw2l79qjvrw1.jpg': 'Space Explorer Bunk & Ambient Sconce Lighting',
    'kkpzlguouw2l79qjvrw1.png': 'Space Explorer Bunk & Ambient Sconce Lighting',
    'rahul_gallery_15.webp': 'Space Explorer Bunk & Ambient Sconce Lighting',
    'rahul_gallery_15': 'Space Explorer Bunk & Ambient Sconce Lighting',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051318/espacio_gallery/vkggyxdeedvs9pyzcaua.jpg': 'Minimalist Study Desk & High-Gloss Display Ledge',
    'vkggyxdeedvs9pyzcaua': 'Minimalist Study Desk & High-Gloss Display Ledge',
    'vkggyxdeedvs9pyzcaua.jpg': 'Minimalist Study Desk & High-Gloss Display Ledge',
    'vkggyxdeedvs9pyzcaua.png': 'Minimalist Study Desk & High-Gloss Display Ledge',
    'rahul_gallery_16.webp': 'Minimalist Study Desk & High-Gloss Display Ledge',
    'rahul_gallery_16': 'Minimalist Study Desk & High-Gloss Display Ledge',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051318/espacio_gallery/bi1scw8zgrgpzlogtocr.jpg': 'Pooja Shrine Detail & Dual-Tier Marble Pedestal',
    'bi1scw8zgrgpzlogtocr': 'Pooja Shrine Detail & Dual-Tier Marble Pedestal',
    'bi1scw8zgrgpzlogtocr.jpg': 'Pooja Shrine Detail & Dual-Tier Marble Pedestal',
    'bi1scw8zgrgpzlogtocr.png': 'Pooja Shrine Detail & Dual-Tier Marble Pedestal',
    'rahul_gallery_17.webp': 'Pooja Shrine Detail & Dual-Tier Marble Pedestal',
    'rahul_gallery_17': 'Pooja Shrine Detail & Dual-Tier Marble Pedestal',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051319/espacio_gallery/y5gm9gljg6z3irlqthuh.jpg': 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation',
    'y5gm9gljg6z3irlqthuh': 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation',
    'y5gm9gljg6z3irlqthuh.jpg': 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation',
    'y5gm9gljg6z3irlqthuh.png': 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation',
    'rahul_gallery_18.webp': 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation',
    'rahul_gallery_18': 'Kids Bedroom Galaxy Headboard & Wardrobe Elevation',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051320/espacio_gallery/dljfie9qrl2k7tpoapwx.jpg': 'Washbasin Vanity & Architectural Mirror Nook',
    'dljfie9qrl2k7tpoapwx': 'Washbasin Vanity & Architectural Mirror Nook',
    'dljfie9qrl2k7tpoapwx.jpg': 'Washbasin Vanity & Architectural Mirror Nook',
    'dljfie9qrl2k7tpoapwx.png': 'Washbasin Vanity & Architectural Mirror Nook',
    'rahul_gallery_19.webp': 'Washbasin Vanity & Architectural Mirror Nook',
    'rahul_gallery_19': 'Washbasin Vanity & Architectural Mirror Nook',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051321/espacio_gallery/zpltgvn9y49gwqrqszd1.jpg': 'Study Nook Ergonomic Workspace',
    'zpltgvn9y49gwqrqszd1': 'Study Nook Ergonomic Workspace',
    'zpltgvn9y49gwqrqszd1.jpg': 'Study Nook Ergonomic Workspace',
    'zpltgvn9y49gwqrqszd1.png': 'Study Nook Ergonomic Workspace',
    'rahul_gallery_20.webp': 'Study Nook Ergonomic Workspace',
    'rahul_gallery_20': 'Study Nook Ergonomic Workspace',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051322/espacio_gallery/ihpleevkslgfnwpu68qf.jpg': 'Kids Space Suite Full Perspective',
    'ihpleevkslgfnwpu68qf': 'Kids Space Suite Full Perspective',
    'ihpleevkslgfnwpu68qf.jpg': 'Kids Space Suite Full Perspective',
    'ihpleevkslgfnwpu68qf.png': 'Kids Space Suite Full Perspective',
    'rahul_gallery_21.webp': 'Kids Space Suite Full Perspective',
    'rahul_gallery_21': 'Kids Space Suite Full Perspective',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051323/espacio_gallery/s7kdga1oz9ptcsowg8ob.jpg': 'Modular Kitchen Prep Zone & Stainless Cooktop',
    's7kdga1oz9ptcsowg8ob': 'Modular Kitchen Prep Zone & Stainless Cooktop',
    's7kdga1oz9ptcsowg8ob.jpg': 'Modular Kitchen Prep Zone & Stainless Cooktop',
    's7kdga1oz9ptcsowg8ob.png': 'Modular Kitchen Prep Zone & Stainless Cooktop',
    'rahul_gallery_22.webp': 'Modular Kitchen Prep Zone & Stainless Cooktop',
    'rahul_gallery_22': 'Modular Kitchen Prep Zone & Stainless Cooktop',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051323/espacio_gallery/jqb3agmc0quwlkygvb91.jpg': 'Kitchen Storage & Soft-Close Cutlery Drawers',
    'jqb3agmc0quwlkygvb91': 'Kitchen Storage & Soft-Close Cutlery Drawers',
    'jqb3agmc0quwlkygvb91.jpg': 'Kitchen Storage & Soft-Close Cutlery Drawers',
    'jqb3agmc0quwlkygvb91.png': 'Kitchen Storage & Soft-Close Cutlery Drawers',
    'rahul_gallery_23.webp': 'Kitchen Storage & Soft-Close Cutlery Drawers',
    'rahul_gallery_23': 'Kitchen Storage & Soft-Close Cutlery Drawers',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051325/espacio_gallery/rnpccbj0xacfbynmutqe.jpg': 'Kitchen Wall Units & Under-Cabinet Light Detail',
    'rnpccbj0xacfbynmutqe': 'Kitchen Wall Units & Under-Cabinet Light Detail',
    'rnpccbj0xacfbynmutqe.jpg': 'Kitchen Wall Units & Under-Cabinet Light Detail',
    'rnpccbj0xacfbynmutqe.png': 'Kitchen Wall Units & Under-Cabinet Light Detail',
    'rahul_gallery_24.webp': 'Kitchen Wall Units & Under-Cabinet Light Detail',
    'rahul_gallery_24': 'Kitchen Wall Units & Under-Cabinet Light Detail',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051326/espacio_gallery/im530k1ngrx02dhuqtt8.jpg': 'Breakfast Island Corner & Overhead Shelving',
    'im530k1ngrx02dhuqtt8': 'Breakfast Island Corner & Overhead Shelving',
    'im530k1ngrx02dhuqtt8.jpg': 'Breakfast Island Corner & Overhead Shelving',
    'im530k1ngrx02dhuqtt8.png': 'Breakfast Island Corner & Overhead Shelving',
    'rahul_gallery_25.webp': 'Breakfast Island Corner & Overhead Shelving',
    'rahul_gallery_25': 'Breakfast Island Corner & Overhead Shelving',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051326/espacio_gallery/i97d2c0pof4szdboir1x.jpg': 'Granite Countertop & Backsplash Detailing',
    'i97d2c0pof4szdboir1x': 'Granite Countertop & Backsplash Detailing',
    'i97d2c0pof4szdboir1x.jpg': 'Granite Countertop & Backsplash Detailing',
    'i97d2c0pof4szdboir1x.png': 'Granite Countertop & Backsplash Detailing',
    'rahul_gallery_26.webp': 'Granite Countertop & Backsplash Detailing',
    'rahul_gallery_26': 'Granite Countertop & Backsplash Detailing',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051327/espacio_gallery/dnrxn0epxezkfcby4zz1.jpg': 'Kids Bedroom Wardrobe Shutter Alignment',
    'dnrxn0epxezkfcby4zz1': 'Kids Bedroom Wardrobe Shutter Alignment',
    'dnrxn0epxezkfcby4zz1.jpg': 'Kids Bedroom Wardrobe Shutter Alignment',
    'dnrxn0epxezkfcby4zz1.png': 'Kids Bedroom Wardrobe Shutter Alignment',
    'rahul_gallery_27.webp': 'Kids Bedroom Wardrobe Shutter Alignment',
    'rahul_gallery_27': 'Kids Bedroom Wardrobe Shutter Alignment',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051328/espacio_gallery/nrpnwjy0usmclyfcvcvl.jpg': 'Kids Bedroom Perspective & Door Frame Fitout',
    'nrpnwjy0usmclyfcvcvl': 'Kids Bedroom Perspective & Door Frame Fitout',
    'nrpnwjy0usmclyfcvcvl.jpg': 'Kids Bedroom Perspective & Door Frame Fitout',
    'nrpnwjy0usmclyfcvcvl.png': 'Kids Bedroom Perspective & Door Frame Fitout',
    'rahul_gallery_28.webp': 'Kids Bedroom Perspective & Door Frame Fitout',
    'rahul_gallery_28': 'Kids Bedroom Perspective & Door Frame Fitout',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051330/espacio_gallery/re3wfqbpnwhdgs1934kk.jpg': 'Dining & Kitchen Transition Perspective',
    're3wfqbpnwhdgs1934kk': 'Dining & Kitchen Transition Perspective',
    're3wfqbpnwhdgs1934kk.jpg': 'Dining & Kitchen Transition Perspective',
    're3wfqbpnwhdgs1934kk.png': 'Dining & Kitchen Transition Perspective',
    'rahul_gallery_29.webp': 'Dining & Kitchen Transition Perspective',
    'rahul_gallery_29': 'Dining & Kitchen Transition Perspective',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791117122/espacio_gallery/zjc83xwzwjrijgnbto2z.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'zjc83xwzwjrijgnbto2z': 'Raw Site Shell & Pre-Fitout Framing',
    'zjc83xwzwjrijgnbto2z.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791051300/espacio_gallery/nslcfifkgxxmqncbouqz.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'nslcfifkgxxmqncbouqz': 'Raw Site Shell & Pre-Fitout Framing',
    'nslcfifkgxxmqncbouqz.jpg': 'Raw Site Shell & Pre-Fitout Framing',
    'rahul_before.webp': 'Raw Site Shell & Pre-Fitout Framing',
    'rahul_before': 'Raw Site Shell & Pre-Fitout Framing',
    'rahul_after.webp': 'Living Room Panorama & Natural Light Vistas',
    'rahul_after': 'Living Room Panorama & Natural Light Vistas',
  },

  // 5. The Panelled Muse (Gandipet Modern Retro 2BHK)
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

    // 8. Kachiguda Fusion Duplex Villa (K. Subba Rao - Exquisite Fusion of Modern & Desi in a 4BHK)
  'kachiguda-fusion-duplex-villa': {
    // Hero & Transformation
    'subbarao_hero.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'subbarao_hero': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'bqtmsst1w8jjit2drtmq.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'bqtmsst1w8jjit2drtmq': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'subbarao_after.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'subbarao_after': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'unbmruocdxxhcb4wvn7e.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'unbmruocdxxhcb4wvn7e': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'subbarao_before.webp': 'Raw Site Shell & Structural Framing',
    'subbarao_before': 'Raw Site Shell & Structural Framing',
    'blohvaxle28zo18l7lug.jpg': 'Raw Site Shell & Structural Framing',
    'blohvaxle28zo18l7lug': 'Raw Site Shell & Structural Framing',

    // 1. Grand Duplex Living Hall & Architectural Staircase Vista
    'subbarao_gallery_1.webp': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'subbarao_gallery_1': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'fjoq7ss31x85vjccgr5a.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'fjoq7ss31x85vjccgr5a': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'img_20_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_26-20260813-110616.jpg': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'img_20_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_26-20260813-110616': 'Grand Duplex Living Hall & Architectural Staircase Vista',
    'img_20_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_26-20260813-110616': 'Grand Duplex Living Hall & Architectural Staircase Vista',

    // 2. Living Lounge, Roaring Linear Fireplace & Media Tower
    'subbarao_gallery_2.webp': 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    'subbarao_gallery_2': 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    'u3jboyp6o3tqjy1zffvf.jpg': 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    'u3jboyp6o3tqjy1zffvf': 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    'img_14_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_15-20260813-110616.jpg': 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    'img_14_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_15-20260813-110616': 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    'img_14_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_15-20260813-110616': 'Living Lounge, Roaring Linear Fireplace & Media Tower',

    // 3. Open-Concept Duplex Living & Dining Transition
    'subbarao_gallery_3.webp': 'Open-Concept Duplex Living & Dining Transition',
    'subbarao_gallery_3': 'Open-Concept Duplex Living & Dining Transition',
    'yhbdhtzvtts6lbjcyvhb.jpg': 'Open-Concept Duplex Living & Dining Transition',
    'yhbdhtzvtts6lbjcyvhb': 'Open-Concept Duplex Living & Dining Transition',
    'img_18_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_23-20260813-110616.jpg': 'Open-Concept Duplex Living & Dining Transition',
    'img_18_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_23-20260813-110616': 'Open-Concept Duplex Living & Dining Transition',
    'img_18_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_23-20260813-110616': 'Open-Concept Duplex Living & Dining Transition',

    // 4. Living Lounge & KAWS Art Sculpture Nook
    'subbarao_gallery_4.webp': 'Living Lounge & KAWS Art Sculpture Nook',
    'subbarao_gallery_4': 'Living Lounge & KAWS Art Sculpture Nook',
    'lppkuofoaxacxbxjinf3.jpg': 'Living Lounge & KAWS Art Sculpture Nook',
    'lppkuofoaxacxbxjinf3': 'Living Lounge & KAWS Art Sculpture Nook',
    'img_16_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_21-20260813-110616.jpg': 'Living Lounge & KAWS Art Sculpture Nook',
    'img_16_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_21-20260813-110616': 'Living Lounge & KAWS Art Sculpture Nook',
    'img_16_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_21-20260813-110616': 'Living Lounge & KAWS Art Sculpture Nook',

    // 5. Living Lounge & Courtyard Picture Window
    'subbarao_gallery_5.webp': 'Living Lounge & Courtyard Picture Window',
    'subbarao_gallery_5': 'Living Lounge & Courtyard Picture Window',
    'ykmradholvjphbaimyso.jpg': 'Living Lounge & Courtyard Picture Window',
    'ykmradholvjphbaimyso': 'Living Lounge & Courtyard Picture Window',
    'img_17_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617.jpg': 'Living Lounge & Courtyard Picture Window',
    'img_17_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617': 'Living Lounge & Courtyard Picture Window',
    'img_17_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617': 'Living Lounge & Courtyard Picture Window',

    // 6. Dining Bar Island, Duplex Staircase & Kitchen Vista
    'subbarao_gallery_6.webp': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    'subbarao_gallery_6': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    'eaniagfydwjdgbo0esqn.jpg': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    'eaniagfydwjdgbo0esqn': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    'img_11_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_10-20260813-110615.jpg': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    'img_11_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_10-20260813-110615': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    'img_11_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_10-20260813-110615': 'Dining Bar Island, Duplex Staircase & Kitchen Vista',

    // 7. Parents Master Suite & Traditional Ink Mandala Crest
    'subbarao_gallery_7.webp': 'Parents Master Suite & Traditional Ink Mandala Crest',
    'subbarao_gallery_7': 'Parents Master Suite & Traditional Ink Mandala Crest',
    'k21ayumhuuy0tmqj7rfg.jpg': 'Parents Master Suite & Traditional Ink Mandala Crest',
    'k21ayumhuuy0tmqj7rfg': 'Parents Master Suite & Traditional Ink Mandala Crest',
    'img_23_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_7-20260813-110614.jpg': 'Parents Master Suite & Traditional Ink Mandala Crest',
    'img_23_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_7-20260813-110614': 'Parents Master Suite & Traditional Ink Mandala Crest',
    'img_23_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_7-20260813-110614': 'Parents Master Suite & Traditional Ink Mandala Crest',

    // 8. Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural
    'subbarao_gallery_8.webp': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    'subbarao_gallery_8': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    'ral5g7qhiphwuacdhvs6.jpg': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    'ral5g7qhiphwuacdhvs6': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    'img_1_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    'img_1_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_4-20260813-110616': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    'img_1_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_4-20260813-110616': 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',

    // 9. Formal Dining Suite & Amber Globe Chandelier
    'subbarao_gallery_9.webp': 'Formal Dining Suite & Amber Globe Chandelier',
    'subbarao_gallery_9': 'Formal Dining Suite & Amber Globe Chandelier',
    'wrazj2wmluws0ue1pddo.jpg': 'Formal Dining Suite & Amber Globe Chandelier',
    'wrazj2wmluws0ue1pddo': 'Formal Dining Suite & Amber Globe Chandelier',
    'img_13_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_12-20260813-110614.jpg': 'Formal Dining Suite & Amber Globe Chandelier',
    'img_13_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_12-20260813-110614': 'Formal Dining Suite & Amber Globe Chandelier',
    'img_13_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_12-20260813-110614': 'Formal Dining Suite & Amber Globe Chandelier',

    // 10. Dining Pavilion & Integrated Smart Refrigerator
    'subbarao_gallery_10.webp': 'Dining Pavilion & Integrated Smart Refrigerator',
    'subbarao_gallery_10': 'Dining Pavilion & Integrated Smart Refrigerator',
    'qhbbsh8imivcxs2imtzg.jpg': 'Dining Pavilion & Integrated Smart Refrigerator',
    'qhbbsh8imivcxs2imtzg': 'Dining Pavilion & Integrated Smart Refrigerator',
    'img_15_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_17-20260813-110614.jpg': 'Dining Pavilion & Integrated Smart Refrigerator',
    'img_15_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_17-20260813-110614': 'Dining Pavilion & Integrated Smart Refrigerator',
    'img_15_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_17-20260813-110614': 'Dining Pavilion & Integrated Smart Refrigerator',

    // 11. Chef's Modular Kitchen & Quartz Countertops
    'subbarao_gallery_11.webp': 'Chef\'s Modular Kitchen & Quartz Countertops',
    'subbarao_gallery_11': 'Chef\'s Modular Kitchen & Quartz Countertops',
    'mg21x4oyxpuhrbaitw6l.jpg': 'Chef\'s Modular Kitchen & Quartz Countertops',
    'mg21x4oyxpuhrbaitw6l': 'Chef\'s Modular Kitchen & Quartz Countertops',
    'img_12_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_11-20260813-110612.jpg': 'Chef\'s Modular Kitchen & Quartz Countertops',
    'img_12_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_11-20260813-110612': 'Chef\'s Modular Kitchen & Quartz Countertops',
    'img_12_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_11-20260813-110612': 'Chef\'s Modular Kitchen & Quartz Countertops',

    // 12. Parents Suite Perspective & Bedside Lanterns
    'subbarao_gallery_12.webp': 'Parents Suite Perspective & Bedside Lanterns',
    'subbarao_gallery_12': 'Parents Suite Perspective & Bedside Lanterns',
    'a6wykpal9jlyprn3zgfj.jpg': 'Parents Suite Perspective & Bedside Lanterns',
    'a6wykpal9jlyprn3zgfj': 'Parents Suite Perspective & Bedside Lanterns',
    'img_21_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_1-20260813-110616.jpg': 'Parents Suite Perspective & Bedside Lanterns',
    'img_21_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_1-20260813-110616': 'Parents Suite Perspective & Bedside Lanterns',
    'img_21_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_1-20260813-110616': 'Parents Suite Perspective & Bedside Lanterns',

    // 13. Parents Suite Wardrobes & Twilight Garden Vista
    'subbarao_gallery_13.webp': 'Parents Suite Wardrobes & Twilight Garden Vista',
    'subbarao_gallery_13': 'Parents Suite Wardrobes & Twilight Garden Vista',
    'ya5s3s0zzfjvhnbsjqck.jpg': 'Parents Suite Wardrobes & Twilight Garden Vista',
    'ya5s3s0zzfjvhnbsjqck': 'Parents Suite Wardrobes & Twilight Garden Vista',
    'img_22_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_3-20260813-110615.jpg': 'Parents Suite Wardrobes & Twilight Garden Vista',
    'img_22_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_3-20260813-110615': 'Parents Suite Wardrobes & Twilight Garden Vista',
    'img_22_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_3-20260813-110615': 'Parents Suite Wardrobes & Twilight Garden Vista',

    // 14. Parents Suite Fluted TV Media Wall & Marble Inlay
    'subbarao_gallery_14.webp': 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    'subbarao_gallery_14': 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    'biocek0jbgeuvaqjoq5q.jpg': 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    'biocek0jbgeuvaqjoq5q': 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    'img_24_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_13-20260813-110614.jpg': 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    'img_24_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_13-20260813-110614': 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    'img_24_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_13-20260813-110614': 'Parents Suite Fluted TV Media Wall & Marble Inlay',

    // 15. Parents Suite Walk-In Dressing Wardrobe
    'subbarao_gallery_15.webp': 'Parents Suite Walk-In Dressing Wardrobe',
    'subbarao_gallery_15': 'Parents Suite Walk-In Dressing Wardrobe',
    'yddjmwdvaqsjuwtsbf5u.jpg': 'Parents Suite Walk-In Dressing Wardrobe',
    'yddjmwdvaqsjuwtsbf5u': 'Parents Suite Walk-In Dressing Wardrobe',
    'img_26_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_25-20260813-110614.jpg': 'Parents Suite Walk-In Dressing Wardrobe',
    'img_26_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_25-20260813-110614': 'Parents Suite Walk-In Dressing Wardrobe',
    'img_26_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_25-20260813-110614': 'Parents Suite Walk-In Dressing Wardrobe',

    // 16. Boys Suite Bed, Nightstands & Blueprint Feature Wall
    'subbarao_gallery_16.webp': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    'subbarao_gallery_16': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    'u58mq18dbeuqf5coc1jg.jpg': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    'u58mq18dbeuqf5coc1jg': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    'img_2_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_9-20260813-110616.jpg': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    'img_2_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_9-20260813-110616': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    'img_2_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_9-20260813-110616': 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',

    // 17. Aeronautical Biplane Technical Blueprint Detail
    'subbarao_gallery_17.webp': 'Aeronautical Biplane Technical Blueprint Detail',
    'subbarao_gallery_17': 'Aeronautical Biplane Technical Blueprint Detail',
    'zmie8c1jua6jc26kbf4g.jpg': 'Aeronautical Biplane Technical Blueprint Detail',
    'zmie8c1jua6jc26kbf4g': 'Aeronautical Biplane Technical Blueprint Detail',
    'img_3_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_14-20260813-110617.jpg': 'Aeronautical Biplane Technical Blueprint Detail',
    'img_3_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_14-20260813-110617': 'Aeronautical Biplane Technical Blueprint Detail',
    'img_3_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_14-20260813-110617': 'Aeronautical Biplane Technical Blueprint Detail',

    // 18. Boys Suite Modular Wardrobe & Walnut Display Niche
    'subbarao_gallery_18.webp': 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    'subbarao_gallery_18': 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    'gkszz4hoaguhsvcvahva.jpg': 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    'gkszz4hoaguhsvcvahva': 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    'img_5_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_18-20260813-110611.jpg': 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    'img_5_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_18-20260813-110611': 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    'img_5_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_18-20260813-110611': 'Boys Suite Modular Wardrobe & Walnut Display Niche',

    // 19. Dining Bar Counter & Houndstooth Seating
    'subbarao_gallery_19.webp': 'Dining Bar Counter & Houndstooth Seating',
    'subbarao_gallery_19': 'Dining Bar Counter & Houndstooth Seating',
    'ytniqcfxfpv8vmdngn7o.jpg': 'Dining Bar Counter & Houndstooth Seating',
    'ytniqcfxfpv8vmdngn7o': 'Dining Bar Counter & Houndstooth Seating',
    'img_7_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_2-20260813-110615.jpg': 'Dining Bar Counter & Houndstooth Seating',
    'img_7_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_2-20260813-110615': 'Dining Bar Counter & Houndstooth Seating',
    'img_7_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_2-20260813-110615': 'Dining Bar Counter & Houndstooth Seating',

    // 20. Living Room Sofa & Marble Coffee Table Detail
    'subbarao_gallery_20.webp': 'Living Room Sofa & Marble Coffee Table Detail',
    'subbarao_gallery_20': 'Living Room Sofa & Marble Coffee Table Detail',
    'csltktkkly4u9k9lzwzy.jpg': 'Living Room Sofa & Marble Coffee Table Detail',
    'csltktkkly4u9k9lzwzy': 'Living Room Sofa & Marble Coffee Table Detail',
    'img_9_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_6-20260813-110617.jpg': 'Living Room Sofa & Marble Coffee Table Detail',
    'img_9_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_6-20260813-110617': 'Living Room Sofa & Marble Coffee Table Detail',
    'img_9_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_6-20260813-110617': 'Living Room Sofa & Marble Coffee Table Detail',

    // 21. Living Lounge Seating Vignette
    'subbarao_gallery_21.webp': 'Living Lounge Seating Vignette',
    'subbarao_gallery_21': 'Living Lounge Seating Vignette',
    'axj2hwzys16jwa3znfsy.jpg': 'Living Lounge Seating Vignette',
    'axj2hwzys16jwa3znfsy': 'Living Lounge Seating Vignette',
    'img_10_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_8-20260813-110617.jpg': 'Living Lounge Seating Vignette',
    'img_10_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_8-20260813-110617': 'Living Lounge Seating Vignette',
    'img_10_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_8-20260813-110617': 'Living Lounge Seating Vignette',

    // 22. Living Lounge Centered Perspective
    'subbarao_gallery_22.webp': 'Living Lounge Centered Perspective',
    'subbarao_gallery_22': 'Living Lounge Centered Perspective',
    'ijfi1nbiejxe9ksgxaod.jpg': 'Living Lounge Centered Perspective',
    'ijfi1nbiejxe9ksgxaod': 'Living Lounge Centered Perspective',
    'img_19_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_24-20260813-110617.jpg': 'Living Lounge Centered Perspective',
    'img_19_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_24-20260813-110617': 'Living Lounge Centered Perspective',
    'img_19_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_24-20260813-110617': 'Living Lounge Centered Perspective',

    // 23. Integrated Smart Refrigerator & Fluted Portal Detail
    'subbarao_gallery_23.webp': 'Integrated Smart Refrigerator & Fluted Portal Detail',
    'subbarao_gallery_23': 'Integrated Smart Refrigerator & Fluted Portal Detail',
    'dhwdwmpgjlopbwvwq42z.jpg': 'Integrated Smart Refrigerator & Fluted Portal Detail',
    'dhwdwmpgjlopbwvwq42z': 'Integrated Smart Refrigerator & Fluted Portal Detail',
    'img_8_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg': 'Integrated Smart Refrigerator & Fluted Portal Detail',
    'img_8_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615': 'Integrated Smart Refrigerator & Fluted Portal Detail',
    'img_8_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615': 'Integrated Smart Refrigerator & Fluted Portal Detail',

    // 24. Boys Suite Study Wall & Grid Memory Board
    'subbarao_gallery_24.webp': 'Boys Suite Study Wall & Grid Memory Board',
    'subbarao_gallery_24': 'Boys Suite Study Wall & Grid Memory Board',
    'ku1jtnpv0osjknwzr9aj.jpg': 'Boys Suite Study Wall & Grid Memory Board',
    'ku1jtnpv0osjknwzr9aj': 'Boys Suite Study Wall & Grid Memory Board',
    'img_4_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_16-20260813-110611.jpg': 'Boys Suite Study Wall & Grid Memory Board',
    'img_4_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_16-20260813-110611': 'Boys Suite Study Wall & Grid Memory Board',
    'img_4_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_16-20260813-110611': 'Boys Suite Study Wall & Grid Memory Board',

    // 25. Parents Suite Floor Vista & Entertainment Wall
    'subbarao_gallery_25.webp': 'Parents Suite Floor Vista & Entertainment Wall',
    'subbarao_gallery_25': 'Parents Suite Floor Vista & Entertainment Wall',
    'qasnmvvaklm6a14yslao.jpg': 'Parents Suite Floor Vista & Entertainment Wall',
    'qasnmvvaklm6a14yslao': 'Parents Suite Floor Vista & Entertainment Wall',
    'img_25_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_20-20260813-110612.jpg': 'Parents Suite Floor Vista & Entertainment Wall',
    'img_25_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_20-20260813-110612': 'Parents Suite Floor Vista & Entertainment Wall',
    'img_25_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_20-20260813-110612': 'Parents Suite Floor Vista & Entertainment Wall',

    // 26. Boys Suite Architectural Shell & Curtains
    'subbarao_gallery_26.webp': 'Boys Suite Architectural Shell & Curtains',
    'subbarao_gallery_26': 'Boys Suite Architectural Shell & Curtains',
    'adeg00wsepmxhkdsovzx.jpg': 'Boys Suite Architectural Shell & Curtains',
    'adeg00wsepmxhkdsovzx': 'Boys Suite Architectural Shell & Curtains',
    'img_6_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_19-20260813-110616.jpg': 'Boys Suite Architectural Shell & Curtains',
    'img_6_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_19-20260813-110616': 'Boys Suite Architectural Shell & Curtains',
    'img_6_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_19-20260813-110616': 'Boys Suite Architectural Shell & Curtains',

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
  },

  // 10. The Restful Home (Tellapur 2BHK - Dinesh & Sarvani)
  'the-restful-home-tellapur': {
    'exseh5lm0mz9sfni4lkv.png': 'Living Lounge & Walnut Partition',
    'exseh5lm0mz9sfni4lkv': 'Living Lounge & Walnut Partition',
    'modern_living_space_walnut_partition': 'Living Lounge & Walnut Partition',
    'xivp043sbxsjdntmyeji.png': 'Slatted Dining Partition & Ambient Marble',
    'xivp043sbxsjdntmyeji': 'Slatted Dining Partition & Ambient Marble',
    'walnut_slats_and_marble_glow': 'Slatted Dining Partition & Ambient Marble',
    'flfizkibqnyv1ktude6t.png': 'Open-Concept Living & Kitchen Transition',
    'flfizkibqnyv1ktude6t': 'Open-Concept Living & Kitchen Transition',
    'polished_modern_living_kitchen': 'Open-Concept Living & Kitchen Transition',
    'dntcpbg0dg78vu5hktwt.png': 'Bright L-Shaped Modular Kitchen',
    'dntcpbg0dg78vu5hktwt': 'Bright L-Shaped Modular Kitchen',
    'bright_modern_l_shaped_kitchen': 'Bright L-Shaped Modular Kitchen',
    'xehnw42t41tcxvtc60ml.png': 'Modular Kitchen Cabinetry with Warm Wood Accents',
    'xehnw42t41tcxvtc60ml': 'Modular Kitchen Cabinetry with Warm Wood Accents',
    'modern_kitchen_wood_accents': 'Modular Kitchen Cabinetry with Warm Wood Accents',
    'wazorsezkcaayd5bmrc1.png': 'Teal & Marble Accent Galley Kitchen',
    'wazorsezkcaayd5bmrc1': 'Teal & Marble Accent Galley Kitchen',
    'modern_teal_marble_kitchen': 'Teal & Marble Accent Galley Kitchen',
    's6vvkmvqz8h2aqbtwcam.png': 'Warmly Lit Modern Home Shrine',
    's6vvkmvqz8h2aqbtwcam': 'Warmly Lit Modern Home Shrine',
    'warmly_lit_modern_home_shrine': 'Warmly Lit Modern Home Shrine',
    'zmsezgqkrwiqdgyno9oi.png': 'Pooja Mandir with Glowing Om Feature',
    'zmsezgqkrwiqdgyno9oi': 'Pooja Mandir with Glowing Om Feature',
    'ornate_white_panels_glowing_om': 'Pooja Mandir with Glowing Om Feature',
    'c3z7b0m8xrq56mvdq7b4.png': 'Integrated Pooja Mandir & Kitchen',
    'c3z7b0m8xrq56mvdq7b4': 'Integrated Pooja Mandir & Kitchen',
    'hexutd4jmmolynp91e28.png': 'Integrated Pooja Mandir & Kitchen',
    'hexutd4jmmolynp91e28': 'Integrated Pooja Mandir & Kitchen',
    'modern_pooja_cabinet_kitchen': 'Integrated Pooja Mandir & Kitchen',
    'gl4os8hhxhsy9vke0cx1.png': 'Master Bedroom Suite & Geometric Lighting',
    'gl4os8hhxhsy9vke0cx1': 'Master Bedroom Suite & Geometric Lighting',
    'lavender_room_geometric_lighting': 'Master Bedroom Suite & Geometric Lighting',
    'ixrrcgxxhf1pytdjjhga.png': 'Master Bedroom Built-In Wardrobes',
    'ixrrcgxxhf1pytdjjhga': 'Master Bedroom Built-In Wardrobes',
    'lavender_wall_sleek_wardrobe': 'Master Bedroom Built-In Wardrobes',
    'jmbconw0wz7rrzqqaiub.png': 'Minimalist Greige Full-Height Wardrobes',
    'jmbconw0wz7rrzqqaiub': 'Minimalist Greige Full-Height Wardrobes',
    'minimalist_greige_wardrobe': 'Minimalist Greige Full-Height Wardrobes',
    'b9negjore9wp71j24l8t.png': 'Kids / Guest Bedroom & Study Storage',
    'b9negjore9wp71j24l8t': 'Kids / Guest Bedroom & Study Storage',
    'modern_minimalist_room_storage': 'Kids / Guest Bedroom & Study Storage'
  },

  // 11. Casa Alta Residence (Kali Mandir 3BHK - Prakash)
  'casa-alta-residence-kali-mandir': {
    'ues8rn6ddd052rkmlesl.png': 'Grand Living Lounge & Fluted Feature Wall',
    'ues8rn6ddd052rkmlesl': 'Grand Living Lounge & Fluted Feature Wall',
    'living_room_fluted_feature_wall': 'Grand Living Lounge & Fluted Feature Wall',
    'gn1gylu6rnd1jvpobceu.png': 'Modern Wood-Panelled Entrance Porch',
    'gn1gylu6rnd1jvpobceu': 'Modern Wood-Panelled Entrance Porch',
    'modern_wood_panelled_entrance_porch': 'Modern Wood-Panelled Entrance Porch',
    'duhzjiu5foyimwshxgqx.png': 'Warm Foyer & Architectural Hallway',
    'duhzjiu5foyimwshxgqx': 'Warm Foyer & Architectural Hallway',
    'warm_modern_hallway_festive_garlands': 'Warm Foyer & Architectural Hallway',
    'z54sqdn0rxz5uvvz6vde.png': 'Grain-Matched Veneer Dining Suite',
    'z54sqdn0rxz5uvvz6vde': 'Grain-Matched Veneer Dining Suite',
    'grain_matched_dining_area': 'Grain-Matched Veneer Dining Suite',
    's3eem08ug6sagt9hj2tz.png': 'Double-Height Staircase & Sacred Art Mural',
    's3eem08ug6sagt9hj2tz': 'Double-Height Staircase & Sacred Art Mural',
    'double_height_staircase_jesus_mural': 'Double-Height Staircase & Sacred Art Mural',
    'alkqwzmvoiitkbzqxci7.png': 'Backlit Stone & Timber Pooja Unit',
    'alkqwzmvoiitkbzqxci7': 'Backlit Stone & Timber Pooja Unit',
    'backlit_stone_timber_pooja_shrine': 'Backlit Stone & Timber Pooja Unit',
    'zoelg4rucvrxaeuxuqkx.png': 'Master Bedroom Suite & Acoustic Headboard',
    'zoelg4rucvrxaeuxuqkx': 'Master Bedroom Suite & Acoustic Headboard',
    'calm_master_bedroom_suite': 'Master Bedroom Suite & Acoustic Headboard',
    'dn73ubo6rocp6ptcxqzy.png': 'Master Walk-In Wardrobe & Dressing Vanity',
    'dn73ubo6rocp6ptcxqzy': 'Master Walk-In Wardrobe & Dressing Vanity',
    'master_walk_in_wardrobe': 'Master Walk-In Wardrobe & Dressing Vanity',
    'gctshkszvbpfjlegttqp.png': 'Guest Bedroom Suite & Fluted Storage',
    'gctshkszvbpfjlegttqp': 'Guest Bedroom Suite & Fluted Storage',
    'guest_bedroom_suite': 'Guest Bedroom Suite & Fluted Storage',
    'dnligxpinxfkkzbwdesc.png': 'Modern Modular Kitchen & Ambient Coves',
    'dnligxpinxfkkzbwdesc': 'Modern Modular Kitchen & Ambient Coves',
    'modern_modular_kitchen_cove': 'Modern Modular Kitchen & Ambient Coves'
  }
};

// Aliases by project _id
EXACT_PROJECT_ROOMS['proj_1_rajapushpa_provincia'] = EXACT_PROJECT_ROOMS['rajapushpa-provincia-3bhk'];
EXACT_PROJECT_ROOMS['the-arcstone-residence-narsingi'] = EXACT_PROJECT_ROOMS['rajapushpa-provincia-3bhk'];
EXACT_PROJECT_ROOMS['the-arcstone-residence'] = EXACT_PROJECT_ROOMS['rajapushpa-provincia-3bhk'];
EXACT_PROJECT_ROOMS['narsingi-3bhk'] = EXACT_PROJECT_ROOMS['rajapushpa-provincia-3bhk'];
EXACT_PROJECT_ROOMS['proj_2_my_home_sayuk'] = EXACT_PROJECT_ROOMS['my-home-sayuk-3bhk'];
EXACT_PROJECT_ROOMS['proj_3_kokapet_nagesh'] = EXACT_PROJECT_ROOMS['kokapet-2bhk'];
EXACT_PROJECT_ROOMS['proj_4_kokapet_rahul'] = EXACT_PROJECT_ROOMS['kokapet-urban-2bhk'];
EXACT_PROJECT_ROOMS['proj_5_gandipet_kiran'] = EXACT_PROJECT_ROOMS['gandipet-modern-retro-2bhk'];
EXACT_PROJECT_ROOMS['proj_6_kondapur_venkatesh'] = EXACT_PROJECT_ROOMS['kondapur-minimalist-2bhk'];
EXACT_PROJECT_ROOMS['proj_7_gachibowli_koteswara'] = EXACT_PROJECT_ROOMS['gachibowli-minimalist-beige-2bhk'];
EXACT_PROJECT_ROOMS['proj_8_kachiguda_subbarao'] = EXACT_PROJECT_ROOMS['kachiguda-fusion-duplex-villa'];
EXACT_PROJECT_ROOMS['proj_9_dimmu_chachu_residence'] = EXACT_PROJECT_ROOMS['dimmu-chachu-luxury-villa'];
EXACT_PROJECT_ROOMS['proj_10_the_restful_home_tellapur'] = EXACT_PROJECT_ROOMS['the-restful-home-tellapur'];
EXACT_PROJECT_ROOMS['proj_11_casa_alta_residence_kali_mandir'] = EXACT_PROJECT_ROOMS['casa-alta-residence-kali-mandir'];

// Smart filename keyword matcher & project prefix resolver
function detectRoomFromFilename(filename) {
  if (!filename) return null;
  const lower = filename.toLowerCase();

  // 1. Specific Arcstone Narsingi / Rajapushpa image mapping
  if (lower.includes('arcstone_') || lower.includes('arcstone_narsingi_') || lower.includes('zvqkqqkpa6fdfojtaxxb') || lower.includes('neljy4tkjufc3e2qm7oq') || lower.includes('loml95jqkz3mzvbr3z5g') || lower.includes('boddxdbbkc3vvz1sccmn') || lower.includes('koiive2gy5yw5rysfwcx')) {
    if (lower.includes('hall_main') || lower.includes('zvqkqqkpa6fdfojtaxxb')) return 'Grand Living Lounge & Arched Feature Wall';
    if (lower.includes('hall_2') || lower.includes('neljy4tkjufc3e2qm7oq')) return 'Living Lounge & Arched Feature Nook';
    if (lower.includes('hall_3') || lower.includes('loml95jqkz3mzvbr3z5g')) return 'Sculpted TV Media Wall & Fluted Panelling';
    if (lower.includes('hall_4') || lower.includes('boddxdbbkc3vvz1sccmn')) return 'Open Dining Area & Fluted Transition';
    if (lower.includes('hall_5') || lower.includes('koiive2gy5yw5rysfwcx')) return 'Living Lounge & Ambient Cove Lighting';
    if (lower.includes('mbr_main') || lower.includes('rublks3kk1u3skfbhbsb')) return 'Master Bedroom & Curved Feature Wall';
    if (lower.includes('mbr_2') || lower.includes('uwnpmsvmh5atr54ma5ds')) return 'Master Suite with Chandelier & Glass Wardrobes';
    if (lower.includes('mbr_3') || lower.includes('z4irutpzt2hw5qabd9cg')) return 'Master Suite Media Wall & Study Nook';
    if (lower.includes('mbr_4') || lower.includes('bnyefgrrc9mpjjen20tq')) return 'Master Bedroom Suite & Ambient Cove Lighting';
    if (lower.includes('wic_main') || lower.includes('kuunw858ws3n2t4l88xa')) return 'Master Walk-In Wardrobe & Fluted Closets';
    if (lower.includes('wic_2') || lower.includes('l0l52jndy37r67ld9dfl')) return 'Walk-In Wardrobe & Dressing Vanity';
    if (lower.includes('kitchen_main') || lower.includes('nbvmn4dsrozpqpoaslf0')) return 'Modular Kitchen & Quartz Countertops';
    if (lower.includes('kitchen_2') || lower.includes('vavkk9wt57fqv5uu1du1')) return 'L-Shaped Modular Kitchen & Fluted Cabinetry';
    if (lower.includes('puja_main') || lower.includes('sidf1hbm5mcum6plj4lc')) return 'Pooja Mandir & Foyer Transition';
    if (lower.includes('gbr_main') || lower.includes('cldydk0ev0l4qejfq9on')) return 'Guest Bedroom Suite & Arched Wall Accents';
    if (lower.includes('gbr_2') || lower.includes('ivclestyrevc8fsj3adp')) return 'Guest Bedroom Suite & Backlit Headboard';
    if (lower.includes('gbr_3') || lower.includes('jcm4du0ewbdu1mdnhzgv')) return 'Guest Dressing Vanity & Wardrobes';
    if (lower.includes('bedroom_main') || lower.includes('p4gnc1zdgif0gngtqtro')) return 'Kids Bedroom Suite & Custom Headboard';
    if (lower.includes('bedroom_2') || lower.includes('xq85mtynhjvlp1tpvtld')) return 'Kids Bedroom Wardrobes & Study Desk';
    if (lower.includes('utility') || lower.includes('oofymnichjtynx4yrhzk')) return 'Utility & Laundry Suite';
    if (lower.includes('wardrobe_after') || lower.includes('iv1psdr5b26t4kqynn3h') || lower.includes('r3g4jtdojchqkqvmlmgm') || lower.includes('after_uhd')) return 'Luxury Suite Wardrobes & Fluted Dressing Vanity';
    if (lower.includes('before') || lower.includes('gmbbvqghe69pjdqdnxxy') || lower.includes('zcpjoiltra0js8hgh0om') || lower.includes('before_uhd')) return 'Raw Site Shell & Pre-Fitout Framing';
  }
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

    // 5. Specific Subbarao Kachiguda Duplex image mapping (26 4K images)
  if (lower.includes('subbarao') || lower.includes('kachiguda')) {
    if (lower.includes('hero') || lower.includes('bqtmsst1w8jjit2drtmq') || lower.includes('after') || lower.includes('unbmruocdxxhcb4wvn7e')) return 'Grand Duplex Living Hall & Architectural Staircase Vista';
    if (lower.includes('before') || lower.includes('blohvaxle28zo18l7lug')) return 'Raw Site Shell & Structural Framing';
    if (lower.includes('gallery_1') || lower.includes('fjoq7ss31x85vjccgr5a')) return 'Grand Duplex Living Hall & Architectural Staircase Vista';
    if (lower.includes('gallery_2') || lower.includes('u3jboyp6o3tqjy1zffvf')) return 'Living Lounge, Roaring Linear Fireplace & Media Tower';
    if (lower.includes('gallery_3') || lower.includes('yhbdhtzvtts6lbjcyvhb')) return 'Open-Concept Duplex Living & Dining Transition';
    if (lower.includes('gallery_4') || lower.includes('lppkuofoaxacxbxjinf3')) return 'Living Lounge & KAWS Art Sculpture Nook';
    if (lower.includes('gallery_5') || lower.includes('ykmradholvjphbaimyso')) return 'Living Lounge & Courtyard Picture Window';
    if (lower.includes('gallery_6') || lower.includes('eaniagfydwjdgbo0esqn')) return 'Dining Bar Island, Duplex Staircase & Kitchen Vista';
    if (lower.includes('gallery_7') || lower.includes('k21ayumhuuy0tmqj7rfg')) return 'Parents Master Suite & Traditional Ink Mandala Crest';
    if (lower.includes('gallery_8') || lower.includes('ral5g7qhiphwuacdhvs6')) return 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural';
    if (lower.includes('gallery_9') || lower.includes('wrazj2wmluws0ue1pddo')) return 'Formal Dining Suite & Amber Globe Chandelier';
    if (lower.includes('gallery_10') || lower.includes('qhbbsh8imivcxs2imtzg')) return 'Dining Pavilion & Integrated Smart Refrigerator';
    if (lower.includes('gallery_11') || lower.includes('mg21x4oyxpuhrbaitw6l')) return 'Chef\'s Modular Kitchen & Quartz Countertops';
    if (lower.includes('gallery_12') || lower.includes('a6wykpal9jlyprn3zgfj')) return 'Parents Suite Perspective & Bedside Lanterns';
    if (lower.includes('gallery_13') || lower.includes('ya5s3s0zzfjvhnbsjqck')) return 'Parents Suite Wardrobes & Twilight Garden Vista';
    if (lower.includes('gallery_14') || lower.includes('biocek0jbgeuvaqjoq5q')) return 'Parents Suite Fluted TV Media Wall & Marble Inlay';
    if (lower.includes('gallery_15') || lower.includes('yddjmwdvaqsjuwtsbf5u')) return 'Parents Suite Walk-In Dressing Wardrobe';
    if (lower.includes('gallery_16') || lower.includes('u58mq18dbeuqf5coc1jg')) return 'Boys Suite Bed, Nightstands & Blueprint Feature Wall';
    if (lower.includes('gallery_17') || lower.includes('zmie8c1jua6jc26kbf4g')) return 'Aeronautical Biplane Technical Blueprint Detail';
    if (lower.includes('gallery_18') || lower.includes('gkszz4hoaguhsvcvahva')) return 'Boys Suite Modular Wardrobe & Walnut Display Niche';
    if (lower.includes('gallery_19') || lower.includes('ytniqcfxfpv8vmdngn7o')) return 'Dining Bar Counter & Houndstooth Seating';
    if (lower.includes('gallery_20') || lower.includes('csltktkkly4u9k9lzwzy')) return 'Living Room Sofa & Marble Coffee Table Detail';
    if (lower.includes('gallery_21') || lower.includes('axj2hwzys16jwa3znfsy')) return 'Living Lounge Seating Vignette';
    if (lower.includes('gallery_22') || lower.includes('ijfi1nbiejxe9ksgxaod')) return 'Living Lounge Centered Perspective';
    if (lower.includes('gallery_23') || lower.includes('dhwdwmpgjlopbwvwq42z')) return 'Integrated Smart Refrigerator & Fluted Portal Detail';
    if (lower.includes('gallery_24') || lower.includes('ku1jtnpv0osjknwzr9aj')) return 'Boys Suite Study Wall & Grid Memory Board';
    if (lower.includes('gallery_25') || lower.includes('qasnmvvaklm6a14yslao')) return 'Parents Suite Floor Vista & Entertainment Wall';
    if (lower.includes('gallery_26') || lower.includes('adeg00wsepmxhkdsovzx')) return 'Boys Suite Architectural Shell & Curtains';
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
