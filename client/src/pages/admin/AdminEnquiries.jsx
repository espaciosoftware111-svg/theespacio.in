import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, Filter, Eye, CheckCircle, Clock, XCircle, AlertCircle, Mail, Phone, 
  MapPin, Download, MessageSquare, Calendar, ChevronRight, ChevronLeft, X, User, Layers, FileText, 
  Sparkles, Package, ArrowUpRight, CheckCircle2, UserCheck, PhoneCall, RefreshCw, Send, Calculator
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } from '../../utils/cmsStore';
import { db, collection, getDocs, updateDoc, doc, query, orderBy } from '../../lib/firebaseClient';

// Status Configuration — Clean high-contrast luxury styling matching ESPACIO aesthetic
const statusConfig = {
  NEW: { label: 'NEW', color: 'text-[#967332]', bg: 'bg-gold/15 border-gold/40', icon: AlertCircle },
  CONTACTED: { label: 'CONTACTED', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: PhoneCall },
  IN_PROGRESS: { label: 'IN PROGRESS', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Clock },
  FOLLOW_UP: { label: 'FOLLOW UP', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Calendar },
  CONVERTED: { label: 'CONVERTED', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
  CLOSED: { label: 'CLOSED', color: 'text-stone-600', bg: 'bg-stone-100 border-stone-300', icon: CheckCircle2 },
  CANCELLED: { label: 'CANCELLED', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: XCircle }
};

// Main Type Badges
const typeConfig = {
  INSTANT_ESTIMATE: { label: 'INSTANT PROJECT ESTIMATE', color: 'text-cyan-800', bg: 'bg-cyan-50 border-cyan-200', prefix: 'ESP-EST' },
  FREE_ESTIMATE: { label: 'FREE ESTIMATE', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200', prefix: 'ESP-FE' },
  CATALOGUE_REQUEST: { label: 'CATALOGUE REQUEST', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200', prefix: 'ESP-CR' },
  DESIGN_ENQUIRY: { label: 'DESIGN ENQUIRY', color: 'text-[#967332]', bg: 'bg-gold/15 border-gold/40', prefix: 'ESP-DE' },
  INDIVIDUAL_ENQUIRY: { label: 'INDIVIDUAL', color: 'text-purple-800', bg: 'bg-purple-50 border-purple-200', prefix: 'ESP-IN' }
};

// Initial Seed Dataset
const seedEnquiries = [
  {
    id: 'ESP-EST-00001',
    enquiryId: 'ESP-EST-00001',
    type: 'INSTANT_ESTIMATE',
    source: 'INSTANT_PROJECT_ESTIMATE',
    requirementType: 'INSTANT_ESTIMATE',
    name: 'Vikram Rao',
    email: 'vikram.rao@gmail.com',
    phone: '+91 98490 12345',
    location: 'Property: 3 BHK',
    propertyType: '3 BHK',
    scopeOfWork: 'Turnkey Full Home',
    finishGrade: 'Premium',
    status: 'NEW',
    read: false,
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
    notesText: 'Instant Project Estimate Submission — Property: 3 BHK, Scope: Turnkey Full Home, Grade: Premium',
    notes: [{ id: 'n-est-1', text: 'Captured via Instant Project Estimate calculator on Services page.', createdAt: new Date(Date.now() - 1800000).toISOString() }],
    followUp: null
  },
  {
    id: 'ESP-DE-00001',
    enquiryId: 'ESP-DE-00001',
    type: 'DESIGN_ENQUIRY',
    source: 'LET_S_DESIGN_SOMETHING_REMARKABLE',
    requirementType: 'TURNKEY_INTERIORS',
    name: 'Rahul Varma',
    email: 'rahul.v@gmail.com',
    phone: '+91 98765 43210',
    location: 'Banjara Hills, Hyderabad',
    propertyType: '3BHK Villa',
    spaces: 'Living Room, Master Bedroom, Modular Kitchen',
    size: '2800 sq ft',
    stage: 'Possession in 1 month',
    status: 'NEW',
    read: false,
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    notesText: 'Looking for full turnkey interior design and execution with Italian marble & veneer finishes.',
    notes: [{ id: 'n1', text: 'Initial lead captured via design wizard.', createdAt: new Date(Date.now() - 3600000).toISOString() }],
    followUp: null
  },
  {
    id: 'ESP-FE-00001',
    enquiryId: 'ESP-FE-00001',
    type: 'FREE_ESTIMATE',
    source: 'GET_FREE_ESTIMATE',
    name: 'Priya Sharma',
    email: 'priya.sharma@techcorp.in',
    phone: '+91 91234 56789',
    phone2: '+91 91234 00000',
    location: 'Jubilee Hills, Hyderabad',
    status: 'CONTACTED',
    read: true,
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    notesText: 'Requested a free estimate for a 4BHK duplex apartment in Jubilee Hills.',
    notes: [{ id: 'n2', text: 'Sent initial BOQ estimate template on WhatsApp.', createdAt: new Date(Date.now() - 40000000).toISOString() }],
    followUp: { date: '2026-08-20', time: '11:00', note: 'Call to review BOQ line items' }
  },
  {
    id: 'ESP-CR-00001',
    enquiryId: 'ESP-CR-00001',
    type: 'CATALOGUE_REQUEST',
    source: 'CATALOGUE_REQUEST',
    name: 'Sanjay Mehta',
    email: 'sanjay.m@business.com',
    phone: '+91 98888 77777',
    location: 'Gachibowli, Hyderabad',
    catalogueMaterial: 'WPC Louvers & Acrylic Fluted Panels',
    status: 'IN_PROGRESS',
    read: true,
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    notesText: 'Downloaded material catalog for WPC panels & Charcoal sheets.',
    notes: [],
    followUp: null
  },
  {
    id: 'ESP-IN-00001',
    enquiryId: 'ESP-IN-00001',
    type: 'INDIVIDUAL_ENQUIRY',
    source: 'INDIVIDUAL',
    name: 'Kavitha Rao',
    email: 'kavitha.rao@gmail.com',
    phone: '+91 97000 11223',
    location: 'Kondapur, Hyderabad',
    individualRequirement: 'Island Modular Kitchen with acrylic gloss finish and Blum soft-close hardware.',
    status: 'NEW',
    read: false,
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    notesText: 'Only interested in Modular Kitchen design and installation.',
    notes: [],
    followUp: null
  },
  {
    id: 'ESP-DE-00002',
    enquiryId: 'ESP-DE-00002',
    type: 'DESIGN_ENQUIRY',
    source: 'LET_S_DESIGN_SOMETHING_REMARKABLE',
    requirementType: 'MATERIALS',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@realestate.in',
    phone: '+91 95555 44433',
    location: 'Financial District, Nanakramguda',
    materialCategories: 'Polygranite Sheets, WPC Panels, Louvers',
    quantity: '50 Sheets',
    status: 'FOLLOW_UP',
    read: true,
    submittedAt: new Date(Date.now() - 345600000).toISOString(),
    notesText: 'Commercial builder sourcing materials directly for luxury apartment lobby.',
    notes: [{ id: 'n3', text: 'Quoted bulk discount rate for 50 polygranite sheets.', createdAt: new Date(Date.now() - 200000000).toISOString() }],
    followUp: { date: '2026-08-22', time: '15:30', note: 'Site visit for sample handover' }
  }
];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'OVERVIEW' | 'ALL' | 'FREE_ESTIMATE' | 'CATALOGUE_REQUEST' | 'DESIGN_ENQUIRY' | 'INDIVIDUAL_ENQUIRY'
  const [designSubFilter, setDesignSubFilter] = useState('ALL'); // 'ALL' | 'TURNKEY_INTERIORS' | 'DESIGN_ONLY' | 'RENOVATION' | 'MATERIALS' | 'SOMETHING_ELSE'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('ALL'); // 'ALL' | 'YYYY-MM-DD' | 'CUSTOM_RANGE'
  const [customRange, setCustomRange] = useState({ start: '', end: '', label: '' });
  const [tempCustomRange, setTempCustomRange] = useState({ start: '', end: '' });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const pillsRef = useRef(null);

  // Generate past 21 days for the date selector pills
  const pastDays = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const isoDate = `${year}-${month}-${day}`;
      const dayName = i === 0 ? 'TODAY' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const dateFormatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      days.push({
        isoDate,
        dayName,
        dateFormatted,
        isToday: i === 0,
        fullDate: d
      });
    }
    return days;
  }, []);

  const scrollPills = (direction) => {
    if (pillsRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      pillsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getLocalDateString = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');
  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');

  // ── Load & Normalize Enquiries Data ──────────────────────────────────────
  const loadData = async () => {
    try {
      let stored = getCMSData(STORAGE_KEYS.ENQUIRIES);
      if (!Array.isArray(stored) || stored.length === 0) {
        stored = seedEnquiries;
        setCMSData(STORAGE_KEYS.ENQUIRIES, seedEnquiries);
      }

      // Perform strict migration & cleanup:
      // 1. Convert any legacy requirementType === 'INDIVIDUAL' inside DESIGN_ENQUIRY to type: 'INDIVIDUAL_ENQUIRY'
      // 2. Filter out any legacy CONTACT_ENQUIRY entries
      const cleaned = stored
        .filter(item => item.type !== 'CONTACT_ENQUIRY' && item.source !== 'CONTACT_US')
        .map(item => {
          if (item.type === 'DESIGN_ENQUIRY' && item.requirementType === 'INDIVIDUAL') {
            return {
              ...item,
              type: 'INDIVIDUAL_ENQUIRY',
              source: 'INDIVIDUAL',
              enquiryId: item.enquiryId ? item.enquiryId.replace('ESP-DE', 'ESP-IN') : `ESP-IN-${Math.floor(10000 + Math.random() * 90000)}`,
              requirementType: undefined
            };
          }
          return item;
        });

      // Fetch server-side leads from PostgreSQL database to ensure multi-device sync
      try {
        const token = localStorage.getItem('espacio_token') || localStorage.getItem('supabase_auth_token') || localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('/api/leads', { headers, timeout: 4000 });
        const backendList = res.data?.data || res.data || [];
        if (Array.isArray(backendList) && backendList.length > 0) {
          const existingIds = new Set(cleaned.map(e => e.enquiryId || e.id));
          backendList.forEach(lead => {
            const id = lead.leadId || lead.id || `lead_${lead.created_at || lead.createdAt}`;
            if (!existingIds.has(id)) {
              existingIds.add(id);
              const pType = (lead.projectType || lead.serviceType || '').toUpperCase();
              let type = 'DESIGN_ENQUIRY';
              if (pType.includes('INSTANT')) type = 'INSTANT_ESTIMATE';
              else if (pType.includes('FREE') || pType.includes('ESTIMATE')) type = 'FREE_ESTIMATE';
              else if (pType.includes('CATALOGUE') || pType.includes('MATERIAL')) type = 'CATALOGUE_REQUEST';
              else if (pType.includes('INDIVIDUAL')) type = 'INDIVIDUAL_ENQUIRY';

              cleaned.unshift({
                id,
                enquiryId: id,
                type,
                source: lead.source || lead.projectType || 'WEBSITE',
                name: lead.name || 'Anonymous Client',
                email: lead.email || '',
                phone: lead.phone || lead.phone1 || '',
                location: lead.location || 'Hyderabad',
                status: (lead.status || 'NEW').toUpperCase(),
                read: lead.read || false,
                submittedAt: lead.created_at || lead.createdAt || new Date().toISOString(),
                notesText: lead.message || '',
                notes: []
              });
            }
          });
        }
      } catch (backendErr) {
        // Non-blocking fallback if backend is unreachable or unauthorized
      }

      setEnquiries(cleaned);
      setCMSData(STORAGE_KEYS.ENQUIRIES, cleaned);
    } catch (err) {
      console.error('Error loading enquiries:', err);
      setEnquiries(seedEnquiries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('espacio_cms_update', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('espacio_cms_update', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // ── Mark as Read when selected ───────────────────────────────────────────
  const handleSelectEnquiry = (item) => {
    setSelectedEnquiry(item);
    if (!item.read) {
      const updated = enquiries.map(e => e.id === item.id || e.enquiryId === item.enquiryId ? { ...e, read: true } : e);
      setEnquiries(updated);
      setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
      notifyCMSUpdate();
    }
  };

  // ── Update Status ────────────────────────────────────────────────────────
  const handleUpdateStatus = async (id, newStatus) => {
    const updated = enquiries.map(e => (e.id === id || e.enquiryId === id) ? { ...e, status: newStatus } : e);
    setEnquiries(updated);
    setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
    notifyCMSUpdate();
    if (selectedEnquiry && (selectedEnquiry.id === id || selectedEnquiry.enquiryId === id)) {
      setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
    }
    try {
      const { logAuditEvent } = await import('../../utils/auditStore');
      await logAuditEvent('Updated Enquiry Status', 'Enquiries', `Changed status of enquiry ${id} for ${selectedEnquiry?.name || 'Client'} to ${newStatus}`);
    } catch {}
  };

  // ── Add Internal Note ───────────────────────────────────────────────────
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedEnquiry) return;
    const noteObj = {
      id: `note_${Date.now()}`,
      text: newNoteText.trim(),
      createdAt: new Date().toISOString()
    };
    const updatedNotes = [...(selectedEnquiry.notes || []), noteObj];
    const updated = enquiries.map(item => 
      (item.id === selectedEnquiry.id || item.enquiryId === selectedEnquiry.enquiryId) 
        ? { ...item, notes: updatedNotes } 
        : item
    );
    setEnquiries(updated);
    setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
    notifyCMSUpdate();
    setSelectedEnquiry(prev => ({ ...prev, notes: updatedNotes }));
    setNewNoteText('');
  };

  // ── Set Follow-Up Reminder ────────────────────────────────────────────────
  const handleSaveFollowUp = (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    const followUpObj = {
      date: followUpDate,
      time: followUpTime,
      note: followUpNote
    };
    const updated = enquiries.map(item => 
      (item.id === selectedEnquiry.id || item.enquiryId === selectedEnquiry.enquiryId) 
        ? { ...item, followUp: followUpObj, status: item.status === 'NEW' ? 'FOLLOW_UP' : item.status } 
        : item
    );
    setEnquiries(updated);
    setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
    notifyCMSUpdate();
    setSelectedEnquiry(prev => ({ ...prev, followUp: followUpObj }));
  };

  // ── Date-Filtered Enquiries (used for metric counters & tabs) ───────────
  const dateFilteredEnquiries = enquiries.filter(item => {
    if (!item.submittedAt) return true;
    const itemDateStr = getLocalDateString(item.submittedAt);
    if (selectedDate !== 'ALL' && selectedDate !== 'CUSTOM_RANGE') {
      if (itemDateStr !== selectedDate) return false;
    }
    if (selectedDate === 'CUSTOM_RANGE') {
      if (customRange.start && itemDateStr < customRange.start) return false;
      if (customRange.end && itemDateStr > customRange.end) return false;
    }
    return true;
  });

  // ── Filtered Records Calculation (List View) ─────────────────────────────
  const filteredEnquiries = dateFilteredEnquiries.filter(item => {
    // 1. Tab Filter
    if (activeTab === 'FREE_ESTIMATE' && item.type !== 'FREE_ESTIMATE') return false;
    if (activeTab === 'INSTANT_ESTIMATE' && item.type !== 'INSTANT_ESTIMATE') return false;
    if (activeTab === 'CATALOGUE_REQUEST' && item.type !== 'CATALOGUE_REQUEST') return false;
    if (activeTab === 'DESIGN_ENQUIRY' && item.type !== 'DESIGN_ENQUIRY') return false;
    if (activeTab === 'INDIVIDUAL_ENQUIRY' && item.type !== 'INDIVIDUAL_ENQUIRY') return false;

    // 2. Design Sub-filter (only applies inside DESIGN_ENQUIRY)
    if (activeTab === 'DESIGN_ENQUIRY' && designSubFilter !== 'ALL') {
      if (item.requirementType !== designSubFilter) return false;
    }

    // 3. Status Filter
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

    // 4. Multi-field Search Filter (Phone numbers, Names, IDs, Locations, Scope, etc.)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const cleanDigits = q.replace(/\D/g, '');
      const rawPhone = item.phone || '';
      const cleanPhoneDigits = rawPhone.replace(/\D/g, '');

      // Matches phone if raw string matches OR if sanitized digits match (handles spaces, dashes, +91)
      const matchPhone = rawPhone.toLowerCase().includes(q) || (cleanDigits.length >= 3 && cleanPhoneDigits.includes(cleanDigits));
      const matchName = item.name?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchId = (item.enquiryId || item.id)?.toLowerCase().includes(q) || (cleanDigits.length > 0 && (item.enquiryId || item.id)?.replace(/\D/g, '').includes(cleanDigits));
      const matchType = (item.type || '').toLowerCase().replace(/_/g, ' ').includes(q);
      const matchReq = (item.requirementType || '').toLowerCase().replace(/_/g, ' ').includes(q);
      const matchProperty = (item.propertyType || '').toLowerCase().includes(q);
      const matchScope = (item.scopeOfWork || '').toLowerCase().includes(q);
      const matchCatalogue = (item.catalogueMaterial || '').toLowerCase().includes(q);
      const matchIndividual = (item.individualRequirement || '').toLowerCase().includes(q);
      const matchNotes = item.notesText?.toLowerCase().includes(q) || item.notes?.some(n => n.text?.toLowerCase().includes(q));

      if (!matchName && !matchEmail && !matchPhone && !matchLoc && !matchId && !matchType && !matchReq && !matchProperty && !matchScope && !matchCatalogue && !matchIndividual && !matchNotes) {
        return false;
      }
    }

    return true;
  });

  // ── Stats Overview Calculations ───────────────────────────────────────────
  const stats = {
    total: dateFilteredEnquiries.length,
    allTimeTotal: enquiries.length,
    freeEstimates: dateFilteredEnquiries.filter(e => e.type === 'FREE_ESTIMATE').length,
    instantEstimates: dateFilteredEnquiries.filter(e => e.type === 'INSTANT_ESTIMATE').length,
    catalogues: dateFilteredEnquiries.filter(e => e.type === 'CATALOGUE_REQUEST').length,
    designEnquiries: dateFilteredEnquiries.filter(e => e.type === 'DESIGN_ENQUIRY').length,
    individualEnquiries: dateFilteredEnquiries.filter(e => e.type === 'INDIVIDUAL_ENQUIRY').length,
    newCount: dateFilteredEnquiries.filter(e => e.status === 'NEW').length,
    unreadCount: dateFilteredEnquiries.filter(e => e.read === false).length,
    // Design Breakdown
    designTurnkey: dateFilteredEnquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'TURNKEY_INTERIORS').length,
    designOnly: dateFilteredEnquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'DESIGN_ONLY').length,
    designRenovation: dateFilteredEnquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'RENOVATION').length,
    designMaterials: dateFilteredEnquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'MATERIALS').length,
    designSomethingElse: dateFilteredEnquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'SOMETHING_ELSE').length
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const dataToExport = filteredEnquiries.length > 0 ? filteredEnquiries : enquiries;
    const headers = ['Enquiry ID', 'Type', 'Source', 'Requirement Type', 'Customer Name', 'Phone', 'Email', 'Location', 'Status', 'Read', 'Submitted At', 'Notes / Details'];
    const rows = dataToExport.map(item => [
      `"${item.enquiryId || item.id}"`,
      `"${item.type}"`,
      `"${item.source || ''}"`,
      `"${item.requirementType || 'N/A'}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.location || '').replace(/"/g, '""')}"`,
      `"${item.status || 'NEW'}"`,
      `"${item.read ? 'READ' : 'UNREAD'}"`,
      `"${item.submittedAt ? new Date(item.submittedAt).toLocaleString('en-IN') : 'N/A'}"`,
      `"${(item.notesText || item.individualRequirement || item.catalogueMaterial || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ESPACIO_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none">
      {/* ─── Top Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-stone-900 flex items-center gap-3">
            <span>Enquiries & Leads CMS</span>
            {stats.unreadCount > 0 && (
              <span className="font-sans text-xs bg-gold text-charcoal px-2.5 py-0.5 rounded-full font-bold uppercase shadow-sm">
                {stats.unreadCount} New Unread
              </span>
            )}
          </h1>
          <p className="font-sans text-xs text-stone-500 uppercase tracking-widest mt-1">
            Real-time client consultation requests & lead management console
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 bg-white hover:bg-stone-50 text-stone-700 px-4 py-2.5 rounded-xl border border-stone-200/90 font-sans text-xs font-bold shadow-sm transition-all"
            title="Refresh list"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Top Metric Overview Cards (Click to Toggle Category Filter) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <div 
          onClick={() => {
            setActiveTab('ALL');
            setDesignSubFilter('ALL');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
            activeTab === 'ALL' ? 'bg-gold/15 border-gold ring-1 ring-gold shadow-md' : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow'
          }`}
          title="Filter to All Enquiries"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest">Total Enquiries</span>
            <Layers size={14} className="text-gold" />
          </div>
          <p className="font-editorial text-2xl font-bold text-stone-900 mt-2">{stats.total}</p>
        </div>

        <div 
          onClick={() => {
            setActiveTab(prev => prev === 'INSTANT_ESTIMATE' ? 'ALL' : 'INSTANT_ESTIMATE');
            setDesignSubFilter('ALL');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
            activeTab === 'INSTANT_ESTIMATE' ? 'bg-cyan-50 border-cyan-400 ring-1 ring-cyan-400 shadow-md' : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow'
          }`}
          title="Filter to Instant Estimates"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest">Instant Estimates</span>
            <Calculator size={14} className="text-cyan-600" />
          </div>
          <p className="font-editorial text-2xl font-bold text-cyan-800 mt-2">{stats.instantEstimates}</p>
        </div>

        <div 
          onClick={() => {
            setActiveTab(prev => prev === 'FREE_ESTIMATE' ? 'ALL' : 'FREE_ESTIMATE');
            setDesignSubFilter('ALL');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
            activeTab === 'FREE_ESTIMATE' ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400 shadow-md' : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow'
          }`}
          title="Filter to Free Estimates"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest">Free Estimates</span>
            <FileText size={14} className="text-amber-600" />
          </div>
          <p className="font-editorial text-2xl font-bold text-amber-800 mt-2">{stats.freeEstimates}</p>
        </div>

        <div 
          onClick={() => {
            setActiveTab(prev => prev === 'CATALOGUE_REQUEST' ? 'ALL' : 'CATALOGUE_REQUEST');
            setDesignSubFilter('ALL');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
            activeTab === 'CATALOGUE_REQUEST' ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-400 shadow-md' : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow'
          }`}
          title="Filter to Catalogue Requests"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest">Catalogue Requests</span>
            <Package size={14} className="text-emerald-600" />
          </div>
          <p className="font-editorial text-2xl font-bold text-emerald-800 mt-2">{stats.catalogues}</p>
        </div>

        <div 
          onClick={() => {
            setActiveTab(prev => prev === 'DESIGN_ENQUIRY' ? 'ALL' : 'DESIGN_ENQUIRY');
            setDesignSubFilter('ALL');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
            activeTab === 'DESIGN_ENQUIRY' ? 'bg-gold/15 border-gold ring-1 ring-gold shadow-md' : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow'
          }`}
          title="Filter to Design Enquiries"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest">Design Enquiries</span>
            <Sparkles size={14} className="text-gold" />
          </div>
          <p className="font-editorial text-2xl font-bold text-[#967332] mt-2">{stats.designEnquiries}</p>
        </div>

        <div 
          onClick={() => {
            setActiveTab(prev => prev === 'INDIVIDUAL_ENQUIRY' ? 'ALL' : 'INDIVIDUAL_ENQUIRY');
            setDesignSubFilter('ALL');
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
            activeTab === 'INDIVIDUAL_ENQUIRY' ? 'bg-purple-50 border-purple-400 ring-1 ring-purple-400 shadow-md' : 'bg-white border-stone-200/90 hover:border-stone-300 hover:shadow'
          }`}
          title="Filter to Individual Enquiries"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest">Individual</span>
            <User size={14} className="text-purple-600" />
          </div>
          <p className="font-editorial text-2xl font-bold text-purple-800 mt-2">{stats.individualEnquiries}</p>
        </div>
      </div>

      {/* ─── UNIFIED FILTER CONSOLE (ALL FILTERS IN ONE SEAMLESS SECTION) ─── */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        {/* Row 1: SELECT DATE Header & Range Trigger */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2 text-stone-800">
            <Calendar size={16} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-widest font-bold text-stone-800">SELECT DATE</span>
          </div>

          <div className="flex items-center space-x-2">
            {selectedDate !== 'ALL' && (
              <button
                onClick={() => {
                  setSelectedDate('ALL');
                  setCustomRange({ start: '', end: '', label: '' });
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-[11px] font-sans transition-colors"
                title="Reset to All Dates"
              >
                <X size={12} />
                <span>Reset Date</span>
              </button>
            )}

            <button
              onClick={() => {
                setTempCustomRange({
                  start: customRange.start || getLocalDateString(new Date()),
                  end: customRange.end || getLocalDateString(new Date())
                });
                setIsCalendarOpen(true);
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold transition-all shadow-xs ${
                selectedDate === 'CUSTOM_RANGE'
                  ? 'bg-gold text-charcoal border-gold shadow-sm'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-gold/40'
              }`}
            >
              <Calendar size={13} />
              <span>{selectedDate === 'CUSTOM_RANGE' && customRange.label ? customRange.label : 'Calendar Range'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Horizontal Sliding Date Pills */}
        <div className="relative flex items-center group">
          {/* Left Arrow Scroll */}
          <button
            onClick={() => scrollPills('left')}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 mr-2 shrink-0 transition-colors border border-stone-200"
            aria-label="Scroll dates left"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Date Pills Carousel */}
          <div
            ref={pillsRef}
            className="flex items-center space-x-2.5 overflow-x-auto scrollbar-none py-1.5 px-0.5 scroll-smooth w-full"
          >
            {/* ALL Dates Pill */}
            <button
              onClick={() => {
                setSelectedDate('ALL');
                setCustomRange({ start: '', end: '', label: '' });
              }}
              className={`flex flex-col items-center justify-center min-w-[78px] h-[54px] px-3 rounded-xl border transition-all shrink-0 select-none ${
                selectedDate === 'ALL'
                  ? 'bg-charcoal text-white border-charcoal shadow-sm font-bold ring-1 ring-gold/40'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span className={`text-[10px] font-sans uppercase font-bold tracking-wider ${
                selectedDate === 'ALL' ? 'text-gold' : 'text-stone-400'
              }`}>
                ALL
              </span>
              <span className="text-xs font-sans font-bold mt-0.5">Dates</span>
            </button>

            {/* Individual Day Pills */}
            {pastDays.map((day) => {
              const isSelected = selectedDate === day.isoDate;
              return (
                <button
                  key={day.isoDate}
                  onClick={() => {
                    setSelectedDate(day.isoDate);
                    setCustomRange({ start: '', end: '', label: '' });
                  }}
                  className={`flex flex-col items-center justify-center min-w-[82px] h-[54px] px-3 rounded-xl border transition-all shrink-0 select-none ${
                    isSelected
                      ? 'bg-gold text-charcoal border-gold shadow-md font-bold ring-2 ring-gold/40'
                      : day.isToday
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 border-stone-200'
                  }`}
                >
                  <span className={`text-[10px] font-sans uppercase font-bold tracking-wider ${
                    isSelected
                      ? 'text-charcoal'
                      : day.isToday
                      ? 'text-emerald-700'
                      : 'text-stone-400'
                  }`}>
                    {day.dayName}
                  </span>
                  <span className="text-xs font-sans font-bold mt-0.5 whitespace-nowrap">
                    {day.dateFormatted}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Arrow Scroll */}
          <button
            onClick={() => scrollPills('right')}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 ml-2 shrink-0 transition-colors border border-stone-200"
            aria-label="Scroll dates right"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Row 3: Category / Service Filter Pills (Unified In Section) */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-stone-500">
              SERVICE / CATEGORY:
            </span>
            {activeTab !== 'ALL' && (
              <button
                onClick={() => { setActiveTab('ALL'); setDesignSubFilter('ALL'); }}
                className="text-[11px] font-sans text-stone-500 hover:text-gold transition-colors underline"
              >
                Reset Category
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
            {[
              { key: 'ALL', label: 'All Enquiries', count: stats.total },
              { key: 'DESIGN_ENQUIRY', label: 'Design Enquiries', count: stats.designEnquiries },
              { key: 'FREE_ESTIMATE', label: 'Free Estimates', count: stats.freeEstimates },
              { key: 'CATALOGUE_REQUEST', label: 'Catalogue Requests', count: stats.catalogues },
              { key: 'INSTANT_ESTIMATE', label: 'Instant Estimates', count: stats.instantEstimates },
              { key: 'INDIVIDUAL_ENQUIRY', label: 'Individual', count: stats.individualEnquiries }
            ].map(cat => {
              const isSelected = activeTab === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveTab(cat.key);
                    setDesignSubFilter('ALL');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold transition-all whitespace-nowrap shadow-xs flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-charcoal text-white border border-charcoal ring-1 ring-gold/40'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected ? 'bg-gold text-charcoal font-bold' : 'bg-stone-200/80 text-stone-600'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Design Sub-Filter Pills (Shown when DESIGN_ENQUIRY is selected) */}
          {activeTab === 'DESIGN_ENQUIRY' && (
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pt-1">
              <span className="font-sans text-[10px] text-[#967332] font-bold uppercase tracking-wider shrink-0 mr-1">
                Design Scope:
              </span>
              {[
                { key: 'ALL', label: 'All Sub-types', count: stats.designEnquiries },
                { key: 'TURNKEY_INTERIORS', label: 'Turnkey', count: stats.designTurnkey },
                { key: 'DESIGN_ONLY', label: 'Design Only', count: stats.designOnly },
                { key: 'RENOVATION', label: 'Renovation', count: stats.designRenovation },
                { key: 'MATERIALS', label: 'Materials', count: stats.designMaterials },
                { key: 'SOMETHING_ELSE', label: 'Custom', count: stats.designSomethingElse }
              ].map(sub => (
                <button
                  key={sub.key}
                  onClick={() => setDesignSubFilter(sub.key)}
                  className={`px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                    designSubFilter === sub.key
                      ? 'bg-gold/20 text-[#967332] border border-gold/50 font-bold shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {sub.label} ({sub.count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Row 4: Phone / Multi-field Search & Status Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-2 border-t border-stone-100">
          {/* Multi-field Search Box */}
          <div className="relative w-full lg:w-96">
            <input
              type="text"
              placeholder="Search by phone number, customer name, enquiry ID, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-8 py-2.5 font-sans text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-gold focus:bg-white transition-colors"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1 w-full lg:w-auto">
            <span className="font-sans text-[10px] uppercase font-bold text-stone-400 mr-1 shrink-0">STATUS:</span>
            {[
              { key: 'ALL', label: 'All' },
              { key: 'NEW', label: 'New' },
              { key: 'CONTACTED', label: 'Contacted' },
              { key: 'IN_PROGRESS', label: 'In Progress' },
              { key: 'FOLLOW_UP', label: 'Follow Up' },
              { key: 'CONVERTED', label: 'Converted' },
              { key: 'CLOSED', label: 'Closed' },
              { key: 'CANCELLED', label: 'Cancelled' }
            ].map((st) => {
              const isSel = statusFilter === st.key;
              return (
                <button
                  key={st.key}
                  onClick={() => setStatusFilter(st.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all whitespace-nowrap ${
                    isSel
                      ? 'bg-charcoal text-white border border-charcoal shadow-sm ring-1 ring-gold/40'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 5: Summary & Active Filter Tags */}
        <div className="flex flex-wrap items-center justify-between text-xs font-sans text-stone-500 pt-2 border-t border-stone-100 gap-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span>
              Showing <strong className="text-stone-900 font-bold">{filteredEnquiries.length}</strong> {filteredEnquiries.length === 1 ? 'enquiry' : 'enquiries'}
            </span>

            {/* Active Date Tag */}
            {selectedDate !== 'ALL' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gold/15 text-[#967332] font-semibold text-[11px] border border-gold/30">
                Date: {selectedDate === 'CUSTOM_RANGE'
                  ? customRange.label || `${customRange.start} - ${customRange.end}`
                  : (pastDays.find(d => d.isoDate === selectedDate)?.dateFormatted || selectedDate)}
              </span>
            )}

            {/* Active Category Tag */}
            {activeTab !== 'ALL' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-semibold text-[11px] border border-stone-200">
                Category: {activeTab.replace('_', ' ')}
                {designSubFilter !== 'ALL' && ` • ${designSubFilter.replace('_', ' ')}`}
              </span>
            )}

            {/* Active Status Tag */}
            {statusFilter !== 'ALL' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-semibold text-[11px] border border-stone-200">
                Status: {statusFilter.replace('_', ' ')}
              </span>
            )}

            {/* Active Search Term */}
            {search.trim() && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold text-[11px] border border-blue-200">
                Search: "{search.trim()}"
              </span>
            )}
          </div>

          {(selectedDate !== 'ALL' || activeTab !== 'ALL' || designSubFilter !== 'ALL' || statusFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setSelectedDate('ALL');
                setCustomRange({ start: '', end: '', label: '' });
                setActiveTab('ALL');
                setDesignSubFilter('ALL');
                setStatusFilter('ALL');
                setSearch('');
              }}
              className="text-[11px] text-stone-500 hover:text-gold transition-colors underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* ─── Custom Date Range Modal / Popover ─── */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 text-stone-900">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-gold" />
                <h3 className="font-editorial text-lg font-bold text-stone-900">Select Date Range</h3>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">Quick Presets</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Today', days: 0 },
                  { label: 'Yesterday', days: 1 },
                  { label: 'Last 7 Days', days: 6 },
                  { label: 'Last 14 Days', days: 13 },
                  { label: 'Last 30 Days', days: 29 },
                  { label: 'All Dates', all: true }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      if (preset.all) {
                        setSelectedDate('ALL');
                        setCustomRange({ start: '', end: '', label: '' });
                        setIsCalendarOpen(false);
                      } else {
                        const now = new Date();
                        const end = getLocalDateString(now);
                        const s = new Date(now);
                        s.setDate(s.getDate() - preset.days);
                        const start = getLocalDateString(s);
                        const label = preset.label;
                        setCustomRange({ start, end, label });
                        setSelectedDate('CUSTOM_RANGE');
                        setIsCalendarOpen(false);
                      }
                    }}
                    className="p-2 rounded-xl bg-stone-50 hover:bg-gold/15 hover:text-charcoal border border-stone-200 hover:border-gold/40 text-xs font-sans font-semibold text-stone-700 transition-all text-center"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range Inputs */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-500">Or Custom Date Range</span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-sans text-stone-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={tempCustomRange.start}
                    onChange={(e) => setTempCustomRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-gold font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans text-stone-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={tempCustomRange.end}
                    onChange={(e) => setTempCustomRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-gold font-sans"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  setSelectedDate('ALL');
                  setCustomRange({ start: '', end: '', label: '' });
                  setIsCalendarOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-sans font-bold transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  if (tempCustomRange.start && tempCustomRange.end) {
                    const startFormatted = new Date(tempCustomRange.start).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    const endFormatted = new Date(tempCustomRange.end).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                    setCustomRange({
                      start: tempCustomRange.start,
                      end: tempCustomRange.end,
                      label: `${startFormatted} - ${endFormatted}`
                    });
                    setSelectedDate('CUSTOM_RANGE');
                  }
                  setIsCalendarOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content Grid: Left List (2 Cols) & Right Detail Drawer (1 Col) ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Enquiries List */}
        <div className="xl:col-span-2 space-y-3">
          {loading ? (
            <div className="bg-white p-12 rounded-xl text-center border border-stone-200 shadow-sm">
              <RefreshCw size={24} className="animate-spin text-gold mx-auto mb-3" />
              <p className="font-sans text-xs text-stone-500">Loading database records...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-xl text-center border border-stone-200 shadow-sm space-y-3">
              <AlertCircle size={32} className="text-stone-300 mx-auto" />
              <p className="font-sans text-xs text-stone-500">No matching enquiry records found.</p>
            </div>
          ) : (
            filteredEnquiries.map((item) => {
              const isSelected = selectedEnquiry && (selectedEnquiry.id === item.id || selectedEnquiry.enquiryId === item.enquiryId);
              const tc = typeConfig[item.type] || typeConfig.DESIGN_ENQUIRY;
              const sc = statusConfig[item.status] || statusConfig.NEW;

              return (
                <div
                  key={item.enquiryId || item.id}
                  onClick={() => handleSelectEnquiry(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs ${
                    isSelected
                      ? 'bg-[#FDFBF7] border-gold ring-1 ring-gold shadow-md'
                      : item.read === false
                      ? 'bg-white border-gold/60 shadow-sm hover:border-gold hover:shadow'
                      : 'bg-white border-stone-200 shadow-sm hover:border-stone-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 truncate">
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-editorial text-sm font-bold text-[#967332] shrink-0">
                      {(item.name || 'C').charAt(0).toUpperCase()}
                    </div>

                    <div className="truncate space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-mono text-[10px] text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded font-bold">
                          {item.enquiryId || item.id}
                        </span>
                        <h3 className="font-sans text-sm font-bold text-stone-900 truncate">{item.name}</h3>
                        {item.read === false && (
                          <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" title="Unread Enquiry" />
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-wrap text-[11px] text-stone-500">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${tc.bg} ${tc.color}`}>
                          {tc.label}
                        </span>
                        {item.type === 'DESIGN_ENQUIRY' && item.requirementType && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                            {item.requirementType.replace('_', ' ')}
                          </span>
                        )}
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-stone-100">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>

                    <span className="font-sans text-[11px] text-stone-500 whitespace-nowrap">
                      {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Enquiry Detail Drawer */}
        <div className="bg-white border border-stone-200 shadow-sm rounded-xl p-5 space-y-6 text-stone-900">
          {selectedEnquiry ? (
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="border-b border-stone-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#967332] font-bold bg-gold/15 border border-gold/30 px-2.5 py-1 rounded">
                    {selectedEnquiry.enquiryId || selectedEnquiry.id}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${statusConfig[selectedEnquiry.status]?.bg || 'bg-gold/15'} ${statusConfig[selectedEnquiry.status]?.color || 'text-[#967332]'}`}>
                    {selectedEnquiry.status}
                  </span>
                </div>
                <h2 className="font-editorial text-2xl font-bold text-stone-900">{selectedEnquiry.name}</h2>
                <p className="font-sans text-xs text-stone-500 flex items-center gap-2">
                  <Clock size={13} />
                  <span>Submitted: {selectedEnquiry.submittedAt ? new Date(selectedEnquiry.submittedAt).toLocaleString('en-IN') : 'Recently'}</span>
                </p>
              </div>

              {/* Status Manager Dropdown */}
              <div className="space-y-2">
                <label className="font-sans text-[10px] text-stone-500 uppercase font-bold tracking-widest block">Update Status</label>
                <select
                  value={selectedEnquiry.status || 'NEW'}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry.id || selectedEnquiry.enquiryId, e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 text-stone-900 rounded-xl px-3 py-2.5 font-sans text-xs font-bold uppercase focus:outline-none focus:border-gold"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="FOLLOW_UP">FOLLOW UP</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Quick Action Contact Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${(selectedEnquiry.phone || '').replace(/\s+/g, '')}`}
                  className="flex flex-col items-center justify-center p-3 bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 rounded-xl transition-all shadow-xs"
                >
                  <Phone size={16} className="mb-1 text-emerald-600" />
                  <span className="font-sans text-[10px] font-bold uppercase">Call</span>
                </a>
                <a
                  href={(() => {
                    const phone = (selectedEnquiry.phone || '').replace(/\D/g, '');
                    let msg = `Hello ${selectedEnquiry.name || 'Client'},\n\nThank you for reaching out to ESPACIO Interiors & Modular regarding your enquiry (${selectedEnquiry.enquiryId || selectedEnquiry.id}).\n\n`;
                    if (selectedEnquiry.type === 'INSTANT_ESTIMATE') {
                      msg += `We received your Instant Project Estimate request for a ${selectedEnquiry.propertyType || 'Property'} (${selectedEnquiry.scopeOfWork || 'Interiors'}). We would love to share your personalized estimate details.`;
                    } else if (selectedEnquiry.type === 'FREE_ESTIMATE') {
                      msg += `We received your request for a Free Estimate at ${selectedEnquiry.location || 'your location'}. We would love to discuss your BOQ and design requirements.`;
                    } else if (selectedEnquiry.type === 'CATALOGUE_REQUEST') {
                      msg += `We received your request for our Material & Product Catalogues (${selectedEnquiry.catalogueMaterial || 'Product Catalogue'}).`;
                    } else if (selectedEnquiry.type === 'DESIGN_ENQUIRY') {
                      msg += `We received your Design Enquiry for ${selectedEnquiry.requirementType ? selectedEnquiry.requirementType.replace('_', ' ') : 'Interiors'} (${selectedEnquiry.propertyType || 'Property'}).`;
                    } else if (selectedEnquiry.type === 'INDIVIDUAL_ENQUIRY') {
                      msg += `We received your enquiry for Individual Service (${selectedEnquiry.individualRequirement || 'Custom requirement'}).`;
                    } else {
                      msg += `We received your consultation enquiry and would like to assist you further.`;
                    }
                    msg += `\n\nWhen would be a good time for a quick call or studio visit?`;
                    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-300 rounded-xl transition-all shadow-xs"
                >
                  <MessageSquare size={16} className="mb-1 text-emerald-600" />
                  <span className="font-sans text-[10px] font-bold uppercase">WhatsApp</span>
                </a>
                <a
                  href={(() => {
                    const subject = `ESPACIO Interiors & Modular — Response to Enquiry ${selectedEnquiry.enquiryId || selectedEnquiry.id}`;
                    let body = `Dear ${selectedEnquiry.name || 'Client'},\n\nThank you for reaching out to ESPACIO Interiors & Modular.\n\n`;
                    if (selectedEnquiry.type === 'INSTANT_ESTIMATE') {
                      body += `We received your Instant Project Estimate request for a ${selectedEnquiry.propertyType || 'Property'} (${selectedEnquiry.scopeOfWork || 'Interiors'}).\n\nOur principal design team is preparing your personalized estimate details.`;
                    } else if (selectedEnquiry.type === 'FREE_ESTIMATE') {
                      body += `We received your request for a Free Estimate at ${selectedEnquiry.location || 'your location'}.\n\nOur design team is preparing your initial consultation details.`;
                    } else if (selectedEnquiry.type === 'CATALOGUE_REQUEST') {
                      body += `We received your request for our material & product catalogues (${selectedEnquiry.catalogueMaterial || 'Product Catalogue'}).`;
                    } else if (selectedEnquiry.type === 'DESIGN_ENQUIRY') {
                      body += `We received your Design Enquiry for ${selectedEnquiry.requirementType ? selectedEnquiry.requirementType.replace('_', ' ') : 'Interiors'} (${selectedEnquiry.propertyType || 'Property'}).`;
                    } else if (selectedEnquiry.type === 'INDIVIDUAL_ENQUIRY') {
                      body += `We received your request for Individual Service (${selectedEnquiry.individualRequirement || 'Custom requirement'}).`;
                    } else {
                      body += `We received your consultation enquiry and would like to assist you further.`;
                    }
                    body += `\n\nPlease let us know your convenient time for a detailed discussion or studio visit.\n\nBest regards,\nESPACIO Interiors & Modular Team\n+91 95051 51116`;
                    return `mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  })()}
                  className="flex flex-col items-center justify-center p-3 bg-stone-50 hover:bg-gold/15 text-stone-700 hover:text-[#967332] border border-stone-200 hover:border-gold/40 rounded-xl transition-all shadow-xs"
                >
                  <Mail size={16} className="mb-1 text-gold" />
                  <span className="font-sans text-[10px] font-bold uppercase">Email</span>
                </a>
              </div>

              {/* Structured Submission Details */}
              <div className="space-y-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-sans text-xs font-bold text-[#967332] uppercase tracking-wider border-b border-stone-200 pb-2">
                  Submission Details
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Contact Info</span>
                    <span className="text-stone-900 font-bold block">{selectedEnquiry.phone}</span>
                    <span className="text-stone-600 block">{selectedEnquiry.email}</span>
                  </div>

                  <div>
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">Project Location</span>
                    <span className="text-stone-800">{selectedEnquiry.location || 'Not specified'}</span>
                  </div>

                  {selectedEnquiry.type === 'DESIGN_ENQUIRY' && (
                    <>
                      <div>
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Requirement Type</span>
                        <span className="text-[#967332] font-bold uppercase">{selectedEnquiry.requirementType?.replace('_', ' ')}</span>
                      </div>
                      {selectedEnquiry.propertyType && (
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Property Type</span>
                          <span className="text-stone-800">{selectedEnquiry.propertyType}</span>
                        </div>
                      )}
                      {selectedEnquiry.spaces && (
                        <div>
                          <span className="text-stone-500 block text-[10px] uppercase font-bold">Spaces to Design</span>
                          <span className="text-stone-800">{selectedEnquiry.spaces}</span>
                        </div>
                      )}
                    </>
                  )}

                  {selectedEnquiry.type === 'INDIVIDUAL_ENQUIRY' && (
                    <div>
                      <span className="text-purple-700 block text-[10px] uppercase font-bold">Individual Service Details</span>
                      <p className="text-purple-950 leading-relaxed bg-purple-50 p-3 rounded-lg border border-purple-200 mt-1">
                        {selectedEnquiry.individualRequirement || selectedEnquiry.notesText || 'Individual service request'}
                      </p>
                    </div>
                  )}

                  {selectedEnquiry.type === 'INSTANT_ESTIMATE' && (
                    <div className="space-y-2 bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                      <span className="text-cyan-700 block text-[10px] uppercase font-bold">Instant Project Estimate Details</span>
                      {selectedEnquiry.propertyType && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">1. Property Type:</span>
                          <span className="text-stone-900 font-bold">{selectedEnquiry.propertyType}</span>
                        </div>
                      )}
                      {selectedEnquiry.scopeOfWork && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">2. Scope of Work:</span>
                          <span className="text-[#967332] font-bold">{selectedEnquiry.scopeOfWork}</span>
                        </div>
                      )}
                      {selectedEnquiry.finishGrade && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-stone-500">Finish Tier:</span>
                          <span className="text-cyan-800 capitalize font-semibold">{selectedEnquiry.finishGrade}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedEnquiry.type === 'CATALOGUE_REQUEST' && (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                      <span className="text-emerald-700 block text-[10px] uppercase font-bold">Catalogue Requested</span>
                      <span className="text-emerald-950 font-bold">{selectedEnquiry.catalogueMaterial || 'General Product Catalogue'}</span>
                    </div>
                  )}

                  {selectedEnquiry.notesText && selectedEnquiry.type !== 'INDIVIDUAL_ENQUIRY' && (
                    <div>
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">Notes / Requirements</span>
                      <p className="text-stone-800 bg-white p-3 rounded-lg border border-stone-200 mt-1 leading-relaxed">
                        {selectedEnquiry.notesText}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Private Admin Notes */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <h4 className="font-sans text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Internal Admin Notes</span>
                  <span className="text-[10px] text-stone-400">Private</span>
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                    selectedEnquiry.notes.map((n, nIdx) => (
                      <div key={n.id || nIdx} className="bg-white p-2.5 rounded-lg border border-stone-200 font-sans text-xs">
                        <p className="text-stone-800">{n.text}</p>
                        <span className="text-[9px] text-stone-400 block mt-1">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : ''}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="font-sans text-[11px] text-stone-400 italic">No notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add private note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 font-sans text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="bg-gold hover:bg-gold-hover text-charcoal px-4 py-2 rounded-lg font-sans text-xs font-bold uppercase shrink-0 shadow-xs transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Eye size={32} className="text-stone-300 mx-auto" />
              <p className="font-sans text-xs text-stone-400">Select an enquiry row on the left to view complete submission details, notes, and actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
