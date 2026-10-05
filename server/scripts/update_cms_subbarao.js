import fs from 'fs';
import path from 'path';

const filePath = path.resolve('client/src/utils/cmsStore.js');
let content = fs.readFileSync(filePath, 'utf8');

const targetProjectBlock = `  {
    "_id": "proj_8_kachiguda_subbarao",
    "order": 7,
    "title": "A Duplex Residence, Kachiguda",
    "slug": "kachiguda-fusion-duplex-villa",
    "category": "duplex",
    "area": "3,800 sq.ft.",
    "location": "Kachiguda, Hyderabad",
    "year": 2025,
    "style": "Modern & Traditional Fusion",
    "description": "A grand duplex built for a multi generational family, blending modern comfort with the warmth of traditional Indian design. From a striking staircase to a kids room wrapped in a vintage airplane blueprint mural, every level tells its own story while still feeling like one connected home.",
    "story": {
      "vision": "K Subbarao wanted a duplex that could hold the whole family comfortably, parents and children, while still feeling like one cohesive home rather than two separate floors stitched together. The plan blended modern luxury with rich touches of Indian design heritage, so the home would feel current without losing its cultural warmth. For the boys' room, the idea was to give them something entirely their own, a space with personality and imagination built right into the walls.",
      "challenges": "With multiple ceiling levels and a double height space to design around, keeping a consistent look across both the parents' and the boys' suites took real care. Every material and color choice had to feel connected across floors, so the home reads as one story from top to bottom instead of feeling like two different houses stacked together. In the boys' room specifically, we wanted a bold vintage airplane blueprint mural to feel like a natural extension of the room, not just wallpaper slapped on, so the furniture, lighting, and colors all had to work around it rather than against it.",
      "solutions": "Bespoke fluted wood paneling, premium PU lacquer detailing, high-durability acrylic storage systems, and ambient architectural cove lighting.",
      "engineering": "Wiring was routed carefully through the multi level ceilings so nothing was ever left exposed, and lighting was layered at different heights to bring warmth into every corner, including the dramatic double height areas. The plywood used throughout was specially treated to resist warping over time, so the home holds its shape and finish for years, not just for the first few seasons. Even the statement mural in the boys' room was planned around the lighting fixtures above it, so the pendant lights complement the artwork instead of casting awkward shadows across it.",
      "outcome": "A magnificent, warm duplex masterpiece celebrated for its craftsmanship and delivered with turnkey precision."
    },
    "heroImage": "/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_1.webp",
    "gallery": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1b4c729-d7f1-4216-ab32-7df78a0b6e34.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/92d8cde3-623f-4811-907d-7267962255ac.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/3f8f1874-d2b3-4b6c-9e5c-fb3333c11311.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/39876fee-140f-4c0f-bc16-01cdca3f2f76.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/8005ea3b-7d7a-4643-ac48-599d0cf0710e.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/919d61b3-2f89-40e4-9e8d-17af115b4a9f.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/445827f3-df4c-41c9-bd9c-da11399a47ff.png",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/d6fa4de6-3f43-414a-a4d6-158eba4349ef.png"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/66df1458-877e-4204-b6d3-0a1c5b199ad0.png",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1b4c729-d7f1-4216-ab32-7df78a0b6e34.png",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/66df1458-877e-4204-b6d3-0a1c5b199ad0.png"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1b4c729-d7f1-4216-ab32-7df78a0b6e34.png"
    ],
    "testimonialName": "K Subbarao",
    "testimonialProfession": "Homeowner, Kachiguda",
    "testimonialText": "ESPACIO created an absolute masterpiece with our Duplex home in Kachiguda. The modern fusion living area, boys bedrooms, and parents suite are designed with immaculate craftsmanship and attention to detail. Truly a five-star experience from start to finish!",
    "testimonialRating": 5,
    "testimonial": {
      "name": "K Subbarao",
      "profession": "Homeowner, Kachiguda",
      "role": "Homeowner, Kachiguda, Hyderabad",
      "text": "ESPACIO created an absolute masterpiece with our Duplex home in Kachiguda. The modern fusion living area, boys bedrooms, and parents suite are designed with immaculate craftsmanship and attention to detail. Truly a five-star experience from start to finish!",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  }`;

