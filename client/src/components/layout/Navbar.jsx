import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Briefcase, FolderKanban, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';
import GooeyNav from '../ui/GooeyNav';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Pages that start with a dark cinematic hero
  // Note: /projects/:slug (project detail) has an inset hero within a light cream background, so navbar sits on light bg
  const hasDarkHero = ['/', '/about', '/services', '/projects', '/spaces', '/what-we-do', '/materials', '/products'].some(path => {
    if (path === '/') return location.pathname === '/';
    if (path === '/projects') return location.pathname === '/projects' || location.pathname === '/projects/';
    return location.pathname.startsWith(path);
  }) && !location.search.includes('success=true');

  useEffect(() => {
    const handleScroll = () => {
      // On dark-hero pages: stay transparent until user leaves the hero
      // On other pages: become solid immediately after 20px.
      const threshold = hasDarkHero ? Math.min(window.innerHeight * 0.35, 250) : 20;
      setScrolled(window.scrollY > threshold);
    };
    // Run once on mount in case page loads mid-scroll
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasDarkHero]);

  useEffect(() => {
    setMobileMenuOpen(false);
    // Reset scrolled state when navigating to a new page
    setScrolled(false);
  }, [location]);

  const defaultNavLinks = [
    { name: 'Home',     path: '/' },
    { name: 'Services',  path: '/services' },
    { name: 'Projects',  path: '/projects' },
    { name: 'Spaces',    path: '/spaces' },
    { name: 'Materials', path: '/materials' },
    { name: 'About',     path: '/about' },
  ];

  const normalizeNavPath = (p) => {
    if (!p) return '/';
    if (p === '/what-we-do' || p.startsWith('/what-we-do/')) return p.replace('/what-we-do', '/spaces');
    if (p === '/products' || p.startsWith('/products/')) return p.replace('/products', '/materials');
    return p;
  };

  const normalizeNavLabel = (lbl) => {
    if (lbl === 'What We Do') return 'Spaces';
    if (lbl === 'Materials Library' || lbl === 'Products') return 'Materials';
    return lbl;
  };

  const [navLinks, setNavLinks] = useState(defaultNavLinks);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../../utils/cmsStore');
        const stored = getCMSData(STORAGE_KEYS.SETTINGS);
        if (stored && stored.nav_items) {
          const cmsLinks = stored.nav_items
            .filter((item) => item.visible)
            .map((item) => ({ 
              name: normalizeNavLabel(item.label), 
              path: normalizeNavPath(item.path) 
            }));
          if (cmsLinks.length > 0) {
            setNavLinks(cmsLinks);
            return;
          }
        }
      } catch {}

      try {
        const { default: axios } = await import('axios');
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data && res.data.data.nav_items) {
          const cmsLinks = res.data.data.nav_items
            .filter((item) => item.visible)
            .map((item) => ({ 
              name: normalizeNavLabel(item.label), 
              path: normalizeNavPath(item.path) 
            }));
          if (cmsLinks.length > 0) setNavLinks(cmsLinks);
        }
      } catch {}
    };

    fetchNav();

    const handleSync = () => fetchNav();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // isNavLight = true means white bg + dark text (post-hero or non-hero pages)
  const isNavLight = scrolled || !hasDarkHero || location.search.includes('success=true');
  const isBgTransparent = !isNavLight || location.search.includes('success=true');
  const isContact = location.pathname.startsWith('/contact');
  const navPosition = isContact ? 'absolute' : 'fixed';

  const resetScroll = (smoothIfSame = false, targetPath = '') => {
    if (smoothIfSame && window.location.pathname === targetPath) {
      if (window.lenis) {
        window.lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } else {
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  return (
    <>
      <nav className={`${navPosition} top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isBgTransparent
          ? 'bg-transparent px-5 pt-[6px] lg:px-12 lg:pt-[3px]'
          : 'bg-bg/95 backdrop-blur-md shadow-sm px-0 pt-0'
      }`}
      >
        <div className={`max-w-[1440px] mx-auto pl-6 pr-10 flex items-center justify-between transition-all duration-500 ${
          isBgTransparent ? 'pt-[6px] pb-[3px]' : 'py-[5px]'
        }`}>

          {/* Logo */}
          <Link 
            to="/" 
            aria-label="ESPACIO Home"
            className={`hover:opacity-90 transition-opacity ${isNavLight ? '' : 'drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]'}`}
            onClick={() => resetScroll(true, '/')}
          >
            <Logo scrolled={isNavLight} />
          </Link>

          {/* Desktop Nav & CTA Grouped on the right */}
          <div className="hidden lg:flex items-center gap-12 ml-auto">
            <GooeyNav 
              items={navLinks} 
              isNavLight={isNavLight}
            />

            {/* CTA Button */}
            <Link 
              to="/contact"
              onClick={() => resetScroll(true, '/contact')}
              className={`btn-nav-split ${isNavLight ? 'scrolled' : 'cinematic'}`}
            >
              <span>
                Contact us
                <ArrowUpRight size={14} />
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer ${
              isNavLight 
                ? 'text-ink hover:bg-ink-muted/10' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-bg-dark z-[100] flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-16">
              <Link to="/" className="hover:opacity-90">
                <Logo scrolled={false} />
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                aria-label="Close navigation menu"
                className="text-white/60 hover:text-white transition-colors p-2"
              >
                <X size={22} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link 
                    to={link.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      resetScroll(true, link.path);
                    }}
                    className="block font-display text-3xl font-semibold text-white hover:text-gold py-3 border-b border-white/10 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <Link 
              to="/contact" 
              onClick={() => {
                setMobileMenuOpen(false);
                resetScroll(true, '/contact');
              }}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-ink font-sans text-[12px] font-bold uppercase tracking-widest px-6 py-4.5 rounded-pill w-full hover:bg-white/90 transition-colors"
            >
              Contact us <ArrowUpRight size={13} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Tab Bar (D'LIFE inspired) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-45 bg-bg/95 backdrop-blur-md border-t border-ink-border/30 h-20 flex items-center justify-around px-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] pb-safe">
        {/* Tab: Services */}
        <Link 
          to="/services" 
          onClick={() => resetScroll(true, '/services')}
          className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2"
        >
          <Briefcase size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Services</span>
        </Link>

        {/* Tab: Projects */}
        <Link 
          to="/projects" 
          onClick={() => resetScroll(true, '/projects')}
          className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2"
        >
          <FolderKanban size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Projects</span>
        </Link>

        {/* Tab: Home */}
        <Link 
          to="/" 
          onClick={() => resetScroll(true, '/')}
          className="flex flex-col items-center justify-end relative h-full flex-1 pb-2 text-ink-soft hover:text-ink transition-colors group"
        >
          {/* House Shape Wrapper Container */}
          <div className="w-[60px] h-[60px] absolute -top-4 left-1/2 -translate-x-1/2 transition-transform duration-300 group-hover:scale-105 group-active:scale-95 flex items-center justify-center">
            {/* House Silhouette SVG Background */}
            <svg 
              width="60" 
              height="60" 
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full drop-shadow-[0_-3px_10px_rgba(0,0,0,0.22)]"
            >
              <path
                d="M 30.1 7.2
                   C 31.2 6.1, 32.8 6.1, 33.9 7.2
                   L 57.2 28.5
                   C 58.4 29.6, 57.9 31, 56.3 31
                   H 51
                   V 56
                   C 51 58.2, 49.2 60, 47 60
                   H 17
                   C 14.8 60, 13 58.2, 13 56
                   V 31
                   H 7.7
                   C 6.1 31, 5.6 29.6, 6.8 28.5
                   Z"
                fill="#000000"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Logo Emblem centered inside the house body */}
            <div className="relative z-10 scale-[0.8] translate-y-[5px]">
              <Logo showText={false} scrolled={false} />
            </div>
          </div>
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft group-hover:text-ink transition-colors">Home</span>
        </Link>

        {/* Tab: Materials */}
        <Link 
          to="/materials" 
          onClick={() => resetScroll(true, '/materials')}
          className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2"
        >
          <Package size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Materials</span>
        </Link>

        {/* Tab: Menu Toggle */}
        <button aria-label="Open navigation menu" onClick={() => setMobileMenuOpen(true)} className="flex flex-col items-center gap-1 text-ink-soft hover:text-ink transition-colors flex-1 py-2 bg-transparent border-0 cursor-pointer">
          <Menu size={22} className="text-ink-soft" />
          <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-ink-soft">Menu</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;
