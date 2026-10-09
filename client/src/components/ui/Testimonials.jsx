import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 24 24"
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
          star <= rating
            ? 'text-[#C5A265] fill-[#C5A265]'
            : 'text-[#E2DCD2] fill-[#E2DCD2]'
        }`}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

// Authentic reviews designed in luxury img1 format
const topTestimonials = [
  {
    rating: 5,
    title: "Simple, Elegant & Beautiful Jesus Artwork",
    body: "Really happy with how Espacio brought the interiors together. Everything feels simple and elegant, but the Jesus artwork is our favourite. It's the first thing everyone notices when they walk in. Overall, we're very happy with how the space came together.",
    name: "MANOJ & KRIPA",
    role: "Bandlaguda Jagir · Residential Villa",
    date: "1 month ago"
  },
  {
    rating: 5,
    title: "Best Interior Designer Near Me & Fantastic Job",
    body: "I was researching the best interior designer near me, and while doing that, I came across ESPACIO. Eventually, we hired them, and it turned out to be a good decision. The interior designer was nice, the quality of the materials and finishing of the modular solutions is amazing, and the execution was really good. Espacio did a fantastic job.",
    name: "Dharma Teja",
    role: "Narsingi · Residential 3BHK",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Customised Store Layout & Dedicated Support",
    body: "The team customised the store around our products in ways we hadn't even thought of. They were patient through every discussion, even late night calls when I was unsure. The final space looks great and works perfectly for our brand. Thank you Espacio!",
    name: "MIVA ESSENTIALS",
    role: "Kismatpur · Retail Brand Store",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Good Quality Work & Punctual Execution",
    body: "Good quality work, and the team actually turns up on time, which is rare. The wardrobes look great, no complaints.",
    name: "SRINIVAS & MADHURI",
    role: "Narsingi · Residential 3BHK",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Executive Office Interior",
    body: "We fitted our 4,000 sq.ft executive office with ESPACIO PVC ceiling panels and glass partitions. Professional project management and impeccable finishing.",
    name: "Siddharth Mehta",
    role: "HITECH City · Corporate Office",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Thoughtful Advice & Patient Execution",
    body: "I'm really thankful to Espacio for patiently working with us. Whenever we suggested something, they didn't just reject it, they explained why it may not work and suggested better options. We're really happy with how our home turned out.",
    name: "HUSSAIN & PARVEEN",
    role: "Kukatpally · Turnkey Residence",
    date: "1 month ago"
  },
  {
    rating: 5,
    title: "Professional & Passionate Towards Their Work",
    body: "Very professional and passionate towards their work. Taken good time to complete our project we are very happy and satisfied with quality material given by them very good Outlook for my interior and exterior building elevation.",
    name: "Sunkari Santosh",
    role: "Financial District · Duplex Home",
    date: "6 months ago"
  },
  {
    rating: 5,
    title: "Consistent Board & Laminate Quality",
    body: "We've sourced boards and laminates from Espacio on a few projects. Quality is consistent batch to batch and deliveries are dependable, which matters when we're working to client deadlines.",
    name: "STUDIO VERTEX ARCHITECTS",
    role: "Jubilee Hills · Architecture Firm",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Wide Range of Varieties & Patient Customer Service",
    body: "Recently visited the store they have wide range of varieties and the customer service was very good they were very patient and understanding.",
    name: "Shaik BOB",
    role: "Manikonda · Turnkey Residence",
    date: "a year ago"
  }
];

const bottomTestimonials = [
  {
    rating: 5,
    title: "Thoughtful Interiors & Floral Wardrobe Feature",
    body: "I'm really happy with how Espacio did our whole house. Everything feels so thoughtfully done. My favourite is definitely the floral wardrobe, it's so pretty and adds such a lovely touch to the bedroom. I absolutely love how the house turned out.",
    name: "ARJUN & SHENA",
    role: "Financial District · Luxury Flat",
    date: "1 month ago"
  },
  {
    rating: 5,
    title: "Chala Bagundhi & Excellent TV Unit Execution",
    body: "Espacio vallu chala manchi ga TV unit chesyaru degara vundi mari cheyinchyaru chala bagundhi, please do visit espacio 👍",
    name: "Madhusudhan Vanam",
    role: "Kukatpally · Living Room Interior",
    date: "5 months ago"
  },
  {
    rating: 5,
    title: "Cohesive Spatial Design & Family Comfort",
    body: "Pura ghar ek hi style mein lag raha hai, upar se neeche tak. Parents ko bhi comfortable lagta hai aur bachon ko bhi apna room pasand aaya. Thank you Espacio!",
    name: "VIKRAM & SNEHA SHARMA",
    role: "Gachibowli · 3BHK Residence",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Professional Service & Quality Materials",
    body: "Professional interior planning and exceptional materials supply from ESPACIO. Highly satisfied with their work.",
    name: "Abdul Gaffar",
    role: "Banjara Hills · Luxury Interior",
    date: "6 months ago"
  },
  {
    rating: 5,
    title: "On-Time Commercial Handover & Impressive Finishes",
    body: "We had a tight opening date and I wasn't sure it would work out, but the team coordinated everything on site. Customers keep asking who did our interiors.",
    name: "THE COFFEE ATELIER",
    role: "Banjara Hills · Commercial Cafe",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Professional Planning & Timely Delivery",
    body: "Great experience with ESPACIO for home interiors. Professional planning and timely delivery.",
    name: "Aditya Manda",
    role: "Narsingi · Modular Kitchen",
    date: "4 months ago"
  },
  {
    rating: 5,
    title: "End-to-End Home Interiors & 3D Precision",
    body: "Espacio handled our home interiors from design to installation. Communication was clear throughout, and the final finish matched the 3D designs closely. We'd happily work with them again.",
    name: "DR. CHENNA KESHAVA & LAKSHMI",
    role: "Tellapur · High-Rise 3BHK",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Delighted with Material Selection & Execution",
    body: "Very satisfied with the interior design quality and material selection. Highly recommended!",
    name: "Thumuganti Rithwik",
    role: "Jubilee Hills · Contemporary Villa",
    date: "3 months ago"
  },
  {
    rating: 5,
    title: "Accurate 3D Visualizations & Fast Turnaround",
    body: "Their 3D renders were accurate enough that our client signed off without second-guessing. Turnaround was quick, and revisions were no trouble.",
    name: "AXIS LINE ARCHITECTS",
    role: "Madhapur · Interior Design Studio",
    date: "2 months ago"
  },
  {
    rating: 5,
    title: "Professional Planning & High-Quality Materials",
    body: "Professional interior planning and exceptional materials supply from ESPACIO.",
    name: "LEGAL AMICUS",
    role: "Financial District · Corporate Office",
    date: "a year ago"
  }
];

const TestimonialCard = ({ t }) => {
  const quoteText = (t.body || '').replace(/^[\"'“\s]+|[\"'”\s]+$/g, '');
  const subtitle = t.role || (t.location && t.projectType ? `${t.location} · ${t.projectType}` : 'Hyderabad · Verified Client');

  return (
    <div className="relative group w-[320px] sm:w-[410px] md:w-[460px] shrink-0 bg-white rounded-[20px] p-5 sm:p-5.5 md:p-6 mx-2 sm:mx-2.5 md:mx-3 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] md:min-h-[260px] h-full shadow-[0_4px_24px_rgba(20,15,10,0.06)] hover:shadow-[0_14px_32px_rgba(20,15,10,0.12)] border border-[#E2DDD5] hover:border-[#C5A265]/60 transition-all duration-300 hover:-translate-y-1 select-none text-left">
      {/* 1. Star Rating Header */}
      <div className="flex items-center shrink-0 mb-2.5 sm:mb-3">
        <StarRating rating={t.rating} />
      </div>

      {/* 2. Review Quote Body - Fully Visible without any truncation */}
      <p className="font-sans italic font-normal text-[13px] sm:text-[13.5px] md:text-[14px] text-[#36332E] leading-[1.6] my-auto py-1 sm:py-2 select-text">
        “{quoteText}”
      </p>

      {/* 3. Divider Line & Author Section */}
      <div className="w-full pt-3 sm:pt-3.5 mt-auto border-t border-[#E8E1D5] shrink-0">
        <h4 className="font-sans font-bold text-[13.5px] sm:text-[14.5px] text-[#181512] leading-tight m-0">
          {t.name}
        </h4>
        <p className="font-sans font-normal text-[11.5px] sm:text-[12px] text-[#706B64] leading-tight mt-1 m-0">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

const MarqueeRow = ({ items, reverse = false }) => {
  const [isPaused, setIsPaused] = React.useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "250px" });

  if (!items || items.length === 0) return null;

  // Duplicate once for a seamless -50% GPU loop
  const displayItems = [...items, ...items];
  const durationSec = Math.max(items.length * 4.2, 28);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="overflow-hidden select-none flex w-full max-w-full relative py-3 sm:py-4 cursor-grab"
    >
      <div
        className={`flex w-max shrink-0 items-stretch ${reverse ? 'animate-testimonials-right' : 'animate-testimonials-left'}`}
        style={{
          animationDuration: `${durationSec}s`,
          animationPlayState: isInView ? (isPaused ? 'paused' : 'running') : 'paused',
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

const resolveTestimonialItem = (item) => {
  const rawName = (item.name || item.clientName || 'Verified Client').trim();
  const rawTitle = (item.title || item.headline || '').trim();
  const rawBody = (item.body || item.reviewText || item.review || item.text || item.comment || item.description || '').trim();
  const rawRole = (item.designation || item.role || item.projectType || 'Corporate Office').trim();
  const rawLocation = (item.location || item.city || '').trim();
  const rawDate = (item.date || '3 months ago').trim();

  let formattedRole = rawRole;
  if (rawLocation && rawRole && !rawRole.includes('·') && !rawRole.includes('•')) {
    formattedRole = `${rawLocation} · ${rawRole}`;
  } else if (rawRole) {
    const parts = rawRole.split(/\s*[•|]\s*/);
    if (parts.length > 1 && (parts[0] === 'Google Reviewer' || parts[0] === 'Local Guide')) {
      formattedRole = `${parts[0]} · Verified Client`;
    } else {
      formattedRole = parts.join(' · ');
    }
  }

  return {
    source: item.source || 'GOOGLE',
    rating: Number(item.rating) || 5,
    title: rawTitle || 'Exceptional Quality & Craftsmanship',
    body: rawBody || 'Great experience with Espacio Interiors & Modular.',
    name: rawName,
    role: formattedRole || 'Hyderabad · Corporate Office',
    avatar: '',
    date: rawDate
  };
};

const Testimonials = () => {
  const [topItems, setTopItems] = React.useState(topTestimonials);
  const [bottomItems, setBottomItems] = React.useState(bottomTestimonials);

  React.useEffect(() => {
    const fetchCMSTestimonials = async () => {
      try {
        const { getCMSData, STORAGE_KEYS, DEFAULT_TESTIMONIALS } = await import('../../utils/cmsStore');
        let stored = getCMSData(STORAGE_KEYS.TESTIMONIALS);
        
        if (!stored || !Array.isArray(stored) || stored.length === 0) {
          stored = DEFAULT_TESTIMONIALS;
        } else if (DEFAULT_TESTIMONIALS && DEFAULT_TESTIMONIALS.length > 0 && !stored.some(item => (item.name || '').includes('Siddharth Mehta'))) {
          stored = [DEFAULT_TESTIMONIALS[0], ...stored];
        }

        if (Array.isArray(stored)) {
          stored = stored.filter(item => item.id !== 'g_rev_03' && !(item.name || '').toLowerCase().includes('khaleel'));
          try {
            localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(stored));
          } catch {}
        }

        if (stored && Array.isArray(stored) && stored.length > 0) {
          const visibleReviews = stored.filter(item => item.visible !== false);
          if (visibleReviews.length > 0) {
            const cmsData = visibleReviews.map(resolveTestimonialItem);
            const mid = Math.ceil(cmsData.length / 2);
            setTopItems([...cmsData.slice(0, mid)]);
            setBottomItems([...cmsData.slice(mid)]);
          }
        }

        const res = await axios.get('/testimonials').catch(() => null);
        if (res?.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          const fresh = res.data.data;
          setCMSData(STORAGE_KEYS.TESTIMONIALS, fresh);
          const visibleReviews = fresh.filter(item => item.visible !== false);
          if (visibleReviews.length > 0) {
            const cmsData = visibleReviews.map(resolveTestimonialItem);
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
    <section className="relative py-8 sm:py-16 md:py-24 overflow-hidden w-full max-w-full bg-[#F0EDE7]">

      {/* Background with user swatch color #F0EDE7 */}
      <div className="absolute inset-0 z-0 bg-[#F0EDE7] pointer-events-none" />

      <div className="relative z-10 w-full max-w-full overflow-hidden">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="text-center mb-6 sm:mb-8 md:mb-12 px-4 sm:px-6">
          
          {/* Testimonials Badge */}
          <div className="inline-flex items-center gap-2 bg-white text-[#181512] px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-[12px] sm:text-[13.5px] font-sans font-medium shadow-[0_2px_8px_rgba(20,15,10,0.06)] border border-[#E2DDD5] mb-3 sm:mb-5 select-none tracking-normal">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M2 3C1.44772 3 1 3.44772 1 4V11C1 11.5523 1.44772 12 2 12H4V15L7.5 12H14C14.5523 12 15 11.5523 15 11V4C15 3.44772 14.5523 3 14 3H2Z" fill="#181512" />
              <circle cx="4.5" cy="7.5" r="0.9" fill="white" />
              <circle cx="8" cy="7.5" r="0.9" fill="white" />
              <circle cx="11.5" cy="7.5" r="0.9" fill="white" />
            </svg>
            <span>Testimonials</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-normal text-[#181512] leading-[1.12] mb-2.5 sm:mb-4 tracking-tight">
            Client Reviews & Ratings
          </h2>
          <p className="font-sans text-[13.5px] sm:text-base md:text-lg font-medium text-[#524C42] max-w-[580px] mx-auto leading-relaxed">
            Backed by 40+ Years of Combined Construction & Interior Heritage in Hyderabad
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
