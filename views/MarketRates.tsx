
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS, COMMODITIES } from '../constants';
import { TrendingUp, TrendingDown, MapPin, Calendar, Search } from 'lucide-react';

interface MarketRatesProps {
  language: Language;
}

const MarketRates: React.FC<MarketRatesProps> = ({ language }) => {
  const t = TRANSLATIONS[language].market;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <Calendar size={14} />
            Updated Today: {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
          <TrendingUp size={24} />
        </div>
      </header>

      {/* Search/Filter Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search crop or market..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Market List */}
      <div className="space-y-3">
        {COMMODITIES.map((c, idx) => {
          const isUp = c.change.startsWith('+');
          return (
            <div key={idx} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
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

      {/* Insight Section */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute bottom-[-10px] right-[-10px] opacity-10">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Market Insight</h3>
          <p className="text-sm text-blue-100 leading-relaxed">
            Tomato prices are rising in Nashik market due to lower supply. Consider selling your harvest this week for maximum profit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketRates;
