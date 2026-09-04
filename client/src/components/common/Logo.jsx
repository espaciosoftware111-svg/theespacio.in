import React from 'react';
import { motion } from 'framer-motion';

/* ─── colour tokens ──────────────────────────────────────────────── */
const CREAM  = '#F3EEE3';
const INK    = '#171512';
const GOLD   = '#A98A54';
const BULB   = '#FFC46B';

/* ═══════════════════════════════════════════════════════════════════
   LARGE  – disc logo (preloader / hero), 420×420 viewBox
═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   LARGE  – disc logo (preloader / hero), 420×420 viewBox
═══════════════════════════════════════════════════════════════════ */
const LargeLogo = ({ scrolled, onComplete }) => {
  const ink  = scrolled ? INK     : '#ffffff';
  const gold = scrolled ? GOLD    : '#C9A96E';

  // Precision optical kerning for ESPACIO centered at x = 210
  const letterPositions = [
    { ch: 'E', x: 82 },
    { ch: 'S', x: 125 },
    { ch: 'P', x: 168 },
    { ch: 'A', x: 210 },
    { ch: 'C', x: 252 },
    { ch: 'I', x: 290 },
    { ch: 'O', x: 330 },
  ];

  return (
    <svg
      width="340"
      height="340"
      viewBox="0 0 420 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ userSelect: 'none' }}
      className="w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] max-w-[85vw] max-h-[45vh]"
    >
      <defs>
        <radialGradient id="glowGradLarge" cx="50%" cy="30%" r="60%">
          <stop offset="0%"   stopColor={BULB} stopOpacity="1" />
          <stop offset="45%"  stopColor={BULB} stopOpacity="0.45" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="spotlightGlowLarge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BULB} stopOpacity="0.5" />
          <stop offset="30%" stopColor={BULB} stopOpacity="0.25" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── 1. BULB GLOW & SPOTLIGHT (Warm ambient illumination under lamp) ── */}
      <motion.ellipse
        cx="151" cy="150" rx="38" ry="24"
        fill="url(#glowGradLarge)"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ 
          opacity: [0, 0.85, 0.4, 0.95, 0.6, 0.9, 0.85],
          scale: [0.7, 1.05, 0.95, 1.1, 1, 1.05, 1]
        }}
        transition={{ delay: 1.1, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Spotlight cone extending downward */}
      <motion.path
        d="M 133 136 L 90 230 H 212 L 169 136 Z"
        fill="url(#spotlightGlowLarge)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 0.9, 0.7, 0.95, 0.75, 0.85] }}
        transition={{ delay: 1.1, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ pointerEvents: 'none' }}
      />

      {/* ── 2. HANGING LAMP FIXTURE (Top Left) ── */}
      {/* T-bar horizontal top */}
      <motion.path
        d="M120 70 H182"
        stroke={ink} strokeWidth="7" strokeLinecap="square"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* T-stem vertical line */}
      <motion.path
        d="M151 70 V108"
        stroke={ink} strokeWidth="7" strokeLinecap="square"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
      />
      {/* Lamp cone shade */}
      <motion.path
        d="M151 108 L133 136 H169 Z"
        fill={ink}
        style={{ transformOrigin: '151px 108px' }}
        initial={{ opacity: 0, y: -12, scaleY: 0.6 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        transition={{ delay: 0.7, duration: 0.55, ease: [0.2, 0.9, 0.3, 1.2] }}
      />
      {/* Bulb light filament */}
      <motion.line
        x1="140" y1="138" x2="162" y2="138"
        stroke={BULB} strokeWidth="3" strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1, 0.7, 1] }}
        transition={{ delay: 1.1, duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── 3. OUTER FRAMING CORNERS ── */}
      {/* Top-Right Bracket: Starts right of T-bar, goes right to corner, then down to bottom right */}
      <motion.path
        d="M204 70 H300 V250"
        fill="none" stroke={ink} strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.35, duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* Bottom-Left Bracket: Starts below lamp, goes down to bottom left corner, then across to bottom right */}
      <motion.path
        d="M120 160 V250 H300"
        fill="none" stroke={ink} strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      />

      {/* ── 4. ARCHITECTURAL 'E' GLYPH (Inside Lower Right) ── */}
      <motion.path
        d="M236 152 H280 M236 152 V226 M236 189 H270 M236 226 H280"
        fill="none" stroke={ink} strokeWidth="7" strokeLinecap="square" strokeLinejoin="miter"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.65, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* ── 5. WORDMARK ESPACIO ── */}
      {letterPositions.map(({ ch, x }, i) => (
        <motion.text
          key={i}
          fontSize="46"
          fontFamily="'Montserrat', 'Gotham Medium', 'Gotham Book', sans-serif"
          fontWeight="600"
          fill={ink}
          textAnchor="middle"
          x={x}
          y="306"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 + i * 0.07, duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
        >
          {ch}
        </motion.text>
      ))}

      {/* ── 6. GOLD DIVIDER & ROTATED DIAMOND ── */}
      {/* Left arm */}
      <motion.line
        x1="86" y1="332" x2="186" y2="332"
        stroke={gold} strokeWidth="1.8"
        style={{ transformOrigin: '186px 332px' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 2.1, duration: 0.45, ease: 'easeOut' }}
      />
      {/* Central Gold Diamond */}
      <motion.rect
        x="206.5" y="328.5" width="7" height="7"
        fill={gold}
        style={{ transformOrigin: '210px 332px', transform: 'rotate(45deg)' }}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.3, duration: 0.35, ease: [0, 0, 0.4, 1.4] }}
      />
      {/* Right arm */}
      <motion.line
        x1="234" y1="332" x2="334" y2="332"
        stroke={gold} strokeWidth="1.8"
        style={{ transformOrigin: '234px 332px' }}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 2.1, duration: 0.45, ease: 'easeOut' }}
      />

      {/* ── 7. SUBTITLE: INTERIORS AND MODULAR ── */}
      <motion.text
        fontSize="11"
        fontFamily="'Montserrat', 'Gotham Medium', 'Gotham Book', sans-serif"
        letterSpacing="7"
        fontWeight="500"
        fill={ink}
        textAnchor="middle"
        x="210" y="358"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.45, duration: 0.55, ease: 'easeOut' }}
        onAnimationComplete={() => {
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
        }}
      >
        INTERIORS AND MODULAR
      </motion.text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   EMBLEM – reusable compact icon with exact matching geometry
   ═══════════════════════════════════════════════════════════════════ */
