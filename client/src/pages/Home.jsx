import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/common/SEO';
import Logo from '../components/common/Logo';
import HeroSlideshow from '../components/common/HeroSlideshow';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getCMSData, STORAGE_KEYS } from '../utils/cmsStore';
import { USER_UPLOADED_BEDROOM_IMAGE } from '../assets/userUploadedBedroom';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const StickyScroll = React.lazy(() => import('../components/ui/sticky-scroll-reveal').then(m => ({ default: m.StickyScroll })));
const HeroParallax = React.lazy(() => import('../components/ui/hero-parallax').then(m => ({ default: m.HeroParallax })));
const Testimonials = React.lazy(() => import('../components/ui/Testimonials'));

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

/* ── Magnetic Item for FAQ ──────────────────────────────────────────────── */
const MagneticItem = ({ children, className, onClick, isOpen }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
      whileHover={{ scale: isOpen ? 1.02 : 1.015 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

/* ── Glowing number badge for FAQ ────────────────────────────────────────── */
const Badge = ({ num, isOpen }) => (
  <motion.span
    className="shrink-0 font-sans text-[10px] font-bold tracking-widest uppercase rounded-full px-2.5 py-1 mt-0.5"
    animate={{
      background: isOpen
        ? 'linear-gradient(135deg, #c5a572 0%, #a07845 100%)'
        : 'rgba(0,0,0,0.06)',
      color: isOpen ? '#fff' : '#4b5563',
      boxShadow: isOpen
        ? '0 0 12px rgba(197,165,114,0.6), 0 0 24px rgba(197,165,114,0.3)'
        : '0 0 0 transparent',
    }}
    transition={{ duration: 0.4 }}
  >
    {String(num + 1).padStart(2, '0')}
  </motion.span>
);

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const AutoScrollingInteriorBox = ({ activeIdx, items }) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  useEffect(() => {
    if (activeIdx !== null && activeIdx !== undefined) {
      setIndex(activeIdx);
    }
  }, [activeIdx]);

  // Pure continuous auto-slide animation only when in view
  useEffect(() => {
    if (activeIdx !== null && activeIdx !== undefined) return;
    if (!isInView) return;
    const listLen = items && items.length > 0 ? items.length : 1;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % listLen);
    }, 2800);
    return () => clearInterval(interval);
  }, [activeIdx, items, isInView]);

  const activeItem = (items && items.length > 0)
    ? items[index % items.length]
    : null;

  const activeImg = activeItem?.img || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80';
  const activeTag = activeItem?.tag || 'FAQ';
  const activeCaption = activeItem?.q || '';

  return (
    <div ref={containerRef} className="w-full">
      <TiltCard className="relative w-full max-w-[520px] xl:max-w-[560px] mx-auto">
        <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[26px] shadow-2xl bg-stone-900 cursor-pointer border border-black/10">
          <AnimatePresence mode="sync">
            <motion.img
              key={index}
              src={activeImg}
              alt={activeCaption || 'ESPACIO Showcase'}
              decoding="async"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                willChange: 'transform, opacity',
                imageRendering: 'auto',
                backfaceVisibility: 'hidden',
              }}
              className="absolute inset-0 w-full h-full object-cover object-center transform-gpu"
            />
          </AnimatePresence>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

          {/* Active tag & caption */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              className="absolute bottom-5 left-5 right-5 text-left pointer-events-none z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-[#C9A96E]">
                  {activeTag}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-[11px] font-sans font-medium tracking-[0.12em] text-white/70 uppercase">
                  Featured Space
                </span>
              </div>
              <p className="text-[#FAF8F5] font-sans text-[15px] sm:text-[16px] font-medium leading-snug tracking-tight">
                {activeCaption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating 3D layer depth effect */}
        <div
          className="absolute -inset-3 rounded-[36px] -z-10 opacity-25 blur-xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, #c5a572, #a07845)' }}
        />
      </TiltCard>
    </div>
  );
};

const teamProjectsData = [
  {
    projectImg: "/images/about/about_showcase_1.jpg",
    memberImg: "/reviews/paladugu_raju.png",
    name: "Spatial Design Lead",
    role: "Thematic Spatial Planning",
    projectLabel: "Cosmic Odyssey Kids Suite"
  },
  {
    projectImg: "/images/about/about_showcase_2.jpg",
    memberImg: "/reviews/kishor_kumar.png",
    name: "Interior Specialist",
    role: "Classical Boiserie Styling",
    projectLabel: "Sage Classical Lounge"
  },
  {
    projectImg: "/images/about/about_showcase_3.jpg",
    memberImg: "/reviews/amresh_kumar.png",
    name: "Joinery & Detailing",
    role: "Bespoke Study & Atelier",
    projectLabel: "Executive Study & Atelier"
  },
  {
    projectImg: "/images/about/about_showcase_4.jpg",
    memberImg: "/reviews/imtiyaz_shaik.png",
    name: "Modular Specialist",
    role: "High-Gloss Modular Kitchens",
    projectLabel: "Modern Quartzite Kitchen"
  }
];

