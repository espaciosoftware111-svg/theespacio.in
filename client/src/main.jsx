import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'


// ── One-time startup: clear stale maintenanceMode & projects cache from localStorage ──────────
// Prevents a previously-enabled maintenance mode and forces fresh project thumbnails
try {
  const settingsKey = 'espacio_cms_settings';
  const raw = localStorage.getItem(settingsKey);
  if (raw) {
    const parsed = JSON.parse(raw);
    if (parsed) {
      if (parsed.maintenanceMode) parsed.maintenanceMode = false;
      if (parsed.data && parsed.data.maintenanceMode) parsed.data.maintenanceMode = false;
      if (parsed.spaces_hero_visible === false) parsed.spaces_hero_visible = true;
      if (parsed.spaces_grid_visible === false) parsed.spaces_grid_visible = true;
      if (Array.isArray(parsed.spaces_list)) {
        parsed.spaces_list.forEach((sp) => {
          if (sp.slug === 'master-bedroom' && (!sp.heroImage || sp.heroImage.includes('drive_24') || sp.heroImage.includes('master_bedroom_after'))) {
            sp.heroImage = '/images/spaces/bedroom/bedroom_drive_29.webp';
          }
          if (sp.slug === 'wardrobes' && (!sp.heroImage || sp.heroImage.includes('drive_25'))) {
            sp.heroImage = '/images/spaces/wardrobes/wardrobe_drive_23.webp';
          }
          if (sp.slug === 'foyer' && (!sp.heroImage || sp.heroImage.includes('drive_22'))) {
            sp.heroImage = '/images/spaces/foyer/foyer_drive_18.webp';
          }
        });
      }
      localStorage.setItem(settingsKey, JSON.stringify(parsed));
    }
  }
  localStorage.removeItem('espacio_cms_projects');
} catch {}

// Global Axios configuration

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';
axios.defaults.timeout = 2500;

// Request interceptor: ensure clean URLs (prevent /api/api/) and attach auth token
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('espacio_token') || 
                  localStorage.getItem('supabase_auth_token');
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch {}

  if (config.url && !config.url.startsWith('http')) {
    let cleanUrl = config.url.startsWith('/') ? config.url : `/${config.url}`;
    // If url starts with /api/ and baseURL is /api, strip redundant prefix so it doesn't become /api/api/
    if ((config.baseURL === '/api' || !config.baseURL) && cleanUrl.startsWith('/api/')) {
      cleanUrl = cleanUrl.substring(4);
    }
    config.url = cleanUrl;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return graceful fallback only for GET requests when completely offline
    if (error.config && error.config.method === 'get') {
      return Promise.resolve({
        data: { success: false, data: [], message: 'Offline fallback mode active' },
        status: 200,
        offlineFallback: true
      });
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
