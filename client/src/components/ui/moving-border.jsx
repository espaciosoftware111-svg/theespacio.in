import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = "20",
  ry = "20",
  ...otherProps
}) => {
  const pathRef = useRef(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

export const Button = ({
  borderRadius = "20px",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 3500,
  className,
  ...otherProps
}) => {
  return (
    <Component
      className={`bg-transparent relative p-[1.5px] overflow-hidden ${containerClassName || ""}`}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: borderRadius }}
      >
        <MovingBorder duration={duration} rx="20" ry="20">
          <div
            className={`h-24 w-24 opacity-100 bg-[radial-gradient(circle,#dfc28d_0%,#c5a572_45%,transparent_70%)] ${borderClassName || ""}`}
          />
        </MovingBorder>
      </div>

      <div
        className={`relative bg-bg border border-ink-border/20 text-ink w-full h-full antialiased ${className || "flex items-center justify-center"}`}
        style={{
          borderRadius: `calc(${borderRadius} - 1.5px)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};
export default Button;
