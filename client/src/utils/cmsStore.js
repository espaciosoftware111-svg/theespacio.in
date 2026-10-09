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

// Dispatch change event to all tabs and active components (debounced to prevent re-entrant update storms)
let notifyDebounceTimer = null;
export const notifyCMSUpdate = () => {
  if (notifyDebounceTimer) clearTimeout(notifyDebounceTimer);
  notifyDebounceTimer = setTimeout(() => {
    window.dispatchEvent(new Event('espacio_cms_update'));
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'CMS_UPDATED', timestamp: Date.now() });
      } catch {}
    }
  }, 100);
};

// Universal Publish to Live Site function: Syncs all local CMS stores, notifies active website views, and uploads to Supabase/backend
export const publishAllCMSChanges = async () => {
  try {
    const timestamp = new Date().toISOString();
    localStorage.setItem('espacio_last_published', timestamp);

    // 1. Sync settings to backend API
    try {
      const settings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (settings && Object.keys(settings).length > 0) {
        await axios.put('/settings', settings).catch(() => {});
      }
    } catch {}

    // 2. Sync projects to backend API
    try {
      const projects = getCMSData(STORAGE_KEYS.PROJECTS);
      if (Array.isArray(projects) && projects.length > 0) {
        await axios.put('/projects/bulk', { projects }).catch(() => {});
      }
    } catch {}

    // 3. Sync products/materials to backend API
    try {
      const products = getCMSData(STORAGE_KEYS.PRODUCTS);
      if (Array.isArray(products) && products.length > 0) {
        await axios.put('/products/bulk', { products }).catch(() => {});
      }
    } catch {}

    // 4. Sync FAQs to backend API
    try {
      const faqs = getCMSData(STORAGE_KEYS.FAQS);
      if (Array.isArray(faqs) && faqs.length > 0) {
        await axios.put('/faqs/bulk', { faqs }).catch(() => {});
      }
    } catch {}

    // 5. Sync Testimonials to backend API
    try {
      const testimonials = getCMSData(STORAGE_KEYS.TESTIMONIALS);
      if (Array.isArray(testimonials) && testimonials.length > 0) {
        await axios.put('/testimonials/bulk', { testimonials }).catch(() => {});
      }
    } catch {}

    // 6. Direct Supabase backup if available
    try {
      const { supabase } = await import('../lib/supabaseClient');
      if (supabase) {
        const settings = getCMSData(STORAGE_KEYS.SETTINGS);
        if (settings) {
          await supabase.from('settings').upsert({
            id: 'global_cms_settings',
            data: settings,
            updated_at: timestamp
          }).catch(() => {});
        }
      }
    } catch {}

    // Broadcast live event across all active tabs
    notifyCMSUpdate();

    return { success: true, timestamp };
  } catch (err) {
    console.warn('publishAllCMSChanges notice:', err);
    notifyCMSUpdate();
    return { success: true, timestamp: new Date().toISOString() };
  }
};

