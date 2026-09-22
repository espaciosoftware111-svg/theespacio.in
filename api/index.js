import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import { uploadToCloudinary } from '../server/utils/cloudinaryHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'nzK7g7iDlzlDC5qF2Y5tgcZZc/nQqBr8KoVZW9rXkI0E/rWH7OBBPTI7A1QEKUC5RicIx8/42dw+GUWedUfhgg==';
}

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from '../server/config/db.js';
import { errorHandler } from '../server/middleware/errorMiddleware.js';

// Routes
import authRoutes from '../server/routes/authRoutes.js';
import leadRoutes from '../server/routes/leadRoutes.js';
import projectRoutes from '../server/routes/projectRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import categoryRoutes from '../server/routes/categoryRoutes.js';
import testimonialRoutes from '../server/routes/testimonialRoutes.js';
import faqRoutes from '../server/routes/faqRoutes.js';
import settingsRoutes from '../server/routes/settingsRoutes.js';
import mediaRoutes from '../server/routes/mediaRoutes.js';
import dashboardRoutes from '../server/routes/dashboardRoutes.js';

// Connect to MongoDB (Vercel keeps connections warm between invocations)
connectDB();

const app = express();
app.set('trust proxy', 1);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS — allow the Vercel deployment domain + localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: true,
  credentials: true,
}));

// Request parsers with 50mb payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// URL normalizer: gracefully fix redundant /api/api/ paths
app.use((req, res, next) => {
  if (req.url.startsWith('/api/api/')) {
    req.url = req.url.replace('/api/api/', '/api/');
  }
  next();
});

// Serve uploaded images statically with aggressive 1-year browser caching
const uploadsDir = path.resolve(__dirname, '../client/public/uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
}
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '1y',
  immutable: true,
}));

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Shared upload handler for Gallery media
const uploadHandler = (req, res, next) => {
  console.log('[STAGE 5: UPLOAD_ENDPOINT_REACHED]', req.url);
  console.log('[STAGE 6: MULTER_STARTED]');
  upload.single('file')(req, res, async (multerErr) => {
    if (multerErr) {
      console.error('[BACKEND MULTER ERROR STAGE]', multerErr);
      return res.status(400).json({ success: false, error: multerErr.message || 'File upload parsing error' });
    }

    try {
      let fileName = req.body?.fileName || req.file?.originalname || 'uploaded_image.jpg';
      let base64 = req.body?.base64;

      if (!base64 && req.file && req.file.buffer) {
        const mime = req.file.mimetype || 'image/jpeg';
        base64 = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
      }

      console.log('[STAGE 7: FILE_RECEIVED]');
      console.log('[STAGE 8: FILE_NAME]', fileName);
      console.log('[STAGE 9: FILE_SIZE]', req.file ? req.file.size : 'base64 mode');
      console.log('[STAGE 10: FILE_MIMETYPE]', req.file ? req.file.mimetype : 'image');

      if (!base64) {
        console.error('[BACKEND ERROR STAGE: NO FILE DATA]');
        return res.status(400).json({ success: false, error: 'No file or image data received by server' });
      }

      const cloudRes = await uploadToCloudinary(base64, fileName);

      console.log('[STAGE 16: API_RESPONSE_SENT]', cloudRes.secure_url);
      return res.status(200).json({
        success: true,
        url: cloudRes.secure_url,
        imageUrl: cloudRes.secure_url,
        fileName: fileName,
        cloudinaryPublicId: cloudRes.public_id,
        cloudinaryAssetId: cloudRes.asset_id,
        storageProvider: 'cloudinary',
        resourceType: cloudRes.resource_type,
        format: cloudRes.format,
        width: cloudRes.width,
        height: cloudRes.height,
        fileSize: (cloudRes.bytes / 1024).toFixed(1) + ' KB',
        createdAt: cloudRes.created_at
      });
    } catch (uploadErr) {
      console.error('[BACKEND ERROR STAGE: CLOUDINARY UPLOAD FAILED]', uploadErr);
      return res.status(500).json({ success: false, error: uploadErr.message || 'Cloudinary upload error' });
    }
  });
};

