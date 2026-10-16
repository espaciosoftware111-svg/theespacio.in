import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─────────────────────────────────────────────────────────────────────────────
// ESPACIO Production Vite Config — Performance-Optimized Build Pipeline
// Target: PageSpeed 90+ | LCP < 2.5s | TBT < 200ms
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  plugins: [
    react({
      // PERF: Babel Fast Refresh — faster HMR for development
      fastRefresh: true,
    }),
  ],

  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
    // PERF: Enable CSS dev sourcemaps only in dev; production uses minified CSS
    devSourcemap: true,
  },

  server: {
    port: 5174,
    strictPort: false,
    watch: {
      ignored: ['**/public/videos/**', '**/*.mp4', '**/*.webm', '**/uploads/**'],
    },
    // PERF: Pre-warm heavy dependency transforms on server start to reduce first-request latency
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/pages/Home.jsx',
        './src/components/layout/Navbar.jsx',
      ]
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          // PERF: Gracefully swallow backend connection errors in dev
          // instead of crashing the Vite HMR WebSocket
          proxy.on('error', (err, req, res) => {
            console.warn('Vite backend proxy notice (offline mode):', err.message);
            if (res && !res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, count: 0, data: [], offline: true }));
            }
          });
        }
      },
      '/images': {
        target: 'https://theespacio-in.vercel.app',
        changeOrigin: true,
        secure: false,
        bypass: (req, res) => {
          const cleanPath = (req.url || '').split('?')[0].replace(/^\/+/, '');
          const localPath = path.resolve(__dirname, 'public', cleanPath);
          if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
            return req.url;
          }
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // PERF: Pin exact React paths to prevent duplicate React instances
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },

  optimizeDeps: {
    // PERF: Exclude gesture library from pre-bundling (it self-optimizes)
    exclude: ['@use-gesture/react'],
    // PERF: Force-include heavy deps so they are pre-bundled once, not re-bundled per request
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      'lenis',
    ],
  },

  preview: {
    port: 5174,
    strictPort: false,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    }
  },

  build: {
    // PERF: ES2022 target eliminates legacy transforms → smaller output, faster parse
    target: 'es2022',

    // PERF: Minify CSS output for production
    cssMinify: true,

    // PERF: Split CSS per-page chunk so unused styles are never loaded
    cssCodeSplit: true,

    // PERF: Suppress false-positive warnings for intentionally large vendor bundles
    chunkSizeWarningLimit: 1000,

    // PERF: Drop console.log and debugger in production builds to unblock UI thread
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.debug'],
      legalComments: 'none',
    },

    rollupOptions: {
      output: {
        // PERF: Content-hash filenames ensure 1-year immutable caching never serves stale assets
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        manualChunks(id) {
          // PERF: Normalize Windows path separators for consistent chunking
          const nid = id.replace(/\\/g, '/');

          // CHUNK: CMS data store & catalogs (isolated so initial index bundle is featherlight)
          if (!id.includes('node_modules')) {
            if (nid.includes('/src/utils/cmsStore') || nid.includes('/src/data/spacesCatalog')) {
              return 'store-cms';
            }
            return;
          }

          // CHUNK: Core React runtime — cached across all page navigations
          if (
            nid.includes('/react/') ||
            nid.includes('/react-dom/') ||
            nid.includes('/react-router-dom/') ||
            nid.includes('/react-helmet-async/')
          ) {
            return 'vendor-react';
          }

          // CHUNK: Animation libraries (Framer Motion, Lenis, GSAP)
          if (
            nid.includes('/framer-motion/') ||
            nid.includes('/lenis/') ||
            nid.includes('/gsap/')
          ) {
            return 'vendor-motion';
          }

          // CHUNK: Icon library — tree-shaken separately
          if (nid.includes('/lucide-react/')) {
            return 'vendor-icons';
          }

          // CHUNK: Supabase SDK — isolated completely so public visits never load it
          if (nid.includes('/@supabase/')) {
            return 'vendor-supabase';
          }

          // CHUNK: Firebase SDK — isolated completely for non-blocking submissions
          if (nid.includes('/firebase/') || nid.includes('/@firebase/')) {
            return 'vendor-firebase';
          }

          // CHUNK: Form libraries & schema validation (Zod, React Hook Form)
          if (
            nid.includes('/react-hook-form/') ||
            nid.includes('/@hookform/') ||
            nid.includes('/zod/')
          ) {
            return 'vendor-forms';
          }

          // CHUNK: Data fetching utilities
          if (nid.includes('/axios/') || nid.includes('/@tanstack/react-query/')) {
            return 'vendor-query';
          }

          // CHUNK: Remaining third-party utilities
          return 'vendor';
        }
      }
    }
  }
})
