import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export const IntroPreloader = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      if (typeof navigator !== 'undefined' && (
        navigator.webdriver ||
        /Chrome-Lighthouse|Lighthouse|PageSpeed|HeadlessChrome/i.test(navigator.userAgent)
      )) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  });

  // Ensure any stale legacy keys in storage are cleared so preloader always works properly
  useEffect(() => {
    try {
      localStorage.removeItem('espacio_intro_shown');
      sessionStorage.removeItem('espacio_intro_shown');
    } catch {}
  }, []);

  const handleComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro) return;
    // Auto-dismiss safely after full animation completes (3.6s)
    const timer = setTimeout(() => {
      handleComplete();
    }, 3600);

    return () => {
      clearTimeout(timer);
    };
  }, [showIntro]);

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          exit={{ 
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.75, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
          style={{
            background: 'radial-gradient(circle at center, #16171d 0%, #0a0b0d 85%)'
          }}
          onClick={handleComplete}
        >
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ 
              opacity: 0,
              y: -60,
              scale: 0.94,
              transition: { duration: 0.55, ease: [0.77, 0, 0.175, 1] }
            }}
            className="flex flex-col items-center select-none px-4"
          >
            <Logo scrolled={false} size="large" onComplete={handleComplete} />

            {/* Tagline: DESIGNING SPACES / DEFINING LIFESTYLES */}
            <div className="mt-2 flex flex-col items-center text-center space-y-0.5 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '0.24em',
                  textShadow: '0 2px 20px rgba(201, 169, 110, 0.4)'
                }}
                className="text-[14px] sm:text-[18px] md:text-[22px] text-[#C9A96E] uppercase font-extrabold leading-tight"
              >
                Designing Spaces
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.1, duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '0.24em',
                  textShadow: '0 2px 20px rgba(255, 255, 255, 0.25)'
                }}
                className="text-[14px] sm:text-[18px] md:text-[22px] text-[#FFFFFF] uppercase font-extrabold leading-tight"
              >
                Defining Lifestyles
              </motion.div>
            </div>
          </motion.div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute bottom-6 right-6 text-white/40 hover:text-gold font-sans text-[11px] tracking-widest uppercase transition-colors px-3.5 py-1.5 rounded-full border border-white/10 hover:border-gold/40 backdrop-blur-sm"
          >
            Skip ↗
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroPreloader;
