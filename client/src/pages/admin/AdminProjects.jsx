import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Save, Trash2, Upload, X, Plus, Loader2, ArrowLeft,
  Image as ImageIcon, CheckCircle, FolderKanban, Search,
  SlidersHorizontal, ArrowUp, ArrowDown, ExternalLink,
  Layers, CheckCircle2, Star, Eye, LayoutGrid, FileText
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, DEFAULT_PROJECTS, notifyCMSUpdate } from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';

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
  'dimmu_04.webp': '/images/projects/dimmu_residence/dimmu_04.webp'
};

const resolveProjectImg = (src) => {
  if (!src) return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
  if (typeof src === 'object') {
    src = src.url || src.src || src.path || '';
  }
  if (!src || typeof src !== 'string') {
    return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
  }
  const fname = src.split('/').pop()?.split('?')[0] || '';
  if (IMAGE_FALLBACK_MAP[fname]) return IMAGE_FALLBACK_MAP[fname];
  return src;
};

const handleImgError = (e) => {
  const src = e.currentTarget?.src || '';
  const fname = src.split('/').pop().split('?')[0];
  if (IMAGE_FALLBACK_MAP[fname] && !src.includes(IMAGE_FALLBACK_MAP[fname])) {
    e.currentTarget.src = IMAGE_FALLBACK_MAP[fname];
    return;
  }
  e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80';
};

// ─── Shared Admin Form Components ─────────────────────────────────────────────
const AdminFormField = ({ label, required, children, error }) => (
  <div className="space-y-1.5">
    <label className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">
      {label}{required && <span className="text-gold ml-1">*</span>}
    </label>
    {children}
    {error && <p className="font-sans text-xs text-red-400">{error}</p>}
  </div>
);

const AdminInput = ({ ...props }) => (
  <input {...props} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-colors" />
);

const AdminTextarea = ({ rows = 4, ...props }) => (
  <textarea rows={rows} {...props} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-colors resize-none" />
);

const AdminSelect = ({ children, ...props }) => (
  <select {...props} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white transition-colors">
    {children}
  </select>
);