app.post('/api/upload-media', uploadHandler);
app.post('/upload-media', uploadHandler);

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// Rate limiter for general API routes (relaxed in dev, exempting leads and health checks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 1000 : 50000,
  message: { success: false, message: 'Too many requests, try again in 15 minutes.' },
  skip: (req) => {
    return req.originalUrl?.includes('/leads') || req.path?.includes('/leads') || req.path?.includes('/health');
  }
});
app.use('/api/', limiter);

// In-memory cache for public read-heavy routes (projects, products, settings, faqs, testimonials)
const apiCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const cacheMiddleware = (req, res, next) => {
  // Invalidate cache immediately whenever admin updates content
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (apiCache.size > 0) {
      apiCache.clear();
      console.log(`[Cache Invalidation] Cleared cache on ${req.method} ${req.originalUrl}`);
    }
    return next();
  }

  // Only cache GET requests
  if (req.method !== 'GET') return next();

  const url = req.originalUrl || req.url;

  // Never cache leads, authentication, dashboard, or health checks
  if (url.includes('/leads') || url.includes('/auth') || url.includes('/dashboard') || url.includes('/health')) {
    return next();
  }

  // Only cache public content endpoints
  const isCacheable = ['/projects', '/products', '/categories', '/testimonials', '/faqs', '/settings', '/media'].some(route => url.includes(route));
  if (!isCacheable) return next();

  const cached = apiCache.get(url);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(cached.status).json(cached.body);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      apiCache.set(url, {
        body,
        status: res.statusCode,
        timestamp: Date.now()
      });
    }
    res.setHeader('X-Cache', 'MISS');
    return originalJson(body);
  };

  next();
};

app.use(cacheMiddleware);

// Endpoint to inspect or flush cache if ever needed
app.post('/api/cache/clear', (req, res) => {
  apiCache.clear();
  return res.json({ success: true, message: 'API in-memory cache cleared successfully' });
});

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/leads', leadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);
app.use('/api/products', productRoutes);
app.use('/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/faqs', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/media', mediaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/dashboard', dashboardRoutes);

// Serve user-uploaded bedroom image
const serveBedroomImage = (req, res) => {
  const imgPath = path.resolve(__dirname, '../client/public/images/user_uploaded_bedroom.jpg');
  if (fs.existsSync(imgPath)) {
    res.sendFile(imgPath);
  } else {
    res.status(404).send('Image not found');
  }
};
app.get('/api/user-uploaded-bedroom.jpg', serveBedroomImage);
app.get('/user-uploaded-bedroom.jpg', serveBedroomImage);

// Health check & Root Landing
app.get(['/', '/api'], (req, res) => {
  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ESPACIO API Server</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          body { background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px; max-width: 600px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
          .dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
          h1 { font-size: 26px; font-weight: 700; margin-bottom: 8px; color: #ffffff; }
          p { color: #94a3b8; font-size: 15px; margin-bottom: 24px; line-height: 1.5; }
          .links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
          .btn { display: block; text-decoration: none; padding: 12px 16px; background: #334155; color: #f1f5f9; border-radius: 10px; font-size: 14px; font-weight: 500; text-align: center; transition: all 0.2s ease; }
          .btn:hover { background: #3b82f6; color: #fff; transform: translateY(-1px); }
          .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 13px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> ESPACIO Backend Running</div>
          <h1>ESPACIO CMS & API Server</h1>
          <p>The backend server is active and serving endpoints. You can explore the REST APIs below or open the frontend client.</p>
          <div class="links">
            <a class="btn" href="/api/health" target="_blank">Health Check (/api/health)</a>
            <a class="btn" href="/api/projects" target="_blank">Projects (/api/projects)</a>
            <a class="btn" href="/api/products" target="_blank">Products (/api/products)</a>
            <a class="btn" href="/api/categories" target="_blank">Categories (/api/categories)</a>
            <a class="btn" href="/api/testimonials" target="_blank">Testimonials (/api/testimonials)</a>
            <a class="btn" href="/api/faqs" target="_blank">FAQs (/api/faqs)</a>
          </div>
          <div class="footer">ESPACIO Interiors Platform • Port 5000</div>
        </div>
      </body>
      </html>
    `);
  }
  res.json({ success: true, message: 'ESPACIO API Server is running', status: 'Healthy', timestamp: new Date() });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Healthy', timestamp: new Date() });
});

// Global error handler
app.use(errorHandler);

// Export for Vercel serverless
export default app;
