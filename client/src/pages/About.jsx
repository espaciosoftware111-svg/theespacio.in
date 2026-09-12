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
    title: 'Mantana Constructions',
    company: 'Commercial & Multi-Family Residential',
    desc: 'Expanded into large-scale residential complexes and commercial landmarks across Hyderabad. Built a reputation for zero material compromises and strict engineering tolerances.',
    image: '/images/company/2bhk_urban/Ideas_2_2-_1-20260810-173541.jpg'
  },
  {
    gen: 'Generation III',
    title: 'Mastana Infra',
    company: 'Iconic Private Estates & Infrastructure',
    desc: 'Pioneered luxury architectural builds and bespoke private lakefront residences — including the lakeside estate chosen as a primary filming location in the movie Guntur Kaaram.',
    image: '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_15-20260813-110616.jpg'
  },
  {
    gen: 'Generation IV',
    title: 'ESPACIO Interiors & Modular',
    company: 'Engineering-First Bespoke Interiors',
    desc: 'Fusing structural construction mastery with luxury interior architecture. We don\'t just style spaces — we engineer every wall, cabinet, and finish for lifetime permanence.',
    image: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_23-20260810-124912.jpg'
  }
];

const defaultGalleryImages = [
  {
    url: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-121310.jpg',
    title: 'Architectural Cornice & Fluted Wainscoting',
    subtitle: 'Jubilee Hills Master Suite'
  },
  {
    url: '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Parents_Room_1-20260813-110616.jpg',
    title: 'Bespoke Solid Walnut Veneer Joinery',
    subtitle: 'Contemporary Luxury Suite'
  },
  {
    url: '/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Guest_restaurant_20-20260810-120432.jpg',
    title: 'Curved Archways & Classical Plaster Trim',
    subtitle: 'Bespoke Living Lounge'
  },
  {
    url: '/images/company/2bhk_mordern_retro/hall_2.jpg',
    title: 'Halo Luminaire & Wall Paneling Architecture',
    subtitle: 'Modern Retro Residence'
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

const defaultAboutHeroImage = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_22-20260813-110617.jpg';
const defaultAboutStoryImage = '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_10-20260813-110615.jpg';

const getValidHeroImage = (val, fallback = defaultAboutHeroImage) => {
  if (!val || typeof val !== 'string' || !val.trim() || val.includes('unsplash.com') || val.includes('photo-1600585154340-be6161a56a0c')) {
    return fallback;
  }
  return val;
};

const getValidStoryImage = (val, fallback = defaultAboutStoryImage) => {
  if (!val || typeof val !== 'string' || !val.trim() || val.includes('unsplash.com') || val.includes('3bhk_lux/open_hall.png') || val.includes('photo-1600585154340-be6161a56a0c')) {
    return fallback;
  }
  return val;
};

const getValidGenerations = (val) => {
  if (Array.isArray(val) && val.length > 0) {
    // If user's stored generations still have old duplicate open_hall image, replace with new defaults
    const hasDuplicates = val.some(g => g.image && (g.image.includes('3bhk_lux/open_hall.png') || g.image.includes('unsplash.com')));
    if (!hasDuplicates) return val;
  }
  return defaultGenerations;
};

const getValidGallery = (val) => {
  if (Array.isArray(val) && val.length > 0) {
    const hasDuplicates = val.some(g => g.url && (g.url.includes('3bhk_lux/open_hall.png') || g.url.includes('unsplash.com')));
    if (!hasDuplicates) return val;
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

  const [aboutData, setAboutData] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return {
      heroBadge: getNonEmpty(s?.about_hero_badge, 'About ESPACIO'),
      heroTitle: getNonEmpty(s?.about_hero_title, 'Four generations of construction.\nOne new standard for design.'),
      heroSubtitle: getNonEmpty(s?.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.'),
      heroImage: getValidHeroImage(s?.about_hero_image, defaultAboutHeroImage),
      heroStats: (Array.isArray(s?.about_hero_stats) && s.about_hero_stats.length > 0) ? s.about_hero_stats : defaultStats,
      heroVisible: s?.about_hero_visible !== false,

      storyBadge: getNonEmpty(s?.about_story_badge, 'OUR ORIGIN STORY'),
      storyMain: getNonEmpty(s?.about_story_main, "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design — walls that were never built right in the first place."),
      storyHighlight: getNonEmpty(s?.about_story_highlight, "We've spent four generations making sure that never happens."),
      storyP1: getNonEmpty(s?.about_story_p1, 'Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mantana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.'),
      storyP2: getNonEmpty(s?.about_story_p2, 'One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.'),
      storyP3: getNonEmpty(s?.about_story_p3, "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't."),
      storyImage: getValidStoryImage(s?.about_story_image, defaultAboutStoryImage),
      milestoneLabel: getNonEmpty(s?.about_milestone_label, 'Engineering Milestone'),
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
          heroTitle: getNonEmpty(s.about_hero_title, 'Four generations of construction.\nOne new standard for design.'),
          heroSubtitle: getNonEmpty(s.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.'),
          heroImage: getValidHeroImage(s.about_hero_image, defaultAboutHeroImage),
          heroStats: (Array.isArray(s.about_hero_stats) && s.about_hero_stats.length > 0) ? s.about_hero_stats : defaultStats,
          heroVisible: s.about_hero_visible !== false,

          storyBadge: getNonEmpty(s.about_story_badge, 'OUR ORIGIN STORY'),
          storyMain: getNonEmpty(s.about_story_main, "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design — walls that were never built right in the first place."),
          storyHighlight: getNonEmpty(s.about_story_highlight, "We've spent four generations making sure that never happens."),
          storyP1: getNonEmpty(s.about_story_p1, 'Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mantana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.'),
          storyP2: getNonEmpty(s.about_story_p2, 'One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.'),
          storyP3: getNonEmpty(s.about_story_p3, "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't."),
          storyImage: getValidStoryImage(s.about_story_image, defaultAboutStoryImage),
          milestoneLabel: getNonEmpty(s.about_milestone_label, 'Engineering Milestone'),
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
      desc: 'Four generations of construction trust in Hyderabad — from Mantana & Mastana to ESPACIO. We stand behind every millimetre of our work.'
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
        description="ESPACIO is Hyderabad's premier engineering-first interior design studio, backed by 40 years of family construction legacy across Mantana & Mastana."
        url="/about"
      />

      {/* ── 1. SIGNATURE HERO BANNER (Matches Services hero layout with bottom-anchored content) ────────────── */}
      {aboutData.heroVisible !== false && (
        <section ref={heroRef} className="relative h-[64vh] sm:h-[80vh] lg:h-[96vh] min-h-[400px] sm:min-h-[520px] lg:min-h-0 px-3 sm:px-5 pt-2 sm:pt-2.5 lg:pt-3 pb-2 lg:px-12 z-0">
          <div className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] origin-top shadow-2xl">
            <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 overflow-hidden">
              <img
                src={aboutData.heroImage}
                alt="ESPACIO Luxury Background"
                className="w-full h-full object-cover object-center brightness-95"
              />
            </motion.div>
            {/* Dark overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/65 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10 z-10 pointer-events-none" />
            {/* Mist / ambient glow behind text */}
            <div className="absolute bottom-0 left-0 w-full h-[55%] z-[11] pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 100%, rgba(201,169,110,0.07) 0%, rgba(20,12,4,0.30) 55%, transparent 100%)' }} />

            {/* Hero Text Content with Dynamic Scroll Parallax — Anchored at Bottom */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
              <motion.div 
                style={{ y: textY, opacity: textOpacity }}
                className="w-full px-6 sm:px-8 md:px-12 pb-10 sm:pb-12 md:pb-14 pointer-events-auto"
              >
                {/* Mist highlight panel behind text */}
                <div className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none z-[-1]" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }} />
                <div className="flex flex-col items-start gap-2.5 sm:gap-3 max-w-[850px]">
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-[#101014] px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-sans font-medium shadow-lg border border-black/5 select-none tracking-normal mb-1">
                    <Award size={14} className="text-[#101014] shrink-0" />
                    <span>{aboutData.heroBadge || 'About ESPACIO'}</span>
                  </div>
                  <h1 className="font-display font-medium leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]" style={{ fontSize: 'clamp(28px, 5.5vw, 76px)', lineHeight: 0.95, letterSpacing: '0.02em', fontWeight: 500, textShadow: '0 2px 32px rgba(0,0,0,0.8), 0 1px 0 rgba(0,0,0,0.5)' }}>
                    {aboutData.heroTitle}
                  </h1>
                  <p className="font-sans text-[13.5px] sm:text-[15px] md:text-[15.5px] text-white/95 max-w-[620px] leading-relaxed" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.9)' }}>
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
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* Left Column — Sticky Showcase Card on Mobile & Desktop */}
          <div className="lg:col-span-5 sticky top-[72px] sm:top-20 lg:top-28 z-20 pb-3 lg:pb-0 bg-bg/95 backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0 pt-3 sm:pt-4 lg:pt-0">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-[18px] sm:rounded-[24px] overflow-hidden shadow-xl border border-ink-border group">
              <img
                src={getOptimizedImageUrl(aboutData.storyImage, 1400, 92)}
                alt="ESPACIO Studio Craft"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {aboutData.milestoneVisible !== false && (
                <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-3 sm:p-5 rounded-[14px] sm:rounded-[16px] bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
                  <span className="font-sans text-[9.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#9E7B3B] block">
                    {aboutData.milestoneLabel}
                  </span>
                  <p className="font-display text-[13px] sm:text-lg font-bold text-[#101014] mt-0.5 sm:mt-1 leading-snug">
                    {aboutData.milestoneText}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column — Narrative Story */}
          <Reveal delay={0.15} className="lg:col-span-7 space-y-6 pt-2">
            <h2 className="font-display text-gold leading-tight tracking-tight font-normal" style={{ fontSize: 'clamp(36px,5.5vw,64px)', letterSpacing: '0.02em' }}>
              {aboutData.storyBadge}
            </h2>
            <p className="font-sans text-ink-soft text-[14.5px] sm:text-[16px] font-normal leading-relaxed">
              {aboutData.storyMain}
            </p>
            <p className="font-sans text-gold font-semibold text-[16px] sm:text-[18px] leading-relaxed">
              {aboutData.storyHighlight}
            </p>
            <p className="font-sans text-ink-soft text-[14.5px] sm:text-[16px] font-normal leading-relaxed">
              {aboutData.storyP1}
            </p>
            <p className="font-sans text-ink-soft text-[14.5px] sm:text-[16px] font-normal leading-relaxed">
              {aboutData.storyP2}
            </p>
            <p className="font-sans text-ink-soft text-[14.5px] sm:text-[16px] font-normal leading-relaxed">
              {aboutData.storyP3}
            </p>
          </Reveal>

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
                    className="p-4 sm:p-7 md:p-9 rounded-[18px] sm:rounded-[22px] bg-bg-card border border-ink-border shadow-sm hover:border-gold/50 hover:shadow-lg transition-all duration-300 relative group overflow-hidden h-full flex flex-col justify-between"
                  >
                    <div className="absolute top-3 right-4 sm:top-4 sm:right-6 font-display text-3xl sm:text-5xl font-bold text-ink-border/20 group-hover:text-gold/20 transition-colors select-none">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {(aboutData.galleryImages || defaultGalleryImages).map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative aspect-[16/11] sm:aspect-[3/4] rounded-[20px] overflow-hidden border border-ink-border shadow-md hover:shadow-xl transition-all duration-300 bg-bg-card cursor-pointer"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Color-Corrected High-Contrast Glass Card */}
                  <div 
                    className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-xl border border-black/5 rounded-[15px] sm:rounded-[16px] p-3.5 sm:p-5 shadow-2xl opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-400 pointer-events-none overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B89047]" />
                    <p className="font-sans text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-[#9E7B3B] pl-2 line-clamp-1">
                      {img.subtitle}
                    </p>
                    <h3 className="font-display text-[15px] sm:text-[16px] font-bold text-[#101014] leading-snug mt-0.5 sm:mt-1 pl-2 line-clamp-2">
                      {img.title}
                    </h3>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