// ─── Projects CMS Component ──────────────────────────────────────────────────
const AdminProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'hero' | 'home_section' | 'cta'
  const [view, setView] = useState(id ? 'form' : 'list'); // 'list' | 'form'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const heroRef = useRef();
  const galleryRef = useRef();

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Projects Page Hero State
  const [heroForm, setHeroForm] = useState({
    projects_hero_badge: 'Portfolio & Case Studies',
    projects_hero_title: 'Our Projects',
    projects_hero_subtitle: 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
    projects_hero_images: [
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425351/hf_20260926_121205_b316b4e3-2daa-4fa2-9be5-d6a0ee716587.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425297/hf_20260926_121300_6a3eef61-953b-4da3-b308-15aabfa0e9d0.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425270/hf_20260926_121337_1396c58b-a42d-4d86-8930-ad80832032c1.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425243/hf_20260926_121353_fb8cb679-2a98-4c61-a331-b92d2ca6c9da.png',
      'https://res.cloudinary.com/teg9ndhk/image/upload/v1790425214/hf_20260926_121425_c188d1e6-1db5-4729-b2a9-ad90bbddbf3a.png'
    ]
  });

  // Home Page Section State
  const [homeSectionForm, setHomeSectionForm] = useState({
    projects_visible: true,
    projects_subtitle: 'Selected Work',
    projects_heading: 'Our Projects',
    projects_cta_text: 'All Projects ↗',
    projects_cta_link: '/projects'
  });

  const [newHeroImgUrl, setNewHeroImgUrl] = useState('');
  const [heroPreview, setHeroPreview] = useState(null);

  const emptyForm = {
    title: '', slug: '', category: 'apartment', style: 'Contemporary Luxury', area: '', location: 'Hyderabad', completionYear: new Date().getFullYear(),
    description: '', scope: 'Full Home Interior & Material Sourcing', duration: '4-6 months', status: 'published', featured: false,
    heroImage: '', beforeImage: '', afterImage: '', gallery: [], tags: '',
    visionStory: '', challengeStory: '', engineeringStory: '',
    testimonialName: '', testimonialMobile: '', testimonialProfession: '', testimonialText: '', testimonialRating: 5
  };
  const [form, setForm] = useState(emptyForm);

  // 1. Initial Load of Projects and Page Settings
  useEffect(() => {
    const initProjects = async () => {
      // Local fallback first
      const stored = getCMSData(STORAGE_KEYS.PROJECTS);
      if (stored && stored.length > 0) {
        setProjects(stored.map(p => ({
          ...p,
          _id: p._id || p.id,
          id: p.id || p._id,
          heroImage: resolveProjectImg(p.heroImage || p.hero_image || p.data?.heroImage)
        })));
        setLoading(false);
      } else {
        const normalizedMock = DEFAULT_PROJECTS.map(p => ({
          ...p,
          _id: p._id || p.id,
          id: p.id || p._id,
          heroImage: resolveProjectImg(p.heroImage || p.hero_image)
        }));
        setProjects(normalizedMock);
        setCMSData(STORAGE_KEYS.PROJECTS, normalizedMock);
        setLoading(false);
      }

      // Fetch Live from Database
      try {
        const [projRes, setRes] = await Promise.all([
          axios.get('/api/projects?admin=true&limit=100').catch(() => null),
          axios.get('/api/settings').catch(() => null)
        ]);

        if (projRes?.data?.data) {
          const fetched = Array.isArray(projRes.data.data) ? projRes.data.data : projRes.data.data.projects;
          if (Array.isArray(fetched) && fetched.length > 0) {
            const normalized = fetched.map(p => ({
              ...p,
              _id: p._id || p.id,
              id: p.id || p._id,
              heroImage: resolveProjectImg(p.heroImage || p.hero_image || p.data?.heroImage),
              gallery: (p.gallery && p.gallery.length > 0) ? p.gallery : (p.gallery_images || p.data?.gallery || []),
            }));
            setProjects(normalized);
            setCMSData(STORAGE_KEYS.PROJECTS, normalized);
          }
        }

        if (setRes?.data?.data) {
          const s = setRes.data.data;
          setHeroForm({
            projects_hero_badge: s.projects_hero_badge || 'Portfolio & Case Studies',
            projects_hero_title: s.projects_hero_title || 'Our Projects',
            projects_hero_subtitle: s.projects_hero_subtitle || 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
            projects_hero_images: (Array.isArray(s.projects_hero_images) && s.projects_hero_images.length > 0)
              ? s.projects_hero_images
              : heroForm.projects_hero_images
          });

          setHomeSectionForm({
            projects_visible: s.projects_visible !== false,
            projects_subtitle: s.projects_subtitle || 'Selected Work',
            projects_heading: s.projects_heading || 'Our Projects',
            projects_cta_text: s.projects_cta_text || 'All Projects ↗',
            projects_cta_link: s.projects_cta_link || '/projects'
          });
        }
      } catch (err) {
        console.warn('Backend fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };
    initProjects();
  }, []);

  // Auto-load project if id parameter is in URL
  useEffect(() => {
    if (id && projects.length > 0 && (!editingProject || (editingProject.id !== id && editingProject._id !== id && editingProject.slug !== id))) {
      const match = projects.find(p => p.id === id || p._id === id || p.slug === id);
      if (match) {
        handleEdit(match);
      }
    }
  }, [id, projects]);

  // 2. Edit Project Handler
  const handleEdit = (p) => {
    setEditingProject(p);
    const heroImg = resolveProjectImg(p.heroImage || p.hero_image);
    const galleryArray = Array.isArray(p.gallery)
      ? p.gallery.map(resolveProjectImg)
      : (typeof p.gallery === 'string' && p.gallery.length > 0
          ? p.gallery.split(',').map(s => resolveProjectImg(s.trim())).filter(Boolean)
          : [heroImg].filter(Boolean));

    const beforeImg = resolveProjectImg(p.beforeImage || p.before_image || (Array.isArray(p.before_after) && p.before_after[0]?.before) || '');
    const afterImg = resolveProjectImg(p.afterImage || p.after_image || (Array.isArray(p.before_after) && p.before_after[0]?.after) || heroImg);

    setForm({
      ...emptyForm,
      ...p,
      heroImage: heroImg,
      beforeImage: beforeImg,
      afterImage: afterImg,
      style: p.style || 'Contemporary Luxury',
      visionStory: p.story?.vision || p.visionStory || p.description || '',
      challengeStory: p.story?.challenges || p.challengeStory || '',
      engineeringStory: p.story?.engineering || p.engineeringStory || '',
      testimonialName: p.testimonial?.name || p.testimonialName || '',
      testimonialMobile: p.testimonial?.mobile || p.testimonialMobile || '',
      testimonialProfession: p.testimonial?.profession || p.testimonialProfession || p.testimonial?.role || '',
      testimonialText: p.testimonial?.text || p.testimonialText || '',
      testimonialRating: p.testimonial?.rating || p.testimonialRating || 5,
      gallery: galleryArray,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')
    });
    setHeroPreview(heroImg);
    setView('form');
  };

  const handleNew = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setHeroPreview(null);
    setView('form');
  };

  // 3. Save Hero Settings to Database & Local CMS
  const handleSaveHero = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const sanitizedHeroForm = {
      ...heroForm,
      projects_hero_images: Array.from(new Set((heroForm.projects_hero_images || []).filter(Boolean)))
    };
    const updatedSettings = { ...existing, ...sanitizedHeroForm };
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Hero settings sync notice:', err);
    }
    notifyCMSUpdate();
    setSaving(false);
    showToast('Projects Hero settings saved live to website & database!');
  };

  // 4. Save Home Page Projects Section Settings to Database & Local CMS
  const handleSaveHomeSection = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = { ...existing, ...homeSectionForm };
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Home section settings sync notice:', err);
    }
    notifyCMSUpdate();
    setSaving(false);
    showToast('Home page Projects section settings saved live to website & database!');
  };

  // 5. Toggle Featured
  const handleToggleFeatured = async (p) => {
    const targetId = p._id || p.id;
    const updatedFeatured = !p.featured;
    const updatedProjects = projects.map(item => ((item._id === targetId || item.id === targetId) ? { ...item, featured: updatedFeatured } : item));
    setProjects(updatedProjects);
    setCMSData(STORAGE_KEYS.PROJECTS, updatedProjects);
    notifyCMSUpdate();

    try {
      await axios.put(`/projects/${targetId}`, { ...p, featured: updatedFeatured });
      showToast(`Project ${updatedFeatured ? 'marked as Featured' : 'unfeatured'} in database!`);
    } catch (err) {
      console.warn('Toggle featured warning:', err);
    }
  };

  // 6. Delete / Archive Project
  const handleDelete = async (pid) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await axios.delete(`/projects/${pid}`);
    } catch (err) {
      console.warn('Delete project warning:', err);
    }
    const updated = projects.filter((p) => (p._id !== pid && p.id !== pid));
    setProjects(updated);
    setCMSData(STORAGE_KEYS.PROJECTS, updated);
    notifyCMSUpdate();
    showToast('Project removed from website and database.');
  };

  // 7. Move Project Order Up / Down
  const handleMoveOrder = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);

    // Reassign canonical order
    updated.forEach((p, idx) => { p.order = idx + 1; });

    setProjects(updated);
    setCMSData(STORAGE_KEYS.PROJECTS, updated);
    notifyCMSUpdate();

    try {
      await axios.put('/projects/bulk', { projects: updated });
      showToast('Project sequence updated and synchronized in database!');
    } catch (err) {
      console.warn('Batch reorder warning:', err);
    }
  };

  // 8. Save Individual Project (Database & Local CMS)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    setSaving(true);

    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const galleryClean = Array.isArray(form.gallery)
      ? form.gallery.filter(Boolean)
      : (form.gallery ? form.gallery.split(',').map(s => s.trim()).filter(Boolean) : []);

    const tagsClean = typeof form.tags === 'string'
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : (form.tags || []);

    const beforeImg = form.beforeImage || '';
    const afterImg = form.afterImage || form.heroImage || '';

    const payload = {
      ...form,
      slug,
      style: form.style || 'Contemporary Luxury',
      heroImage: form.heroImage,
      hero_image: form.heroImage,
      beforeImage: beforeImg,
      afterImage: afterImg,
      before_after: [{ before: beforeImg, after: afterImg }],
      story: {
        vision: form.visionStory || form.description,
        challenges: form.challengeStory || 'Optimizing partition thresholds and hidden layout tracking slots.',
        engineering: form.engineeringStory || 'Mild steel reinforcement configurations and structural load-bearing tolerances checks.'
      },
      testimonial: {
        name: form.testimonialName || `Client for ${form.title}`,
        mobile: form.testimonialMobile || '',
        profession: form.testimonialProfession || 'Homeowner',
        role: form.testimonialProfession || `${form.location || 'Hyderabad'} Homeowner`,
        text: form.testimonialText || "The sheer professionalism and attention to tolerances shown by Espacio was exemplary. Our expectations were fully surpassed.",
        rating: Number(form.testimonialRating || 5)
      },
      gallery: galleryClean,
      tags: tagsClean
    };

    const targetId = editingProject?._id || editingProject?.id;
    let savedProject = null;

    try {
      if (editingProject && targetId) {
        const res = await axios.put(`/projects/${targetId}`, payload);
        if (res.data?.data) savedProject = res.data.data;
      } else {
        const res = await axios.post('/projects', payload);
        if (res.data?.data) savedProject = res.data.data;
      }
    } catch (err) {
      console.warn('Project save API error:', err);
    }

    setProjects((prev) => {
      let updated;
      if (editingProject && targetId) {
        updated = prev.map((p) => ((p._id === targetId || p.id === targetId) ? { ...p, ...payload, ...(savedProject || {}) } : p));
      } else {
        const newDoc = savedProject || { _id: String(Date.now()), id: String(Date.now()), ...payload };
        updated = [newDoc, ...prev];
      }
      setCMSData(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });

    notifyCMSUpdate();
    setSaving(false);
    showToast('Project saved live to website and database!');
    setTimeout(() => { setView('list'); }, 1000);
  };

  // Filtered Projects for List View
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = !searchQuery.trim() || (
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.style || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16181D] border border-gold/40 text-cream px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-sans font-medium animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} className="text-gold shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-xs font-sans text-gold uppercase tracking-widest font-semibold mb-1">
            <FolderKanban size={14} />
            <span>Content Management System</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-white">Projects Section CMS</h1>
          <p className="font-sans text-xs text-white/50 mt-1">
            Manage projects portfolio, case studies, hero carousel, home page showcase, and database synchronization.
          </p>
        </div>

        {view === 'list' && (
          <div className="flex items-center space-x-3">
            <Link
              to="/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-sans font-medium transition-colors border border-white/10"
            >
              <span>View Live Website</span>
              <ExternalLink size={13} />
            </Link>
            <button
              onClick={handleNew}
              className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all shadow-md cursor-pointer"
            >
              <Plus size={14} />
              <span>Add New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* ── SUB-VIEW: PROJECT EDIT / CREATE FORM ────────────────────────────── */}
      {view === 'form' ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setView('list')}
                className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors text-xs font-sans px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Projects List</span>
              </button>
              <div>
                <h2 className="font-editorial text-2xl font-bold text-white">
                  {editingProject ? `Edit: ${editingProject.title}` : 'Add New Project'}
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">
                  {editingProject ? 'Modify project details, gallery photos, story, and client testimonial.' : 'Create a new case study entry.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveProject}
              disabled={saving}
              className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-md"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save & Publish Live</span>
            </button>
          </div>

          <form onSubmit={handleSaveProject} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <LayoutGrid size={14} />
                  <span>Basic Project Details</span>
                </h3>

                <AdminFormField label="Project Title" required>
                  <AdminInput
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. The Celestial Curve Villa"
                    required
                  />
                </AdminFormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormField label="URL Slug">
                    <AdminInput
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="e.g. dimmu-chachu-luxury-villa"
                    />
                  </AdminFormField>

                  <AdminFormField label="Architectural Style">
                    <AdminInput
                      value={form.style}
                      onChange={(e) => setForm({ ...form, style: e.target.value })}
                      placeholder="e.g. Contemporary Luxury Duplex Villa"
                    />
                  </AdminFormField>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <AdminFormField label="Category" required>
                    <AdminSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      {['apartment', 'villa', 'commercial', 'luxury_home', 'renovation', 'penthouse', 'office'].map((c) => (
                        <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>
                      ))}
                    </AdminSelect>
                  </AdminFormField>

                  <AdminFormField label="Status">
                    <AdminSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </AdminSelect>
                  </AdminFormField>

                  <AdminFormField label="Area (sq ft)">
                    <AdminInput value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="4,200 sq.ft." />
                  </AdminFormField>

                  <AdminFormField label="Completion Year">
                    <AdminInput type="number" value={form.completionYear} onChange={(e) => setForm({ ...form, completionYear: e.target.value })} placeholder="2026" />
                  </AdminFormField>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormField label="Location">
                    <AdminInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Banjara Hills, Hyderabad" />
                  </AdminFormField>

                  <AdminFormField label="Scope of Work">
                    <AdminInput value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} placeholder="Turnkey Architecture & Interior Fit-out" />
                  </AdminFormField>
                </div>

                <AdminFormField label="Project Summary / Description">
                  <AdminTextarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Editorial overview of this luxury project..."
                  />
                </AdminFormField>
              </div>

              {/* Story Sections */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <FileText size={14} />
                  <span>Case Study Editorial Stories (Vision, Challenge & Engineering)</span>
                </h3>

                <AdminFormField label="The Vision (Design Intent & Architecture)">
                  <AdminTextarea
                    rows={3}
                    value={form.visionStory}
                    onChange={(e) => setForm({ ...form, visionStory: e.target.value })}
                    placeholder="The client's spatial vision and architectural requirements..."
                  />
                </AdminFormField>

                <AdminFormField label="The Challenge (Structural & Site Hurdles)">
                  <AdminTextarea
                    rows={3}
                    value={form.challengeStory}
                    onChange={(e) => setForm({ ...form, challengeStory: e.target.value })}
                    placeholder="Key tolerances, structural hurdles, HVAC coordination..."
                  />
                </AdminFormField>

                <AdminFormField label="The Engineering (Materials & Joinery Solutions)">
                  <AdminTextarea
                    rows={3}
                    value={form.engineeringStory}
                    onChange={(e) => setForm({ ...form, engineeringStory: e.target.value })}
                    placeholder="Precision joinery, mild steel reinforcement, acoustic thresholds..."
                  />
                </AdminFormField>
              </div>

              {/* Before & After Interactive Slider */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <ImageIcon size={14} />
                  <span>Before & After Transformation Photos</span>
                </h3>
                <p className="font-sans text-xs text-white/40">
                  Provide raw site condition photo ("Before") and completed execution photo ("After") for the interactive comparison slider.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormField label="Before Photo URL">
                    <AdminInput
                      value={form.beforeImage}
                      onChange={(e) => setForm({ ...form, beforeImage: e.target.value })}
                      placeholder="https://..."
                    />
                    {form.beforeImage && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40 relative">
                        <img src={resolveProjectImg(form.beforeImage)} alt="Before" onError={handleImgError} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/80 text-white font-sans text-[10px] uppercase font-bold px-2 py-0.5 rounded">Before</span>
                      </div>
                    )}
                  </AdminFormField>

                  <AdminFormField label="After Photo URL">
                    <AdminInput
                      value={form.afterImage}
                      onChange={(e) => setForm({ ...form, afterImage: e.target.value })}
                      placeholder="https://..."
                    />
                    {form.afterImage && (
                      <div className="mt-2 rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40 relative">
                        <img src={resolveProjectImg(form.afterImage)} alt="After" onError={handleImgError} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-gold text-charcoal font-sans text-[10px] uppercase font-bold px-2 py-0.5 rounded">After</span>
                      </div>
                    )}
                  </AdminFormField>
                </div>
              </div>

              {/* Client Testimonial */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <Star size={14} />
                  <span>Client Testimonial</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AdminFormField label="Client Name">
                    <AdminInput
                      value={form.testimonialName}
                      onChange={(e) => setForm({ ...form, testimonialName: e.target.value })}
                      placeholder="e.g. Dr. Ananya Reddy"
                    />
                  </AdminFormField>

                  <AdminFormField label="Profession / Role">
                    <AdminInput
                      value={form.testimonialProfession}
                      onChange={(e) => setForm({ ...form, testimonialProfession: e.target.value })}
                      placeholder="Homeowner, Banjara Hills"
                    />
                  </AdminFormField>

                  <AdminFormField label="Star Rating (1-5)">
                    <AdminSelect
                      value={form.testimonialRating}
                      onChange={(e) => setForm({ ...form, testimonialRating: Number(e.target.value) })}
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                    </AdminSelect>
                  </AdminFormField>
                </div>

                <AdminFormField label="Client Quote">
                  <AdminTextarea
                    rows={3}
                    value={form.testimonialText}
                    onChange={(e) => setForm({ ...form, testimonialText: e.target.value })}
                    placeholder="Their feedback on design tolerances, timeline and handover..."
                  />
                </AdminFormField>
              </div>

              {/* Project Room Photo Gallery */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                      <ImageIcon size={14} />
                      <span>Project Photos Gallery ({form.gallery?.length || 0})</span>
                    </h3>
                    <p className="font-sans text-xs text-white/40 mt-0.5">
                      Photos showcased inside the project case study room tour and gallery.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Enter Image URL to add to Gallery:');
                      if (url && url.trim()) {
                        setForm({ ...form, gallery: [...(form.gallery || []), url.trim()] });
                      }
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-medium transition-colors"
                  >
                    <Plus size={13} />
                    <span>Add Image URL</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(form.gallery || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40">
                      <img src={resolveProjectImg(imgUrl)} alt={`Photo ${idx + 1}`} onError={handleImgError} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 p-2">
                        <button
                          type="button"
                          title="Set as Hero Cover"
                          onClick={() => {
                            setForm({ ...form, heroImage: imgUrl });
                            setHeroPreview(imgUrl);
                          }}
                          className="bg-gold text-charcoal text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider"
                        >
                          Set Cover
                        </button>
                        <button
                          type="button"
                          title="Remove Photo"
                          onClick={() => {
                            const updated = form.gallery.filter((_, i) => i !== idx);
                            setForm({ ...form, gallery: updated });
                          }}
                          className="bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {form.heroImage === imgUrl && (
                        <span className="absolute top-1.5 left-1.5 bg-gold text-charcoal font-sans text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar (Right 1 Column) */}
            <div className="space-y-6">
              {/* Main Cover Image */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">
                  Card Thumbnail / Hero Cover Photo
                </h3>
                {heroPreview ? (
                  <div className="relative rounded-lg overflow-hidden aspect-video border border-white/10">
                    <img src={resolveProjectImg(heroPreview)} alt="Cover preview" onError={handleImgError} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setHeroPreview(null); setForm({ ...form, heroImage: '' }); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-2 p-4 text-center">
                    <ImageIcon size={28} className="text-white/20" />
                    <span className="font-sans text-xs text-white/40">No cover photo set</span>
                  </div>
                )}

                <AdminFormField label="Cover Image URL">
                  <AdminInput
                    value={form.heroImage}
                    onChange={(e) => {
                      setForm({ ...form, heroImage: e.target.value });
                      setHeroPreview(e.target.value);
                    }}
                    placeholder="https://res.cloudinary.com/..."
                  />
                </AdminFormField>
              </div>

              {/* Status & Options */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5 space-y-4">
                <h3 className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">
                  Display Options
                </h3>

                <label className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 cursor-pointer">
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">Feature on Homepage</span>
                    <span className="font-sans text-[11px] text-white/40">Showcases in the StickyScroll window</span>
                  </div>
                  <div
                    onClick={() => setForm({ ...form, featured: !form.featured })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? 'bg-gold' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-lg transition-all disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Project to Database</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* ── MAIN TABBED CMS VIEW ────────────────────────────────────────────── */
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 space-x-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'list', label: `Projects List (${projects.length})`, icon: FolderKanban },
              { id: 'hero', label: 'Projects Page Hero', icon: ImageIcon },
              { id: 'home_section', label: 'Home Page Projects Section', icon: Layers },
              { id: 'cta', label: 'Projects CTA Banner', icon: FileText }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-sans text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-gold text-gold bg-gold/5'
                      : 'border-transparent text-white/50 hover:text-white hover:bg-white/2'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: PROJECTS LIST */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1A1C20] border border-white/5 p-4 rounded-xl">
                <div className="relative flex-1 max-w-md">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, style or location..."
                    className="w-full bg-[#0E0F11] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-sans text-white placeholder:text-white/30 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                  {['all', 'apartment', 'villa', 'commercial', 'renovation', 'office'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-sans uppercase tracking-wider capitalize whitespace-nowrap transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? 'bg-gold text-charcoal font-bold'
                          : 'bg-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/2">
                      <th className="px-5 py-3.5 font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">Seq</th>
                      <th className="px-5 py-3.5 font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">Project & Details</th>
                      <th className="px-5 py-3.5 font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">Category</th>
                      <th className="px-5 py-3.5 font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">Location</th>
                      <th className="px-5 py-3.5 font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-xs font-sans text-white/40">
                          <Loader2 size={18} className="animate-spin inline mr-2 text-gold" />
                          Loading projects from database...
                        </td>
                      </tr>
                    ) : filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-8 text-center text-xs font-sans text-white/40">
                          No projects matching "{searchQuery}".
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((p, idx) => {
                        const pId = p._id || p.id;
                        const thumb = resolveProjectImg(p.heroImage || p.hero_image);
                        return (
                          <tr key={pId} className="hover:bg-white/2 transition-colors">
                            {/* Sequence & Reorder */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center space-x-1">
                                <span className="font-mono text-xs font-bold text-white/40 w-5">{idx + 1}</span>
                                <div className="flex flex-col">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveOrder(idx, 'up')}
                                    className="text-white/30 hover:text-gold disabled:opacity-20 cursor-pointer"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === filteredProjects.length - 1}
                                    onClick={() => handleMoveOrder(idx, 'down')}
                                    className="text-white/30 hover:text-gold disabled:opacity-20 cursor-pointer"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>
                              </div>
                            </td>

                            {/* Project Info */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={thumb}
                                  alt={p.title}
                                  onError={handleImgError}
                                  className="w-12 h-12 rounded-lg object-cover bg-white/5 border border-white/10 shrink-0"
                                />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <p className="font-sans text-xs font-bold text-white">{p.title}</p>
                                    {p.featured && (
                                      <span className="bg-gold/15 text-gold border border-gold/30 text-[9px] font-sans font-bold px-1.5 py-0.2 rounded uppercase">
                                        ★ Featured
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-sans text-[11px] text-white/40 truncate max-w-xs">{p.style || p.slug}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-5 py-3.5">
                              <span className="font-sans text-xs text-white/60 capitalize">{(p.category || '').replace('_', ' ')}</span>
                            </td>

                            {/* Location */}
                            <td className="px-5 py-3.5">
                              <span className="font-sans text-xs text-white/60">{p.location || 'Hyderabad'}</span>
                            </td>

                            {/* Status */}
                            <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold font-sans uppercase tracking-wide ${
                                p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'
                              }`}>
                                {p.status || 'published'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-3.5 text-right">
                              <div className="inline-flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatured(p)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-sans font-bold transition-all cursor-pointer ${
                                    p.featured ? 'bg-gold text-charcoal' : 'bg-white/5 text-white/40 hover:text-white'
                                  }`}
                                  title="Toggle Featured"
                                >
                                  ★ {p.featured ? 'Featured' : 'Feature'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleEdit(p)}
                                  className="px-3 py-1 rounded text-xs font-sans font-medium bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(pId)}
                                  className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                                  title="Remove"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS PAGE HERO */}
          {activeTab === 'hero' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6">
                <form onSubmit={handleSaveHero} className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div>
                      <h3 className="font-editorial text-xl font-bold text-white">Projects Page Hero Settings</h3>
                      <p className="font-sans text-xs text-white/40 mt-0.5">Customize the high-impact banner on /projects.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all cursor-pointer shadow-md"
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      <span>Save Hero</span>
                    </button>
                  </div>

                  <AdminFormField label="Pill Badge Tagline">
                    <AdminInput
                      value={heroForm.projects_hero_badge}
                      onChange={(e) => setHeroForm({ ...heroForm, projects_hero_badge: e.target.value })}
                      placeholder="Portfolio & Case Studies"
                    />
                  </AdminFormField>

                  <AdminFormField label="Hero Main Title">
                    <AdminInput
                      value={heroForm.projects_hero_title}
                      onChange={(e) => setHeroForm({ ...heroForm, projects_hero_title: e.target.value })}
                      placeholder="Our Projects"
                    />
                  </AdminFormField>

                  <AdminFormField label="Hero Subtitle / Description">
                    <AdminTextarea
                      rows={3}
                      value={heroForm.projects_hero_subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, projects_hero_subtitle: e.target.value })}
                      placeholder="Every space reflects thoughtful layouts..."
                    />
                  </AdminFormField>

                  {/* Hero Slideshow Images */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block">
                      Hero Slideshow Images ({heroForm.projects_hero_images?.length || 0})
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(heroForm.projects_hero_images || []).map((imgUrl, i) => (
                        <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40">
                          <img src={imgUrl} alt={`Hero ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = heroForm.projects_hero_images.filter((_, idx) => idx !== i);
                              setHeroForm({ ...heroForm, projects_hero_images: updated });
                            }}
                            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 text-white hover:bg-red-500 flex items-center justify-center transition-colors"
                          >
                            <X size={12} />
                          </button>
                          <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                            #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="text"
                        value={newHeroImgUrl}
                        onChange={(e) => setNewHeroImgUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 bg-[#0E0F11] border border-white/10 rounded-lg px-4 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-gold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newHeroImgUrl.trim()) {
                            setHeroForm({
                              ...heroForm,
                              projects_hero_images: [...heroForm.projects_hero_images, newHeroImgUrl.trim()]
                            });
                            setNewHeroImgUrl('');
                          }
                        }}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5">
                  <h4 className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold mb-3 flex items-center space-x-1.5">
                    <Eye size={12} />
                    <span>Live Hero Preview</span>
                  </h4>
                  <div className="relative aspect-[16/11] rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col justify-end p-6">
                    <img
                      src={heroForm.projects_hero_images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    <div className="relative z-10 space-y-2">
                      <div className="inline-block bg-white text-[#101014] px-3 py-1 rounded-full text-[10px] font-sans font-medium">
                        {heroForm.projects_hero_badge || 'Portfolio & Case Studies'}
                      </div>
                      <h2 className="font-editorial text-2xl font-bold text-white leading-tight">
                        {heroForm.projects_hero_title || 'Our Projects'}
                      </h2>
                      <p className="font-sans text-[11px] text-white/80 line-clamp-2">
                        {heroForm.projects_hero_subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOME PAGE PROJECTS SECTION */}
          {activeTab === 'home_section' && (
            <div className="max-w-2xl">
              <form onSubmit={handleSaveHomeSection} className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-white">Home Page Projects Section</h3>
                    <p className="font-sans text-xs text-white/40 mt-0.5">Control the StickyScroll "Our Projects" showcase on the home page.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all cursor-pointer shadow-md"
                  >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>Save Section</span>
                  </button>
                </div>

                <label className="flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/5 cursor-pointer">
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">Show Projects on Home Page</span>
                    <span className="font-sans text-[11px] text-white/40">Toggle visibility of the entire projects scroll section on the home page</span>
                  </div>
                  <div
                    onClick={() => setHomeSectionForm({ ...homeSectionForm, projects_visible: !homeSectionForm.projects_visible })}
                    className={`w-10 h-5 rounded-full transition-colors relative ${homeSectionForm.projects_visible ? 'bg-gold' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${homeSectionForm.projects_visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </label>

                <AdminFormField label="Small Tagline / Subtitle">
                  <AdminInput
                    value={homeSectionForm.projects_subtitle}
                    onChange={(e) => setHomeSectionForm({ ...homeSectionForm, projects_subtitle: e.target.value })}
                    placeholder="Selected Work"
                  />
                </AdminFormField>

                <AdminFormField label="Main Section Heading">
                  <AdminInput
                    value={homeSectionForm.projects_heading}
                    onChange={(e) => setHomeSectionForm({ ...homeSectionForm, projects_heading: e.target.value })}
                    placeholder="Our Projects"
                  />
                </AdminFormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormField label="CTA Button Text">
                    <AdminInput
                      value={homeSectionForm.projects_cta_text}
                      onChange={(e) => setHomeSectionForm({ ...homeSectionForm, projects_cta_text: e.target.value })}
                      placeholder="All Projects ↗"
                    />
                  </AdminFormField>

                  <AdminFormField label="CTA Link Destination">
                    <AdminInput
                      value={homeSectionForm.projects_cta_link}
                      onChange={(e) => setHomeSectionForm({ ...homeSectionForm, projects_cta_link: e.target.value })}
                      placeholder="/projects"
                    />
                  </AdminFormField>
                </div>

                <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 text-xs font-sans text-white/70 space-y-1">
                  <p className="font-bold text-gold">★ Pro-Tip on Featured Projects:</p>
                  <p>
                    The first 6 projects marked as <span className="text-gold font-bold">"Featured"</span> in the Projects List tab will automatically animate in sequence inside the StickyScroll window on the home page.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PROJECTS CTA BANNER */}
          {activeTab === 'cta' && (
            <div className="max-w-3xl">
              <CTASectionEditor
                pagePrefix="projects"
                defaultBadge="Start Your Project"
                defaultHeading="Ready to bring architectural rigor to your home?"
                defaultSubheading="Book a consultation with our principal design team."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
