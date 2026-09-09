import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import FAQ from '../models/FAQ.js';
import Testimonial from '../models/Testimonial.js';
import Settings from '../models/Settings.js';

// Load env vars
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/espacio';

// Authentic company project photos (from actual completed Hyderabad sites)
const unsplashImages = {
  villas: [
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    '/images/company/3bhk_lux/open_hall.png',
    '/images/company/3bhk_lux/open_hall2.png',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-balcony_1-20260810-120429.jpg',
  ],
  apartments: [
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
    '/images/company/2bhk_mordern_retro/b1_2.jpg',
    '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    '/images/company/2bhk_lux/hall1_1.png',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_27-20260810-124917.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_24-20260810-122233.jpg',
  ],
  commercial: [
    '/images/company/2bhk_mordern_retro/office_3.jpg',
    '/images/company/2bhk_mordern_retro/office_2.jpg',
    '/images/company/2bhk_mordern_retro/office.jpg',
    '/images/company/3bhk_lux/open_hall.png',
    '/images/company/2bhk_mordern_retro/hall_paneling.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
    '/images/company/2bhk_lux/hall1_1.png',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_27-20260810-124917.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
  ],
  kitchens: [
    '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_0-20260810-173514.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-kitchen_4-20260810-120431.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-kitchen_3-20260810-120429.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-kitchen_5-20260810-120431.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_17-20260810-122232.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_18-20260810-122232.jpg',
    '/images/company/3bhk_lux/kitchen_1.png',
    '/images/company/2bhk_lux/kitchen_3_2.png',
  ],
  bedrooms: [
    '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Master_Bedroom_15-20260810-120432.jpg',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_13-20260810-124909.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_24-20260810-122233.jpg',
    '/images/company/3bhk_lux/bedroom_1.png',
    '/images/company/2bhk_mordern_retro/b1_2.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg',
  ],
  materials: [
    '/images/company/2bhk_mordern_retro/hall_paneling.jpg',
    '/images/company/2bhk_lux/tv_unit_2_1.png',
    '/images/company/2bhk_lux/crockery1_1.png',
  ],
};

