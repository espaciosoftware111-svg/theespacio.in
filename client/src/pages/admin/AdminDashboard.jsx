import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FolderKanban, Package, Mail, Users, Settings,
  LogOut, ChevronRight, TrendingUp, Eye, MessageSquare, Star,
  Image, FileText, Bell, Menu, X, AlertCircle, Layers, HelpCircle, Activity, Shield
} from 'lucide-react';
import { getCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

// ── AUTH GUARD ────────────────────────────────────────────────────────────────
export const useAdminAuth = () => {
  const token = localStorage.getItem('espacio_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return !!token;
};

// ── SIDEBAR NAV ───────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/espesp/admin/dashboard' },
  { icon: Layers, label: 'Home Hero CMS', path: '/espesp/admin/hero' },
  { icon: Package, label: 'Services CMS', path: '/espesp/admin/services' },
  { icon: FolderKanban, label: 'Projects CMS', path: '/espesp/admin/projects' },
  { icon: Layers, label: 'Spaces CMS', path: '/espesp/admin/spaces' },
  { icon: Package, label: 'Materials CMS', path: '/espesp/admin/materials' },
  { icon: FileText, label: 'About CMS', path: '/espesp/admin/about' },
  { icon: HelpCircle, label: 'FAQ CMS', path: '/espesp/admin/faqs' },
  { icon: Mail, label: 'Contact CMS', path: '/espesp/admin/contact' },
  { icon: Star, label: 'Testimonials CMS', path: '/espesp/admin/testimonials' },
  { icon: FileText, label: 'Footer CMS', path: '/espesp/admin/footer' },
  { icon: Mail, label: 'Enquiries', path: '/espesp/admin/enquiries' },
  { icon: Image, label: 'Gallery', path: '/espesp/admin/gallery' },
  { icon: Users, label: 'Admin Users', path: '/espesp/admin/users' },
  { icon: Activity, label: 'Audit Logs', path: '/espesp/admin/audit' },
  { icon: Settings, label: 'Settings', path: '/espesp/admin/settings' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const handleLogout = async () => {
    try {
      const { logAuditEvent } = await import('../../utils/auditStore');
      await logAuditEvent('User Logged Out', 'Authentication', `User ${activeUser.email} logged out of Admin Panel`);
    } catch {}
    localStorage.removeItem('espacio_token');
    sessionStorage.removeItem('active_admin_user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/espesp/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Filter sidebar navigation items based on Role
  const filteredNavItems = navItems.filter(item => {
    if (userRole === 'Super Admin') return true;
    if (userRole === 'Editor') {
      return !['/espesp/admin/users', '/espesp/admin/audit', '/espesp/admin/settings'].includes(item.path);
    }
    if (userRole === 'Manager') {
      return ['/espesp/admin/dashboard', '/espesp/admin/enquiries', '/espesp/admin/projects', '/espesp/admin/materials', '/espesp/admin/products'].includes(item.path);
    }
    return true;
  });

  // Check route access authorization
  const isRouteAllowed = () => {
    if (userRole === 'Super Admin') return true;
    const currentPath = location.pathname;
    if (userRole === 'Editor') {
      return !['/espesp/admin/users', '/espesp/admin/audit', '/espesp/admin/settings'].includes(currentPath);
    }
    if (userRole === 'Manager') {
      return ['/espesp/admin/dashboard', '/espesp/admin/enquiries', '/espesp/admin/projects', '/espesp/admin/materials', '/espesp/admin/products'].includes(currentPath);
    }
    return true;
  };

  const allowed = isRouteAllowed();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-900 flex select-none admin-portal-white">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-200 z-50 flex flex-col transition-transform duration-300 shadow-xs ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="font-editorial text-lg font-bold text-gold tracking-widest block">ESPACIO</span>
            <span className="font-sans text-[9px] bg-gold/15 text-[#967332] border border-gold/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mt-1">
              {userRole}
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-stone-400 hover:text-stone-700">
            <X size={18} />
          </button>
        </div>

        {/* User Info Card */}
        <div className="px-4 py-3 mx-3 mt-3 bg-stone-50 border border-stone-200 rounded-xl">
          <p className="font-sans text-xs font-bold text-stone-900 truncate">{activeUser.name}</p>
          <p className="font-sans text-[10px] text-stone-500 truncate">{activeUser.email}</p>
        </div>

        {/* Nav */}
        <nav data-lenis-prevent className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-sans uppercase tracking-wide font-bold transition-all duration-200 ${isActive ? 'bg-gold/15 text-[#967332] border border-gold/30 shadow-xs' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'}`}>
                <item.icon size={16} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-stone-200">
          <button onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-sans uppercase tracking-wide font-bold text-red-600 hover:bg-red-50 transition-all">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-[#F8F9FA]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-6 shadow-2xs">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-600 hover:text-stone-900">
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-3 ml-auto">
            <div className="text-right hidden sm:block">
              <span className="font-sans text-xs font-bold text-stone-900 block">{activeUser.name}</span>
              <span className="font-sans text-[10px] text-[#967332] font-bold uppercase">{userRole}</span>
            </div>

            <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center font-editorial font-bold text-[#967332]">
              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content Body with Route Guard Access Check */}
        <main className="flex-1 p-6 md:p-8">
          {!allowed ? (
            <div className="bg-[#141518] border border-red-500/30 rounded-2xl p-10 max-w-xl mx-auto text-center space-y-5 my-12 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <Shield size={32} />
              </div>
              <h2 className="font-editorial text-2xl font-bold text-white">Access Restricted</h2>
              <p className="font-sans text-xs text-white/60 leading-relaxed">
                Your current account role (<span className="text-gold font-bold">{userRole}</span>) does not have permission to access this module.
              </p>
              <Link
                to="/espesp/admin/dashboard"
                className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                <span>Return to Dashboard</span>
              </Link>
            </div>
          ) : (
            children || <AdminDashboardHome />
          )}
        </main>
      </div>
    </div>
  );
};

// ── DASHBOARD HOME ────────────────────────────────────────────────────────────
const AdminDashboardHome = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ projects: 30, products: 9, enquiries: 0, testimonials: 49 });

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

  const statCards = [
    { label: 'Projects Published', value: stats.projects, icon: FolderKanban, trend: '8 Authentic Case Studies', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Materials Listed', value: stats.products, icon: Package, trend: '9 Premium Collections', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Client Enquiries', value: stats.enquiries, icon: MessageSquare, trend: `${stats.enquiries} Total Submissions`, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Client Reviews', value: stats.testimonials, icon: Star, trend: '5.0 ⭐ Google Rating', color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-editorial text-3xl font-bold text-stone-900">Dashboard</h1>
        <p className="font-sans text-xs text-stone-500 uppercase tracking-widest">ESPACIO Admin Control Panel • Live Real-time Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white border border-stone-200 rounded-xl p-6 space-y-4 hover:border-gold/40 transition-all duration-300 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-stone-500 font-bold">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={15} className={card.color} />
              </div>
            </div>
            <p className="font-editorial text-4xl font-bold text-stone-900">{card.value}</p>
            <p className={`font-sans text-[10px] font-bold ${card.color}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real-time Recent Enquiries */}
        <div className="xl:col-span-2 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
            <h2 className="font-editorial text-lg font-bold text-stone-900">Recent Enquiries ({enquiries.length})</h2>
            <Link to="/espesp/admin/enquiries" className="font-sans text-[10px] uppercase tracking-widest text-[#967332] font-bold hover:underline">View All Enquiries</Link>
          </div>
          <div className="divide-y divide-stone-100">
            {enquiries.length > 0 ? enquiries.slice(0, 6).map((item, idx) => (
              <div key={item.id || idx} className="px-6 py-4 flex items-center space-x-4 hover:bg-stone-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-editorial font-bold text-gold text-sm shrink-0">
                  {(item.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-sans text-xs font-bold text-stone-900 truncate">{item.name || 'Client'}</p>
                    <span className="font-mono text-[9px] text-stone-400">({item.enquiryId || item.id})</span>
                  </div>
                  <p className="font-sans text-[10px] text-stone-500 truncate">
                    {item.phone} • {item.location || 'Location Not Specified'}
                  </p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider bg-gold/15 text-[#967332] border border-gold/30">
                  {item.type ? item.type.replace('_', ' ') : 'ENQUIRY'}
                </span>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-sans uppercase tracking-wide font-bold ${
                  item.status === 'CONTACTED' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                  item.status === 'CONVERTED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                  item.status === 'FOLLOW_UP' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-gold/15 text-[#967332] border border-gold/20'
                }`}>
                  {item.status || 'NEW'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-12 text-center space-y-3">
                <AlertCircle size={24} className="text-stone-300 mx-auto" />
                <p className="font-sans text-xs text-stone-500">No customer enquiries received yet.</p>
                <p className="font-sans text-[11px] text-stone-400">Enquiries submitted on the website will appear here instantly in real-time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customized Quick Actions */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-5 border-b border-stone-200">
            <h2 className="font-editorial text-lg font-bold text-stone-900">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: '1. Homepage CMS', path: '/espesp/admin/hero', icon: Layers },
              { label: '2. Services CMS', path: '/espesp/admin/services', icon: Package },
              { label: '3. Spaces CMS', path: '/espesp/admin/spaces', icon: Layers },
              { label: '4. Materials CMS', path: '/espesp/admin/materials', icon: Package },
              { label: '5. Admin Users', path: '/espesp/admin/users', icon: Users },
            ].map((action, idx) => (
              <Link key={idx} to={action.path}
                className="flex items-center space-x-3 p-3.5 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 hover:border-gold/40 transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <action.icon size={15} className="text-[#967332]" />
                </div>
                <span className="font-sans text-xs text-stone-800 group-hover:text-[#967332] font-bold transition-colors">{action.label}</span>
                <ChevronRight size={14} className="ml-auto text-stone-400 group-hover:text-[#967332] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboardHome };
export default AdminLayout;
