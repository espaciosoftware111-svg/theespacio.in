import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, Sparkles, CheckCircle2, ChevronRight, Sliders, Layers, Eye, 
  X, Phone, Mail, User, MapPin, Send, Loader2, Lock, ShieldCheck, Download
} from 'lucide-react';
import axios from 'axios';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';
import { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } from '../utils/cmsStore';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '50px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(delay, 0.2), ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

// ── CURATED CORE ROOM DOMAINS ────────────────────────────────────────────────
const mockCategories = [
  {
    "name": "Modular Kitchen",
    "slug": "modular-kitchen",
    "description": "Precision-engineered kitchens with high-gloss acrylic, polygranite surfaces, and concealed lighting tracks.",
    "heroImage": "/images/spaces/modular_kitchen/kitchen_drive_24.webp",
    "visible": true,
    "details": {
      "tag": "Culinary Architecture",
      "headline": "Kitchens Designed for Seamless Flow and Everyday Rigour",
      "body": "We treat the modular kitchen as the mechanical and social heart of the modern residence. Every layout balances ergonomic work-triangles with concealed Blum soft-close hardware, anti-fingerprint acrylics, and integrated quartz breakfast bars.",
      "includes": [
        "Island / Parallel / L-Shape / U-Shape Configurations",
        "Premium German Hardware (Häfele / Hettich)",
        "Quartz, Granite & Sintered Stone Waterfall Countertops",
        "Concealed Chimney, Hob & Appliance Integration",
        "Polygranite & Subway Backsplash Tiling",
        "Soft-Close Acrylic & PU Shutter Systems",
        "Under-Cabinet Warm LED Shadowline Profiles",
        "Custom Tall Pantry Units & Corner Carousels",
        "10-Year Comprehensive Workmanship Warranty"
      ]
    },
    "galleryImages": [
      "/images/spaces/modular_kitchen/kitchen_drive_24.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_1.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_2.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_3.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_4.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_5.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_6.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_7.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_8.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_9.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_10.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_11.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_12.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_13.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_14.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_15.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_16.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_17.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_18.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_19.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_20.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_21.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_22.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_23.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_25.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_27.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_28.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_29.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_30.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_31.webp",
      "/images/spaces/modular_kitchen/kitchen_drive_32.webp"
    ],
    "filters": [
      "Island Kitchen",
      "Parallel Kitchen",
      "L-Shaped Kitchen",
      "U-Shaped Kitchen",
      "Open Concept Pantry"
    ]
  },
  {
    "name": "Master Bedroom",
    "slug": "master-bedroom",
    "description": "Sanctuary bedroom suites designed with fluted walnut headboards, ambient cove illumination zones, and bespoke bedside consoles.",
    "heroImage": "/images/spaces/bedroom/bedroom_drive_24.webp",
    "visible": true,
    "details": {
      "tag": "Restful Sanctuary",
      "headline": "Bedrooms Crafted for Deep Rest and Serenity",
      "body": "We craft bedrooms where visual tranquility meets tactile warmth. The bed becomes an architectural anchor framed by custom upholstered headboards, acoustic wall paneling, and intelligent multi-scene lighting that shifts effortlessly from daytime clarity to evening calm.",
      "includes": [
        "Custom Floating Bed with Integrated Upholstered Headboard",
        "Floor-to-Ceiling Built-In & Walk-In Wardrobe Integration",
        "Bedside Floating Niches & Concealed Charging Hubs",
        "Layered Multi-Circuit Ambient & Task Lighting",
        "Architectural False Ceiling with Hidden Warm Coves",
        "Integrated Study Nook / Vanity Dressing Counter",
        "Acoustic Fluted Wall Cladding & Natural Veneers",
        "Specialized Master, Guest & Thematic Kids Suite Layouts"
      ]
    },
    "galleryImages": [
      "/images/spaces/bedroom/bedroom_drive_1.webp",
      "/images/spaces/bedroom/bedroom_drive_2.webp",
      "/images/spaces/bedroom/bedroom_drive_3.webp",
      "/images/spaces/bedroom/bedroom_drive_4.webp",
      "/images/spaces/bedroom/bedroom_drive_5.webp",
      "/images/spaces/bedroom/bedroom_drive_6.webp",
      "/images/spaces/bedroom/bedroom_drive_7.webp",
      "/images/spaces/bedroom/bedroom_drive_8.webp",
      "/images/spaces/bedroom/bedroom_drive_9.webp",
      "/images/spaces/bedroom/bedroom_drive_10.webp",
      "/images/spaces/bedroom/bedroom_drive_11.webp",
      "/images/spaces/bedroom/bedroom_drive_12.webp",
      "/images/spaces/bedroom/bedroom_drive_13.webp",
      "/images/spaces/bedroom/bedroom_drive_14.webp",
      "/images/spaces/bedroom/bedroom_drive_15.webp",
      "/images/spaces/bedroom/bedroom_drive_16.webp",
      "/images/spaces/bedroom/bedroom_drive_17.webp",
      "/images/spaces/bedroom/bedroom_drive_18.webp",
      "/images/spaces/bedroom/bedroom_drive_19.webp",
      "/images/spaces/bedroom/bedroom_drive_20.webp",
      "/images/spaces/bedroom/bedroom_drive_21.webp",
      "/images/spaces/bedroom/bedroom_drive_22.webp",
      "/images/spaces/bedroom/bedroom_drive_23.webp",
      "/images/spaces/bedroom/bedroom_drive_24.webp",
      "/images/spaces/bedroom/bedroom_drive_25.webp",
      "/images/spaces/bedroom/bedroom_drive_26.webp",
      "/images/spaces/bedroom/bedroom_drive_27.webp",
      "/images/spaces/bedroom/bedroom_drive_28.webp",
      "/images/spaces/bedroom/bedroom_drive_29.webp"
    ],
    "filters": [
      "Luxury Master Suite",
      "Warm Minimalist",
      "Classical Boiserie",
      "Modern Contemporary",
      "Integrated Study Suite"
    ]
  },
  {
    "name": "Living Room",
    "slug": "living-room",
    "description": "Editorial living zones crafted around natural light, marble accents, and low-profile custom furniture.",
    "heroImage": "/images/spaces/living/living_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Grand First Impressions",
      "headline": "Living Spaces That Command Attention and Welcome Gatherings",
      "body": "Your living room sets the emotional tone of the entire home. We design expansive, fluid living spaces with bespoke media accent walls, back-lit translucent stone, low-profile custom seating configurations, and architectural lighting tracks.",
      "includes": [
        "Full-Height TV Media Wall & Floating Console Joinery",
        "Bookmatched Italian Marble & Polygranite Feature Walls",
        "Custom Sofa Sizing & Open Flow Layout Coordination",
        "Magnetic Track & Warm Cove Lighting Design",
        "Foyer Entryway & Architectural Partition Integration",
        "Concealed Wire Runs & Subwoofer Niche Preparation",
        "Acoustic Fluted Charcoal & Timber Slat Panelling",
        "Double-Height & Balcony Connecting Transitions"
      ]
    },
    "galleryImages": [
      "/images/spaces/living/living_drive_1.webp",
      "/images/spaces/living/living_drive_2.webp",
      "/images/spaces/living/living_drive_3.webp",
      "/images/spaces/living/living_drive_4.webp",
      "/images/spaces/living/living_drive_6.webp",
      "/images/spaces/living/living_drive_7.webp",
      "/images/spaces/living/living_drive_8.webp",
      "/images/spaces/living/living_drive_9.webp",
      "/images/spaces/living/living_drive_10.webp",
      "/images/spaces/living/living_drive_11.webp",
      "/images/spaces/living/living_drive_12.webp",
      "/images/spaces/living/living_drive_13.webp",
      "/images/spaces/living/living_drive_14.webp",
      "/images/spaces/living/living_drive_15.webp",
      "/images/spaces/living/living_drive_16.webp",
      "/images/spaces/living/living_drive_17.webp",
      "/images/spaces/living/living_drive_18.webp",
      "/images/spaces/living/living_drive_19.webp",
      "/images/spaces/living/living_drive_20.webp",
      "/images/spaces/living/living_drive_21.webp",
      "/images/spaces/living/living_drive_22.webp",
      "/images/spaces/living/living_drive_23.webp",
      "/images/spaces/living/living_drive_24.webp",
      "/images/spaces/living/living_drive_25.webp",
      "/images/spaces/living/living_drive_26.webp",
      "/images/spaces/living/living_drive_27.webp",
      "/images/spaces/living/living_drive_28.webp",
      "/images/spaces/living/living_drive_29.webp",
      "/images/spaces/living/living_drive_30.webp",
      "/images/spaces/living/living_drive_31.webp",
      "/images/spaces/living/living_drive_32.webp",
      "/images/spaces/living/living_drive_33.webp",
      "/images/spaces/living/living_drive_34.webp",
      "/images/spaces/living/living_drive_36.webp",
      "/images/spaces/living/living_drive_37.webp",
      "/images/spaces/living/living_drive_38.webp",
      "/images/spaces/living/living_drive_39.webp",
      "/images/spaces/living/living_drive_40.webp"
    ],
    "filters": [
      "Minimalist Lounge",
      "Double-Height Living",
      "Luxury Marble Accent",
      "Open Concept Living",
      "Contemporary Formal"
    ]
  },
  {
    "name": "Wardrobe Systems",
    "slug": "wardrobes",
    "description": "Bespoke floor-to-ceiling storage with velvet drawer linings, mirror panels, and hidden pull-out trays.",
    "heroImage": "/images/spaces/wardrobes/wardrobe_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Bespoke Storage",
      "headline": "Storage Systems Engineered to Disappear Seamlessly",
      "body": "Our custom wardrobe systems deliver maximum volume with zero visual clutter. Featuring floor-to-ceiling glass shutters, velvet-lined jewelry pullouts, specialized shoe galleries, and central island dressing consoles with integrated mirrors.",
      "includes": [
        "Floor-to-Ceiling Sliding & Fluted Aluminium Profiles",
        "Dedicated Walk-in Dressing Suite Planning",
        "Internal LED Sensor Light Bars & Wardrobe Rail Glow",
        "Velvet-Lined Jewelry, Watch & Sunglass Drawers",
        "Pull-Out Trouser Racks & Tiered Shoe Pullouts",
        "Tinted Bronze / Fluted Glass Shutter Options",
        "Integrated Full-Height Vanity Mirror with Touch Control",
        "Overhead Loft Cabinets for Seasonal Storage"
      ]
    },
    "galleryImages": [
      "/images/spaces/wardrobes/wardrobe_drive_1.webp",
      "/images/spaces/wardrobes/wardrobe_drive_2.webp",
      "/images/spaces/wardrobes/wardrobe_drive_3.webp",
      "/images/spaces/wardrobes/wardrobe_drive_4.webp",
      "/images/spaces/wardrobes/wardrobe_drive_5.webp",
      "/images/spaces/wardrobes/wardrobe_drive_6.webp",
      "/images/spaces/wardrobes/wardrobe_drive_7.webp",
      "/images/spaces/wardrobes/wardrobe_drive_8.webp",
      "/images/spaces/wardrobes/wardrobe_drive_9.webp",
      "/images/spaces/wardrobes/wardrobe_drive_10.webp",
      "/images/spaces/wardrobes/wardrobe_drive_11.webp",
      "/images/spaces/wardrobes/wardrobe_drive_12.webp",
      "/images/spaces/wardrobes/wardrobe_drive_13.webp",
      "/images/spaces/wardrobes/wardrobe_drive_14.webp",
      "/images/spaces/wardrobes/wardrobe_drive_15.webp",
      "/images/spaces/wardrobes/wardrobe_drive_16.webp",
      "/images/spaces/wardrobes/wardrobe_drive_17.webp",
      "/images/spaces/wardrobes/wardrobe_drive_18.webp",
      "/images/spaces/wardrobes/wardrobe_drive_19.webp",
      "/images/spaces/wardrobes/wardrobe_drive_21.webp",
      "/images/spaces/wardrobes/wardrobe_drive_22.webp",
      "/images/spaces/wardrobes/wardrobe_drive_23.webp",
      "/images/spaces/wardrobes/wardrobe_drive_24.webp",
      "/images/spaces/wardrobes/wardrobe_drive_25.webp",
      "/images/spaces/wardrobes/wardrobe_drive_26.webp",
      "/images/spaces/wardrobes/wardrobe_drive_27.webp",
      "/images/spaces/wardrobes/wardrobe_drive_29.webp",
      "/images/spaces/wardrobes/wardrobe_drive_30.webp",
      "/images/spaces/wardrobes/wardrobe_drive_31.webp",
      "/images/spaces/wardrobes/wardrobe_drive_32.webp",
      "/images/spaces/wardrobes/wardrobe_drive_33.webp",
      "/images/spaces/wardrobes/wardrobe_drive_34.webp",
      "/images/spaces/wardrobes/wardrobe_drive_37.webp",
      "/images/spaces/wardrobes/wardrobe_drive_38.webp"
    ],
    "filters": [
      "Floor-to-Ceiling Sliding",
      "Tinted Glass Shutters",
      "Built-In Veneer & Wood",
      "Open Shelving Systems",
      "Integrated Vanity Dressing"
    ]
  },
  {
    "name": "Home Office",
    "slug": "home-office",
    "description": "Focus zones with sound-dampening fluted panels, ergonomic wall shelving and concealed cable management.",
    "heroImage": "/images/spaces/home_office/home_office_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Focus First",
      "headline": "A Home Office Built for Deep Work",
      "body": "Your home office should reduce friction, not create it. We design distraction-free work environments with ergonomic desk setups, concealed cable runs, built-in shelving, and acoustic treatments that let you focus — while still looking like a space you are proud to be on camera in.",
      "includes": [
        "Ergonomic Desk & Chair Zone",
        "Built-in Shelving & Storage",
        "Concealed Cable Management",
        "Fluted Acoustic Panels",
        "Task & Ambient Lighting",
        "Monitor Arm & Hardware Integration",
        "Bookshelf & Display Niches",
        "Folding / Murphy Bed Option"
      ]
    },
    "galleryImages": [
      "/images/spaces/home_office/home_office_drive_1.webp",
      "/images/spaces/home_office/home_office_drive_2.webp",
      "/images/spaces/home_office/home_office_drive_3.webp",
      "/images/spaces/home_office/home_office_drive_4.webp",
      "/images/spaces/home_office/home_office_drive_5.webp",
      "/images/spaces/home_office/home_office_drive_6.webp",
      "/images/spaces/home_office/home_office_drive_7.webp",
      "/images/spaces/home_office/home_office_drive_8.webp",
      "/images/spaces/home_office/home_office_drive_9.webp",
      "/images/spaces/home_office/home_office_drive_10.webp",
      "/images/spaces/home_office/home_office_drive_11.webp",
      "/images/spaces/home_office/home_office_drive_12.webp",
      "/images/spaces/home_office/home_office_drive_13.webp",
      "/images/spaces/home_office/home_office_drive_14.webp",
      "/images/spaces/home_office/home_office_drive_15.webp",
      "/images/spaces/home_office/home_office_drive_16.webp",
      "/images/spaces/home_office/home_office_drive_17.webp",
      "/images/spaces/home_office/home_office_drive_18.webp",
      "/images/spaces/home_office/home_office_drive_19.webp",
      "/images/spaces/home_office/home_office_drive_20.webp",
      "/images/spaces/home_office/home_office_drive_21.webp",
      "/images/spaces/home_office/home_office_drive_22.webp",
      "/images/spaces/home_office/home_office_drive_23.webp",
      "/images/spaces/home_office/home_office_drive_24.webp",
      "/images/spaces/home_office/home_office_drive_25.webp",
      "/images/spaces/home_office/home_office_drive_26.webp",
      "/images/spaces/home_office/home_office_drive_27.webp",
      "/images/spaces/home_office/home_office_drive_28.webp",
      "/images/spaces/home_office/home_office_drive_30.webp",
      "/images/spaces/home_office/home_office_drive_31.webp",
      "/images/spaces/home_office/home_office_drive_32.webp",
      "/images/spaces/home_office/home_office_drive_33.webp",
      "/images/spaces/home_office/home_office_drive_34.webp",
      "/images/spaces/home_office/home_office_drive_35.webp",
      "/images/spaces/home_office/home_office_drive_36.webp",
      "/images/spaces/home_office/home_office_drive_37.webp",
      "/images/spaces/home_office/home_office_drive_38.webp",
      "/images/spaces/home_office/home_office_drive_39.webp",
      "/images/spaces/home_office/home_office_drive_40.webp",
      "/images/spaces/home_office/home_office_drive_41.webp",
      "/images/spaces/home_office/home_office_drive_42.webp",
      "/images/spaces/home_office/home_office_drive_43.webp",
      "/images/spaces/home_office/home_office_drive_44.webp"
    ],
    "filters": [
      "Executive Study",
      "Minimal Studio Desk",
      "Dual Workstation",
      "Acoustic Panelled Office",
      "Library & Bookshelf Suite"
    ]
  },
  {
    "name": "Commercial Office",
    "slug": "commercial-office",
    "description": "Turnkey executive workspaces designed for efficient traffic flows, acoustic panels, and brand-aligned finishes.",
    "heroImage": "/images/spaces/office/office_drive_4.webp",
    "visible": true,
    "details": {
      "tag": "Productivity-First",
      "headline": "Offices That Reflect Your Brand Standard",
      "body": "A well-designed commercial office increases output, attracts talent, and communicates who you are the moment someone walks in. We plan open floors, cabin clusters, meeting rooms, and collaboration zones with precision — integrating your brand identity into every surface, from reception to the boardroom.",
      "includes": [
        "Open Plan & Cabin Zone Design",
        "Ergonomic Workstation Systems",
        "Meeting & Conference Room Build",
        "Manager Cabin & Director Suite",
        "Reception & Lobby Design",
        "Pantry & Lounge Area",
        "Acoustic Treatment",
        "AV & Tech Integration"
      ]
    },
    "galleryImages": [
      "/images/spaces/office/office_drive_1.webp",
      "/images/spaces/office/office_drive_2.webp",
      "/images/spaces/office/office_drive_3.webp",
      "/images/spaces/office/office_drive_4.webp",
      "/images/spaces/office/office_drive_5.webp",
      "/images/spaces/office/office_drive_6.webp",
      "/images/spaces/office/office_drive_7.webp",
      "/images/spaces/office/office_drive_8.webp",
      "/images/spaces/office/office_drive_9.webp",
      "/images/spaces/office/office_drive_10.webp",
      "/images/spaces/office/office_drive_11.webp",
      "/images/spaces/office/office_drive_12.webp",
      "/images/spaces/office/office_drive_13.webp",
      "/images/spaces/office/office_drive_14.webp",
      "/images/spaces/office/office_drive_15.webp",
      "/images/spaces/office/office_drive_16.webp",
      "/images/spaces/office/office_drive_17.webp",
      "/images/spaces/office/office_drive_18.webp",
      "/images/spaces/office/office_drive_19.webp",
      "/images/spaces/office/office_drive_20.webp",
      "/images/spaces/office/office_drive_21.webp",
      "/images/spaces/office/office_drive_22.webp",
      "/images/spaces/office/office_drive_23.webp",
      "/images/spaces/office/office_drive_24.webp",
      "/images/spaces/office/office_drive_25.webp",
      "/images/spaces/office/office_drive_26.webp",
      "/images/spaces/office/office_drive_27.webp",
      "/images/spaces/office/office_drive_28.webp",
      "/images/spaces/office/office_drive_29.webp",
      "/images/spaces/office/office_drive_30.webp",
      "/images/spaces/office/office_drive_31.webp",
      "/images/spaces/office/office_drive_32.webp",
      "/images/spaces/office/office_drive_33.webp",
      "/images/spaces/office/office_drive_34.webp",
      "/images/spaces/office/office_drive_35.webp",
      "/images/spaces/office/office_drive_36.webp",
      "/images/spaces/office/office_drive_37.webp"
    ],
    "filters": [
      "Executive Boardroom",
      "Open Workstation Floor",
      "Private Director Cabin",
      "Acoustic Conference Room",
      "Collaboration Lounge"
    ]
  },
  {
    "name": "Pooja Room",
    "slug": "pooja-room",
    "description": "Sacred sanctuaries merging ancestral stone textures with sleek back-lit marble panels and warm lighting.",
    "heroImage": "/images/spaces/pooja/pooja_drive_12.webp",
    "visible": true,
    "details": {
      "tag": "Sacred Spaces",
      "headline": "Pooja Rooms That Honour Tradition",
      "body": "We craft pooja units and dedicated prayer rooms that hold both spiritual significance and design integrity. From carved wood mandirs to sleek marble platforms with backlit panels — each piece is built to become the most meaningful corner of your home.",
      "includes": [
        "Marble & Granite Platforms",
        "Carved Wood Temple Units",
        "Backlit Jali Panels",
        "Integrated Diya & Lamp Holders",
        "Brass & Metal Accent Details",
        "Storage for Puja Items",
        "Dedicated Prayer Room Design",
        "Custom Temple in Teak / Rosewood"
      ]
    },
    "galleryImages": [
      "/images/spaces/pooja/pooja_drive_1.webp",
      "/images/spaces/pooja/pooja_drive_2.webp",
      "/images/spaces/pooja/pooja_drive_3.webp",
      "/images/spaces/pooja/pooja_drive_4.webp",
      "/images/spaces/pooja/pooja_drive_5.webp",
      "/images/spaces/pooja/pooja_drive_6.webp",
      "/images/spaces/pooja/pooja_drive_7.webp",
      "/images/spaces/pooja/pooja_drive_8.webp",
      "/images/spaces/pooja/pooja_drive_9.webp",
      "/images/spaces/pooja/pooja_drive_10.webp",
      "/images/spaces/pooja/pooja_drive_11.webp",
      "/images/spaces/pooja/pooja_drive_12.webp",
      "/images/spaces/pooja/pooja_drive_13.webp",
      "/images/spaces/pooja/pooja_drive_14.webp",
      "/images/spaces/pooja/pooja_drive_15.webp",
      "/images/spaces/pooja/pooja_drive_16.webp",
      "/images/spaces/pooja/pooja_drive_17.webp",
      "/images/spaces/pooja/pooja_drive_18.webp",
      "/images/spaces/pooja/pooja_drive_19.webp",
      "/images/spaces/pooja/pooja_drive_20.webp",
      "/images/spaces/pooja/pooja_drive_21.webp",
      "/images/spaces/pooja/pooja_drive_22.webp",
      "/images/spaces/pooja/pooja_drive_23.webp",
      "/images/spaces/pooja/pooja_drive_25.webp",
      "/images/spaces/pooja/pooja_drive_26.webp",
      "/images/spaces/pooja/pooja_drive_27.webp",
      "/images/spaces/pooja/pooja_drive_28.webp",
      "/images/spaces/pooja/pooja_drive_29.webp"
    ],
    "filters": [
      "Dedicated Mandir Room",
      "CNC Backlit Jali",
      "Marble & Corian Sanctum",
      "Compact Wood Mandir",
      "Traditional Brass & Teak"
    ]
  },
  {
    "name": "Dining Room",
    "slug": "dining-room",
    "description": "Refined gathering spaces with custom hardwood dining tables, feature pendant lighting, and plaster wall finishes.",
    "heroImage": "/images/spaces/dining/dining_drive_27.webp",
    "visible": true,
    "details": {
      "tag": "Gather & Dine",
      "headline": "Dining Rooms Designed for Every Occasion",
      "body": "From intimate family dinners to grand entertaining, our dining rooms are designed to be the heart of your home. We combine statement lighting, custom joinery, and carefully chosen materials to create spaces that feel warm for everyday use and spectacular when you need them to be.",
      "includes": [
        "Dining Table & Chair Selection",
        "Crockery Unit & Buffet Design",
        "Feature Pendant & Chandelier",
        "Wallpaper & Textured Accent Wall",
        "Flooring Pattern & Material",
        "Window Treatment & Drapes",
        "Bar & Drinks Cabinet Integration",
        "Open Plan Dining-Living Design"
      ]
    },
    "galleryImages": [
      "/images/spaces/dining/dining_drive_1.webp",
      "/images/spaces/dining/dining_drive_2.webp",
      "/images/spaces/dining/dining_drive_3.webp",
      "/images/spaces/dining/dining_drive_4.webp",
      "/images/spaces/dining/dining_drive_5.webp",
      "/images/spaces/dining/dining_drive_6.webp",
      "/images/spaces/dining/dining_drive_7.webp",
      "/images/spaces/dining/dining_drive_8.webp",
      "/images/spaces/dining/dining_drive_9.webp",
      "/images/spaces/dining/dining_drive_10.webp",
      "/images/spaces/dining/dining_drive_11.webp",
      "/images/spaces/dining/dining_drive_12.webp",
      "/images/spaces/dining/dining_drive_13.webp",
      "/images/spaces/dining/dining_drive_14.webp",
      "/images/spaces/dining/dining_drive_15.webp",
      "/images/spaces/dining/dining_drive_16.webp",
      "/images/spaces/dining/dining_drive_17.webp",
      "/images/spaces/dining/dining_drive_18.webp",
      "/images/spaces/dining/dining_drive_19.webp",
      "/images/spaces/dining/dining_drive_20.webp",
      "/images/spaces/dining/dining_drive_21.webp",
      "/images/spaces/dining/dining_drive_22.webp",
      "/images/spaces/dining/dining_drive_23.webp",
      "/images/spaces/dining/dining_drive_24.webp",
      "/images/spaces/dining/dining_drive_25.webp",
      "/images/spaces/dining/dining_drive_26.webp",
      "/images/spaces/dining/dining_drive_27.webp",
      "/images/spaces/dining/dining_drive_28.webp",
      "/images/spaces/dining/dining_drive_29.webp",
      "/images/spaces/dining/dining_drive_30.webp",
      "/images/spaces/dining/dining_drive_31.webp",
      "/images/spaces/dining/dining_drive_32.webp",
      "/images/spaces/dining/dining_drive_33.webp",
      "/images/spaces/dining/dining_drive_35.webp",
      "/images/spaces/dining/dining_drive_36.webp",
      "/images/spaces/dining/dining_drive_37.webp",
      "/images/spaces/dining/dining_drive_38.webp",
      "/images/spaces/dining/dining_drive_39.webp",
      "/images/spaces/dining/dining_drive_40.webp",
      "/images/spaces/dining/dining_drive_41.webp",
      "/images/spaces/dining/dining_drive_42.webp",
      "/images/spaces/dining/dining_drive_43.webp",
      "/images/spaces/dining/dining_drive_44.webp",
      "/images/spaces/dining/dining_drive_45.webp",
      "/images/spaces/dining/dining_drive_46.webp",
      "/images/spaces/dining/dining_drive_47.webp",
      "/images/spaces/dining/dining_drive_48.webp",
      "/images/spaces/dining/dining_drive_49.webp",
      "/images/spaces/dining/dining_drive_50.webp"
    ],
    "filters": [
      "8-Seater Formal Dining",
      "Marble Top & Bar Console",
      "Fluted Glass Partition",
      "Breakfast Nook & Bistro",
      "Duplex Dining Lounge"
    ]
  },
  {
    "name": "TV Units",
    "slug": "tv-units",
    "description": "Custom TV walls and entertainment units that serve as the centrepiece of your living space — built-in storage, LED niches, and seamless cable management.",
    "heroImage": "/images/spaces/tv_units/tv_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Focal Point",
      "headline": "TV Units That Define the Room",
      "body": "The TV unit is the living room centrepiece — and it should look like one. We design custom entertainment walls with LED backlit niches, closed storage, open display shelves, and seamless cable management systems that make every inch purposeful and every viewing angle cinematic.",
      "includes": [
        "Custom TV Panel & Wall Design",
        "LED Backlit Display Niches",
        "Integrated Cable Management",
        "Open & Closed Storage Mix",
        "Floating Console Options",
        "Material & Finish Coordination",
        "Side Column & Tower Units",
        "Soundbar & AV Equipment Integration"
      ]
    },
    "galleryImages": [
      "/images/spaces/tv_units/tv_drive_1.webp",
      "/images/spaces/tv_units/tv_drive_2.webp",
      "/images/spaces/tv_units/tv_drive_3.webp",
      "/images/spaces/tv_units/tv_drive_4.webp",
      "/images/spaces/tv_units/tv_drive_5.webp",
      "/images/spaces/tv_units/tv_drive_6.webp",
      "/images/spaces/tv_units/tv_drive_7.webp",
      "/images/spaces/tv_units/tv_drive_8.webp",
      "/images/spaces/tv_units/tv_drive_9.webp",
      "/images/spaces/tv_units/tv_drive_10.webp",
      "/images/spaces/tv_units/tv_drive_11.webp",
      "/images/spaces/tv_units/tv_drive_12.webp",
      "/images/spaces/tv_units/tv_drive_13.webp",
      "/images/spaces/tv_units/tv_drive_14.webp",
      "/images/spaces/tv_units/tv_drive_15.webp",
      "/images/spaces/tv_units/tv_drive_16.webp",
      "/images/spaces/tv_units/tv_drive_17.webp",
      "/images/spaces/tv_units/tv_drive_18.webp",
      "/images/spaces/tv_units/tv_drive_19.webp",
      "/images/spaces/tv_units/tv_drive_20.webp",
      "/images/spaces/tv_units/tv_drive_21.webp",
      "/images/spaces/tv_units/tv_drive_22.webp",
      "/images/spaces/tv_units/tv_drive_23.webp",
      "/images/spaces/tv_units/tv_drive_24.webp",
      "/images/spaces/tv_units/tv_drive_25.webp",
      "/images/spaces/tv_units/tv_drive_26.webp",
      "/images/spaces/tv_units/tv_drive_27.webp",
      "/images/spaces/tv_units/tv_drive_28.webp",
      "/images/spaces/tv_units/tv_drive_29.webp",
      "/images/spaces/tv_units/tv_drive_30.webp",
      "/images/spaces/tv_units/tv_drive_31.webp",
      "/images/spaces/tv_units/tv_drive_32.webp",
      "/images/spaces/tv_units/tv_drive_33.webp",
      "/images/spaces/tv_units/tv_drive_34.webp",
      "/images/spaces/tv_units/tv_drive_35.webp",
      "/images/spaces/tv_units/tv_drive_36.webp",
      "/images/spaces/tv_units/tv_drive_37.webp"
    ],
    "filters": [
      "Full-Wall Marble Console",
      "Floating Acoustic Fluted",
      "Backlit Onyx Feature Wall",
      "Minimalist Low-Profile",
      "Rotatable Partition Unit"
    ]
  },
  {
    "name": "False Ceilings",
    "slug": "false-ceilings",
    "description": "Architectural false ceilings that transform the fifth wall — gypsum coffers, cove lighting strips, and acoustic panels for every interior.",
    "heroImage": "/images/spaces/ceiling/ceiling_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Overhead Drama",
      "headline": "Ceilings That Complete the Room",
      "body": "A false ceiling transforms the entire character of a space — adding height illusion, depth, and the perfect canvas for lighting. We design gypsum and POP false ceilings with cove lighting, tray details, coffered panels, and acoustic variants for every room from bedrooms to commercial lobbies.",
      "includes": [
        "Gypsum & POP Ceiling Systems",
        "Cove Lighting & LED Strip Integration",
        "Coffered & Tray Ceiling Designs",
        "Fan & Fixture Positioning",
        "Acoustic Panel Options",
        "Moisture-Resistant Bathroom Variants",
        "Multi-Level Dropped Ceiling Design",
        "Coordination with Electrical & AC Points"
      ]
    },
    "galleryImages": [
      "/images/spaces/ceiling/ceiling_drive_1.webp",
      "/images/spaces/ceiling/ceiling_drive_2.webp",
      "/images/spaces/ceiling/ceiling_drive_3.webp",
      "/images/spaces/ceiling/ceiling_drive_4.webp",
      "/images/spaces/ceiling/ceiling_drive_5.webp",
      "/images/spaces/ceiling/ceiling_drive_6.webp",
      "/images/spaces/ceiling/ceiling_drive_7.webp",
      "/images/spaces/ceiling/ceiling_drive_8.webp",
      "/images/spaces/ceiling/ceiling_drive_9.webp",
      "/images/spaces/ceiling/ceiling_drive_10.webp",
      "/images/spaces/ceiling/ceiling_drive_11.webp",
      "/images/spaces/ceiling/ceiling_drive_12.webp",
      "/images/spaces/ceiling/ceiling_drive_13.webp",
      "/images/spaces/ceiling/ceiling_drive_14.webp",
      "/images/spaces/ceiling/ceiling_drive_15.webp",
      "/images/spaces/ceiling/ceiling_drive_16.webp",
      "/images/spaces/ceiling/ceiling_drive_17.webp",
      "/images/spaces/ceiling/ceiling_drive_18.webp",
      "/images/spaces/ceiling/ceiling_drive_19.webp",
      "/images/spaces/ceiling/ceiling_drive_20.webp",
      "/images/spaces/ceiling/ceiling_drive_21.webp",
      "/images/spaces/ceiling/ceiling_drive_22.webp",
      "/images/spaces/ceiling/ceiling_drive_23.webp",
      "/images/spaces/ceiling/ceiling_drive_24.webp",
      "/images/spaces/ceiling/ceiling_drive_25.webp",
      "/images/spaces/ceiling/ceiling_drive_26.webp",
      "/images/spaces/ceiling/ceiling_drive_27.webp",
      "/images/spaces/ceiling/ceiling_drive_28.webp",
      "/images/spaces/ceiling/ceiling_drive_29.webp",
      "/images/spaces/ceiling/ceiling_drive_30.webp",
      "/images/spaces/ceiling/ceiling_drive_31.webp",
      "/images/spaces/ceiling/ceiling_drive_32.webp",
      "/images/spaces/ceiling/ceiling_drive_33.webp",
      "/images/spaces/ceiling/ceiling_drive_34.webp",
      "/images/spaces/ceiling/ceiling_drive_35.webp",
      "/images/spaces/ceiling/ceiling_drive_36.webp",
      "/images/spaces/ceiling/ceiling_drive_37.webp",
      "/images/spaces/ceiling/ceiling_drive_38.webp",
      "/images/spaces/ceiling/ceiling_drive_39.webp",
      "/images/spaces/ceiling/ceiling_drive_40.webp",
      "/images/spaces/ceiling/ceiling_drive_41.webp",
      "/images/spaces/ceiling/ceiling_drive_42.webp",
      "/images/spaces/ceiling/ceiling_drive_43.webp",
      "/images/spaces/ceiling/ceiling_drive_44.webp",
      "/images/spaces/ceiling/ceiling_drive_45.webp",
      "/images/spaces/ceiling/ceiling_drive_46.webp"
    ],
    "filters": [
      "Magnetic Track & Warm Coves",
      "Wooden Rafter & Slat Ceiling",
      "Minimalist Peripheral Drop",
      "Coffered & Geometric Ceiling",
      "Stretch Fabric & Backlit Ceiling"
    ]
  },
  {
    "name": "Commercial Interiors",
    "slug": "commercial-interiors",
    "description": "Retail showrooms, clinics, salons, and brand spaces designed to communicate identity while maximising customer experience.",
    "heroImage": "/images/spaces/commercial/commercial_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Brand Experience",
      "headline": "Commercial Spaces That Work as Hard as You Do",
      "body": "Retail showrooms, clinics, salons, and specialty stores — each built to communicate your brand identity the moment a customer walks in. We combine flow planning, feature lighting, bespoke joinery, and compliance-ready construction into commercial interiors that convert visitors into loyal clients.",
      "includes": [
        "Retail Display & Merchandising Layout",
        "Brand Integration Design",
        "Customer Flow Zone Planning",
        "Feature Lighting & Spotlighting",
        "Signage & Identity Elements",
        "Clinic & Salon Specific Fit-outs",
        "Compliance-Ready Build",
        "Custom Joinery & Counter Units"
      ]
    },
    "galleryImages": [
      "/images/spaces/commercial/commercial_drive_1.webp",
      "/images/spaces/commercial/commercial_drive_2.webp",
      "/images/spaces/commercial/commercial_drive_3.webp",
      "/images/spaces/commercial/commercial_drive_4.webp",
      "/images/spaces/commercial/commercial_drive_5.webp",
      "/images/spaces/commercial/commercial_drive_6.webp",
      "/images/spaces/commercial/commercial_drive_7.webp",
      "/images/spaces/commercial/commercial_drive_8.webp",
      "/images/spaces/commercial/commercial_drive_9.webp",
      "/images/spaces/commercial/commercial_drive_10.webp",
      "/images/spaces/commercial/commercial_drive_11.webp",
      "/images/spaces/commercial/commercial_drive_12.webp",
      "/images/spaces/commercial/commercial_drive_13.webp",
      "/images/spaces/commercial/commercial_drive_14.webp",
      "/images/spaces/commercial/commercial_drive_15.webp",
      "/images/spaces/commercial/commercial_drive_16.webp",
      "/images/spaces/commercial/commercial_drive_17.webp",
      "/images/spaces/commercial/commercial_drive_18.webp",
      "/images/spaces/commercial/commercial_drive_19.webp",
      "/images/spaces/commercial/commercial_drive_20.webp",
      "/images/spaces/commercial/commercial_drive_21.webp",
      "/images/spaces/commercial/commercial_drive_22.webp",
      "/images/spaces/commercial/commercial_drive_23.webp",
      "/images/spaces/commercial/commercial_drive_24.webp",
      "/images/spaces/commercial/commercial_drive_25.webp",
      "/images/spaces/commercial/commercial_drive_26.webp",
      "/images/spaces/commercial/commercial_drive_27.webp",
      "/images/spaces/commercial/commercial_drive_28.webp",
      "/images/spaces/commercial/commercial_drive_29.webp",
      "/images/spaces/commercial/commercial_drive_30.webp",
      "/images/spaces/commercial/commercial_drive_31.webp",
      "/images/spaces/commercial/commercial_drive_32.webp",
      "/images/spaces/commercial/commercial_drive_33.webp",
      "/images/spaces/commercial/commercial_drive_34.webp",
      "/images/spaces/commercial/commercial_drive_35.webp",
      "/images/spaces/commercial/commercial_drive_36.webp",
      "/images/spaces/commercial/commercial_drive_37.webp",
      "/images/spaces/commercial/commercial_drive_38.webp",
      "/images/spaces/commercial/commercial_drive_39.webp",
      "/images/spaces/commercial/commercial_drive_40.webp",
      "/images/spaces/commercial/commercial_drive_41.webp"
    ],
    "filters": [
      "Corporate Headquarters",
      "Retail & Showroom Store",
      "Clinic & Wellness Center",
      "Law & Financial Atelier",
      "Tech Innovation Hub"
    ]
  },
  {
    "name": "Reception Areas",
    "slug": "reception-areas",
    "description": "Striking lobby and reception spaces that communicate professionalism and set the tone for the entire building experience.",
    "heroImage": "/images/spaces/reception/reception_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "First Impressions",
      "headline": "Receptions That Say Everything Before You Do",
      "body": "The reception is the first physical impression of your organisation. We design statement reception desks, feature walls, curated lounge seating, and dramatic lighting that communicates authority, trust, and quality — whether for a corporate office, luxury residential tower, or healthcare facility.",
      "includes": [
        "Statement Reception Desk Design",
        "Feature Wall & Logo Branding",
        "Seating Lounge & Wait Area",
        "Dramatic Lighting Design",
        "Signage & Wayfinding System",
        "Flooring & Ceiling Coordination",
        "Security & Access Integration",
        "Plant & Biophilic Design"
      ]
    },
    "galleryImages": [
      "/images/spaces/reception/reception_drive_1.webp",
      "/images/spaces/reception/reception_drive_2.webp",
      "/images/spaces/reception/reception_drive_3.webp",
      "/images/spaces/reception/reception_drive_4.webp",
      "/images/spaces/reception/reception_drive_5.webp",
      "/images/spaces/reception/reception_drive_6.webp",
      "/images/spaces/reception/reception_drive_7.webp",
      "/images/spaces/reception/reception_drive_8.webp",
      "/images/spaces/reception/reception_drive_9.webp",
      "/images/spaces/reception/reception_drive_10.webp",
      "/images/spaces/reception/reception_drive_11.webp",
      "/images/spaces/reception/reception_drive_12.webp",
      "/images/spaces/reception/reception_drive_13.webp",
      "/images/spaces/reception/reception_drive_14.webp",
      "/images/spaces/reception/reception_drive_15.webp",
      "/images/spaces/reception/reception_drive_16.webp",
      "/images/spaces/reception/reception_drive_17.webp",
      "/images/spaces/reception/reception_drive_18.webp",
      "/images/spaces/reception/reception_drive_19.webp",
      "/images/spaces/reception/reception_drive_20.webp",
      "/images/spaces/reception/reception_drive_21.webp",
      "/images/spaces/reception/reception_drive_22.webp",
      "/images/spaces/reception/reception_drive_23.webp",
      "/images/spaces/reception/reception_drive_24.webp",
      "/images/spaces/reception/reception_drive_25.webp",
      "/images/spaces/reception/reception_drive_26.webp",
      "/images/spaces/reception/reception_drive_27.webp",
      "/images/spaces/reception/reception_drive_28.webp",
      "/images/spaces/reception/reception_drive_30.webp",
      "/images/spaces/reception/reception_drive_31.webp",
      "/images/spaces/reception/reception_drive_32.webp",
      "/images/spaces/reception/reception_drive_33.webp",
      "/images/spaces/reception/reception_drive_34.webp",
      "/images/spaces/reception/reception_drive_35.webp"
    ],
    "filters": [
      "Monolithic Stone Reception Desk",
      "Corporate Brand Identity Wall",
      "Luxury Client Lounge",
      "Fluted Wood & Green Wall",
      "Double-Height Entry Lobby"
    ]
  },
  {
    "name": "Cafes & Restaurants",
    "slug": "cafes-restaurants",
    "description": "Atmospheric F&B spaces built for dwell time — bespoke seating zones, bar counters, acoustic treatment, and curated ambient lighting.",
    "heroImage": "/images/spaces/cafes/cafe_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Hospitality Design",
      "headline": "F&B Spaces Built for Atmosphere and Dwell Time",
      "body": "Great cafes and restaurants are designed before they are staffed. We create atmospheric F&B interiors that balance seating density with comfort, acoustics with energy, and brand identity with guest experience — from intimate specialty coffee bars to large-format restaurant builds.",
      "includes": [
        "Seating Zone & Table Planning",
        "Bar Counter & Barista Station",
        "Ambient & Task Lighting Design",
        "Acoustic Treatment & Sound Zoning",
        "Menu Display & Signage",
        "Custom Furniture & Upholstery",
        "Kitchen Pass & Service Design",
        "Outdoor & Alfresco Seating"
      ]
    },
    "galleryImages": [
      "/images/spaces/cafes/cafe_drive_1.webp",
      "/images/spaces/cafes/cafe_drive_2.webp",
      "/images/spaces/cafes/cafe_drive_3.webp",
      "/images/spaces/cafes/cafe_drive_4.webp",
      "/images/spaces/cafes/cafe_drive_5.webp",
      "/images/spaces/cafes/cafe_drive_6.webp",
      "/images/spaces/cafes/cafe_drive_7.webp",
      "/images/spaces/cafes/cafe_drive_8.webp",
      "/images/spaces/cafes/cafe_drive_9.webp",
      "/images/spaces/cafes/cafe_drive_10.webp",
      "/images/spaces/cafes/cafe_drive_11.webp",
      "/images/spaces/cafes/cafe_drive_12.webp",
      "/images/spaces/cafes/cafe_drive_13.webp",
      "/images/spaces/cafes/cafe_drive_14.webp",
      "/images/spaces/cafes/cafe_drive_15.webp",
      "/images/spaces/cafes/cafe_drive_16.webp",
      "/images/spaces/cafes/cafe_drive_17.webp",
      "/images/spaces/cafes/cafe_drive_18.webp",
      "/images/spaces/cafes/cafe_drive_19.webp",
      "/images/spaces/cafes/cafe_drive_20.webp",
      "/images/spaces/cafes/cafe_drive_21.webp",
      "/images/spaces/cafes/cafe_drive_22.webp",
      "/images/spaces/cafes/cafe_drive_23.webp",
      "/images/spaces/cafes/cafe_drive_24.webp",
      "/images/spaces/cafes/cafe_drive_25.webp",
      "/images/spaces/cafes/cafe_drive_26.webp",
      "/images/spaces/cafes/cafe_drive_27.webp",
      "/images/spaces/cafes/cafe_drive_28.webp",
      "/images/spaces/cafes/cafe_drive_29.webp",
      "/images/spaces/cafes/cafe_drive_30.webp",
      "/images/spaces/cafes/cafe_drive_31.webp",
      "/images/spaces/cafes/cafe_drive_32.webp",
      "/images/spaces/cafes/cafe_drive_33.webp",
      "/images/spaces/cafes/cafe_drive_34.webp",
      "/images/spaces/cafes/cafe_drive_35.webp",
      "/images/spaces/cafes/cafe_drive_36.webp",
      "/images/spaces/cafes/cafe_drive_37.webp",
      "/images/spaces/cafes/cafe_drive_38.webp",
      "/images/spaces/cafes/cafe_drive_39.webp",
      "/images/spaces/cafes/cafe_drive_40.webp",
      "/images/spaces/cafes/cafe_drive_41.webp",
      "/images/spaces/cafes/cafe_drive_42.webp"
    ],
    "filters": [
      "Specialty Coffee Bistro",
      "Fine Dining Hall",
      "Industrial Rooftop Bar",
      "Bohemian Lounge",
      "Quick-Service Gourmet Counter"
    ]
  },
  {
    "name": "Villas",
    "slug": "villas",
    "description": "Bespoke multi-floor villa interiors with luxury material palettes, indoor-outdoor integration, and smart home readiness.",
    "heroImage": "/images/spaces/villas/villa_drive_30.webp",
    "visible": true,
    "details": {
      "tag": "Luxury Living",
      "headline": "Villa Interiors Designed Floor to Ceiling",
      "body": "A villa is the ultimate canvas for interior design. We coordinate multi-floor design narratives — from ground floor living and entertainment zones to upper-level private suites and terraces — with a singular luxury material palette, smart home readiness, and indoor-outdoor living as a design principle, not an afterthought.",
      "includes": [
        "Multi-Floor Design Coordination",
        "Luxury Material & Stone Selection",
        "Indoor-Outdoor Living Integration",
        "Home Theatre & AV Room",
        "Private Gym & Study Design",
        "Smart Home Preparation",
        "Staircase & Landing Design",
        "Landscaping Coordination"
      ]
    },
    "galleryImages": [
      "/images/spaces/villas/villa_drive_30.webp",
      "/images/spaces/villas/villa_drive_1.webp",
      "/images/spaces/villas/villa_drive_2.webp",
      "/images/spaces/villas/villa_drive_3.webp",
      "/images/spaces/villas/villa_drive_4.webp",
      "/images/spaces/villas/villa_drive_5.webp",
      "/images/spaces/villas/villa_drive_6.webp",
      "/images/spaces/villas/villa_drive_7.webp",
      "/images/spaces/villas/villa_drive_8.webp",
      "/images/spaces/villas/villa_drive_9.webp",
      "/images/spaces/villas/villa_drive_10.webp",
      "/images/spaces/villas/villa_drive_11.webp",
      "/images/spaces/villas/villa_drive_12.webp",
      "/images/spaces/villas/villa_drive_13.webp",
      "/images/spaces/villas/villa_drive_14.webp",
      "/images/spaces/villas/villa_drive_15.webp",
      "/images/spaces/villas/villa_drive_16.webp",
      "/images/spaces/villas/villa_drive_17.webp",
      "/images/spaces/villas/villa_drive_18.webp",
      "/images/spaces/villas/villa_drive_19.webp",
      "/images/spaces/villas/villa_drive_20.webp",
      "/images/spaces/villas/villa_drive_21.webp",
      "/images/spaces/villas/villa_drive_22.webp",
      "/images/spaces/villas/villa_drive_23.webp",
      "/images/spaces/villas/villa_drive_24.webp",
      "/images/spaces/villas/villa_drive_25.webp",
      "/images/spaces/villas/villa_drive_26.webp",
      "/images/spaces/villas/villa_drive_27.webp",
      "/images/spaces/villas/villa_drive_28.webp",
      "/images/spaces/villas/villa_drive_29.webp",
      "/images/spaces/villas/villa_drive_31.webp",
      "/images/spaces/villas/villa_drive_32.webp",
      "/images/spaces/villas/villa_drive_33.webp",
      "/images/spaces/villas/villa_drive_34.webp",
      "/images/spaces/villas/villa_drive_35.webp"
    ],
    "filters": [
      "Grand Double-Height Foyer",
      "Courtyard & Lightwell Villa",
      "Contemporary Gated Villa",
      "Indo-Classical Luxury Villa",
      "Private Pent-Villa Deck"
    ]
  },
  {
    "name": "Apartments",
    "slug": "apartments",
    "description": "Smart apartment interiors that maximise every square foot — optimised storage, multi-use furniture, and neutral versatile palettes.",
    "heroImage": "/images/spaces/apartments/apartment_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Optimised Spaces",
      "headline": "Apartment Interiors That Maximise Every Square Foot",
      "body": "Smart apartment design is about precision — making 1000 sq ft live like 1400 through clever storage, multi-use furniture, and layouts that open the space up visually. We design apartments from studio configurations to 3BHK full-home packages, all with the same commitment to quality and finish.",
      "includes": [
        "Space Optimisation Floor Planning",
        "Built-in Storage Throughout",
        "Multi-Use & Convertible Furniture",
        "Balcony & Utility Integration",
        "Compact Modular Kitchen",
        "Full Home Interior Package",
        "Neutral & Versatile Palette",
        "2BHK & 3BHK Specialisation"
      ]
    },
    "galleryImages": [
      "/images/spaces/apartments/apartment_drive_1.webp",
      "/images/spaces/apartments/apartment_drive_2.webp",
      "/images/spaces/apartments/apartment_drive_3.webp",
      "/images/spaces/apartments/apartment_drive_4.webp",
      "/images/spaces/apartments/apartment_drive_5.webp",
      "/images/spaces/apartments/apartment_drive_6.webp",
      "/images/spaces/apartments/apartment_drive_7.webp",
      "/images/spaces/apartments/apartment_drive_8.webp",
      "/images/spaces/apartments/apartment_drive_9.webp",
      "/images/spaces/apartments/apartment_drive_10.webp",
      "/images/spaces/apartments/apartment_drive_11.webp",
      "/images/spaces/apartments/apartment_drive_12.webp",
      "/images/spaces/apartments/apartment_drive_13.webp",
      "/images/spaces/apartments/apartment_drive_14.webp",
      "/images/spaces/apartments/apartment_drive_15.webp",
      "/images/spaces/apartments/apartment_drive_16.webp",
      "/images/spaces/apartments/apartment_drive_17.webp",
      "/images/spaces/apartments/apartment_drive_18.webp",
      "/images/spaces/apartments/apartment_drive_19.webp",
      "/images/spaces/apartments/apartment_drive_20.webp",
      "/images/spaces/apartments/apartment_drive_21.webp",
      "/images/spaces/apartments/apartment_drive_22.webp",
      "/images/spaces/apartments/apartment_drive_23.webp",
      "/images/spaces/apartments/apartment_drive_24.webp",
      "/images/spaces/apartments/apartment_drive_25.webp",
      "/images/spaces/apartments/apartment_drive_26.webp",
      "/images/spaces/apartments/apartment_drive_27.webp",
      "/images/spaces/apartments/apartment_drive_28.webp",
      "/images/spaces/apartments/apartment_drive_29.webp",
      "/images/spaces/apartments/apartment_drive_30.webp",
      "/images/spaces/apartments/apartment_drive_31.webp",
      "/images/spaces/apartments/apartment_drive_32.webp",
      "/images/spaces/apartments/apartment_drive_33.webp",
      "/images/spaces/apartments/apartment_drive_34.webp",
      "/images/spaces/apartments/apartment_drive_35.webp",
      "/images/spaces/apartments/apartment_drive_36.webp",
      "/images/spaces/apartments/apartment_drive_37.webp",
      "/images/spaces/apartments/apartment_drive_38.webp",
      "/images/spaces/apartments/apartment_drive_39.webp",
      "/images/spaces/apartments/apartment_drive_40.webp",
      "/images/spaces/apartments/apartment_drive_41.webp",
      "/images/spaces/apartments/apartment_drive_42.webp",
      "/images/spaces/apartments/apartment_drive_43.webp",
      "/images/spaces/apartments/apartment_drive_44.webp",
      "/images/spaces/apartments/apartment_drive_45.webp",
      "/images/spaces/apartments/apartment_drive_46.webp",
      "/images/spaces/apartments/apartment_drive_47.webp",
      "/images/spaces/apartments/apartment_drive_48.webp",
      "/images/spaces/apartments/apartment_drive_49.webp",
      "/images/spaces/apartments/apartment_drive_50.webp",
      "/images/spaces/apartments/apartment_drive_51.webp",
      "/images/spaces/apartments/apartment_drive_52.webp",
      "/images/spaces/apartments/apartment_drive_53.webp",
      "/images/spaces/apartments/apartment_drive_54.webp",
      "/images/spaces/apartments/apartment_drive_55.webp",
      "/images/spaces/apartments/apartment_drive_56.webp",
      "/images/spaces/apartments/apartment_drive_57.webp",
      "/images/spaces/apartments/apartment_drive_58.webp",
      "/images/spaces/apartments/apartment_drive_59.webp",
      "/images/spaces/apartments/apartment_drive_60.webp",
      "/images/spaces/apartments/apartment_drive_61.webp",
      "/images/spaces/apartments/apartment_drive_62.webp",
      "/images/spaces/apartments/apartment_drive_63.webp",
      "/images/spaces/apartments/apartment_drive_64.webp",
      "/images/spaces/apartments/apartment_drive_65.webp",
      "/images/spaces/apartments/apartment_drive_66.webp",
      "/images/spaces/apartments/apartment_drive_67.webp",
      "/images/spaces/apartments/apartment_drive_68.webp",
      "/images/spaces/apartments/apartment_drive_69.webp",
      "/images/spaces/apartments/apartment_drive_70.webp",
      "/images/spaces/apartments/apartment_drive_71.webp",
      "/images/spaces/apartments/apartment_drive_72.webp",
      "/images/spaces/apartments/apartment_drive_73.webp",
      "/images/spaces/apartments/apartment_drive_74.webp",
      "/images/spaces/apartments/apartment_drive_75.webp",
      "/images/spaces/apartments/apartment_drive_76.webp",
      "/images/spaces/apartments/apartment_drive_77.webp",
      "/images/spaces/apartments/apartment_drive_78.webp",
      "/images/spaces/apartments/apartment_drive_79.webp",
      "/images/spaces/apartments/apartment_drive_80.webp",
      "/images/spaces/apartments/apartment_drive_81.webp",
      "/images/spaces/apartments/apartment_drive_82.webp",
      "/images/spaces/apartments/apartment_drive_83.webp",
      "/images/spaces/apartments/apartment_drive_84.webp",
      "/images/spaces/apartments/apartment_drive_85.webp",
      "/images/spaces/apartments/apartment_drive_86.webp",
      "/images/spaces/apartments/apartment_drive_87.webp",
      "/images/spaces/apartments/apartment_drive_88.webp"
    ],
    "filters": [
      "Compact 2BHK Smart Home",
      "Luxury 3BHK Residence",
      "Studio & Loft Space",
      "High-Rise Balcony Suite",
      "Open Concept Apartment"
    ]
  },
  {
    "name": "Foyer",
    "slug": "foyer",
    "description": "First-impression entrance foyers with fluted timber panelling, floating shoe consoles, backlit vanity mirrors, and statement stone accents.",
    "heroImage": "/images/spaces/foyer/foyer_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Grand First Impressions",
      "headline": "Entrance Foyers Crafted to Welcome and Impress",
      "body": "The foyer sets the emotional tone of the entire home. We design architectural transition zones featuring bespoke shoe storage credenzas, floating consoles, decorative stone accents, acoustic fluted wall cladding, and motion-sensor warm cove illumination.",
      "includes": [
        "Custom Floating Console & Concealed Shoe Storage",
        "Acoustic Fluted Timber & Metal Inlay Panelling",
        "Backlit Onyx & Polygranite Statement Wall",
        "Full-Height Dressing Mirror with Ambient Backlight",
        "Motion-Sensor Warm Glow & Recessed Spotlights",
        "Architectural Partition Screens & CNC Jali Elements",
        "Integrated Key, Bag & Drop-Zone Niches",
        "Upholstered Seating & Entryway Benches"
      ]
    },
    "galleryImages": [
      "/images/spaces/foyer/foyer_drive_1.webp",
      "/images/spaces/foyer/foyer_drive_2.webp",
      "/images/spaces/foyer/foyer_drive_3.webp",
      "/images/spaces/foyer/foyer_drive_4.webp",
      "/images/spaces/foyer/foyer_drive_5.webp",
      "/images/spaces/foyer/foyer_drive_6.webp",
      "/images/spaces/foyer/foyer_drive_7.webp",
      "/images/spaces/foyer/foyer_drive_8.webp",
      "/images/spaces/foyer/foyer_drive_9.webp",
      "/images/spaces/foyer/foyer_drive_10.webp",
      "/images/spaces/foyer/foyer_drive_11.webp",
      "/images/spaces/foyer/foyer_drive_12.webp",
      "/images/spaces/foyer/foyer_drive_13.webp",
      "/images/spaces/foyer/foyer_drive_14.webp",
      "/images/spaces/foyer/foyer_drive_15.webp",
      "/images/spaces/foyer/foyer_drive_16.webp",
      "/images/spaces/foyer/foyer_drive_17.webp",
      "/images/spaces/foyer/foyer_drive_18.webp",
      "/images/spaces/foyer/foyer_drive_19.webp",
      "/images/spaces/foyer/foyer_drive_20.webp",
      "/images/spaces/foyer/foyer_drive_21.webp",
      "/images/spaces/foyer/foyer_drive_22.webp",
      "/images/spaces/foyer/foyer_drive_23.webp",
      "/images/spaces/foyer/foyer_drive_24.webp",
      "/images/spaces/foyer/foyer_drive_25.webp",
      "/images/spaces/foyer/foyer_drive_26.webp",
      "/images/spaces/foyer/foyer_drive_27.webp",
      "/images/spaces/foyer/foyer_drive_28.webp",
      "/images/spaces/foyer/foyer_drive_29.webp",
      "/images/spaces/foyer/foyer_drive_30.webp"
    ],
    "filters": [
      "Modern Floating Console",
      "Luxury Backlit Onyx",
      "Minimalist Drop-Zone",
      "Traditional Jali Screen",
      "Statement Mirror Wall"
    ]
  },
  {
    "name": "Bar",
    "slug": "bar",
    "description": "Bespoke residential bar units, wine display cellars, backlit onyx counters, and fluted glass stemware storage.",
    "heroImage": "/images/spaces/bar/bar_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Hospitality & Entertaining",
      "headline": "Sophisticated Home Bars for Connoisseurs and Hosts",
      "body": "Transform entertaining at home with bespoke bar counters featuring temperature-controlled wine displays, illuminated fluted glass cabinets, integrated ice and cocktail prep sinks, and dramatic backlit translucent stone surfaces.",
      "includes": [
        "Custom Backlit Onyx & Sintered Stone Bar Counters",
        "Integrated Temperature-Controlled Wine Chillers",
        "Fluted Bronze Glass Stemware & Bottle Shelving",
        "Concealed Prep Sink & Speed Rail Integration",
        "Multi-Circuit Mood & Shelf Backlighting",
        "Acoustic Wall Panelling & High Bar Seating",
        "Lockable Spirits & Decanter Cabinetry",
        "Under-Counter Refrigeration & Ice Maker Provisions"
      ]
    },
    "galleryImages": [
      "/images/spaces/bar/bar_drive_1.webp",
      "/images/spaces/bar/bar_drive_2.webp",
      "/images/spaces/bar/bar_drive_3.webp",
      "/images/spaces/bar/bar_drive_4.webp",
      "/images/spaces/bar/bar_drive_5.webp",
      "/images/spaces/bar/bar_drive_6.webp",
      "/images/spaces/bar/bar_drive_7.webp",
      "/images/spaces/bar/bar_drive_8.webp",
      "/images/spaces/bar/bar_drive_9.webp",
      "/images/spaces/bar/bar_drive_10.webp",
      "/images/spaces/bar/bar_drive_11.webp",
      "/images/spaces/bar/bar_drive_12.webp",
      "/images/spaces/bar/bar_drive_13.webp",
      "/images/spaces/bar/bar_drive_14.webp",
      "/images/spaces/bar/bar_drive_15.webp",
      "/images/spaces/bar/bar_drive_16.webp",
      "/images/spaces/bar/bar_drive_17.webp",
      "/images/spaces/bar/bar_drive_18.webp",
      "/images/spaces/bar/bar_drive_19.webp",
      "/images/spaces/bar/bar_drive_20.webp",
      "/images/spaces/bar/bar_drive_21.webp",
      "/images/spaces/bar/bar_drive_22.webp",
      "/images/spaces/bar/bar_drive_23.webp",
      "/images/spaces/bar/bar_drive_24.webp",
      "/images/spaces/bar/bar_drive_25.webp",
      "/images/spaces/bar/bar_drive_26.webp",
      "/images/spaces/bar/bar_drive_27.webp",
      "/images/spaces/bar/bar_drive_28.webp",
      "/images/spaces/bar/bar_drive_29.webp",
      "/images/spaces/bar/bar_drive_30.webp",
      "/images/spaces/bar/bar_drive_31.webp",
      "/images/spaces/bar/bar_drive_32.webp",
      "/images/spaces/bar/bar_drive_33.webp",
      "/images/spaces/bar/bar_drive_34.webp",
      "/images/spaces/bar/bar_drive_35.webp",
      "/images/spaces/bar/bar_drive_36.webp",
      "/images/spaces/bar/bar_drive_37.webp",
      "/images/spaces/bar/bar_drive_38.webp"
    ],
    "filters": [
      "Backlit Onyx Counter",
      "Temperature-Controlled Wine Cellar",
      "Compact Dry Bar",
      "Fluted Glass Cocktail Station",
      "Classic Walnut Lounge"
    ]
  },
  {
    "name": "Walk-in Wardrobe",
    "slug": "walk-in-wardrobe",
    "description": "Boutique-style walk-in dressing suites with central accessory islands, velvet-lined drawers, and illuminated tinted glass enclosures.",
    "heroImage": "/images/spaces/wardrobes/walk_in_wardrobe_drive_1.webp",
    "visible": true,
    "details": {
      "tag": "Boutique Dressing Suites",
      "headline": "Walk-In Closets Designed Like Haute Couture Salons",
      "body": "Experience the luxury of a personalized dressing boutique. Our walk-in wardrobe suites feature central accessory islands with glass display tops, custom velvet-lined watch and jewelry drawers, floor-to-ceiling tinted glass partitions, and 360-degree vanity lighting.",
      "includes": [
        "Central Accessory & Jewelry Island with Glass Top",
        "Floor-to-Ceiling Tinted Bronze Glass Shutters",
        "Velvet-Lined Watch, Belt & Sunglass Organizers",
        "Integrated LED Sensor Rail & Shelf Lighting",
        "Full-Height Backlit Vanity Dressing Mirror",
        "Tiered Pull-Out Shoe & Handbag Galleries",
        "Hidden Safe & Lockable Valuables Vault",
        "Dedicated Seasonal Loft Storage Sections"
      ]
    },
    "galleryImages": [
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_1.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_3.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_4.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_5.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_7.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_8.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_9.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_10.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_11.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_12.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_13.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_14.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_15.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_16.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_17.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_18.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_19.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_20.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_21.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_22.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_23.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_24.webp",
      "/images/spaces/wardrobes/walk_in_wardrobe_drive_25.webp"
    ],
    "filters": [
      "Central Island Suite",
      "Tinted Bronze Glass Wardrobe",
      "Velvet Boutique Salon",
      "Minimalist Open Dressing",
      "360-Degree Illuminated Vanity"
    ]
  }
];

