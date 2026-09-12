import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import Lenis from 'lenis';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import IntroPreloader from './components/common/IntroPreloader';

// Lazy-loaded Home for instant app shell & preloader startup
const Home = React.lazy(() => import('./pages/Home'));

// Dynamic imports for modals to isolate initial bundle
const QuoteModal = React.lazy(() => import('./components/common/QuoteModal'));
const PrivacyModal = React.lazy(() => import('./components/common/PrivacyModal'));
const TermsModal = React.lazy(() => import('./components/common/TermsModal'));

// Public Pages (Lazy-loaded for code-splitting & optimal performance)
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const WhatWeDo = React.lazy(() => import('./pages/WhatWeDo'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Lazy-loaded Admin Components for Bundle & Performance Isolation
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDashboardHome = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboardHome })));
const AdminHomeHeroCMS = React.lazy(() => import('./pages/admin/AdminHomeHeroCMS'));
const AdminServicesCMS = React.lazy(() => import('./pages/admin/AdminServicesCMS'));
const AdminSpacesCMS = React.lazy(() => import('./pages/admin/AdminSpacesCMS'));
const AdminMaterialsCMS = React.lazy(() => import('./pages/admin/AdminMaterialsCMS'));
const AdminAboutCMS = React.lazy(() => import('./pages/admin/AdminAboutCMS'));
const AdminFAQCMS = React.lazy(() => import('./pages/admin/AdminFAQCMS'));
const AdminContactCMS = React.lazy(() => import('./pages/admin/AdminContactCMS'));
const AdminTestimonialsCMS = React.lazy(() => import('./pages/admin/AdminTestimonialsCMS'));
const AdminPagesCMS = React.lazy(() => import('./pages/admin/AdminPagesCMS'));
const AdminFooterCMS = React.lazy(() => import('./pages/admin/AdminFooterCMS'));
const AdminEnquiries = React.lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminMaterialsCMS'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminAuditLogs = React.lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminMedia = React.lazy(() => import('./pages/admin/AdminCMS').then(m => ({ default: m.AdminMedia })));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminCMS').then(m => ({ default: m.AdminSettings })));

const PublicLoaderFallback = () => (
  <div className="fixed inset-0 bg-[#0a0b0d] z-[99999]" />
);

const AdminLoaderFallback = () => (
  <div className="min-h-screen bg-[#0E0F11] flex items-center justify-center">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <span className="font-sans text-xs text-white/50 uppercase tracking-widest">Loading Admin Portal...</span>
    </div>
  </div>
);
// Manual scroll restoration to prevent browser from restoring scrolled positions on navigation
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

// ── Scroll to top on every route change ─────────────────────────────────────
const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    // 1. Immediately reset Lenis virtual scroll
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    // 2. Immediate window and document scroll reset
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 3. Staggered microtask resets to catch React suspense and lazy chunk renders
    const t0 = requestAnimationFrame(() => {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    const t1 = setTimeout(() => {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 20);

    const t2 = setTimeout(() => {
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    return () => {
      cancelAnimationFrame(t0);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search]);
  return null;
};

// Floating CTA Triggers: Mobile Right-Edge Vertical "GET FREE ESTIMATE" Tab
const FloatingLogo = () => {
  const location = useLocation();
  const [hiddenByEvent, setHiddenByEvent] = React.useState(false);

  React.useEffect(() => {
    const hide = () => setHiddenByEvent(true);
    const show = () => setHiddenByEvent(false);
    window.addEventListener('hide-floating-estimate', hide);
    window.addEventListener('show-floating-estimate', show);
    return () => {
      window.removeEventListener('hide-floating-estimate', hide);
      window.removeEventListener('show-floating-estimate', show);
    };
  }, []);

  const isContactSuccess = (location.pathname === '/contact' && location.search.includes('success=true')) || hiddenByEvent;
  if (isContactSuccess) {
    return null;
  }

  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent('open-quote-modal'));
  };

  return (
    /* Fixed Vertical "GET ESTIMATE" Tab on Right Edge for Mobile & Desktop */
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] pointer-events-auto">
      <motion.button
        onClick={handleOpenModal}
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-black/50 hover:bg-black/75 active:bg-black/85 backdrop-blur-md border-l border-t border-b border-white/25 hover:border-gold/60 text-white rounded-l-lg md:rounded-l-xl py-2.5 px-1.5 md:py-3.5 md:px-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_14px_rgba(201,169,110,0.3)] hover:shadow-[0_0_22px_rgba(201,169,110,0.65)] transition-all duration-300 select-none group outline-none"
        aria-label="Get Estimate"
      >
        <span 
          className="font-sans text-[8px] md:text-[10px] font-medium tracking-[0.2em] text-white/95 uppercase whitespace-nowrap drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] group-hover:text-gold transition-colors duration-300"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Get Estimate
        </span>
        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gold animate-pulse shadow-[0_0_8px_rgba(201,169,110,1)] mt-0.5" />
      </motion.button>
    </div>
  );
};

