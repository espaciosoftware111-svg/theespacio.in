import React, { useRef } from "react";
import { motion } from "framer-motion";

const GoogleGLogo = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" className="shrink-0">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 24 24"
        width="15"
        height="15"
        className={star <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300 fill-stone-300'}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

// Only reviews with authentic customer profile pictures
const topTestimonials = [
  {
    rating: 5,
    title: "Best Interior Designer Decision",
    body: "I was researching the best interior designer near me, and while doing that, I came across ESPACIO. Eventually, we hired them, and it turned out to be a good decision. The interior designer was nice, the quality of the materials and finishing was great.",
    name: "Dharma Teja",
    role: "Local Guide • 97 Reviews • 383 Photos",
    avatar: "/reviews/dharma_teja.png",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Practical Finishes & Organised Living",
    body: "For our family home, we wanted interiors that looked good but were easy to maintain. Espacio suggested practical finishes and storage options based on our daily use. The bedrooms feel comfortable and the kitchen is much more organised now. We are happy with the overall outcome.",
    name: "Ganesh Nayak143",
    role: "Homeowner • Family Home Interiors",
    avatar: "/reviews/ganesh_nayak.png",
    date: "23 minutes ago"
  },
  {
    rating: 5,
    title: "Largest Variety of Laminates, Veneers & Plywood",
    body: "As an interior designer, I have found the largest variety of laminates, vineers, and plywood with all ranges of economy, premium and super premium as required by different customer segments at the best competitive rates. My suggestion for all to visit this place once before you buy.",
    name: "Khaleel Shaik",
    role: "Interior Designer • 1 Review • 4 Photos",
    avatar: "/reviews/khaleel_shaik.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Clean Minimal Look & Great Material Guidance",
    body: "We wanted a modern, minimal look for our 3BHK and specifically wanted to avoid too many decorative elements. Espacio understood that direction well. The colour combination and storage solutions came together nicely. We also liked that the team was willing to explain why certain materials were better for particular areas.",
    name: "Juttiga Vaishnavi",
    role: "Homeowner • 3BHK Minimalist Interior",
    avatar: "/reviews/juttiga_vaishnavi.png",
    date: "an hour ago"
  },
  {
    rating: 5,
    title: "Professional & Great Interior and Exterior Elevation",
    body: "Very professional and passionate towards their work. Taken good time to complete our project we are very happy and satisfied with quality material given by them very good Outlook for my interior and exterior building elevation.",
    name: "Sunkari santosh",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/sunkari_santosh.png",
    date: "3 days ago"
  },
  {
    rating: 5,
    title: "Professional Reception & Functional Workspaces",
    body: "Our requirement was a professional reception area along with functional workspaces. Espacio suggested a layout that made better use of the available area. The reception now gives a much better first impression, while the work area remains comfortable for the staff. Good experience overall.",
    name: "Nani Varma",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/nani_varma.png",
    date: "2 hours ago"
  },
  {
    rating: 5,
    title: "Transparent Budget Prioritisation for 2BHK",
    body: "We had a clear budget for our 2BHK and told the team from the beginning. Instead of pushing everything as premium, they helped us prioritise what mattered most. That was something we appreciated. The house now looks fresh, and we were able to stay close to the plan we discussed.",
    name: "ABDUL SATTAR",
    role: "Homeowner • 2BHK Renovation",
    avatar: "/reviews/abdul_sattar.png",
    date: "a day ago"
  },
  {
    rating: 5,
    title: "Clean Finish & Responsive Site Team",
    body: "We got our 2BHK interiors done with Espacio Interiors & Modular. The team understood what we wanted and suggested practical options instead of simply adding more things. The modular kitchen storage came out really well and the overall finish looks clean. The site team was also responsive whenever we had a question.",
    name: "Rafi Shaik",
    role: "Homeowner • 2BHK Turnkey",
    avatar: "/reviews/rafi_shaik.png",
    date: "2 days ago"
  },
  {
    rating: 5,
    title: "Luxurious House at Reasonable Prices",
    body: "Good equipment and well staff my house is now completely become luxurious with reasonable prices and thanks to espacio",
    name: "Lovely boy Laxman",
    role: "Google Reviewer • 1 Review • 3 Photos",
    avatar: "/reviews/lovely_boy_laxman.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Wide Range of Collections & Patient Service",
    body: "Recently visited the store they have wide range of varieties and the customer service was very good they were very patient and understanding",
    name: "Shaik BOB",
    role: "Google Reviewer • 3 Reviews • 3 Photos",
    avatar: "/reviews/shaik_bob.png",
    date: "a year ago"
  },
  {
    rating: 5,
    title: "Excellent Materials for Home & Office",
    body: "Excellent materials for interior at home or office so pls visit this Espacio interiors and modular. Thank you...! ❤️",
    name: "Shaik Hussian",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/shaik_hussain.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Quality Materials & Affordable Prices",
    body: "Good quality of materials and affordable prices. Great experience working with ESPACIO Interiors & Modular.",
    name: "KoteswaraRao Alaparthi",
    role: "Local Guide • 4 Reviews • 62 Photos",
    avatar: "/reviews/koteswararao_alaparthi.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Service & Excellent Work 👍👏",
    body: "Good service excellent work 👍👏 Very happy with Espacio Interiors & Modular service quality.",
    name: "Jani Basha",
    role: "Google Reviewer • 4 Reviews",
    avatar: "/reviews/jani_basha.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Experience and Excellent Service",
    body: "Good experience and excellent service provided by Espacio Interiors & Modular.",
    name: "Amresh kumar",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/amresh_kumar.png",
    date: "4 months ago"
  },
  {
    rating: 5,
    title: "Exceptional Modular Craftsmanship & Quality",
    body: "Exceptional craftsmanship and smooth execution on modular wardrobes. The team at Espacio delivered top quality finishes.",
    name: "G Rakesh",
    role: "Google Reviewer • 3 Reviews",
    avatar: "/reviews/g_rakesh.png",
    date: "3 months ago"
  }
];

const bottomTestimonials = [
  {
    rating: 5,
    title: "Good Work & Good Communication 👍",
    body: "Good work and good communication 👍 The team at Espacio delivered our project smoothly and transparently.",
    name: "RAJU PALADUGU",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/paladugu_raju.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Work",
    body: "Good work done on time.",
    name: "Yadidya",
    role: "Google Reviewer • 3 Reviews",
    avatar: "/reviews/yadidya.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Super 👍😊",
    body: "Super 👍😊 Great modular work and helpful team.",
    name: "karagani pavankumar",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/karagani_pavankumar.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Greate Experience",
    body: "Greate experience working with Espacio Interiors & Modular.",
    name: "Rajini Kumar",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/rajini_kumar.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Service",
    body: "Good service and reliable interior materials at ESPACIO.",
    name: "Ramesh Paladugu",
    role: "Google Reviewer • 3 Reviews",
    avatar: "/reviews/ramesh_paladugu.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Service",
    body: "Good service and friendly support.",
    name: "naidu poola",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/naidu_poola.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Great Experience ❣️",
    body: "great experience ❣️ Looking forward to working with Espacio Interiors & Modular again.",
    name: "Venkatesh mudhiraj",
    role: "Google Reviewer • 1 Review",
    avatar: "/reviews/venkatesh_mudhiraj.png",
    date: "11 months ago"
  },
  {
    rating: 5,
    title: "Good Quality",
    body: "Good experience with Espacio Interiors & Modular. Recommended.",
    name: "Haneef Abdul",
    role: "Google Reviewer • 4 Reviews • 4 Photos",
    avatar: "/reviews/haneef_abdul.png",
    date: "11 months ago"
  },
  {
    rating: 5,
    title: "Super All Are Experts",
    body: "Super... All' are experts... Tq SPACIO Interiors",
    name: "K. SUBBARAO",
    role: "Google Reviewer • 5 Reviews",
    avatar: "/reviews/k_subbarao.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Reliable Quality & Execution",
    body: "Reliable interior solutions and genuine quality materials. Thank you Espacio.",
    name: "Paladugu Raju",
    role: "Local Guide • 1 Review",
    avatar: "/reviews/paladugu_raju.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Experience & Good Working Skills",
    body: "Good experience & good working skills. The team at Espacio Interiors & Modular is dedicated and skilled.",
    name: "Kishor Kumar",
    role: "Google Reviewer • 6 Reviews • 5 Photos",
    avatar: "/reviews/kishor_kumar.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Good Service & Quality Materials",
    body: "Good service and excellent quality materials offered at competitive pricing by Espacio.",
    name: "Ajayreddy Gowreddy123",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/ajayreddy_gowreddy.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Superb Design & Flawless Execution",
    body: "Superb design variety and flawless material quality provided by Espacio Interiors & Modular.",
    name: "imtiyaz shaik",
    role: "Google Reviewer • 9 Photos",
    avatar: "/reviews/imtiyaz_shaik.png",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Great Quality & Supportive Team",
    body: "Good experience and quality materials with cooperative design staff.",
    name: "Nakul Kirsani",
    role: "Google Reviewer • 1 Review • 1 Photo",
    avatar: "/reviews/nakul_kirsani.png",
    date: "11 months ago"
  },
  {
    rating: 5,
    title: "Professional Planning & Timely Delivery",
    body: "Great experience with ESPACIO for home interiors. Professional planning and timely delivery.",
    name: "Aditya Manda",
    role: "Local Guide • 4 Reviews",
    avatar: "/reviews/aditya_manda.png",
    date: "4 months ago"
  },
  {
    rating: 5,
    title: "Delighted with Material Selection & Execution",
    body: "Very satisfied with the interior design quality and material selection. Highly recommended!",
    name: "Thumuganti Rithwik",
    role: "Google Reviewer • 2 Reviews",
    avatar: "/reviews/thumuganti_rithwik.png",
    date: "3 months ago"
  }
];

const TestimonialCard = ({ t }) => (
  <div className="relative group w-[240px] sm:w-[300px] md:w-[415px] shrink-0 bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6] rounded-[18px] sm:rounded-[22px] md:rounded-[26px] p-4 sm:p-5 md:p-6 mx-1.5 sm:mx-2 md:mx-3 flex flex-col justify-between h-[180px] sm:h-[215px] md:h-[265px] shadow-[0_8px_24px_rgba(20,15,10,0.09)] hover:shadow-[0_16px_36px_rgba(20,15,10,0.16)] border border-[#E7DFD0] hover:border-[#C9A96E]/70 transition-all duration-300 hover:-translate-y-1 select-none overflow-hidden">
    {/* Elegant Quotation Mark Watermark */}
    <div className="absolute -top-1 -right-1 text-[#C9A96E]/12 group-hover:text-[#C9A96E]/20 transition-colors duration-300 pointer-events-none pr-3 pt-2">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>

    <div className="relative z-10 space-y-1.5 sm:space-y-2 md:space-y-2.5">
      {/* Star Rating & Verified Badge */}
      <div className="flex items-center justify-between">
        <div className="scale-85 sm:scale-95 md:scale-100 origin-left">
          <StarRating rating={t.rating} />
        </div>
        {t.source === 'MANUAL' ? (
          <div className="inline-flex items-center gap-1.5 bg-[#F4EDE0] border border-[#DECBB0] px-2.5 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-sans font-semibold text-[#825F23] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
            <span>Client Testimonial</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-[#F0EAE0] border border-[#DFD6C8] px-2.5 py-0.5 sm:py-1 rounded-full text-[9.5px] sm:text-[11px] font-sans font-medium text-[#50483E] shadow-xs">
            <GoogleGLogo />
            <span className="font-semibold">Verified Review</span>
          </div>
        )}
      </div>

      <h3 className="font-editorial text-[14px] sm:text-[17px] md:text-[20px] font-semibold text-[#1A1713] leading-[1.25] md:leading-[1.3] m-0 line-clamp-1 tracking-tight">
        "{t.title}"
      </h3>
      <p className="font-sans text-[11px] sm:text-[12px] md:text-[13.5px] font-normal text-[#554F46] leading-snug sm:leading-[1.65] m-0 line-clamp-2">
        {t.body}
      </p>
    </div>

    <div className="relative z-10 flex items-center justify-between pt-2.5 sm:pt-3 md:pt-3.5 border-t border-[#E8DFCFA0] mt-1.5 sm:mt-2.5 md:mt-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {t.avatar && t.avatar.trim() !== '' ? (
          <img 
            src={t.avatar}
            alt={t.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover object-center shrink-0 ring-2 ring-[#C9A96E]/40 shadow-xs" 
          />
        ) : (
          <div 
            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#D9BE90] to-[#B68F52] text-[#18140E] font-bold flex items-center justify-center text-[11px] sm:text-[12px] md:text-[14px] shrink-0 ring-2 ring-[#C9A96E]/40 shadow-xs select-none uppercase font-sans"
          >
            {(t.name || 'C').trim().charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0 truncate">
          <p className="font-sans text-[11.5px] sm:text-[12.5px] md:text-[13.5px] font-bold text-[#1A1713] m-0 leading-tight truncate">
            {t.name}
          </p>
          <p className="font-sans text-[9.5px] sm:text-[10.5px] md:text-[11px] font-normal text-[#6B6358] m-0 leading-tight mt-0.5 truncate">
            {t.role || t.designation}
          </p>
        </div>
      </div>

      {t.date && (
        <span className="text-[9.5px] sm:text-[10.5px] md:text-[11px] font-sans text-[#8C8274] font-medium shrink-0 ml-2 hidden sm:inline-block">
          {t.date}
        </span>
      )}
    </div>
  </div>
);

const MarqueeRow = ({ items, speed = 1.09, reverse = false }) => {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const animationFrameId = useRef(null);
  const halfWidthRef = useRef(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Cache measurement once instead of reading on every RAF frame
    const measure = () => {
      if (el) halfWidthRef.current = el.scrollWidth / 2;
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });

    if (reverse && el.scrollLeft === 0) {
      el.scrollLeft = halfWidthRef.current || 1000;
    }

    let isVisible = false;

    const autoScroll = () => {
      if (!isVisible) {
        animationFrameId.current = null;
        return;
      }
      if (!isDragging.current && el) {
        const halfWidth = halfWidthRef.current || 1000;
        if (reverse) {
          if (el.scrollLeft <= 0) {
            el.scrollLeft = halfWidth;
          } else {
            el.scrollLeft -= speed;
          }
        } else {
          if (el.scrollLeft >= halfWidth) {
            el.scrollLeft = 0;
          } else {
            el.scrollLeft += speed;
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(autoScroll);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          measure();
          if (!animationFrameId.current) {
            animationFrameId.current = requestAnimationFrame(autoScroll);
          }
        } else {
          if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
          }
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [speed, reverse]);

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const onMouseLeaveOrUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeaveOrUp}
      onMouseUp={onMouseLeaveOrUp}
      onMouseMove={onMouseMove}
      onTouchStart={() => { isDragging.current = true; }}
      onTouchEnd={() => { isDragging.current = false; }}
      className="overflow-x-auto select-none flex w-full max-w-full relative py-1 cursor-grab active:cursor-grabbing touch-pan-x"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none", overscrollBehaviorX: "contain" }}
    >
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex w-max shrink-0">
        {items.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [topItems, setTopItems] = React.useState(topTestimonials);
  const [bottomItems, setBottomItems] = React.useState(bottomTestimonials);

  React.useEffect(() => {
    const fetchCMSTestimonials = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../../utils/cmsStore');
        const stored = getCMSData(STORAGE_KEYS.TESTIMONIALS);
        if (stored && Array.isArray(stored) && stored.length > 0) {
          // Keep only testimonials that have valid profile pictures
          const visibleWithAvatar = stored.filter(item => item.visible !== false && item.avatar && item.avatar.trim() !== '');
          if (visibleWithAvatar.length > 0) {
            const cmsData = visibleWithAvatar.map((item) => ({
              source: item.source || 'GOOGLE',
              rating: item.rating || 5,
              title: item.title || `${item.name || 'Client'} Review`,
              body: item.body || item.reviewText || item.review || '',
              name: item.name || item.clientName || 'Anonymous Client',
              role: item.designation || item.role || 'Homeowner • ESPACIO Client',
              avatar: item.avatar || item.photo || '',
              date: item.date || 'Recently'
            }));
            const mid = Math.ceil(cmsData.length / 2);
            setTopItems([...cmsData.slice(0, mid)]);
            setBottomItems([...cmsData.slice(mid)]);
          }
        }

        const res = await axios.get('/testimonials').catch(() => null);
        if (res?.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          const fresh = res.data.data;
          setCMSData(STORAGE_KEYS.TESTIMONIALS, fresh);
          const visibleWithAvatar = fresh.filter(item => item.visible !== false && item.avatar && item.avatar.trim() !== '');
          if (visibleWithAvatar.length > 0) {
            const cmsData = visibleWithAvatar.map((item) => ({
              source: item.source || 'GOOGLE',
              rating: item.rating || 5,
              title: item.title || `${item.name || 'Client'} Review`,
              body: item.body || item.reviewText || item.review || '',
              name: item.name || item.clientName || 'Anonymous Client',
              role: item.designation || item.role || 'Homeowner • ESPACIO Client',
              avatar: item.avatar || item.photo || '',
              date: item.date || 'Recently'
            }));
            const mid = Math.ceil(cmsData.length / 2);
            setTopItems([...cmsData.slice(0, mid)]);
            setBottomItems([...cmsData.slice(mid)]);
          }
        }
      } catch {}
    };

    fetchCMSTestimonials();

    const handleSync = () => fetchCMSTestimonials();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Ensure seamless marquee infinite loop with at least 2 repeats
  const rowA = topItems.length > 0 ? [...topItems, ...topItems, ...topItems] : [];
  const rowB = bottomItems.length > 0 ? [...bottomItems, ...bottomItems, ...bottomItems] : [];

  return (
    <section className="relative py-8 sm:py-16 md:py-24 overflow-hidden w-full max-w-full">

      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden w-full h-full pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1920&q=80&fm=webp" 
          loading="lazy" 
          decoding="async" 
          alt="ESPACIO Luxury Interior Background" 
          className="w-full h-full object-cover object-center scale-105" 
        />
        <div className="absolute inset-0 bg-[#0c0c10]/85 backdrop-blur-[3px]" />
      </div>

      <div className="relative z-10 w-full max-w-full overflow-hidden">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-6 sm:mb-8 md:mb-12 px-4 sm:px-6">
          
          {/* Testimonials Badge */}
          <div className="inline-flex items-center gap-2 bg-white text-ink px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[12px] sm:text-[13.5px] font-sans font-medium shadow-md border border-black/5 mb-3 sm:mb-5 select-none tracking-normal">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M2 3C1.44772 3 1 3.44772 1 4V11C1 11.5523 1.44772 12 2 12H4V15L7.5 12H14C14.5523 12 15 11.5523 15 11V4C15 3.44772 14.5523 3 14 3H2Z" fill="#101014" />
              <circle cx="4.5" cy="7.5" r="0.9" fill="white" />
              <circle cx="8" cy="7.5" r="0.9" fill="white" />
              <circle cx="11.5" cy="7.5" r="0.9" fill="white" />
            </svg>
            <span>Testimonials</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-white leading-[1.12] mb-2.5 sm:mb-4 tracking-tight">
            Client Reviews & Ratings
          </h2>
          <p className="font-sans text-[13.5px] sm:text-base md:text-lg font-medium text-white/90 max-w-[540px] mx-auto leading-relaxed">
            40+ Years of Experience in the Service Industry
          </p>
        </motion.div>

        {/* Row 1 — Auto-scrolls Right-to-Left */}
        <div className="relative mb-3 sm:mb-4 md:mb-5 w-full max-w-full overflow-hidden">
          <MarqueeRow items={rowA} speed={1.09} reverse={false} />
        </div>

        {/* Row 2 — Auto-scrolls Left-to-Right */}
        <div className="relative w-full max-w-full overflow-hidden">
          <MarqueeRow items={rowB} speed={1.00} reverse={true} />
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