// ── HIGH-RESOLUTION BEFORE/AFTER SCENARIOS ──────────────────────────────────
const transformationSlides = [
  {
    title: 'Living Rooms',
    tag: 'Indo-Classical Living Lounge',
    location: 'Financial District, Hyderabad',
    scope: 'Arched Window Alcove & Neoclassical Paneling',
    before: '/images/spaces/spaces_hero_before.webp',
    after: '/images/spaces/spaces_hero_after.webp',
  },
  {
    title: 'Modular Kitchens',
    tag: 'Precision-Engineered Kitchen',
    location: 'Jubilee Hills, Hyderabad',
    scope: 'Quartz Waterfall Island & Acrylic Shutters',
    before: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_0-20260810-173514.jpg',
    after: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
  },
  {
    title: 'Master Bedrooms',
    tag: 'Sanctuary Master Suite',
    location: 'Kokapet, Hyderabad',
    scope: 'Custom Walnut Headboard & Warm Coves',
    before: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
    after: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
  },
  {
    title: 'Dining & Bars',
    tag: 'Hospitality & Entertaining',
    location: 'Banjara Hills, Hyderabad',
    scope: 'Fluted Glass Partition & Backlit Bar',
    before: '/images/company/2bhk_mordern_retro/dining_2.jpg',
    after: '/images/company/duplex/Exquisite_Fusion_of_Modern__Desi_in_a_4BHK-Guest_restaurant_5-20260813-110615.jpg',
  }
];

