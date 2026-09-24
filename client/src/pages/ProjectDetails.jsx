import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Home, CheckCircle2, Layers, Maximize2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getProjectRoomName } from '../utils/projectRooms';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { HeroCarousel } from '../components/ui/hero-carousel';

const IMAGE_FALLBACK_MAP = {
  'dimmu_05.webp': 'https://lh3.googleusercontent.com/d/11vRjw6c7ggNcKN0lxai6ITtYi9pFAb90',
  'dimmu_01.webp': 'https://lh3.googleusercontent.com/d/1-3G3pcdQjdfQdQIgV9_NiPVHug1jBEV-',
  'dimmu_06.webp': 'https://lh3.googleusercontent.com/d/1AU0ZTuIDg3GFVukC10lhQIL9ciUHOP6F',
  'dimmu_03.webp': 'https://lh3.googleusercontent.com/d/1P7uXgbUY5Fxi1-PpHJMLMwJ3buW0--uZ',
  'dimmu_10.webp': 'https://lh3.googleusercontent.com/d/1NSvtQJQT6yMaXzaKo0MuYCh6QASUpIar',
  'dimmu_09.webp': 'https://lh3.googleusercontent.com/d/1vBO1eqO5WOqGfwUH_SHVH7w4SDYW_F6K',
  'dimmu_08.webp': 'https://lh3.googleusercontent.com/d/1DJKwU5PAkkFGGnh5USDg-X2x87ZIYFxc',
  'dimmu_02.webp': 'https://lh3.googleusercontent.com/d/12NBwWBswtvKr0wNiU8qLvvzp6r4IX4mA',
  'dimmu_07.webp': 'https://lh3.googleusercontent.com/d/1GftiecMuUOlfXEMdCtL6q0O5cpkrW2EF',
  'dimmu_04.webp': 'https://lh3.googleusercontent.com/d/1smFAVnKujLD_imWl--XMcNFas-faQXc-'
};