const TeamProjectsShowcase = ({ customSlides }) => {
  const slides = (Array.isArray(customSlides) && customSlides.length > 0 && !customSlides.some(s => s.projectImg?.includes('company/'))) ? customSlides : teamProjectsData;
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "200px" });
  const progressBarRef = useRef(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const INTERVAL = 2200;

  const startProgress = () => {
    if (progressBarRef.current) progressBarRef.current.style.width = '0%';
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const pct = Math.min(((ts - start) / INTERVAL) * 100, 100);
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pct}%`;
      }
      if (pct < 100) progressRef.current = requestAnimationFrame(tick);
    };
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    progressRef.current = requestAnimationFrame(tick);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startProgress();
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIdx((prev) => (prev + 1) % slides.length);
      startProgress();
    }, INTERVAL);
  };

  useEffect(() => {
    if (isInView) {
      resetTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, [slides.length, isInView]);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setIdx((prev) => (prev + 1) % slides.length);
    resetTimer();
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setIdx((prev) => (prev - 1 + slides.length) % slides.length);
    resetTimer();
  };

  const current = slides[idx % slides.length] || teamProjectsData[0];
  const currentImg = getOptimizedImageUrl(current.projectImg, 1400, 88);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 35 : -35,
      opacity: 0,
      scale: 1.04,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir) => ({
      x: dir < 0 ? 35 : -35,
      opacity: 0,
      scale: 0.97,
    }),
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[580px] lg:max-w-none mx-auto aspect-[4/3.3] sm:aspect-[4/3] min-h-[290px] sm:min-h-[380px] group">

      {/* ── Main Card ── */}
      <div className="w-full h-full rounded-[20px] sm:rounded-[26px] overflow-hidden shadow-2xl border border-ink-border/15 relative z-10 bg-stone-950">
        <AnimatePresence custom={direction} initial={false} mode="sync">
          <motion.div
            key={`proj-${idx}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.45, ease: 'easeInOut' },
            }}
            style={{ willChange: 'transform, opacity' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, info) => {
              if (info.offset.x < -40) handleNext();
              else if (info.offset.x > 40) handlePrev();
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing select-none transform-gpu"
          >
            {/* Pure Ultra HD Crisp Image Layer */}
            <img
              src={currentImg}
              alt={current.projectLabel}
              decoding="async"
              className="w-full h-full object-cover select-none pointer-events-none transform-gpu"
              style={{ imageRendering: 'auto', backfaceVisibility: 'hidden' }}
              draggable="false"
            />

            {/* Soft bottom vignette for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Architectural Space Caption */}
            <motion.div
              className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 text-left pointer-events-none z-20 select-none"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-[#C9A96E]">
                  {current.role || 'INTERIOR SHOWCASE'}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.12em] text-white/70 uppercase">
                  Featured Space
                </span>
              </div>
              <p className="text-[#FAF8F5] font-sans text-[15px] sm:text-[18px] font-medium leading-snug tracking-tight drop-shadow-sm">
                {current.projectLabel}
              </p>
            </motion.div>

          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-gold transition-none"
            style={{ width: '0%' }}
          />
        </div>
      </div>

    </div>
  );
};


const AnimatedCounter = ({ value, duration = 0.8 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.1 });

  const hasNumbers = /[0-9]/.test(value);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    if (!hasNumbers) {
      return;
    }

    const end = parseInt(value.replace(/\D/g, ''), 10);
    let startTime = null;
    let animationFrameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Ease out quad: f(t) = t * (2 - t)
      const easedProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, value, duration, hasNumbers]);

  if (!hasNumbers) {
    return (
      <span ref={ref} className="font-display">
        {value}
      </span>
    );
  }

  const suffix = value.replace(/[0-9]/g, '');

  return (
    <span ref={ref} className="font-display">
      {count}
      {suffix}
    </span>
  );
};


const statsData = [
  {
    value: "25+",
    label: "Projects Completed",
    progressWidth: "60%",
    dots: [true, false, false]
  },
  {
    value: "100+",
    label: "Happy Clients (including materials clients)",
    progressWidth: "80%",
    dots: [false, true, false]
  },
  {
    value: "40+",
    label: "Years Combined Legacy",
    progressWidth: "90%",
    dots: [false, false, true]
  }
];

const faqListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const HERO_IMAGES = [
  '/images/hero/hero_bedroom_4k.webp',
  '/images/hero/hero_kitchen_4k.webp',
  '/images/hero/hero_kids_bedroom_4k.webp',
  '/images/hero/hero_dining_4k.webp'
];

