import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

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
      }
    }
  },

  resolve: {
    alias: {
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

    rollupOptions: {
      output: {
        // PERF: Content-hash filenames ensure 1-year immutable caching never serves stale assets
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',

        manualChunks(id) {
          // ── VENDOR CHUNK STRATEGY ─────────────────────────────────────────
          // Separate vendor code from app code so app updates don't bust cached vendors

          if (!id.includes('node_modules')) return; // App code stays in main chunk

          // CHUNK: Core React runtime — cached across all page navigations
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/') ||
            id.includes('/react-helmet-async/')
          ) {
            return 'vendor-react';
          }

          // CHUNK: Animation libraries — loaded together, deferred when possible
          if (id.includes('/framer-motion/') || id.includes('/lenis/')) {
            return 'vendor-motion';
          }

          // CHUNK: Icon library — tree-shaken separately for optimal splitting
          if (id.includes('/lucide-react/')) {
            return 'vendor-icons';
          }

          // CHUNK: Firebase SDK — huge, only needed for admin auth, defer aggressively
          if (id.includes('/firebase/')) {
            return 'vendor-firebase';
          }

          // CHUNK: Data fetching utilities — small, but separate from UI for clarity
          if (id.includes('/axios/') || id.includes('/@tanstack/react-query/')) {
            return 'vendor-query';
          }

          // CHUNK: Catch-all vendor chunk for remaining third-party code
          return 'vendor';
        }
      }
    }
  }
})
