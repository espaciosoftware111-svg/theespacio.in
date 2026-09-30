import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { X, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { getCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import './MakeWayHeroGrid.css';

/**
 * Map number x from range [a, b] to [c, d]
 */
const map = (x, a, b, c, d) => ((x - a) * (d - c)) / (b - a) + c;

/**
 * Calculates distance between centers of two elements
 */
const getDistance = (el1, el2) => {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  const c1 = { x: r1.left + r1.width / 2, y: r1.top + r1.height / 2 };
  const c2 = { x: r2.left + r2.width / 2, y: r2.top + r2.height / 2 };
  return Math.hypot(c1.x - c2.x, c1.y - c2.y);
};

/**
 * Calculates translation distance vector away from clicked element (The Codrops Make Way algorithm)
 */
const getTranslationDistance = (el1, el2, spread = 120, maxDistance = 750) => {
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

// ── 24 Curated Material Catalogs (4 Rows x 6 Columns Layout) ────────────────
export const TWENTY_FOUR_MATERIAL_CATALOGS = [
  // ── ROW 1: Acrylics & Italian Marbles (6 items) ──
  {
    order: 1,
    title: 'Acrylic Luxe - Azzurro',
    slug: 'acrylic-luxe-collection',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-01',
    badge: 'ACRYLIC & FINISHES',
    description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern surfaces.',
    heroImage: '/images/materials/clean_fluted_acrylic_azzurro.webp',
    fallbackImage: '/images/materials/fluted_acrylic_azzurro.webp',
    swatches: [{ name: 'Azzurro Blue', code: '2104', color: '#88A3B2' }],
    specs: ['Ultra-Gloss Anti-Scratch', 'Concealed Track Fit']
  },
  {
    order: 2,
    title: 'Poly Granite - Gracia Marble',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    materialCode: 'MAT-GNT-02',
    badge: 'NATURAL STONE',
    description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
    heroImage: '/images/materials/clean_fluted_acrylic_gracia.webp',
    fallbackImage: '/images/materials/fluted_acrylic_gracia.jpg',
    swatches: [{ name: 'Gracia Vein', code: '8302', color: '#D2B48C' }],
    specs: ['High-Gloss Stone Overlay', 'Italian Marble Veins']
  },
  {
    order: 3,
    title: 'Acrylic Luxe - Luminous Grid',
    slug: 'acrylic-luxe-collection',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-03',
    badge: 'ACRYLIC & FINISHES',
    description: 'Contemporary geometric luminous grid acrylic panels for sleek modular cabinetry.',
    heroImage: '/images/materials/clean_luminous_grid_8313.webp',
    fallbackImage: '/images/materials/luminous_grid_8313.webp',
    swatches: [{ name: 'Luminous Grid', code: '8313', color: '#FAF0E6' }],
    specs: ['Zero Fingerprints', 'Class 1 Fire Safe']
  },
  {
    order: 4,
    title: 'Poly Granite - Crema Imperiale',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    materialCode: 'MAT-GNT-04',
    badge: 'NATURAL STONE',
    description: 'Warm cream-veined luxury polygranite slabs for expansive seamless wall elevations.',
    heroImage: '/images/materials/clean_crema_imperiale_8302.webp',
    fallbackImage: '/images/materials/crema_imperiale_8302.webp',
    swatches: [{ name: 'Crema Imperiale', code: '8302', color: '#E5D6C5' }],
    specs: ['Scratch & Heat Resistant', 'Direct Wall Mount']
  },
  {
    order: 5,
    title: 'Fluted Acrylic - Giallo Desk',
    slug: 'fluted-acrylic-luxe',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-05',
    badge: 'ACRYLIC & FINISHES',
    description: 'Executive workspace fluted acrylic element with clean linear relief lines.',
    heroImage: '/images/materials/clean_fluted_acrylic_giallo_desk.webp',
    fallbackImage: '/images/materials/fluted_acrylic_giallo_desk.jpg',
    swatches: [{ name: 'Giallo Pale', code: '1721', color: '#D5DFD1' }],
    specs: ['3D Relief Grooves', 'Backlit Ready']
  },
  {
    order: 6,
    title: 'Poly Granite - Elysian Vein',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    materialCode: 'MAT-GNT-06',
    badge: 'NATURAL STONE',
    description: 'Dynamic crystalline marble veining engineered into lightweight composite stone.',
    heroImage: '/images/materials/clean_elysian_vein_8303.webp',
    fallbackImage: '/images/materials/elysian_vein_8303.webp',
    swatches: [{ name: 'Elysian Vein', code: '8303', color: '#E8D8C8' }],
    specs: ['Zero Moisture Seepage', 'Mirror Polish 95+ GU']
  },

  // ── ROW 2: Acoustic Charcoal & Deep Relief (6 items) ──
  {
    order: 7,
    title: 'Charcoal Panels - Ebony Slat',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-07',
    badge: 'ACOUSTIC PANELS',
    description: 'Richly textured wall panels infused with active charcoal for acoustic isolation.',
    heroImage: '/images/materials/clean_charcoal_luxe_4018_4017_4016.webp',
    fallbackImage: '/images/materials/charcoal_luxe_4018_4017_4016.webp',
    swatches: [{ name: 'Ebony Slat', code: '4018', color: '#1F1F1F' }],
    specs: ['Active Charcoal Core', 'VOC Air Purification']
  },
  {
    order: 8,
    title: 'Charcoal Panels - Edition 4015',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-08',
    badge: 'ACOUSTIC PANELS',
    description: 'Deep sculptural charcoal grooved panels styling master bed headboards.',
    heroImage: '/images/materials/clean_charcoal_luxe_4015.webp',
    fallbackImage: '/images/materials/charcoal_luxe_4015.webp',
    swatches: [{ name: 'Edition Slat', code: '4015', color: '#2B2B2B' }],
    specs: ['Sound Dampening', 'Matte Deep Texture']
  },
  {
    order: 9,
    title: 'Charcoal Luxe (1) - Bronze',
    slug: 'charcoal-panels-luxe-1',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-09',
    badge: 'ACOUSTIC PANELS',
    description: 'Warm metallic bronze undertones layered on an active charcoal acoustic matrix.',
    heroImage: '/images/materials/clean_charcoal_luxe_1_6015.webp',
    fallbackImage: '/images/materials/charcoal_luxe_1_6015.webp',
    swatches: [{ name: 'Metallic Bronze', code: '6015', color: '#6B533E' }],
    specs: ['Architectural Deep Relief', 'Zero Warping']
  },
  {
    order: 10,
    title: 'Charcoal Panels - Dual Tone',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-10',
    badge: 'ACOUSTIC PANELS',
    description: 'Harmonious dual-tone charcoal acoustic battens for modern entertainment walls.',
    heroImage: '/images/materials/clean_charcoal_luxe_4009_4011.webp',
    fallbackImage: '/images/materials/charcoal_luxe_4009_4011.webp',
    swatches: [{ name: 'Tone Slat', code: '4009', color: '#3A3A3A' }],
    specs: ['Class A Fire Safety', 'Acoustic Isolation']
  },
  {
    order: 11,
    title: 'Charcoal Luxe (1) - Sculptural',
    slug: 'charcoal-panels-luxe-1',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-11',
    badge: 'ACOUSTIC PANELS',
    description: 'High-relief geometric fluted charcoal elements for luxury foyer accenting.',
    heroImage: '/images/materials/clean_charcoal_luxe_1_5005_5006_5002.webp',
    fallbackImage: '/images/materials/charcoal_luxe_1_5005_5006_5002.webp',
    swatches: [{ name: 'Sculptural Grey', code: '5005', color: '#4D4D4D' }],
    specs: ['Modular Interlock', 'Air Purifying']
  },
  {
    order: 12,
    title: 'Charcoal Panels - Anthracite',
    slug: 'charcoal-panels-luxe',
    category: 'Acoustic Panels',
    materialCode: 'MAT-CHR-12',
    badge: 'ACOUSTIC PANELS',
    description: 'Deep obsidian and anthracite slats with acoustic sound absorption backing.',
    heroImage: '/images/materials/clean_charcoal_luxe_4001_4003.webp',
    fallbackImage: '/images/materials/charcoal_luxe_4001_4003.webp',
    swatches: [{ name: 'Anthracite', code: '4001', color: '#1B1B1B' }],
    specs: ['Matte Zero Glare', '100% Moisture Proof']
  },

  // ── ROW 3: Fluted PVC & Architectural Panels (6 items) ──
  {
    order: 13,
    title: 'Fluted PVC - Irish Off-White',
    slug: 'fluted-pvc-luxe',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-13',
    badge: 'ARCHITECTURAL PANELS',
    description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
    heroImage: '/images/materials/clean_irish.webp',
    fallbackImage: '/images/materials/irish.webp',
    swatches: [{ name: 'Irish White', code: '1201', color: '#E0D6C8' }],
    specs: ['Waterproof PVC Core', 'Easy Tongue & Groove']
  },
  {
    order: 14,
    title: 'PVC Luxe - Alabaster Wood',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-14',
    badge: 'ARCHITECTURAL PANELS',
    description: 'Lightweight, versatile PVC panels for ceiling and wall applications with wood finishes.',
    heroImage: '/images/materials/clean_pvc_luxe_5003_5004.webp',
    fallbackImage: '/images/materials/pvc_luxe_5003_5004.webp',
    swatches: [{ name: 'Alabaster Wood', code: '5003', color: '#D7CCC8' }],
    specs: ['Lightweight Construction', 'Flame Retardant B1']
  },
  {
    order: 15,
    title: 'PVC Luxe - Beige Marble',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-15',
    badge: 'ARCHITECTURAL PANELS',
    description: 'Soft beige stone textures engineered into modular interlocking ceiling and wall planks.',
    heroImage: '/images/materials/clean_pvc_luxe_1201_1204_1203.webp',
    fallbackImage: '/images/materials/pvc_luxe_1201_1204_1203.webp',
    swatches: [{ name: 'Beige Marble', code: '1201', color: '#E8E0D5' }],
    specs: ['Click-Lock Grid', 'Dual Slat Profile']
  },
  {
    order: 16,
    title: 'PVC Luxe - Carrara Wave',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-16',
    badge: 'ARCHITECTURAL PANELS',
    description: 'Carrara Italian white marble look with lightweight polymer moisture barrier.',
    heroImage: '/images/materials/clean_pvc_luxe_1202_1206_2013.webp',
    fallbackImage: '/images/materials/pvc_luxe_1202_1206_2013.webp',
    swatches: [{ name: 'Carrara Wave', code: '1202', color: '#F0EFEA' }],
    specs: ['Moisture Proof', 'Cove Light Ready']
  },
  {
    order: 17,
    title: 'PVC Luxe - Nordic Ash',
    slug: 'pvc-luxe-collection',
    category: 'Architectural Panels',
    materialCode: 'MAT-PVC-17',
    badge: 'ARCHITECTURAL PANELS',
    description: 'Subtle cool grey wood grain slats perfect for clean Scandinavian ceiling grids.',
    heroImage: '/images/materials/clean_pvc_luxe_4010_4013_2007.webp',
    fallbackImage: '/images/materials/pvc_luxe_4010_4013_2007.webp',
    swatches: [{ name: 'Nordic Ash', code: '4010', color: '#BFB8AF' }],
    specs: ['Termite Proof', 'Zero Sag Guarantee']
  },
  {
    order: 18,
    title: 'Fluted Acrylic - Florida Marble',
    slug: 'fluted-acrylic-luxe',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-18',
    badge: 'ACRYLIC & FINISHES',
    description: 'Dynamic fluted acrylic panels creating sophisticated shadow play and backlit radiance.',
    heroImage: '/images/materials/clean_fluted_acrylic_florida.webp',
    fallbackImage: '/images/materials/fluted_acrylic_florida.jpg',
    swatches: [{ name: 'Florida Gold', code: '8314', color: '#ECEAE6' }],
    specs: ['UV Protected', 'Anti-Scratch Coating']
  },

  // ── ROW 4: WPC Composites & Flooring (6 items) ──
  {
    order: 19,
    title: 'WPC Luxe - Dark Walnut',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    materialCode: 'MAT-WPC-19',
    badge: 'COMPOSITE PANELS',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
    heroImage: '/images/materials/clean_wpc_luxe_1701_1606.webp',
    fallbackImage: '/images/materials/wpc_luxe_1701_1606.webp',
    swatches: [{ name: 'Dark Walnut', code: '1701', color: '#3E2723' }],
    specs: ['Solid Wood Composite', '100% Termite Proof']
  },
  {
    order: 20,
    title: 'LVT Luxe - Scandinavian Oak',
    slug: 'lvt-luxe-flooring',
    category: 'Wood & Flooring',
    materialCode: 'MAT-FLR-20',
    badge: 'WOOD & FLOORING',
    description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
    heroImage: '/images/materials/clean_fluted_acrylic_giallo_dining.webp',
    fallbackImage: '/images/materials/fluted_acrylic_giallo_dining.jpg',
    swatches: [{ name: 'Scandinavian Oak', code: 'FL-201', color: '#C2A882' }],
    specs: ['Commercial Wear Layer', '100% Waterproof']
  },
  {
    order: 21,
    title: 'WPC Luxe - Smoked Oak',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    materialCode: 'MAT-WPC-21',
    badge: 'COMPOSITE PANELS',
    description: 'Rich architectural exterior & interior cladding engineered for zero maintenance.',
    heroImage: '/images/materials/clean_wpc_luxe_1718_1717_1701.webp',
    fallbackImage: '/images/materials/wpc_luxe_1718_1717_1701.webp',
    swatches: [{ name: 'Smoked Oak', code: '1718', color: '#54463A' }],
    specs: ['UV Resistant', '10 Year Warranty']
  },
  {
    order: 22,
    title: 'WPC Luxe - Teak Fluted',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    materialCode: 'MAT-WPC-22',
    badge: 'COMPOSITE PANELS',
    description: 'Warm golden teak fluted profiles creating rich architectural depth for walls.',
    heroImage: '/images/materials/clean_wpc_luxe_1401_1410_1411.webp',
    fallbackImage: '/images/materials/wpc_luxe_1401_1410_1411.webp',
    swatches: [{ name: 'Teak Slat', code: '1401', color: '#825936' }],
    specs: ['Acoustic Sound Baffle', 'Flame Retardant']
  },
  {
    order: 23,
    title: 'WPC Luxe - Natural Slat',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    materialCode: 'MAT-WPC-23',
    badge: 'COMPOSITE PANELS',
    description: 'Co-extruded natural slat profiles engineered for balconies and luxury TV units.',
    heroImage: '/images/materials/clean_wpc_luxe_1503_1502_1504.webp',
    fallbackImage: '/images/materials/wpc_luxe_1503_1502_1504.webp',
    swatches: [{ name: 'Natural Slat', code: '1503', color: '#9E8569' }],
    specs: ['Eco-Friendly E0 Grade', 'Zero Swelling']
  },
  {
    order: 24,
    title: 'WPC Architectural Wall Panels',
    slug: 'wpc-luxe-collection',
    category: 'Composite Panels',
    materialCode: 'MAT-WPC-24',
    badge: 'COMPOSITE PANELS',
    description: 'Heavy-duty commercial grade architectural composite panels with deep embossed wood grains.',
    heroImage: '/images/materials/clean_wpc_panels.webp',
    fallbackImage: '/images/materials/wpc_panels.webp',
    swatches: [{ name: 'Deep Composite', code: 'WPC-01', color: '#4A3B32' }],
    specs: ['Commercial Grade', '10 Year Warranty']
  }
];

export default function MakeWayHeroGrid() {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const gridRef = useRef(null);
  const itemsRef = useRef([]);
  const tlRef = useRef(null);
  const baseTransforms = useRef([]);

  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [expandedScale, setExpandedScale] = useState(1.85);

  // Sync with live CMS products if available, strictly maintaining canonical order & specs
  const catalogList = useMemo(() => {
    try {
      const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
      const list = Array.isArray(stored) && stored.length > 0 ? stored : [];
      return TWENTY_FOUR_MATERIAL_CATALOGS.map((canon) => {
        const match = list.find((p) => p && (p.slug === canon.slug || p.title === canon.title));
        if (!match) return canon;
        return {
          ...canon,
          title: match.title || canon.title,
          description: match.description || canon.description,
          heroImage: canon.heroImage,
          fallbackImage: canon.fallbackImage,
          category: canon.category,
          badge: canon.badge,
          materialCode: canon.materialCode,
          swatches: Array.isArray(match.swatches) && match.swatches.length > 0 ? match.swatches : canon.swatches,
          specs: Array.isArray(match.features) && match.features.length > 0 ? match.features : canon.specs,
        };
      });
    } catch {}
    return TWENTY_FOUR_MATERIAL_CATALOGS;
  }, []);

  // Compute refined 3D curved gallery base transforms for 24 Materials (4 rows x 6 cols)
  const setupBaseTransforms = useCallback(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024;
    const mult = isMobile ? 0.35 : isTablet ? 0.6 : 0.8;

    const actualCols = isMobile ? 3 : isTablet ? 4 : 6;
    const totalCards = 24;
    const rows = Math.ceil(totalCards / actualCols);

    const matrix = Array.from({ length: totalCards }, (_, idx) => {
      const col = idx % actualCols;
      const row = Math.floor(idx / actualCols);

      // Normalized horizontal coordinate (-1 to 1)
      const normX = actualCols > 1 ? (col - (actualCols - 1) / 2) / ((actualCols - 1) / 2) : 0;
      // Normalized vertical coordinate (-1 to 1)
      const normY = rows > 1 ? (row - (rows - 1) / 2) / ((rows - 1) / 2) : 0;
      const distFromCenter = Math.hypot(normX, normY * 0.6);

      return {
        rotateY: normX * 6.5 * mult,
        rotateX: -normY * 1.5 * mult, // Minimal vertical tilt to ensure zero vertical row overlap
        translateZ: (1 - Math.min(distFromCenter, 1.2)) * 12 * mult,
        scale: 1 - Math.min(distFromCenter, 1.2) * 0.015 * mult
      };
    });

    baseTransforms.current = matrix;

    // Apply base transforms to all cards
    itemsRef.current.forEach((el, idx) => {
      if (!el || !baseTransforms.current[idx]) return;
      const { rotateY, rotateX, translateZ, scale } = baseTransforms.current[idx];
      gsap.set(el, {
        x: 0,
        y: 0,
        scale,
        rotateY,
        rotateX,
        translateZ,
        rotation: 0,
        opacity: 1,
        filter: 'none',
        zIndex: 1
      });
    });
  }, []);

  useEffect(() => {
    setupBaseTransforms();
    const handleResize = () => setupBaseTransforms();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setupBaseTransforms]);

  // Mouse move parallax: tilts the entire 3D stage smoothly like a spherical dome object
  const handleMouseMove = useCallback((e) => {
    if (expandedIndex !== -1 || !stageRef.current || !gridRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(gridRef.current, {
      rotateY: x * 10,
      rotateX: -y * 8,
      duration: 0.9,
      ease: 'power1.out',
      overwrite: 'auto'
    });
  }, [expandedIndex]);

  const handleMouseLeave = useCallback(() => {
    if (expandedIndex !== -1 || !gridRef.current) return;
    gsap.to(gridRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 1.0,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }, [expandedIndex]);

  // Collapse all 24 cards back to their tilted 3D layout
  const collapseAll = useCallback(() => {
    if (tlRef.current) tlRef.current.kill();
    const duration = 0.65;
    const ease = 'power3.out';

    // Reset container rotation
    if (gridRef.current) {
      gsap.to(gridRef.current, { rotateX: 0, rotateY: 0, duration: 0.5, ease });
    }

    itemsRef.current.forEach((el, idx) => {
      if (!el || !baseTransforms.current[idx]) return;
      const { rotateY, rotateX, translateZ, scale } = baseTransforms.current[idx];
      gsap.to(el, {
        x: 0,
        y: 0,
        scale,
        rotateY,
        rotateX,
        translateZ,
        rotation: 0,
        opacity: 1,
        filter: 'none',
        zIndex: 1,
        duration,
        ease,
        overwrite: 'auto'
      });
    });

    setExpandedIndex(-1);
  }, []);

  // Handle card click — The Make Way Animation with Viewport Centering & Device-Aware Scaling
  const handleCardClick = useCallback(
    (index) => {
      const clickedEl = itemsRef.current[index];
      if (!clickedEl) return;

      if (expandedIndex === index) {
        collapseAll();
        return;
      }

      if (tlRef.current) tlRef.current.kill();

      const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
      const isMobile = winWidth < 640;
      const isTablet = winWidth >= 640 && winWidth < 1024;
      const duration = 0.75;
      const ease = 'expo.out';
      const spread = isMobile ? 70 : 130;
      const maxDistance = isMobile ? 450 : 750;
      const maxRotation = isMobile ? 3 : 6;

      // Center container rotation for clean inspection
      if (gridRef.current) {
        gsap.to(gridRef.current, { rotateX: 0, rotateY: 0, duration: 0.4, ease: 'power2.out' });
      }

      // Calculate translation offset to center the clicked card exactly within the grid
      let deltaX = 0;
      let deltaY = 0;
      let targetScale = isMobile ? 1.9 : isTablet ? 1.75 : 1.75;

      if (gridRef.current && clickedEl) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const cardRect = clickedEl.getBoundingClientRect();
        const gridCenterX = gridRect.left + gridRect.width / 2;
        const gridCenterY = gridRect.top + gridRect.height / 2;
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        deltaX = gridCenterX - cardCenterX;
        deltaY = gridCenterY - cardCenterY;

        // Dynamic scale constrained to viewport so card never overflows device width or height
        const maxAllowedWidth = isMobile ? Math.min(winWidth * 0.80, 280) : isTablet ? 330 : 380;
        const maxAllowedHeight = isMobile ? Math.min(winHeight * 0.38, 220) : isTablet ? 260 : 300;
        if (cardRect.width > 0 && cardRect.height > 0) {
          const scaleW = maxAllowedWidth / cardRect.width;
          const scaleH = maxAllowedHeight / cardRect.height;
          // Use Math.min to ensure neither width nor height exceeds screen limits
          targetScale = Math.min(scaleW, scaleH);
          targetScale = Math.max(1.35, Math.min(targetScale, 2.2));
        }
      }

      setExpandedScale(targetScale);
      setExpandedIndex(index);

      const tl = gsap.timeline({ defaults: { duration, ease } });
      tlRef.current = tl;

      // 1. Expand clicked card: moves to center, faces user forward, scales up, brings to top
      tl.set(clickedEl, { zIndex: 120 }, 0);
      tl.to(
        clickedEl,
        {
          x: deltaX,
          y: deltaY,
          scale: targetScale,
          rotateX: 0,
          rotateY: 0,
          translateZ: 160,
          rotation: 0,
          opacity: 1,
          filter: 'none',
          duration,
          ease
        },
        0
      );

      // 2. All other 23 cards disperse away radially & tilt & dim softly
      itemsRef.current.forEach((otherEl, idx) => {
        if (!otherEl || idx === index) return;
        const base = baseTransforms.current[idx] || { rotateY: 0, rotateX: 0, translateZ: 0, scale: 1 };

        const { x, y } = getTranslationDistance(otherEl, clickedEl, spread, maxDistance);
        const dist = getDistance(otherEl, clickedEl);
        const zIndex = Math.max(1, Math.round(map(dist, 0, 1000, 30, 2)));
        const rotInterval = Math.max(0, Math.round(map(dist, 0, maxDistance, maxRotation, 0)));
        const rot = rotInterval ? gsap.utils.random(-rotInterval, rotInterval) : 0;

        tl.set(otherEl, { zIndex }, 0);
        tl.to(
          otherEl,
          {
            x,
            y,
            scale: base.scale * 0.9,
            rotateX: base.rotateX,
            rotateY: base.rotateY,
            translateZ: base.translateZ,
            rotation: rot,
            opacity: 0.22,
            filter: 'blur(1.5px)',
            duration,
            ease
          },
          0
        );
      });
    },
    [expandedIndex, collapseAll]
  );

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && expandedIndex !== -1) {
        collapseAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedIndex, collapseAll]);

  // Request sample enquiry modal trigger
  const handleEnquire = (item, e) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('open-quote-modal', {
        detail: {
          mode: 'catalogue',
          productName: `${item.title} (${item.materialCode})`,
          title: `Request Sample: ${item.title}`
        }
      })
    );
  };

  return (
    <div ref={rootRef} className="makeway-hero-root">
      {/* Background Dim Scrim when a card is expanded */}
      <div
        className={`makeway-hero-scrim ${expandedIndex !== -1 ? 'active' : ''}`}
        onClick={() => collapseAll()}
      />

      {/* 3D Perspective Stage with Parallax Tilt for 24 Materials (4 rows x 6 columns) */}
      <div
        ref={stageRef}
        className="makeway-hero-stage"
        onClick={(e) => {
          if (expandedIndex !== -1 && e.target === stageRef.current) {
            collapseAll();
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={gridRef} className="makeway-hero-grid-24">
          {catalogList.map((card, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={`makeway-hero-card-${card.materialCode}-${idx}`}
                ref={(el) => (itemsRef.current[idx] = el)}
                onClick={(e) => {
                  if (isExpanded) {
                    e.stopPropagation();
                  } else {
                    handleCardClick(idx);
                  }
                }}
                className={`makeway-card-item ${
                  isExpanded ? 'ring-2 ring-gold/90 shadow-2xl' : ''
                }`}
              >
                <div className="makeway-card-inner">
                  {/* Card Media Wrap */}
                  <div className="makeway-card-media">
                    <img
                      src={getOptimizedImageUrl(card.heroImage, 600, 85)}
                      alt={card.title}
                      loading="eager"
                      decoding="sync"
                      onError={(e) => {
                        if (card.fallbackImage) {
                          e.currentTarget.src = card.fallbackImage;
                        }
                      }}
                    />

                    {/* Close button if expanded: Counter-scaled to maintain crisp 1x pixel dimensions */}
                    {isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          collapseAll();
                        }}
                        style={{
                          transform: `scale(${1 / expandedScale})`,
                          transformOrigin: 'top right'
                        }}
                        className="absolute top-2 right-2 z-30 w-7 h-7 rounded-full bg-charcoal/90 text-cream flex items-center justify-center hover:bg-gold hover:text-charcoal transition-colors shadow-lg cursor-pointer backdrop-blur-md"
                        title="Close preview (Esc)"
                      >
                        <X size={14} />
                      </button>
                    )}

                    {/* Quick Inspection Action Bar: Counter-scaled so buttons and text never bloat or overflow */}
                    {isExpanded && (
                      <div
                        style={{
                          width: `${expandedScale * 100}%`,
                          left: '50%',
                          bottom: 0,
                          transform: `translateX(-50%) scale(${1 / expandedScale})`,
                          transformOrigin: 'bottom center'
                        }}
                        className="absolute z-30 pt-8 pb-2.5 px-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center gap-2 animate-fadeIn pointer-events-auto"
                      >
                        <button
                          onClick={(e) => handleEnquire(card, e)}
                          className="flex-1 py-1.5 px-3 rounded-full bg-gold hover:bg-[#b8976c] text-charcoal text-[10px] font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-95"
                        >
                          <ShieldCheck size={12} className="shrink-0" />
                          <span>Request Sample</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/materials/${card.slug}`);
                          }}
                          className="py-1.5 px-3.5 rounded-full bg-cream hover:bg-gold text-charcoal text-[10px] font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap active:scale-95"
                        >
                          <span>Explore</span>
                          <ArrowUpRight size={11} className="shrink-0" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="makeway-scroll-hint">
        <span>SCROLL DOWN.</span>
        <div className="makeway-scroll-hint-bar" />
      </div>
    </div>
  );
}