const LogoEmblem = ({ scrolled, size = 52, isHovered = false }) => {
  const ink = scrolled ? INK : '#ffffff';

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`glowGradEmblem-${scrolled ? 'light' : 'dark'}`} cx="50%" cy="30%" r="55%">
          <stop offset="0%"   stopColor={BULB} stopOpacity="0.9" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0"   />
        </radialGradient>
        <linearGradient id={`spotlightGlowEmblem-${scrolled ? 'light' : 'dark'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BULB} stopOpacity="0.4" />
          <stop offset="100%" stopColor={BULB} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Top-Right Bracket */}
      <motion.path
        d="M58 20 H98 V98"
        stroke={ink} strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="miter"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Bottom-Left Bracket */}
      <motion.path
        d="M22 60 V98 H98"
        stroke={ink} strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="miter"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* T-bar */}
      <motion.path
        d="M22 20 H50"
        stroke={ink} strokeWidth="4.5" strokeLinecap="square"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, duration: 0.35, ease: 'easeInOut' }}
      />

      {/* T-stem */}
      <motion.path
        d="M36 20 V38"
        stroke={ink} strokeWidth="4.5" strokeLinecap="square"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.25, ease: 'easeInOut' }}
      />

      {/* Lamp cone */}
      <motion.path
        d="M36 38 L25 52 H47 Z"
        fill={ink}
        initial={{ opacity: 0, scaleY: 0.6 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      />

      {/* Bulb filament line (glows continuously or on hover) */}
      <motion.line
        x1="29" y1="53" x2="43" y2="53"
        stroke={BULB} strokeWidth="2" strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: [0.2, 1, 0.4, 1] } : { opacity: 0.8 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bulb glow under lamp */}
      <motion.ellipse
        cx="36" cy="58" rx="14" ry="9"
        fill={`url(#glowGradEmblem-${scrolled ? 'light' : 'dark'})`}
        initial={{ opacity: 0 }}
        animate={isHovered ? { opacity: [0.4, 0.9, 0.3, 0.9] } : { opacity: 0.65 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* E glyph */}
      <motion.path
        d="M68 52 H90 M68 52 V86 M68 69 H85 M68 86 H90"
        stroke={ink} strokeWidth="4.5" strokeLinecap="square" strokeLinejoin="miter"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SMALL  – compact navbar logo  (no disc, adaptive to bg)
   ═══════════════════════════════════════════════════════════════════ */
const SmallLogo = ({ scrolled, isHovered }) => {
  const ink  = scrolled ? INK     : '#ffffff';
  const gold = scrolled ? GOLD    : '#C9A96E';
  const sub  = scrolled ? '#3d3d47' : 'rgba(255,255,255,0.7)';

  return (
    <div className="flex flex-row items-center gap-1.5 select-none">
      {/* compact emblem */}
      <LogoEmblem scrolled={scrolled} size={70} isHovered={isHovered} />

      {/* text block */}
      <motion.div
        className="flex flex-col justify-center -ml-1.5"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.45, ease: 'easeOut' }}
      >
        <span style={{
          fontFamily: "'Montserrat', 'Gotham Medium', 'Gotham Book', sans-serif",
          fontSize: '21px',
          letterSpacing: '0.38em',
          fontWeight: 600,
          color: ink,
          lineHeight: 1,
          transition: 'color 0.3s',
        }}>
          ESPACIO
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '3px 0' }}>
          <span style={{ height: '1px', width: '34px', background: gold, display: 'block', transition: 'background 0.3s' }} />
          <span style={{ width: '4px', height: '4px', background: gold, transform: 'rotate(45deg)', display: 'block', transition: 'background 0.3s' }} />
          <span style={{ height: '1px', width: '34px', background: gold, display: 'block', transition: 'background 0.3s' }} />
        </div>
        <span style={{
          fontFamily: "'Montserrat', 'Gotham Medium', 'Gotham Book', sans-serif",
          fontSize: '7px',
          letterSpacing: '0.36em',
          fontWeight: 500,
          color: sub,
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>
          INTERIORS AND MODULAR
        </span>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   PUBLIC export – routes to large or small based on `size` prop
   ═══════════════════════════════════════════════════════════════════ */
const Logo = ({ className = '', showText = true, scrolled = false, size = 'small', onComplete }) => {
  const [hovered, setHovered] = React.useState(false);

  if (size === 'large') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <LargeLogo scrolled={scrolled} onComplete={onComplete} />
      </div>
    );
  }

  return (
    <div 
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showText
        ? <SmallLogo scrolled={scrolled} isHovered={hovered} />
        : <LogoEmblem scrolled={scrolled} size={44} isHovered={hovered} />
      }
    </div>
  );
};

export default Logo;
