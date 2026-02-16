
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { ShoppingBag, Plus, Building2, CheckCircle2, TrendingUp, Info, ArrowRight, ShieldCheck, Filter, Search, Wallet } from 'lucide-react';

interface MarketplaceProps {
  language: Language;
  userProfile: UserProfile | null;
}

const COMPANY_DEMANDS = [
  { company: 'ITC Limited', crop: 'Wheat (Sharbati)', qty: '500 Tons', price: '₹2,650/Qtl', location: 'Madhya Pradesh', verified: true },
  { company: 'Reliance Fresh', crop: 'Tomato (Grade A)', qty: '20 Tons', price: '₹1,450/Qtl', location: 'Maharashtra', verified: true },
  { company: 'BigBasket', crop: 'Potato', qty: '100 Tons', price: '₹1,950/Qtl', location: 'Punjab', verified: true },
  { company: 'Adani Agri', crop: 'Rice (Basmati)', qty: '1000 Tons', price: '₹5,100/Qtl', location: 'Haryana', verified: true },
];

const Marketplace: React.FC<MarketplaceProps> = ({ language, userProfile }) => {
  const t = TRANSLATIONS[language].marketplace;
  const navT = TRANSLATIONS[language].nav;
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('buy');
  const [showListingForm, setShowListingForm] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowListingForm(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{t.title}</h1>
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
          <ShoppingBag size={24} />
        </div>
      </header>

      {/* Trust Badge */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-4 flex items-center gap-4">
        <div className="bg-white p-2 rounded-xl text-emerald-600 shadow-sm shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-xs font-black text-emerald-900 uppercase tracking-tight">Direct Sell Shield</p>
          <p className="text-[10px] text-emerald-700 font-medium">Verified buyers only. No commission. 100% direct payment.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] gap-1">
        <button 
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'buy' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {t.buyTitle}
        </button>
        <button 
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'sell' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {t.sellTitle}
        </button>
      </div>

      {activeTab === 'buy' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Building2 size={14} className="text-emerald-500" /> {t.companyDemands}
            </h3>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <Filter size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {COMPANY_DEMANDS.map((demand, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-emerald-200 transition-all active:scale-[0.98]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900 text-lg leading-tight">{demand.company}</h4>
                      {demand.verified && <CheckCircle2 size={16} className="text-blue-500 fill-blue-50" />}
                    </div>
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{demand.crop}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 tracking-tight">{demand.price}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{demand.qty} Required</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                    <TrendingUp size={12} className="text-emerald-500" /> Above Mandi Rate
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest group-hover:gap-3 transition-all">
                    Apply Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {!showListingForm ? (
            <div className="text-center py-10 space-y-6">
              <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <Plus size={48} />
              </div>
              <div className="space-y-2 px-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Got a harvest to sell?</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">List your crop directly. Companies will bid on your price, and you choose the best offer.</p>
              </div>
              <button 
                onClick={() => setShowListingForm(true)}
                className="bg-emerald-600 text-white font-black py-5 px-8 rounded-[2rem] shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center gap-3 mx-auto"
              >
                <Plus size={20} />
                {t.listButton}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitListing} className="bg-white p-8 rounded-[3rem] border border-emerald-100 shadow-sm space-y-6 animate-in zoom-in-95 duration-200">
               {formSuccess ? (
                 <div className="py-10 text-center space-y-4">
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Crop Listed Successfully!</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Awaiting Company Bids</p>
                 </div>
               ) : (
                 <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">What are you selling?</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Wheat, Basmati Rice" 
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t.quantity}</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. 10 Qtl" 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">{t.pricePerUnit}</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. 2500" 
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Quality Grade</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Grade A+', 'Grade A', 'Grade B'].map(q => (
                            <button key={q} type="button" className="py-3 bg-slate-50 rounded-xl text-[10px] font-black text-slate-600 uppercase hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-100 transition-all">
                                {q}
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowListingForm(false)}
                      className="flex-1 py-4 rounded-2xl text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 uppercase tracking-widest text-xs active:scale-95"
                    >
                      Confirm Listing
                    </button>
                  </div>
                 </>
               )}
            </form>
          )}

          {/* Tips Section */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="bg-emerald-500 w-12 h-1.5 rounded-full"></div>
              <h4 className="text-lg font-black tracking-tight leading-tight">Farmer-First Policy</h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                When you sell here, companies bear all logistics and grading costs. You receive the exact amount you list. Payments are escrowed until the harvest is picked up.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest pt-2">
                <Info size={14} /> Higher Profits • Zero Dallal
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
