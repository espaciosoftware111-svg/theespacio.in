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

export const getOptimizedImageUrl = (url, width = 1600, quality = 95) => {
  if (!url || typeof url !== 'string') return url;

  for (const [id, localPath] of Object.entries(DIMMU_DRIVE_MAP)) {
    if (url.includes(id)) return localPath;
  }

  // Already optimal — skip transformations
  if (url.startsWith('data:') || url.endsWith('.svg')) return url;

  const cacheKey = `${url}|${width}|${quality}`;
  if (_cache.has(cacheKey)) return _cache.get(cacheKey);

  let result = url;

  // ── 1. Cloudinary ──────────────────────────────────────────────────────────
  // Preserve normal maximum quality without lossy compression grain (avoid q_auto:good / q_auto:low)
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      // Use q_auto:best to prevent compression noise, grain, and blockiness
      result = url.replace('/upload/', '/upload/f_auto,q_auto:best/');
    } else {
      // Replace any aggressive low-quality flags with high-fidelity normal quality
      result = url.replace('q_auto:good', 'q_auto:best').replace('q_auto:low', 'q_auto:best').replace('q_auto:eco', 'q_auto:best');
    }
  }

  // ── 2. Unsplash ────────────────────────────────────────────────────────────
  else if (url.includes('images.unsplash.com')) {
    let clean = url
      .replace(/([?&])w=\d+/g, '')
      .replace(/([?&])q=\d+/g, '')
      .replace(/([?&])fm=[a-zA-Z0-9]+/g, '');
    const sep = clean.includes('?') ? '&' : '?';
    result = `${clean}${sep}auto=format&fit=crop&q=95`;
  }

  // ── 3. Google Drive / GoogleUserContent ────────────────────────────────────
  else if (url.includes('googleusercontent.com/d/')) {
    result = `${url.split('=')[0]}=w2560`;
  }

  // ── 4. Google Lens / lh3.googleusercontent.com ────────────────────────────
  else if (url.includes('lh3.googleusercontent.com')) {
    if (!url.includes('=w')) {
      result = `${url}=w2560`;
    } else {
      result = url.replace(/=w\d+/, '=w2560');
    }
  }

  // ── 5. Local static assets & all others ───────────────────────────────────
  // Preserve normal original image format (.jpg/.png/.webp) without forced downgrade
  else {
    result = url;
  }

  // Limit cache size to prevent unbounded growth
  if (_cache.size > 2000) _cache.clear();
  _cache.set(cacheKey, result);
  return result;
};

export default getOptimizedImageUrl;
