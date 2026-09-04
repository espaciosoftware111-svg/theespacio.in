import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowUpRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const QuoteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalMode, setModalMode] = useState('estimate'); // 'estimate' or 'catalogue'
  const [modalTitle, setModalTitle] = useState('Get Free Estimate');
  const [productContext, setProductContext] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone1: '',
    phone2: '',
    email: '',
    location: '',
  });

  useEffect(() => {
    // Check if user already dismissed or submitted in this session
    const isDismissed = sessionStorage.getItem('quote_modal_dismissed');
    
    // Set 1-minute timer (60,000 ms = 60 seconds)
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setSubmitted(false);
        setErrorMsg('');
        setFormData({
          name: '',
          phone1: '',
          phone2: '',
          email: '',
          location: '',
        });
        setIsOpen(true);
      }
    }, 60000);

    // Custom event listener so any button on the site can trigger the popup
    const handleCustomOpen = (e) => {
      const detail = e?.detail;
      setSubmitted(false);
      setErrorMsg('');
      setFormData({
        name: '',
        phone1: '',
        phone2: '',
        email: '',
        location: '',
      });
      if (detail && detail.mode === 'catalogue') {
        setModalMode('catalogue');
        setModalTitle(detail.title || 'To Unlock More Catalogs, Fill the Details');
        setProductContext(detail.productName || null);
      } else if (detail && detail.mode === 'projects') {
        setModalMode('projects');
        setModalTitle(detail.title || 'Fill Details to Get More Projects');
        setProductContext(detail.context || null);
      } else {
        setModalMode('estimate');
        setModalTitle('Get Free Estimate');
        setProductContext(null);
      }
      setIsOpen(true);
    };
    window.addEventListener('open-quote-modal', handleCustomOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('open-quote-modal', handleCustomOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('quote_modal_dismissed', 'true');
    setSubmitted(false);
    setErrorMsg('');
    setFormData({
      name: '',
      phone1: '',
      phone2: '',
      email: '',
      location: '',
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Validate phone1 format (must be 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone1.trim().replace(/\s+/g, ''))) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate phone2 format if provided
    if (formData.phone2?.trim()) {
      if (!phoneRegex.test(formData.phone2.trim().replace(/\s+/g, ''))) {
        setErrorMsg('Please enter a valid 10-digit secondary mobile number.');
        return;
      }
    }

    setLoading(true);

    try {
      const isCatalogue = modalMode === 'catalogue';
      const isProjects = modalMode === 'projects';
      const type = isProjects ? 'PROJECTS_UNLOCK' : (isCatalogue ? 'CATALOGUE_REQUEST' : 'FREE_ESTIMATE');
      const source = isProjects ? 'LOAD_MORE_PROJECTS' : (isCatalogue ? 'CATALOGUE_REQUEST' : 'GET_FREE_ESTIMATE');
      const prefix = isProjects ? 'ESP-PR' : (isCatalogue ? 'ESP-CR' : 'ESP-FE');
      
      // Save structured enquiry into local CMS store for real-time admin sync
      try {
        const { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } = await import('../../utils/cmsStore');
        const existing = getCMSData(STORAGE_KEYS.ENQUIRIES) || [];
        const count = existing.length + 1;
        const enquiryId = `${prefix}-${String(count).padStart(5, '0')}`;
        
        const newRecord = {
          id: enquiryId,
          enquiryId,
          type,
          source,
          name: formData.name,
          email: formData.email,
          phone: formData.phone1,
          phone2: formData.phone2 || '',
          location: formData.location || '',
          catalogueMaterial: isCatalogue ? (productContext || '') : '',
          status: 'NEW',
          read: false,
          submittedAt: new Date().toISOString(),
          notes: [],
          followUp: null
        };
        
        setCMSData(STORAGE_KEYS.ENQUIRIES, [newRecord, ...existing]);
        notifyCMSUpdate();
      } catch (cmsErr) {
        console.warn('CMS store error:', cmsErr);
      }

      // Perform backend call to sync to Google Sheets
      const cleanPhone1 = (formData.phone1 || '').trim().replace(/\s+/g, '');
      const cleanPhone2 = (formData.phone2 || '').trim().replace(/\s+/g, '');
      const formattedPhone = cleanPhone2 ? `${cleanPhone1} / ${cleanPhone2}` : cleanPhone1;
      const quoteSource = isProjects
        ? 'Projects Section (Get More Projects)'
        : (isCatalogue ? `Catalogue Request (${productContext || 'Materials'})` : 'Free Estimate Request');

      const leadPayload = {
        name: (formData.name || '').trim(),
        email: (formData.email || '').trim(),
        phone: formattedPhone,
        phone1: cleanPhone1,
        phone2: cleanPhone2,
        location: (formData.location || '').trim() || 'Hyderabad',
        projectType: isProjects ? 'Projects Portfolio Unlock' : (isCatalogue ? 'Catalogue Request' : 'Free Estimate Request'),
        catalogueMaterial: isCatalogue ? productContext : undefined,
        message: isProjects
          ? `Client requested to load more projects. Location: ${formData.location || 'Hyderabad'}`
          : (isCatalogue 
            ? `Catalogue Material: ${productContext || 'N/A'}. Location: ${formData.location || 'Hyderabad'}` 
            : `Location: ${formData.location || 'Hyderabad'}. Secondary Phone: ${cleanPhone2 || 'None'}`),
        googleSheetData: {
          name: (formData.name || '').trim(),
          phone: cleanPhone1,
          phone1: cleanPhone1,
          phone2: cleanPhone2,
          email: (formData.email || '').trim(),
          location: (formData.location || '').trim() || 'Hyderabad',
          requirement: isCatalogue ? (productContext || 'Materials') : (isProjects ? 'Architecture & Projects' : 'Free Estimate'),
          stage: 'Immediate (0-1 Month)',
          materialDetails: isCatalogue ? (productContext || '-') : '-',
          source: quoteSource,
          notes: `Lead captured via Quote Modal. Location: ${formData.location || 'Hyderabad'}. Secondary Phone: ${cleanPhone2 || 'None'}`
        }
      };

      let backendSynced = false;
      try {
        await axios.post('/api/leads', leadPayload);
        backendSynced = true;
      } catch (backendErr) {
        try {
          await axios.post('/leads', leadPayload);
          backendSynced = true;
        } catch (err2) {
          console.warn('Backend leads API notice:', err2.message);
        }
      }

      // Direct Webhook Fallback if backend was unreachable
      const directWebhook = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL;
      if (!backendSynced && directWebhook && directWebhook.startsWith('http')) {
        try {
          await fetch(directWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              source: quoteSource,
              name: (formData.name || '').trim(),
              phone1: cleanPhone1,
              phone2: cleanPhone2,
              email: (formData.email || '').trim(),
              location: (formData.location || '').trim() || 'Hyderabad',
              requirement: isCatalogue ? (productContext || 'Materials') : (isProjects ? 'Architecture & Projects' : 'Free Estimate'),
              stage: 'Immediate (0-1 Month)',
              materialDetails: isCatalogue ? (productContext || '-') : '-',
              notes: `Lead captured via Quote Modal. Location: ${formData.location || 'Hyderabad'}. Secondary Phone: ${cleanPhone2 || 'None'}`,
              status: 'NEW'
            })
          });
        } catch {}
      }

      // Dispatch unlock event for any listening project views
      window.dispatchEvent(new CustomEvent('projects-unlocked', { detail: { name: formData.name } }));

      setSubmitted(true);
      sessionStorage.setItem('quote_modal_dismissed', 'true');
    } catch (err) {
      console.error('Lead submission error:', err);
      const errMsg = err.response?.data?.message || "We're unable to submit your request at the moment. Please try again in a few minutes.";
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 text-ink/60 hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {!submitted ? (
              <>
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-ink tracking-tight uppercase border-b border-ink-border/60 pb-3 leading-snug">
                    {modalTitle}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-ink-soft mt-3 leading-relaxed">
                    {modalMode === 'catalogue'
                      ? 'Please fill out the details below to unlock more premium design pages instantly.'
                      : modalMode === 'projects'
                      ? 'Please fill out your details below to unlock our exclusive architectural projects and receive our private lookbook portfolio.'
                      : 'Please fill out the enquiry below and we will get back to you as soon as possible.'
                    }
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      required
                      value={formData.name}
                      onChange={handleChange}
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
                      name="phone1"
                      placeholder="Contact Number 1"
                      required
                      value={formData.phone1}
                      onChange={handleChange}
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
                      value={formData.phone2}
                      onChange={handleChange}
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
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                    />
                  </div>

                  {/* Project Location */}
                  <div>
                    <input
                      type="text"
                      name="location"
                      placeholder="Project Location (e.g. Jubilee Hills, Gachibowli)"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-ink-border bg-bg/40 text-ink text-sm font-sans focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-ink-muted"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-500 font-sans">{errorMsg}</p>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gold text-ink font-sans font-bold text-sm uppercase tracking-wider hover:bg-ink hover:text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>{modalMode === 'projects' ? 'Submit & Unlock Projects' : (modalMode === 'catalogue' ? 'Unlock Catalogs' : 'Submit')}</span>
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
                  {modalMode === 'catalogue' 
                    ? 'Catalogue Request Received!' 
                    : modalMode === 'projects'
                    ? 'Portfolio Access Unlocked!'
                    : 'Estimate Request Received!'}
                </h3>
                <p className="font-sans text-sm text-ink-soft max-w-[380px] mx-auto leading-relaxed">
                  {modalMode === 'catalogue' 
                    ? <>Thank you, <strong>{formData.name || 'valued client'}</strong>. You will receive an SMS and email with details to access our full catalog library shortly.</>
                    : modalMode === 'projects'
                    ? <>Thank you, <strong>{formData.name || 'valued client'}</strong>! Our senior design consultancy team has unlocked our private portfolio and will also share our high-res project lookbooks and floor plans with you via WhatsApp.</>
                    : <>Thank you, <strong>{formData.name || 'valued client'}</strong>. Your estimate request has been logged. Our principal design team will share your personalized estimate range on a quick call, since actual site conditions affect final BOQ significantly.</>
                  }
                </p>
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-full bg-gold text-ink font-sans font-bold text-xs uppercase tracking-wider hover:bg-ink hover:text-white transition-all mt-4"
                >
                  Close Window
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
