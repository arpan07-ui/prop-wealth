import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Tag,
  CheckCircle2,
  XCircle,
  Copy,
  Calendar,
  Loader2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { supabase } from '../../lib/supabaseClient';
import { FALLBACK_OFFERS, FALLBACK_FIRMS, withTimeout } from '../../lib/fallbackData';
import {
  VerifiedPartnerDeal,
  getStoredPartnerDeals,
  saveStoredPartnerDeals,
  resetStoredPartnerDeals,
  DEFAULT_PARTNER_DEALS
} from '../../lib/partnerDealsData';

interface Offer {
  id: string;
  firm_id: string;
  title: string;
  code: string | null;
  discount: string | null;
  expiry_date: string | null;
  verified: boolean;
  status: string;
  firms?: { name: string };
}

interface Firm {
  id: string;
  name: string;
  website?: string | null;
  affiliate_link?: string | null;
  logo_url?: string | null;
  trading_type?: string | null;
}

const AdminOffersPage: React.FC = () => {
  const { showModal } = useModal();
  const [activeTab, setActiveTab] = useState<'partner-discounts' | 'general-offers'>('partner-discounts');

  // ─────────────────────────────────────────────────────────────
  // PARTNER DISCOUNTS STATE
  // ─────────────────────────────────────────────────────────────
  const [partnerDeals, setPartnerDeals] = useState<VerifiedPartnerDeal[]>(() =>
    getStoredPartnerDeals(FALLBACK_FIRMS)
  );
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerCategory, setPartnerCategory] = useState<'All' | 'Forex' | 'Futures' | 'Crypto'>('All');
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedPartnerDeal, setSelectedPartnerDeal] = useState<VerifiedPartnerDeal | null>(null);

  // ─────────────────────────────────────────────────────────────
  // GENERAL OFFERS STATE
  // ─────────────────────────────────────────────────────────────
  const [offers, setOffers] = useState<Offer[]>(FALLBACK_OFFERS as any);
  const [firms, setFirms] = useState<Firm[]>(FALLBACK_FIRMS as any);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch Database Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const offersPromise = supabase
          .from('offers')
          .select('*, firms(name)')
          .order('created_at', { ascending: false });

        const res = await withTimeout(offersPromise, 2500, { data: null, error: null });
        if (res?.data && res.data.length > 0) {
          setOffers(res.data);
        }

        const firmsPromise = supabase
          .from('firms')
          .select('id, name, website, affiliate_link, logo_url, trading_type')
          .eq('status', 'active')
          .order('name');

        const firmsRes = await withTimeout(firmsPromise, 2500, { data: null, error: null });
        if (firmsRes?.data && firmsRes.data.length > 0) {
          setFirms(firmsRes.data);
          // Sync stored partner deals with live firms
          setPartnerDeals(getStoredPartnerDeals(firmsRes.data));
        } else {
          setPartnerDeals(getStoredPartnerDeals(FALLBACK_FIRMS));
        }
      } catch (error) {
        console.warn('Using resilient offers dataset in admin:', error);
        setPartnerDeals(getStoredPartnerDeals(FALLBACK_FIRMS));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // PARTNER DEALS POSITION & ORDERING HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...partnerDeals];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;

    const updated = reordered.map((d, i) => ({ ...d, position: i + 1 }));
    setPartnerDeals(updated);
    saveStoredPartnerDeals(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index === partnerDeals.length - 1) return;
    const reordered = [...partnerDeals];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;

    const updated = reordered.map((d, i) => ({ ...d, position: i + 1 }));
    setPartnerDeals(updated);
    saveStoredPartnerDeals(updated);
  };

  const handleSetPosition = (id: string, newPos: number) => {
    if (isNaN(newPos) || newPos < 1) return;
    const current = partnerDeals.find((d) => d.id === id);
    if (!current) return;

    const remaining = partnerDeals.filter((d) => d.id !== id);
    const targetIdx = Math.max(0, Math.min(newPos - 1, remaining.length));
    remaining.splice(targetIdx, 0, current);

    const updated = remaining.map((d, i) => ({ ...d, position: i + 1 }));
    setPartnerDeals(updated);
    saveStoredPartnerDeals(updated);
  };

  const handleTogglePartnerActive = (id: string) => {
    const updated = partnerDeals.map((d) =>
      d.id === id ? { ...d, isActive: !d.isActive } : d
    );
    setPartnerDeals(updated);
    saveStoredPartnerDeals(updated);
  };

  const handleResetDefaults = () => {
    showModal({
      type: 'confirm',
      title: 'Reset to Official Listed Deals?',
      message: 'This will restore the 11 verified partner prop firms with their official positions, real referral links, and Top 3 Gold/Silver/Bronze badges.',
      confirmText: 'Reset Defaults',
      cancelText: 'Cancel',
      onConfirm: () => {
        const reset = resetStoredPartnerDeals(firms);
        setPartnerDeals(reset);
        showModal({
          type: 'success',
          title: 'Deals Reset',
          message: 'Verified partner discounts have been reset to official defaults.'
        });
      }
    });
  };

  const handleDeletePartnerDeal = (id: string, firmName: string) => {
    showModal({
      type: 'confirm',
      title: 'Remove Partner Deal?',
      message: `Are you sure you want to remove ${firmName} from Verified Partner Discounts?`,
      confirmText: 'Remove',
      cancelText: 'Cancel',
      onConfirm: () => {
        const updated = partnerDeals
          .filter((d) => d.id !== id)
          .map((d, i) => ({ ...d, position: i + 1 }));
        setPartnerDeals(updated);
        saveStoredPartnerDeals(updated);
        showModal({
          type: 'success',
          title: 'Removed',
          message: `${firmName} removed from partner deals.`
        });
      }
    });
  };

  const handleSavePartnerDeal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedFirmId = formData.get('firm_id') as string;
    const matchedFirm = firms.find((f) => f.id === selectedFirmId) || FALLBACK_FIRMS.find((f) => f.id === selectedFirmId);

    const firmName = matchedFirm?.name || (formData.get('firm_name') as string);
    const category = (formData.get('category') as any) || 'Forex';
    const discountText = (formData.get('discount_text') as string) || 'Get Upto';
    const highlightOffer = (formData.get('highlight_offer') as string) || '10% OFF';
    const code = (formData.get('code') as string) || 'WEALTHX';
    const claimUrl = (formData.get('claim_url') as string) || matchedFirm?.affiliate_link || matchedFirm?.website || 'https://ftmo.com?ref=propxwealth';
    const infoTooltip = (formData.get('info_tooltip') as string) || `Exclusive discount for ${firmName} challenges.`;
    const badge = (formData.get('badge') as string) || '';
    const position = parseInt(formData.get('position') as string, 10) || partnerDeals.length + 1;
    const isActive = formData.get('is_active') === 'on';

    if (selectedPartnerDeal) {
      // Update existing
      const updated = partnerDeals.map((d) => {
        if (d.id === selectedPartnerDeal.id) {
          return {
            ...d,
            firmId: selectedFirmId || d.firmId,
            firmName,
            category,
            discountText,
            highlightOffer,
            code,
            claimUrl,
            infoTooltip,
            badge: badge || undefined,
            isActive,
            logoUrl: matchedFirm?.logo_url || d.logoUrl
          };
        }
        return d;
      });

      // Handle position change
      const targetDeal = updated.find((d) => d.id === selectedPartnerDeal.id)!;
      const rest = updated.filter((d) => d.id !== selectedPartnerDeal.id);
      const targetIdx = Math.max(0, Math.min(position - 1, rest.length));
      rest.splice(targetIdx, 0, targetDeal);

      const reindexed = rest.map((d, i) => ({ ...d, position: i + 1 }));
      setPartnerDeals(reindexed);
      saveStoredPartnerDeals(reindexed);
    } else {
      // Create new
      const newDeal: VerifiedPartnerDeal = {
        id: `deal-${Date.now()}`,
        firmId: selectedFirmId,
        firmName,
        category,
        discountText,
        highlightOffer,
        code,
        claimUrl,
        infoTooltip,
        logoUrl: matchedFirm?.logo_url || undefined,
        position,
        badge: badge || undefined,
        isActive: true
      };

      const copy = [...partnerDeals];
      const targetIdx = Math.max(0, Math.min(position - 1, copy.length));
      copy.splice(targetIdx, 0, newDeal);

      const reindexed = copy.map((d, i) => ({ ...d, position: i + 1 }));
      setPartnerDeals(reindexed);
      saveStoredPartnerDeals(reindexed);
    }

    setIsPartnerModalOpen(false);
    showModal({
      type: 'success',
      title: 'Success',
      message: 'Verified partner deal saved and live on site!'
    });
  };

  // ─────────────────────────────────────────────────────────────
  // GENERAL OFFERS HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleEdit = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedOffer(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    showModal({
      type: 'confirm',
      title: 'Delete Offer',
      message: 'Are you sure you want to delete this offer?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('offers').delete().eq('id', id);
          if (error) throw error;
          setOffers(offers.filter((o) => o.id !== id));
          showModal({ type: 'success', title: 'Deleted', message: 'Offer deleted successfully.' });
        } catch (error) {
          console.error('Error deleting offer:', error);
          showModal({ type: 'error', title: 'Error', message: 'Failed to delete offer.' });
        }
      }
    });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const offerData = {
      firm_id: formData.get('firm_id') as string,
      title: formData.get('title') as string,
      code: formData.get('code') as string,
      discount: formData.get('discount') as string,
      expiry_date: formData.get('expiry_date') || null,
      verified: formData.get('verified') === 'on',
      status: 'active'
    };

    try {
      if (selectedOffer) {
        const { error } = await supabase
          .from('offers')
          .update(offerData)
          .eq('id', selectedOffer.id);

        if (error) throw error;
        const { data } = await supabase
          .from('offers')
          .select('*, firms(name)')
          .eq('id', selectedOffer.id)
          .single();
        setOffers(offers.map((o) => (o.id === selectedOffer.id ? data : o)));
      } else {
        const { data, error } = await supabase
          .from('offers')
          .insert([offerData])
          .select('*, firms(name)')
          .single();

        if (error) throw error;
        setOffers([data, ...offers]);
      }
      setIsModalOpen(false);
      showModal({ type: 'success', title: 'Success', message: 'Offer saved successfully!' });
    } catch (error) {
      console.error('Error saving offer:', error);
      showModal({ type: 'error', title: 'Error', message: 'Failed to save offer.' });
    } finally {
      setSaving(false);
    }
  };

  // Top 3 Podium firms
  const top1Firm = partnerDeals.find((d) => d.position === 1);
  const top2Firm = partnerDeals.find((d) => d.position === 2);
  const top3Firm = partnerDeals.find((d) => d.position === 3);

  // Filtered partner deals for admin list
  const filteredPartnerDeals = partnerDeals.filter((d) => {
    const matchCat = partnerCategory === 'All' || d.category === partnerCategory;
    const matchQuery =
      d.firmName.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      d.code.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      d.highlightOffer.toLowerCase().includes(partnerSearch.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0C41B]/15 text-[#F0C41B] border border-[#F0C41B]/30 text-[10px] font-black uppercase tracking-wider">
              Control Center
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Offers & Partner Discounts
          </h2>
          <p className="text-neutral-400 text-sm mt-0.5">
            Control ranking positions, Gold/Silver/Bronze badges, and referral affiliate links.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#111114] border border-white/10 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('partner-discounts')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'partner-discounts'
                ? 'bg-[#F0C41B] text-black shadow-[0_0_12px_rgba(240,196,27,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>Verified Partner Discounts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-bold">
              {partnerDeals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('general-offers')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'general-offers'
                ? 'bg-[#F0C41B] text-black shadow-[0_0_12px_rgba(240,196,27,0.3)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Tag size={14} />
            <span>Promo Vouchers ({offers.length})</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: VERIFIED PARTNER DISCOUNTS MANAGER                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'partner-discounts' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* RANK 1 - GOLD */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#1a1608] to-[#0d0c0a] border border-amber-400/40 p-5 shadow-[0_0_25px_rgba(245,158,11,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/25 to-yellow-400/35 text-yellow-300 border border-yellow-400/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                  <span className="text-sm">🥇</span> Gold Badge #1
                </span>
                <span className="text-amber-400 font-mono text-xs font-bold">POS 1</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-amber-400/30 flex items-center justify-center p-1">
                  {top1Firm?.logoUrl ? (
                    <img src={top1Firm.logoUrl} alt={top1Firm.firmName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-yellow-400 font-black text-sm">#1</span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{top1Firm?.firmName || 'Not Assigned'}</h4>
                  <div className="text-xs text-amber-300 font-bold">
                    {top1Firm?.highlightOffer} • Code {top1Firm?.code}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1 border-t border-white/5 pt-2">
                <span className="text-neutral-500 shrink-0">Referral Link:</span>
                <a
                  href={top1Firm?.claimUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:underline truncate flex items-center gap-1"
                >
                  {top1Firm?.claimUrl}
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* RANK 2 - SILVER */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#141518] to-[#0c0d0f] border border-slate-300/40 p-5 shadow-[0_0_20px_rgba(203,213,225,0.12)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-300/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-slate-300/25 to-slate-100/35 text-slate-100 border border-slate-300/60 shadow-[0_0_10px_rgba(203,213,225,0.25)]">
                  <span className="text-sm">🥈</span> Silver Badge #2
                </span>
                <span className="text-slate-300 font-mono text-xs font-bold">POS 2</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-slate-300/30 flex items-center justify-center p-1">
                  {top2Firm?.logoUrl ? (
                    <img src={top2Firm.logoUrl} alt={top2Firm.firmName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-slate-200 font-black text-sm">#2</span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{top2Firm?.firmName || 'Not Assigned'}</h4>
                  <div className="text-xs text-slate-300 font-bold">
                    {top2Firm?.highlightOffer} • Code {top2Firm?.code}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1 border-t border-white/5 pt-2">
                <span className="text-neutral-500 shrink-0">Referral Link:</span>
                <a
                  href={top2Firm?.claimUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 hover:underline truncate flex items-center gap-1"
                >
                  {top2Firm?.claimUrl}
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* RANK 3 - BRONZE */}
            <div className="relative rounded-2xl bg-gradient-to-b from-[#18120b] to-[#0e0c08] border border-amber-600/40 p-5 shadow-[0_0_20px_rgba(180,83,9,0.15)] overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-700/30 to-amber-600/40 text-amber-200 border border-amber-600/60 shadow-[0_0_10px_rgba(180,83,9,0.3)]">
                  <span className="text-sm">🥉</span> Bronze Badge #3
                </span>
                <span className="text-amber-500 font-mono text-xs font-bold">POS 3</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-black/60 border border-amber-600/30 flex items-center justify-center p-1">
                  {top3Firm?.logoUrl ? (
                    <img src={top3Firm.logoUrl} alt={top3Firm.firmName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-amber-300 font-black text-sm">#3</span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{top3Firm?.firmName || 'Not Assigned'}</h4>
                  <div className="text-xs text-amber-300 font-bold">
                    {top3Firm?.highlightOffer} • Code {top3Firm?.code}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1 border-t border-white/5 pt-2">
                <span className="text-neutral-500 shrink-0">Referral Link:</span>
                <a
                  href={top3Firm?.claimUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:underline truncate flex items-center gap-1"
                >
                  {top3Firm?.claimUrl}
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Action Bar & Controls */}
          <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
                <input
                  type="text"
                  placeholder="Search partner deals..."
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-[#F0C41B] focus:outline-none"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
                {(['All', 'Forex', 'Futures', 'Crypto'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPartnerCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      partnerCategory === cat
                        ? 'bg-[#F0C41B] text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
                title="Reset to official 11 listed firms with default positions"
              >
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={() => {
                  setSelectedPartnerDeal(null);
                  setIsPartnerModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F0C41B] text-black font-extrabold text-xs tracking-wide shadow-[0_0_15px_rgba(240,196,27,0.25)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} className="stroke-[3]" />
                <span>Add Listed Firm Deal</span>
              </button>
            </div>
          </div>

          {/* Partner Deals Reordering Table */}
          <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-black/60 border-b border-white/10 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    <th className="py-4 px-4 text-center w-28">POSITION</th>
                    <th className="py-4 px-6">PROP FIRM</th>
                    <th className="py-4 px-4">CATEGORY</th>
                    <th className="py-4 px-6">DISCOUNT & CODE</th>
                    <th className="py-4 px-6">REFERRAL LINK (BUY NOW CTA)</th>
                    <th className="py-4 px-4 text-center">STATUS</th>
                    <th className="py-4 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPartnerDeals.length > 0 ? (
                    filteredPartnerDeals.map((deal, idx) => {
                      const isTop1 = deal.position === 1;
                      const isTop2 = deal.position === 2;
                      const isTop3 = deal.position === 3;

                      return (
                        <tr
                          key={deal.id}
                          className={`hover:bg-white/[0.02] transition-colors ${
                            isTop1
                              ? 'bg-amber-500/[0.04]'
                              : isTop2
                              ? 'bg-slate-400/[0.03]'
                              : isTop3
                              ? 'bg-amber-700/[0.03]'
                              : ''
                          }`}
                        >
                          {/* 1. POSITION CONTROLLER */}
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Reorder Arrows */}
                              <div className="flex flex-col gap-0.5">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveUp(idx)}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-[#F0C41B] hover:text-black text-neutral-400 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp size={12} />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === filteredPartnerDeals.length - 1}
                                  onClick={() => handleMoveDown(idx)}
                                  className="w-5 h-5 rounded bg-white/5 hover:bg-[#F0C41B] hover:text-black text-neutral-400 disabled:opacity-20 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown size={12} />
                                </button>
                              </div>

                              {/* Numeric Input */}
                              <input
                                type="number"
                                min={1}
                                max={partnerDeals.length}
                                value={deal.position}
                                onChange={(e) => handleSetPosition(deal.id, parseInt(e.target.value, 10))}
                                className="w-10 text-center bg-black/60 border border-white/15 rounded-lg py-1 text-xs font-black text-white focus:border-[#F0C41B] focus:outline-none"
                              />
                            </div>
                          </td>

                          {/* 2. FIRM NAME & RANK BADGE */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden p-1 shrink-0">
                                {deal.logoUrl ? (
                                  <img src={deal.logoUrl} alt={deal.firmName} className="w-full h-full object-contain" />
                                ) : (
                                  <span className="text-white font-bold text-xs">{deal.firmName.substring(0, 2)}</span>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-white text-sm tracking-tight">
                                    {deal.firmName}
                                  </span>
                                  {isTop1 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/25 to-yellow-400/35 text-yellow-300 border border-yellow-400/60 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                                      🥇 Gold Badge
                                    </span>
                                  ) : isTop2 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-slate-300/25 to-slate-100/35 text-slate-100 border border-slate-300/60">
                                      🥈 Silver Badge
                                    </span>
                                  ) : isTop3 ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-700/30 to-amber-600/40 text-amber-200 border border-amber-600/60">
                                      🥉 Bronze Badge
                                    </span>
                                  ) : deal.badge ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#F0C41B]/15 text-[#F0C41B] border border-[#F0C41B]/30">
                                      {deal.badge}
                                    </span>
                                  ) : null}
                                </div>
                                <span className="text-[11px] text-neutral-400 truncate max-w-xs block">
                                  {deal.infoTooltip}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 3. CATEGORY */}
                          <td className="py-4 px-4">
                            <span className="text-neutral-300 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                              {deal.category}
                            </span>
                          </td>

                          {/* 4. DISCOUNT & CODE */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-[#F0C41B] font-black text-sm">{deal.highlightOffer}</span>
                              <span className="text-[11px] font-mono font-bold text-neutral-400">
                                Code: <strong className="text-white">{deal.code}</strong>
                              </span>
                            </div>
                          </td>

                          {/* 5. REFERRAL LINK */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 max-w-xs">
                              <span className="text-xs text-neutral-300 truncate font-mono bg-black/40 px-2 py-1 rounded border border-white/5 flex-1">
                                {deal.claimUrl}
                              </span>
                              <a
                                href={deal.claimUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-[#F0C41B] hover:text-black text-neutral-400 transition-colors shrink-0"
                                title="Test Referral Link"
                              >
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          </td>

                          {/* 6. ACTIVE TOGGLE */}
                          <td className="py-4 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleTogglePartnerActive(deal.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                                deal.isActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {deal.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                              <span>{deal.isActive ? 'Live' : 'Hidden'}</span>
                            </button>
                          </td>

                          {/* 7. ACTIONS */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPartnerDeal(deal);
                                  setIsPartnerModalOpen(true);
                                }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit Deal"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePartnerDeal(deal.id, deal.firmName)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove Deal"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-neutral-500">
                        No partner deals found. Click "Reset Defaults" or "+ Add Listed Firm Deal".
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: GENERAL PROMO VOUCHERS                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'general-offers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Filters & Search */}
          <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                type="text"
                placeholder="Search promo vouchers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:border-[#F0C41B] focus:outline-none placeholder-neutral-500"
              />
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 bg-[#F0C41B] text-black px-4 py-2 rounded-xl font-bold hover:brightness-110 transition-colors shadow-lg shadow-[#F0C41B]/20 text-xs cursor-pointer"
            >
              <Plus size={16} />
              Add New Voucher
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-neutral-400 gap-2">
                <Loader2 className="animate-spin" size={24} />
                Loading offers...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/60 border-b border-white/10 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Offer Details</th>
                      <th className="px-6 py-4">Discount Code</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Expiry</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {offers
                      .filter((o) => o.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((offer) => (
                        <tr key={offer.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm">{offer.title}</span>
                              <span className="text-xs text-[#F0C41B] font-medium mt-0.5">
                                {offer.firms?.name || 'Unknown Firm'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {offer.code ? (
                              <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-2.5 py-1 rounded-lg max-w-fit">
                                <code className="text-[#F0C41B] font-mono text-xs font-bold">{offer.code}</code>
                                <Copy size={12} className="text-neutral-400 hover:text-white cursor-pointer" />
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-500 italic">No Code</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                offer.status === 'active'
                                  ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                  : 'bg-red-500/10 text-red-500 border-red-500/20'
                              }`}
                            >
                              {offer.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-400">
                            {offer.expiry_date ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {offer.expiry_date}
                              </div>
                            ) : (
                              <span className="text-neutral-500">No Expiry</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(offer)}
                                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(offer.id)}
                                className="p-2 text-neutral-400 hover:text-red-500 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD / EDIT PARTNER DEAL                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#111114] w-full max-w-xl rounded-2xl border border-white/15 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSavePartnerDeal}>
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#F0C41B]" />
                  <h3 className="text-lg font-black text-white">
                    {selectedPartnerDeal ? 'Edit Verified Partner Deal' : 'Add Listed Partner Deal'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <XCircle size={22} />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* 1. Listed Firm Selection */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300 uppercase tracking-wider">
                    Select From Listed Prop Firms (Real Data Only)
                  </label>
                  <select
                    name="firm_id"
                    required
                    defaultValue={selectedPartnerDeal?.firmId || ''}
                    onChange={(e) => {
                      const f = firms.find((item) => item.id === e.target.value);
                      if (f) {
                        const form = e.target.form;
                        if (form) {
                          if (form.claim_url) form.claim_url.value = f.affiliate_link || f.website || '';
                          if (form.category) {
                            const t = (f.trading_type || '').toLowerCase();
                            form.category.value = t.includes('futures') ? 'Futures' : t.includes('crypto') ? 'Crypto' : 'Forex';
                          }
                        }
                      }
                    }}
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none"
                  >
                    <option value="">-- Choose Listed Firm --</option>
                    {firms.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.trading_type || 'Forex'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Position Ranking */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">
                      Position / Rank # (1 = Gold, 2 = Silver, 3 = Bronze)
                    </label>
                    <input
                      name="position"
                      type="number"
                      min={1}
                      max={partnerDeals.length + 1}
                      defaultValue={selectedPartnerDeal?.position || partnerDeals.length + 1}
                      required
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={selectedPartnerDeal?.category || 'Forex'}
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none font-bold"
                    >
                      <option value="Forex">Forex</option>
                      <option value="Futures">Futures</option>
                      <option value="Crypto">Crypto</option>
                    </select>
                  </div>
                </div>

                {/* 3. Discount Highlight & Code */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">
                      Discount Offer
                    </label>
                    <input
                      name="highlight_offer"
                      required
                      defaultValue={selectedPartnerDeal?.highlightOffer || '10% OFF'}
                      placeholder="e.g. 20% OFF"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#F0C41B] outline-none font-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">
                      Prefix Text
                    </label>
                    <input
                      name="discount_text"
                      defaultValue={selectedPartnerDeal?.discountText || 'Get Upto'}
                      placeholder="e.g. Get Upto"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#F0C41B] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">
                      Promo Code
                    </label>
                    <input
                      name="code"
                      required
                      defaultValue={selectedPartnerDeal?.code || 'WEALTHX'}
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-[#F0C41B] font-mono font-bold focus:border-[#F0C41B] outline-none"
                    />
                  </div>
                </div>

                {/* 4. Referral Affiliate Link (Strict Requirement) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Our Referral / Affiliate Link (Linked to Buy Now CTA)</span>
                    <span className="text-[10px] text-neutral-400 lowercase">must lead through our ref</span>
                  </label>
                  <input
                    name="claim_url"
                    required
                    defaultValue={selectedPartnerDeal?.claimUrl || ''}
                    placeholder="https://firm.com?ref=propxwealth"
                    className="w-full bg-black/80 border border-amber-400/40 rounded-xl px-4 py-2.5 text-white font-mono text-xs focus:border-[#F0C41B] outline-none"
                  />
                </div>

                {/* 5. Tooltip & Custom Badge */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">
                      Custom Badge (Optional)
                    </label>
                    <input
                      name="badge"
                      defaultValue={selectedPartnerDeal?.badge || ''}
                      placeholder="e.g. Popular / High Value"
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-white focus:border-[#F0C41B] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="flex items-center gap-2 cursor-pointer py-2">
                      <input
                        name="is_active"
                        type="checkbox"
                        defaultChecked={selectedPartnerDeal ? selectedPartnerDeal.isActive : true}
                        className="rounded border-white/20 bg-black text-[#F0C41B] focus:ring-[#F0C41B]"
                      />
                      <span className="text-white font-bold">Active in Partner Discounts</span>
                    </label>
                  </div>
                </div>

                {/* 6. Guarantee Tooltip Text */}
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300 uppercase tracking-wider">
                    Offer Details / Tooltip
                  </label>
                  <textarea
                    name="info_tooltip"
                    rows={2}
                    defaultValue={selectedPartnerDeal?.infoTooltip || ''}
                    placeholder="Describe specific conditions, evaluation models, and profit split guarantees."
                    className="w-full bg-black/80 border border-white/15 rounded-xl px-4 py-2 text-white focus:border-[#F0C41B] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-neutral-400 hover:text-white font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#F0C41B] text-black font-extrabold tracking-wide hover:brightness-110 transition-all cursor-pointer"
                >
                  Save Partner Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: GENERAL VOUCHER                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111114] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
            <form onSubmit={handleSave}>
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h3 className="text-lg font-black text-white">
                  {selectedOffer ? 'Edit Promo Voucher' : 'Add New Promo Voucher'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300 uppercase tracking-wider">Associated Firm</label>
                  <select
                    name="firm_id"
                    required
                    defaultValue={selectedOffer?.firm_id || ''}
                    className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none"
                  >
                    <option value="">Select Firm...</option>
                    {firms.map((firm) => (
                      <option key={firm.id} value={firm.id}>
                        {firm.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300 uppercase tracking-wider">Offer Title</label>
                  <input
                    name="title"
                    required
                    defaultValue={selectedOffer?.title}
                    className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none"
                    placeholder="e.g. 50% OFF Summer Sale"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">Discount Code</label>
                    <input
                      name="code"
                      defaultValue={selectedOffer?.code || 'WEALTHX'}
                      className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none font-mono"
                      placeholder="WEALTHX"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-neutral-300 uppercase tracking-wider">Expiry Date</label>
                    <input
                      name="expiry_date"
                      type="date"
                      defaultValue={selectedOffer?.expiry_date || ''}
                      className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-neutral-300 uppercase tracking-wider">Discount Details</label>
                  <input
                    name="discount"
                    defaultValue={selectedOffer?.discount || ''}
                    className="w-full bg-black border border-white/15 rounded-xl px-4 py-2.5 text-white focus:border-[#F0C41B] outline-none"
                    placeholder="e.g. 10% or $50"
                  />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    name="verified"
                    type="checkbox"
                    id="verified"
                    className="rounded border-white/15 bg-black text-[#F0C41B] focus:ring-[#F0C41B]"
                    defaultChecked={selectedOffer?.verified}
                  />
                  <label htmlFor="verified" className="text-sm text-white select-none cursor-pointer">
                    Mark as Verified Deal
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/15 text-neutral-400 hover:text-white font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#F0C41B] text-black font-extrabold hover:brightness-110 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {saving && <Loader2 className="animate-spin" size={16} />}
                  {selectedOffer ? 'Update Voucher' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffersPage;
