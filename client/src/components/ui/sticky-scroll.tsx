'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef } from 'react';

export interface StickyScrollProps {
  children?: React.ReactNode;
  className?: string;
  leftColumn?: React.ReactNode;
  centerStickyColumn?: React.ReactNode;
  rightColumn?: React.ReactNode;
  title?: React.ReactNode;
  headerVisible?: boolean;
}

const Component = forwardRef<HTMLElement, StickyScrollProps>(({
  children,
  className = '',
  leftColumn,
  centerStickyColumn,
  rightColumn,
  title,
  headerVisible = true,
  ...props
}, ref) => {
  const hasCustomColumns = Boolean(leftColumn || centerStickyColumn || rightColumn);

  // If already running inside an existing Lenis context or window.lenis exists, avoid double-init
  const hasGlobalLenis = typeof window !== 'undefined' && Boolean((window as any).lenis);
  const Wrapper = hasGlobalLenis ? React.Fragment : ReactLenis;
  const wrapperProps = hasGlobalLenis ? {} : { root: true };

  return (
    <Wrapper {...wrapperProps}>
      <main className={`bg-black ${className}`} ref={ref as any} {...props}>
        {headerVisible && (
          <div className='wrapper'>
            <section className='text-white h-screen w-full bg-slate-950 grid place-content-center sticky top-0'>
              <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

              {title ? (
                <div className="relative z-10">{title}</div>
              ) : (
                <h1 className='2xl:text-7xl text-5xl px-8 font-semibold text-center tracking-tight leading-[120%] relative z-10'>
                  Create Gallery In a Better Way
                  <br />
                  Using CSS sticky properties <br />
                  Scroll down! 👇
                </h1>
              )}
            </section>
          </div>
        )}

        <section className='text-white w-full bg-slate-950'>
          {hasCustomColumns ? (
            <div className='grid grid-cols-12 gap-3 lg:gap-4'>
              <div className='grid gap-3 lg:gap-4 col-span-4'>
                {leftColumn}
              </div>
              <div className='sticky top-0 h-screen w-full col-span-4 gap-3 lg:gap-4 grid grid-rows-3'>
                {centerStickyColumn}
              </div>
              <div className='grid gap-3 lg:gap-4 col-span-4'>
                {rightColumn}
              </div>
            </div>
          ) : children ? (
            children
          ) : (
            <div className='grid grid-cols-12 gap-2'>
              <div className='grid gap-2 col-span-4'>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                    alt='Modern Interior Architecture'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80'
                    alt='Luxury Villa Living Room'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
                    alt='Contemporary Modular Kitchen'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
                    alt='Minimalist Dining Area'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
                    alt='Bespoke Bedroom Suite'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
              </div>
              <div className='sticky top-0 h-screen w-full col-span-4 gap-2 grid grid-rows-3'>
                <figure className='w-full h-full'>
                  <img
                    src='https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
                    alt='Sculpted Cove Ceiling'
                    className='transition-all duration-300 h-full w-full align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full h-full'>
                  <img
                    src='https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
                    alt='Architectural Double Height Foyer'
                    className='transition-all duration-300 h-full w-full align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full h-full'>
                  <img
                    src='https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
                    alt='Master Suite Sanctuary'
                    className='transition-all duration-300 h-full w-full align-bottom object-cover rounded-md'
                  />
                </figure>
              </div>
              <div className='grid gap-2 col-span-4'>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
                    alt='Warm Wood Panelling'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80'
                    alt='Executive Living Lounge'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80'
                    alt='Marble Island Kitchen'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
                    alt='Walk-In Wardrobe Dressing'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
                <figure className='w-full'>
                  <img
                    src='https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80'
                    alt='Outdoor Terrace & Bar'
                    className='transition-all duration-300 w-full h-96 align-bottom object-cover rounded-md'
                  />
                </figure>
              </div>
            </div>
          )}
        </section>

        {!hasCustomColumns && (
          <footer className='group bg-slate-950'>
            <h1 className='text-[16vw] translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear'>
              ui-layout
            </h1>
            <div className='bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full'></div>
          </footer>
        )}
      </main>
    </Wrapper>
  );
});

Component.displayName = 'StickyScroll';

export default Component;
