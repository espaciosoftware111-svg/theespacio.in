import axios from 'axios';

// Shared space for real-time parallel synchronization between Admin CMS and Public Website

// Shared helper to upload an image file and return a clean, short permanent URL (/uploads/file.jpg)
export const uploadImageFile = async (file) => {
  if (!file) return null;
  const safeName = file.name.replace(/\s+/g, '_');
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      try {
        const res = await axios.post('/upload-media', { fileName: file.name, base64 });
        if (res.data && res.data.success && res.data.url) {
          resolve(res.data.url);
          return;
        }
      } catch (err) {
        console.warn('/upload-media endpoint warning:', err);
      }
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
};

export const STORAGE_KEYS = {
  PROJECTS: 'espacio_cms_projects',
  PRODUCTS: 'espacio_cms_products',
  SETTINGS: 'espacio_cms_settings',
  TESTIMONIALS: 'espacio_cms_testimonials',
  FAQS: 'espacio_cms_faqs',
  ENQUIRIES: 'espacio_cms_enquiries',
  ADMIN_USERS: 'espacio_cms_admin_users',
  AUDIT_LOGS: 'espacio_cms_audit_logs',
  MEDIA: 'espacio_cms_media',
};

// Setup cross-tab real-time sync channel
const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('espacio_cms_sync') : null;

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    if (event.data && event.data.type === 'CMS_UPDATED') {
      window.dispatchEvent(new Event('espacio_cms_update'));
    }
  };
}

// Dispatch change event to all tabs and active components
export const notifyCMSUpdate = () => {
  window.dispatchEvent(new Event('espacio_cms_update'));
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type: 'CMS_UPDATED', timestamp: Date.now() });
    } catch {}
  }
};

export const DEFAULT_PROJECTS = [
  {
    _id: 'proj_1_rajapushpa_provincia',
    order: 1,
    title: 'A 3BHK Residence, Narsingi',
    slug: 'rajapushpa-provincia-3bhk',
    category: 'apartment',
    area: '2,850 sq.ft.',
    location: 'Narsingi, Hyderabad',
    year: 2025,
    style: 'Contemporary Warm Minimalist',
    description: 'Warm wood tones, sculpted feature walls, and hidden lighting that transforms the mood room to room — this 3BHK turns every corner into something worth showing off. Every finish built to stay flawless for years, not just on move-in day.',
    story: {
      vision: 'The brief was clear from day one: give the client a living room that feels warm and welcoming the moment you walk in — never stiff, never showroom-y. We planned to bring in wood paneling with a soft vertical texture, pair it with a marble-look backdrop behind the TV, and layer the ceiling with gentle cove lighting that could shift the whole mood of the room after sunset. A statement chandelier would tie the space together — the goal was a room that works just as well for a quiet evening in as it does when guests are over.',
      challenges: 'The trickiest part was the feature wall — the one with all the arches and niches. Getting that wall to look like one flowing design, instead of a bunch of separate shapes stuck together, took a lot of careful planning. Every arch had to line up, every light strip had to sit exactly right, and the wall itself wasn\'t even flat to begin with — so we had to work around real-world imperfections while keeping the final look completely smooth.',
      solutions: 'Engineered custom lightweight composite backer structures with laser-guided leveling and integrated concealed magnetic shadowline profiles.',
      engineering: 'None of that "effortless" look happens by accident. Behind that wall is hidden wiring, precisely cut stone panels, and layered plasterwork — all planned out before a single piece went up, so nothing pokes through and nothing looks patched together later. That\'s really what you\'re paying for with us — not just how it looks on day one, but how solid it still feels five years down the line.',
      outcome: 'An impeccably detailed residential benchmark with zero visible hardware, ambient mood scenes, and seamless spatial flow.'
    },
    heroImage: '/images/projects/rajapushpa_provincia/rajapushpa_8.webp',
    gallery: [
      "/images/projects/rajapushpa_provincia/rajapushpa_after.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_1.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_2.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_3.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_4.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_5.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_6.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_7.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_8.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_9.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_10.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_11.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_12.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_13.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_14.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_15.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_16.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_17.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_18.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_19.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_20.webp"
    ],
    beforeImage: '/images/projects/rajapushpa_provincia/rajapushpa_before.webp',
    afterImage: '/images/projects/rajapushpa_provincia/rajapushpa_after.webp',
    beforeImages: ['/images/projects/rajapushpa_provincia/rajapushpa_before.webp'],
    afterImages: ['/images/projects/rajapushpa_provincia/rajapushpa_after.webp'],
    testimonialName: 'Dharma Teja',
    testimonialProfession: 'Homeowner, Rajapushpa Provincia',
    testimonialText: 'Working with ESPACIO for our 3BHK flat at Rajapushpa Provincia was an effortless experience from day one. Their attention to engineering tolerances, clean wood joinery, and on-time project handover exceeded our expectations. The house feels like an editorial luxury home.',
    testimonialRating: 5,
    testimonial: {
      name: 'Dharma Teja',
      profession: 'Homeowner, Rajapushpa Provincia',
      role: 'Homeowner, Rajapushpa Provincia, Narsingi',
      text: 'Working with ESPACIO for our 3BHK flat at Rajapushpa Provincia was an effortless experience from day one. Their attention to engineering tolerances, clean wood joinery, and on-time project handover exceeded our expectations. The house feels like an editorial luxury home.',
      rating: 5
    },
    featured: true,
    status: 'published'
  },
  {
    _id: 'proj_2_my_home_sayuk',
    order: 2,
    title: 'A 3BHK Residence, Tellapur',
    slug: 'my-home-sayuk-3bhk',
    category: 'apartment',
    area: '2,750 sq.ft.',
    location: 'Tellapur, Hyderabad',
    year: 2025,
    style: 'Japandi Contemporary Luxury',
    description: 'A calm, nature inspired home with raised wooden lounge platforms, delicate latticework screens, soft layered lighting throughout, and bedrooms designed to stay peaceful and quiet. Every corner was built to slow you down after a long day.',
    story: {
      vision: 'Ganesh wanted a home that felt calm the second he walked in. Natural wood tones, low relaxed seating, and plenty of daylight pouring into the main living area were all part of the plan. The idea was to create a space that could do two things at once. Give the family a quiet corner to unwind, and still open up easily when it was time to host friends and family.',
      challenges: 'One of the toughest parts was the raised wooden platform near the balcony. It had to sit perfectly flush against the floor to ceiling glass, with no gaps or awkward edges anywhere. At the same time, we needed to hide all the AC ducting inside slim ceiling drops running around the room, without making the ceiling feel low or boxed in.',
      solutions: 'Fabricated precision sub-frame floor joists with acoustic underlay buffers, combined with laser-cut geometric wooden screen dividers and flush-mounted indirect warm LED profiles.',
      engineering: 'To make that wooden platform work, we had to calculate exactly how much weight it could hold without any sagging or shifting over time. In the bedrooms, we also built in extra wall paneling designed to soften sound, so the rooms feel calmer and more private even in a busy household. It\'s the kind of detail you don\'t see, but you definitely feel every time you walk in.',
      outcome: 'An architectural masterpiece characterized by harmonious natural textures, zero visual clutter, and serene atmosphere.'
    },
    heroImage: '/images/projects/my_home_sayuk/sayuk_after_open_hall.webp',
    gallery: [
      "/images/projects/my_home_sayuk/sayuk_after_open_hall.webp",
      "/images/projects/my_home_sayuk/sayuk_4.webp",
      "/images/projects/my_home_sayuk/sayuk_5.webp",
      "/images/projects/my_home_sayuk/sayuk_6.webp",
      "/images/projects/my_home_sayuk/sayuk_1.webp",
      "/images/projects/my_home_sayuk/sayuk_2.webp",
      "/images/projects/my_home_sayuk/sayuk_3.webp",
      "/images/projects/my_home_sayuk/sayuk_7.webp"
    ],
    beforeImage: '/images/projects/my_home_sayuk/sayuk_before_raw.webp',
    afterImage: '/images/projects/my_home_sayuk/sayuk_after_open_hall.webp',
    beforeImages: ['/images/projects/my_home_sayuk/sayuk_before_raw.webp'],
    afterImages: ['/images/projects/my_home_sayuk/sayuk_after_open_hall.webp'],
    testimonialName: 'Ganesh',
    testimonialProfession: 'Homeowner, My Home Sayuk',
    testimonialText: 'ESPACIO transformed our 3BHK flat at My Home Sayuk into a serene, five-star retreat. The craftsmanship on the wood paneling, raised deck lounge, and bedroom wardrobes is world-class. The team\'s transparency and adherence to timelines made the entire journey hassle-free.',
    testimonialRating: 5,
    testimonial: {
      name: 'Ganesh',
      profession: 'Homeowner, My Home Sayuk',
      role: 'Homeowner, My Home Sayuk, Tellapur',
      text: 'ESPACIO transformed our 3BHK flat at My Home Sayuk into a serene, five-star retreat. The craftsmanship on the wood paneling, raised deck lounge, and bedroom wardrobes is world-class. The team\'s transparency and adherence to timelines made the entire journey hassle-free.',
      rating: 5
    },
    featured: true,
    status: 'published'
  },
  {
    _id: 'proj_3_kokapet_nagesh',
    order: 3,
    title: 'A 2BHK Residence, Kokapet',
    slug: 'kokapet-2bhk',
    category: 'apartment',
    area: '1,650 sq.ft.',
    location: 'Kokapet, Hyderabad',
    year: 2025,
    style: 'Contemporary Warm Minimalist',
    description: 'A refined 2BHK home with handleless modular cabinetry, a striking marble TV feature wall, a beautifully lit crockery display, and bedrooms designed purely for rest. Every inch was planned to feel bigger, brighter, and effortlessly put together.',
    story: {
      vision: 'Nagesh wanted his 2BHK to feel elegant without feeling tight. Even though the layout was compact, the goal was to make every room feel open, well lit, and thoughtfully planned. Clean modern lines, warm ambient lighting, and custom cabinetry built specifically for how he lives were all part of the plan from day one.',
      challenges: 'In a 2BHK, every inch matters. The real challenge was fitting in generous storage and a fully handleless kitchen and wardrobe system without the space ever feeling cramped or heavy. On top of that, the TV wall had to sit completely flush against the surrounding paneling, with no visible gaps or bulk breaking the clean look.',
      solutions: 'Engineered custom fluted wall paneling, integrated floating crockery and entertainment units, and premium modular storage solutions with soft-close German hardware.',
      engineering: 'Getting that seamless look meant planning the ceiling coves down to the millimeter, so the lighting sits perfectly aligned all the way around the room. The floating cabinetry needed strong hidden anchor points to carry its weight safely over time, and every surface was finished with an anti scratch coating so the home stays looking new for years, not just on the day it\'s handed over.',
      outcome: 'A flawless, turnkey residential masterpiece delivered on schedule with benchmark craftsmanship and enduring aesthetic charm.'
    },
    heroImage: '/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp',
    gallery: [
      "/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp",
      "/images/projects/kokapet_nagesh_2bhk/kokapet_hall.webp",
      "/images/projects/kokapet_nagesh_2bhk/kokapet_tv_unit.webp",
      "/images/projects/kokapet_nagesh_2bhk/kokapet_kitchen.webp",
      "/images/projects/kokapet_nagesh_2bhk/kokapet_crockery.webp",
      "/images/projects/kokapet_nagesh_2bhk/kokapet_master_bedroom.webp",
      "/images/projects/kokapet_nagesh_2bhk/kokapet_guest_bedroom.webp"
    ],
    beforeImage: '/images/projects/kokapet_nagesh_2bhk/kokapet_before.webp',
    afterImage: '/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp',
    beforeImages: ['/images/projects/kokapet_nagesh_2bhk/kokapet_before.webp'],
    afterImages: ['/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp'],
    testimonialName: 'Nagesh',
    testimonialProfession: 'Homeowner, Kokapet',
    testimonialText: 'ESPACIO delivered beyond our expectations for our 2BHK flat at Kokapet. The quality of materials, the finish of the modular kitchen, and the TV unit craftsmanship are top-notch. The team was highly professional, transparent, and completed the handover right on time. Highly recommended!',
    testimonialRating: 5,
    testimonial: {
      name: 'Nagesh',
      profession: 'Homeowner, Kokapet',
      role: 'Homeowner, Kokapet, Hyderabad',
      text: 'ESPACIO delivered beyond our expectations for our 2BHK flat at Kokapet. The quality of materials, the finish of the modular kitchen, and the TV unit craftsmanship are top-notch. The team was highly professional, transparent, and completed the handover right on time. Highly recommended!',
      rating: 5
    },
    featured: true,
    status: 'published'
  },
  {
    _id: 'proj_4_kokapet_rahul',
    order: 4,
    title: 'A 2BHK Residence, Kokapet',
    slug: 'kokapet-urban-2bhk',
    category: 'apartment',
    area: '1,450 sq.ft.',
    location: 'Kokapet, Hyderabad',
    year: 2025,
    style: 'Clean Contemporary Luxury',
    description: 'A bright, airy 2BHK with high gloss finishes, a bookmatched marble bedroom wall, sleek floating consoles, and calm bedroom retreats bathed in soft lighting. Every room was planned around comfort and light, giving Rahul a home that feels fresh from the moment he steps in.',
    story: {
      vision: 'Rahul wanted his 2BHK to feel clean and contemporary, with nothing crowding the space. Smooth spatial flow, high gloss surfaces, and generous modular storage were all part of the early plan, along with calm bedroom retreats that would feel like a proper escape from the rest of the day. In the main bedroom, the idea was to let one material do all the talking, a bookmatched marble wall running the full height behind the bed, quiet enough to relax into but striking enough to become the room\'s focal point.',
      challenges: 'With a compact high rise layout, every wardrobe shutter and cabinet had to line up perfectly, since even a small gap would stand out in such a tight space. We also wanted integrated LED lighting running along the ceiling edges, but without dropping the ceiling height in a home where every inch of headroom already mattered. That same lighting logic carried into the bedroom, where soft edge lighting needed to trace the marble wall just right, so the veining would glow after dark instead of getting lost in shadow.',
      solutions: 'Deployed moisture-resistant HDHMR core structures, German Häfele soft-close hardware, and laser-guided leveling for seamless wall-to-cabinet joints.',
      engineering: 'The floating TV console needed strong hidden anchors so it could hold its weight without any sagging over the years. We also ran mood lighting circuits flush into the ceiling across every room, so the light feels built into the architecture rather than added on top of it. The bedroom\'s marble panels were matched and aligned piece by piece before installation, so the pattern reads as one continuous sheet rather than a row of separate slabs. Small choices like these are what make a home feel finished rather than just decorated.',
      outcome: 'A pristine, modern 2BHK residence delivered on schedule with flawless finishes, high storage utility, and timeless contemporary appeal.'
    },
    heroImage: '/images/projects/kokapet_rahul_2bhk/rahul_after.webp',
    gallery: [
      "/images/projects/kokapet_rahul_2bhk/rahul_after.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_1.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_2.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_3.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_4.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_5.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_6.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_7.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_8.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_9.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_10.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_11.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_12.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_13.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_14.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_15.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_16.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_17.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_18.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_19.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_20.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_21.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_22.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_23.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_24.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_25.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_26.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_27.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_28.webp",
      "/images/projects/kokapet_rahul_2bhk/rahul_gallery_29.webp"
    ],
    beforeImage: '/images/projects/kokapet_rahul_2bhk/rahul_before.webp',
    afterImage: '/images/projects/kokapet_rahul_2bhk/rahul_after.webp',
    beforeImages: ['/images/projects/kokapet_rahul_2bhk/rahul_before.webp'],
    afterImages: ['/images/projects/kokapet_rahul_2bhk/rahul_after.webp'],
    testimonialName: 'Rahul',
    testimonialProfession: 'Homeowner, Kokapet',
    testimonialText: 'ESPACIO did a phenomenal job on our 2BHK home in Kokapet. The entire turnkey execution was seamless—from 3D drawings to final handover. The modular kitchen and bedroom wardrobes turned out stunning with impeccable build quality. Truly grateful to the ESPACIO team!',
    testimonialRating: 5,
    testimonial: {
      name: 'Rahul',
      profession: 'Homeowner, Kokapet',
      role: 'Homeowner, Kokapet, Hyderabad',
      text: 'ESPACIO did a phenomenal job on our 2BHK home in Kokapet. The entire turnkey execution was seamless—from 3D drawings to final handover. The modular kitchen and bedroom wardrobes turned out stunning with impeccable build quality. Truly grateful to the ESPACIO team!',
      rating: 5
    },
    featured: true,
    status: 'published'
  },
  {
    _id: 'proj_5_gandipet_kiran',
    order: 5,
    title: 'A 2BHK Residence, Gandipet',
    slug: 'gandipet-modern-retro-2bhk',
    category: 'apartment',
    area: '1,750 sq.ft.',
    location: 'Gandipet, Hyderabad',
    year: 2025,
    style: 'Modern Retro Timber',
    description: 'A warm, retro modern 2BHK with rich timber louvers, classic wall paneling, a dedicated home office corner, and richly layered lighting throughout. Every room mixes old world charm with modern comfort, giving Kiran a home that feels timeless rather than trendy.',
    story: {
      vision: 'Kiran wanted his 2BHK to feel warm and retro modern, somewhere between classic and contemporary. Rich natural timber, detailed wall paneling, and a proper home office zone were all part of the early plan, along with an entertainment wall that would anchor the living room and soft ambient lighting that would carry that warmth into every corner.',
      challenges: 'Getting those custom wooden slats and fluted panels to line up across the dining and study areas took a lot of careful planning, since even one visible joint or exposed screw would break the whole look. On top of that, every wall panel had to sit flush with the next, so the classic paneling reads as one continuous design instead of a patchwork of separate pieces.',
      solutions: 'Crafted interlocking tongue-and-groove wooden wall slats with concealed rear clip fasteners and integrated low-voltage LED profile channels.',
      engineering: 'Running LED lighting inside the timber framework meant working out proper heat management first, so the wood stays safe and doesn\'t warp or discolor over time. The TV wall also needed reinforced joinery underneath to carry its weight safely for years. It\'s the kind of planning that never shows on the surface, but it\'s exactly what keeps a home looking as good on day one thousand as it did on day one.',
      outcome: 'A warm, tactile, character-filled 2BHK residence with editorial-grade craftsmanship delivered turnkey on schedule.'
    },
    heroImage: '/images/projects/gandipet_kiran_2bhk/kiran_after.webp',
    gallery: [
      "/images/projects/gandipet_kiran_2bhk/kiran_after.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_1.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_3.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_4.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_5.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_6.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_7.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_8.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_9.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_10.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_11.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_12.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_13.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_14.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_15.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_16.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_17.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_18.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_19.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_20.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_21.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_22.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_23.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_24.webp"
    ],
    beforeImage: '/images/projects/gandipet_kiran_2bhk/kiran_before.webp',
    afterImage: '/images/projects/gandipet_kiran_2bhk/kiran_after.webp',
    beforeImages: ['/images/projects/gandipet_kiran_2bhk/kiran_before.webp'],
    afterImages: ['/images/projects/gandipet_kiran_2bhk/kiran_after.webp'],
    testimonialName: 'Kiran Raja',
    testimonialProfession: 'Homeowner, Gandipet',
    testimonialText: 'The craftsmanship delivered by ESPACIO for our 2BHK flat at Gandipet is unmatched. The natural wood timber finishes, acoustic wall paneling, and custom lighting transformed our home into a tranquil, five-star sanctuary. Great team, super transparent, and always on time!',
    testimonialRating: 5,
    testimonial: {
      name: 'Kiran Raja',
      profession: 'Homeowner, Gandipet',
      role: 'Homeowner, Gandipet, Hyderabad',
      text: 'The craftsmanship delivered by ESPACIO for our 2BHK flat at Gandipet is unmatched. The natural wood timber finishes, acoustic wall paneling, and custom lighting transformed our home into a tranquil, five-star sanctuary. Great team, super transparent, and always on time!',
      rating: 5
    },
    featured: true,
    status: 'published'
  },
  {
    _id: 'proj_6_kondapur_venkatesh',
    order: 6,
    title: 'A 2BHK Residence, Kondapur',
    slug: 'kondapur-minimalist-2bhk',
    category: 'apartment',
    area: '1,520 sq.ft.',
    location: 'Kondapur, Hyderabad',
    year: 2025,
    style: 'Contemporary Minimalist Gray',
    description: 'A clean, contemporary 2BHK built around a calming grey palette, full height wardrobes, a sleek floating media wall, and a kitchen designed for real everyday use. Every detail here was chosen to keep the home feeling open, organized, and quietly luxurious.',
    story: {
      vision: 'Venkatesh wanted his 2BHK to feel contemporary and composed, built around clean geometric lines and a soft monochromatic grey palette. The kitchen needed to work as hard as it looked good, with smart, efficient storage built in from the start, and the bedrooms were planned as proper retreats, calm spaces to unwind at the end of the day.',
      challenges: 'Fitting in full height wardrobes and a floating media unit without the rooms feeling boxed in took careful planning. We had to protect the open walkway space and make sure natural light could still move freely through the apartment, so the extra storage never came at the cost of how open the home felt.',
      solutions: 'Engineered seamless floor-to-ceiling acrylic wardrobes with concealed edge pulls, ultra-matte cabinetry finishes, and integrated architectural perimeter cove lighting.',
      engineering: 'Every cabinet and wardrobe was built using moisture resistant boards paired with premium soft close hardware, so the doors stay smooth and quiet for years, even in Hyderabad\'s humidity. Cable routing was also planned and hidden from the start, so the entertainment wall stays clean and clutter free, with nothing dangling or exposed to spoil the look.',
      outcome: 'A sleek, modern 2BHK residence with pristine geometric alignment, maximum storage utility, and timeless contemporary luxury.'
    },
    heroImage: '/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp',
    gallery: [
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_1.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_2.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_3.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_4.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_5.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_6.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_7.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_8.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_9.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_10.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_11.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_12.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_13.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_14.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_15.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_16.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_17.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_18.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_19.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_20.webp",
      "/images/projects/kondapur_venkatesh_2bhk/venkatesh_gallery_21.webp"
    ],
    beforeImage: '/images/projects/kondapur_venkatesh_2bhk/venkatesh_before.webp',
    afterImage: '/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp',
    beforeImages: ['/images/projects/kondapur_venkatesh_2bhk/venkatesh_before.webp'],
    afterImages: ['/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp'],
    testimonialName: 'Venkatesh',
    testimonialProfession: 'Homeowner, Kondapur',
    testimonialText: 'ESPACIO did an extraordinary job turning our 2BHK flat in Kondapur into our dream home. The contemporary gray modular kitchen and custom TV unit finish are flawless. Everything was handled professionally with complete transparency. Highly recommend ESPACIO!',
    testimonialRating: 5,
    testimonial: {
      name: 'Venkatesh',
      profession: 'Homeowner, Kondapur',
      role: 'Homeowner, Kondapur, Hyderabad',
      text: 'ESPACIO did an extraordinary job turning our 2BHK flat in Kondapur into our dream home. The contemporary gray modular kitchen and custom TV unit finish are flawless. Everything was handled professionally with complete transparency. Highly recommend ESPACIO!',
      rating: 5
    },
    featured: true,
    status: 'published'
  }
,
  {
    _id: 'proj_7_gachibowli_koteswara',
    order: 7,
    title: 'A 2BHK Residence, Gachibowli',
    slug: 'gachibowli-minimalist-beige-2bhk',
    category: 'apartment',
    area: '1,480 sq.ft.',
    location: 'Gachibowli, Hyderabad',
    year: 2025,
    style: 'Minimalist Warm Beige',
    description: 'A calm, uncluttered 2BHK built around soft beige tones, seamless wardrobe integration, and warm ambient light throughout. Every corner was planned to feel peaceful, with a home entry that still makes a striking first impression.',
    story: {
      vision: 'Koteswara Rao wanted his 2BHK to feel calm and completely clutter free, built around a soft beige palette that would carry through every room. Wardrobes were planned to blend directly into the walls rather than stand out, with a cozy reading corner and warm ambient lighting designed to make the whole home feel like a place to unwind.',
      challenges: 'Getting the fluted wall panels to run continuously across the living area and master bedroom, with doors that disappear flush into the paneling, took a lot of careful planning. Every panel had to line up perfectly, and the wood grain had to match seamlessly from one section to the next, so nothing ever looked pieced together.',
      solutions: 'Utilized calibrated HDHMR boards with anti-scratch PU coatings, precision CNC routed fluting, and hidden soft-close hinges.',
      engineering: 'Ceiling channels were built in to house warm, high quality LED lighting that softly washes across the textured walls, bringing out the natural grain without ever feeling harsh. Even the entryway got the same attention to detail, with a striking gold console table and framed wall accents that turn a simple hallway into a proper welcome home moment.',
      outcome: 'A tranquil, sophisticated 2BHK haven delivering five-star hotel comfort with pristine finishes on schedule.'
    },
    heroImage: '/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp',
    gallery: [
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_1.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_2.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_3.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_4.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_5.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_6.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_7.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_8.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_9.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_10.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_11.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_12.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_13.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_14.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_15.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_16.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_17.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_18.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_19.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_20.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_21.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_22.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_23.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_24.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_25.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_26.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_27.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_28.webp"
    ],
    beforeImage: '/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp',
    afterImage: '/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp',
    beforeImages: ['/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp'],
    afterImages: ['/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp'],
    testimonialName: 'Koteswara Rao',
    testimonialProfession: 'Homeowner, Gachibowli',
    testimonialText: 'ESPACIO transformed our Gachibowli 2BHK flat into a breathtaking, tranquil sanctuary. The soft minimalist beige tones, master bedroom wardrobes, and elegant living room finishes exceeded all our expectations. Seamless execution and timely handover!',
    testimonialRating: 5,
    testimonial: {
      name: 'Koteswara Rao',
      profession: 'Homeowner, Gachibowli',
      role: 'Homeowner, Gachibowli, Hyderabad',
      text: 'ESPACIO transformed our Gachibowli 2BHK flat into a breathtaking, tranquil sanctuary. The soft minimalist beige tones, master bedroom wardrobes, and elegant living room finishes exceeded all our expectations. Seamless execution and timely handover!',
      rating: 5
    },
    featured: true,
    status: 'published'
  }
,
  {
    _id: 'proj_8_kachiguda_subbarao',
    order: 8,
    title: 'A Duplex Residence, Kachiguda',
    slug: 'kachiguda-fusion-duplex-villa',
    category: 'duplex',
    area: '3,800 sq.ft.',
    location: 'Kachiguda, Hyderabad',
    year: 2025,
    style: 'Modern & Traditional Fusion',
    description: 'A grand duplex built for a multi generational family, blending modern comfort with the warmth of traditional Indian design. From a striking staircase to a kids room wrapped in a vintage airplane blueprint mural, every level tells its own story while still feeling like one connected home.',
    story: {
      vision: 'K Subbarao wanted a duplex that could hold the whole family comfortably, parents and children, while still feeling like one cohesive home rather than two separate floors stitched together. The plan blended modern luxury with rich touches of Indian design heritage, so the home would feel current without losing its cultural warmth. For the boys\' room, the idea was to give them something entirely their own, a space with personality and imagination built right into the walls.',
      challenges: 'With multiple ceiling levels and a double height space to design around, keeping a consistent look across both the parents\' and the boys\' suites took real care. Every material and color choice had to feel connected across floors, so the home reads as one story from top to bottom instead of feeling like two different houses stacked together. In the boys\' room specifically, we wanted a bold vintage airplane blueprint mural to feel like a natural extension of the room, not just wallpaper slapped on, so the furniture, lighting, and colors all had to work around it rather than against it.',
      solutions: 'Bespoke fluted wood paneling, premium PU lacquer detailing, high-durability acrylic storage systems, and ambient architectural cove lighting.',
      engineering: 'Wiring was routed carefully through the multi level ceilings so nothing was ever left exposed, and lighting was layered at different heights to bring warmth into every corner, including the dramatic double height areas. The plywood used throughout was specially treated to resist warping over time, so the home holds its shape and finish for years, not just for the first few seasons. Even the statement mural in the boys\' room was planned around the lighting fixtures above it, so the pendant lights complement the artwork instead of casting awkward shadows across it.',
      outcome: 'A magnificent, warm duplex masterpiece celebrated for its craftsmanship and delivered with turnkey precision.'
    },
    heroImage: '/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp',
    gallery: [
      "/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_1.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_2.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_3.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_4.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_5.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_6.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_7.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_8.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_9.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_10.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_11.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_12.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_13.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_14.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_15.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_16.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_17.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_18.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_19.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_20.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_21.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_22.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_23.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_24.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_25.webp",
      "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_26.webp"
    ],
    beforeImage: '/images/projects/kachiguda_subbarao_duplex/subbarao_before.webp',
    afterImage: '/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp',
    beforeImages: ['/images/projects/kachiguda_subbarao_duplex/subbarao_before.webp'],
    afterImages: ['/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp'],
    testimonialName: 'K Subbarao',
    testimonialProfession: 'Homeowner, Kachiguda',
    testimonialText: 'ESPACIO created an absolute masterpiece with our Duplex home in Kachiguda. The modern fusion living area, boys bedrooms, and parents suite are designed with immaculate craftsmanship and attention to detail. Truly a five-star experience from start to finish!',
    testimonialRating: 5,
    testimonial: {
      name: 'K Subbarao',
      profession: 'Homeowner, Kachiguda',
      role: 'Homeowner, Kachiguda, Hyderabad',
      text: 'ESPACIO created an absolute masterpiece with our Duplex home in Kachiguda. The modern fusion living area, boys bedrooms, and parents suite are designed with immaculate craftsmanship and attention to detail. Truly a five-star experience from start to finish!',
      rating: 5
    },
    featured: true,
    status: 'published'
  }
];

