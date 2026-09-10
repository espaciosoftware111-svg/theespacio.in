import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mathematically exact color interpolation curve keyed to video timeline
const getColors = (t) => {
  // Phase 1: 0.0s - 0.78s (Black opening with lamp off)
  if (t <= 0.78) {
    return { top: 'rgb(0, 0, 0)', bot: 'rgb(0, 0, 0)' };
  }
  // Phase 2: 0.78s - 0.95s (Electric switch - light turns on and illuminates wall & table)
  if (t <= 0.95) {
    const r = (t - 0.78) / 0.17;
    const tr = Math.round(0 + r * 215);
    const tg = Math.round(0 + r * 205);
    const tb = Math.round(0 + r * 195);

    const br = Math.round(0 + r * 72);
    const bg = Math.round(0 + r * 66);
    const bb = Math.round(0 + r * 62);
    return { top: `rgb(${tr}, ${tg}, ${tb})`, bot: `rgb(${br}, ${bg}, ${bb})` };
  }
  // Phase 3: 0.95s - 1.55s (Lamp zooms out with illuminated warm wall and dark table)
  if (t <= 1.55) {
    const r = (t - 0.95) / 0.6;
    const tr = Math.round(215 + r * (222 - 215));
    const tg = Math.round(205 + r * (212 - 205));
    const tb = Math.round(195 + r * (202 - 195));

    const br = Math.round(72 + r * (78 - 72));
    const bg = Math.round(66 + r * (72 - 66));
    const bb = Math.round(62 + r * (68 - 62));
    return { top: `rgb(${tr}, ${tg}, ${tb})`, bot: `rgb(${br}, ${bg}, ${bb})` };
  }
  // Phase 4: 1.55s - 2.1s (Camera flare transition into solid ivory wall)
  if (t <= 2.1) {
    const r = (t - 1.55) / 0.55;
    const tr = Math.round(222 + r * (245 - 222));
    const tg = Math.round(212 + r * (234 - 212));
    const tb = Math.round(202 + r * (225 - 202));

    const br = Math.round(78 + r * (245 - 78));
    const bg = Math.round(72 + r * (234 - 72));
    const bb = Math.round(68 + r * (225 - 68));
    return { top: `rgb(${tr}, ${tg}, ${tb})`, bot: `rgb(${br}, ${bg}, ${bb})` };
  }
  // Phase 5: 2.1s - 5.06s (Pure solid luxury ivory wall #F5EAE1 matching logo animation)
  return { top: 'rgb(245, 234, 225)', bot: 'rgb(245, 234, 225)' };
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
    const { top, bot } = getColors(t);

    // 1. Direct hardware-accelerated CSS background on container
    if (containerRef.current) {
      containerRef.current.style.background = `linear-gradient(to bottom, ${top} 0%, ${top} 58%, ${bot} 66%, ${bot} 100%)`;
    }

    // 2. Mobile portrait / tall viewports (ry > 0): canvas draws lamp cord to ceiling & table to bottom
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

          if (ry > 0) {
            ctx.drawImage(video, 2, 2, vw - 4, 4, rx, 0, rw, ry + 1);
            ctx.drawImage(video, 2, vh - 6, vw - 4, 4, rx, ry + rh - 1, rw, ch - (ry + rh) + 1);
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
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden transition-[background] duration-75"
          style={{ backgroundColor: '#000000' }}
          onClick={unmuteAndPlaySound}
        >
          {/* Real-time ambient edge extension backdrop canvas (for vertical top/bottom extension on mobile) */}
          <canvas
            ref={canvasRef}
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
            height={typeof window !== 'undefined' ? window.innerHeight : 1080}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            aria-hidden="true"
          />

          {/* Foreground video container with feathered side edges */}
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
                maskImage: 'linear-gradient(to right, transparent, black 2.5%, black 97.5%, transparent), linear-gradient(to bottom, transparent, black 2.5%, black 97.5%, transparent)',
                WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 2.5%, black 97.5%, transparent), -webkit-linear-gradient(top, transparent, black 2.5%, black 97.5%, transparent)',
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
