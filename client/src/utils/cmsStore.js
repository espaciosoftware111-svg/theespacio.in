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
    title: 'Rajapushpa Provincia 3BHK Residence',
    slug: 'rajapushpa-provincia-3bhk',
    category: 'apartment',
    area: '2,850 sq.ft.',
    location: 'Narsingi, Hyderabad',
    year: 2025,
    style: 'Contemporary Warm Minimalist',
    description: 'A bespoke 3BHK turnkey interior design and execution project at Rajapushpa Provincia, Narsingi. Seamless timber paneling, concealed lighting tracks, and high-tolerance modular finishes.',
    story: {
      vision: 'The client, Dharma Teja, envisioned an uncluttered, modern contemporary sanctuary celebrating rich timber grain textures, clean line aesthetics, and warm indirect cove illumination. The space needed to maximize natural daylight from high-rise balconies while maintaining functional storage ergonomics.',
      challenges: 'Achieving millimeter-level planar alignment for continuous fluted wall cladding across doorway transitions, and concealing AC ducting channels within minimalist peripheral ceiling drops without sacrificing vertical room height.',
      solutions: 'Engineered custom lightweight composite backer structures with laser-guided leveling and integrated concealed magnetic shadowline profiles.',
      engineering: 'Calculated structural tolerances for heavy stone consoles and reinforced load-bearing TV and cabinetry joinery with mild steel sub-framing.',
      outcome: 'An impeccably detailed residential benchmark with zero visible hardware, ambient mood scenes, and seamless spatial flow.'
    },
    heroImage: '/images/projects/rajapushpa_provincia/rajapushpa_1.webp',
    gallery: [
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
      "/images/projects/rajapushpa_provincia/rajapushpa_20.webp",
      "/images/projects/rajapushpa_provincia/rajapushpa_after.webp"
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
    title: 'My Home Sayuk 3BHK Residence',
    slug: 'my-home-sayuk-3bhk',
    category: 'apartment',
    area: '2,750 sq.ft.',
    location: 'Tellapur, Hyderabad',
    year: 2025,
    style: 'Japandi Contemporary Luxury',
    description: 'A bespoke 3BHK turnkey interior design and execution project at My Home Sayuk, Tellapur. Incorporating elevated timber platforms, Japanese latticework screens, integrated linear cove lighting, and acoustic master bedrooms.',
    story: {
      vision: 'The client, Ganesh, sought a tranquil, Japandi-infused modern haven featuring organic wood accents, low-slung lounge ergonomics, and expansive natural light across the open living hall. The spatial design needed to balance private relaxation with open entertainment.',
      challenges: 'Executing a raised hardwood tea platform flush with expansive floor-to-ceiling balcony glazing, while engineering hidden linear HVAC diffusers into seamless perimeter ceiling drops.',
      solutions: 'Fabricated precision sub-frame floor joists with acoustic underlay buffers, combined with laser-cut geometric wooden screen dividers and flush-mounted indirect warm LED profiles.',
      engineering: 'Engineered structural load-bearing tolerances for cantilevered timber elements and reinforced acoustic wall paneling in all 3 bedroom suites.',
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
    title: 'Kokapet 2BHK Residence',
    slug: 'kokapet-2bhk',
    category: 'apartment',
    area: '1,650 sq.ft.',
    location: 'Kokapet, Hyderabad',
    year: 2025,
    style: 'Contemporary Warm Minimalist',
    description: 'A bespoke 2BHK turnkey interior design and execution project for Nagesh at Kokapet, Hyderabad. High-precision modular kitchen cabinetry, integrated designer TV unit, custom crockery unit, and serene bedroom suites.',
    story: {
      vision: 'The client, Nagesh, envisioned an elegant, functional 2BHK home in Kokapet with contemporary aesthetics, optimized spatial flow, ambient illumination, and bespoke modular cabinetry tailored for modern living.',
      challenges: 'Maximizing usable floor space and storage efficiency in a 2BHK layout while executing customized handleless modular joinery and flush TV wall paneling without visual bulk.',
      solutions: 'Engineered custom fluted wall paneling, integrated floating crockery and entertainment units, and premium modular storage solutions with soft-close German hardware.',
      engineering: 'Precision-aligned ceiling drop coves with concealed warm LED profiles, high-load anchor points for floating cabinetry, and anti-scratch acrylic finishes.',
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
    title: 'Kokapet Urban 2BHK Residence',
    slug: 'kokapet-urban-2bhk',
    category: 'apartment',
    area: '1,450 sq.ft.',
    location: 'Kokapet, Hyderabad',
    year: 2025,
    style: 'Clean Contemporary Luxury',
    description: 'A sophisticated 2BHK turnkey interior design and execution project for Rahul at Kokapet, Hyderabad. Featuring seamless acrylic modular kitchen cabinetry, custom floating TV consoles, high-gloss master wardrobes, and modern spatial lighting.',
    story: {
      vision: 'The client, Rahul, wanted a clean, contemporary 2BHK home in Kokapet prioritizing spatial flow, high-gloss surfaces, integrated modular storage, and serene bedroom retreats with ambient lighting.',
      challenges: 'Precision alignment of full-height wardrobe shutters and acrylic cabinetry in a compact high-rise footprint, while creating integrated LED shadowlines without lowering visible ceiling height.',
      solutions: 'Deployed moisture-resistant HDHMR core structures, German Häfele soft-close hardware, and laser-guided leveling for seamless wall-to-cabinet joints.',
      engineering: 'Engineered load-bearing anchors for cantilevered entertainment consoles and integrated flush perimeter mood lighting circuits across all rooms.',
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
    title: 'Gandipet Modern Retro 2BHK',
    slug: 'gandipet-modern-retro-2bhk',
    category: 'apartment',
    area: '1,750 sq.ft.',
    location: 'Gandipet, Hyderabad',
    year: 2025,
    style: 'Modern Retro Timber',
    description: 'A bespoke 2BHK turnkey interior design and execution project for Kiran Raja at Gandipet, Hyderabad. Featuring architectural timber louvers, fluted glass partitions, customized study suites, and warm ambient backlighting.',
    story: {
      vision: 'The client, Kiran Raja, envisioned a warm, retro-modern 2BHK home in Gandipet integrating rich natural timber louvers, dedicated home office zones, sleek entertainment walls, and serene ambient illumination.',
      challenges: 'Seamlessly aligning custom wooden slats and fluted acoustic paneling across dining and study areas without visible joints or exposed fasteners.',
      solutions: 'Crafted interlocking tongue-and-groove wooden wall slats with concealed rear clip fasteners and integrated low-voltage LED profile channels.',
      engineering: 'Engineered precision heat sinks for embedded LED lighting profiles inside the timber framework and reinforced load-bearing TV joinery.',
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
    title: 'Kondapur Minimalist Contemporary 2BHK',
    slug: 'kondapur-minimalist-2bhk',
    category: 'apartment',
    area: '1,520 sq.ft.',
    location: 'Kondapur, Hyderabad',
    year: 2025,
    style: 'Contemporary Minimalist Gray',
    description: 'A bespoke 2BHK turnkey interior design and execution project for Venkatesh at Kondapur, Hyderabad. Minimalist matte gray modular kitchen, customized living entertainment media wall, and tailored master bedroom wardrobe suites.',
    story: {
      vision: 'The client, Venkatesh, envisioned a contemporary 2BHK apartment in Kondapur with clean geometric lines, a monochromatic gray tone palette, high-efficiency kitchen storage, and luxurious bedroom retreats.',
      challenges: 'Integrating full-height wardrobe storage and floating entertainment cabinetry while preserving open walkway clearances and maximizing natural daylight flow.',
      solutions: 'Engineered seamless floor-to-ceiling acrylic wardrobes with concealed edge pulls, ultra-matte cabinetry finishes, and integrated architectural perimeter cove lighting.',
      engineering: 'Precision-crafted moisture-resistant HDHMR substrates paired with German Häfele soft-close hardware and concealed cable routing channels.',
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
    title: 'Gachibowli Minimalist Beige 2BHK',
    slug: 'gachibowli-minimalist-beige-2bhk',
    category: 'apartment',
    area: '1,480 sq.ft.',
    location: 'Gachibowli, Hyderabad',
    year: 2025,
    style: 'Minimalist Warm Beige',
    description: 'A serene 2BHK turnkey interior design and execution project for Koteswara Rao at Gachibowli, Hyderabad. Featuring minimalist warm beige master suites, fluted acoustic paneling, customized TV media consoles, and seamless cove spatial illumination.',
    story: {
      vision: 'The client, Koteswara Rao, wanted a tranquil, clutter-free 2BHK home in Gachibowli focusing on soft beige palettes, seamless wall-to-wardrobe integrations, cozy reading alcoves, and warm ambient illumination.',
      challenges: 'Crafting continuous fluted wall panels and flush concealed doors across living and master suites while ensuring flawless grain alignment.',
      solutions: 'Utilized calibrated HDHMR boards with anti-scratch PU coatings, precision CNC routed fluting, and hidden soft-close hinges.',
      engineering: 'Engineered recessed ceiling channels with high-CRI warm LED fixtures to wash natural textured surfaces with soft indirect light.',
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
    title: 'Kachiguda Fusion Duplex Villa',
    slug: 'kachiguda-fusion-duplex-villa',
    category: 'duplex',
    area: '3,800 sq.ft.',
    location: 'Kachiguda, Hyderabad',
    year: 2025,
    style: 'Modern & Traditional Fusion',
    description: 'An exquisite fusion duplex residence for K Subbarao at Kachiguda, Hyderabad. Harmonizing contemporary architectural joinery, vibrant custom accents, dedicated parents suites, boys study chambers, and grand living-dining spatial continuity.',
    story: {
      vision: 'The client, K Subbarao, envisioned a grand duplex villa in Kachiguda that elegantly bridges modern luxury with rich Indian design heritage for a multi-generational family.',
      challenges: 'Integrating multi-level ceiling designs, customized double-height statement accents, and cohesive transition palettes across parents and boys suites.',
      solutions: 'Bespoke fluted wood paneling, premium PU lacquer detailing, high-durability acrylic storage systems, and ambient architectural cove lighting.',
      engineering: 'Seamlessly routed concealed wiring, multi-tier ambient profile illumination, and anti-warp calibrated plywood frames.',
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
    a: 'Typically 2–3 months, depending on the level of detailing and customization involved in your project.',
    answer: 'Typically 2–3 months, depending on the level of detailing and customization involved in your project.',
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
    a: 'Yes. Every project we take on, residential or commercial, is delivered turnkey, with design, materials, execution, and finishing handled entirely by our team.',
    answer: 'Yes. Every project we take on, residential or commercial, is delivered turnkey, with design, materials, execution, and finishing handled entirely by our team.',
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
    a: 'We begin with a free consultation to understand your space, requirements, and vision, before moving into detailed design and planning.',
    answer: 'We begin with a free consultation to understand your space, requirements, and vision, before moving into detailed design and planning.',
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
    a: "We're proudly based in Hyderabad and have delivered residential and commercial projects across the city.",
    answer: "We're proudly based in Hyderabad and have delivered residential and commercial projects across the city.",
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
    a: 'Simply fill out our contact form on the website, and our team will get back to you to discuss your project.',
    answer: 'Simply fill out our contact form on the website, and our team will get back to you to discuss your project.',
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
    a: 'Yes. Our materials including WPC panels, polygranite sheets, acrylic sheets, and more are available for standalone purchase, without needing to book a full design or execution project with us.',
    answer: 'Yes. Our materials including WPC panels, polygranite sheets, acrylic sheets, and more are available for standalone purchase, without needing to book a full design or execution project with us.',
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
    q: 'Do I need to be involved throughout the project, or can it be handled remotely?',
    question: 'Do I need to be involved throughout the project, or can it be handled remotely?',
    a: "We keep you informed at every key stage with regular updates and site visits, so you're never left in the dark, but you don't need to manage day-to-day execution yourself. That's what turnkey means.",
    answer: "We keep you informed at every key stage with regular updates and site visits, so you're never left in the dark, but you don't need to manage day-to-day execution yourself. That's what turnkey means.",
    img: '/images/faq/faq_7_involvement.jpg',
    image: '/images/faq/faq_7_involvement.jpg',
    imageLabel: 'INVOLVEMENT',
    imageCaption: 'Do I need to be involved throughout the project?',
    tag: 'Involvement',
    category: 'INVOLVEMENT',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 7,
    homeOrder: 7,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-8',
    q: 'What if I already have a design in mind, can you just execute it?',
    question: 'What if I already have a design in mind, can you just execute it?',
    a: 'Absolutely. Whether you come with a finalized design or need us to design from scratch, we can adapt to execution-only or full design-and-build depending on what you need.',
    answer: 'Absolutely. Whether you come with a finalized design or need us to design from scratch, we can adapt to execution-only or full design-and-build depending on what you need.',
    img: '/images/faq/faq_8_custom.jpg',
    image: '/images/faq/faq_8_custom.jpg',
    imageLabel: 'CUSTOM',
    imageCaption: 'What if I already have a design in mind, can you just execute it?',
    tag: 'Custom',
    category: 'CUSTOM',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 8,
    homeOrder: 8,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-9',
    q: 'Can I customize designs, or do you offer fixed packages?',
    question: 'Can I customize designs, or do you offer fixed packages?',
    a: "Every project is fully customized around your space and preferences — we don't work off fixed templates or set packages.",
    answer: "Every project is fully customized around your space and preferences — we don't work off fixed templates or set packages.",
    img: '/images/faq/faq_9_design.jpg',
    image: '/images/faq/faq_9_design.jpg',
    imageLabel: 'DESIGN',
    imageCaption: 'Can I customize designs, or do you offer fixed packages?',
    tag: 'Design',
    category: 'DESIGN',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 9,
    homeOrder: 9,
    status: 'Published',
    visible: true
  },
  {
    id: 'faq-10',
    q: 'Do you provide warranties on completed projects?',
    question: 'Do you provide warranties on completed projects?',
    a: 'Yes. We offer up to 10-year comprehensive warranties on hardware and core modular components, backed directly by our factory certifications.',
    answer: 'Yes. We offer up to 10-year comprehensive warranties on hardware and core modular components, backed directly by our factory certifications.',
    img: '/images/faq/faq_10_support.jpg',
    image: '/images/faq/faq_10_support.jpg',
    imageLabel: 'SUPPORT',
    imageCaption: 'Do you provide warranties on completed projects?',
    tag: 'Support',
    category: 'SUPPORT',
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
    title: 'Full Home Interior Design & Execution', 
    tag: 'Turnkey Design & Build', 
    desc: 'Bespoke residential interior architecture engineered from concept to final handover. We integrate custom modular joinery, lighting layouts, and premium wall finishes into a seamless turnkey execution.', 
    includes: ['Living & Dining Spatial Architecture', 'Custom Modular Wardrobe Systems', 'Ergonomic Modular Kitchen Layouts', 'Ambient Cove & Architectural Lighting', 'Curated Wall & Surface Textures', 'Turnkey Execution & Project Oversight'], 
    img: '/images/company/2bhk_mordern_retro/hall.jpg',
    ctaText: 'Enquire About Interior Design',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 1
  },
  { 
    num: '02', 
    title: 'Commercial & Office Interiors', 
    tag: 'Workspaces & Retail', 
    desc: 'High-tolerance commercial fit-outs for corporate offices, experience centers, and retail environments. Engineered for acoustic optimization, brand elevation, and maximum workspace efficiency.', 
    includes: ['Corporate Office Spatial Planning', 'Retail & Studio Flow Optimization', 'Acoustic WPC Conference Suites', 'Ergonomic Workstation Clusters', 'Tech & AV Concealed Channels', 'Turnkey Commercial Buildout'], 
    img: '/images/company/2bhk_mordern_retro/office_3.jpg',
    ctaText: 'Enquire About Commercial Fit-Outs',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 2
  },
  { 
    num: '03', 
    title: 'Styling & Decor', 
    tag: 'Curated Styling', 
    desc: 'Curated styling, accessories, and finishing touches that bring a space to life — offered as a standalone service or as the final turnkey step on any Espacio project.', 
    includes: ['Art & Wall Decor Curation', 'Custom Soft Furnishings', 'Lighting & Accessory Styling', 'Plants & Greenery Selection', 'Color Palette Harmony', 'Bespoke Styling Audits'], 
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
    desc: 'Redesigning and upgrading existing spaces, residential or commercial, without starting from scratch — delivered turnkey, with design, materials, and execution handled entirely by us.', 
    includes: ['Kitchen & Bath Upgrades', 'Living Space Redesign', 'Structural Alterations', 'Flooring Replacement', 'Electrical & Plumbing Re-lay', 'Turnkey Execution'], 
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
    desc: 'Direct access to our extensive inventory of WPC wall & ceiling panels, polygranite sheets, acrylic fluted louvers, and hardware. Available for standalone purchase directly from our Aziznagar warehouse.', 
    includes: ['WPC Wall & Exterior Cladding Panels', 'Polygranite & High-Gloss Acrylic Sheets', 'Charcoal & Wood Grain Fluted Louvers', 'Architectural Trim & Edge Hardware', 'Standalone Wholesale & Retail Purchase', 'Rapid Delivery from Hyderabad Godowns'], 
    img: '/images/services/service_materials.jpg',
    ctaText: 'Enquire About Materials',
    ctaLink: '/materials',
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
  hero_stat2_value: '1 Year',
  hero_stat2_label: 'Since 2025',
  hero_stat3_value: '40+',
  hero_stat3_label: 'Years of Family Legacy',
  intro_heading: 'From Concept to Handover — ESPACIO Delivers Complete Interiors.',
  intro_description: 'We bring 40+ years of family construction heritage to luxury interior design. Every space we create is backed by structural thinking, premium materials sourced directly from our own warehouses, and meticulous execution.',
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
  exp_card1_address: '1st floor, H.No. 6-63/14B,\nMoinabad Road, Aziznagar,\nHyderabad, Telangana 500075',
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
  footer_address: '1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075',
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
              'villas': ["Grand Double-Height Foyer", "Courtyard & Lightwell Villa", "Contemporary Gated Villa", "Indo-Classical Luxury Villa", "Private Pent-Villa Deck"],
              'apartments': ["Compact 2BHK Smart Home", "Luxury 3BHK Residence", "Studio & Loft Space", "High-Rise Balcony Suite", "Open Concept Apartment"],
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
              data.spaces_list = data.spaces_list.filter(cat => cat.slug !== 'luxury-homes');
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
              if (cat.slug === 'apartments' && (!cat.galleryImages || cat.galleryImages.length !== 88 || !cat.galleryImages[0]?.includes('.webp'))) {
                cat.galleryImages = APARTMENT_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/apartments/apartment_drive_1.webp";
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
              if (cat.slug === 'villas' && (!cat.galleryImages || cat.galleryImages.length !== 35 || !cat.galleryImages[0]?.includes('villas'))) {
                cat.galleryImages = VILLAS_DRIVE_IMAGES;
                cat.heroImage = "/images/spaces/villas/villa_drive_30.webp";
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
          if (modified) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.FAQS && Array.isArray(data)) {
          let modified = false;
          data.forEach(item => {
            if (typeof item.image === 'string' && item.image.includes('Guest_restaurant_18')) {
              item.image = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg';
              modified = true;
            }
          });
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
            if (p1 && (!p1.beforeImage || p1.beforeImage.includes('spaces_hero'))) {
              p1.beforeImage = '/images/projects/rajapushpa_provincia/rajapushpa_before.webp';
              p1.afterImage = '/images/projects/rajapushpa_provincia/rajapushpa_after.webp';
              p1.beforeImages = ['/images/projects/rajapushpa_provincia/rajapushpa_before.webp'];
              p1.afterImages = ['/images/projects/rajapushpa_provincia/rajapushpa_after.webp'];
              try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
            }
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
          if (!Array.isArray(data.services_list) || data.services_list.length === 0 || data.services_list.some(s => typeof s.img === 'string' && s.img.includes('unsplash.com'))) {
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
  const buttonText = ctaObj.buttonText || pageBtn || defaultCta.buttonText || "LET'S TALK ↗";
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

