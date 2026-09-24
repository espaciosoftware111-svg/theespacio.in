import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ArrowRight, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import SEO from '../components/common/SEO';
import DomeGallery from '../components/ui/DomeGallery';
import GooeyInput from '../components/ui/gooey-input';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getCMSData, STORAGE_KEYS, DEFAULT_PRODUCTS } from '../utils/cmsStore';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const Products = () => {
  const mockProducts = DEFAULT_PRODUCTS;

  const [products, setProducts] = useState(() => {
    const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
    return (Array.isArray(stored) && stored.length > 0) ? stored : DEFAULT_PRODUCTS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [cmsSettings, setCmsSettings] = useState(() => getCMSData(STORAGE_KEYS.SETTINGS) || {});

  useEffect(() => {
    const syncCMS = async () => {
      const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
      const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCmsSettings(settings);
      if (Array.isArray(stored) && stored.length > 0) {
        setProducts(stored);
      }
      try {
        const response = await axios.get('/products');
        if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setProducts(response.data.data);
          setCMSData(STORAGE_KEYS.PRODUCTS, response.data.data, { silent: true });
        }
      } catch {}
    };

    syncCMS();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, []);

  const sourceData = (products.length > 0 ? products : mockProducts).filter(
    (p) => p.slug !== 'espacio-master-catalogue' && p.showInCard !== false
  );

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = query
    ? sourceData.filter((p) => {
        const titleMatch = (p.title || '').toLowerCase().includes(query);
        const descMatch = (p.description || '').toLowerCase().includes(query);
        const catMatch = (p.category || '').toLowerCase().includes(query);
        const codeMatch = (p.materialCode || '').toLowerCase().includes(query);
        const featMatch = Array.isArray(p.features) && p.features.some(f => (f || '').toLowerCase().includes(query));
        return titleMatch || descMatch || catMatch || codeMatch || featMatch;
      })
    : sourceData;

  const fallbacks = [
    '/images/materials/irish.png',
    '/images/materials/azzurro.png',
    '/images/materials/giallo.png',
    '/images/materials/marbo.png',
    '/images/materials/florida.png',
    '/images/materials/menta.png',
    '/images/materials/giallo_dining.png',
    '/images/materials/ash.png',
    '/images/materials/linia.png',
    '/images/materials/florida_vanity.png',
    '/images/materials/gracia.png',
    '/images/materials/irish_gen2.png',
    '/images/materials/blanco.png',
    '/images/materials/formic.png',
    '/images/materials/ash_gen2.png'
  ];

  const domeImages = useMemo(() => {
    const seen = new Set();
    const uniqueImages = [];
    sourceData.forEach((p, idx) => {
      const src = p.heroImage || fallbacks[idx % fallbacks.length];
      if (src && !seen.has(src)) {
        seen.add(src);
        uniqueImages.push({ 
          src: getOptimizedImageUrl(src, 1600, 95), 
          alt: p.title 
        });
      }
    });
    return uniqueImages;
  }, [sourceData]);

  return (
    <div className="bg-bg min-h-screen pb-24">
      <SEO title="Premium Material Library — WPC, Fluted, Acrylic Panels" description="Explore ESPACIO's curated material library. WPC wall panels, fluted panels, polygranite, acrylic sheets, mosaic tiles and more. Request samples and catalogue." url="/materials" />
      
      {/* Hero with Dome Gallery — full height hero matching site hero ratios */}
      <section className="relative h-[85dvh] sm:h-[77vh] lg:h-[96vh] min-h-[320px] sm:min-h-[480px] lg:min-h-0 px-0 sm:px-6 pt-0 sm:pt-2.5 lg:pt-3 pb-0 sm:pb-3 lg:px-12 z-0">
        {/* Gallery frame: 100% full screen edge-to-edge on mobile, rounded framed on tablet/desktop */}
        <div className="relative w-full h-full overflow-hidden rounded-none sm:rounded-[24px] lg:rounded-[40px] bg-[#EAE4D8] border-b sm:border border-black/10 shadow-sm">
          {/* Dome Gallery Container */}
          <div className="absolute inset-0 w-full h-full z-0">
            <DomeGallery 
              images={domeImages}
              fit={
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 0.88        // mobile: globe fills 88% of min dimension
                  : window.innerWidth < 1024
                  ? 0.90        // tablet: 90%
                  : 0.92        // desktop: 92% — large immersive sphere
              }
              fitBasis="height"
              minRadius={
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 320
                  : window.innerWidth < 1024
                  ? 520
                  : 820
              }
              segments={
                typeof window !== 'undefined' && window.innerWidth < 640
                  ? 22
                  : window.innerWidth < 1024
                  ? 28
                  : 36
              }
              overlayBlurColor="#EAE4D8"
              grayscale={false}
              autoRotate={true}
              autoRotateSpeed={0.08}
              openedImageWidth={
                typeof window !== 'undefined' && window.innerWidth < 640 ? '240px' : '320px'
              }
              openedImageHeight={
                typeof window !== 'undefined' && window.innerWidth < 640 ? '300px' : '400px'
              }
              imageBorderRadius="14px"
              openedImageBorderRadius="22px"
            />
          </div>

          {/* Scroll Down Indicator */}
          <ScrollDownIndicator light={true} className="scale-90 sm:scale-100 bottom-2 sm:bottom-4" />
        </div>
      </section>

      {/* Category Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6 sm:pt-14 pb-5 sm:pb-8 flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-1 sm:space-y-2">
          <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">
            {cmsSettings.materials_badge || 'Premium Collection'}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            {cmsSettings.materials_title || 'Curated Material Library'}
          </h2>
        </div>
      </div>

      {/* Material Cards Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map((n) => <div key={n} className="aspect-[3/4] bg-bg-card animate-pulse rounded-[24px]" />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <Link key={product.slug || idx} to={`/materials/${product.slug}`}
                className="group block rounded-[24px] overflow-hidden bg-bg-card border border-ink-border/30 hover:border-gold/50 hover:-translate-y-2 transition-all duration-400 shadow-sm hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-bg-dark">
                  <img src={getOptimizedImageUrl(product.heroImage || fallbacks[idx % fallbacks.length], 1200, 92)} alt={product.title}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {product.category && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[9.5px] font-sans font-semibold uppercase tracking-wider text-white border border-white/15">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg font-bold text-ink group-hover:text-gold transition-colors">{product.title}</h3>
                  <p className="font-sans text-xs text-ink-soft leading-relaxed line-clamp-2">{product.description}</p>
                  <div className="pt-2 flex items-center space-x-1.5 text-[10.5px] text-gold uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{product.ctaText || 'Explore Material'}</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-5 bg-bg-card rounded-[24px] border border-ink-border/30 p-8 max-w-[540px] mx-auto">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto border border-gold/30">
              <Search size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink">No Materials Found</h3>
            <p className="font-sans text-xs text-ink-soft leading-relaxed">
              No materials match "{searchQuery}". Try searching another keyword like WPC, Polygranite, Acrylic, or Fluted.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold hover:bg-ink hover:text-white transition-all shadow-md cursor-pointer"
              >
                Clear Search & Browse All
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Products;
