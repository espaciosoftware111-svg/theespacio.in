import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import GooeyInput from '../components/ui/gooey-input';
import { getCMSData, STORAGE_KEYS, DEFAULT_PRODUCTS } from '../utils/cmsStore';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Canonical 9 Material Catalogs — Matching user curated material library screenshots
export const CANONICAL_MATERIALS = [
  {
    order: 1,
    title: 'Acrylic Luxe Collection',
    slug: 'acrylic-luxe-collection',
    category: 'Acrylic & Finishes',
    badge: 'ACRYLIC & FINISHES',
    materialCode: 'MAT-ACR-01',
    description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
    heroImage: '/images/materials/fluted_acrylic_azzurro.webp',
  },
  {
    order: 2,
    title: 'Digital Korean Poly Granite',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    badge: 'NATURAL STONE',
    materialCode: 'MAT-GNT-02',
    description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
    heroImage: '/images/materials/fluted_acrylic_gracia.jpg',
  },
  {
    order: 3,
    title: 'Charcoal Panels Luxe Collection',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    badge: 'ACOUSTIC PANELS',
    materialCode: 'MAT-CHR-03',
    description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
    heroImage: '/images/materials/charcoal_luxe_4018_4017_4016.webp',
  },
  {
    order: 4,
    title: 'Fluted PVC Luxe Collection',
    slug: 'fluted-pvc-luxe',
    category: 'Architectural Panels',
    badge: 'ARCHITECTURAL PANELS',
    materialCode: 'MAT-PVC-04',
    description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
    heroImage: '/images/materials/irish.webp',
  },
  {
    order: 5,
    title: 'LVT Luxe Flooring',
    slug: 'lvt-luxe-flooring',
    category: 'Wood & Flooring',
    badge: 'WOOD & FLOORING',
    materialCode: 'MAT-FLR-05',
    description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
    heroImage: '/images/materials/fluted_acrylic_giallo_dining.jpg',
  },
  {
    order: 6,
    title: 'Fluted Acrylic Luxe Collection',
    slug: 'fluted-acrylic-luxe',
    category: 'Acrylic & Finishes',
    badge: 'ACRYLIC & FINISHES',
    materialCode: 'MAT-ACR-06',
    description: 'Dynamic fluted acrylic panels creating sophisticated shadow play for luxury interiors.',
    heroImage: '/images/materials/fluted_acrylic_florida.jpg',
  },
  {
    order: 7,
    title: 'PVC Luxe Collection',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    badge: 'ARCHITECTURAL PANELS',
    materialCode: 'MAT-PVC-07',
    description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
    heroImage: '/images/materials/pvc_luxe_5003_5004.webp',
  },
  {
    order: 8,
    title: 'WPC Luxe Collection',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    badge: 'COMPOSITE PANELS',
    materialCode: 'MAT-WPC-08',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
    heroImage: '/images/materials/wpc_luxe_1701_1606.webp',
  },
  {
    order: 9,
    title: 'Espacio Charcoal Panels Luxe Collection (1)',
    slug: 'charcoal-panels-luxe-1',
    category: 'Acoustic Panels',
    badge: 'ACOUSTIC PANELS',
    materialCode: 'MAT-CHR-09',
    description: 'Additional selection of richly textured wall panels infused with active charcoal.',
    heroImage: '/images/materials/charcoal_luxe_1_6015.webp',
  }
];

