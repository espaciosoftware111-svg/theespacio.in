import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, MessageSquare, Compass, Layers, Palette, Settings } from 'lucide-react';
import SEO from '../components/common/SEO';
import HeroSlideshow from '../components/common/HeroSlideshow';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { Button as MovingBorderButton } from '../components/ui/moving-border';
import { BorderDrawingCard } from '../components/ui/BorderDrawingCard';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const Reveal = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' });
  const getInitial = () => {
    if (direction === 'left') return { opacity: 0, x: -100, scale: 0.96 };
    if (direction === 'right') return { opacity: 0, x: 100, scale: 0.96 };
    return { opacity: 0, y: 40 };
  };
  const getAnimate = () => {
    if (direction === 'left' || direction === 'right') {
      return inView 
        ? { opacity: 1, x: 0, scale: 1 } 
        : { opacity: 0, x: direction === 'left' ? -100 : 100, scale: 0.96 };
    }
    return inView 
      ? { opacity: 1, y: 0 } 
      : { opacity: 0, y: 40 };
  };
  return (
    <motion.div ref={ref} className={className}
      initial={getInitial()} animate={getAnimate()}
      transition={{ 
        type: 'tween',
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
        delay: inView ? Math.min(delay, 0.25) : 0
      }}>
      {children}
    </motion.div>
  );
};

const services = [
  { 
    num: '01', 
    title: 'Full Home Interior Design & Execution', 
    tag: 'Turnkey Design & Build', 
    desc: 'Bespoke residential interior architecture engineered from concept to final handover. We integrate custom modular joinery, lighting layouts, and premium wall finishes into a seamless turnkey execution.', 
    includes: ['Living & Dining Spatial Architecture', 'Custom Modular Wardrobe Systems', 'Ergonomic Modular Kitchen Layouts', 'Ambient Cove & Architectural Lighting', 'Curated Wall & Surface Textures', 'Turnkey Execution & Project Oversight'], 
    img: '/images/company/2bhk_mordern_retro/hall.jpg',
    ctaText: 'Enquire About Interior Design'
  },
  { 
    num: '02', 
    title: 'Commercial & Office Interiors', 
    tag: 'Workspaces & Retail', 
    desc: 'High-tolerance commercial fit-outs for corporate offices, experience centers, and retail environments. Engineered for acoustic optimization, brand elevation, and maximum workspace efficiency.', 
    includes: ['Corporate Office Spatial Planning', 'Retail & Studio Flow Optimization', 'Acoustic WPC Conference Suites', 'Ergonomic Workstation Clusters', 'Tech & AV Concealed Channels', 'Turnkey Commercial Buildout'], 
    img: '/images/company/2bhk_mordern_retro/office_3.jpg',
    ctaText: 'Enquire About Modular Solutions'
  },
  { 
    num: '03', 
    title: 'Styling & Decor Curation', 
    tag: 'Curated Styling', 
    desc: 'Tailored aesthetic curation, soft furnishings, and architectural accent styling. Designed to harmonize color palettes, art installations, and spatial lighting into a cohesive luxury statement.', 
    includes: ['Bespoke Art & Wall Installations', 'Luxury Soft Furnishing Selection', 'Architectural Accent & Mood Lighting', 'Indoor Botanical & Greenery Curation', 'Harmonized Color & Texture Audits', 'Turnkey Final Styling Installation'], 
    img: '/images/company/indo_classical_elegance_3bhk/3BHK-Guest_restaurant_4-20260810-164320.jpg',
    ctaText: 'Enquire About Styling & Decor'
  },
  { 
    num: '04', 
    title: 'Turnkey Renovation & Remodeling', 
    tag: 'Upgrade Existing Spaces', 
    desc: 'Transforming existing residential and commercial properties into modern architectural showcases. Complete structural upgrades, re-wiring, and finish overhauls handled without multi-vendor hassle.', 
    includes: ['Full Kitchen & Bath Overhauls', 'Living Area Structural Spatial Redesign', 'Precision Electrical & Plumbing Re-lay', 'Italian Marble & Flooring Replacement', 'Custom Ceiling & Louver Upgrades', 'Complete Turnkey Project Management'], 
    img: '/images/services/services_after.webp', 
    ctaText: 'Enquire About Turnkey Renovation'
  },
  { 
    num: '05', 
    title: 'Materials Supply (Standalone Purchase)', 
    tag: 'Direct Warehouse Sourcing', 
    desc: 'Direct access to our extensive inventory of WPC wall & ceiling panels, polygranite sheets, acrylic fluted louvers, and hardware. Available for standalone purchase directly from our Aziznagar warehouse.', 
    includes: ['WPC Wall & Exterior Cladding Panels', 'Polygranite & High-Gloss Acrylic Sheets', 'Charcoal & Wood Grain Fluted Louvers', 'Architectural Trim & Edge Hardware', 'Standalone Wholesale & Retail Purchase', 'Rapid Delivery from Hyderabad Godowns'], 
    img: '/images/services/service_materials.jpg',
    ctaText: 'Enquire About Materials',
    hasSecondaryLink: true
  },
];

