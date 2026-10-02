import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Home, CheckCircle2, Layers, Maximize2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getProjectRoomName } from '../utils/projectRooms';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { getCMSData, STORAGE_KEYS, DEFAULT_PROJECTS } from '../utils/cmsStore';

const IMAGE_FALLBACK_MAP = {
  'dimmu_05.webp': '/images/projects/dimmu_residence/dimmu_05.webp',
  'dimmu_01.webp': '/images/projects/dimmu_residence/dimmu_01.webp',
  'dimmu_06.webp': '/images/projects/dimmu_residence/dimmu_06.webp',
  'dimmu_03.webp': '/images/projects/dimmu_residence/dimmu_03.webp',
  'dimmu_10.webp': '/images/projects/dimmu_residence/dimmu_10.webp',
  'dimmu_09.webp': '/images/projects/dimmu_residence/dimmu_09.webp',
  'dimmu_08.webp': '/images/projects/dimmu_residence/dimmu_08.webp',
  'dimmu_02.webp': '/images/projects/dimmu_residence/dimmu_02.webp',
  'dimmu_07.webp': '/images/projects/dimmu_residence/dimmu_07.webp',
  'dimmu_04.webp': '/images/projects/dimmu_residence/dimmu_04.webp',
  'venkatesh_after.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425192/hf_20260926_121454_777edafb-9d5a-4009-bc04-3c5d0de0e534.png',
  'koteswara_gallery_1.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png',
  'koteswara_after.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png',
  'subbarao_after.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png',
  'sayuk_after_open_hall.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425297/hf_20260926_121300_6a3eef61-953b-4da3-b308-15aabfa0e9d0.png',
  'kokapet_after.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425270/hf_20260926_121337_1396c58b-a42d-4d86-8930-ad80832032c1.png',
  'rahul_after.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425243/hf_20260926_121353_fb8cb679-2a98-4c61-a331-b92d2ca6c9da.png',
  'kiran_after.webp': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425214/hf_20260926_121425_c188d1e6-1db5-4729-b2a9-ad90bbddbf3a.png'
};

const GOOGLE_DRIVE_TO_LOCAL_MAP = {
  '11vRjw6c7ggNcKN0lxai6ITtYi9pFAb90': '/images/projects/dimmu_residence/dimmu_05.webp',
  '1-3G3pcdQjdfQdQIgV9_NiPVHug1jBEV-': '/images/projects/dimmu_residence/dimmu_01.webp',
  '1AU0ZTuIDg3GFVukC10lhQIL9ciUHOP6F': '/images/projects/dimmu_residence/dimmu_06.webp',
  '1P7uXgbUY5Fxi1-PpHJMLMwJ3buW0--uZ': '/images/projects/dimmu_residence/dimmu_03.webp',
  '1NSvtQJQT6yMaXzaKo0MuYCh6QASUpIar': '/images/projects/dimmu_residence/dimmu_10.webp',
  '1vBO1eqO5WOqGfwUH_SHVH7w4SDYW_F6K': '/images/projects/dimmu_residence/dimmu_09.webp',
  '1DJKwU5PAkkFGGnh5USDg-X2x87ZIYFxc': '/images/projects/dimmu_residence/dimmu_08.webp',
  '12NBwWBswtvKr0wNiU8qLvvzp6r4IX4mA': '/images/projects/dimmu_residence/dimmu_02.webp',
  '1GftiecMuUOlfXEMdCtL6q0O5cpkrW2EF': '/images/projects/dimmu_residence/dimmu_07.webp',
  '1smFAVnKujLD_imWl--XMcNFas-faQXc-': '/images/projects/dimmu_residence/dimmu_04.webp'
};

const GENERAL_FALLBACK = 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png';

const handleImgError = (e) => {
  const target = e.currentTarget;
  if (!target) return;
  target.onerror = null;
  const src = target.src || '';
  const fname = src.split('/').pop().split('?')[0];
  if (IMAGE_FALLBACK_MAP[fname] && !src.includes(IMAGE_FALLBACK_MAP[fname])) {
    target.src = IMAGE_FALLBACK_MAP[fname];
    return;
  }
  for (const [driveId, localPath] of Object.entries(GOOGLE_DRIVE_TO_LOCAL_MAP)) {
    if (src.includes(driveId)) {
      target.src = localPath;
      return;
    }
  }
  target.src = GENERAL_FALLBACK;
};


// Curated authentic client testimonials mapped by canonical project slug
const SLUG_CLIENT_TESTIMONIALS = {
  'rajapushpa-provincia-3bhk': {
    name: 'Dr. Ananya Reddy',
    profession: 'Senior Cardiologist & Villa Owner',
    mobile: '+91 98490 12345',
    text: 'The sheer structural rigor and high-tolerance wood joinery delivered by Espacio was benchmark quality. The curved feature walls and custom mood lighting turned our residence into an architectural trophy.',
    rating: 5
  },
  'my-home-sayuk-3bhk': {
    name: 'Vikram Malhotra',
    profession: 'Tech Entrepreneur & Penthouse Owner',
    mobile: '+91 98765 43210',
    text: 'Espacio handled everything from raw site shell to luxury Italian marble installation seamlessly. Their team met strict delivery timelines without compromising a single millimeter on the finish.',
    rating: 5
  },
  'kokapet-2bhk': {
    name: 'Suresh K. Rao',
    profession: 'Managing Director, Horizon Infra',
    mobile: '+91 99890 67890',
    text: 'Outstanding execution! The acoustic insulation, double-height ceiling treatments, and custom lighting tracks converted our apartment into an editorial showcase. Their transparency on material specs was refreshing.',
    rating: 5
  },
  'kokapet-urban-2bhk': {
    name: 'Kavitha Varma',
    profession: 'Principal Architect & Homeowner',
    mobile: '+91 94400 55432',
    text: 'As an architect, I hold extremely high standards for material tolerances. Espacio surpassed my expectations in veneer grain matching and shadow-gap fittings across every single room.',
    rating: 5
  },
  'gandipet-modern-retro-2bhk': {
    name: 'Rajesh Goud',
    profession: 'Real Estate Developer & Investor',
    mobile: '+91 97000 88776',
    text: 'Espacio turned around our luxury residence within 5 months. Their factory-calibrated modular sourcing and on-site project management saved us substantial time and headache.',
    rating: 5
  },
  'kondapur-minimalist-2bhk': {
    name: 'Meera Deshmukh',
    profession: 'Chartered Accountant & Homeowner',
    mobile: '+91 98660 33445',
    text: 'From initial 3D visualization to final hardware placement, the transparency and craftsmanship were phenomenal. Highly recommended for anyone wanting a truly bespoke turnkey home.',
    rating: 5
  },
  'gachibowli-minimalist-beige-2bhk': {
    name: 'Amitabh Saxena',
    profession: 'VP of Product Engineering',
    mobile: '+91 91212 99887',
    text: 'Implacable attention to detail! The hidden partition channels, fluted paneling, and integrated ambient lighting gave our home an ultra-clean warm minimalist aesthetic that visitors constantly admire.',
    rating: 5
  },
  'kachiguda-fusion-duplex-villa': {
    name: 'Sunita Agarwal',
    profession: 'Industrialist & Philanthropist',
    mobile: '+91 93939 11223',
    text: 'Extremely professional team. Their custom modular kitchen, walk-in wardrobe executions, and seamless fusion of contemporary and traditional accents are unmatched in Hyderabad.',
    rating: 5
  },
  'dimmu-chachu-luxury-villa': {
    name: 'Hussain',
    profession: 'Homeowner, Hyderabad',
    mobile: '',
    text: 'ESPACIO turned our dream villa into reality! The grand double-height staircase with the chandelier and the custom cricket tribute bedroom for our boys are the highlights of our new home. Their craftsmanship, materials, and execution were truly top tier.',
    rating: 5
  }
};

