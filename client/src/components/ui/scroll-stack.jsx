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
  const filter = useTransform(scrollYProgress, [0, 0.8], ["brightness(1)", "brightness(0.92)"]);
  // Soft fade out when fully covered by the next card
  const opacity = useTransform(scrollYProgress, [0, 0.92, 1], [1, 1, 0]);

  // Use a clean unified sticky top below the fixed navbar
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const stickyTop = isMobile ? 84 : 110;

  return (
    <motion.div
      ref={ref}
      style={{
        position: "sticky",
        top: `${stickyTop}px`,
        scale,
        opacity,
        filter,
        willChange: "transform, opacity, filter",
        transformOrigin: "top center",
        zIndex: index + 1
      }}
      className={`scroll-stack-card ${itemClassName}`.trim()}
    >
      {children}
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