const processSteps = [
  { step: '01', name: 'Initial Consultation', desc: 'We understand your vision, lifestyle, and budget constraints with absolute clarity.' },
  { step: '02', name: 'Site Visit & Measurement', desc: 'Our team surveys site dimensions, structural constraints, and wiring channels.' },
  { step: '03', name: '3D Concept Design', desc: 'Photorealistic 3D renders of your space before a single nail goes in.' },
  { step: '04', name: 'Material Selection', desc: 'Walk through our material library. Touch, see, and confirm every finish.' },
  { step: '05', name: 'Production & Execution', desc: 'On-time, on-spec execution with regular progress photo updates.' },
  { step: '06', name: 'Quality Handover', desc: 'Final punch-list inspection, clean-up, and keys handover on your timeline.' },
];

const getStepIcon = (step) => {
  switch (step) {
    case '01': return MessageSquare;
    case '02': return Compass;
    case '03': return Layers;
    case '04': return Palette;
    case '05': return Settings;
    case '06': return CheckCircle2;
    default: return CheckCircle2;
  }
};

const heroImages = [
  '/images/services/service_hero_1.jpg',
  '/images/services/service_hero_2.jpg',
  '/images/services/service_hero_3.jpg',
  '/images/services/service_hero_4.jpg'
];

import { getCMSData, STORAGE_KEYS } from '../utils/cmsStore';

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const defaultTestimonials = [
  { name: 'Rajesh & Ananya Sharma', designation: 'Jubilee Hills Villa • Full Interiors', body: 'ESPACIO delivered our 3BHK villa turnkey interior ahead of schedule. Their transparent BOQ quotation had zero hidden surprises, and the fluted acrylic finish is breathtaking.', rating: 5 },
  { name: 'Dr. Vikram Reddy', designation: 'Gachibowli Residence • Kitchen & Louvers', body: 'The modular kitchen and charcoal louver wall in our living room turned out exactly like the 3D renders. The quotation matched down to the last rupee.', rating: 5 },
  { name: 'Siddharth Mehta', designation: 'HITECH City • Corporate Office', body: 'We fitted our 4,000 sq.ft executive office with ESPACIO PVC ceiling panels and glass partitions. Professional project management and impeccable finishing.', rating: 5 }
];