const newProjectBlock = `  {
    "_id": "proj_8_kachiguda_subbarao",
    "order": 7,
    "title": "A Duplex Residence, Kachiguda",
    "slug": "kachiguda-fusion-duplex-villa",
    "category": "duplex",
    "area": "3,800 sq.ft.",
    "location": "Kachiguda, Hyderabad",
    "year": 2025,
    "style": "Modern & Traditional Fusion",
    "description": "A grand duplex residence designed for K Subbarao at Kachiguda, Hyderabad. Harmonizing contemporary architectural joinery, vibrant custom accents, dedicated pooja mandir, emerald-accented master bedroom suite, and bespoke modular kitchen.",
    "story": {
      "vision": "K Subbarao envisioned a multi-generational duplex residence that bridged modern luxury with traditional cultural warmth. Rather than feeling like two detached floors, the home needed an overarching design narrative that flowed seamlessly from the grand living lounge through the central pooja shrine to the private bedroom suites on both levels.",
      "challenges": "Navigating expansive double-height ceilings and multi-tiered ceiling bulkheads required meticulous light planning and material coordination. Seamlessly transitioning from the sleek, contemporary fluted media wall in the living lounge to the traditional fluted teak pooja pavilion without visual discord demanded precision millwork and exacting material tolerances.",
      "solutions": "We deployed custom fluted oak wall paneling with marble slab accents and concealed warm-white LED perimeter coves. At the home's spatial nexus, we crafted a dedicated pooja mandir framed in rich fluted teak with suspended brass bells and an illuminated damask arch. The private quarters feature custom colorway expressions: a master bedroom in rich emerald and sage with a halo chandelier, and guest suites detailed with blush pink paneling and fluted acoustic headboard alcoves.",
      "engineering": "All high-load cabinetry, sliding wardrobe tracks, and vanity consoles were anchored using moisture-resistant calibrated plywood with heavy-duty Blum & Hafele hardware. Ambient multi-circuit LED cove strips and architectural chandeliers were routed with dedicated concealed conduits, preventing heat buildup behind the veneer and fluted panels and ensuring long-lasting structural integrity.",
      "outcome": "A magnificent turnkey duplex residence delivered with millimeter precision, praised for its cohesive architectural transitions, luxurious custom joinery, and harmonious fusion of heritage and modernity."
    },
    "heroImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176757/espacio_gallery/wmysbzk5vj0xf0udpm2o.jpg",
    "gallery": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176757/espacio_gallery/wmysbzk5vj0xf0udpm2o.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176759/espacio_gallery/c3vzxftnomn3hmknb6ac.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176760/espacio_gallery/yog0z7ctpuxcqsi7roiz.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176761/espacio_gallery/vgopzmslhbn6ncjf7abz.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176762/espacio_gallery/y0lwohc975brsmz3lvsq.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176764/espacio_gallery/n9s4hzfc0kmxg4vz0ikq.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176765/espacio_gallery/zz6tlibljscdtxzwreij.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176766/espacio_gallery/v8ow8wazpira3ybetqpt.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176768/espacio_gallery/sfxd6gpb7lyxvz8btwm7.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176769/espacio_gallery/jm0tvmebxgwjthzrkqxi.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176771/espacio_gallery/xxejumkvoofeiavo1lgy.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176772/espacio_gallery/t12zwds99bsehckwjibi.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176773/espacio_gallery/tedmjebvzsmbcc8sqrbg.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176775/espacio_gallery/cfcfyqbrdnscowdtn14k.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176776/espacio_gallery/bqzxpd3wiatstmvouwmd.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176777/espacio_gallery/hccikcshwcgvmug2sysy.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176779/espacio_gallery/grtahywcxpllsq2n7ffc.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176780/espacio_gallery/ujfn9sn6blmfppkvy3zr.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176781/espacio_gallery/xvmxed6ohdrwa0xv0sh8.jpg",
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176782/espacio_gallery/pyfulmiw0jfpssgxki9b.jpg"
    ],
    "beforeImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176785/espacio_gallery/blohvaxle28zo18l7lug.jpg",
    "afterImage": "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176783/espacio_gallery/xazzu72x5zlzib4broqc.jpg",
    "beforeImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176785/espacio_gallery/blohvaxle28zo18l7lug.jpg"
    ],
    "afterImages": [
      "https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176783/espacio_gallery/xazzu72x5zlzib4broqc.jpg"
    ],
    "testimonialName": "K Subbarao",
    "testimonialProfession": "Homeowner, Kachiguda",
    "testimonialText": "ESPACIO transformed our Kachiguda duplex into an architectural masterpiece. From the breathtaking living lounge and the divine pooja mandir to the emerald master bedroom and custom wardrobes, their craftsmanship, attention to detail, and turnkey delivery were exceptional. Truly a five-star experience!",
    "testimonialRating": 5,
    "testimonial": {
      "name": "K Subbarao",
      "profession": "Homeowner, Kachiguda",
      "role": "Homeowner, Kachiguda, Hyderabad",
      "text": "ESPACIO transformed our Kachiguda duplex into an architectural masterpiece. From the breathtaking living lounge and the divine pooja mandir to the emerald master bedroom and custom wardrobes, their craftsmanship, attention to detail, and turnkey delivery were exceptional. Truly a five-star experience!",
      "rating": 5
    },
    "featured": true,
    "status": "published"
  }`;

