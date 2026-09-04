import { pool } from '../config/supabase.js';

const projectsBeforeAfter = {
  'rajapushpa-provincia-3bhk': {
    before: '/images/projects/rajapushpa_provincia/rajapushpa_before.webp',
    after: '/images/projects/rajapushpa_provincia/rajapushpa_after.webp'
  },
  'my-home-sayuk-3bhk': {
    before: '/images/projects/my_home_sayuk/sayuk_before_raw.webp',
    after: '/images/projects/my_home_sayuk/sayuk_after_open_hall.webp'
  },
  'kokapet-2bhk': {
    before: '/images/projects/kokapet_nagesh_2bhk/kokapet_before.webp',
    after: '/images/projects/kokapet_nagesh_2bhk/kokapet_after.webp'
  },
  'kokapet-urban-2bhk': {
    before: '/images/projects/kokapet_rahul_2bhk/rahul_before.webp',
    after: '/images/projects/kokapet_rahul_2bhk/rahul_after.webp'
  },
  'gandipet-modern-retro-2bhk': {
    before: '/images/projects/gandipet_kiran_2bhk/kiran_before.webp',
    after: '/images/projects/gandipet_kiran_2bhk/kiran_after.webp'
  },
  'kondapur-minimalist-2bhk': {
    before: '/images/projects/kondapur_venkatesh_2bhk/venkatesh_before.webp',
    after: '/images/projects/kondapur_venkatesh_2bhk/venkatesh_after.webp'
  },
  'gachibowli-minimalist-beige-2bhk': {
    before: '/images/projects/gachibowli_koteswara_2bhk/koteswara_before.webp',
    after: '/images/projects/gachibowli_koteswara_2bhk/koteswara_after.webp'
  },
  'kachiguda-fusion-duplex-villa': {
    before: '/images/projects/kachiguda_subbarao_duplex/subbarao_before.webp',
    after: '/images/projects/kachiguda_subbarao_duplex/subbarao_after.webp'
  }
};

async function run() {
  for (const [slug, ba] of Object.entries(projectsBeforeAfter)) {
    const baArray = JSON.stringify([{ before: ba.before, after: ba.after }]);
    const res = await pool.query(
      `UPDATE projects 
       SET before_after = $1::jsonb, 
           data = jsonb_set(
             jsonb_set(
               jsonb_set(
                 jsonb_set(COALESCE(data, '{}'::jsonb), '{beforeImage}', to_jsonb($2::text), true),
                 '{afterImage}', to_jsonb($3::text), true
               ),
               '{beforeImages}', to_jsonb(ARRAY[$2::text]), true
             ),
             '{afterImages}', to_jsonb(ARRAY[$3::text]), true
           )
       WHERE slug = $4 RETURNING slug`,
      [baArray, ba.before, ba.after, slug]
    );
    console.log('Updated project:', slug, res.rowCount);
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
