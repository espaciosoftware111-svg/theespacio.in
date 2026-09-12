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
        className={star <= rating ? 'text-[#FFB800] fill-[#FFB800]' : 'text-[#E2DCD2] fill-[#E2DCD2]'}
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

const TestimonialCard = ({ t }) => {
  const quoteText = (t.body || '').replace(/^["'“\s]+|["'”\s]+$/g, '');

  return (
    <div className="relative group w-[280px] sm:w-[350px] md:w-[410px] shrink-0 bg-[#FAF8F5] rounded-[18px] sm:rounded-[22px] p-4.5 sm:p-5 md:p-5.5 mx-1 sm:mx-1.5 md:mx-2 flex flex-col justify-between h-[165px] sm:h-[185px] md:h-[195px] shadow-[0_4px_20px_rgba(20,15,10,0.05)] hover:shadow-[0_12px_30px_rgba(20,15,10,0.12)] border border-[#E8E2D6] hover:border-[#C9A96E]/60 transition-all duration-300 hover:-translate-y-1 select-none overflow-hidden">
      <div className="relative z-10 space-y-2 sm:space-y-2.5">
        {/* Star Rating */}
        <div>
          <StarRating rating={t.rating} />
        </div>

        {/* Italic Quote Text in Smart Quotes */}
        <p className="font-sans italic text-[12px] sm:text-[13px] md:text-[13.5px] font-normal text-[#3E3933] leading-relaxed m-0 line-clamp-3 sm:line-clamp-4">
          “{quoteText}”
        </p>
      </div>

      {/* Divider & Author Meta */}
      <div className="relative z-10 pt-2.5 sm:pt-3 border-t border-[#E6E0D6] mt-1.5 sm:mt-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {t.avatar && t.avatar.trim() !== '' ? (
            <img 
              src={t.avatar}
              alt={t.name}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full object-cover object-center shrink-0 shadow-xs" 
            />
          ) : (
            <div 
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-[#E5DFD4] text-[#2C2720] font-bold flex items-center justify-center text-[11px] sm:text-[12px] shrink-0 shadow-xs select-none uppercase font-sans"
            >
              {(t.name || 'C').trim().charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0 truncate">
            <p className="font-sans text-[12.5px] sm:text-[13.5px] md:text-[14px] font-bold text-[#1A1815] m-0 leading-tight truncate">
              {t.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarqueeRow = ({ items, reverse = false }) => {
  const [isPaused, setIsPaused] = React.useState(false);

  if (!items || items.length === 0) return null;

  // Duplicate once for a seamless -50% GPU loop
  const displayItems = [...items, ...items];
  const durationSec = Math.max(items.length * 4.2, 28);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="overflow-hidden select-none flex w-full max-w-full relative py-1 cursor-grab"
    >
      <div
        className={`flex w-max shrink-0 ${reverse ? 'animate-testimonials-right' : 'animate-testimonials-left'}`}
        style={{
          animationDuration: `${durationSec}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {displayItems.map((t, i) => (
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

  const rowA = topItems.length > 0 ? topItems : [];
  const rowB = bottomItems.length > 0 ? bottomItems : [];

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
          <MarqueeRow items={rowA} reverse={false} />
        </div>

        {/* Row 2 — Auto-scrolls Left-to-Right */}
        <div className="relative w-full max-w-full overflow-hidden">
          <MarqueeRow items={rowB} reverse={true} />
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
