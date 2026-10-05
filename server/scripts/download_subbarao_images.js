import axios from 'axios';
import fs from 'fs';
import path from 'path';

const files = [
  { id: '1Ljq6TrNj_k6zXaaLtH8vmSC2j4RWZM6v', name: 'BEDROOM (2).jpeg' },
  { id: '1CIY_EJCGlUH1tq_CdhF8XeKlq0o1nkz0', name: 'BEDROOM.jpeg' },
  { id: '1ir3ISPWKKnppY_ixpZZyd_x7UINeFLgR', name: 'GBR (2).jpeg' },
  { id: '1nMzQfDpn25bFZ8hbWWcoDa-GCOU1udT5', name: 'GBR (3).jpeg' },
  { id: '1W1ERuQQPW6b0vr6Us64nVlgZiq7MG_Ci', name: 'GBR.jpeg' },
  { id: '1pU56QApVucsbXCiySvAR8qaMHtJ4lqdx', name: 'HALL (2).jpeg' },
  { id: '1ryyAr0zf2hGzvb1qTiiG1XLGgeXEVH5G', name: 'HALL (3).jpeg' },
  { id: '1p1ceBfMKTHcXwfCGyM9dRSg_2Khhp_pt', name: 'HALL (4).jpeg' },
  { id: '1DClyNRURhfJQ5wnQwnlQIcZj4loc0Xs8', name: 'HALL (5).jpeg' },
  { id: '1rzVWbM0jk-oDkCmQMJEc3lU-IAzthNuO', name: 'HALL.jpeg' },
  { id: '189Qpn6dscNhcRyp4tTXfSzj1hPKTe4qk', name: 'KITCHEN (2).jpeg' },
  { id: '1pjD1c-XXvVzReWzexjtlgV_xUl1Z4Ku5', name: 'KITCHEN.jpeg' },
  { id: '1_ImoclDHILWk3gzdx9mOGtoHAERem8bQ', name: 'MBR (2).jpeg' },
  { id: '1Qlu-ZZ0V8PlmVsphz5okd23XchqIrQYe', name: 'MBR (3).jpeg' },
  { id: '1OjsPc4ylHzmwl2cIGqxKPOTzJRhwq6sn', name: 'MBR (4).jpeg' },
  { id: '1g6Yd4l1q6pOJsp80COQJjJv2CQJKVTzF', name: 'MBR.jpeg' },
  { id: '1lE6ntuMrrzaNrbhyx07SUiMz4wa6OGeQ', name: 'PUJA.jpeg' },
  { id: '1TEnOUpPktvSKsJ_pX_oaKcB-eAeg3_CT', name: 'UTILITY.jpeg' },
  { id: '1jYa0H_CMtJbs9KwvtvKAtU4W0GI6YHye', name: 'WIC (2).jpeg' },
  { id: '1dkyWQW2ADdtWU_m27t8NzNYQlwNxLOms', name: 'WIC.jpeg' }
];

async function downloadAll() {
  const outDir = path.resolve('temp_subbarao');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const downloaded = [];

  for (let i = 0; i < files.length; i++) {
    const item = files[i];
    const safeName = item.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const outPath = path.join(outDir, safeName);
    console.log(`[${i + 1}/${files.length}] Downloading ${item.name} (${item.id})...`);

    try {
      const res = await axios.get(`https://lh3.googleusercontent.com/d/${item.id}`, {
        responseType: 'arraybuffer',
        timeout: 30000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      fs.writeFileSync(outPath, Buffer.from(res.data));
      const stats = fs.statSync(outPath);
      downloaded.push({
        index: i + 1,
        id: item.id,
        name: item.name,
        safeName,
        localPath: outPath,
        sizeBytes: stats.size
      });
      console.log(`  ✓ Saved ${safeName} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.error(`  ✗ Failed ${item.name}: ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(downloaded, null, 2), 'utf8');
  console.log(`\nCompleted downloading ${downloaded.length}/${files.length} images to ${outDir}`);
}

downloadAll();
