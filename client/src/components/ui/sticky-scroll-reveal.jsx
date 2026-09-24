import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ScrollStack, ScrollStackItem } from "./scroll-stack";

export const StickyScroll = ({ content = [], className = "" }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const cardLength = content.length || 1;

  // GPU-accelerated motion values for continuous scroll tracking
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 300,
    damping: 32,
    mass: 0.15,
  });

  const CARD_HEIGHT = 340;

  // Direct 1:1 scroll transform for fluid physical scrolling of text
  const textTranslateY = useTransform(
    smoothProgress,
    [0, 1],
    [0, -(cardLength - 1) * CARD_HEIGHT]
  );

  // Synchronize scroll progress directly from viewport measurements & Lenis
  const updateScrollProgress = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || 800;
    const stickyTop = 80;
    const scrollableDistance = ref.current.offsetHeight - windowHeight;
    if (scrollableDistance <= 0) return;

    // How far we have scrolled past the sticky start point:
    const scrolledPastStart = -rect.top + stickyTop;
    const rawProgress = scrolledPastStart / scrollableDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));

    scrollProgress.set(clampedProgress);

    // Active card calculation evenly distributed across all cards
    if (cardLength > 1) {
      const step = 1 / (cardLength - 1);
      const calculatedIdx = Math.round(clampedProgress / step);
      const nextIdx = Math.max(0, Math.min(cardLength - 1, calculatedIdx));
      setActiveCard(nextIdx);
    } else {
      setActiveCard(0);
    }
  }, [cardLength, scrollProgress]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Immediate initial sync
    updateScrollProgress();

    // 1. Listen to Lenis smooth scroll
    if (window.lenis) {
      window.lenis.on("scroll", handleScroll);
    }

    // 2. Listen to native window scroll as guaranteed fallback
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    // Catch any late DOM layout shifts from preceding image loads
    const t1 = setTimeout(updateScrollProgress, 100);
    const t2 = setTimeout(updateScrollProgress, 400);
    const t3 = setTimeout(updateScrollProgress, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (window.lenis) {
        window.lenis.off("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateScrollProgress]);

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
            {content.map((item, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  opacity: activeCard === index ? 1 : 0,
                  scale: activeCard === index ? 1 : 1.05,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  zIndex: activeCard === index ? 2 : 1,
                  pointerEvents: activeCard === index ? 'auto' : 'none',
                  willChange: "opacity, transform",
                }}
                className="absolute inset-0 h-full w-full"
              >
                {item.content}
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile/Tablet list view (below lg) with stacked card scroll stack animation */}
      <div className="lg:hidden w-full px-2 sm:px-4 py-1">
        <ScrollStack useWindowScroll={true} itemDistance={25} className="w-full !h-auto !overflow-visible">
          {content.map((item, index) => (
            <ScrollStackItem 
              key={item.title + index} 
              itemClassName="bg-bg border border-ink-border/20 flex flex-col gap-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3.5 sm:p-5 pb-5 sm:pb-6 rounded-[24px] mb-3"
            >
              {/* Project Image Card */}
              <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden shadow-sm">
                {item.content}
              </div>
              {/* Description */}
              <div className="px-1.5 sm:px-2 text-left pt-1 pb-1">
                <h3 className="font-display text-[22px] sm:text-2xl font-bold text-ink mb-2 leading-snug">{item.title}</h3>
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
