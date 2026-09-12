import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimationFrame, useInView } from "framer-motion";

export const HeroParallax = ({ products = [] }) => {
  const baseFirst = products.slice(0, 8);
  const baseSecond = products.slice(8, 16);
  // Duplicate 3x for seamless infinite marquee loop
  const firstRow = [...baseFirst, ...baseFirst, ...baseFirst];
  const secondRow = [...baseSecond, ...baseSecond, ...baseSecond];

  return (
    <div className="w-full pt-0 pb-12 md:pb-16 overflow-hidden antialiased relative flex flex-col">
      <Header />
      <div className="w-full space-y-6 md:space-y-8 overflow-hidden">
        {/* Row 1: Auto-scrolling Leftwards + Manual Drag/Swipe/Wheel */}
        <MarqueeRow
          products={firstRow}
          direction="left"
          speed={1.248}
          rowId="r1"
        />

        {/* Row 2: Auto-scrolling Rightwards + Manual Drag/Swipe/Wheel */}
        <MarqueeRow
          products={secondRow}
          direction="right"
          speed={1.248}
          rowId="r2"
        />
      </div>
    </div>
  );
};

const MarqueeRow = ({ products, direction = "left", speed = 1.248, rowId }) => {
  const outerRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(outerRef, { margin: "200px" });
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartMotionX = useRef(0);
  const singleSetWidth = useRef(0);

  const measure = useCallback(() => {
    if (containerRef.current) {
      const totalWidth = containerRef.current.scrollWidth;
      // products has 3 duplicate sets
      singleSetWidth.current = totalWidth / 3;
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products, measure]);

  useAnimationFrame((_, delta) => {
    if (isDragging || !isInView) return;

    // Smooth auto-scroll delta
    const currentSpeed = isHovered ? speed * 0.35 : speed;
    const move = currentSpeed * (delta / 16.67);

    let currentX = x.get();
    if (direction === "left") {
      currentX -= move;
      if (singleSetWidth.current > 0 && Math.abs(currentX) >= singleSetWidth.current) {
        currentX += singleSetWidth.current;
      }
    } else {
      currentX += move;
      if (singleSetWidth.current > 0 && currentX >= 0) {
        currentX -= singleSetWidth.current;
      }
    }
    x.set(currentX);
  });

  const onPointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    dragStartMotionX.current = x.get();
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    const diff = clientX - dragStartX.current;
    let newX = dragStartMotionX.current + diff;

    if (singleSetWidth.current > 0) {
      if (newX > 0) newX -= singleSetWidth.current;
      if (newX < -singleSetWidth.current * 2) newX += singleSetWidth.current;
    }
    x.set(newX);
  };

  const onPointerUp = () => {
    setIsDragging(false);
  };

  const onWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      let newX = x.get() - e.deltaX * 0.8;
      if (singleSetWidth.current > 0) {
        if (newX > 0) newX -= singleSetWidth.current;
        if (newX < -singleSetWidth.current * 2) newX += singleSetWidth.current;
      }
      x.set(newX);
    }
  };

  return (
    <div
      ref={outerRef}
      className="w-full overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <motion.div
        ref={containerRef}
        style={{ x }}
        className="flex flex-nowrap space-x-3.5 sm:space-x-6 md:space-x-8 w-max will-change-transform py-1"
      >
        {products.map((product, idx) => (
          <ProductCard
            product={product}
            key={`${product.title}-${rowId}-${idx}`}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="w-full relative pt-2 pb-5 sm:pt-6 sm:pb-8 md:pt-12 md:pb-16 px-4 sm:px-6 md:px-12 left-0 top-0 z-20 bg-bg">
      <div className="max-w-[1440px] mx-auto text-left">
        <span className="font-sans text-[10.5px] sm:text-[11px] uppercase tracking-[0.2em] text-[#9E7B3B] font-bold">
          Bespoke Design Services
        </span>
        <h1 className="font-display text-[clamp(26px,3.5vw,52px)] font-medium leading-[1.08] tracking-tight text-ink mt-2 sm:mt-4">
          We Sculpt <br />Inspiring Spaces
        </h1>
        <p className="max-w-xl font-sans text-[13px] sm:text-[14px] text-ink font-medium mt-2.5 sm:mt-5 leading-relaxed">
          From conceptual 3D visualizations to master turnkey handovers, ESPACIO brings unmatched structural excellence and premium material sourcing to residential, commercial, and modular kitchen spaces.
        </p>
      </div>
    </div>
  );
};

export const ProductCard = ({ product }) => {
  const optimizedThumbnail = typeof product?.thumbnail === 'string' && product.thumbnail.startsWith('/images/') && /\.(jpe?g|png)$/i.test(product.thumbnail)
    ? product.thumbnail.replace(/\.(jpe?g|png)$/i, '.webp')
    : product?.thumbnail;

  return (
    <div
      key={product.title}
      className="group/product h-40 sm:h-52 md:h-64 w-[14rem] sm:w-[20rem] md:w-[28rem] lg:w-[30rem] relative flex-shrink-0 rounded-[14px] sm:rounded-[18px] md:rounded-[20px] overflow-hidden shadow-md md:shadow-lg transition-transform duration-300 hover:-translate-y-1.5 bg-stone-900 select-none cursor-grab active:cursor-grabbing"
    >
      <div className="block h-full w-full select-none pointer-events-none" draggable="false">
        <img
          src={optimizedThumbnail}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=65&fm=webp";
          }}
          className="object-cover object-center absolute h-full w-full inset-0 transition-transform duration-700 group-hover/product:scale-105 select-none pointer-events-none"
          style={{ imageRendering: "auto", backfaceVisibility: "hidden" }}
          draggable="false"
          alt={product.title}
        />
      </div>
      {/* Smooth bottom gradient vignette for crisp text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none transition-opacity duration-300 group-hover/product:from-black/95" />
      <div className="absolute bottom-3 sm:bottom-4.5 left-3 sm:left-5 right-3 sm:right-5 text-white z-10 select-none pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1.5">
          <span className="text-[8.5px] sm:text-[10.5px] font-sans font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#C9A96E]">
            {product.category || "INTERIOR SERVICE"}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-[8.5px] sm:text-[10.5px] font-sans font-medium tracking-[0.12em] text-white/70 uppercase">
            ESPACIO
          </span>
        </div>
        <h2 className="font-sans text-[13px] sm:text-[15.5px] md:text-[17px] font-semibold text-white leading-snug tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] line-clamp-1">
          {product.title}
        </h2>
      </div>
    </div>
  );
};