const GALLERY_IMAGE_TAGS = {
  // ── 29 Unique Master Bedroom Drive Images Tagging (Minimum 11-12 per category) ──
  'bedroom_drive_1': ['Luxury Master Suite', 'Modern Contemporary'],
  'bedroom_drive_2': ['Warm Minimalist', 'Integrated Study Suite'],
  'bedroom_drive_3': ['Classical Boiserie', 'Luxury Master Suite'],
  'bedroom_drive_4': ['Modern Contemporary', 'Integrated Study Suite'],
  'bedroom_drive_5': ['Warm Minimalist', 'Modern Contemporary'],
  'bedroom_drive_6': ['Classical Boiserie', 'Integrated Study Suite'],
  'bedroom_drive_7': ['Luxury Master Suite', 'Warm Minimalist'],
  'bedroom_drive_8': ['Modern Contemporary', 'Classical Boiserie'],
  'bedroom_drive_9': ['Integrated Study Suite', 'Luxury Master Suite'],
  'bedroom_drive_10': ['Warm Minimalist', 'Modern Contemporary'],
  'bedroom_drive_11': ['Classical Boiserie', 'Integrated Study Suite'],
  'bedroom_drive_12': ['Luxury Master Suite', 'Warm Minimalist'],
  'bedroom_drive_13': ['Modern Contemporary', 'Classical Boiserie'],
  'bedroom_drive_14': ['Integrated Study Suite', 'Luxury Master Suite'],
  'bedroom_drive_15': ['Warm Minimalist', 'Modern Contemporary'],
  'bedroom_drive_16': ['Classical Boiserie', 'Integrated Study Suite'],
  'bedroom_drive_17': ['Luxury Master Suite', 'Warm Minimalist'],
  'bedroom_drive_18': ['Modern Contemporary', 'Classical Boiserie'],
  'bedroom_drive_19': ['Integrated Study Suite', 'Luxury Master Suite'],
  'bedroom_drive_20': ['Warm Minimalist', 'Modern Contemporary'],
  'bedroom_drive_21': ['Classical Boiserie', 'Integrated Study Suite'],
  'bedroom_drive_22': ['Luxury Master Suite', 'Warm Minimalist'],
  'bedroom_drive_23': ['Modern Contemporary', 'Classical Boiserie'],
  'bedroom_drive_24': ['Integrated Study Suite', 'Luxury Master Suite'],
  'bedroom_drive_25': ['Warm Minimalist', 'Modern Contemporary'],
  'bedroom_drive_26': ['Classical Boiserie', 'Integrated Study Suite'],
  'bedroom_drive_27': ['Luxury Master Suite', 'Modern Contemporary'],
  'bedroom_drive_28': ['Integrated Study Suite', 'Warm Minimalist'],
  'bedroom_drive_29': ['Classical Boiserie', 'Luxury Master Suite'],

  // ── 37 Unique Commercial Office Drive Images Tagging (Minimum 14-15 per category) ──
  'office_drive_1': ['Executive Boardroom', 'Acoustic Conference Room'],
  'office_drive_2': ['Open Workstation Floor', 'Collaboration Lounge'],
  'office_drive_3': ['Private Director Cabin', 'Executive Boardroom'],
  'office_drive_4': ['Acoustic Conference Room', 'Open Workstation Floor'],
  'office_drive_5': ['Collaboration Lounge', 'Private Director Cabin'],
  'office_drive_6': ['Executive Boardroom', 'Open Workstation Floor'],
  'office_drive_7': ['Acoustic Conference Room', 'Private Director Cabin'],
  'office_drive_8': ['Collaboration Lounge', 'Executive Boardroom'],
  'office_drive_9': ['Open Workstation Floor', 'Acoustic Conference Room'],
  'office_drive_10': ['Private Director Cabin', 'Collaboration Lounge'],
  'office_drive_11': ['Executive Boardroom', 'Acoustic Conference Room'],
  'office_drive_12': ['Open Workstation Floor', 'Collaboration Lounge'],
  'office_drive_13': ['Private Director Cabin', 'Executive Boardroom'],
  'office_drive_14': ['Acoustic Conference Room', 'Open Workstation Floor'],
  'office_drive_15': ['Collaboration Lounge', 'Private Director Cabin'],
  'office_drive_16': ['Executive Boardroom', 'Acoustic Conference Room'],
  'office_drive_17': ['Private Director Cabin', 'Open Workstation Floor'],
  'office_drive_18': ['Collaboration Lounge', 'Executive Boardroom'],
  'office_drive_19': ['Acoustic Conference Room', 'Collaboration Lounge'],
  'office_drive_20': ['Open Workstation Floor', 'Private Director Cabin'],
  'office_drive_21': ['Executive Boardroom', 'Acoustic Conference Room'],
  'office_drive_22': ['Open Workstation Floor', 'Collaboration Lounge'],
  'office_drive_23': ['Private Director Cabin', 'Executive Boardroom'],
  'office_drive_24': ['Acoustic Conference Room', 'Open Workstation Floor'],
  'office_drive_25': ['Collaboration Lounge', 'Private Director Cabin'],
  'office_drive_26': ['Executive Boardroom', 'Open Workstation Floor'],
  'office_drive_27': ['Acoustic Conference Room', 'Private Director Cabin'],
  'office_drive_28': ['Collaboration Lounge', 'Executive Boardroom'],
  'office_drive_29': ['Open Workstation Floor', 'Acoustic Conference Room'],
  'office_drive_30': ['Private Director Cabin', 'Collaboration Lounge'],
  'office_drive_31': ['Executive Boardroom', 'Acoustic Conference Room'],
  'office_drive_32': ['Open Workstation Floor', 'Collaboration Lounge'],
  'office_drive_33': ['Private Director Cabin', 'Executive Boardroom'],
  'office_drive_34': ['Acoustic Conference Room', 'Open Workstation Floor'],
  'office_drive_35': ['Collaboration Lounge', 'Private Director Cabin'],
  'office_drive_36': ['Executive Boardroom', 'Acoustic Conference Room'],
  'office_drive_37': ['Open Workstation Floor', 'Private Director Cabin'],

  // ── 50 Unique Dining Room Drive Images Tagging (Minimum 20 per category) ──
  'dining_drive_1': ['8-Seater Formal Dining', 'Marble Top & Bar Console'],
  'dining_drive_2': ['Marble Top & Bar Console', 'Fluted Glass Partition'],
  'dining_drive_3': ['Fluted Glass Partition', 'Breakfast Nook & Bistro'],
  'dining_drive_4': ['Breakfast Nook & Bistro', 'Duplex Dining Lounge'],
  'dining_drive_5': ['Duplex Dining Lounge', '8-Seater Formal Dining'],
  'dining_drive_6': ['8-Seater Formal Dining', 'Fluted Glass Partition'],
  'dining_drive_7': ['Marble Top & Bar Console', 'Breakfast Nook & Bistro'],
  'dining_drive_8': ['Fluted Glass Partition', 'Duplex Dining Lounge'],
  'dining_drive_9': ['Breakfast Nook & Bistro', '8-Seater Formal Dining'],
  'dining_drive_10': ['Duplex Dining Lounge', 'Marble Top & Bar Console'],
  'dining_drive_11': ['8-Seater Formal Dining', 'Breakfast Nook & Bistro'],
  'dining_drive_12': ['Marble Top & Bar Console', 'Duplex Dining Lounge'],
  'dining_drive_13': ['Fluted Glass Partition', '8-Seater Formal Dining'],
  'dining_drive_14': ['Breakfast Nook & Bistro', 'Marble Top & Bar Console'],
  'dining_drive_15': ['Duplex Dining Lounge', 'Fluted Glass Partition'],
  'dining_drive_16': ['8-Seater Formal Dining', 'Duplex Dining Lounge'],
  'dining_drive_17': ['Marble Top & Bar Console', '8-Seater Formal Dining'],
  'dining_drive_18': ['Fluted Glass Partition', 'Marble Top & Bar Console'],
  'dining_drive_19': ['Breakfast Nook & Bistro', 'Fluted Glass Partition'],
  'dining_drive_20': ['Duplex Dining Lounge', 'Breakfast Nook & Bistro'],
  'dining_drive_21': ['8-Seater Formal Dining', 'Marble Top & Bar Console'],
  'dining_drive_22': ['Marble Top & Bar Console', 'Fluted Glass Partition'],
  'dining_drive_23': ['Fluted Glass Partition', 'Breakfast Nook & Bistro'],
  'dining_drive_24': ['Breakfast Nook & Bistro', 'Duplex Dining Lounge'],
  'dining_drive_25': ['Duplex Dining Lounge', '8-Seater Formal Dining'],
  'dining_drive_26': ['8-Seater Formal Dining', 'Marble Top & Bar Console'],
  'dining_drive_27': ['Marble Top & Bar Console', 'Fluted Glass Partition'],
  'dining_drive_28': ['Fluted Glass Partition', 'Breakfast Nook & Bistro'],
  'dining_drive_29': ['Breakfast Nook & Bistro', 'Duplex Dining Lounge'],
  'dining_drive_30': ['Duplex Dining Lounge', '8-Seater Formal Dining'],
  'dining_drive_31': ['8-Seater Formal Dining', 'Fluted Glass Partition'],
  'dining_drive_32': ['Marble Top & Bar Console', 'Breakfast Nook & Bistro'],
  'dining_drive_33': ['Fluted Glass Partition', 'Duplex Dining Lounge'],
  'dining_drive_34': ['Breakfast Nook & Bistro', '8-Seater Formal Dining'],
  'dining_drive_35': ['Duplex Dining Lounge', 'Marble Top & Bar Console'],
  'dining_drive_36': ['8-Seater Formal Dining', 'Breakfast Nook & Bistro'],
  'dining_drive_37': ['Marble Top & Bar Console', 'Duplex Dining Lounge'],
  'dining_drive_38': ['Fluted Glass Partition', '8-Seater Formal Dining'],
  'dining_drive_39': ['Breakfast Nook & Bistro', 'Marble Top & Bar Console'],
  'dining_drive_40': ['Duplex Dining Lounge', 'Fluted Glass Partition'],
  'dining_drive_41': ['8-Seater Formal Dining', 'Duplex Dining Lounge'],
  'dining_drive_42': ['Marble Top & Bar Console', '8-Seater Formal Dining'],
  'dining_drive_43': ['Fluted Glass Partition', 'Marble Top & Bar Console'],
  'dining_drive_44': ['Breakfast Nook & Bistro', 'Fluted Glass Partition'],
  'dining_drive_45': ['Duplex Dining Lounge', 'Breakfast Nook & Bistro'],
  'dining_drive_46': ['8-Seater Formal Dining', 'Fluted Glass Partition'],
  'dining_drive_47': ['Marble Top & Bar Console', 'Duplex Dining Lounge'],
  'dining_drive_48': ['Fluted Glass Partition', '8-Seater Formal Dining'],
  'dining_drive_49': ['Breakfast Nook & Bistro', 'Marble Top & Bar Console'],
  'dining_drive_50': ['Duplex Dining Lounge', 'Breakfast Nook & Bistro'],

  // ── 46 Unique False Ceiling Drive Images Tagging (Minimum 18-19 per category) ──
  'ceiling_drive_1': ['Magnetic Track & Warm Coves', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_2': ['Wooden Rafter & Slat Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_3': ['Minimalist Peripheral Drop', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_4': ['Coffered & Geometric Ceiling', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_5': ['Stretch Fabric & Backlit Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_6': ['Magnetic Track & Warm Coves', 'Minimalist Peripheral Drop'],
  'ceiling_drive_7': ['Wooden Rafter & Slat Ceiling', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_8': ['Minimalist Peripheral Drop', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_9': ['Coffered & Geometric Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_10': ['Stretch Fabric & Backlit Ceiling', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_11': ['Magnetic Track & Warm Coves', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_12': ['Wooden Rafter & Slat Ceiling', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_13': ['Minimalist Peripheral Drop', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_14': ['Coffered & Geometric Ceiling', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_15': ['Stretch Fabric & Backlit Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_16': ['Magnetic Track & Warm Coves', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_17': ['Wooden Rafter & Slat Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_18': ['Minimalist Peripheral Drop', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_19': ['Coffered & Geometric Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_20': ['Stretch Fabric & Backlit Ceiling', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_21': ['Magnetic Track & Warm Coves', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_22': ['Wooden Rafter & Slat Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_23': ['Minimalist Peripheral Drop', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_24': ['Coffered & Geometric Ceiling', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_25': ['Stretch Fabric & Backlit Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_26': ['Magnetic Track & Warm Coves', 'Minimalist Peripheral Drop'],
  'ceiling_drive_27': ['Wooden Rafter & Slat Ceiling', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_28': ['Minimalist Peripheral Drop', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_29': ['Coffered & Geometric Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_30': ['Stretch Fabric & Backlit Ceiling', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_31': ['Magnetic Track & Warm Coves', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_32': ['Wooden Rafter & Slat Ceiling', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_33': ['Minimalist Peripheral Drop', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_34': ['Coffered & Geometric Ceiling', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_35': ['Stretch Fabric & Backlit Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_36': ['Magnetic Track & Warm Coves', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_37': ['Wooden Rafter & Slat Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_38': ['Minimalist Peripheral Drop', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_39': ['Coffered & Geometric Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_40': ['Stretch Fabric & Backlit Ceiling', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_41': ['Magnetic Track & Warm Coves', 'Wooden Rafter & Slat Ceiling'],
  'ceiling_drive_42': ['Wooden Rafter & Slat Ceiling', 'Minimalist Peripheral Drop'],
  'ceiling_drive_43': ['Minimalist Peripheral Drop', 'Coffered & Geometric Ceiling'],
  'ceiling_drive_44': ['Coffered & Geometric Ceiling', 'Stretch Fabric & Backlit Ceiling'],
  'ceiling_drive_45': ['Stretch Fabric & Backlit Ceiling', 'Magnetic Track & Warm Coves'],
  'ceiling_drive_46': ['Magnetic Track & Warm Coves', 'Minimalist Peripheral Drop'],

  // ── 76 Unique Luxury Homes Drive Images Tagging (Minimum 30-31 per category) ──
  'luxury_drive_1': ['Penthouse Sky Mansion', 'Architectural Estate'],
  'luxury_drive_2': ['Architectural Estate', 'Italian Marble Residence'],
  'luxury_drive_3': ['Italian Marble Residence', 'Private Screening Room'],
  'luxury_drive_4': ['Private Screening Room', 'Wellness Spa & Home Gym'],
  'luxury_drive_5': ['Wellness Spa & Home Gym', 'Penthouse Sky Mansion'],
  'luxury_drive_6': ['Penthouse Sky Mansion', 'Italian Marble Residence'],
  'luxury_drive_7': ['Architectural Estate', 'Private Screening Room'],
  'luxury_drive_8': ['Italian Marble Residence', 'Wellness Spa & Home Gym'],
  'luxury_drive_9': ['Private Screening Room', 'Penthouse Sky Mansion'],
  'luxury_drive_10': ['Wellness Spa & Home Gym', 'Architectural Estate'],
  'luxury_drive_11': ['Penthouse Sky Mansion', 'Private Screening Room'],
  'luxury_drive_12': ['Architectural Estate', 'Wellness Spa & Home Gym'],
  'luxury_drive_13': ['Italian Marble Residence', 'Penthouse Sky Mansion'],
  'luxury_drive_14': ['Private Screening Room', 'Architectural Estate'],
  'luxury_drive_15': ['Wellness Spa & Home Gym', 'Italian Marble Residence'],
  'luxury_drive_16': ['Penthouse Sky Mansion', 'Wellness Spa & Home Gym'],
  'luxury_drive_17': ['Architectural Estate', 'Penthouse Sky Mansion'],
  'luxury_drive_18': ['Italian Marble Residence', 'Architectural Estate'],
  'luxury_drive_19': ['Private Screening Room', 'Italian Marble Residence'],
  'luxury_drive_20': ['Wellness Spa & Home Gym', 'Private Screening Room'],
  'luxury_drive_21': ['Penthouse Sky Mansion', 'Architectural Estate'],
  'luxury_drive_22': ['Architectural Estate', 'Italian Marble Residence'],
  'luxury_drive_23': ['Italian Marble Residence', 'Private Screening Room'],
  'luxury_drive_24': ['Private Screening Room', 'Wellness Spa & Home Gym'],
  'luxury_drive_25': ['Wellness Spa & Home Gym', 'Penthouse Sky Mansion'],
  'luxury_drive_26': ['Penthouse Sky Mansion', 'Italian Marble Residence'],
  'luxury_drive_27': ['Architectural Estate', 'Private Screening Room'],
  'luxury_drive_28': ['Italian Marble Residence', 'Wellness Spa & Home Gym'],
  'luxury_drive_29': ['Private Screening Room', 'Penthouse Sky Mansion'],
  'luxury_drive_30': ['Wellness Spa & Home Gym', 'Architectural Estate'],
  'luxury_drive_31': ['Penthouse Sky Mansion', 'Private Screening Room'],
  'luxury_drive_32': ['Architectural Estate', 'Wellness Spa & Home Gym'],
  'luxury_drive_33': ['Italian Marble Residence', 'Penthouse Sky Mansion'],
  'luxury_drive_34': ['Private Screening Room', 'Architectural Estate'],
  'luxury_drive_35': ['Wellness Spa & Home Gym', 'Italian Marble Residence'],
  'luxury_drive_36': ['Penthouse Sky Mansion', 'Wellness Spa & Home Gym'],
  'luxury_drive_37': ['Architectural Estate', 'Penthouse Sky Mansion'],
  'luxury_drive_38': ['Italian Marble Residence', 'Architectural Estate'],
  'luxury_drive_39': ['Private Screening Room', 'Italian Marble Residence'],
  'luxury_drive_40': ['Wellness Spa & Home Gym', 'Private Screening Room'],
  'luxury_drive_41': ['Penthouse Sky Mansion', 'Architectural Estate'],
  'luxury_drive_42': ['Architectural Estate', 'Italian Marble Residence'],
  'luxury_drive_43': ['Italian Marble Residence', 'Private Screening Room'],
  'luxury_drive_44': ['Private Screening Room', 'Wellness Spa & Home Gym'],
  'luxury_drive_45': ['Wellness Spa & Home Gym', 'Penthouse Sky Mansion'],
  'luxury_drive_46': ['Penthouse Sky Mansion', 'Italian Marble Residence'],
  'luxury_drive_47': ['Architectural Estate', 'Private Screening Room'],
  'luxury_drive_48': ['Italian Marble Residence', 'Wellness Spa & Home Gym'],
  'luxury_drive_49': ['Private Screening Room', 'Penthouse Sky Mansion'],
  'luxury_drive_50': ['Wellness Spa & Home Gym', 'Architectural Estate'],
  'luxury_drive_51': ['Penthouse Sky Mansion', 'Private Screening Room'],
  'luxury_drive_52': ['Architectural Estate', 'Wellness Spa & Home Gym'],
  'luxury_drive_53': ['Italian Marble Residence', 'Penthouse Sky Mansion'],
  'luxury_drive_54': ['Private Screening Room', 'Architectural Estate'],
  'luxury_drive_55': ['Wellness Spa & Home Gym', 'Italian Marble Residence'],
  'luxury_drive_56': ['Penthouse Sky Mansion', 'Wellness Spa & Home Gym'],
  'luxury_drive_57': ['Architectural Estate', 'Penthouse Sky Mansion'],
  'luxury_drive_58': ['Italian Marble Residence', 'Architectural Estate'],
  'luxury_drive_59': ['Private Screening Room', 'Italian Marble Residence'],
  'luxury_drive_60': ['Wellness Spa & Home Gym', 'Private Screening Room'],
  'luxury_drive_61': ['Penthouse Sky Mansion', 'Architectural Estate'],
  'luxury_drive_62': ['Architectural Estate', 'Italian Marble Residence'],
  'luxury_drive_63': ['Italian Marble Residence', 'Private Screening Room'],
  'luxury_drive_64': ['Private Screening Room', 'Wellness Spa & Home Gym'],
  'luxury_drive_65': ['Wellness Spa & Home Gym', 'Penthouse Sky Mansion'],
  'luxury_drive_66': ['Penthouse Sky Mansion', 'Italian Marble Residence'],
  'luxury_drive_67': ['Architectural Estate', 'Private Screening Room'],
  'luxury_drive_68': ['Italian Marble Residence', 'Wellness Spa & Home Gym'],
  'luxury_drive_69': ['Private Screening Room', 'Penthouse Sky Mansion'],
  'luxury_drive_70': ['Wellness Spa & Home Gym', 'Architectural Estate'],
  'luxury_drive_71': ['Penthouse Sky Mansion', 'Private Screening Room'],
  'luxury_drive_72': ['Architectural Estate', 'Wellness Spa & Home Gym'],
  'luxury_drive_73': ['Italian Marble Residence', 'Penthouse Sky Mansion'],
  'luxury_drive_74': ['Private Screening Room', 'Architectural Estate'],
  'luxury_drive_75': ['Wellness Spa & Home Gym', 'Italian Marble Residence'],
  'luxury_drive_76': ['Penthouse Sky Mansion', 'Wellness Spa & Home Gym'],

  // ── 38 Unique Wardrobe Systems Drive Images Tagging (Minimum 15-16 per category) ──
  'wardrobe_drive_1': ['Floor-to-Ceiling Sliding', 'Tinted Glass Shutters'],
  'wardrobe_drive_2': ['Tinted Glass Shutters', 'Built-In Veneer & Wood'],
  'wardrobe_drive_3': ['Built-In Veneer & Wood', 'Open Shelving Systems'],
  'wardrobe_drive_4': ['Open Shelving Systems', 'Integrated Vanity Dressing'],
  'wardrobe_drive_5': ['Integrated Vanity Dressing', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_6': ['Floor-to-Ceiling Sliding', 'Built-In Veneer & Wood'],
  'wardrobe_drive_7': ['Tinted Glass Shutters', 'Open Shelving Systems'],
  'wardrobe_drive_8': ['Built-In Veneer & Wood', 'Integrated Vanity Dressing'],
  'wardrobe_drive_9': ['Open Shelving Systems', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_10': ['Integrated Vanity Dressing', 'Tinted Glass Shutters'],
  'wardrobe_drive_11': ['Floor-to-Ceiling Sliding', 'Open Shelving Systems'],
  'wardrobe_drive_12': ['Tinted Glass Shutters', 'Integrated Vanity Dressing'],
  'wardrobe_drive_13': ['Built-In Veneer & Wood', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_14': ['Open Shelving Systems', 'Tinted Glass Shutters'],
  'wardrobe_drive_15': ['Integrated Vanity Dressing', 'Built-In Veneer & Wood'],
  'wardrobe_drive_16': ['Floor-to-Ceiling Sliding', 'Integrated Vanity Dressing'],
  'wardrobe_drive_17': ['Tinted Glass Shutters', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_18': ['Built-In Veneer & Wood', 'Tinted Glass Shutters'],
  'wardrobe_drive_19': ['Open Shelving Systems', 'Built-In Veneer & Wood'],
  'wardrobe_drive_20': ['Integrated Vanity Dressing', 'Open Shelving Systems'],
  'wardrobe_drive_21': ['Floor-to-Ceiling Sliding', 'Tinted Glass Shutters'],
  'wardrobe_drive_22': ['Tinted Glass Shutters', 'Built-In Veneer & Wood'],
  'wardrobe_drive_23': ['Built-In Veneer & Wood', 'Open Shelving Systems'],
  'wardrobe_drive_24': ['Open Shelving Systems', 'Integrated Vanity Dressing'],
  'wardrobe_drive_25': ['Integrated Vanity Dressing', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_26': ['Floor-to-Ceiling Sliding', 'Built-In Veneer & Wood'],
  'wardrobe_drive_27': ['Tinted Glass Shutters', 'Open Shelving Systems'],
  'wardrobe_drive_28': ['Built-In Veneer & Wood', 'Integrated Vanity Dressing'],
  'wardrobe_drive_29': ['Open Shelving Systems', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_30': ['Integrated Vanity Dressing', 'Tinted Glass Shutters'],
  'wardrobe_drive_31': ['Floor-to-Ceiling Sliding', 'Open Shelving Systems'],
  'wardrobe_drive_32': ['Tinted Glass Shutters', 'Integrated Vanity Dressing'],
  'wardrobe_drive_33': ['Built-In Veneer & Wood', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_34': ['Open Shelving Systems', 'Tinted Glass Shutters'],
  'wardrobe_drive_35': ['Integrated Vanity Dressing', 'Built-In Veneer & Wood'],
  'wardrobe_drive_36': ['Floor-to-Ceiling Sliding', 'Integrated Vanity Dressing'],
  'wardrobe_drive_37': ['Tinted Glass Shutters', 'Floor-to-Ceiling Sliding'],
  'wardrobe_drive_38': ['Built-In Veneer & Wood', 'Tinted Glass Shutters'],

  // ── 44 Unique Apartments Drive Images Tagging (Minimum 17-18 per category) ──
  'apartment_drive_1': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_2': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_3': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_4': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_5': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_6': ['Compact 2BHK Smart Home', 'Studio & Loft Space'],
  'apartment_drive_7': ['Luxury 3BHK Residence', 'High-Rise Balcony Suite'],
  'apartment_drive_8': ['Studio & Loft Space', 'Open Concept Apartment'],
  'apartment_drive_9': ['High-Rise Balcony Suite', 'Compact 2BHK Smart Home'],
  'apartment_drive_10': ['Open Concept Apartment', 'Luxury 3BHK Residence'],
  'apartment_drive_11': ['Compact 2BHK Smart Home', 'High-Rise Balcony Suite'],
  'apartment_drive_12': ['Luxury 3BHK Residence', 'Open Concept Apartment'],
  'apartment_drive_13': ['Studio & Loft Space', 'Compact 2BHK Smart Home'],
  'apartment_drive_14': ['High-Rise Balcony Suite', 'Luxury 3BHK Residence'],
  'apartment_drive_15': ['Open Concept Apartment', 'Studio & Loft Space'],
  'apartment_drive_16': ['Compact 2BHK Smart Home', 'Open Concept Apartment'],
  'apartment_drive_17': ['Luxury 3BHK Residence', 'Compact 2BHK Smart Home'],
  'apartment_drive_18': ['Studio & Loft Space', 'Luxury 3BHK Residence'],
  'apartment_drive_19': ['High-Rise Balcony Suite', 'Studio & Loft Space'],
  'apartment_drive_20': ['Open Concept Apartment', 'High-Rise Balcony Suite'],
  'apartment_drive_21': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_22': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_23': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_24': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_25': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_26': ['Compact 2BHK Smart Home', 'Studio & Loft Space'],
  'apartment_drive_27': ['Luxury 3BHK Residence', 'High-Rise Balcony Suite'],
  'apartment_drive_28': ['Studio & Loft Space', 'Open Concept Apartment'],
  'apartment_drive_29': ['High-Rise Balcony Suite', 'Compact 2BHK Smart Home'],
  'apartment_drive_30': ['Open Concept Apartment', 'Luxury 3BHK Residence'],
  'apartment_drive_31': ['Compact 2BHK Smart Home', 'High-Rise Balcony Suite'],
  'apartment_drive_32': ['Luxury 3BHK Residence', 'Open Concept Apartment'],
  'apartment_drive_33': ['Studio & Loft Space', 'Compact 2BHK Smart Home'],
  'apartment_drive_34': ['High-Rise Balcony Suite', 'Luxury 3BHK Residence'],
  'apartment_drive_35': ['Open Concept Apartment', 'Studio & Loft Space'],
  'apartment_drive_36': ['Compact 2BHK Smart Home', 'Open Concept Apartment'],
  'apartment_drive_37': ['Luxury 3BHK Residence', 'Compact 2BHK Smart Home'],
  'apartment_drive_38': ['Studio & Loft Space', 'Luxury 3BHK Residence'],
  'apartment_drive_39': ['High-Rise Balcony Suite', 'Studio & Loft Space'],
  'apartment_drive_40': ['Open Concept Apartment', 'High-Rise Balcony Suite'],
  'apartment_drive_41': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_42': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_43': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_44': ['High-Rise Balcony Suite', 'Open Concept Apartment'],

  // ── 41 Unique Commercial Interiors Drive Images Tagging (Minimum 16-17 per category) ──
  'commercial_drive_1': ['Corporate Headquarters', 'Retail & Showroom Store'],
  'commercial_drive_2': ['Retail & Showroom Store', 'Clinic & Wellness Center'],
  'commercial_drive_3': ['Clinic & Wellness Center', 'Law & Financial Atelier'],
  'commercial_drive_4': ['Law & Financial Atelier', 'Tech Innovation Hub'],
  'commercial_drive_5': ['Tech Innovation Hub', 'Corporate Headquarters'],
  'commercial_drive_6': ['Corporate Headquarters', 'Clinic & Wellness Center'],
  'commercial_drive_7': ['Retail & Showroom Store', 'Law & Financial Atelier'],
  'commercial_drive_8': ['Clinic & Wellness Center', 'Tech Innovation Hub'],
  'commercial_drive_9': ['Law & Financial Atelier', 'Corporate Headquarters'],
  'commercial_drive_10': ['Tech Innovation Hub', 'Retail & Showroom Store'],
  'commercial_drive_11': ['Corporate Headquarters', 'Law & Financial Atelier'],
  'commercial_drive_12': ['Retail & Showroom Store', 'Tech Innovation Hub'],
  'commercial_drive_13': ['Clinic & Wellness Center', 'Corporate Headquarters'],
  'commercial_drive_14': ['Law & Financial Atelier', 'Retail & Showroom Store'],
  'commercial_drive_15': ['Tech Innovation Hub', 'Clinic & Wellness Center'],
  'commercial_drive_16': ['Corporate Headquarters', 'Tech Innovation Hub'],
  'commercial_drive_17': ['Retail & Showroom Store', 'Corporate Headquarters'],
  'commercial_drive_18': ['Clinic & Wellness Center', 'Retail & Showroom Store'],
  'commercial_drive_19': ['Law & Financial Atelier', 'Clinic & Wellness Center'],
  'commercial_drive_20': ['Tech Innovation Hub', 'Law & Financial Atelier'],
  'commercial_drive_21': ['Corporate Headquarters', 'Retail & Showroom Store'],
  'commercial_drive_22': ['Retail & Showroom Store', 'Clinic & Wellness Center'],
  'commercial_drive_23': ['Clinic & Wellness Center', 'Law & Financial Atelier'],
  'commercial_drive_24': ['Law & Financial Atelier', 'Tech Innovation Hub'],
  'commercial_drive_25': ['Tech Innovation Hub', 'Corporate Headquarters'],
  'commercial_drive_26': ['Corporate Headquarters', 'Clinic & Wellness Center'],
  'commercial_drive_27': ['Retail & Showroom Store', 'Law & Financial Atelier'],
  'commercial_drive_28': ['Clinic & Wellness Center', 'Tech Innovation Hub'],
  'commercial_drive_29': ['Law & Financial Atelier', 'Corporate Headquarters'],
  'commercial_drive_30': ['Tech Innovation Hub', 'Retail & Showroom Store'],
  'commercial_drive_31': ['Corporate Headquarters', 'Law & Financial Atelier'],
  'commercial_drive_32': ['Retail & Showroom Store', 'Tech Innovation Hub'],
  'commercial_drive_33': ['Clinic & Wellness Center', 'Corporate Headquarters'],
  'commercial_drive_34': ['Law & Financial Atelier', 'Retail & Showroom Store'],
  'commercial_drive_35': ['Tech Innovation Hub', 'Clinic & Wellness Center'],
  'commercial_drive_36': ['Corporate Headquarters', 'Tech Innovation Hub'],
  'commercial_drive_37': ['Retail & Showroom Store', 'Corporate Headquarters'],
  'commercial_drive_38': ['Clinic & Wellness Center', 'Retail & Showroom Store'],
  'commercial_drive_39': ['Law & Financial Atelier', 'Clinic & Wellness Center'],
  'commercial_drive_40': ['Tech Innovation Hub', 'Law & Financial Atelier'],
  'commercial_drive_41': ['Corporate Headquarters', 'Retail & Showroom Store'],

  // ── 35 Unique Reception Areas Drive Images Tagging (Minimum 14 per category) ──
  'reception_drive_1': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_2': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_3': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_4': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_5': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],
  'reception_drive_6': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_7': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_8': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_9': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_10': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],
  'reception_drive_11': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_12': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_13': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_14': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_15': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],
  'reception_drive_16': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_17': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_18': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_19': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_20': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],
  'reception_drive_21': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_22': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_23': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_24': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_25': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],
  'reception_drive_26': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_27': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_28': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_29': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_30': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],
  'reception_drive_31': ['Monolithic Stone Reception Desk', 'Corporate Brand Identity Wall'],
  'reception_drive_32': ['Corporate Brand Identity Wall', 'Luxury Client Lounge'],
  'reception_drive_33': ['Luxury Client Lounge', 'Fluted Wood & Green Wall'],
  'reception_drive_34': ['Fluted Wood & Green Wall', 'Double-Height Entry Lobby'],
  'reception_drive_35': ['Double-Height Entry Lobby', 'Monolithic Stone Reception Desk'],

  // ── 42 Unique Cafes & Restaurants Drive Images Tagging (Minimum 16-17 per category) ──
  'cafe_drive_1': ['Specialty Coffee Bistro', 'Fine Dining Hall'],
  'cafe_drive_2': ['Fine Dining Hall', 'Industrial Rooftop Bar'],
  'cafe_drive_3': ['Industrial Rooftop Bar', 'Bohemian Lounge'],
  'cafe_drive_4': ['Bohemian Lounge', 'Quick-Service Gourmet Counter'],
  'cafe_drive_5': ['Quick-Service Gourmet Counter', 'Specialty Coffee Bistro'],
  'cafe_drive_6': ['Specialty Coffee Bistro', 'Industrial Rooftop Bar'],
  'cafe_drive_7': ['Fine Dining Hall', 'Bohemian Lounge'],
  'cafe_drive_8': ['Industrial Rooftop Bar', 'Quick-Service Gourmet Counter'],
  'cafe_drive_9': ['Bohemian Lounge', 'Specialty Coffee Bistro'],
  'cafe_drive_10': ['Quick-Service Gourmet Counter', 'Fine Dining Hall'],
  'cafe_drive_11': ['Specialty Coffee Bistro', 'Bohemian Lounge'],
  'cafe_drive_12': ['Fine Dining Hall', 'Quick-Service Gourmet Counter'],
  'cafe_drive_13': ['Industrial Rooftop Bar', 'Specialty Coffee Bistro'],
  'cafe_drive_14': ['Bohemian Lounge', 'Fine Dining Hall'],
  'cafe_drive_15': ['Quick-Service Gourmet Counter', 'Industrial Rooftop Bar'],
  'cafe_drive_16': ['Specialty Coffee Bistro', 'Quick-Service Gourmet Counter'],
  'cafe_drive_17': ['Fine Dining Hall', 'Specialty Coffee Bistro'],
  'cafe_drive_18': ['Industrial Rooftop Bar', 'Fine Dining Hall'],
  'cafe_drive_19': ['Bohemian Lounge', 'Industrial Rooftop Bar'],
  'cafe_drive_20': ['Quick-Service Gourmet Counter', 'Bohemian Lounge'],
  'cafe_drive_21': ['Specialty Coffee Bistro', 'Fine Dining Hall'],
  'cafe_drive_22': ['Fine Dining Hall', 'Industrial Rooftop Bar'],
  'cafe_drive_23': ['Industrial Rooftop Bar', 'Bohemian Lounge'],
  'cafe_drive_24': ['Bohemian Lounge', 'Quick-Service Gourmet Counter'],
  'cafe_drive_25': ['Quick-Service Gourmet Counter', 'Specialty Coffee Bistro'],
  'cafe_drive_26': ['Specialty Coffee Bistro', 'Industrial Rooftop Bar'],
  'cafe_drive_27': ['Fine Dining Hall', 'Bohemian Lounge'],
  'cafe_drive_28': ['Industrial Rooftop Bar', 'Quick-Service Gourmet Counter'],
  'cafe_drive_29': ['Bohemian Lounge', 'Specialty Coffee Bistro'],
  'cafe_drive_30': ['Quick-Service Gourmet Counter', 'Fine Dining Hall'],
  'cafe_drive_31': ['Specialty Coffee Bistro', 'Bohemian Lounge'],
  'cafe_drive_32': ['Fine Dining Hall', 'Quick-Service Gourmet Counter'],
  'cafe_drive_33': ['Industrial Rooftop Bar', 'Specialty Coffee Bistro'],
  'cafe_drive_34': ['Bohemian Lounge', 'Fine Dining Hall'],
  'cafe_drive_35': ['Quick-Service Gourmet Counter', 'Industrial Rooftop Bar'],
  'cafe_drive_36': ['Specialty Coffee Bistro', 'Quick-Service Gourmet Counter'],
  'cafe_drive_37': ['Fine Dining Hall', 'Specialty Coffee Bistro'],
  'cafe_drive_38': ['Industrial Rooftop Bar', 'Fine Dining Hall'],
  'cafe_drive_39': ['Bohemian Lounge', 'Industrial Rooftop Bar'],
  'cafe_drive_40': ['Quick-Service Gourmet Counter', 'Bohemian Lounge'],
  'cafe_drive_41': ['Specialty Coffee Bistro', 'Fine Dining Hall'],
  'cafe_drive_42': ['Fine Dining Hall', 'Industrial Rooftop Bar'],

  // ── 88 Unique Apartments Drive Images Tagging (Minimum 34-36 per category) ──
  'apartment_drive_1': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_2': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_3': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_4': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_5': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_6': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_7': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_8': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_9': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_10': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_11': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_12': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_13': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_14': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_15': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_16': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_17': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_18': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_19': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_20': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_21': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_22': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_23': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_24': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_25': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_26': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_27': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_28': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_29': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_30': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_31': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_32': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_33': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_34': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_35': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_36': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_37': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_38': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_39': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_40': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_41': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_42': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_43': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_44': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_45': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_46': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_47': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_48': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_49': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_50': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_51': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_52': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_53': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_54': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_55': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_56': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_57': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_58': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_59': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_60': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_61': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_62': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_63': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_64': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_65': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_66': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_67': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_68': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_69': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_70': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_71': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_72': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_73': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_74': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_75': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_76': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_77': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_78': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_79': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_80': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_81': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_82': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_83': ['Studio & Loft Space', 'High-Rise Balcony Suite'],
  'apartment_drive_84': ['High-Rise Balcony Suite', 'Open Concept Apartment'],
  'apartment_drive_85': ['Open Concept Apartment', 'Compact 2BHK Smart Home'],
  'apartment_drive_86': ['Compact 2BHK Smart Home', 'Luxury 3BHK Residence'],
  'apartment_drive_87': ['Luxury 3BHK Residence', 'Studio & Loft Space'],
  'apartment_drive_88': ['Studio & Loft Space', 'High-Rise Balcony Suite'],

  // ── 30 Unique Foyer Drive Images Tagging (Minimum 12 per category) ──
  'foyer_drive_1': ['Modern Floating Console', 'Luxury Backlit Onyx'],
  'foyer_drive_2': ['Luxury Backlit Onyx', 'Minimalist Drop-Zone'],
  'foyer_drive_3': ['Minimalist Drop-Zone', 'Traditional Jali Screen'],
  'foyer_drive_4': ['Traditional Jali Screen', 'Statement Mirror Wall'],
  'foyer_drive_5': ['Statement Mirror Wall', 'Modern Floating Console'],
  'foyer_drive_6': ['Modern Floating Console', 'Luxury Backlit Onyx'],
  'foyer_drive_7': ['Luxury Backlit Onyx', 'Minimalist Drop-Zone'],
  'foyer_drive_8': ['Minimalist Drop-Zone', 'Traditional Jali Screen'],
  'foyer_drive_9': ['Traditional Jali Screen', 'Statement Mirror Wall'],
  'foyer_drive_10': ['Statement Mirror Wall', 'Modern Floating Console'],
  'foyer_drive_11': ['Modern Floating Console', 'Luxury Backlit Onyx'],
  'foyer_drive_12': ['Luxury Backlit Onyx', 'Minimalist Drop-Zone'],
  'foyer_drive_13': ['Minimalist Drop-Zone', 'Traditional Jali Screen'],
  'foyer_drive_14': ['Traditional Jali Screen', 'Statement Mirror Wall'],
  'foyer_drive_15': ['Statement Mirror Wall', 'Modern Floating Console'],
  'foyer_drive_16': ['Modern Floating Console', 'Luxury Backlit Onyx'],
  'foyer_drive_17': ['Luxury Backlit Onyx', 'Minimalist Drop-Zone'],
  'foyer_drive_18': ['Minimalist Drop-Zone', 'Traditional Jali Screen'],
  'foyer_drive_19': ['Traditional Jali Screen', 'Statement Mirror Wall'],
  'foyer_drive_20': ['Statement Mirror Wall', 'Modern Floating Console'],
  'foyer_drive_21': ['Modern Floating Console', 'Luxury Backlit Onyx'],
  'foyer_drive_22': ['Luxury Backlit Onyx', 'Minimalist Drop-Zone'],
  'foyer_drive_23': ['Minimalist Drop-Zone', 'Traditional Jali Screen'],
  'foyer_drive_24': ['Traditional Jali Screen', 'Statement Mirror Wall'],
  'foyer_drive_25': ['Statement Mirror Wall', 'Modern Floating Console'],
  'foyer_drive_26': ['Modern Floating Console', 'Luxury Backlit Onyx'],
  'foyer_drive_27': ['Luxury Backlit Onyx', 'Minimalist Drop-Zone'],
  'foyer_drive_28': ['Minimalist Drop-Zone', 'Traditional Jali Screen'],
  'foyer_drive_29': ['Traditional Jali Screen', 'Statement Mirror Wall'],
  'foyer_drive_30': ['Statement Mirror Wall', 'Modern Floating Console'],

  // ── 38 Unique Bar Drive Images Tagging (Minimum 14-16 per category) ──
  'bar_drive_1': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_2': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_3': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_4': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_5': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_6': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_7': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_8': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_9': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_10': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_11': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_12': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_13': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_14': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_15': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_16': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_17': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_18': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_19': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_20': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_21': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_22': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_23': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_24': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_25': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_26': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_27': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_28': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_29': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_30': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_31': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_32': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_33': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],
  'bar_drive_34': ['Fluted Glass Cocktail Station', 'Classic Walnut Lounge'],
  'bar_drive_35': ['Classic Walnut Lounge', 'Backlit Onyx Counter'],
  'bar_drive_36': ['Backlit Onyx Counter', 'Temperature-Controlled Wine Cellar'],
  'bar_drive_37': ['Temperature-Controlled Wine Cellar', 'Compact Dry Bar'],
  'bar_drive_38': ['Compact Dry Bar', 'Fluted Glass Cocktail Station'],

  // ── 25 Unique Walk-in Wardrobe Drive Images Tagging (Minimum 10 per category) ──
  'walk_in_wardrobe_drive_1': ['Central Island Suite', 'Tinted Bronze Glass Wardrobe'],
  'walk_in_wardrobe_drive_2': ['Tinted Bronze Glass Wardrobe', 'Velvet Boutique Salon'],
  'walk_in_wardrobe_drive_3': ['Velvet Boutique Salon', 'Minimalist Open Dressing'],
  'walk_in_wardrobe_drive_4': ['Minimalist Open Dressing', '360-Degree Illuminated Vanity'],
  'walk_in_wardrobe_drive_5': ['360-Degree Illuminated Vanity', 'Central Island Suite'],
  'walk_in_wardrobe_drive_6': ['Central Island Suite', 'Tinted Bronze Glass Wardrobe'],
  'walk_in_wardrobe_drive_7': ['Tinted Bronze Glass Wardrobe', 'Velvet Boutique Salon'],
  'walk_in_wardrobe_drive_8': ['Velvet Boutique Salon', 'Minimalist Open Dressing'],
  'walk_in_wardrobe_drive_9': ['Minimalist Open Dressing', '360-Degree Illuminated Vanity'],
  'walk_in_wardrobe_drive_10': ['360-Degree Illuminated Vanity', 'Central Island Suite'],
  'walk_in_wardrobe_drive_11': ['Central Island Suite', 'Tinted Bronze Glass Wardrobe'],
  'walk_in_wardrobe_drive_12': ['Tinted Bronze Glass Wardrobe', 'Velvet Boutique Salon'],
  'walk_in_wardrobe_drive_13': ['Velvet Boutique Salon', 'Minimalist Open Dressing'],
  'walk_in_wardrobe_drive_14': ['Minimalist Open Dressing', '360-Degree Illuminated Vanity'],
  'walk_in_wardrobe_drive_15': ['360-Degree Illuminated Vanity', 'Central Island Suite'],
  'walk_in_wardrobe_drive_16': ['Central Island Suite', 'Tinted Bronze Glass Wardrobe'],
  'walk_in_wardrobe_drive_17': ['Tinted Bronze Glass Wardrobe', 'Velvet Boutique Salon'],
  'walk_in_wardrobe_drive_18': ['Velvet Boutique Salon', 'Minimalist Open Dressing'],
  'walk_in_wardrobe_drive_19': ['Minimalist Open Dressing', '360-Degree Illuminated Vanity'],
  'walk_in_wardrobe_drive_20': ['360-Degree Illuminated Vanity', 'Central Island Suite'],
  'walk_in_wardrobe_drive_21': ['Central Island Suite', 'Tinted Bronze Glass Wardrobe'],
  'walk_in_wardrobe_drive_22': ['Tinted Bronze Glass Wardrobe', 'Velvet Boutique Salon'],
  'walk_in_wardrobe_drive_23': ['Velvet Boutique Salon', 'Minimalist Open Dressing'],
  'walk_in_wardrobe_drive_24': ['Minimalist Open Dressing', '360-Degree Illuminated Vanity'],
  'walk_in_wardrobe_drive_25': ['360-Degree Illuminated Vanity', 'Central Island Suite'],

  // ── 44 Unique Home Office Drive Images Tagging (Minimum 17-18 per category) ──
  'home_office_drive_1': ['Executive Study', 'Minimal Studio Desk'],
  'home_office_drive_2': ['Minimal Studio Desk', 'Dual Workstation'],
  'home_office_drive_3': ['Dual Workstation', 'Acoustic Panelled Office'],
  'home_office_drive_4': ['Acoustic Panelled Office', 'Library & Bookshelf Suite'],
  'home_office_drive_5': ['Library & Bookshelf Suite', 'Executive Study'],
  'home_office_drive_6': ['Executive Study', 'Dual Workstation'],
  'home_office_drive_7': ['Minimal Studio Desk', 'Acoustic Panelled Office'],
  'home_office_drive_8': ['Dual Workstation', 'Library & Bookshelf Suite'],
  'home_office_drive_9': ['Acoustic Panelled Office', 'Executive Study'],
  'home_office_drive_10': ['Library & Bookshelf Suite', 'Minimal Studio Desk'],
  'home_office_drive_11': ['Executive Study', 'Acoustic Panelled Office'],
  'home_office_drive_12': ['Minimal Studio Desk', 'Library & Bookshelf Suite'],
  'home_office_drive_13': ['Dual Workstation', 'Executive Study'],
  'home_office_drive_14': ['Acoustic Panelled Office', 'Minimal Studio Desk'],
  'home_office_drive_15': ['Library & Bookshelf Suite', 'Dual Workstation'],
  'home_office_drive_16': ['Executive Study', 'Library & Bookshelf Suite'],
  'home_office_drive_17': ['Minimal Studio Desk', 'Executive Study'],
  'home_office_drive_18': ['Dual Workstation', 'Minimal Studio Desk'],
  'home_office_drive_19': ['Acoustic Panelled Office', 'Dual Workstation'],
  'home_office_drive_20': ['Library & Bookshelf Suite', 'Acoustic Panelled Office'],
  'home_office_drive_21': ['Executive Study', 'Minimal Studio Desk'],
  'home_office_drive_22': ['Minimal Studio Desk', 'Dual Workstation'],
  'home_office_drive_23': ['Dual Workstation', 'Acoustic Panelled Office'],
  'home_office_drive_24': ['Acoustic Panelled Office', 'Library & Bookshelf Suite'],
  'home_office_drive_25': ['Library & Bookshelf Suite', 'Executive Study'],
  'home_office_drive_26': ['Executive Study', 'Dual Workstation'],
  'home_office_drive_27': ['Minimal Studio Desk', 'Acoustic Panelled Office'],
  'home_office_drive_28': ['Dual Workstation', 'Library & Bookshelf Suite'],
  'home_office_drive_29': ['Acoustic Panelled Office', 'Executive Study'],
  'home_office_drive_30': ['Library & Bookshelf Suite', 'Minimal Studio Desk'],
  'home_office_drive_31': ['Executive Study', 'Acoustic Panelled Office'],
  'home_office_drive_32': ['Minimal Studio Desk', 'Library & Bookshelf Suite'],
  'home_office_drive_33': ['Dual Workstation', 'Executive Study'],
  'home_office_drive_34': ['Acoustic Panelled Office', 'Minimal Studio Desk'],
  'home_office_drive_35': ['Library & Bookshelf Suite', 'Dual Workstation'],
  'home_office_drive_36': ['Executive Study', 'Library & Bookshelf Suite'],
  'home_office_drive_37': ['Minimal Studio Desk', 'Executive Study'],
  'home_office_drive_38': ['Dual Workstation', 'Minimal Studio Desk'],
  'home_office_drive_39': ['Acoustic Panelled Office', 'Dual Workstation'],
  'home_office_drive_40': ['Library & Bookshelf Suite', 'Acoustic Panelled Office'],
  'home_office_drive_41': ['Executive Study', 'Minimal Studio Desk'],
  'home_office_drive_42': ['Minimal Studio Desk', 'Dual Workstation'],
  'home_office_drive_43': ['Dual Workstation', 'Acoustic Panelled Office'],
  'home_office_drive_44': ['Acoustic Panelled Office', 'Library & Bookshelf Suite'],

  // ── 41 Unique Living Room Drive Images Tagging (Minimum 16-17 per category) ──
  'living_drive_1': ['Modern Minimalist', 'Contemporary Luxury'],
  'living_drive_2': ['Contemporary Luxury', 'Traditional Indian'],
  'living_drive_3': ['Traditional Indian', 'Scandinavian Neutral'],
  'living_drive_4': ['Scandinavian Neutral', 'Neo-Classical Grandeur'],
  'living_drive_5': ['Neo-Classical Grandeur', 'Modern Minimalist'],
  'living_drive_6': ['Modern Minimalist', 'Traditional Indian'],
  'living_drive_7': ['Contemporary Luxury', 'Scandinavian Neutral'],
  'living_drive_8': ['Traditional Indian', 'Neo-Classical Grandeur'],
  'living_drive_9': ['Scandinavian Neutral', 'Modern Minimalist'],
  'living_drive_10': ['Neo-Classical Grandeur', 'Contemporary Luxury'],
  'living_drive_11': ['Modern Minimalist', 'Scandinavian Neutral'],
  'living_drive_12': ['Contemporary Luxury', 'Neo-Classical Grandeur'],
  'living_drive_13': ['Traditional Indian', 'Modern Minimalist'],
  'living_drive_14': ['Scandinavian Neutral', 'Contemporary Luxury'],
  'living_drive_15': ['Neo-Classical Grandeur', 'Traditional Indian'],
  'living_drive_16': ['Modern Minimalist', 'Neo-Classical Grandeur'],
  'living_drive_17': ['Contemporary Luxury', 'Modern Minimalist'],
  'living_drive_18': ['Traditional Indian', 'Contemporary Luxury'],
  'living_drive_19': ['Scandinavian Neutral', 'Traditional Indian'],
  'living_drive_20': ['Neo-Classical Grandeur', 'Scandinavian Neutral'],
  'living_drive_21': ['Modern Minimalist', 'Contemporary Luxury'],
  'living_drive_22': ['Contemporary Luxury', 'Traditional Indian'],
  'living_drive_23': ['Traditional Indian', 'Scandinavian Neutral'],
  'living_drive_24': ['Scandinavian Neutral', 'Neo-Classical Grandeur'],
  'living_drive_25': ['Neo-Classical Grandeur', 'Modern Minimalist'],
  'living_drive_26': ['Modern Minimalist', 'Traditional Indian'],
  'living_drive_27': ['Contemporary Luxury', 'Scandinavian Neutral'],
  'living_drive_28': ['Traditional Indian', 'Neo-Classical Grandeur'],
  'living_drive_29': ['Scandinavian Neutral', 'Modern Minimalist'],
  'living_drive_30': ['Neo-Classical Grandeur', 'Contemporary Luxury'],
  'living_drive_31': ['Modern Minimalist', 'Scandinavian Neutral'],
  'living_drive_32': ['Contemporary Luxury', 'Neo-Classical Grandeur'],
  'living_drive_33': ['Traditional Indian', 'Modern Minimalist'],
  'living_drive_34': ['Scandinavian Neutral', 'Contemporary Luxury'],
  'living_drive_35': ['Neo-Classical Grandeur', 'Traditional Indian'],
  'living_drive_36': ['Modern Minimalist', 'Neo-Classical Grandeur'],
  'living_drive_37': ['Contemporary Luxury', 'Modern Minimalist'],
  'living_drive_38': ['Traditional Indian', 'Contemporary Luxury'],
  'living_drive_39': ['Scandinavian Neutral', 'Traditional Indian'],
  'living_drive_40': ['Neo-Classical Grandeur', 'Scandinavian Neutral'],
  'living_drive_41': ['Modern Minimalist', 'Contemporary Luxury'],

  // ── 29 Unique Pooja Room Drive Images Tagging (Minimum 11-12 per category) ──
  'pooja_drive_1': ['Dedicated Mandir Room', 'CNC Backlit Jali'],
  'pooja_drive_2': ['CNC Backlit Jali', 'Marble & Corian Sanctum'],
  'pooja_drive_3': ['Marble & Corian Sanctum', 'Compact Wood Mandir'],
  'pooja_drive_4': ['Compact Wood Mandir', 'Traditional Brass & Teak'],
  'pooja_drive_5': ['Traditional Brass & Teak', 'Dedicated Mandir Room'],
  'pooja_drive_6': ['Dedicated Mandir Room', 'Marble & Corian Sanctum'],
  'pooja_drive_7': ['CNC Backlit Jali', 'Compact Wood Mandir'],
  'pooja_drive_8': ['Marble & Corian Sanctum', 'Traditional Brass & Teak'],
  'pooja_drive_9': ['Compact Wood Mandir', 'Dedicated Mandir Room'],
  'pooja_drive_10': ['Traditional Brass & Teak', 'CNC Backlit Jali'],
  'pooja_drive_11': ['Dedicated Mandir Room', 'Compact Wood Mandir'],
  'pooja_drive_12': ['CNC Backlit Jali', 'Traditional Brass & Teak'],
  'pooja_drive_13': ['Marble & Corian Sanctum', 'Dedicated Mandir Room'],
  'pooja_drive_14': ['Compact Wood Mandir', 'CNC Backlit Jali'],
  'pooja_drive_15': ['Traditional Brass & Teak', 'Marble & Corian Sanctum'],
  'pooja_drive_16': ['Dedicated Mandir Room', 'Traditional Brass & Teak'],
  'pooja_drive_17': ['CNC Backlit Jali', 'Dedicated Mandir Room'],
  'pooja_drive_18': ['Marble & Corian Sanctum', 'CNC Backlit Jali'],
  'pooja_drive_19': ['Compact Wood Mandir', 'Marble & Corian Sanctum'],
  'pooja_drive_20': ['Traditional Brass & Teak', 'Compact Wood Mandir'],
  'pooja_drive_21': ['Dedicated Mandir Room', 'CNC Backlit Jali'],
  'pooja_drive_22': ['CNC Backlit Jali', 'Marble & Corian Sanctum'],
  'pooja_drive_23': ['Marble & Corian Sanctum', 'Compact Wood Mandir'],
  'pooja_drive_24': ['Compact Wood Mandir', 'Traditional Brass & Teak'],
  'pooja_drive_25': ['Traditional Brass & Teak', 'Dedicated Mandir Room'],
  'pooja_drive_26': ['Dedicated Mandir Room', 'Marble & Corian Sanctum'],
  'pooja_drive_27': ['CNC Backlit Jali', 'Compact Wood Mandir'],
  'pooja_drive_28': ['Marble & Corian Sanctum', 'Traditional Brass & Teak'],
  'pooja_drive_29': ['Compact Wood Mandir', 'Dedicated Mandir Room'],

  // ── 37 Unique TV Units Drive Images Tagging (Minimum 14-15 per category) ──
  'tv_drive_1': ['Full-Wall Marble Console', 'Floating Acoustic Fluted'],
  'tv_drive_2': ['Floating Acoustic Fluted', 'Backlit Onyx Feature Wall'],
  'tv_drive_3': ['Backlit Onyx Feature Wall', 'Minimalist Low-Profile'],
  'tv_drive_4': ['Minimalist Low-Profile', 'Rotatable Partition Unit'],
  'tv_drive_5': ['Rotatable Partition Unit', 'Full-Wall Marble Console'],
  'tv_drive_6': ['Full-Wall Marble Console', 'Backlit Onyx Feature Wall'],
  'tv_drive_7': ['Floating Acoustic Fluted', 'Minimalist Low-Profile'],
  'tv_drive_8': ['Backlit Onyx Feature Wall', 'Rotatable Partition Unit'],
  'tv_drive_9': ['Minimalist Low-Profile', 'Full-Wall Marble Console'],
  'tv_drive_10': ['Rotatable Partition Unit', 'Floating Acoustic Fluted'],
  'tv_drive_11': ['Full-Wall Marble Console', 'Minimalist Low-Profile'],
  'tv_drive_12': ['Floating Acoustic Fluted', 'Rotatable Partition Unit'],
  'tv_drive_13': ['Backlit Onyx Feature Wall', 'Full-Wall Marble Console'],
  'tv_drive_14': ['Minimalist Low-Profile', 'Floating Acoustic Fluted'],
  'tv_drive_15': ['Rotatable Partition Unit', 'Backlit Onyx Feature Wall'],
  'tv_drive_16': ['Full-Wall Marble Console', 'Rotatable Partition Unit'],
  'tv_drive_17': ['Floating Acoustic Fluted', 'Full-Wall Marble Console'],
  'tv_drive_18': ['Backlit Onyx Feature Wall', 'Floating Acoustic Fluted'],
  'tv_drive_19': ['Minimalist Low-Profile', 'Backlit Onyx Feature Wall'],
  'tv_drive_20': ['Rotatable Partition Unit', 'Minimalist Low-Profile'],
  'tv_drive_21': ['Full-Wall Marble Console', 'Floating Acoustic Fluted'],
  'tv_drive_22': ['Floating Acoustic Fluted', 'Backlit Onyx Feature Wall'],
  'tv_drive_23': ['Backlit Onyx Feature Wall', 'Minimalist Low-Profile'],
  'tv_drive_24': ['Minimalist Low-Profile', 'Rotatable Partition Unit'],
  'tv_drive_25': ['Rotatable Partition Unit', 'Full-Wall Marble Console'],
  'tv_drive_26': ['Full-Wall Marble Console', 'Backlit Onyx Feature Wall'],
  'tv_drive_27': ['Floating Acoustic Fluted', 'Minimalist Low-Profile'],
  'tv_drive_28': ['Backlit Onyx Feature Wall', 'Rotatable Partition Unit'],
  'tv_drive_29': ['Minimalist Low-Profile', 'Full-Wall Marble Console'],
  'tv_drive_30': ['Rotatable Partition Unit', 'Floating Acoustic Fluted'],
  'tv_drive_31': ['Full-Wall Marble Console', 'Minimalist Low-Profile'],
  'tv_drive_32': ['Floating Acoustic Fluted', 'Rotatable Partition Unit'],
  'tv_drive_33': ['Backlit Onyx Feature Wall', 'Full-Wall Marble Console'],
  'tv_drive_34': ['Minimalist Low-Profile', 'Floating Acoustic Fluted'],
  'tv_drive_35': ['Rotatable Partition Unit', 'Backlit Onyx Feature Wall'],
  'tv_drive_36': ['Full-Wall Marble Console', 'Rotatable Partition Unit'],
  'tv_drive_37': ['Floating Acoustic Fluted', 'Full-Wall Marble Console'],

  'Minimalist_Gray': ['Island Kitchen', 'Modern Acrylic', 'Luxury Quartz'],
  'kitchen_4': ['Parallel Kitchen', 'Modern Acrylic'],
  'kitchen_3': ['Parallel Kitchen', 'Modern Acrylic'],
  'kitchen_5': ['L-Shape', 'Modern Acrylic'],
  'Kitchen_17': ['Parallel Kitchen', 'Modern Acrylic'],
  'Kitchen_18': ['L-Shape', 'Modern Acrylic'],
  'Kitchen_20': ['Island Kitchen', 'Luxury Quartz'],
  'Master_Bedroom_0': ['Master Suite', 'Luxury Classical'],
  'Master_Bedroom_15': ['Luxury Master Suite', 'Warm Minimalist'],
  'Master_Bedroom_1': ['Luxury Master Suite', 'Warm Minimalist'],
  'Bedroom_0': ['Warm Minimalist', 'Modern Contemporary'],
  'Bedroom_13': ['Master Suite', 'Walk-in Dressing'],
  'Bedroom_24': ['Kids Room', 'Modern'],
  'Living_room_3': ['Minimalist Lounge', 'TV Feature Wall'],
  'Living_room_27': ['Minimalist Lounge', 'Open Concept'],
  'open_hall': ['Luxury Marble', 'Open Concept', 'Double-Height'],
  'Guest_restaurant_4': ['Dedicated Mandir', 'Classical'],
  'Guest_restaurant_5': ['Formal Dining', 'Fluted Glass'],
  'Guest_restaurant_8': ['Dry Bar Counter', 'Backlit'],
  'office_3': ['Executive Study', 'Acoustic Wall'],
  'office_2': ['Minimal Desk', 'Studio Office'],
  'hall_paneling': ['Acoustic Wall', 'Cove Lighting'],
  'tv_unit_2_1': ['TV Feature Wall', 'Marble']
};

const getTagsForImage = (imgUrl, categoryFilters = []) => {
  if (!imgUrl) return [];
  for (const [key, tags] of Object.entries(GALLERY_IMAGE_TAGS)) {
    if (imgUrl.includes(key)) {
      return tags;
    }
  }
  if (Array.isArray(categoryFilters) && categoryFilters.length > 0) {
    let hash = 0;
    for (let i = 0; i < imgUrl.length; i++) hash = (hash << 5) - hash + imgUrl.charCodeAt(i);
    const assignedIndex = Math.abs(hash) % categoryFilters.length;
    return [categoryFilters[assignedIndex]];
  }
  return [];
};

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const WhatWeDo = () => {
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const heroRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);

  // ── Lead Capture Modal State for "Load More Designs" ─────────────────────
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [catalogForm, setCatalogForm] = useState({
    name: '',
    phone: '',
    phone2: '',
    email: '',
    location: '',
  });
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleOpenCatalogModal = () => {
    setModalSubmitted(false);
    setModalError('');
    setCatalogForm({
      name: '',
      phone: '',
      phone2: '',
      email: '',
      location: '',
    });
    setIsCatalogModalOpen(true);
  };

  const handleCloseCatalogModal = () => {
    setIsCatalogModalOpen(false);
    setModalSubmitted(false);
    setModalError('');
  };

  const handleCatalogFormChange = (e) => {
    const { name, value } = e.target;
    setCatalogForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCatalogSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!catalogForm.name.trim()) {
      setModalError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(catalogForm.email.trim())) {
      setModalError('Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone1 = catalogForm.phone.trim().replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone1)) {
      setModalError('Please enter a valid 10-digit primary mobile number.');
      return;
    }

    let cleanPhone2 = '';
    if (catalogForm.phone2?.trim()) {
      cleanPhone2 = catalogForm.phone2.trim().replace(/\s+/g, '');
      if (!phoneRegex.test(cleanPhone2)) {
        setModalError('Please enter a valid 10-digit secondary mobile number.');
        return;
      }
    }

    setModalSubmitting(true);
    try {
      const spaceTitle = activeCategory?.name || 'Master Bedroom';
      const existing = getCMSData(STORAGE_KEYS.ENQUIRIES) || [];
      const count = existing.length + 1;
      const enquiryId = `ESP-DE-${String(count).padStart(5, '0')}`;

      const newEnquiry = {
        id: enquiryId,
        enquiryId,
        type: 'DESIGN_ENQUIRY',
        source: 'SPACES_CATALOGUE_REQUEST',
        requirementType: 'TURNKEY_INTERIORS',
        name: catalogForm.name.trim(),
        email: catalogForm.email.trim(),
        phone: catalogForm.phone.trim(),
        phone2: catalogForm.phone2?.trim() || '',
        location: catalogForm.location.trim() || 'Hyderabad',
        spaces: spaceTitle,
        propertyType: 'Residential',
        stage: 'Immediate (0-1 Month)',
        status: 'NEW',
        read: false,
        submittedAt: new Date().toISOString(),
        notesText: `Catalogue & More Designs Request for [${spaceTitle}]. Location: ${catalogForm.location || 'Hyderabad'}. Secondary Phone: ${catalogForm.phone2 || 'None'}`,
        notes: [{
          id: `note-${Date.now()}`,
          text: `Lead captured via "Load More Designs" modal on Spaces -> ${spaceTitle} page.`,
          createdAt: new Date().toISOString()
        }],
        followUp: null
      };

      setCMSData(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...existing]);
      notifyCMSUpdate(STORAGE_KEYS.ENQUIRIES);
      window.dispatchEvent(new CustomEvent('espacio_cms_update'));
      window.dispatchEvent(new CustomEvent('espacio_enquiries_update'));

      // Send to backend server (which syncs to Google Sheets master webhook)
      const formattedPhone = cleanPhone2 ? `${cleanPhone1} / ${cleanPhone2}` : cleanPhone1;
      const leadPayload = {
        name: catalogForm.name.trim(),
        email: catalogForm.email.trim(),
        phone: formattedPhone,
        phone1: cleanPhone1,
        phone2: cleanPhone2,
        location: catalogForm.location.trim() || 'Hyderabad',
        projectType: 'Spaces Estimate Request',
        serviceType: spaceTitle,
        requirement: spaceTitle,
        spaces: spaceTitle,
        message: `Catalogue & More Designs Request for [${spaceTitle}]. Location: ${catalogForm.location.trim() || 'Hyderabad'}. Secondary Phone: ${cleanPhone2 || 'None'}`,
        googleSheetData: {
          name: catalogForm.name.trim(),
          phone: cleanPhone1,
          phone1: cleanPhone1,
          phone2: cleanPhone2,
          email: catalogForm.email.trim(),
          location: catalogForm.location.trim() || 'Hyderabad',
          requirement: spaceTitle,
          lookingFor: spaceTitle,
          spaces: spaceTitle,
          stage: 'Immediate (0-1 Month)',
          source: `Spaces Gallery (${spaceTitle} - Unlock Designs)`,
          notes: `Lead captured via "Fill Details to Unlock More Designs" modal for ${spaceTitle}. Location: ${catalogForm.location.trim() || 'Hyderabad'}. Secondary Phone: ${cleanPhone2 || 'None'}`
        }
      };

      let backendSynced = false;
      try {
        await axios.post('/api/leads', leadPayload);
        backendSynced = true;
      } catch (postErr) {
        console.warn('Primary /api/leads endpoint notice:', postErr?.message);
        try {
          await axios.post('/leads', leadPayload);
          backendSynced = true;
        } catch (postErr2) {
          console.warn('Fallback /leads endpoint notice:', postErr2?.message);
        }
      }

      // Direct Webhook Fallback if backend was unreachable or in offline mode
      const directWebhook = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
      if (!backendSynced && directWebhook && directWebhook.startsWith('http')) {
        try {
          await fetch(directWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              source: `Spaces Gallery (${spaceTitle} - Unlock Designs)`,
              name: catalogForm.name.trim(),
              phone1: cleanPhone1,
              phone2: cleanPhone2,
              email: catalogForm.email.trim(),
              location: catalogForm.location.trim() || 'Hyderabad',
              requirement: spaceTitle,
              stage: 'Immediate (0-1 Month)',
              materialDetails: '-',
              notes: `Lead captured via "Fill Details to Unlock More Designs" modal for ${spaceTitle}. Secondary Phone: ${cleanPhone2 || 'None'}`,
              status: 'NEW'
            })
          });
          console.log('Direct Google Sheets fallback sync completed');
        } catch (whErr) {
          console.warn('Direct webhook fallback error:', whErr?.message);
        }
      }

      setModalSubmitted(true);
    } catch (err) {
      console.error('Failed to submit catalog request:', err);
      setModalError('We could not submit your request right now. Please try again.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const [spacesHeroState, setSpacesHeroState] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    const hasValidSlides = Array.isArray(s?.spaces_before_after_slides) && s.spaces_before_after_slides.length > 0 && s.spaces_before_after_slides[0]?.before?.includes('spaces_hero_before');
    return {
      beforeLabel: getNonEmpty(s?.spaces_before_label, 'BEFORE'),
      afterLabel: getNonEmpty(s?.spaces_after_label, 'AFTER'),
      slides: hasValidSlides ? s.spaces_before_after_slides : transformationSlides,
      visible: s?.spaces_hero_visible !== false
    };
  });

  const [spacesList, setSpacesList] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return (Array.isArray(s?.spaces_list) && s.spaces_list.length > 0) ? s.spaces_list : mockCategories;
  });

  useEffect(() => {
    const syncCMS = async () => {
      const settings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (settings) {
        const hasValidSlides = Array.isArray(settings.spaces_before_after_slides) && settings.spaces_before_after_slides.length > 0 && settings.spaces_before_after_slides[0]?.before?.includes('spaces_hero_before');
        setSpacesHeroState({
          beforeLabel: getNonEmpty(settings.spaces_before_label, 'BEFORE'),
          afterLabel: getNonEmpty(settings.spaces_after_label, 'AFTER'),
          slides: hasValidSlides ? settings.spaces_before_after_slides : transformationSlides,
          visible: settings.spaces_hero_visible !== false
        });
        if (Array.isArray(settings.spaces_list) && settings.spaces_list.length > 0) {
          setSpacesList(settings.spaces_list);
        }
      }

      try {
        const res = await axios.get('/settings');
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setCMSData(STORAGE_KEYS.SETTINGS, d);
          if (Array.isArray(d.spaces_list) && d.spaces_list.length > 0) {
            setSpacesList(d.spaces_list);
          }
          if (Array.isArray(d.spaces_before_after_slides) && d.spaces_before_after_slides.length > 0) {
            setSpacesHeroState((prev) => ({
              ...prev,
              slides: d.spaces_before_after_slides,
              beforeLabel: getNonEmpty(d.spaces_before_label, prev.beforeLabel),
              afterLabel: getNonEmpty(d.spaces_after_label, prev.afterLabel),
            }));
          }
        }
      } catch {}
    };

    syncCMS();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, []);

  useEffect(() => {
    setVisibleCount(6);
    setActiveFilter('All');
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [slug]);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter]);

  const activeSlides = spacesHeroState.slides || transformationSlides;
  const currentSlide = activeSlides[0] || transformationSlides[0];

  // Measure container width for the absolute before image scaling
  useEffect(() => {
    if (!heroRef.current) return;
    setContainerWidth(heroRef.current.clientWidth);

    const handleResize = () => {
      if (heroRef.current) {
        setContainerWidth(heroRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slug]);

  const handleMove = (clientX) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const onStart = () => {
    isDragging.current = true;
    setIsPaused(true);
  };

  const onEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  // Scroll-driven parallax & Hero exit scroll animation
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroExitScale = useTransform(heroScroll, [0, 1], [1, 0.85]);
  const heroExitOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroExitY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  const bgScale = useTransform(heroScroll, [0, 1], [1.05, 0.95]);
  const bgY = useTransform(heroScroll, [0, 1], ['0%', '8%']);

  const displayCategories = spacesList.filter(c => c.slug !== 'luxury-homes');
  const activeCategory = slug ? displayCategories.find(c => c.slug === slug) : null;

  // ── CATEGORY DETAIL PAGE ───────────────────────────────────────────────────
  if (activeCategory) {
    const allImages = (activeCategory.galleryImages || []).filter(img => !img.includes('walk_in_wardrobe_drive_6.webp'));
    const visibleImages = allImages.slice(0, visibleCount);

    return (
      <div className="bg-bg min-h-screen">
        <SEO 
          title={`${activeCategory.name} Interiors — ESPACIO Hyderabad`} 
          description={activeCategory.description} 
          url={`/spaces/${activeCategory.slug}`} 
        />

        {/* Cinematic Detail Hero (Sleek Tight Margin & Curved Corners) */}
        <section className="relative pt-2 sm:pt-3 pb-2.5 sm:pb-3.5 px-2.5 sm:px-4 md:px-5 lg:px-6 w-full h-[58vh] sm:h-[75vh] lg:h-[90vh] min-h-[380px] sm:min-h-[500px] lg:min-h-[580px] bg-bg flex flex-col justify-end">
          <div className="relative w-full h-full rounded-[18px] sm:rounded-[26px] lg:rounded-[32px] overflow-hidden bg-bg-dark shadow-[0_16px_40px_rgba(0,0,0,0.22)] border border-white/10 flex items-end">
            <img 
              src={getOptimizedImageUrl(
                (activeCategory.slug === 'modular-kitchen' && (!activeCategory.heroImage || activeCategory.heroImage.includes('user_luxury_kitchen') || activeCategory.heroImage.includes('2bhk_urban') || activeCategory.heroImage.includes('3bhk_lux')))
                  ? '/images/spaces/modular_kitchen/kitchen_drive_24.webp'
                  : (activeCategory.slug === 'pooja-room' && (!activeCategory.heroImage || activeCategory.heroImage.includes('pooja_drive_1.webp')))
                  ? '/images/spaces/pooja/pooja_drive_12.webp'
                  : (activeCategory.slug === 'dining-room' && (!activeCategory.heroImage || activeCategory.heroImage.includes('dining_drive_1.webp')))
                  ? '/images/spaces/dining/dining_drive_27.webp'
                  : activeCategory.heroImage,
                2560,
                95
              )} 
              alt={activeCategory.name} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 scale-100 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/95 via-bg-dark/45 to-black/25" />
            
            <div className="relative max-w-[1440px] w-full mx-auto px-6 sm:px-10 md:px-14 pb-10 sm:pb-14 z-10">
              <nav className="flex items-center gap-2 font-sans text-[11.5px] uppercase tracking-[0.2em] text-bg/75 mb-4 font-semibold">
                <Link to="/" className="hover:text-gold transition-colors">Home</Link>
                <span>/</span>
                <Link to="/spaces" className="hover:text-gold transition-colors">Spaces</Link>
                <span>/</span>
                <span className="text-gold font-bold">{activeCategory.name}</span>
              </nav>
              <h1 className="font-display text-[clamp(36px,5.5vw,72px)] font-bold text-bg leading-[1.08] tracking-tight mb-4">
                {activeCategory.name}
              </h1>
              <p className="font-sans text-[15px] sm:text-[17px] text-bg/85 max-w-[680px] leading-relaxed font-normal">
                {activeCategory.description}
              </p>
            </div>

            {/* Standard Luxury Scroll Down Indicator */}
            <ScrollDownIndicator className="bottom-4 sm:bottom-6" />
          </div>
        </section>

        {/* Detailed Domain Info */}
        {activeCategory.details && (
          <section id="space-details-section" className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 border-b border-ink-border/20">
            <div className="max-w-[840px] space-y-5">
              <Reveal>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
                  {activeCategory.details.tag || `${activeCategory.name} Architecture`}
                </p>
                <h2 className="font-display text-[clamp(28px,3.5vw,46px)] font-bold tracking-tight text-ink leading-tight mt-2">
                  {activeCategory.details.headline}
                </h2>
                <p className="font-sans text-[15.5px] sm:text-[16.5px] text-ink-soft leading-relaxed mt-4">
                  {activeCategory.details.body}
                </p>
                <div className="pt-4">
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center gap-2 bg-ink text-bg font-sans text-[12px] uppercase font-bold tracking-widest px-7 py-3.5 rounded-full hover:bg-gold hover:text-ink transition-all duration-300 shadow-md"
                  >
                    <span>Enquire About {activeCategory.name}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* Gallery Grid */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold mb-2">Design Showcase</p>
              <h3 className="font-display text-[28px] sm:text-[34px] font-bold text-ink tracking-tight">
                {activeCategory.name} Gallery
              </h3>
            </div>
            <span className="font-sans text-[12px] text-ink-muted">
              Showing {visibleImages.length} of {allImages.length} images
            </span>
          </div>

          {allImages.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleImages.map((img, i) => (
                  <Reveal key={i} delay={Math.min(i * 0.05, 0.2)}>
                    <div className="group relative rounded-[20px] overflow-hidden aspect-[4/3] bg-bg-dark border border-ink-border/20 shadow-sm">
                      <img 
                        src={getOptimizedImageUrl(img, 800, 75)} 
                        alt={`${activeCategory.name} Design ${i + 1}`} 
                        loading="lazy" 
                        decoding="async" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <span className="font-sans text-[11px] font-semibold text-white uppercase tracking-wider">
                          {activeCategory.name} • View #{i + 1}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {allImages.length > 0 && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={() => {
                      if (allImages.length > visibleCount) {
                        setVisibleCount(prev => prev + 6);
                      } else {
                        handleOpenCatalogModal();
                      }
                    }} 
                    className="inline-flex items-center gap-2 border border-ink text-ink hover:bg-ink hover:text-bg font-sans text-[12px] uppercase font-bold tracking-widest px-8 py-3.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    <span>Load More Designs</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── SPACE CATALOG / MORE DESIGNS LEAD CAPTURE MODAL ────────────────── */}
        <AnimatePresence>
          {isCatalogModalOpen && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseCatalogModal}
                className="fixed inset-0 bg-black/70 backdrop-blur-md"
              />

              {/* Modal Container */}
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="relative bg-white text-ink rounded-[28px] max-w-[480px] w-full p-6 sm:p-9 shadow-2xl z-10 border border-ink-border overflow-hidden select-none"
              >
                {/* Close Button */}
                <button
                  onClick={handleCloseCatalogModal}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-ink/60 hover:text-black transition-colors"
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>

                {!modalSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="mb-6">
                      <h2 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-ink tracking-tight uppercase border-b border-ink-border/60 pb-3 leading-snug">
                        FILL DETAILS TO UNLOCK MORE DESIGNS
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-ink-soft mt-3 leading-relaxed">
                        Please fill out the details below to unlock more premium design pages instantly.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleCatalogSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          required
                          value={catalogForm.name}
                          onChange={handleCatalogFormChange}
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                        />
                      </div>

                      {/* Contact Number 1 */}
                      <div className="flex items-center rounded-xl border border-ink-border bg-bg/40 overflow-hidden focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 transition-all">
                        <div className="px-3.5 py-3.5 bg-ink-border/20 border-r border-ink-border flex items-center gap-1.5 shrink-0 text-xs font-sans font-semibold text-ink select-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Contact Number 1"
                          required
                          value={catalogForm.phone}
                          onChange={handleCatalogFormChange}
                          className="w-full px-4 py-3.5 bg-transparent text-ink text-sm font-sans outline-none placeholder:text-ink-muted"
                        />
                      </div>

                      {/* Contact Number 2 */}
                      <div className="flex items-center rounded-xl border border-ink-border bg-bg/40 overflow-hidden focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20 transition-all">
                        <div className="px-3.5 py-3.5 bg-ink-border/20 border-r border-ink-border flex items-center gap-1.5 shrink-0 text-xs font-sans font-semibold text-ink select-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          name="phone2"
                          placeholder="Contact Number 2 (Optional)"
                          value={catalogForm.phone2 || ''}
                          onChange={handleCatalogFormChange}
                          className="w-full px-4 py-3.5 bg-transparent text-ink text-sm font-sans outline-none placeholder:text-ink-muted"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          required
                          value={catalogForm.email}
                          onChange={handleCatalogFormChange}
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                        />
                      </div>

                      {/* Project Location */}
                      <div>
                        <input
                          type="text"
                          name="location"
                          placeholder="Project Location (e.g. Jubilee Hills, Gachibowli)"
                          value={catalogForm.location}
                          onChange={handleCatalogFormChange}
                          className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                        />
                      </div>

                      {modalError && (
                        <p className="text-xs text-red-500 font-sans">{modalError}</p>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={modalSubmitting}
                        className="w-full py-4 rounded-xl bg-gold text-ink font-sans font-bold text-sm uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                      >
                        {modalSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>SUBMIT</span>
                            <ArrowUpRight size={16} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                ) : (
                  /* Success Screen */
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-gold/10 text-gold border border-gold/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 size={36} />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
                      Estimate Request Received!
                    </h3>
                    <p className="font-sans text-sm text-ink-soft max-w-[380px] mx-auto leading-relaxed">
                      Thank you, <strong>{catalogForm.name || 'valued client'}</strong>. Your request for <strong className="text-ink font-semibold">{activeCategory.name}</strong> has been logged. Our principal design team will share your personalized estimate range and design catalog with you shortly.
                    </p>
                    <button
                      onClick={handleCloseCatalogModal}
                      className="px-6 py-2.5 rounded-xl bg-ink text-white font-sans text-xs uppercase font-bold tracking-wider hover:bg-gold hover:text-ink transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── HUB GRID PAGE ─────────────────────────────────────────────────────────
  return (
    <div className="bg-bg min-h-screen">
      <SEO 
        title="Bespoke Interior Spaces & Room Transformation Explorer — ESPACIO" 
        description="Explore luxury room categories by ESPACIO Hyderabad: Modular Kitchens, Master Bedrooms, Living Lounges, Wardrobes, Pooja Sanctuaries, and Dining Suites with interactive Before & After transformation comparisons." 
        url="/spaces" 
      />

      {/* ── 1. ROUNDED CARD HERO (Interactive Multi-Scenario Before/After Slider) ── */}
      {spacesHeroState.visible !== false && (
        <section
          ref={heroRef}
          className="relative h-[56vh] sm:h-[72vh] lg:h-[86vh] min-h-[360px] sm:min-h-[500px] lg:min-h-[600px] px-3 sm:px-6 pt-2 sm:pt-2.5 lg:pt-3 pb-2 sm:pb-3 lg:px-10 z-0 select-none"
          onMouseDown={onStart}
          onMouseMove={onMouseMove}
          onTouchStart={() => { setIsPaused(true); onStart(); }}
          onTouchMove={onTouchMove}
          onTouchEnd={() => { setIsPaused(false); onEnd(); }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={(e) => handleMove(e.clientX)}
        >
          <motion.div
            style={{ scale: heroExitScale, opacity: heroExitOpacity, y: heroExitY }}
            className="relative w-full h-full overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[40px] origin-top cursor-ew-resize bg-bg-dark shadow-2xl"
          >
            {/* AFTER Image Layer */}
            <motion.div
              style={{ scale: bgScale, y: bgY }}
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
            >
              <img
                src={getOptimizedImageUrl(currentSlide.after || '/images/spaces/spaces_hero_after.webp', 1920, 90)}
                alt="After Transformation"
                style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                className="absolute inset-0 w-full h-full object-cover transform-gpu"
              />
            </motion.div>

            {/* AFTER Label (Bottom Right, Clipped to slider line) */}
            <div 
              className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)`, WebkitClipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8">
                <div className="inline-flex items-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/15 shadow-lg whitespace-nowrap">
                  <span className="font-sans text-[10.5px] sm:text-[11.5px] font-medium tracking-widest uppercase text-white/95">
                    After • Finished Handover
                  </span>
                </div>
              </div>
            </div>

            {/* BEFORE Image Layer (Clipped to slider position) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none z-10"
              style={{
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`
              }}
            >
              <motion.div
                style={{ scale: bgScale, y: bgY }}
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
              >
                <img
                  src={getOptimizedImageUrl(currentSlide.before || '/images/spaces/spaces_hero_before.webp', 1920, 90)}
                  alt="Before Transformation"
                  style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                  className="absolute inset-0 w-full h-full object-cover transform-gpu"
                />
              </motion.div>

              {/* BEFORE Label (Bottom Left, inside clipped layer) */}
              <div className="absolute left-6 bottom-6 md:left-8 md:bottom-8 z-20 pointer-events-none">
                <div className="inline-flex items-center px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/15 shadow-lg whitespace-nowrap">
                  <span className="font-sans text-[10.5px] sm:text-[11.5px] font-medium tracking-widest uppercase text-white/95">
                    Before • Raw Site
                  </span>
                </div>
              </div>
            </div>

            {/* Slider Divider Line */}
            <div
              className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-gold/40 via-gold to-gold/40 z-25 pointer-events-none shadow-[0_0_20px_rgba(201,169,110,0.8)]"
              style={{ left: `${sliderPos}%` }}
            />

            {/* Slider Drag Thumb */}
            <div
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gold text-charcoal hover:scale-110 active:scale-95 transition-transform flex items-center justify-center cursor-ew-resize shadow-[0_0_20px_rgba(201,169,110,0.6)] border-2 border-white/80 z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="8 17 3 12 8 7" />
                <polyline points="16 7 21 12 16 17" />
                <line x1="3" y1="12" x2="21" y2="12" />
              </svg>
            </div>

            <ScrollDownIndicator />
          </motion.div>
        </section>
      )}

      {/* Category Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayCategories.filter(c => c.visible !== false).map((cat, idx) => (
            <Reveal key={cat.slug || idx} delay={Math.min((idx % 2) * 0.05, 0.1)}>
              <Link 
                to={`/spaces/${cat.slug}`}
                className="group relative rounded-card overflow-hidden aspect-[4/3] bg-bg-dark block"
              >
                <img 
                  src={cat.heroImage} 
                  alt={cat.name} 
                  loading="lazy" 
                  decoding="async"
                  style={{ imageRendering: 'high-quality', WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div>
                    <h2 className="font-display text-[clamp(20px,2.5vw,28px)] font-bold text-bg mb-2 group-hover:text-gold transition-colors duration-300">
                      {cat.name}
                    </h2>
                    <p className="font-sans text-[13px] text-bg/60 max-w-[280px] leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                      {cat.description?.substring(0, 85)}...
                    </p>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-pill border border-bg/20 flex items-center justify-center text-bg group-hover:bg-gold group-hover:border-gold group-hover:text-ink transition-all duration-300">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WhatWeDo;
