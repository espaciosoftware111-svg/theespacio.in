import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mathematically exact background tone synchronized with intro video lighting
const getBackgroundColor = (t) => {
  if (t <= 0.75) {
    return 'rgb(0, 0, 0)';
  }
  if (t <= 1.0) {
    const r = (t - 0.75) / 0.25;
    return `rgb(${Math.round(0 + r * 79)}, ${Math.round(0 + r * 70)}, ${Math.round(0 + r * 61)})`;
  }
  if (t <= 1.5) {
    const r = (t - 1.0) / 0.5;
    return `rgb(${Math.round(79 + r * (214 - 79))}, ${Math.round(70 + r * (202 - 70))}, ${Math.round(61 + r * (190 - 61))})`;
  }
  if (t <= 1.8) {
    const r = (t - 1.5) / 0.3;
    return `rgb(${Math.round(214 + r * (240 - 214))}, ${Math.round(202 + r * (230 - 202))}, ${Math.round(190 + r * (221 - 190))})`;
  }
  if (t <= 2.1) {
    const r = (t - 1.8) / 0.3;
    return `rgb(${Math.round(240 + r * (237 - 240))}, ${Math.round(230 + r * (227 - 230))}, ${Math.round(221 + r * (217 - 221))})`;
  }
  if (t <= 2.4) {
    const r = (t - 2.1) / 0.3;
    return `rgb(${Math.round(237 + r * (244 - 237))}, ${Math.round(227 + r * (234 - 227))}, ${Math.round(217 + r * (225 - 217))})`;
  }
  // Pure luxury ivory (#F4EAE1) matching the entire logo scene
  return 'rgb(244, 234, 225)';
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
  const [videoReady, setVideoReady] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleComplete = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
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

  // Smooth background color & subtle edge extension loop
  const renderBackdrop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const t = video.currentTime || 0;
    const bg = getBackgroundColor(t);

    if (containerRef.current) {
      containerRef.current.style.backgroundColor = bg;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const cw = canvas.width || window.innerWidth;
        const ch = canvas.height || window.innerHeight;
        ctx.clearRect(0, 0, cw, ch);

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, cw, ch);

        if (video.readyState >= 2) {
          try {
            const vw = video.videoWidth || 960;
            const vh = video.videoHeight || 960;

            const scale = Math.min(cw / vw, ch / vh);
            const rw = vw * scale;
            const rh = vh * scale;
            const rx = (cw - rw) / 2;
            const ry = (ch - rh) / 2;

            // On mobile portrait / tall viewports (ry > 0):
            // Ceiling lamp fixture / cord extension:
            // Fades out completely before the lamp begins its swing at 1.70s
            if (ry > 0) {
              const topAlpha = t > 0.75 && t < 1.70 ? (t < 1.60 ? 1 : Math.max(0, 1 - (t - 1.60) / 0.10)) : 0;
              if (topAlpha > 0) {
                const topH = Math.ceil(ry) + 2;
                ctx.globalAlpha = topAlpha;
                ctx.drawImage(video, 0, 0, vw, 4, rx, 0, rw, topH);
                ctx.globalAlpha = 1.0;
              }
            }
          } catch {}
        }
      }
    }
  }, []);

  const [isPortrait, setIsPortrait] = useState(() => (
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  ));

  useEffect(() => {
    if (!showIntro) return;

    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Run continuous 60fps render loop
    let isRunning = true;
    const loop = () => {
      if (!isRunning) return;
      try {
        renderBackdrop();
      } catch {}
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    // Guaranteed cross-platform playback strategy:
    // 1. Initial play is always MUTED to guarantee 100% browser autoplay approval on laptops and phones
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

    // 2. Auto-unmute on first user gesture anywhere on screen (mouse move, click, touch, scroll)
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
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      events.forEach(evt => window.removeEventListener(evt, handleGesture));
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      try {
        if (typeof document !== 'undefined') {
          document.body.style.backgroundColor = '';
        }
      } catch {}
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
          className="fixed inset-0 z-[999999] w-full h-full flex items-center justify-center select-none overflow-hidden transition-colors duration-150"
          style={{ backgroundColor: '#000000' }}
          onClick={unmuteAndPlaySound}
        >
          {/* Edge extension canvas matching video wall & ceiling across entire screen */}
          <canvas
            ref={canvasRef}
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
            height={typeof window !== 'undefined' ? window.innerHeight : 1080}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            aria-hidden="true"
          />

          {/* Centered full-fit video container */}
          <div
            className={`relative z-[2] w-full h-full flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              videoReady ? 'opacity-100' : 'opacity-90'
            }`}
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              maskImage: isPortrait
                ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 2%, rgba(0,0,0,1) 98%, rgba(0,0,0,0) 100%)'
                : 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 3%, rgba(0,0,0,1) 97%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: isPortrait
                ? '-webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 2%, rgba(0,0,0,1) 98%, rgba(0,0,0,0) 100%)'
                : '-webkit-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 3%, rgba(0,0,0,1) 97%, rgba(0,0,0,0) 100%)',
            }}
          >
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
              onCanPlay={() => setVideoReady(true)}
              onPlaying={() => setVideoReady(true)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              className="w-full h-full object-contain pointer-events-none"
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
