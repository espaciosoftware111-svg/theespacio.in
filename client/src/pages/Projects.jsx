import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { ArrowUpRight, FolderKanban } from 'lucide-react';
import SEO from '../components/common/SEO';
import HeroSlideshow from '../components/common/HeroSlideshow';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { DEFAULT_PROJECTS, getCMSData, setCMSData, STORAGE_KEYS } from '../utils/cmsStore';
import { prefetchProject } from '../utils/projectPrefetch';

// ─── Reveal animation (stable, no re-render on parent updates) ───────────────
const Reveal = memo(({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
});
Reveal.displayName = 'Reveal';

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

const PROJECT_SLUG_FALLBACKS = {
  'kondapur-minimalist-2bhk': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425192/hf_20260926_121454_777edafb-9d5a-4009-bc04-3c5d0de0e534.png',
  'gachibowli-minimalist-beige-2bhk': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png',
  'kachiguda-fusion-duplex-villa': 'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425174/hf_20260926_121514_93ebd25a-dafd-4368-a9e6-7698e84fbc57.png',
  'dimmu-chachu-luxury-villa': '/images/projects/dimmu_residence/dimmu_05.webp'
};

const GENERAL_FALLBACK = 'https://res.cloudinary.com/teg9ndhk/image/upload/f_auto/q_auto/IMG_3871_1.png';

// Stable module-level handler with project-level fallbacks & loop protection
const handleImgError = (e, slug) => {
  const target = e.currentTarget;
  if (!target) return;
  target.onerror = null; // Prevent re-triggering error events
  const src = target.src || '';
  const fname = src.split('/').pop().split('?')[0];

  if (IMAGE_FALLBACK_MAP[fname] && !src.includes(IMAGE_FALLBACK_MAP[fname])) {
    target.src = IMAGE_FALLBACK_MAP[fname];
    return;
  }
  if (slug && PROJECT_SLUG_FALLBACKS[slug] && !src.includes(PROJECT_SLUG_FALLBACKS[slug])) {
    target.src = PROJECT_SLUG_FALLBACKS[slug];
    return;
  }
  target.src = GENERAL_FALLBACK;
};

const heroImages = [
  '/images/projects/rajapushpa_provincia/rajapushpa_8.webp',
  '/images/projects/my_home_sayuk/sayuk_4.webp',
  '/images/projects/kokapet_nagesh_2bhk/kokapet_master_bedroom.webp',
  '/images/projects/kokapet_rahul_2bhk/rahul_gallery_1.webp',
  '/images/projects/gandipet_kiran_2bhk/kiran_gallery_2.webp'
];

const CANONICAL_ORDER = {
  'rajapushpa-provincia-3bhk': 1,
  'my-home-sayuk-3bhk': 2,
  'kokapet-2bhk': 3,
  'kokapet-urban-2bhk': 4,
  'gandipet-modern-retro-2bhk': 5,
  'kondapur-minimalist-2bhk': 6,
  'gachibowli-minimalist-beige-2bhk': 7,
  'kachiguda-fusion-duplex-villa': 8,
  'dimmu-chachu-luxury-villa': 9
};

// Display name override map (stable, outside component)
const DISPLAY_NAMES = {
  'rajapushpa-provincia-3bhk': 'The Arcstone Residence',
  'my-home-sayuk-3bhk': 'The Lattice Retreat',
  'kokapet-2bhk': 'The Boucle Residence',
  'kokapet-urban-2bhk': 'The Ivory Retreat',
  'gandipet-modern-retro-2bhk': 'The Panelled Muse',
  'kondapur-minimalist-2bhk': 'The Dusk Lounge',
};

const getDisplayName = (project) =>
  DISPLAY_NAMES[project.slug] || project.title;

// ─── Project Card (memoized to avoid re-renders on filter/sort changes) ───────
const ProjectCard = memo(({ project, idx, priority }) => {
  const imgSrc = useMemo(() => {
    let raw = project.heroImage;
    if (raw && typeof raw === 'string' && raw.startsWith('/images/projects/')) {
      // Append cache-buster so any browser session with cached 404 bypasses it immediately
      const sep = raw.includes('?') ? '&' : '?';
      raw = `${raw}${sep}v=20260928_4`;
    }
    return getOptimizedImageUrl(raw, priority ? 900 : 700, 85);
  }, [project.heroImage, priority]);

  return (
    <Reveal delay={(idx % 3) * 0.07}>
      <Link
        to={`/projects/${project.slug}`}
        onMouseEnter={() => prefetchProject(project.slug)}
        onTouchStart={() => prefetchProject(project.slug)}
        className="group block rounded-card overflow-hidden bg-bg-card card-lift cursor-pointer select-none relative z-10 pointer-events-auto"
      >
        <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-bg-card">
          <img
            src={imgSrc}
            onError={(e) => handleImgError(e, project.slug)}
            loading="eager"
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            alt={getDisplayName(project)}
            width="700"
            height="525"
            style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-expo-out"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        </div>
        <div className="p-6 select-none">
          <div className="mb-2">
            <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">
              {project.style || 'Luxury build'}
            </span>
          </div>
          <h3 className="font-display text-[22px] font-bold text-ink group-hover:text-ink-soft transition-colors mb-2 leading-snug select-none">
            {getDisplayName(project)}
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
});
ProjectCard.displayName = 'ProjectCard';

// ─── In-memory fetch cache (prevents duplicate API calls within same session) ─
let projectsCache = null;
let settingsCache = null;

const Projects = () => {
  const [projects, setProjects] = useState(() => {
    if (projectsCache) return projectsCache;
    try {
      const stored = getCMSData(STORAGE_KEYS.PROJECTS);
      if (stored && Array.isArray(stored) && stored.length > 0) {
        return [...stored].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
      }
    } catch {}
    return DEFAULT_PROJECTS;
  });
  const [loading, setLoading] = useState(false);

  const [heroContent, setHeroContent] = useState(() => {
    if (settingsCache) return settingsCache;
    return {
      badge: 'Portfolio & Case Studies',
      title: 'Our Projects',
      subtitle: 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
      images: heroImages
    };
  });

  const { scrollYProgress } = useScroll();
  const textY  = useTransform(scrollYProgress, [0, 0.15], ['0px', '-30px']);
  const textOp = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      // 1. Load from localStorage immediately (instant paint)
      try {
        const stored = getCMSData(STORAGE_KEYS.PROJECTS);
        if (stored && stored.length > 0 && !cancelled) {
          const sorted = [...stored].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
          setProjects(sorted);
          projectsCache = sorted;
        }
        const settings = getCMSData(STORAGE_KEYS.SETTINGS);
        if (settings && !cancelled) {
          const rawImgs = (Array.isArray(settings.projects_hero_images) && settings.projects_hero_images.length > 0)
            ? settings.projects_hero_images : heroImages;
          const h = {
            badge: settings.projects_hero_badge || 'Portfolio & Case Studies',
            title: settings.projects_hero_title || 'Our Projects',
            subtitle: settings.projects_hero_subtitle || 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
            images: Array.from(new Set(rawImgs.filter(Boolean)))
          };
          setHeroContent(h);
          settingsCache = h;
        }
      } catch {}

      // 2. Fetch fresh data from API in background (stale-while-revalidate)
      try {
        const [projRes, setRes] = await Promise.all([
          axios.get('/projects', { timeout: 8000 }).catch(() => null),
          axios.get('/settings', { timeout: 8000 }).catch(() => null)
        ]);

        if (!cancelled) {
          if (projRes?.data?.success && Array.isArray(projRes.data?.data) && projRes.data.data.length > 0) {
            const sorted = [...projRes.data.data].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
            setProjects(sorted);
            setCMSData(STORAGE_KEYS.PROJECTS, sorted);
            projectsCache = sorted;
          }
          if (setRes?.data?.success && setRes.data?.data) {
            const s = setRes.data.data;
            setCMSData(STORAGE_KEYS.SETTINGS, s);
            const rawImgs = (Array.isArray(s.projects_hero_images) && s.projects_hero_images.length > 0)
              ? s.projects_hero_images : heroImages;
            const h = {
              badge: s.projects_hero_badge || 'Portfolio & Case Studies',
              title: s.projects_hero_title || 'Our Projects',
              subtitle: s.projects_hero_subtitle || 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
              images: Array.from(new Set(rawImgs.filter(Boolean)))
            };
            setHeroContent(h);
            settingsCache = h;
          }
        }
      } catch {}
      finally { if (!cancelled) setLoading(false); }
    };

    loadData();

    const handleSync = () => loadData();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      cancelled = true;
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Memoized canonical 9 projects
  const canonicalProjects = useMemo(() => {
    return (projects && projects.length > 0 ? projects : DEFAULT_PROJECTS)
      .filter(p => p && (CANONICAL_ORDER[p.slug] !== undefined || DEFAULT_PROJECTS.some(dp => dp._id === p._id)))
      .map(p => ({ ...p, order: CANONICAL_ORDER[p.slug] || Number(p.order) || 999 }))
      .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999))
      .slice(0, 9);
  }, [projects]);

  const displayedProjects = useMemo(() => {
    return [...canonicalProjects].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
  }, [canonicalProjects]);

  return (
    <div className="bg-bg">
      <SEO
        title="Portfolio & Case Studies — ESPACIO"
        description="Browse ESPACIO's luxury portfolio. Apartments, Independent Villas, Penthouse projects, and commercial offices executed to perfection in Hyderabad."
        url="/projects"
      />

      {/* ── HERO ── */}
      <section className="relative h-[80dvh] sm:h-[80vh] lg:h-[96vh] min-h-[500px] sm:min-h-[520px] lg:min-h-0 px-3 sm:px-5 pt-2 sm:pt-2.5 lg:pt-3 pb-[10px] lg:px-12">
        <div className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px]">
          <div className="absolute inset-0 overflow-hidden">
            <HeroSlideshow
              images={heroContent.images && heroContent.images.length > 0 ? heroContent.images : heroImages}
              intervalMs={4200}
              transitionDuration={1.1}
              showGradient={false}
            />
          </div>

          {/* Scrim */}
          <div className="absolute inset-x-0 bottom-0 h-[52%] sm:h-[42%] bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none" />

          {/* Text */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="absolute inset-0 z-20 flex flex-col justify-end"
          >
            <div className="w-full px-5 sm:px-8 md:px-12 pb-16 sm:pb-14 md:pb-14">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-2.5 sm:gap-4"
              >
                <div className="inline-flex items-center gap-2 bg-white text-[#101014] px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-[13px] font-sans font-medium shadow-lg border border-black/5 select-none tracking-normal mb-0.5 sm:mb-1">
                  <FolderKanban size={13} className="text-[#101014] shrink-0" />
                  <span>{heroContent.badge || 'Portfolio & Case Studies'}</span>
                </div>
                <h1
                  className="font-display font-bold leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(36px, 8vw, 108px)' }}
                >
                  {heroContent.title}
                </h1>
                <p className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-white/90 max-w-[500px] leading-relaxed">
                  {heroContent.subtitle}
                </p>
              </motion.div>
            </div>
            <ScrollDownIndicator className="scale-85 sm:scale-100 bottom-3.5 sm:bottom-4" />
          </motion.div>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ── */}
      <div className="bg-bg pb-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-ink-border pb-6 sm:pb-8 mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">All Featured Projects</h2>
              <p className="font-sans text-xs sm:text-sm text-ink-soft mt-1">Explore our turnkey interior design and execution portfolio</p>
            </div>
          </div>

          {/* Grid */}
          {loading && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="aspect-[4/3] bg-bg-card animate-pulse rounded-card" />
              ))}
            </div>
          ) : displayedProjects.length === 0 ? (
            <div className="text-center py-20 bg-bg-card rounded-card border border-ink-border">
              <p className="font-sans text-sm text-ink-soft select-none">No projects found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProjects.map((project, idx) => (
                <ProjectCard
                  key={project.slug || project._id || idx}
                  project={project}
                  idx={idx}
                  priority={idx < 3}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
