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

  useEffect(() => {
    const syncCMS = async () => {
      const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
      if (Array.isArray(stored) && stored.length > 0) {
        setProducts(stored);
      }
      try {
        const response = await axios.get('/products');
        if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setProducts(response.data.data);
          setCMSData(STORAGE_KEYS.PRODUCTS, response.data.data);
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
        uniqueImages.push({ src, alt: p.title });
      }
    });
    return uniqueImages;
  }, [sourceData]);

  return (
    <div className="bg-bg min-h-screen pb-24">
      <SEO title="Premium Material Library — WPC, Fluted, Acrylic Panels" description="Explore ESPACIO's curated material library. WPC wall panels, fluted panels, polygranite, acrylic sheets, mosaic tiles and more. Request samples and catalogue." url="/materials" />
      
      {/* Hero with Dome Gallery — matches Home & Services rounded framed card */}
      <section className="relative h-[64vh] sm:h-[80vh] lg:h-[98vh] min-h-[400px] sm:min-h-[520px] lg:min-h-0 px-3 sm:px-6 pt-2 sm:pt-2.5 lg:pt-3 pb-2 sm:pb-3 lg:px-10 z-0">
        {/* Rounded dark card */}
        <div className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] bg-[#120F17] shadow-2xl">
          {/* Dome Gallery Container */}
          <div className="absolute inset-0 w-full h-full z-0">
            <DomeGallery 
              images={domeImages}
              fit={0.65}
              minRadius={700}
              fitBasis="auto"
              overlayBlurColor="#120F17"
              grayscale={false}
              autoRotate={true}
              autoRotateSpeed={0.08}
              openedImageWidth="240px"
              openedImageHeight="320px"
              imageBorderRadius="14px"
              openedImageBorderRadius="20px"
            />
          </div>

          {/* Bottom vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent pointer-events-none z-10" />

          {/* Scroll Down Indicator */}
          <ScrollDownIndicator />
        </div>
      </section>

      {/* Category Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 sm:pt-14 pb-6 sm:pb-8 flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-1.5 sm:space-y-2">
          <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Premium Collection</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">Browse Materials</h2>
        </div>
      </div>

      {/* Material Cards Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map((n) => <div key={n} className="aspect-[3/4] bg-offwhite animate-pulse rounded-card" />)}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <Link key={product.slug || idx} to={`/materials/${product.slug}`}
                className="group block rounded-card overflow-hidden bg-offwhite border border-walnut/5 hover:-translate-y-2 transition-all duration-400 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={getOptimizedImageUrl(product.heroImage || fallbacks[idx % fallbacks.length], 600, 70)} alt={product.title}
                    loading="lazy" decoding="async"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-display text-lg font-bold text-charcoal group-hover:text-gold transition-colors">{product.title}</h3>
                  <p className="font-sans text-xs text-walnut leading-relaxed line-clamp-2">{product.description}</p>
                  <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-gold uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{product.ctaText || 'Explore Material'}</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-5 bg-bg-card rounded-card border border-ink-border p-8 max-w-[540px] mx-auto">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto border border-gold/30">
              <Search size={22} />
            </div>
            <h3 className="font-display text-xl font-bold text-charcoal">No Materials Found</h3>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              No materials match "{searchQuery}". Try searching another keyword like WPC, Polygranite, Acrylic, or Fluted.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 rounded-full bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold hover:bg-charcoal hover:text-cream transition-all shadow-md cursor-pointer"
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
