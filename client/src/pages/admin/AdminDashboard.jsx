import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FolderKanban, Package, Mail, Users, Settings,
  LogOut, ChevronRight, TrendingUp, Eye, MessageSquare, Star,
  Image, FileText, Bell, Menu, X, AlertCircle, Layers, HelpCircle,
  Activity, Shield, UploadCloud, ExternalLink, CheckCircle2, Loader2,
  Sparkles, RefreshCw
} from 'lucide-react';
import { getCMSData, STORAGE_KEYS, publishAllCMSChanges } from '../../utils/cmsStore';

// ── AUTH GUARD ────────────────────────────────────────────────────────────────
export const useAdminAuth = () => {
  const token = localStorage.getItem('espacio_token') || localStorage.getItem('supabase_auth_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return !!token;
};

// ── ORGANIZED SIDEBAR NAV CATEGORIES ──────────────────────────────────────────
const navCategories = [
  {
    title: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/espesp/admin/dashboard' },
      { icon: MessageSquare, label: 'Enquiries', path: '/espesp/admin/enquiries' },
    ]
  },
  {
    title: 'Content Management (CMS)',
    items: [
      { icon: Layers, label: 'Home Page CMS', path: '/espesp/admin/hero' },
      { icon: Package, label: 'Services CMS', path: '/espesp/admin/services' },
      { icon: FolderKanban, label: 'Projects CMS', path: '/espesp/admin/projects' },
      { icon: Layers, label: 'Spaces CMS', path: '/espesp/admin/spaces' },
      { icon: Package, label: 'Materials CMS', path: '/espesp/admin/materials' },
      { icon: FileText, label: 'About CMS', path: '/espesp/admin/about' },
      { icon: HelpCircle, label: 'FAQ CMS', path: '/espesp/admin/faqs' },
      { icon: Mail, label: 'Contact CMS', path: '/espesp/admin/contact' },
      { icon: Star, label: 'Testimonials CMS', path: '/espesp/admin/testimonials' },
      { icon: FileText, label: 'Footer CMS', path: '/espesp/admin/footer' },
      { icon: FileText, label: 'Page Layouts CMS', path: '/espesp/admin/pages' },
    ]
  },
  {
    title: 'Platform & System',
    items: [
      { icon: Image, label: 'Media Gallery', path: '/espesp/admin/gallery' },
      { icon: Users, label: 'Admin Users', path: '/espesp/admin/users' },
      { icon: Activity, label: 'Audit Logs', path: '/espesp/admin/audit' },
      { icon: Settings, label: 'Settings', path: '/espesp/admin/settings' },
    ]
  }
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [lastPublished, setLastPublished] = useState(() => localStorage.getItem('espacio_last_published') || null);
  const isAuthenticated = useAdminAuth();

  // Get active admin user profile & role
  const activeUser = React.useMemo(() => {
    try {
      const u = sessionStorage.getItem('active_admin_user');
      if (u) return JSON.parse(u);
    } catch {}
    return { name: 'Tarun (Super Admin)', email: 'tarunuttupulusu@gmail.com', role: 'Super Admin' };
  }, []);

  const userRole = activeUser.role || 'Super Admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/espesp/admin');
    }
  }, [isAuthenticated, navigate]);

  // Universal Publish All CMS Changes to Live Website
  const handlePublishAll = async () => {
    setIsPublishing(true);
    try {
      const res = await publishAllCMSChanges();
      setLastPublished(res.timestamp);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (err) {
      console.warn('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { logAuditEvent } = await import('../../utils/auditStore');
      await logAuditEvent('User Logged Out', 'Authentication', `User ${activeUser.email} logged out of Admin Panel`);
    } catch {}
    try {
      const { supabase } = await import('../../lib/supabaseClient');
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('espacio_token');
    localStorage.removeItem('supabase_auth_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('active_admin_user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/espesp/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Filter sidebar navigation items based on Role
  const isItemAllowed = (path) => {
    if (userRole === 'Super Admin') return true;
    if (userRole === 'Editor') {
      return !['/espesp/admin/users', '/espesp/admin/audit', '/espesp/admin/settings'].includes(path);
    }
    if (userRole === 'Manager') {
      return ['/espesp/admin/dashboard', '/espesp/admin/enquiries', '/espesp/admin/projects', '/espesp/admin/materials', '/espesp/admin/products'].includes(path);
    }
    return true;
  };

  const allowed = isItemAllowed(location.pathname);

  // Derive current section label for topbar breadcrumb
  const currentSectionLabel = (() => {
    for (const group of navCategories) {
      for (const item of group.items) {
        if (location.pathname === item.path) return item.label;
      }
    }
    return 'Portal';
  })();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-900 flex select-none admin-portal-white">
      {/* ── Sidebar Drawer (Responsive across devices) ────────────────────── */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-200 z-50 flex flex-col transition-transform duration-300 shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
          <div>
            <span className="font-editorial text-xl font-bold text-gold tracking-widest block">ESPACIO</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-sans text-[9px] uppercase tracking-wider text-[#967332] font-bold">
                {userRole}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Categories */}
        <nav data-lenis-prevent className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
          {navCategories.map((group, gIdx) => {
            const visibleItems = group.items.filter(it => isItemAllowed(it.path));
            if (visibleItems.length === 0) return null;
            return (
              <div key={gIdx} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 font-sans">
                  {group.title}
                </p>
                {visibleItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-sans uppercase tracking-wide font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-gold/15 text-[#967332] border border-gold/30 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      <item.icon size={15} className={isActive ? 'text-gold' : 'text-stone-400'} />
                      <span className="truncate">{item.label}</span>
                      {isActive && <ChevronRight size={12} className="ml-auto text-gold shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50/50 space-y-2">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-lg bg-white border border-stone-200 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center font-editorial font-bold text-[#967332] text-xs shrink-0">
              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs font-bold text-stone-900 truncate">{activeUser.name}</p>
              <p className="font-sans text-[10px] text-stone-500 truncate">{activeUser.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-sans uppercase tracking-wide font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content Area ─────────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-[#F8F9FA]">
        {/* Sticky Topbar across all devices */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
          {/* Left: Mobile hamburger & breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center space-x-1.5 text-stone-400 text-[10px] font-sans uppercase tracking-widest font-bold">
                <span>Admin</span>
                <span>/</span>
                <span className="text-[#967332]">{currentSectionLabel}</span>
              </div>
              <p className="font-editorial text-base sm:text-lg font-bold text-stone-900 hidden sm:block">
                ESPACIO Management
              </p>
            </div>
          </div>

          {/* Right: Publish Button + View Live Site + User Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Sync Status */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Synced</span>
            </div>

            {/* View Live Site Button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-gold/40 text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs font-bold transition-all shadow-2xs"
              title="Open public website in a new tab"
            >
              <ExternalLink size={13} className="text-stone-500" />
              <span className="hidden md:inline">View Live Site</span>
            </a>

            {/* UNIVERSAL PUBLISH BUTTON (Accessible across ALL sections) */}
            <button
              onClick={handlePublishAll}
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-xs disabled:opacity-50"
              title="Publish all CMS changes across all sections live to the website"
            >
              {isPublishing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <UploadCloud size={14} />
              )}
              <span>{isPublishing ? 'Publishing...' : 'Publish to Live Site'}</span>
            </button>

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center font-editorial font-bold text-[#967332] text-xs">
              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content Body with Responsive Padding */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {!allowed ? (
            <div className="bg-white border border-red-200 rounded-2xl p-8 sm:p-12 max-w-xl mx-auto text-center space-y-4 my-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-500 flex items-center justify-center mx-auto">
                <Shield size={28} />
              </div>
              <h2 className="font-editorial text-2xl font-bold text-stone-900">Access Restricted</h2>
              <p className="font-sans text-xs text-stone-500 leading-relaxed">
                Your current account role (<span className="text-[#967332] font-bold">{userRole}</span>) does not have permission to access this module.
              </p>
              <Link
                to="/espesp/admin/dashboard"
                className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all shadow-sm"
              >
                <span>Return to Dashboard</span>
              </Link>
            </div>
          ) : (
            children || <AdminDashboardHome />
          )}
        </main>
      </div>

      {/* Floating Success Notification on Publishing */}
      {showToast && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-gold/30 flex items-center gap-3 transition-all duration-300">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-white">All Changes Published Successfully!</p>
            <p className="font-sans text-[11px] text-stone-300">Live website synchronized with current CMS data.</p>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1 bg-gold text-charcoal rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-gold-hover transition-colors shrink-0"
          >
            View Live
          </a>
        </div>
      )}
    </div>
  );
};

// ── DASHBOARD HOME (Adaptive Multi-Device Grid Layout) ────────────────────────
const AdminDashboardHome = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ projects: 8, products: 9, enquiries: 0, testimonials: 31 });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedNotice, setSyncedNotice] = useState(false);

  const loadRealtimeData = () => {
    try {
      const storedEnquiries = getCMSData(STORAGE_KEYS.ENQUIRIES) || [];
      const storedTestimonials = getCMSData(STORAGE_KEYS.TESTIMONIALS) || [];
      const storedProjects = getCMSData(STORAGE_KEYS.PROJECTS) || [];
      const storedProducts = getCMSData(STORAGE_KEYS.PRODUCTS) || [];

      setEnquiries(storedEnquiries);
      setStats({
        projects: storedProjects.length > 0 ? storedProjects.length : 8,
        products: storedProducts.length > 0 ? storedProducts.length : 9,
        enquiries: storedEnquiries.length,
        testimonials: storedTestimonials.length > 0 ? storedTestimonials.length : 31
      });
    } catch (err) {
      console.warn('Failed to load realtime dashboard stats:', err);
    }
  };

  useEffect(() => {
    loadRealtimeData();
    window.addEventListener('espacio_cms_update', loadRealtimeData);
    window.addEventListener('storage', loadRealtimeData);
    return () => {
      window.removeEventListener('espacio_cms_update', loadRealtimeData);
      window.removeEventListener('storage', loadRealtimeData);
    };
  }, []);

  const handleDashboardPublish = async () => {
    setIsSyncing(true);
    try {
      await publishAllCMSChanges();
      setSyncedNotice(true);
      setTimeout(() => setSyncedNotice(false), 4000);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const statCards = [
    { label: 'Projects Published', value: stats.projects, icon: FolderKanban, trend: `${stats.projects} Authentic Case Studies`, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Materials Listed', value: stats.products, icon: Package, trend: `${stats.products} Premium Collections`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Client Enquiries', value: stats.enquiries, icon: MessageSquare, trend: `${stats.enquiries} Total Submissions`, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Client Reviews', value: stats.testimonials, icon: Star, trend: '5.0 ⭐ Google Rating', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* Page Header with Quick Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-stone-200">
        <div className="space-y-1">
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900">Dashboard</h1>
          <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">
            ESPACIO Control Center • Live Real-time Overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDashboardPublish}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-gold/50 text-stone-700 hover:text-stone-900 text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin text-gold' : 'text-stone-400'} />
            <span>{isSyncing ? 'Publishing...' : 'Sync & Publish Now'}</span>
          </button>
          {syncedNotice && (
            <span className="font-sans text-[11px] text-emerald-600 font-bold animate-in fade-in">
              ✓ Published Live!
            </span>
          )}
        </div>
      </div>

      {/* ── Stat Cards Grid (Responsive across all screen sizes) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 space-y-3 sm:space-y-4 hover:border-gold/40 hover:shadow-xs transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center shrink-0`}>
                <card.icon size={15} className={card.color} />
              </div>
            </div>
            <p className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900">
              {card.value}
            </p>
            <p className={`font-sans text-[10px] font-bold ${card.color} truncate`}>
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main Grid Section: Recent Enquiries (2 cols) & Quick Actions (1 col) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Recent Enquiries List */}
        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/50">
            <div>
              <h2 className="font-editorial text-base sm:text-lg font-bold text-stone-900">
                Recent Enquiries ({enquiries.length})
              </h2>
              <p className="font-sans text-[11px] text-stone-500">Live submissions captured from website forms</p>
            </div>
            <Link
              to="/espesp/admin/enquiries"
              className="font-sans text-[10px] uppercase tracking-widest text-[#967332] font-bold hover:underline shrink-0"
            >
              View All Enquiries →
            </Link>
          </div>

          <div className="divide-y divide-stone-100">
            {enquiries.length > 0 ? (
              enquiries.slice(0, 6).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="px-5 py-3.5 flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-3 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-editorial font-bold text-gold text-xs shrink-0">
                      {(item.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <p className="font-sans text-xs font-bold text-stone-900 truncate">
                          {item.name || 'Client'}
                        </p>
                        <span className="font-mono text-[9px] text-stone-400">
                          ({item.enquiryId || item.id || `ENQ-${idx + 1}`})
                        </span>
                      </div>
                      <p className="font-sans text-[10px] text-stone-500 truncate">
                        {item.phone || item.email || 'No contact specified'} • {item.location || 'Location Not Specified'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider bg-gold/15 text-[#967332] border border-gold/30">
                      {item.type ? item.type.replace('_', ' ') : 'ENQUIRY'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-sans uppercase tracking-wide font-bold ${
                        item.status === 'CONTACTED'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : item.status === 'CONVERTED'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : item.status === 'FOLLOW_UP'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-gold/15 text-[#967332] border border-gold/20'
                      }`}
                    >
                      {item.status || 'NEW'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-center space-y-2">
                <AlertCircle size={22} className="text-stone-300 mx-auto" />
                <p className="font-sans text-xs text-stone-500">No customer enquiries received yet.</p>
                <p className="font-sans text-[11px] text-stone-400">
                  Enquiries submitted on the website contact and quote modals will appear here instantly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Live Publisher Card */}
        <div className="space-y-5">
          {/* Quick Actions Card */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-5 py-4 border-b border-stone-200 bg-stone-50/50">
              <h2 className="font-editorial text-base sm:text-lg font-bold text-stone-900">CMS Shortcuts</h2>
              <p className="font-sans text-[11px] text-stone-500">Fast access to key content sections</p>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: '1. Homepage CMS (All Sections)', path: '/espesp/admin/hero', icon: Layers },
                { label: '2. Services CMS', path: '/espesp/admin/services', icon: Package },
                { label: '3. Projects Portfolio CMS', path: '/espesp/admin/projects', icon: FolderKanban },
                { label: '4. Spaces CMS', path: '/espesp/admin/spaces', icon: Layers },
                { label: '5. Materials & Products', path: '/espesp/admin/materials', icon: Package },
                { label: '6. Admin Users', path: '/espesp/admin/users', icon: Users },
              ].map((action, idx) => (
                <Link
                  key={idx}
                  to={action.path}
                  className="flex items-center space-x-3 p-2.5 rounded-lg bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-gold/40 transition-all duration-200 group"
                >
                  <div className="w-7 h-7 rounded-md bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0">
                    <action.icon size={13} className="text-[#967332]" />
                  </div>
                  <span className="font-sans text-xs text-stone-800 group-hover:text-[#967332] font-bold transition-colors truncate">
                    {action.label}
                  </span>
                  <ChevronRight size={13} className="ml-auto text-stone-400 group-hover:text-[#967332] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Publish Widget */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-xl p-5 space-y-3 border border-stone-800 shadow-md">
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-gold" />
              <h3 className="font-editorial text-sm font-bold text-white">Live Website Publisher</h3>
            </div>
            <p className="font-sans text-[11px] text-stone-300 leading-relaxed">
              Made changes in Projects, Materials, or Hero? Hit publish below to push all updates to the public site immediately.
            </p>
            <button
              onClick={handleDashboardPublish}
              disabled={isSyncing}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm disabled:opacity-50"
            >
              {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
              <span>{isSyncing ? 'Publishing Updates...' : 'Publish All to Live Site'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboardHome };
export default AdminLayout;
