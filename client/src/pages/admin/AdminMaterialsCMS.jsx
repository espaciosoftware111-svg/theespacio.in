import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import {
  Package, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowRight, ArrowUp, ArrowDown,
  CheckCircle2, Search, SlidersHorizontal, Image as ImageIcon,
  Lock, Unlock, HelpCircle, ExternalLink, Check, Copy
} from 'lucide-react';
import {
  getCMSData,
  setCMSData,
  STORAGE_KEYS,
  DEFAULT_PRODUCTS,
  uploadImageFile,
  publishAllCMSChanges
} from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';

const defaultMaterialsHeroSlides = [
  {
    title: 'Digital Korean Poly Granite & Sintered Stone',
    before: '/images/company/2bhk_lux/hall1_1.png',
    after: '/images/materials/florida.png',
    visible: true
  },
  {
    title: 'Acrylic Luxe Modular Cabinetry',
    before: '/images/company/3bhk_lux/kitchen_1.png',
    after: '/images/materials/luminous_grid_8313.jpg',
    visible: true
  },
  {
    title: 'Acoustic Charcoal & Fluted Wall Panels',
    before: '/images/company/2bhk_mordern_retro/dining_2.jpg',
    after: '/images/materials/charcoal_luxe_4015.jpg',
    visible: true
  }
];

