
import React, { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, COMMODITIES } from '../constants';
import { TrendingUp, TrendingDown, MapPin, Search, Loader2, Sparkles, Zap, Map as MapIcon, RefreshCcw, Info, Crosshair } from 'lucide-react';
import { getMarketUpdates } from '../services/gemini';
import { fetchLiveMandiRates, MandiRecord, MandiFilters } from '../services/mandi';

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
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>(location);

  const loadData = useCallback(async (query: string = '', place: string = '') => {
    if (query || place) setIsSearching(true);
    else setInitialLoading(true);

    try {
      const locationParts = (place || activeLocationFilter).split(',').map(s => s.trim());
      const stateGuess = locationParts.length > 1 ? locationParts[1] : locationParts[0];
      const districtGuess = locationParts.length > 1 ? locationParts[0] : '';

      const filters: MandiFilters = {};
      if (query) filters.commodity = query;
      
      let rates = await fetchLiveMandiRates({ ...filters, district: districtGuess });
      if (rates.length === 0) {
        rates = await fetchLiveMandiRates({ ...filters, state: stateGuess });
      }
      if (rates.length === 0 && !query) {
        rates = await fetchLiveMandiRates({});
      }

      setLiveRates(rates);

      if (query) {
        const report = await getMarketUpdates(query, place || activeLocationFilter, language);
        setAiReport(report);
      } else {
        setAiReport(null);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsSearching(false);
      setInitialLoading(false);
    }
  }, [activeLocationFilter, language]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(searchQuery.trim());
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 pb-24 px-1">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{t.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Live Mandi • {activeLocationFilter.split(',')[0]}
            </span>
          </div>
        </div>
        <button 
          onClick={() => loadData(searchQuery)}
          className="bg-emerald-100 text-emerald-600 p-3.5 rounded-2xl active:rotate-180 duration-500 transition-all"
        >
          <RefreshCcw size={22} />
        </button>
      </header>

      {/* Modern Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Wheat, Potato, etc..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-12 pr-12 text-sm text-slate-900 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-200 shadow-sm transition-all"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 size={20} className="animate-spin text-emerald-500" />
          </div>
        )}
      </form>

      {/* Rates Feed */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} className="text-amber-500 fill-amber-500" /> Mandi Feed
        </h3>

        {initialLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-slate-50 rounded-[2rem] animate-pulse"></div>
            ))}
          </div>
        ) : liveRates.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {liveRates.map((record, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="absolute top-0 right-0">
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                    {record.variety}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-black text-slate-900 text-xl tracking-tight">{record.commodity}</h4>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                      <MapIcon size={14} className="text-emerald-500" />
                      {record.market}, {record.district}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-widest">Current Rate</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{record.modal_price}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">per quintal</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-5">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Min</p>
                    <p className="text-sm font-black text-slate-700">₹{record.min_price}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Max</p>
                    <p className="text-sm font-black text-slate-700">₹{record.max_price}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-2xl text-center border border-emerald-100/30">
                    <p className="text-[9px] text-emerald-600 uppercase font-black mb-1">Date</p>
                    <p className="text-[10px] font-black text-emerald-700 leading-none">{record.arrival_date.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 py-16 px-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-300">
              <MapPin size={32} />
            </div>
            <p className="text-sm text-slate-900 font-bold">No Mandi listings for your area.</p>
            <p className="text-xs text-slate-500 leading-relaxed px-4">Try searching for a specific crop name above or check major national markets.</p>
          </div>
        )}
      </div>

      {/* AI Intelligence Banner */}
      {aiReport && (
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles size={120} />
          </div>
          <div className="flex items-center gap-2 text-emerald-400 mb-6">
            <Sparkles size={18} className="fill-emerald-400" />
            <h3 className="font-black text-xs uppercase tracking-widest">Market Analysis</h3>
          </div>
          <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
            {aiReport}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketRates;
