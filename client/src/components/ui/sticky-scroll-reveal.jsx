import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform, motion, AnimatePresence } from "framer-motion";
import { ScrollStack, ScrollStackItem } from "./scroll-stack";

export const StickyScroll = ({ content, className }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  
  // Track scroll of the outer track relative to the window scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.floor(latest * cardLength),
      cardLength - 1
    );
    if (idx >= 0 && idx !== activeCard) {
      setActiveCard(idx);
    }
  });

  const CARD_HEIGHT = 340;

  // Direct 1:1 scroll transform for instant responsiveness without spring lag
  const textTranslateY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(cardLength - 1) * CARD_HEIGHT]
  );

  return (
    <>
      {/* Desktop Sticky Scroll (lg and above) - Full Screen Height */}
      <div
        ref={ref}
        className={`hidden lg:block relative w-full h-[200vh] ${className || ""}`}
      >
        {/* Sticky box locked in viewport occupying full screen height */}
        <div className="sticky top-[95px] w-full h-[82vh] flex justify-between gap-10 rounded-[32px] p-6 lg:p-10 bg-bg border border-ink-border/30 items-center shadow-2xl">
          
          {/* Left: interactive scrolling text column centered in middle */}
          <div 
            className="relative w-[40%] shrink-0 h-full overflow-hidden px-2 lg:px-6"
            style={{ paddingTop: `calc(41vh - ${CARD_HEIGHT / 2}px)` }}
          >
            {/* Top/Bottom gradient mask overlays for text fade */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg via-bg/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg via-bg/90 to-transparent z-10 pointer-events-none" />

            <motion.div 
              style={{ y: textTranslateY, willChange: 'transform' }}
              className="w-full relative"
            >
              {content.map((item, index) => (
                <motion.div
                  key={item.title + index}
                  style={{ height: `${CARD_HEIGHT}px` }}
                  className="flex flex-col justify-center text-left py-2"
                  animate={{
                    opacity: activeCard === index ? 1 : 0.12,
                    scale: activeCard === index ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <h3 className="font-display text-[26px] sm:text-[30px] lg:text-[38px] font-bold text-ink leading-[1.12]">
                    {item.title}
                  </h3>
                  <div className="mt-3.5 font-sans text-base lg:text-lg text-ink-soft leading-relaxed">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: full screen height animated image panel - pre-mounted for 120fps GPU transitions */}
          <div className="w-[58%] shrink-0 h-full rounded-[24px] bg-bg overflow-hidden border border-ink-border/40 shadow-2xl relative">
            {content.map((item, index) => (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  opacity: activeCard === index ? 1 : 0,
                  scale: activeCard === index ? 1 : 1.03,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  zIndex: activeCard === index ? 2 : 1,
                  willChange: 'opacity, transform',
                }}
                className="absolute inset-0 h-full w-full pointer-events-none"
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
