
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
      // Parse the location to try and find state or district
      // Typical format: "District, State"
      const locationParts = (place || activeLocationFilter).split(',').map(s => s.trim());
      const stateGuess = locationParts.length > 1 ? locationParts[1] : locationParts[0];
      const districtGuess = locationParts.length > 1 ? locationParts[0] : '';

      const filters: MandiFilters = {};
      if (query) filters.commodity = query;
      
      // Attempt to fetch with most specific location first
      let rates = await fetchLiveMandiRates({ ...filters, district: districtGuess });
      
      // If no results for district, try state
      if (rates.length === 0) {
        rates = await fetchLiveMandiRates({ ...filters, state: stateGuess });
      }

      // If still no results, fetch general trending
      if (rates.length === 0 && !query) {
        rates = await fetchLiveMandiRates({});
      }

      setLiveRates(rates);

      // AI Analysis based on query and location
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

  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        // We use reverse geocoding via Gemini if needed, but for now we trust the profile
        loadData(searchQuery, location);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{t.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Live Mandi Feed • {activeLocationFilter.split(',')[0]}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={refreshLocation}
            className="bg-blue-100 text-blue-600 p-3 rounded-2xl shadow-sm hover:bg-blue-200 transition-colors active:scale-90"
            title="Detect Location"
          >
            <Crosshair size={20} />
          </button>
          <button 
            onClick={() => loadData(searchQuery)}
            className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl shadow-sm hover:bg-emerald-200 transition-colors active:rotate-180 duration-500"
          >
            <RefreshCcw size={20} />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search crop (e.g. Wheat, Potato)..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-200 shadow-sm transition-all placeholder:font-medium"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader2 size={18} className="animate-spin text-emerald-500" />
          </div>
        )}
      </form>

      {/* Live Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap size={14} className="text-amber-500 fill-amber-500" /> Current Market Rates
          </h3>
          {liveRates.length > 0 && (
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
              {liveRates.length} Markets Live
            </span>
          )}
        </div>

        {initialLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem] animate-pulse"></div>
            ))}
          </div>
        ) : liveRates.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {liveRates.map((record, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-emerald-200 transition-all group relative overflow-hidden animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                {/* Variety Tag */}
                <div className="absolute top-0 right-0">
                  <span className="bg-emerald-600 text-white text-[9px] font-black px-4 py-2 rounded-bl-3xl uppercase tracking-widest shadow-lg">
                    {record.variety}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 text-xl group-hover:text-emerald-600 transition-colors tracking-tight">{record.commodity}</h4>
                    <div className="space-y-1 mt-2">
                      <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                        <MapIcon size={12} className="text-emerald-500" /> {record.market} Market
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold ml-4.5 uppercase tracking-widest opacity-70">
                        {record.district}, {record.state}
                      </p>
                    </div>
                  </div>
                  <div className="text-right mt-4">
                    <p className="text-[9px] text-slate-400 font-black uppercase mb-1 tracking-widest">Market Price</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      ₹{record.modal_price}
                      <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">/Qt</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-5">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100/50">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-tighter">Min</p>
                    <p className="text-sm font-black text-slate-700">₹{record.min_price}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100/50">
                    <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-tighter">Max</p>
                    <p className="text-sm font-black text-slate-700">₹{record.max_price}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-3 rounded-2xl text-center flex flex-col justify-center border border-emerald-100/50">
                    <p className="text-[9px] text-emerald-600 uppercase font-black mb-1 tracking-tighter">Freshness</p>
                    <p className="text-[10px] font-black text-emerald-700">{record.arrival_date.split(' ')[0]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 p-12 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-4">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm text-slate-300">
              <Info size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-900 font-black uppercase tracking-tight">No Live Data for this Area</p>
              <p className="text-xs text-slate-500 font-medium px-4">Markets in {activeLocationFilter.split(',')[0]} haven't updated their feed today. Try searching for major hubs or different crops.</p>
            </div>
            <button 
              onClick={() => {setSearchQuery(''); setActiveLocationFilter('India'); loadData('', 'India');}}
              className="text-xs font-bold text-emerald-600 underline uppercase tracking-widest"
            >
              Show National Rates
            </button>
          </div>
        )}
      </div>

      {/* AI Analysis Report */}
      {aiReport && (
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 border border-emerald-400/20 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-200/50 animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] opacity-10 transform rotate-12">
            <Sparkles size={120} className="text-white" />
          </div>
          <div className="flex items-center gap-2 text-emerald-100 mb-6">
            <Sparkles size={20} className="text-amber-300 fill-amber-300" />
            <h3 className="font-black text-xs uppercase tracking-[0.2em]">Smart Market Analysis</h3>
          </div>
          <div className="prose prose-sm text-emerald-50 leading-relaxed whitespace-pre-wrap relative z-10 font-bold text-sm tracking-tight">
            {aiReport}
          </div>
        </div>
      )}

      {/* Static Trend Watchlist */}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-500" /> Price Trends
          </h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {COMMODITIES.map((c, idx) => {
            const isUp = c.change.startsWith('+');
            return (
              <div key={idx} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:bg-slate-50 transition-all active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors shadow-sm ${isUp ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                    {c.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 tracking-tight">{c.name}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      <MapPin size={10} className="text-slate-300" />
                      {c.market}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900 text-lg tracking-tighter">{c.price}</p>
                  <div className={`flex items-center justify-end gap-0.5 text-[10px] font-black ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {c.change}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Selling Tip Footer */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-400 mt-8 mb-4">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp size={180} />
        </div>
        <div className="relative z-10">
          <div className="bg-emerald-500 w-16 h-2 rounded-full mb-8"></div>
          <h3 className="font-black text-3xl mb-4 tracking-tight leading-none">Maximize Profit</h3>
          <p className="text-base text-slate-300 leading-relaxed font-bold opacity-80 tracking-tight">
            Historical data suggests prices in {liveRates[0]?.district || 'your district'} peak on Monday mornings. Plan your transport to reach the Mandi early for the best bidding rates.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Sparkles size={18} className="text-emerald-400" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">AI-Powered Suggestion</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketRates;
