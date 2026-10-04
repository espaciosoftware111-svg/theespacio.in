import axios from 'axios';

const ids = [
  '1Ljq6TrNj_k6zXaaLtH8vmSC2j4RWZM6v',
  '1CIY_EJCGlUH1tq_CdhF8XeKlq0o1nkz0',
  '1ir3ISPWKKnppY_ixpZZyd_x7UINeFLgR',
  '1nMzQfDpn25bFZ8hbWWcoDa-GCOU1udT5',
  '1W1ERuQQPW6b0vr6Us64nVlgZiq7MG_Ci',
  '1pU56QApVucsbXCiySvAR8qaMHtJ4lqdx',
  '1ryyAr0zf2hGzvb1qTiiG1XLGgeXEVH5G',
  '1p1ceBfMKTHcXwfCGyM9dRSg_2Khhp_pt',
  '1DClyNRURhfJQ5wnQwnlQIcZj4loc0Xs8',
  '1rzVWbM0jk-oDkCmQMJEc3lU-IAzthNuO',
  '189Qpn6dscNhcRyp4tTXfSzj1hPKTe4qk',
  '1pjD1c-XXvVzReWzexjtlgV_xUl1Z4Ku5',
  '1_ImoclDHILWk3gzdx9mOGtoHAERem8bQ',
  '1Qlu-ZZ0V8PlmVsphz5okd23XchqIrQYe',
  '1OjsPc4ylHzmwl2cIGqxKPOTzJRhwq6sn',
  '1g6Yd4l1q6pOJsp80COQJjJv2CQJKVTzF',
  '1lE6ntuMrrzaNrbhyx07SUiMz4wa6OGeQ',
  '1TEnOUpPktvSKsJ_pX_oaKcB-eAeg3_CT',
  '1jYa0H_CMtJbs9KwvtvKAtU4W0GI6YHye',
  '1dkyWQW2ADdtWU_m27t8NzNYQlwNxLOms'
];

async function inspectFiles() {
  const results = [];
  for (const id of ids) {
    try {
      const res = await axios.get(`https://drive.google.com/file/d/${id}/view`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000
      });
      const titleMatch = res.data.match(/<meta property="og:title" content="([^"]+)"/) || res.data.match(/<title>([^<]+)<\/title>/);
      const name = titleMatch ? titleMatch[1].replace(' - Google Drive', '') : id;
      results.push({ id, name });
      console.log(`ID: ${id} -> Name: ${name}`);
    } catch (err) {
      console.error(`ID: ${id} error:`, err.message);
      results.push({ id, name: id });
    }
  }
  console.log('\nFinal list:');
  console.log(JSON.stringify(results, null, 2));
}

inspectFiles();
