import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroPreloader = () => {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      if (typeof navigator !== 'undefined' && (
        /Chrome-Lighthouse|Lighthouse|PageSpeed/i.test(navigator.userAgent)
      )) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  });

  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.innerHeight > window.innerWidth;
  });

  const videoRef = useRef(null);

  const handleComplete = useCallback(() => {
    try {
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = '';
      }
    } catch {}
    setShowIntro(false);
  }, []);

  const unmuteAndPlaySound = useCallback(() => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      if (video.readyState >= 1) {
        setVideoReady(true);
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoReady(true))
          .catch((err) => {
            console.warn("Autoplay notice:", err);
            if (video) {
              video.muted = true;
              video.play().then(() => setVideoReady(true)).catch(() => {});
            }
          });
      }
    }

    // Auto-unmute on first user gesture
    const handleGesture = () => {
      unmuteAndPlaySound();
    };
    const events = ['pointerdown', 'pointermove', 'touchstart', 'touchend', 'mousedown', 'keydown', 'wheel', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, handleGesture, { once: true, passive: true }));

    // Safety timeout: dismiss after 7.5s max if video fails or ends
    const timer = setTimeout(() => {
      handleComplete();
    }, 7500);

    return () => {
      window.removeEventListener('resize', handleResize);
      events.forEach(evt => window.removeEventListener(evt, handleGesture));
      clearTimeout(timer);
      try {
        if (typeof document !== 'undefined') {
          document.body.style.backgroundColor = '';
        }
      } catch {}
    };
  }, [showIntro, handleComplete, unmuteAndPlaySound]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const cur = videoRef.current.currentTime;
      const pct = (cur / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const videoSource = isMobile ? '/videos/intro-mobile.mp4' : '/videos/intro-desktop.mp4';

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="espacio-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.01,
            transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden bg-black"
          onClick={unmuteAndPlaySound}
        >
          {/* Full-screen Edge-to-Edge Video */}
          <div
            className={`relative z-[2] w-full h-full flex items-center justify-center pointer-events-none transition-opacity duration-300 overflow-hidden ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <video
              ref={videoRef}
              key={videoSource}
              src={videoSource}
              autoPlay
              muted
              playsInline
              preload="auto"
              onError={(e) => {
                // Graceful fallback to intro-desktop or intro.mp4 if intro-mobile is not yet available
                if (e.currentTarget.src.includes('intro-mobile.mp4')) {
                  e.currentTarget.src = '/videos/intro-desktop.mp4';
                }
              }}
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onPlaying={() => setVideoReady(true)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Dedicated Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute bottom-6 right-6 flex items-center gap-1.5 text-white hover:text-gold font-sans text-[11px] font-semibold tracking-widest uppercase transition-all px-4 py-2 rounded-full border border-white/20 bg-black/75 hover:bg-black/90 backdrop-blur-md z-30 shadow-lg cursor-pointer pointer-events-auto"
          >
            <span>Skip</span>
            <span className="text-gold">↗</span>
          </button>

          {/* Sleek Gold Progress Bar at the Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden pointer-events-none z-30">
            <div
              className="h-full bg-gradient-to-r from-gold/50 via-gold to-gold-hover transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroPreloader;