const neighborhoods = ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Kondapur', 'HITEC City', 'Kokapet', 'Begumpet', 'Madhapur'];
const categories = ['villa', 'apartment', 'commercial', 'office', 'renovation', 'luxury_home'];
const styles = ['Japandi Minimal', 'Warm Contemporary', 'Modern Editorial', 'Luxury Architectural', 'Scandinavian Crafted'];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB database to seed initial data...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    // Clear existing data
    console.log('Cleaning collection indexes and documents...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await FAQ.deleteMany({});
    await Testimonial.deleteMany({});
    await Settings.deleteMany({});

    // 1. Seed Admin User
    console.log('Seeding default administrator credentials...');
    const adminUser = await User.create({
      email: 'tarunuttupulusu@gmail.com',
      password: 'tarun2314638', // Schema pre-save middleware hashes this automatically!
      name: 'Tarun Uttupulusu',
      role: 'superadmin',
      mustChangePassword: false,
      status: 'active',
    });
    console.log('Admin user pre-seeded successfully.');

    // 2. Seed Space Categories (What We Do explorer)
    console.log('Seeding space categories...');
    const spaces = [
      { name: 'Modular Kitchen', slug: 'modular-kitchen', description: 'Engineered for chefs, styled for gatherers. High tolerance materials meet seamless layouts.', image: unsplashImages.kitchens[0] },
      { name: 'Master Bedroom', slug: 'master-bedroom', description: 'Sanctuaries designed with intent. Warm wood paneling, indirect lighting, and hidden storage.', image: unsplashImages.bedrooms[0] },
      { name: 'Living Room', slug: 'living-room', description: 'Spaces that breathe. Large editorial layouts celebrating natural materials like stone and oak.', image: unsplashImages.villas[3] },
      { name: 'Wardrobe Systems', slug: 'wardrobes', description: 'Bespoke storage configured around your daily routine. Precision alignments, velvet linings.', image: unsplashImages.bedrooms[1] },
      { name: 'Dining Room', slug: 'dining-room', description: 'Warm editorial gather settings with custom hardwood tables and architectural plaster finishes.', image: unsplashImages.villas[2] },
      { name: 'Home Office', slug: 'home-office', description: 'Focus zones utilizing sound-dampening fluted panels and ergonomic custom shelving configurations.', image: unsplashImages.commercial[2] },
      { name: 'Pooja Room', slug: 'pooja-room', description: 'Sacred spaces merging ancestral stone cravings with sleek modern glass and warm lighting.', image: unsplashImages.villas[4] },
      { name: 'Commercial Workspace', slug: 'commercial-office', description: 'Turnkey workspaces and executive suites designed to improve employee creativity and focus.', image: unsplashImages.commercial[0] },
    ];

    const categoryDocs = [];
    for (let i = 0; i < spaces.length; i++) {
      const spaceObj = spaces[i];
      const doc = await Category.create({
        name: spaceObj.name,
        slug: spaceObj.slug,
        description: spaceObj.description,
        heroImage: spaceObj.image,
        galleryImages: spaceObj.slug === 'commercial-office' || spaceObj.slug === 'home-office'
          ? [
              unsplashImages.commercial[0],
              unsplashImages.commercial[1],
              unsplashImages.commercial[2],
              unsplashImages.commercial[3],
              unsplashImages.commercial[4],
              unsplashImages.commercial[5],
              unsplashImages.commercial[6],
              unsplashImages.commercial[7],
            ]
          : spaceObj.slug === 'modular-kitchen'
          ? [
              '/images/materials/user_luxury_kitchen_6.jpg',
              '/images/materials/user_luxury_kitchen_7.jpg',
              '/images/materials/user_luxury_kitchen_8.jpg',
              '/images/materials/user_luxury_kitchen_1.jpg',
              '/images/materials/user_luxury_kitchen_2.jpg',
              '/images/materials/user_luxury_kitchen_3.jpg',
              '/images/materials/user_luxury_kitchen_4.jpg',
              '/images/materials/user_luxury_kitchen_5.jpg',
              '/images/materials/user_l_shape_kitchen_5.jpg',
              '/images/materials/user_l_shape_kitchen_6.jpg',
              '/images/materials/user_l_shape_kitchen_7.jpg',
              '/images/materials/user_l_shape_kitchen_8.jpg',
              '/images/materials/user_l_shape_kitchen_1.jpg',
              '/images/materials/user_l_shape_kitchen_2.jpg',
              '/images/materials/user_l_shape_kitchen_3.jpg',
              '/images/materials/user_l_shape_kitchen_4.jpg',
              '/images/materials/l_shape_kitchen_1.png',
              '/images/materials/l_shape_kitchen_2.png',
              '/images/materials/parallel_kitchen_6.jpg',
              '/images/materials/parallel_kitchen_7.jpg',
              '/images/materials/parallel_kitchen_8.jpg',
              '/images/materials/parallel_kitchen_9.png',
              '/images/materials/parallel_kitchen_1.jpg',
              '/images/materials/parallel_kitchen_2.jpg',
              '/images/materials/parallel_kitchen_3.jpg',
              '/images/materials/parallel_kitchen_4.jpg',
              '/images/materials/parallel_kitchen_5.jpg',
              '/images/materials/island_kitchen_10.jpg',
              '/images/materials/island_kitchen_5.jpg',
              '/images/materials/island_kitchen_6.jpg',
              '/images/materials/island_kitchen_7.jpg',
              '/images/materials/island_kitchen_8.jpg',
              '/images/materials/island_kitchen_9.jpg',
              '/images/materials/island_kitchen_1.jpg',
              '/images/materials/island_kitchen_2.jpg',
              '/images/materials/island_kitchen_3.jpg',
              '/images/materials/island_kitchen_4.jpg',
            ]
          : spaceObj.slug === 'master-bedroom' || spaceObj.slug === 'wardrobes'
          ? [
              unsplashImages.bedrooms[0],
              unsplashImages.bedrooms[1],
              unsplashImages.bedrooms[2],
              unsplashImages.bedrooms[3],
              unsplashImages.bedrooms[4],
              unsplashImages.bedrooms[5],
              unsplashImages.bedrooms[6],
              unsplashImages.bedrooms[7],
            ]
          : [
              unsplashImages.villas[0],
              unsplashImages.villas[1],
              unsplashImages.villas[2],
              unsplashImages.villas[3],
              unsplashImages.villas[4],
              unsplashImages.villas[5],
              unsplashImages.villas[6],
              unsplashImages.villas[7],
            ],
        filters: spaceObj.slug === 'modular-kitchen'
          ? ['Island Kitchen', 'Parallel Kitchen', 'L-Shape', 'Modern', 'Luxury']
          : spaceObj.slug === 'master-bedroom'
          ? ['Master Suite', 'Kids Room', 'Guest Room', 'Japandi', 'Luxury']
          : spaceObj.slug === 'living-room'
          ? ['Minimal', 'Luxury', 'Japandi', 'TV Wall', 'Open Layout']
          : spaceObj.slug === 'wardrobes'
          ? ['Walk-in', 'Built-in', 'Sliding', 'Modern', 'Luxury']
          : spaceObj.slug === 'home-office'
          ? ['Minimal', 'Executive', 'Creative', 'Storage']
          : spaceObj.slug === 'commercial-office'
          ? ['Executive', 'Open Plan', 'Reception', 'Collaborative']
          : spaceObj.slug === 'pooja-room'
          ? ['Traditional', 'Modern', 'Marble', 'Minimal']
          : spaceObj.slug === 'dining-room'
          ? ['Formal', 'Casual', 'Luxury', 'Open Plan']
          : ['Modern', 'Japandi', 'Minimalist', 'Wood Accent', 'Luxury Plaster'],
        displayOrder: i,
        createdBy: adminUser._id,
      });
      categoryDocs.push(doc);
    }
    console.log('Categories seeded.');

    // 3. Seed Products (Materials Library)
    console.log('Seeding material library items...');
    const materialCats = [
      { name: 'WPC Wall Panels', slug: 'wpc-wall-panels', desc: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.' },
      { name: 'PVC Ceiling Panels', slug: 'pvc-ceiling-panels', desc: 'Lightweight, class-A fire retardant ceiling elements that integrate seamlessly with smart light tracks.' },
      { name: 'Fluted Panels', slug: 'fluted-panels', desc: 'Sleek architectural relief lines perfect for master bed backdrops and sound-dampening home theatres.' },
      { name: 'Polygranite Sheets', slug: 'polygranite-sheets', desc: 'High-gloss stone overlays offering scratch-proof marble elevations without the excessive weight.' },
      { name: 'Acrylic Sheets', slug: 'acrylic-sheets', desc: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet facings.' },
      { name: 'Charcoal Panels', slug: 'charcoal-panels', desc: 'Richly textured panels infused with active charcoal elements for unique luxury accent walls.' },
      { name: 'Mosaic Tiles', slug: 'mosaic-tiles', desc: 'Curated natural stone and matte metallic mosaic details for high-end powder rooms.' },
      { name: 'Decorative Louvers', slug: 'decorative-louvers', desc: 'Bespoke walnut and charcoal dividers engineered for light diffusion and open layout planning.' },
    ];

    const productDocs = [];
    for (let i = 0; i < materialCats.length; i++) {
      const m = materialCats[i];
      const doc = await Product.create({
        title: m.name,
        slug: m.slug,
        category: m.slug.replace(/-/g, '_'),
        description: m.desc,
        heroImage: unsplashImages.materials[i % 3],
        gallery: [unsplashImages.villas[i % 5], unsplashImages.materials[(i + 1) % 3]],
        specifications: [
          { label: 'Standard Dimensions', value: '2900mm x 122mm x 12mm' },
          { label: 'Core Weight', value: '1.8 kg/m' },
          { label: 'Water Resistance', value: '100% Waterproof' },
          { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
        ],
        features: ['100% Waterproof', 'Termite Proof', 'Flame Retardant', 'Eco-Friendly E0 Grade'],
        colors: [
          { name: 'Natural Oak', hex: '#D2B48C' },
          { name: 'Smoked Walnut', hex: '#5C4033' },
          { name: 'Ashen Grey', hex: '#808080' },
          { name: 'Slate Charcoal', hex: '#2F4F4F' },
        ],
        catalogPDF: '/uploads/espacio_materials_catalog_2026.pdf',
        previewPages: [
          unsplashImages.materials[0],
          unsplashImages.materials[1],
          unsplashImages.materials[2],
          unsplashImages.villas[0],
          unsplashImages.villas[1],
          unsplashImages.villas[2],
          unsplashImages.villas[3],
        ], // 7 preview page placeholders
        applications: ['Modular Kitchen cabinets', 'Living Room focus walls', 'Bed board backing', 'Office ceilings'],
        createdBy: adminUser._id,
      });
      productDocs.push(doc);
    }
    console.log('Material library products seeded.');

    // 4. Seed 25+ Detailed Projects (Case studies)
    console.log('Generating 28 custom Hyderabad case studies...');
    for (let i = 1; i <= 28; i++) {
      const isFeatured = i <= 6; // Pin first 6 projects
      const isTrending = i > 6 && i <= 12;
      const cat = categories[i % categories.length];
      const hood = neighborhoods[i % neighborhoods.length];
      const style = styles[i % styles.length];
      const space = spaces[i % spaces.length];

      const pTitle = i === 1 
        ? 'The Lakeside Sanctuary (Guntur Kaaram Location)'
        : `${style} ${cat.replace('_', ' ')} in ${hood}`;

      const pDesc = i === 1
        ? 'A monumental lakeside villa build. The architectural structure was chosen as a movie filming location due to its load-bearing precision and timeless proportions.'
        : `A bespoke design and execution project focusing on a clean editorial aesthetic, structured wood textures, and space optimization parameters.`;

      // Select materials
      const materialsUsed = [
        productDocs[i % productDocs.length]._id,
        productDocs[(i + 2) % productDocs.length]._id,
      ];

      await Project.create({
        title: pTitle,
        slug: pTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: pDesc,
        story: {
          vision: `The client requested a sanctuary that celebrates natural materials and structural clarity. The layout had to optimize daylight while keeping visual clutter minimal.`,
          challenges: `Integrating dynamic HVAC grilles into a seamless walnut false ceiling without creating unsightly shadow lines or disrupting acoustic thresholds.`,
          solutions: `Engineered custom hidden linear slots and utilized interlocking ceiling systems lined with acoustic charcoal panels.`,
          engineering: `Calculated tolerances for heavy marble panels along load-bearing partitions, reinforcing them with mild steel framing details.`,
          outcome: `An editorial space that has proven its durability over time, standing strong as a premium spatial benchmark.`,
        },
        category: cat,
        location: `${hood}, Hyderabad`,
        area: `${2500 + (i * 150)} sq.ft.`,
        year: 2023 + (i % 3),
        style: style,
        heroImage: cat === 'commercial' || cat === 'office' 
          ? unsplashImages.commercial[i % unsplashImages.commercial.length]
          : unsplashImages.villas[i % unsplashImages.villas.length],
        gallery: cat === 'commercial' || cat === 'office'
          ? [
              unsplashImages.commercial[0],
              unsplashImages.commercial[1],
              unsplashImages.commercial[2],
              unsplashImages.commercial[3],
              unsplashImages.commercial[4],
              unsplashImages.commercial[5],
              unsplashImages.commercial[6],
              unsplashImages.commercial[7],
              unsplashImages.commercial[8],
            ]
          : [
              unsplashImages.villas[i % 9],
              unsplashImages.apartments[(i + 1) % 9],
              unsplashImages.kitchens[(i + 2) % 9],
              unsplashImages.bedrooms[(i + 3) % 9],
              unsplashImages.villas[(i + 4) % 9],
              unsplashImages.apartments[(i + 5) % 9],
              unsplashImages.kitchens[(i + 6) % 9],
              unsplashImages.bedrooms[(i + 7) % 9],
              unsplashImages.villas[(i + 8) % 9],
            ],
        beforeImages: [unsplashImages.materials[2]], // renovation comparisons
        afterImages: [unsplashImages.villas[i % 5]],
        testimonial: {
          name: `Client of ${hood} Project`,
          text: `Espacio did not just decorate my home. They engineered it. The precision of their construction legacy shows in every joint and alignment. Highly recommended.`,
          rating: 5,
        },
        materialsUsed,
        featured: isFeatured,
        trending: isTrending,
        status: 'published',
        createdBy: adminUser._id,
      });
    }
    console.log('28 Projects seeded.');

    // 5. Seed 25 FAQs
    console.log('Seeding FAQs...');
    const faqQuestions = [
      // General
      { q: 'How long does a turnkey home project take?', a: 'Typically 2-3 months from final drawing sign-off to site handover, depending on detailing complexity.', cat: 'general' },
      { q: 'Do you provide turnkey interior solutions?', a: 'Yes. Every project is delivered end-to-end, meaning we manage design, raw material sourcing, and complete execution.', cat: 'general' },
      { q: 'Where is your office based?', a: 'We are based at Aziznagar, Hyderabad, Telangana 500075. Drop by during business hours (10 AM - 7:30 PM).', cat: 'general' },
      { q: 'Do you display your contact number publicly?', a: 'We restrict displaying phone numbers on the front-end to streamline incoming inquiries through our custom quote wizard.', cat: 'general' },
      
      // Services
      { q: 'Do you offer design-only services?', a: 'Yes. If you have an execution team, we can supply the 2D layout drawings and 3D visualization concepts separately.', cat: 'services' },
      { q: 'Are commercial fit-outs handled turnkey?', a: 'Yes. We manage workspaces, clinics, and cafes from bare-shell partitioning to structural cabling and final handovers.', cat: 'services' },
      { q: 'What is included in the Styling service?', a: 'We coordinate custom fabrics, decorative panels, artifacts, lighting schemes, and soft furnishings as a standalone final touch.', cat: 'services' },
      { q: 'Can you work with remote clients?', a: 'Yes. We provide digital site dashboards and periodic progress videos so you are fully informed from anywhere in the world.', cat: 'services' },

      // Materials
      { q: 'Can I purchase premium panels without booking design services?', a: 'Absolutely. We hold material inventory directly in our godowns. You can purchase WPC, PVC, or sheets standalone.', cat: 'materials' },
      { q: 'What makes your materials premium?', a: 'We source globally to offer E0 eco-grade emission panels, waterproof WPC components, and scratch-resistant polygranite sheets.', cat: 'materials' },
      { q: 'Do you offer a digital catalogue?', a: 'Yes. You can preview the first 7 pages of our catalog directly. To download the full document, submit a brief consultation request.', cat: 'materials' },
    ];

    // Generate up to 25 programmatically to make a deep dataset
    for (let i = 0; i < 25; i++) {
      const isPredefined = i < faqQuestions.length;
      const qText = isPredefined ? faqQuestions[i].q : `FAQ Question ${i + 1} regarding our processes?`;
      const aText = isPredefined ? faqQuestions[i].a : `This is a pre-seeded answer detailing the specific construction or design guidelines. Every step at Espacio is fully documented and quality-checked.`;
      const catVal = isPredefined ? faqQuestions[i].cat : 'process';

      await FAQ.create({
        question: qText,
        answer: aText,
        category: catVal,
        displayOrder: i,
        createdBy: adminUser._id,
      });
    }
    console.log('25 FAQs seeded.');

    // 6. Seed 100+ Testimonials (programmatic generation)
    console.log('Generating 105 client testimonials...');
    const reviewerNames = [
      'Anand Rao', 'Srinivas Reddy', 'Meera Nair', 'Priya Konidela', 'Karan Johar', 
      'Ravi Teja', 'Sunitha Rao', 'Chandra Sekhar', 'Vikram Goud', 'Haritha Chawla'
    ];
    const feedbacks = [
      'The engineering precision is outstanding. Highly structural.',
      'Espacio transformed our duplex with walnut panel alignments that look incredibly high-end.',
      'Absolute turnkey delivery. Zero stress managing carpenters or electricians.',
      'Premium materials sourced directly. Highly durable. WPC panels are completely water-resistant.',
      'Bespoke luxury editorial style. Every guest complements our new custom TV Unit and lighting flow.',
    ];

    for (let i = 0; i < 105; i++) {
      const name = `${reviewerNames[i % reviewerNames.length]} ${String.fromCharCode(65 + (i % 26))}.`;
      const rating = i % 10 === 0 ? 4 : 5; // Mostly 5 stars, some 4 stars
      const hood = neighborhoods[i % neighborhoods.length];
      const feedbackText = feedbacks[i % feedbacks.length] + ' Built to last generations, reflecting their family construction heritage.';

      await Testimonial.create({
        clientName: name,
        projectType: `${i % 2 === 0 ? 'Villa' : 'Apartment'} in ${hood}`,
        rating,
        reviewText: feedbackText,
        featured: i < 10, // Feature first 10
        displayOrder: i,
        createdBy: adminUser._id,
      });
    }
    console.log('105 Testimonials seeded.');

    // 7. Seed General Settings (Office config, Business hours, SEO)
    console.log('Seeding default general settings...');
    await Settings.create({
      key: 'office_info',
      value: {
        address: 'Moinabad Road, Aziznagar',
        hours: '10 AM - 7:30 PM',
        email: 'Espacio.hyd@gmail.com',
        instagram: 'https://www.instagram.com/theespacio.in?igsh=MWswNjRtdjVscGF6MQ==',
        mapsLink: 'https://www.google.com/maps?q=17.348123,78.291234', // mock coordinates Aziznagar
      },
      createdBy: adminUser._id,
    });
    console.log('Settings key seeded.');

    console.log('Database Seeding successfully completed!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding crashed:', error);
    process.exit(1);
  }
};

seedData();
