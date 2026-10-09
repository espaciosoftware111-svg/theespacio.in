import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CANONICAL_ROOM_WISE_GALLERIES } from '../../client/src/utils/projectRooms.js';
import { query } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cmsPath = path.resolve(__dirname, '../../client/src/utils/cmsStore.js');

async function syncAll() {
  console.log('--- 1. Updating client/src/utils/cmsStore.js ---');
  let cmsContent = fs.readFileSync(cmsPath, 'utf8');

  const startMarker = 'export const DEFAULT_PROJECTS = [';
  const endMarker = 'export const DEFAULT_PRODUCTS = [';

  const sIdx = cmsContent.indexOf(startMarker);
  const eIdx = cmsContent.indexOf(endMarker);

  if (sIdx === -1 || eIdx === -1) {
    throw new Error('Markers for DEFAULT_PROJECTS not found in cmsStore.js');
  }

  const rawProjectsBlock = cmsContent.substring(sIdx + startMarker.length, eIdx).trim();
  const cleanArrayString = rawProjectsBlock.replace(/\];?\s*$/, '');
  const parsedProjects = eval(`([${cleanArrayString}])`);

  console.log(`Parsed ${parsedProjects.length} projects from cmsStore.js`);

  for (const p of parsedProjects) {
    const slug = p.slug;
    if (CANONICAL_ROOM_WISE_GALLERIES[slug]) {
      p.gallery = CANONICAL_ROOM_WISE_GALLERIES[slug];
      p.heroImage = p.gallery[0];
      if (p.hero_image) p.hero_image = p.gallery[0];
      console.log(`Updated ${p.title} (${slug}): ${p.gallery.length} images room-wise. Hero: ${p.heroImage}`);
    }
  }

  const newDefaultProjectsCode = `export const DEFAULT_PROJECTS = ${JSON.stringify(parsedProjects, null, 2)};\n\n`;
  cmsContent = cmsContent.substring(0, sIdx) + newDefaultProjectsCode + cmsContent.substring(eIdx);
  fs.writeFileSync(cmsPath, cmsContent, 'utf8');
  console.log('cmsStore.js updated successfully!');

  console.log('\n--- 2. Updating Supabase Database ---');
  for (const p of parsedProjects) {
    const slug = p.slug;
    if (!CANONICAL_ROOM_WISE_GALLERIES[slug]) continue;

    const gallery = CANONICAL_ROOM_WISE_GALLERIES[slug];
    const heroImage = gallery[0];

    try {
      const selectRes = await query('SELECT id, data FROM projects WHERE slug = $1 OR id = $2', [slug, p._id]);
      if (selectRes.rows.length === 0) {
        console.warn(`Project not found in DB: ${slug}`);
        continue;
      }

      const row = selectRes.rows[0];
      let dataObj = typeof row.data === 'object' && row.data !== null ? { ...row.data } : {};
      dataObj.gallery = gallery;
      dataObj.heroImage = heroImage;
      dataObj.hero_image = heroImage;

      await query(
        `UPDATE projects 
         SET gallery = $1::jsonb,
             hero_image = $2,
             data = $3::jsonb,
             updated_at = NOW()
         WHERE id = $4`,
        [JSON.stringify(gallery), heroImage, JSON.stringify(dataObj), row.id]
      );
      console.log(`DB updated for: ${p.title} (${row.id})`);
    } catch (dbErr) {
      console.error(`DB error for ${slug}:`, dbErr.message);
    }
  }

  console.log('\nAll projects synced room-wise successfully!');
}

syncAll().then(() => process.exit(0)).catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
