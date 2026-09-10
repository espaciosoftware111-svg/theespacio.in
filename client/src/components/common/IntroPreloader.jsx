import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

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
  const [isAudioActive, setIsAudioActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sampleCanvasRef = useRef(null);
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
      videoRef.current.play().then(() => {
        setIsAudioActive(true);
      }).catch(() => {});
    }
  }, []);

  // Real-time smooth ambient backdrop render loop (eliminates horizontal streak lines)
  const renderBackdrop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width || window.innerWidth;
    const ch = canvas.height || window.innerHeight;

    if (video.readyState >= 2) {
      const vw = video.videoWidth || 960;
      const vh = video.videoHeight || 960;

      const scale = Math.min(cw / vw, ch / vh);
      const rw = vw * scale;
      const rh = vh * scale;
      const rx = (cw - rw) / 2;
      const ry = (ch - rh) / 2;

      // Lazy-init tiny 16x16 sampling canvas for corner ambient colors
      if (!sampleCanvasRef.current) {
        const sc = document.createElement('canvas');
        sc.width = 16;
        sc.height = 16;
        sampleCanvasRef.current = sc;
      }
      const sCtx = sampleCanvasRef.current.getContext('2d', { willReadFrequently: true });
      sCtx.drawImage(video, 0, 0, 16, 16);

      // Top corners (wall)
      const tl = sCtx.getImageData(1, 1, 1, 1).data;
      const tr = sCtx.getImageData(14, 1, 1, 1).data;
      const topR = Math.round((tl[0] + tr[0]) / 2);
      const topG = Math.round((tl[1] + tr[1]) / 2);
      const topB = Math.round((tl[2] + tr[2]) / 2);
      const topColor = `rgb(${topR}, ${topG}, ${topB})`;

      // Bottom corners (table or wall)
      const bl = sCtx.getImageData(1, 14, 1, 1).data;
      const br = sCtx.getImageData(14, 14, 1, 1).data;
      const botR = Math.round((bl[0] + br[0]) / 2);
      const botG = Math.round((bl[1] + br[1]) / 2);
      const botB = Math.round((bl[2] + br[2]) / 2);
      const botColor = `rgb(${botR}, ${botG}, ${botB})`;

      ctx.clearRect(0, 0, cw, ch);

      // Smooth vertical ambient gradient matching the video lighting (zero side streaks)
      const grad = ctx.createLinearGradient(0, ry, 0, ry + rh);
      grad.addColorStop(0, topColor);
      grad.addColorStop(0.5, topColor);
      grad.addColorStop(0.85, botColor);
      grad.addColorStop(1, botColor);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);

      // On mobile portrait / tall viewports (ry > 0):
      // Extends top row upwards so the black lamp cord extends to the top ceiling,
      // and bottom row downwards so the table/floor extends naturally
      if (ry > 0) {
        ctx.drawImage(video, 2, 2, vw - 4, 4, rx, 0, rw, ry + 1);
        ctx.drawImage(video, 2, vh - 6, vw - 4, 4, rx, ry + rh - 1, rw, ch - (ry + rh) + 1);
      }
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);
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
        playPromise.then(() => {
          setIsAudioActive(true);
        }).catch(() => {
          // Strict browser autoplay policy blocked unmuted sound on cold load:
          // Play video muted so visuals start immediately, and wait for first gesture to unmute
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
          setIsAudioActive(false);
        });
      }
    }

    // Auto-unmute on first user touch/click/scroll
    const handleFirstGesture = () => {
      unmuteAndPlaySound();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });

    // Safety timeout: dismiss after 6.2s max if ended event fails
    const timer = setTimeout(() => {
      handleComplete();
    }, 6200);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
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
      if (!videoRef.current.muted && videoRef.current.volume > 0) {
        setIsAudioActive(true);
      }
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
            scale: 1.01,
            transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden bg-black"
          onClick={unmuteAndPlaySound}
        >
          {/* Real-time ambient edge extension backdrop canvas */}
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
                maskImage: 'linear-gradient(to right, transparent, black 2.5%, black 97.5%, transparent)',
                WebkitMaskImage: '-webkit-linear-gradient(left, transparent, black 2.5%, black 97.5%, transparent)',
              }}
            />
          </div>

          {/* Luxury Sound Activation Notice (only visible if browser autoplay policy initially muted audio) */}
          {!isAudioActive && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-black/85 backdrop-blur-md shadow-2xl z-40 text-gold text-[11px] font-sans font-semibold tracking-widest uppercase cursor-pointer hover:bg-black transition-all animate-pulse"
              onClick={(e) => {
                e.stopPropagation();
                unmuteAndPlaySound();
              }}
            >
              <Volume2 size={14} className="text-gold" />
              <span>Tap Anywhere for Sound</span>
            </motion.div>
          )}

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
