import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ScrollStack, ScrollStackItem } from "./scroll-stack";

export const StickyScroll = ({ content = [], className = "" }) => {
  const [activeCard, setActiveCard] = useState(0);
  const activeCardRef = useRef(0);
  const ref = useRef(null);
  const cardLength = content.length || 1;

  // GPU-accelerated motion value for continuous scroll tracking
  const scrollProgress = useMotionValue(0);

  const CARD_HEIGHT = 340;

  // Direct 1:1 scroll transform synchronized with scroll position
  const textTranslateY = useTransform(
    scrollProgress,
    [0, 1],
    [0, -(cardLength - 1) * CARD_HEIGHT]
  );

  // Cached layout metrics ref to avoid getBoundingClientRect() forced reflow on scroll frames
  const metricsRef = useRef({ top: 0, height: 0, winHeight: 800 });

  const measureLayout = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    metricsRef.current = {
      top: rect.top + scrollY,
      height: ref.current.offsetHeight,
      winHeight: window.innerHeight || 800,
    };
  }, []);

  // Synchronize scroll progress without triggering DOM layout recalculation
  const updateScrollProgress = useCallback(() => {
    const { top, height, winHeight } = metricsRef.current;
    const scrollableDistance = height - winHeight;
    if (scrollableDistance <= 0) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const stickyTop = 80;
    const scrolledPastStart = scrollY - top + stickyTop;
    const rawProgress = scrolledPastStart / scrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    scrollProgress.set(clampedProgress);

    // Active card calculation with deadband hysteresis to eliminate flicker
    if (cardLength > 1) {
      const continuousIdx = clampedProgress * (cardLength - 1);
      const current = activeCardRef.current;
      
      let nextIdx = current;
      if (continuousIdx > current + 0.6) {
        nextIdx = Math.min(cardLength - 1, Math.round(continuousIdx));
      } else if (continuousIdx < current - 0.6) {
        nextIdx = Math.max(0, Math.round(continuousIdx));
      }

      if (nextIdx !== current) {
        activeCardRef.current = nextIdx;
        setActiveCard(nextIdx);
      }
    } else {
      if (activeCardRef.current !== 0) {
        activeCardRef.current = 0;
        setActiveCard(0);
      }
    }
  }, [cardLength, scrollProgress]);

  const isInViewRef = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          measureLayout();
          updateScrollProgress();
        }
      },
      { rootMargin: "400px 0px 400px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [measureLayout, updateScrollProgress]);

  useEffect(() => {
    measureLayout();
    updateScrollProgress();

    let rafId = null;
    const onScrollOrWheel = () => {
      if (!isInViewRef.current) return;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateScrollProgress();
          rafId = null;
        });
      }
    };

    const onResize = () => {
      measureLayout();
      onScrollOrWheel();
    };

    window.addEventListener("scroll", onScrollOrWheel, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    // Catch late layout shifts from image rendering
    const t1 = setTimeout(measureLayout, 150);
    const t2 = setTimeout(measureLayout, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [measureLayout, updateScrollProgress]);

  // Preload project images for instantaneous, flicker-free cross-fades
  useEffect(() => {
    content.forEach((item) => {
      const imgEl = item?.content?.props?.children;
      const src = imgEl?.props?.src;
      if (src) {
        const img = new Image();
        img.src = src;
        if (img.decode) img.decode().catch(() => {});
      }
    });
  }, [content]);

  const handleDotClick = (targetIndex) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const stickyTop = 80;
    const containerDocTop = rect.top + currentScrollY;
    const scrollableDistance = ref.current.offsetHeight - window.innerHeight;

    const targetProgress = cardLength > 1 ? targetIndex / (cardLength - 1) : 0;
    const targetScrollY = containerDocTop - stickyTop + (targetProgress * scrollableDistance) + 2;

    if (window.lenis) {
      window.lenis.scrollTo(targetScrollY, { duration: 0.85 });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    }
  };

  // Compact track height so there is NO excessive blank white space:
  // ~46vh of scroll per project card (276vh total for 6 cards)
  const trackHeight = `${Math.max(180, cardLength * 46)}vh`;

  return (
    <>
      {/* Desktop Sticky Scroll (lg and above) */}
      <div
        ref={ref}
        style={{ height: trackHeight }}
        className={`hidden lg:block relative w-full ${className || ""}`}
      >
        {/* Sticky box locked in viewport with explicit inline style to guarantee sticky pin */}
        <div 
          style={{ 
            position: 'sticky', 
            top: '80px',
            willChange: 'transform'
          }}
          className="sticky top-20 w-full h-[82vh] flex justify-between gap-8 xl:gap-12 rounded-[32px] p-6 lg:p-10 bg-bg border border-ink-border/30 items-center shadow-2xl"
        >
          
          {/* Left: active project details with luxury vertical scrolling transitions */}
          <div className="relative w-[44%] shrink-0 h-full flex flex-col justify-between py-3 px-2 lg:px-6">

            {/* Middle: Physical scrolling text column with centered alignment & gradient masks */}
            <div
              className="relative w-full flex-1 overflow-hidden"
              style={{
                paddingTop: `calc(41vh - 44px - ${CARD_HEIGHT / 2}px)`,
                paddingBottom: `calc(41vh - 44px - ${CARD_HEIGHT / 2}px)`,
              }}
            >
              {/* Top/Bottom gradient mask overlays for seamless luxury fade */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg via-bg/90 to-transparent z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg via-bg/90 to-transparent z-10 pointer-events-none" />

              <motion.div
                style={{ y: textTranslateY, willChange: "transform" }}
                className="w-full relative"
              >
                {content.map((item, index) => {
                  const isActive = activeCard === index;
                  return (
                    <motion.div
                      key={item.title + index}
                      style={{ height: `${CARD_HEIGHT}px` }}
                      onClick={() => handleDotClick(index)}
                      className={`flex flex-col justify-center text-left py-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "opacity-100 scale-100"
                          : "opacity-20 scale-[0.96] hover:opacity-40"
                      }`}
                    >
                      <h3 className="font-display text-[28px] sm:text-[32px] lg:text-[40px] font-bold text-ink leading-[1.12] tracking-tight">
                        {item.title}
                      </h3>
                      <div className="mt-3.5 font-sans text-base lg:text-[17px] text-ink-soft leading-relaxed">
                        {item.description}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>


          </div>

          {/* Right: full-height animated image showcase */}
          <div className="w-[54%] shrink-0 h-full rounded-[26px] bg-bg-dark overflow-hidden border border-ink-border/40 shadow-2xl relative">
            {content.map((item, index) => {
              const isCurrent = activeCard === index;
              const isNearby = Math.abs(activeCard - index) <= 1;
              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: isCurrent ? 1 : 0,
                  }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  style={{
                    zIndex: isCurrent ? 2 : 1,
                    pointerEvents: isCurrent ? 'auto' : 'none',
                    visibility: isNearby ? 'visible' : 'hidden',
                    willChange: "opacity",
                  }}
                  className="absolute inset-0 h-full w-full"
                >
                  {item.content}
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Mobile/Tablet view (below lg) with stacked card scroll stack animation */}
      <div className="lg:hidden w-full px-2 sm:px-4 py-2">
        <ScrollStack useWindowScroll={true} itemDistance={25} className="w-full !h-auto !overflow-visible">
          {content.map((item, index) => (
            <ScrollStackItem 
              key={item.title + index} 
              index={index}
              totalItems={content.length}
              itemClassName="bg-[#FAF8F5] border border-ink-border/25 flex flex-col gap-2.5 sm:gap-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.1)] p-3.5 sm:p-5 pb-6 sm:pb-8 rounded-[24px] mb-12 sm:mb-16"
            >
              {/* Project Image Card */}
              <div className="w-full aspect-[16/10] sm:aspect-[4/3] rounded-[18px] overflow-hidden shadow-sm bg-neutral-900">
                {item.content}
              </div>
              {/* Description */}
              <div className="px-1 sm:px-2 text-left pt-0.5 pb-1 sm:pb-2">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <h3 className="font-display text-[19px] sm:text-2xl font-bold text-ink leading-snug">{item.title}</h3>
                  <span className="font-sans text-[11px] font-bold text-gold bg-bg px-2.5 py-0.5 rounded-full border border-ink-border/20 shrink-0">
                    {String(index + 1).padStart(2, '0')} / {String(content.length).padStart(2, '0')}
                  </span>
                </div>
                {item.description}
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </>
  );
};

export default StickyScroll;
