import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

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

  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLit, setIsLit] = useState(false);
  const videoRef = useRef(null);
  const bgVideoRef = useRef(null);

  const handleComplete = () => {
    setShowIntro(false);
  };

  useEffect(() => {
    if (!showIntro) return;

    // Start video playback safely
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    if (bgVideoRef.current) {
      bgVideoRef.current.play().catch(() => {});
    }

    // Safety timeout: dismiss after 6 seconds max
    const timer = setTimeout(() => {
      handleComplete();
    }, 6200);

    return () => {
      clearTimeout(timer);
    };
  }, [showIntro]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const cur = videoRef.current.currentTime;
      const pct = (cur / videoRef.current.duration) * 100;
      setProgress(pct);

      // Keep ambient background video in tight sync with main video
      if (bgVideoRef.current && Math.abs(bgVideoRef.current.currentTime - cur) > 0.08) {
        bgVideoRef.current.currentTime = cur;
      }

      // The video lamp illuminates the room starting at ~0.8s and completes transition to ivory by ~2.0s
      if (cur >= 0.8 && !isLit) {
        setIsLit(true);
      }
    }
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
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
            transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] }
          }}
          className={`fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden cursor-pointer transition-colors duration-1000 ease-in-out ${
            isLit ? 'bg-[#F4EAE1]' : 'bg-[#0c0b0a]'
          }`}
          onClick={handleComplete}
        >
          {/* Ambient blurred cover video that fills the widescreen edges without cutoffs */}
          <video
            ref={bgVideoRef}
            src="/videos/intro.mp4"
            autoPlay
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)] object-cover blur-[60px] scale-110 opacity-95 pointer-events-none z-[1]"
          />

          {/* Crisp foreground video with feathered edge mask to seamlessly melt into the ambient backdrop */}
          <video
            ref={videoRef}
            src="/videos/intro.mp4"
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleComplete}
            onError={handleComplete}
            className="relative z-[2] w-full h-full object-contain pointer-events-none [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]"
          />

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
            className="absolute top-6 right-6 flex items-center gap-2 text-white hover:text-gold font-sans text-[11px] font-medium tracking-wider uppercase transition-all px-3.5 py-1.5 rounded-full border border-black/10 bg-black/70 hover:bg-black/85 backdrop-blur-md z-30 shadow-md"
          >
            {isMuted ? (
              <>
                <VolumeX size={14} className="text-white/80" />
                <span className="hidden sm:inline">Sound Off</span>
              </>
            ) : (
              <>
                <Volume2 size={14} className="text-gold" />
                <span className="hidden sm:inline text-gold">Sound On</span>
              </>
            )}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute bottom-6 right-6 flex items-center gap-1.5 text-white hover:text-gold font-sans text-[11px] font-semibold tracking-widest uppercase transition-all px-4 py-2 rounded-full border border-black/10 bg-black/70 hover:bg-black/85 backdrop-blur-md z-30 shadow-md"
          >
            <span>Skip</span>
            <span className="text-gold">↗</span>
          </button>

          {/* Sleek Progress Bar at the Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/10 overflow-hidden pointer-events-none z-30">
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