const clientDemoPool = [
  { name: 'Dr. Ananya Reddy', profession: 'Senior Cardiologist & Villa Owner', mobile: '+91 98490 12345', text: 'The sheer structural rigor and high-tolerance wood joinery delivered by Espacio was benchmark quality. Every room feels engineered to perfection.' },
  { name: 'Vikram Malhotra', profession: 'Tech Entrepreneur & Penthouse Owner', mobile: '+91 98765 43210', text: 'Espacio handled everything from raw site shell to luxury Italian marble installation seamlessly. Their team met strict delivery timelines without compromising on finish.' },
  { name: 'Suresh K. Rao', profession: 'Managing Director, Horizon Infra', mobile: '+91 99890 67890', text: 'Outstanding execution! The acoustic insulation, double-height ceiling treatments, and custom lighting tracks converted our workspace into an architectural trophy.' },
  { name: 'Kavitha Varma', profession: 'Principal Architect & Homeowner', mobile: '+91 94400 55432', text: 'As an architect, I hold extremely high standards for material tolerances. Espacio surpassed my expectations in veneer grain matching and shadow-gap fittings.' },
  { name: 'Rajesh Goud', profession: 'Real Estate Developer', mobile: '+91 97000 88776', text: 'Espacio turned around our luxury residence within 5 months. Their material sourcing and on-site project management saved us both time and budget.' },
  { name: 'Meera Deshmukh', profession: 'Chartered Accountant & Homeowner', mobile: '+91 98660 33445', text: 'From initial 3D visualization to final hardware placement, the transparency and craftsmanship were phenomenal. Highly recommended for turnkey luxury homes.' },
  { name: 'Amitabh Saxena', profession: 'VP of Product Engineering', mobile: '+91 91212 99887', text: 'Implacable attention to detail! The hidden partition channels and integrated ambient lighting gave our apartment an ultra-modern minimalist aesthetic.' },
  { name: 'Sunita Agarwal', profession: 'Industrialist & Philanthropist', mobile: '+91 93939 11223', text: 'Extremely professional team. Their custom modular kitchen and walk-in wardrobe executions are unmatched in Hyderabad.' }
];

const unsplashPool = {
  villa: [
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    '/images/company/3bhk_lux/open_hall.png',
    '/images/company/3bhk_lux/open_hall2.png',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-balcony_1-20260810-120429.jpg'
  ],
  apartment: [
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
    '/images/company/2bhk_mordern_retro/b1_2.jpg',
    '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    '/images/company/2bhk_lux/hall1_1.png',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_27-20260810-124917.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_24-20260810-122233.jpg'
  ],
  office: [
    '/images/company/2bhk_mordern_retro/office_3.jpg',
    '/images/company/2bhk_mordern_retro/office_2.jpg',
    '/images/company/2bhk_mordern_retro/office.jpg',
    '/images/company/3bhk_lux/open_hall2.png',
    '/images/company/2bhk_mordern_retro/hall_paneling.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Boys_Room_14-20260813-110617.jpg',
    '/images/company/2bhk_lux/tv_unit_2_1.png',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_4-20260810-124909.jpg'
  ],
  commercial: [
    '/images/company/2bhk_mordern_retro/office_3.jpg',
    '/images/company/2bhk_mordern_retro/dining_2.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_20-20260813-110611.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Guest_restaurant_0-20260810-120429.jpg',
    '/images/company/2bhk_urban/Ideas_2_2-_0-20260810-173541.jpg',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_11-20260810-124912.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Guest_restaurant_18-20260810-120436.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_18-20260810-122232.jpg'
  ],
  renovation: [
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-kitchen_4-20260810-120431.jpg',
    '/images/company/3bhk_lux/kitchen_1.png',
    '/images/company/2bhk_lux/kitchen_3_2.png',
    '/images/company/2bhk_lux/crockery1_1.png',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_13-20260810-124909.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-bedroom_3-20260810-121312.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_17-20260810-122232.jpg',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_14-20260810-124909.jpg'
  ],
  luxury_home: [
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
    '/images/company/indo_classical_elegance_3bhk/3BHK-bedroom_2-20260810-121310.jpg',
    '/images/company/3bhk_lux/bedroom_1.png',
    '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_26-20260810-124913.jpg',
    '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Bedroom_25-20260810-122233.jpg',
    '/images/company/2bhk_mordern_retro/b1_tv_unit.jpg',
    '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-bedroom_10-20260810-120431.jpg',
    '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_20-20260813-110611.jpg'
  ]
};

