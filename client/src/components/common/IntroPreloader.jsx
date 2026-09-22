import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

export const IntroPreloader = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.innerHeight > window.innerWidth;
  });

  const videoRef = useRef(null);

  const handleComplete = useCallback(() => {
    setIsEnded(true);
    try {
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = '';
      }
    } catch {}
    setShowIntro(false);
  }, []);

  const handlePlayOrUnmute = useCallback(() => {
    if (isEnded) return;
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      video.play()
        .then(() => {
          setHasStarted(true);
        })
        .catch(() => {
          // If browser policy requires muted playback first
          video.muted = true;
          video.play()
            .then(() => {
              setHasStarted(true);
            })
            .catch((e) => console.warn('Play retry notice:', e));
        });
    }
  }, [isEnded]);

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

      // Attempt automatic playback
      video.play()
        .then(() => {
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn('Browser requires tap to play:', err.message);
        });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        if (typeof document !== 'undefined') {
          document.body.style.backgroundColor = '';
        }
      } catch {}
    };
  }, [showIntro]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration;
      const pct = (cur / dur) * 100;
      setProgress(pct);

      // Transition smoothly right at the end of the video
      if (dur > 0 && cur >= dur - 0.25) {
        handleComplete();
      }
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
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden bg-black cursor-pointer"
          onClick={handlePlayOrUnmute}
        >
          {/* Full-screen Edge-to-Edge Video */}
          <div className="relative z-[2] w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              key={videoSource}
              src={videoSource}
              autoPlay
              muted
              playsInline
              preload="auto"
              onPlay={() => setHasStarted(true)}
              onError={(e) => {
                if (e.currentTarget.src.includes('intro-mobile.mp4')) {
                  e.currentTarget.src = '/videos/intro-desktop.mp4';
                }
              }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          {/* Top Branding Hint */}
          <div className="absolute top-6 left-6 z-30 pointer-events-none opacity-85">
            <span className="text-white/90 font-sans text-[11px] tracking-[0.25em] uppercase font-semibold">
              ESPACIO • Turnkey Interiors
            </span>
          </div>

          {/* Center "Tap to Play" ONLY appears initially if autoplay was blocked - NEVER AT THE END */}
          {!hasStarted && !isEnded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/20 shadow-2xl">
                <div className="w-14 h-14 rounded-full bg-gold/90 text-black flex items-center justify-center shadow-lg animate-pulse">
                  <Play size={24} className="ml-1 fill-black" />
                </div>
                <span className="text-white font-sans text-sm font-semibold tracking-wider uppercase">
                  Tap Anywhere to Start
                </span>
              </div>
            </motion.div>
          )}

          {/* Dedicated Enter / Skip Button */}
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
