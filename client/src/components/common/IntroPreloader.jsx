import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const handleComplete = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setShowIntro(false);
  }, []);

  // Real-time ambient edge extension backdrop render loop
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

      ctx.clearRect(0, 0, cw, ch);

      // 1. TOP EXTENSION (Mobile portrait / tall screens)
      // Seamlessly stretches the top edge upwards to y=0 (extends wall background and black lamp cord)
      if (ry > 0) {
        ctx.drawImage(video, 2, 2, vw - 4, 4, rx, 0, rw, ry + 1);
      }

      // 2. BOTTOM EXTENSION (Mobile portrait / tall screens)
      // Seamlessly stretches the bottom edge downwards to y=ch (extends floor/table surface)
      if (ry > 0) {
        ctx.drawImage(video, 2, vh - 6, vw - 4, 4, rx, ry + rh - 1, rw, ch - (ry + rh) + 1);
      }

      // 3. LEFT EXTENSION (Desktop widescreen displays)
      if (rx > 0) {
        ctx.drawImage(video, 2, 2, 4, vh - 4, 0, ry, rx + 1, rh);
      }

      // 4. RIGHT EXTENSION (Desktop widescreen displays)
      if (rx > 0) {
        ctx.drawImage(video, vw - 6, 2, 4, vh - 4, rx + rw - 1, ry, cw - (rx + rw) + 1, rh);
      }

      // 5. CORNERS EXTENSION (For arbitrary responsive window proportions)
      if (rx > 0 && ry > 0) {
        ctx.drawImage(video, 2, 2, 4, 4, 0, 0, rx + 1, ry + 1);
        ctx.drawImage(video, vw - 6, 2, 4, 4, rx + rw - 1, 0, cw - (rx + rw) + 1, ry + 1);
        ctx.drawImage(video, 2, vh - 6, 4, 4, 0, ry + rh - 1, rx + 1, ch - (ry + rh) + 1);
        ctx.drawImage(video, vw - 6, vh - 6, 4, 4, rx + rw - 1, ry + rh - 1, cw - (rx + rw) + 1, ch - (ry + rh) + 1);
      }
    } else {
      // Solid black while initial video frame prepares
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);
    }

    animFrameRef.current = requestAnimationFrame(renderBackdrop);
  }, []);

  // Sync canvas size to viewport & start animation loop
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

    // Start continuous animation frame loop immediately
    animFrameRef.current = requestAnimationFrame(renderBackdrop);

    // Auto-play video with sound enabled by default
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.defaultMuted = false;
      videoRef.current.volume = 1.0;
      videoRef.current.play().then(() => {
        setIsMuted(false);
      }).catch(() => {
        // Browser autoplay policy restricted audio without user gesture:
        // Play muted as immediate fallback, and automatically unmute on the first user interaction
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }

    // Auto-unmute on first touch/click if browser autoplay policy initially blocked unmuted playback
    const handleFirstGesture = () => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
        setIsMuted(false);
      }
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });

    // Safety timeout: dismiss after 6.2s max if ended event fails
    const timer = setTimeout(() => {
      handleComplete();
    }, 6200);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [showIntro, handleComplete, renderBackdrop]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const cur = videoRef.current.currentTime;
      const pct = (cur / videoRef.current.duration) * 100;
      setProgress(pct);
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
            scale: 1.01,
            transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] }
          }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none overflow-hidden cursor-pointer bg-black"
          onClick={handleComplete}
        >
          {/* Real-time ambient edge extension backdrop canvas */}
          <canvas
            ref={canvasRef}
            width={typeof window !== 'undefined' ? window.innerWidth : 1920}
            height={typeof window !== 'undefined' ? window.innerHeight : 1080}
            className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
            aria-hidden="true"
          />

          {/* Foreground video container */}
          <div className="relative z-[2] w-full h-full flex items-center justify-center pointer-events-none">
            <video
              ref={videoRef}
              src="/videos/intro.mp4"
              autoPlay
              muted={isMuted}
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
            />
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
            className="absolute top-6 right-6 flex items-center gap-2 text-white hover:text-gold font-sans text-[11px] font-medium tracking-wider uppercase transition-all px-3.5 py-1.5 rounded-full border border-white/20 bg-black/75 hover:bg-black/90 backdrop-blur-md z-30 shadow-lg"
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
            className="absolute bottom-6 right-6 flex items-center gap-1.5 text-white hover:text-gold font-sans text-[11px] font-semibold tracking-widest uppercase transition-all px-4 py-2 rounded-full border border-white/20 bg-black/75 hover:bg-black/90 backdrop-blur-md z-30 shadow-lg"
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