export const DEFAULT_PROJECTS = [
  {
    "_id": "proj_9_dimmu_chachu_residence",
    "order": 1,
    "title": "The Celestial Curve Villa",
    "slug": "dimmu-chachu-luxury-villa",
    "category": "villa",
    "area": "4,200 sq.ft.",
    "location": "Kukatpally, Hyderabad",
    "year": 2026,
    "style": "Contemporary Luxury Duplex Villa",
    "description": "A grand multi-level luxury villa characterized by an iconic double-height curved marble staircase with a crystal chandelier, custom Yin-Yang sculpted cove ceilings, high-gloss powder blue modular kitchen, and personalized themed suites including a Virat Kohli cricket room.",
    "story": {
      "vision": "The homeowners envisioned a contemporary architectural statement villa that balances grand entertainment spaces with deeply personalized private family suites. The central design element was an open, light-filled double-height foyer with a sweeping curved staircase that connects the levels seamlessly, accented with bespoke lighting and custom textured wall finishes.",
      "challenges": "Executing the double-height staircase required extreme structural precision for the curved safety glass balustrade and stainless steel handrails, aligning them accurately across both levels. Creating the fluid, sculpted S-curve cove lighting in the formal living ceiling also required specialized laser-cut framing and high-grade gypsum contouring without visible joints.",
      "solutions": "Custom radius structural glass templates with concealed base shoes, precision CNC-milled ceiling ribs, and dimmable 3000K warm architectural cove profiles to deliver soft, ambient illumination across all ceiling levels.",
      "engineering": "All electrical conduits, HVAC feeds, and structural anchor points were integrated prior to framing. Heavy-duty concealed brackets support the floating TV console against full-height vertical timber fluted wall paneling, and acoustic isolation dampens ambient noise between the living lounge and private bedroom wings.",
      "outcome": "A breathtaking residential showcase combining opulent architectural features, turnkey precision joinery, and tailored spaces that reflect the family’s passions and everyday lifestyle."
    },
    "heroImage": "/images/projects/dimmu_residence/dimmu_02.webp",
    "gallery": [
      "/images/projects/dimmu_residence/dimmu_02.webp",
      "/images/projects/dimmu_residence/dimmu_07.webp",
      "/images/projects/dimmu_residence/dimmu_09.webp",
      "/images/projects/dimmu_residence/dimmu_08.webp",
      "/images/projects/dimmu_residence/dimmu_04.webp",
      "/images/projects/dimmu_residence/dimmu_10.webp",
      "/images/projects/dimmu_residence/dimmu_01.webp",
      "/images/projects/dimmu_residence/dimmu_06.webp",
      "/images/projects/dimmu_residence/dimmu_05.webp",
      "/images/projects/dimmu_residence/dimmu_03.webp"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791181647/espacio_gallery/e1qshojaqimsqnxxk02t.jpg",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_05_43_06_PM.png",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791181647/espacio_gallery/e1qshojaqimsqnxxk02t.jpg"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_05_43_06_PM.png"
    ],
    "testimonialName": "Hussain",
    "testimonialProfession": "Homeowner, Hyderabad",
    "testimonialText": "ESPACIO turned our dream villa into reality! The grand double-height staircase with the chandelier and the custom cricket tribute bedroom for our boys are the highlights of our new home. Their craftsmanship, materials, and execution were truly top tier.",
    "testimonialRating": 5,
    "testimonial": {
      "name": "Hussain",
      "profession": "Homeowner, Hyderabad",
      "role": "Homeowner, Hyderabad",
      "text": "ESPACIO turned our dream villa into reality! The grand double-height staircase with the chandelier and the custom cricket tribute bedroom for our boys are the highlights of our new home. Their craftsmanship, materials, and execution were truly top tier.",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  },
  {
    "_id": "proj_11_casa_alta_residence_kali_mandir",
    "order": 2,
    "title": "Casa Alta Residence",
    "slug": "casa-alta-residence-kali-mandir",
    "category": "apartment",
    "area": "2,400 sq.ft.",
    "location": "Kali Mandir, Hyderabad",
    "year": 2026,
    "style": "Contemporary Warm Minimalist & Timber Elegance",
    "description": "A calm, well-balanced 3BHK home where every room feels connected to the next, from the fluted wall in the living room to the mural on the staircase. Delivered turnkey and on schedule with warm timber, stone accents, and seamless cove lighting.",
    "story": {
      "vision": "The family wanted a home that feels calm and open, modern in its restraint but warm the way traditional homes are. Light, timber and stone were meant to tie the rooms together, so the house feels like one story from the front door to the bedroom.",
      "challenges": "With open living and dining areas, the home needed one design language running through it. Fluted panels, veneer and stone had to meet cleanly from room to room, and the false ceiling had to carry into the wall treatments so nothing felt like a separate space.",
      "solutions": "It starts in the living room, where a fluted feature wall sets the tone and grain-matched veneer carries on into the dining area. The double-height staircase is the heart of the home, with a Jesus mural rising along its wall. A backlit stone-and-timber pooja unit and a calm master suite with a walk-in wardrobe follow the same palette. Recessed warm-white coves tie every space together.",
      "engineering": "Cove lighting needs ventilation gaps and safe clearances from the finishes, so we planned both in from the start. That keeps the veneer from warping or fading over time. The wardrobes and pooja unit are built on moisture-resistant boards with heavy-duty hardware made for daily use. None of this is visible once the home is finished, but it is why the home looks as good years later as it did on handover day.",
      "outcome": "A calm, well-balanced home where every room feels connected to the next, from the fluted wall in the living room to the mural on the staircase. Delivered turnkey and on schedule."
    },
    "heroImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040114/espacio_gallery/ues8rn6ddd052rkmlesl.png",
    "gallery": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040114/espacio_gallery/ues8rn6ddd052rkmlesl.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040153/espacio_gallery/dnligxpinxfkkzbwdesc.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040124/espacio_gallery/z54sqdn0rxz5uvvz6vde.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040145/espacio_gallery/dn73ubo6rocp6ptcxqzy.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040150/espacio_gallery/gctshkszvbpfjlegttqp.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040137/espacio_gallery/alkqwzmvoiitkbzqxci7.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040132/espacio_gallery/s3eem08ug6sagt9hj2tz.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040107/espacio_gallery/duhzjiu5foyimwshxgqx.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040142/espacio_gallery/zoelg4rucvrxaeuxuqkx.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040101/espacio_gallery/gn1gylu6rnd1jvpobceu.png"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791182841/espacio_gallery/hotcipl3uxkn3fk6hrfn.jpg",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040114/espacio_gallery/ues8rn6ddd052rkmlesl.png",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791182841/espacio_gallery/hotcipl3uxkn3fk6hrfn.jpg"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791040114/espacio_gallery/ues8rn6ddd052rkmlesl.png"
    ],
    "testimonialName": "Prakash",
    "testimonialProfession": "Homeowner, Kali Mandir",
    "testimonialText": "Espacio delivered our 3BHK with exceptional precision. The fluted paneling, timber finishes and cove lighting make every room feel connected and calm. They were transparent on costs and handed over exactly on the promised date.",
    "testimonialRating": 5,
    "testimonial": {
      "name": "Prakash",
      "profession": "Homeowner, Kali Mandir",
      "role": "Homeowner, Kali Mandir",
      "text": "Espacio delivered our 3BHK with exceptional precision. The fluted paneling, timber finishes and cove lighting make every room feel connected and calm. They were transparent on costs and handed over exactly on the promised date.",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  },
  {
    "_id": "proj_5_gandipet_kiran",
    "order": 3,
    "title": "The Panelled Muse",
    "slug": "gandipet-modern-retro-2bhk",
    "category": "apartment",
    "area": "1,750 sq.ft.",
    "location": "Gandipet, Hyderabad",
    "year": 2025,
    "style": "Modern Retro Timber",
    "description": "A warm, retro modern 2BHK with rich timber louvers, classic wall paneling, a dedicated home office corner, and richly layered lighting throughout. Every room mixes old world charm with modern comfort, giving Kiran a home that feels timeless rather than trendy.",
    "story": {
      "vision": "Kiran wanted his 2BHK to feel warm and retro modern, somewhere between classic and contemporary. Rich natural timber, detailed wall paneling, and a proper home office zone were all part of the early plan, along with an entertainment wall that would anchor the living room and soft ambient lighting that would carry that warmth into every corner.",
      "challenges": "Getting those custom wooden slats and fluted panels to line up across the dining and study areas took a lot of careful planning, since even one visible joint or exposed screw would break the whole look. On top of that, every wall panel had to sit flush with the next, so the classic paneling reads as one continuous design instead of a patchwork of separate pieces.",
      "solutions": "Crafted interlocking tongue-and-groove wooden wall slats with concealed rear clip fasteners and integrated low-voltage LED profile channels.",
      "engineering": "Running LED lighting inside the timber framework meant working out proper heat management first, so the wood stays safe and doesn't warp or discolor over time. The TV wall also needed reinforced joinery underneath to carry its weight safely for years. It's the kind of planning that never shows on the surface, but it's exactly what keeps a home looking as good on day one thousand as it did on day one.",
      "outcome": "A warm, tactile, character-filled 2BHK residence with editorial-grade craftsmanship delivered turnkey on schedule."
    },
    "heroImage": "/images/projects/gandipet_kiran_2bhk/kiran_gallery_4.webp",
    "gallery": [
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_4.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_5.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_9.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_24.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_18.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_14.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_17.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_7.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_15.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_16.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_12.webp",
      "/images/projects/gandipet_kiran_2bhk/kiran_gallery_21.webp"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791132839/espacio_gallery/mysq2iymi1lwd2lgk5v0.jpg",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791132839/espacio_gallery/mysq2iymi1lwd2lgk5v0.jpg"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png"
    ],
    "testimonialName": "Kiran Raja",
    "testimonialProfession": "Homeowner, Gandipet",
    "testimonialText": "The craftsmanship delivered by ESPACIO for our 2BHK flat at Gandipet is unmatched. The natural wood timber finishes, acoustic wall paneling, and custom lighting transformed our home into a tranquil, five-star sanctuary. Great team, super transparent, and always on time!",
    "testimonialRating": 5,
    "testimonial": {
      "name": "Kiran Raja",
      "profession": "Homeowner, Gandipet",
      "role": "Homeowner, Gandipet, Hyderabad",
      "text": "The craftsmanship delivered by ESPACIO for our 2BHK flat at Gandipet is unmatched. The natural wood timber finishes, acoustic wall paneling, and custom lighting transformed our home into a tranquil, five-star sanctuary. Great team, super transparent, and always on time!",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  },
  {
    "_id": "proj_6_kondapur_venkatesh",
    "order": 4,
    "title": "The Dusk Lounge",
    "slug": "kondapur-minimalist-2bhk",
    "category": "apartment",
    "area": "1,520 sq.ft.",
    "location": "Kondapur, Hyderabad",
    "year": 2025,
    "style": "Contemporary Minimalist Gray",
    "description": "A clean, contemporary 2BHK built around a calming grey palette, full height wardrobes, a sleek floating media wall, and a kitchen designed for real everyday use. Every detail here was chosen to keep the home feeling open, organized, and quietly luxurious.",
    "story": {
      "vision": "Venkatesh wanted his 2BHK to feel contemporary and composed, built around clean geometric lines and a soft monochromatic grey palette. The kitchen needed to work as hard as it looked good, with smart, efficient storage built in from the start, and the bedrooms were planned as proper retreats, calm spaces to unwind at the end of the day.",
      "challenges": "Fitting in full height wardrobes and a floating media unit without the rooms feeling boxed in took careful planning. We had to protect the open walkway space and make sure natural light could still move freely through the apartment, so the extra storage never came at the cost of how open the home felt.",
      "solutions": "Engineered seamless floor-to-ceiling acrylic wardrobes with concealed edge pulls, ultra-matte cabinetry finishes, and integrated architectural perimeter cove lighting.",
      "engineering": "Every cabinet and wardrobe was built using moisture resistant boards paired with premium soft close hardware, so the doors stay smooth and quiet for years, even in Hyderabad's humidity. Cable routing was also planned and hidden from the start, so the entertainment wall stays clean and clutter free, with nothing dangling or exposed to spoil the look.",
      "outcome": "A sleek, modern 2BHK residence with pristine geometric alignment, maximum storage utility, and timeless contemporary luxury."
    },
    "heroImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/71b2e914-cfd2-49fc-9d5a-47faa39b4bdd",
    "gallery": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b438c830-9b61-45c5-96b5-d2ba352b7fc5.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/773a222b-ce2f-4f40-a2d6-f2e91199aec5.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/6f7bce1d-d140-45ee-a08b-ecb09433bdb7.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/429bec7e-a053-4465-a821-74744ea494ae",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/71b2e914-cfd2-49fc-9d5a-47faa39b4bdd",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/c951f195-af50-4d89-8ad7-f1daed330a75.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ad891782-7131-4b54-8b7d-73dda3d5eea0.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/c90d8da8-3e5d-42aa-8a2e-f9cfa28af410.png"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/a76b15e5-e59b-4f54-aeb9-c0055b37350a.png",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/6f7bce1d-d140-45ee-a08b-ecb09433bdb7.png",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/a76b15e5-e59b-4f54-aeb9-c0055b37350a.png"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/6f7bce1d-d140-45ee-a08b-ecb09433bdb7.png"
    ],
    "testimonialName": "Venkatesh",
    "testimonialProfession": "Homeowner, Kondapur",
    "testimonialText": "ESPACIO did an extraordinary job turning our 2BHK flat in Kondapur into our dream home. The contemporary gray modular kitchen and custom TV unit finish are flawless. Everything was handled professionally with complete transparency. Highly recommend ESPACIO!",
    "testimonialRating": 5,
    "testimonial": {
      "name": "Venkatesh",
      "profession": "Homeowner, Kondapur",
      "role": "Homeowner, Kondapur, Hyderabad",
      "text": "ESPACIO did an extraordinary job turning our 2BHK flat in Kondapur into our dream home. The contemporary gray modular kitchen and custom TV unit finish are flawless. Everything was handled professionally with complete transparency. Highly recommend ESPACIO!",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  },
  {
    "_id": "proj_7_gachibowli_koteswara",
    "order": 5,
    "title": "A 2BHK Residence, Gachibowli",
    "slug": "gachibowli-minimalist-beige-2bhk",
    "category": "apartment",
    "area": "1,480 sq.ft.",
    "location": "Gachibowli, Hyderabad",
    "year": 2025,
    "style": "Minimalist Warm Beige",
    "description": "A calm, uncluttered 2BHK built around soft beige tones, seamless wardrobe integration, and warm ambient light throughout. Every corner was planned to feel peaceful, with a home entry that still makes a striking first impression.",
    "story": {
      "vision": "Koteswara Rao wanted his 2BHK to feel calm and completely clutter free, built around a soft beige palette that would carry through every room. Wardrobes were planned to blend directly into the walls rather than stand out, with a cozy reading corner and warm ambient lighting designed to make the whole home feel like a place to unwind.",
      "challenges": "Getting the fluted wall panels to run continuously across the living area and master bedroom, with doors that disappear flush into the paneling, took a lot of careful planning. Every panel had to line up perfectly, and the wood grain had to match seamlessly from one section to the next, so nothing ever looked pieced together.",
      "solutions": "Utilized calibrated HDHMR boards with anti-scratch PU coatings, precision CNC routed fluting, and hidden soft-close hinges.",
      "engineering": "Ceiling channels were built in to house warm, high quality LED lighting that softly washes across the textured walls, bringing out the natural grain without ever feeling harsh. Even the entryway got the same attention to detail, with a striking gold console table and framed wall accents that turn a simple hallway into a proper welcome home moment.",
      "outcome": "A tranquil, sophisticated 2BHK haven delivering five-star hotel comfort with pristine finishes on schedule."
    },
    "heroImage": "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_4.webp",
    "gallery": [
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_4.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_5.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_7.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_6.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_2.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_3.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_1.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_8.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_9.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_10.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_11.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_12.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_13.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_16.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_22.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_26.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_27.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_28.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_23.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_24.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_25.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_14.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_18.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_21.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_17.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_20.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_15.webp",
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_gallery_19.webp"
    ],
    "beforeImage": "/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp",
    "afterImage": "/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp",
    "beforeImages": [
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp"
    ],
    "afterImages": [
      "/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp"
    ],
    "testimonialName": "Koteswara Rao",
    "testimonialProfession": "Homeowner, Gachibowli",
    "testimonialText": "ESPACIO transformed our Gachibowli 2BHK flat into a breathtaking, tranquil sanctuary. The soft minimalist beige tones, master bedroom wardrobes, and elegant living room finishes exceeded all our expectations. Seamless execution and timely handover!",
    "testimonialRating": 5,
    "testimonial": {
      "name": "Koteswara Rao",
      "profession": "Homeowner, Gachibowli",
      "role": "Homeowner, Gachibowli, Hyderabad",
      "text": "ESPACIO transformed our Gachibowli 2BHK flat into a breathtaking, tranquil sanctuary. The soft minimalist beige tones, master bedroom wardrobes, and elegant living room finishes exceeded all our expectations. Seamless execution and timely handover!",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  },
  {
    "_id": "proj_8_kachiguda_subbarao",
    "order": 6,
    "title": "A Duplex Residence, Kachiguda",
    "slug": "kachiguda-fusion-duplex-villa",
    "category": "duplex",
    "area": "3,800 sq.ft.",
    "location": "Kachiguda, Hyderabad",
    "year": 2025,
    "style": "Modern & Desi 4BHK Fusion",
    "description": "An exquisite fusion of contemporary luxury and Desi soul across a sprawling 4BHK duplex in Kachiguda. Featuring a grand living hall, sculptural marble staircase, and bespoke modular chef's kitchen.",
    "story": {
      "vision": "To craft a multi-generational 4BHK duplex residence in Kachiguda where modern European minimalist aesthetics coalesce with Indian domestic warmth. The design centers around an expansive ground-floor living and entertainment zone, interconnected by a sweeping marble staircase with glass balustrades, creating seamless sightlines between the lounge, dining island, and culinary spaces.",
      "challenges": "Unifying the open-concept ground floor without acoustic reverberation between the entertainment lounge and culinary zones, while crafting deeply tailored atmospheres for each generation: an elegant, serene retreat for the parents with heritage 'Desi' artwork and rich walnut joinery, and an aspirational bedroom for the boys featuring authentic vintage technical illustrations.",
      "solutions": "Engineered acoustic fluted wall paneling, perimeter architectural coves, and recessed magnetic track lighting to softly define functional zones. Anchored the living hall with a floating media wall, roaring linear fireplace, and sculptural staircase. Commissioned a custom full-scale vintage French Nieuport biplane technical blueprint mural in the boys' suite, and designed a tranquil parents' sanctuary with solid walnut furniture, traditional circular ink mandala art, and a fluted walk-in dressing wardrobe.",
      "engineering": "Precision-engineered carpentry with PU and champagne gloss finishes, custom glass-and-brass stair balustrades, concealed ducted HVAC raceways, and smart digital integration across modular kitchen and wardrobe systems.",
      "outcome": "A tour-de-force of turnkey residential architecture. Flawless zero-tolerance millwork, imported Calacatta marble accents, integrated smart refrigeration, and bespoke lighting fixtures coalesce into an opulent, warm home delivered on schedule for K. Subba Rao and family."
    },
    "heroImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178148/espacio_gallery/k21ayumhuuy0tmqj7rfg.jpg",
    "gallery": [
      // Bedrooms: Parents Master Suite (1–6)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178148/espacio_gallery/k21ayumhuuy0tmqj7rfg.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178153/espacio_gallery/a6wykpal9jlyprn3zgfj.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178155/espacio_gallery/ya5s3s0zzfjvhnbsjqck.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178156/espacio_gallery/biocek0jbgeuvaqjoq5q.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178157/espacio_gallery/yddjmwdvaqsjuwtsbf5u.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178171/espacio_gallery/qasnmvvaklm6a14yslao.jpg",
      // Bedrooms: Boys Bedroom Suite (7–12)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178149/espacio_gallery/ral5g7qhiphwuacdhvs6.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178159/espacio_gallery/u58mq18dbeuqf5coc1jg.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178160/espacio_gallery/zmie8c1jua6jc26kbf4g.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178161/espacio_gallery/gkszz4hoaguhsvcvahva.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178170/espacio_gallery/ku1jtnpv0osjknwzr9aj.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178173/espacio_gallery/adeg00wsepmxhkdsovzx.jpg",
      // Hall / Living Lounge (13–20)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178139/espacio_gallery/fjoq7ss31x85vjccgr5a.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178141/espacio_gallery/u3jboyp6o3tqjy1zffvf.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178142/espacio_gallery/yhbdhtzvtts6lbjcyvhb.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178144/espacio_gallery/lppkuofoaxacxbxjinf3.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178145/espacio_gallery/ykmradholvjphbaimyso.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178165/espacio_gallery/csltktkkly4u9k9lzwzy.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178166/espacio_gallery/axj2hwzys16jwa3znfsy.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178167/espacio_gallery/ijfi1nbiejxe9ksgxaod.jpg",
      // Modular Kitchen (21–22)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178152/espacio_gallery/mg21x4oyxpuhrbaitw6l.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178169/espacio_gallery/dhwdwmpgjlopbwvwq42z.jpg",
      // Dining Suite & Island (23–26)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178146/espacio_gallery/eaniagfydwjdgbo0esqn.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178150/espacio_gallery/wrazj2wmluws0ue1pddo.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178163/espacio_gallery/ytniqcfxfpv8vmdngn7o.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178151/espacio_gallery/qhbbsh8imivcxs2imtzg.jpg"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176785/espacio_gallery/blohvaxle28zo18l7lug.jpg",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178176/espacio_gallery/unbmruocdxxhcb4wvn7e.jpg",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176785/espacio_gallery/blohvaxle28zo18l7lug.jpg"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178176/espacio_gallery/unbmruocdxxhcb4wvn7e.jpg"
    ],
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
    "rooms": [
      {
        "name": "Grand Duplex Living Hall & Architectural Staircase Vista",
        "room": "Grand Duplex Living Hall & Architectural Staircase Vista",
        "title": "Grand Duplex Living Hall & Architectural Staircase Vista",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178139/espacio_gallery/fjoq7ss31x85vjccgr5a.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_1.webp",
        "description": "Showstopper panoramic wide-angle perspective of the ground floor duplex living hall, showcasing the floating linear fireplace, marble staircase with glass railings, modular kitchen, and formal dining suite."
      },
      {
        "name": "Living Lounge, Roaring Linear Fireplace & Media Tower",
        "room": "Living Lounge, Roaring Linear Fireplace & Media Tower",
        "title": "Living Lounge, Roaring Linear Fireplace & Media Tower",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178141/espacio_gallery/u3jboyp6o3tqjy1zffvf.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_2.webp",
        "description": "Bespoke entertainment wall with integrated glowing linear fireplace, open oak bookcase tower, sculptural white ribbon armchair, KAWS collector art sculpture, and twilight courtyard window."
      },
      {
        "name": "Open-Concept Duplex Living & Dining Transition",
        "room": "Open-Concept Duplex Living & Dining Transition",
        "title": "Open-Concept Duplex Living & Dining Transition",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178142/espacio_gallery/yhbdhtzvtts6lbjcyvhb.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_3.webp",
        "description": "Dynamic perspective from the plush modular sofa across the Calacatta marble coffee table toward the white spun chair, duplex marble stairs, and illuminated dining pavilion."
      },
      {
        "name": "Living Lounge & KAWS Art Sculpture Nook",
        "room": "Living Lounge & KAWS Art Sculpture Nook",
        "title": "Living Lounge & KAWS Art Sculpture Nook",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178144/espacio_gallery/lppkuofoaxacxbxjinf3.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_4.webp",
        "description": "Expansive lounge view displaying the heather-grey modular sectional sofa, houndstooth ottoman, life-sized KAWS sculpture, and floor-to-ceiling picture window."
      },
      {
        "name": "Living Lounge & Courtyard Picture Window",
        "room": "Living Lounge & Courtyard Picture Window",
        "title": "Living Lounge & Courtyard Picture Window",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178145/espacio_gallery/ykmradholvjphbaimyso.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_5.webp",
        "description": "Corner lounge perspective highlighting the expansive picture window looking out onto landscaped gardens, paired with acoustic wood paneling and marble entry portals."
      },
      {
        "name": "Dining Bar Island, Duplex Staircase & Kitchen Vista",
        "room": "Dining Bar Island, Duplex Staircase & Kitchen Vista",
        "title": "Dining Bar Island, Duplex Staircase & Kitchen Vista",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178146/espacio_gallery/eaniagfydwjdgbo0esqn.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_6.webp",
        "description": "Architectural vista from the natural oak breakfast counter past the white stag sculpture on the stair landing toward the floating marble staircase and open kitchen."
      },
      {
        "name": "Parents Master Suite & Traditional Ink Mandala Crest",
        "room": "Parents Master Suite & Traditional Ink Mandala Crest",
        "title": "Parents Master Suite & Traditional Ink Mandala Crest",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178148/espacio_gallery/k21ayumhuuy0tmqj7rfg.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_7.webp",
        "description": "Symmetrical luxury master bedroom featuring a solid walnut king bed, fluted acoustic headboard wall with rose-gold metallic inlays, framed circular ink artwork, and lantern pendant lights."
      },
      {
        "name": "Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural",
        "room": "Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural",
        "title": "Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178149/espacio_gallery/ral5g7qhiphwuacdhvs6.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_8.webp",
        "description": "Signature bedroom suite boasting a custom full-wall vintage biplane technical blueprint mural, upholstered king bed with houndstooth cushions, and suspended brass pill capsule pendants."
      },
      {
        "name": "Formal Dining Suite & Amber Globe Chandelier",
        "room": "Formal Dining Suite & Amber Globe Chandelier",
        "title": "Formal Dining Suite & Amber Globe Chandelier",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178150/espacio_gallery/wrazj2wmluws0ue1pddo.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_9.webp",
        "description": "Luxury marble dining table with brushed brass pedestal base, six cream leather chairs, designer branching amber glass chandelier, and bronze glass sliding partitions."
      },
      {
        "name": "Dining Pavilion & Integrated Smart Refrigerator",
        "room": "Dining Pavilion & Integrated Smart Refrigerator",
        "title": "Dining Pavilion & Integrated Smart Refrigerator",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178151/espacio_gallery/qhbbsh8imivcxs2imtzg.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_10.webp",
        "description": "Seamless integration of culinary luxury and entertainment dining, featuring the built-in smart refrigerator with digital panel flush within the cabinetry."
      },
      {
        "name": "Chef's Modular Kitchen & Quartz Countertops",
        "room": "Chef's Modular Kitchen & Quartz Countertops",
        "title": "Chef's Modular Kitchen & Quartz Countertops",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178152/espacio_gallery/mg21x4oyxpuhrbaitw6l.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_11.webp",
        "description": "High-gloss acrylic white modular kitchen with seamless quartz countertops, undermount double sink, integrated gas hob, and black glass chimney hood."
      },
      {
        "name": "Parents Suite Perspective & Bedside Lanterns",
        "room": "Parents Suite Perspective & Bedside Lanterns",
        "title": "Parents Suite Perspective & Bedside Lanterns",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178153/espacio_gallery/a6wykpal9jlyprn3zgfj.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_12.webp",
        "description": "Angled perspective of the parents bedroom suite with dark walnut nightstands, marble bedside lamps, textured area rug, and sheer curtain backdrop."
      },
      {
        "name": "Parents Suite Wardrobes & Twilight Garden Vista",
        "room": "Parents Suite Wardrobes & Twilight Garden Vista",
        "title": "Parents Suite Wardrobes & Twilight Garden Vista",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178155/espacio_gallery/ya5s3s0zzfjvhnbsjqck.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_13.webp",
        "description": "Floor-to-ceiling handleless champagne gloss wardrobes, modern geometric ceiling chandelier, and expansive picture window framing the landscaped exterior."
      },
      {
        "name": "Parents Suite Fluted TV Media Wall & Marble Inlay",
        "room": "Parents Suite Fluted TV Media Wall & Marble Inlay",
        "title": "Parents Suite Fluted TV Media Wall & Marble Inlay",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178156/espacio_gallery/biocek0jbgeuvaqjoq5q.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_14.webp",
        "description": "Light oak fluted entertainment wall accented with a vertical Calacatta marble strip in brass framing, floating Scandinavian media console, and wall-mounted TV."
      },
      {
        "name": "Parents Suite Walk-In Dressing Wardrobe",
        "room": "Parents Suite Walk-In Dressing Wardrobe",
        "title": "Parents Suite Walk-In Dressing Wardrobe",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178157/espacio_gallery/yddjmwdvaqsjuwtsbf5u.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_15.webp",
        "description": "Custom walk-in closet flanked by fluted wood partitions, illuminated open organizers, hanging wardrobe bays, trouser racks, and brass Sputnik wall sconce."
      },
      {
        "name": "Boys Suite Bed, Nightstands & Blueprint Feature Wall",
        "room": "Boys Suite Bed, Nightstands & Blueprint Feature Wall",
        "title": "Boys Suite Bed, Nightstands & Blueprint Feature Wall",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178159/espacio_gallery/u58mq18dbeuqf5coc1jg.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_16.webp",
        "description": "Angled perspective of the boys room featuring the contemporary leatherette platform bed, dual-tone nightstands, warm bedside reading lamp, and graphic carpet."
      },
      {
        "name": "Aeronautical Biplane Technical Blueprint Detail",
        "room": "Aeronautical Biplane Technical Blueprint Detail",
        "title": "Aeronautical Biplane Technical Blueprint Detail",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178160/espacio_gallery/zmie8c1jua6jc26kbf4g.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_17.webp",
        "description": "High-resolution architectural detail of the vintage French Nieuport biplane technical blueprint mural and dual gold pendant globes."
      },
      {
        "name": "Boys Suite Modular Wardrobe & Walnut Display Niche",
        "room": "Boys Suite Modular Wardrobe & Walnut Display Niche",
        "title": "Boys Suite Modular Wardrobe & Walnut Display Niche",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178161/espacio_gallery/gkszz4hoaguhsvcvahva.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_18.webp",
        "description": "Clean-lined white floor-to-ceiling wardrobe bank with horizontal open walnut display niche for books and collectables, fitted with matte black edge pulls."
      },
      {
        "name": "Dining Bar Counter & Houndstooth Seating",
        "room": "Dining Bar Counter & Houndstooth Seating",
        "title": "Dining Bar Counter & Houndstooth Seating",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178163/espacio_gallery/ytniqcfxfpv8vmdngn7o.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_19.webp",
        "description": "Cantilevered oak breakfast bar integrated into white low credenza, accompanied by houndstooth bar stools with brass legs, minimalist wire clock, and fluted paneling."
      },
      {
        "name": "Living Room Sofa & Marble Coffee Table Detail",
        "room": "Living Room Sofa & Marble Coffee Table Detail",
        "title": "Living Room Sofa & Marble Coffee Table Detail",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178165/espacio_gallery/csltktkkly4u9k9lzwzy.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_20.webp",
        "description": "Detailed front perspective of the heather-grey sectional sofa, ceramic vases with golden branches on marble table, and dining transition."
      },
      {
        "name": "Living Lounge Seating Vignette",
        "room": "Living Lounge Seating Vignette",
        "title": "Living Lounge Seating Vignette",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178166/espacio_gallery/axj2hwzys16jwa3znfsy.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_21.webp",
        "description": "Intimate lounge vignette showcasing layered cushion textures, minimalist desk lamp, and full-height sheer drapery."
      },
      {
        "name": "Living Lounge Centered Perspective",
        "room": "Living Lounge Centered Perspective",
        "title": "Living Lounge Centered Perspective",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178167/espacio_gallery/ijfi1nbiejxe9ksgxaod.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_22.webp",
        "description": "Centered elevation of the living sofa with golden block end-table, brass accents, and seamless Italian marble floor tiles."
      },
      {
        "name": "Integrated Smart Refrigerator & Fluted Portal Detail",
        "room": "Integrated Smart Refrigerator & Fluted Portal Detail",
        "title": "Integrated Smart Refrigerator & Fluted Portal Detail",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178169/espacio_gallery/dhwdwmpgjlopbwvwq42z.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_23.webp",
        "description": "Bespoke joinery housing the double-door smart refrigerator alongside bronze-tinted glass sliding doors and white panelled interior door."
      },
      {
        "name": "Boys Suite Study Wall & Grid Memory Board",
        "room": "Boys Suite Study Wall & Grid Memory Board",
        "title": "Boys Suite Study Wall & Grid Memory Board",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178170/espacio_gallery/ku1jtnpv0osjknwzr9aj.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_24.webp",
        "description": "Vibrant study wall with yellow accent paint, charcoal grey contrast, black metal wire grid photo organizer, and graphic framed prints."
      },
      {
        "name": "Parents Suite Floor Vista & Entertainment Wall",
        "room": "Parents Suite Floor Vista & Entertainment Wall",
        "title": "Parents Suite Floor Vista & Entertainment Wall",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178171/espacio_gallery/qasnmvvaklm6a14yslao.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_25.webp",
        "description": "Wide architectural perspective showing the spatial flow of the parents bedroom suite, light oak flooring, and media entertainment wall."
      },
      {
        "name": "Boys Suite Architectural Shell & Curtains",
        "room": "Boys Suite Architectural Shell & Curtains",
        "title": "Boys Suite Architectural Shell & Curtains",
        "image": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791178173/espacio_gallery/adeg00wsepmxhkdsovzx.jpg",
        "localImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_26.webp",
        "description": "Spatial layout showing the floor carpet, double-height window curtains with terracotta orange accents, and sunshine yellow feature wall."
      }
    ],
    "featured": true,
    "status": "published"
  },
  {
    "_id": "proj_10_the_restful_home_tellapur",
    "order": 7,
    "title": "The Restful Home",
    "slug": "the-restful-home-tellapur",
    "category": "apartment",
    "area": "1,250 sq.ft.",
    "location": "Tellapur, Hyderabad",
    "year": 2026,
    "style": "Japandi-inspired, light and functional",
    "description": "A bright, serene 2BHK that feels more spacious than it is, and a home that welcomes the family back at the end of every day. Delivered turnkey with soft warm tones, custom slatted partitions, and smart full-height storage.",
    "story": {
      "vision": "After a long day at work, this young family wanted to come home and finally exhale. They asked for a simple, peaceful home with enough storage that nothing ever feels crowded, and a layout that can grow with their children.",
      "challenges": "In a compact 2BHK layout, every inch matters. The challenge was ensuring every wall quietly carries its share of storage while keeping the rooms open, light, and uncluttered, preventing any feeling of confinement.",
      "solutions": "We designed around one feeling: the moment they walk in, the day should slow down. Everything was planned together. An uncluttered entrance tucked everyday items neatly away. A slatted partition separates the dining area while maintaining continuous airflow and light. Both bedrooms feature full-height custom wardrobes.",
      "engineering": "Doors close softly with premium German soft-close mechanisms, finishes are curated to withstand daily family life with ease, and every bespoke millwork piece was dry-fitted precisely before final installation. Soft, warm lighting circuits were planned to take over in the evening to settle the atmosphere.",
      "outcome": "A bright, serene 2BHK that feels more spacious than it is, and a home that welcomes the family back at the end of every day. Delivered turnkey and handed over on the committed date."
    },
    "heroImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039597/espacio_gallery/gl4os8hhxhsy9vke0cx1.png",
    "gallery": [
      // Bedrooms (1–4)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039597/espacio_gallery/gl4os8hhxhsy9vke0cx1.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039600/espacio_gallery/ixrrcgxxhf1pytdjjhga.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039616/espacio_gallery/jmbconw0wz7rrzqqaiub.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039619/espacio_gallery/b9negjore9wp71j24l8t.png",
      // Hall / Living Lounge (5–7)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039645/espacio_gallery/exseh5lm0mz9sfni4lkv.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039566/espacio_gallery/flfizkibqnyv1ktude6t.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039562/espacio_gallery/xivp043sbxsjdntmyeji.png",
      // Modular Kitchen & Dining (8–10)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039570/espacio_gallery/dntcpbg0dg78vu5hktwt.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039583/espacio_gallery/wazorsezkcaayd5bmrc1.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039573/espacio_gallery/xehnw42t41tcxvtc60ml.png",
      // Pooja Mandir (11–13)
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039588/espacio_gallery/s6vvkmvqz8h2aqbtwcam.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039591/espacio_gallery/zmsezgqkrwiqdgyno9oi.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791039595/espacio_gallery/hexutd4jmmolynp91e28.png"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791182484/espacio_gallery/odpospayniste6bg3iui.jpg",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791182169/espacio_gallery/k0lcgwlaxjnlvwlapgir.jpg",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791182484/espacio_gallery/odpospayniste6bg3iui.jpg"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791182169/espacio_gallery/k0lcgwlaxjnlvwlapgir.jpg"
    ],
    "testimonialName": "Dinesh & Sarvani",
    "testimonialProfession": "Homeowners, Tellapur",
    "testimonialText": "We wanted a small home that didn't feel small, and Espacio delivered. Every inch is used well and nothing looks crowded. The team kept us informed at every stage and finished right on schedule.",
    "testimonialRating": 5,
    "testimonial": {
      "name": "Dinesh & Sarvani",
      "profession": "Homeowners, Tellapur",
      "role": "Homeowners, Tellapur",
      "text": "We wanted a small home that didn't feel small, and Espacio delivered. Every inch is used well and nothing looks crowded. The team kept us informed at every stage and finished right on schedule.",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  }
];

export const DEFAULT_PRODUCTS = [
  {
    title: 'Acrylic Luxe Collection',
    slug: 'acrylic-luxe-collection',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-01',
    badge: 'Acrylic Luxe Collection',
    description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png',
    features: ['High-Gloss', 'Anti-Scratch', 'Concealed Track'],
    colors: [
          {
                "name": "Azzurro Sky",
                "hex": "#87B5C8"
          },
          {
                "name": "Crema Imperiale",
                "hex": "#F0ECE1"
          },
          {
                "name": "Luminous Gold",
                "hex": "#D4AF37"
          },
          {
                "name": "Blanco Pure",
                "hex": "#FFFFFF"
          },
          {
                "name": "Obsidian Mirror",
                "hex": "#1C1C1E"
          },
          {
                "name": "Elysian Vein",
                "hex": "#E6DFD5"
          },
          {
                "name": "Menta Sage",
                "hex": "#A2C2B3"
          },
          {
                "name": "Vector Champagne",
                "hex": "#DFD3BF"
          }
    ],
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
    badge: 'Digital Korean Poly Granite',
    description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png',
    features: ['Scratch-Proof', 'Marble Finish', 'Heat Resistant'],
    colors: [
          {
                "name": "Carrara Statuario",
                "hex": "#F4F4F4"
          },
          {
                "name": "Crema Marfil",
                "hex": "#E8DEC8"
          },
          {
                "name": "Nero Marquina",
                "hex": "#232323"
          },
          {
                "name": "Gracia Vein",
                "hex": "#D9D2C7"
          },
          {
                "name": "Elysian Gold Vein",
                "hex": "#DFD6C3"
          },
          {
                "name": "Silver Travertine",
                "hex": "#AFA99E"
          },
          {
                "name": "Calacatta Borghini",
                "hex": "#EDE7DC"
          },
          {
                "name": "Emerald Laurent",
                "hex": "#2E4338"
          }
    ],
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
    badge: 'Charcoal Panels Luxe Collection',
    description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/charcoal_qpelt9.png',
    features: ['Air Purifying', 'Premium Texture', 'Acoustic Dampening'],
    colors: [
          {
                "name": "Obsidian Noir",
                "hex": "#1A1A1A"
          },
          {
                "name": "Anthracite Slat",
                "hex": "#2B2D2F"
          },
          {
                "name": "Dual-Tone Carbon",
                "hex": "#383838"
          },
          {
                "name": "Metallic Bronze",
                "hex": "#5A4A3B"
          },
          {
                "name": "Sculptural Pewter",
                "hex": "#4D5054"
          },
          {
                "name": "Smoked Umber",
                "hex": "#44352C"
          },
          {
                "name": "Deep Steel Grey",
                "hex": "#3A4146"
          },
          {
                "name": "Oxidized Brass",
                "hex": "#6B5D43"
          }
    ],
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
    badge: 'Fluted PVC Luxe Collection',
    description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_fluted_1_o1ixyc.png',
    features: ['Waterproof', 'Easy Install', 'Flame Retardant'],
    colors: [
          {
                "name": "Irish Off-White",
                "hex": "#EAE6DF"
          },
          {
                "name": "Nordic Ash",
                "hex": "#C4BCB1"
          },
          {
                "name": "Marbo Sand Beige",
                "hex": "#D5C5B2"
          },
          {
                "name": "Azzurro Fluted",
                "hex": "#8FAEB9"
          },
          {
                "name": "Giallo Slate",
                "hex": "#94928D"
          },
          {
                "name": "Caramel Teak",
                "hex": "#A87C4F"
          },
          {
                "name": "Menta Whisper",
                "hex": "#BACCC3"
          },
          {
                "name": "Graphite Matte",
                "hex": "#3D3F43"
          }
    ],
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
    badge: 'LVT Luxe Flooring',
    description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196087/lvt_io0all.png',
    features: ['Durable', 'Water-Resistant', 'Soft Acoustic Tread'],
    colors: [
          {
                "name": "Scandinavian Oak",
                "hex": "#D5B895"
          },
          {
                "name": "Smoked Walnut",
                "hex": "#4A3528"
          },
          {
                "name": "Bleached Driftwood",
                "hex": "#D8D2C5"
          },
          {
                "name": "Ashen Grey Oak",
                "hex": "#8C877D"
          },
          {
                "name": "Honey Chestnut",
                "hex": "#B77E46"
          },
          {
                "name": "Slate Limestone",
                "hex": "#33373B"
          },
          {
                "name": "Limed White Oak",
                "hex": "#E5DCCB"
          },
          {
                "name": "Espresso Timber",
                "hex": "#2F241F"
          }
    ],
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
    badge: 'Fluted Acrylic Luxe Collection',
    description: 'Dynamic fluted acrylic panels creating sophisticated shadow play for luxury interiors.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/fluted_acrylic_gmwqr4.png',
    features: ['3D Relief', 'High-Gloss', 'Backlit Ready'],
    colors: [
          {
                "name": "Florida Gold",
                "hex": "#DFCE9F"
          },
          {
                "name": "Gracia Frosted",
                "hex": "#F2EFE9"
          },
          {
                "name": "Azzurro Marine",
                "hex": "#7CA4B5"
          },
          {
                "name": "Giallo Amber",
                "hex": "#D6B57E"
          },
          {
                "name": "Menta Mint",
                "hex": "#96BAA9"
          },
          {
                "name": "Smoky Quartz",
                "hex": "#6E6258"
          },
          {
                "name": "Blanco Crystal",
                "hex": "#FCFCFC"
          },
          {
                "name": "Rose Champagne",
                "hex": "#DDBFB5"
          }
    ],
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
    badge: 'PVC Luxe Collection',
    description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_1_qoe62b.png',
    features: ['Lightweight', 'Fire Retardant', 'Moisture Proof'],
    colors: [
          {
                "name": "Carrara Wave",
                "hex": "#EDECE8"
          },
          {
                "name": "Beige Marble",
                "hex": "#DFD5C4"
          },
          {
                "name": "Nordic Ash",
                "hex": "#B5AEA4"
          },
          {
                "name": "Royal Teak",
                "hex": "#99693D"
          },
          {
                "name": "Pearl White",
                "hex": "#F7F5F0"
          },
          {
                "name": "Classic Rosewood",
                "hex": "#663828"
          },
          {
                "name": "Slate Cloud",
                "hex": "#7A8086"
          },
          {
                "name": "Golden Oak",
                "hex": "#C99B5C"
          }
    ],
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
    badge: 'WPC Luxe Collection',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791195586/wpc_irucfj.png',
    features: ['100% Waterproof', 'Termite Proof', 'Zero Swelling'],
    colors: [
          {
                "name": "Ipe Ironwood",
                "hex": "#543826"
          },
          {
                "name": "Burmese Teak",
                "hex": "#9E6E3D"
          },
          {
                "name": "Smoked Cedar",
                "hex": "#7D553A"
          },
          {
                "name": "Weathered Oak",
                "hex": "#968E82"
          },
          {
                "name": "Obsidian Charcoal",
                "hex": "#29292A"
          },
          {
                "name": "Warm Chestnut",
                "hex": "#B0683A"
          },
          {
                "name": "Driftwood Taupe",
                "hex": "#B8AFA2"
          },
          {
                "name": "Dark Walnut",
                "hex": "#3E2C22"
          }
    ],
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
    q: 'How can we request a quotation?',
    question: 'How can we request a quotation?',
    a: 'Just fill out the contact form on our website, and our team will personally reach out to understand your project and walk you through next steps.',
    answer: 'Just fill out the contact form on our website, and our team will personally reach out to understand your project and walk you through next steps.',
    img: '/images/faq/faq_5_pricing.jpg',
    image: '/images/faq/faq_5_pricing.jpg',
    imageLabel: 'PRICING',
    imageCaption: 'How can we request a quotation?',
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
    a: 'Yes. We offer up to 10years comprehensive warranties on hardware and core modular components, backed directly by factory certification.',
    answer: 'Yes. We offer up to 10years comprehensive warranties on hardware and core modular components, backed directly by factory certification.',
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
    desc: 'A complete home interior, planned and built by our team from the very first idea to the day you move in. We bring together custom joinery, thoughtful lighting, and premium finishes, so every room feels like part of one cohesive home rather than a set of separate decisions.', 
    includes: [
      'Living & Dining Layouts Built Around You',
      'Kitchens Designed for Real Everyday Use',
      'Curated Wall & Surface Finishes',
      'Wardrobes Tailored to How You Store',
      'Lighting That Sets the Mood, Room by Room',
      'Full Execution, Managed Start to Finish'
    ], 
    img: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423769/hf_20260926_115135_689f37bb-4556-4b0c-825e-0586da0f2ddb.png',
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
    img: 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_103008_456328d7-a078-498c-9e00-4d73fd070599.png',
    ctaText: 'Enquire About Commercial Interiors',
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
    img: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423722/hf_20260926_115046_7312df3a-c42b-4bab-831c-c61f1a4c559a.png',
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
    img: 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423697/hf_20260926_114746_45849102-0d71-4193-bf7f-41a775d147e3.png',
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
    img: 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_104300_ea2f5c95-951a-49c1-b200-388396d23801.png',
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
  // 1. ✅ Residential
  {
    id: 'rev_manoj_kripa',
    source: 'GOOGLE',
    name: 'MANOJ & KRIPA',
    designation: 'Bandlaguda Jagir · Residential Villa',
    title: 'Simple, Elegant & Beautiful Jesus Artwork',
    body: "Really happy with how Espacio brought the interiors together. Everything feels simple and elegant, but the Jesus artwork is our favourite. It's the first thing everyone notices when they walk in. Overall, we're very happy with how the space came together.",
    rating: 5,
    avatar: '',
    date: '1 month ago',
    visible: true,
    featured: true,
    order: 1
  },
  // 2. Existing - Dharma Teja
  {
    id: 'g_rev_01',
    googleReviewId: 'g_rev_01',
    source: 'GOOGLE',
    name: 'Dharma Teja',
    designation: 'Narsingi · Residential 3BHK',
    title: 'Best Interior Designer Near Me & Fantastic Job',
    body: 'I was researching the best interior designer near me, and while doing that, I came across ESPACIO. Eventually, we hired them, and it turned out to be a good decision. The interior designer was nice, the quality of the materials and finishing of the modular solutions is amazing, and the execution was really good. Espacio did a fantastic job.',
    rating: 5,
    avatar: '/reviews/dharma_teja.png',
    date: '3 months ago',
    visible: true,
    featured: true,
    order: 2,
    response: 'Thank you sir, for your support and valuable feedback'
  },
  // 3. ✅ Commercial
  {
    id: 'rev_miva_essentials',
    source: 'GOOGLE',
    name: 'MIVA ESSENTIALS',
    designation: 'Kismatpur · Retail Brand Store',
    title: 'Customised Store Layout & Dedicated Support',
    body: "The team customised the store around our products in ways we hadn't even thought of. They were patient through every discussion, even late night calls when I was unsure. The final space looks great and works perfectly for our brand. Thank you Espacio!",
    rating: 5,
    avatar: '',
    date: '2 months ago',
    visible: true,
    featured: true,
    order: 3
  },
  // 4. ✏️ Residential
  {
    id: 'rev_srinivas_madhuri',
    source: 'GOOGLE',
    name: 'SRINIVAS & MADHURI',
    designation: 'Narsingi · Residential 3BHK',
    title: 'Good Quality Work & Punctual Execution',
    body: "Good quality work, and the team actually turns up on time, which is rare. The wardrobes look great, no complaints.",
    rating: 5,
    avatar: '',
    date: '2 months ago',
    visible: true,
    featured: true,
    order: 5
  },
  // 6. Existing - Siddharth Mehta
  {
    id: 'g_rev_00',
    googleReviewId: 'g_rev_00',
    source: 'GOOGLE',
    name: 'Siddharth Mehta',
    designation: 'HITECH City · Corporate Office',
    title: 'Executive Office Interior',
    body: 'We fitted our 4,000 sq.ft executive office with ESPACIO PVC ceiling panels and glass partitions. Professional project management and impeccable finishing.',
    rating: 5,
    avatar: '',
    date: '2 months ago',
    visible: true,
    featured: true,
    order: 6
  },
  // 7. ✅ Residential
  {
    id: 'rev_hussain_parveen',
    source: 'GOOGLE',
    name: 'HUSSAIN & PARVEEN',
    designation: 'Kukatpally · Turnkey Residence',
    title: 'Thoughtful Advice & Patient Execution',
    body: "I'm really thankful to Espacio for patiently working with us. Whenever we suggested something, they didn't just reject it, they explained why it may not work and suggested better options. We're really happy with how our home turned out.",
    rating: 5,
    avatar: '',
    date: '1 month ago',
    visible: true,
    featured: true,
    order: 7
  },
  // 8. Existing - Sunkari Santosh
  {
    id: 'g_rev_19',
    googleReviewId: 'g_rev_19',
    source: 'GOOGLE',
    name: 'Sunkari Santosh',
    designation: 'Financial District · Duplex Home',
    title: 'Professional & Passionate Towards Their Work',
    body: 'Very professional and passionate towards their work. Taken good time to complete our project we are very happy and satisfied with quality material given by them very good Outlook for my interior and exterior building elevation.',
    rating: 5,
    avatar: '/reviews/sunkari_santosh.png',
    date: '6 months ago',
    visible: true,
    featured: true,
    order: 8
  },
  // 9. ✏️ B2B (materials)
  {
    id: 'rev_studio_vertex',
    source: 'GOOGLE',
    name: 'STUDIO VERTEX ARCHITECTS',
    designation: 'Jubilee Hills · Architecture Firm',
    title: 'Consistent Board & Laminate Quality',
    body: "We've sourced boards and laminates from Espacio on a few projects. Quality is consistent batch to batch and deliveries are dependable, which matters when we're working to client deadlines.",
    rating: 5,
    avatar: '',
    date: '3 months ago',
    visible: true,
    featured: true,
    order: 9
  },
  // 10. Existing - Shaik BOB
  {
    id: 'g_rev_08',
    googleReviewId: 'g_rev_08',
    source: 'GOOGLE',
    name: 'Shaik BOB',
    designation: 'Manikonda · Turnkey Residence',
    title: 'Wide Range of Varieties & Patient Customer Service',
    body: 'Recently visited the store they have wide range of varieties and the customer service was very good they were very patient and understanding.',
    rating: 5,
    avatar: '/reviews/shaik_bob.png',
    date: 'a year ago',
    visible: true,
    featured: true,
    order: 10,
    response: 'Thank you so much for visiting Espacio Interiors & Modular!'
  },
  // 11. ✅ Residential
  {
    id: 'rev_arjun_shena',
    source: 'GOOGLE',
    name: 'ARJUN & SHENA',
    designation: 'Financial District · Luxury Flat',
    title: 'Thoughtful Interiors & Floral Wardrobe Feature',
    body: "I'm really happy with how Espacio did our whole house. Everything feels so thoughtfully done. My favourite is definitely the floral wardrobe, it's so pretty and adds such a lovely touch to the bedroom. I absolutely love how the house turned out.",
    rating: 5,
    avatar: '',
    date: '1 month ago',
    visible: true,
    featured: true,
    order: 11
  },
  // 12. Existing - Madhusudhan Vanam
  {
    id: 'g_rev_02',
    googleReviewId: 'g_rev_02',
    source: 'GOOGLE',
    name: 'Madhusudhan Vanam',
    designation: 'Kukatpally · Living Room Interior',
    title: 'Chala Bagundhi & Excellent TV Unit Execution',
    body: 'Espacio vallu chala manchi ga TV unit chesyaru degara vundi mari cheyinchyaru chala bagundhi, please do visit espacio 👍',
    rating: 5,
    avatar: '/reviews/madhusudhan_vanam.png',
    date: '5 months ago',
    visible: true,
    featured: true,
    order: 12
  },
  // 13. ✏️ Residential (Hinglish)
  {
    id: 'rev_vikram_sneha',
    source: 'GOOGLE',
    name: 'VIKRAM & SNEHA SHARMA',
    designation: 'Gachibowli · 3BHK Residence',
    title: 'Cohesive Spatial Design & Family Comfort',
    body: "Pura ghar ek hi style mein lag raha hai, upar se neeche tak. Parents ko bhi comfortable lagta hai aur bachon ko bhi apna room pasand aaya. Thank you Espacio!",
    rating: 5,
    avatar: '',
    date: '2 months ago',
    visible: true,
    featured: true,
    order: 13
  },
  // 14. Existing - Abdul Gaffar
  {
    id: 'g_rev_26',
    googleReviewId: 'g_rev_26',
    source: 'GOOGLE',
    name: 'Abdul Gaffar',
    designation: 'Banjara Hills · Luxury Interior',
    title: 'Professional Service & Quality Materials',
    body: 'Professional interior planning and exceptional materials supply from ESPACIO. Highly satisfied with their work.',
    rating: 5,
    avatar: '/reviews/abdul_gaffar.svg',
    date: '6 months ago',
    visible: true,
    featured: true,
    order: 14
  },
  // 15. ✏️ Commercial
  {
    id: 'rev_coffee_atelier',
    source: 'GOOGLE',
    name: 'THE COFFEE ATELIER',
    designation: 'Banjara Hills · Commercial Cafe',
    title: 'On-Time Commercial Handover & Impressive Finishes',
    body: "We had a tight opening date and I wasn't sure it would work out, but the team coordinated everything on site. Customers keep asking who did our interiors.",
    rating: 5,
    avatar: '',
    date: '2 months ago',
    visible: true,
    featured: true,
    order: 15
  },
  // 16. Existing - Aditya Manda
  {
    id: 'g_rev_20',
    googleReviewId: 'g_rev_20',
    source: 'GOOGLE',
    name: 'Aditya Manda',
    designation: 'Narsingi · Modular Kitchen',
    title: 'Professional Planning & Timely Delivery',
    body: 'Great experience with ESPACIO for home interiors. Professional planning and timely delivery.',
    rating: 5,
    avatar: '/reviews/aditya_manda.png',
    date: '4 months ago',
    visible: true,
    featured: true,
    order: 16
  },
  // 17. ✏️ Residential
  {
    id: 'rev_dr_chenna_keshava',
    source: 'GOOGLE',
    name: 'DR. CHENNA KESHAVA & LAKSHMI',
    designation: 'Tellapur · High-Rise 3BHK',
    title: 'End-to-End Home Interiors & 3D Precision',
    body: "Espacio handled our home interiors from design to installation. Communication was clear throughout, and the final finish matched the 3D designs closely. We'd happily work with them again.",
    rating: 5,
    avatar: '',
    date: '3 months ago',
    visible: true,
    featured: true,
    order: 17
  },
  // 18. Existing - Thumuganti Rithwik
  {
    id: 'g_rev_21',
    googleReviewId: 'g_rev_21',
    source: 'GOOGLE',
    name: 'Thumuganti Rithwik',
    designation: 'Jubilee Hills · Contemporary Villa',
    title: 'Delighted with Material Selection & Execution',
    body: 'Very satisfied with the interior design quality and material selection. Highly recommended!',
    rating: 5,
    avatar: '/reviews/thumuganti_rithwik.png',
    date: '3 months ago',
    visible: true,
    featured: true,
    order: 18
  },
  // 19. ✏️ B2B (rendering)
  {
    id: 'rev_axis_line',
    source: 'GOOGLE',
    name: 'AXIS LINE ARCHITECTS',
    designation: 'Madhapur · Interior Design Studio',
    title: 'Accurate 3D Visualizations & Fast Turnaround',
    body: "Their 3D renders were accurate enough that our client signed off without second-guessing. Turnaround was quick, and revisions were no trouble.",
    rating: 5,
    avatar: '',
    date: '2 months ago',
    visible: true,
    featured: true,
    order: 19
  },
  // 20. Existing - LEGAL AMICUS
  {
    id: 'g_rev_23',
    googleReviewId: 'g_rev_23',
    source: 'GOOGLE',
    name: 'LEGAL AMICUS',
    designation: 'Financial District · Corporate Office',
    title: 'Professional Planning & High-Quality Materials',
    body: 'Professional interior planning and exceptional materials supply from ESPACIO.',
    rating: 5,
    avatar: '/reviews/legal_amicus.svg',
    date: 'a year ago',
    visible: true,
    featured: true,
    order: 20
  }
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
  },
  {
    id: 'user_tarun_003',
    _id: 'user_tarun_003',
    name: 'Tarun (Super Admin)',
    email: 'tarunuttpulusu@gmail.com',
    role: 'superadmin',
    status: 'active',
    lastLogin: 'Today',
    createdAt: '2025-01-01T00:00:00.000Z'
  }
];

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  hero_bg_images: [
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_04_34_23_PM_1.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_17_2026_06_59_28_PM_1.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_16_2026_03_37_12_PM_1.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260926_111522_5d9cc288-51e5-41b7-ac4c-a4303ed6ae9c.png'
  ],
  hero_card_image: 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_04_34_23_PM_1.png',
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
  intro_heading: 'From First Idea to Final Touch, We Make It Effortless.',
  intro_description: 'ESPACIO brings together considered design, exceptional materials, and master craftsmanship to create homes of quiet distinction. Rooted in forty years of family construction heritage in Hyderabad, we design, build, and deliver your residence in its entirety, so every detail is handled and every day on site is seamless. You simply arrive to a home that feels unmistakably yours.',
  intro_cta_text1: 'Our Story ↗',
  intro_cta_text2: 'Read More ↗',
  intro_cta_link: '/about',
  grid_stat1_val: '25+',
  grid_stat1_label: 'Projects Completed',
  grid_stat1_subtext: 'Turnkey Interiors',
  grid_stat2_val: '100+',
  grid_stat2_label: 'Happy Clients',
  grid_stat2_subtext: 'Including Materials',
  grid_stat3_val: '40+',
  grid_stat3_label: 'Years Legacy',
  grid_stat3_subtext: 'Combined Legacy',
  services_hero_badge: 'Services',
  services_hero_title: 'Our Services',
  services_hero_subtitle: 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.',
  services_hero_images: [
    'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423769/hf_20260926_115135_689f37bb-4556-4b0c-825e-0586da0f2ddb.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_103008_456328d7-a078-498c-9e00-4d73fd070599.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423722/hf_20260926_115046_7312df3a-c42b-4bab-831c-c61f1a4c559a.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423697/hf_20260926_114746_45849102-0d71-4193-bf7f-41a775d147e3.png',
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_104300_ea2f5c95-951a-49c1-b200-388396d23801.png'
  ],
  services_hero_visible: true,
  services_list: DEFAULT_SERVICES,
  about_hero_title: 'Four Generations Of Construction.\nOne New Standard For Design.',
  projects_hero_badge: 'Portfolio & Case Studies',
  projects_hero_title: 'Our Projects',
  projects_hero_subtitle: 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
  projects_hero_images: [
    'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png',
    '/images/projects/my_home_sayuk/sayuk_after_open_hall.webp',
    '/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp',
    '/images/projects/kokapet_rahul_2bhk/rahul_after.webp',
    '/images/projects/gandipet_kiran_2bhk/kiran_after.webp'
  ],
  projects_hero_visible: true,
  projects_cta_visible: true,
  cta_projects: {
    enabled: true,
    heading: "Have a Project Like\nThis in Mind?",
    description: "Whether you need full turnkey execution or bespoke interior design, let's build your dream space together.",
    buttonText: "GET A FORMAL QUOTE ↗",
    buttonHoverText: "REQUEST BOQ ↗",
    buttonLink: "/contact"
  },
  exp_eyebrow: 'VISIT US',
  exp_heading: 'Experience Centers & Studio',
  exp_description: 'Walk into our flagship material experience studio. Touch, feel, and compare over 200+ live panel and finish samples in person.',
  exp_card1_title: 'Our Studio',
  exp_card1_address: 'Moinabad Road, Aziz Nagar, Hyderabad, Telangana 500075',
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
  footer_brand_subtitle: 'Designing spaces. Defining life styles.',
  footer_location_title: 'LOCATION',
  footer_address: 'Moinabad Road, Aziz Nagar, Hyderabad, Telangana 500075',
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
  trust_stat1_badge: 'Homes Delivered',
  trust_stat2_badge: 'Our Heritage',
  trust_stat3_val: '40000',
  trust_stat3_badge: 'Space Crafted',
  trust_stat4_sublabel: 'Comprehensive Warranty*',
  trust_stat4_badge: 'Our Promise',
  footer_social_items: [
    { name: 'Instagram', label: 'Instagram', href: 'https://www.instagram.com/theespacio.in', icon: 'instagram', color: '#E4405F', beamColor: 'rgba(228, 64, 95, 0.4)' },
    { name: 'Facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1DkG2m4Ra7/', icon: 'facebook', color: '#1877F2', beamColor: 'rgba(24, 119, 242, 0.4)' },
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

          // Ensure all 7 canonical projects exist and have correct order, gallery, and details
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
              if (Array.isArray(dp.gallery) && JSON.stringify(cur.gallery) !== JSON.stringify(dp.gallery)) {
                cur.gallery = [...dp.gallery];
                cur.heroImage = dp.heroImage;
                cur.hero_image = dp.heroImage;
                cur.afterImage = dp.heroImage;
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

          // Retain canonical active projects in sequence order
          const canonicalSlugs = [
            'dimmu-chachu-luxury-villa',
            'casa-alta-residence-kali-mandir',
            'gandipet-modern-retro-2bhk',
            'kondapur-minimalist-2bhk',
            'gachibowli-minimalist-beige-2bhk',
            'kachiguda-fusion-duplex-villa',
            'the-restful-home-tellapur'
          ];
          const origLen = data.length;
          data = data.filter(p => p && (canonicalSlugs.includes(p.slug) || DEFAULT_PROJECTS.some(dp => dp._id === p._id || dp.slug === p.slug)));
          if (data.length !== origLen) updated = true;

          data.forEach(p => {
            const canonicalIdx = canonicalSlugs.indexOf(p.slug);
            if (canonicalIdx !== -1) {
              if (p.order !== canonicalIdx + 1) {
                p.order = canonicalIdx + 1;
                updated = true;
              }
            }
          });
          data.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));

          if (updated) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.TESTIMONIALS && Array.isArray(data)) {
          let updated = false;
          if (
            data.some(t => t.name === 'Ganesh Nayak' || t.name === 'Ganesh Nayak143' || t.name === 'Juttiga Vaishnavi' || t.name === 'Nani Varma' || t.name === 'Rafi Shaik' || t.name === 'G Rakesh') ||
            !data.some(t => t.name === 'Shiak Ayub') ||
            !data.some(t => t.name === 'Madhusudhan Vanam') ||
            !data.some(t => t.name === 'LEGAL AMICUS') ||
            !data.some(t => t.name === 'Reddy') ||
            !data.some(t => t.name === 'Venkatesh mudhiraj') ||
            !data.some(t => t.name === 'A Sk') ||
            !data.some(t => t.name === 'Abdul Gaffar') ||
            data[0]?.name !== 'Dharma Teja' ||
            data[10]?.name !== 'Shiak Ayub'
          ) {
            data = DEFAULT_TESTIMONIALS;
            updated = true;
          }
          if (updated) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        // ── PRODUCTS hero image auto-migration ──────────────────────────────
        if (key === STORAGE_KEYS.PRODUCTS && Array.isArray(data)) {
          let updated = false;
          const PRODUCT_HERO_MAP = {
            'acrylic-luxe-collection':        'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png',
            'digital-korean-poly-granite':    'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png',
            'charcoal-panels-luxe':           'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/charcoal_qpelt9.png',
            'fluted-pvc-luxe':               'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_fluted_1_o1ixyc.png',
            'lvt-luxe-flooring':             'https://res.cloudinary.com/or5e9kak/image/upload/v1791196087/lvt_io0all.png',
            'fluted-acrylic-luxe':           'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/fluted_acrylic_gmwqr4.png',
            'pvc-luxe-collection':           'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_1_qoe62b.png',
            'wpc-luxe-collection':           'https://res.cloudinary.com/or5e9kak/image/upload/v1791195586/wpc_irucfj.png',
          };
          data.forEach(product => {
            if (product && PRODUCT_HERO_MAP[product.slug]) {
              if (product.heroImage !== PRODUCT_HERO_MAP[product.slug]) {
                product.heroImage = PRODUCT_HERO_MAP[product.slug];
                updated = true;
              }
            }
          });
          if (updated) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (Array.isArray(data.hero_bg_images) && (data.hero_bg_images.some(img => typeof img === 'string' && !img.includes('res.cloudinary.com')) || data.hero_bg_images.length !== 5)) {
          data.hero_bg_images = [
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_04_34_23_PM_1.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_17_2026_06_59_28_PM_1.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_16_2026_03_37_12_PM_1.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260926_111522_5d9cc288-51e5-41b7-ac4c-a4303ed6ae9c.png'
          ];
          data.hero_card_image = 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_04_34_23_PM_1.png';
          try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
        }
        if (!Array.isArray(data.showcase_slides) || data.showcase_slides.length !== 5 || data.showcase_slides.some(s => typeof s.projectImg === 'string' && !s.projectImg.includes('res.cloudinary.com')) || data.showcase_slides.some(s => s.projectLabel?.includes('Cosmic Odyssey') || s.projectLabel?.includes('Classical Lounge') || s.projectLabel?.includes('Executive Study'))) {
          data.showcase_slides = [
            {
              projectImg: "https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_04_34_23_PM_1.png",
              memberImg: "/reviews/paladugu_raju.png",
              name: "Architectural Lead",
              role: "Duplex Mezzanine & Murals",
              projectLabel: "Duplex Mezzanine & Sculpted Wall Mural"
            },
            {
              projectImg: "https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_17_2026_06_59_28_PM_1.png",
              memberImg: "/reviews/kishor_kumar.png",
              name: "Spatial Architecture Specialist",
              role: "Double-Height Atrium Architecture",
              projectLabel: "Double-Height Atrium & Living Mezzanine"
            },
            {
              projectImg: "https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_16_2026_03_37_12_PM_1.png",
              memberImg: "/reviews/amresh_kumar.png",
              name: "Joinery & Detailing Lead",
              role: "Warm Contemporary Joinery",
              projectLabel: "Warm Contemporary Living Lounge"
            },
            {
              projectImg: "https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png",
              memberImg: "/reviews/imtiyaz_shaik.png",
              name: "Living Space Specialist",
              role: "Luxury Living Spaces",
              projectLabel: "Warm Arched Living Lounge"
            },
            {
              projectImg: "https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260926_111522_5d9cc288-51e5-41b7-ac4c-a4303ed6ae9c.png",
              memberImg: "/reviews/kishor_kumar.png",
              name: "Principal Architect",
              role: "Japandi Spatial Refinement",
              projectLabel: "Japandi Living Lounge & Tea Deck"
            }
          ];
          try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
        } else if (Array.isArray(data.showcase_slides)) {
          let updatedSlides = false;
          data.showcase_slides.forEach(slide => {
            if (slide && (slide.projectLabel === "Modern Modular Kitchen & Island Bar" || slide.projectLabel === "Modern Quartzite Kitchen" || slide.role === "High-Gloss Modular Kitchens")) {
              slide.name = "Living Space Specialist";
              slide.role = "Luxury Living Spaces";
              slide.projectLabel = "Warm Arched Living Lounge";
              updatedSlides = true;
            }
          });
          if (updatedSlides) {
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.SETTINGS && data) {
          let modified = false;
          if (data.projects_cta_visible !== true) {
            data.projects_cta_visible = true;
            modified = true;
          }
          if (data.footer_brand_subtitle === undefined || data.footer_brand_subtitle === 'INTERIORS AND MODULARS' || data.footer_brand_subtitle === 'Designing spaces. Defining life styles') {
            data.footer_brand_subtitle = 'Designing spaces. Defining life styles.';
            modified = true;
          }
          if (!data.cta_projects || data.cta_projects.enabled !== true) {
            data.cta_projects = {
              ...(data.cta_projects || {}),
              enabled: true,
              heading: data.cta_projects?.heading || "Have a Project Like\nThis in Mind?",
              description: data.cta_projects?.description || "Whether you need full turnkey execution or bespoke interior design, let's build your dream space together.",
              buttonText: data.cta_projects?.buttonText || "GET A FORMAL QUOTE ↗",
              buttonHoverText: data.cta_projects?.buttonHoverText || "REQUEST BOQ ↗",
              buttonLink: data.cta_projects?.buttonLink || "/contact"
            };
            modified = true;
          }
          const cloudServicesHero = [
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423769/hf_20260926_115135_689f37bb-4556-4b0c-825e-0586da0f2ddb.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_103008_456328d7-a078-498c-9e00-4d73fd070599.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423722/hf_20260926_115046_7312df3a-c42b-4bab-831c-c61f1a4c559a.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790423697/hf_20260926_114746_45849102-0d71-4193-bf7f-41a775d147e3.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260928_104300_ea2f5c95-951a-49c1-b200-388396d23801.png'
          ];
          if (!Array.isArray(data.services_hero_images) || data.services_hero_images.length !== 5 || data.services_hero_images.some(img => typeof img === 'string' && !img.includes('res.cloudinary.com'))) {
            data.services_hero_images = cloudServicesHero;
            modified = true;
          }
          if (Array.isArray(data.services_list) && data.services_list.length >= 5) {
            cloudServicesHero.forEach((cUrl, idx) => {
              if (data.services_list[idx] && data.services_list[idx].img !== cUrl) {
                data.services_list[idx].img = cUrl;
                modified = true;
              }
            });
          }

          const cloudProjectsHero = [
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425351/hf_20260926_121205_b316b4e3-2daa-4fa2-9be5-d6a0ee716587.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425297/hf_20260926_121300_6a3eef61-953b-4da3-b308-15aabfa0e9d0.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425270/hf_20260926_121337_1396c58b-a42d-4d86-8930-ad80832032c1.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425243/hf_20260926_121353_fb8cb679-2a98-4c61-a331-b92d2ca6c9da.png',
            'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425214/hf_20260926_121425_c188d1e6-1db5-4729-b2a9-ad90bbddbf3a.png'
          ];
          if (!Array.isArray(data.projects_hero_images) || data.projects_hero_images.length !== 5 || data.projects_hero_images.some(img => typeof img === 'string' && !img.includes('res.cloudinary.com'))) {
            data.projects_hero_images = cloudProjectsHero;
            modified = true;
          }
          if (data.intro_heading === 'Turnkey interiors, done properly.' || data.intro_heading === 'From Concept to Handover — ESPACIO Delivers Complete Interiors.' || !data.intro_heading) {
            data.intro_heading = 'From First Idea to Final Touch, We Make It Effortless.';
            modified = true;
          }
          if (!data.intro_description || data.intro_description.includes('We bring 40+ years of family construction heritage') || data.intro_description.includes('chase a contractor')) {
            data.intro_description = "ESPACIO brings together considered design, exceptional materials, and master craftsmanship to create homes of quiet distinction. Rooted in forty years of family construction heritage in Hyderabad, we design, build, and deliver your residence in its entirety, so every detail is handled and every day on site is seamless. You simply arrive to a home that feels unmistakably yours.";
            modified = true;
          }
          if (typeof data.about_hero_subtitle === 'string' && data.about_hero_subtitle.includes('Mantana')) {
            data.about_hero_subtitle = data.about_hero_subtitle.replace(/Mantana/g, 'Mastana');
            modified = true;
          }
          if (typeof data.about_story_p1 === 'string' && data.about_story_p1.includes('Mantana')) {
            data.about_story_p1 = data.about_story_p1.replace(/Mantana/g, 'Mastana');
            modified = true;
          }
          if (Array.isArray(data.about_generations)) {
            data.about_generations.forEach(g => {
              if (g && typeof g.title === 'string' && g.title.includes('Mantana')) {
                g.title = g.title.replace(/Mantana/g, 'Mastana');
                modified = true;
              }
              if (g && typeof g.desc === 'string' && /ponds\s*[—–-]\s*including/i.test(g.desc)) {
                g.desc = g.desc.replace(/ponds\s*[—–-]\s*including/gi, 'ponds, including');
                modified = true;
              }
            });
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

            const CURATED_SPACES_IMAGES = {
  "modular-kitchen": [
    "/images/spaces/modular_kitchen/kitchen_drive_24.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_1.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_19.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_29.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_14.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_7.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_30.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_8.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_13.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_28.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_23.webp",
    "/images/spaces/modular_kitchen/kitchen_drive_12.webp"
  ],
  "master-bedroom": [
    "/images/spaces/bedroom/bedroom_drive_24.webp",
    "/images/spaces/bedroom/bedroom_drive_15.webp",
    "/images/spaces/bedroom/bedroom_drive_6.webp",
    "/images/spaces/bedroom/bedroom_drive_3.webp",
    "/images/spaces/bedroom/bedroom_drive_5.webp",
    "/images/spaces/bedroom/bedroom_drive_11.webp",
    "/images/spaces/bedroom/bedroom_drive_29.webp",
    "/images/spaces/bedroom/bedroom_drive_25.webp",
    "/images/spaces/bedroom/bedroom_drive_12.webp",
    "/images/spaces/bedroom/bedroom_drive_9.webp",
    "/images/spaces/bedroom/bedroom_drive_1.webp",
    "/images/spaces/bedroom/bedroom_drive_27.webp"
  ],
  "living-room": [
    "/images/spaces/living/living_drive_1.webp",
    "/images/spaces/living/living_drive_38.webp",
    "/images/spaces/living/living_drive_29.webp",
    "/images/spaces/living/living_drive_13.webp",
    "/images/spaces/living/living_drive_6.webp",
    "/images/spaces/living/living_drive_31.webp",
    "/images/spaces/living/living_drive_21.webp",
    "/images/spaces/living/living_drive_8.webp",
    "/images/spaces/living/living_drive_30.webp",
    "/images/spaces/living/living_drive_4.webp",
    "/images/spaces/living/living_drive_20.webp",
    "/images/spaces/living/living_drive_33.webp"
  ],
  "wardrobes": [
    "/images/spaces/wardrobes/wardrobe_drive_25.webp",
    "/images/spaces/wardrobes/wardrobe_drive_23.webp",
    "/images/spaces/wardrobes/wardrobe_drive_14.webp",
    "/images/spaces/wardrobes/wardrobe_drive_27.webp",
    "/images/spaces/wardrobes/wardrobe_drive_29.webp",
    "/images/spaces/wardrobes/wardrobe_drive_11.webp",
    "/images/spaces/wardrobes/wardrobe_drive_32.webp",
    "/images/spaces/wardrobes/wardrobe_drive_24.webp",
    "/images/spaces/wardrobes/wardrobe_drive_21.webp",
    "/images/spaces/wardrobes/wardrobe_drive_5.webp",
    "/images/spaces/wardrobes/wardrobe_drive_38.webp",
    "/images/spaces/wardrobes/wardrobe_drive_22.webp"
  ],
  "home-office": [
    "/images/spaces/home_office/home_office_drive_25.webp",
    "/images/spaces/home_office/home_office_drive_33.webp",
    "/images/spaces/home_office/home_office_drive_12.webp",
    "/images/spaces/home_office/home_office_drive_19.webp",
    "/images/spaces/home_office/home_office_drive_27.webp",
    "/images/spaces/home_office/home_office_drive_22.webp",
    "/images/spaces/home_office/home_office_drive_32.webp",
    "/images/spaces/home_office/home_office_drive_20.webp",
    "/images/spaces/home_office/home_office_drive_42.webp",
    "/images/spaces/home_office/home_office_drive_23.webp",
    "/images/spaces/home_office/home_office_drive_35.webp",
    "/images/spaces/home_office/home_office_drive_34.webp"
  ],
  "commercial-office": [
    "/images/spaces/office/office_drive_20.webp",
    "/images/spaces/office/office_drive_33.webp",
    "/images/spaces/office/office_drive_29.webp",
    "/images/spaces/office/office_drive_37.webp",
    "/images/spaces/office/office_drive_4.webp",
    "/images/spaces/office/office_drive_12.webp",
    "/images/spaces/office/office_drive_13.webp",
    "/images/spaces/office/office_drive_6.webp",
    "/images/spaces/office/office_drive_31.webp",
    "/images/spaces/office/office_drive_16.webp",
    "/images/spaces/office/office_drive_17.webp",
    "/images/spaces/office/office_drive_18.webp"
  ],
  "pooja-room": [
    "/images/spaces/pooja/pooja_drive_12.webp",
    "/images/spaces/pooja/pooja_drive_14.webp",
    "/images/spaces/pooja/pooja_drive_9.webp",
    "/images/spaces/pooja/pooja_drive_3.webp",
    "/images/spaces/pooja/pooja_drive_22.webp",
    "/images/spaces/pooja/pooja_drive_1.webp",
    "/images/spaces/pooja/pooja_drive_4.webp",
    "/images/spaces/pooja/pooja_drive_11.webp",
    "/images/spaces/pooja/pooja_drive_17.webp",
    "/images/spaces/pooja/pooja_drive_15.webp",
    "/images/spaces/pooja/pooja_drive_20.webp",
    "/images/spaces/pooja/pooja_drive_25.webp"
  ],
  "dining-room": [
    "/images/spaces/dining/dining_drive_27.webp",
    "/images/spaces/dining/dining_drive_15.webp",
    "/images/spaces/dining/dining_drive_26.webp",
    "/images/spaces/dining/dining_drive_40.webp",
    "/images/spaces/dining/dining_drive_38.webp",
    "/images/spaces/dining/dining_drive_19.webp",
    "/images/spaces/dining/dining_drive_32.webp",
    "/images/spaces/dining/dining_drive_3.webp",
    "/images/spaces/dining/dining_drive_49.webp",
    "/images/spaces/dining/dining_drive_31.webp",
    "/images/spaces/dining/dining_drive_42.webp",
    "/images/spaces/dining/dining_drive_28.webp"
  ],
  "tv-units": [
    "/images/spaces/tv_units/tv_drive_13.webp",
    "/images/spaces/tv_units/tv_drive_3.webp",
    "/images/spaces/tv_units/tv_drive_8.webp",
    "/images/spaces/tv_units/tv_drive_25.webp",
    "/images/spaces/tv_units/tv_drive_12.webp",
    "/images/spaces/tv_units/tv_drive_21.webp",
    "/images/spaces/tv_units/tv_drive_11.webp",
    "/images/spaces/tv_units/tv_drive_4.webp",
    "/images/spaces/tv_units/tv_drive_37.webp",
    "/images/spaces/tv_units/tv_drive_30.webp",
    "/images/spaces/tv_units/tv_drive_18.webp",
    "/images/spaces/tv_units/tv_drive_16.webp"
  ],
  "false-ceilings": [
    "/images/spaces/ceiling/ceiling_drive_46.webp",
    "/images/spaces/ceiling/ceiling_drive_3.webp",
    "/images/spaces/ceiling/ceiling_drive_7.webp",
    "/images/spaces/ceiling/ceiling_drive_42.webp",
    "/images/spaces/ceiling/ceiling_drive_14.webp",
    "/images/spaces/ceiling/ceiling_drive_39.webp",
    "/images/spaces/ceiling/ceiling_drive_28.webp",
    "/images/spaces/ceiling/ceiling_drive_17.webp",
    "/images/spaces/ceiling/ceiling_drive_35.webp",
    "/images/spaces/ceiling/ceiling_drive_27.webp",
    "/images/spaces/ceiling/ceiling_drive_30.webp",
    "/images/spaces/ceiling/ceiling_drive_16.webp"
  ],
  "commercial-interiors": [
    "/images/spaces/commercial/commercial_drive_18.webp",
    "/images/spaces/commercial/commercial_drive_9.webp",
    "/images/spaces/commercial/commercial_drive_29.webp",
    "/images/spaces/commercial/commercial_drive_41.webp",
    "/images/spaces/commercial/commercial_drive_11.webp",
    "/images/spaces/commercial/commercial_drive_16.webp",
    "/images/spaces/commercial/commercial_drive_28.webp",
    "/images/spaces/commercial/commercial_drive_32.webp",
    "/images/spaces/commercial/commercial_drive_23.webp",
    "/images/spaces/commercial/commercial_drive_3.webp",
    "/images/spaces/commercial/commercial_drive_6.webp",
    "/images/spaces/commercial/commercial_drive_21.webp"
  ],
  "reception-areas": [
    "/images/spaces/reception/reception_drive_21.webp",
    "/images/spaces/reception/reception_drive_30.webp",
    "/images/spaces/reception/reception_drive_31.webp",
    "/images/spaces/reception/reception_drive_28.webp",
    "/images/spaces/reception/reception_drive_15.webp",
    "/images/spaces/reception/reception_drive_34.webp",
    "/images/spaces/reception/reception_drive_33.webp",
    "/images/spaces/reception/reception_drive_22.webp",
    "/images/spaces/reception/reception_drive_16.webp",
    "/images/spaces/reception/reception_drive_19.webp",
    "/images/spaces/reception/reception_drive_17.webp",
    "/images/spaces/reception/reception_drive_1.webp"
  ],
  "cafes-restaurants": [
    "/images/spaces/cafes/cafe_drive_15.webp",
    "/images/spaces/cafes/cafe_drive_29.webp",
    "/images/spaces/cafes/cafe_drive_27.webp",
    "/images/spaces/cafes/cafe_drive_11.webp",
    "/images/spaces/cafes/cafe_drive_14.webp",
    "/images/spaces/cafes/cafe_drive_22.webp",
    "/images/spaces/cafes/cafe_drive_16.webp",
    "/images/spaces/cafes/cafe_drive_41.webp",
    "/images/spaces/cafes/cafe_drive_32.webp",
    "/images/spaces/cafes/cafe_drive_4.webp",
    "/images/spaces/cafes/cafe_drive_24.webp",
    "/images/spaces/cafes/cafe_drive_13.webp"
  ],
  "foyer": [
    "/images/spaces/foyer/foyer_drive_22.webp",
    "/images/spaces/foyer/foyer_drive_18.webp",
    "/images/spaces/foyer/foyer_drive_24.webp",
    "/images/spaces/foyer/foyer_drive_23.webp",
    "/images/spaces/foyer/foyer_drive_2.webp",
    "/images/spaces/foyer/foyer_drive_19.webp",
    "/images/spaces/foyer/foyer_drive_1.webp",
    "/images/spaces/foyer/foyer_drive_14.webp",
    "/images/spaces/foyer/foyer_drive_4.webp",
    "/images/spaces/foyer/foyer_drive_13.webp",
    "/images/spaces/foyer/foyer_drive_5.webp",
    "/images/spaces/foyer/foyer_drive_8.webp"
  ],
  "bar": [
    "/images/spaces/bar/bar_drive_21.webp",
    "/images/spaces/bar/bar_drive_14.webp",
    "/images/spaces/bar/bar_drive_11.webp",
    "/images/spaces/bar/bar_drive_2.webp",
    "/images/spaces/bar/bar_drive_13.webp",
    "/images/spaces/bar/bar_drive_18.webp",
    "/images/spaces/bar/bar_drive_31.webp",
    "/images/spaces/bar/bar_drive_30.webp",
    "/images/spaces/bar/bar_drive_4.webp",
    "/images/spaces/bar/bar_drive_24.webp",
    "/images/spaces/bar/bar_drive_16.webp",
    "/images/spaces/bar/bar_drive_37.webp"
  ],
  "walk-in-wardrobe": [
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_8.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_13.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_4.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_7.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_19.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_16.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_15.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_23.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_14.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_22.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_24.webp",
    "/images/spaces/wardrobes/walk_in_wardrobe_drive_1.webp"
  ]
};

            if (Array.isArray(data.spaces_list)) {
              const origCount = data.spaces_list.length;
              data.spaces_list = data.spaces_list.filter(cat => cat.slug !== 'luxury-homes' && cat.slug !== 'apartments' && cat.slug !== 'villas');
              if (data.spaces_list.length !== origCount) modified = true;

              data.spaces_list.forEach(cat => {
                if (SPACES_FILTERS_MAP[cat.slug] && (!cat.filters || cat.filters.length !== 5 || cat.filters.includes('Japandi Minimal'))) {
                  cat.filters = SPACES_FILTERS_MAP[cat.slug];
                  modified = true;
                }
                if (CURATED_SPACES_IMAGES[cat.slug]) {
                  const curatedList = CURATED_SPACES_IMAGES[cat.slug];
                  const hero = curatedList[0];
                  const isMatch = Array.isArray(cat.galleryImages) &&
                    cat.galleryImages.length === 12 &&
                    cat.galleryImages[0] === hero &&
                    cat.galleryImages[11] === curatedList[11];
                  if (!isMatch || cat.heroImage !== hero) {
                    cat.galleryImages = [...curatedList];
                    cat.heroImage = hero;
                    modified = true;
                  }
                }
              });
            }
          }
          if (Array.isArray(data.spaces_before_after_slides) && data.spaces_before_after_slides.length > 0) {
            if (!data.spaces_before_after_slides[0]?.before?.includes('spaces_hero_before')) {
              data.spaces_before_after_slides[0].before = '/images/spaces/spaces_hero_before.webp';
              data.spaces_before_after_slides[0].after = 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260926_124351_209dfd6c-1cb8-40a3-9765-1fad3875d811_1.png';
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
          if (data.projects_cta_visible === false || !data.cta_projects || data.cta_projects.enabled === false) {
            data.projects_cta_visible = true;
            data.cta_projects = {
              ...(data.cta_projects || {}),
              enabled: true,
              heading: data.cta_projects?.heading || "Have a Project Like\nThis in Mind?",
              description: data.cta_projects?.description || "Whether you need full turnkey execution or bespoke interior design, let's build your dream space together.",
              buttonText: data.cta_projects?.buttonText || "GET A FORMAL QUOTE ↗",
              buttonHoverText: data.cta_projects?.buttonHoverText || "REQUEST BOQ ↗",
              buttonLink: data.cta_projects?.buttonLink || "/contact"
            };
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
                if (match.question !== def.question || match.answer !== def.answer || match.q !== def.q || match.a !== def.a || match.imageCaption !== def.imageCaption) {
                  match.question = def.question;
                  match.q = def.q;
                  match.answer = def.answer;
                  match.a = def.a;
                  match.imageCaption = def.imageCaption;
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
              if (p1.title !== DEFAULT_PROJECTS[0].title) {
                p1.title = DEFAULT_PROJECTS[0].title;
                changed = true;
              }
              if (p1.heroImage !== DEFAULT_PROJECTS[0].heroImage) {
                p1.heroImage = DEFAULT_PROJECTS[0].heroImage;
                p1.hero_image = DEFAULT_PROJECTS[0].heroImage;
                changed = true;
              }
              if (p1.beforeImage !== DEFAULT_PROJECTS[0].beforeImage) {
                p1.beforeImage = DEFAULT_PROJECTS[0].beforeImage;
                p1.beforeImages = DEFAULT_PROJECTS[0].beforeImages;
                p1.afterImage = DEFAULT_PROJECTS[0].afterImage;
                p1.afterImages = DEFAULT_PROJECTS[0].afterImages;
                changed = true;
              }
              if (p1.description !== DEFAULT_PROJECTS[0].description) {
                p1.description = DEFAULT_PROJECTS[0].description;
                changed = true;
              }
              if (p1.story !== DEFAULT_PROJECTS[0].story) {
                p1.story = DEFAULT_PROJECTS[0].story;
                changed = true;
              }
              if (!Array.isArray(p1.gallery) || p1.gallery.length !== DEFAULT_PROJECTS[0].gallery.length || p1.gallery[0] !== DEFAULT_PROJECTS[0].gallery[0]) {
                p1.gallery = DEFAULT_PROJECTS[0].gallery;
                changed = true;
              }
              if (p1.testimonial !== DEFAULT_PROJECTS[0].testimonial) {
                p1.testimonial = DEFAULT_PROJECTS[0].testimonial;
                p1.testimonialName = DEFAULT_PROJECTS[0].testimonialName;
                p1.testimonialProfession = DEFAULT_PROJECTS[0].testimonialProfession;
                p1.testimonialText = DEFAULT_PROJECTS[0].testimonialText;
                changed = true;
              }
              if (changed) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p2 = data.find(p => p.slug === 'my-home-sayuk-3bhk' || p._id === 'proj_2_my_home_sayuk');
            if (p2) {
              let changed2 = false;
              if (p2.beforeImage !== DEFAULT_PROJECTS[1].beforeImage) {
                p2.beforeImage = DEFAULT_PROJECTS[1].beforeImage;
                p2.beforeImages = DEFAULT_PROJECTS[1].beforeImages;
                changed2 = true;
              }
              if (p2.title !== 'The Lattice Retreat') {
                p2.title = 'The Lattice Retreat';
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
            const dpRahul = DEFAULT_PROJECTS.find(dp => dp._id === 'proj_4_kokapet_rahul' || dp.slug === 'kokapet-urban-2bhk');
            const p4 = data.find(p => p.slug === 'kokapet-urban-2bhk' || p._id === 'proj_4_kokapet_rahul');
            if (p4 && dpRahul) {
              let changed4 = false;
              if (p4.beforeImage !== dpRahul.beforeImage || p4.afterImage !== dpRahul.afterImage) {
                p4.beforeImage = dpRahul.beforeImage;
                p4.afterImage = dpRahul.afterImage;
                p4.beforeImages = dpRahul.beforeImages;
                p4.afterImages = dpRahul.afterImages;
                p4.before_after = [{ before: dpRahul.beforeImage, after: dpRahul.afterImage }];
                changed4 = true;
              }
              if (p4.heroImage !== dpRahul.heroImage) {
                p4.heroImage = dpRahul.heroImage;
                changed4 = true;
              }
              if (p4.title !== dpRahul.title) {
                p4.title = dpRahul.title;
                changed4 = true;
              }
              if (!Array.isArray(p4.gallery) || p4.gallery.length !== dpRahul.gallery.length || p4.gallery.some(img => typeof img === 'string' && img.includes('yocbcbuycsysstbt8j6k'))) {
                p4.gallery = dpRahul.gallery;
                changed4 = true;
              }
              if (p4.description !== dpRahul.description) {
                p4.description = dpRahul.description;
                changed4 = true;
              }
              if (!p4.story || !p4.story.vision || p4.story.vision !== dpRahul.story?.vision) {
                p4.story = dpRahul.story;
                changed4 = true;
              }
              if (changed4) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const dpKiran = DEFAULT_PROJECTS.find(dp => dp._id === 'proj_5_gandipet_kiran' || dp.slug === 'gandipet-modern-retro-2bhk');
            const p5 = data.find(p => p.slug === 'gandipet-modern-retro-2bhk' || p._id === 'proj_5_gandipet_kiran');
            if (p5 && dpKiran) {
              let changed5 = false;
              if (p5.beforeImage !== dpKiran.beforeImage) {
                p5.beforeImage = dpKiran.beforeImage;
                p5.beforeImages = dpKiran.beforeImages;
                changed5 = true;
              }
              if (p5.title !== dpKiran.title) {
                p5.title = dpKiran.title;
                changed5 = true;
              }
              if (p5.description !== dpKiran.description) {
                p5.description = dpKiran.description;
                changed5 = true;
              }
              if (!p5.story || !p5.story.vision || p5.story.vision !== dpKiran.story?.vision) {
                p5.story = dpKiran.story;
                changed5 = true;
              }
              if (changed5) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p6 = data.find(p => p.slug === 'kondapur-minimalist-2bhk');
            if (p6) {
              let changed6 = false;
              const dpVenk = DEFAULT_PROJECTS.find(dp => dp.slug === 'kondapur-minimalist-2bhk');
              if (dpVenk && (p6.heroImage !== dpVenk.heroImage || p6.afterImage !== dpVenk.heroImage)) {
                p6.heroImage = dpVenk.heroImage;
                p6.hero_image = dpVenk.heroImage;
                p6.afterImage = dpVenk.heroImage;
                changed6 = true;
              }
              if (p6.beforeImage !== DEFAULT_PROJECTS[5].beforeImage) {
                p6.beforeImage = DEFAULT_PROJECTS[5].beforeImage;
                p6.beforeImages = DEFAULT_PROJECTS[5].beforeImages;
                changed6 = true;
              }
              if (p6.title !== 'The Dusk Lounge') {
                p6.title = 'The Dusk Lounge';
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
            const dp7 = DEFAULT_PROJECTS.find(dp => dp.slug === 'gachibowli-minimalist-beige-2bhk') || DEFAULT_PROJECTS[5];
            if (p7 && dp7) {
              let changed7 = false;
              if (p7.heroImage !== dp7.heroImage) {
                p7.heroImage = dp7.heroImage;
                changed7 = true;
              }
              if (p7.beforeImage !== dp7.beforeImage || p7.afterImage !== dp7.afterImage) {
                p7.beforeImage = dp7.beforeImage;
                p7.afterImage = dp7.afterImage;
                p7.beforeImages = dp7.beforeImages;
                p7.afterImages = dp7.afterImages;
                changed7 = true;
              }
              if (!Array.isArray(p7.gallery) || p7.gallery.length !== dp7.gallery.length || p7.gallery[0] !== dp7.gallery[0]) {
                p7.gallery = dp7.gallery;
                changed7 = true;
              }
              if (p7.title !== 'A 2BHK Residence, Gachibowli') {
                p7.title = 'A 2BHK Residence, Gachibowli';
                changed7 = true;
              }
              if (p7.description !== dp7.description) {
                p7.description = dp7.description;
                changed7 = true;
              }
              if (!p7.story || !p7.story.vision || p7.story.vision.includes('Koteswara Rao, wanted')) {
                p7.story = dp7.story;
                changed7 = true;
              }
              if (changed7) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p8 = data.find(p => p.slug === 'kachiguda-fusion-duplex-villa' || p._id === 'proj_8_kachiguda_subbarao');
            if (p8) {
              let changed8 = false;
              if (p8.heroImage !== DEFAULT_PROJECTS[7].heroImage) {
                p8.heroImage = DEFAULT_PROJECTS[7].heroImage;
                changed8 = true;
              }
              if (p8.beforeImage !== DEFAULT_PROJECTS[7].beforeImage || p8.afterImage !== DEFAULT_PROJECTS[7].afterImage) {
                p8.beforeImage = DEFAULT_PROJECTS[7].beforeImage;
                p8.afterImage = DEFAULT_PROJECTS[7].afterImage;
                p8.beforeImages = DEFAULT_PROJECTS[7].beforeImages;
                p8.afterImages = DEFAULT_PROJECTS[7].afterImages;
                changed8 = true;
              }
              if (!Array.isArray(p8.gallery) || p8.gallery.length !== DEFAULT_PROJECTS[7].gallery.length || JSON.stringify(p8.gallery) !== JSON.stringify(DEFAULT_PROJECTS[7].gallery)) {
                p8.gallery = DEFAULT_PROJECTS[7].gallery;
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
              if (!p8.story || !p8.story.vision || p8.story.vision !== DEFAULT_PROJECTS[7].story.vision) {
                p8.story = DEFAULT_PROJECTS[7].story;
                changed8 = true;
              }
              if (changed8) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p9 = data.find(p => p._id === 'proj_9_dimmu_chachu_residence' || p.slug === 'dimmu-chachu-luxury-villa');
            if (!p9 && DEFAULT_PROJECTS[8]) {
              data.push(DEFAULT_PROJECTS[8]);
              try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
            } else if (p9 && DEFAULT_PROJECTS[8]) {
              let changed9 = false;
              if (p9.heroImage !== DEFAULT_PROJECTS[8].heroImage) {
                p9.heroImage = DEFAULT_PROJECTS[8].heroImage;
                changed9 = true;
              }
              if (!Array.isArray(p9.gallery) || p9.gallery.some(img => typeof img === 'string' && img.includes('googleusercontent')) || p9.gallery.length !== DEFAULT_PROJECTS[8].gallery.length) {
                p9.gallery = DEFAULT_PROJECTS[8].gallery;
                changed9 = true;
              }
              if (p9.beforeImage !== DEFAULT_PROJECTS[8].beforeImage || p9.afterImage !== DEFAULT_PROJECTS[8].afterImage) {
                p9.beforeImage = DEFAULT_PROJECTS[8].beforeImage;
                p9.afterImage = DEFAULT_PROJECTS[8].afterImage;
                p9.beforeImages = DEFAULT_PROJECTS[8].beforeImages;
                p9.afterImages = DEFAULT_PROJECTS[8].afterImages;
                changed9 = true;
              }
              if (p9.testimonialName !== 'Hussain' || p9.testimonial?.name !== 'Hussain') {
                p9.testimonialName = 'Hussain';
                p9.testimonial = { ...(p9.testimonial || {}), name: 'Hussain' };
                changed9 = true;
              }
              if (changed9) {
                try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
              }
            }
            const p10 = data.find(p => p._id === 'proj_10_the_restful_home_tellapur' || p.slug === 'the-restful-home-tellapur');
            if (p10 && DEFAULT_PROJECTS[6]) {
              let changed10 = false;
              if (!Array.isArray(p10.gallery) || p10.gallery.length !== DEFAULT_PROJECTS[6].gallery.length || JSON.stringify(p10.gallery) !== JSON.stringify(DEFAULT_PROJECTS[6].gallery)) {
                p10.gallery = DEFAULT_PROJECTS[6].gallery;
                changed10 = true;
              }
              if (changed10) {
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
              'kachiguda-fusion-duplex-villa': 8,
              'dimmu-chachu-luxury-villa': 9
            };
            data = data.filter(p => p && (canonicalOrder[p.slug] !== undefined || DEFAULT_PROJECTS.some(dp => dp._id === p._id)));
            data.forEach((p, idx) => {
              if (canonicalOrder[p.slug]) {
                p.order = canonicalOrder[p.slug];
              } else if (!p.order) {
                p.order = idx + 1;
              }
            });
            data.sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
            if (data.length > 9) {
              data = data.slice(0, 9);
            }
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
        }
        if (key === STORAGE_KEYS.PRODUCTS) {
          if (!Array.isArray(data) || data.length === 0 || data.some(p => typeof p.heroImage === 'string' && p.heroImage.includes('unsplash.com'))) {
            data = DEFAULT_PRODUCTS;
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          } else {
            let updatedProd = false;
            if (Array.isArray(data) && data.some(p => p && p.slug === 'charcoal-panels-luxe-1')) {
              data = data.filter(p => p && p.slug !== 'charcoal-panels-luxe-1');
              updatedProd = true;
            }
            data.forEach(p => {
              if (p && (p.slug === 'acrylic-luxe-collection' || p.materialCode === 'MAT-ACR-01')) {
                if (p.heroImage !== 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png') {
                  p.heroImage = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png';
                  p.image = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png';
                  updatedProd = true;
                }
              }
              if (p && (p.slug === 'digital-korean-poly-granite' || p.materialCode === 'MAT-GNT-02')) {
                if (p.heroImage !== 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png') {
                  p.heroImage = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png';
                  p.image = 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png';
                  updatedProd = true;
                }
              }
            });
            if (updatedProd) {
              try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
            }
          }
        }
        if (key === STORAGE_KEYS.TESTIMONIALS) {
          if (!Array.isArray(data) || data.length === 0 || !data.some(t => (t.name || '').includes('MANOJ & KRIPA')) || data.some(t => /karagani|naidu poola|Shiak Ayub|Amresh kumar/i.test(t.name || ''))) {
            data = DEFAULT_TESTIMONIALS;
            try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
          }
          if (Array.isArray(data) && data.some(t => t.id === 'g_rev_07' || t.id === 'g_rev_03' || /abdul\s*sattar|khaleel/i.test(t.name || ''))) {
            data = data.filter(t => t.id !== 'g_rev_07' && t.id !== 'g_rev_03' && !/abdul\s*sattar|khaleel/i.test(t.name || ''));
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
          } else {
            data.services_list.forEach(s => {
              if (s && typeof s.desc === 'string' && s.desc.includes('planned and built by one team')) {
                s.desc = s.desc.replace('planned and built by one team', 'planned and built by our team');
                modified = true;
              }
              if (s && typeof s.ctaText === 'string' && s.ctaText.includes('Fit-Outs')) {
                s.ctaText = s.ctaText.replace('Fit-Outs', 'Interiors');
                modified = true;
              }
            });
          }
          if (data.about_hero_title && typeof data.about_hero_title === 'string') {
            const updatedTitle = data.about_hero_title.replace(/\b([a-z])/g, (_, l) => l.toUpperCase());
            if (updatedTitle !== data.about_hero_title) {
              data.about_hero_title = updatedTitle;
              modified = true;
            }
          }
          if (!Array.isArray(data.hero_bg_images) || data.hero_bg_images.length === 0) {
            data.hero_bg_images = DEFAULT_SETTINGS.hero_bg_images;
            modified = true;
          }
          if (data.trust_stat3_val === '50000' || !data.trust_stat3_val) {
            data.trust_stat3_val = '40000';
            modified = true;
          }
          if (data.trust_stat4_sublabel === 'Comprehensive Hardware Warranty' || !data.trust_stat4_sublabel) {
            data.trust_stat4_sublabel = 'Comprehensive Warranty*';
            modified = true;
          }
          if (Array.isArray(data.footer_social_items)) {
            data.footer_social_items.forEach(item => {
              if (item.name === 'Facebook' || item.icon === 'facebook' || item.label === 'Facebook') {
                if (item.href === 'https://facebook.com' || item.href === 'https://www.facebook.com' || !item.href?.includes('1DkG2m4Ra7')) {
                  item.href = 'https://www.facebook.com/share/1DkG2m4Ra7/';
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

          const SPACES_IMG_MAP = {
            'modular-kitchen': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/f5ba100a-b7b4-4c3d-abd4-09fc76c02a1a.png',
            'pooja-room': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/9ff3ef5a-a5a0-4fc6-9b59-23803b283bc3.png',
            'walk-in-wardrobe': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795527/7c6dc4bb-a837-4d6d-ab8b-5d29326b3d84.png',
            'wardrobes': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/6cf77808-04b5-41c1-afd4-601eea5bd274.png',
            'master-bedroom': '/images/spaces/master_bedroom_after.webp',
            'bar': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795560/22993ac7-806a-45db-89aa-ee933a6b01e4.png',
            'living-room': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/fe4a004a-0264-4c56-bcec-87bf02aa6292.png',
            'dining-room': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b88b5c55-d357-46b8-b4ee-4843e9909190.png',
            'tv-units': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795579/0008f2c8-0ba5-442a-aeec-61770fd4fc4c.png',
            'commercial-interiors': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795589/78d3c5ad-0e9d-442a-b180-3b8b07072939.png',
            'reception-areas': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795597/d513d85b-c5b0-45de-a8b0-c44f2eca8f5f.png',
            'cafes-restaurants': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795550/bc102946-53a7-4287-9ce0-20c7f3d42b0e.png',
            'home-office': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/453968f9-cf57-4d07-8ec8-a5556159ae46.png',
            'commercial-office': 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/a3aab549-4f2b-40b3-99fb-2115b13c6c12.png',
            'foyer': 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795538/ca29d16d-a331-4a83-989f-100ff0d623c6.png'
          };

          // spaces_list curated images preserved

          const HERO_AFTER_ROOM = 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/hf_20260926_124351_209dfd6c-1cb8-40a3-9765-1fad3875d811_1.png';
          if (Array.isArray(data.spaces_before_after_slides)) {
            data.spaces_before_after_slides.forEach(slide => {
              if (slide.title === 'Living Rooms' && slide.after !== HERO_AFTER_ROOM) {
                slide.after = HERO_AFTER_ROOM;
                modified = true;
              }
              if (slide.title === 'Modular Kitchens' && slide.after !== SPACES_IMG_MAP['modular-kitchen']) {
                slide.after = SPACES_IMG_MAP['modular-kitchen'];
                modified = true;
              }
              if (slide.title === 'Master Bedrooms') {
                if (slide.after !== SPACES_IMG_MAP['master-bedroom']) {
                  slide.after = SPACES_IMG_MAP['master-bedroom'];
                  modified = true;
                }
                if (slide.before !== '/images/spaces/master_bedroom_before.webp') {
                  slide.before = '/images/spaces/master_bedroom_before.webp';
                  modified = true;
                }
              }
              if (slide.title === 'Dining & Bars' && slide.after !== SPACES_IMG_MAP['dining-room']) {
                slide.after = SPACES_IMG_MAP['dining-room'];
                modified = true;
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
export const setCMSData = (key, data, options = {}) => {
  const silent = typeof options === 'boolean' ? options : !!options?.silent;
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
    const newStr = JSON.stringify(data);
    const oldStr = localStorage.getItem(key);
    if (oldStr === newStr) {
      return;
    }
    localStorage.setItem(key, newStr);
    if (!silent) {
      notifyCMSUpdate();
    }
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

  let headline = ctaObj.heading || pageTitle || defaultCta.headline || defaultCta.heading || 'Ready to Transform Your Space?';
  if (typeof headline === 'string' && /Engineering\.\s*Elegance\.\s*Experience\./i.test(headline)) {
    headline = "Elegance. Experience.\nEspacio.";
  }
  const subtext  = ctaObj.description || pageDesc || defaultCta.subtext || defaultCta.description || "Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.";
  const rawButtonText = ctaObj.buttonText || pageBtn || defaultCta.buttonText || "LET'S TALK ↗";
  const buttonText = typeof rawButtonText === 'string'
    ? rawButtonText.replace(/Book Free Consultation/gi, 'Book Consultation')
    : rawButtonText;
  const buttonLink = ctaObj.buttonLink || pageLink || defaultCta.path || defaultCta.buttonLink || '/contact';
  const bgImage    = ctaObj.bgImage || pageBg || defaultCta.bgImage || '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg';
  const opacity    = ctaObj.opacity !== undefined ? Number(ctaObj.opacity) : (defaultCta.opacity ?? 80);

  let enabled = true;
  if (defaultCta.enabled === false) enabled = false;
  if (ctaObj.enabled === false) enabled = false;
  if (pageVis === false) enabled = false;
  if (pk === 'projects') {
    enabled = (ctaObj.enabled !== false && pageVis !== false);
  } else if (settings.cta_visible === false && !settings[`cta_${pk}`]) {
    enabled = false;
  }

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