if (content.includes(targetProjectBlock)) {
  content = content.replace(targetProjectBlock, newProjectBlock);
  console.log('✓ Replaced DEFAULT_PROJECTS[7] (Kachiguda Subbarao) in cmsStore.js');
} else {
  console.error('Target project block not found in cmsStore.js');
  process.exit(1);
}

// Update lines 1788-1815 in cmsStore.js so it references DEFAULT_PROJECTS[7]
const oldSyncCheck = `          const hasKachigudaSubbarao = data.some(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
          if (!hasKachigudaSubbarao) {
            const idx = data.findIndex(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[6];
            } else {
              data.splice(6, 0, DEFAULT_PROJECTS[6]);
            }
            updated = true;
          } else {
            const p8Idx = data.findIndex(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
            if (p8Idx !== -1) {
              if (
                data[p8Idx].beforeImage !== DEFAULT_PROJECTS[6].beforeImage ||
                data[p8Idx].afterImage !== DEFAULT_PROJECTS[6].afterImage ||
                data[p8Idx].heroImage !== DEFAULT_PROJECTS[6].heroImage ||
                !Array.isArray(data[p8Idx].gallery) ||
                data[p8Idx].gallery.length !== DEFAULT_PROJECTS[6].gallery.length ||
                data[p8Idx].gallery.some(img => typeof img === 'string' && img.includes('subbarao_gallery'))
              ) {
                data[p8Idx].beforeImage = DEFAULT_PROJECTS[6].beforeImage;
                data[p8Idx].afterImage = DEFAULT_PROJECTS[6].afterImage;
                data[p8Idx].beforeImages = DEFAULT_PROJECTS[6].beforeImages;
                data[p8Idx].afterImages = DEFAULT_PROJECTS[6].afterImages;
                data[p8Idx].heroImage = DEFAULT_PROJECTS[6].heroImage;
                data[p8Idx].gallery = DEFAULT_PROJECTS[6].gallery;
                updated = true;
              }
            }
          }`;

const newSyncCheck = `          const hasKachigudaSubbarao = data.some(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
          if (!hasKachigudaSubbarao) {
            const idx = data.findIndex(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
            if (idx !== -1) {
              data[idx] = DEFAULT_PROJECTS[7];
            } else {
              data.splice(7, 0, DEFAULT_PROJECTS[7]);
            }
            updated = true;
          } else {
            const p8Idx = data.findIndex(p => p._id === 'proj_8_kachiguda_subbarao' || p.slug === 'kachiguda-fusion-duplex-villa');
            if (p8Idx !== -1) {
              if (
                data[p8Idx].beforeImage !== DEFAULT_PROJECTS[7].beforeImage ||
                data[p8Idx].afterImage !== DEFAULT_PROJECTS[7].afterImage ||
                data[p8Idx].heroImage !== DEFAULT_PROJECTS[7].heroImage ||
                !Array.isArray(data[p8Idx].gallery) ||
                data[p8Idx].gallery.length !== DEFAULT_PROJECTS[7].gallery.length
              ) {
                data[p8Idx].beforeImage = DEFAULT_PROJECTS[7].beforeImage;
                data[p8Idx].afterImage = DEFAULT_PROJECTS[7].afterImage;
                data[p8Idx].beforeImages = DEFAULT_PROJECTS[7].beforeImages;
                data[p8Idx].afterImages = DEFAULT_PROJECTS[7].afterImages;
                data[p8Idx].heroImage = DEFAULT_PROJECTS[7].heroImage;
                data[p8Idx].gallery = DEFAULT_PROJECTS[7].gallery;
                data[p8Idx].description = DEFAULT_PROJECTS[7].description;
                data[p8Idx].story = DEFAULT_PROJECTS[7].story;
                data[p8Idx].testimonial = DEFAULT_PROJECTS[7].testimonial;
                updated = true;
              }
            }
          }`;

if (content.includes(oldSyncCheck)) {
  content = content.replace(oldSyncCheck, newSyncCheck);
  console.log('✓ Replaced oldSyncCheck in cmsStore.js');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ cmsStore.js updated successfully!');
