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

export const getOptimizedImageUrl = (url, width = 1600, quality = 88) => {
  if (!url || typeof url !== 'string') return url;

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
