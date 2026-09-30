import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Search, Sparkles, ArrowRight, X, Check, ShieldCheck, Droplets, Flame, Award, SlidersHorizontal } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

/**
 * Map number x from range [a, b] to [c, d]
 */
const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

/**
 * Calculates distance between center of two elements
 */
const getDistance = (el1, el2) => {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  const c1 = { x: r1.left + r1.width / 2, y: r1.top + r1.height / 2 };
  const c2 = { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2 };
  return Math.hypot(c1.x - c2.x, c1.y - c2.y);
};

/**
 * Calculates how much (x and y) el1 needs to move away from el2 for spread distance
 * Directly ported from MakeWayGridEffect-main/js/utils.js
 */
const getTranslationDistance = (el1, el2, spread = 95, maxDistance = 650) => {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  const c1 = { x: r1.left + r1.width / 2, y: r1.top + r1.height / 2 };
  const c2 = { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2 };

  const dist = Math.hypot(c1.x - c2.x, c1.y - c2.y);
  if (dist >= maxDistance) return { x: 0, y: 0 };

  const currentSpread = Math.max(map(dist, 0, maxDistance, spread, 0), 0);
  const angle = Math.atan2(Math.abs(c2.y - c1.y), Math.abs(c2.x - c1.x));

  const x = Math.abs(Math.cos(angle) * currentSpread);
  const y = Math.abs(Math.sin(angle) * currentSpread);

  return {
    x: c1.x < c2.x ? -x : x,
    y: c1.y < c2.y ? -y : y
  };
};