import MaintenanceMode from './components/common/MaintenanceMode';
import { getCMSData, STORAGE_KEYS } from './utils/cmsStore';

// Shared Layout Wrapper with Page Transitions
const MainLayout = () => {
  const location = useLocation();
  const isContactSuccess = location.pathname === '/contact' && location.search.includes('success=true');
  const [settings, setSettings] = React.useState(() => getCMSData(STORAGE_KEYS.SETTINGS) || {});

  React.useEffect(() => {
    const syncSettings = () => {
      const s = getCMSData(STORAGE_KEYS.SETTINGS);
      if (s) setSettings(s);
    };
    syncSettings();
    window.addEventListener('espacio_cms_update', syncSettings);
    window.addEventListener('storage', syncSettings);
    return () => {
      window.removeEventListener('espacio_cms_update', syncSettings);
      window.removeEventListener('storage', syncSettings);
    };
  }, []);

  if (settings?.maintenanceMode) {
    return <MaintenanceMode settings={settings} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <IntroPreloader />
      <Navbar />
      <main className="flex-grow">
        <React.Suspense fallback={<PublicLoaderFallback />}>
          <Outlet />
        </React.Suspense>
      </main>
      {!isContactSuccess && <Footer />}
      <React.Suspense fallback={null}>
        <QuoteModal />
        <PrivacyModal />
        <TermsModal />
      </React.Suspense>
      {!isContactSuccess && <FloatingLogo />}
    </div>
  );
};

function App() {
  useEffect(() => {
    // Use native compositor scrolling on pure touch mobile devices; desktop gets Lenis 60fps smooth scroll
    const isMobileTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse) and (hover: none)').matches;
    if (isMobileTouch) return;

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* ── Public Routes (Instant Dark Load & Preloader) ────────────────── */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetails />} />
              <Route path="/spaces" element={<WhatWeDo />} />
              <Route path="/spaces/:slug" element={<WhatWeDo />} />
              {/* Backwards-compatibility redirects */}
              <Route path="/what-we-do" element={<Navigate to="/spaces" replace />} />
              <Route path="/what-we-do/:slug" element={<Navigate to="/spaces" replace />} />
              <Route path="/materials" element={<Products />} />
              <Route path="/materials/:slug" element={<ProductDetails />} />
              <Route path="/products" element={<Navigate to="/materials" replace />} />
              <Route path="/products/:slug" element={<Navigate to="/materials" replace />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Admin Routes (Isolated Admin Portal Suspense) ───────────────── */}
            <Route path="/espesp/admin/*" element={
              <React.Suspense fallback={<AdminLoaderFallback />}>
                <Routes>
                  <Route path="" element={<AdminLogin />} />
                  <Route path="dashboard" element={<AdminLayout><AdminDashboardHome /></AdminLayout>} />
                  <Route path="hero" element={<AdminLayout><AdminHomeHeroCMS /></AdminLayout>} />
                  <Route path="services" element={<AdminLayout><AdminServicesCMS /></AdminLayout>} />
                  <Route path="spaces" element={<AdminLayout><AdminSpacesCMS /></AdminLayout>} />
                  <Route path="materials" element={<AdminLayout><AdminMaterialsCMS /></AdminLayout>} />
                  <Route path="about" element={<AdminLayout><AdminAboutCMS /></AdminLayout>} />
                  <Route path="faqs" element={<AdminLayout><AdminFAQCMS /></AdminLayout>} />
                  <Route path="contact" element={<AdminLayout><AdminContactCMS /></AdminLayout>} />
                  <Route path="testimonials" element={<AdminLayout><AdminTestimonialsCMS /></AdminLayout>} />
                  <Route path="pages" element={<AdminLayout><AdminPagesCMS /></AdminLayout>} />
                  <Route path="footer" element={<AdminLayout><AdminFooterCMS /></AdminLayout>} />
                  <Route path="enquiries" element={<AdminLayout><AdminEnquiries /></AdminLayout>} />
                  <Route path="projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
                  <Route path="products" element={<AdminLayout><AdminMaterialsCMS /></AdminLayout>} />
                  <Route path="users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
                  <Route path="audit" element={<AdminLayout><AdminAuditLogs /></AdminLayout>} />
                  <Route path="gallery" element={<AdminLayout><AdminMedia /></AdminLayout>} />
                  <Route path="settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
                </Routes>
              </React.Suspense>
            } />
            <Route path="/espesp/admin" element={
              <React.Suspense fallback={<AdminLoaderFallback />}>
                <AdminLogin />
              </React.Suspense>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

const NotFound = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center text-center px-6 space-y-5">
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-gold font-bold mb-4">404</p>
      <h1 className="font-editorial text-5xl font-bold text-charcoal mb-4">Page Not Found</h1>
      <p className="font-sans text-sm text-walnut mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="inline-flex items-center space-x-2 bg-charcoal text-cream font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button hover:bg-gold hover:text-charcoal transition-all duration-300">
        Back to Home
      </a>
    </div>
  </div>
);

export default App;
