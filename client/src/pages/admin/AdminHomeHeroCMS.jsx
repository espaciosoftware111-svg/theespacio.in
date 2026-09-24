import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ImageIcon, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUpRight, Check, AlertCircle, RefreshCw,
  Layers, FolderKanban, MessageSquare, HelpCircle, Star,
  Compass, ExternalLink, ShieldCheck, Sparkles, Layout,
  ChevronDown, ArrowRight
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, uploadImageFile } from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';
import MediaPickerModal from '../../components/admin/MediaPickerModal';

const AdminHomeHeroCMS = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [cardPickerOpen, setCardPickerOpen] = useState(false);
  const fileInputBgRef = useRef(null);
  const fileInputCardRef = useRef(null);

  // Complete Homepage CMS State (Covers All Sections Visible on Home)
  const [heroState, setHeroState] = useState({
    // Section 1: Hero Section
    hero_visible: true,
    hero_bg_images: [
      '/images/hero/hero_bedroom_4k.webp',
      '/images/hero/hero_kitchen_4k.webp',
      '/images/hero/hero_kids_bedroom_4k.webp',
      '/images/hero/hero_dining_4k.webp'
    ],
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
    hero_stat3_label: 'Years Combined Legacy',
    hero_stat3_visible: true,
    hero_stat3_order: 3,

    // Section 2: Turnkey Intro & Heritage Story
    intro_visible: true,
    intro_heading: 'Turnkey interiors, done properly.',
    intro_description: "ESPACIO brings together thoughtful design, solid materials, and honest craftsmanship to build spaces that work for real life. Backed by forty years of family construction heritage in Hyderabad, we don't just decorate rooms, we plan, build, and deliver them completely, so you never have to chase a contractor or worry about what's happening on site.",
    intro_cta_text1: 'Our Story ↗',
    intro_cta_text2: 'Read More ↗',
    intro_cta_link: '/about',

    // Section 3: Main Stats Grid (25+, 100+, 40+)
    grid_stats_visible: true,
    grid_stat1_val: '25+',
    grid_stat1_label: 'Projects Completed',
    grid_stat1_subtext: 'Turnkey Interiors',
    grid_stat2_val: '100+',
    grid_stat2_label: 'Happy Clients',
    grid_stat2_subtext: 'Including Materials',
    grid_stat3_val: '40+',
    grid_stat3_label: 'Years Legacy',
    grid_stat3_subtext: 'Combined Legacy',

    // Section 4: Showcase Carousel Slides
    showcase_slides: [
      { projectImg: "/images/company/3bhk_lux/open_hall.png", projectLabel: "Kokapet Luxury Duplex" },
      { projectImg: "/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg", projectLabel: "Modular Kitchen Fitout" },
      { projectImg: "/images/company/3bhk_lux/open_hall.png", projectLabel: "Jubilee Hills 3BHK" },
      { projectImg: "/images/company/2bhk_mordern_retro/office_3.jpg", projectLabel: "Gachibowli Modern Office" }
    ],

    // Section 5: Selected Work / Our Projects
    projects_visible: true,
    projects_heading: 'Our Projects',
    projects_subtitle: 'Selected Work',
    projects_cta_text: 'All Projects ↗',
    projects_cta_link: '/projects',

    // Section 6: Services 3D Parallax Showcase
    parallax_visible: true,

    // Section 7: FAQ Showcase Section
    faq_visible: true,
    faq_heading: 'Got Questions?\nWe Have Answers.',
    faq_subtitle: "From first consultation to final installation, we know you want to understand exactly what to expect. Here's everything you need to know about working with ESPACIO.",

    // Section 8: Testimonials Marquee
    testimonials_visible: true
  });

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings && Object.keys(storedSettings).length > 0) {
        setHeroState((prev) => ({ ...prev, ...storedSettings }));
        setLoading(false);
      }
      try {
        const res = await axios.get('/settings');
        if (res.data && res.data.success && res.data.data && Object.keys(res.data.data).length > 0) {
          const apiData = res.data.data;
          setHeroState((prev) => {
            const merged = { ...prev, ...apiData };
            const bgImgs = (Array.isArray(apiData.hero_bg_images) && apiData.hero_bg_images.length > 0)
              ? apiData.hero_bg_images
              : (Array.isArray(apiData.hero_images) && apiData.hero_images.length > 0)
                ? apiData.hero_images
                : (Array.isArray(prev.hero_bg_images) && prev.hero_bg_images.length > 0)
                  ? prev.hero_bg_images
                  : merged.hero_bg_images;

            const finalMerged = {
              ...merged,
              hero_bg_images: bgImgs,
              hero_images: bgImgs
            };
            setCMSData(STORAGE_KEYS.SETTINGS, finalMerged);
            return finalMerged;
          });
        }
      } catch (err) {
        console.warn('API load settings warning:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const cleanedBgImages = (heroState.hero_bg_images || [])
      .map(url => (typeof url === 'string' ? url.trim() : ''))
      .filter(Boolean);

    const updatedHeroState = {
      ...heroState,
      hero_bg_images: cleanedBgImages,
      hero_images: cleanedBgImages
    };

    setHeroState(updatedHeroState);

    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = { ...existing, ...updatedHeroState };

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.', err);
    }

    setSaving(false);
    setSaved(true);
    showNotification('Homepage sections updated successfully.');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFieldChange = (key, val) => {
    setHeroState((prev) => ({ ...prev, [key]: val }));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      callback(uploadedUrl);
    }
  };

  const inpClass = "w-full bg-white border border-stone-200 focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none rounded-xl font-sans text-xs px-3.5 py-2.5 text-stone-900 placeholder:text-stone-400 transition-all";
  const labelClass = "font-sans text-[11px] uppercase tracking-wider text-stone-600 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-stone-500">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Homepage CMS...</span>
      </div>
    );
  }

  // Active stats sorted by order
  const activeStats = [
    { key: 1, val: heroState.hero_stat1_value, label: heroState.hero_stat1_label, visible: heroState.hero_stat1_visible, order: Number(heroState.hero_stat1_order) || 1 },
    { key: 2, val: heroState.hero_stat2_value, label: heroState.hero_stat2_label, visible: heroState.hero_stat2_visible, order: Number(heroState.hero_stat2_order) || 2 },
    { key: 3, val: heroState.hero_stat3_value, label: heroState.hero_stat3_label, visible: heroState.hero_stat3_visible, order: Number(heroState.hero_stat3_order) || 3 },
  ].filter(s => s.visible).sort((a, b) => a.order - b.order);

  const heroBgPreview = (heroState.hero_bg_images?.[0] && heroState.hero_bg_images[0] !== '/api/user-uploaded-bedroom.jpg')
    ? heroState.hero_bg_images[0]
    : '/images/hero/hero_bedroom_4k.webp';
  const cardImgPreview = (heroState.hero_card_image && heroState.hero_card_image !== '/api/user-uploaded-bedroom.jpg')
    ? heroState.hero_card_image
    : heroBgPreview;

  // Master List of Sections on the Homepage for quick switchboard overview
  const sectionsList = [
    {
      id: 'section-hero',
      num: '01',
      title: 'Hero & Luxury Carousel',
      desc: 'Top fullscreen slider, glass craft card & floating counters',
      visibleKey: 'hero_visible',
      isVisible: heroState.hero_visible !== false,
      badge: 'Main Banner'
    },
    {
      id: 'section-intro',
      num: '02',
      title: 'Turnkey Heritage Story',
      desc: '"Turnkey interiors, done properly." heading & story narrative',
      visibleKey: 'intro_visible',
      isVisible: heroState.intro_visible !== false,
      badge: 'Story & Narrative'
    },
    {
      id: 'section-grid-stats',
      num: '03',
      title: 'Main Statistics Grid',
      desc: '3-Column counter cards (25+ Projects, 100+ Clients, 40+ Legacy)',
      visibleKey: 'grid_stats_visible',
      isVisible: heroState.grid_stats_visible !== false,
      badge: 'Stats & Trust'
    },
    {
      id: 'section-showcase',
      num: '04',
      title: 'Showcase Carousel Slides',
      desc: 'Auto-cycling showcase card next to the heritage story',
      visibleKey: 'intro_visible', // linked to section 2 showcase
      isVisible: heroState.intro_visible !== false,
      badge: 'Visual Slides'
    },
    {
      id: 'section-projects',
      num: '05',
      title: 'Selected Work / Projects',
      desc: 'Sticky-scroll case study showcase linking to full projects',
      visibleKey: 'projects_visible',
      isVisible: heroState.projects_visible !== false,
      badge: 'Featured Works'
    },
    {
      id: 'section-parallax',
      num: '06',
      title: 'Services 3D Parallax',
      desc: 'Floating 3D luxury interior space cards & service links',
      visibleKey: 'parallax_visible',
      isVisible: heroState.parallax_visible !== false,
      badge: '3D Parallax'
    },
    {
      id: 'section-faqs',
      num: '07',
      title: 'Homepage FAQ Showcase',
      desc: 'Got Questions interactive 3D showcase & accordion items',
      visibleKey: 'faq_visible',
      isVisible: heroState.faq_visible !== false,
      badge: 'Interactive FAQ'
    },
    {
      id: 'section-testimonials',
      num: '08',
      title: 'Testimonials Marquee',
      desc: 'Horizontal auto-scrolling client reviews & ratings',
      visibleKey: 'testimonials_visible',
      isVisible: heroState.testimonials_visible !== false,
      badge: 'Client Reviews'
    },
    {
      id: 'section-cta',
      num: '09',
      title: 'Bottom Consultation CTA',
      desc: 'Direct estimate callout & lead generation trigger',
      visibleKey: null,
      isVisible: true,
      badge: 'Lead Magnet'
    }
  ];

  const visibleCount = sectionsList.filter(s => s.isVisible).length;
  const hiddenCount = sectionsList.length - visibleCount;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-white border border-gold/40 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2.5 font-sans text-xs font-bold animate-bounce">
          <CheckCircle size={16} className="text-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Save Action Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider bg-gold/15 text-stone-800 border border-gold/30">
                Universal Page Architecture
              </span>
              <span className="text-[11px] font-sans text-stone-500 font-medium">
                {visibleCount} Active • {hiddenCount} Hidden
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">
              Home Page CMS
            </h1>
            <p className="font-sans text-xs text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Complete control center for the ESPACIO public homepage. Every section visible on the live website can be toggled ON/OFF, reordered, edited, and customized in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-sans text-xs uppercase tracking-wider font-bold py-3 px-4 rounded-xl border border-stone-300/80 transition-all"
            >
              <ExternalLink size={14} />
              <span>View Live Home</span>
            </a>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-stone-900 font-sans text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-60"
            >
              {saved ? (
                <>
                  <CheckCircle size={15} className="text-stone-900" />
                  <span>Published Live!</span>
                </>
              ) : saving ? (
                <>
                  <Loader2 size={15} className="animate-spin text-stone-900" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} className="text-stone-900" />
                  <span>Save & Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MASTER SECTIONS ARCHITECTURE & VISIBILITY SWITCHBOARD */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Layers size={18} className="text-gold" />
              <h2 className="font-editorial text-lg font-bold text-stone-900">
                Homepage Sections Architecture & Master Visibility
              </h2>
            </div>
            <p className="font-sans text-xs text-stone-500 mt-1">
              Toggle any section switch below to instantly show or hide that section from the live homepage. Click "Edit Section" to jump directly down to its content settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5">
          {sectionsList.map((sec) => (
            <div
              key={sec.id}
              className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                sec.isVisible
                  ? 'bg-stone-50/70 border-stone-200 hover:border-gold/50 shadow-2xs'
                  : 'bg-stone-100/60 border-stone-200/60 opacity-75'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700">
                      {sec.num}
                    </span>
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-gold">
                      {sec.badge}
                    </span>
                  </div>
                  {sec.visibleKey ? (
                    <button
                      type="button"
                      onClick={() => handleFieldChange(sec.visibleKey, !sec.isVisible)}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        sec.isVisible ? 'bg-gold' : 'bg-stone-300'
                      }`}
                      title={sec.isVisible ? 'Turn Section OFF' : 'Turn Section ON'}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                          sec.isVisible ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  ) : (
                    <span className="text-[10px] font-sans font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Always Active
                    </span>
                  )}
                </div>

                <h3 className="font-editorial text-sm font-bold text-stone-900">
                  {sec.title}
                </h3>
                <p className="font-sans text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between">
                <span className={`text-[10px] font-sans font-bold flex items-center space-x-1 ${sec.isVisible ? 'text-emerald-600' : 'text-stone-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sec.isVisible ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                  <span>{sec.isVisible ? 'Live on Home' : 'Hidden from Home'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className="text-[11px] font-sans font-bold text-stone-700 hover:text-gold flex items-center space-x-1 transition-colors"
                >
                  <span>Edit Section</span>
                  <ChevronDown size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Grid: Left Form Controls (7 cols) + Right Live Sticky Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Comprehensive Section Editors */}
        <div className="lg:col-span-7 space-y-8">

          {/* ============================================================ */}
          {/* SECTION 1: HERO & LUXURY BACKGROUNDS */}
          {/* ============================================================ */}
          <div id="section-hero" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 01
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <ImageIcon size={18} className="text-gold" />
                    <span>Hero Section & Live Backgrounds</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Manage the top fullscreen banner, background carousel images, craft card, and floating counter badges.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.hero_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('hero_visible', heroState.hero_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.hero_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.hero_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Hidden File Input for Background Upload */}
            <input
              type="file"
              ref={fileInputBgRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                const updated = [dataUrl, ...(heroState.hero_bg_images || [])];
                handleFieldChange('hero_bg_images', updated);
              })}
            />

            {/* Background Carousel Images */}
            <div className="space-y-3 bg-stone-50/70 border border-stone-200 p-5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <label className={labelClass}>Hero Background Carousel Images</label>
                  <span className="text-[11px] font-sans text-stone-500">Auto-fades in background every 3 seconds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setBgPickerOpen(true)}
                    className="flex items-center space-x-1.5 bg-gold/15 hover:bg-gold text-stone-900 border border-gold/40 px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <ImageIcon size={12} />
                    <span>From Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputBgRef.current?.click()}
                    className="flex items-center space-x-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <Plus size={12} />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {(heroState.hero_bg_images || []).map((imgUrl, i) => (
                <div key={i} className="flex items-center space-x-2.5 bg-white border border-stone-200 p-2 rounded-xl shadow-2xs">
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={`Bg ${i+1}`}
                      className="w-12 h-10 object-cover rounded-lg shrink-0 border border-stone-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/hero/hero_bedroom_thumb.webp';
                      }}
                    />
                  )}
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => {
                      const updated = [...(heroState.hero_bg_images || [])];
                      updated[i] = e.target.value;
                      handleFieldChange('hero_bg_images', updated);
                    }}
                    className={inpClass}
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (heroState.hero_bg_images || []).filter((_, idx) => idx !== i);
                      handleFieldChange('hero_bg_images', updated);
                    }}
                    className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const updated = [
                    ...(heroState.hero_bg_images || []),
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90'
                  ];
                  handleFieldChange('hero_bg_images', updated);
                }}
                className="flex items-center space-x-1.5 text-gold text-xs font-sans font-bold uppercase pt-1"
              >
                <Plus size={14} />
                <span>Add Extra Background Image</span>
              </button>
            </div>

            {/* Left Floating Feature Card Sub-section */}
            <div className="space-y-4 bg-stone-50/70 border border-stone-200 p-5 rounded-xl">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-200">
                <Sliders size={16} className="text-gold" />
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Left Floating Glass Feature Card
                </h3>
              </div>

              {/* Card Photo Input */}
              <input
                type="file"
                ref={fileInputCardRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleFieldChange('hero_card_image', dataUrl);
                })}
              />

              <div>
                <label className={labelClass}>Card Image Thumbnail (Optional Custom Photo)</label>
                <div className="flex items-center space-x-2.5">
                  {cardImgPreview && (
                    <img
                      src={cardImgPreview}
                      alt="Card preview"
                      className="w-16 h-12 object-cover rounded-lg border border-stone-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/hero/hero_bedroom_thumb.webp';
                      }}
                    />
                  )}
                  <input
                    type="text"
                    value={heroState.hero_card_image || ''}
                    onChange={(e) => handleFieldChange('hero_card_image', e.target.value)}
                    className={inpClass}
                    placeholder="Auto-syncs with main background carousel if left blank"
                  />
                  <button
                    type="button"
                    onClick={() => setCardPickerOpen(true)}
                    className="flex items-center space-x-1 bg-gold/15 hover:bg-gold text-stone-900 border border-gold/40 px-3 py-2.5 rounded-xl font-sans text-[11px] font-bold uppercase shrink-0 transition-all"
                  >
                    <ImageIcon size={12} />
                    <span>Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputCardRef.current?.click()}
                    className="flex items-center space-x-1 bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-2.5 rounded-xl font-sans text-[11px] font-bold uppercase shrink-0"
                  >
                    <Plus size={12} />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Hero Card Heading</label>
                <input
                  type="text"
                  value={heroState.hero_card_heading}
                  onChange={(e) => handleFieldChange('hero_card_heading', e.target.value)}
                  className={inpClass}
                  placeholder="We Craft the Future Dwelling"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA Button Text</label>
                  <input
                    type="text"
                    value={heroState.hero_card_cta_text}
                    onChange={(e) => handleFieldChange('hero_card_cta_text', e.target.value)}
                    className={inpClass}
                    placeholder="Our Projects"
                  />
                </div>
                <div>
                  <label className={labelClass}>CTA Button Link</label>
                  <input
                    type="text"
                    value={heroState.hero_card_cta_link}
                    onChange={(e) => handleFieldChange('hero_card_cta_link', e.target.value)}
                    className={inpClass}
                    placeholder="/projects"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between bg-white border border-stone-200 p-3.5 rounded-xl">
                <div>
                  <span className="font-sans text-xs font-bold text-stone-900 block">Show CTA Button</span>
                  <span className="font-sans text-[11px] text-stone-500">Display button inside the glass card</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('hero_card_cta_visible', !heroState.hero_card_cta_visible)}
                  className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                    heroState.hero_card_cta_visible ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.hero_card_cta_visible ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Lower-Right Hero Stats Counters */}
            <div className="space-y-4 bg-stone-50/70 border border-stone-200 p-5 rounded-xl">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-200">
                <Sliders size={16} className="text-gold" />
                <h3 className="font-editorial text-base font-bold text-stone-900">
                  Lower-Right Hero Counter Badges
                </h3>
              </div>

              {/* Stat 1 */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider">Badge 01</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="font-sans text-[11px] text-stone-500">Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hero_stat1_visible', !heroState.hero_stat1_visible)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        heroState.hero_stat1_visible ? 'bg-gold' : 'bg-stone-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                        heroState.hero_stat1_visible ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.hero_stat1_value}
                      onChange={(e) => handleFieldChange('hero_stat1_value', e.target.value)}
                      className={inpClass}
                      placeholder="25+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.hero_stat1_label}
                      onChange={(e) => handleFieldChange('hero_stat1_label', e.target.value)}
                      className={inpClass}
                      placeholder="Projects Completed"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      value={heroState.hero_stat1_order}
                      onChange={(e) => handleFieldChange('hero_stat1_order', e.target.value)}
                      className={inpClass}
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider">Badge 02</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="font-sans text-[11px] text-stone-500">Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hero_stat2_visible', !heroState.hero_stat2_visible)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        heroState.hero_stat2_visible ? 'bg-gold' : 'bg-stone-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                        heroState.hero_stat2_visible ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.hero_stat2_value}
                      onChange={(e) => handleFieldChange('hero_stat2_value', e.target.value)}
                      className={inpClass}
                      placeholder="100+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.hero_stat2_label}
                      onChange={(e) => handleFieldChange('hero_stat2_label', e.target.value)}
                      className={inpClass}
                      placeholder="Happy Clients"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      value={heroState.hero_stat2_order}
                      onChange={(e) => handleFieldChange('hero_stat2_order', e.target.value)}
                      className={inpClass}
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider">Badge 03</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="font-sans text-[11px] text-stone-500">Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hero_stat3_visible', !heroState.hero_stat3_visible)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        heroState.hero_stat3_visible ? 'bg-gold' : 'bg-stone-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                        heroState.hero_stat3_visible ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.hero_stat3_value}
                      onChange={(e) => handleFieldChange('hero_stat3_value', e.target.value)}
                      className={inpClass}
                      placeholder="40+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.hero_stat3_label}
                      onChange={(e) => handleFieldChange('hero_stat3_label', e.target.value)}
                      className={inpClass}
                      placeholder="Years of Legacy"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      value={heroState.hero_stat3_order}
                      onChange={(e) => handleFieldChange('hero_stat3_order', e.target.value)}
                      className={inpClass}
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 2: TURNKEY INTRO & HERITAGE STORY */}
          {/* ============================================================ */}
          <div id="section-intro" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 02
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <Sliders size={18} className="text-gold" />
                    <span>Turnkey Heritage Story Section</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Manage the main headline ("Turnkey interiors, done properly."), narrative text, and CTA buttons.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.intro_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('intro_visible', heroState.intro_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.intro_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.intro_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Section Main Heading</label>
                <textarea
                  rows={2}
                  value={heroState.intro_heading}
                  onChange={(e) => handleFieldChange('intro_heading', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Turnkey interiors, done properly."
                />
              </div>

              <div>
                <label className={labelClass}>Description Paragraph</label>
                <textarea
                  rows={4}
                  value={heroState.intro_description}
                  onChange={(e) => handleFieldChange('intro_description', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="ESPACIO brings together thoughtful design..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className={labelClass}>Button Text 1 (Primary)</label>
                  <input
                    type="text"
                    value={heroState.intro_cta_text1}
                    onChange={(e) => handleFieldChange('intro_cta_text1', e.target.value)}
                    className={inpClass}
                    placeholder="Our Story ↗"
                  />
                </div>
                <div>
                  <label className={labelClass}>Button Text 2 (Hover)</label>
                  <input
                    type="text"
                    value={heroState.intro_cta_text2}
                    onChange={(e) => handleFieldChange('intro_cta_text2', e.target.value)}
                    className={inpClass}
                    placeholder="Read More ↗"
                  />
                </div>
                <div>
                  <label className={labelClass}>Button Link Destination</label>
                  <input
                    type="text"
                    value={heroState.intro_cta_link}
                    onChange={(e) => handleFieldChange('intro_cta_link', e.target.value)}
                    className={inpClass}
                    placeholder="/about"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: MAIN HOMEPAGE STATS GRID */}
          {/* ============================================================ */}
          <div id="section-grid-stats" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 03
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <Sliders size={18} className="text-gold" />
                    <span>Homepage Main Stats Grid (3 Columns)</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Manage the 3 animated counter cards (25+ Projects, 100+ Happy Clients, 40+ Legacy) positioned below the intro.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.grid_stats_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('grid_stats_visible', heroState.grid_stats_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.grid_stats_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.grid_stats_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Stat 1 */}
              <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 space-y-3">
                <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">Column 01</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.grid_stat1_val}
                      onChange={(e) => handleFieldChange('grid_stat1_val', e.target.value)}
                      className={inpClass}
                      placeholder="25+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.grid_stat1_label}
                      onChange={(e) => handleFieldChange('grid_stat1_label', e.target.value)}
                      className={inpClass}
                      placeholder="Projects Completed"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bottom Subtext</label>
                    <input
                      type="text"
                      value={heroState.grid_stat1_subtext || ''}
                      onChange={(e) => handleFieldChange('grid_stat1_subtext', e.target.value)}
                      className={inpClass}
                      placeholder="Turnkey Interiors"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 space-y-3">
                <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">Column 02</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.grid_stat2_val}
                      onChange={(e) => handleFieldChange('grid_stat2_val', e.target.value)}
                      className={inpClass}
                      placeholder="100+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.grid_stat2_label}
                      onChange={(e) => handleFieldChange('grid_stat2_label', e.target.value)}
                      className={inpClass}
                      placeholder="Happy Clients"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bottom Subtext</label>
                    <input
                      type="text"
                      value={heroState.grid_stat2_subtext || ''}
                      onChange={(e) => handleFieldChange('grid_stat2_subtext', e.target.value)}
                      className={inpClass}
                      placeholder="Including Materials"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 space-y-3">
                <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">Column 03</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.grid_stat3_val}
                      onChange={(e) => handleFieldChange('grid_stat3_val', e.target.value)}
                      className={inpClass}
                      placeholder="40+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.grid_stat3_label}
                      onChange={(e) => handleFieldChange('grid_stat3_label', e.target.value)}
                      className={inpClass}
                      placeholder="Years Legacy"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Bottom Subtext</label>
                    <input
                      type="text"
                      value={heroState.grid_stat3_subtext || ''}
                      onChange={(e) => handleFieldChange('grid_stat3_subtext', e.target.value)}
                      className={inpClass}
                      placeholder="Combined Legacy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 4: SHOWCASE CAROUSEL SLIDES */}
          {/* ============================================================ */}
          <div id="section-showcase" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 04
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <ImageIcon size={18} className="text-gold" />
                    <span>Showcase Carousel Images & Badges</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Manage the cycling luxury interior cards positioned beside the heritage narrative.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(heroState.showcase_slides || []).map((slide, idx) => (
                <div key={idx} className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                    <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider">Slide 0{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (heroState.showcase_slides || []).filter((_, i) => i !== idx);
                        handleFieldChange('showcase_slides', updated);
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-3">
                      {slide.projectImg && (
                        <img
                          src={slide.projectImg}
                          alt={`Slide ${idx+1}`}
                          className="w-full aspect-[16/10] object-cover rounded-lg border border-stone-200"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/company/3bhk_lux/open_hall.png';
                          }}
                        />
                      )}
                    </div>

                    <div className="md:col-span-9 space-y-3">
                      <div>
                        <label className={labelClass}>Image URL</label>
                        <input
                          type="text"
                          value={slide.projectImg || ''}
                          onChange={(e) => {
                            const updated = [...(heroState.showcase_slides || [])];
                            updated[idx] = { ...updated[idx], projectImg: e.target.value };
                            handleFieldChange('showcase_slides', updated);
                          }}
                          className={inpClass}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Project Badge Label</label>
                        <input
                          type="text"
                          value={slide.projectLabel || ''}
                          onChange={(e) => {
                            const updated = [...(heroState.showcase_slides || [])];
                            updated[idx] = { ...updated[idx], projectLabel: e.target.value };
                            handleFieldChange('showcase_slides', updated);
                          }}
                          className={inpClass}
                          placeholder="e.g. Banjara Hills Villa"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const updated = [
                    ...(heroState.showcase_slides || []),
                    {
                      projectImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                      projectLabel: "New Showcase Project"
                    }
                  ];
                  handleFieldChange('showcase_slides', updated);
                }}
                className="flex items-center space-x-1.5 text-gold text-xs font-sans font-bold uppercase pt-1"
              >
                <Plus size={14} />
                <span>Add Showcase Slide</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 5: SELECTED WORK / OUR PROJECTS */}
          {/* ============================================================ */}
          <div id="section-projects" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 05
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <FolderKanban size={18} className="text-gold" />
                    <span>Selected Work / Our Projects Section</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Manage the sticky-scroll showcase headers and button, plus links to the comprehensive Projects CMS.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.projects_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('projects_visible', heroState.projects_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.projects_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.projects_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Section Main Heading</label>
                <input
                  type="text"
                  value={heroState.projects_heading || ''}
                  onChange={(e) => handleFieldChange('projects_heading', e.target.value)}
                  className={inpClass}
                  placeholder="Our Projects"
                />
              </div>
              <div>
                <label className={labelClass}>Section Subtitle (Overline)</label>
                <input
                  type="text"
                  value={heroState.projects_subtitle || ''}
                  onChange={(e) => handleFieldChange('projects_subtitle', e.target.value)}
                  className={inpClass}
                  placeholder="Selected Work"
                />
              </div>
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input
                  type="text"
                  value={heroState.projects_cta_text || ''}
                  onChange={(e) => handleFieldChange('projects_cta_text', e.target.value)}
                  className={inpClass}
                  placeholder="All Projects ↗"
                />
              </div>
              <div>
                <label className={labelClass}>CTA Button Link</label>
                <input
                  type="text"
                  value={heroState.projects_cta_link || ''}
                  onChange={(e) => handleFieldChange('projects_cta_link', e.target.value)}
                  className={inpClass}
                  placeholder="/projects"
                />
              </div>
            </div>

            {/* Integration Note with Projects CMS */}
            <div className="bg-amber-50/70 border border-gold/30 rounded-xl p-4 flex items-start space-x-3">
              <Sparkles size={18} className="text-gold shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-stone-900">
                  Featured Case Studies Linked from Projects CMS
                </h4>
                <p className="font-sans text-[11px] text-stone-600 leading-relaxed">
                  The projects displayed in this section are dynamically retrieved from your portfolio. Any project marked as <strong>"Featured"</strong> in the Projects CMS will automatically appear in this homepage sticky-scroll showcase.
                </p>
                <div className="pt-2">
                  <Link
                    to="/espesp/admin/projects"
                    className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold text-stone-900 bg-white border border-stone-300 hover:border-gold px-3.5 py-1.5 rounded-lg shadow-2xs transition-all"
                  >
                    <span>Open Projects CMS & Manage Case Studies</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 6: SERVICES 3D PARALLAX SHOWCASE */}
          {/* ============================================================ */}
          <div id="section-parallax" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 06
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <Compass size={18} className="text-gold" />
                    <span>Services 3D Parallax Showcase</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Full-bleed 3D floating gallery featuring luxury spaces (Living, Kitchens, Wardrobes, Balcony, Panelling).
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.parallax_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('parallax_visible', heroState.parallax_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.parallax_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.parallax_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 flex items-start space-x-3">
              <Compass size={18} className="text-gold shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-stone-900">
                  Interactive Spatial Showcase
                </h4>
                <p className="font-sans text-[11px] text-stone-600 leading-relaxed">
                  The parallax cards respond dynamically to page scroll with a high-end 3D depth effect. Individual service items, spatial categories, and material details can be customized in the <strong>Spaces CMS</strong> and <strong>Services CMS</strong>.
                </p>
                <div className="flex items-center space-x-2 pt-2">
                  <Link
                    to="/espesp/admin/spaces"
                    className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold text-stone-900 bg-white border border-stone-300 hover:border-gold px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                  >
                    <span>Open Spaces CMS</span>
                    <ArrowRight size={12} />
                  </Link>
                  <Link
                    to="/espesp/admin/services"
                    className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold text-stone-900 bg-white border border-stone-300 hover:border-gold px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                  >
                    <span>Open Services CMS</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 7: HOMEPAGE FAQ SHOWCASE */}
          {/* ============================================================ */}
          <div id="section-faqs" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 07
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <HelpCircle size={18} className="text-gold" />
                    <span>Homepage FAQ Section</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Manage the "Got Questions? We Have Answers." section heading, narrative, and sync with the FAQ CMS.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.faq_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('faq_visible', heroState.faq_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.faq_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.faq_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>FAQ Section Main Heading</label>
                <textarea
                  rows={2}
                  value={heroState.faq_heading || ''}
                  onChange={(e) => handleFieldChange('faq_heading', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder={"Got Questions?\nWe Have Answers."}
                />
              </div>

              <div>
                <label className={labelClass}>FAQ Section Subtitle / Introduction</label>
                <textarea
                  rows={3}
                  value={heroState.faq_subtitle || ''}
                  onChange={(e) => handleFieldChange('faq_subtitle', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="From first consultation to final installation, we know you want to understand exactly what to expect..."
                />
              </div>

              <div className="bg-amber-50/70 border border-gold/30 rounded-xl p-4 flex items-start space-x-3">
                <HelpCircle size={18} className="text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-sans text-xs font-bold text-stone-900">
                    Questions & Answers Auto-Sync with FAQ CMS
                  </h4>
                  <p className="font-sans text-[11px] text-stone-600 leading-relaxed">
                    The interactive questions, category badges, and imagery rendered in this section are dynamically loaded from the central FAQ manager.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/espesp/admin/faqs"
                      className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold text-stone-900 bg-white border border-stone-300 hover:border-gold px-3.5 py-1.5 rounded-lg shadow-2xs transition-all"
                    >
                      <span>Open FAQ CMS & Manage Questions</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 8: TESTIMONIALS MARQUEE */}
          {/* ============================================================ */}
          <div id="section-testimonials" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    SECTION 08
                  </span>
                  <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                    <Star size={18} className="text-gold" />
                    <span>Client Testimonials Marquee</span>
                  </h2>
                </div>
                <p className="font-sans text-xs text-stone-500 mt-1">
                  Horizontal continuous scrolling reviews ticker showcasing verified client feedback and ratings.
                </p>
              </div>

              <div className="flex items-center space-x-2.5">
                <span className="font-sans text-xs font-semibold text-stone-600">
                  {heroState.testimonials_visible !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleFieldChange('testimonials_visible', heroState.testimonials_visible === false ? true : false)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.testimonials_visible !== false ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      heroState.testimonials_visible !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-stone-50/70 border border-stone-200 rounded-xl p-4 flex items-start space-x-3">
              <Star size={18} className="text-gold shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-sans text-xs font-bold text-stone-900">
                  Client Reviews Managed in Testimonials CMS
                </h4>
                <p className="font-sans text-[11px] text-stone-600 leading-relaxed">
                  Add, edit, or reorder client reviews, photos, location tags, and star ratings via the dedicated Testimonials CMS. All active reviews automatically flow into the homepage marquee.
                </p>
                <div className="pt-2">
                  <Link
                    to="/espesp/admin/testimonials"
                    className="inline-flex items-center space-x-1.5 text-xs font-sans font-bold text-stone-900 bg-white border border-stone-300 hover:border-gold px-3.5 py-1.5 rounded-lg shadow-2xs transition-all"
                  >
                    <span>Open Testimonials CMS</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 9: BOTTOM HOMEPAGE CALL TO ACTION (CTA) */}
          {/* ============================================================ */}
          <div id="section-cta" className="bg-white border border-stone-200/90 rounded-2xl p-6 md:p-8 shadow-xs scroll-mt-24">
            <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-stone-200">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                SECTION 09
              </span>
              <div>
                <h2 className="font-editorial text-xl font-bold text-stone-900">
                  Bottom Call-To-Action (CTA) Section
                </h2>
                <p className="font-sans text-xs text-stone-500">
                  Customize the full-width consultation and quotation trigger at the bottom of the home page.
                </p>
              </div>
            </div>
            <CTASectionEditor pageKey="home" pageTitle="Home" />
          </div>

        </div>

        {/* Right Column: Live Sticky Preview & Quick Jump Station (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-20 space-y-6">

            {/* Live Hero Component Card Preview */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-sans text-[11px] uppercase tracking-wider text-stone-900 font-bold flex items-center space-x-1.5">
                  <Eye size={13} className="text-gold" />
                  <span>Live Hero Preview</span>
                </span>
                <span className="text-[10px] font-sans font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-Time Sync</span>
                </span>
              </div>

              {/* Preview Card Mock Container */}
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-900">
                {/* Background Image Preview */}
                <img
                  src={heroBgPreview}
                  alt="Background Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/hero/hero_bedroom_4k.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Floating Feature Card Preview */}
                <div className="absolute bottom-3 left-3 w-[65%] bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-3 shadow-xl">
                  <img
                    src={cardImgPreview}
                    alt="Thumbnail"
                    className="w-full aspect-[16/9] object-cover rounded-lg mb-2 border border-white/20"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/hero/hero_bedroom_4k.webp';
                    }}
                  />
                  <h3 className="font-display text-[13.5px] sm:text-[15px] font-bold text-white leading-tight mb-2 whitespace-nowrap truncate drop-shadow-md">
                    {heroState.hero_card_heading || 'We Craft the Future Dwelling'}
                  </h3>
                  {heroState.hero_card_cta_visible && (
                    <div className="inline-flex items-center space-x-1.5 bg-white/30 text-white font-sans text-[9.5px] font-bold px-2.5 py-1 rounded-full border border-white/40 shadow-xs">
                      <span>{heroState.hero_card_cta_text || 'Our Projects'}</span>
                      <ArrowUpRight size={10} />
                    </div>
                  )}
                </div>

                {/* Statistics Badges Preview */}
                <div className="absolute bottom-3 right-3 flex flex-col space-y-1.5 items-end">
                  {activeStats.map((s, i) => (
                    <div
                      key={i}
                      className="bg-white/15 backdrop-blur-md border border-white/25 rounded-lg px-2 py-1 text-right max-w-[85px]"
                    >
                      <span className="font-display text-xs font-bold text-white block leading-none">{s.val}</span>
                      <span className="font-sans text-[7px] text-white/80 uppercase tracking-tight block truncate">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 font-sans text-[11px] text-stone-600 leading-relaxed flex items-center space-x-2">
                <Check size={14} className="text-emerald-600 shrink-0" />
                <span>Saving changes immediately syncs to <code className="font-mono text-stone-800 bg-stone-200/60 px-1 py-0.5 rounded text-[10px]">Home.jsx</code> in live tabs.</span>
              </div>
            </div>

            {/* Quick Live Section Status Radar */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <h3 className="font-editorial text-sm font-bold text-stone-900">
                  Live Section Status Radar
                </h3>
                <span className="text-[10px] font-sans font-bold text-gold uppercase tracking-wider">
                  {visibleCount} Active / 9 Total
                </span>
              </div>

              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                {sectionsList.map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 border border-transparent hover:border-stone-200 cursor-pointer transition-all text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-mono text-[10px] text-stone-400 font-bold">{sec.num}</span>
                      <span className="font-sans text-[11px] font-semibold text-stone-800 truncate">{sec.title}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1 shrink-0 ${
                      sec.isVisible
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-stone-500 bg-stone-100 border border-stone-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sec.isVisible ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                      <span>{sec.isVisible ? 'Live' : 'Hidden'}</span>
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || saved}
                className="w-full mt-2 flex items-center justify-center space-x-2 bg-stone-900 hover:bg-stone-800 text-white font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-xl transition-all shadow-xs"
              >
                <Save size={13} className="text-gold" />
                <span>Save All Homepage Sections</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Media Picker Modal for Background Slider */}
      <MediaPickerModal
        isOpen={bgPickerOpen}
        onClose={() => setBgPickerOpen(false)}
        multiple={true}
        initialSelection={heroState.hero_bg_images || []}
        title="Select Hero Background Carousel Images"
        onSelect={(selectedUrls) => {
          if (Array.isArray(selectedUrls) && selectedUrls.length > 0) {
            handleFieldChange('hero_bg_images', selectedUrls);
          }
        }}
      />

      {/* Media Picker Modal for Feature Card Photo */}
      <MediaPickerModal
        isOpen={cardPickerOpen}
        onClose={() => setCardPickerOpen(false)}
        multiple={false}
        initialSelection={heroState.hero_card_image || ''}
        title="Select Feature Card Custom Photo"
        onSelect={(selectedUrl) => {
          if (typeof selectedUrl === 'string') {
            handleFieldChange('hero_card_image', selectedUrl);
          }
        }}
      />
    </div>
  );
};

export default AdminHomeHeroCMS;
