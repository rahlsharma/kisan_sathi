
import React, { useState, useEffect } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { ShoppingBag, Plus, Building2, CheckCircle2, TrendingUp, Info, ArrowRight, ShieldCheck, Filter, Search, Wallet, Loader2, Trash2, Calendar, ChevronRight } from 'lucide-react';
import { MockBackend, MarketplaceListing } from '../services/api';

interface MarketplaceProps {
  language: Language;
  userProfile: UserProfile | null;
}

const COMPANY_DEMANDS = [
  { company: 'ITC Limited', crop: 'Wheat (Sharbati)', qty: '500 Tons', price: '₹2,650/Qtl', location: 'Madhya Pradesh', verified: true },
  { company: 'Reliance Fresh', crop: 'Tomato (Grade A)', qty: '20 Tons', price: '₹1,450/Qtl', location: 'Maharashtra', verified: true },
  { company: 'BigBasket', crop: 'Potato', qty: '100 Tons', price: '₹1,950/Qtl', location: 'Punjab', verified: true },
];

const Marketplace: React.FC<MarketplaceProps> = ({ language, userProfile }) => {
  const t = TRANSLATIONS[language].marketplace;
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'mine' | 'sellers'>('buy');
  const [showListingForm, setShowListingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myListings, setMyListings] = useState<MarketplaceListing[]>([]);
  const [allListings, setAllListings] = useState<MarketplaceListing[]>([]);
  const [isLoadingMyListings, setIsLoadingMyListings] = useState(false);
  const [isLoadingAllListings, setIsLoadingAllListings] = useState(false);

  useEffect(() => {
    if (activeTab === 'mine') {
      loadMyListings();
    } else if (activeTab === 'sellers') {
      loadAllListings();
    }
  }, [activeTab]);

  const loadMyListings = async () => {
    setIsLoadingMyListings(true);
    const listings = await MockBackend.getMyListings();
    setMyListings(listings);
    setIsLoadingMyListings(false);
  };

  const loadAllListings = async () => {
    setIsLoadingAllListings(true);
    const listings = await MockBackend.getAllListings();
    setAllListings(listings);
    setIsLoadingAllListings(false);
  };

  const [formData, setFormData] = useState({
    crop: '',
    qty: '',
    price: '',
    grade: 'Grade A'
  });

  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await MockBackend.createListing({
        farmerName: userProfile?.name || 'Farmer',
        crop: formData.crop,
        quantity: formData.qty,
        price: formData.price,
        grade: formData.grade
      });
      setIsSubmitting(false);
      setShowListingForm(false);
      setActiveTab('mine');
      setFormData({ crop: '', qty: '', price: '', grade: 'Grade A' });
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // Added handleDeleteListing to fix "Cannot find name 'deleteListing'" error
  const handleDeleteListing = async (id: string) => {
    await MockBackend.deleteListing(id);
    if (activeTab === 'mine') loadMyListings();
    if (activeTab === 'sellers') loadAllListings();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{t.title}</h1>
          <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
          <ShoppingBag size={24} />
        </div>
      </header>

      {/* Direct Sell Shield - Mobile Optimized */}
      <div className="bg-slate-900 rounded-[2rem] p-5 flex items-center gap-4 text-white shadow-xl shadow-slate-200">
        <div className="bg-emerald-500 p-3 rounded-2xl shadow-inner text-white shrink-0">
          <ShieldCheck size={28} />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-tight text-emerald-400">Buyer Protection Active</p>
          <p className="text-[11px] text-slate-400 font-medium leading-tight">We verify all payments and manage harvest collection directly.</p>
        </div>
      </div>

      {/* Large Tab Selectors for Thumbs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] gap-1 overflow-x-auto scrollbar-hide">
        {[
          { id: 'buy', label: t.buyTitle },
          { id: 'sellers', label: t.sellersTitle },
          { id: 'sell', label: t.sellTitle },
          { id: 'mine', label: 'My Ads' }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[80px] py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm scale-100' : 'text-slate-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'buy' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Trending Demands</h3>
          <div className="grid grid-cols-1 gap-4">
            {COMPANY_DEMANDS.map((demand, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm active:scale-95 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900 text-lg">{demand.company}</h4>
                      {demand.verified && <CheckCircle2 size={18} className="text-blue-500" />}
                    </div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{demand.crop}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{demand.price}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{demand.qty} Needed</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <TrendingUp size={16} className="text-emerald-500" />
                    Market Hub
                  </div>
                  <button className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-[0.1em]">
                    Contact Buyer <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Farmer Listings</h3>
          {isLoadingAllListings ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">Loading Sellers...</p>
            </div>
          ) : allListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {allListings.map((listing) => (
                <div key={listing.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-slate-900 text-xl mb-1">{listing.crop}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-700">
                          {listing.farmerName.charAt(0)}
                        </div>
                        <p className="text-xs font-bold text-slate-600">{listing.farmerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 tracking-tight">₹{listing.price}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">per Qtl</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                      <p className="text-sm font-bold text-slate-900">{listing.quantity}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quality</p>
                      <p className="text-sm font-bold text-emerald-600">{listing.grade}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Posted {new Date(listing.timestamp).toLocaleDateString()}
                    </p>
                    <button className="bg-slate-900 text-white text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest active:scale-95 transition-all">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 py-16 px-8 rounded-[3rem] text-center">
              <p className="text-sm font-bold text-slate-900">No sellers active right now.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'sell' && (
        <div className="space-y-6">
          {!showListingForm ? (
            <div className="text-center py-16 px-6 space-y-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xl border-8 border-slate-50">
                <Plus size={48} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Post Your Crop</h3>
                <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto leading-relaxed">Let big companies bid on your harvest. You set the price.</p>
              </div>
              <button 
                onClick={() => setShowListingForm(true)}
                className="w-full bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-100 active:scale-95 flex items-center justify-center gap-3 text-lg"
              >
                <Plus size={24} />
                Create New Ad
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitListing} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl space-y-6 animate-in zoom-in-95">
               {isSubmitting ? (
                 <div className="py-12 text-center space-y-6">
                    <Loader2 size={48} className="animate-spin text-emerald-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-widest animate-pulse">Publishing Your Ad...</p>
                 </div>
               ) : (
                 <>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Crop Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.crop}
                      onChange={e => setFormData({...formData, crop: e.target.value})}
                      placeholder="e.g. Premium Wheat" 
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-base font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.qty}
                        onChange={e => setFormData({...formData, qty: e.target.value})}
                        placeholder="e.g. 50 Qtl" 
                        className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-base font-bold text-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Price/Qtl</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="e.g. 2400" 
                        className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 text-base font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-100 uppercase tracking-widest text-sm active:scale-95"
                    >
                      Publish Ad Now
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowListingForm(false)}
                      className="w-full py-4 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest"
                    >
                      Discard Draft
                    </button>
                  </div>
                 </>
               )}
            </form>
          )}
        </div>
      )}

      {activeTab === 'mine' && (
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Manage Your Ads</h3>
          {isLoadingMyListings ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 size={40} className="animate-spin mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">Fetching Account Data...</p>
            </div>
          ) : myListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {myListings.map((listing) => (
                <div key={listing.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative group animate-in slide-in-from-bottom-4">
                  <div className="absolute top-4 right-6 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {listing.status}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-black text-slate-900 text-xl mb-1">{listing.crop}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={14} /> Posted {new Date(listing.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-end justify-between pt-5 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Your Price</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">₹{listing.price}<span className="text-xs ml-1 font-bold text-slate-400">/Qtl</span></p>
                    </div>
                    <button 
                      onClick={() => handleDeleteListing(listing.id)}
                      className="p-4 bg-rose-50 text-rose-500 rounded-[1.5rem] active:scale-90 transition-all"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 py-16 px-8 rounded-[3rem] text-center space-y-4">
              <p className="text-sm font-bold text-slate-900">You haven't posted any ads yet.</p>
              <button 
                onClick={() => setActiveTab('sell')}
                className="text-emerald-600 font-black text-sm uppercase underline tracking-widest"
              >
                Create Listing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