const handleImgError = (e) => {
  const src = e.currentTarget?.src || '';
  const fname = src.split('/').pop().split('?')[0];
  if (IMAGE_FALLBACK_MAP[fname] && !src.includes(IMAGE_FALLBACK_MAP[fname])) {
    e.currentTarget.src = IMAGE_FALLBACK_MAP[fname];
  }
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [visiblePhotosCount, setVisiblePhotosCount] = useState(4);
  const gallerySectionRef = useRef(null);  // Before/After drag slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const sliderContainerRef = useRef(null);


  const updateSliderPos = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
    if (!hasMoved) setHasMoved(true);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateSliderPos(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches && e.touches[0]) {
      updateSliderPos(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSliderPos(clientX);
    };

    const handleGlobalTouchMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) {
        e.preventDefault();
      }
      if (e.touches && e.touches[0]) {
        updateSliderPos(e.touches[0].clientX);
      }
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
    };

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
  }, [isDragging]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProject = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../utils/cmsStore');
        const storedProjects = getCMSData(STORAGE_KEYS.PROJECTS);
        if (storedProjects && Array.isArray(storedProjects)) {
          const match = storedProjects.find(p => p.slug === slug || p._id === slug);
          if (match) setProject(match);
        }
      } catch { }

      try {
        const response = await axios.get(`/projects/${slug}`);
        if (response.data.success && response.data.data) {
          setProject(response.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    loadProject();

    const handleSync = () => loadProject();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [slug]);

  // Global Escape key listener to close lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Offline mock project metadata fallbacks matching display expectations
  const getMockFallback = () => {
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
      testimonialName: clientDemo.name,
      testimonialMobile: clientDemo.mobile,
      testimonialProfession: clientDemo.profession,
      testimonialText: clientDemo.text,
      testimonialRating: 5,
      testimonial: {
        name: clientDemo.name,
        mobile: clientDemo.mobile,
        profession: clientDemo.profession,
        role: clientDemo.profession,
        text: clientDemo.text,
        rating: 5
      }
    };
  };

  const p = project || getMockFallback();
  if (p && Array.isArray(p.gallery)) {
    p.gallery = Array.from(new Set(p.gallery.filter(img => !img.includes('venkatesh_gallery_22.webp'))));
  }

  const batchSize = 4;
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

  const carouselItems = useMemo(() => {
    const rawImages = (Array.isArray(p?.gallery) && p.gallery.length > 0)
      ? p.gallery
      : [p?.heroImage || '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg'];
    
    // Curated architectural accents that swing the backdrop color
    const accents = ['#c5a572', '#8c7355', '#3d5a80', '#9c6644', '#588157', '#6c584c', '#7f5539'];

    // Strictly deduplicate by resolved source and image file name
    const seenSrcs = new Set();
    const uniqueItems = [];

    for (let idx = 0; idx < rawImages.length; idx++) {
      const img = rawImages[idx];
      if (!img) continue;
      const fname = (img || '').split('/').pop()?.split('?')[0] || '';
      const resolvedSrc = IMAGE_FALLBACK_MAP[fname] || img;
      
      // Prevent duplicate URLs
      if (seenSrcs.has(resolvedSrc) || seenSrcs.has(fname)) continue;
      seenSrcs.add(resolvedSrc);
      if (fname) seenSrcs.add(fname);

      const roomName = getProjectRoomName ? getProjectRoomName(p, img, idx) : `Space 0${idx + 1}`;
      const parts = (roomName || `Space 0${idx + 1}`).split(' ');
      const title = parts.length > 2
        ? `${parts.slice(0, Math.ceil(parts.length / 2)).join(' ')}\n${parts.slice(Math.ceil(parts.length / 2)).join(' ')}`
        : (roomName.includes('&') ? roomName.replace('&', '\n&') : `${roomName}\nSuite`);

      const finalImage = resolvedSrc.startsWith('http') 
        ? resolvedSrc 
        : getOptimizedImageUrl(resolvedSrc, 1920, 92);

      uniqueItems.push({
        id: `${p?.slug || 'proj'}-${uniqueItems.length}`,
        title,
        image: finalImage,
        accent: accents[uniqueItems.length % accents.length]
      });

      if (uniqueItems.length >= 14) break;
    }

    return uniqueItems;
  }, [p]);

  return (
    <div className="bg-cream min-h-screen pb-24">
      <SEO title={`${p.title} — Luxury Case Study`} description={p.description ? p.description.substring(0, 150) : 'Case study description...'} image={p.heroImage} url={`/projects/${p.slug}`} />

      {/* ── 1. DESKTOP HERO: Filmstrip Editorial Hero Carousel (>= md) ── */}
      <section className="hidden md:block pt-20 sm:pt-24 px-3 sm:px-4 md:px-8 lg:px-12 max-w-[1560px] mx-auto">
        <div className="relative h-[82vh] min-h-[560px] max-h-[820px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black border border-walnut/20">
          <HeroCarousel
            items={carouselItems}
            defaultIndex={0}
            brand="ESPACIO"
            onBack={() => navigate('/projects')}
            onMenu={() => {
              const el = document.getElementById('project-overview-stats');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            autoplay
            autoplayDelay={4500}
            className="h-full w-full"
          />
          <ScrollDownIndicator />
        </div>
      </section>

      {/* ── 2. MOBILE HERO: Touch-friendly Card Hero (< md) ── */}
      <section className="md:hidden pt-20 px-3 max-w-[1440px] mx-auto">
        <div className="relative h-[85dvh] min-h-[460px] w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-walnut/15">
          <img
            src={getOptimizedImageUrl(p.heroImage, 1200, 90)}
            onError={handleImgError}
            alt={p.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/40 to-black/60 pointer-events-none" />

          {/* Back button */}
          <div className="relative z-10 p-5">
            <Link to="/projects" className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-cream hover:text-gold font-bold transition-colors bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
              <ArrowLeft size={14} />
              <span>Back</span>
            </Link>
          </div>

          <div className="absolute bottom-8 left-0 w-full z-10 px-5">
            <div className="flex flex-col space-y-1.5">
              <span className="font-sans text-[11px] uppercase tracking-widest text-gold font-bold drop-shadow">
                {p.style || 'Bespoke execution'}
              </span>
              <h1 className="text-white text-2xl font-editorial font-bold leading-tight drop-shadow-md">
                {p.title}
              </h1>
            </div>
          </div>

          <ScrollDownIndicator />
        </div>
      </section>

      {/* Overview Block */}
      <section id="project-overview-stats" className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-walnut/10">
        <div className="flex items-center space-x-3">
          <MapPin className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Location</span>
            <span className="font-sans font-bold text-sm text-charcoal">{p.location}</span>
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
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Type</span>
            <span className="font-sans font-bold text-sm text-charcoal capitalize">{p.category?.replace('_', ' ')}</span>
          </div>
        </div>
      </section>

      {/* Story Sections */}
      <section className="max-w-[1000px] mx-auto px-6 py-20 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Vision</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.vision || p.description}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Challenge</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.challenges || 'Optimizing partition thresholds and hidden layout tracking slots.'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Engineering</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.engineering || 'Mild steel reinforcement configurations and structural load-bearing tolerances checks.'}
          </div>
        </div>
      </section>

      {/* Before / After Slider (Interactive Drag Transformation) */}
      {(() => {
        const beforeImg = (Array.isArray(p.beforeImages) && p.beforeImages[0]) || p.beforeImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
        const afterImg = (Array.isArray(p.afterImages) && p.afterImages[0]) || p.afterImage || p.heroImage || (Array.isArray(p.gallery) && p.gallery[0]);
        if (!beforeImg || !afterImg) return null;

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
                src={getOptimizedImageUrl(afterImg, 1400, 92)}
                onError={handleImgError}
                alt="Transformation After"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* After Badge: Clipped at the slider line */}
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
                  src={getOptimizedImageUrl(beforeImg, 1400, 92)}
                  onError={handleImgError}
                  alt="Transformation Before"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Before Badge */}
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

              {/* Drag handle thumb touch strip */}
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
      {/* ── MOBILE ONLY: Room Photos Gallery at Bottom of Section (< md) ── */}
      {p.gallery?.length > 0 && (
        <section ref={gallerySectionRef} className="md:hidden max-w-[1440px] mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
          <div className="flex flex-col gap-1.5 mb-6">
            <span className="font-sans text-[11px] font-bold text-gold uppercase tracking-widest">
              Captured Spaces & Details
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal">
              Project Photos & Rooms
            </h2>
            <p className="font-sans text-xs text-walnut">
              Showing {Math.min(visiblePhotosCount, p.gallery.length)} of {p.gallery.length} photos captured for this project. Tap photo to view full screen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {p.gallery.slice(0, visiblePhotosCount).map((imgUrl, index) => {
              const roomName = getProjectRoomName(p, imgUrl, index);
              return (
                <div
                  key={index}
                  onClick={() => { setActivePhotoIdx(index); setLightboxOpen(true); }}
                  className="rounded-[18px] overflow-hidden border border-walnut/10 shadow-sm group active:scale-[0.99] cursor-pointer relative bg-charcoal flex flex-col hover:border-gold/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg-dark">
                    <img
                      src={getOptimizedImageUrl(imgUrl, 900, 88)}
                      onError={handleImgError}
                      loading="lazy"
                      alt={`${p.title} - ${roomName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg">
                        <Maximize2 size={15} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-bg-card border-t border-ink-border/20 flex items-center justify-between text-xs font-sans">
                    <span className="text-ink font-semibold truncate tracking-wide text-xs">{roomName}</span>
                    <span className="text-gold font-bold shrink-0 text-[10.5px] uppercase tracking-wider">View ↗</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More / Show Less Controls */}
          {totalPhotos > batchSize && (
            <div className="mt-8 flex flex-col items-center justify-center gap-2.5">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleLoadMorePhotos}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-charcoal text-cream hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-md font-sans text-xs uppercase tracking-wider font-bold group cursor-pointer border border-gold/30"
                >
                  <span>Load More Photos ({totalPhotos - visiblePhotosCount} remaining)</span>
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform text-gold group-hover:text-charcoal" />
                </button>
              )}

              {canShowLess && (
                <button
                  type="button"
                  onClick={handleShowLessPhotos}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-cream/90 hover:bg-cream text-charcoal border border-walnut/20 font-sans text-xs uppercase tracking-wider font-bold group cursor-pointer shadow-xs"
                >
                  <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform text-gold" />
                  <span>Show Less</span>
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Lightbox Modal (For Mobile tap-to-expand) */}
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
                src={getOptimizedImageUrl(p.gallery[activePhotoIdx], 1400, 92)}
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
                    <img src={getOptimizedImageUrl(img, 150, 75)} onError={handleImgError} alt={thumbRoom} className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* What the Client Says About Our Work Section */}
      {(p.testimonial?.text || p.testimonialText) && (
        <section className="max-w-[900px] mx-auto px-6 py-16 my-16 text-center bg-offwhite rounded-2xl border border-walnut/10 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-3">Client Endorsement & Feedback</span>
          <h2 className="font-editorial text-3xl font-bold text-charcoal mb-8">What the Client Says About Our Work</h2>

          <div className="flex justify-center items-center gap-1.5 mb-6">
            {Array.from({ length: Number(p.testimonial?.rating || p.testimonialRating || 5) }).map((_, idx) => (
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
            "{p.testimonial?.text || p.testimonialText}"
          </blockquote>

          <div className="border-t border-walnut/10 pt-6 inline-flex flex-col items-center px-8">
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-charcoal">
              {p.testimonial?.name || p.testimonialName || 'Valued Client'}
            </h4>

            <div className="flex items-center space-x-3 text-xs text-walnut mt-1">
              <span className="font-medium text-gold">
                {p.testimonial?.profession || p.testimonialProfession || p.testimonial?.role || 'Homeowner'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Final Lead CTA */}
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