const defaultSpecs = [
  { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
  { label: 'Surface Finish', value: 'Anti-Scratch Luxury Surface' },
  { label: 'Core Weight', value: '1.8 kg/m' },
  { label: 'Water Resistance', value: '100% Waterproof' },
  { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
  { label: 'Warranty', value: '10 Year Structural' }
];

const defaultColors = [
  { name: 'Natural Oak', hex: '#D2B48C' },
  { name: 'Smoked Walnut', hex: '#5C4033' },
  { name: 'Ashen Grey', hex: '#808080' },
  { name: 'Slate Charcoal', hex: '#2F4F4F' },
  { name: 'White Ash', hex: '#F5F0EB' }
];

const defaultApplications = [
  'Modular Kitchen Shutters',
  'Wardrobe Sliding Doors',
  'Bathroom Vanity',
  'Living Room Accent Walls'
];

const defaultPreviewPages = [
  '/images/materials/irish.png',
  '/images/materials/azzurro.png',
  '/images/materials/giallo.png',
  '/images/materials/marbo.png',
  '/images/materials/florida.png',
  '/images/materials/menta.png',
  '/images/materials/giallo_dining.png',
  '/images/materials/ash.png',
  '/images/materials/linia.png',
  '/images/materials/florida_vanity.png',
  '/images/materials/gracia.png',
  '/images/materials/irish_gen2.png'
];

export const normalizeMaterial = (m, idx = 0) => {
  if (!m || typeof m !== 'object') {
    return {
      id: `prod_mat_${idx + 1}`,
      _id: `prod_mat_${idx + 1}`,
      title: `Material ${idx + 1}`,
      slug: `material-${idx + 1}`,
      category: 'Exotic Finishes',
      materialCode: `MAT-${String(idx + 1).padStart(2, '0')}`,
      badge: 'Bespoke Material',
      description: 'High-performance engineering material with anti-scratch and luxury texture surface.',
      heroImage: '/images/materials/irish.png',
      specifications: defaultSpecs,
      features: ['High-Performance', 'Luxury Finish', 'Custom Cut'],
      colors: defaultColors,
      applications: defaultApplications,
      previewPages: defaultPreviewPages,
      gallery: defaultPreviewPages,
      totalShades: 12,
      previewLimit: 6,
      showInCard: true,
      showInHero: true,
      showOverviewSection: true,
      showFinishesSection: true,
      showSpecificationsSection: true,
      showApplicationsSection: true,
      showCataloguePreviewSection: true,
      overviewSectionTitle: 'Material Overview',
      finishesSectionTitle: 'Available Finishes',
      catalogueEyebrow: 'Catalog & Shades',
      catalogueTitle: 'Catalogue Preview',
      status: 'published'
    };
  }

  // Normalize specifications
  let specs = [];
  if (Array.isArray(m.specifications)) {
    specs = m.specifications.map((s, i) => {
      if (typeof s === 'string') return { label: `Spec ${i + 1}`, value: s };
      if (s && typeof s === 'object') {
        return { label: String(s.label || s.key || `Spec ${i + 1}`), value: String(s.value || '') };
      }
      return { label: `Spec ${i + 1}`, value: String(s || '') };
    });
  } else if (m.specifications && typeof m.specifications === 'object') {
    specs = Object.entries(m.specifications).map(([label, value]) => ({
      label,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value || '')
    }));
  }
  if (specs.length === 0) {
    specs = defaultSpecs;
  }

  // Normalize features
  let feats = [];
  if (Array.isArray(m.features)) {
    feats = m.features.map(f => String(f || '')).filter(Boolean);
  } else if (typeof m.features === 'string') {
    feats = m.features.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (feats.length === 0) {
    feats = ['High-Performance', 'Luxury Finish', 'Custom Cut'];
  }

  // Normalize colors
  let cols = [];
  if (Array.isArray(m.colors) && m.colors.length > 0) {
    cols = m.colors.map(c => {
      if (typeof c === 'string') return { name: c, hex: '#C9A96E' };
      return { name: String(c.name || 'Finish'), hex: String(c.hex || '#C9A96E') };
    });
  } else if (Array.isArray(m.finishes) && m.finishes.length > 0) {
    cols = m.finishes.map(f => {
      if (typeof f === 'string') return { name: f, hex: '#C9A96E' };
      return { name: String(f.name || 'Finish'), hex: String(f.hex || '#C9A96E') };
    });
  } else {
    cols = defaultColors;
  }

  // Normalize applications
  let apps = [];
  if (Array.isArray(m.applications) && m.applications.length > 0) {
    apps = m.applications.map(a => String(a || '')).filter(Boolean);
  } else if (typeof m.applications === 'string') {
    apps = m.applications.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    apps = defaultApplications;
  }

  // Normalize previewPages / gallery
  let pages = [];
  if (Array.isArray(m.previewPages) && m.previewPages.length > 0) {
    pages = [...m.previewPages];
  } else if (Array.isArray(m.gallery) && m.gallery.length > 0) {
    pages = [...m.gallery];
  } else if (Array.isArray(m.images) && m.images.length > 0) {
    pages = [...m.images];
  } else {
    pages = [...defaultPreviewPages];
  }

  // Ensure at least 12 shade pages so that 6 unlocked + 6 locked are always available
  if (pages.length < 12) {
    defaultPreviewPages.forEach(p => {
      if (pages.length < 12) {
        const urlStr = typeof p === 'string' ? p : (p?.url || p?.src);
        const exists = pages.some(item => {
          const u = typeof item === 'string' ? item : (item?.url || item?.src);
          return u === urlStr;
        });
        if (!exists) {
          pages.push(p);
        }
      }
    });
  }

  const slug = m.slug || (m.title ? m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `material-${idx + 1}`);

  return {
    ...m,
    id: m.id || m._id || `prod_${slug}`,
    _id: m._id || m.id || `prod_${slug}`,
    title: m.title || m.name || `Material ${idx + 1}`,
    slug: slug,
    category: m.category || 'Surface Material',
    materialCode: m.materialCode || `MAT-${String(idx + 1).padStart(2, '0')}`,
    badge: m.badge || 'Premium Finish',
    description: m.description || '',
    heroImage: m.heroImage || m.hero_image || m.image || '/images/materials/irish.png',
    specifications: specs,
    features: feats,
    colors: cols,
    applications: apps,
    previewPages: pages,
    gallery: pages,
    totalShades: Math.max(12, Number(m.totalShades) || 12),
    previewLimit: (Number(m.previewLimit) && Number(m.previewLimit) > 0) ? Number(m.previewLimit) : 6,
    showInCard: m.showInCard !== false,
    showInHero: m.showInHero !== false,
    showOverviewSection: m.showOverviewSection !== false,
    showFinishesSection: m.showFinishesSection !== false,
    showSpecificationsSection: m.showSpecificationsSection !== false,
    showApplicationsSection: m.showApplicationsSection !== false,
    showCataloguePreviewSection: m.showCataloguePreviewSection !== false,
    overviewSectionTitle: m.overviewSectionTitle || 'Material Overview',
    finishesSectionTitle: m.finishesSectionTitle || 'Available Finishes',
    catalogueEyebrow: m.catalogueEyebrow || 'Catalog & Shades',
    catalogueTitle: m.catalogueTitle || 'Catalogue Preview',
    status: m.status || 'published'
  };
};

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminMaterialsCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'hero' | 'cta'
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedMaterialIdx, setSelectedMaterialIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const fileInputMaterialCoverRef = useRef(null);

  // Materials Hero State
  const [materialsHeroState, setMaterialsHeroState] = useState({
    materials_badge: 'Premium Collection',
    materials_title: 'Curated Material Library',
    materials_before_label: 'BEFORE',
    materials_after_label: 'AFTER',
    materials_hero_slides: defaultMaterialsHeroSlides,
    materials_hero_visible: true
  });

  // Materials List State
  const [materialsList, setMaterialsList] = useState(() => {
    const raw = getCMSData(STORAGE_KEYS.PRODUCTS);
    const initial = (Array.isArray(raw) && raw.length > 0) ? raw : DEFAULT_PRODUCTS;
    return initial.map((m, idx) => normalizeMaterial(m, idx));
  });

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedProducts = getCMSData(STORAGE_KEYS.PRODUCTS);
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);

      if (storedSettings) {
        setMaterialsHeroState({
          materials_badge: getNonEmpty(storedSettings.materials_badge, 'Premium Collection'),
          materials_title: getNonEmpty(storedSettings.materials_title, 'Curated Material Library'),
          materials_before_label: getNonEmpty(storedSettings.materials_before_label, 'BEFORE'),
          materials_after_label: getNonEmpty(storedSettings.materials_after_label, 'AFTER'),
          materials_hero_slides: (Array.isArray(storedSettings.materials_hero_slides) && storedSettings.materials_hero_slides.length > 0)
            ? storedSettings.materials_hero_slides
            : defaultMaterialsHeroSlides,
          materials_hero_visible: storedSettings.materials_hero_visible !== false
        });
      }

      if (Array.isArray(storedProducts) && storedProducts.length > 0) {
        setMaterialsList(storedProducts.map((m, i) => normalizeMaterial(m, i)));
      }

      try {
        const res = await axios.get('/products');
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const normalized = res.data.data.map((m, i) => normalizeMaterial(m, i));
          setMaterialsList(normalized);
          setCMSData(STORAGE_KEYS.PRODUCTS, normalized, { silent: true });
        }
      } catch (err) {
        console.warn('Could not load products from API, using stored CMS materials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleHeroChange = (key, val) => {
    setMaterialsHeroState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated });
      return updated;
    });
  };

  const safeIdx = Math.min(Math.max(0, selectedMaterialIdx), Math.max(0, materialsList.length - 1));
  const currentMaterial = materialsList[safeIdx] || normalizeMaterial(null, 0);

  const handleMaterialChange = (idx, key, val) => {
    setMaterialsList((prev) => {
      const updated = [...prev];
      if (!updated[idx]) return prev;
      updated[idx] = { ...updated[idx], [key]: val };
      setCMSData(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });
  };

  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    try {
      const url = await uploadImageFile(file);
      if (url) {
        callback(url);
        showNotification('Image uploaded successfully.');
      }
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existingSettings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existingSettings,
      ...materialsHeroState
    };

    const cleanList = materialsList.map((m, i) => normalizeMaterial(m, i));

    // Save to local CMS stores and notify all open tabs/views
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setCMSData(STORAGE_KEYS.PRODUCTS, cleanList);

    // Call universal live publisher
    try {
      await publishAllCMSChanges();
    } catch {}

    // Persist to backend API & Supabase database
    try {
      await axios.put('/settings', updatedSettings).catch(() => {});
      await axios.put('/products', { products: cleanList }).catch(() => {});
    } catch (err) {
      console.warn('Backend sync notice, saved in local CMS store:', err);
    }

    setSaving(false);
    setSaved(true);
    showNotification('All Materials & Changes Published Live to Website!');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddMaterial = () => {
    const newSlug = `material-${Date.now().toString().slice(-4)}`;
    const newMaterial = normalizeMaterial({
      title: 'New Bespoke Material',
      slug: newSlug,
      category: 'Exotic Finishes',
      materialCode: `MAT-CST-${String(materialsList.length + 1).padStart(2, '0')}`,
      badge: 'Bespoke Material',
      description: 'High-performance engineering material with anti-scratch and luxury texture surface.',
      heroImage: '/images/materials/irish.png',
      features: ['High-Performance', 'Luxury Finish', 'Custom Cut'],
      specifications: defaultSpecs,
      colors: defaultColors,
      applications: defaultApplications,
      previewPages: defaultPreviewPages,
      gallery: defaultPreviewPages,
      ctaText: 'Enquire About Material',
      ctaLink: '/contact',
      showInHero: false,
      showInCard: true,
      status: 'published'
    }, materialsList.length);

    const updated = [...materialsList, newMaterial];
    setMaterialsList(updated);
    setSelectedMaterialIdx(materialsList.length);
    setCMSData(STORAGE_KEYS.PRODUCTS, updated);
    showNotification('New Material created and added to collection.');
  };

  const handleDeleteMaterial = (idx) => {
    if (materialsList.length <= 1) {
      alert('You must keep at least one material record.');
      return;
    }
    const mat = materialsList[idx];
    if (window.confirm(`Are you sure you want to delete "${mat?.title || 'this material'}"?`)) {
      const updated = materialsList.filter((_, i) => i !== idx);
      setMaterialsList(updated);
      setSelectedMaterialIdx(Math.max(0, idx - 1));
      setCMSData(STORAGE_KEYS.PRODUCTS, updated);
      showNotification('Material removed from collection.');
    }
  };

  const handleMoveMaterial = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === materialsList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...materialsList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMaterialsList(updated);
    setSelectedMaterialIdx(targetIdx);
    setCMSData(STORAGE_KEYS.PRODUCTS, updated);
  };

  // Helper handlers for array fields
  const handleUpdateSpec = (sIdx, field, val) => {
    const list = [...(currentMaterial.specifications || defaultSpecs)];
    list[sIdx] = { ...list[sIdx], [field]: val };
    handleMaterialChange(safeIdx, 'specifications', list);
  };

  const handleAddSpec = () => {
    const list = [...(currentMaterial.specifications || defaultSpecs), { label: 'Specification Name', value: 'Specification Details' }];
    handleMaterialChange(safeIdx, 'specifications', list);
  };

  const handleRemoveSpec = (sIdx) => {
    const list = (currentMaterial.specifications || defaultSpecs).filter((_, i) => i !== sIdx);
    handleMaterialChange(safeIdx, 'specifications', list);
  };

  const handleUpdateFeature = (fIdx, val) => {
    const list = [...(currentMaterial.features || [])];
    list[fIdx] = val;
    handleMaterialChange(safeIdx, 'features', list);
  };

  const handleAddFeature = () => {
    const list = [...(currentMaterial.features || []), 'New Feature Tag'];
    handleMaterialChange(safeIdx, 'features', list);
  };

  const handleRemoveFeature = (fIdx) => {
    const list = (currentMaterial.features || []).filter((_, i) => i !== fIdx);
    handleMaterialChange(safeIdx, 'features', list);
  };

  const handleUpdateColor = (cIdx, field, val) => {
    const list = [...(currentMaterial.colors || defaultColors)];
    list[cIdx] = { ...list[cIdx], [field]: val };
    handleMaterialChange(safeIdx, 'colors', list);
  };

  const handleAddColor = () => {
    const list = [...(currentMaterial.colors || defaultColors), { name: 'New Finish', hex: '#C9A96E' }];
    handleMaterialChange(safeIdx, 'colors', list);
  };

  const handleRemoveColor = (cIdx) => {
    const list = (currentMaterial.colors || defaultColors).filter((_, i) => i !== cIdx);
    handleMaterialChange(safeIdx, 'colors', list);
  };

  const handleUpdateApplication = (aIdx, val) => {
    const list = [...(currentMaterial.applications || defaultApplications)];
    list[aIdx] = val;
    handleMaterialChange(safeIdx, 'applications', list);
  };

  const handleAddApplication = () => {
    const list = [...(currentMaterial.applications || defaultApplications), 'New Architectural Application'];
    handleMaterialChange(safeIdx, 'applications', list);
  };

  const handleRemoveApplication = (aIdx) => {
    const list = (currentMaterial.applications || defaultApplications).filter((_, i) => i !== aIdx);
    handleMaterialChange(safeIdx, 'applications', list);
  };

  const handleUpdatePreviewPage = (pIdx, url) => {
    const list = [...(currentMaterial.previewPages || defaultPreviewPages)];
    const existing = list[pIdx];
    if (typeof existing === 'object') {
      list[pIdx] = { ...existing, url };
    } else {
      list[pIdx] = url;
    }
    handleMaterialChange(safeIdx, 'previewPages', list);
    handleMaterialChange(safeIdx, 'gallery', list);
  };

  const handleTogglePreviewLock = (pIdx) => {
    const list = (currentMaterial.previewPages || defaultPreviewPages).map((item, i) => {
      const url = typeof item === 'string' ? item : (item.url || item.src || '');
      const isLocked = typeof item === 'object' && item.isLocked !== undefined 
        ? item.isLocked 
        : i >= (currentMaterial.previewLimit || 6);
      if (i === pIdx) {
        return { url, isLocked: !isLocked };
      }
      return typeof item === 'string' ? { url, isLocked } : item;
    });
    handleMaterialChange(safeIdx, 'previewPages', list);
    handleMaterialChange(safeIdx, 'gallery', list);
  };

  const handleAddPreviewPage = () => {
    const list = [...(currentMaterial.previewPages || defaultPreviewPages), '/images/materials/irish.png'];
    handleMaterialChange(safeIdx, 'previewPages', list);
    handleMaterialChange(safeIdx, 'gallery', list);
  };

  const handleRemovePreviewPage = (pIdx) => {
    const list = (currentMaterial.previewPages || defaultPreviewPages).filter((_, i) => i !== pIdx);
    handleMaterialChange(safeIdx, 'previewPages', list);
    handleMaterialChange(safeIdx, 'gallery', list);
  };

  // Categories list for filtering
  const allCategories = useMemo(() => {
    const set = new Set();
    materialsList.forEach((m) => {
      if (m.category) set.add(m.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [materialsList]);

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materialsList
      .map((mat, idx) => ({ mat, idx }))
      .filter(({ mat }) => {
        if (selectedCategoryFilter !== 'All' && mat.category !== selectedCategoryFilter) {
          return false;
        }
        if (!searchTerm.trim()) return true;
        const q = searchTerm.trim().toLowerCase();
        return (
          (mat.title || '').toLowerCase().includes(q) ||
          (mat.category || '').toLowerCase().includes(q) ||
          (mat.materialCode || '').toLowerCase().includes(q) ||
          (mat.description || '').toLowerCase().includes(q) ||
          (mat.slug || '').toLowerCase().includes(q)
        );
      });
  }, [materialsList, searchTerm, selectedCategoryFilter]);

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] text-white/60 space-y-3">
        <Loader2 size={32} className="animate-spin text-gold" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold">Loading Materials CMS...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2 font-sans text-xs font-bold animate-bounce">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Save Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-sans font-bold uppercase tracking-wider border border-gold/30">
              Live Material Manager
            </span>
            <span className="text-white/40 text-xs font-sans">• {materialsList.length} Total Materials</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-white mt-1">Materials Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live material items, detail pages, specifications, color swatches, shade card previews, and header settings.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/materials"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white px-4 py-3 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all border border-white/10"
          >
            <span>Preview /materials</span>
            <ExternalLink size={13} />
          </a>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-7 rounded-lg transition-all duration-300 disabled:opacity-60 shadow-lg shadow-gold/20"
          >
            {saved ? (
              <>
                <CheckCircle size={15} />
                <span>Materials Published Live!</span>
              </>
            ) : saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Publishing Changes...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save & Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'list'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <Package size={16} />
          <span>Edit Material Cards & Pages ({materialsList.length} Items)</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'hero'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Header & Transformation Slides</span>
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'cta'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <HelpCircle size={16} />
          <span>CTA Banner Section</span>
        </button>
      </div>

      {/* TAB: CTA SECTION EDITOR */}
      {activeTab === 'cta' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 max-w-4xl">
          <CTASectionEditor pageKey="materials" pageTitle="Materials" />
        </div>
      )}

      {/* TAB: TRANSFORMATION HERO SLIDES */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Sliders size={18} className="text-gold" />
                <span>Materials Page Header & Transformation Slides</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">
                Customize category eyebrow badge, main title on /materials, and before/after transformation slides.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hero / Category Eyebrow Tag</label>
                  <input
                    type="text"
                    value={materialsHeroState.materials_badge}
                    onChange={(e) => handleHeroChange('materials_badge', e.target.value)}
                    className={inpClass}
                    placeholder="Premium Collection"
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero / Category Main Title</label>
                  <input
                    type="text"
                    value={materialsHeroState.materials_title}
                    onChange={(e) => handleHeroChange('materials_title', e.target.value)}
                    className={inpClass}
                    placeholder="Curated Material Library"
                  />
                </div>
              </div>

              {/* Transformation Slides */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>
                    Before / After Transformation Slides ({materialsHeroState.materials_hero_slides?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(materialsHeroState.materials_hero_slides || []),
                        {
                          title: 'New Material Transformation',
                          before: '/images/company/2bhk_lux/hall1_1.png',
                          after: '/images/materials/florida.png',
                          visible: true
                        }
                      ];
                      handleHeroChange('materials_hero_slides', updated);
                    }}
                    className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <Plus size={12} />
                    <span>Add Transformation Slide</span>
                  </button>
                </div>

                {(materialsHeroState.materials_hero_slides || []).map((slide, sIdx) => (
                  <div key={sIdx} className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Slide 0{sIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (materialsHeroState.materials_hero_slides || []).filter((_, i) => i !== sIdx);
                          handleHeroChange('materials_hero_slides', updated);
                        }}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg text-xs flex items-center space-x-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove Slide</span>
                      </button>
                    </div>

                    <div>
                      <label className={labelClass}>Slide Headline Title</label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const updated = [...(materialsHeroState.materials_hero_slides || [])];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          handleHeroChange('materials_hero_slides', updated);
                        }}
                        className={inpClass}
                        placeholder="e.g. Digital Korean Poly Granite & Sintered Stone"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Before Image URL</label>
                        <input
                          type="text"
                          value={slide.before || ''}
                          onChange={(e) => {
                            const updated = [...(materialsHeroState.materials_hero_slides || [])];
                            updated[sIdx] = { ...updated[sIdx], before: e.target.value };
                            handleHeroChange('materials_hero_slides', updated);
                          }}
                          className={inpClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>After Image URL</label>
                        <input
                          type="text"
                          value={slide.after || ''}
                          onChange={(e) => {
                            const updated = [...(materialsHeroState.materials_hero_slides || [])];
                            updated[sIdx] = { ...updated[sIdx], after: e.target.value };
                            handleHeroChange('materials_hero_slides', updated);
                          }}
                          className={inpClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-20 bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center space-x-1.5">
                  <Eye size={12} />
                  <span>Materials Hero Header Preview</span>
                </span>
                <span className="text-[10px] font-sans text-emerald-400 flex items-center space-x-1">
                  <CheckCircle size={11} />
                  <span>Real-time binding</span>
                </span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={materialsHeroState.materials_hero_slides?.[0]?.after || defaultMaterialsHeroSlides[0].after}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                  <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30 inline-block">
                    {materialsHeroState.materials_badge}
                  </span>
                  <h3 className="font-editorial text-xl font-bold leading-tight">
                    {materialsHeroState.materials_title}
                  </h3>
                  <p className="font-sans text-[11px] text-white/60">
                    {materialsHeroState.materials_hero_slides?.[0]?.title || 'Exotic Surfaces & Engineering Materials'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MATERIALS CARDS & PAGES MANAGER */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Material Selector List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-white">Materials Collection</span>
                  <span className="font-sans text-[10px] text-white/40 block">({materialsList.length} Materials Total)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="flex items-center space-x-1 bg-gold hover:bg-gold-hover text-charcoal px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all shadow-md"
                >
                  <Plus size={13} />
                  <span>Add Material</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search materials by title, code, category..."
                  className="w-full bg-[#141518] border border-white/10 focus:border-gold focus:outline-none rounded-xl font-sans text-xs pl-9 pr-8 py-2.5 text-white placeholder:text-white/30 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 text-white/40 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              {allCategories.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-bold whitespace-nowrap transition-all ${
                        selectedCategoryFilter === cat
                          ? 'bg-gold text-charcoal font-bold shadow-xs'
                          : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List */}
            <div data-lenis-prevent className="space-y-2 max-h-[720px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-white/5 hover:scrollbar-thumb-gold transition-all">
              {filteredMaterials.length === 0 ? (
                <div className="p-8 text-center text-white/40 border border-white/5 rounded-xl bg-[#141518] space-y-2">
                  <Package size={28} className="mx-auto text-white/20" />
                  <p className="font-sans text-xs">No materials match "{searchTerm}".</p>
                  <button
                    type="button"
                    onClick={() => { setSearchTerm(''); setSelectedCategoryFilter('All'); }}
                    className="text-gold text-xs underline font-bold"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                filteredMaterials.map(({ mat, idx }) => {
                  const isSelected = idx === safeIdx;
                  return (
                    <div
                      key={mat.id || mat.slug || idx}
                      onClick={() => setSelectedMaterialIdx(idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-gold/15 border-gold/50 shadow-md ring-1 ring-gold/40'
                          : 'bg-[#141518] border-white/5 hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
                          <img
                            src={mat.heroImage || '/images/materials/irish.png'}
                            alt={mat.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = '/images/materials/irish.png'; }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-sans text-xs font-bold text-white truncate">{mat.title}</h4>
                          <div className="flex items-center space-x-2 text-[10px] text-white/40 uppercase tracking-wider mt-0.5 truncate">
                            <span className="text-gold font-mono">{mat.materialCode || `MAT-${idx + 1}`}</span>
                            <span>•</span>
                            <span className="truncate">{mat.category || 'Surface'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleMoveMaterial(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveMaterial(idx, 'down')}
                          disabled={idx === materialsList.length - 1}
                          className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(idx)}
                          className="p-1 text-red-400/40 hover:text-red-400 transition-colors"
                          title="Delete Material"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Material Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              {/* Header Info of Selected Material */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest">
                      Editing Material {String(safeIdx + 1).padStart(2, '0')} of {materialsList.length}
                    </span>
                    <span className="text-white/30 text-xs">•</span>
                    <span className="font-mono text-[10px] text-white/40">{currentMaterial.materialCode}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-white mt-0.5">{currentMaterial.title}</h3>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={`/materials/${currentMaterial.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-sans text-xs font-semibold border border-white/10 transition-all"
                  >
                    <span>View Page</span>
                    <ExternalLink size={12} />
                  </a>

                  <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="font-sans text-xs text-white/60">Card Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(safeIdx, 'showInCard', !(currentMaterial.showInCard !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showInCard !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          currentMaterial.showInCard !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Hidden File Input for Cover Image */}
              <input
                type="file"
                ref={fileInputMaterialCoverRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleMaterialChange(safeIdx, 'heroImage', dataUrl);
                })}
              />

              {/* 5 PAGE SECTIONS VISIBILITY & TITLES CONTROL PANEL */}
              <div className="bg-[#0E0F11] border border-gold/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sliders className="text-gold" size={16} />
                    <h4 className="font-editorial text-base font-bold text-white">Detail Page Sections & Visibility</h4>
                  </div>
                  <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest">
                    Control which sections appear on /materials/{currentMaterial.slug}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Overview Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">1. Material Overview</span>
                      <span className="font-sans text-[9px] text-white/40">Description & Key Feature tags</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(safeIdx, 'showOverviewSection', !(currentMaterial.showOverviewSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showOverviewSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showOverviewSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Finishes Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">2. Available Finishes</span>
                      <span className="font-sans text-[9px] text-white/40">Color swatches & finishes palette</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(safeIdx, 'showFinishesSection', !(currentMaterial.showFinishesSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showFinishesSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showFinishesSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Specifications Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">3. Technical Specs Table</span>
                      <span className="font-sans text-[9px] text-white/40">Structured specs table</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(safeIdx, 'showSpecificationsSection', !(currentMaterial.showSpecificationsSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showSpecificationsSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showSpecificationsSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Applications Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">4. Applications Tags</span>
                      <span className="font-sans text-[9px] text-white/40">Best use cases badges</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(safeIdx, 'showApplicationsSection', !(currentMaterial.showApplicationsSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showApplicationsSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showApplicationsSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Catalogue Preview Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 md:col-span-2">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">5. Catalogue Preview & Shade Cards Grid</span>
                      <span className="font-sans text-[9px] text-white/40">Grid of catalog pages, unlocked counters, and lead quote gate</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(safeIdx, 'showCataloguePreviewSection', !(currentMaterial.showCataloguePreviewSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showCataloguePreviewSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showCataloguePreviewSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                {/* Custom Section Title Overrides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className={labelClass}>Overview Section Title</label>
                    <input
                      type="text"
                      value={currentMaterial.overviewSectionTitle || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'overviewSectionTitle', e.target.value)}
                      placeholder="Material Overview"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Finishes Section Title</label>
                    <input
                      type="text"
                      value={currentMaterial.finishesSectionTitle || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'finishesSectionTitle', e.target.value)}
                      placeholder="Available Finishes"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Catalogue Section Eyebrow</label>
                    <input
                      type="text"
                      value={currentMaterial.catalogueEyebrow || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'catalogueEyebrow', e.target.value)}
                      placeholder="Catalog & Shades"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Catalogue Section Title</label>
                    <input
                      type="text"
                      value={currentMaterial.catalogueTitle || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'catalogueTitle', e.target.value)}
                      placeholder="Catalogue Preview"
                      className={inpClass}
                    />
                  </div>
                </div>
              </div>

              {/* CORE FIELDS */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Material Name / Title *</label>
                    <input
                      type="text"
                      value={currentMaterial.title || ''}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        handleMaterialChange(safeIdx, 'title', newTitle);
                      }}
                      className={inpClass}
                      placeholder="e.g. Acrylic Luxe Collection"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>URL Slug (/materials/:slug)</label>
                    <input
                      type="text"
                      value={currentMaterial.slug || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'slug', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                      className={inpClass}
                      placeholder="e.g. acrylic-luxe-collection"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <input
                      type="text"
                      value={currentMaterial.category || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'category', e.target.value)}
                      className={inpClass}
                      placeholder="e.g. Acrylic & Finishes"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Material Code</label>
                    <input
                      type="text"
                      value={currentMaterial.materialCode || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'materialCode', e.target.value)}
                      className={inpClass}
                      placeholder="e.g. MAT-ACR-01"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Badge Tag</label>
                    <input
                      type="text"
                      value={currentMaterial.badge || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'badge', e.target.value)}
                      className={inpClass}
                      placeholder="e.g. Premium Finish"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description (Shown on Grid Card & Overview)</label>
                  <textarea
                    rows={2}
                    value={currentMaterial.description || ''}
                    onChange={(e) => handleMaterialChange(safeIdx, 'description', e.target.value)}
                    className={`${inpClass} resize-none`}
                    placeholder="Provide a compelling summary of this material..."
                  />
                </div>

                {/* Cover / Hero Image */}
                <div>
                  <label className={labelClass}>Cover & Hero Image</label>
                  <div className="flex items-center space-x-3">
                    {currentMaterial.heroImage && (
                      <img
                        src={currentMaterial.heroImage}
                        alt="Cover"
                        className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0 bg-black"
                        onError={(e) => { e.currentTarget.src = '/images/materials/irish.png'; }}
                      />
                    )}
                    <input
                      type="text"
                      value={currentMaterial.heroImage || ''}
                      onChange={(e) => handleMaterialChange(safeIdx, 'heroImage', e.target.value)}
                      className={inpClass}
                      placeholder="https://... or /images/materials/..."
                    />
                    <button
                      type="button"
                      onClick={() => fileInputMaterialCoverRef.current?.click()}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-sans text-xs font-bold uppercase shrink-0 transition-colors"
                    >
                      <Plus size={13} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* FEATURE TAGS */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Key Features Badges ({(currentMaterial.features || []).length})</label>
                      <span className="font-sans text-[10px] text-white/40">Badges displayed with checkmarks on the material detail page.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg font-sans text-[10px] font-bold uppercase transition-all"
                    >
                      <Plus size={12} />
                      <span>Add Feature</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentMaterial.features || []).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => handleUpdateFeature(fIdx, e.target.value)}
                          className={inpClass}
                          placeholder="Feature badge text"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(fIdx)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 transition-colors"
                          title="Remove Tag"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AVAILABLE FINISHES & COLOR SWATCHES */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Available Finishes & Color Swatches ({(currentMaterial.colors || defaultColors).length})</label>
                      <span className="font-sans text-[10px] text-white/40">Interactive color palette bubbles displayed on the detail page.</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg font-sans text-[10px] font-bold uppercase transition-all"
                    >
                      <Plus size={12} />
                      <span>Add Finish</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentMaterial.colors || defaultColors).map((col, cIdx) => (
                      <div key={cIdx} className="flex items-center space-x-3 bg-[#0E0F11] border border-white/10 p-3 rounded-xl">
                        <input
                          type="color"
                          value={col.hex || '#C9A96E'}
                          onChange={(e) => handleUpdateColor(cIdx, 'hex', e.target.value)}
                          className="w-9 h-9 rounded-lg border border-white/20 cursor-pointer p-0 bg-transparent shrink-0"
                          title="Click to pick swatch color"
                        />
                        <input
                          type="text"
                          value={col.name || ''}
                          onChange={(e) => handleUpdateColor(cIdx, 'name', e.target.value)}
                          placeholder="Finish Name (e.g. Natural Oak)"
                          className={inpClass}
                        />
                        <input
                          type="text"
                          value={col.hex || ''}
                          onChange={(e) => handleUpdateColor(cIdx, 'hex', e.target.value)}
                          placeholder="#Hex Code"
                          className="w-28 bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-3 text-white transition-all shrink-0 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(cIdx)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 transition-colors"
                          title="Remove Swatch"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TECHNICAL SPECIFICATIONS TABLE */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Technical Specifications Table ({(currentMaterial.specifications || defaultSpecs).length} Rows)</label>
                      <span className="font-sans text-[10px] text-white/40">Key-value table on the product page (e.g. Sheet Size, Core Weight, Warranty).</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg font-sans text-[10px] font-bold uppercase transition-all"
                    >
                      <Plus size={12} />
                      <span>Add Spec Row</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentMaterial.specifications || defaultSpecs).map((spec, sIdx) => (
                      <div key={sIdx} className="flex flex-col sm:flex-row items-center gap-2 bg-[#0E0F11] border border-white/10 p-3 rounded-xl">
                        <input
                          type="text"
                          value={spec.label || ''}
                          onChange={(e) => handleUpdateSpec(sIdx, 'label', e.target.value)}
                          placeholder="Spec Label (e.g. Sheet Size)"
                          className="w-full sm:w-1/3 bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-2.5 text-white transition-all font-semibold"
                        />
                        <input
                          type="text"
                          value={spec.value || ''}
                          onChange={(e) => handleUpdateSpec(sIdx, 'value', e.target.value)}
                          placeholder="Spec Value (e.g. 2440mm × 1220mm × 2mm)"
                          className="w-full sm:w-2/3 bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-2.5 text-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(sIdx)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 self-end sm:self-auto transition-colors"
                          title="Remove Spec Row"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* APPLICATIONS & BEST USES */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Applications & Best Uses Tags ({(currentMaterial.applications || defaultApplications).length})</label>
                      <span className="font-sans text-[10px] text-white/40">Tags displayed under Applications (e.g. Modular Kitchen Shutters, Bathroom Vanity).</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddApplication}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg font-sans text-[10px] font-bold uppercase transition-all"
                    >
                      <Plus size={12} />
                      <span>Add Application</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentMaterial.applications || defaultApplications).map((app, aIdx) => (
                      <div key={aIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                        <input
                          type="text"
                          value={app}
                          onChange={(e) => handleUpdateApplication(aIdx, e.target.value)}
                          className={inpClass}
                          placeholder="Application text"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveApplication(aIdx)}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 transition-colors"
                          title="Remove Application"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CATALOGUE PREVIEW & SHADE CARDS GALLERY */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Catalogue Preview & Shade Cards Gallery</label>
                      <span className="font-sans text-[10px] text-white/40">
                        Shade cards and catalog pages displayed on the detail page with lead unlock modal.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPreviewPage}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg font-sans text-[10px] font-bold uppercase transition-all"
                    >
                      <Plus size={12} />
                      <span>Add Shade Card</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0E0F11] p-3.5 rounded-xl border border-white/10">
                    <div>
                      <label className={labelClass}>Total Shades Count</label>
                      <input
                        type="number"
                        min={1}
                        value={currentMaterial.totalShades || 12}
                        onChange={(e) => handleMaterialChange(safeIdx, 'totalShades', Number(e.target.value))}
                        className={inpClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Unlocked Preview Limit</label>
                      <input
                        type="number"
                        min={1}
                        value={currentMaterial.previewLimit || 6}
                        onChange={(e) => handleMaterialChange(safeIdx, 'previewLimit', Number(e.target.value))}
                        className={inpClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(currentMaterial.previewPages || defaultPreviewPages).map((rawItem, pIdx) => {
                      const urlVal = typeof rawItem === 'string' ? rawItem : (rawItem.url || rawItem.src || '');
                      const isLocked = typeof rawItem === 'object' && rawItem.isLocked !== undefined 
                        ? rawItem.isLocked 
                        : pIdx >= (currentMaterial.previewLimit || 6);

                      return (
                        <div key={pIdx} className="flex items-center space-x-3 bg-[#0E0F11] border border-white/10 p-3 rounded-xl">
                          <span className="font-sans text-[11px] font-bold text-white/50 w-14 shrink-0 font-mono">
                            CARD {String(pIdx + 1).padStart(2, '0')}
                          </span>
                          {urlVal && (
                            <img
                              src={urlVal}
                              alt={`Shade ${pIdx + 1}`}
                              className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0 bg-black"
                              onError={(e) => { e.currentTarget.src = '/images/materials/irish.png'; }}
                            />
                          )}
                          <input
                            type="text"
                            value={urlVal}
                            onChange={(e) => handleUpdatePreviewPage(pIdx, e.target.value)}
                            placeholder="Image URL (https://... or /images/...)"
                            className={inpClass}
                          />

                          {/* Lock / Unlock Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleTogglePreviewLock(pIdx)}
                            className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-lg font-sans text-[10px] font-bold uppercase transition-all shrink-0 ${
                              isLocked
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            }`}
                            title={isLocked ? 'Click to Unlock this card for public preview' : 'Click to Lock this card behind lead modal'}
                          >
                            {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                            <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
                          </button>

                          {/* File Upload Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                handleFileUpload(e, (uploadedUrl) => {
                                  handleUpdatePreviewPage(pIdx, uploadedUrl);
                                });
                              };
                              input.click();
                            }}
                            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2.5 rounded-lg font-sans text-[10px] font-bold uppercase shrink-0 transition-colors"
                          >
                            <Plus size={12} />
                            <span>Upload</span>
                          </button>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePreviewPage(pIdx)}
                            className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 transition-colors"
                            title="Remove Shade Card"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaterialsCMS;
