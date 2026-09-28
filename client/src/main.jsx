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
      localStorage.setItem(settingsKey, JSON.stringify(parsed));
    }
  }
  localStorage.removeItem('espacio_cms_projects');
} catch {}

// Global Axios configuration

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';

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