// ─── DEFAULT PRODUCTS / MATERIALS LIBRARY ────────────────────────────────────
export const DEFAULT_PRODUCTS = [
  {
    title: 'Acrylic Luxe Collection',
    slug: 'acrylic-luxe-collection',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-01',
    badge: 'Premium Finish',
    description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
    heroImage: '/images/materials/luminous_grid_8313.jpg',
    features: ['High-Gloss', 'Anti-Scratch', 'Concealed Track'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true
  },
  {
    title: 'Digital Korean Poly Granite',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    materialCode: 'MAT-GNT-02',
    badge: 'Marble Textures',
    description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
    heroImage: '/images/materials/florida.png',
    features: ['Scratch-Proof', 'Marble Finish', 'Heat Resistant'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true
  },
  {
    title: 'Charcoal Panels Luxe Collection',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-03',
    badge: 'Textured Accents',
    description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
    heroImage: '/images/materials/charcoal_luxe_4015.jpg',
    features: ['Air Purifying', 'Premium Texture', 'Acoustic Dampening'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true
  },
  {
    title: 'Fluted PVC Luxe Collection',
    slug: 'fluted-pvc-luxe',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-04',
    badge: 'Architectural Panels',
    description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
    heroImage: '/images/materials/irish.png',
    features: ['Waterproof', 'Easy Install', 'Flame Retardant'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true
  },
  {
    title: 'LVT Luxe Flooring',
    slug: 'lvt-luxe-flooring',
    category: 'Wood & Flooring',
    materialCode: 'MAT-FLR-05',
    badge: 'Luxury Vinyl',
    description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
    heroImage: '/images/materials/giallo_dining.png',
    features: ['Durable', 'Water-Resistant', 'Soft Acoustic Tread'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true
  },
  {
    title: 'Fluted Acrylic Luxe Collection',
    slug: 'fluted-acrylic-luxe',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-06',
    badge: '3D Relief',
    description: 'Dynamic fluted acrylic panels creating sophisticated shadow play for luxury interiors.',
    heroImage: '/images/materials/fluted_acrylic_florida.jpg',
    features: ['3D Relief', 'High-Gloss', 'Backlit Ready'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true
  },
  {
    title: 'PVC Luxe Collection',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-07',
    badge: 'Versatile Panels',
    description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
    heroImage: '/images/materials/pvc_luxe_5003_5004.jpg',
    features: ['Lightweight', 'Fire Retardant', 'Moisture Proof'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true
  },
  {
    title: 'WPC Luxe Collection',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    materialCode: 'MAT-WPC-08',
    badge: 'Wood Composite',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
    heroImage: '/images/materials/wpc_luxe_1701_1606.jpg',
    features: ['100% Waterproof', 'Termite Proof', 'Zero Swelling'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true
  },
  {
    title: 'Espacio Charcoal Panels Luxe Collection (1)',
    slug: 'charcoal-panels-luxe-1',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-09',
    badge: 'Textured Accents',
    description: 'Additional selection of richly textured wall panels infused with active charcoal.',
    heroImage: '/images/materials/charcoal_luxe_1_6015.jpg',
    features: ['Premium Texture', 'Acoustic Relief', 'Modern Aesthetic'],
    status: 'published',
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true
  }
];

// ─── DEFAULT FAQS ─────────────────────────────────────────────────────────────
export const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    q: 'How long does a project usually take?',
    question: 'How long does a project usually take?',
    a: 'Most projects take about two to three months from start to finish. The exact timeline depends on how detailed and customized your space is, but we\'ll give you a clear schedule before work begins so there are no surprises along the way.',
    answer: 'Most projects take about two to three months from start to finish. The exact timeline depends on how detailed and customized your space is, but we\'ll give you a clear schedule before work begins so there are no surprises along the way.',
    img: '/images/faq/faq_1_timeline.jpg',
    image: '/images/faq/faq_1_timeline.jpg',
    imageLabel: 'TIMELINE',
    imageCaption: 'How long does a project usually take?',
    tag: 'Timeline',
    category: 'TIMELINE',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 1,
    homeOrder: 1,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-2',
    q: 'Do you provide turnkey interior solutions?',
    question: 'Do you provide turnkey interior solutions?',
    a: 'Yes. Every project we take on, whether it\'s a home or a commercial space, is handled fully by our own team. Design, materials, execution, and final finishing all happen under one roof, so you\'re never left coordinating between different vendors.',
    answer: 'Yes. Every project we take on, whether it\'s a home or a commercial space, is handled fully by our own team. Design, materials, execution, and final finishing all happen under one roof, so you\'re never left coordinating between different vendors.',
    img: '/images/faq/faq_2_services.jpg',
    image: '/images/faq/faq_2_services.jpg',
    imageLabel: 'SERVICES',
    imageCaption: 'Do you provide turnkey interior solutions?',
    tag: 'Services',
    category: 'SERVICES',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 2,
    homeOrder: 2,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-3',
    q: 'What is your consultation process?',
    question: 'What is your consultation process?',
    a: 'We start with a consultation to understand your space, your needs, and how you actually want to live in it. From there, we move into detailed design and planning, so nothing gets built until the vision is fully worked out.',
    answer: 'We start with a consultation to understand your space, your needs, and how you actually want to live in it. From there, we move into detailed design and planning, so nothing gets built until the vision is fully worked out.',
    img: '/images/faq/faq_3_process.jpg',
    image: '/images/faq/faq_3_process.jpg',
    imageLabel: 'PROCESS',
    imageCaption: 'What is your consultation process?',
    tag: 'Process',
    category: 'PROCESS',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 3,
    homeOrder: 3,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-4',
    q: 'Which locations do you currently serve?',
    question: 'Which locations do you currently serve?',
    a: 'We\'re based in Hyderabad and have delivered homes and commercial spaces across the city.',
    answer: 'We\'re based in Hyderabad and have delivered homes and commercial spaces across the city.',
    img: '/images/faq/faq_4_location.jpg',
    image: '/images/faq/faq_4_location.jpg',
    imageLabel: 'LOCATION',
    imageCaption: 'Which locations do you currently serve?',
    tag: 'Location',
    category: 'LOCATION',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 4,
    homeOrder: 4,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-5',
    q: 'How can customers request a quotation?',
    question: 'How can customers request a quotation?',
    a: 'Just fill out the contact form on our website, and our team will personally reach out to understand your project and walk you through next steps.',
    answer: 'Just fill out the contact form on our website, and our team will personally reach out to understand your project and walk you through next steps.',
    img: '/images/faq/faq_5_pricing.jpg',
    image: '/images/faq/faq_5_pricing.jpg',
    imageLabel: 'PRICING',
    imageCaption: 'How can customers request a quotation?',
    tag: 'Pricing',
    category: 'PRICING',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 5,
    homeOrder: 5,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-6',
    q: 'Do you sell materials separately from design services?',
    question: 'Do you sell materials separately from design services?',
    a: 'Yes. Materials like WPC panels, polygranite sheets, and acrylic sheets are available for standalone purchase, even if you\'re not booking a full design or execution project with us.',
    answer: 'Yes. Materials like WPC panels, polygranite sheets, and acrylic sheets are available for standalone purchase, even if you\'re not booking a full design or execution project with us.',
    img: '/images/faq/faq_6_materials.jpg',
    image: '/images/faq/faq_6_materials.jpg',
    imageLabel: 'MATERIALS',
    imageCaption: 'Do you sell materials separately from design services?',
    tag: 'Materials',
    category: 'MATERIALS',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 6,
    homeOrder: 6,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-7',
    q: 'What if I already have a design in mind, can you just execute it?',
    question: 'What if I already have a design in mind, can you just execute it?',
    a: 'Of course. Whether you already have a finalized design or need us to build one from scratch, we can step in wherever you need us, whether that\'s execution only or a complete design and build package.',
    answer: 'Of course. Whether you already have a finalized design or need us to build one from scratch, we can step in wherever you need us, whether that\'s execution only or a complete design and build package.',
    img: '/images/faq/faq_8_custom.jpg',
    image: '/images/faq/faq_8_custom.jpg',
    imageLabel: 'CUSTOM',
    imageCaption: 'What if I already have a design in mind, can you just execute it?',
    tag: 'Custom',
    category: 'CUSTOM',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 7,
    homeOrder: 7,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-8',
    q: 'Can I customize designs, or do you offer fixed packages?',
    question: 'Can I customize designs, or do you offer fixed packages?',
    a: 'Every project is designed around your space and your preferences. We don\'t work off fixed templates or one size fits all packages, so what you get is built specifically for you.',
    answer: 'Every project is designed around your space and your preferences. We don\'t work off fixed templates or one size fits all packages, so what you get is built specifically for you.',
    img: '/images/faq/faq_9_design.jpg',
    image: '/images/faq/faq_9_design.jpg',
    imageLabel: 'DESIGN',
    imageCaption: 'Can I customize designs, or do you offer fixed packages?',
    tag: 'Design',
    category: 'DESIGN',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 8,
    homeOrder: 8,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-9',
    q: 'Do you provide warranties on completed projects?',
    question: 'Do you provide warranties on completed projects?',
    a: 'Yes. We offer up to ten year comprehensive warranties on hardware and core modular components, backed directly by factory certification.',
    answer: 'Yes. We offer up to ten year comprehensive warranties on hardware and core modular components, backed directly by factory certification.',
    img: '/images/faq/faq_10_support.jpg',
    image: '/images/faq/faq_10_support.jpg',
    imageLabel: 'SUPPORT',
    imageCaption: 'Do you provide warranties on completed projects?',
    tag: 'Support',
    category: 'SUPPORT',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 9,
    homeOrder: 9,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-10',
    q: 'What does the design and execution process actually look like?',
    question: 'What does the design and execution process actually look like?',
    a: 'We start with a design consultation to understand your space and what you\'re looking for. Once the overall theme is locked in, we move into 3D visualizations so you can see exactly how the space will look before anything is built. After the designs are finalized, our team takes over execution, keeping you updated along the way until final handover.',
    answer: 'We start with a design consultation to understand your space and what you\'re looking for. Once the overall theme is locked in, we move into 3D visualizations so you can see exactly how the space will look before anything is built. After the designs are finalized, our team takes over execution, keeping you updated along the way until final handover.',
    img: '/images/faq/faq_7_involvement.jpg',
    image: '/images/faq/faq_7_involvement.jpg',
    imageLabel: 'PROCESS',
    imageCaption: 'What does the design and execution process actually look like?',
    tag: 'Process',
    category: 'PROCESS',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 10,
    homeOrder: 10,
    status: 'Published',
    visible: true
  }
];

// ─── DEFAULT SERVICES ─────────────────────────────────────────────────────────
export const DEFAULT_SERVICES = [
  { 
    num: '01', 
    title: 'Full Home Interior Design and Execution', 
    tag: 'Turnkey Design & Build', 
    desc: 'A complete home interior, planned and built by one team from the very first idea to the day you move in. We bring together custom joinery, thoughtful lighting, and premium finishes, so every room feels like part of one cohesive home rather than a set of separate decisions.', 
    includes: [
      'Living & Dining Layouts Built Around You',
      'Kitchens Designed for Real Everyday Use',
      'Curated Wall & Surface Finishes',
      'Wardrobes Tailored to How You Store',
      'Lighting That Sets the Mood, Room by Room',
      'Full Execution, Managed Start to Finish'
    ], 
    img: '/images/company/2bhk_mordern_retro/hall.jpg',
    ctaText: 'Enquire About Residential Interiors',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 1
  },
  { 
    num: '02', 
    title: 'Commercial and Office Interiors', 
    tag: 'Workspaces & Retail', 
    desc: 'A space that works as hard as your business does. For retail and experience stores, we design around your product, using layout, lighting, and material choices that make what you sell the hero of the room and turn browsing into buying. For offices, we build spaces that reflect how your brand wants to be seen, while keeping the day to day workflow smooth, quiet, and genuinely comfortable for the people working in it.', 
    includes: [
      'Store Layouts That Highlight Your Product',
      'Retail Flow Designed to Guide the Customer',
      'Offices Built Around How Your Team Works',
      'Quiet, Distraction Free Meeting Spaces',
      'Clean Tech and Cabling, Nothing on Show',
      'Full Commercial Buildout, Start to Finish'
    ], 
    img: '/images/company/2bhk_mordern_retro/office_3.jpg',
    ctaText: 'Enquire About Commercial Fit-Outs',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 2
  },
  { 
    num: '03', 
    title: 'Styling and Decor', 
    tag: 'Curated Styling', 
    desc: 'The finishing touches that turn a finished space into a home you actually feel something in. This works as its own standalone service, or as the final layer we add to wrap up any full Espacio project.', 
    includes: [
      'Art and Wall Decor, Chosen With Intent',
      'Lighting and Accessories That Set the Mood',
      'Colors That Work Together, Not Against Each Other',
      'Soft Furnishings Made to Match Your Space',
      'Greenery Picked to Suit the Light and Layout',
      'A Styling Review for Homes Already Done'
    ], 
    img: '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Guest_restaurant_20-20260810-120432.jpg',
    ctaText: 'Enquire About Styling Services',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 3
  },
  { 
    num: '04', 
    title: 'Renovation', 
    tag: 'Upgrade Existing Spaces', 
    desc: "Your space already has good bones, it just needs the right hands on it. Whether it's a home that's grown tired over the years or a commercial space ready for a refresh, we take what's already there and rebuild it into something that actually feels new. No need to move out, start from scratch, or manage the process yourself, our team handles the design, materials, and execution from beginning to end.", 
    includes: [
      'Outdated Kitchens and Bathrooms, Modernized',
      'Living Spaces Reworked to Feel New Again',
      'Structural Changes Handled Safely and Properly',
      'Old Flooring Replaced With Finishes Built to Last',
      'Electrical and Plumbing Re-Laid the Right Way',
      'A Fully Managed Renovation, Start to Finish'
    ], 
    img: '/images/services/services_after.webp',
    ctaText: 'Enquire About Renovation',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 4
  },
  { 
    num: '05', 
    title: 'Materials Supply (Standalone Purchase)', 
    tag: 'Direct Warehouse Sourcing', 
    desc: "Need premium materials without a full design project attached? Our warehouse across Andhra Pradesh and Telangana carries a wide range of WPC wall and ceiling panels, polygranite sheets, acrylic fluted louvers, and hardware, all available to purchase directly, whether you're a homeowner, a contractor, or a fellow designer.", 
    includes: [
      'Wall and Exterior Cladding Panels',
      'Fluted Louvers in Charcoal and Wood Grain Finishes',
      'High-Gloss Acrylic and Polygranite Sheets',
      'Trim and Edge Hardware for a Clean Finish',
      'Wholesale and Retail Purchase Available',
      'Fast Delivery Straight From Our Hyderabad Warehouse'
    ], 
    img: '/images/services/service_materials.jpg',
    ctaText: 'Enquire About Materials',
    ctaLink: '/materials',
    hasSecondaryLink: true,
    ctaVisible: true,
    visible: true,
    order: 5
  }
];

// ─── DEFAULT TESTIMONIALS (Authentic Google Reviews) ──────────────────────────
export const DEFAULT_TESTIMONIALS = [
  { id: 'g_rev_01', googleReviewId: 'g_rev_01', source: 'GOOGLE', name: 'Dharma Teja', designation: 'Local Guide • 97 Reviews • 383 Photos', title: 'Best Interior Designer Decision', body: 'I was researching the best interior designer near me, and while doing that, I came across ESPACIO. Eventually, we hired them, and it turned out to be a good decision. The interior designer was nice, the quality of the materials and finishing was great.', rating: 5, avatar: '/reviews/dharma_teja.png', date: '2 months ago', visible: true, featured: true, order: 1, response: 'Thank you sir, for your support and valuable feedback' },
  { id: 'g_rev_02', googleReviewId: 'g_rev_02', source: 'GOOGLE', name: 'Ganesh Nayak143', designation: 'Homeowner • Family Home Interiors', title: 'Practical Finishes & Organised Living', body: 'For our family home, we wanted interiors that looked good but were easy to maintain. Espacio suggested practical finishes and storage options based on our daily use. The bedrooms feel comfortable and the kitchen is much more organised now. We are happy with the overall outcome.', rating: 5, avatar: '/reviews/ganesh_nayak.png', date: '23 minutes ago', visible: true, featured: true, order: 2 },
  { id: 'g_rev_03', googleReviewId: 'g_rev_03', source: 'GOOGLE', name: 'Khaleel Shaik', designation: 'Interior Designer • 1 Review • 4 Photos', title: 'Largest Variety of Laminates, Veneers & Plywood', body: 'As an interior designer, I have found the largest variety of laminates, vineers, and plywood with all ranges of economy, premium and super premium as required by different customer segments at the best competitive rates. My suggestion for all to visit this place once before you buy.', rating: 5, avatar: '/reviews/khaleel_shaik.png', date: '5 months ago', visible: true, featured: true, order: 3, response: 'Thank you so much for your valuable feedback, look forward to assisting you again in your future projects!' },
  { id: 'g_rev_04', googleReviewId: 'g_rev_04', source: 'GOOGLE', name: 'Juttiga Vaishnavi', designation: 'Homeowner • 3BHK Minimalist Interior', title: 'Clean Minimal Look & Great Material Guidance', body: 'We wanted a modern, minimal look for our 3BHK and specifically wanted to avoid too many decorative elements. Espacio understood that direction well. The colour combination and storage solutions came together nicely. We also liked that the team was willing to explain why certain materials were better for particular areas.', rating: 5, avatar: '/reviews/juttiga_vaishnavi.png', date: 'an hour ago', visible: true, featured: true, order: 4 },
  { id: 'g_rev_05', googleReviewId: 'g_rev_05', source: 'GOOGLE', name: 'Sunkari santosh', designation: 'Google Reviewer • 2 Reviews', title: 'Professional & Great Interior and Exterior Elevation', body: 'Very professional and passionate towards their work. Taken good time to complete our project we are very happy and satisfied with quality material given by them very good Outlook for my interior and exterior building elevation.', rating: 5, avatar: '/reviews/sunkari_santosh.png', date: '3 days ago', visible: true, featured: true, order: 5 },
  { id: 'g_rev_06', googleReviewId: 'g_rev_06', source: 'GOOGLE', name: 'Nani Varma', designation: 'Google Reviewer • 1 Review', title: 'Professional Reception & Functional Workspaces', body: 'Our requirement was a professional reception area along with functional workspaces. Espacio suggested a layout that made better use of the available area. The reception now gives a much better first impression, while the work area remains comfortable for the staff. Good experience overall.', rating: 5, avatar: '/reviews/nani_varma.png', date: '2 hours ago', visible: true, featured: true, order: 6 },
  { id: 'g_rev_07', googleReviewId: 'g_rev_07', source: 'GOOGLE', name: 'ABDUL SATTAR', designation: 'Homeowner • 2BHK Renovation', title: 'Transparent Budget Prioritisation for 2BHK', body: 'We had a clear budget for our 2BHK and told the team from the beginning. Instead of pushing everything as premium, they helped us prioritise what mattered most. That was something we appreciated. The house now looks fresh, and we were able to stay close to the plan we discussed.', rating: 5, avatar: '/reviews/abdul_sattar.png', date: 'a day ago', visible: true, featured: true, order: 7 },
  { id: 'g_rev_08', googleReviewId: 'g_rev_08', source: 'GOOGLE', name: 'Rafi Shaik', designation: 'Homeowner • 2BHK Turnkey', title: 'Clean Finish & Responsive Site Team', body: 'We got our 2BHK interiors done with Espacio Interiors & Modular. The team understood what we wanted and suggested practical options instead of simply adding more things. The modular kitchen storage came out really well and the overall finish looks clean. The site team was also responsive whenever we had a question.', rating: 5, avatar: '/reviews/rafi_shaik.png', date: '2 days ago', visible: true, featured: true, order: 8 },
  { id: 'g_rev_09', googleReviewId: 'g_rev_09', source: 'GOOGLE', name: 'Lovely boy Laxman', designation: 'Homeowner • 1 Review • 3 Photos', title: 'Luxurious House at Reasonable Prices', body: 'Good equipment and well staff my house is now completely become luxurious with reasonable prices and thanks to espacio', rating: 5, avatar: '/reviews/lovely_boy_laxman.png', date: '5 months ago', visible: true, featured: true, order: 9, response: 'Thank you for your feedback! We’re glad you had a good experience with Espacio Interiors & Modular.' },
  { id: 'g_rev_10', googleReviewId: 'g_rev_10', source: 'GOOGLE', name: 'Shaik BOB', designation: 'Google Reviewer • 3 Reviews • 3 Photos', title: 'Wide Range of Collections & Patient Service', body: 'Recently visited the store they have wide range of varieties and the customer service was very good they were very patient and understanding', rating: 5, avatar: '/reviews/shaik_bob.png', date: 'a year ago', visible: true, featured: true, order: 10, response: 'Thank you so much for visiting Espacio Interiors & Modular!' },
  { id: 'g_rev_11', googleReviewId: 'g_rev_11', source: 'GOOGLE', name: 'Shaik Hussian', designation: 'Google Reviewer • 1 Review', title: 'Excellent Materials for Home & Office', body: 'Excellent materials for interior at home or office so pls visit this Espacio interiors and modular. Thank you...! ❤️', rating: 5, avatar: '/reviews/shaik_hussain.png', date: '5 months ago', visible: true, featured: true, order: 11 },
  { id: 'g_rev_12', googleReviewId: 'g_rev_12', source: 'GOOGLE', name: 'KoteswaraRao Alaparthi', designation: 'Local Guide • 4 Reviews • 62 Photos', title: 'Good Quality Materials & Affordable Prices', body: 'Good quality of materials and affordable prices. Great experience working with ESPACIO Interiors & Modular.', rating: 5, avatar: '/reviews/koteswararao_alaparthi.png', date: '5 months ago', visible: true, featured: true, order: 12 },
  { id: 'g_rev_13', googleReviewId: 'g_rev_13', source: 'GOOGLE', name: 'Jani Basha', designation: 'Google Reviewer • 4 Reviews', title: 'Good Service & Excellent Work 👍👏', body: 'Good service excellent work 👍👏 Very happy with Espacio Interiors & Modular service quality.', rating: 5, avatar: '/reviews/jani_basha.png', date: '5 months ago', visible: true, featured: true, order: 13 },
  { id: 'g_rev_14', googleReviewId: 'g_rev_14', source: 'GOOGLE', name: 'Amresh kumar', designation: 'Google Reviewer • 1 Review', title: 'Good Experience and Excellent Service', body: 'Good experience and excellent service provided by Espacio Interiors & Modular.', rating: 5, avatar: '/reviews/amresh_kumar.png', date: '4 months ago', visible: true, featured: true, order: 14, response: 'Thank you sir' },
  { id: 'g_rev_15', googleReviewId: 'g_rev_15', source: 'GOOGLE', name: 'G Rakesh', designation: 'Google Reviewer • 3 Reviews', title: 'Exceptional Modular Craftsmanship & Quality', body: 'Exceptional craftsmanship and smooth execution on modular wardrobes. The team at Espacio delivered top quality finishes.', rating: 5, avatar: '/reviews/g_rakesh.png', date: '3 months ago', visible: true, featured: true, order: 15 },
  { id: 'g_rev_16', googleReviewId: 'g_rev_16', source: 'GOOGLE', name: 'RAJU PALADUGU', designation: 'Google Reviewer • 1 Review', title: 'Good Work & Good Communication 👍', body: 'Good work and good communication 👍 The team at Espacio delivered our project smoothly and transparently.', rating: 5, avatar: '/reviews/paladugu_raju.png', date: '5 months ago', visible: true, featured: true, order: 16 },
  { id: 'g_rev_17', googleReviewId: 'g_rev_17', source: 'GOOGLE', name: 'Yadidya', designation: 'Google Reviewer • 3 Reviews', title: 'Good Work', body: 'Good work done on time.', rating: 5, avatar: '/reviews/yadidya.png', date: '5 months ago', visible: true, featured: true, order: 17, response: 'Thank you' },
  { id: 'g_rev_18', googleReviewId: 'g_rev_18', source: 'GOOGLE', name: 'karagani pavankumar', designation: 'Google Reviewer • 2 Reviews', title: 'Super 👍😊', body: 'Super 👍😊 Great modular work and helpful team.', rating: 5, avatar: '/reviews/karagani_pavankumar.png', date: '5 months ago', visible: true, featured: true, order: 18 },
  { id: 'g_rev_19', googleReviewId: 'g_rev_19', source: 'GOOGLE', name: 'Rajini Kumar', designation: 'Google Reviewer • 2 Reviews', title: 'Greate Experience', body: 'Greate experience working with Espacio Interiors & Modular.', rating: 5, avatar: '/reviews/rajini_kumar.png', date: '5 months ago', visible: true, featured: true, order: 19 },
  { id: 'g_rev_20', googleReviewId: 'g_rev_20', source: 'GOOGLE', name: 'Ramesh Paladugu', designation: 'Google Reviewer • 3 Reviews', title: 'Good Service', body: 'Good service and reliable interior materials at ESPACIO.', rating: 5, avatar: '/reviews/ramesh_paladugu.png', date: '5 months ago', visible: true, featured: true, order: 20, response: 'Thank you' },
  { id: 'g_rev_21', googleReviewId: 'g_rev_21', source: 'GOOGLE', name: 'naidu poola', designation: 'Google Reviewer • 2 Reviews', title: 'Good Service', body: 'Good service and friendly support.', rating: 5, avatar: '/reviews/naidu_poola.png', date: '5 months ago', visible: true, featured: true, order: 21 },
  { id: 'g_rev_22', googleReviewId: 'g_rev_22', source: 'GOOGLE', name: 'Venkatesh mudhiraj', designation: 'Google Reviewer • 1 Review', title: 'Great Experience ❣️', body: 'great experience ❣️ Looking forward to working with Espacio Interiors & Modular again.', rating: 5, avatar: '/reviews/venkatesh_mudhiraj.png', date: '11 months ago', visible: true, featured: true, order: 22, response: 'Thank you!' },
  { id: 'g_rev_23', googleReviewId: 'g_rev_23', source: 'GOOGLE', name: 'Haneef Abdul', designation: 'Google Reviewer • 4 Reviews • 4 Photos', title: 'Good Quality', body: 'Good experience with Espacio Interiors & Modular. Recommended.', rating: 5, avatar: '/reviews/haneef_abdul.png', date: '11 months ago', visible: true, featured: true, order: 23, response: 'Thank you for your feedback!' },
  { id: 'g_rev_24', googleReviewId: 'g_rev_24', source: 'GOOGLE', name: 'K. SUBBARAO', designation: 'Google Reviewer • 5 Reviews', title: 'Super All Are Experts', body: 'Super... All’ are experts... Tq SPACIO Interiors', rating: 5, avatar: '/reviews/k_subbarao.png', date: '5 months ago', visible: true, featured: true, order: 24 },
  { id: 'g_rev_25', googleReviewId: 'g_rev_25', source: 'GOOGLE', name: 'Paladugu Raju', designation: 'Local Guide • 1 Review', title: 'Reliable Quality & Execution', body: 'Reliable interior solutions and genuine quality materials. Thank you Espacio.', rating: 5, avatar: '/reviews/paladugu_raju.png', date: '5 months ago', visible: true, featured: true, order: 25, response: 'Thank you' },
  { id: 'g_rev_26', googleReviewId: 'g_rev_26', source: 'GOOGLE', name: 'Kishor Kumar', designation: 'Google Reviewer • 6 Reviews • 5 Photos', title: 'Good Experience & Good Working Skills', body: 'Good experience & good working skills. The team at Espacio Interiors & Modular is dedicated and skilled.', rating: 5, avatar: '/reviews/kishor_kumar.png', date: '5 months ago', visible: true, featured: true, order: 26 },
  { id: 'g_rev_27', googleReviewId: 'g_rev_27', source: 'GOOGLE', name: 'Ajayreddy Gowreddy123', designation: 'Google Reviewer • 2 Reviews', title: 'Good Service & Quality Materials', body: 'Good service and excellent quality materials offered at competitive pricing by Espacio.', rating: 5, avatar: '/reviews/ajayreddy_gowreddy.png', date: '5 months ago', visible: true, featured: true, order: 27 },
  { id: 'g_rev_28', googleReviewId: 'g_rev_28', source: 'GOOGLE', name: 'imtiyaz shaik', designation: 'Google Reviewer • 9 Photos', title: 'Superb Design & Flawless Execution', body: 'Superb design variety and flawless material quality provided by Espacio Interiors & Modular.', rating: 5, avatar: '/reviews/imtiyaz_shaik.png', date: '5 months ago', visible: true, featured: true, order: 28 },
  { id: 'g_rev_29', googleReviewId: 'g_rev_29', source: 'GOOGLE', name: 'Nakul Kirsani', designation: 'Google Reviewer • 1 Review • 1 Photo', title: 'Great Quality & Supportive Team', body: 'Good experience and quality materials with cooperative design staff.', rating: 5, avatar: '/reviews/nakul_kirsani.png', date: '11 months ago', visible: true, featured: true, order: 29 },
  { id: 'g_rev_30', googleReviewId: 'g_rev_30', source: 'GOOGLE', name: 'Aditya Manda', designation: 'Local Guide • 4 Reviews', title: 'Professional Planning & Timely Delivery', body: 'Great experience with ESPACIO for home interiors. Professional planning and timely delivery.', rating: 5, avatar: '/reviews/aditya_manda.png', date: '4 months ago', visible: true, featured: true, order: 30 },
  { id: 'g_rev_31', googleReviewId: 'g_rev_31', source: 'GOOGLE', name: 'Thumuganti Rithwik', designation: 'Google Reviewer • 2 Reviews', title: 'Delighted with Material Selection & Execution', body: 'Very satisfied with the interior design quality and material selection. Highly recommended!', rating: 5, avatar: '/reviews/thumuganti_rithwik.png', date: '3 months ago', visible: true, featured: true, order: 31 }
];

// ─── DEFAULT ADMIN USERS ──────────────────────────────────────────────────────
export const DEFAULT_ADMIN_USERS = [
  {
    id: 'user_admin_espacio_001',
    _id: 'user_admin_espacio_001',
    name: 'Super Administrator',
    email: 'admin@espacio.com',
    role: 'superadmin',
    status: 'active',
    lastLogin: 'Just now',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user_tarun_002',
    _id: 'user_tarun_002',
    name: 'Tarun (Super Admin)',
    email: 'tarunuttupulusu@gmail.com',
    role: 'superadmin',
    status: 'active',
    lastLogin: 'Today',
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  hero_bg_images: [
    '/images/hero/hero_bedroom_4k.webp',
    '/images/hero/hero_kitchen_4k.webp',
    '/images/hero/hero_kids_bedroom_4k.webp',
    '/images/hero/hero_dining_4k.webp'
  ],
  hero_card_image: '/images/hero/hero_bedroom_4k.webp',
  hero_card_heading: 'We Craft the Future Dwelling',
  hero_card_cta_text: 'Our Projects',
  hero_card_cta_link: '/projects',
  hero_card_cta_visible: true,
  hero_stat1_value: '25+',
  hero_stat1_label: 'Projects Completed',
  hero_stat2_value: '100+',
  hero_stat2_label: 'Happy Clients',
  hero_stat3_value: '40+',
  hero_stat3_label: 'Years Combined Legacy',
  intro_heading: 'Turnkey interiors, done properly.',
  intro_description: 'ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don\'t just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what\'s happening on site.',
  intro_cta_text1: 'Our Story ↗',
  intro_cta_text2: 'Read More ↗',
  intro_cta_link: '/about',
  grid_stat1_val: '25+',
  grid_stat1_label: 'Projects Completed',
  grid_stat2_val: '100+',
  grid_stat2_label: 'Happy Clients',
  grid_stat3_val: '40+',
  grid_stat3_label: 'Years Combined Legacy',
  services_list: DEFAULT_SERVICES,
  exp_eyebrow: 'VISIT US',
  exp_heading: 'Experience Centers & Studio',
  exp_description: 'Walk into our flagship material experience studio. Touch, feel, and compare over 200+ live panel and finish samples in person.',
  exp_card1_title: 'Our Studio',
  exp_card1_address: 'Moinabad Road, Aziznagar',
  exp_card1_bottomLabel: 'EXPERIENCE CENTER',
  exp_card1_visible: true,
  exp_card2_title: 'Direct Line',
  exp_card2_phone: '+91 95051 51116',
  exp_card2_whatsapp: '+91 95051 51116',
  exp_card2_email: 'Espacio.hyd@gmail.com',
  exp_card2_bottomLabel: 'IMMEDIATE ASSISTANCE',
  exp_card2_visible: true,
  exp_card3_title: 'Studio Hours',
  exp_card3_monSatHours: '10:00 AM – 7:30 PM',
  exp_card3_sunHours: 'By Appointment',
  exp_card3_supportingText: 'Private evening consultations available upon request.',
  exp_card3_bottomLabel: 'CONSULTATION HOURS',
  exp_card3_visible: true,
  footer_location_title: 'LOCATION',
  footer_address: 'Moinabad Road, Aziznagar',
  footer_map_url: 'https://maps.app.goo.gl/q3zbxWmEt5wvRKbZ6',
  footer_contact_title: 'CONTACT',
  footer_phone: '+91 95051 51116',
  footer_whatsapp: '+91 95051 51116',
  footer_email: 'Espacio.hyd@gmail.com',
  footer_explore_title: 'EXPLORE',
  footer_nav_items: [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Spaces', path: '/spaces' },
    { label: 'Materials', path: '/materials' },
    { label: 'About', path: '/about' }
  ],
  footer_social_items: [
    { name: 'Instagram', label: 'Instagram', href: 'https://www.instagram.com/theespacio.in', icon: 'instagram', color: '#E4405F', beamColor: 'rgba(228, 64, 95, 0.4)' },
    { name: 'Facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1YCa9RnM8a/', icon: 'facebook', color: '#1877F2', beamColor: 'rgba(24, 119, 242, 0.4)' },
    { name: 'YouTube', label: 'YouTube', href: 'https://youtube.com/@theespacio?si=GMm6fUQ8t0W6MfRL', icon: 'youtube', color: '#FF0000', beamColor: 'rgba(255, 0, 0, 0.4)' },
    { name: 'WhatsApp', label: 'WhatsApp', href: 'https://wa.me/919505151116', icon: 'whatsapp', color: '#25D366', beamColor: 'rgba(37, 211, 102, 0.4)' }
  ]
};

// Get stored data with fallback
export const getCMSData = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      let data = JSON.parse(raw);
                if (key === STORAGE_KEYS.PROJECTS && Array.isArray(data)) {
          let updated = false;
          const hasKokapetNagesh = data.some(p => p._id === 'proj_3_kokapet_nagesh' || p.slug === 'kokapet-2bhk');
          if (!hasKokapetNagesh) {
            const idx = data.findIndex(p => p._id === 'proj_3_minimalist_beige' || p.slug === 'minimalist-beige-2bhk');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[2];
            } else {
              data.splice(2, 0, DEFAULT_PROJECTS[2]);
            }
            updated = true;
          }
          const hasKokapetRahul = data.some(p => p._id === 'proj_4_kokapet_rahul' || p.slug === 'kokapet-urban-2bhk');
          if (!hasKokapetRahul) {
            const idx = data.findIndex(p => p._id === 'proj_4_aparna_zicon' || p.slug === 'aparna-zicon-high-rise');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[3];
            } else {
              data.splice(3, 0, DEFAULT_PROJECTS[3]);
            }
            updated = true;
          }
          const hasGandipetKiran = data.some(p => p._id === 'proj_5_gandipet_kiran' || p.slug === 'gandipet-modern-retro-2bhk');
          if (!hasGandipetKiran) {
            const idx = data.findIndex(p => p._id === 'proj_5_modern_retro' || p.slug === 'modern-retro-timber-residence');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[4];
            } else {
              data.splice(4, 0, DEFAULT_PROJECTS[4]);
            }
            updated = true;
          }
          const hasKondapurVenkatesh = data.some(p => p._id === 'proj_6_kondapur_venkatesh' || p.slug === 'kondapur-minimalist-2bhk');
          if (!hasKondapurVenkatesh) {
            const idx = data.findIndex(p => p._id === 'proj_6_glasshouse_suite' || p.slug === 'the-glasshouse-executive-suite');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[5];
            } else {
              data.splice(5, 0, DEFAULT_PROJECTS[5]);
            }
            updated = true;
          }
                    const hasGachibowliKoteswara = data.some(p => p._id === 'proj_7_gachibowli_koteswara' || p.slug === 'gachibowli-minimalist-beige-2bhk');
          if (!hasGachibowliKoteswara) {
            const idx = data.findIndex(p => p._id === 'proj_7_gachibowli_koteswara' || p.slug === 'gachibowli-minimalist-beige-2bhk');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[6];
            } else {
              data.splice(6, 0, DEFAULT_PROJECTS[6]);
            }
            updated = true;
          }
                    const hasKachigudaSubbarao = data.some(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
          if (!hasKachigudaSubbarao) {
            const idx = data.findIndex(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[7];
            } else {
              data.splice(7, 0, DEFAULT_PROJECTS[7]);
            }
            updated = true;
          }
          // Sanitize gallery images and remove duplicates
          data.forEach(p => {
            if (p && Array.isArray(p.gallery)) {
              const origLen = p.gallery.length;
              p.gallery = p.gallery.filter((img, idx, arr) => !img.includes('venkatesh_gallery_22.webp') && arr.indexOf(img) === idx);
              if (p.gallery.length !== origLen) updated = true;
            }
          });
          if (updated) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (Array.isArray(data.hero_bg_images) && (data.hero_bg_images.some(img => typeof img === 'string' && (img.includes('unsplash.com') || img.includes('user_uploaded') || img.includes('company/duplex') || !img.includes('_4k.webp') || data.hero_bg_images.length !== 4)))) {
          data.hero_bg_images = [
            '/images/hero/hero_bedroom_4k.webp',
            '/images/hero/hero_kitchen_4k.webp',
            '/images/hero/hero_kids_bedroom_4k.webp',
            '/images/hero/hero_dining_4k.webp'
          ];
          data.hero_card_image = '/images/hero/hero_bedroom_4k.webp';
          try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
        }
        if (!Array.isArray(data.showcase_slides) || data.showcase_slides.length !== 4 || data.showcase_slides.some(s => s.projectImg?.includes('company/'))) {
          data.showcase_slides = [
            {
              projectImg: "/images/about/about_showcase_1.jpg",
              memberImg: "/reviews/paladugu_raju.png",
              name: "Spatial Design Lead",
              role: "Thematic Spatial Planning",
              projectLabel: "Cosmic Odyssey Kids Suite"
            },
            {
              projectImg: "/images/about/about_showcase_2.jpg",
              memberImg: "/reviews/kishor_kumar.png",
              name: "Interior Specialist",
              role: "Classical Boiserie Styling",
              projectLabel: "Sage Classical Lounge"
            },
            {
              projectImg: "/images/about/about_showcase_3.jpg",
              memberImg: "/reviews/amresh_kumar.png",
              name: "Joinery & Detailing",
              role: "Bespoke Study & Atelier",
              projectLabel: "Executive Study & Atelier"
            },
            {
              projectImg: "/images/about/about_showcase_4.jpg",
              memberImg: "/reviews/imtiyaz_shaik.png",
              name: "Modular Specialist",
              role: "High-Gloss Modular Kitchens",
              projectLabel: "Modern Quartzite Kitchen"
            }
          ];
          try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
        }
        if (key === STORAGE_KEYS.SETTINGS && data) {
          let modified = false;
          if (data.intro_heading === 'From Concept to Handover — ESPACIO Delivers Complete Interiors.') {
            data.intro_heading = 'Turnkey interiors, done properly.';
            modified = true;
          }
          if (data.intro_description && data.intro_description.includes('We bring 40+ years of family construction heritage')) {
            data.intro_description = "ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don't just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what's happening on site.";
            modified = true;
          }
          if (Array.isArray(data.nav_items)) {
            data.nav_items.forEach(item => {
              if (item.path === '/what-we-do' || item.path?.startsWith('/what-we-do/')) {
                item.path = item.path.replace('/what-we-do', '/spaces');
                if (item.label === 'What We Do') item.label = 'Spaces';
                modified = true;
              }
              if (item.path === '/products' || item.path?.startsWith('/products/')) {
                item.path = item.path.replace('/products', '/materials');
                if (item.label === 'Products' || item.label === 'Materials Library') item.label = 'Materials';
                modified = true;
              }
            });
          }
          if (Array.isArray(data.footer_nav_items)) {
            data.footer_nav_items.forEach(item => {
              if (item.path === '/what-we-do' || item.path?.startsWith('/what-we-do/')) {
                item.path = item.path.replace('/what-we-do', '/spaces');
                if (item.label === 'What We Do') item.label = 'Spaces';
                modified = true;
              }
              if (item.path === '/products' || item.path?.startsWith('/products/')) {
                item.path = item.path.replace('/products', '/materials');
                if (item.label === 'Products' || item.label === 'Materials Library') item.label = 'Materials';
                modified = true;
              }
            });
          }
          if (Array.isArray(data.spaces_list)) {
            const existingSlugs = new Set(data.spaces_list.map(s => s.slug));
            const newCategories = [
              {
                "name": "Foyer",
                "slug": "foyer",
                "description": "First-impression entrance foyers with fluted timber panelling, floating shoe consoles, backlit vanity mirrors, and statement stone accents.",
                "heroImage": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                "visible": true,
                "details": {
                  "tag": "Grand First Impressions",
                  "headline": "Entrance Foyers Crafted to Welcome and Impress",
                  "body": "The foyer sets the emotional tone of the entire home. We design architectural transition zones featuring bespoke shoe storage credenzas, floating consoles, decorative stone accents, acoustic fluted wall cladding, and motion-sensor warm cove illumination.",
                  "includes": [
                    "Custom Floating Console & Concealed Shoe Storage",
                    "Acoustic Fluted Timber & Metal Inlay Panelling",
                    "Backlit Onyx & Polygranite Statement Wall",
                    "Full-Height Dressing Mirror with Ambient Backlight",
                    "Motion-Sensor Warm Glow & Recessed Spotlights",
                    "Architectural Partition Screens & CNC Jali Elements",
                    "Integrated Key, Bag & Drop-Zone Niches",
                    "Upholstered Seating & Entryway Benches"
                  ]
                },
                "galleryImages": [
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
                  "/images/company/2bhk_mordern_retro/dining_2.jpg",
                  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
                ],
                "filters": [
                  "Modern",
                  "Luxury",
                  "Minimal",
                  "Contemporary",
                  "Traditional",
                  "Statement"
                ]
              },
              {
                "name": "Bar",
                "slug": "bar",
                "description": "Bespoke residential bar units, wine display cellars, backlit onyx counters, and fluted glass stemware storage.",
                "heroImage": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
                "visible": true,
                "details": {
                  "tag": "Hospitality & Entertaining",
                  "headline": "Sophisticated Home Bars for Connoisseurs and Hosts",
                  "body": "Transform entertaining at home with bespoke bar counters featuring temperature-controlled wine displays, illuminated fluted glass cabinets, integrated ice and cocktail prep sinks, and dramatic backlit translucent stone surfaces.",
                  "includes": [
                    "Custom Backlit Onyx & Sintered Stone Bar Counters",
                    "Integrated Temperature-Controlled Wine Chillers",
                    "Fluted Bronze Glass Stemware & Bottle Shelving",
                    "Concealed Prep Sink & Speed Rail Integration",
                    "Multi-Circuit Mood & Shelf Backlighting",
                    "Acoustic Wall Panelling & High Bar Seating",
                    "Lockable Spirits & Decanter Cabinetry",
                    "Under-Counter Refrigeration & Ice Maker Provisions"
                  ]
                },
                "galleryImages": [
                  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80",
                  "/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg",
                  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
                ],
                "filters": [
                  "Home Bar",
                  "Luxury",
                  "Modern",
                  "Contemporary",
                  "Compact",
                  "Classic"
                ]
              },
              {
                "name": "Walk-in Wardrobe",
                "slug": "walk-in-wardrobe",
                "description": "Boutique-style walk-in dressing suites with central accessory islands, velvet-lined drawers, and illuminated tinted glass enclosures.",
                "heroImage": "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=1200&q=80",
                "visible": true,
                "details": {
                  "tag": "Boutique Dressing Suites",
                  "headline": "Walk-In Closets Designed Like Haute Couture Salons",
                  "body": "Experience the luxury of a personalized dressing boutique. Our walk-in wardrobe suites feature central accessory islands with glass display tops, custom velvet-lined watch and jewelry drawers, floor-to-ceiling tinted glass partitions, and 360-degree vanity lighting.",
                  "includes": [
                    "Central Accessory & Jewelry Island with Glass Top",
                    "Floor-to-Ceiling Tinted Bronze Glass Shutters",
                    "Velvet-Lined Watch, Belt & Sunglass Organizers",
                    "Integrated LED Sensor Rail & Shelf Lighting",
                    "Full-Height Backlit Vanity Dressing Mirror",
                    "Tiered Pull-Out Shoe & Handbag Galleries",
                    "Hidden Safe & Lockable Valuables Vault",
                    "Dedicated Seasonal Loft Storage Sections"
                  ]
                },
                "galleryImages": [
                  "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
                  "/images/materials/bedroom_3.webp",
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
                  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                ],
                "filters": [
                  "Central Island Suite",
                  "Tinted Bronze Glass Wardrobe",
                  "Velvet Boutique Salon",
                  "Minimalist Open Dressing",
                  "360-Degree Illuminated Vanity"
                ]
              }
            ];
            newCategories.forEach(cat => {
              if (!existingSlugs.has(cat.slug)) {
                data.spaces_list.push(cat);
                modified = true;
              }
            });

            const SPACES_FILTERS_MAP = {
              'modular-kitchen': ["Island Kitchen", "Parallel Kitchen", "L-Shaped Kitchen", "U-Shaped Kitchen", "Open Concept Pantry"],
              'master-bedroom': ["Luxury Master Suite", "Warm Minimalist", "Classical Boiserie", "Modern Contemporary", "Integrated Study Suite"],
              'living-room': ["Minimalist Lounge", "Double-Height Living", "Luxury Marble Accent", "Open Concept Living", "Contemporary Formal"],
              'wardrobes': ["Floor-to-Ceiling Sliding", "Tinted Glass Shutters", "Built-In Veneer & Wood", "Open Shelving Systems", "Integrated Vanity Dressing"],
              'home-office': ["Executive Study", "Minimal Studio Desk", "Dual Workstation", "Acoustic Panelled Office", "Library & Bookshelf Suite"],
              'commercial-office': ["Executive Boardroom", "Open Workstation Floor", "Private Director Cabin", "Acoustic Conference Room", "Collaboration Lounge"],
              'pooja-room': ["Dedicated Mandir Room", "CNC Backlit Jali", "Marble & Corian Sanctum", "Compact Wood Mandir", "Traditional Brass & Teak"],
              'dining-room': ["8-Seater Formal Dining", "Marble Top & Bar Console", "Fluted Glass Partition", "Breakfast Nook & Bistro", "Duplex Dining Lounge"],
              'tv-units': ["Full-Wall Marble Console", "Floating Acoustic Fluted", "Backlit Onyx Feature Wall", "Minimalist Low-Profile", "Rotatable Partition Unit"],
              'false-ceilings': ["Magnetic Track & Warm Coves", "Wooden Rafter & Slat Ceiling", "Minimalist Peripheral Drop", "Coffered & Geometric Ceiling", "Stretch Fabric & Backlit Ceiling"],
              'commercial-interiors': ["Corporate Headquarters", "Retail & Showroom Store", "Clinic & Wellness Center", "Law & Financial Atelier", "Tech Innovation Hub"],
              'reception-areas': ["Monolithic Stone Reception Desk", "Corporate Brand Identity Wall", "Luxury Client Lounge", "Fluted Wood & Green Wall", "Double-Height Entry Lobby"],
              'cafes-restaurants': ["Specialty Coffee Bistro", "Fine Dining Hall", "Industrial Rooftop Bar", "Bohemian Lounge", "Quick-Service Gourmet Counter"],
              'foyer': ["Modern Floating Console", "Luxury Backlit Onyx", "Minimalist Drop-Zone", "Traditional Jali Screen", "Statement Mirror Wall"],
              'bar': ["Backlit Onyx Counter", "Temperature-Controlled Wine Cellar", "Compact Dry Bar", "Fluted Glass Cocktail Station", "Classic Walnut Lounge"],
              'walk-in-wardrobe': ["Central Island Suite", "Tinted Bronze Glass Wardrobe", "Velvet Boutique Salon", "Minimalist Open Dressing", "360-Degree Illuminated Vanity"]
            };

            const BEDROOM_DRIVE_IMAGES = [
              "/images/spaces/bedroom/bedroom_drive_1.webp",
              "/images/spaces/bedroom/bedroom_drive_2.webp",
              "/images/spaces/bedroom/bedroom_drive_3.webp",
              "/images/spaces/bedroom/bedroom_drive_4.webp",
              "/images/spaces/bedroom/bedroom_drive_5.webp",
              "/images/spaces/bedroom/bedroom_drive_6.webp",
              "/images/spaces/bedroom/bedroom_drive_7.webp",
              "/images/spaces/bedroom/bedroom_drive_8.webp",
              "/images/spaces/bedroom/bedroom_drive_9.webp",
              "/images/spaces/bedroom/bedroom_drive_10.webp",
              "/images/spaces/bedroom/bedroom_drive_11.webp",
              "/images/spaces/bedroom/bedroom_drive_12.webp",
              "/images/spaces/bedroom/bedroom_drive_13.webp",
              "/images/spaces/bedroom/bedroom_drive_14.webp",
              "/images/spaces/bedroom/bedroom_drive_15.webp",
              "/images/spaces/bedroom/bedroom_drive_16.webp",
              "/images/spaces/bedroom/bedroom_drive_17.webp",
              "/images/spaces/bedroom/bedroom_drive_18.webp",
              "/images/spaces/bedroom/bedroom_drive_19.webp",
              "/images/spaces/bedroom/bedroom_drive_20.webp",
              "/images/spaces/bedroom/bedroom_drive_21.webp",
              "/images/spaces/bedroom/bedroom_drive_22.webp",
              "/images/spaces/bedroom/bedroom_drive_23.webp",
              "/images/spaces/bedroom/bedroom_drive_24.webp",
              "/images/spaces/bedroom/bedroom_drive_25.webp",
              "/images/spaces/bedroom/bedroom_drive_26.webp",
              "/images/spaces/bedroom/bedroom_drive_27.webp",
              "/images/spaces/bedroom/bedroom_drive_28.webp",
              "/images/spaces/bedroom/bedroom_drive_29.webp"
            ];

            const OFFICE_DRIVE_IMAGES = [
              "/images/spaces/office/office_drive_1.webp",
              "/images/spaces/office/office_drive_2.webp",
              "/images/spaces/office/office_drive_3.webp",
              "/images/spaces/office/office_drive_4.webp",
              "/images/spaces/office/office_drive_5.webp",
              "/images/spaces/office/office_drive_6.webp",
              "/images/spaces/office/office_drive_7.webp",
              "/images/spaces/office/office_drive_8.webp",
              "/images/spaces/office/office_drive_9.webp",
              "/images/spaces/office/office_drive_10.webp",
              "/images/spaces/office/office_drive_11.webp",
              "/images/spaces/office/office_drive_12.webp",
              "/images/spaces/office/office_drive_13.webp",
              "/images/spaces/office/office_drive_14.webp",
              "/images/spaces/office/office_drive_15.webp",
              "/images/spaces/office/office_drive_16.webp",
              "/images/spaces/office/office_drive_17.webp",
              "/images/spaces/office/office_drive_18.webp",
              "/images/spaces/office/office_drive_19.webp",
              "/images/spaces/office/office_drive_20.webp",
              "/images/spaces/office/office_drive_21.webp",
              "/images/spaces/office/office_drive_22.webp",
              "/images/spaces/office/office_drive_23.webp",
              "/images/spaces/office/office_drive_24.webp",
              "/images/spaces/office/office_drive_25.webp",
              "/images/spaces/office/office_drive_26.webp",
              "/images/spaces/office/office_drive_27.webp",
              "/images/spaces/office/office_drive_28.webp",
              "/images/spaces/office/office_drive_29.webp",
              "/images/spaces/office/office_drive_30.webp",
              "/images/spaces/office/office_drive_31.webp",
              "/images/spaces/office/office_drive_32.webp",
              "/images/spaces/office/office_drive_33.webp",
              "/images/spaces/office/office_drive_34.webp",
              "/images/spaces/office/office_drive_35.webp",
              "/images/spaces/office/office_drive_36.webp",
              "/images/spaces/office/office_drive_37.webp"
            ];

            const DINING_DRIVE_IMAGES = [
              "/images/spaces/dining/dining_drive_1.webp",
              "/images/spaces/dining/dining_drive_2.webp",
              "/images/spaces/dining/dining_drive_3.webp",
              "/images/spaces/dining/dining_drive_4.webp",
              "/images/spaces/dining/dining_drive_5.webp",
              "/images/spaces/dining/dining_drive_6.webp",
              "/images/spaces/dining/dining_drive_7.webp",
              "/images/spaces/dining/dining_drive_8.webp",
              "/images/spaces/dining/dining_drive_9.webp",
              "/images/spaces/dining/dining_drive_10.webp",
              "/images/spaces/dining/dining_drive_11.webp",
              "/images/spaces/dining/dining_drive_12.webp",
              "/images/spaces/dining/dining_drive_13.webp",
              "/images/spaces/dining/dining_drive_14.webp",
              "/images/spaces/dining/dining_drive_15.webp",
              "/images/spaces/dining/dining_drive_16.webp",
              "/images/spaces/dining/dining_drive_17.webp",
              "/images/spaces/dining/dining_drive_18.webp",
              "/images/spaces/dining/dining_drive_19.webp",
              "/images/spaces/dining/dining_drive_20.webp",
              "/images/spaces/dining/dining_drive_21.webp",
              "/images/spaces/dining/dining_drive_22.webp",
              "/images/spaces/dining/dining_drive_23.webp",
              "/images/spaces/dining/dining_drive_24.webp",
              "/images/spaces/dining/dining_drive_25.webp",
              "/images/spaces/dining/dining_drive_26.webp",
              "/images/spaces/dining/dining_drive_27.webp",
              "/images/spaces/dining/dining_drive_28.webp",
              "/images/spaces/dining/dining_drive_29.webp",
              "/images/spaces/dining/dining_drive_30.webp",
              "/images/spaces/dining/dining_drive_31.webp",
              "/images/spaces/dining/dining_drive_32.webp",
              "/images/spaces/dining/dining_drive_33.webp",
              "/images/spaces/dining/dining_drive_35.webp",
              "/images/spaces/dining/dining_drive_36.webp",
              "/images/spaces/dining/dining_drive_37.webp",
              "/images/spaces/dining/dining_drive_38.webp",
              "/images/spaces/dining/dining_drive_39.webp",
              "/images/spaces/dining/dining_drive_40.webp",
              "/images/spaces/dining/dining_drive_41.webp",
              "/images/spaces/dining/dining_drive_42.webp",
              "/images/spaces/dining/dining_drive_43.webp",
              "/images/spaces/dining/dining_drive_44.webp",
              "/images/spaces/dining/dining_drive_45.webp",
              "/images/spaces/dining/dining_drive_46.webp",
              "/images/spaces/dining/dining_drive_47.webp",
              "/images/spaces/dining/dining_drive_48.webp",
              "/images/spaces/dining/dining_drive_49.webp",
              "/images/spaces/dining/dining_drive_50.webp"
            ];

            const CEILING_DRIVE_IMAGES = [
              "/images/spaces/ceiling/ceiling_drive_1.webp",
              "/images/spaces/ceiling/ceiling_drive_2.webp",
              "/images/spaces/ceiling/ceiling_drive_3.webp",
              "/images/spaces/ceiling/ceiling_drive_4.webp",
              "/images/spaces/ceiling/ceiling_drive_5.webp",
              "/images/spaces/ceiling/ceiling_drive_6.webp",
              "/images/spaces/ceiling/ceiling_drive_7.webp",
              "/images/spaces/ceiling/ceiling_drive_8.webp",
              "/images/spaces/ceiling/ceiling_drive_9.webp",
              "/images/spaces/ceiling/ceiling_drive_10.webp",
              "/images/spaces/ceiling/ceiling_drive_11.webp",
              "/images/spaces/ceiling/ceiling_drive_12.webp",
              "/images/spaces/ceiling/ceiling_drive_13.webp",
              "/images/spaces/ceiling/ceiling_drive_14.webp",
              "/images/spaces/ceiling/ceiling_drive_15.webp",
              "/images/spaces/ceiling/ceiling_drive_16.webp",
              "/images/spaces/ceiling/ceiling_drive_17.webp",
              "/images/spaces/ceiling/ceiling_drive_18.webp",
              "/images/spaces/ceiling/ceiling_drive_19.webp",
              "/images/spaces/ceiling/ceiling_drive_20.webp",
              "/images/spaces/ceiling/ceiling_drive_21.webp",
              "/images/spaces/ceiling/ceiling_drive_22.webp",
              "/images/spaces/ceiling/ceiling_drive_23.webp",
              "/images/spaces/ceiling/ceiling_drive_24.webp",
              "/images/spaces/ceiling/ceiling_drive_25.webp",
              "/images/spaces/ceiling/ceiling_drive_26.webp",
              "/images/spaces/ceiling/ceiling_drive_27.webp",
              "/images/spaces/ceiling/ceiling_drive_28.webp",
              "/images/spaces/ceiling/ceiling_drive_29.webp",
              "/images/spaces/ceiling/ceiling_drive_30.webp",
              "/images/spaces/ceiling/ceiling_drive_31.webp",
              "/images/spaces/ceiling/ceiling_drive_32.webp",
              "/images/spaces/ceiling/ceiling_drive_33.webp",
              "/images/spaces/ceiling/ceiling_drive_34.webp",
              "/images/spaces/ceiling/ceiling_drive_35.webp",
              "/images/spaces/ceiling/ceiling_drive_36.webp",
              "/images/spaces/ceiling/ceiling_drive_37.webp",
              "/images/spaces/ceiling/ceiling_drive_38.webp",
              "/images/spaces/ceiling/ceiling_drive_39.webp",
              "/images/spaces/ceiling/ceiling_drive_40.webp",
              "/images/spaces/ceiling/ceiling_drive_41.webp",
              "/images/spaces/ceiling/ceiling_drive_42.webp",
              "/images/spaces/ceiling/ceiling_drive_43.webp",
              "/images/spaces/ceiling/ceiling_drive_44.webp",
              "/images/spaces/ceiling/ceiling_drive_45.webp",
              "/images/spaces/ceiling/ceiling_drive_46.webp"
            ];

            const WARDROBE_DRIVE_IMAGES = [
              "/images/spaces/wardrobes/wardrobe_drive_1.webp",
              "/images/spaces/wardrobes/wardrobe_drive_2.webp",
              "/images/spaces/wardrobes/wardrobe_drive_3.webp",
              "/images/spaces/wardrobes/wardrobe_drive_4.webp",
              "/images/spaces/wardrobes/wardrobe_drive_5.webp",
              "/images/spaces/wardrobes/wardrobe_drive_6.webp",
              "/images/spaces/wardrobes/wardrobe_drive_7.webp",
              "/images/spaces/wardrobes/wardrobe_drive_8.webp",
              "/images/spaces/wardrobes/wardrobe_drive_9.webp",
              "/images/spaces/wardrobes/wardrobe_drive_10.webp",
              "/images/spaces/wardrobes/wardrobe_drive_11.webp",
              "/images/spaces/wardrobes/wardrobe_drive_12.webp",
              "/images/spaces/wardrobes/wardrobe_drive_13.webp",
              "/images/spaces/wardrobes/wardrobe_drive_14.webp",
              "/images/spaces/wardrobes/wardrobe_drive_15.webp",
              "/images/spaces/wardrobes/wardrobe_drive_16.webp",
              "/images/spaces/wardrobes/wardrobe_drive_17.webp",
              "/images/spaces/wardrobes/wardrobe_drive_18.webp",
              "/images/spaces/wardrobes/wardrobe_drive_19.webp",
              "/images/spaces/wardrobes/wardrobe_drive_21.webp",
              "/images/spaces/wardrobes/wardrobe_drive_22.webp",
              "/images/spaces/wardrobes/wardrobe_drive_23.webp",
              "/images/spaces/wardrobes/wardrobe_drive_24.webp",
              "/images/spaces/wardrobes/wardrobe_drive_25.webp",
              "/images/spaces/wardrobes/wardrobe_drive_26.webp",
              "/images/spaces/wardrobes/wardrobe_drive_27.webp",
              "/images/spaces/wardrobes/wardrobe_drive_29.webp",
              "/images/spaces/wardrobes/wardrobe_drive_30.webp",
              "/images/spaces/wardrobes/wardrobe_drive_31.webp",
              "/images/spaces/wardrobes/wardrobe_drive_32.webp",
              "/images/spaces/wardrobes/wardrobe_drive_33.webp",
              "/images/spaces/wardrobes/wardrobe_drive_34.webp",
              "/images/spaces/wardrobes/wardrobe_drive_37.webp",
              "/images/spaces/wardrobes/wardrobe_drive_38.webp"
            ];

            const APARTMENT_DRIVE_IMAGES = [
              "/images/spaces/apartments/apartment_drive_1.webp",
              "/images/spaces/apartments/apartment_drive_2.webp",
              "/images/spaces/apartments/apartment_drive_3.webp",
              "/images/spaces/apartments/apartment_drive_4.webp",
              "/images/spaces/apartments/apartment_drive_5.webp",
              "/images/spaces/apartments/apartment_drive_6.webp",
              "/images/spaces/apartments/apartment_drive_7.webp",
              "/images/spaces/apartments/apartment_drive_8.webp",
              "/images/spaces/apartments/apartment_drive_9.webp",
              "/images/spaces/apartments/apartment_drive_10.webp",
              "/images/spaces/apartments/apartment_drive_11.webp",
              "/images/spaces/apartments/apartment_drive_12.webp",
              "/images/spaces/apartments/apartment_drive_13.webp",
              "/images/spaces/apartments/apartment_drive_14.webp",
              "/images/spaces/apartments/apartment_drive_15.webp",
              "/images/spaces/apartments/apartment_drive_16.webp",
              "/images/spaces/apartments/apartment_drive_17.webp",
              "/images/spaces/apartments/apartment_drive_18.webp",
              "/images/spaces/apartments/apartment_drive_19.webp",
              "/images/spaces/apartments/apartment_drive_20.webp",
              "/images/spaces/apartments/apartment_drive_21.webp",
              "/images/spaces/apartments/apartment_drive_22.webp",
              "/images/spaces/apartments/apartment_drive_23.webp",
              "/images/spaces/apartments/apartment_drive_24.webp",
              "/images/spaces/apartments/apartment_drive_25.webp",
              "/images/spaces/apartments/apartment_drive_26.webp",
              "/images/spaces/apartments/apartment_drive_27.webp",
              "/images/spaces/apartments/apartment_drive_28.webp",
              "/images/spaces/apartments/apartment_drive_29.webp",
              "/images/spaces/apartments/apartment_drive_30.webp",
              "/images/spaces/apartments/apartment_drive_31.webp",
              "/images/spaces/apartments/apartment_drive_32.webp",
              "/images/spaces/apartments/apartment_drive_33.webp",
              "/images/spaces/apartments/apartment_drive_34.webp",
              "/images/spaces/apartments/apartment_drive_35.webp",
              "/images/spaces/apartments/apartment_drive_36.webp",
              "/images/spaces/apartments/apartment_drive_37.webp",
              "/images/spaces/apartments/apartment_drive_38.webp",
              "/images/spaces/apartments/apartment_drive_39.webp",
              "/images/spaces/apartments/apartment_drive_40.webp",
              "/images/spaces/apartments/apartment_drive_41.webp",
              "/images/spaces/apartments/apartment_drive_42.webp",
              "/images/spaces/apartments/apartment_drive_43.webp",
              "/images/spaces/apartments/apartment_drive_44.webp",
              "/images/spaces/apartments/apartment_drive_45.webp",
              "/images/spaces/apartments/apartment_drive_46.webp",
              "/images/spaces/apartments/apartment_drive_47.webp",
              "/images/spaces/apartments/apartment_drive_48.webp",
              "/images/spaces/apartments/apartment_drive_49.webp",
              "/images/spaces/apartments/apartment_drive_50.webp",
              "/images/spaces/apartments/apartment_drive_51.webp",
              "/images/spaces/apartments/apartment_drive_52.webp",
              "/images/spaces/apartments/apartment_drive_53.webp",
              "/images/spaces/apartments/apartment_drive_54.webp",
              "/images/spaces/apartments/apartment_drive_55.webp",
              "/images/spaces/apartments/apartment_drive_56.webp",
              "/images/spaces/apartments/apartment_drive_57.webp",
              "/images/spaces/apartments/apartment_drive_58.webp",
              "/images/spaces/apartments/apartment_drive_59.webp",
              "/images/spaces/apartments/apartment_drive_60.webp",
              "/images/spaces/apartments/apartment_drive_61.webp",
              "/images/spaces/apartments/apartment_drive_62.webp",
              "/images/spaces/apartments/apartment_drive_63.webp",
              "/images/spaces/apartments/apartment_drive_64.webp",
              "/images/spaces/apartments/apartment_drive_65.webp",
              "/images/spaces/apartments/apartment_drive_66.webp",
              "/images/spaces/apartments/apartment_drive_67.webp",
              "/images/spaces/apartments/apartment_drive_68.webp",
              "/images/spaces/apartments/apartment_drive_69.webp",
              "/images/spaces/apartments/apartment_drive_70.webp",
              "/images/spaces/apartments/apartment_drive_71.webp",
              "/images/spaces/apartments/apartment_drive_72.webp",
              "/images/spaces/apartments/apartment_drive_73.webp",
              "/images/spaces/apartments/apartment_drive_74.webp",
              "/images/spaces/apartments/apartment_drive_75.webp",
              "/images/spaces/apartments/apartment_drive_76.webp",
              "/images/spaces/apartments/apartment_drive_77.webp",
              "/images/spaces/apartments/apartment_drive_78.webp",
              "/images/spaces/apartments/apartment_drive_79.webp",
              "/images/spaces/apartments/apartment_drive_80.webp",
              "/images/spaces/apartments/apartment_drive_81.webp",
              "/images/spaces/apartments/apartment_drive_82.webp",
              "/images/spaces/apartments/apartment_drive_83.webp",
              "/images/spaces/apartments/apartment_drive_84.webp",
              "/images/spaces/apartments/apartment_drive_85.webp",
              "/images/spaces/apartments/apartment_drive_86.webp",
              "/images/spaces/apartments/apartment_drive_87.webp",
              "/images/spaces/apartments/apartment_drive_88.webp"
            ];

            const COMMERCIAL_INTERIORS_DRIVE_IMAGES = [
              "/images/spaces/commercial/commercial_drive_1.webp",
              "/images/spaces/commercial/commercial_drive_2.webp",
              "/images/spaces/commercial/commercial_drive_3.webp",
              "/images/spaces/commercial/commercial_drive_4.webp",
              "/images/spaces/commercial/commercial_drive_5.webp",
              "/images/spaces/commercial/commercial_drive_6.webp",
              "/images/spaces/commercial/commercial_drive_7.webp",
              "/images/spaces/commercial/commercial_drive_8.webp",
              "/images/spaces/commercial/commercial_drive_9.webp",
              "/images/spaces/commercial/commercial_drive_10.webp",
              "/images/spaces/commercial/commercial_drive_11.webp",
              "/images/spaces/commercial/commercial_drive_12.webp",
              "/images/spaces/commercial/commercial_drive_13.webp",
              "/images/spaces/commercial/commercial_drive_14.webp",
              "/images/spaces/commercial/commercial_drive_15.webp",
              "/images/spaces/commercial/commercial_drive_16.webp",
              "/images/spaces/commercial/commercial_drive_17.webp",
              "/images/spaces/commercial/commercial_drive_18.webp",
              "/images/spaces/commercial/commercial_drive_19.webp",
              "/images/spaces/commercial/commercial_drive_20.webp",
              "/images/spaces/commercial/commercial_drive_21.webp",
              "/images/spaces/commercial/commercial_drive_22.webp",
              "/images/spaces/commercial/commercial_drive_23.webp",
              "/images/spaces/commercial/commercial_drive_24.webp",
              "/images/spaces/commercial/commercial_drive_25.webp",
              "/images/spaces/commercial/commercial_drive_26.webp",
              "/images/spaces/commercial/commercial_drive_27.webp",
              "/images/spaces/commercial/commercial_drive_28.webp",
              "/images/spaces/commercial/commercial_drive_29.webp",
              "/images/spaces/commercial/commercial_drive_30.webp",
              "/images/spaces/commercial/commercial_drive_31.webp",
              "/images/spaces/commercial/commercial_drive_32.webp",
              "/images/spaces/commercial/commercial_drive_33.webp",
              "/images/spaces/commercial/commercial_drive_34.webp",
              "/images/spaces/commercial/commercial_drive_35.webp",
              "/images/spaces/commercial/commercial_drive_36.webp",
              "/images/spaces/commercial/commercial_drive_37.webp",
              "/images/spaces/commercial/commercial_drive_38.webp",
              "/images/spaces/commercial/commercial_drive_39.webp",
              "/images/spaces/commercial/commercial_drive_40.webp",
              "/images/spaces/commercial/commercial_drive_41.webp"
            ];

            const RECEPTION_AREAS_DRIVE_IMAGES = [
              "/images/spaces/reception/reception_drive_1.webp",
              "/images/spaces/reception/reception_drive_2.webp",
              "/images/spaces/reception/reception_drive_3.webp",
              "/images/spaces/reception/reception_drive_4.webp",
              "/images/spaces/reception/reception_drive_5.webp",
              "/images/spaces/reception/reception_drive_6.webp",
              "/images/spaces/reception/reception_drive_7.webp",
              "/images/spaces/reception/reception_drive_8.webp",
              "/images/spaces/reception/reception_drive_9.webp",
              "/images/spaces/reception/reception_drive_10.webp",
              "/images/spaces/reception/reception_drive_11.webp",
              "/images/spaces/reception/reception_drive_12.webp",
              "/images/spaces/reception/reception_drive_13.webp",
              "/images/spaces/reception/reception_drive_14.webp",
              "/images/spaces/reception/reception_drive_15.webp",
              "/images/spaces/reception/reception_drive_16.webp",
              "/images/spaces/reception/reception_drive_17.webp",
              "/images/spaces/reception/reception_drive_18.webp",
              "/images/spaces/reception/reception_drive_19.webp",
              "/images/spaces/reception/reception_drive_20.webp",
              "/images/spaces/reception/reception_drive_21.webp",
              "/images/spaces/reception/reception_drive_22.webp",
              "/images/spaces/reception/reception_drive_23.webp",
              "/images/spaces/reception/reception_drive_24.webp",
              "/images/spaces/reception/reception_drive_25.webp",
              "/images/spaces/reception/reception_drive_26.webp",
              "/images/spaces/reception/reception_drive_27.webp",
              "/images/spaces/reception/reception_drive_28.webp",
              "/images/spaces/reception/reception_drive_30.webp",
              "/images/spaces/reception/reception_drive_31.webp",
              "/images/spaces/reception/reception_drive_32.webp",
              "/images/spaces/reception/reception_drive_33.webp",
              "/images/spaces/reception/reception_drive_34.webp",
              "/images/spaces/reception/reception_drive_35.webp"
            ];

            const CAFES_RESTAURANTS_DRIVE_IMAGES = [
              "/images/spaces/cafes/cafe_drive_1.webp",
              "/images/spaces/cafes/cafe_drive_2.webp",
              "/images/spaces/cafes/cafe_drive_3.webp",
              "/images/spaces/cafes/cafe_drive_4.webp",
              "/images/spaces/cafes/cafe_drive_5.webp",
              "/images/spaces/cafes/cafe_drive_6.webp",
              "/images/spaces/cafes/cafe_drive_7.webp",
              "/images/spaces/cafes/cafe_drive_8.webp",
              "/images/spaces/cafes/cafe_drive_9.webp",
              "/images/spaces/cafes/cafe_drive_10.webp",
              "/images/spaces/cafes/cafe_drive_11.webp",
              "/images/spaces/cafes/cafe_drive_12.webp",
              "/images/spaces/cafes/cafe_drive_13.webp",
              "/images/spaces/cafes/cafe_drive_14.webp",
              "/images/spaces/cafes/cafe_drive_15.webp",
              "/images/spaces/cafes/cafe_drive_16.webp",
              "/images/spaces/cafes/cafe_drive_17.webp",
              "/images/spaces/cafes/cafe_drive_18.webp",
              "/images/spaces/cafes/cafe_drive_19.webp",
              "/images/spaces/cafes/cafe_drive_20.webp",
              "/images/spaces/cafes/cafe_drive_21.webp",
              "/images/spaces/cafes/cafe_drive_22.webp",
              "/images/spaces/cafes/cafe_drive_23.webp",
              "/images/spaces/cafes/cafe_drive_24.webp",
              "/images/spaces/cafes/cafe_drive_25.webp",
              "/images/spaces/cafes/cafe_drive_26.webp",
              "/images/spaces/cafes/cafe_drive_27.webp",
              "/images/spaces/cafes/cafe_drive_28.webp",
              "/images/spaces/cafes/cafe_drive_29.webp",
              "/images/spaces/cafes/cafe_drive_30.webp",
              "/images/spaces/cafes/cafe_drive_31.webp",
              "/images/spaces/cafes/cafe_drive_32.webp",
              "/images/spaces/cafes/cafe_drive_33.webp",
              "/images/spaces/cafes/cafe_drive_34.webp",
              "/images/spaces/cafes/cafe_drive_35.webp",
              "/images/spaces/cafes/cafe_drive_36.webp",
              "/images/spaces/cafes/cafe_drive_37.webp",
              "/images/spaces/cafes/cafe_drive_38.webp",
              "/images/spaces/cafes/cafe_drive_39.webp",
              "/images/spaces/cafes/cafe_drive_40.webp",
              "/images/spaces/cafes/cafe_drive_41.webp",
              "/images/spaces/cafes/cafe_drive_42.webp"
            ];

            const FOYER_DRIVE_IMAGES = [
              "/images/spaces/foyer/foyer_drive_1.webp",
              "/images/spaces/foyer/foyer_drive_2.webp",
              "/images/spaces/foyer/foyer_drive_3.webp",
              "/images/spaces/foyer/foyer_drive_4.webp",
              "/images/spaces/foyer/foyer_drive_5.webp",
              "/images/spaces/foyer/foyer_drive_6.webp",
              "/images/spaces/foyer/foyer_drive_7.webp",
              "/images/spaces/foyer/foyer_drive_8.webp",
              "/images/spaces/foyer/foyer_drive_9.webp",
              "/images/spaces/foyer/foyer_drive_10.webp",
              "/images/spaces/foyer/foyer_drive_11.webp",
              "/images/spaces/foyer/foyer_drive_12.webp",
              "/images/spaces/foyer/foyer_drive_13.webp",
              "/images/spaces/foyer/foyer_drive_14.webp",
              "/images/spaces/foyer/foyer_drive_15.webp",
              "/images/spaces/foyer/foyer_drive_16.webp",
              "/images/spaces/foyer/foyer_drive_17.webp",
              "/images/spaces/foyer/foyer_drive_18.webp",
              "/images/spaces/foyer/foyer_drive_19.webp",
              "/images/spaces/foyer/foyer_drive_20.webp",
              "/images/spaces/foyer/foyer_drive_21.webp",
              "/images/spaces/foyer/foyer_drive_22.webp",
              "/images/spaces/foyer/foyer_drive_23.webp",
              "/images/spaces/foyer/foyer_drive_24.webp",
              "/images/spaces/foyer/foyer_drive_25.webp",
              "/images/spaces/foyer/foyer_drive_26.webp",
              "/images/spaces/foyer/foyer_drive_27.webp",
              "/images/spaces/foyer/foyer_drive_28.webp",
              "/images/spaces/foyer/foyer_drive_29.webp",
              "/images/spaces/foyer/foyer_drive_30.webp"
            ];

            const BAR_DRIVE_IMAGES = [
              "/images/spaces/bar/bar_drive_1.webp",
              "/images/spaces/bar/bar_drive_2.webp",
              "/images/spaces/bar/bar_drive_3.webp",
              "/images/spaces/bar/bar_drive_4.webp",
              "/images/spaces/bar/bar_drive_5.webp",
              "/images/spaces/bar/bar_drive_6.webp",
              "/images/spaces/bar/bar_drive_7.webp",
              "/images/spaces/bar/bar_drive_8.webp",
              "/images/spaces/bar/bar_drive_9.webp",
              "/images/spaces/bar/bar_drive_10.webp",
              "/images/spaces/bar/bar_drive_11.webp",
              "/images/spaces/bar/bar_drive_12.webp",
              "/images/spaces/bar/bar_drive_13.webp",
              "/images/spaces/bar/bar_drive_14.webp",
              "/images/spaces/bar/bar_drive_15.webp",
              "/images/spaces/bar/bar_drive_16.webp",
              "/images/spaces/bar/bar_drive_17.webp",
              "/images/spaces/bar/bar_drive_18.webp",
              "/images/spaces/bar/bar_drive_19.webp",
              "/images/spaces/bar/bar_drive_20.webp",
              "/images/spaces/bar/bar_drive_21.webp",
              "/images/spaces/bar/bar_drive_22.webp",
              "/images/spaces/bar/bar_drive_23.webp",
              "/images/spaces/bar/bar_drive_24.webp",
              "/images/spaces/bar/bar_drive_25.webp",
              "/images/spaces/bar/bar_drive_26.webp",
              "/images/spaces/bar/bar_drive_27.webp",
              "/images/spaces/bar/bar_drive_28.webp",
              "/images/spaces/bar/bar_drive_29.webp",
              "/images/spaces/bar/bar_drive_30.webp",
              "/images/spaces/bar/bar_drive_31.webp",
              "/images/spaces/bar/bar_drive_32.webp",
              "/images/spaces/bar/bar_drive_33.webp",
              "/images/spaces/bar/bar_drive_34.webp",
              "/images/spaces/bar/bar_drive_35.webp",
              "/images/spaces/bar/bar_drive_36.webp",
              "/images/spaces/bar/bar_drive_37.webp",
              "/images/spaces/bar/bar_drive_38.webp"
            ];

            const WALK_IN_WARDROBE_DRIVE_IMAGES = [
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_1.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_3.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_4.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_5.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_6.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_7.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_8.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_9.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_10.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_11.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_12.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_13.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_14.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_15.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_16.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_17.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_18.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_19.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_20.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_21.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_22.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_23.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_24.webp",
              "/images/spaces/wardrobes/walk_in_wardrobe_drive_25.webp"
            ];

            const VILLAS_DRIVE_IMAGES = [
              "/images/spaces/villas/villa_drive_30.webp",
              "/images/spaces/villas/villa_drive_1.webp",
              "/images/spaces/villas/villa_drive_2.webp",
              "/images/spaces/villas/villa_drive_3.webp",
              "/images/spaces/villas/villa_drive_4.webp",
              "/images/spaces/villas/villa_drive_5.webp",
              "/images/spaces/villas/villa_drive_6.webp",
              "/images/spaces/villas/villa_drive_7.webp",
              "/images/spaces/villas/villa_drive_8.webp",
              "/images/spaces/villas/villa_drive_9.webp",
              "/images/spaces/villas/villa_drive_10.webp",
              "/images/spaces/villas/villa_drive_11.webp",
              "/images/spaces/villas/villa_drive_12.webp",
              "/images/spaces/villas/villa_drive_13.webp",
              "/images/spaces/villas/villa_drive_14.webp",
              "/images/spaces/villas/villa_drive_15.webp",
              "/images/spaces/villas/villa_drive_16.webp",
              "/images/spaces/villas/villa_drive_17.webp",
              "/images/spaces/villas/villa_drive_18.webp",
              "/images/spaces/villas/villa_drive_19.webp",
              "/images/spaces/villas/villa_drive_20.webp",
              "/images/spaces/villas/villa_drive_21.webp",
              "/images/spaces/villas/villa_drive_22.webp",
              "/images/spaces/villas/villa_drive_23.webp",
              "/images/spaces/villas/villa_drive_24.webp",
              "/images/spaces/villas/villa_drive_25.webp",
              "/images/spaces/villas/villa_drive_26.webp",
              "/images/spaces/villas/villa_drive_27.webp",
              "/images/spaces/villas/villa_drive_28.webp",
              "/images/spaces/villas/villa_drive_29.webp",
              "/images/spaces/villas/villa_drive_31.webp",
              "/images/spaces/villas/villa_drive_32.webp",
              "/images/spaces/villas/villa_drive_33.webp",
              "/images/spaces/villas/villa_drive_34.webp",
              "/images/spaces/villas/villa_drive_35.webp"
            ];

            const HOME_OFFICE_DRIVE_IMAGES = [
              "/images/spaces/home_office/home_office_drive_1.webp",
              "/images/spaces/home_office/home_office_drive_2.webp",
              "/images/spaces/home_office/home_office_drive_3.webp",
              "/images/spaces/home_office/home_office_drive_4.webp",
              "/images/spaces/home_office/home_office_drive_5.webp",
              "/images/spaces/home_office/home_office_drive_6.webp",
              "/images/spaces/home_office/home_office_drive_7.webp",
              "/images/spaces/home_office/home_office_drive_8.webp",
              "/images/spaces/home_office/home_office_drive_9.webp",
              "/images/spaces/home_office/home_office_drive_10.webp",
              "/images/spaces/home_office/home_office_drive_11.webp",
              "/images/spaces/home_office/home_office_drive_12.webp",
              "/images/spaces/home_office/home_office_drive_13.webp",
              "/images/spaces/home_office/home_office_drive_14.webp",
              "/images/spaces/home_office/home_office_drive_15.webp",
              "/images/spaces/home_office/home_office_drive_16.webp",
              "/images/spaces/home_office/home_office_drive_17.webp",
              "/images/spaces/home_office/home_office_drive_18.webp",
              "/images/spaces/home_office/home_office_drive_19.webp",
              "/images/spaces/home_office/home_office_drive_20.webp",
              "/images/spaces/home_office/home_office_drive_21.webp",
              "/images/spaces/home_office/home_office_drive_22.webp",
              "/images/spaces/home_office/home_office_drive_23.webp",
              "/images/spaces/home_office/home_office_drive_24.webp",
              "/images/spaces/home_office/home_office_drive_25.webp",
              "/images/spaces/home_office/home_office_drive_26.webp",
              "/images/spaces/home_office/home_office_drive_27.webp",
              "/images/spaces/home_office/home_office_drive_28.webp",
              "/images/spaces/home_office/home_office_drive_30.webp",
              "/images/spaces/home_office/home_office_drive_31.webp",
              "/images/spaces/home_office/home_office_drive_32.webp",
              "/images/spaces/home_office/home_office_drive_33.webp",
              "/images/spaces/home_office/home_office_drive_34.webp",
              "/images/spaces/home_office/home_office_drive_35.webp",
              "/images/spaces/home_office/home_office_drive_36.webp",
              "/images/spaces/home_office/home_office_drive_37.webp",
              "/images/spaces/home_office/home_office_drive_38.webp",
              "/images/spaces/home_office/home_office_drive_39.webp",
              "/images/spaces/home_office/home_office_drive_40.webp",
              "/images/spaces/home_office/home_office_drive_41.webp",
              "/images/spaces/home_office/home_office_drive_42.webp",
              "/images/spaces/home_office/home_office_drive_43.webp",
              "/images/spaces/home_office/home_office_drive_44.webp"
            ];

            const LIVING_DRIVE_IMAGES = [
              "/images/spaces/living/living_drive_1.webp",
              "/images/spaces/living/living_drive_2.webp",
              "/images/spaces/living/living_drive_3.webp",
              "/images/spaces/living/living_drive_4.webp",
              "/images/spaces/living/living_drive_6.webp",
              "/images/spaces/living/living_drive_7.webp",
              "/images/spaces/living/living_drive_8.webp",
              "/images/spaces/living/living_drive_9.webp",
              "/images/spaces/living/living_drive_10.webp",
              "/images/spaces/living/living_drive_11.webp",
              "/images/spaces/living/living_drive_12.webp",
              "/images/spaces/living/living_drive_13.webp",
              "/images/spaces/living/living_drive_14.webp",
              "/images/spaces/living/living_drive_15.webp",
              "/images/spaces/living/living_drive_16.webp",
              "/images/spaces/living/living_drive_17.webp",
              "/images/spaces/living/living_drive_18.webp",
              "/images/spaces/living/living_drive_19.webp",
              "/images/spaces/living/living_drive_20.webp",
              "/images/spaces/living/living_drive_21.webp",
              "/images/spaces/living/living_drive_22.webp",
              "/images/spaces/living/living_drive_23.webp",
              "/images/spaces/living/living_drive_24.webp",
              "/images/spaces/living/living_drive_25.webp",
              "/images/spaces/living/living_drive_26.webp",
              "/images/spaces/living/living_drive_27.webp",
              "/images/spaces/living/living_drive_28.webp",
              "/images/spaces/living/living_drive_29.webp",
              "/images/spaces/living/living_drive_30.webp",
              "/images/spaces/living/living_drive_31.webp",
              "/images/spaces/living/living_drive_32.webp",
              "/images/spaces/living/living_drive_33.webp",
              "/images/spaces/living/living_drive_34.webp",
              "/images/spaces/living/living_drive_36.webp",
              "/images/spaces/living/living_drive_37.webp",
              "/images/spaces/living/living_drive_38.webp",
              "/images/spaces/living/living_drive_39.webp",
              "/images/spaces/living/living_drive_40.webp"
            ];

            const POOJA_DRIVE_IMAGES = [
              "/images/spaces/pooja/pooja_drive_1.webp",
              "/images/spaces/pooja/pooja_drive_2.webp",
              "/images/spaces/pooja/pooja_drive_3.webp",
              "/images/spaces/pooja/pooja_drive_4.webp",
              "/images/spaces/pooja/pooja_drive_5.webp",
              "/images/spaces/pooja/pooja_drive_6.webp",
              "/images/spaces/pooja/pooja_drive_7.webp",
              "/images/spaces/pooja/pooja_drive_8.webp",
              "/images/spaces/pooja/pooja_drive_9.webp",
              "/images/spaces/pooja/pooja_drive_10.webp",
              "/images/spaces/pooja/pooja_drive_11.webp",
              "/images/spaces/pooja/pooja_drive_12.webp",
              "/images/spaces/pooja/pooja_drive_13.webp",
              "/images/spaces/pooja/pooja_drive_14.webp",
              "/images/spaces/pooja/pooja_drive_15.webp",
              "/images/spaces/pooja/pooja_drive_16.webp",
              "/images/spaces/pooja/pooja_drive_17.webp",
              "/images/spaces/pooja/pooja_drive_18.webp",
              "/images/spaces/pooja/pooja_drive_19.webp",
              "/images/spaces/pooja/pooja_drive_20.webp",
              "/images/spaces/pooja/pooja_drive_21.webp",
              "/images/spaces/pooja/pooja_drive_22.webp",
              "/images/spaces/pooja/pooja_drive_23.webp",
              "/images/spaces/pooja/pooja_drive_25.webp",
              "/images/spaces/pooja/pooja_drive_26.webp",
              "/images/spaces/pooja/pooja_drive_27.webp",
              "/images/spaces/pooja/pooja_drive_28.webp",
              "/images/spaces/pooja/pooja_drive_29.webp"
            ];

            const TV_DRIVE_IMAGES = [
              "/images/spaces/tv_units/tv_drive_1.webp",
              "/images/spaces/tv_units/tv_drive_2.webp",
              "/images/spaces/tv_units/tv_drive_3.webp",
              "/images/spaces/tv_units/tv_drive_4.webp",
              "/images/spaces/tv_units/tv_drive_5.webp",
              "/images/spaces/tv_units/tv_drive_6.webp",
              "/images/spaces/tv_units/tv_drive_7.webp",
              "/images/spaces/tv_units/tv_drive_8.webp",
              "/images/spaces/tv_units/tv_drive_9.webp",
              "/images/spaces/tv_units/tv_drive_10.webp",
              "/images/spaces/tv_units/tv_drive_11.webp",
              "/images/spaces/tv_units/tv_drive_12.webp",
              "/images/spaces/tv_units/tv_drive_13.webp",
              "/images/spaces/tv_units/tv_drive_14.webp",
              "/images/spaces/tv_units/tv_drive_15.webp",
              "/images/spaces/tv_units/tv_drive_16.webp",
              "/images/spaces/tv_units/tv_drive_17.webp",
              "/images/spaces/tv_units/tv_drive_18.webp",
              "/images/spaces/tv_units/tv_drive_19.webp",
              "/images/spaces/tv_units/tv_drive_20.webp",
              "/images/spaces/tv_units/tv_drive_21.webp",
              "/images/spaces/tv_units/tv_drive_22.webp",
              "/images/spaces/tv_units/tv_drive_23.webp",
              "/images/spaces/tv_units/tv_drive_24.webp",
              "/images/spaces/tv_units/tv_drive_25.webp",
              "/images/spaces/tv_units/tv_drive_26.webp",
              "/images/spaces/tv_units/tv_drive_27.webp",
              "/images/spaces/tv_units/tv_drive_28.webp",
              "/images/spaces/tv_units/tv_drive_29.webp",
              "/images/spaces/tv_units/tv_drive_30.webp",
              "/images/spaces/tv_units/tv_drive_31.webp",
              "/images/spaces/tv_units/tv_drive_32.webp",
              "/images/spaces/tv_units/tv_drive_33.webp",
              "/images/spaces/tv_units/tv_drive_34.webp",
              "/images/spaces/tv_units/tv_drive_35.webp",
              "/images/spaces/tv_units/tv_drive_36.webp",
              "/images/spaces/tv_units/tv_drive_37.webp"
            ];

            const MODULAR_KITCHEN_DRIVE_IMAGES = [
              "/images/spaces/modular_kitchen/kitchen_drive_24.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_1.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_2.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_3.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_4.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_5.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_6.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_7.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_8.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_9.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_10.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_11.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_12.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_13.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_14.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_15.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_16.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_17.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_18.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_19.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_20.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_21.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_22.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_23.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_25.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_27.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_28.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_29.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_30.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_31.webp",
              "/images/spaces/modular_kitchen/kitchen_drive_32.webp"
            ];

            if (Array.isArray(data.spaces_list)) {
              const origCount = data.spaces_list.length;
              data.spaces_list = data.spaces_list.filter(cat => cat.slug !== 'luxury-homes' && cat.slug !== 'apartments' && cat.slug !== 'villas');
              if (data.spaces_list.length !== origCount) modified = true;
            }

            data.spaces_list.forEach(cat => {
              if (Array.isArray(cat.galleryImages)) {
                const prevL = cat.galleryImages.length;
                cat.galleryImages = cat.galleryImages.filter(img => !img.includes('walk_in_wardrobe_drive_6.webp'));
                if (cat.galleryImages.length !== prevL) modified = true;
              }
              if (SPACES_FILTERS_MAP[cat.slug] && (!cat.filters || cat.filters.length !== 5 || cat.filters.includes('Japandi Minimal'))) {
                cat.filters = SPACES_FILTERS_MAP[cat.slug];
                modified = true;
              }
              if (cat.slug === 'modular-kitchen' && (!cat.galleryImages || cat.galleryImages.length !== 31 || cat.galleryImages.includes('/images/spaces/modular_kitchen/kitchen_drive_26.webp') || !cat.galleryImages[0]?.includes('modular_kitchen'))) {
                cat.galleryImages = MODULAR_KITCHEN_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/modular_kitchen/kitchen_drive_24.webp";
                modified = true;
              }
              if (cat.slug === 'master-bedroom' && (!cat.galleryImages || cat.galleryImages.length !== 29 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = BEDROOM_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/bedroom/bedroom_drive_24.webp";
                modified = true;
              }
              if (cat.slug === 'living-room' && (!cat.galleryImages || cat.galleryImages.length !== 38 || cat.galleryImages.includes('/images/spaces/living/living_drive_5.webp') || cat.galleryImages.includes('/images/spaces/living/living_drive_35.webp') || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = LIVING_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/living/living_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'home-office' && (!cat.galleryImages || cat.galleryImages.length !== 43 || cat.galleryImages.includes('/images/spaces/home_office/home_office_drive_29.webp') || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = HOME_OFFICE_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/home_office/home_office_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'commercial-office' && (!cat.galleryImages || cat.galleryImages.length !== 37 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = OFFICE_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/office/office_drive_4.webp";
                modified = true;
              }
              if (cat.slug === 'pooja-room' && (!cat.galleryImages || cat.galleryImages.length !== 28 || cat.galleryImages.includes('/images/spaces/pooja/pooja_drive_24.webp') || !cat.galleryImages[0]?.includes('.webp') || cat.heroImage?.includes('pooja_drive_1.webp'))) {
                cat.galleryImages = POOJA_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/pooja/pooja_drive_12.webp";
                modified = true;
              }
              if (cat.slug === 'dining-room' && (!cat.galleryImages || cat.galleryImages.length !== 49 || cat.galleryImages.includes('/images/spaces/dining/dining_drive_34.webp') || !cat.galleryImages[0]?.includes('.webp') || cat.heroImage?.includes('dining_drive_1.webp'))) {
                cat.galleryImages = DINING_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/dining/dining_drive_27.webp";
                modified = true;
              }
              if (cat.slug === 'tv-units' && (!cat.galleryImages || cat.galleryImages.length !== 37 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = TV_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/tv_units/tv_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'false-ceilings' && (!cat.galleryImages || cat.galleryImages.length !== 46 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = CEILING_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/ceiling/ceiling_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'wardrobes' && (!cat.galleryImages || cat.galleryImages.length !== 34 || cat.galleryImages.includes('/images/spaces/wardrobes/wardrobe_drive_20.webp') || cat.galleryImages.includes('/images/spaces/wardrobes/wardrobe_drive_28.webp') || cat.galleryImages.includes('/images/spaces/wardrobes/wardrobe_drive_35.webp') || cat.galleryImages.includes('/images/spaces/wardrobes/wardrobe_drive_36.webp') || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = WARDROBE_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/wardrobes/wardrobe_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'commercial-interiors' && (!cat.galleryImages || cat.galleryImages.length !== 41 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = COMMERCIAL_INTERIORS_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/commercial/commercial_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'cafes-restaurants' && (!cat.galleryImages || cat.galleryImages.length !== 42 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = CAFES_RESTAURANTS_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/cafes/cafe_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'foyer' && (!cat.galleryImages || cat.galleryImages.length !== 30 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = FOYER_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/foyer/foyer_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'bar' && (!cat.galleryImages || cat.galleryImages.length !== 38 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = BAR_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/bar/bar_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'walk-in-wardrobe' && (!cat.galleryImages || cat.galleryImages.length !== 24 || cat.galleryImages.includes('/images/spaces/wardrobes/walk_in_wardrobe_drive_2.webp') || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = WALK_IN_WARDROBE_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/wardrobes/walk_in_wardrobe_drive_1.webp";
                modified = true;
              }
              if (cat.slug === 'reception-areas' && (!cat.galleryImages || cat.galleryImages.length !== 34 || cat.galleryImages.includes('/images/spaces/reception/reception_drive_29.webp') || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = RECEPTION_AREAS_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/reception/reception_drive_1.webp";
                modified = true;
              }
            });
          }
          if (Array.isArray(data.spaces_before_after_slides) && data.spaces_before_after_slides.length > 0) {
            if (!data.spaces_before_after_slides[0]?.before?.includes('spaces_hero_before')) {
              data.spaces_before_after_slides[0].before = '/images/spaces/spaces_hero_before.webp';
              data.spaces_before_after_slides[0].after = '/images/spaces/spaces_hero_after.webp';
              modified = true;
            }
          }
          if (Array.isArray(data.projects_hero_images)) {
            data.projects_hero_images = data.projects_hero_images.map(img => {
              if (typeof img === 'string' && (img.includes('Ideas_2_2-_5') || img.includes('unsplash.com'))) {
                modified = true;
                return '/images/company/3bhk_lux/open_hall2.png';
              }
              return img;
            });
          }
          if (data.commit_card4_title === 'Free 3D Render') {
            data.commit_card4_title = 'Complimentary 3D Design';
            modified = true;
          }
          if (modified) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.FAQS && Array.isArray(data)) {
          let modified = false;
          if (data.some(item => (item.question && item.question.includes('remotely')) || (item.q && item.q.includes('remotely'))) || data.length < 10) {
            data = DEFAULT_FAQS;
            modified = true;
          } else {
            DEFAULT_FAQS.forEach(def => {
              const match = data.find(item => item.id === def.id || item._id === def.id);
              if (match) {
                if (match.question !== def.question || match.answer !== def.answer || match.q !== def.q || match.a !== def.a) {
                  match.question = def.question;
                  match.q = def.q;
                  match.answer = def.answer;
                  match.a = def.a;
                  modified = true;
                }
              }
            });
            data.forEach(item => {
              if (typeof item.image === 'string' && item.image.includes('Guest_restaurant_18')) {
                item.image = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg';
                modified = true;
              }
            });
          }
          if (modified) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.PROJECTS) {
          if (!Array.isArray(data) || data.length === 0 || !data.some(p => p.slug === 'rajapushpa-provincia-3bhk') || !data.some(p => p.slug === 'my-home-sayuk-3bhk') || data.some((p, idx) => Array.isArray(DEFAULT_PROJECTS[idx]?.gallery) && (!p.gallery || p.gallery.length < DEFAULT_PROJECTS[idx].gallery.length))) {
            data = DEFAULT_PROJECTS;
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          } else {
            const p1 = data.find(p => p.slug === 'rajapushpa-provincia-3bhk');
            if (p1) {
              let changed = false;
              if (!p1.beforeImage || p1.beforeImage.includes('spaces_hero')) {
                p1.beforeImage = '/images/projects/rajapushpa_provincia/rajapushpa_before.webp';
                p1.afterImage = '/images/projects/rajapushpa_provincia/rajapushpa_after.webp';
                p1.beforeImages = ['/images/projects/rajapushpa_provincia/rajapushpa_before.webp'];
                p1.afterImages = ['/images/projects/rajapushpa_provincia/rajapushpa_after.webp'];
                changed = true;
              }
              if (p1.heroImage !== '/images/projects/rajapushpa_provincia/rajapushpa_8.webp' || p1.hero_image !== '/images/projects/rajapushpa_provincia/rajapushpa_8.webp') {
                p1.heroImage = '/images/projects/rajapushpa_provincia/rajapushpa_8.webp';
                p1.hero_image = '/images/projects/rajapushpa_provincia/rajapushpa_8.webp';
                changed = true;
              }
              if (!p1.story || !p1.story.vision || p1.story.vision.includes('Dharma Teja')) {
                p1.story = DEFAULT_PROJECTS[0].story;
                changed = true;
              }
              if (p1.title !== 'A 3BHK Residence, Narsingi') {
                p1.title = 'A 3BHK Residence, Narsingi';
                changed = true;
              }
              if (p1.description !== DEFAULT_PROJECTS[0].description) {
                p1.description = DEFAULT_PROJECTS[0].description;
                changed = true;
              }
              if (changed) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p2 = data.find(p => p.slug === 'my-home-sayuk-3bhk');
            if (p2) {
              let changed2 = false;
              if (!p2.beforeImage || p2.beforeImage.includes('unsplash') || p2.beforeImage.includes('spaces_hero')) {
                p2.beforeImage = '/images/projects/my_home_sayuk/sayuk_before_raw.webp';
                p2.afterImage = '/images/projects/my_home_sayuk/sayuk_after_open_hall.webp';
                p2.beforeImages = ['/images/projects/my_home_sayuk/sayuk_before_raw.webp'];
                p2.afterImages = ['/images/projects/my_home_sayuk/sayuk_after_open_hall.webp'];
                changed2 = true;
              }
              if (p2.title !== 'A 3BHK Residence, Tellapur') {
                p2.title = 'A 3BHK Residence, Tellapur';
                changed2 = true;
              }
              if (p2.description !== DEFAULT_PROJECTS[1].description) {
                p2.description = DEFAULT_PROJECTS[1].description;
                changed2 = true;
              }
              if (!p2.story || !p2.story.vision || p2.story.vision.includes('Japandi-infused')) {
                p2.story = DEFAULT_PROJECTS[1].story;
                changed2 = true;
              }
              if (changed2) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p3 = data.find(p => p.slug === 'kokapet-2bhk');
            if (p3) {
              let changed3 = false;
              if (!p3.beforeImage || p3.beforeImage.includes('unsplash') || p3.beforeImage.includes('spaces_hero')) {
                p3.beforeImage = '/images/projects/kokapet_nagesh_2bhk/kokapet_before.webp';
                p3.afterImage = '/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp';
                p3.beforeImages = ['/images/projects/kokapet_nagesh_2bhk/kokapet_before.webp'];
                p3.afterImages = ['/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp'];
                changed3 = true;
              }
              if (p3.title !== 'A 2BHK Residence, Kokapet') {
                p3.title = 'A 2BHK Residence, Kokapet';
                changed3 = true;
              }
              if (p3.description !== DEFAULT_PROJECTS[2].description) {
                p3.description = DEFAULT_PROJECTS[2].description;
                changed3 = true;
              }
              if (!p3.story || !p3.story.vision || p3.story.vision.includes('Nagesh, envisioned')) {
                p3.story = DEFAULT_PROJECTS[2].story;
                changed3 = true;
              }
              if (changed3) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p4 = data.find(p => p.slug === 'kokapet-urban-2bhk');
            if (p4) {
              let changed4 = false;
              if (!p4.beforeImage || p4.beforeImage.includes('unsplash') || p4.beforeImage.includes('spaces_hero')) {
                p4.beforeImage = '/images/projects/kokapet_rahul_2bhk/rahul_before.webp';
                p4.afterImage = '/images/projects/kokapet_rahul_2bhk/rahul_after.webp';
                p4.beforeImages = ['/images/projects/kokapet_rahul_2bhk/rahul_before.webp'];
                p4.afterImages = ['/images/projects/kokapet_rahul_2bhk/rahul_after.webp'];
                changed4 = true;
              }
              if (p4.title !== 'A 2BHK Residence, Kokapet') {
                p4.title = 'A 2BHK Residence, Kokapet';
                changed4 = true;
              }
              if (p4.description !== DEFAULT_PROJECTS[3].description) {
                p4.description = DEFAULT_PROJECTS[3].description;
                changed4 = true;
              }
              if (!p4.story || !p4.story.vision || p4.story.vision.includes('Rahul, wanted')) {
                p4.story = DEFAULT_PROJECTS[3].story;
                changed4 = true;
              }
              if (changed4) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p5 = data.find(p => p.slug === 'gandipet-modern-retro-2bhk');
            if (p5) {
              let changed5 = false;
              if (!p5.beforeImage || p5.beforeImage.includes('unsplash') || p5.beforeImage.includes('spaces_hero')) {
                p5.beforeImage = '/images/projects/gandipet_kiran_2bhk/kiran_before.webp';
                p5.afterImage = '/images/projects/gandipet_kiran_2bhk/kiran_after.webp';
                p5.beforeImages = ['/images/projects/gandipet_kiran_2bhk/kiran_before.webp'];
                p5.afterImages = ['/images/projects/gandipet_kiran_2bhk/kiran_after.webp'];
                changed5 = true;
              }
              if (p5.title !== 'A 2BHK Residence, Gandipet') {
                p5.title = 'A 2BHK Residence, Gandipet';
                changed5 = true;
              }
              if (p5.description !== DEFAULT_PROJECTS[4].description) {
                p5.description = DEFAULT_PROJECTS[4].description;
                changed5 = true;
              }
              if (!p5.story || !p5.story.vision || p5.story.vision.includes('Kiran Raja, envisioned')) {
                p5.story = DEFAULT_PROJECTS[4].story;
                changed5 = true;
              }
              if (changed5) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p6 = data.find(p => p.slug === 'kondapur-minimalist-2bhk');
            if (p6) {
              let changed6 = false;
              if (!p6.beforeImage || p6.beforeImage.includes('unsplash') || p6.beforeImage.includes('spaces_hero')) {
                p6.beforeImage = '/images/projects/kondapur_venkatesh_2bhk/venkatesh_before.webp';
                p6.afterImage = '/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp';
                p6.beforeImages = ['/images/projects/kondapur_venkatesh_2bhk/venkatesh_before.webp'];
                p6.afterImages = ['/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp'];
                changed6 = true;
              }
              if (p6.title !== 'A 2BHK Residence, Kondapur') {
                p6.title = 'A 2BHK Residence, Kondapur';
                changed6 = true;
              }
              if (p6.description !== DEFAULT_PROJECTS[5].description) {
                p6.description = DEFAULT_PROJECTS[5].description;
                changed6 = true;
              }
              if (!p6.story || !p6.story.vision || p6.story.vision.includes('Venkatesh, envisioned')) {
                p6.story = DEFAULT_PROJECTS[5].story;
                changed6 = true;
              }
              if (changed6) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p7 = data.find(p => p.slug === 'gachibowli-minimalist-beige-2bhk');
            if (p7) {
              let changed7 = false;
              if (!p7.beforeImage || p7.beforeImage.includes('unsplash') || p7.beforeImage.includes('spaces_hero')) {
                p7.beforeImage = '/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp';
                p7.afterImage = '/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp';
                p7.beforeImages = ['/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp'];
                p7.afterImages = ['/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp'];
                changed7 = true;
              }
              if (p7.title !== 'A 2BHK Residence, Gachibowli') {
                p7.title = 'A 2BHK Residence, Gachibowli';
                changed7 = true;
              }
              if (p7.description !== DEFAULT_PROJECTS[6].description) {
                p7.description = DEFAULT_PROJECTS[6].description;
                changed7 = true;
              }
              if (!p7.story || !p7.story.vision || p7.story.vision.includes('Koteswara Rao, wanted')) {
                p7.story = DEFAULT_PROJECTS[6].story;
                changed7 = true;
              }
              if (changed7) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p8 = data.find(p => p.slug === 'kachiguda-fusion-duplex-villa');
            if (p8) {
              let changed8 = false;
              if (!p8.beforeImage || p8.beforeImage.includes('unsplash') || p8.beforeImage.includes('spaces_hero')) {
                p8.beforeImage = '/images/projects/kachiguda_subbarao_duplex/subbarao_before.webp';
                p8.afterImage = '/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp';
                p8.beforeImages = ['/images/projects/kachiguda_subbarao_duplex/subbarao_before.webp'];
                p8.afterImages = ['/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp'];
                changed8 = true;
              }
              if (p8.title !== 'A Duplex Residence, Kachiguda') {
                p8.title = 'A Duplex Residence, Kachiguda';
                changed8 = true;
              }
              if (p8.description !== DEFAULT_PROJECTS[7].description) {
                p8.description = DEFAULT_PROJECTS[7].description;
                changed8 = true;
              }
              if (!p8.story || !p8.story.vision || p8.story.vision.includes('envisioned a grand duplex')) {
                p8.story = DEFAULT_PROJECTS[7].story;
                changed8 = true;
              }
              if (changed8) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const canonicalOrder = {
              'rajapushpa-provincia-3bhk': 1,
              'my-home-sayuk-3bhk': 2,
              'kokapet-2bhk': 3,
              'kokapet-urban-2bhk': 4,
              'gandipet-modern-retro-2bhk': 5,
              'kondapur-minimalist-2bhk': 6,
              'gachibowli-minimalist-beige-2bhk': 7,
              'kachiguda-fusion-duplex-villa': 8
            };
            data.forEach((p, idx) => {
              if (canonicalOrder[p.slug]) {
                p.order = canonicalOrder[p.slug];
              } else if (!p.order) {
                p.order = idx + 1;
              }
            });
            data.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.PRODUCTS) {
          if (!Array.isArray(data) || data.length === 0 || data.some(p => typeof p.heroImage === 'string' && p.heroImage.includes('unsplash.com'))) {
            data = DEFAULT_PRODUCTS;
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.TESTIMONIALS) {
          if (!Array.isArray(data) || data.length === 0) {
            data = DEFAULT_TESTIMONIALS;
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.ADMIN_USERS) {
          if (!Array.isArray(data) || data.length === 0 || !data.some(u => u.email === 'admin@espacio.com')) {
            data = DEFAULT_ADMIN_USERS;
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.SETTINGS && data) {
          let modified = false;
          if (!Array.isArray(data.services_list) || data.services_list.length === 0 || data.services_list.some(s => typeof s.img === 'string' && s.img.includes('unsplash.com')) || !data.services_list.some(s => s.title === 'Full Home Interior Design and Execution')) {
            data.services_list = DEFAULT_SERVICES;
            modified = true;
          }
          if (!Array.isArray(data.hero_bg_images) || data.hero_bg_images.length === 0) {
            data.hero_bg_images = DEFAULT_SETTINGS.hero_bg_images;
            modified = true;
          }
          if (Array.isArray(data.footer_social_items)) {
            data.footer_social_items.forEach(item => {
              if (item.name === 'Facebook' || item.icon === 'facebook' || item.label === 'Facebook') {
                if (item.href === 'https://facebook.com' || item.href === 'https://www.facebook.com' || !item.href?.includes('1YCa9RnM8a')) {
                  item.href = 'https://www.facebook.com/share/1YCa9RnM8a/';
                  modified = true;
                }
              }
              if (item.name === 'YouTube' || item.icon === 'youtube' || item.label === 'YouTube') {
                if (item.href === 'https://youtube.com' || item.href === 'https://www.youtube.com' || !item.href?.includes('@theespacio')) {
                  item.href = 'https://youtube.com/@theespacio?si=GMm6fUQ8t0W6MfRL';
                  modified = true;
                }
              }
            });
          }
          if (modified) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
      return data;
    }
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  if (key === STORAGE_KEYS.PROJECTS) return DEFAULT_PROJECTS;
  if (key === STORAGE_KEYS.PRODUCTS) return DEFAULT_PRODUCTS;
  if (key === STORAGE_KEYS.FAQS) return DEFAULT_FAQS;
  if (key === STORAGE_KEYS.TESTIMONIALS) return DEFAULT_TESTIMONIALS;
  if (key === STORAGE_KEYS.SETTINGS) return DEFAULT_SETTINGS;
  if (key === STORAGE_KEYS.ADMIN_USERS) return DEFAULT_ADMIN_USERS;
  return fallback;
};

// Set stored data and broadcast real-time update
export const setCMSData = (key, data) => {
  try {
    if (key === STORAGE_KEYS.PROJECTS && Array.isArray(data)) {
      const canonicalOrder = {
        'rajapushpa-provincia-3bhk': 1,
        'my-home-sayuk-3bhk': 2,
        'kokapet-2bhk': 3,
        'kokapet-urban-2bhk': 4,
        'gandipet-modern-retro-2bhk': 5,
        'kondapur-minimalist-2bhk': 6,
        'gachibowli-minimalist-beige-2bhk': 7,
        'kachiguda-fusion-duplex-villa': 8
      };
      data.forEach((p, idx) => {
        if (!p.order && canonicalOrder[p.slug]) {
          p.order = canonicalOrder[p.slug];
        }
      });
      data.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
    }
    localStorage.setItem(key, JSON.stringify(data));
    notifyCMSUpdate();
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
};

// Seed default media library items with authentic company project images
const DEFAULT_MEDIA_ITEMS = [
  {
    id: 'media-1',
    fileName: 'Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
    originalName: 'Duplex Guest Restaurant Lounge',
    imageUrl: '/images/company/3bhk_lux/open_hall.png',
    thumbnailUrl: '/images/company/3bhk_lux/open_hall.png',
    altText: 'Exquisite Duplex 4BHK Living & Dining Lounge with Italian Marble',
    caption: 'Duplex 4BHK Grand Living Lounge',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '2.07 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-2',
    fileName: 'Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    originalName: 'Minimalist Beige Living Room',
    imageUrl: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    thumbnailUrl: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    altText: 'Minimalist Beige Contemporary Living Room with Warm Ambient Lighting',
    caption: 'Minimalist Beige Sanctuary Living Area',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '2.03 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-3',
    fileName: '3BHK-Guest_restaurant_4-20260810-164320.jpg',
    originalName: 'Indo Classical 3BHK Living & Dining',
    imageUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    thumbnailUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    altText: 'Indo-Classical Elegance 3BHK Grand Living Lounge with Brass Accents',
    caption: 'Indo-Classical Elegance 3BHK Showcase',
    category: 'Projects',
    fileType: 'JPG',
    fileSize: '2.12 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-4',
    fileName: 'open_hall.png',
    originalName: '3BHK Lux Open Hall Penthouse',
    imageUrl: '/images/company/3bhk_lux/open_hall.png',
    thumbnailUrl: '/images/company/3bhk_lux/open_hall.png',
    altText: 'Grand 3BHK Penthouse Luxe Open Hall with Ambient Profile Lighting',
    caption: 'Grand 3BHK Penthouse Luxe Living Space',
    category: 'Projects',
    fileType: 'PNG',
    fileSize: '1.98 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-5',
    fileName: 'Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    originalName: 'Contemporary Modular Kitchen Suite',
    imageUrl: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    thumbnailUrl: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    altText: 'Sleek Contemporary Grey Modular Kitchen with Quartz Countertops',
    caption: 'Precision Modular Kitchen Fitout',
    category: 'Services',
    fileType: 'JPG',
    fileSize: '2.33 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-6',
    fileName: 'tv_unit_2_1.png',
    originalName: 'Bespoke TV Entertainment Console',
    imageUrl: '/images/company/2bhk_lux/tv_unit_2_1.png',
    thumbnailUrl: '/images/company/2bhk_lux/tv_unit_2_1.png',
    altText: 'Architectural Fluted TV Console with Ambient LED Backlighting',
    caption: 'Custom TV & Media Console Unit',
    category: 'Products',
    fileType: 'PNG',
    fileSize: '1.85 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-7',
    fileName: '3BHK-Master_Bedroom_0-20260810-164320.jpg',
    originalName: 'Indo Classical Master Bedroom Suite',
    imageUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    thumbnailUrl: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    altText: 'Master Bedroom Suite with Custom Acoustic Headboard and Profile Lighting',
    caption: 'Bespoke Master Bedroom Sanctuary',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '2.02 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  },
  {
    id: 'media-8',
    fileName: 'crockery1_1.png',
    originalName: 'Illuminated Crockery & Bar Unit',
    imageUrl: '/images/company/2bhk_lux/crockery1_1.png',
    thumbnailUrl: '/images/company/2bhk_lux/crockery1_1.png',
    altText: 'Luxury Fluted Glass Crockery & Bar Console with Integrated Lighting',
    caption: 'Dining Crockery & Bar Console Unit',
    category: 'Products',
    fileType: 'PNG',
    fileSize: '1.92 MB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-26T12:00:00Z',
    updatedAt: '2026-08-26T12:00:00Z'
  }
];

// Retrieve media items with fallback and ensure uploaded bedroom image is present
export const getMediaItems = () => {
  const stored = getCMSData(STORAGE_KEYS.MEDIA);
  const settingsStored = getCMSData(STORAGE_KEYS.SETTINGS);
  
  let items = [];
  if (stored && Array.isArray(stored) && stored.length > 0) {
    items = stored;
  } else if (settingsStored && Array.isArray(settingsStored.media_gallery_items) && settingsStored.media_gallery_items.length > 0) {
    items = settingsStored.media_gallery_items;
  } else {
    items = DEFAULT_MEDIA_ITEMS;
  }

  const hasBedroom = items.some(item => 
    item.imageUrl === '/images/user_uploaded_bedroom.jpg' || 
    item.fileName === 'user_uploaded_bedroom.jpg' ||
    item.originalName === 'media_1787072367913.jpg'
  );

  if (!hasBedroom) {
    items = [DEFAULT_MEDIA_ITEMS[0], ...items];
  }

  setCMSData(STORAGE_KEYS.MEDIA, items);
  return items;
};

// Save media items locally and persist permanently to Database (source of truth)
export const saveMediaItems = async (items) => {
  setCMSData(STORAGE_KEYS.MEDIA, items);
  const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
  const updatedSettings = { ...settings, media_gallery_items: items };
  setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

  // Clean dataUrl Base64 string from network payload to keep document size < 1KB
  const cleanPayload = (Array.isArray(items) ? items : [items]).map(item => {
    if (!item || typeof item !== 'object') return item;
    const copy = { ...item };
    delete copy.dataUrl;
    delete copy.base64;
    return copy;
  });

  try {
    await Promise.all([
      axios.post('/media', cleanPayload).catch(() => {}),
      axios.put('/settings', { media_gallery_items: cleanPayload }).catch(() => {})
    ]);
  } catch (err) {
    console.warn('Database sync error:', err);
  }
};

// Check if an image URL is currently in use across the CMS settings, projects, or products
export const checkImageUsageInCMS = (imageUrl) => {
  if (!imageUrl) return [];
  const locations = [];
  const target = imageUrl.trim();

  // 1. Check Site Settings
  const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
  if (Array.isArray(settings.hero_bg_images) && settings.hero_bg_images.includes(target)) {
    locations.push('Home Page Hero Background Slider');
  }
  if (settings.hero_card_image === target) {
    locations.push('Home Page Floating Feature Card');
  }
  if (settings.services_bg_image === target) {
    locations.push('Services CMS Header Background');
  }
  if (settings.spaces_bg_image === target) {
    locations.push('Spaces CMS Header Background');
  }
  if (settings.materials_bg_image === target) {
    locations.push('Materials CMS Header Background');
  }
  if (settings.about_bg_image === target) {
    locations.push('About CMS Header Background');
  }
  if (settings.contact_bg_image === target) {
    locations.push('Contact CMS Header Background');
  }
  if (settings.footer_bg_image === target) {
    locations.push('Footer CMS Background');
  }
  if (settings.cta_bg_image === target) {
    locations.push('Global CTA Banner Background');
  }

  // 2. Check Projects
  const projects = getCMSData(STORAGE_KEYS.PROJECTS) || [];
  projects.forEach((proj) => {
    if (proj.heroImage === target) {
      locations.push(`Projects CMS: "${proj.title || 'Untitled'}" (Hero Cover)`);
    }
    if (Array.isArray(proj.gallery) && proj.gallery.includes(target)) {
      locations.push(`Projects CMS: "${proj.title || 'Untitled'}" (Gallery)`);
    }
  });

  // 3. Check Products
  const products = getCMSData(STORAGE_KEYS.PRODUCTS) || [];
  products.forEach((prod) => {
    if (prod.heroImage === target || prod.image === target) {
      locations.push(`Products CMS: "${prod.title || prod.name || 'Untitled'}" (Cover)`);
    }
    if (Array.isArray(prod.images) && prod.images.includes(target)) {
      locations.push(`Products CMS: "${prod.title || prod.name || 'Untitled'}" (Gallery)`);
    }
  });

  return locations;
};

// Robust multi-key helper to read CTA settings across all possible admin keys
export const getCtaDataForPage = (settings = {}, pageKey = 'home', defaultCta = {}) => {
  const pk = (pageKey || 'home').toLowerCase();
  const ctaObj = settings[`cta_${pk}`] || {};

  const pageTitle = settings[`${pk}_cta_title`] || settings[`${pk}_cta_headline`] || settings.cta_headline;
  const pageDesc  = settings[`${pk}_cta_desc`]  || settings[`${pk}_cta_subtext`]  || settings.cta_subtext;
  const pageBtn   = settings[`${pk}_cta_btn_text`] || settings[`${pk}_cta_button_text`] || settings.cta_button_text;
  const pageLink  = settings[`${pk}_cta_btn_link`] || settings[`${pk}_cta_button_link`];
  const pageBg    = settings[`${pk}_cta_bgImage`] || settings[`${pk}_cta_image`];
  const pageVis   = settings[`${pk}_cta_visible`];

  const headline = ctaObj.heading || pageTitle || defaultCta.headline || defaultCta.heading || 'Ready to Transform Your Space?';
  const subtext  = ctaObj.description || pageDesc || defaultCta.subtext || defaultCta.description || "Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.";
  const rawButtonText = ctaObj.buttonText || pageBtn || defaultCta.buttonText || "LET'S TALK ↗";
  const buttonText = typeof rawButtonText === 'string'
    ? rawButtonText.replace(/Book Free Consultation/gi, 'Book Consultation')
    : rawButtonText;
  const buttonLink = ctaObj.buttonLink || pageLink || defaultCta.path || defaultCta.buttonLink || '/contact';
  const bgImage    = ctaObj.bgImage || pageBg || defaultCta.bgImage || '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg';
  const opacity    = ctaObj.opacity !== undefined ? Number(ctaObj.opacity) : (defaultCta.opacity ?? 80);

  let enabled = true;
  if (ctaObj.enabled === false) enabled = false;
  if (pageVis === false) enabled = false;
  if (settings.cta_visible === false && !settings[`cta_${pk}`]) enabled = false;

  return {
    heading: headline,
    headline,
    description: subtext,
    subtext,
    buttonText,
    buttonLink,
    bgImage,
    opacity,
    enabled
  };
};

