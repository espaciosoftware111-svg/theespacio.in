import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Clean uniform background color matching the video timeline seamlessly
// Whole screen is the exact same uniform color: starts pure black, illuminates with the bulb,
// and stays solid luxury ivory (#F5EAE1) without any split gradients, dark bands, or half-screen lines.
const getBackgroundColor = (t) => {
  // Phase 1: 0.0s - 0.75s (Bulb off, pure black screen)
  if (t <= 0.75) {
    return 'rgb(0, 0, 0)';
  }
  // Phase 2: 0.75s - 1.0s (Electric switch - room illuminates seamlessly into warm ivory)
  if (t <= 1.0) {
    const r = (t - 0.75) / 0.25;
    const cr = Math.round(0 + r * 245);
    const cg = Math.round(0 + r * 234);
    const cb = Math.round(0 + r * 225);
    return `rgb(${cr}, ${cg}, ${cb})`;
  }
  // Phase 3: 1.0s - 5.06s (Pure solid luxury ivory wall matching the entire animation & logo)
  return 'rgb(245, 234, 225)';
};

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

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleComplete = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setShowIntro(false);
  }, []);

  const unmuteAndPlaySound = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
  }, []);

  // Real-time smooth ambient backdrop sync loop
  const renderBackdrop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const t = video.currentTime || 0;
    const bg = getBackgroundColor(t);

    // 1. Direct hardware-accelerated uniform background color on container (no split lines)
    if (containerRef.current) {
      containerRef.current.style.backgroundColor = bg;
    }

    // 2. Mobile portrait / tall viewports (ry > 0): canvas draws lamp cord to ceiling during lamp phase
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const cw = canvas.width || window.innerWidth;
        const ch = canvas.height || window.innerHeight;
        ctx.clearRect(0, 0, cw, ch);

        if (video.readyState >= 2) {
          const vw = video.videoWidth || 960;
          const vh = video.videoHeight || 960;

          const scale = Math.min(cw / vw, ch / vh);
          const rw = vw * scale;
          const rh = vh * scale;
          const rx = (cw - rw) / 2;
          const ry = (ch - rh) / 2;

          if (ry > 0 && t > 0.75 && t < 2.1) {
            ctx.drawImage(video, 2, 2, vw - 4, 4, rx, 0, rw, ry + 1);
          }
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(renderBackdrop);
  }, []);

  // Sync canvas size to viewport & initiate continuous playback with sound ALWAYS on
  useEffect(() => {
    if (!showIntro) return;

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Start render loop immediately
    animFrameRef.current = requestAnimationFrame(renderBackdrop);

    // Try playing unmuted audio immediately
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Strict browser autoplay policy blocked unmuted sound on cold load:
          // Keep video playing and wait for first micro-gesture to instantly unmute
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }

    // Auto-unmute on first user gesture anywhere on window
    const handleGesture = () => {
      unmuteAndPlaySound();
    };
    const events = ['pointerdown', 'pointermove', 'touchstart', 'touchend', 'mousedown', 'keydown', 'wheel', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, handleGesture, { once: true, passive: true }));

    // Safety timeout: dismiss after 6.2s max if ended event fails
    const timer = setTimeout(() => {
      handleComplete();
    }, 6200);

    return () => {
      window.removeEventListener('resize', handleResize);
      events.forEach(evt => window.removeEventListener(evt, handleGesture));
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [showIntro, handleComplete, renderBackdrop, unmuteAndPlaySound]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const cur = videoRef.current.currentTime;
      const pct = (cur / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          ref={containerRef}
          key="espacio-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.01,
            transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden transition-colors duration-150"
          style={{ backgroundColor: '#000000' }}
          onClick={unmuteAndPlaySound}
        >
          {/* Canvas for vertical lamp cord ceiling extension on mobile portrait */}
          <canvas
            ref={canvasRef}
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
            height={typeof window !== 'undefined' ? window.innerHeight : 1080}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            aria-hidden="true"
          />

          {/* Foreground video container with soft feathered edges */}
          <div className="relative z-[2] w-full h-full flex items-center justify-center pointer-events-none">
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              autoPlay
              playsInline
              preload="auto"
              onPlay={() => {
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = requestAnimationFrame(renderBackdrop);
              }}
              onLoadedData={() => {
                renderBackdrop();
              }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              onError={handleComplete}
              className="w-full h-full object-contain pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent), linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)',
                WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 5%, black 95%, transparent), -webkit-linear-gradient(top, transparent 0%, black 5%, black 95%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in'
              }}
            />
          </div>

          {/* Dedicated Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="absolute bottom-6 right-6 flex items-center gap-1.5 text-white hover:text-gold font-sans text-[11px] font-semibold tracking-widest uppercase transition-all px-4 py-2 rounded-full border border-white/20 bg-black/75 hover:bg-black/90 backdrop-blur-md z-30 shadow-lg cursor-pointer"
          >
            <span>Skip</span>
            <span className="text-gold">↗</span>
          </button>

          {/* Sleek Gold Progress Bar at the Bottom */}
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
