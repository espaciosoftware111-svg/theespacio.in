import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Layers, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUpRight, Check, ImageIcon, ArrowUp, ArrowDown,
  CheckCircle2, SlidersHorizontal, HelpCircle
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';

const defaultSlides = [
  {
    before: '/images/spaces/spaces_hero_before.webp',
    after: '/images/spaces/spaces_hero_after.webp',
    title: 'Living Rooms'
  },
  {
    before: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_0-20260810-173514.jpg',
    after: '/images/company/2bhk_urban/Minimalist_Gray__A_Contemporary_Kitchen_Masterpiec-Unnamed_2-20260810-173514.jpg',
    title: 'Modular Kitchens'
  },
  {
    before: '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Bedroom_0-20260810-124909.jpg',
    after: '/images/company/indo_classical_elegance_3bhk/3BHK-Master_Bedroom_0-20260810-164320.jpg',
    title: 'Master Bedrooms'
  }
];

const defaultSpacesCategories = [
  {
    "name": "Modular Kitchen",
    "slug": "modular-kitchen",
    "description": "Precision-engineered kitchens with high-gloss acrylic, polygranite surfaces, and concealed lighting tracks.",
    "heroImage": "/images/spaces/modular_kitchen/kitchen_drive_24.webp",
    "visible": true,
    "details": {
      "tag": "Precision-Engineered",
      "headline": "Kitchens Built Around the Way You Cook",
      "body": "Every ESPACIO modular kitchen is designed around your personal cooking ergonomics and workflow. We integrate premium Hettich and Häfele soft-close hardware, direct-sourced moisture-resistant marine ply, and seamless quartz waterfall islands. From compact parallel layouts to expansive island kitchens with integrated breakfast counters, every millimetre is accounted for.",
      "includes": [
        "Ergonomic Layout & Workflow Optimization",
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
      "headline": "Apartment Interiors That Maximise Every square Foot",
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

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminSpacesCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // Default to 'list' for spaces manager
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedSpaceIdx, setSelectedSpaceIdx] = useState(0);

  const fileInputBeforeRef = useRef(null);
  const fileInputAfterRef = useRef(null);
  const fileInputSpaceCoverRef = useRef(null);

  // Spaces CMS State
  const [spacesHeroState, setSpacesHeroState] = useState({
    spaces_badge: 'Spaces',
    spaces_title: 'Bespoke Interior Spaces',
    spaces_subtitle: 'Interactive Before & After Transformation Explorer',
    spaces_before_label: 'BEFORE',
    spaces_after_label: 'AFTER',
    spaces_before_after_slides: defaultSlides,
    spaces_hero_visible: true
  });

  const [spacesList, setSpacesList] = useState(defaultSpacesCategories);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setSpacesHeroState({
          spaces_badge: getNonEmpty(storedSettings.spaces_badge, 'Spaces'),
          spaces_title: getNonEmpty(storedSettings.spaces_title, 'Bespoke Interior Spaces'),
          spaces_subtitle: getNonEmpty(storedSettings.spaces_subtitle, 'Interactive Before & After Transformation Explorer'),
          spaces_before_label: getNonEmpty(storedSettings.spaces_before_label, 'BEFORE'),
          spaces_after_label: getNonEmpty(storedSettings.spaces_after_label, 'AFTER'),
          spaces_before_after_slides: (Array.isArray(storedSettings.spaces_before_after_slides) && storedSettings.spaces_before_after_slides.length > 0)
            ? storedSettings.spaces_before_after_slides
            : defaultSlides,
          spaces_hero_visible: storedSettings.spaces_hero_visible !== false
        });

        if (Array.isArray(storedSettings.spaces_list) && storedSettings.spaces_list.length > 0) {
          setSpacesList(storedSettings.spaces_list);
        }
      }
      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setSpacesHeroState((prev) => ({
            ...prev,
            spaces_badge: getNonEmpty(d.spaces_badge, prev.spaces_badge),
            spaces_title: getNonEmpty(d.spaces_title, prev.spaces_title),
            spaces_subtitle: getNonEmpty(d.spaces_subtitle, prev.spaces_subtitle),
            spaces_before_label: getNonEmpty(d.spaces_before_label, prev.spaces_before_label),
            spaces_after_label: getNonEmpty(d.spaces_after_label, prev.spaces_after_label),
            spaces_before_after_slides: (Array.isArray(d.spaces_before_after_slides) && d.spaces_before_after_slides.length > 0)
              ? d.spaces_before_after_slides
              : prev.spaces_before_after_slides
          }));
          if (Array.isArray(d.spaces_list) && d.spaces_list.length > 0) {
            setSpacesList(d.spaces_list);
          }
        }
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleHeroChange = (key, val) => {
    setSpacesHeroState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated, spaces_list: spacesList });
      return updated;
    });
  };

  const handleSpaceChange = (idx, key, val) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
      return updated;
    });
  };

  const handleSpaceDetailChange = (idx, subKey, val) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      const currentDetails = updated[idx].details || {};
      updated[idx] = {
        ...updated[idx],
        details: { ...currentDetails, [subKey]: val }
      };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
      return updated;
    });
  };

  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        callback(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existing,
      ...spacesHeroState,
      spaces_list: spacesList
    };

    // Immediately persist to local storage and broadcast live update
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.', err);
    }

    setSaving(false);
    setSaved(true);
    showNotification('Spaces page updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddSpace = () => {
    const newSlug = `space-${Date.now().toString().slice(-4)}`;
    const newSpace = {
      name: 'New Custom Space',
      slug: newSlug,
      description: 'Detailed description of your new custom interior space domain.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      visible: true,
      details: {
        tag: 'Bespoke Domain',
        headline: 'Custom Tailored Interior Space',
        body: 'Detailed craftsmanship narrative for this custom interior space domain.',
        includes: ['Custom Layout Planning', 'Material Selection', 'Turnkey Execution']
      }
    };
    const updated = [...spacesList, newSpace];
    setSpacesList(updated);
    setSelectedSpaceIdx(spacesList.length);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
    showNotification('New Space card added.');
  };

  const handleDeleteSpace = (idx) => {
    if (spacesList.length <= 1) {
      alert('You must keep at least one Space card record.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${spacesList[idx].name}"?`)) {
      const updated = spacesList.filter((_, i) => i !== idx);
      setSpacesList(updated);
      setSelectedSpaceIdx(0);
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
      showNotification('Space card removed.');
    }
  };

  const handleMoveSpace = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === spacesList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...spacesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSpacesList(updated);
    setSelectedSpaceIdx(targetIdx);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Spaces CMS...</span>
      </div>
    );
  }

  const currentSpace = spacesList[selectedSpaceIdx] || spacesList[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2 font-sans text-xs font-bold animate-bounce">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Save Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">Spaces Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live Before/After slider cards, hero headings, and full list of Space domain cards.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-7 rounded-lg transition-all duration-300 disabled:opacity-60 shrink-0"
        >
          {saved ? (
            <>
              <CheckCircle size={15} />
              <span>Spaces Published Live!</span>
            </>
          ) : saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              <Save size={15} />
              <span>Save & Publish Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'list'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <Layers size={16} />
          <span>Edit Space Cards ({spacesList.length} Domains)</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'hero'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Before / After Hero Slider</span>
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'cta'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <HelpCircle size={16} />
          <span>CTA Section</span>
        </button>
      </div>

      {/* TAB: CTA SECTION EDITOR */}
      {activeTab === 'cta' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 max-w-4xl">
          <CTASectionEditor pageKey="spaces" pageTitle="Spaces" />
        </div>
      )}

      {/* TAB 1: BEFORE/AFTER HERO SLIDER */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Sliders size={18} className="text-gold" />
                <span>Spaces Hero & Before/After Slider Content</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">Edit hero pill label, Before/After photos, and comparison labels.</p>
            </div>

            <div className="space-y-5">
              {/* Hidden File Inputs for Before & After */}
              <input
                type="file"
                ref={fileInputBeforeRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => handleHeroChange('spaces_before_image', dataUrl))}
              />
              <input
                type="file"
                ref={fileInputAfterRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => handleHeroChange('spaces_after_image', dataUrl))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Before Badge Label</label>
                  <input
                    type="text"
                    value={spacesHeroState.spaces_before_label || 'BEFORE'}
                    onChange={(e) => handleHeroChange('spaces_before_label', e.target.value)}
                    className={inpClass}
                    placeholder="BEFORE"
                  />
                </div>
                <div>
                  <label className={labelClass}>After Badge Label</label>
                  <input
                    type="text"
                    value={spacesHeroState.spaces_after_label || 'AFTER'}
                    onChange={(e) => handleHeroChange('spaces_after_label', e.target.value)}
                    className={inpClass}
                    placeholder="AFTER"
                  />
                </div>
              </div>

              {/* Before Photo */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className={labelClass}>Before Transformation Image</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={spacesHeroState.spaces_before_image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90'}
                    alt="Before"
                    className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={spacesHeroState.spaces_before_image || ''}
                    onChange={(e) => handleHeroChange('spaces_before_image', e.target.value)}
                    className={inpClass}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputBeforeRef.current?.click()}
                    className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                  >
                    <Plus size={12} />
                    <span>Upload Before</span>
                  </button>
                </div>
              </div>

              {/* After Photo */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className={labelClass}>After Transformation Image</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={spacesHeroState.spaces_after_image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90'}
                    alt="After"
                    className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={spacesHeroState.spaces_after_image || ''}
                    onChange={(e) => handleHeroChange('spaces_after_image', e.target.value)}
                    className={inpClass}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputAfterRef.current?.click()}
                    className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                  >
                    <Plus size={12} />
                    <span>Upload After</span>
                  </button>
                </div>
              </div>

              {/* Hero Banner Visibility */}
              <div className="pt-2 flex items-center justify-between bg-[#0E0F11] border border-white/5 p-4 rounded-xl">
                <div>
                  <span className="font-sans text-xs font-bold text-white block">Hero Banner Visibility</span>
                  <span className="font-sans text-[11px] text-white/40">Toggle ON/OFF to show or hide the Before/After hero section on /what-we-do.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleHeroChange('spaces_hero_visible', !spacesHeroState.spaces_hero_visible)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                    spacesHeroState.spaces_hero_visible ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      spacesHeroState.spaces_hero_visible ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Live Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-20 bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center space-x-1.5">
                  <Eye size={12} />
                  <span>Spaces Hero Preview</span>
                </span>
                <span className="text-[10px] font-sans text-white/30">Real-time binding</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={spacesHeroState.spaces_after_image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90'}
                  alt="Hero Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute left-4 bottom-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-white">{spacesHeroState.spaces_before_label || 'BEFORE'}</span>
                </div>
                <div className="absolute right-4 bottom-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-white">{spacesHeroState.spaces_after_label || 'AFTER'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPACES CARDS MANAGER */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Space Selector List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-white/60">Space Domains List</span>
              <button
                type="button"
                onClick={handleAddSpace}
                className="flex items-center space-x-1 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all"
              >
                <Plus size={13} />
                <span>Add Space</span>
              </button>
            </div>

            <div data-lenis-prevent className="space-y-2 max-h-[650px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-white/5 hover:scrollbar-thumb-gold transition-all">
              {spacesList.map((space, idx) => {
                const isSelected = idx === selectedSpaceIdx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSpaceIdx(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold/40 shadow-lg'
                        : 'bg-[#141518] border-white/5 hover:border-white/20 hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="font-sans text-xs font-bold text-gold">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="truncate">
                        <h4 className="font-sans text-xs font-bold text-white truncate">{space.name}</h4>
                        <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest block truncate">{space.details?.tag || 'Space Domain'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveSpace(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSpace(idx, 'down')}
                        disabled={idx === spacesList.length - 1}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpace(idx)}
                        className="p-1 text-red-400/40 hover:text-red-400"
                        title="Delete Space"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Space Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest">
                    Editing Space {String(selectedSpaceIdx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-white">{currentSpace.name}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-sans text-xs text-white/40">Visible:</span>
                  <button
                    type="button"
                    onClick={() => handleSpaceChange(selectedSpaceIdx, 'visible', !(currentSpace.visible !== false))}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      currentSpace.visible !== false ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        currentSpace.visible !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputSpaceCoverRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleSpaceChange(selectedSpaceIdx, 'heroImage', dataUrl);
                })}
              />

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Space Name / Title</label>
                    <input
                      type="text"
                      value={currentSpace.name || ''}
                      onChange={(e) => handleSpaceChange(selectedServiceIdx, 'name', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category Tag (e.g. Precision-Engineered)</label>
                    <input
                      type="text"
                      value={currentSpace.details?.tag || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'tag', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description (Shown on Grid Card)</label>
                  <textarea
                    rows={2}
                    value={currentSpace.description || ''}
                    onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'description', e.target.value)}
                    className={`${inpClass} resize-none`}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Space Cover Image</label>
                  <div className="flex items-center space-x-3">
                    {currentSpace.heroImage && (
                      <img src={currentSpace.heroImage} alt="Cover" className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                    )}
                    <input
                      type="text"
                      value={currentSpace.heroImage || ''}
                      onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'heroImage', e.target.value)}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => fileInputSpaceCoverRef.current?.click()}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                    >
                      <Plus size={12} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Page Headline & Narrative */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block">Detailed Inner Domain Page Content</span>
                  
                  <div>
                    <label className={labelClass}>Detail Headline (e.g. Kitchens Built Around the Way You Cook)</label>
                    <input
                      type="text"
                      value={currentSpace.details?.headline || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'headline', e.target.value)}
                      className={inpClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Detail Body Narrative</label>
                    <textarea
                      rows={3}
                      value={currentSpace.details?.body || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'body', e.target.value)}
                      className={`${inpClass} resize-none`}
                    />
                  </div>

                  {/* Included Items */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>What's Included Bullet Points</label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(currentSpace.details?.includes || []), 'New Included Feature'];
                          handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                        }}
                        className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                      >
                        <Plus size={12} />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>

                    {(currentSpace.details?.includes || []).map((item, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                        <CheckCircle2 size={15} className="text-gold shrink-0 ml-1" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...(currentSpace.details?.includes || [])];
                            updated[fIdx] = e.target.value;
                            handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                          }}
                          className={inpClass}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentSpace.details?.includes || []).filter((_, i) => i !== fIdx);
                            handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                          }}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                          title="Remove Bullet Point"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpacesCMS;
