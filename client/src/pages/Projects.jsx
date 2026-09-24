import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { Search, ArrowUpRight, FolderKanban } from 'lucide-react';
import SEO from '../components/common/SEO';
import HeroSlideshow from '../components/common/HeroSlideshow';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import GooeyInput from '../components/ui/gooey-input';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { DEFAULT_PROJECTS } from '../utils/cmsStore';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

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

const heroImages = [
  // 1. Indo-Classical Elegance 3BHK: Majestic 4K Dining Hall & Classical Arches
  '/images/projects/project_hero_1.jpg',
  // 2. Modern Desi Duplex 4BHK: Grand Luxury 4K Living Lounge & Ambient Timber Paneling
  '/images/projects/project_hero_2.jpg',
  // 3. Minimalist Beige 2BHK: Panoramic 4K Designer Living Room
  '/images/projects/project_hero_3.jpg',
  // 4. 2BHK Modern Retro: 4K Panoramic Timber Louvered Living Room
  '/images/projects/project_hero_4.jpg'
];

const Projects = () => {
  const [projects, setProjects]               = useState(DEFAULT_PROJECTS);
  const [filteredProjects, setFilteredProjects] = useState(DEFAULT_PROJECTS);
  const [activeFilter, setActiveFilter]       = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [loading, setLoading]                 = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [visibleCount, setVisibleCount]       = useState(8);
  const [isUnlocked, setIsUnlocked]           = useState(false);
  const heroRef = useRef(null);

  const [heroContent, setHeroContent] = useState({
    badge: 'Portfolio & Case Studies',
    title: 'Our Projects',
    subtitle: 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
    images: heroImages
  });

  // Page-level parallax (same as Home & Services)
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.2], [1.05, 0.97]);
  const bgY     = useTransform(scrollYProgress, [0, 0.2], ['0%', '6%']);
  const textY   = useTransform(scrollYProgress, [0, 0.15], ['0px', '-30px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const filterChips = [
    { label: 'All Projects',       value: 'all'        },
    { label: '★ Featured Case Studies', value: 'featured' },
    { label: 'Villas',             value: 'villa'       },
    { label: 'Apartments',         value: 'apartment'   },
    { label: 'Commercial Offices', value: 'office'      },
    { label: 'Commercial',         value: 'commercial'  },
    { label: 'Renovations',        value: 'renovation'  },
    { label: 'Luxury Homes',       value: 'luxury_home' },
  ];

  useEffect(() => {
    const handleUnlock = () => {
      setIsUnlocked(true);
      setVisibleCount(999);
    };
    window.addEventListener('projects-unlocked', handleUnlock);
    return () => window.removeEventListener('projects-unlocked', handleUnlock);
  }, []);

  const handleLoadMore = () => {
    window.dispatchEvent(new CustomEvent('open-quote-modal', {
      detail: {
        mode: 'projects',
        title: 'Fill Details to Get More Projects',
        context: 'Projects Portfolio Unlock'
      }
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../utils/cmsStore');
        const stored = getCMSData(STORAGE_KEYS.PROJECTS);
        if (stored && stored.length > 0) {
          const sorted = [...stored].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
          setProjects(sorted);
        }

        const settings = getCMSData(STORAGE_KEYS.SETTINGS);
        if (settings) {
          const rawImgs = (Array.isArray(settings.projects_hero_images) && settings.projects_hero_images.length > 0)
            ? settings.projects_hero_images
            : heroImages;
          const uniqueImgs = Array.from(new Set(rawImgs.filter(Boolean)));

          setHeroContent({
            badge: settings.projects_hero_badge || 'Portfolio & Case Studies',
            title: settings.projects_hero_title || 'Our Projects',
            subtitle: settings.projects_hero_subtitle || 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
            images: uniqueImgs.length > 0 ? uniqueImgs : heroImages
          });
        }
      } catch {}

      try {
        const [projRes, setRes] = await Promise.all([
          axios.get('/projects').catch(() => null),
          axios.get('/settings').catch(() => null)
        ]);

        if (projRes?.data?.success && Array.isArray(projRes.data?.data) && projRes.data.data.length > 0) {
          const sorted = [...projRes.data.data].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
          setProjects(sorted);
          setCMSData(STORAGE_KEYS.PROJECTS, sorted);
        }

        if (setRes?.data?.success && setRes.data?.data) {
          const settings = setRes.data.data;
          setCMSData(STORAGE_KEYS.SETTINGS, settings);
          const rawImgs = (Array.isArray(settings.projects_hero_images) && settings.projects_hero_images.length > 0)
            ? settings.projects_hero_images
            : heroImages;
          const uniqueImgs = Array.from(new Set(rawImgs.filter(Boolean)));

          setHeroContent({
            badge: settings.projects_hero_badge || 'Portfolio & Case Studies',
            title: settings.projects_hero_title || 'Our Projects',
            subtitle: settings.projects_hero_subtitle || 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
            images: uniqueImgs.length > 0 ? uniqueImgs : heroImages
          });
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleSync = () => loadData();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Authentic company project image pools for each category type
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
      '/images/company/2bhk_mordern_retro/office_1.jpg',
      '/images/company/2bhk_mordern_retro/hall_5.jpg',
      '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_4-20260813-110617.jpg',
      '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_1-20260810-164320.jpg',
      '/images/company/3bhk_lux/balcony_1.png',
      '/images/company/2bhk_lux/hall_2.png'
    ],
    commercial: [
      '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
      '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg',
      '/images/company/2bhk_mordern_retro/office_3.jpg',
      '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
      '/images/company/3bhk_lux/open_hall.png',
      '/images/company/2bhk_mordern_retro/hall_5.jpg',
      '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg',
      '/images/company/3bhk_lux/open_hall2.png'
    ],
    renovation: [
      '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
      '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
      '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
      '/images/company/2bhk_mordern_retro/b1_2.jpg',
      '/images/company/3bhk_lux/open_hall.png',
      '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg',
      '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
      '/images/company/3bhk_lux/bedroom_1.png'
    ],
    luxury_home: [
      '/images/company/3bhk_lux/open_hall.png',
      '/images/company/3bhk_lux/open_hall2.png',
      '/images/company/3bhk_lux/bedroom_1.png',
      '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg',
      '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
      '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
      '/images/company/2bhk_lux/hall1_1.png',
      '/images/company/2bhk_lux/bed_room_2.png'
    ]
  };

  const categoriesList = ['villa', 'apartment', 'office', 'commercial', 'renovation', 'luxury_home'];
  const neighborhoods = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kondapur', 'HITEC City', 'Kokapet', 'Begumpet', 'Madhapur', 'Gandipet', 'Financial District'];
  const styles = ['Warm Minimalist', 'Warm Editorial', 'Clean Contemporary', 'Luxury Architectural', 'Scandinavian Crafted', 'Modern Classic', 'Warm Contemporary', 'Industrial Editorial'];

  const generatedMockProjects = [];
  categoriesList.forEach((cat) => {
    for (let index = 0; index < 8; index++) {
      const hood = neighborhoods[(cat.charCodeAt(0) + index) % neighborhoods.length];
      const style = styles[(cat.charCodeAt(1) + index) % styles.length];
      const year = 2023 + (index % 3);
      
      const label = cat === 'luxury_home' ? 'Residence' : cat.charAt(0).toUpperCase() + cat.slice(1);
      const title = `${style} ${label} ${index + 1}`;
      
      const heroImage = unsplashPool[cat][index % 8];
      const slug = `${cat}-${index + 1}`;
      
      generatedMockProjects.push({
        title,
        location: `${hood}, Hyd`,
        category: cat,
        style,
        heroImage,
        slug,
        year
      });
    }
  });

  const mockProjects = generatedMockProjects;

  const sourceData = projects.length > 0 ? projects : mockProjects;

  useEffect(() => {
    let result = [...sourceData];
    if (activeFilter === 'featured') {
      result = result.filter(p => p.featured === true || p.featured === 'true');
    } else if (activeFilter !== 'all') {
      result = result.filter(p => p.category === activeFilter);
    } else {
      // For 'all', sort featured projects to top
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.style?.toLowerCase().includes(q)
      );
    }
    setFilteredProjects(result);
  }, [activeFilter, searchQuery, projects]);

  const displayedProjects = filteredProjects;

  return (
    <div className="bg-bg">
      <SEO
        title="Portfolio & Case Studies — ESPACIO"
        description="Browse ESPACIO's luxury portfolio. Apartments, Independent Villas, Penthouse projects, and commercial offices executed to perfection in Hyderabad."
        url="/projects"
      />

      {/* ── ROUNDED CARD HERO (same as Home & Services) ── */}
      <section
        ref={heroRef}
        className="relative h-[90dvh] sm:h-[80vh] lg:h-[96vh] min-h-[480px] sm:min-h-[520px] lg:min-h-0 px-3 sm:px-5 pt-2 sm:pt-2.5 lg:pt-3 pb-[10px] lg:px-12"
      >
        <div
          className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px]"
        >
          {/* Background image slideshow — crisp 1:1 pixel rendering without scale blur */}
          <div className="absolute inset-0 overflow-hidden">
            <HeroSlideshow
              images={heroContent.images && heroContent.images.length > 0 ? heroContent.images : heroImages}
              intervalMs={3800}
              transitionDuration={1.2}
              showGradient={false}
              onIndexChange={setCurrentImageIdx}
            />
          </div>

          {/* Subtle bottom-only text protection scrim — unmasked, bright, vivid 4K image */}
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />

          {/* Text — pinned bottom-left */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="absolute inset-0 z-20 flex flex-col justify-end"
          >
            <div className="w-full px-8 md:px-12 pb-10 md:pb-14">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-4"
              >
                {/* Clean White Pill label */}
                <div className="inline-flex items-center gap-2 bg-white text-[#101014] px-4 py-1.5 rounded-full text-[13px] font-sans font-medium shadow-lg border border-black/5 select-none tracking-normal mb-1">
                  <FolderKanban size={14} className="text-[#101014] shrink-0" />
                  <span>{heroContent.badge || 'Portfolio & Case Studies'}</span>
                </div>

                {/* Heading */}
                <h1
                  className="font-display font-bold leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(48px, 8vw, 108px)' }}
                >
                  {heroContent.title}
                </h1>

                <p className="font-sans text-[14px] md:text-[15px] text-white/60 max-w-[500px] leading-relaxed">
                  {heroContent.subtitle}
                </p>
              </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <ScrollDownIndicator />
          </motion.div>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ── */}
      <div className="bg-bg pb-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-ink-border pb-6 sm:pb-8 mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">All Featured Projects</h2>
              <p className="font-sans text-xs text-ink-soft mt-1">Explore our turnkey interior design and execution portfolio</p>
            </div>
          </div>

          {/* Project Grid */}
          {loading && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="aspect-[4/3] bg-bg-card animate-pulse rounded-card" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-bg-card rounded-card border border-ink-border">
              <p className="font-sans text-sm text-ink-soft select-none">No projects found matching your search.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProjects.map((project, idx) => {
                  return (
                    <Reveal key={idx} delay={(idx % 3) * 0.08}>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="group block rounded-card overflow-hidden bg-bg-card card-lift cursor-pointer select-none"
                      >
                        <div className="relative overflow-hidden aspect-[4/3]">
                          <img
                            src={getOptimizedImageUrl(project.heroImage, 1200, 92)}
                            onError={handleImgError}
                            loading="lazy"
                            decoding="async"
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-expo-out"
                          />
                        </div>
                        <div className="p-6 select-none">
                          <div className="mb-2 select-none">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold select-none">
                              {project.style || 'Luxury build'}
                            </span>
                          </div>
                          <h3 className="font-display text-[22px] font-bold text-ink group-hover:text-ink-soft transition-colors mb-2 leading-snug select-none">
                            {(project.slug === 'rajapushpa-provincia-3bhk' || project.title === 'A 3BHK Residence, Narsingi')
                              ? 'The Arcstone Residence'
                              : (project.slug === 'my-home-sayuk-3bhk' || project.title === 'A 3BHK Residence, Tellapur')
                              ? 'The Lattice Retreat'
                              : (project.slug === 'kokapet-2bhk' || project._id === 'proj_3_kokapet_nagesh')
                              ? 'The Boucle Residence'
                              : (project.slug === 'kokapet-urban-2bhk' || project._id === 'proj_4_kokapet_rahul')
                              ? 'The Ivory Retreat'
                              : (project.slug === 'gandipet-modern-retro-2bhk' || project._id === 'proj_5_gandipet_kiran')
                              ? 'The Panelled Muse'
                              : (project.slug === 'kondapur-minimalist-2bhk' || project._id === 'proj_6_kondapur_venkatesh')
                              ? 'The Dusk Lounge'
                              : project.title}
                          </h3>
                          <p className="font-sans text-[13px] text-ink-soft select-none">{project.location}</p>
                          <div className="pt-4 flex items-center gap-1 text-[11px] text-ink font-semibold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform select-none">
                            <span>View case study</span>
                            <ArrowUpRight size={13} />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>

              {!isUnlocked && (
                <div className="mt-14 sm:mt-18 text-center flex flex-col items-center justify-center">
                  <motion.button
                    type="button"
                    onClick={handleLoadMore}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-white font-sans text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-gold hover:text-ink transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer border border-white/10 group select-none"
                  >
                    <span>Load More Projects</span>
                    <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-ink/10 flex items-center justify-center transition-colors">
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
