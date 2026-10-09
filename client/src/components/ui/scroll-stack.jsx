import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./scroll-stack.css";

export const ScrollStackItem = ({
  children,
  index = 0,
  totalItems = 1,
  itemDistance = 40,
  itemClassName = ""
}) => {
  const ref = useRef(null);

  // Track scroll position of this specific card relative to the sticky pin line
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 84px", "end 84px"]
  });

  // Scale down subtly from 1.0 to 0.94 as it is covered by the next card
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  // Subtle brightness dimming as card is stacked beneath
  const dimOpacity = useTransform(scrollYProgress, [0, 0.8], [0, 0.1]);
  // Soft fade out when fully covered by the next card
  const opacity = useTransform(scrollYProgress, [0, 0.92, 1], [1, 1, 0]);

  // Use a clean unified sticky top below the fixed navbar
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const stickyTop = isMobile ? 68 : 110;

  return (
    <motion.div
      ref={ref}
      style={{
        position: "sticky",
        top: `${stickyTop}px`,
        scale,
        opacity,
        willChange: "transform, opacity",
        transformOrigin: "top center",
        zIndex: index + 1
      }}
      className={`scroll-stack-card relative ${itemClassName}`.trim()}
    >
      {children}
      <motion.div
        style={{ opacity: dimOpacity }}
        className="absolute inset-0 bg-black pointer-events-none rounded-[inherit]"
      />
    </motion.div>
  );
};

export const ScrollStack = ({
  children,
  itemDistance = 40,
  className = "",
  useWindowScroll = false,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const trackPadding = (totalItems - 1) * (isMobile ? 10 : 20);

  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ paddingBottom: `${trackPadding}px`, ...props.style }}
      {...props}
    >
      {childrenArray.map((child, index) => {
        // Pass index and totalItems props to each ScrollStackItem child
        return React.cloneElement(child, {
          index,
          totalItems,
          itemDistance
        });
      })}
    </div>
  );
};

export default ScrollStack;
