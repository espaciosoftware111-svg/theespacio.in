import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Lock, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import SEO from '../components/common/SEO';
import ScrollDownIndicator from '../components/common/ScrollDownIndicator';
import { getCMSData, STORAGE_KEYS } from '../utils/cmsStore';
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const mockProduct = {
    title: 'WPC Wall Panels',
    slug: 'wpc-wall-panels',
    category: 'wpc_wall_panels',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures. Built for residential and commercial environments demanding premium finishes.',
    heroImage: '/images/materials/wpc_panels.jpg',
    gallery: [
      '/images/company/2bhk_mordern_retro/hall_paneling.jpg',
      '/images/company/2bhk_lux/tv_unit_2_1.png',
      '/images/company/3bhk_lux/open_hall.png',
      '/images/company/minimalist_beige_2bhk/Minimalist_Beige_Bedroom_and_Contemporary_Living_R-Living_room_3-20260810-124909.jpg',
    ],
    specifications: [
      { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
      { label: 'Core Weight', value: '1.8 kg/m' },
      { label: 'Water Resistance', value: '100% Waterproof' },
      { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
      { label: 'Surface Finish', value: 'Deep Embossed Wood Grain' },
      { label: 'Warranty', value: '10 Year Manufacturer' },
    ],
    features: ['100% Waterproof', 'Termite Proof', 'Flame Retardant', 'Eco-Friendly E0 Grade', 'UV Resistant', 'Easy Maintenance'],
    colors: [
      { name: 'Natural Oak', hex: '#D2B48C' },
      { name: 'Smoked Walnut', hex: '#5C4033' },
      { name: 'Ashen Grey', hex: '#808080' },
      { name: 'Slate Charcoal', hex: '#2F4F4F' },
      { name: 'White Ash', hex: '#F5F0EB' },
    ],
    previewPages: [
      '/images/materials/irish.png',
      '/images/materials/azzurro.png',
      '/images/materials/giallo.png',
      '/images/materials/marbo.png',
      '/images/materials/florida.png',
      '/images/materials/menta.png',
      '/images/materials/giallo_dining.png',
      '/images/materials/ash.png',
      '/images/materials/linia.png',
      '/images/materials/florida_vanity.png',
      '/images/materials/gracia.png',
      '/images/materials/irish_gen2.png',
      '/images/materials/blanco.png',
      '/images/materials/formic.png',
      '/images/materials/ash_gen2.png'
    ],
    applications: ['Modular Kitchen Cabinets', 'Living Room Feature Walls', 'Bedroom Headboards', 'Office Ceilings', 'Bathroom Panels', 'Commercial Reception'],
  };

  const mockProductsList = [
    {
      title: 'Fluted Acrylic Luxe - Irish',
      slug: 'fluted-acrylic-luxe-irish',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 Irish fluted acrylic wall panel with rich relief lines and a contemporary matte off-white finish.',
      heroImage: '/images/materials/irish.png',
      gallery: ['/images/materials/irish.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Irish Off-White' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
        { label: 'Surface Finish', value: 'Matte Acrylic fluted relief' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Irish Finish', '100% Waterproof', 'Termite Proof', 'Flame Retardant'],
      colors: [{ name: 'Irish Off-White', hex: '#EAE6DF' }],
      previewPages: ['/images/materials/irish.png'],
      applications: ['Modular Wardrobes', 'Living Room Accent Panels', 'Bedroom Headboards']
    },
    {
      title: 'Fluted Acrylic Luxe - Azzurro',
      slug: 'fluted-acrylic-luxe-azzurro',
      category: 'fluted_panels',
      description: 'Elegant NX-GEN 1 Azzurro fluted accent panel in a beautiful sky-blue finish, perfect for premium master bedrooms and lounges.',
      heroImage: '/images/materials/azzurro.png',
      gallery: ['/images/materials/azzurro.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Azzurro Sky Blue' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Azzurro Blue', '100% Waterproof', 'Termite Proof', 'Flame Retardant'],
      colors: [{ name: 'Azzurro Blue', hex: '#87B5C8' }],
      previewPages: ['/images/materials/azzurro.png'],
      applications: ['Master Bedroom Headboard', 'Living Room Feature Wall', 'Creative Studio Lounge']
    },
    {
      title: 'Fluted Acrylic Luxe - Giallo',
      slug: 'fluted-acrylic-luxe-giallo',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Giallo fluted panel. Professional workspace accent element with clean textured lines in a medium-gray tone.',
      heroImage: '/images/materials/giallo.png',
      gallery: ['/images/materials/giallo.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Giallo Slate Gray' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Gray', '100% Waterproof', 'Flame Retardant'],
      colors: [{ name: 'Giallo Slate Gray', hex: '#8E8D8A' }],
      previewPages: ['/images/materials/giallo.png'],
      applications: ['Home Office Desks Backdrop', 'Executive Meeting Rooms', 'Reception counters']
    },
    {
      title: 'Fluted Acrylic Luxe - Marbo',
      slug: 'fluted-acrylic-luxe-marbo',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Marbo panel. Curator-selected sandy-beige fluted cladding for warm light-diffused luxury dining environments.',
      heroImage: '/images/materials/marbo.png',
      gallery: ['/images/materials/marbo.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Marbo Sandy Beige' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Marbo Sand', '100% Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Marbo Sand', hex: '#D2C1AE' }],
      previewPages: ['/images/materials/marbo.png'],
      applications: ['Dining Room Feature Wall', 'Kitchen backsplash partitions', 'Hotel lobby lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Florida',
      slug: 'fluted-acrylic-luxe-florida',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 Florida fluted surface displaying high-fidelity white marble texture running with golden veins.',
      heroImage: '/images/materials/florida.png',
      gallery: ['/images/materials/florida.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Florida Golden Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Florida Marble', 'Anti-Scratch', 'Waterproof'],
      colors: [{ name: 'Florida Marble', hex: '#ECEAE6' }],
      previewPages: ['/images/materials/florida.png'],
      applications: ['Luxury Living TV panels', 'Master Suite backdrop elevation', 'Retail luxury boutique backdrop']
    },
    {
      title: 'Fluted Acrylic Luxe - Menta',
      slug: 'fluted-acrylic-luxe-menta',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Menta fluted wall panel. Restful and organic mint green vertical textures, perfect for calming bedroom designs.',
      heroImage: '/images/materials/menta.png',
      gallery: ['/images/materials/menta.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Menta Mint Green' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Menta Green', 'Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Menta Green', hex: '#A2C2B3' }],
      previewPages: ['/images/materials/menta.png'],
      applications: ['Bed Headboards backdrop', 'Spas & Wellness centers', 'Living room calming walls']
    },
    {
      title: 'Fluted Acrylic Luxe - Giallo Dining',
      slug: 'fluted-acrylic-luxe-giallo-dining',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Giallo Dining panel. Modern sand-tinted vertical lines styling luxury family dining partitions and ambient layouts.',
      heroImage: '/images/materials/giallo_dining.png',
      gallery: ['/images/materials/giallo_dining.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Giallo Sand' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Sand', 'Heat Resistant', 'Termite Proof'],
      colors: [{ name: 'Giallo Sand', hex: '#D7CBBD' }],
      previewPages: ['/images/materials/giallo_dining.png'],
      applications: ['Dining Space feature panels', 'Restaurant ambient divisions', 'Luxury kitchen partitions']
    },
    {
      title: 'Fluted Acrylic Luxe - Ash',
      slug: 'fluted-acrylic-luxe-ash',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Ash fluted element. Clean industrial slate ash tones, offering a sophisticated background for media consoles and screens.',
      heroImage: '/images/materials/ash.png',
      gallery: ['/images/materials/ash.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Ash Gray-Blue' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Ash Gray', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Ash Gray-Blue', hex: '#9CAAB6' }],
      previewPages: ['/images/materials/ash.png'],
      applications: ['Living room TV Backdrop', 'Smart Entertainment Units', 'Office lounge focus wall']
    },
    {
      title: 'Fluted Acrylic Luxe - Linia',
      slug: 'fluted-acrylic-luxe-linia',
      category: 'fluted_panels',
      description: 'Luxury NX-GEN 2 Linia panel. Delicate warm marble surface patterns detailed with rich gold veins for premium bathroom vanity accenting.',
      heroImage: '/images/materials/linia.png',
      gallery: ['/images/materials/linia.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Linia Gold Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Linia Gold', 'Waterproof', 'Anti-Scratch'],
      colors: [{ name: 'Linia Gold Marble', hex: '#F0ECE1' }],
      previewPages: ['/images/materials/linia.png'],
      applications: ['Luxury Bathroom basins wall', 'Premium vanity units elevation', 'Spa backdrop dividers']
    },
    {
      title: 'Fluted Acrylic Luxe - Florida Vanity',
      slug: 'fluted-acrylic-luxe-florida-vanity',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Florida Vanity layout. Elegant vertical marble and gold trim detailing designed for high-end boutique powder rooms and dressing spaces.',
      heroImage: '/images/materials/florida_vanity.png',
      gallery: ['/images/materials/florida_vanity.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Florida Vanity Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Florida Gold Marble', 'Anti-Scratch', 'Waterproof'],
      colors: [{ name: 'Florida Vanity Marble', hex: '#ECEAE6' }],
      previewPages: ['/images/materials/florida_vanity.png'],
      applications: ['Boutique Powder Room', 'Walk-in Wardrobe Dressing vanity', 'Luxury bathroom partitions']
    },
    {
      title: 'Fluted Acrylic Luxe - Gracia',
      slug: 'fluted-acrylic-luxe-gracia',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 2 Gracia fluted wall panel. Fine off-white marble relief details with standard interlocking installation.',
      heroImage: '/images/materials/gracia.png',
      gallery: ['/images/materials/gracia.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Gracia Marble White' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Gracia Finish', 'Waterproof', 'Easy Install'],
      colors: [{ name: 'Gracia Marble White', hex: '#EBEAE6' }],
      previewPages: ['/images/materials/gracia.png'],
      applications: ['Living room sofa wall backdrop', 'Reception lobbies', 'Executive meeting lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Irish Gen 2',
      slug: 'fluted-acrylic-luxe-irish-gen2',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Irish fluted panel. Next-generation contemporary off-white finish styling luxury executive workspaces and desks.',
      heroImage: '/images/materials/irish_gen2.png',
      gallery: ['/images/materials/irish_gen2.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Irish Off-White Gen 2' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Irish Finish', 'Anti-Scratch', 'Eco E0 Grade'],
      colors: [{ name: 'Irish Off-White Gen 2', hex: '#E6E3DB' }],
      previewPages: ['/images/materials/irish_gen2.png'],
      applications: ['Executive Workstation desks backdrop', 'Study room accent elevations', 'Luxury library panels']
    },
    {
      title: 'Fluted Acrylic Luxe - Blanco',
      slug: 'fluted-acrylic-luxe-blanco',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Blanco panel. Minimalist crisp-white fluted texture, perfect for styling bunk beds and modern children\'s bedrooms.',
      heroImage: '/images/materials/blanco.png',
      gallery: ['/images/materials/blanco.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Blanco White' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Blanco White', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Blanco White', hex: '#FFFFFF' }],
      previewPages: ['/images/materials/blanco.png'],
      applications: ['Kids Bed backdrop wall', 'Bunk bed structural cladding', 'Bright minimalist lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Formic',
      slug: 'fluted-acrylic-luxe-formic',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 2 Formic panel. Warm vertical oak-grained relief lines detailing high-ceiling staircases and open spaces.',
      heroImage: '/images/materials/formic.png',
      gallery: ['/images/materials/formic.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Formic Oak' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Formic Oak', 'Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Formic Oak', hex: '#E4D6BD' }],
      previewPages: ['/images/materials/formic.png'],
      applications: ['Staircase high-ceiling walls', 'Luxury lobby dividers', 'Bespoke divider screens']
    },
    {
      title: 'Fluted Acrylic Luxe - Ash Gen 2',
      slug: 'fluted-acrylic-luxe-ash-gen2',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Ash panel. Light gray contemporary fluted textures, providing a premium backdrop for master suite bed elevations.',
      heroImage: '/images/materials/ash_gen2.png',
      gallery: ['/images/materials/ash_gen2.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Ash Gray Gen 2' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Ash Gray', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Ash Gray Gen 2', hex: '#A8B4BD' }],
      previewPages: ['/images/materials/ash_gen2.png'],
      applications: ['Master suite bed headboard wall', 'Luxury TV lounges elevations', 'Hotel rooms key-walls']
    }
  ];

  const categoryDict = {
    'acrylic-luxe-collection': {
      title: 'Acrylic Luxe Collection',
      category: 'acrylic_luxe',
      description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
      heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/acrylic_idoycj.png',
      features: ['Ultra-Gloss Anti-Scratch', 'Concealed Track Fit', 'Zero Fingerprints', 'Class 1 Fire Safe', 'UV Protected'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 2mm' },
        { label: 'Surface', value: 'Hard-coated Ultra-Gloss Acrylic' },
        { label: 'Finishes', value: 'Azzurro Blue (2104), Luminous Grid (8313), Crema Imperiale (8302), Elysian Vein (8303), Vector Grid (8306), Crema Radiance (8309)' },
        { label: 'Material Code', value: 'MAT-ACR-01' }
      ],
      totalShades: 18,
      previewLimit: 6,
      previewPages: [
        '/images/materials/luminous_grid_8313.webp',
        '/images/materials/crema_imperiale_8302.webp',
        '/images/materials/elysian_vein_8303.webp',
        '/images/materials/vector_grid_8306.webp',
        '/images/materials/crema_radiance_8309.webp'
      ],
      gallery: [
        '/images/materials/luminous_grid_8313.webp',
        '/images/materials/crema_imperiale_8302.webp',
        '/images/materials/elysian_vein_8303.webp',
        '/images/materials/vector_grid_8306.webp',
        '/images/materials/crema_radiance_8309.webp'
      ],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Sliding Doors', 'Bathroom Vanity Units', 'Luxe Elevation Panels']
    },
    'digital-korean-poly-granite': {
      title: 'Digital Korean Poly Granite',
      category: 'poly_granite',
      description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
      heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/polygranite_ujh0zb.png',
      features: ['High-Gloss Stone Overlay', 'Scratch & Heat Resistant', 'Italian Marble Veins', 'Direct Wall Mount', 'Zero Moisture Seepage'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 3mm' },
        { label: 'Gloss Rating', value: '95+ GU Mirror Polish' },
        { label: 'Surface Finish', value: 'Crema Imperiale (8302), Elysian Vein (8303), Gracia Vein, Linia Gold' },
        { label: 'Material Code', value: 'MAT-GNT-02' }
      ],
      totalShades: 16,
      previewLimit: 6,
      previewPages: [
        '/images/materials/crema_imperiale_8302.webp',
        '/images/materials/elysian_vein_8303.webp',
        '/images/materials/crema_radiance_8309.webp',
        '/images/materials/gracia.webp',
        '/images/materials/linia.webp'
      ],
      gallery: [
        '/images/materials/crema_imperiale_8302.webp',
        '/images/materials/elysian_vein_8303.webp',
        '/images/materials/crema_radiance_8309.webp',
        '/images/materials/gracia.webp',
        '/images/materials/linia.webp'
      ],
      applications: ['Living Room TV Unit Elevation', 'Dining Room Feature Wall', 'Lobby & Reception Backdrop', 'Foyer Accent']
    },
    'charcoal-panels-luxe': {
      title: 'Charcoal Panels Luxe Collection',
      category: 'charcoal_panels',
      description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
      heroImage: '/images/materials/charcoal_luxe_4018_4017_4016.webp',
      features: ['Active Charcoal Core', 'VOC Air Purification', 'Matte Deep Texture', 'Zero Warping', 'Acoustic Isolation'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 120mm × 12mm' },
        { label: 'Finishes', value: 'Tone 4018/4017/4016, Edition 4015, Tone 4009/4011, Tone 4001/4003, Edition 6015, Tone 6083/6082/6081' },
        { label: 'Material Code', value: 'MAT-CHR-03' }
      ],
      totalShades: 18,
      previewLimit: 6,
      previewPages: [
        '/images/materials/charcoal_luxe_4018_4017_4016.webp',
        '/images/materials/charcoal_luxe_4015.webp',
        '/images/materials/charcoal_luxe_4009_4011.webp',
        '/images/materials/charcoal_luxe_4001_4003.webp',
        '/images/materials/charcoal_luxe_6015.webp',
        '/images/materials/charcoal_luxe_6083_6082_6081.webp'
      ],
      gallery: [
        '/images/materials/charcoal_luxe_4018_4017_4016.webp',
        '/images/materials/charcoal_luxe_4015.webp',
        '/images/materials/charcoal_luxe_4009_4011.webp',
        '/images/materials/charcoal_luxe_4001_4003.webp',
        '/images/materials/charcoal_luxe_6015.webp',
        '/images/materials/charcoal_luxe_6083_6082_6081.webp'
      ],
      applications: ['Home Theatre Acoustic Wall', 'Master Bedroom Headboard', 'Executive Lounge Focus Wall', 'Conference Room Cladding']
    },
    'fluted-pvc-luxe': {
      title: 'Fluted PVC Luxe Collection',
      category: 'fluted_pvc',
      description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
      heroImage: '/images/materials/irish.webp',
      features: ['Waterproof PVC Core', 'Easy Tongue & Groove', 'Flame Retardant', 'Lightweight Modular', 'Anti-Scratch'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Material Composition', value: 'High-Density Polymer PVC Resin' },
        { label: 'Finishes', value: 'Irish Off-White, Tone 1201/1204, Tone 1202/1206, Azzurro Blue, Marbo Beige, Giallo Slate' },
        { label: 'Material Code', value: 'MAT-PVC-04' }
      ],
      totalShades: 16,
      previewLimit: 6,
      previewPages: [
        '/images/materials/irish.webp',
        '/images/materials/pvc_luxe_1201_1204_1203.webp',
        '/images/materials/pvc_luxe_1202_1206_2013.webp',
        '/images/materials/azzurro.webp',
        '/images/materials/marbo.webp',
        '/images/materials/giallo.webp'
      ],
      gallery: [
        '/images/materials/irish.webp',
        '/images/materials/pvc_luxe_1201_1204_1203.webp',
        '/images/materials/pvc_luxe_1202_1206_2013.webp',
        '/images/materials/azzurro.webp',
        '/images/materials/marbo.webp',
        '/images/materials/giallo.webp'
      ],
      applications: ['Living Room Accent Walls', 'TV Consoles & Partitions', 'Powder Room Vanity Backdrops', 'Corridor Cladding']
    },
    'lvt-luxe-flooring': {
      title: 'LVT Luxe Flooring',
      category: 'lvt_flooring',
      description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
      heroImage: '/images/materials/fluted_acrylic_giallo_dining.jpg',
      features: ['Commercial Grade Wear Layer', '100% Waterproof', 'Quiet Acoustic Underlay', 'Click-Lock System', 'Scratch Resistant'],
      specifications: [
        { label: 'Plank Size', value: '1220mm × 180mm × 5mm' },
        { label: 'Wear Layer', value: '0.55mm Heavy Commercial' },
        { label: 'Finishes', value: 'Scandinavian Oak, Smoked Walnut, Ashen Gray, Slate Marble' },
        { label: 'Material Code', value: 'MAT-FLR-05' }
      ],
      totalShades: 14,
      previewLimit: 6,
      previewPages: [
        '/images/materials/fluted_acrylic_giallo_dining.jpg',
        '/images/materials/giallo.webp',
        '/images/materials/ash.webp',
        '/images/materials/marbo.webp',
        '/images/materials/menta.webp',
        '/images/materials/linia.webp'
      ],
      gallery: [
        '/images/materials/fluted_acrylic_giallo_dining.jpg',
        '/images/materials/giallo.webp',
        '/images/materials/ash.webp',
        '/images/materials/marbo.webp',
        '/images/materials/menta.webp',
        '/images/materials/linia.webp'
      ],
      applications: ['Living Room Flooring', 'Master Bedroom Flooring', 'Office Workspace', 'Boutique Retail']
    },
    'fluted-acrylic-luxe': {
      title: 'Fluted Acrylic Luxe Collection',
      category: 'fluted_acrylic',
      description: 'Dynamic fluted acrylic panels creating sophisticated shadow play and backlit radiance.',
      heroImage: '/images/materials/fluted_acrylic_florida.jpg',
      features: ['3D Relief Grooves', 'Zero Moisture Absorption', 'Backlit Ready', 'UV Protected', 'Anti-Scratch'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Finishes', value: 'Florida Gold Marble, Giallo Pale (Desk), Azzurro Blue, Giallo Dining, Gracia White, Irish' },
        { label: 'Material Code', value: 'MAT-ACR-06' }
      ],
      totalShades: 16,
      previewLimit: 6,
      previewPages: [
        '/images/materials/fluted_acrylic_florida.jpg',
        '/images/materials/fluted_acrylic_giallo_desk.jpg',
        '/images/materials/fluted_acrylic_azzurro.webp',
        '/images/materials/fluted_acrylic_giallo_dining.jpg',
        '/images/materials/fluted_acrylic_gracia.jpg',
        '/images/materials/irish.webp'
      ],
      gallery: [
        '/images/materials/fluted_acrylic_florida.jpg',
        '/images/materials/fluted_acrylic_giallo_desk.jpg',
        '/images/materials/fluted_acrylic_azzurro.webp',
        '/images/materials/fluted_acrylic_giallo_dining.jpg',
        '/images/materials/fluted_acrylic_gracia.jpg',
        '/images/materials/irish.webp'
      ],
      applications: ['Master Suite Headboards', 'Living Room Accent Walls', 'TV Consoles & Partitions', 'Powder Room Vanity Backdrops']
    },
    'pvc-luxe-collection': {
      title: 'PVC Luxe Collection',
      category: 'pvc_luxe',
      description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
      heroImage: '/images/materials/pvc_luxe_5003_5004.webp',
      features: ['Lightweight Construction', 'Fire Retardant B1', 'Moisture Proof', 'Dual Slat Profile', 'Click-lock Grid'],
      specifications: [
        { label: 'Dimensions', value: '3000mm × 200mm × 8mm' },
        { label: 'Finishes', value: 'Tone 5003/5004, Tone 4010/4013/2007, Tone 1202/1206/2013, Tone 1201/1204/1203, Tone 2003/1205/3012' },
        { label: 'Material Code', value: 'MAT-PVC-07' }
      ],
      totalShades: 16,
      previewLimit: 6,
      previewPages: [
        '/images/materials/pvc_luxe_5003_5004.webp',
        '/images/materials/pvc_luxe_4010_4013_2007.webp',
        '/images/materials/pvc_luxe_1202_1206_2013.webp',
        '/images/materials/pvc_luxe_1201_1204_1203.webp',
        '/images/materials/pvc_luxe_2003_1205_3012.webp',
        '/images/materials/irish_gen2.webp'
      ],
      gallery: [
        '/images/materials/pvc_luxe_5003_5004.webp',
        '/images/materials/pvc_luxe_4010_4013_2007.webp',
        '/images/materials/pvc_luxe_1202_1206_2013.webp',
        '/images/materials/pvc_luxe_1201_1204_1203.webp',
        '/images/materials/pvc_luxe_2003_1205_3012.webp',
        '/images/materials/irish_gen2.webp'
      ],
      applications: ['False Ceiling Panels', 'Cove Lighting Integration', 'Wall Cladding', 'Reception Desk Backdrops']
    },
    'wpc-luxe-collection': {
      title: 'WPC Luxe Collection',
      category: 'wpc_luxe',
      description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
      heroImage: '/images/materials/wpc_luxe_1701_1606.webp',
      features: ['Solid Wood Composite', '100% Termite Proof', 'Acoustic Sound Baffle', '10 Year Warranty', 'UV Resistant'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 160mm × 24mm' },
        { label: 'Finishes', value: 'Tone 1701/1606, Tone 1718/1717/1701, Tone 1401/1410/1411, Tone 1503/1502/1504, Tone 1506/1505' },
        { label: 'Material Code', value: 'MAT-WPC-08' }
      ],
      totalShades: 18,
      previewLimit: 6,
      previewPages: [
        '/images/materials/wpc_luxe_1701_1606.webp',
        '/images/materials/wpc_luxe_1718_1717_1701.webp',
        '/images/materials/wpc_luxe_1401_1410_1411.webp',
        '/images/materials/wpc_luxe_1503_1502_1504.webp',
        '/images/materials/wpc_luxe_1506_1505.webp',
        '/images/materials/wpc_panels.webp'
      ],
      gallery: [
        '/images/materials/wpc_luxe_1701_1606.webp',
        '/images/materials/wpc_luxe_1718_1717_1701.webp',
        '/images/materials/wpc_luxe_1401_1410_1411.webp',
        '/images/materials/wpc_luxe_1503_1502_1504.webp',
        '/images/materials/wpc_luxe_1506_1505.webp',
        '/images/materials/wpc_panels.webp'
      ],
      applications: ['Kitchen Shutters', 'Living Room Walls', 'Bedroom Headboards', 'Balcony Feature Walls']
    },
    'charcoal-panels-luxe-1': {
      title: 'Espacio Charcoal Panels Luxe Collection (1)',
      category: 'charcoal_panels_1',
      description: 'Additional selection of richly textured wall panels infused with active charcoal.',
      heroImage: 'https://res.cloudinary.com/or5e9kak/image/upload/v1791205613/additional_img_dgrs53.png',
      features: ['Active Charcoal Core', 'Architectural Deep Relief', 'Acoustic Isolation', 'Class A Fire Safety'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 120mm × 12mm' },
        { label: 'Finishes', value: 'LUXE Edition 6015, Tone 6085/4009, Tone 5005/5006/5002, Tone 6049/6052/6050/6051, Tone 4001/4003' },
        { label: 'Material Code', value: 'MAT-CHR-09' }
      ],
      totalShades: 16,
      previewLimit: 6,
      previewPages: [
        '/images/materials/charcoal_luxe_1_6015.webp',
        '/images/materials/charcoal_luxe_1_6085_4009.webp',
        '/images/materials/charcoal_luxe_1_5005_5006_5002.webp',
        '/images/materials/charcoal_luxe_1_6049_6052_6050_6051.webp',
        '/images/materials/charcoal_luxe_1_4001_4003.webp',
        '/images/materials/charcoal_luxe_4018_4017_4016.webp'
      ],
      gallery: [
        '/images/materials/charcoal_luxe_1_6015.webp',
        '/images/materials/charcoal_luxe_1_6085_4009.webp',
        '/images/materials/charcoal_luxe_1_5005_5006_5002.webp',
        '/images/materials/charcoal_luxe_1_6049_6052_6050_6051.webp',
        '/images/materials/charcoal_luxe_1_4001_4003.webp',
        '/images/materials/charcoal_luxe_4018_4017_4016.webp'
      ],
      applications: ['Master Bedroom Headboard', 'Living Room Accent Feature', 'Executive Lounge', 'Study Wall']
    },
    '3d-panels': {
      title: '3D Wall Panels',
      category: '3d_panels',
      description: 'Geometric and organic 3D relief panels creating dynamic shadow play on living room and reception feature walls.',
      heroImage: '/images/materials/gracia.png',
      features: ['3D Relief Texture', '12 Sculptural Designs', 'Paintable Surface', 'Acoustic Relief'],
      specifications: [
        { label: 'Tile Dimensions', value: '500mm × 500mm × 25mm' },
        { label: 'Material', value: 'Molded Mineral Fiber' },
        { label: 'Fire Rating', value: 'Class A' }
      ],
      previewPages: [
        '/images/materials/gracia.png',
        '/images/materials/formic.png',
        '/images/materials/blanco.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/ash.png'
      ],
      applications: ['Living Room TV Feature Wall', 'Corporate Reception Backdrop', 'Lounge Accent Wall']
    },
    'wpc-wall-panels': {
      title: 'WPC Wall Panels',
      category: 'wpc_wall_panels',
      description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures. Built for residential and commercial environments demanding premium finishes.',
      heroImage: '/images/materials/formic.png',
      features: ['100% Waterproof', 'Termite Proof', 'Flame Retardant', 'Eco-Friendly E0 Grade', 'UV Resistant'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 160mm × 24mm' },
        { label: 'Core Weight', value: '2.4 kg/m' },
        { label: 'Water Resistance', value: '100% Waterproof' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' }
      ],
      previewPages: [
        '/images/materials/formic.png',
        '/images/materials/irish.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/gracia.png',
        '/images/materials/blanco.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/ash.png'
      ],
      applications: ['Modular Kitchen Cabinets', 'Living Room Feature Walls', 'Bedroom Headboards', 'Office Ceilings']
    },
    'pvc-ceiling-panels': {
      title: 'PVC Ceiling Panels',
      category: 'pvc_ceiling_panels',
      description: 'Lightweight Class-A fire retardant ceiling elements integrating with smart lighting tracks seamlessly.',
      heroImage: '/images/materials/azzurro.png',
      features: ['Lightweight', 'Fire Class-A', 'Cove Lighting Track Ready', 'Easy Maintenance'],
      specifications: [
        { label: 'Standard Dimensions', value: '3000mm × 200mm × 8mm' },
        { label: 'Fire Rating', value: 'Class A' },
        { label: 'Installation', value: 'Click-lock grid' }
      ],
      previewPages: [
        '/images/materials/azzurro.png',
        '/images/materials/blanco.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/marbo.png',
        '/images/materials/menta.png',
        '/images/materials/linia.png',
        '/images/materials/florida.png',
        '/images/materials/giallo.png'
      ],
      applications: ['Living Room False Ceilings', 'Bedrooms Cove Lighting', 'Office Corridors']
    },
    'polygranite-sheets': {
      title: 'Polygranite Sheets',
      category: 'polygranite_sheets',
      description: 'High-gloss stone surface overlays offering scratch-proof marble elevations without the structural weight.',
      heroImage: '/images/materials/florida.png',
      features: ['Scratch-Proof', 'High-Gloss Marble', 'Heat Resistant', 'Zero Seams'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 3mm' },
        { label: 'Gloss Rating', value: '95+ GU' },
        { label: 'Weight', value: '12 kg per sheet' }
      ],
      previewPages: [
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/florida_vanity.png',
        '/images/materials/gracia.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/irish.png',
        '/images/materials/ash.png',
        '/images/materials/blanco.png'
      ],
      applications: ['TV Unit Backdrops', 'Dining Room Accent Walls', 'Lobby Elevations']
    },
    'acrylic-sheets': {
      title: 'Acrylic Sheets',
      category: 'acrylic_sheets',
      description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
      heroImage: '/images/materials/linia.png',
      features: ['Anti-Scratch', 'UV Stable', 'Mirror Gloss', 'Seamless Finish'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 2mm' },
        { label: 'Surface', value: 'Hard-coated Acrylic' }
      ],
      previewPages: [
        '/images/materials/linia.png',
        '/images/materials/irish.png',
        '/images/materials/azzurro.png',
        '/images/materials/menta.png',
        '/images/materials/blanco.png',
        '/images/materials/gracia.png',
        '/images/materials/florida_vanity.png',
        '/images/materials/giallo.png',
        '/images/materials/ash_gen2.png'
      ],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Sliding Doors', 'Bathroom Vanity']
    },
    'charcoal-panels': {
      title: 'Charcoal Panels',
      category: 'charcoal_panels',
      description: 'Richly textured wall panels infused with active charcoal for unique luxury accent wall applications.',
      heroImage: '/images/materials/ash.png',
      features: ['Air Purifying', 'Premium Texture', 'Matte Finish', 'Sound Dampening'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 120mm × 12mm' },
        { label: 'Material', value: 'Activated Charcoal Composite' }
      ],
      previewPages: [
        '/images/materials/ash.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/giallo.png',
        '/images/materials/marbo.png',
        '/images/materials/formic.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/florida.png',
        '/images/materials/blanco.png'
      ],
      applications: ['Home Theatre Acoustic Wall', 'Master Bedroom Headboard', 'Executive Lounge']
    },
    'mosaic-tiles': {
      title: 'Mosaic Tiles',
      category: 'mosaic_tiles',
      description: 'Curated natural stone and matte metallic mosaic details for premium powder rooms and kitchen backsplashes.',
      heroImage: '/images/materials/florida_vanity.png',
      features: ['Natural Stone', 'Non-Slip', 'Handcrafted', 'Bespoke Motifs'],
      specifications: [
        { label: 'Mesh Sheet Size', value: '300mm × 300mm' },
        { label: 'Tile Thickness', value: '8mm' }
      ],
      previewPages: [
        '/images/materials/florida_vanity.png',
        '/images/materials/linia.png',
        '/images/materials/gracia.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/florida.png',
        '/images/materials/menta.png',
        '/images/materials/irish.png'
      ],
      applications: ['Powder Room Basin Niche', 'Kitchen Backsplash', 'Bar Counter Front']
    },
    'decorative-louvers': {
      title: 'Decorative Louvers',
      category: 'louvers',
      description: 'Bespoke walnut and charcoal vertical dividers engineered for light diffusion and open layout zoning.',
      heroImage: '/images/materials/gracia.png',
      features: ['Light Diffusing', 'Custom Heights', 'Modular Fit', 'Acoustic Relief'],
      specifications: [
        { label: 'Louver Height', value: 'Up to 3600mm' },
        { label: 'Profile Size', value: '50mm × 50mm' }
      ],
      previewPages: [
        '/images/materials/gracia.png',
        '/images/materials/formic.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/blanco.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/ash.png',
        '/images/materials/florida.png'
      ],
      applications: ['Foyer Room Divider', 'Living-Dining Partition', 'Staircase Screen']
    }
  };

  const [cmsProducts, setCmsProducts] = useState(() => getCMSData(STORAGE_KEYS.PRODUCTS) || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const syncCMS = () => {
      const stored = getCMSData(STORAGE_KEYS.PRODUCTS);
      if (Array.isArray(stored)) {
        setCmsProducts(stored);
      }
    };
    syncCMS();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, [slug]);

  const storedProduct = (cmsProducts || []).find(m => m.slug === slug || m.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug);
  const localProduct = categoryDict[slug] || mockProductsList.find(m => m.slug === slug);
  const fallbackProduct = localProduct || mockProduct;
  const p = storedProduct ? { ...fallbackProduct, ...storedProduct, badge: fallbackProduct.badge || storedProduct.badge } : fallbackProduct;
  const previewLimit = p.previewLimit || 6;

  // Safe Array Normalizations
  const safeFeatures = useMemo(() => {
    if (Array.isArray(p.features) && p.features.length > 0) return p.features;
    if (typeof p.features === 'string') return p.features.split(',').map(s => s.trim()).filter(Boolean);
    if (Array.isArray(fallbackProduct?.features) && fallbackProduct.features.length > 0) return fallbackProduct.features;
    return mockProduct.features;
  }, [p.features, fallbackProduct]);

  const safeApplications = useMemo(() => {
    if (Array.isArray(p.applications) && p.applications.length > 0) return p.applications;
    if (typeof p.applications === 'string') return p.applications.split(',').map(s => s.trim()).filter(Boolean);
    if (Array.isArray(fallbackProduct?.applications) && fallbackProduct.applications.length > 0) return fallbackProduct.applications;
    return mockProduct.applications;
  }, [p.applications, fallbackProduct]);

  const safeColors = useMemo(() => {
    if (Array.isArray(p.colors) && p.colors.length > 0) return p.colors;
    if (Array.isArray(fallbackProduct?.colors) && fallbackProduct.colors.length > 0) return fallbackProduct.colors;
    return mockProduct.colors;
  }, [p.colors, fallbackProduct]);

  const safeSpecifications = useMemo(() => {
    let raw = p.specifications;
    if (Array.isArray(raw) && raw.length > 0) return raw;
    if (raw && typeof raw === 'object' && Object.keys(raw).length > 0) {
      return Object.entries(raw).map(([label, value]) => ({
        label,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value || '')
      }));
    }
    if (Array.isArray(fallbackProduct?.specifications) && fallbackProduct.specifications.length > 0) {
      return fallbackProduct.specifications;
    }
    return mockProduct.specifications;
  }, [p.specifications, fallbackProduct]);
  
  const fallbackPages = (localProduct?.previewPages && localProduct.previewPages.length > 0) 
    ? localProduct.previewPages 
    : mockProduct.previewPages;

  const cmsCustomPages = (storedProduct?.previewPages && storedProduct.previewPages.length > 0) ? storedProduct.previewPages : [];
  
  // Full catalog image pool for realistic locked shade cards
  const fullCatalogPool = [
    '/images/materials/irish.png',
    '/images/materials/azzurro.png',
    '/images/materials/giallo.png',
    '/images/materials/marbo.png',
    '/images/materials/florida.png',
    '/images/materials/menta.png',
    '/images/materials/giallo_dining.png',
    '/images/materials/ash.png',
    '/images/materials/linia.png',
    '/images/materials/florida_vanity.png',
    '/images/materials/gracia.png',
    '/images/materials/irish_gen2.png',
    '/images/materials/blanco.png',
    '/images/materials/formic.png',
    '/images/materials/ash_gen2.png'
  ];

  // Combine all CMS uploaded pages and fallback catalog pages safely
  const sourcePages = cmsCustomPages.length > 0 ? cmsCustomPages : fallbackPages;

  // 1. Guaranteed exactly 6 unlocked pages (Pages 1 to 6)
  const finalUnlocked = [];
  sourcePages.forEach((pageImg, idx) => {
    const isExplicitlyLocked = typeof pageImg === 'object' && pageImg.isLocked !== undefined 
      ? pageImg.isLocked 
      : null;
    const isLocked = isExplicitlyLocked !== null ? isExplicitlyLocked : (idx >= 6);
    if (!isLocked && finalUnlocked.length < 6) {
      finalUnlocked.push({ pageImg, originalIdx: finalUnlocked.length, isLocked: false, hideOnMobile: false });
    }
  });

  // We no longer backfill unlocked pages if there are fewer than 6, as requested by user.

  const targetTotalPages = 12;
  const targetLockedCount = targetTotalPages - finalUnlocked.length;

  // 2. Add explicit locked pages from sourcePages (if any)
  const finalLocked = [];
  sourcePages.forEach((pageImg, idx) => {
    const isExplicitlyLocked = typeof pageImg === 'object' && pageImg.isLocked !== undefined 
      ? pageImg.isLocked 
      : null;
    const isLocked = isExplicitlyLocked !== null ? isExplicitlyLocked : (idx >= finalUnlocked.length);
    if (isLocked && finalLocked.length < targetLockedCount) {
      const lockedPos = finalLocked.length; // 0, 1, 2...
      finalLocked.push({
        pageImg,
        originalIdx: finalUnlocked.length + lockedPos,
        isLocked: true,
        hideOnMobile: lockedPos >= (targetLockedCount - 2) // Hide the last 2 locked items on mobile
      });
    }
  });

  // If fewer than target locked pages, fill from catalog pool with diverse teaser textures
  while (finalLocked.length < targetLockedCount) {
    const lockedPos = finalLocked.length; // 0, 1, 2...
    const fallbackImg = fullCatalogPool[(finalUnlocked.length + lockedPos) % fullCatalogPool.length];
    finalLocked.push({
      pageImg: fallbackImg,
      originalIdx: finalUnlocked.length + lockedPos,
      isLocked: true,
      hideOnMobile: lockedPos >= (targetLockedCount - 2) // Hide the last 2 locked items on mobile
    });
  }

  const allPages = [...finalUnlocked, ...finalLocked];
  const unlockedPages = finalUnlocked;
  const totalShades = 12;

  const unlockedImageUrls = useMemo(() => {
    return unlockedPages.map((item) => {
      const pageImg = item.pageImg || item;
      return typeof pageImg === 'string' ? pageImg : (pageImg.url || pageImg.src || pageImg);
    });
  }, [unlockedPages]);

  const isAcrylicLuxe = p.slug === 'acrylic-luxe-collection' || (p.heroImage && p.heroImage.includes('acrylic_idoycj'));
  const isPolyGranite = p.slug === 'digital-korean-poly-granite' || (p.heroImage && p.heroImage.includes('polygranite_ujh0zb'));
  const isCharcoalLuxe = p.slug === 'charcoal-panels-luxe' || (p.heroImage && (p.heroImage.includes('charcoal_qpelt9') || p.heroImage.includes('charcoal_thumb')));
  const isFlutedPVC   = p.slug === 'fluted-pvc-luxe'        || (p.heroImage && p.heroImage.includes('pvc_fluted_1_o1ixyc'));
  const isLVTFlooring = p.slug === 'lvt-luxe-flooring'      || (p.heroImage && p.heroImage.includes('lvt_io0all'));
  const isFlutedAcrylic = p.slug === 'fluted-acrylic-luxe'  || (p.heroImage && p.heroImage.includes('fluted_acrylic_gmwqr4'));
  const isPVCLuxe = p.slug === 'pvc-luxe-collection'        || (p.heroImage && p.heroImage.includes('pvc_1_qoe62b'));
  const isWPCLuxe = p.slug === 'wpc-luxe-collection'        || (p.heroImage && p.heroImage.includes('wpc_irucfj'));
  const isCharcoalLuxe1 = p.slug === 'charcoal-panels-luxe-1' || (p.heroImage && p.heroImage.includes('additional_img_dgrs53'));

  // Hero image sources with true 4K resolution support (Widescreen 95% cover + Original fallback)
  const hero4kSrc = useMemo(() => {
    if (isAcrylicLuxe)   return '/images/materials/acrylic_4k_widescreen.webp';
    if (isPolyGranite)   return '/images/materials/polygranite_4k_widescreen.webp';
    if (isCharcoalLuxe)  return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/charcoal_qpelt9.png';
    if (isFlutedPVC)     return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_fluted_1_o1ixyc.png';
    if (isLVTFlooring)   return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196087/lvt_io0all.png';
    if (isFlutedAcrylic) return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/fluted_acrylic_gmwqr4.png';
    if (isPVCLuxe)       return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_1_qoe62b.png';
    if (isWPCLuxe)       return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791195586/wpc_irucfj.png';
    if (isCharcoalLuxe1) return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791205613/additional_img_dgrs53.png';
    return p.heroImage;
  }, [isAcrylicLuxe, isPolyGranite, isCharcoalLuxe, isFlutedPVC, isLVTFlooring, isFlutedAcrylic, isPVCLuxe, isWPCLuxe, isCharcoalLuxe1, p.heroImage]);

  const heroFallbackPng = useMemo(() => {
    if (isAcrylicLuxe)   return 'https://res.cloudinary.com/or5e9kak/image/upload/c_pad,w_3840,h_2160,b_gen_fill/v1791196089/acrylic_idoycj.png';
    if (isPolyGranite)   return 'https://res.cloudinary.com/or5e9kak/image/upload/c_pad,w_3840,h_2160,b_gen_fill/v1791196088/polygranite_ujh0zb.png';
    if (isCharcoalLuxe)  return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/charcoal_qpelt9.png';
    if (isFlutedPVC)     return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_fluted_1_o1ixyc.png';
    if (isLVTFlooring)   return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196087/lvt_io0all.png';
    if (isFlutedAcrylic) return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/fluted_acrylic_gmwqr4.png';
    if (isPVCLuxe)       return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_1_qoe62b.png';
    if (isWPCLuxe)       return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791195586/wpc_irucfj.png';
    if (isCharcoalLuxe1) return 'https://res.cloudinary.com/or5e9kak/image/upload/v1791205613/additional_img_dgrs53.png';
    return p.heroImage;
  }, [isAcrylicLuxe, isPolyGranite, isCharcoalLuxe, isFlutedPVC, isLVTFlooring, isFlutedAcrylic, isPVCLuxe, isWPCLuxe, isCharcoalLuxe1, p.heroImage]);

  return (
    <div className="bg-cream min-h-screen pb-24">
      <SEO title={`${p.title} — Material Details`} description={p.description ? p.description.substring(0, 150) : 'Material details...'} image={p.heroImage} url={`/materials/${p.slug}`} />
      {/* ── 1. MATERIAL HERO: Floating Luxury Rounded Card (95% Screen Width, Edge-to-Edge 4K Cover) ── */}
      <section className="pt-20 sm:pt-24 px-2 sm:px-4 lg:px-[2.5%] w-full max-w-[1720px] mx-auto">
        <div 
          className="relative w-full h-[80vh] sm:h-[84vh] lg:h-[88vh] min-h-[520px] max-h-[860px] rounded-2xl md:rounded-3xl lg:rounded-[32px] overflow-hidden shadow-2xl bg-[#0f0e0d] isolate flex items-center justify-center mx-auto"
        >

          {/* Foreground Ultra-Sharp Widescreen True Cover Image (Fast Responsive WebP) */}
          <picture className="w-full h-full flex items-center justify-center relative z-0">
            {isAcrylicLuxe && (
              <source
                type="image/webp"
                srcSet="/images/materials/acrylic_widescreen_1080.webp 1080w, /images/materials/acrylic_widescreen_1920.webp 1920w, /images/materials/acrylic_4k_widescreen.webp 3840w"
                sizes="(max-width: 768px) 100vw, 95vw"
              />
            )}
            {isPolyGranite && (
              <source
                type="image/webp"
                srcSet="/images/materials/polygranite_widescreen_1080.webp 1080w, /images/materials/polygranite_widescreen_1920.webp 1920w, /images/materials/polygranite_4k_widescreen.webp 3840w"
                sizes="(max-width: 768px) 100vw, 95vw"
              />
            )}
            {isCharcoalLuxe && (
              <>
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791201655/charcoal_mobile_tfqigr.png" />
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/charcoal_qpelt9.png" />
              </>
            )}
            {isFlutedPVC && (
              <>
                {/* Mobile: portrait PVC image */}
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791204063/pvc_fluted_mobile_2_ztnaxo.png" />
                {/* Desktop: landscape PVC room scene */}
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_fluted_1_o1ixyc.png" />
              </>
            )}
            {isLVTFlooring && (
              <>
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791204062/lvt_mobile_2_x6sjxm.png" />
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791196087/lvt_io0all.png" />
              </>
            )}
            {isFlutedAcrylic && (
              <>
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791201656/fluted_acrylic_mobile_kdiumo.png" />
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791196089/fluted_acrylic_gmwqr4.png" />
              </>
            )}
            {isPVCLuxe && (
              <>
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791204063/pvc_mobile_2_hy18uu.png" />
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791196088/pvc_1_qoe62b.png" />
              </>
            )}
            {isWPCLuxe && (
              <>
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791201655/wpc_mobile_vjdcta.png" />
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791195586/wpc_irucfj.png" />
              </>
            )}
            {isCharcoalLuxe1 && (
              <>
                <source media="(max-width: 767px)" srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791205613/additional_mobi_kmjh3g.png" />
                <source media="(min-width: 768px)"  srcSet="https://res.cloudinary.com/or5e9kak/image/upload/v1791205613/additional_img_dgrs53.png" />
              </>
            )}
            <img
              src={hero4kSrc}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              alt={p.title}
              onError={(e) => {
                if (e.target.src !== heroFallbackPng) {
                  e.target.src = heroFallbackPng;
                }
              }}
              style={{
                imageRendering: 'auto',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              className="w-full h-full object-cover object-center select-none will-change-transform"
            />
          </picture>

          {/* Top Ambient Vignette for Back Button contrast without dimming top swatch */}
          <div className="absolute inset-x-0 top-0 h-24 sm:h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-10" />

          {/* Bottom Ambient Vignette focused only at the lower edge behind title */}
          <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 md:h-44 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none z-10" />

          {/* Back button */}
          <div className="absolute top-0 left-0 z-20 p-5 sm:p-6 md:p-8">
            <Link 
              to="/materials" 
              className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-cream hover:text-gold font-bold transition-colors bg-black/50 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 shadow-md"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </Link>
          </div>

          {/* Material Details Bottom Left Header */}
          <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 left-0 w-full z-20 px-5 sm:px-8 md:px-12 pointer-events-none">
            <div className="flex flex-col space-y-1 sm:space-y-1.5 md:space-y-2 max-w-xl md:max-w-2xl text-left">
              <span className="font-sans text-[11px] sm:text-xs md:text-sm uppercase tracking-widest text-gold font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                {p.badge || (p.category ? p.category.replace(/_/g, ' ').toUpperCase() : 'PREMIUM MATERIAL')}
              </span>
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-editorial font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                {p.title}
              </h1>
              {p.materialCode && (
                <p className="font-sans text-xs sm:text-sm text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] flex items-center gap-1.5 pt-0.5">
                  <span className="text-gold font-semibold">Code:</span>
                  <span>{p.materialCode}</span>
                </p>
              )}
            </div>
          </div>

          <ScrollDownIndicator className="hidden sm:flex scale-85 sm:scale-100 bottom-3.5 sm:bottom-4 md:bottom-5 z-20" />
        </div>
      </section>
      {(p.showOverviewSection !== false || p.showFinishesSection !== false || p.showSpecificationsSection !== false || p.showApplicationsSection !== false) && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-12 md:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Overview + Features + Applications */}
          <div className="space-y-6">
            {p.showOverviewSection !== false && (
              <>
                <h2 className="font-editorial text-3xl font-bold text-charcoal">{p.overviewSectionTitle || 'Material Overview'}</h2>
                <p className="font-sans text-sm text-walnut leading-relaxed">{p.description}</p>

                {/* Feature Tags */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">{p.featuresSectionTitle || 'Key Features'}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {safeFeatures.map((feat, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-sans text-walnut">
                        <CheckCircle size={14} className="text-gold shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Applications */}
            {p.showApplicationsSection !== false && safeApplications.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">{p.applicationsSectionTitle || 'Applications'}</h3>
                <div className="flex flex-wrap gap-2.5">
                  {safeApplications.map((app, idx) => (
                    <span key={idx} className="bg-offwhite border border-walnut/15 text-charcoal font-sans text-xs px-3.5 py-1.5 rounded-full font-medium">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Color Swatches + Specifications */}
          <div className="space-y-6">
            {p.showFinishesSection !== false && safeColors.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">{p.finishesSectionTitle || 'Available Finishes'}</h3>
                <div className="flex flex-wrap gap-4">
                  {safeColors.map((color, idx) => (
                    <button key={idx} onClick={() => setActiveColor(idx)}
                      className={`flex flex-col items-center space-y-2 group transition-all duration-200 ${activeColor === idx ? 'scale-105' : ''}`}>
                      <div
                        className={`w-12 h-12 rounded-full border-2 shadow-sm transition-all ${activeColor === idx ? 'border-gold scale-110 shadow-md' : 'border-walnut/20 group-hover:border-walnut/50'}`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-sans text-[9px] text-walnut uppercase tracking-wide text-center max-w-[60px]">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Table */}
            {p.showSpecificationsSection !== false && safeSpecifications.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">{p.specificationsSectionTitle || 'Technical Specifications'}</h3>
                <div className="border border-walnut/10 rounded-card overflow-hidden">
                  {safeSpecifications.map((spec, idx) => (
                    <div key={idx} className={`flex items-center px-5 py-3.5 text-xs font-sans ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-cream'}`}>
                      <span className="text-walnut font-medium w-1/2">{spec.label}</span>
                      <span className="text-charcoal font-bold w-1/2">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CATALOGUE PREVIEW GATE ──────────────────────────────────────────── */}
      {p.showCataloguePreviewSection !== false && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 pt-10 md:pt-12 pb-16 md:pb-20 border-t border-walnut/15">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">{p.catalogueEyebrow || 'Catalog & Shades'}</span>
              <h2 className="font-editorial text-3xl font-bold text-charcoal">{p.catalogueTitle || 'Catalogue Preview'}</h2>
            </div>
            <span className="bg-charcoal text-cream font-sans text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full">
              {finalUnlocked.length} Unlocked / {p.totalShades || (finalUnlocked.length + finalLocked.length)} Total Shades
            </span>
          </div>

          <div className="relative overflow-hidden rounded-card border border-walnut/10 bg-offwhite shadow-sm">
          {/* Grid of pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 p-6">
            {allPages.map((item, idx) => {
              const pageImg = item.pageImg || item;
              const pageUrl = typeof pageImg === 'string' ? pageImg : (pageImg.url || pageImg.src || pageImg);
              const isLocked = item.isLocked;
              const pageNum = item.originalIdx + 1;
              const responsiveClass = item.hideOnMobile ? 'hidden sm:block' : '';

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isLocked) {
                      window.dispatchEvent(new CustomEvent('open-quote-modal', {
                        detail: {
                          mode: 'catalogue',
                          title: 'To Unlock More Catalogs, Fill the Details',
                          productName: p.title
                        }
                      }));
                    } else {
                      const unlockedIndex = unlockedPages.findIndex(up => up.originalIdx === item.originalIdx);
                      setLightboxIdx(unlockedIndex >= 0 ? unlockedIndex : 0);
                      setLightboxOpen(true);
                    }
                  }}
                  className={`relative rounded-card overflow-hidden aspect-[3/4] border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${responsiveClass} ${
                    isLocked 
                      ? 'border-walnut/10 select-none bg-stone-950/20' 
                      : 'border-walnut/10 hover:border-gold/60'
                  }`}
                >
                  <img
                    src={pageUrl}
                    alt={`Catalogue Page ${pageNum}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isLocked ? 'blur-lg scale-110 opacity-40' : ''
                    }`}
                  />

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-11 h-11 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-lg backdrop-blur-md">
                        <Lock size={20} />
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Locked</span>
                    </div>
                  )}

                  {/* Page Badge */}
                  <div className={`absolute bottom-0 left-0 right-0 py-1.5 text-center font-sans text-[10px] uppercase tracking-widest font-bold ${
                    isLocked ? 'bg-black/70 text-gold/80' : 'bg-cream/90 text-charcoal'
                  }`}>
                    Page {pageNum} {isLocked ? '(Locked)' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Lightbox for Unlocked Catalogue Preview */}
      {lightboxOpen && unlockedImageUrls.length > 0 && (
        <div className="fixed inset-0 bg-charcoal/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev > 0 ? prev - 1 : unlockedImageUrls.length - 1));
            }}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white transition-all cursor-pointer z-10"
            title="Previous page"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="max-h-[85vh] max-w-[90vw] flex flex-col items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
            <img
              src={unlockedImageUrls[lightboxIdx]}
              alt={`Page ${lightboxIdx + 1} Preview`}
              className="max-h-[75vh] max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="flex items-center gap-4 text-cream font-sans text-xs">
              <span className="font-bold text-gold uppercase tracking-wider">{p.title}</span>
              <span className="text-white/40">•</span>
              <span className="uppercase tracking-widest text-white/70">
                Page {lightboxIdx + 1} of {unlockedImageUrls.length} (Unlocked Preview)
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((prev) => (prev < unlockedImageUrls.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white transition-all cursor-pointer z-10"
            title="Next page"
          >
            <ChevronRightIcon size={28} />
          </button>

          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-gold hover:text-charcoal text-white flex items-center justify-center text-lg font-bold transition-all cursor-pointer z-10"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