const Products = () => {
  const [products, setProducts] = useState(() => {
    const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
    return Array.isArray(stored) && stored.length > 0 ? stored : CANONICAL_MATERIALS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [cmsSettings, setCmsSettings] = useState(() => getCMSData(STORAGE_KEYS.SETTINGS) || {});
  const videoRef = useRef(null);
  const heroVideoUrl = cmsSettings.materials_hero_video || 'https://res.cloudinary.com/r3jwfy0y/video/upload/v1790935342/thronetegelslaminaat_pindown.io_1790935254.mp4';

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [heroVideoUrl]);

  useEffect(() => {
    const syncCMS = async () => {
      const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
      const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCmsSettings(settings);
      const hasStored = Array.isArray(stored) && stored.length > 0;
      if (hasStored) {
        setProducts(stored);
      }
      try {
        if (!hasStored) setLoading(true);
        const response = await axios.get('/products', { timeout: 2000 });
        if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setProducts(response.data.data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    syncCMS();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, []);

  // Merge live CMS or API edits if available, but strictly preserve the 9 curated materials
  const sourceData = useMemo(() => {
    const liveList = Array.isArray(products) && products.length > 0 ? products : [];
    return CANONICAL_MATERIALS.map((canon) => {
      const match = liveList.find(
        (p) => p && (p.slug === canon.slug || p.title === canon.title)
      );
      if (!match) return canon;
      return {
        ...canon,
        title: match.title || canon.title,
        description: match.description || canon.description,
        heroImage: match.heroImage || canon.heroImage,
        category: match.category || canon.category,
        badge: match.badge || canon.badge,
        materialCode: match.materialCode || canon.materialCode,
      };
    });
  }, [products]);

  const query = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    return query
      ? sourceData.filter((p) => {
          const titleMatch = (p.title || '').toLowerCase().includes(query);
          const descMatch = (p.description || '').toLowerCase().includes(query);
          const catMatch = (p.category || '').toLowerCase().includes(query);
          const codeMatch = (p.materialCode || '').toLowerCase().includes(query);
          const badgeMatch = (p.badge || '').toLowerCase().includes(query);
          return titleMatch || descMatch || catMatch || codeMatch || badgeMatch;
        })
      : sourceData;
  }, [sourceData, query]);

  const handleEnquire = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('open-quote-modal', {
        detail: {
          mode: 'catalogue',
          productName: `${product.title} (${product.materialCode || ''})`,
          title: `Request Sample: ${product.title}`
        }
      })
    );
  };

  return (
    <div className="bg-bg min-h-screen pb-24">
      <SEO
        title="Premium Material Library — WPC, Fluted, Acrylic Panels"
        description="Explore ESPACIO's curated 9 material catalog collections. WPC wall panels, fluted panels, polygranite, acrylic sheets, and charcoal panels. Request samples and explore all finishes."
        url="/materials"
      />

      {/* Hero Landing Section: Full-Width Autoplay Cinematic Video (Muted, Without Audio) */}
      <section className="relative h-[86dvh] sm:h-[88vh] lg:h-[95vh] min-h-[540px] sm:min-h-[640px] px-0 sm:px-6 pt-0 sm:pt-2.5 lg:pt-3 pb-0 sm:pb-3 lg:px-12 z-0">
        <div className="relative w-full h-full overflow-hidden rounded-none sm:rounded-[24px] lg:rounded-[40px] bg-[#1a1a1a] border-b sm:border border-black/10 shadow-md">
          <video
            ref={videoRef}
            src={heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover select-none"
          />

          {/* Subtle Ambient Vignette & Gradient for Smooth Bottom Transition */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 35%, transparent 70%)'
            }}
          />

          {/* Scroll Down Indicator */}
          <ScrollDownIndicator light={false} />
        </div>
      </section>

      {/* Curated Material Library Section Header (Matching Screenshot) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 sm:pt-16 pb-8 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-ink">
            {cmsSettings.materials_title || 'Curated Material Library'}
          </h2>
        </div>

        {/* Live Search Bar */}
        <div className="w-full sm:w-auto min-w-[260px] max-w-sm">
          <GooeyInput
            placeholder="Search WPC, Acrylic, Fluted, Charcoal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* The 9 Material Catalog Cards Grid (4 Columns matching screenshot) */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#FAF7F2] animate-pulse rounded-[24px] border border-[#E8E2D8]" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => (
              <Link
                key={product.slug || idx}
                to={`/materials/${product.slug}`}
                className="group relative block rounded-[24px] bg-[#FAF7F2] p-3.5 border border-[#E8E2D8] hover:border-gold/70 shadow-sm hover:shadow-xl transition-all duration-300 ease-out flex flex-col justify-between transform-gpu hover:scale-[1.015] backface-hidden"
              >
                {/* Image Media Frame with rounded corners */}
                <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#ECE6DC] transform-gpu">
                  <img
                    src={getOptimizedImageUrl(product.heroImage, 800, 90)}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
                  />

                  {/* Category Badge Pill on Top-Left (Gold Luxury Pill) */}
                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-3 py-1 rounded-full bg-gold text-charcoal backdrop-blur-md text-[9px] font-sans font-bold uppercase tracking-wider border border-gold/40 shadow-xs">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="pt-3.5 pb-1 px-1 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-display text-[17px] font-bold text-ink leading-snug group-hover:text-gold transition-colors duration-200">
                      {product.title}
                    </h3>
                    <p className="font-sans text-[11.5px] text-ink-soft leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
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
