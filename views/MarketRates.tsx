
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, COMMODITIES } from '../constants';
import { TrendingUp, TrendingDown, MapPin, Calendar, Search, Loader2, Sparkles, Zap, Map as MapIcon } from 'lucide-react';
import { getMarketUpdates } from '../services/gemini';
import { fetchLiveMandiRates, MandiRecord } from '../services/mandi';

interface MarketRatesProps {
  language: Language;
  location?: string;
}

const MarketRates: React.FC<MarketRatesProps> = ({ language, location = "India" }) => {
  const t = TRANSLATIONS[language].market;
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [liveRates, setLiveRates] = useState<MandiRecord[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial fetch for general rates
  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      const rates = await fetchLiveMandiRates();
      setLiveRates(rates);
      setInitialLoading(false);
    };
    init();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    
    setIsSearching(true);
    setAiReport(null);
    try {
      // Parallel fetch: Gov API for hard data + Gemini for analysis
      const [rates, report] = await Promise.all([
        fetchLiveMandiRates(query),
        query ? getMarketUpdates(query, location, language) : Promise.resolve(null)
      ]);
      
      setLiveRates(rates);
      setAiReport(report);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 pb-12">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">{t.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live Mandi Bhav</span>
          </div>
        </div>
        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl shadow-sm">
          <TrendingUp size={24} />
        </div>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search crop (e.g. Potato, Wheat)..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-200 shadow-sm transition-all"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 size={18} className="animate-spin text-emerald-500" />
          </div>
        )}
      </form>

      {/* Live Gov API Rates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} className="text-amber-500" /> Official Gov Rates
          </h3>
          <span className="text-[10px] text-slate-400">Source: Data.gov.in</span>
        </div>

        {initialLoading ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <Loader2 className="animate-spin text-emerald-200" size={32} />
            <p className="text-xs text-slate-400 font-medium">Fetching official mandi prices...</p>
          </div>
        ) : liveRates.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {liveRates.map((record, idx) => (
              <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{record.commodity}</h4>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <MapIcon size={10} /> {record.market}, {record.district}, {record.state}
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold">
                    ₹{record.modal_price}/Qtl
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-3">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Min</p>
                    <p className="text-xs font-bold text-slate-700">₹{record.min_price}</p>
                  </div>
                  <div className="text-center border-x border-slate-50">
                    <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Max</p>
                    <p className="text-xs font-bold text-slate-700">₹{record.max_price}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-bold mb-0.5">Arrival</p>
                    <p className="text-xs font-bold text-slate-700">{record.arrival_date.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-200 text-center">
            <p className="text-sm text-slate-400">No official records found for this query today.</p>
          </div>
        )}
      </div>

      {/* AI Search Report */}
      {aiReport && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-7 shadow-inner animate-in slide-in-from-top-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={60} className="text-emerald-600" />
          </div>
          <div className="flex items-center gap-2 text-emerald-700 mb-4">
            <Sparkles size={18} />
            <h3 className="font-bold text-sm uppercase tracking-wider">Market Expert Analysis</h3>
          </div>
          <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-wrap relative z-10">
            {aiReport}
          </div>
        </div>
      )}

      {/* Static Trends Fallback */}
      {!searchQuery && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Common Trends</h3>
          {COMMODITIES.map((c, idx) => {
            const isUp = c.change.startsWith('+');
            return (
              <div key={idx} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-white group-hover:text-emerald-500 transition-colors">
                    {c.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{c.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={10} />
                      {c.market}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{c.price}</p>
                  <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {c.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Insight Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-7 text-white relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="absolute bottom-[-20px] right-[-20px] opacity-20 transform rotate-12">
          <TrendingUp size={160} />
        </div>
        <div className="relative z-10">
          <div className="bg-emerald-500 w-10 h-1 rounded-full mb-4"></div>
          <h3 className="font-black text-xl mb-2 tracking-tight">Selling Strategy</h3>
          <p className="text-sm text-slate-300 leading-relaxed opacity-90">
            Bulk arrivals of summer crops are expected in the coming week. Experts suggest staggered selling to maximize profit margins during local Mandi fluctuations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketRates;
