import { query } from '../config/supabase.js';

async function run() {
  const targetId = 'proj_1_rajapushpa_provincia';
  const badImageSubstr = '125614_59b74a58';

  const res = await query('SELECT data FROM projects WHERE id = $1 OR _id = $1', [targetId]);
  if (res.rows && res.rows[0]) {
    const data = res.rows[0].data;
    const initialCount = data.gallery?.length || 0;
    
    // Filter out the mixed-in image from gallery
    if (Array.isArray(data.gallery)) {
      data.gallery = data.gallery.filter(img => typeof img === 'string' && !img.includes(badImageSubstr));
    }
    
    // Also ensure afterImage / beforeImage don't point to it
    if (typeof data.afterImage === 'string' && data.afterImage.includes(badImageSubstr)) {
      data.afterImage = data.heroImage;
    }
    if (Array.isArray(data.afterImages)) {
      data.afterImages = data.afterImages.filter(img => typeof img === 'string' && !img.includes(badImageSubstr));
      if (data.afterImages.length === 0) data.afterImages = [data.heroImage];
    }
    if (Array.isArray(data.before_after)) {
      data.before_after.forEach(item => {
        if (typeof item.after === 'string' && item.after.includes(badImageSubstr)) {
          item.after = data.heroImage;
        }
      });
    }

    await query('UPDATE projects SET data = $1 WHERE id = $2 OR _id = $2', [data, targetId]);
    console.log(`Successfully cleaned Arcstone Residence! Gallery count went from ${initialCount} to ${data.gallery.length}`);
    console.log('Remaining gallery:');
    data.gallery.forEach((g, i) => console.log(i, g));
  } else {
    console.log('Project not found in DB');
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