const Services = () => {
  const heroRef = useRef(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const [heroContent, setHeroContent] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return {
      badge: getNonEmpty(s?.services_hero_badge, 'Services'),
      title: getNonEmpty(s?.services_hero_title, 'Our Services'),
      subtitle: getNonEmpty(s?.services_hero_subtitle, 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.'),
      images: heroImages,
      visible: true
    };
  });

  const [servicesList, setServicesList] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return (Array.isArray(s?.services_list) && s.services_list.length > 0) ? s.services_list : services;
  });

  const [testimonialsList, setTestimonialsList] = useState(() => {
    const stored = getCMSData(STORAGE_KEYS.TESTIMONIALS);
    if (Array.isArray(stored) && stored.length > 0) {
      const filtered = stored.filter(t => t.visible !== false && t.featured);
      return filtered.length > 0 ? filtered.slice(0, 3) : defaultTestimonials;
    }
    return defaultTestimonials;
  });

  useEffect(() => {
    const syncCMS = () => {
      const settings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (settings) {
        setHeroContent({
          badge: getNonEmpty(settings.services_hero_badge, 'Services'),
          title: getNonEmpty(settings.services_hero_title, 'Our Services'),
          subtitle: getNonEmpty(settings.services_hero_subtitle, 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.'),
          images: (Array.isArray(settings.services_hero_images) && settings.services_hero_images.length > 0)
            ? settings.services_hero_images
            : heroImages,
          visible: settings.services_hero_visible !== false
        });
        if (Array.isArray(settings.services_list) && settings.services_list.length > 0) {
          setServicesList(settings.services_list);
        }
      }

      const storedTestimonials = getCMSData(STORAGE_KEYS.TESTIMONIALS);
      if (Array.isArray(storedTestimonials) && storedTestimonials.length > 0) {
        const filtered = storedTestimonials.filter(t => t.visible !== false && t.featured);
        if (filtered.length > 0) {
          setTestimonialsList(filtered.slice(0, 3));
        }
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

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const textY   = useTransform(scrollYProgress, [0, 0.8], ['0px', '-45px']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);

  return (
    <div className="bg-bg overflow-x-hidden">
      <SEO title="Services — ESPACIO Interiors" description="Full home interiors, modular kitchens, commercial spaces, and renovations. Engineering-first luxury design executed by ESPACIO." url="/services" />

      {heroContent.visible !== false && (
        <section ref={heroRef} className="relative h-[64vh] sm:h-[80vh] lg:h-[96vh] min-h-[400px] sm:min-h-[520px] lg:min-h-0 px-3 sm:px-5 pt-2 sm:pt-2.5 lg:pt-3 pb-2 lg:px-12 z-0">
          <div className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] origin-top shadow-2xl">
            <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 overflow-hidden">
              <HeroSlideshow
                images={heroContent.images && heroContent.images.length > 0 ? heroContent.images : heroImages}
                intervalMs={4000}
                transitionDuration={1.3}
                showGradient={false}
                onIndexChange={setCurrentImageIdx}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/20 z-10 pointer-events-none" />
            
            {/* Hero Text Content with Dynamic Scroll Parallax */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
              <motion.div 
                style={{ y: textY, opacity: textOpacity }}
                className="w-full px-8 md:px-12 pb-10 md:pb-14 pointer-events-auto"
              >
                <div className="flex flex-col items-start gap-3">
                  <div className="inline-flex items-center gap-2 bg-white text-[#101014] px-4 py-1.5 rounded-full text-[13px] font-sans font-medium shadow-lg border border-black/5 select-none tracking-normal mb-1">
                    <Layers size={14} className="text-[#101014] shrink-0" />
                    <span>{heroContent.badge || 'Services'}</span>
                  </div>
                  <h1 className="font-display font-bold leading-none tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]" style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}>
                    {heroContent.title}
                  </h1>
                  <p className="font-sans text-[14px] md:text-[15.5px] text-white/90 max-w-[520px] leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {heroContent.subtitle}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <ScrollDownIndicator />
          </div>
        </section>
      )}

      <section className="pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto divide-y divide-ink-border">
          {servicesList.filter((s) => s.visible !== false).map((s, i) => {
            const isOdd = i % 2 === 1;
            return (
              <div key={s.num || i} className="py-8 sm:py-12 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <Reveal delay={0.05} direction={isOdd ? 'right' : 'left'} className={isOdd ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-card overflow-hidden bg-bg-card">
                    <img src={getOptimizedImageUrl(s.img, 800, 75)} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </Reveal>
                <Reveal delay={0.15} direction={isOdd ? 'left' : 'right'} className={`space-y-4 sm:space-y-6 ${isOdd ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[11px] font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-ink-muted bg-bg-card px-3 py-1 rounded-pill">{s.tag}</span>
                  </div>
                  <h2 className="font-display text-[clamp(24px,3vw,42px)] font-bold tracking-tight text-ink leading-tight">{s.title}</h2>
                  <p className="font-sans text-[13.5px] sm:text-[15px] text-ink-soft leading-relaxed">{s.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Array.isArray(s.includes) ? s.includes : []).map((item, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 font-sans text-[12.5px] sm:text-[13px] text-ink-soft">
                        <CheckCircle2 size={14} className="text-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.ctaVisible !== false && (
                    <div className="flex flex-wrap items-center gap-4 pt-1 sm:pt-2">
                      <Link to={s.ctaLink || "/contact"} className="btn-primary w-fit">
                        {s.ctaText || "Enquire About This"} <ArrowUpRight size={13} />
                      </Link>
                      {(s.hasSecondaryLink || s.num === '05' || s.title.includes('Materials')) && (
                        <Link to="/materials" className="inline-flex items-center gap-1.5 font-sans text-[12.5px] sm:text-[13px] font-bold text-gold hover:text-gold/80 transition-colors uppercase tracking-wider">
                          Browse Materials →
                        </Link>
                      )}
                    </div>
                  )}
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-bg-card border-t border-ink-border">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-2.5 sm:mb-3">How We Work</p>
            <h2 className="font-display text-[clamp(26px,3vw,44px)] font-bold tracking-tight text-ink mb-6 sm:mb-10 md:mb-14">Our Process</h2>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
            {processSteps.map((p, i) => {
              const Icon = getStepIcon(p.step);
              return (
                <Reveal key={p.step} delay={i * 0.07} className="h-full">
                  <MovingBorderButton as="div" borderRadius="20px" duration={3000 + i * 500} containerClassName="w-full h-full" className="group relative bg-bg border border-ink-border/10 rounded-[20px] sm:rounded-card p-4 sm:p-6 lg:p-8 min-h-[195px] sm:min-h-[220px] hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,16,20,0.04)] transition-all duration-500 flex flex-col justify-between h-full overflow-hidden text-left items-stretch">
                    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-pill bg-black/10 flex items-center justify-center text-black group-hover:bg-black group-hover:text-cream transition-all duration-500">
                          <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.5]" />
                        </div>
                        <span className="font-display text-[24px] sm:text-[36px] lg:text-[44px] font-bold text-ink-muted/20 group-hover:text-black/20 transition-colors duration-500 select-none">{p.step}</span>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 lg:space-y-3">
                        <h3 className="font-display text-[13.5px] sm:text-[16px] lg:text-[19px] font-bold text-ink group-hover:text-black transition-colors duration-300 leading-snug">{p.name}</h3>
                        <p className="font-sans text-[11px] sm:text-[12px] lg:text-[13.5px] text-ink-soft leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </MovingBorderButton>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INSTANT ESTIMATION & QUOTATION CALCULATOR ──────────────────────────── */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-offwhite">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <Reveal>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Project Planner</span>
                <h2 className="font-display text-[clamp(26px,3.5vw,48px)] font-bold text-charcoal leading-tight">Instant Project Estimate</h2>
                <p className="font-sans text-[13.5px] sm:text-sm text-walnut leading-relaxed">
                  Select your property type, scope, and finish tier below. Since actual site conditions affect final BOQ significantly, our principal design team will share your personalized range on a quick call.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <QuotationCalculator />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT REVIEWS & TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 bg-cream">
        <div className="max-w-[1440px] mx-auto">
          <Reveal className="text-center max-w-[600px] mx-auto mb-14 space-y-3">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Client Feedback</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-charcoal">What Our Clients Say</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsList.map((t, idx) => (
              <Reveal key={t.id || idx} delay={idx * 0.08} className="bg-offwhite border border-walnut/10 rounded-card p-8 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex text-gold text-sm gap-1">
                    {'★'.repeat(t.rating || 5)}
                  </div>
                  <p className="font-sans text-xs text-charcoal/80 leading-relaxed italic">
                    “{t.body || t.reviewText || ''}”
                  </p>
                </div>
                <div className="pt-4 border-t border-walnut/10 flex items-center space-x-3">
                  {t.avatar && (
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-gold/30" />
                  )}
                  <div>
                    <h4 className="font-sans text-xs font-bold text-charcoal">{t.name}</h4>
                    <p className="font-sans text-[10px] text-walnut">{t.designation || t.role || 'ESPACIO Client'}</p>
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

// ── QUOTATION CALCULATOR COMPONENT ─────────────────────────────────────────
const QuotationCalculator = () => {
  const [propertyType, setPropertyType] = useState('3bhk');
  const [scope, setScope] = useState('full');
  const [finishGrade, setFinishGrade] = useState('premium');
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().replace(/\s+/g, '').length < 10) return;

    const trimmedPhone = phone.trim();
    const trimmedName = name && name.trim() ? name.trim() : 'Valued Client';
    const scopeLabel = scope === 'full' ? 'Turnkey Full Home' : scope === 'kitchen' ? 'Modular Kitchen' : 'Panelling & Louvers';
    const propLabel = propertyType === '2bhk' ? '2 BHK' : propertyType === '3bhk' ? '3 BHK' : propertyType === 'villa' ? 'Villa' : 'Office';
    
    // 1. Save to local CMS enquiries
    try {
      import('../utils/cmsStore').then(({ getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate }) => {
        const existing = getCMSData(STORAGE_KEYS.ENQUIRIES) || [];
        const count = existing.length + 1;
        const enquiryId = `ESP-EST-${String(count).padStart(5, '0')}`;

        const newRecord = {
          id: enquiryId,
          enquiryId: enquiryId,
          type: 'INSTANT_ESTIMATE',
          source: 'INSTANT_PROJECT_ESTIMATE',
          requirementType: 'INSTANT_ESTIMATE',
          name: trimmedName,
          phone: trimmedPhone,
          email: '',
          location: `Property: ${propLabel}`,
          propertyType: propLabel,
          scopeOfWork: scopeLabel,
          finishGrade: finishGrade,
          notesText: `Instant Project Estimate Submission — Property: ${propLabel}, Scope: ${scopeLabel}, Grade: ${finishGrade}`,
          notes: [{ id: `n-${Date.now()}`, text: `Captured via Instant Project Estimate calculator on Services page. Property: ${propLabel}, Scope: ${scopeLabel}.`, createdAt: new Date().toISOString() }],
          status: 'NEW',
          read: false,
          submittedAt: new Date().toISOString(),
          followUp: null
        };
        setCMSData(STORAGE_KEYS.ENQUIRIES, [newRecord, ...existing]);
        notifyCMSUpdate();
      });
    } catch {}

    // 2. Dispatch lead to backend server & Google Sheets
    const servicesPayload = {
      name: trimmedName,
      phone: trimmedPhone,
      phone1: trimmedPhone,
      phone2: '',
      email: `${trimmedPhone.replace(/\D/g, '')}@leads.theespacio.com`,
      location: `Property: ${propLabel}`,
      projectType: 'Instant Project Estimate',
      serviceType: scopeLabel,
      message: `Instant Project Estimate — Property: ${propLabel}, Scope: ${scopeLabel}, Finish Grade: ${finishGrade}`,
      propertyDetails: {
        propertyType: propLabel,
        spaces: scopeLabel,
        location: `Property: ${propLabel}`
      },
      projectDetails: {
        stage: finishGrade,
        notes: `Instant Project Estimate Calculator on Services page. Property: ${propLabel}, Scope: ${scopeLabel}, Grade: ${finishGrade}`
      },
      googleSheetData: {
        name: trimmedName,
        phone1: trimmedPhone,
        phone2: '',
        email: `${trimmedPhone.replace(/\D/g, '')}@leads.theespacio.com`,
        location: `Property: ${propLabel}`,
        requirement: scopeLabel,
        stage: finishGrade,
        source: 'Services Page (Instant Project Estimate)',
        notes: `Property: ${propLabel}, Scope: ${scopeLabel}, Grade: ${finishGrade}`
      }
    };

    let backendSynced = false;
    try {
      await axios.post('/api/leads', servicesPayload);
      backendSynced = true;
    } catch (err1) {
      try {
        await axios.post('/leads', servicesPayload);
        backendSynced = true;
      } catch (err2) {
        console.warn('Backend leads sync notice:', err2?.message);
      }
    }

    // Direct Webhook Fallback if backend was unreachable
    const directWebhook = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
    if (!backendSynced && directWebhook && directWebhook.startsWith('http')) {
      try {
        await fetch(directWebhook, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            source: 'Services Page (Instant Project Estimate)',
            name: trimmedName,
            phone1: trimmedPhone,
            phone2: '',
            email: `${trimmedPhone.replace(/\D/g, '')}@leads.theespacio.com`,
            location: `Property: ${propLabel}`,
            requirement: scopeLabel,
            stage: finishGrade,
            notes: `Instant Project Estimate Calculator. Property: ${propLabel}, Scope: ${scopeLabel}, Grade: ${finishGrade}`,
            status: 'NEW'
          })
        });
      } catch {}
    }

    setSubmitted(true);
  };

  return (
    <div className="bg-cream border border-walnut/15 rounded-card p-6 md:p-8 shadow-xl space-y-6">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 pb-3 border-b border-walnut/10">
            <h3 className="font-display text-xl font-bold text-charcoal">Instant Project Estimate</h3>
            <p className="font-sans text-xs text-walnut">Configure your project details to unlock your personalized estimate</p>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">1. Property Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '2bhk', label: '2 BHK' },
                { id: '3bhk', label: '3 BHK' },
                { id: 'villa', label: 'Villa' },
                { id: 'office', label: 'Office' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPropertyType(item.id)}
                  className={`py-2.5 px-3 rounded-card text-xs font-sans font-medium transition-all ${
                    propertyType === item.id 
                      ? 'bg-charcoal text-cream shadow-md font-bold' 
                      : 'bg-offwhite text-walnut border border-walnut/10 hover:border-walnut/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">2. Scope of Work</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'full', label: 'Turnkey Full Home' },
                { id: 'kitchen', label: 'Modular Kitchen' },
                { id: 'louvers', label: 'Panelling & Louvers' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setScope(item.id)}
                  className={`py-2.5 px-3 rounded-card text-xs font-sans font-medium transition-all ${
                    scope === item.id 
                      ? 'bg-charcoal text-cream shadow-md font-bold' 
                      : 'bg-offwhite text-walnut border border-walnut/10 hover:border-walnut/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Input for Lead Capture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-walnut/20 bg-white text-xs font-sans focus:outline-none focus:border-gold"
            />
            <input
              type="tel"
              placeholder="Mobile / WhatsApp Number *"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-walnut/20 bg-white text-xs font-sans focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full text-center bg-gold text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-charcoal hover:text-cream transition-all shadow-md cursor-pointer"
          >
            Unlock Personalized Estimate →
          </button>
        </form>
      ) : (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto border border-gold/30">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal">Your Estimate is Ready</h3>
          <p className="font-sans text-xs text-walnut leading-relaxed max-w-[420px] mx-auto">
            Your estimate is ready — we'll share your personalized range on a quick call, since site conditions affect final BOQ significantly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-full border border-walnut/20 text-charcoal font-sans text-xs font-bold hover:bg-charcoal hover:text-cream transition-all"
            >
              Configure Another Estimate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;

