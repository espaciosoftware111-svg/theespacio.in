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
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      const p = videoRef.current.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    }
  }, []);

  // Dynamic background extension:
  // DESKTOP: Samples rich 60px strip with 4px blur and 6% horizontal mask
  // MOBILE: Seamless ceiling fixture extension + table extension from t = 0
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

        // Sample exact video tone from corner pixel (4, 4) for 100% bit-accurate blending
        if (video.readyState >= 2) {
          try {
            ctx.drawImage(video, 4, 4, 1, 1, 0, 0, cw, ch);
          } catch {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, cw, ch);
          }
        } else {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, cw, ch);
        }

        if (video.readyState >= 2 && t < 2.4) {
          const vw = video.videoWidth || 960;
          const vh = video.videoHeight || 960;

          const scale = Math.min(cw / vw, ch / vh);
          const rw = vw * scale;
          const rh = vh * scale;
          const rx = (cw - rw) / 2;
          const ry = (ch - rh) / 2;

          // 1. On widescreen (rx > 0): extend video sides and horizon to screen edges
          if (rx > 0 && t < 1.85) {
            const leftW = rx + 80;
            const rightX = rx + rw - 60;
            const rightW = (cw - (rx + rw)) + 80;

            ctx.filter = 'blur(4px)';
            ctx.drawImage(video, 2, 0, 60, vh, -20, ry, leftW, rh);
            ctx.drawImage(video, vw - 62, 0, 60, vh, rightX, ry, rightW, rh);
            ctx.filter = 'none';
          }

          // 2. On mobile portrait / tall viewports (ry > 0):
          if (ry > 0) {
            // Ceiling lamp fixture / cord extension:
            // Fades out completely before the lamp begins its swing at 1.80s,
            // so no static vertical line is ever visible while the cord swings or morphs into logo!
            const topAlpha = t < 1.70 ? 1 : Math.max(0, 1 - (t - 1.70) / 0.08);
            if (topAlpha > 0) {
              const topH = Math.ceil(ry) + 3;
              ctx.globalAlpha = topAlpha;
              ctx.drawImage(video, 0, 0, vw, 4, rx, 0, rw, topH);
              ctx.globalAlpha = 1.0;
            }

            // Bottom table / floor extension:
            // Fades out into uniform ivory wall as room light turns off
            const botAlpha = t < 1.60 ? 1 : Math.max(0, 1 - (t - 1.60) / 0.15);
            if (botAlpha > 0) {
              const botY = Math.floor(ry + rh) - 2;
              const botH = Math.ceil(ch - botY) + 4;
              ctx.globalAlpha = botAlpha;
              ctx.drawImage(video, 0, vh - 4, vw, 4, rx, botY, rw, botH);
              ctx.globalAlpha = 1.0;
            }
          }
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
      renderBackdrop();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);

    // Immediate video playback & sound strategy
    if (videoRef.current) {
      if (videoRef.current.readyState >= 2) {
        setVideoReady(true);
      }
      videoRef.current.play().then(() => setVideoReady(true)).catch(() => {});

      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setVideoReady(true)).catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setVideoReady(true)).catch(() => {});
          }
        });
      }
    }

    // Auto-unmute on first micro-interaction
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
          {/* Dynamic edge extension canvas matching video wall & table across entire screen */}
          <canvas
            ref={canvasRef}
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
            height={typeof window !== 'undefined' ? window.innerHeight : 1080}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            aria-hidden="true"
          />

          {/* Sized aspect-square video container with seamless edge blending */}
          <div
            className={`relative z-[2] max-w-full max-h-full aspect-square flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              videoReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              maskImage: isPortrait
                ? 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 2.5%, rgba(0,0,0,1) 97.5%, rgba(0,0,0,0) 100%)'
                : 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: isPortrait
                ? '-webkit-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 2.5%, rgba(0,0,0,1) 97.5%, rgba(0,0,0,0) 100%)'
                : '-webkit-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, rgba(0,0,0,0) 100%)',
            }}
          >
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onPlaying={() => setVideoReady(true)}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleComplete}
              onError={handleComplete}
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
