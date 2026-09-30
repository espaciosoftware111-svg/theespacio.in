/**
 * ESPACIO Image Optimization Utility — Performance Edition
 * ─────────────────────────────────────────────────────────
 * • Cloudinary: f_auto,q_auto,w_N,c_limit + WebP via f_auto
 * • Unsplash: fm=webp&q=N&w=N
 * • Google Drive: =wN size hint
 * • Local: .jpg/.png → .webp (pre-converted)
 * • In-process memoization: repeated calls for the same URL+size are O(1)
 */

// Memoization cache: key = `${url}|${width}|${quality}` → optimizedUrl
const _cache = new Map();

const DIMMU_DRIVE_MAP = {
  '11vRjw6c7ggNcKN0lxai6ITtYi9pFAb90': '/images/projects/dimmu_residence/dimmu_05.webp',
  '1-3G3pcdQjdfQdQIgV9_NiPVHug1jBEV-': '/images/projects/dimmu_residence/dimmu_01.webp',
  '1AU0ZTuIDg3GFVukC10lhQIL9ciUHOP6F': '/images/projects/dimmu_residence/dimmu_06.webp',
  '1P7uXgbUY5Fxi1-PpHJMLMwJ3buW0--uZ': '/images/projects/dimmu_residence/dimmu_03.webp',
  '1NSvtQJQT6yMaXzaKo0MuYCh6QASUpIar': '/images/projects/dimmu_residence/dimmu_10.webp',
  '1vBO1eqO5WOqGfwUH_SHVH7w4SDYW_F6K': '/images/projects/dimmu_residence/dimmu_09.webp',
  '1DJKwU5PAkkFGGnh5USDg-X2x87ZIYFxc': '/images/projects/dimmu_residence/dimmu_08.webp',
  '12NBwWBswtvKr0wNiU8qLvvzp6r4IX4mA': '/images/projects/dimmu_residence/dimmu_02.webp',
  '1GftiecMuUOlfXEMdCtL6q0O5cpkrW2EF': '/images/projects/dimmu_residence/dimmu_07.webp',
  '1smFAVnKujLD_imWl--XMcNFas-faQXc-': '/images/projects/dimmu_residence/dimmu_04.webp'
};

export const getOptimizedImageUrl = (url, width = 1600, quality = 88) => {
  if (!url || typeof url !== 'string') return url;

  for (const [id, localPath] of Object.entries(DIMMU_DRIVE_MAP)) {
    if (url.includes(id)) return localPath;
  }

  // Already optimal — skip transformations
  if (url.startsWith('data:') || url.endsWith('.svg')) return url;

  const w = Math.max(width || 1400, 200);
  const q = Math.max(quality || 88, 60);

  const cacheKey = `${url}|${w}|${q}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  let result = url;

  // ── 1. Cloudinary ──────────────────────────────────────────────────────────
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto')) {
      // f_auto → WebP/AVIF automatically; q_auto:good = best quality/size ratio
      result = url.replace('/upload/', `/upload/f_auto,q_auto:good,w_${w},c_limit,dpr_auto/`);
    } else {
      result = url;
    }
  }

  // ── 2. Unsplash ────────────────────────────────────────────────────────────
  else if (url.includes('images.unsplash.com')) {
    let clean = url
      .replace(/([?&])w=\d+/g, '')
      .replace(/([?&])q=\d+/g, '')
      .replace(/([?&])fm=[a-zA-Z0-9]+/g, '');
    const sep = clean.includes('?') ? '&' : '?';
    result = `${clean}${sep}fm=webp&q=${q}&w=${w}&auto=format&fit=crop`;
  }

  // ── 3. Google Drive / GoogleUserContent ────────────────────────────────────
  else if (url.includes('googleusercontent.com/d/')) {
    result = `${url.split('=')[0]}=w${w}`;
  }

  // ── 4. Google Lens / lh3.googleusercontent.com ────────────────────────────
  else if (url.includes('lh3.googleusercontent.com')) {
    // Append =wNNN size hint if not already present
    if (!url.includes('=w')) {
      result = `${url}=w${w}`;
    } else {
      result = url.replace(/=w\d+/, `=w${w}`);
    }
  }

  // ── 5. Local static assets → prefer .webp ─────────────────────────────────
  else if (url.startsWith('/') && /\.(jpe?g|png)$/i.test(url)) {
    result = url.replace(/\.(jpe?g|png)$/i, '.webp');
  }

  // ── 6. All others — return as-is ──────────────────────────────────────────
  else {
    result = url;
  }

  // Limit cache size to prevent unbounded growth
  if (_cache.size > 2000) _cache.clear();
  _cache.set(cacheKey, result);
  return result;
};

export default getOptimizedImageUrl;
