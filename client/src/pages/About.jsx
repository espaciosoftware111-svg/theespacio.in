import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Layers, Award, Sparkles, DraftingCompass, CheckCircle2 } from 'lucide-react';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getCMSData, STORAGE_KEYS } from '../utils/cmsStore';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const defaultStats = [
  { value: '25+', label: 'Projects Completed' },
  { value: '100+', label: 'Happy Clients' },
  { value: '40+', label: 'Years Legacy' }
];

const defaultGenerations = [
  {
    gen: 'Generation I',
    title: 'The Civil Foundation',
    company: 'Founding Stone Masonry & Engineering',
    desc: 'Our great-grandfather laid the structural foundation of our family construction legacy in Hyderabad. Built on load-bearing precision, structural integrity, and honest material sourcing.',
    image: '/images/company/2bhk_mordern_retro/hall_3.jpg'
  },
  {
    gen: 'Generation II',
    title: 'Mastana Constructions',
    company: 'Commercial & Multi-Family Residential',
    desc: 'Expanded into large-scale residential complexes and institutional landmarks across Hyderabad, including Sreenidhi International School and landmark residential enclaves.',
    image: '/images/company/sreenidhi_international_school.jpg'
  },
  {
    gen: 'Generation III',
    title: 'Mastana Infra',
    company: 'Iconic Private Estates & Infrastructure',
    desc: 'Pioneered luxury architectural builds and bespoke private residences featuring private ponds, including the estate chosen as a primary filming location in Guntur Kaaram, and many more.',
    image: '/images/company/velak_lake_view_residency.jpg'
  },
  {
    gen: 'Generation IV',
    title: 'ESPACIO Interiors & Modular',
    company: 'Engineering-First Bespoke Interiors',
    desc: 'Fusing structural construction mastery with luxury interior architecture. We don\'t just style spaces, we engineer every wall, cabinet, and finish for lifetime permanence.',
    image: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_23-20260810-124912.jpg'
  }
];

const defaultLandmarkBuilds = [
  {
    id: 'guntur-karam-lake-house',
    title: 'Guntur Karam',
    subtitle: 'Lake House',
    fullName: 'Guntur Karam Lake House',
    tag: 'Cinema Landmark',
    desc: 'Iconic private lakeside estate chosen as a primary filming location in the movie Guntur Kaaram.',
    image: '/images/company/guntur_kaaram_lakeside_estate.webp'
  },
  {
    id: 'sreenidhi-international-school',
    title: 'Sreenidhi International',
    subtitle: 'School',
    fullName: 'Sreenidhi International School',
    tag: 'Institutional Campus',
    desc: 'Sprawling international school campus and pavilions built to exacting architectural and structural tolerances.',
    image: '/images/company/sreenidhi_international_school.jpg'
  },
  {
    id: 'velak-lake-view-residency',
    title: 'Velak',
    subtitle: 'Lake View Residency',
    fullName: 'Velak Lake View Residency',
    tag: 'Luxury Villa Enclave',
    desc: 'Contemporary luxury lakefront villa featuring sweeping driveway engineering and precision architectural stone facades.',
    image: '/images/company/velak_lake_view_residency.jpg'
  }
];

