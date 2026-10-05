import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import { query } from '../config/supabase.js';

// Ranked order: Best/Hero images at TOP, down to utility/secondary at BOTTOM
const RANKED_IMAGES = [
  {
    index: 1,
    sourceFile: 'HALL__3_.jpeg',
    targetBase: 'subbarao_gallery_1',
    room: 'Grand Living Lounge & Fluted TV Media Wall',
    description: 'Panoramic wide-angle view of the luxury living lounge with floating oak media console, marble wall panel, brass chandelier, and perimeter cove lighting.'
  },
  {
    index: 2,
    sourceFile: 'HALL__5_.jpeg',
    targetBase: 'subbarao_gallery_2',
    room: 'Living Lounge & Koi Fish Feature Alcove',
    description: 'Symmetrical grand view of the living lounge with beige sectional recliner, crystal chandelier, double entry doors, and glowing koi fish arched niche.'
  },
  {
    index: 3,
    sourceFile: 'PUJA.jpeg',
    targetBase: 'subbarao_gallery_3',
    room: 'Bespoke Pooja Mandir & Central Foyer Pavilion',
    description: 'Traditional-modern fusion centerpiece connecting living lounge and kitchen, framed in vertical fluted teak wood with hanging brass bells and glowing damask arch.'
  },
  {
    index: 4,
    sourceFile: 'MBR__3_.jpeg',
    targetBase: 'subbarao_gallery_4',
    room: 'Master Bedroom Suite & Halo Chandelier',
    description: 'Grand master bedroom perspective showcasing crystal halo chandelier, tray cove ceiling, sage accent wall with abstract art, and light oak hardwood flooring.'
  },
  {
    index: 5,
    sourceFile: 'MBR.jpeg',
    targetBase: 'subbarao_gallery_5',
    room: 'Master Bedroom Emerald Arch & Sage Wardrobes',
    description: 'Angular master suite view highlighting the emerald green and ivory curved headboard, golden lacquer art piece, and high-gloss mint/sage wardrobes.'
  },
  {
    index: 6,
    sourceFile: 'MBR__2_.jpeg',
    targetBase: 'subbarao_gallery_6',
    room: 'Master Suite Bed & Fluted Arch Crest',
    description: 'Centered focal view of the custom upholstered king bed, fluted arch backdrop, twin designer pendant lamps, and luxury botanical bed linen.'
  },
  {
    index: 7,
    sourceFile: 'KITCHEN__2_.jpeg',
    targetBase: 'subbarao_gallery_7',
    room: 'L-Shaped Modular Kitchen & Breakfast Counter',
    description: 'Styled contemporary modular kitchen with seamless handleless taupe cabinetry, veined quartz marble backsplash, gas cooktop, and illuminated glass display cabinets.'
  },
  {
    index: 8,
    sourceFile: 'KITCHEN.jpeg',
    targetBase: 'subbarao_gallery_8',
    room: 'Modular Kitchen Layout & Undermount Sink',
    description: 'Crisp architectural perspective of the L-shaped kitchen layout featuring undermount stainless sink, gooseneck faucet, and quartz marble worktops.'
  },
  {
    index: 9,
    sourceFile: 'GBR__3_.jpeg',
    targetBase: 'subbarao_gallery_9',
    room: 'Guest Bedroom Suite & Arched Fluted Wall',
    description: 'Striking guest bedroom suite with black fluted acoustic alcove against woven wallpaper, classic blush pink panelled wardrobe, and upholstered bed.'
  },
  {
    index: 10,
    sourceFile: 'GBR__2_.jpeg',
    targetBase: 'subbarao_gallery_10',
    room: 'Blush Wardrobes & Bedside Pendant Nook',
    description: 'Perspective view of the blush pink floor-to-ceiling shaker wardrobes, reading pendant lights, sheer drapery, and coordinated bed linen.'
  },
  {
    index: 11,
    sourceFile: 'HALL__2_.jpeg',
    targetBase: 'subbarao_gallery_11',
    room: 'Living Lounge Recliner & Marble Table',
    description: 'Detailed seating vignette featuring the plush cream recliner sofa, marble coffee table, fluted wall accents, and illuminated arched koi niche.'
  },
  {
    index: 12,
    sourceFile: 'HALL__4_.jpeg',
    targetBase: 'subbarao_gallery_12',
    room: 'Living Lounge & Velvet Accent Chair Nook',
    description: 'Dynamic perspective highlighting indoor potted greenery, curved velvet slipper chair, and warm layered ambient illumination.'
  },
  {
    index: 13,
    sourceFile: 'HALL.jpeg',
    targetBase: 'subbarao_gallery_13',
    room: 'Decorative Arched Feature Wall & Foyer',
    description: 'Architectural wall joinery with tiered blush arches, brass wall sconces, modern pendant spheres, and transition to the washroom foyer.'
  },
  {
    index: 14,
    sourceFile: 'MBR__4_.jpeg',
    targetBase: 'subbarao_gallery_14',
    room: 'Master Suite Vista & Mint Wardrobes',
    description: 'Perspective looking across the king bed toward the high-gloss sage wardrobes and private suite entry door.'
  },
  {
    index: 15,
    sourceFile: 'BEDROOM.jpeg',
    targetBase: 'subbarao_gallery_15',
    room: 'Bedroom Suite & Backlit Double Arches',
    description: 'Warm guest bedroom view featuring dual glowing arched headboard panels, bedside lamp, and glossy mint wardrobes.'
  },
  {
    index: 16,
    sourceFile: 'GBR.jpeg',
    targetBase: 'subbarao_gallery_16',
    room: 'Bedroom Suite & Curved Mint Wardrobe',
    description: 'View of the mint green wardrobe with rounded corner shelving and integrated charcoal fluted dressing vanity with pill-shaped mirror.'
  },
  {
    index: 17,
    sourceFile: 'WIC__2_.jpeg',
    targetBase: 'subbarao_gallery_17',
    room: 'Walk-In Wardrobe & Fluted Dressing Vanity',
    description: 'Walk-in closet suite with gloss sliding doors, vertical sage fluted vanity panel, Aztec-bordered round mirror, and tube pendant lights.'
  },
  {
    index: 18,
    sourceFile: 'WIC.jpeg',
    targetBase: 'subbarao_gallery_18',
    room: 'Dressing Vanity & Pill Mirror Station',
    description: 'Close-up of the dressing station with fluted charcoal wall panel, illuminated pill mirror, floating drawer, and pleated vanity pouf.'
  },
  {
    index: 19,
    sourceFile: 'UTILITY.jpeg',
    targetBase: 'subbarao_gallery_19',
    room: 'Stacked Laundry Tower & Utility Countertop',
    description: 'Dedicated laundry and utility alcove with stacked Samsung front-load washer and dryer, marble countertop with ceramic washbasin, and overhead storage.'
  },
  {
    index: 20,
    sourceFile: 'BEDROOM__2_.jpeg',
    targetBase: 'subbarao_gallery_20',
    room: 'Bedroom Colorway Study & Double Arches',
    description: 'Alternative colorway study featuring sage textured wall and dual headboard arches.'
  }
];