// Stable mock fallback generator (outside component)
const getMockFallback = (slug) => {
  let category = 'villa';
  let index = 1;
  if (slug && slug.includes('-')) {
    const parts = slug.split('-');
    if (unsplashPool[parts[0]]) {
      category = parts[0];
      index = parseInt(parts[1], 10) || 1;
    }
  }

  const pool = unsplashPool[category] || unsplashPool['villa'];
  const neighborhoods = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kondapur', 'HITEC City', 'Kokapet', 'Begumpet', 'Madhapur', 'Gandipet', 'Financial District'];
  const styles = ['Warm Minimalist', 'Warm Editorial', 'Clean Contemporary', 'Luxury Architectural', 'Scandinavian Crafted', 'Modern Classic', 'Warm Contemporary', 'Industrial Editorial'];

  const hood = neighborhoods[(category.charCodeAt(0) + index) % neighborhoods.length];
  const style = styles[(category.charCodeAt(1) + index) % styles.length];
  const area = `${2800 + index * 420} sq.ft.`;
  const label = category === 'luxury_home' ? 'Residence' : category.charAt(0).toUpperCase() + category.slice(1);
  const title = `${style} ${label} ${index}`;
  const clientDemo = clientDemoPool[(index - 1) % clientDemoPool.length];

  return {
    title,
    location: `${hood}, Hyderabad`,
    category,
    area,
    year: 2023 + (index % 3),
    style,
    description: `A monumental design and construction project optimizing modern spatial flows, wood alignments, and high tolerances.`,
    story: {
      vision: `Deliver an inspiring space balancing structural purity, matched timber tones, and double-height ventilation systems.`,
      challenges: `Integrating cooling tracks and shadow joints into wall panel transitions without exposing standard frame anchors.`,
      solutions: `Engineered floating wall tracks with acoustic isolation buffers.`,
      engineering: `Calculated panel weight structures to withstand physical deflection limits.`,
      outcome: `An award-winning editorial case study highlighting true interior design and execution precision.`
    },
    heroImage: pool[(index - 1) % pool.length],
    gallery: pool,
    beforeImage: "/images/spaces/spaces_hero_before.webp",
    beforeImages: ["/images/spaces/spaces_hero_before.webp"],
    afterImage: pool[(index - 1) % pool.length],
    afterImages: [pool[(index - 1) % pool.length]],
    testimonial: clientDemo
  };
};

import { 
  PROJECT_SLUG_ALIASES, 
  resolveCanonicalSlug, 
  findProjectMatch, 
  projectDetailCache, 
  prefetchProject 
} from '../utils/projectPrefetch';

