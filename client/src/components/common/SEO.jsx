// ── SEO Helmet Helper ──────────────────────────────────────────────────────────
// Usage: <SEO title="..." description="..." keywords="..." schema={...} />
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image = 'https://www.theespacio.in/espacio-profile-dp.png',
  url,
  type = 'website',
  schema,
  preloadImage
}) => {
  const suffix = 'Espacio | Interior Design Hyderabad (@theespacio.in)';
  const fullTitle = title
    ? (title.includes('Espacio') ? title : `${title} — ${suffix}`)
    : 'Espacio | Interior Design Hyderabad (@theespacio.in)';
  const metaDesc = description || "A sacred corner, designed with intention. ✨ Thoughtful details. Timeless design. 9505151116 | Espacio Interiors & Modular #EspacioInteriors #InteriorDesignHyderabad";
  const canonical = url ? `https://www.theespacio.in${url.startsWith('/') ? url : `/${url}`}` : 'https://www.theespacio.in';
  const metaKeywords = keywords || "interior design hyderabad, luxury interior designers, turnkey home interiors, modular kitchens hyderabad, WPC wall panels, fluted panels, luxury home fitouts, ESPACIO interiors";

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    '@id': 'https://www.theespacio.in/#organization',
    name: 'Espacio | Interior Design Hyderabad',
    url: 'https://www.theespacio.in',
    logo: 'https://www.theespacio.in/espacio-profile-dp.png',
    image: image || 'https://www.theespacio.in/espacio-profile-dp.png',
    description: metaDesc,
    telephone: '+91 95051 51116',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Moinabad Road, Aziz Nagar',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500075',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.3375,
      longitude: 78.3340
    },
    areaServed: [
      { '@type': 'City', name: 'Hyderabad' },
      { '@type': 'AdministrativeArea', name: 'Jubilee Hills' },
      { '@type': 'AdministrativeArea', name: 'Banjara Hills' },
      { '@type': 'AdministrativeArea', name: 'Hitec City' },
      { '@type': 'AdministrativeArea', name: 'Gachibowli' },
      { '@type': 'AdministrativeArea', name: 'Kokapet' },
      { '@type': 'AdministrativeArea', name: 'Financial District' },
      { '@type': 'AdministrativeArea', name: 'Madhapur' },
      { '@type': 'AdministrativeArea', name: 'Kondapur' },
      { '@type': 'AdministrativeArea', name: 'Tellapur' },
      { '@type': 'AdministrativeArea', name: 'Gandipet' },
      { '@type': 'AdministrativeArea', name: 'Aziz Nagar' },
      { '@type': 'AdministrativeArea', name: 'Moinabad' }
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00'
    },
    sameAs: [
      'https://www.instagram.com/theespacio.in',
      'https://www.facebook.com/share/1DkG2m4Ra7/',
      'https://youtube.com/@theespacio?si=GMm6fUQ8t0W6MfRL',
      'https://maps.app.goo.gl/q3zbxWmEt5wvRKbZ6'
    ]
  };

  // Generate BreadcrumbList schema for nested routes
  const breadcrumbSchema = React.useMemo(() => {
    if (!url || url === '/' || url === '') return null;
    const segments = url.split('/').filter(Boolean);
    if (segments.length === 0) return null;

    const items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.theespacio.in/'
      }
    ];

    let currentPath = '';
    segments.forEach((seg, index) => {
      currentPath += `/${seg}`;
      const formattedName = seg
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      items.push({
        '@type': 'ListItem',
        position: index + 2,
        name: formattedName,
        item: `https://www.theespacio.in${currentPath}`
      });
    });

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    };
  }, [url]);

  const jsonLdSchema = schema || defaultSchema;

  React.useEffect(() => {
    document.title = fullTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaDesc);
    }
  }, [fullTitle, metaDesc]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchPriority="high" />
      )}

      {/* High GEO Local Targeting Meta Tags */}
      <meta name="geo.region" content="IN-TG" />
      <meta name="geo.placename" content="Hyderabad" />
      <meta name="geo.position" content="17.3375;78.3340" />
      <meta name="ICBM" content="17.3375, 78.3340" />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Espacio | Interior Design Hyderabad (@theespacio.in)" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data Schema */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdSchema)}
      </script>

      {/* JSON-LD Breadcrumb Schema for Inner Pages */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
