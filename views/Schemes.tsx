
import React, { useState, useEffect, useMemo } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { BookOpen, ExternalLink, Search, Loader2, Sparkles, ShieldCheck, X } from 'lucide-react';
import { getGovernmentSchemes } from '../services/gemini';

interface SchemesProps {
  language: Language;
  userProfile: UserProfile | null;
}

const Schemes: React.FC<SchemesProps> = ({ language, userProfile }) => {
  const t = TRANSLATIONS[language].schemes;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<{ text: string; sources: Array<{title: string, url: string}> } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await getGovernmentSchemes(
        userProfile?.location || "India",
        userProfile?.crops || ["General Agriculture"],
        language
      );
      setData(res);
      setLoading(false);
    };
    fetch();
  }, [language, userProfile]);

  const filteredSources = useMemo(() => {
    if (!data?.sources) return [];
    if (!searchTerm.trim()) return data.sources;
    
    const lowerSearch = searchTerm.toLowerCase();
    return data.sources.filter(source => 
      source.title.toLowerCase().includes(lowerSearch) || 
      source.url.toLowerCase().includes(lowerSearch)
    );
  }, [data?.sources, searchTerm]);

  // Simple heuristic to "filter" the AI text by splitting it into paragraphs/bullets
  const filteredTextParts = useMemo(() => {
    if (!data?.text) return [];
    const parts = data.text.split('\n\n');
    if (!searchTerm.trim()) return parts;

    const lowerSearch = searchTerm.toLowerCase();
    return parts.filter(part => part.toLowerCase().includes(lowerSearch));
  }, [data?.text, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-sm text-slate-500">Latest benefits for {userProfile?.location.split(',')[0] || 'your area'}</p>
        </div>
        <div className="bg-purple-100 text-purple-600 p-2 rounded-xl shadow-sm">
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
          placeholder="Filter schemes (e.g. Insurance, PM-Kisan)..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-200 shadow-sm transition-all"
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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4 text-purple-500" />
          <p className="text-sm font-medium animate-pulse">Searching active schemes...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* AI Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-3 opacity-10">
               <Sparkles size={40} className="text-purple-600" />
             </div>
             <div className="flex items-center gap-2 text-purple-600 mb-4">
               <ShieldCheck size={18} />
               <span className="text-xs font-bold uppercase tracking-wider">AI Curated Benefits</span>
             </div>
             
             {filteredTextParts.length > 0 ? (
               <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-wrap space-y-4">
                 {filteredTextParts.map((part, idx) => (
                   <p key={idx}>{part}</p>
                 ))}
               </div>
             ) : (
               <div className="text-center py-8 text-slate-400 italic text-sm">
                 No matching descriptions found for "{searchTerm}"
               </div>
             )}
          </div>

          {/* Source Links (Grounding) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-sm font-bold text-slate-900">Official Portals</h3>
              {searchTerm && (
                <span className="text-[10px] font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                  {filteredSources.length} Results
                </span>
              )}
            </div>
            
            {filteredSources.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {filteredSources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between group hover:bg-purple-50 transition-all border border-purple-100/50 active:scale-[0.98]"
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-xs font-bold text-purple-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
                        {source.title || "Scheme Portal"}
                      </p>
                      <p className="text-[10px] text-purple-600 truncate opacity-70">{source.url}</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:shadow transition-all">
                      <ExternalLink size={14} className="text-purple-400 group-hover:text-purple-600" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                <p className="text-sm text-slate-400">No matching official portals found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guide Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <h4 className="font-bold mb-1 relative z-10">Need help applying?</h4>
        <p className="text-xs text-purple-100 opacity-90 leading-relaxed relative z-10">
          Visit your nearest Krishi Vigyan Kendra (KVK) with your Aadhaar and Land Records for physical verification.
        </p>
      </div>
    </div>
  );
};

export default Schemes;