export const ESPACIO_MATERIAL_CARDS = [
  {
    id: 'fluted-giallo',
    title: 'Fluted Acrylic Luxe — Giallo',
    collection: 'Fluted Acrylic Luxe Collection',
    category: 'Fluted Acrylic',
    materialCode: 'NX-GEN 1 GIALLO',
    swatches: [
      { name: 'Giallo Pale', code: '1721', color: '#D5DFD1' },
      { name: 'Sage Fluted', code: '1606', color: '#9DAF9B' }
    ],
    src: '/images/materials/fluted_acrylic_giallo_dining.webp',
    slug: 'fluted-acrylic-luxe',
    badge: 'Fluted Acrylic',
    specs: ['Ultra-Gloss 3D Fluting', 'Zero Moisture Absorption', 'Backlit Translucency', 'Class 1 Flame Retardant']
  },
  {
    id: 'wpc-1701-1606',
    title: 'Premium WPC Louvers — Walnut & Ash',
    collection: 'WPC Luxe Louvers Series',
    category: 'WPC Louvers',
    materialCode: 'MAT-WPC-1701',
    swatches: [
      { name: 'Dark Walnut Fluted', code: '1701', color: '#3E2723' },
      { name: 'Slate Grey Fluted', code: '1606', color: '#455A64' }
    ],
    src: '/images/materials/wpc_luxe_1701_1606.webp',
    slug: 'wpc-wall-panels',
    badge: 'WPC Louvers',
    specs: ['Solid Wood Composite', '100% Termite Proof', 'Acoustic Sound Baffle', '10 Year Warranty']
  },
  {
    id: 'fluted-azzurro',
    title: 'Fluted Acrylic Luxe — Azzurro',
    collection: 'Fluted Acrylic Luxe Collection',
    category: 'Fluted Acrylic',
    materialCode: 'NX-GEN 2 AZZURRO',
    swatches: [
      { name: 'Azzurro Blue', code: '2104', color: '#88A3B2' },
      { name: 'Ice Marble', code: '8302', color: '#E8ECEF' }
    ],
    src: '/images/materials/fluted_acrylic_azzurro.webp',
    slug: 'fluted-acrylic-luxe',
    badge: 'Fluted Acrylic',
    specs: ['Deep Satin Finish', 'Anti-Fingerprint Coating', 'Seamless Joint Fit', 'UV Stabilized Color']
  },
  {
    id: 'charcoal-5005',
    title: 'Charcoal Luxe Panels — 5005 & 5006',
    collection: 'Charcoal Panels Luxe Collection',
    category: 'Charcoal Panels',
    materialCode: 'MAT-CHR-5005',
    swatches: [
      { name: 'Smoked Charcoal', code: '5005', color: '#2B2B2B' },
      { name: 'Graphite Rib', code: '5006', color: '#3A3A3A' },
      { name: 'Slate', code: '5002', color: '#4A4A4A' }
    ],
    src: '/images/materials/charcoal_luxe_1_5005_5006_5002.webp',
    slug: 'charcoal-panels-luxe',
    badge: 'Charcoal Luxe',
    specs: ['Active Charcoal Core', 'VOC Air Purification', 'Matte Deep Texture', 'Anti-Bacterial Surface']
  },
  {
    id: 'fluted-florida',
    title: 'Fluted Acrylic Luxe — Florida',
    collection: 'Fluted Acrylic Luxe Collection',
    category: 'Fluted Acrylic',
    materialCode: 'NX-GEN 3 FLORIDA',
    swatches: [
      { name: 'Florida Sand', code: '3301', color: '#D4C5B9' },
      { name: 'Gold Rib', code: '3302', color: '#C8B097' }
    ],
    src: '/images/materials/fluted_acrylic_florida.webp',
    slug: 'fluted-acrylic-luxe',
    badge: 'Fluted Acrylic',
    specs: ['Architectural Gold Highlight', 'High Impact Acrylic', 'Easy Wipe Clean', 'Custom Curve Capable']
  },
  {
    id: 'charcoal-4018',
    title: 'Charcoal Panels — Modern Tri-Luxe',
    collection: 'Charcoal Panels Luxe Collection',
    category: 'Charcoal Panels',
    materialCode: 'MAT-CHR-4018',
    swatches: [
      { name: 'Ebony Slat', code: '4018', color: '#1F1F1F' },
      { name: 'Dark Oak', code: '4017', color: '#4A3728' },
      { name: 'Pewter', code: '4016', color: '#686B6D' }
    ],
    src: '/images/materials/charcoal_luxe_4018_4017_4016.webp',
    slug: 'charcoal-panels-luxe',
    badge: 'Charcoal Luxe',
    specs: ['Triple-Tone Layering', 'Seamless Interlock', 'Ultra Low Formaldehyde', 'Zero Warping Guarantee']
  },
  {
    id: 'fluted-gracia',
    title: 'Fluted Acrylic Luxe — Gracia',
    collection: 'Fluted Acrylic Luxe Collection',
    category: 'Fluted Acrylic',
    materialCode: 'NX-GEN 4 GRACIA',
    swatches: [
      { name: 'Gracia Pearl', code: '1501', color: '#EDE6DE' },
      { name: 'Cream Line', code: '1502', color: '#F7F3EE' }
    ],
    src: '/images/materials/fluted_acrylic_gracia.webp',
    slug: 'fluted-acrylic-luxe',
    badge: 'Fluted Acrylic',
    specs: ['Pearlescent Sheen', 'Precision Routed Flutes', 'Hospitality Grade', 'Chemical Resistant']
  },
  {
    id: 'master-wpc-1701',
    title: 'Master Catalogue — WPC Louvers Series',
    collection: 'Master Architectural Catalogue',
    category: 'WPC Louvers',
    materialCode: 'CAT-WPC-1708',
    swatches: [
      { name: 'Natural Teak', code: '1701', color: '#795548' },
      { name: 'Walnut', code: '1704', color: '#4E342E' },
      { name: 'Carbon', code: '1708', color: '#212121' }
    ],
    src: '/images/materials/master_catalogue_wpc_louvers_1701_1708.webp',
    slug: 'wpc-wall-panels',
    badge: 'WPC Louvers',
    specs: ['Interior & Semi-Exterior', 'Real Wood Embossed', 'Pre-Finished Tongue & Groove', 'Thermal Insulative']
  },
  {
    id: 'charcoal-4009',
    title: 'Charcoal Luxe Panels — 4009 & 4011',
    collection: 'Charcoal Panels Luxe Collection',
    category: 'Charcoal Panels',
    materialCode: 'MAT-CHR-4009',
    swatches: [
      { name: 'Bronze Charcoal', code: '4009', color: '#3E342E' },
      { name: 'Deep Carbon', code: '4011', color: '#1E1E1E' }
    ],
    src: '/images/materials/charcoal_luxe_4009_4011.webp',
    slug: 'charcoal-panels-luxe',
    badge: 'Charcoal Luxe',
    specs: ['Deep Embossed Fluting', 'High-Density Polymer', 'Moisture Proof', 'Sound Absorption NRC 0.45']
  },
  {
    id: 'wpc-1401',
    title: 'WPC Louvers Multi-Slat Profile',
    collection: 'WPC Luxe Louvers Series',
    category: 'WPC Louvers',
    materialCode: 'MAT-WPC-1401',
    swatches: [
      { name: 'Warm Oak', code: '1401', color: '#8D6E63' },
      { name: 'Espresso', code: '1410', color: '#3E2723' },
      { name: 'Ash', code: '1411', color: '#78909C' }
    ],
    src: '/images/materials/wpc_luxe_1401_1410_1411.webp',
    slug: 'wpc-wall-panels',
    badge: 'WPC Louvers',
    specs: ['Engineered Timber Core', 'Anti-Fungal Protection', 'Lightweight Modular Fit', 'Pre-Coated Texture']
  },
  {
    id: 'pvc-1201',
    title: 'PVC Architectural Wall Panels',
    collection: 'PVC Luxe Architecture',
    category: 'PVC Architecture',
    materialCode: 'MAT-PVC-1201',
    swatches: [
      { name: 'Beige Marble', code: '1201', color: '#E0D6C8' },
      { name: 'Carrara White', code: '1204', color: '#EEEEEE' },
      { name: 'Golden Vein', code: '1203', color: '#D7CCC8' }
    ],
    src: '/images/materials/pvc_luxe_1201_1204_1203.webp',
    slug: 'fluted-pvc-luxe',
    badge: 'PVC Architecture',
    specs: ['Italian Marble Foil', 'Zero Moisture Infiltration', 'Class B1 Fire Rating', 'Quick Clip Installation']
  },
  {
    id: 'pvc-1202',
    title: 'PVC Luxe Fluted & Flat Dual Slat',
    collection: 'PVC Luxe Architecture',
    category: 'PVC Architecture',
    materialCode: 'MAT-PVC-1202',
    swatches: [
      { name: 'Calacatta Gold', code: '1202', color: '#F5F5F0' },
      { name: 'Nero Portoro', code: '1206', color: '#212121' },
      { name: 'Travertine', code: '2013', color: '#D7CCC8' }
    ],
    src: '/images/materials/pvc_luxe_1202_1206_2013.webp',
    slug: 'pvc-luxe-collection',
    badge: 'PVC Architecture',
    specs: ['Dual-Profile Geometry', 'Ultra High Gloss Lacquer', 'Impact Resistant Poly', 'Seamless Edge Miter']
  },
  {
    id: 'wpc-1503',
    title: 'WPC Micro-Fluted Acoustic Louver',
    collection: 'WPC Luxe Louvers Series',
    category: 'WPC Louvers',
    materialCode: 'MAT-WPC-1503',
    swatches: [
      { name: 'Cedar Wood', code: '1503', color: '#6D4C41' },
      { name: 'Pecan', code: '1502', color: '#795548' },
      { name: 'Raw Pine', code: '1504', color: '#A1887F' }
    ],
    src: '/images/materials/wpc_luxe_1503_1502_1504.webp',
    slug: 'wpc-wall-panels',
    badge: 'WPC Louvers',
    specs: ['Micro-Grooved Profile', 'Echo Dampening Felt Back', 'Eco Wood Fiber', 'Scratch Guard Coating']
  },
  {
    id: 'florida-vanity',
    title: 'Architectural Dressing Vanity Suite',
    collection: 'Curated Room Execution',
    category: 'Fluted Acrylic',
    materialCode: 'EXEC-VAN-01',
    swatches: [
      { name: 'Fluted Oak', code: 'OAK-F', color: '#8D6E63' },
      { name: 'LED Backlit Mirror', code: 'LED-W', color: '#FFF8E1' }
    ],
    src: '/images/materials/florida_vanity.webp',
    slug: 'acrylic-luxe-collection',
    badge: 'Vanity Suite',
    specs: ['Waterproof Fluted Drawer Fronts', 'Integrated Backlit Joinery', 'Stone Top Counter', 'Solid Core Hardware']
  },
  {
    id: 'bedroom-3',
    title: 'Executive Bedroom Fluted Panelling',
    collection: 'Curated Room Execution',
    category: 'WPC Louvers',
    materialCode: 'EXEC-BED-03',
    swatches: [
      { name: 'Walnut Headboard Slat', code: 'W-SLAT', color: '#3E2723' },
      { name: 'Warm LED Cove', code: 'AMB-L', color: '#FFE0B2' }
    ],
    src: '/images/materials/bedroom_3.webp',
    slug: 'charcoal-panels-luxe',
    badge: 'Master Bedroom',
    specs: ['Floor-to-Ceiling Slat System', 'Acoustic Headboard Cushioning', 'Concealed LED Channels', 'Bespoke Miter Corner']
  },
  {
    id: 'island-kitchen',
    title: 'Waterfall Marble Island & Cabinetry',
    collection: 'Curated Room Execution',
    category: 'Polygranite & Stone',
    materialCode: 'EXEC-KIT-01',
    swatches: [
      { name: 'Calacatta Marble', code: 'M-ISL', color: '#FAFAFA' },
      { name: 'Matte Grey Cabinet', code: 'C-GRY', color: '#546E7A' }
    ],
    src: '/images/materials/island_kitchen_1.webp',
    slug: 'digital-korean-poly-granite',
    badge: 'Modular Kitchen',
    specs: ['Stain Proof Polygranite', 'Continuous Waterfall Vein', 'Soft Touch Anti-Fingerprint', 'Heavy Load Aluminum Channel']
  }
];

