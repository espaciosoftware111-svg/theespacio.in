import { query, pool } from '../config/supabase.js';

async function run() {
  try {
    console.log('Connecting to database...');

    // 1. Delete removed projects completely
    const idsToDelete = [
      'proj_1_rajapushpa_provincia',
      'proj_2_my_home_sayuk',
      'proj_3_kokapet_nagesh',
      'proj_4_kokapet_rahul'
    ];
    const slugsToDelete = [
      'rajapushpa-provincia-3bhk',
      'my-home-sayuk-3bhk',
      'kokapet-2bhk',
      'kokapet-urban-2bhk'
    ];

    const delRes = await query(
      `DELETE FROM projects WHERE id = ANY($1) OR slug = ANY($2) RETURNING id, slug, title`,
      [idsToDelete, slugsToDelete]
    );
    console.log(`Deleted ${delRes.rowCount} projects:`, delRes.rows);

    // 2. Define the new canonical order of the remaining 7 projects
    const orderUpdates = [
      {
        id: 'proj_9_dimmu_chachu_residence',
        slug: 'dimmu-chachu-luxury-villa',
        title: 'The Celestial Curve Villa',
        location: 'Kukatpally, Hyderabad',
        order: 1
      },
      {
        id: 'proj_11_casa_alta_residence_kali_mandir',
        slug: 'casa-alta-residence-kali-mandir',
        title: 'Casa Alta Residence',
        location: 'Kali Mandir, Hyderabad',
        order: 2
      },
      {
        id: 'proj_5_gandipet_kiran',
        slug: 'gandipet-modern-retro-2bhk',
        title: 'The Panelled Muse',
        location: 'Gandipet, Hyderabad',
        order: 3
      },
      {
        id: 'proj_6_kondapur_venkatesh',
        slug: 'kondapur-minimalist-2bhk',
        title: 'The Dusk Lounge',
        location: 'Kondapur, Hyderabad',
        order: 4
      },
      {
        id: 'proj_7_gachibowli_koteswara',
        slug: 'gachibowli-minimalist-beige-2bhk',
        title: 'A 2BHK Residence, Gachibowli',
        location: 'Gachibowli, Hyderabad',
        order: 5
      },
      {
        id: 'proj_8_kachiguda_subbarao',
        slug: 'kachiguda-fusion-duplex-villa',
        title: 'A Duplex Residence, Kachiguda',
        location: 'Kachiguda, Hyderabad',
        order: 6
      },
      {
        id: 'proj_10_the_restful_home_tellapur',
        slug: 'the-restful-home-tellapur',
        title: 'The Restful Home',
        location: 'Tellapur, Hyderabad',
        order: 7
      }
    ];

    for (const item of orderUpdates) {
      // Fetch existing data JSONB
      const selectRes = await query(`SELECT id, data FROM projects WHERE id = $1 OR slug = $2`, [item.id, item.slug]);
      let updatedData = {};
      if (selectRes.rows[0]?.data) {
        updatedData = typeof selectRes.rows[0].data === 'object' ? selectRes.rows[0].data : JSON.parse(selectRes.rows[0].data);
      }
      updatedData.order = item.order;
      updatedData.location = item.location;
      updatedData.title = item.title;
      updatedData.featured = true;

      const upRes = await query(
        `UPDATE projects 
         SET "order" = $1, location = $2, title = $3, featured = true, data = $4, soft_delete = false, status = 'published'
         WHERE id = $5 OR slug = $6
         RETURNING id, title, location, "order"`,
        [item.order, item.location, item.title, JSON.stringify(updatedData), item.id, item.slug]
      );
      if (upRes.rowCount > 0) {
        console.log(`Updated project #${item.order}:`, upRes.rows[0]);
      } else {
        console.warn(`Project not found for update: ${item.id} / ${item.slug}`);
      }
    }

    console.log('✓ All database operations completed successfully.');
  } catch (err) {
    console.error('Error in reordering script:', err);
  } finally {
    await pool.end();
  }
}

run();