const Home = () => {
  const [projects, setProjects] = useState([]);
  const heroRef = useRef(null);
  const faqSectionRef = useRef(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [hoveredStatIdx, setHoveredStatIdx] = useState(null);

  const [homeSettings, setHomeSettings] = useState({
    hero_title: 'Engineering. Elegance. Experience.',
    hero_subtitle: 'Bespoke Luxury Interiors & Turned-Key Executions in Hyderabad',
    hero_cta_text: 'Get Estimate',
    hero_visible: true,

    hero_bg_images: HERO_IMAGES,
    hero_card_image: '/images/hero/hero_bedroom_4k.webp',
    hero_card_heading: 'We Craft the Future Dwelling',
    hero_card_cta_text: 'Our Projects',
    hero_card_cta_link: '/projects',
    hero_card_cta_visible: true,

    hero_stat1_value: '25+',
    hero_stat1_label: 'Projects Completed',
    hero_stat1_visible: true,
    hero_stat1_order: 1,

    hero_stat2_value: '100+',
    hero_stat2_label: 'Happy Clients',
    hero_stat2_visible: true,
    hero_stat2_order: 2,

    hero_stat3_value: '40+',
    hero_stat3_label: 'Years Legacy',
    hero_stat3_visible: true,
    hero_stat3_order: 3,

    intro_heading: 'Turnkey interiors, done properly.',
    intro_description: "ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don't just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what's happening on site.",
    intro_cta_text1: 'Our Story ↗',
    intro_cta_text2: 'Read More ↗',
    intro_cta_link: '/about',

    grid_stat1_val: '25+',
    grid_stat1_label: 'Projects Completed',
    grid_stat2_val: '100+',
    grid_stat2_label: 'Happy Clients',
    grid_stat3_val: '40+',
    grid_stat3_label: 'Years Combined Legacy',

    about_title: 'Four Decades of Structural Excellence',
    about_subtitle: 'HERITAGE & CRAFTSMANSHIP',
    about_description: 'Born out of a multi-generational legacy in civil construction, ESPACIO brings structural rigor and high-tolerance engineering to luxury interior architecture across Hyderabad.',
    about_experience_years: '40+',
    about_visible: true,
  });

  useEffect(() => {
    const loadHomeCMS = async () => {
      try {
        const stored = getCMSData(STORAGE_KEYS.SETTINGS);
        if (stored && Object.keys(stored).length > 0) {
          const sanitizedStored = { ...stored };
          if (sanitizedStored.intro_heading === 'From Concept to Handover — ESPACIO Delivers Complete Interiors.') {
            sanitizedStored.intro_heading = 'Turnkey interiors, done properly.';
          }
          if (sanitizedStored.intro_description && sanitizedStored.intro_description.includes('We bring 40+ years of family construction heritage')) {
            sanitizedStored.intro_description = "ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don't just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what's happening on site.";
          }
          setHomeSettings((prev) => ({ ...prev, ...sanitizedStored }));
        }
      } catch {}

      try {
        const res = await axios.get('/settings');
        if (res.data && res.data.success && res.data.data && Object.keys(res.data.data).length > 0) {
          const apiData = { ...res.data.data };
          if (apiData.intro_heading === 'From Concept to Handover — ESPACIO Delivers Complete Interiors.') {
            apiData.intro_heading = 'Turnkey interiors, done properly.';
          }
          if (apiData.intro_description && apiData.intro_description.includes('We bring 40+ years of family construction heritage')) {
            apiData.intro_description = "ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don't just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what's happening on site.";
          }
          setHomeSettings((prev) => ({ ...prev, ...apiData }));
          setCMSData(STORAGE_KEYS.SETTINGS, apiData);
        }
      } catch {}
    };

    loadHomeCMS();

    const handleSync = () => loadHomeCMS();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Preload craft card thumbnails for instant transition syncing
  useEffect(() => {
    HERO_IMAGES.forEach((imgUrl) => {
      const thumbSrc = imgUrl.replace(/\.(webp|jpg|png)$/i, '_thumb.webp');
      const img = new Image();
      img.src = thumbSrc;
      if (img.decode) img.decode().catch(() => {});
    });
  }, []);

  const defaultHomeFaqItems = [
    {
      q: "How long does a project usually take?",
      a: "Most projects take about two to three months from start to finish. The exact timeline depends on how detailed and customized your space is, but we'll give you a clear schedule before work begins so there are no surprises along the way.",
      img: "/images/faq/faq_1_timeline.jpg",
      tag: "TIMELINE"
    },
    {
      q: "Do you provide turnkey interior solutions?",
      a: "Yes. Every project we take on, whether it's a home or a commercial space, is handled fully by our own team. Design, materials, execution, and final finishing all happen under one roof, so you're never left coordinating between different vendors.",
      img: "/images/faq/faq_2_services.jpg",
      tag: "SERVICES"
    },
    {
      q: "What is your consultation process?",
      a: "We start with a consultation to understand your space, your needs, and how you actually want to live in it. From there, we move into detailed design and planning, so nothing gets built until the vision is fully worked out.",
      img: "/images/faq/faq_3_process.jpg",
      tag: "PROCESS"
    },
    {
      q: "Which locations do you currently serve?",
      a: "We're based in Hyderabad and have delivered homes and commercial spaces across the city.",
      img: "/images/faq/faq_4_location.jpg",
      tag: "LOCATION"
    },
    {
      q: "How can customers request a quotation?",
      a: "Just fill out the contact form on our website, and our team will personally reach out to understand your project and walk you through next steps.",
      img: "/images/faq/faq_5_pricing.jpg",
      tag: "PRICING"
    },
    {
      q: "Do you sell materials separately from design services?",
      a: "Yes. Materials like WPC panels, polygranite sheets, and acrylic sheets are available for standalone purchase, even if you're not booking a full design or execution project with us.",
      img: "/images/faq/faq_6_materials.jpg",
      tag: "MATERIALS"
    },
    {
      q: "What if I already have a design in mind, can you just execute it?",
      a: "Of course. Whether you already have a finalized design or need us to build one from scratch, we can step in wherever you need us, whether that's execution only or a complete design and build package.",
      img: "/images/faq/faq_8_custom.jpg",
      tag: "CUSTOM"
    },
    {
      q: "Can I customize designs, or do you offer fixed packages?",
      a: "Every project is designed around your space and your preferences. We don't work off fixed templates or one size fits all packages, so what you get is built specifically for you.",
      img: "/images/faq/faq_9_design.jpg",
      tag: "DESIGN"
    },
    {
      q: "Do you provide warranties on completed projects?",
      a: "Yes. We offer up to ten year comprehensive warranties on hardware and core modular components, backed directly by factory certification.",
      img: "/images/faq/faq_10_support.jpg",
      tag: "SUPPORT"
    },
    {
      q: "What does the design and execution process actually look like?",
      a: "We start with a design consultation to understand your space and what you're looking for. Once the overall theme is locked in, we move into 3D visualizations so you can see exactly how the space will look before anything is built. After the designs are finalized, our team takes over execution, keeping you updated along the way until final handover.",
      img: "/images/faq/faq_7_involvement.jpg",
      tag: "PROCESS"
    }
  ];

  const mapFaqItems = (storedList) => {
    if (!Array.isArray(storedList)) return defaultHomeFaqItems;
    const sorted = [...storedList].sort((a, b) => {
      const orderA = a.faqPageOrder ?? a.homeOrder ?? a.order ?? 0;
      const orderB = b.faqPageOrder ?? b.homeOrder ?? b.order ?? 0;
      return orderA - orderB;
    });
    return sorted
      .filter(item => item.status !== 'Draft' && item.status !== 'Archived')
      .map((item, idx) => ({
        q: item.question || item.q,
        a: item.answer || item.a,
        img: item.image || item.img || defaultHomeFaqItems[idx % defaultHomeFaqItems.length]?.img,
        tag: (item.category || item.tag || defaultHomeFaqItems[idx % defaultHomeFaqItems.length]?.tag || 'FAQ').toUpperCase()
      }));
  };

  const [faqData, setFaqData] = useState(() => {
    const stored = getCMSData(STORAGE_KEYS.FAQS);
    if (Array.isArray(stored) && stored.length > 0) {
      const filtered = mapFaqItems(stored);
      return filtered.length > 0 ? filtered : defaultHomeFaqItems;
    }
    return defaultHomeFaqItems;
  });

  useEffect(() => {
    const syncHomeFaqs = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../utils/cmsStore');
        const stored = getCMSData(STORAGE_KEYS.FAQS);
        if (Array.isArray(stored) && stored.length > 0) {
          const filtered = mapFaqItems(stored);
          if (filtered.length > 0) {
            setFaqData(filtered);
          }
        }
      } catch {}

      try {
        const res = await axios.get('/faqs');
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          const filtered = mapFaqItems(res.data.data);
          if (filtered.length > 0) {
            setFaqData(filtered);
          }
        }
      } catch {}
    };

    syncHomeFaqs();

    window.addEventListener('espacio_cms_update', syncHomeFaqs);
    window.addEventListener('storage', syncHomeFaqs);
    return () => {
      window.removeEventListener('espacio_cms_update', syncHomeFaqs);
      window.removeEventListener('storage', syncHomeFaqs);
    };
  }, []);

  const activeHeroBgImages = (Array.isArray(homeSettings.hero_bg_images) && homeSettings.hero_bg_images.length > 0)
    ? homeSettings.hero_bg_images
    : HERO_IMAGES;

  const activeHomeStats = [
    { 
      val: homeSettings.hero_stat1_value || homeSettings.stats_item1_value || '25+', 
      desc: homeSettings.hero_stat1_label || homeSettings.stats_item1_label || 'Projects Completed', 
      hoverLabel: homeSettings.hero_stat1_hover || homeSettings.hero_stat1_label || homeSettings.stats_item1_label || 'Projects Completed',
      visible: homeSettings.hero_stat1_visible !== false, 
      order: Number(homeSettings.hero_stat1_order) || 1 
    },
    { 
      val: homeSettings.hero_stat2_value || homeSettings.stats_item2_value || '100+', 
      desc: homeSettings.hero_stat2_label || homeSettings.stats_item2_label || 'Happy Clients', 
      hoverLabel: homeSettings.hero_stat2_hover || homeSettings.hero_stat2_label || homeSettings.stats_item2_label || 'Happy Clients',
      visible: homeSettings.hero_stat2_visible !== false, 
      order: Number(homeSettings.hero_stat2_order) || 2 
    },
    { 
      val: homeSettings.hero_stat3_value || homeSettings.stats_item3_value || '40+', 
      desc: homeSettings.hero_stat3_label || homeSettings.stats_item3_label || 'Years Legacy', 
      hoverLabel: homeSettings.hero_stat3_hover || homeSettings.hero_stat3_label || homeSettings.stats_item3_label || 'Years Legacy',
      visible: homeSettings.hero_stat3_visible !== false, 
      order: Number(homeSettings.hero_stat3_order) || 3 
    },
  ].filter(s => s.visible).sort((a, b) => a.order - b.order);

  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  // Hero exit scroll animation (scales down and fades as user scrolls past it)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroExitScale = useTransform(heroScroll, [0, 1], [1, 0.85]);
  const heroExitOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroExitY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    const loadFeaturedProjects = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../utils/cmsStore');
        const storedProjects = getCMSData(STORAGE_KEYS.PROJECTS);
        if (storedProjects && Array.isArray(storedProjects) && storedProjects.length > 0) {
          const sorted = [...storedProjects].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
          const featuredOnly = sorted.filter(p => p.featured === true || p.featured === 'true');
          if (featuredOnly.length > 0) {
            setProjects(featuredOnly.slice(0, 6));
          }
        }
      } catch {}

      try {
        const r = await axios.get('/projects?limit=6&featured=true');
        if (r.data?.success && Array.isArray(r.data?.data) && r.data.data.length > 0) {
          const sorted = [...r.data.data].sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
          setProjects(sorted);
        }
      } catch {}
    };

    loadFeaturedProjects();

    const handleSync = () => loadFeaturedProjects();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const mockProjects = [
    { 
      title: 'Indo-Classical Elegance 3BHK', location: 'Jubilee Hills', category: '3BHK Villa', 
      heroImage: '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg', 
      slug: 'indo-classical-elegance-3bhk',
      description: 'A masterclass in spatial refinement blending traditional classical motifs with sleek modern lines, custom fluted panelling, and bespoke brass accents.'
    },
    { 
      title: 'Minimalist Beige Sanctuary 2BHK', location: 'Financial District', category: 'Apartment', 
      heroImage: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg', 
      slug: 'minimalist-beige-2bhk',
      description: 'Designed around soft earthen palettes, warm ambient profile lighting, and concealed handle-less joinery high above the city.'
    },
    { 
      title: 'Exquisite Duplex Fusion 4BHK', location: 'Kokapet', category: 'Duplex Villa', 
      heroImage: '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_18-20260813-110611.jpg', 
      slug: 'exquisite-duplex-fusion-4bhk',
      description: 'A bespoke double-height villa interior blending Italian marble flooring, custom fluted glass partitions, and an open show kitchen.'
    },
    { 
      title: 'Aparna Zicon High-Rise 2BHK', location: 'Nanakramguda', category: 'Apartment', 
      heroImage: '/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg', 
      slug: 'aparna-zicon-high-rise-2bhk',
      description: 'Precision engineered for maximum spatial efficiency, featuring custom TV media units, acrylic modular kitchen, and integrated wardrobes.'
    },
    { 
      title: 'Modern Retro Haven 2BHK', location: 'Madhapur', category: 'Luxury Home', 
      heroImage: '/images/company/2bhk_mordern_retro/b1_2.jpg', 
      slug: 'modern-retro-haven-2bhk',
      description: 'A cozy interplay of mid-century aesthetics, rich natural walnut veneers, custom fluted wall paneling, and warm cove ambient illumination.'
    },
    { 
      title: 'Grand 3BHK Penthouse Luxe', location: 'Banjara Hills', category: 'Penthouse', 
      heroImage: '/images/company/3bhk_lux/open_hall.png', 
      slug: 'grand-3bhk-penthouse-luxe',
      description: 'An expansive open-concept living and dining layout featuring architectural false ceilings, minimalist island kitchen, and master suite.'
    },
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  const stickyContent = displayProjects.slice(0, 6).map((p) => ({
    title: p.title,
    description: (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-sans text-[12px] lg:text-[13px] font-bold uppercase tracking-widest text-gold">{p.category}</span>
          <span className="text-ink-soft/40">•</span>
          <span className="font-sans text-[13px] lg:text-[14px] text-ink-soft font-medium">{p.location}</span>
        </div>
        <p className="font-sans text-[15px] lg:text-[17px] text-ink-soft leading-relaxed font-normal">
          {p.description || `A luxury ${p.category.toLowerCase()} interior design in ${p.location}, showcasing custom spatial architecture and premium materials.`}
        </p>
        <div className="pt-2 pb-0">
          <Link 
            to={`/projects/${p.slug}`}
            aria-label={`View Case Study: ${p.title}`}
            className="inline-flex items-center gap-2 font-sans text-[13px] lg:text-[14px] font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors pt-1"
          >
            <span>View Case Study</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    ),
    content: (
      <div className="h-full w-full relative overflow-hidden rounded-[24px]">
        <img
          src={getOptimizedImageUrl(p.heroImage, 1400, 92)}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out"
          alt={p.title}
        />
      </div>
    )
  }));

  const rawParallaxProducts = [
    {
      title: "Duplex Dining & Glass Partition",
      category: "Glass Partitions",
      link: "/projects/exquisite-duplex-fusion-4bhk",
      thumbnail: "/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg",
    },
    {
      title: "Open Pantry & Kitchen Storage",
      category: "Modular Kitchen",
      link: "/spaces/modular-kitchen",
      thumbnail: "/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg",
    },
    {
      title: "Beige Modular Kitchen Counter",
      category: "Modular Kitchen",
      link: "/spaces/modular-kitchen",
      thumbnail: "/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg",
    },
    {
      title: "Classical Dining & Bar Console",
      category: "Dining Room",
      link: "/projects/indo-classical-elegance-3bhk",
      thumbnail: "/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg",
    },
    {
      title: "Penthouse Minimalist Suite",
      category: "Penthouse Suite",
      link: "/projects/grand-3bhk-penthouse-luxe",
      thumbnail: "/images/company/3bhk_lux/bedroom_3.png",
    },
    {
      title: "Bespoke Mandir & Pooja Unit",
      category: "Pooja Room & Mandir",
      link: "/projects/aparna-zicon-high-rise-2bhk",
      thumbnail: "/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Living_room_1-20260810-122238.jpg",
    },
    {
      title: "Marble TV Media Unit",
      category: "TV & Media Unit",
      link: "/materials",
      thumbnail: "/images/company/2bhk_lux/tv_unit_2_1.png",
    },
    {
      title: "Indo-Classical Master Bedroom",
      category: "Master Bedroom",
      link: "/spaces/master-bedroom",
      thumbnail: "/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg",
    },
    {
      title: "Illuminated Crockery & Bar",
      category: "Crockery & Bar",
      link: "/materials",
      thumbnail: "/images/company/2bhk_lux/crockery1_1.png",
    },
    {
      title: "Indo-Classical Luxury Suite",
      category: "Master Bedroom",
      link: "/spaces/master-bedroom",
      thumbnail: "/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-Master_Bedroom_15-20260810-120432.jpg",
    },
    {
      title: "Natural Oak Modular Wardrobe",
      category: "Wardrobes",
      link: "/spaces/wardrobes",
      thumbnail: "/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg",
    },
    {
      title: "Thematic Kids Bedroom",
      category: "Kids Bedroom",
      link: "/projects/exquisite-duplex-fusion-4bhk",
      thumbnail: "/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Boys_Room_4-20260813-110616.jpg",
    },
    {
      title: "High-Gloss Modular Kitchen",
      category: "Modular Kitchen",
      link: "/spaces/modular-kitchen",
      thumbnail: "/images/company/2bhk_aparna_zicon/Mr.Deepak-Aparna_Zicon-Detail_Drawing-04-03-2025-Kitchen_17-20260810-122232.jpg",
    },
    {
      title: "Minimalist Beige Living Lounge",
      category: "Living Room",
      link: "/projects/minimalist-beige-2bhk",
      thumbnail: "/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_27-20260810-124917.jpg",
    },
    {
      title: "Foyer Wall Panelling & Console",
      category: "Foyer & Panelling",
      link: "/materials",
      thumbnail: "/images/company/2bhk_mordern_retro/dining_2.jpg",
    },
    {
      title: "Executive Open Living Hall",
      category: "Living Room",
      link: "/projects/executive-2bhk-residence",
      thumbnail: "/images/company/2bhk_lux/hall1_1.png",
    },
    {
      title: "Parallel Modular Kitchen",
      category: "Modular Kitchen",
      link: "/spaces/modular-kitchen",
      thumbnail: "/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-kitchen_4-20260810-120431.jpg",
    },
    {
      title: "Penthouse Master Bedroom",
      category: "Master Bedroom",
      link: "/projects/grand-3bhk-penthouse-luxe",
      thumbnail: "/images/company/3bhk_lux/bedroom_1.png",
    },
    {
      title: "Sliding Mirror Wardrobe",
      category: "Wardrobes",
      link: "/spaces/wardrobes",
      thumbnail: "/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_13-20260810-124909.jpg",
    },
    {
      title: "Fluted Accent Wall Panelling",
      category: "Wall Panelling",
      link: "/materials",
      thumbnail: "/images/company/2bhk_mordern_retro/hall_paneling.jpg",
    },
    {
      title: "Green Balcony & Outdoor Deck",
      category: "Balcony & Deck",
      link: "/projects/indo-classical-elegance-3bhk",
      thumbnail: "/images/company/indo_classical_elegance_3bhk/Indo-Classical_Elegance__A_Soothing_Blend_of_Mode-balcony_1-20260810-120429.jpg",
    },
    {
      title: "Urban Contemporary Living Lounge",
      category: "Living Room",
      link: "/projects/urban-contemporary-flat-2bhk",
      thumbnail: "/images/company/2bhk_urban/Ideas_2_2-_0-20260810-173541.jpg",
    }
  ];

  const parallaxProducts = rawParallaxProducts.map(item => ({
    ...item,
    thumbnail: getOptimizedImageUrl(item.thumbnail, 1200, 92)
  }));

  return (
    <div className="bg-bg">
      <SEO
        title="Luxury Interior Design & Architecture Studio, Hyderabad"
        description="ESPACIO is Hyderabad's premier luxury interior design studio. Delivering turnkey full-home interiors, modular kitchens, commercial fitouts, and premium material supply."
        url="/"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          '@id': 'https://www.theespacio.in/#business',
          name: 'ESPACIO Interiors & Modular',
          url: 'https://www.theespacio.in',
          logo: 'https://www.theespacio.in/favicon.svg',
          image: '/images/company/3bhk_lux/open_hall.png',
          description: "ESPACIO is Hyderabad's premier luxury interior design studio. Full-home interiors, modular kitchens, commercial offices, and material supply.",
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jubilee Hills / Gachibowli',
            addressLocality: 'Hyderabad',
            addressRegion: 'Telangana',
            postalCode: '500033',
            addressCountry: 'IN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 17.4399,
            longitude: 78.3989
          },
          telephone: '+91 90000 00000',
          priceRange: '₹₹₹',
          sameAs: ['https://www.instagram.com/theespacio.in']
        }}
      />

      {/* ── 1. HERO (Rounded Card — matches Services) ── */}
      <section ref={heroRef} className="relative h-[75vh] sm:h-[90vh] min-h-[460px] sm:min-h-[520px] px-3 sm:px-6 pt-2 sm:pt-2.5 lg:pt-3 pb-2 sm:pb-3 lg:px-10 z-0">
        {/* Rounded card — fills the section with smooth exit transition */}
        <motion.div
          style={{ scale: heroExitScale, opacity: heroExitOpacity, y: heroExitY }}
          className="relative w-full h-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[40px] origin-top"
        >
          {/* Background Image Layer */}
          <div className="absolute inset-0 overflow-hidden">
            <HeroSlideshow 
              images={activeHeroBgImages}
              intervalMs={3200}
              initialIntervalMs={2400}
              transitionDuration={0.9}
              onIndexChange={setCurrentImageIdx}
            />
          </div>

          {/* ─── Foreground Glass Cards (Centered vertically in middle of Hero) ─── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center pointer-events-none pt-10 sm:pt-16 lg:pt-0">
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pointer-events-auto">
              
              <motion.div 
                className="flex flex-col lg:flex-row items-center lg:items-center gap-3 sm:gap-4 lg:gap-6"
                initial="visible"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.22,
                      delayChildren: 0.15
                    }
                  }
                }}
              >

                {/* ─── LEFT: Craft Card ─── */}
                <motion.div
                  className="w-full max-w-[265px] sm:max-w-[345px] mx-auto lg:mx-0 lg:max-w-[345px]"
                >
                  <motion.div 
                    className="relative rounded-[16px] sm:rounded-[20px] md:rounded-[26px] overflow-hidden border border-white/15 shadow-2xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 35 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                  >
                    {/* Top glass highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    
                    <div className="p-3 sm:p-5.5 md:p-6">
                      {/* Interior thumbnail */}
                      <div className="w-full aspect-[16/9] rounded-[12px] sm:rounded-[14px] overflow-hidden mb-2 sm:mb-5 relative bg-black/20">
                        {activeHeroBgImages.map((imgUrl, imgIdx) => {
                          const isActive = imgIdx === (currentImageIdx % activeHeroBgImages.length);
                          const thumbSrc = (typeof imgUrl === 'string' && imgUrl.includes('/images/hero/hero_') && !imgUrl.includes('_thumb'))
                            ? imgUrl.replace(/\.(webp|jpg|png)$/i, '_thumb.webp')
                            : imgUrl;
                          return (
                            <motion.img
                              key={imgUrl}
                              src={thumbSrc}
                              alt="Luxury interior showcase"
                              decoding="async"
                              initial={imgIdx === 0 ? { opacity: 1, scale: 1.05 } : { opacity: 0, scale: 1.04 }}
                              animate={isActive ? { opacity: 1, scale: 1.0 } : { opacity: 0, scale: 1.04 }}
                              transition={{
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                zIndex: isActive ? 2 : 1,
                                WebkitBackfaceVisibility: 'hidden',
                                backfaceVisibility: 'hidden',
                              }}
                              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                            />
                          );
                        })}
                      </div>

                      {/* Headline */}
                      <h2 className="font-display text-[16px] sm:text-[36px] lg:text-[32px] font-semibold leading-tight tracking-tight text-white mb-2.5 sm:mb-6 text-center">
                        {homeSettings.hero_card_heading || 'We Craft the Future Dwelling'}
                      </h2>

                      {/* Bottom Row */}
                      {homeSettings.hero_card_cta_visible !== false && (
                        <div className="flex items-center justify-center">
                          <Link 
                            to={homeSettings.hero_card_cta_link || "/projects"}
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/15 backdrop-blur-md px-3.5 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-[11px] md:text-[12px] font-bold text-white hover:bg-white hover:text-[#101014] shadow-md transition-all duration-300 shrink-0"
                          >
                            {/* Sizing span (invisible, sets exact container width for Discover Our Works ↗) */}
                            <span className="inline-flex items-center gap-1.5 opacity-0 pointer-events-none select-none whitespace-nowrap">
                              <span>Discover Our Works</span>
                              <ArrowUpRight size={13} className="shrink-0" />
                            </span>

                            {/* Default State: CTA Text ↗ */}
                            <span className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0 text-white whitespace-nowrap">
                              <span>{homeSettings.hero_card_cta_text || 'Our Projects'}</span>
                              <ArrowUpRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>

                            {/* Hover State: Discover Our Works ↗ */}
                            <span className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-[#101014] font-bold whitespace-nowrap">
                              <span style={{ color: '#101014' }}>Discover Our Works</span>
                              <ArrowUpRight size={13} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#101014', stroke: '#101014', strokeWidth: 2.5 }} />
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* ─── RIGHT: Stats + Description ─── */}
                <motion.div
                  className="w-full lg:flex-1"
                >
                  <motion.div
                    className="flex flex-col gap-6 md:gap-8 w-full"
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                  >
                  
                  {/* Stats Row */}
                  <div className="flex flex-row flex-nowrap gap-2 sm:gap-3 md:gap-4 justify-center lg:justify-end items-center min-h-[52px] sm:h-26 mt-2 sm:mt-3 lg:mt-0">
                    {activeHomeStats.map((s, index) => {
                      const isHovered = hoveredStatIdx === index;
                      return (
                        <motion.div 
                          key={index} 
                          layout
                          onMouseEnter={() => setHoveredStatIdx(index)}
                          onMouseLeave={() => setHoveredStatIdx(null)}
                          onClick={() => setHoveredStatIdx(isHovered ? null : index)}
                          variants={{
                            hidden: { opacity: 0, y: 30, scale: 0.92 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: 'spring',
                                stiffness: 100,
                                damping: 15,
                                delay: index * 0.12
                              }
                            }
                          }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.35)'
                          }}
                          className={`flex items-center rounded-[11px] sm:rounded-[14px] md:rounded-[20px] border shadow-xl cursor-pointer transition-all duration-300 overflow-hidden isolate select-none relative ${
                            isHovered 
                              ? "flex-row justify-between w-[190px] sm:w-[255px] md:w-[300px] h-12 sm:h-18 md:h-20 px-3 sm:px-4 md:px-5.5 border-white/35" 
                              : "flex-col justify-center items-center w-[76px] sm:w-[90px] md:w-[100px] h-[52px] sm:h-[80px] md:h-[88px] border-white/15 text-center px-1.5 sm:px-2"
                          }`}
                          style={{
                            background: isHovered ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            transform: 'translate3d(0,0,0)',
                            WebkitBackfaceVisibility: 'hidden',
                            backfaceVisibility: 'hidden',
                          }}
                        >
                          {/* Top glass highlight to match craft card */}
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                          <AnimatePresence mode="wait">
                            {!isHovered ? (
                              <motion.div
                                key="normal"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center justify-center text-center w-full"
                              >
                                <span className="font-display font-semibold text-white leading-none tracking-tight text-[15px] sm:text-[22px] md:text-[26px] mb-0.5 sm:mb-1">
                                  {s.val}
                                </span>
                                <span className="font-sans text-[7px] sm:text-[9px] text-white/70 font-semibold uppercase tracking-[0.06em] sm:tracking-[0.1em] leading-tight text-center max-w-full line-clamp-2">
                                  {s.desc}
                                </span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="hover"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-row items-center justify-between w-full"
                              >
                                <span className="font-display font-semibold text-white text-[16px] sm:text-[24px] md:text-[30px] mr-1 leading-none">
                                  {s.val}
                                </span>
                                <div className="flex-1 flex justify-end">
                                  <div className="bg-white text-bg-dark rounded-[8px] sm:rounded-[14px] px-2 py-0.5 sm:px-4 sm:py-1.5 text-[8.5px] sm:text-[11px] md:text-[12px] font-semibold text-center leading-tight shadow-md flex items-center justify-center max-w-[110px] sm:max-w-[145px] md:max-w-[165px]">
                                    {s.hoverLabel || s.desc}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>



                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Center Scroll Down Indicator (Small, thin, transparent) ── */}
          <div className="hidden sm:block">
            <ScrollDownIndicator />
          </div>
        </div>
      </motion.div>
    </section>

      {/* ── 2. INTRO TEXT (Concept-to-Handover Luxury Showcase) ── */}
      <section className="relative z-10 bg-bg w-full">
        <div className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text & Story (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(34px,4.2vw,56px)] font-medium leading-[1.1] tracking-tight text-ink">
                {homeSettings.intro_heading || 'Turnkey interiors, done properly.'}
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <p className="font-sans text-[15.5px] text-ink-soft leading-relaxed max-w-[520px]">
                {homeSettings.intro_description || "ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don't just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what's happening on site."}
              </p>
            </Reveal>
            
            <Reveal delay={0.3}>
              <Link to={homeSettings.intro_cta_link || "/about"} className="btn-sliding-cta-dark">
                <span className="invisible select-none pointer-events-none whitespace-nowrap opacity-0">
                  {(homeSettings.intro_cta_text1 || 'Our Story ↗').length >= (homeSettings.intro_cta_text2 || 'Read More ↗').length 
                    ? (homeSettings.intro_cta_text1 || 'Our Story ↗') 
                    : (homeSettings.intro_cta_text2 || 'Read More ↗')}
                </span>
                <span className="btn-sliding-cta-dark-text-one">{homeSettings.intro_cta_text1 || 'Our Story ↗'}</span>
                <span className="btn-sliding-cta-dark-text-two">{homeSettings.intro_cta_text2 || 'Read More ↗'}</span>
              </Link>
            </Reveal>
          </div>
          
          {/* Right Column: Visual Team & Projects Showcase (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <TeamProjectsShowcase customSlides={homeSettings.showcase_slides} />
          </div>
          
        </div>
        </div>
      </section>

      {/* ── 2.5 STATS GRID SECTION ── */}
      <section className="pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {[
            { value: "25+", label: "Projects Completed", progressWidth: "60%" },
            { value: "100+", label: "Happy Clients", progressWidth: "80%" },
            { value: "40+", label: "Years Legacy", progressWidth: "90%" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border border-ink-border/20 bg-bg rounded-[20px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[130px] w-full max-w-[550px] mx-auto lg:max-w-none lg:mx-0 group hover:border-gold hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-1">
                <p className="font-sans text-[11px] font-semibold text-ink-muted uppercase tracking-[0.2em]">{stat.label}</p>
                <div className="font-display text-4xl lg:text-5xl font-semibold text-ink tracking-tight">
                  <AnimatedCounter value={stat.value} duration={2} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-ink-border/20 flex items-center justify-between">
                <span className="font-sans text-[11px] font-medium text-ink-muted">Turnkey Execution</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── 4. PROJECTS GRID ────────────────────────────────────────────────── */}
      <section className="pt-8 pb-2 sm:pt-12 sm:pb-8 lg:py-14 px-4 md:px-8 lg:px-12 max-w-[1720px] mx-auto">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Selected Work</p>
            <h2 className="font-display text-[clamp(26px,2.8vw,44px)] font-medium tracking-tight text-ink">Our Projects</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/projects" className="btn-sliding-cta-dark">
              <span className="invisible select-none pointer-events-none whitespace-nowrap opacity-0">
                All Projects ↗
              </span>
              <span className="btn-sliding-cta-dark-text-one">All Projects ↗</span>
              <span className="btn-sliding-cta-dark-text-two">View All ↗</span>
            </Link>
          </Reveal>
        </div>

        <Reveal>
          <React.Suspense fallback={<div className="min-h-[300px]" />}>
            <StickyScroll content={stickyContent} />
          </React.Suspense>
        </Reveal>
      </section>


      {/* ── 5. SERVICES PARALLAX ────────────────────────────────────────────── */}
      <section className="bg-bg">
        <React.Suspense fallback={<div className="min-h-[400px]" />}>
          <HeroParallax products={parallaxProducts} />
        </React.Suspense>
      </section>





      {/* ── FAQ SECTION (Sticky Header / Scrolling Questions on Mobile & Desktop) ── */}
      <section
        ref={faqSectionRef}
        className="pt-6 pb-6 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-20 px-4 sm:px-6 md:px-12 max-w-[1440px] mx-auto relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start relative">
          
          {/* Header Column: Sticky Pinned while questions scroll */}
          <div className="lg:col-span-5 sticky top-[72px] sm:top-20 lg:top-24 xl:top-28 self-start z-20 bg-bg/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none pt-4 pb-4 lg:pt-0 lg:pb-0">
            <div className="flex flex-col items-center text-center pb-2 lg:pb-6">
              <div className="inline-flex items-center gap-1.5 bg-ink text-bg px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-semibold tracking-wider uppercase mb-3 sm:mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                FAQ
              </div>

              <h2 className="font-display text-[clamp(24px,3.5vw,44px)] font-medium leading-[1.12] tracking-tight text-ink mb-2.5 sm:mb-4 text-center">
                Got Questions?
                <br />
                We Have Answers.
              </h2>

              <p className="font-sans text-[13px] sm:text-[14px] text-ink-soft leading-relaxed mb-2 sm:mb-6 max-w-[400px] mx-auto text-center">
                From first consultation to final installation, we know you want to understand exactly what to expect. Here's everything you need to know about working with ESPACIO.
              </p>

              {/* FAQ Portrait Auto-Scrolling Projects Carousel (Desktop only) */}
              <div className="hidden lg:block w-full max-w-[520px] xl:max-w-[560px]">
                <AutoScrollingInteriorBox activeIdx={openFaqIdx} items={faqData} />
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion List (Scrolls naturally) */}
          <div className="lg:col-span-7 flex flex-col justify-start relative z-10">
            <div className="border-t border-ink-border/20">
              {faqData.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <MagneticItem
                    key={idx}
                    isOpen={isOpen}
                    className="border-b border-ink-border/20 px-4 py-6 cursor-pointer transition-all duration-300 relative"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  >
                    <button aria-label={faq.q} className="w-full flex items-start gap-4 text-left group bg-transparent border-0 cursor-pointer py-1">
                      {/* Animated badge */}
                      <Badge num={idx} isOpen={isOpen} />

                      {/* Question text */}
                      <motion.span
                        className="font-sans text-[15px] md:text-[16px] font-medium leading-snug flex-1"
                        animate={{ color: isOpen ? '#c5a572' : '#101014' }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.q}
                      </motion.span>

                      {/* Animated chevron */}
                      <motion.div
                        className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center border"
                        animate={{
                          borderColor: isOpen ? '#c5a572' : 'rgba(0,0,0,0.12)',
                          background: isOpen ? '#c5a572' : 'transparent',
                          rotate: isOpen ? 180 : 0,
                          boxShadow: isOpen ? '0 0 12px rgba(197,165,114,0.5)' : '0 0 0 transparent',
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <motion.path
                            d="M2 4L5.5 7.5L9 4"
                            stroke={isOpen ? 'white' : '#9ca3af'}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </button>

                    {/* Answer panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, y: -10 }}
                          animate={{ height: 'auto', opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -10 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="pl-10 pr-4 pb-4 pt-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                          >
                            {/* Gold accent bar */}
                            <div className="flex gap-3 items-start">
                              <motion.div
                                className="w-0.5 rounded-full bg-gold shrink-0 mt-1"
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                style={{ minHeight: 40 }}
                              />
                              <p className="font-sans text-[14.5px] text-walnut leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Ripple on open */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="absolute inset-0 rounded-[16px] pointer-events-none"
                          initial={{ opacity: 0.4, scale: 0.95 }}
                          animate={{ opacity: 0, scale: 1.04 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          style={{ border: '1.5px solid rgba(197,165,114,0.6)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                      )}
                    </AnimatePresence>
                  </MagneticItem>
                );
              })}
            </div>
          </div>
          
        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <React.Suspense fallback={<div className="min-h-[200px]" />}>
        <Testimonials />
      </React.Suspense>

    </div>
  );
};

export default Home;
