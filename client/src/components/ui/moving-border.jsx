import React from "react";

export const MovingBorder = ({
  children,
  duration = 3000,
  rx = "20",
  ry = "20",
  ...otherProps
}) => {
  return (
    <div className="absolute -inset-[100%] pointer-events-none flex items-center justify-center overflow-hidden">
      <div
        className="w-[200%] h-[200%] pointer-events-none"
        style={{
          animation: `goldBorderSpin ${duration}ms linear infinite`,
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 270deg, #c5a572 320deg, #dfc28d 360deg)',
          willChange: 'transform',
        }}
      />
    </div>
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
