import dotenv from 'dotenv';
dotenv.config();
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';

// Ranked list of images in curated order (Best at top, utility/study/details at bottom)
const RANKED_IMAGES = [
  // 1. Top Tier: Grand Duplex Architecture & Living Hall Showpieces
  {
    rank: 1,
    sourceFile: 'img_20_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_26-20260813-110616.jpg',
    targetName: 'subbarao_gallery_1.webp',
    title: 'Grand Duplex Living Hall & Architectural Staircase Vista',
    room: 'Grand Duplex Living Hall & Architectural Staircase Vista',
    description: 'Showstopper panoramic wide-angle perspective of the ground floor duplex living hall, showcasing the floating linear fireplace, marble staircase with glass railings, modular kitchen, and formal dining suite.'
  },
  {
    rank: 2,
    sourceFile: 'img_14_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_15-20260813-110616.jpg',
    targetName: 'subbarao_gallery_2.webp',
    title: 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    room: 'Living Lounge, Roaring Linear Fireplace & Media Tower',
    description: 'Bespoke entertainment wall with integrated glowing linear fireplace, open oak bookcase tower, sculptural white ribbon armchair, KAWS collector art sculpture, and twilight courtyard window.'
  },
  {
    rank: 3,
    sourceFile: 'img_18_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_23-20260813-110616.jpg',
    targetName: 'subbarao_gallery_3.webp',
    title: 'Open-Concept Duplex Living & Dining Transition',
    room: 'Open-Concept Duplex Living & Dining Transition',
    description: 'Dynamic perspective from the plush modular sofa across the Calacatta marble coffee table toward the white spun chair, duplex marble stairs, and illuminated dining pavilion.'
  },
  {
    rank: 4,
    sourceFile: 'img_16_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_21-20260813-110616.jpg',
    targetName: 'subbarao_gallery_4.webp',
    title: 'Living Lounge & KAWS Art Sculpture Nook',
    room: 'Living Lounge & KAWS Art Sculpture Nook',
    description: 'Expansive lounge view displaying the heather-grey modular sectional sofa, houndstooth ottoman, life-sized KAWS sculpture, and floor-to-ceiling picture window.'
  },
  {
    rank: 5,
    sourceFile: 'img_17_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617.jpg',
    targetName: 'subbarao_gallery_5.webp',
    title: 'Living Lounge & Courtyard Picture Window',
    room: 'Living Lounge & Courtyard Picture Window',
    description: 'Corner lounge perspective highlighting the expansive picture window looking out onto landscaped gardens, paired with acoustic wood paneling and marble entry portals.'
  },
  {
    rank: 6,
    sourceFile: 'img_11_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_10-20260813-110615.jpg',
    targetName: 'subbarao_gallery_6.webp',
    title: 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    room: 'Dining Bar Island, Duplex Staircase & Kitchen Vista',
    description: 'Architectural vista from the natural oak breakfast counter past the white stag sculpture on the stair landing toward the floating marble staircase and open kitchen.'
  },
  {
    rank: 7,
    sourceFile: 'img_23_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_7-20260813-110614.jpg',
    targetName: 'subbarao_gallery_7.webp',
    title: 'Parents Master Suite & Traditional Ink Mandala Crest',
    room: 'Parents Master Suite & Traditional Ink Mandala Crest',
    description: 'Symmetrical luxury master bedroom featuring a solid walnut king bed, fluted acoustic headboard wall with rose-gold metallic inlays, framed circular ink artwork, and lantern pendant lights.'
  },
  {
    rank: 8,
    sourceFile: 'img_1_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg',
    targetName: 'subbarao_gallery_8.webp',
    title: 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    room: 'Boys Bedroom Suite & Vintage Aeronautical Blueprint Mural',
    description: 'Signature bedroom suite boasting a custom full-wall vintage biplane technical blueprint mural, upholstered king bed with houndstooth cushions, and suspended brass pill capsule pendants.'
  },

  // 2. Mid Tier: Dining, Modular Kitchen & Bedroom Focal Points
  {
    rank: 9,
    sourceFile: 'img_13_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_12-20260813-110614.jpg',
    targetName: 'subbarao_gallery_9.webp',
    title: 'Formal Dining Suite & Amber Globe Chandelier',
    room: 'Formal Dining Suite & Amber Globe Chandelier',
    description: 'Luxury marble dining table with brushed brass pedestal base, six cream leather chairs, designer branching amber glass chandelier, and bronze glass sliding partitions.'
  },
  {
    rank: 10,
    sourceFile: 'img_15_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_17-20260813-110614.jpg',
    targetName: 'subbarao_gallery_10.webp',
    title: 'Dining Pavilion & Integrated Smart Refrigerator',
    room: 'Dining Pavilion & Integrated Smart Refrigerator',
    description: 'Seamless integration of culinary luxury and entertainment dining, featuring the built-in smart refrigerator with digital panel flush within the cabinetry.'
  },
  {
    rank: 11,
    sourceFile: 'img_12_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_11-20260813-110612.jpg',
    targetName: 'subbarao_gallery_11.webp',
    title: "Chef's Modular Kitchen & Quartz Countertops",
    room: "Chef's Modular Kitchen & Quartz Countertops",
    description: 'High-gloss acrylic white modular kitchen with seamless quartz countertops, undermount double sink, integrated gas hob, and black glass chimney hood.'
  },
  {
    rank: 12,
    sourceFile: 'img_21_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_1-20260813-110616.jpg',
    targetName: 'subbarao_gallery_12.webp',
    title: 'Parents Suite Perspective & Bedside Lanterns',
    room: 'Parents Suite Perspective & Bedside Lanterns',
    description: 'Angled perspective of the parents bedroom suite with dark walnut nightstands, marble bedside lamps, textured area rug, and sheer curtain backdrop.'
  },
  {
    rank: 13,
    sourceFile: 'img_22_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_3-20260813-110615.jpg',
    targetName: 'subbarao_gallery_13.webp',
    title: 'Parents Suite Wardrobes & Twilight Garden Vista',
    room: 'Parents Suite Wardrobes & Twilight Garden Vista',
    description: 'Floor-to-ceiling handleless champagne gloss wardrobes, modern geometric ceiling chandelier, and expansive picture window framing the landscaped exterior.'
  },
  {
    rank: 14,
    sourceFile: 'img_24_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_13-20260813-110614.jpg',
    targetName: 'subbarao_gallery_14.webp',
    title: 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    room: 'Parents Suite Fluted TV Media Wall & Marble Inlay',
    description: 'Light oak fluted entertainment wall accented with a vertical Calacatta marble strip in brass framing, floating Scandinavian media console, and wall-mounted TV.'
  },
  {
    rank: 15,
    sourceFile: 'img_26_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_25-20260813-110614.jpg',
    targetName: 'subbarao_gallery_15.webp',
    title: 'Parents Suite Walk-In Dressing Wardrobe',
    room: 'Parents Suite Walk-In Dressing Wardrobe',
    description: 'Custom walk-in closet flanked by fluted wood partitions, illuminated open organizers, hanging wardrobe bays, trouser racks, and brass Sputnik wall sconce.'
  },
  {
    rank: 16,
    sourceFile: 'img_2_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_9-20260813-110616.jpg',
    targetName: 'subbarao_gallery_16.webp',
    title: 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    room: 'Boys Suite Bed, Nightstands & Blueprint Feature Wall',
    description: 'Angled perspective of the boys room featuring the contemporary leatherette platform bed, dual-tone nightstands, warm bedside reading lamp, and graphic carpet.'
  },
  {
    rank: 17,
    sourceFile: 'img_3_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_14-20260813-110617.jpg',
    targetName: 'subbarao_gallery_17.webp',
    title: 'Aeronautical Biplane Technical Blueprint Detail',
    room: 'Aeronautical Biplane Technical Blueprint Detail',
    description: 'High-resolution architectural detail of the vintage French Nieuport biplane technical blueprint mural and dual gold pendant globes.'
  },
  {
    rank: 18,
    sourceFile: 'img_5_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_18-20260813-110611.jpg',
    targetName: 'subbarao_gallery_18.webp',
    title: 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    room: 'Boys Suite Modular Wardrobe & Walnut Display Niche',
    description: 'Clean-lined white floor-to-ceiling wardrobe bank with horizontal open walnut display niche for books and collectables, fitted with matte black edge pulls.'
  },

  // 3. Detail & Atmospheric Tier: Dining Bar, Living Details, Study Wall & Shell Vistas
  {
    rank: 19,
    sourceFile: 'img_7_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_2-20260813-110615.jpg',
    targetName: 'subbarao_gallery_19.webp',
    title: 'Dining Bar Counter & Houndstooth Seating',
    room: 'Dining Bar Counter & Houndstooth Seating',
    description: 'Cantilevered oak breakfast bar integrated into white low credenza, accompanied by houndstooth bar stools with brass legs, minimalist wire clock, and fluted paneling.'
  },
  {
    rank: 20,
    sourceFile: 'img_9_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_6-20260813-110617.jpg',
    targetName: 'subbarao_gallery_20.webp',
    title: 'Living Room Sofa & Marble Coffee Table Detail',
    room: 'Living Room Sofa & Marble Coffee Table Detail',
    description: 'Detailed front perspective of the heather-grey sectional sofa, ceramic vases with golden branches on marble table, and dining transition.'
  },
  {
    rank: 21,
    sourceFile: 'img_10_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_8-20260813-110617.jpg',
    targetName: 'subbarao_gallery_21.webp',
    title: 'Living Lounge Seating Vignette',
    room: 'Living Lounge Seating Vignette',
    description: 'Intimate lounge vignette showcasing layered cushion textures, minimalist desk lamp, and full-height sheer drapery.'
  },
  {
    rank: 22,
    sourceFile: 'img_19_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_24-20260813-110617.jpg',
    targetName: 'subbarao_gallery_22.webp',
    title: 'Living Lounge Centered Perspective',
    room: 'Living Lounge Centered Perspective',
    description: 'Centered elevation of the living sofa with golden block end-table, brass accents, and seamless Italian marble floor tiles.'
  },
  {
    rank: 23,
    sourceFile: 'img_8_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg',
    targetName: 'subbarao_gallery_23.webp',
    title: 'Integrated Smart Refrigerator & Fluted Portal Detail',
    room: 'Integrated Smart Refrigerator & Fluted Portal Detail',
    description: 'Bespoke joinery housing the double-door smart refrigerator alongside bronze-tinted glass sliding doors and white panelled interior door.'
  },
  {
    rank: 24,
    sourceFile: 'img_4_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_16-20260813-110611.jpg',
    targetName: 'subbarao_gallery_24.webp',
    title: 'Boys Suite Study Wall & Grid Memory Board',
    room: 'Boys Suite Study Wall & Grid Memory Board',
    description: 'Vibrant study wall with yellow accent paint, charcoal grey contrast, black metal wire grid photo organizer, and graphic framed prints.'
  },
  {
    rank: 25,
    sourceFile: 'img_25_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Parents_Room_20-20260813-110612.jpg',
    targetName: 'subbarao_gallery_25.webp',
    title: 'Parents Suite Floor Vista & Entertainment Wall',
    room: 'Parents Suite Floor Vista & Entertainment Wall',
    description: 'Wide architectural perspective showing the spatial flow of the parents bedroom suite, light oak flooring, and media entertainment wall.'
  },
  {
    rank: 26,
    sourceFile: 'img_6_Exquisite_Fusion_of_Modern___Desi_in_a_4BHK-Boys_Room_19-20260813-110616.jpg',
    targetName: 'subbarao_gallery_26.webp',
    title: 'Boys Suite Architectural Shell & Curtains',
    room: 'Boys Suite Architectural Shell & Curtains',
    description: 'Spatial layout showing the floor carpet, double-height window curtains with terracotta orange accents, and sunshine yellow feature wall.'
  }
];

