import axios from 'axios';
import fs from 'fs';
import path from 'path';

const fileIds = [
  '1Fl8pqt9MZOw5XbebjVZsuJwQN4trs8vd',
  '1CArZE4FMlrxwjcG8tQWJuEhCvfR-0x2E',
  '1Y4lo2Bmw3opEayRX6xPdo6AEulByP8sU',
  '1oozz5R5851UXJLKszmPIrBz0kYy1ZukC',
  '1D-et82mudoMzj_SysQPjkoBxPLUqdkO3',
  '1jqVpopduARgVqNQVYbW_CvMQzZqKpNjW',
  '1BLj1mcH85cal-nIakVTDHAR425WnA7Dz',
  '1y8ZjPLwHKaTRGV73Qt-a-M7rNtKpcTd7',
  '1j0IEZn91rSRy3l8cUHKOMjVTtwcnLOkU',
  '1t1iYtiytBWwNTZU7bnDr2gRvCXK7yi7I',
  '1d4z-4aC0l9n0lH2mLsdKYqSjhXHuY2VR',
  '16lQFbVyAKHVgHIu7lC2QXIfi6HpXWZci',
  '1RqssGNNJ6LKFnv_yeHGPEKl9CRihmU17',
  '13PdPzJa7Prj-_JcO4o6CdYari1uNC_ci',
  '1xN8zy32UjVjKDc5PZFbar5diVE3guUUZ',
  '1Ti6yZE6DYfJ88f4fG5kVCSOV2l6fvpcJ',
  '1mCIvse9SC6RRIOE-0vfkSM8jZ7LAhx3B',
  '1YNj_u3-SiGNal99IBPyWpT2vPc79IOvq',
  '1HehNyf7Vbsj1IxztY6xarDDNWlPuTahf',
  '13lMQxjdG1WQVQTezQq8MvkhNRSy2SvTn',
  '1ugas99UuaBMc2vgmDGg40UCBbDak5Tjg',
  '1b6vIV2sG7OOuVF5oZMYsWRaAv6aWTvcz',
  '1CaDt-wcPyosuNBgyRVt0Fgs84pOhRGko',
  '1L1aHRdnd64X9otbS21FKYBgHqC-1FVPQ',
  '1U1e_4wndEaJekkxQvxuHmiYK67XPlCN5',
  '10T0vagh8E5TpacZmspfxzF92TIxb3YMS',
  '1CG4einKmnM_NZzojLiNLBsBRVY6Mz-18',
  '12fOua_URkkrBcjcNw8WQ9j-BoO6veemY',
  '1NjH3-n2Mlz6tN5Pp3sGLyosIB6A0retk'
];

async function main() {
  const outDir = path.resolve('temp_rahul');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results = [];

  for (let i = 0; i < fileIds.length; i++) {
    const id = fileIds[i];
    console.log(`[${i + 1}/${fileIds.length}] Fetching ${id}...`);
    try {
      // 1. Get title from view page
      let fileName = `file_${i + 1}.jpg`;
      try {
        const viewRes = await axios.get(`https://drive.google.com/file/d/${id}/view`, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          timeout: 8000
        });
        const titleMatch = viewRes.data.match(/<meta property="og:title" content="([^"]+)"/) || viewRes.data.match(/<title>([^<]+)<\/title>/);
        if (titleMatch) {
          fileName = titleMatch[1].replace(' - Google Drive', '').trim();
        }
      } catch (e) {
        console.warn('Could not get title for', id, e.message);
      }

      // 2. Download file buffer
      const dlRes = await axios.get(`https://lh3.googleusercontent.com/d/${id}`, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });

      const ext = path.extname(fileName) || '.jpg';
      const safeName = `${String(i + 1).padStart(2, '0')}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = path.join(outDir, safeName);
      fs.writeFileSync(filePath, Buffer.from(dlRes.data));

      results.push({
        index: i + 1,
        id,
        fileName,
        savedAs: safeName,
        size: dlRes.data.byteLength
      });
      console.log(`  Saved: ${safeName} (${Math.round(dlRes.data.byteLength / 1024)} KB)`);
    } catch (err) {
      console.error(`  Error downloading ${id}:`, err.message);
    }
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(results, null, 2));
  console.log('Finished downloading all files!');
}

main().catch(console.error);