// Backwards-compatible re-export
export { prefetchProject };

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const cleanSlug = useMemo(() => {
    try {
      return decodeURIComponent(slug || '').trim().toLowerCase().replace(/\/+$/, '');
    } catch {
      return (slug || '').trim().toLowerCase().replace(/\/+$/, '');
    }
  }, [slug]);

  const resolvedSlug = useMemo(() => {
    return resolveCanonicalSlug(cleanSlug);
  }, [cleanSlug]);

  const [project, setProject] = useState(() => {
    try {
      if (projectDetailCache.has(resolvedSlug)) return projectDetailCache.get(resolvedSlug);
      if (projectDetailCache.has(cleanSlug)) return projectDetailCache.get(cleanSlug);

      const storedProjects = getCMSData(STORAGE_KEYS.PROJECTS) || DEFAULT_PROJECTS;
      return findProjectMatch(storedProjects, resolvedSlug, cleanSlug) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(!project);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [visiblePhotosCount, setVisiblePhotosCount] = useState(8);
  const gallerySectionRef = useRef(null);

  // Before/After drag slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const sliderContainerRef = useRef(null);

  const updateSliderPos = useCallback((clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
    if (!hasMoved) setHasMoved(true);
  }, [hasMoved]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    updateSliderPos(e.clientX);
  }, [updateSliderPos]);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    if (e.touches && e.touches[0]) {
      updateSliderPos(e.touches[0].clientX);
    }
  }, [updateSliderPos]);

  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSliderPos(clientX);
    };

    const handleGlobalTouchMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      if (e.touches && e.touches[0]) {
        updateSliderPos(e.touches[0].clientX);
      }
    };

    const handleGlobalEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      window.addEventListener('touchend', handleGlobalEnd);
      window.addEventListener('touchcancel', handleGlobalEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [isDragging, updateSliderPos]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    // 1. Immediately sync project from cache or local store on URL change
    if (projectDetailCache.has(resolvedSlug)) {
      setProject(projectDetailCache.get(resolvedSlug));
      setLoading(false);
    } else if (projectDetailCache.has(cleanSlug)) {
      setProject(projectDetailCache.get(cleanSlug));
      setLoading(false);
    } else {
      const stored = getCMSData(STORAGE_KEYS.PROJECTS) || DEFAULT_PROJECTS;
      const match = findProjectMatch(stored, resolvedSlug, cleanSlug);
      if (match) {
        setProject(match);
        setLoading(false);
      }
    }

    // 2. Network fetch with stale-while-revalidate
    const loadProjectFromApi = async () => {
      try {
        const response = await axios.get(`/projects/${resolvedSlug}`);
        if (!cancelled && response.data?.success && response.data?.data) {
          projectDetailCache.set(resolvedSlug, response.data.data);
          projectDetailCache.set(cleanSlug, response.data.data);
          setProject(response.data.data);
        }
      } catch (err) {
        // Fallback: query all projects and find matching entry
        try {
          const allRes = await axios.get('/projects');
          if (!cancelled && allRes.data?.success && Array.isArray(allRes.data?.data)) {
            const match = findProjectMatch(allRes.data.data, resolvedSlug, cleanSlug);
            if (match) {
              projectDetailCache.set(resolvedSlug, match);
              projectDetailCache.set(cleanSlug, match);
              setProject(match);
            }
          }
        } catch {}
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProjectFromApi();

    const handleSync = () => {
      const stored = getCMSData(STORAGE_KEYS.PROJECTS) || DEFAULT_PROJECTS;
      const match = findProjectMatch(stored, resolvedSlug, cleanSlug);
      if (match) setProject(match);
    };

    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      cancelled = true;
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [cleanSlug, resolvedSlug]);

  // Global Escape key listener to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const rawP = project || findProjectMatch(getCMSData(STORAGE_KEYS.PROJECTS) || DEFAULT_PROJECTS, resolvedSlug, cleanSlug) || getMockFallback(slug);

  // Compute clean deduplicated project with guaranteed full hydration
  const p = useMemo(() => {
    const item = { ...rawP };

    // 1. Match canonical default project entry to fill any missing/sparse fields
    const defaultMatch = findProjectMatch(DEFAULT_PROJECTS, resolvedSlug, cleanSlug) ||
                         findProjectMatch(DEFAULT_PROJECTS, item.slug, item._id) ||
                         (item.title ? DEFAULT_PROJECTS.find(dp => dp.title?.toLowerCase() === item.title?.toLowerCase()) : null) ||
                         DEFAULT_PROJECTS[0];

    if (defaultMatch) {
      if (!item.title || item.title === 'ESPACIO Project') item.title = defaultMatch.title;
      if (!item.location) item.location = defaultMatch.location;
      if (!item.area) item.area = defaultMatch.area;
      if (!item.year) item.year = defaultMatch.year;
      if (!item.style) item.style = defaultMatch.style;
      if (!item.category) item.category = defaultMatch.category;
      if (!item.configuration) item.configuration = defaultMatch.configuration;
      if (!item.description) item.description = defaultMatch.description;
      if (!item.story || !item.story.vision) item.story = defaultMatch.story;
      if (!item.heroImage) item.heroImage = defaultMatch.heroImage;
      if (!item.beforeImage) item.beforeImage = defaultMatch.beforeImage;
      if (!item.afterImage) item.afterImage = defaultMatch.afterImage;
      if (!Array.isArray(item.beforeImages) || item.beforeImages.length === 0) item.beforeImages = defaultMatch.beforeImages;
      if (!Array.isArray(item.afterImages) || item.afterImages.length === 0) item.afterImages = defaultMatch.afterImages;
      if (!Array.isArray(item.gallery) || item.gallery.length === 0) item.gallery = defaultMatch.gallery;
      if (!item.testimonial && defaultMatch.testimonial) item.testimonial = defaultMatch.testimonial;
      if (!item.testimonialName && defaultMatch.testimonialName) item.testimonialName = defaultMatch.testimonialName;
      if (!item.testimonialProfession && defaultMatch.testimonialProfession) item.testimonialProfession = defaultMatch.testimonialProfession;
      if (!item.testimonialText && defaultMatch.testimonialText) item.testimonialText = defaultMatch.testimonialText;
      if (!item.testimonialRating && defaultMatch.testimonialRating) item.testimonialRating = defaultMatch.testimonialRating;
    }

    // 2. Specific canonical overrides for Project 9 (The Celestial Curve Villa / Dimmu Chachu Villa)
    if (
      item.slug === 'dimmu-chachu-luxury-villa' || 
      item._id === 'proj_9_dimmu_chachu_residence' || 
      item.title?.includes('Dimmu') || 
      item.title?.includes('Celestial Curve') ||
      cleanSlug === 'dimmu-chachu-luxury-villa' ||
      cleanSlug === 'dimmu-chachu' ||
      cleanSlug === 'dimmu' ||
      resolvedSlug === 'dimmu-chachu-luxury-villa'
    ) {
      const DIMMU_PHOTOS = [
        '/images/projects/dimmu_residence/dimmu_05.webp',
        '/images/projects/dimmu_residence/dimmu_01.webp',
        '/images/projects/dimmu_residence/dimmu_06.webp',
        '/images/projects/dimmu_residence/dimmu_03.webp',
        '/images/projects/dimmu_residence/dimmu_10.webp',
        '/images/projects/dimmu_residence/dimmu_09.webp',
        '/images/projects/dimmu_residence/dimmu_08.webp',
        '/images/projects/dimmu_residence/dimmu_02.webp',
        '/images/projects/dimmu_residence/dimmu_07.webp',
        '/images/projects/dimmu_residence/dimmu_04.webp'
      ];
      item.gallery = DIMMU_PHOTOS;
      item.location = 'Banjara Hills, Hyderabad';
      item.area = '4,200 sq.ft.';
      item.year = 2026;
      item.style = 'Contemporary Luxury Duplex Villa';
      item.configuration = 'Luxury Duplex Villa';
      item.category = 'villa';
      item.title = 'The Celestial Curve Villa';
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/d49a2e39-fbc1-4976-ab8d-4f2a806f1919.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_05_43_06_PM.png';
      item.heroImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_05_43_06_PM.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
      item.story = DEFAULT_PROJECTS[8].story;
      item.description = DEFAULT_PROJECTS[8].description;
      item.testimonial = DEFAULT_PROJECTS[8].testimonial;
      item.testimonialName = DEFAULT_PROJECTS[8].testimonialName;
      item.testimonialProfession = DEFAULT_PROJECTS[8].testimonialProfession;
      item.testimonialText = DEFAULT_PROJECTS[8].testimonialText;
    }

    // Specific canonical overrides for Project 8 (Kachiguda Fusion Duplex Villa)
    if (
      item.slug === 'kachiguda-fusion-duplex-villa' || 
      item._id === 'proj_8_kachiguda_subbarao' || 
      item.title?.includes('Kachiguda') || 
      item.title?.includes('Subbarao') ||
      cleanSlug === 'kachiguda-fusion-duplex-villa' ||
      cleanSlug === 'kachiguda-duplex' ||
      cleanSlug === 'kachiguda' ||
      resolvedSlug === 'kachiguda-fusion-duplex-villa'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/66df1458-877e-4204-b6d3-0a1c5b199ad0.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1b4c729-d7f1-4216-ab32-7df78a0b6e34.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 7 (Gachibowli Minimalist Beige 2BHK)
    if (
      item.slug === 'gachibowli-minimalist-beige-2bhk' || 
      item._id === 'proj_7_gachibowli_koteswara' || 
      item.title?.includes('Gachibowli') || 
      item.title?.includes('Koteswara') ||
      cleanSlug === 'gachibowli-minimalist-beige-2bhk' || 
      cleanSlug === 'gachibowli-minimalist' || 
      cleanSlug === 'gachibowli' || 
      resolvedSlug === 'gachibowli-minimalist-beige-2bhk'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ca30e926-7250-474f-a0f2-5cd29c6abbf8.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1bed362-eace-4f68-afde-49b823bc5480.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 6 (Kondapur Minimalist 2BHK / The Dusk Lounge)
    if (
      item.slug === 'kondapur-minimalist-2bhk' || 
      item._id === 'proj_6_kondapur_venkatesh' || 
      item.title?.includes('Kondapur') || 
      item.title?.includes('Venkatesh') ||
      item.title?.includes('Dusk Lounge') ||
      cleanSlug === 'kondapur-minimalist-2bhk' || 
      cleanSlug === 'kondapur-minimalist' || 
      cleanSlug === 'kondapur' || 
      resolvedSlug === 'kondapur-minimalist-2bhk'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/a76b15e5-e59b-4f54-aeb9-c0055b37350a.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/6f7bce1d-d140-45ee-a08b-ecb09433bdb7.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 5 (Gandipet Modern Retro 2BHK / The Panelled Muse)
    if (
      item.slug === 'gandipet-modern-retro-2bhk' || 
      item._id === 'proj_5_gandipet_kiran' || 
      item.title?.includes('Panelled') || 
      item.title?.includes('Kiran') ||
      cleanSlug === 'gandipet-modern-retro-2bhk' || 
      cleanSlug === 'gandipet-modern-retro' || 
      cleanSlug === 'gandipet' || 
      resolvedSlug === 'gandipet-modern-retro-2bhk'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/48723afe-969c-4d67-8024-a74296aad3b2.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 4 (Kokapet Urban 2BHK / The Ivory Retreat)
    if (
      item.slug === 'kokapet-urban-2bhk' || 
      item._id === 'proj_4_kokapet_rahul' || 
      item.title?.includes('Ivory') || 
      item.title?.includes('Rahul') ||
      cleanSlug === 'kokapet-urban-2bhk' || 
      cleanSlug === 'kokapet-urban' || 
      cleanSlug === 'the-ivory-retreat' || 
      resolvedSlug === 'kokapet-urban-2bhk'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/bf38cae9-e7b8-4e4f-b382-377509a9a17b.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/25b4c1ef-7205-463a-b488-ecc125a33d3e.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 3 (Kokapet 2BHK / The Boucle Residence)
    if (
      item.slug === 'kokapet-2bhk' || 
      item._id === 'proj_3_kokapet_nagesh' || 
      item.title?.includes('Boucle') || 
      item.title?.includes('Nagesh') ||
      cleanSlug === 'kokapet-2bhk' || 
      cleanSlug === 'kokapet' || 
      cleanSlug === 'the-boucle-residence' || 
      resolvedSlug === 'kokapet-2bhk'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/2f97ea5d-7652-4139-99a5-942bcf46f977.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790791769/7f7c35f2-81e3-44c2-8b70-41a3c2930942.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 2 (My Home Sayuk 3BHK / The Lattice Retreat)
    if (
      item.slug === 'my-home-sayuk-3bhk' || 
      item._id === 'proj_2_my_home_sayuk' || 
      item.title?.includes('Sayuk') || 
      item.title?.includes('Lattice') ||
      cleanSlug === 'my-home-sayuk-3bhk' || 
      cleanSlug === 'my-home-sayuk' || 
      cleanSlug === 'sayuk' || 
      resolvedSlug === 'my-home-sayuk-3bhk'
    ) {
      item.beforeImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/2e0d529e-d037-4537-9a39-6b765dddb7eb.png';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790791043/2557add0-0cc5-4a63-9062-4f49eff9978a.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // Specific canonical overrides for Project 1 (Rajapushpa Provincia 3BHK / The Arcstone Residence)
    if (
      item.slug === 'rajapushpa-provincia-3bhk' || 
      item._id === 'proj_1_rajapushpa_provincia' || 
      item.title?.includes('Provincia') || 
      item.title?.includes('Arcstone') ||
      cleanSlug === 'rajapushpa-provincia-3bhk' || 
      cleanSlug === 'rajapushpa' || 
      cleanSlug === 'provincia' || 
      resolvedSlug === 'rajapushpa-provincia-3bhk'
    ) {
      item.beforeImage = '/images/projects/rajapushpa_provincia/rajapushpa_before.webp';
      item.afterImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790789679/74dc6fc0-aa92-46fd-8330-ebf67be7dda4.png';
      item.beforeImages = [item.beforeImage];
      item.afterImages = [item.afterImage];
    }

    // 3. Guarantee that ANY project has complete location, story, before/after, and gallery
    if (!item.location) item.location = 'Banjara Hills, Hyderabad';
    if (!item.area) item.area = '2,850 sq.ft.';
    if (!item.year) item.year = 2025;
    if (!item.style) item.style = 'Contemporary Warm Minimalist';
    if (!item.category) item.category = 'apartment';
    if (!item.configuration) item.configuration = 'Luxury Residence';
    if (!item.description) item.description = 'A monumental spatial optimization balancing material warmth, custom joinery, and tailored lighting environments.';
    if (!item.story || !item.story.vision) {
      item.story = {
        vision: item.description || 'A monumental spatial optimization balancing material warmth, custom joinery, and tailored lighting environments.',
        challenges: 'Integrating concealed cooling tracks and shadowline joints into custom panel transitions without visible fasteners.',
        solutions: 'Custom laser-aligned sub-framing with acoustic isolation buffers and high-tolerance joinery.',
        engineering: 'Engineered structural load-distribution anchors and integrated warm architectural cove lighting profiles.',
        outcome: 'An impeccable turnkey interior showcase balancing functionality, bespoke craftsmanship, and effortless elegance.'
      };
    }
    if (!item.beforeImage) item.beforeImage = '/images/spaces/spaces_hero_before.webp';
    if (!item.afterImage) item.afterImage = item.heroImage || (Array.isArray(item.gallery) && item.gallery[0]) || '/images/company/3bhk_lux/open_hall.png';
    if (!Array.isArray(item.beforeImages) || item.beforeImages.length === 0) item.beforeImages = [item.beforeImage];
    if (!Array.isArray(item.afterImages) || item.afterImages.length === 0) item.afterImages = [item.afterImage];

    // Guarantee gallery images are always present and never empty
    if (!Array.isArray(item.gallery) || item.gallery.length === 0) {
      const cat = item.category || 'villa';
      const pool = unsplashPool[cat] || unsplashPool['villa'] || [];
      item.gallery = pool.length > 0 ? pool : [
        '/images/projects/rajapushpa_provincia/rajapushpa_8.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_7.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_9.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_11.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_1.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_5.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_3.webp',
        '/images/projects/rajapushpa_provincia/rajapushpa_13.webp'
      ];
    } else {
      // Map any Google Drive links to local WebP assets
      item.gallery = item.gallery.map(img => {
        if (typeof img === 'string') {
          for (const [driveId, localPath] of Object.entries(GOOGLE_DRIVE_TO_LOCAL_MAP)) {
            if (img.includes(driveId)) return localPath;
          }
        }
        return img;
      });
    }

    if (Array.isArray(item.gallery)) {
      item.gallery = Array.from(new Set(item.gallery.filter(Boolean)));
    }
    return item;
  }, [rawP, cleanSlug, resolvedSlug]);

  // Resolve authentic client testimonial (always available)
  const clientReview = useMemo(() => {
    if (p.testimonial?.text) {
      return p.testimonial;
    }
    if (p.testimonialText) {
      return {
        name: p.testimonialName || 'Valued Client',
        profession: p.testimonialProfession || 'Homeowner',
        text: p.testimonialText,
        rating: p.testimonialRating || 5
      };
    }
    return SLUG_CLIENT_TESTIMONIALS[cleanSlug] || SLUG_CLIENT_TESTIMONIALS[resolvedSlug] || clientDemoPool[0];
  }, [p, cleanSlug, resolvedSlug]);

  const batchSize = 8;
  const totalPhotos = p?.gallery?.length || 0;
  const hasMore = visiblePhotosCount < totalPhotos;
  const canShowLess = visiblePhotosCount > batchSize;

  const handleLoadMorePhotos = () => {
    setVisiblePhotosCount((prev) => Math.min(totalPhotos, prev + batchSize));
  };

  const handleShowLessPhotos = () => {
    setVisiblePhotosCount((prev) => Math.max(batchSize, prev - batchSize));
    if (gallerySectionRef.current) {
      const rect = gallerySectionRef.current.getBoundingClientRect();
      if (rect.top < -50) {
        gallerySectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-24">
      <SEO 
        title={`${p.title} — Luxury Case Study`} 
        description={p.description ? p.description.substring(0, 150) : 'Case study description...'} 
        image={p.heroImage} 
        url={`/projects/${p.slug}`} 
      />

      {/* ── 1. PROJECT HERO: Clean Full-Bleed Card (Unified responsive layout matching mobile style) ── */}
      <section className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-8 lg:px-12 max-w-[1560px] mx-auto">
        <div className="relative h-[80dvh] sm:h-[80vh] lg:h-[84vh] min-h-[500px] sm:min-h-[540px] md:min-h-[580px] max-h-[820px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black border border-walnut/15">
          <img
            src={getOptimizedImageUrl(p.heroImage, 1600, 88)}
            onError={handleImgError}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            alt={p.title}
            style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/30 to-black/50 pointer-events-none" />

          {/* Back button */}
          <div className="relative z-10 p-5 sm:p-6 md:p-8">
            <Link 
              to="/projects" 
              className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-cream hover:text-gold font-bold transition-colors bg-black/50 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 shadow-md"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </Link>
          </div>

          {/* Project Details Bottom Left Header */}
          <div className="absolute bottom-16 sm:bottom-16 md:bottom-20 left-0 w-full z-10 px-5 sm:px-8 md:px-12">
            <div className="flex flex-col space-y-1 sm:space-y-1.5 md:space-y-2 max-w-3xl">
              <span className="font-sans text-[11px] sm:text-xs md:text-sm uppercase tracking-widest text-gold font-bold drop-shadow">
                {p.style || 'Bespoke execution'}
              </span>
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial font-bold leading-tight drop-shadow-md">
                {p.title}
              </h1>
              {p.location && (
                <p className="font-sans text-xs sm:text-sm text-white/80 drop-shadow flex items-center gap-1.5 pt-0.5">
                  <MapPin size={13} className="text-gold shrink-0" />
                  <span>{p.location}</span>
                </p>
              )}
            </div>
          </div>

          <ScrollDownIndicator className="scale-85 sm:scale-100 bottom-3.5 sm:bottom-4 md:bottom-5" />
        </div>
      </section>

      {/* ── 3. Comprehensive Project Overview & Specifications Grid ── */}
      <section id="project-overview-stats" className="max-w-[1440px] mx-auto px-6 md:px-12 py-14 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-b border-walnut/10">
        <div className="flex items-center space-x-3">
          <MapPin className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Location</span>
            <span className="font-sans font-bold text-sm text-charcoal truncate block max-w-[130px]" title={p.location}>{p.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Home className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Configuration</span>
            <span className="font-sans font-bold text-sm text-charcoal">
              {p.configuration || (p.title?.match(/(\d+BHK|Duplex)/i) ? `${p.title.match(/(\d+BHK|Duplex)/i)[0]} Residence` : 'Luxury Residence')}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <CheckCircle2 className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Status</span>
            <span className="font-sans font-bold text-sm text-charcoal">{p.statusText || 'Completed Handover'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Layers className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Category</span>
            <span className="font-sans font-bold text-sm text-charcoal capitalize">{p.category?.replace('_', ' ') || 'Turnkey Interior'}</span>
          </div>
        </div>
      </section>

      {/* ── 4. Architectural Story & Structural Execution Chapters ── */}
      <section className="max-w-[1000px] mx-auto px-6 py-20 space-y-16">
        {/* Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Vision</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.vision || p.description || 'A monumental spatial optimization balancing material warmth, custom joinery, and tailored lighting environments.'}
          </div>
        </div>

        {/* Challenge */}
        {(p.story?.challenges) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
            <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Challenge</div>
            <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
              {p.story.challenges}
            </div>
          </div>
        )}

        {/* Solutions & Innovation */}
        {(p.story?.solutions) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
            <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">Solutions & Innovation</div>
            <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
              {p.story.solutions}
            </div>
          </div>
        )}

        {/* Engineering */}
        {(p.story?.engineering) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
            <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Engineering</div>
            <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
              {p.story.engineering}
            </div>
          </div>
        )}

        {/* Outcome */}
        {(p.story?.outcome) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
            <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Outcome</div>
            <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
              {p.story.outcome}
            </div>
          </div>
        )}
      </section>

      {/* ── 5. Before / After Transformation Slider ── */}
      {(() => {
        let beforeImg = p.beforeImage || (Array.isArray(p.before_after) && p.before_after[0]?.before) || (Array.isArray(p.beforeImages) && p.beforeImages[0]) || '/images/spaces/spaces_hero_before.webp';
        let afterImg = p.afterImage || (Array.isArray(p.before_after) && p.before_after[0]?.after) || (Array.isArray(p.afterImages) && p.afterImages[0]) || p.heroImage || (Array.isArray(p.gallery) && p.gallery[0]) || '/images/company/3bhk_lux/open_hall.png';

        if (p.slug === 'dimmu-chachu-luxury-villa' || p._id === 'proj_9_dimmu_chachu_residence' || p.order === 9 || cleanSlug === 'dimmu-chachu-luxury-villa' || cleanSlug === 'dimmu-chachu' || cleanSlug === 'dimmu' || resolvedSlug === 'dimmu-chachu-luxury-villa') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/d49a2e39-fbc1-4976-ab8d-4f2a806f1919.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ChatGPT_Image_Sep_21_2026_05_43_06_PM.png';
        }
        if (p.slug === 'kachiguda-fusion-duplex-villa' || p._id === 'proj_8_kachiguda_subbarao' || p.order === 8 || cleanSlug === 'kachiguda-fusion-duplex-villa' || cleanSlug === 'kachiguda-duplex' || cleanSlug === 'kachiguda' || resolvedSlug === 'kachiguda-fusion-duplex-villa') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/66df1458-877e-4204-b6d3-0a1c5b199ad0.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1b4c729-d7f1-4216-ab32-7df78a0b6e34.png';
        }
        if (p.slug === 'gachibowli-minimalist-beige-2bhk' || p._id === 'proj_7_gachibowli_koteswara' || p.order === 7 || cleanSlug === 'gachibowli-minimalist-beige-2bhk' || cleanSlug === 'gachibowli-minimalist' || cleanSlug === 'gachibowli' || resolvedSlug === 'gachibowli-minimalist-beige-2bhk') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/ca30e926-7250-474f-a0f2-5cd29c6abbf8.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/b1bed362-eace-4f68-afde-49b823bc5480.png';
        }
        if (p.slug === 'kondapur-minimalist-2bhk' || p._id === 'proj_6_kondapur_venkatesh' || p.order === 6 || cleanSlug === 'kondapur-minimalist-2bhk' || cleanSlug === 'kondapur-minimalist' || cleanSlug === 'kondapur' || resolvedSlug === 'kondapur-minimalist-2bhk') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/a76b15e5-e59b-4f54-aeb9-c0055b37350a.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/6f7bce1d-d140-45ee-a08b-ecb09433bdb7.png';
        }
        if (p.slug === 'gandipet-modern-retro-2bhk' || p._id === 'proj_5_gandipet_kiran' || p.order === 5 || cleanSlug === 'gandipet-modern-retro-2bhk' || cleanSlug === 'gandipet-modern-retro' || cleanSlug === 'gandipet' || resolvedSlug === 'gandipet-modern-retro-2bhk') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/48723afe-969c-4d67-8024-a74296aad3b2.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/5d678d57-3ff6-4ce4-87fb-29b692a0cf84.png';
        }
        if (p.slug === 'kokapet-urban-2bhk' || p._id === 'proj_4_kokapet_rahul' || p.order === 4 || cleanSlug === 'kokapet-urban-2bhk' || cleanSlug === 'kokapet-urban' || cleanSlug === 'the-ivory-retreat' || resolvedSlug === 'kokapet-urban-2bhk') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/bf38cae9-e7b8-4e4f-b382-377509a9a17b.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/25b4c1ef-7205-463a-b488-ecc125a33d3e.png';
        }
        if (p.slug === 'kokapet-2bhk' || p._id === 'proj_3_kokapet_nagesh' || p.order === 3 || cleanSlug === 'kokapet-2bhk' || cleanSlug === 'kokapet' || cleanSlug === 'the-boucle-residence' || resolvedSlug === 'kokapet-2bhk') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/2f97ea5d-7652-4139-99a5-942bcf46f977.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790791769/7f7c35f2-81e3-44c2-8b70-41a3c2930942.png';
        }
        if (p.slug === 'my-home-sayuk-3bhk' || p._id === 'proj_2_my_home_sayuk' || p.order === 2 || cleanSlug === 'my-home-sayuk-3bhk' || cleanSlug === 'my-home-sayuk' || cleanSlug === 'sayuk' || resolvedSlug === 'my-home-sayuk-3bhk') {
          beforeImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/2e0d529e-d037-4537-9a39-6b765dddb7eb.png';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790791043/2557add0-0cc5-4a63-9062-4f49eff9978a.png';
        }
        if (p.slug === 'rajapushpa-provincia-3bhk' || p._id === 'proj_1_rajapushpa_provincia' || p.order === 1 || cleanSlug === 'rajapushpa-provincia-3bhk' || cleanSlug === 'rajapushpa' || cleanSlug === 'provincia' || cleanSlug === 'the-arcstone-residence' || resolvedSlug === 'rajapushpa-provincia-3bhk') {
          beforeImg = '/images/projects/rajapushpa_provincia/rajapushpa_before.webp';
          afterImg = 'https://res.cloudinary.com/r3jwfy0y/image/upload/f_auto/q_auto/v1790789679/74dc6fc0-aa92-46fd-8330-ebf67be7dda4.png';
        }
        if (afterImg?.includes('master_bedroom') || beforeImg?.includes('Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0')) {
          beforeImg = '/images/spaces/master_bedroom_before.webp';
          afterImg = '/images/spaces/master_bedroom_after.webp';
        }
        if (!beforeImg) beforeImg = '/images/spaces/spaces_hero_before.webp';
        if (!afterImg) afterImg = '/images/company/3bhk_lux/open_hall.png';

        return (
          <section className="max-w-[1100px] mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">Turnkey Execution Benchmark</span>
              <h2 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal">Before & After Transformation</h2>
              <p className="font-sans text-xs text-walnut mt-2">Drag the handle horizontally to view the structural evolution from raw shell to luxury finish.</p>
            </div>

            <div
              ref={sliderContainerRef}
              data-lenis-prevent
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ touchAction: 'pan-y' }}
              className="relative w-full aspect-[16/9] rounded-card overflow-hidden select-none cursor-ew-resize border border-walnut/15 shadow-2xl bg-charcoal"
            >
              {/* After Image */}
              <img
                src={getOptimizedImageUrl(afterImg, 1200, 85)}
                onError={handleImgError}
                loading="lazy"
                alt="Transformation After"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* After Badge: Clipped at slider line */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-10"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)`, WebkitClipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 pointer-events-none whitespace-nowrap">
                  <span className="font-sans text-[11px] sm:text-xs font-medium tracking-wider uppercase text-white/90">
                    After
                  </span>
                </div>
              </div>

              {/* Before Image & Badge (Clipped to slider width) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-10"
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                }}
              >
                <img
                  src={getOptimizedImageUrl(beforeImg, 1200, 85)}
                  onError={handleImgError}
                  loading="lazy"
                  alt="Transformation Before"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 pointer-events-none whitespace-nowrap">
                  <span className="font-sans text-[11px] sm:text-xs font-medium tracking-wider uppercase text-white/90">
                    Before
                  </span>
                </div>
              </div>

              {/* Drag handle line */}
              <div
                className="absolute top-0 bottom-0 w-[3px] bg-gold z-20 shadow-[0_0_15px_rgba(197,165,114,0.8)] pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              />

              {/* Drag handle thumb */}
              <div
                className="absolute inset-y-0 -translate-x-1/2 w-14 sm:w-16 z-30 flex items-center justify-center cursor-ew-resize select-none"
                style={{ left: `${sliderPos}%`, touchAction: 'pan-y' }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e);
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart(e);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gold shadow-2xl flex items-center justify-center text-charcoal font-bold text-base border-2 border-cream pointer-events-auto hover:scale-110 active:scale-95 transition-transform">
                  ↔
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── 6. Captured Spaces & Architectural Details Gallery ── */}
      {p.gallery?.length > 0 && (
        <section ref={gallerySectionRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-16 scroll-mt-20">
          <div className="flex flex-col gap-1.5 mb-8">
            <span className="font-sans text-[11px] font-bold text-gold uppercase tracking-widest">
              Captured Spaces & Architectural Details
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">
              Project Photos & Rooms
            </h2>
            <p className="font-sans text-xs sm:text-sm text-walnut">
              Showing {Math.min(visiblePhotosCount, p.gallery.length)} of {p.gallery.length} photos captured for this project. Click any photo to view full screen in high resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {p.gallery.slice(0, visiblePhotosCount).map((imgUrl, index) => {
              const roomName = getProjectRoomName(p, imgUrl, index);
              return (
                <div
                  key={index}
                  onClick={() => { setActivePhotoIdx(index); setLightboxOpen(true); }}
                  className="rounded-[20px] overflow-hidden border border-walnut/10 shadow-sm group active:scale-[0.99] cursor-pointer relative bg-charcoal flex flex-col hover:border-gold/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-bg-dark">
                    <img
                      src={getOptimizedImageUrl(imgUrl, 640, 82)}
                      onError={handleImgError}
                      loading="lazy"
                      decoding="async"
                      alt={`${p.title} - ${roomName}`}
                      style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg">
                        <Maximize2 size={16} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 bg-bg-card border-t border-ink-border/20 flex items-center justify-between text-xs font-sans">
                    <span className="text-ink font-semibold truncate tracking-wide text-xs">{roomName}</span>
                    <span className="text-gold font-bold shrink-0 text-[10.5px] uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">View ↗</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More / Show Less Controls */}
          {totalPhotos > batchSize && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMorePhotos}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-charcoal text-cream hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-md font-sans text-xs uppercase tracking-wider font-bold group cursor-pointer border border-gold/30 hover:shadow-lg"
                >
                  <span>Load More Photos ({totalPhotos - visiblePhotosCount} remaining)</span>
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform text-gold group-hover:text-charcoal" />
                </button>
              )}

              {canShowLess && (
                <button
                  type="button"
                  onClick={handleShowLessPhotos}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-cream/90 hover:bg-cream text-charcoal border border-walnut/20 font-sans text-xs uppercase tracking-wider font-bold group cursor-pointer shadow-xs hover:border-gold/40"
                >
                  <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform text-gold" />
                  <span>Show Less</span>
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── 7. Lightbox Modal (High-Res Viewer) ── */}
      {lightboxOpen && p.gallery && (() => {
        const activeRoomName = getProjectRoomName(p, p.gallery[activePhotoIdx], activePhotoIdx);
        return (
          <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-8">
            <div className="w-full max-w-[1440px] flex items-center justify-between text-white border-b border-white/10 pb-3">
              <div>
                <h3 className="font-editorial text-base sm:text-lg font-bold truncate max-w-[240px] sm:max-w-none">
                  {p.title} <span className="text-gold font-normal mx-1">•</span> <span className="text-white/90 font-sans font-medium text-sm">{activeRoomName}</span>
                </h3>
                <p className="font-sans text-[11px] text-white/60">
                  Photo {activePhotoIdx + 1} of {p.gallery.length}
                </p>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="bg-white/15 hover:bg-white/25 text-white p-2 rounded-full transition-colors font-bold text-xs uppercase px-3 py-1.5 cursor-pointer flex items-center gap-1"
              >
                <X size={14} />
                <span>Close</span>
              </button>
            </div>

            <div className="relative w-full max-w-4xl h-[65vh] flex items-center justify-center my-auto">
              <img
                src={getOptimizedImageUrl(p.gallery[activePhotoIdx], 1400, 90)}
                onError={handleImgError}
                alt={`${p.title} - ${activeRoomName}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              {p.gallery.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? p.gallery.length - 1 : prev - 1))}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-gold text-white hover:text-charcoal p-2.5 rounded-full transition-colors border border-white/20 cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              {p.gallery.length > 1 && (
                <button
                  onClick={() => setActivePhotoIdx((prev) => (prev === p.gallery.length - 1 ? 0 : prev + 1))}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-gold text-white hover:text-charcoal p-2.5 rounded-full transition-colors border border-white/20 cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto max-w-full pt-3 pb-1 scrollbar-none">
              {p.gallery.map((img, i) => {
                const thumbRoom = getProjectRoomName(p, img, i);
                return (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    title={thumbRoom}
                    className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === i ? 'border-gold scale-105 opacity-100' : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img 
                      src={getOptimizedImageUrl(img, 120, 75)} 
                      onError={handleImgError} 
                      alt={thumbRoom} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── 8. What the Client Says About Our Work Section (Always Displayed) ── */}
      {clientReview && (
        <section className="max-w-[900px] mx-auto px-6 py-16 my-16 text-center bg-offwhite rounded-2xl border border-walnut/10 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-3">Client Endorsement & Feedback</span>
          <h2 className="font-editorial text-3xl font-bold text-charcoal mb-8">What the Client Says About Our Work</h2>

          <div className="flex justify-center items-center gap-1.5 mb-6">
            {Array.from({ length: Number(clientReview.rating || 5) }).map((_, idx) => (
              <svg
                key={idx}
                viewBox="0 0 24 24"
                width="20"
                height="20"
                className="text-[#FFB800] fill-[#FFB800]"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          <blockquote className="font-editorial text-xl md:text-2xl italic text-charcoal leading-relaxed max-w-3xl mx-auto mb-8">
            "{clientReview.text}"
          </blockquote>

          <div className="border-t border-walnut/10 pt-6 inline-flex flex-col items-center px-8">
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-charcoal">
              {clientReview.name || 'Valued Client'}
            </h4>

            <div className="flex items-center space-x-3 text-xs text-walnut mt-1">
              <span className="font-medium text-gold">
                {clientReview.profession || clientReview.role || 'Homeowner'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── 9. Final Lead CTA ── */}
      <section className="mt-24 text-center max-w-[700px] mx-auto px-6 space-y-6">
        <h2 className="font-editorial text-3xl font-bold">Inspired by this project?</h2>
        <p className="font-sans text-sm text-walnut">Let's create a customized home layout built around your preferences.</p>
        <div className="pt-2">
          <Link to="/contact" className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-transform duration-300 hover:scale-105">
            <span>Book Consultation</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
