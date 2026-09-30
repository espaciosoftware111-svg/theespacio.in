import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

// Tracks whether the intro preloader has played during active client-side session.
// This ensures navigating back to "/" inside the SPA does not re-lock the screen,
// but refreshing the page (F5 or new tab) will smoothly run the intro!
let hasIntroPlayedInSession = false;

export const IntroPreloader = () => {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    const pathname = window.location.pathname;
    const isHomePage = pathname === '/' || pathname === '' || pathname === '/index.html';
    return isHomePage && !hasIntroPlayedInSession;
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const hasTriggeredPlayRef = useRef(false);

  // Determine mobile vs desktop video source
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.innerHeight > window.innerWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const videoSource = isMobile ? '/videos/intro-mobile.mp4' : '/videos/intro-desktop.mp4';
  const fallbackSource = isMobile ? '/videos/intro-desktop.mp4' : '/videos/intro-mobile.mp4';

  const handleComplete = useCallback(() => {
    if (isEnded) return;
    setIsEnded(true);
    hasIntroPlayedInSession = true;
    try {
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = '';
      }
    } catch {}
    setShowIntro(false);
  }, [isEnded]);

  // Sound toggle handler
  const toggleSound = useCallback((e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (video) {
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  }, []);

  // Screen click handler: if video is paused, start it; if playing muted, unmute it; does NOT prematurely dismiss!
  const handleScreenClick = useCallback(() => {
    if (isEnded) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.defaultMuted = true;
      video.muted = true;
      video.play()
        .then(() => setHasStarted(true))
        .catch(() => handleComplete());
    } else if (video.muted) {
      // Unmute on tap so user hears sound
      video.muted = false;
      setIsMuted(false);
    }
  }, [isEnded, handleComplete]);

  // Video playback initialization (runs ONCE when showIntro is true)
  useEffect(() => {
    if (!showIntro || hasTriggeredPlayRef.current) return;
    hasTriggeredPlayRef.current = true;

    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasStarted(true);
          })
          .catch((err) => {
            console.warn('Autoplay waiting for interaction:', err?.message);
            // Retry muted explicitly
            video.muted = true;
            video.play()
              .then(() => setHasStarted(true))
              .catch(() => {
                // Keep preloader up with "Tap to Start" prompt
                setHasStarted(false);
              });
          });
      }
    }

    // Safety Watchdog: If playback doesn't complete within 7.5s (video is 5.08s), gracefully exit
    const watchdog = setTimeout(() => {
      handleComplete();
    }, 7500);

    // Dismiss immediately if the user navigates (clicks a nav link)
    const handleNavigation = () => handleComplete();
    window.addEventListener('popstate', handleNavigation);

    // Dismiss on any custom navigation event dispatched by nav links
    window.addEventListener('espacio_nav_click', handleNavigation);

    return () => {
      clearTimeout(watchdog);
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('espacio_nav_click', handleNavigation);
    };
  }, [showIntro, handleComplete]);

  // Update progress bar & trigger completion near the very end
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.duration && video.duration > 0) {
      const cur = video.currentTime;
      const dur = video.duration;
      const pct = Math.min((cur / dur) * 100, 100);
      setProgress(pct);

      // Smooth fade-out 0.2s before the end to avoid freezing on last frame
      if (cur >= dur - 0.2) {
        handleComplete();
      }
    }
  };

  // Video error fallback
  const handleVideoError = () => {
    const video = videoRef.current;
    if (video && !video.src.includes(fallbackSource)) {
      video.src = fallbackSource;
      video.play().catch(() => handleComplete());
    } else {
      handleComplete();
    }
  };

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="espacio-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[99999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden bg-black cursor-pointer"
          onClick={handleScreenClick}
        >
          {/* Full-screen Edge-to-Edge Video */}
          <div className="relative z-[2] w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={videoSource}
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              onPlay={() => setHasStarted(true)}
              onPlaying={() => setHasStarted(true)}
              onError={handleVideoError}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Center "Tap to Play" ONLY appears if autoplay was blocked by browser policy */}
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center gap-3 bg-black/70 backdrop-blur-md px-7 py-6 rounded-2xl border border-white/20 shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-gold text-black flex items-center justify-center shadow-lg animate-pulse">
                  <Play size={24} className="ml-1 fill-black" />
                </div>
                <span className="text-white font-sans text-sm font-semibold tracking-wider uppercase">
                  Tap Anywhere to Start
                </span>
              </div>
            </motion.div>
          )}

          {/* Bottom Left: Audio / Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="absolute bottom-6 left-6 flex items-center gap-2 text-white/90 hover:text-gold font-sans text-[11px] sm:text-[12px] font-medium tracking-wider uppercase transition-all px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/25 bg-black/75 hover:bg-black/90 backdrop-blur-md z-30 shadow-xl cursor-pointer pointer-events-auto"
            title={isMuted ? "Click to enable sound" : "Mute sound"}
          >
            {isMuted ? (
              <>
                <VolumeX size={15} className="text-white/70" />
                <span>Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 size={15} className="text-gold animate-pulse" />
                <span className="text-gold">Sound On</span>
              </>
            )}
          </button>

          {/* Bottom Right: Dedicated Enter / Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute bottom-6 right-6 flex items-center gap-2 text-white hover:text-gold font-sans text-[11px] sm:text-[12px] font-semibold tracking-widest uppercase transition-all px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/30 bg-black/80 hover:bg-black/95 backdrop-blur-md z-30 shadow-2xl cursor-pointer pointer-events-auto group"
          >
            <span>Enter Site</span>
            <span className="text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
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