async function processAll() {
  const srcDir = path.resolve('temp_subbarao_new');
  const targetDir = path.resolve('client/public/images/projects/kachiguda_subbarao_duplex');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log(`Starting 4K UHD conversion for all ${RANKED_IMAGES.length} images...`);
  const processed = [];

  for (let i = 0; i < RANKED_IMAGES.length; i++) {
    const item = RANKED_IMAGES[i];
    const srcPath = path.join(srcDir, item.sourceFile);
    const targetPath = path.join(targetDir, item.targetName);

    console.log(`[${i + 1}/${RANKED_IMAGES.length}] Upscaling to 4K: ${item.targetName} (${item.title})...`);

    // Target 4K UHD: 3840 x 2160 (16:9)
    await sharp(srcPath)
      .resize({
        width: 3840,
        height: 2160,
        fit: 'cover',
        kernel: sharp.kernel.lanczos3
      })
      .sharpen({
        sigma: 1.0,
        m1: 0.5,
        m2: 0.5
      })
      .webp({
        quality: 95,
        effort: 6
      })
      .toFile(targetPath);

    const stats = fs.statSync(targetPath);
    console.log(`  ✓ 4K WebP written: ${item.targetName} (${Math.round(stats.size / 1024)} KB)`);

    processed.push({
      ...item,
      localFile: `/images/projects/kachiguda_subbarao_duplex/${item.targetName}`,
      localDiskPath: targetPath,
      sizeBytes: stats.size
    });
  }

  // Generate 4K hero & after from Rank 1 (Grand Duplex Living Hall Vista)
  const heroPath = path.join(targetDir, 'subbarao_hero.webp');
  fs.copyFileSync(processed[0].localDiskPath, heroPath);
  console.log('  ✓ subbarao_hero.webp created from Rank 1');

  const afterPath = path.join(targetDir, 'subbarao_after.webp');
  fs.copyFileSync(processed[0].localDiskPath, afterPath);
  console.log('  ✓ subbarao_after.webp created from Rank 1');

  // Now upload all 26 4K images to Cloudinary!
  console.log('\n--- Uploading 4K images to Cloudinary (folder: espacio_gallery) ---');
  for (let i = 0; i < processed.length; i++) {
    const item = processed[i];
    console.log(`[${i + 1}/${processed.length}] Uploading ${item.targetName} to Cloudinary...`);
    try {
      // Create a temporary high-quality JPEG for Cloudinary upload
      const jpegBuffer = await sharp(item.localDiskPath).jpeg({ quality: 95 }).toBuffer();
      const base64 = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
      const uploadRes = await uploadToCloudinary(base64, `subbarao_new_4k_gallery_${item.rank}`);
      item.cloudinaryUrl = uploadRes.secure_url;
      item.cloudinaryPublicId = uploadRes.public_id;
      console.log(`  ✓ Cloudinary: ${uploadRes.secure_url}`);
    } catch (err) {
      console.error(`  ✗ Cloudinary upload failed for ${item.targetName}:`, err.message);
      item.cloudinaryUrl = item.localFile;
    }
  }

  // Upload hero and after
  console.log('Uploading Hero & After to Cloudinary...');
  let heroUrl = processed[0].cloudinaryUrl;
  let afterUrl = processed[0].cloudinaryUrl;
  try {
    const heroJpg = await sharp(heroPath).jpeg({ quality: 95 }).toBuffer();
    const hRes = await uploadToCloudinary(`data:image/jpeg;base64,${heroJpg.toString('base64')}`, 'subbarao_new_4k_hero');
    heroUrl = hRes.secure_url;
  } catch (e) {
    console.warn('Hero upload warn:', e.message);
  }

  try {
    const afterJpg = await sharp(afterPath).jpeg({ quality: 95 }).toBuffer();
    const aRes = await uploadToCloudinary(`data:image/jpeg;base64,${afterJpg.toString('base64')}`, 'subbarao_new_4k_after');
    afterUrl = aRes.secure_url;
  } catch (e) {
    console.warn('After upload warn:', e.message);
  }

  const finalManifest = {
    projectId: 'proj_8_kachiguda_subbarao',
    slug: 'kachiguda-fusion-duplex-villa',
    title: 'A Duplex Residence, Kachiguda',
    heroImage: heroUrl,
    afterImage: afterUrl,
    beforeImage: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791176785/espacio_gallery/blohvaxle28zo18l7lug.jpg',
    images: processed.map(p => p.cloudinaryUrl),
    localImages: processed.map(p => p.localFile),
    rooms: processed.map(p => ({
      name: p.room,
      room: p.room,
      title: p.title,
      image: p.cloudinaryUrl,
      localImage: p.localFile,
      description: p.description
    })),
    details: processed
  };

  fs.writeFileSync('server/scripts/subbarao_processed_manifest.json', JSON.stringify(finalManifest, null, 2), 'utf8');
  console.log('\n✓ Saved complete 4K manifest to server/scripts/subbarao_processed_manifest.json');
}

processAll().catch(console.error);
