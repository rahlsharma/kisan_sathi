import React, { useState, useEffect, useMemo } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { BookOpen, Search, Loader2, Sparkles, ShieldCheck, X, ClipboardCheck, ArrowRight, Wallet, GraduationCap, Shield, Layers, Filter, CheckCircle2, ListOrdered, ExternalLink } from 'lucide-react';
import { getGovernmentSchemes } from '../services/gemini';

interface Scheme {
  name: string;
  description: string;
  category: string;
  url: string;
  eligibility: string[];
  steps: string[];
}

interface SchemesProps {
  language: Language;
  userProfile: UserProfile | null;
}

const CATEGORIES = [
  { id: 'All', icon: Layers, color: 'bg-slate-100 text-slate-600' },
  { id: 'Subsidy', icon: Wallet, color: 'bg-emerald-100 text-emerald-600' },
  { id: 'Loan', icon: Filter, color: 'bg-blue-100 text-blue-600' },
  { id: 'Insurance', icon: Shield, color: 'bg-orange-100 text-orange-600' },
  { id: 'Training', icon: GraduationCap, color: 'bg-purple-100 text-purple-600' },
];

const Schemes: React.FC<SchemesProps> = ({ language, userProfile }) => {
  const t = TRANSLATIONS[language].schemes;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [data, setData] = useState<{ text: string; schemes: Scheme[] } | null>(null);
  const [activeScheme, setActiveScheme] = useState<Scheme | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getGovernmentSchemes(
        userProfile?.location || "India",
        userProfile?.crops || ["General Agriculture"],
        language
      );
      setData(res as any);
      setLoading(false);
    };
    fetch();
  }, [language, userProfile]);

  const filteredSchemes = useMemo(() => {
    if (!data?.schemes) return [];
    
    return data.schemes.filter(scheme => {
      const matchesSearch = !searchTerm.trim() || 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || 
        scheme.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [data?.schemes, searchTerm, selectedCategory]);

  const getCategoryColor = (cat: string) => {
    const found = CATEGORIES.find(c => c.id.toLowerCase() === cat.toLowerCase());
    return found ? found.color : 'bg-slate-100 text-slate-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Benefits for {userProfile?.location.split(',')[0] || 'your area'}
          </p>
        </div>
        <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl shadow-sm">
          <BookOpen size={24} />
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search PM-Kisan, Insurance, etc..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-200 shadow-sm transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105' 
                  : 'bg-white border border-slate-100 text-slate-500'
              }`}
            >
              <Icon size={14} />
              {cat.id}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={48} className="animate-spin mb-4 text-purple-500" />
          <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Finding official schemes...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* AI Summary Card */}
          {selectedCategory === 'All' && !searchTerm && data?.text && (
            <div className="bg-gradient-to-br from-white to-purple-50/30 p-7 rounded-[2.5rem] border border-purple-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-[-10px] right-[-10px] p-4 opacity-5">
                 <Sparkles size={120} className="text-purple-600" />
               </div>
               <div className="flex items-center gap-2 text-purple-600 mb-4">
                 <ShieldCheck size={20} className="fill-purple-100" />
                 <h3 className="text-xs font-black uppercase tracking-widest">Guide Summary</h3>
               </div>
               <p className="text-sm text-slate-700 leading-relaxed font-medium relative z-10">
                 {data.text}
               </p>
            </div>
          )}

          {/* Scheme Cards */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardCheck size={14} className="text-purple-500" /> 
                {selectedCategory === 'All' ? 'Active Schemes' : `${selectedCategory} Schemes`}
              </h3>
              <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                {filteredSchemes.length} Available
              </span>
            </div>
            
            {filteredSchemes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredSchemes.map((scheme, idx) => (
                  <div 
                    key={idx}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-purple-200 transition-all group flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 ${getCategoryColor(scheme.category)}`}>
                          {scheme.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-tight mb-2">
                          {scheme.name}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                          {scheme.description}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setActiveScheme(scheme)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all active:scale-[0.98]"
                    >
                      <span>Apply Now</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center space-y-4">
                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <X className="text-slate-300" size={24} />
                </div>
                <p className="text-sm text-slate-400 font-medium italic">No matching schemes found for this selection.</p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setSearchTerm('');}}
                  className="text-xs font-bold text-purple-600 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Modal */}
      {activeScheme && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveScheme(null)}></div>
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-200 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-start border-b border-slate-50">
              <div className="flex-1 pr-8">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3 ${getCategoryColor(activeScheme.category)}`}>
                  {activeScheme.category}
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{activeScheme.name}</h2>
              </div>
              <button 
                onClick={() => setActiveScheme(null)}
                className="p-3 bg-slate-100 rounded-2xl text-slate-400 active:scale-90 hover:bg-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-hide">
              <section className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={14} className="text-purple-500" /> About Scheme
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {activeScheme.description}
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Eligibility Criteria
                </h3>
                <div className="space-y-2">
                  {activeScheme.eligibility.map((item, i) => (
                    <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 size={12} />
                      </div>
                      <p className="text-xs text-slate-600 font-bold leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ListOrdered size={14} className="text-blue-500" /> Application Steps
                </h3>
                <div className="space-y-3">
                  {activeScheme.steps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black text-xs border border-blue-100">
                        {i + 1}
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1.5">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <a 
                href={activeScheme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-2 shadow-xl shadow-purple-200 transition-all active:scale-95"
              >
                <span>Visit Official Portal</span>
                <ExternalLink size={20} />
              </a>
              <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-tighter">
                Clicking will open the government registration website
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guide Banner */}
      <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="bg-purple-500 w-12 h-1.5 rounded-full mb-6"></div>
        <h4 className="font-black text-xl mb-2 relative z-10 tracking-tight">Need assistance?</h4>
        <p className="text-sm text-slate-300 opacity-90 leading-relaxed relative z-10">
          Visit your nearest <span className="text-purple-400 font-bold">Krishi Vigyan Kendra (KVK)</span> or CSC with your Aadhaar and Land Records for offline support.
        </p>
      </div>
    </div>
  );
};

export default Schemes;