const defaultGalleryImages = [
  {
    url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790781490/c0ffc7ad-06d1-4927-b2dc-ceff8491bf0e.png',
    title: 'Neoclassical Boiserie & Halo Luminaire',
    subtitle: 'Jubilee Hills Master Suite'
  },
  {
    url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790781720/38ce044a-38ca-4be2-a9c5-413b2c5917a6.png',
    title: 'Calacatta Marble Waterfall Island & Joinery',
    subtitle: 'Penthouse Culinary Suite'
  },
  {
    url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790781753/d7eeaf8c-6df3-414a-a584-a55077db4f5b.png',
    title: 'Fluted Acoustic Panelling & Ambient Architecture',
    subtitle: 'Contemporary Luxury Suite'
  },
  {
    url: 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790781734/7ae88285-3c07-4afb-83d4-12edb5ec18f6.png',
    title: 'Architectural Timber Ceiling & Executive Lounge',
    subtitle: 'Commercial & Hospitality Atelier'
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

/* ── Animated Counter Component ───────────────────────────────────── */
const Counter = ({ value, duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
  const [displayValue, setDisplayValue] = useState(0);

  // Extract number and suffix/prefix (e.g., "100+" -> num: 100, suffix: "+", "25+" -> num: 25, suffix: "+")
  const strVal = String(value || '');
  const match = strVal.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
  const prefix = match ? match[1] : '';
  const targetNum = match ? parseInt(match[2], 10) : null;
  const suffix = match ? match[3] : '';

  useEffect(() => {
    if (!inView || targetNum === null) return;
    let startTimestamp = null;
    let frameId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Smooth cubic-out easing
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeProgress * targetNum));
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };
    frameId = window.requestAnimationFrame(step);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [inView, targetNum, duration]);

  if (targetNum === null) {
    return <span>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
};

/* ── Scroll Reveal Wrapper ─────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const defaultAboutHeroImage = 'https://res.cloudinary.com/r3jwfy0y/image/upload/v1790795926/922c2790-8bdd-4f8b-8680-d266658a22b5.png';
const defaultAboutStoryImage = '/images/company/guntur_kaaram_lakeside_estate.webp';

const getValidHeroImage = (val, fallback = defaultAboutHeroImage) => {
  if (!val || typeof val !== 'string' || !val.trim() || val.includes('unsplash.com') || val.includes('photo-1600585154340-be6161a56a0c') || val.includes('Guest_restaurant_22') || val === '/images/about/about_hero.jpg' || val.includes('indo_classical_elegance_3bhk')) {
    return fallback;
  }
  return val;
};

const getValidStoryImage = (val, fallback = defaultAboutStoryImage) => {
  if (!val || typeof val !== 'string' || !val.trim() || val.includes('unsplash.com') || val.includes('3bhk_lux/open_hall.png') || val.includes('photo-1600585154340-be6161a56a0c') || val.includes('Guest_restaurant_10')) {
    return fallback;
  }
  return val;
};

const getValidGenerations = (val) => {
  const list = Array.isArray(val) && val.length > 0 ? val : defaultGenerations;
  return list.map((item) => {
    if (item?.gen === 'Generation III') {
      return {
        ...item,
        desc: 'Pioneered luxury architectural builds and bespoke private residences featuring private ponds, including the estate chosen as a primary filming location in Guntur Kaaram, and many more.'
      };
    }
    if (item?.desc && typeof item.desc === 'string') {
      return {
        ...item,
        desc: item.desc.replace(/spaces\s*[—–-]\s*we/gi, 'spaces, we').replace(/ponds\s*[—–-]\s*including/gi, 'ponds, including')
      };
    }
    return item;
  });
};

const getValidGallery = (val) => {
  if (Array.isArray(val) && val.length > 0) {
    const hasOldDefaults = val.some(item => 
      !item?.url ||
      item.url.includes('indo_classical_elegance_3bhk') || 
      item.url.includes('2bhk_mordern_retro/hall_2.jpg') ||
      item.url.includes('Exquisite_Fusion_of_Modern__Desi') ||
      item.url.includes('ac9e2276-8d7b-4646-be00-dedda2d90aa8')
    );
    if (!hasOldDefaults) {
      return val;
    }
  }
  return defaultGalleryImages;
};

const About = () => {
  const heroRef = useRef(null);

  // Page-level scroll for subtle parallax on the background image
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.25], [1.05, 0.98]);
  const bgY     = useTransform(scrollYProgress, [0, 0.25], ['0%', '8%']);

  // Hero scroll parallax animations matching Services page
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroExitScale = useTransform(heroScroll, [0, 1], [1, 0.85]);
  const heroExitOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroExitY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const textY = useTransform(heroScroll, [0, 0.8], ['0px', '-45px']);
  const textOpacity = useTransform(heroScroll, [0, 0.7], [1, 0.25]);

  const cleanMilestone = (val) => {
    if (!val) return 'Milestone';
    if (/engineering\s*milestone/i.test(val)) return 'Milestone';
    return val;
  };

  const capitalizeEveryWord = (str) => {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/\b([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  const [aboutData, setAboutData] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return {
      heroBadge: getNonEmpty(s?.about_hero_badge, 'About ESPACIO'),
      heroTitle: capitalizeEveryWord(getNonEmpty(s?.about_hero_title, 'Four Generations Of Construction.\nOne New Standard For Design.')),
      heroSubtitle: getNonEmpty(s?.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mastana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.'),
      heroImage: getValidHeroImage(s?.about_hero_image, defaultAboutHeroImage),
      heroStats: (Array.isArray(s?.about_hero_stats) && s.about_hero_stats.length > 0) ? s.about_hero_stats : defaultStats,
      heroVisible: s?.about_hero_visible !== false,

      storyBadge: getNonEmpty(s?.about_story_badge, 'OUR ORIGIN STORY'),
      storyMain: getNonEmpty(s?.about_story_main, "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design, walls that were never built right in the first place.").replace(/\s*[—–-]\s*walls/gi, ', walls'),
      storyHighlight: getNonEmpty(s?.about_story_highlight, "We've spent four generations making sure that never happens."),
      storyP1: getNonEmpty(s?.about_story_p1, 'Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mastana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.'),
      storyP2: getNonEmpty(s?.about_story_p2, 'One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.'),
      storyP3: getNonEmpty(s?.about_story_p3, "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't."),
      storyImage: getValidStoryImage(s?.about_story_image, defaultAboutStoryImage),
      milestoneLabel: cleanMilestone(s?.about_milestone_label),
      milestoneText: getNonEmpty(s?.about_milestone_text, 'Lakeside residence chosen as filming location for Guntur Kaaram'),
      milestoneVisible: s?.about_milestone_visible !== false,

      genBadge: getNonEmpty(s?.about_gen_badge, 'The Evolution'),
      genTitle: getNonEmpty(s?.about_gen_title, 'Four Generations of Mastery'),
      genSubtitle: getNonEmpty(s?.about_gen_subtitle, 'Four Decades of Heritage'),
      generations: getValidGenerations(s?.about_generations),

      missionQuote: getNonEmpty(s?.about_mission_quote, '"We design spaces with intention — engineered first, styled second — so every home we touch is as functional as it is beautiful."'),
      visionQuote: getNonEmpty(s?.about_vision_quote, '"To redefine what interior design means — proving that real craftsmanship, not trends, is what makes a space timeless."'),

      galleryBadge: getNonEmpty(s?.about_gallery_badge, 'Visual Standards'),
      galleryTitle: getNonEmpty(s?.about_gallery_title, 'Craftsmanship in Detail'),
      galleryImages: getValidGallery(s?.about_gallery_images),

      ctaBadge: getNonEmpty(s?.about_cta_badge, 'GET IN TOUCH'),
      ctaTitle: getNonEmpty(s?.about_cta_title, 'Ready to Transform Your Space?'),
      ctaDesc: getNonEmpty(s?.about_cta_desc, "Let's discuss your luxury interior design and engineering requirements with our master team."),
      ctaBtnText: getNonEmpty(s?.about_cta_btn_text, "LET'S TALK ↗"),
      ctaBtnLink: getNonEmpty(s?.about_cta_btn_link, '/contact')
    };
  });

  useEffect(() => {
    const syncCMS = () => {
      const s = getCMSData(STORAGE_KEYS.SETTINGS);
      if (s) {
        setAboutData({
          heroBadge: getNonEmpty(s.about_hero_badge, 'About ESPACIO'),
          heroTitle: capitalizeEveryWord(getNonEmpty(s.about_hero_title, 'Four Generations Of Construction.\nOne New Standard For Design.')),
          heroSubtitle: getNonEmpty(s.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mastana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.'),
          heroImage: getValidHeroImage(s.about_hero_image, defaultAboutHeroImage),
          heroStats: (Array.isArray(s.about_hero_stats) && s.about_hero_stats.length > 0) ? s.about_hero_stats : defaultStats,
          heroVisible: s.about_hero_visible !== false,

          storyBadge: getNonEmpty(s.about_story_badge, 'OUR ORIGIN STORY'),
          storyMain: getNonEmpty(s.about_story_main, "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design, walls that were never built right in the first place.").replace(/\s*[—–-]\s*walls/gi, ', walls'),
          storyHighlight: getNonEmpty(s.about_story_highlight, "We've spent four generations making sure that never happens."),
          storyP1: getNonEmpty(s.about_story_p1, 'Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mastana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.'),
          storyP2: getNonEmpty(s.about_story_p2, 'One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.'),
          storyP3: getNonEmpty(s.about_story_p3, "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't."),
          storyImage: getValidStoryImage(s.about_story_image, defaultAboutStoryImage),
          milestoneLabel: cleanMilestone(s.about_milestone_label),
          milestoneText: getNonEmpty(s.about_milestone_text, 'Lakeside residence chosen as filming location for Guntur Kaaram'),
          milestoneVisible: s.about_milestone_visible !== false,

          genBadge: getNonEmpty(s.about_gen_badge, 'The Evolution'),
          genTitle: getNonEmpty(s.about_gen_title, 'Four Generations of Mastery'),
          genSubtitle: getNonEmpty(s.about_gen_subtitle, 'Four Decades of Heritage'),
          generations: getValidGenerations(s.about_generations),

          missionQuote: getNonEmpty(s.about_mission_quote, '"We design spaces with intention — engineered first, styled second — so every home we touch is as functional as it is beautiful."'),
          visionQuote: getNonEmpty(s.about_vision_quote, '"To redefine what interior design means — proving that real craftsmanship, not trends, is what makes a space timeless."'),

          galleryBadge: getNonEmpty(s.about_gallery_badge, 'Visual Standards'),
          galleryTitle: getNonEmpty(s.about_gallery_title, 'Craftsmanship in Detail'),
          galleryImages: getValidGallery(s.about_gallery_images),

          ctaBadge: getNonEmpty(s.about_cta_badge, 'GET IN TOUCH'),
          ctaTitle: getNonEmpty(s.about_cta_title, 'Ready to Transform Your Space?'),
          ctaDesc: getNonEmpty(s.about_cta_desc, "Let's discuss your luxury interior design and engineering requirements with our master team."),
          ctaBtnText: getNonEmpty(s.about_cta_btn_text, "LET'S TALK ↗"),
          ctaBtnLink: getNonEmpty(s.about_cta_btn_link, '/contact')
        });
      }
    };

    syncCMS();

    // Fetch fresh settings from API
    const fetchFreshSettings = async () => {
      try {
        const { default: axios } = await import('axios');
        const res = await axios.get('/settings');
        if (res?.data?.success && res.data.data) {
          const { setCMSData } = await import('../utils/cmsStore');
          setCMSData(STORAGE_KEYS.SETTINGS, res.data.data, { silent: true });
          syncCMS();
        }
      } catch (err) {}
    };
    fetchFreshSettings();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, []);

  const values = [
    {
      num: '01',
      title: 'Engineering First',
      icon: DraftingCompass,
      desc: 'Every design decision is backed by structural calculations, acoustic isolation, and load tolerances. We build spaces to thrive over decades — not just look good in photos.'
    },
    {
      num: '02',
      title: 'Material Honesty',
      icon: ShieldCheck,
      desc: 'We source premium materials globally from trusted manufacturers, ensuring exceptional quality, authentic craftsmanship, and uncompromising standards in every project.'
    },
    {
      num: '03',
      title: 'Turnkey Accountability',
      icon: Layers,
      desc: 'Design, civil modifications, electrical, procurement, bespoke joinery, and handover — managed by a single unified engineering team with zero blame-shifting.'
    },
    {
      num: '04',
      title: '40-Year Heritage',
      icon: Award,
      desc: 'Four generations of construction trust in Hyderabad — from Mastana Constructions and Mastana Infra to ESPACIO. We stand behind every millimetre of our work.'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      title: 'Besoke Villa Interior',
      subtitle: 'Jubilee Hills Private Residence'
    },
    {
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
      title: 'Modular Precision Joinery',
      subtitle: 'ESPACIO Studio & Workshop'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      title: 'Italian Marble Architecture',
      subtitle: 'Gachibowli Modern Estate'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
      title: 'Lakeside Architectural Build',
      subtitle: 'Featured in Guntur Kaaram'
    }
  ];

  return (
    <div className="bg-bg text-ink min-h-screen selection:bg-gold selection:text-ink">
      <SEO
        title="About — ESPACIO Interiors"
        description="ESPACIO is Hyderabad's premier engineering-first interior design studio, backed by 40 years of family construction legacy across Mastana Constructions & Mastana Infra."
        url="/about"
      />

      {/* ── 1. SIGNATURE HERO BANNER (Matches Services hero layout with bottom-anchored content) ────────────── */}
      {aboutData.heroVisible !== false && (
        <section ref={heroRef} className="relative h-[90dvh] sm:h-[80vh] lg:h-[96vh] min-h-[480px] sm:min-h-[520px] lg:min-h-0 px-3 sm:px-5 pt-2 sm:pt-2.5 lg:pt-3 pb-2 lg:px-12 z-0">
          <div 
            className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] origin-top shadow-2xl bg-bg-card isolate hero-card-clipped"
          >
            {/* Background image container — crisp 1:1 pixel rendering without scale blur */}
            <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
              <picture className="w-full h-full rounded-[inherit] overflow-hidden">
                <source srcSet={aboutData.heroImage.replace(/\.jpg$/i, '.webp')} type="image/webp" />
                <img
                  src={aboutData.heroImage}
                  alt="ESPACIO Luxury Background"
                  decoding="async"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center rounded-[inherit]"
                />
              </picture>
            </div>

            {/* Atmospheric Background Shadow Mist — deep, soft mist strictly behind lower text area for high contrast while keeping room bright */}
            <div 
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse 85% 65% at 20% 85%, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.55) 45%, rgba(0, 0, 0, 0.18) 72%, transparent 100%), linear-gradient(to top, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.40) 45%, transparent 80%)'
              }}
            />

            {/* Hero Text Content with Dynamic Scroll Parallax — Anchored at Bottom */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
              <motion.div 
                style={{ y: textY, opacity: textOpacity }}
                className="w-full px-6 sm:px-8 md:px-12 pb-10 sm:pb-12 md:pb-14 pointer-events-auto relative"
              >
                {/* Secondary localized soft mist cloud directly behind headline */}
                <div 
                  className="absolute left-0 bottom-0 w-full md:w-[900px] h-[120%] pointer-events-none -z-10" 
                  style={{ 
                    background: 'radial-gradient(ellipse 80% 70% at 30% 60%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 60%, transparent 100%)',
                    filter: 'blur(20px)'
                  }} 
                />
                <div className="flex flex-col items-start gap-2.5 sm:gap-3 max-w-[850px]">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-[#101014] px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-sans font-medium shadow-lg border border-black/5 select-none tracking-normal mb-1">
                    <Award size={14} className="text-[#101014] shrink-0" />
                    <span>{aboutData.heroBadge || 'About ESPACIO'}</span>
                  </div>
                  <h1 
                    className="font-display leading-[0.88]" 
                    style={{ 
                      fontSize: 'clamp(28px, 5.5vw, 76px)', 
                      lineHeight: 0.88, 
                      letterSpacing: '0.015em', 
                      fontWeight: 600,
                      color: '#ECC979',
                      textShadow: '0 3px 16px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9), 0 8px 32px rgba(0, 0, 0, 0.75)',
                    }}
                  >
                    {aboutData.heroTitle}
                  </h1>
                  <p className="font-sans text-[13.5px] sm:text-[15px] md:text-[15.5px] text-white/95 max-w-[620px] leading-relaxed" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.8)' }}>
                    {aboutData.heroSubtitle}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <ScrollDownIndicator />
          </div>
        </section>
      )}

      {/* ── 2. OUR STORY SECTION (Warm Cream Background) ─────────────────── */}
      <section className="pt-6 sm:pt-16 lg:pt-16 pb-12 sm:pb-20 lg:pb-24 px-4 sm:px-6 md:px-12 border-b border-ink-border bg-bg relative">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative">
          
          {/* Left Column — 3 Landmark Images Down by Down (Scrolls naturally) */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-7 w-full">
            {defaultLandmarkBuilds.map((item, idx) => (
              <div 
                key={item.id}
                className="relative aspect-[16/10] sm:aspect-[16/9.5] rounded-[16px] sm:rounded-[20px] overflow-hidden shadow-md hover:shadow-2xl border border-ink-border group bg-neutral-900 transition-all duration-300"
              >
                <img
                  src={getOptimizedImageUrl(item.image, 1200, 90)}
                  alt={item.fullName}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.retried) {
                      e.currentTarget.dataset.retried = 'true';
                      e.currentTarget.src = item.image;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                
                {/* Top Corner Landmark Tag — Refined Glass Pill with Gold Indicator */}
                <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-sm transition-all duration-300 group-hover:border-white/35 group-hover:bg-black/55 select-none z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 ring-1 ring-gold/40" />
                  <span className="font-sans text-[8.5px] sm:text-[9px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Glass Pill — Fits snug to text only */}
                <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-[8px] sm:rounded-[10px] bg-white/95 dark:bg-[#151518]/92 backdrop-blur-xl border border-white/70 dark:border-white/15 shadow-md z-10 inline-flex items-center">
                  <span className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#9E7B3B] dark:text-[#E8BA60] whitespace-nowrap">
                    {item.title} · {item.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column — Narrative Story (Vertically centered, scrolls together with landmark images in one go) */}
          <div className="lg:col-span-7 lg:self-center">
            <Reveal delay={0.15} className="space-y-5 sm:space-y-6 pt-1">
              <h2 className="font-display text-gold leading-tight tracking-tight font-normal" style={{ fontSize: 'clamp(36px,5.5vw,64px)', letterSpacing: '0.02em', fontFamily: "'Cormorant Garamond', serif" }}>
                {aboutData.storyBadge}
              </h2>
              <p className="font-editorial text-ink-soft text-[18px] sm:text-[20px] md:text-[21px] font-normal leading-[1.65]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {aboutData.storyMain}
              </p>
              <p className="font-editorial text-gold font-semibold text-[20px] sm:text-[22px] md:text-[23px] leading-[1.5]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {aboutData.storyHighlight}
              </p>
              <p className="font-editorial text-ink-soft text-[18px] sm:text-[20px] md:text-[21px] font-normal leading-[1.65]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {aboutData.storyP1}
              </p>
              <p className="font-editorial text-ink-soft text-[18px] sm:text-[20px] md:text-[21px] font-normal leading-[1.65]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {aboutData.storyP2}
              </p>
              <p className="font-editorial text-ink-soft text-[18px] sm:text-[20px] md:text-[21px] font-normal leading-[1.65]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {aboutData.storyP3}
              </p>
            </Reveal>
          </div>

        </div>
      </section>

      {/* ── 3. 4-GENERATION TIMELINE (Standard Functional Cards) ──── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 md:px-12 border-b border-ink-border bg-bg-card">
        <div className="max-w-[1440px] mx-auto space-y-10 sm:space-y-12">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-ink-border/60 pb-6">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">{aboutData.genBadge}</span>
              <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink mt-1">{aboutData.genTitle}</h2>
            </div>
            <span className="font-sans text-xs text-ink-muted tracking-widest uppercase font-semibold">
              {aboutData.genSubtitle && aboutData.genSubtitle !== 'Hover to Expand Era' ? aboutData.genSubtitle : 'Four Decades of Heritage'}
            </span>
          </Reveal>

          {/* Standard 4-Column Responsive Grid — Equal width, static, fully readable */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 items-stretch">
            {(aboutData.generations || defaultGenerations).map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-[22px] sm:rounded-[24px] overflow-hidden bg-bg text-ink border border-ink-border/80 hover:border-gold/50 transition-colors duration-200 p-6 sm:p-7 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold">
                      {item.gen}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                  </div>

                  <h3 className="font-display font-bold text-ink text-xl sm:text-2xl mb-1.5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="font-sans text-xs font-semibold text-gold uppercase tracking-wider mb-4 leading-normal">
                    {item.company}
                  </p>

                  <p className="font-sans text-[13.5px] sm:text-sm text-ink-soft leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CORE PRINCIPLES GRID (🔒 LOCKED SECTION) ─────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="text-center max-w-[700px] mx-auto">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Philosophy</span>
            <h2 className="font-display text-[clamp(28px,3.8vw,52px)] font-bold text-ink mt-1">
              Uncompromising Design Principles
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 md:gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.num} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative p-[1.5px] sm:p-[2px] rounded-[20px] sm:rounded-[24px] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-[0_12px_36px_-8px_rgba(201,169,110,0.35)] h-full"
                  >
                    {/* Continuous Rotating Gold Border Beam */}
                    <div 
                      className="absolute inset-[-150%] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 180deg, rgba(201,169,110,0.2) 230deg, rgba(201,169,110,0.85) 300deg, #FFFFFF 345deg, rgba(201,169,110,0.95) 360deg)',
                        animation: `goldBorderSpin ${6 + i * 0.5}s linear infinite`,
                        animationDelay: `-${i * 1.5}s`,
                      }}
                    />

                    {/* Static Hairline Gold Base Border */}
                    <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] border border-gold/30 pointer-events-none" />

                    {/* Inner Card Content */}
                    <div className="relative z-10 w-full h-full p-4 sm:p-7 md:p-9 rounded-[18.5px] sm:rounded-[22px] bg-bg-card flex flex-col justify-between overflow-hidden">
                      <div className="absolute top-3 right-4 sm:top-4 sm:right-6 font-display text-3xl sm:text-5xl font-bold text-ink-border/20 group-hover:text-gold/25 transition-colors select-none">
                        {v.num}
                      </div>

                      <div>
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-[11px] sm:rounded-[14px] bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-2.5 sm:mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          <Icon className="w-4.5 h-4.5 sm:w-6 sm:h-6 stroke-[1.75]" />
                        </div>
                        <h3 className="font-display text-[16px] sm:text-2xl font-bold text-ink mb-1 sm:mb-2.5 leading-snug">
                          {v.title}
                        </h3>
                        <p className="font-sans text-[12.5px] sm:text-sm text-ink-soft leading-relaxed">
                          {v.desc}
                        </p>
                      </div>

                      <div className="pt-2.5 mt-2.5 sm:pt-5 sm:mt-5 border-t border-ink-border/40 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-gold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span>ESPACIO Guarantee</span>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>



      {/* ── 6. CRAFTSMANSHIP GALLERY GRID ─────────────────────────────────── */}
      <section className="py-14 sm:py-20 lg:py-24 px-6 md:px-12 bg-bg">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="text-center max-w-[650px] mx-auto">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">{aboutData.galleryBadge}</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink mt-1">
              {aboutData.galleryTitle}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
            {(aboutData.galleryImages || defaultGalleryImages).map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group flex flex-col cursor-pointer">
                  <motion.div 
                    whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                    whileTap={{ scale: 0.98 }}
                    className="relative aspect-[3/4] rounded-[20px] overflow-hidden border border-ink-border shadow-md hover:shadow-xl transition-all duration-300 bg-bg-card"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none hidden sm:block" />
                    
                    {/* Desktop Hover Glass Card (Hidden on Mobile) */}
                    <div 
                      className="hidden sm:block absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#151518]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[16px] p-4 shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B89047]" />
                      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#9E7B3B] dark:text-[#E8BA60] pl-2 line-clamp-1">
                        {img.subtitle}
                      </p>
                      <h3 className="font-display text-[15px] font-bold text-[#101014] dark:text-white leading-snug mt-0.5 pl-2 line-clamp-2">
                        {img.title}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Mobile Caption (Below image so it never covers the render) */}
                  <div className="sm:hidden pt-3 px-1">
                    <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.18em] text-gold">
                      {img.subtitle}
                    </p>
                    <h3 className="font-display text-[16px] font-bold text-ink leading-snug mt-1">
                      {img.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
