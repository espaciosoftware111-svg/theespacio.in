import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

/**
 * Preloads image URLs into browser memory and pre-decodes bitmap assets
 * before they are rendered in transitions.
 */
const preloadImages = (urls = []) => {
  if (!Array.isArray(urls)) return;
  urls.forEach((url) => {
    if (!url || typeof url !== 'string') return;
    const img = new Image();
    img.src = url;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });
};

const HeroSlideshow = memo(({
  images = [],
  mobileImages = [],
  intervalMs = 2800,
  initialIntervalMs = 1000,
  transitionDuration = 1.0,
  className = "absolute inset-0 w-full h-full object-cover",
  onIndexChange,
  showGradient = true,
  gradientClassName = "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"
}) => {
  const desktopList = Array.isArray(images) && images.length > 0 ? images : [];
  const mobileList = Array.isArray(mobileImages) && mobileImages.length > 0 ? mobileImages : desktopList;
  const slideCount = Math.max(desktopList.length, mobileList.length);

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Preload both mobile and desktop hero slides immediately so transitions are instantaneous
  useEffect(() => {
    if (slideCount > 0) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
      const targetList = isMobile ? mobileList : desktopList;
      const urlsToPreload = targetList.map(url => getOptimizedImageUrl(url, isMobile ? 900 : 1600, 88));
      preloadImages(urlsToPreload);
    }
  }, [slideCount]);

  // Notify parent on index change
  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  const containerRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(true);

  // Pause slideshow animation when hero is offscreen to save 100% GPU/CPU during page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Main slideshow timer: runs only when in viewport, pauses when offscreen
  useEffect(() => {
    if (slideCount <= 1 || !isInViewport) return;

    let initTimeout;
    const startRegularTimer = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slideCount);
      }, intervalMs);
    };

    const firstDelay = Math.min(initialIntervalMs ?? 1500, intervalMs);

    initTimeout = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
      startRegularTimer();
    }, firstDelay);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(initTimeout);
        clearInterval(timerRef.current);
      } else {
        startRegularTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [slideCount, intervalMs, isInViewport]);

  if (slideCount === 0) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none rounded-[inherit]">
      {Array.from({ length: slideCount }).map((_, idx) => {
        const isActive = idx === (currentIndex % slideCount);
        const dSrc = desktopList[idx % desktopList.length];
        const mSrc = mobileList[idx % mobileList.length] || dSrc;

        const desktopOptimized = getOptimizedImageUrl(dSrc, 1600, 88);
        const mobileOptimized = getOptimizedImageUrl(mSrc, 900, 88);

        return (
          <motion.picture
            key={`hero-slide-${idx}`}
            initial={idx === 0 ? { opacity: 1 } : { opacity: 0 }}
            animate={{
              opacity: isActive ? 1 : 0,
            }}
            transition={{
              duration: transitionDuration,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="rounded-[inherit] overflow-hidden"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: isActive ? 2 : 1,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              overflow: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
            }}
          >
            {mobileOptimized && (
              <source media="(max-width: 1023px)" srcSet={mobileOptimized} />
            )}
            <img
              src={desktopOptimized || mobileOptimized}
              alt="ESPACIO Hero Showcase"
              decoding={idx === 0 ? 'sync' : 'async'}
              loading="eager"
              fetchPriority={idx === 0 ? "high" : "auto"}
              className="w-full h-full object-cover object-center select-none pointer-events-none rounded-[inherit]"
              style={{
                imageRendering: 'high-quality',
              }}
            />
          </motion.picture>
        );
      })}

      {showGradient && <div className={gradientClassName} />}
    </div>
  );
});

HeroSlideshow.displayName = 'HeroSlideshow';

export default HeroSlideshow;