const CATEGORIES = [
  'All Materials',
  'Fluted Acrylic',
  'WPC Louvers',
  'Charcoal Panels',
  'PVC Architecture',
  'Polygranite & Stone'
];

export const MakeWayMaterialGrid = ({ onEnquireClick }) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const itemsRef = useRef([]);
  const [selectedCategory, setSelectedCategory] = useState('All Materials');
  const [searchFilter, setSearchFilter] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [selectedSwatchIndex, setSelectedSwatchIndex] = useState(0);
  const tlRef = useRef(null);

  // Filter materials based on search & category
  const filteredItems = useMemo(() => {
    return ESPACIO_MATERIAL_CARDS.filter((item) => {
      const matchCat = selectedCategory === 'All Materials' || item.category === selectedCategory;
      const q = searchFilter.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.collection.toLowerCase().includes(q) ||
        item.materialCode.toLowerCase().includes(q) ||
        item.swatches.some((s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchFilter]);

  // Reset animations when category or search changes
  useEffect(() => {
    collapseAll(true);
    itemsRef.current = [];
  }, [selectedCategory, searchFilter]);

  // Collapse all items smoothly
  const collapseAll = useCallback((immediate = false) => {
    if (tlRef.current) tlRef.current.kill();
    const duration = immediate ? 0 : 0.6;
    const ease = 'power3.out';

    itemsRef.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        zIndex: 1,
        boxShadow: '0 8px 24px -4px rgba(35, 25, 15, 0.14)',
        duration,
        ease,
        overwrite: 'auto'
      });
    });

    setExpandedIndex(-1);
  }, []);

  // Handle item click for the Make Way Grid Effect
  const handleItemClick = useCallback(
    (index) => {
      const clickedEl = itemsRef.current[index];
      if (!clickedEl) return;

      // If already expanded, collapse it
      if (expandedIndex === index) {
        collapseAll();
        return;
      }

      if (tlRef.current) tlRef.current.kill();

      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const targetScale = isMobile ? 1.15 : 1.95;
      const duration = 0.75;
      const ease = 'expo.out';
      const spreadDistance = isMobile ? 55 : 115;
      const maxDistance = isMobile ? 450 : 850;
      const maxRotation = isMobile ? 4 : 7;

      setExpandedIndex(index);
      setSelectedSwatchIndex(0);

      const tl = gsap.timeline({ defaults: { duration, ease } });
      tlRef.current = tl;

      // 1. Expand the clicked item and bring to top z-index
      tl.set(clickedEl, { zIndex: 999 }, 0);
      tl.to(
        clickedEl,
        {
          scale: targetScale,
          x: 0,
          y: 0,
          rotation: 0,
          boxShadow: '0 32px 80px -12px rgba(25, 20, 15, 0.38), 0 0 30px rgba(201, 169, 110, 0.5)',
          duration,
          ease
        },
        0
      );

      // 2. Disperse and rotate all other items away (The "Make Way" Effect)
      itemsRef.current.forEach((otherEl, idx) => {
        if (!otherEl || idx === index) return;

        const { x, y } = getTranslationDistance(otherEl, clickedEl, spreadDistance, maxDistance);
        const dist = getDistance(otherEl, clickedEl);
        const zIndex = Math.max(1, Math.round(map(dist, 0, 1000, 900, 1)));
        const rotInterval = Math.max(0, Math.round(map(dist, 0, maxDistance, maxRotation, 0)));
        const rot = rotInterval ? gsap.utils.random(-rotInterval, rotInterval) : 0;

        tl.set(otherEl, { zIndex }, 0);
        tl.to(
          otherEl,
          {
            x,
            y,
            scale: 0.96,
            rotation: rot,
            duration,
            ease
          },
          0
        );
      });
    },
    [expandedIndex, collapseAll]
  );

  // Close on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedIndex !== -1) {
        collapseAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex, collapseAll]);

  // Request material sample handler
  const handleEnquire = (item, e) => {
    e.stopPropagation();
    if (onEnquireClick) {
      onEnquireClick(item);
    } else {
      window.dispatchEvent(
        new CustomEvent('open-quote-modal', {
          detail: {
            mode: 'catalogue',
            productName: `${item.title} (${item.materialCode})`,
            title: `Request Sample: ${item.title}`
          }
        })
      );
    }
  };

  return (
    <section className="relative w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-16">
      {/* Background Dim Scrim when an item is expanded */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-500 pointer-events-none ${
          expandedIndex !== -1 ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => collapseAll()}
      />

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 sm:mb-12 border-b border-black/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles size={13} className="text-gold animate-pulse" />
            <span>Interactive Make Way Grid</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal tracking-tight">
            Curated Architectural Swatches
          </h2>
          <p className="font-sans text-sm sm:text-base text-walnut/80 mt-2 max-w-2xl leading-relaxed">
            Click any material card below to expand and inspect high-resolution textures, surface swatches, and technical specs. Surrounding tiles dynamically disperse to make way.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto relative min-w-[280px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-walnut/50" />
          <input
            type="text"
            placeholder="Search code (e.g. 1701, Giallo)..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF7F2] border border-black/15 text-sm text-charcoal placeholder-walnut/50 focus:outline-none focus:border-gold transition-colors shadow-inner"
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-walnut/50 hover:text-charcoal cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-10 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-charcoal text-cream shadow-md scale-105'
                  : 'bg-[#FAF7F2] text-charcoal/80 border border-black/10 hover:border-gold hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* The Make Way Grid Container */}
      <div
        ref={gridRef}
        className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 z-10"
        style={{ perspective: '1200px' }}
      >
        {filteredItems.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const activeSwatch = item.swatches[selectedSwatchIndex] || item.swatches[0];

          return (
            <div
              key={item.id}
              ref={(el) => (itemsRef.current[idx] = el)}
              onClick={() => handleItemClick(idx)}
              className={`group relative rounded-[20px] bg-[#FAF7F2] border transition-[border-color] duration-300 overflow-hidden cursor-pointer select-none ${
                isExpanded
                  ? 'border-gold ring-2 ring-gold/40 z-50'
                  : 'border-black/10 hover:border-gold/60'
              }`}
              style={{
                willChange: 'transform, box-shadow',
                boxShadow: '0 8px 24px -4px rgba(35, 25, 15, 0.12)'
              }}
            >
              {/* Card Container Header (Subtle Luxe Strip) */}
              <div className="relative p-3 sm:p-4 pb-0 flex items-center justify-between">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/25">
                  {item.badge}
                </span>
                <span className="text-[10px] font-mono font-medium text-walnut/60">
                  {item.materialCode}
                </span>
              </div>

              {/* Main Card Media Area */}
              <div className="relative p-3 sm:p-4 pt-2">
                <div className="relative aspect-[1/1.22] w-full rounded-[14px] overflow-hidden bg-[#ECE6DC] border border-black/10">
                  <img
                    src={getOptimizedImageUrl(item.src, 800, 85)}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Vertical Typography Ribbon on Left Edge (Matching Screenshot) */}
                  <div className="absolute left-2 top-3 bottom-3 flex flex-col justify-between pointer-events-none opacity-85">
                    <span
                      className="font-display text-[9px] tracking-[0.2em] uppercase text-charcoal/70 origin-top-left -rotate-90 translate-y-24 whitespace-nowrap font-bold drop-shadow-sm"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {item.collection}
                    </span>
                  </div>

                  {/* Close button if expanded */}
                  {isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        collapseAll();
                      }}
                      className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-charcoal/90 text-white flex items-center justify-center hover:bg-gold transition-colors shadow-lg cursor-pointer"
                      title="Close preview (Esc)"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Swatch Chips Row at Bottom of Card (Matching Screenshot e.g. 1701 / 1606) */}
                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-black/8">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.swatches.map((swatch, sIdx) => {
                      const isSelected = selectedSwatchIndex === sIdx;
                      return (
                        <div
                          key={swatch.code}
                          onClick={(e) => {
                            if (isExpanded) {
                              e.stopPropagation();
                              setSelectedSwatchIndex(sIdx);
                            }
                          }}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all ${
                            isSelected && isExpanded
                              ? 'bg-charcoal text-cream border-charcoal scale-105 font-bold'
                              : 'bg-white/80 text-charcoal border-black/15 hover:border-gold'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-xs"
                            style={{ backgroundColor: swatch.color }}
                          />
                          <span>{swatch.code}</span>
                        </div>
                      );
                    })}
                  </div>

                  <span className="text-[10px] font-sans uppercase tracking-wider text-walnut/70 font-semibold group-hover:text-gold transition-colors flex items-center gap-0.5">
                    <span>{isExpanded ? 'Active' : 'Inspect'}</span>
                    <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="px-4 pb-4 pt-1">
                <h3 className="font-display text-sm sm:text-base font-bold text-charcoal leading-snug line-clamp-1 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-[11px] text-walnut/70 line-clamp-1 mt-0.5">
                  {item.collection}
                </p>

                {/* Expanded State Details (Revealed smoothly on click) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-black/10 space-y-3 animate-fadeIn">
                    <div className="space-y-1">
                      <span className="text-[10px] font-sans uppercase tracking-widest text-gold font-bold">
                        Specifications & Finishes
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 text-[10.5px] text-charcoal">
                        {item.specs.map((spec, i) => (
                          <div key={i} className="flex items-center gap-1 text-walnut/90">
                            <Check size={11} className="text-gold shrink-0" />
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={(e) => handleEnquire(item, e)}
                        className="flex-1 py-2 px-3 rounded-full bg-gold text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-charcoal hover:text-cream transition-colors text-center shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck size={13} />
                        <span>Enquire Sample</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/materials/${item.slug}`);
                        }}
                        className="py-2 px-3 rounded-full bg-white border border-black/15 text-charcoal text-xs font-semibold hover:border-gold hover:text-gold transition-colors text-center cursor-pointer"
                        title="View Full Case Study"
                      >
                        Details ↗
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="py-16 text-center bg-[#FAF7F2] rounded-[24px] border border-black/10 p-8 max-w-lg mx-auto">
          <SlidersHorizontal size={28} className="mx-auto text-gold mb-3" />
          <h3 className="font-display text-xl font-bold text-charcoal">No Matching Swatches</h3>
          <p className="font-sans text-xs text-walnut/70 mt-1">
            Try resetting your search query or choosing another category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Materials');
              setSearchFilter('');
            }}
            className="mt-4 px-5 py-2 rounded-full bg-gold text-charcoal text-xs font-bold uppercase tracking-wider hover:bg-charcoal hover:text-white transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </section>
  );
};

export default MakeWayMaterialGrid;
