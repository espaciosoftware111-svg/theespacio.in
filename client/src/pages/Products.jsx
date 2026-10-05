import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ArrowRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
    heroImage: '/images/materials/acrylic_thumb.webp',
    heroImageFallback: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png',
  },
  {
    order: 2,
    title: 'Digital Korean Poly Granite',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    badge: 'NATURAL STONE',
    materialCode: 'MAT-GNT-02',
    description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
    heroImage: '/images/materials/polygranite_thumb.webp',
    heroImageFallback: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png',
  },
  {
    order: 3,
    title: 'Charcoal Panels Luxe Collection',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    badge: 'ACOUSTIC PANELS',
    materialCode: 'MAT-CHR-03',
    description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/charcoal_qpelt9.png',
  },

  {
    order: 4,
    title: 'Fluted PVC Luxe Collection',
    slug: 'fluted-pvc-luxe',
    category: 'Architectural Panels',
    badge: 'ARCHITECTURAL PANELS',
    materialCode: 'MAT-PVC-04',
    description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_fluted_1_o1ixyc.png',
  },
  {
    order: 5,
    title: 'LVT Luxe Flooring',
    slug: 'lvt-luxe-flooring',
    category: 'Wood & Flooring',
    badge: 'WOOD & FLOORING',
    materialCode: 'MAT-FLR-05',
    description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196087/lvt_io0all.png',
  },
  {
    order: 6,
    title: 'Fluted Acrylic Luxe Collection',
    slug: 'fluted-acrylic-luxe',
    category: 'Acrylic & Finishes',
    badge: 'ACRYLIC & FINISHES',
    materialCode: 'MAT-ACR-06',
    description: 'Dynamic fluted acrylic panels creating sophisticated shadow play for luxury interiors.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/fluted_acrylic_gmwqr4.png',
  },
  {
    order: 7,
    title: 'PVC Luxe Collection',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    badge: 'ARCHITECTURAL PANELS',
    materialCode: 'MAT-PVC-07',
    description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_1_qoe62b.png',
  },
  {
    order: 8,
    title: 'WPC Luxe Collection',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    badge: 'COMPOSITE PANELS',
    materialCode: 'MAT-WPC-08',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791195586/wpc_irucfj.png',
  },
  {
    order: 9,
    title: 'Espacio Charcoal Panels Luxe Collection (1)',
    slug: 'charcoal-panels-luxe-1',
    category: 'Acoustic Panels',
    badge: 'ACOUSTIC PANELS',
    materialCode: 'MAT-CHR-09',
    description: 'Additional selection of richly textured wall panels infused with active charcoal.',
    heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791205613/additional_img_dgrs53.png',
  }
];

export const DEFAULT_MATERIALS_HERO_IMAGE = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1791021147/Materials_That_Shape_Home_1.png';

const Products = () => {
  const [products, setProducts] = useState(() => {
    const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
    return Array.isArray(stored) && stored.length > 0 ? stored : CANONICAL_MATERIALS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [cmsSettings, setCmsSettings] = useState(() => getCMSData(STORAGE_KEYS.SETTINGS) || {});
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const heroVideoUrl = cmsSettings.materials_hero_video || 'https://res.cloudinary.com/r3jwfy0y/video/upload/v1790935342/thronetegelslaminaat_pindown.io_1790935254.mp4';
  const heroImageUrl = cmsSettings.materials_hero_image || DEFAULT_MATERIALS_HERO_IMAGE;

  // Desktop subtle parallax scroll motion — negative Y lifts content UP as user scrolls down, preventing bottom text clipping
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const desktopBgY = useTransform(scrollYProgress, [0, 1], ['0px', '-20px']);
  const desktopBgScale = useTransform(scrollYProgress, [0, 1], [1.0, 0.99]);

  useEffect(() => {
    if (videoRef.current) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobile) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        videoRef.current.pause();
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
    // Slugs where the canonical heroImage must ALWAYS win (never overridden by DB/localStorage)
    const LOCKED_HERO_SLUGS = new Set([
      'acrylic-luxe-collection',
      'digital-korean-poly-granite',
      'charcoal-panels-luxe',
      'fluted-pvc-luxe',
      'lvt-luxe-flooring',
      'fluted-acrylic-luxe',
      'pvc-luxe-collection',
      'wpc-luxe-collection',
      'charcoal-panels-luxe-1',
    ]);

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
        // Lock heroImage for featured materials so old DB/localStorage values never win
        heroImage: LOCKED_HERO_SLUGS.has(canon.slug) ? canon.heroImage : (match.heroImage || canon.heroImage),
        category: match.category || canon.category,
        badge: canon.badge, // Force canon badge so section names show up instead of "Premium Finish"
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

      {/* Hero Landing Section: 96% Screen Size Hero Banner */}
      <section 
        ref={heroRef} 
        className="relative w-full z-0 h-[96dvh] sm:h-[96vh] min-h-[500px] sm:min-h-[540px] px-2 sm:px-4 lg:px-[2%] pt-1 sm:pt-1.5 lg:pt-1.5 pb-1 sm:pb-1.5"
      >
        <div 
          className="relative w-full h-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[36px] bg-[#ded4c5] shadow-lg border border-black/5 hero-card-clipped isolate flex items-center justify-center"
        >
          {/* Mobile View: Autoplay Cinematic Video (strictly on mobile) */}
          <div className="md:hidden w-full h-full relative overflow-hidden">
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
            {/* Top Ambient Vignette for Navbar & Logo Contrast on Mobile Video */}
            <div 
              className="absolute inset-x-0 top-0 h-32 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 50%, transparent 100%)'
              }}
            />
            {/* Subtle Bottom Ambient Vignette on Mobile */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 35%, transparent 70%)'
              }}
            />
            {/* Scroll Down Indicator (Mobile Only) */}
            <ScrollDownIndicator light={false} />
          </div>

          {/* Desktop View: 90% Screen Size Showcase Graphic (Full Visibility without Bottom Clipping) */}
          <div className="hidden md:flex w-full h-full items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#ded4c5] via-[#ede3d4] to-[#f2ebe0]">
            <motion.div
              style={{ y: desktopBgY, scale: desktopBgScale }}
              className="w-full h-full flex items-center justify-center will-change-transform origin-center pb-3 sm:pb-4 lg:pb-6 px-1 sm:px-2"
            >
              <img
                src={heroImageUrl}
                alt="Materials That Shape Home — ESPACIO"
                className="w-full h-full object-cover object-[center_88%] select-none pointer-events-none"
                loading="eager"
                fetchPriority="high"
                style={{ imageRendering: 'high-quality' }}
              />
            </motion.div>
          </div>
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
                    onError={(e) => {
                      const fallback = product.heroImageFallback;
                      if (fallback && e.target.src !== fallback) {
                        e.target.src = fallback;
                      }
                    }}
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