async function main() {
  const sourceDir = path.resolve('temp_subbarao');
  const targetDir = path.resolve('client/public/images/projects/kachiguda_subbarao_duplex');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  console.log('=== Step 1: Upscale & Optimize all 20 images to Ultra HD 4K ===');
  const processedList = [];

  for (const item of RANKED_IMAGES) {
    const srcPath = path.join(sourceDir, item.sourceFile);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source file not found: ${srcPath}`);
      continue;
    }

    const meta = await sharp(srcPath).metadata();
    const is4to3 = Math.abs((meta.width / meta.height) - (4 / 3)) < 0.1;
    const targetWidth = 3840;
    const targetHeight = is4to3 ? 2880 : 2160;

    const webpFilename = `${item.targetBase}.webp`;
    const jpgFilename = `${item.targetBase}_uhd_4k.jpg`;
    const webpPath = path.join(targetDir, webpFilename);
    const jpgPath = path.join(targetDir, jpgFilename);

    console.log(`[${item.index}/20] Converting ${item.sourceFile} (${meta.width}x${meta.height}) -> 4K UHD (${targetWidth}x${targetHeight})...`);

    // High quality Lanczos3 upsampling with sharpening
    await sharp(srcPath)
      .resize(targetWidth, targetHeight, { kernel: 'lanczos3', fit: 'cover' })
      .sharpen({ sigma: 1, m1: 0.5, m2: 0.5 })
      .webp({ quality: 95 })
      .toFile(webpPath);

    await sharp(srcPath)
      .resize(targetWidth, targetHeight, { kernel: 'lanczos3', fit: 'cover' })
      .sharpen({ sigma: 1, m1: 0.5, m2: 0.5 })
      .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
      .toFile(jpgPath);

    const outStats = fs.statSync(webpPath);
    console.log(`  ✓ Generated ${webpFilename} (${Math.round(outStats.size / 1024)} KB)`);

    processedList.push({
      ...item,
      localWebp: `/images/projects/kachiguda_subbarao_duplex/${webpFilename}`,
      localJpgPath: jpgPath,
      width: targetWidth,
      height: targetHeight
    });
  }

  // Also create hero & after images from Gallery 1 (Grand Living Lounge)
  console.log('\nCreating subbarao_hero.webp and subbarao_after.webp from Gallery 1...');
  fs.copyFileSync(path.join(targetDir, 'subbarao_gallery_1.webp'), path.join(targetDir, 'subbarao_hero.webp'));
  fs.copyFileSync(path.join(targetDir, 'subbarao_gallery_1.webp'), path.join(targetDir, 'subbarao_after.webp'));

  // Upscale subbarao_before.webp to 4K UHD 3840x2160 as well
  const beforeSource = path.join(targetDir, 'subbarao_before.webp');
  if (fs.existsSync(beforeSource)) {
    console.log('Upscaling subbarao_before.webp to 4K UHD 3840x2160...');
    const beforeBuf = fs.readFileSync(beforeSource);
    await sharp(beforeBuf)
      .resize(3840, 2160, { kernel: 'lanczos3', fit: 'cover' })
      .sharpen({ sigma: 1, m1: 0.5, m2: 0.5 })
      .webp({ quality: 95 })
      .toFile(path.join(targetDir, 'subbarao_before_uhd_4k.webp'));
    fs.copyFileSync(path.join(targetDir, 'subbarao_before_uhd_4k.webp'), beforeSource);
  }

  console.log('\n=== Step 2: Upload Ultra HD 4K images to Cloudinary (espacio_gallery) ===');
  for (const item of processedList) {
    try {
      const jpgBuffer = fs.readFileSync(item.localJpgPath);
      const base64 = `data:image/jpeg;base64,${jpgBuffer.toString('base64')}`;
      const cldName = `subbarao_kachiguda_${item.targetBase}_uhd_4k`;
      console.log(`Uploading ${item.targetBase} to Cloudinary...`);
      const res = await uploadToCloudinary(base64, cldName);
      item.cloudUrl = res.secure_url || res.url;
      console.log(`  ✓ Cloudinary URL: ${item.cloudUrl}`);
    } catch (err) {
      console.warn(`  ⚠ Cloudinary upload notice for ${item.targetBase}: ${err.message} (Using local 4K asset)`);
      item.cloudUrl = item.localWebp;
    }
  }

  // Upload before & after to Cloudinary
  let cloudBeforeUrl = null;
  let cloudAfterUrl = null;
  try {
    const afterJpgPath = path.join(targetDir, 'subbarao_gallery_1_uhd_4k.jpg');
    if (fs.existsSync(afterJpgPath)) {
      const buf = fs.readFileSync(afterJpgPath);
      const res = await uploadToCloudinary(`data:image/jpeg;base64,${buf.toString('base64')}`, 'subbarao_kachiguda_after_uhd_4k');
      cloudAfterUrl = res.secure_url;
      console.log('✓ Cloudinary After 4K:', cloudAfterUrl);
    }
  } catch (e) {
    console.warn('Cloudinary after upload note:', e.message);
  }

  try {
    const beforeBuf = fs.readFileSync(path.join(targetDir, 'subbarao_before.webp'));
    const beforeJpg = await sharp(beforeBuf).jpeg({ quality: 95 }).toBuffer();
    const res = await uploadToCloudinary(`data:image/jpeg;base64,${beforeJpg.toString('base64')}`, 'subbarao_kachiguda_before_uhd_4k');
    cloudBeforeUrl = res.secure_url;
    console.log('✓ Cloudinary Before 4K:', cloudBeforeUrl);
  } catch (e) {
    console.warn('Cloudinary before upload note:', e.message);
  }

  // Save the manifest
  const manifest = {
    projectId: 'proj_8_kachiguda_subbarao',
    slug: 'kachiguda-fusion-duplex-villa',
    title: 'A Duplex Residence, Kachiguda',
    clientName: 'K. Subba Rao',
    cloudBeforeUrl: cloudBeforeUrl || '/images/projects/kachiguda_subbarao_duplex/subbarao_before.webp',
    cloudAfterUrl: cloudAfterUrl || processedList[0].cloudUrl || '/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp',
    localHero: '/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_1.webp',
    cloudHero: processedList[0].cloudUrl || '/images/projects/kachiguda_subbarao_duplex/subbarao_gallery_1.webp',
    items: processedList
  };

  fs.writeFileSync('server/scripts/subbarao_processed_manifest.json', JSON.stringify(manifest, null, 2), 'utf8');
  console.log('\nManifest saved to server/scripts/subbarao_processed_manifest.json!');

  // Cleanup temporary jpg files to keep repository lightweight
  processedList.forEach(item => {
    if (fs.existsSync(item.localJpgPath)) fs.unlinkSync(item.localJpgPath);
  });
  const tempBefore = path.join(targetDir, 'subbarao_before_uhd_4k.webp');
  if (fs.existsSync(tempBefore)) fs.unlinkSync(tempBefore);

  console.log('✓ Cleanup done. All 20 pristine Ultra HD 4K WebP images are in client/public/images/projects/kachiguda_subbarao_duplex/');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in process_subbarao_4k:', err);
  process.exit(1);
});
