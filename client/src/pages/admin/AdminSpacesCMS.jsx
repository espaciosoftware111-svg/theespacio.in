import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Layers, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUpRight, Check, ImageIcon, ArrowUp, ArrowDown,
  CheckCircle2, SlidersHorizontal, HelpCircle, Search, ExternalLink,
  ImagePlus, RefreshCw, X, Award, ShieldCheck, Maximize2, Building2,
  Sparkles, LayoutGrid, FileText
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, uploadImageFile, notifyCMSUpdate } from '../../utils/cmsStore';
import { defaultSlides, defaultSpacesCategories } from '../../data/defaultSpacesData';
import CTASectionEditor from '../../components/admin/CTASectionEditor';

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminSpacesCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // Default to 'list' for spaces manager
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedSpaceIdx, setSelectedSpaceIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const fileInputBeforeRef = useRef(null);
  const fileInputAfterRef = useRef(null);
  const fileInputSpaceCoverRef = useRef(null);
  const fileInputGalleryRef = useRef(null);

  // 1. Spaces Hero & Before/After Slider State
  const [spacesHeroState, setSpacesHeroState] = useState({
    spaces_badge: 'Spaces',
    spaces_title: 'Bespoke Interior Spaces',
    spaces_subtitle: 'Interactive Before & After Transformation Explorer',
    spaces_before_label: 'BEFORE',
    spaces_after_label: 'AFTER',
    spaces_before_after_slides: defaultSlides,
    spaces_hero_visible: true
  });

  // 2. Spaces Settings (All Sections Visibility & Content)
  const [spacesSettingsState, setSpacesSettingsState] = useState({
    spaces_grid_visible: true,
    space_detail_hero_visible: true,
    spaces_trust_visible: true,
    trust_stat1_val: '25',
    trust_stat1_suffix: '+',
    trust_stat1_label: 'Projects',
    trust_stat1_sublabel: 'Completed Turnkey Residences',
    trust_stat2_val: '40',
    trust_stat2_suffix: '+',
    trust_stat2_label: 'Years',
    trust_stat2_sublabel: 'Combined Construction Legacy',
    trust_stat3_val: '50000',
    trust_stat3_suffix: '+',
    trust_stat3_label: 'Sq.Ft',
    trust_stat3_sublabel: 'Designed & Executed',
    trust_stat4_val: '10',
    trust_stat4_suffix: '-Year',
    trust_stat4_label: 'Warranty',
    trust_stat4_sublabel: 'Comprehensive Hardware Warranty',
    space_intro_visible: true,
    space_gallery_visible: true,
    space_materials_visible: true,
    space_materials_tag: 'MATERIALS & CRAFTSMANSHIP',
    space_materials_heading: 'Where design meets precision.',
    space_process_visible: true,
    space_process_tag: 'Turnkey Execution Flow',
    space_process_heading: 'Our 4-Step Design & Build Process',
    space_process_desc: 'Every detail is planned, confirmed in 3D, precision-cut in our factory, and delivered on schedule without vendor coordination stress.',
    space_faq_visible: true,
    space_crosslinks_visible: true,
    space_cta_visible: true
  });

  // 3. Space Domains List
  const [spacesList, setSpacesList] = useState(defaultSpacesCategories);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setSpacesHeroState({
          spaces_badge: getNonEmpty(storedSettings.spaces_badge, 'Spaces'),
          spaces_title: getNonEmpty(storedSettings.spaces_title, 'Bespoke Interior Spaces'),
          spaces_subtitle: getNonEmpty(storedSettings.spaces_subtitle, 'Interactive Before & After Transformation Explorer'),
          spaces_before_label: getNonEmpty(storedSettings.spaces_before_label, 'BEFORE'),
          spaces_after_label: getNonEmpty(storedSettings.spaces_after_label, 'AFTER'),
          spaces_before_after_slides: (Array.isArray(storedSettings.spaces_before_after_slides) && storedSettings.spaces_before_after_slides.length > 0)
            ? storedSettings.spaces_before_after_slides
            : defaultSlides,
          spaces_hero_visible: storedSettings.spaces_hero_visible !== false
        });

        setSpacesSettingsState((prev) => ({
          ...prev,
          spaces_grid_visible: storedSettings.spaces_grid_visible !== false,
          space_detail_hero_visible: storedSettings.space_detail_hero_visible !== false,
          spaces_trust_visible: storedSettings.spaces_trust_visible !== false,
          trust_stat1_val: storedSettings.trust_stat1_val || prev.trust_stat1_val,
          trust_stat1_suffix: storedSettings.trust_stat1_suffix || prev.trust_stat1_suffix,
          trust_stat1_label: storedSettings.trust_stat1_label || prev.trust_stat1_label,
          trust_stat1_sublabel: storedSettings.trust_stat1_sublabel || prev.trust_stat1_sublabel,
          trust_stat2_val: storedSettings.trust_stat2_val || prev.trust_stat2_val,
          trust_stat2_suffix: storedSettings.trust_stat2_suffix || prev.trust_stat2_suffix,
          trust_stat2_label: storedSettings.trust_stat2_label || prev.trust_stat2_label,
          trust_stat2_sublabel: storedSettings.trust_stat2_sublabel || prev.trust_stat2_sublabel,
          trust_stat3_val: storedSettings.trust_stat3_val || prev.trust_stat3_val,
          trust_stat3_suffix: storedSettings.trust_stat3_suffix || prev.trust_stat3_suffix,
          trust_stat3_label: storedSettings.trust_stat3_label || prev.trust_stat3_label,
          trust_stat3_sublabel: storedSettings.trust_stat3_sublabel || prev.trust_stat3_sublabel,
          trust_stat4_val: storedSettings.trust_stat4_val || prev.trust_stat4_val,
          trust_stat4_suffix: storedSettings.trust_stat4_suffix || prev.trust_stat4_suffix,
          trust_stat4_label: storedSettings.trust_stat4_label || prev.trust_stat4_label,
          trust_stat4_sublabel: storedSettings.trust_stat4_sublabel || prev.trust_stat4_sublabel,
          space_intro_visible: storedSettings.space_intro_visible !== false,
          space_gallery_visible: storedSettings.space_gallery_visible !== false,
          space_materials_visible: storedSettings.space_materials_visible !== false,
          space_materials_tag: storedSettings.space_materials_tag || prev.space_materials_tag,
          space_materials_heading: storedSettings.space_materials_heading || prev.space_materials_heading,
          space_process_visible: storedSettings.space_process_visible !== false,
          space_process_tag: storedSettings.space_process_tag || prev.space_process_tag,
          space_process_heading: storedSettings.space_process_heading || prev.space_process_heading,
          space_process_desc: storedSettings.space_process_desc || prev.space_process_desc,
          space_faq_visible: storedSettings.space_faq_visible !== false,
          space_crosslinks_visible: storedSettings.space_crosslinks_visible !== false,
          space_cta_visible: storedSettings.space_cta_visible !== false
        }));

        if (Array.isArray(storedSettings.spaces_list) && storedSettings.spaces_list.length > 0) {
          setSpacesList(storedSettings.spaces_list.filter(s => s.slug !== 'apartments' && s.slug !== 'villas'));
        }
      }

      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setSpacesHeroState((prev) => ({
            ...prev,
            spaces_badge: getNonEmpty(d.spaces_badge, prev.spaces_badge),
            spaces_title: getNonEmpty(d.spaces_title, prev.spaces_title),
            spaces_subtitle: getNonEmpty(d.spaces_subtitle, prev.spaces_subtitle),
            spaces_before_label: getNonEmpty(d.spaces_before_label, prev.spaces_before_label),
            spaces_after_label: getNonEmpty(d.spaces_after_label, prev.spaces_after_label),
            spaces_before_after_slides: (Array.isArray(d.spaces_before_after_slides) && d.spaces_before_after_slides.length > 0)
              ? d.spaces_before_after_slides
              : prev.spaces_before_after_slides,
            spaces_hero_visible: d.spaces_hero_visible !== false
          }));

          setSpacesSettingsState((prev) => ({
            ...prev,
            spaces_grid_visible: d.spaces_grid_visible !== false,
            space_detail_hero_visible: d.space_detail_hero_visible !== false,
            spaces_trust_visible: d.spaces_trust_visible !== false,
            trust_stat1_val: d.trust_stat1_val || prev.trust_stat1_val,
            trust_stat1_suffix: d.trust_stat1_suffix || prev.trust_stat1_suffix,
            trust_stat1_label: d.trust_stat1_label || prev.trust_stat1_label,
            trust_stat1_sublabel: d.trust_stat1_sublabel || prev.trust_stat1_sublabel,
            trust_stat2_val: d.trust_stat2_val || prev.trust_stat2_val,
            trust_stat2_suffix: d.trust_stat2_suffix || prev.trust_stat2_suffix,
            trust_stat2_label: d.trust_stat2_label || prev.trust_stat2_label,
            trust_stat2_sublabel: d.trust_stat2_sublabel || prev.trust_stat2_sublabel,
            trust_stat3_val: d.trust_stat3_val || prev.trust_stat3_val,
            trust_stat3_suffix: d.trust_stat3_suffix || prev.trust_stat3_suffix,
            trust_stat3_label: d.trust_stat3_label || prev.trust_stat3_label,
            trust_stat3_sublabel: d.trust_stat3_sublabel || prev.trust_stat3_sublabel,
            trust_stat4_val: d.trust_stat4_val || prev.trust_stat4_val,
            trust_stat4_suffix: d.trust_stat4_suffix || prev.trust_stat4_suffix,
            trust_stat4_label: d.trust_stat4_label || prev.trust_stat4_label,
            trust_stat4_sublabel: d.trust_stat4_sublabel || prev.trust_stat4_sublabel,
            space_intro_visible: d.space_intro_visible !== false,
            space_gallery_visible: d.space_gallery_visible !== false,
            space_materials_visible: d.space_materials_visible !== false,
            space_materials_tag: d.space_materials_tag || prev.space_materials_tag,
            space_materials_heading: d.space_materials_heading || prev.space_materials_heading,
            space_process_visible: d.space_process_visible !== false,
            space_process_tag: d.space_process_tag || prev.space_process_tag,
            space_process_heading: d.space_process_heading || prev.space_process_heading,
            space_process_desc: d.space_process_desc || prev.space_process_desc,
            space_faq_visible: d.space_faq_visible !== false,
            space_crosslinks_visible: d.space_crosslinks_visible !== false,
            space_cta_visible: d.space_cta_visible !== false
          }));

          if (Array.isArray(d.spaces_list) && d.spaces_list.length > 0) {
            setSpacesList(d.spaces_list.filter(s => s.slug !== 'apartments' && s.slug !== 'villas'));
          }
        }
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleHeroChange = (key, val) => {
    setSpacesHeroState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated, ...spacesSettingsState, spaces_list: spacesList });
      notifyCMSUpdate();
      return updated;
    });
  };

  const handleSettingChange = (key, val) => {
    setSpacesSettingsState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...updated, spaces_list: spacesList });
      notifyCMSUpdate();
      return updated;
    });
  };

  const handleSpaceChange = (idx, key, val) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
      notifyCMSUpdate();
      return updated;
    });
  };

  const handleSpaceDetailChange = (idx, subKey, val) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      const currentDetails = updated[idx].details || {};
      updated[idx] = {
        ...updated[idx],
        details: { ...currentDetails, [subKey]: val }
      };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
      notifyCMSUpdate();
      return updated;
    });
  };

  // Gallery Images Management for active space
  const handleAddGalleryImage = (url) => {
    if (!url || typeof url !== 'string' || !url.trim()) return;
    const cleanUrl = url.trim();
    setSpacesList((prev) => {
      const updated = [...prev];
      const currentImages = Array.isArray(updated[selectedSpaceIdx]?.galleryImages)
        ? [...updated[selectedSpaceIdx].galleryImages]
        : [];
      if (!currentImages.includes(cleanUrl)) {
        currentImages.unshift(cleanUrl);
      }
      updated[selectedSpaceIdx] = { ...updated[selectedSpaceIdx], galleryImages: currentImages };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
      notifyCMSUpdate();
      return updated;
    });
    setNewGalleryUrl('');
    showNotification('Image added to gallery!');
  };

  const handleDeleteGalleryImage = (imgIdx) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      const currentImages = Array.isArray(updated[selectedSpaceIdx]?.galleryImages)
        ? [...updated[selectedSpaceIdx].galleryImages]
        : [];
      const filtered = currentImages.filter((_, i) => i !== imgIdx);
      updated[selectedSpaceIdx] = { ...updated[selectedSpaceIdx], galleryImages: filtered };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
      notifyCMSUpdate();
      return updated;
    });
    showNotification('Image removed from gallery.');
  };

  const handleSetCoverImage = (imgUrl) => {
    handleSpaceChange(selectedSpaceIdx, 'heroImage', imgUrl);
    showNotification('Set as space cover image!');
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existing,
      ...spacesHeroState,
      ...spacesSettingsState,
      spaces_list: spacesList
    };

    // Immediately persist to local storage and broadcast live update
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    notifyCMSUpdate();

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.', err);
    }

    setSaving(false);
    setSaved(true);
    showNotification('Spaces Page & All Sections Published Live!');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddSpace = () => {
    const newSlug = `space-${Date.now().toString().slice(-4)}`;
    const newSpace = {
      name: 'New Custom Space',
      slug: newSlug,
      description: 'Detailed description of your new custom interior space domain.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      visible: true,
      details: {
        tag: 'Bespoke Domain',
        headline: 'Custom Tailored Interior Space',
        body: 'Detailed craftsmanship narrative for this custom interior space domain.',
        cta_text: 'Enquire About New Space',
        gallery_title: 'New Space Gallery',
        gallery_subtitle: 'Design Showcase',
        gallery_desc: 'Reference designs categorized and ordered by layout configuration.',
        includes: ['Custom Layout Planning', 'Material Sourcing', 'Turnkey White-Glove Execution']
      },
      galleryImages: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      filters: ['Contemporary', 'Minimalist', 'Luxury']
    };
    const updated = [...spacesList, newSpace];
    setSpacesList(updated);
    setSelectedSpaceIdx(spacesList.length);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
    notifyCMSUpdate();
    showNotification('New Space domain added.');
  };

  const handleDeleteSpace = (idx) => {
    if (spacesList.length <= 1) {
      alert('You must keep at least one Space domain.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${spacesList[idx].name}"?`)) {
      const updated = spacesList.filter((_, i) => i !== idx);
      setSpacesList(updated);
      setSelectedSpaceIdx(0);
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
      notifyCMSUpdate();
      showNotification('Space domain removed.');
    }
  };

  const handleMoveSpace = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === spacesList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...spacesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSpacesList(updated);
    setSelectedSpaceIdx(targetIdx);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, ...spacesSettingsState, spaces_list: updated });
    notifyCMSUpdate();
  };

  // Master List of Sections across the entire Spaces feature (Hub & Inner Detail)
  const sectionsList = [
    {
      id: 'spaces_hero',
      num: '01',
      badge: 'Hub Page',
      name: 'Before / After Hero Slider',
      desc: 'Interactive dual-slider comparing pre-construction vs completed spaces on /spaces.',
      isVisible: spacesHeroState.spaces_hero_visible !== false,
      visibleKey: 'spaces_hero_visible',
      targetTab: 'hero',
      isHero: true,
    },
    {
      id: 'spaces_grid',
      num: '02',
      badge: 'Hub Page',
      name: 'Spaces Directory Grid',
      desc: 'Full responsive 2-column visual grid showing all 16 space domain cards.',
      isVisible: spacesSettingsState.spaces_grid_visible !== false,
      visibleKey: 'spaces_grid_visible',
      targetTab: 'list',
    },
    {
      id: 'space_detail_hero',
      num: '03',
      badge: 'Inner Detail',
      name: 'Cinematic Detail Hero',
      desc: 'Immersive full-bleed banner with dynamic breadcrumb, title & description.',
      isVisible: spacesSettingsState.space_detail_hero_visible !== false,
      visibleKey: 'space_detail_hero_visible',
      targetTab: 'list',
    },
    {
      id: 'spaces_trust',
      num: '04',
      badge: 'Inner Detail',
      name: 'Trust & Engineering Stats Strip',
      desc: '4 metric counters: 25+ Projects, 40+ Years, 50,000+ Sq.Ft, 10-Year Warranty.',
      isVisible: spacesSettingsState.spaces_trust_visible !== false,
      visibleKey: 'spaces_trust_visible',
      targetTab: 'trust',
    },
    {
      id: 'space_intro',
      num: '05',
      badge: 'Inner Detail',
      name: 'Architectural Intro & Tag Block',
      desc: 'Category tag, headline, narrative body paragraph, and Enquire CTA button.',
      isVisible: spacesSettingsState.space_intro_visible !== false,
      visibleKey: 'space_intro_visible',
      targetTab: 'list',
    },
    {
      id: 'space_gallery',
      num: '06',
      badge: 'Inner Detail',
      name: 'Design Showcase / Gallery Grid',
      desc: 'Rich reference gallery ordered by layout type with full-screen zoom lightbox.',
      isVisible: spacesSettingsState.space_gallery_visible !== false,
      visibleKey: 'space_gallery_visible',
      targetTab: 'list',
    },
    {
      id: 'space_materials',
      num: '07',
      badge: 'Inner Detail',
      name: 'Materials & Craftsmanship Strip',
      desc: 'Tactile material specifications (HDHMR, German Joinery, Sintered Stone).',
      isVisible: spacesSettingsState.space_materials_visible !== false,
      visibleKey: 'space_materials_visible',
      targetTab: 'materials',
    },
    {
      id: 'space_process',
      num: '08',
      badge: 'Inner Detail',
      name: '4-Step Turnkey Execution Process',
      desc: 'Step-by-step workflow: Consultation → 3D CAD → Factory Build → Handover.',
      isVisible: spacesSettingsState.space_process_visible !== false,
      visibleKey: 'space_process_visible',
      targetTab: 'materials',
    },
    {
      id: 'space_faq',
      num: '09',
      badge: 'Inner Detail',
      name: 'Spaces FAQ Block',
      desc: 'Domain-specific FAQ accordion addressing timelines, customization & warranties.',
      isVisible: spacesSettingsState.space_faq_visible !== false,
      visibleKey: 'space_faq_visible',
      targetTab: 'materials',
    },
    {
      id: 'space_crosslinks',
      num: '10',
      badge: 'Inner Detail',
      name: 'Related Spaces Cross-Links',
      desc: 'Intelligent card recommendations guiding visitors to explore companion rooms.',
      isVisible: spacesSettingsState.space_crosslinks_visible !== false,
      visibleKey: 'space_crosslinks_visible',
      targetTab: 'list',
    },
    {
      id: 'space_cta',
      num: '11',
      badge: 'Global Footer',
      name: 'Bottom Consultation CTA Section',
      desc: 'High-converting consultation booking banner at the footer of Hub & Detail pages.',
      isVisible: spacesSettingsState.space_cta_visible !== false,
      visibleKey: 'space_cta_visible',
      targetTab: 'cta',
    }
  ];

  const activeCount = sectionsList.filter(s => s.isVisible).length;
  const totalCount = sectionsList.length;

  const inpClass = "w-full bg-stone-50 border border-stone-200 focus:border-gold focus:bg-white focus:outline-none rounded-xl font-sans text-xs px-4 py-3 text-stone-900 placeholder:text-stone-400 transition-all";
  const labelClass = "font-sans text-[11px] uppercase tracking-wider text-stone-500 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-stone-400">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Spaces CMS...</span>
      </div>
    );
  }

  // Filtered spaces by search query
  const filteredSpaces = spacesList.map((space, originalIdx) => ({ space, originalIdx })).filter(({ space }) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (space.name && space.name.toLowerCase().includes(q)) ||
      (space.slug && space.slug.toLowerCase().includes(q)) ||
      (space.details?.tag && space.details.tag.toLowerCase().includes(q))
    );
  });

  const currentSpace = spacesList[selectedSpaceIdx] || spacesList[0];

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2 font-sans text-xs font-bold border border-gold/30">
          <CheckCircle size={16} className="text-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Master Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-sans font-bold uppercase tracking-wider text-stone-400 mb-1">
            <span>Admin</span>
            <span>/</span>
            <span className="text-gold">Spaces CMS</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-stone-900">Spaces Page & Domains CMS</h1>
          <p className="font-sans text-xs text-stone-500 mt-1 max-w-2xl">
            Control all 11 sections of the Spaces site: Before/After hero comparison, 16 individual space domains, gallery photo collections, trust metrics, materials, and bottom footer CTA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-sans font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Synced</span>
          </div>

          <a
            href="/spaces"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 font-sans text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>View Live Spaces</span>
            <ExternalLink size={13} />
          </a>

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center space-x-2 bg-gold hover:bg-[#b89355] text-stone-950 font-sans text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-60"
          >
            {saved ? (
              <>
                <CheckCircle size={15} />
                <span>Published Live!</span>
              </>
            ) : saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <Save size={15} />
                <span>Save & Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MASTER SECTIONS ARCHITECTURE & VISIBILITY SWITCHBOARD */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Layers size={18} className="text-gold" />
              <h2 className="font-editorial text-lg font-bold text-stone-900">
                Spaces Architecture & Master Visibility Switchboard
              </h2>
            </div>
            <p className="font-sans text-xs text-stone-500 mt-1">
              Toggle any section switch below to instantly show or hide that section from the live website. Click "Configure Section" to jump straight into its editor.
            </p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="font-sans text-xs font-bold text-stone-600">Active Status:</span>
            <span className="font-sans text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
              {activeCount} of {totalCount} Sections Visible ({Math.round((activeCount / totalCount) * 100)}%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-5">
          {sectionsList.map((sec) => (
            <div
              key={sec.id}
              className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                sec.isVisible
                  ? 'bg-stone-50/80 border-stone-200 hover:border-gold/50 shadow-2xs'
                  : 'bg-stone-100/50 border-stone-200/60 opacity-60'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">
                      {sec.num}
                    </span>
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-gold">
                      {sec.badge}
                    </span>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (sec.isHero) {
                        handleHeroChange('spaces_hero_visible', !sec.isVisible);
                      } else {
                        handleSettingChange(sec.visibleKey, !sec.isVisible);
                      }
                    }}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      sec.isVisible ? 'bg-gold' : 'bg-stone-300'
                    }`}
                    title={sec.isVisible ? 'Turn Section OFF' : 'Turn Section ON'}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                        sec.isVisible ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <h4 className="font-sans text-xs font-bold text-stone-900 mt-1">{sec.name}</h4>
                <p className="font-sans text-[11px] text-stone-500 leading-snug">{sec.desc}</p>
              </div>

              <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between mt-3">
                <span className={`font-sans text-[10px] font-bold uppercase tracking-wider ${sec.isVisible ? 'text-emerald-700' : 'text-stone-400'}`}>
                  {sec.isVisible ? '● Active Live' : '○ Hidden from Site'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(sec.targetTab);
                  }}
                  className="font-sans text-[10px] font-bold uppercase tracking-wider text-stone-600 hover:text-gold flex items-center space-x-1"
                >
                  <span>Configure</span>
                  <ArrowUpRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-xs ${
            activeTab === 'list'
              ? 'bg-gold text-stone-950 border border-gold font-black'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <Layers size={15} />
          <span>Space Domains ({spacesList.length} Domains)</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-xs ${
            activeTab === 'hero'
              ? 'bg-gold text-stone-950 border border-gold font-black'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <SlidersHorizontal size={15} />
          <span>Before / After Hero Slider</span>
        </button>

        <button
          onClick={() => setActiveTab('trust')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-xs ${
            activeTab === 'trust'
              ? 'bg-gold text-stone-950 border border-gold font-black'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <Award size={15} />
          <span>Trust & Engineering Strip</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-xs ${
            activeTab === 'materials'
              ? 'bg-gold text-stone-950 border border-gold font-black'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <Sparkles size={15} />
          <span>Materials & Process</span>
        </button>

        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-xs ${
            activeTab === 'cta'
              ? 'bg-gold text-stone-950 border border-gold font-black'
              : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <HelpCircle size={15} />
          <span>Bottom Consultation CTA</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: SPACE DOMAINS MANAGER & DEEP INNER EDITOR            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Domains Directory & Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-stone-600">
                  Domains ({spacesList.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddSpace}
                  className="flex items-center space-x-1 bg-gold/15 text-gold-dark hover:bg-gold hover:text-stone-950 px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all"
                >
                  <Plus size={13} />
                  <span>Add Space</span>
                </button>
              </div>

              {/* Search Domain Input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search space (e.g. Foyer, Kitchen)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 focus:border-gold focus:bg-white focus:outline-none rounded-xl font-sans text-xs pl-9 pr-3 py-2 text-stone-900 placeholder:text-stone-400 transition-all"
                />
              </div>
            </div>

            {/* Scrollable Domains List */}
            <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
              {filteredSpaces.map(({ space, originalIdx }) => {
                const isSelected = originalIdx === selectedSpaceIdx;
                const galleryCount = Array.isArray(space.galleryImages) ? space.galleryImages.length : 0;
                return (
                  <div
                    key={originalIdx}
                    onClick={() => setSelectedSpaceIdx(originalIdx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50/70 border-gold shadow-xs ring-1 ring-gold/40'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className={`font-mono text-xs font-bold ${isSelected ? 'text-gold-dark font-black' : 'text-stone-400'}`}>
                        {String(originalIdx + 1).padStart(2, '0')}
                      </span>
                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-sans text-xs font-bold truncate ${isSelected ? 'text-stone-950' : 'text-stone-800'}`}>
                            {space.name}
                          </h4>
                          {space.visible === false && (
                            <span className="font-sans text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-200 text-stone-600 font-bold">
                              Hidden
                            </span>
                          )}
                        </div>
                        <span className="font-sans text-[10px] text-stone-500 uppercase tracking-widest block truncate">
                          {space.details?.tag || 'Space Domain'} • {galleryCount} Photos
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveSpace(originalIdx, 'up')}
                        disabled={originalIdx === 0}
                        className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSpace(originalIdx, 'down')}
                        disabled={originalIdx === spacesList.length - 1}
                        className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpace(originalIdx)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete Space"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Space Deep Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
              {/* Space Header & Visibility Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-200 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest px-2 py-0.5 rounded bg-gold/10">
                      Editing Space {String(selectedSpaceIdx + 1).padStart(2, '0')}
                    </span>
                    <a
                      href={`/spaces/${currentSpace.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-[11px] text-stone-500 hover:text-gold flex items-center space-x-1 font-semibold"
                    >
                      <span>/spaces/{currentSpace.slug}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-stone-900 mt-1">{currentSpace.name}</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-sans text-xs text-stone-500 font-bold">Space Visible:</span>
                  <button
                    type="button"
                    onClick={() => handleSpaceChange(selectedSpaceIdx, 'visible', !(currentSpace.visible !== false))}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                      currentSpace.visible !== false ? 'bg-gold' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                        currentSpace.visible !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hidden File Input for Space Cover */}
              <input
                type="file"
                ref={fileInputSpaceCoverRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleSpaceChange(selectedSpaceIdx, 'heroImage', dataUrl);
                  showNotification('Cover image uploaded!');
                })}
              />

              {/* Hidden File Input for Gallery Photos */}
              <input
                type="file"
                ref={fileInputGalleryRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleAddGalleryImage(dataUrl);
                })}
              />

              {/* Basic Domain Metadata */}
              <div className="space-y-4">
                <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  1. Basic Domain Information
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Space Name / Title</label>
                    <input
                      type="text"
                      value={currentSpace.name || ''}
                      onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'name', e.target.value)}
                      className={inpClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>URL Slug (e.g. foyer)</label>
                    <input
                      type="text"
                      value={currentSpace.slug || ''}
                      onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className={inpClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Category Tag (e.g. Grand First Impressions)</label>
                    <input
                      type="text"
                      value={currentSpace.details?.tag || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'tag', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description (Shown on Grid Card & SEO)</label>
                  <textarea
                    rows={2}
                    value={currentSpace.description || ''}
                    onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'description', e.target.value)}
                    className={`${inpClass} resize-none`}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Space Cover Image (Shown on Hub Card & Detail Banner)</label>
                  <div className="flex items-center space-x-3">
                    {currentSpace.heroImage && (
                      <img
                        src={currentSpace.heroImage}
                        alt="Cover"
                        className="w-20 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                      />
                    )}
                    <input
                      type="text"
                      value={currentSpace.heroImage || ''}
                      onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'heroImage', e.target.value)}
                      className={inpClass}
                      placeholder="/images/spaces/... or https://..."
                    />
                    <button
                      type="button"
                      onClick={() => fileInputSpaceCoverRef.current?.click()}
                      className="flex items-center space-x-1 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3.5 py-3 rounded-xl font-sans text-xs font-bold uppercase shrink-0 transition-all"
                    >
                      <Plus size={13} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Inner Space Detailed Page Content */}
              <div className="space-y-4 pt-5 border-t border-stone-200">
                <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  2. Inner Space Page Headline, Narrative & Primary CTA
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Detail Headline</label>
                    <input
                      type="text"
                      value={currentSpace.details?.headline || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'headline', e.target.value)}
                      className={inpClass}
                      placeholder="e.g. Entrance Foyers Crafted to Welcome and Impress"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Enquire Button Label</label>
                    <input
                      type="text"
                      value={currentSpace.details?.cta_text || `Enquire About ${currentSpace.name}`}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'cta_text', e.target.value)}
                      className={inpClass}
                      placeholder={`Enquire About ${currentSpace.name}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Detailed Body Narrative</label>
                  <textarea
                    rows={3}
                    value={currentSpace.details?.body || ''}
                    onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'body', e.target.value)}
                    className={`${inpClass} resize-none`}
                    placeholder="The narrative explaining ergonomics, materiality, and emotional tone..."
                  />
                </div>
              </div>

              {/* Gallery Header & Photos Manager */}
              <div className="space-y-4 pt-5 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">
                      3. Design Showcase / Gallery Header & Photo Collection
                    </span>
                    <span className="font-sans text-[11px] text-stone-500">
                      Manage all gallery reference images for {currentSpace.name}. These photos populate the interactive grid on the inner page.
                    </span>
                  </div>
                  <span className="font-sans text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    {(currentSpace.galleryImages || []).length} Photos in Gallery
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Gallery Subtitle Tag</label>
                    <input
                      type="text"
                      value={currentSpace.details?.gallery_subtitle || 'Design Showcase'}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'gallery_subtitle', e.target.value)}
                      className={inpClass}
                      placeholder="Design Showcase"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Gallery Main Heading</label>
                    <input
                      type="text"
                      value={currentSpace.details?.gallery_title || `${currentSpace.name} Gallery`}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'gallery_title', e.target.value)}
                      className={inpClass}
                      placeholder={`${currentSpace.name} Gallery`}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Gallery Description</label>
                  <input
                    type="text"
                    value={currentSpace.details?.gallery_desc || 'Reference designs categorized and ordered by layout configuration. Click any design to zoom in.'}
                    onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'gallery_desc', e.target.value)}
                    className={inpClass}
                  />
                </div>

                {/* Add Photo Actions */}
                <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
                  <span className="font-sans text-xs font-bold text-stone-700 block">Add Photo to Gallery</span>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (e.g. /images/spaces/... or https://...)"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className={inpClass}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddGalleryImage(newGalleryUrl)}
                      className="px-4 py-3 bg-stone-900 hover:bg-black text-white font-sans text-xs font-bold uppercase rounded-xl transition-all shrink-0"
                    >
                      Add URL
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputGalleryRef.current?.click()}
                      className="flex items-center justify-center space-x-1.5 px-4 py-3 bg-gold hover:bg-[#b89355] text-stone-950 font-sans text-xs font-bold uppercase rounded-xl transition-all shrink-0 shadow-xs"
                    >
                      <ImagePlus size={14} />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnails Grid */}
                <div className="space-y-2">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                    Current Gallery Images (Click to preview or set as cover)
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                    {(currentSpace.galleryImages || []).map((imgUrl, imgIdx) => {
                      const isCover = currentSpace.heroImage === imgUrl;
                      return (
                        <div
                          key={imgIdx}
                          className="group relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 aspect-video shadow-2xs"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />

                          {/* Cover badge */}
                          {isCover && (
                            <div className="absolute top-1.5 left-1.5 bg-gold text-stone-950 font-sans text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow">
                              Cover
                            </div>
                          )}

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-stone-900/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2 text-center">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(imgUrl)}
                                className="px-2 py-1 bg-white/90 text-stone-900 hover:bg-gold hover:text-stone-950 text-[10px] font-sans font-bold uppercase rounded transition-colors"
                              >
                                Set As Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryImage(imgIdx)}
                              className="px-2 py-1 bg-red-500/90 text-white hover:bg-red-600 text-[10px] font-sans font-bold uppercase rounded flex items-center space-x-1 transition-colors"
                            >
                              <Trash2 size={11} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* What's Included Bullet Points */}
              <div className="space-y-3 pt-5 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">
                    4. What's Included Specifications
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(currentSpace.details?.includes || []), 'New Included Specification'];
                      handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                    }}
                    className="flex items-center space-x-1 bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1 rounded-lg font-sans text-[11px] font-bold uppercase"
                  >
                    <Plus size={12} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(currentSpace.details?.includes || []).map((item, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 bg-stone-50 border border-stone-200 p-2 rounded-xl">
                      <CheckCircle2 size={15} className="text-gold shrink-0 ml-1" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...(currentSpace.details?.includes || [])];
                          updated[fIdx] = e.target.value;
                          handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                        }}
                        className={inpClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (currentSpace.details?.includes || []).filter((_, i) => i !== fIdx);
                          handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                        }}
                        className="p-2.5 text-stone-400 hover:text-red-500 rounded-lg shrink-0 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: BEFORE / AFTER HERO SLIDER                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                  <SlidersHorizontal size={18} className="text-gold" />
                  <span>Before / After Hero Interactive Slider</span>
                </h2>
                <p className="font-sans text-xs text-stone-500 mt-0.5">
                  Configure the primary hero section on the main /spaces hub page.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-sans text-xs text-stone-500 font-bold">Hero Visible:</span>
                <button
                  type="button"
                  onClick={() => handleHeroChange('spaces_hero_visible', !spacesHeroState.spaces_hero_visible)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    spacesHeroState.spaces_hero_visible ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      spacesHeroState.spaces_hero_visible ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputBeforeRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                const slides = [...spacesHeroState.spaces_before_after_slides];
                if (slides[0]) slides[0].before = dataUrl;
                handleHeroChange('spaces_before_after_slides', slides);
                showNotification('Before image updated!');
              })}
            />
            <input
              type="file"
              ref={fileInputAfterRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                const slides = [...spacesHeroState.spaces_before_after_slides];
                if (slides[0]) slides[0].after = dataUrl;
                handleHeroChange('spaces_before_after_slides', slides);
                showNotification('After image updated!');
              })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Before Badge Label</label>
                <input
                  type="text"
                  value={spacesHeroState.spaces_before_label || 'BEFORE'}
                  onChange={(e) => handleHeroChange('spaces_before_label', e.target.value)}
                  className={inpClass}
                  placeholder="BEFORE"
                />
              </div>
              <div>
                <label className={labelClass}>After Badge Label</label>
                <input
                  type="text"
                  value={spacesHeroState.spaces_after_label || 'AFTER'}
                  onChange={(e) => handleHeroChange('spaces_after_label', e.target.value)}
                  className={inpClass}
                  placeholder="AFTER"
                />
              </div>
            </div>

            {/* Slide 1 Configuration */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <span className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider block">
                Primary Comparison Images
              </span>

              {/* Before Photo */}
              <div className="space-y-2">
                <label className={labelClass}>Before Image</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={spacesHeroState.spaces_before_after_slides?.[0]?.before || '/images/spaces/spaces_hero_before.webp'}
                    alt="Before"
                    className="w-20 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <input
                    type="text"
                    value={spacesHeroState.spaces_before_after_slides?.[0]?.before || ''}
                    onChange={(e) => {
                      const slides = [...spacesHeroState.spaces_before_after_slides];
                      if (slides[0]) slides[0].before = e.target.value;
                      handleHeroChange('spaces_before_after_slides', slides);
                    }}
                    className={inpClass}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputBeforeRef.current?.click()}
                    className="px-3.5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-sans text-xs font-bold uppercase shrink-0 transition-all"
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* After Photo */}
              <div className="space-y-2">
                <label className={labelClass}>After Image</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={spacesHeroState.spaces_before_after_slides?.[0]?.after || '/images/spaces/spaces_hero_after.webp'}
                    alt="After"
                    className="w-20 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <input
                    type="text"
                    value={spacesHeroState.spaces_before_after_slides?.[0]?.after || ''}
                    onChange={(e) => {
                      const slides = [...spacesHeroState.spaces_before_after_slides];
                      if (slides[0]) slides[0].after = e.target.value;
                      handleHeroChange('spaces_before_after_slides', slides);
                    }}
                    className={inpClass}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputAfterRef.current?.click()}
                    className="px-3.5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-sans text-xs font-bold uppercase shrink-0 transition-all"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Live Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center space-x-1.5">
                  <Eye size={13} />
                  <span>Interactive Slider Preview</span>
                </span>
                <span className="text-[10px] font-sans text-stone-400 font-semibold">Real-time binding</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-900">
                <img
                  src={spacesHeroState.spaces_before_after_slides?.[0]?.after || '/images/spaces/spaces_hero_after.webp'}
                  alt="Hero Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute left-3 bottom-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-white">
                    {spacesHeroState.spaces_before_label || 'BEFORE'}
                  </span>
                </div>
                <div className="absolute right-3 bottom-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-white">
                    {spacesHeroState.spaces_after_label || 'AFTER'}
                  </span>
                </div>
              </div>
              <p className="font-sans text-[11px] text-stone-500 text-center">
                This hero card displays prominently with interactive dragging on <span className="font-semibold text-stone-800">/spaces</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: TRUST & ENGINEERING STRIP (4 METRIC COUNTERS)         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'trust' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs max-w-5xl">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                <Award size={18} className="text-gold" />
                <span>Trust & Engineering Metrics Strip</span>
              </h2>
              <p className="font-sans text-xs text-stone-500 mt-0.5">
                These 4 animated stat counters appear right beneath the hero banner on all 16 space detail pages.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-sans text-xs text-stone-500 font-bold">Strip Visible:</span>
              <button
                type="button"
                onClick={() => handleSettingChange('spaces_trust_visible', !spacesSettingsState.spaces_trust_visible)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                  spacesSettingsState.spaces_trust_visible ? 'bg-gold' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    spacesSettingsState.spaces_trust_visible ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4 Stat Cards Editor */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-stone-700">
                <Building2 size={16} className="text-gold" />
                <span className="font-sans text-xs font-bold uppercase">Counter 1</span>
              </div>
              <div>
                <label className={labelClass}>Value & Suffix</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat1_val}
                    onChange={(e) => handleSettingChange('trust_stat1_val', e.target.value)}
                    className={inpClass}
                    placeholder="25"
                  />
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat1_suffix}
                    onChange={(e) => handleSettingChange('trust_stat1_suffix', e.target.value)}
                    className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-2 py-3 text-center text-xs font-bold"
                    placeholder="+"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat1_label}
                  onChange={(e) => handleSettingChange('trust_stat1_label', e.target.value)}
                  className={inpClass}
                  placeholder="Projects"
                />
              </div>
              <div>
                <label className={labelClass}>Sublabel</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat1_sublabel}
                  onChange={(e) => handleSettingChange('trust_stat1_sublabel', e.target.value)}
                  className={inpClass}
                  placeholder="Completed Turnkey Residences"
                />
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-stone-700">
                <Award size={16} className="text-gold" />
                <span className="font-sans text-xs font-bold uppercase">Counter 2</span>
              </div>
              <div>
                <label className={labelClass}>Value & Suffix</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat2_val}
                    onChange={(e) => handleSettingChange('trust_stat2_val', e.target.value)}
                    className={inpClass}
                    placeholder="40"
                  />
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat2_suffix}
                    onChange={(e) => handleSettingChange('trust_stat2_suffix', e.target.value)}
                    className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-2 py-3 text-center text-xs font-bold"
                    placeholder="+"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat2_label}
                  onChange={(e) => handleSettingChange('trust_stat2_label', e.target.value)}
                  className={inpClass}
                  placeholder="Years"
                />
              </div>
              <div>
                <label className={labelClass}>Sublabel</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat2_sublabel}
                  onChange={(e) => handleSettingChange('trust_stat2_sublabel', e.target.value)}
                  className={inpClass}
                  placeholder="Combined Construction Legacy"
                />
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-stone-700">
                <Maximize2 size={16} className="text-gold" />
                <span className="font-sans text-xs font-bold uppercase">Counter 3</span>
              </div>
              <div>
                <label className={labelClass}>Value & Suffix</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat3_val}
                    onChange={(e) => handleSettingChange('trust_stat3_val', e.target.value)}
                    className={inpClass}
                    placeholder="50000"
                  />
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat3_suffix}
                    onChange={(e) => handleSettingChange('trust_stat3_suffix', e.target.value)}
                    className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-2 py-3 text-center text-xs font-bold"
                    placeholder="+"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat3_label}
                  onChange={(e) => handleSettingChange('trust_stat3_label', e.target.value)}
                  className={inpClass}
                  placeholder="Sq.Ft"
                />
              </div>
              <div>
                <label className={labelClass}>Sublabel</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat3_sublabel}
                  onChange={(e) => handleSettingChange('trust_stat3_sublabel', e.target.value)}
                  className={inpClass}
                  placeholder="Designed & Executed"
                />
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-stone-700">
                <ShieldCheck size={16} className="text-gold" />
                <span className="font-sans text-xs font-bold uppercase">Counter 4</span>
              </div>
              <div>
                <label className={labelClass}>Value & Suffix</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat4_val}
                    onChange={(e) => handleSettingChange('trust_stat4_val', e.target.value)}
                    className={inpClass}
                    placeholder="10"
                  />
                  <input
                    type="text"
                    value={spacesSettingsState.trust_stat4_suffix}
                    onChange={(e) => handleSettingChange('trust_stat4_suffix', e.target.value)}
                    className="w-16 bg-stone-50 border border-stone-200 rounded-xl px-2 py-3 text-center text-xs font-bold"
                    placeholder="-Year"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Label</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat4_label}
                  onChange={(e) => handleSettingChange('trust_stat4_label', e.target.value)}
                  className={inpClass}
                  placeholder="Warranty"
                />
              </div>
              <div>
                <label className={labelClass}>Sublabel</label>
                <input
                  type="text"
                  value={spacesSettingsState.trust_stat4_sublabel}
                  onChange={(e) => handleSettingChange('trust_stat4_sublabel', e.target.value)}
                  className={inpClass}
                  placeholder="Comprehensive Hardware Warranty"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: MATERIALS & PROCESS CRAFTSMANSHIP                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'materials' && (
        <div className="space-y-6 max-w-5xl">
          {/* Materials Section */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 flex items-center space-x-2">
                  <Sparkles size={16} className="text-gold" />
                  <span>Materials & Craftsmanship Section</span>
                </h3>
                <p className="font-sans text-xs text-stone-500 mt-0.5">
                  Displays tactile material specifications (HDHMR marine ply, Blum soft-close joinery, quartz stone).
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-sans text-xs text-stone-500 font-bold">Visible:</span>
                <button
                  type="button"
                  onClick={() => handleSettingChange('space_materials_visible', !spacesSettingsState.space_materials_visible)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    spacesSettingsState.space_materials_visible ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      spacesSettingsState.space_materials_visible ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Section Tag</label>
                <input
                  type="text"
                  value={spacesSettingsState.space_materials_tag}
                  onChange={(e) => handleSettingChange('space_materials_tag', e.target.value)}
                  className={inpClass}
                  placeholder="MATERIALS & CRAFTSMANSHIP"
                />
              </div>
              <div>
                <label className={labelClass}>Section Headline</label>
                <input
                  type="text"
                  value={spacesSettingsState.space_materials_heading}
                  onChange={(e) => handleSettingChange('space_materials_heading', e.target.value)}
                  className={inpClass}
                  placeholder="Where design meets precision."
                />
              </div>
            </div>
          </div>

          {/* 4-Step Process Section */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 flex items-center space-x-2">
                  <Layers size={16} className="text-gold" />
                  <span>4-Step Design & Build Process Section</span>
                </h3>
                <p className="font-sans text-xs text-stone-500 mt-0.5">
                  Guides prospective clients through Consultation, 3D Design, Factory Build, and Turnkey Handover.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-sans text-xs text-stone-500 font-bold">Visible:</span>
                <button
                  type="button"
                  onClick={() => handleSettingChange('space_process_visible', !spacesSettingsState.space_process_visible)}
                  className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                    spacesSettingsState.space_process_visible ? 'bg-gold' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      spacesSettingsState.space_process_visible ? 'translate-x-5.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Process Tag</label>
                <input
                  type="text"
                  value={spacesSettingsState.space_process_tag}
                  onChange={(e) => handleSettingChange('space_process_tag', e.target.value)}
                  className={inpClass}
                  placeholder="Turnkey Execution Flow"
                />
              </div>
              <div>
                <label className={labelClass}>Process Heading</label>
                <input
                  type="text"
                  value={spacesSettingsState.space_process_heading}
                  onChange={(e) => handleSettingChange('space_process_heading', e.target.value)}
                  className={inpClass}
                  placeholder="Our 4-Step Design & Build Process"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Process Description</label>
              <textarea
                rows={2}
                value={spacesSettingsState.space_process_desc}
                onChange={(e) => handleSettingChange('space_process_desc', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: BOTTOM CONSULTATION CTA SECTION                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'cta' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs max-w-4xl">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h2 className="font-editorial text-xl font-bold text-stone-900 flex items-center space-x-2">
                <HelpCircle size={18} className="text-gold" />
                <span>Spaces Bottom Consultation CTA Section</span>
              </h2>
              <p className="font-sans text-xs text-stone-500 mt-0.5">
                This high-converting footer banner renders at the base of the <strong className="text-stone-700">/spaces</strong> hub page and across all <strong className="text-stone-700">16 room domain pages</strong>.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-sans text-xs text-stone-500 font-bold">CTA Banner Visible:</span>
              <button
                type="button"
                onClick={() => handleSettingChange('space_cta_visible', !spacesSettingsState.space_cta_visible)}
                className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                  spacesSettingsState.space_cta_visible ? 'bg-gold' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
                    spacesSettingsState.space_cta_visible ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <CTASectionEditor pageKey="spaces" pageTitle="Spaces" />
        </div>
      )}
    </div>
  );
};

export default AdminSpacesCMS;
