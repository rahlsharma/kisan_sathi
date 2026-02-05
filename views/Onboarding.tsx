
import React from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';
import { Sprout } from 'lucide-react';

interface OnboardingProps {
  onSelectLanguage: (lang: Language) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectLanguage }) => {
  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center p-8 bg-emerald-600 text-white overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-700 rounded-full blur-3xl opacity-50 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        <div className="bg-white p-6 rounded-[2rem] mb-8 shadow-2xl shadow-emerald-900/20 transform hover:rotate-6 transition-transform">
          <Sprout size={64} className="text-emerald-600" />
        </div>
        
        <h1 className="text-4xl font-black mb-2 text-center tracking-tight">KisanSathi</h1>
        <p className="text-emerald-100 mb-12 text-center font-medium text-lg opacity-90">Your digital partner for smarter farming</p>
        
        <div className="w-full space-y-4">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest text-center mb-2 opacity-80">Select Language / भाषा चुनें</p>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-95 transition-all rounded-2xl p-5 flex flex-col items-center gap-1 group"
              >
                <span className="text-xl font-bold group-hover:scale-110 transition-transform">{lang.native}</span>
                <span className="text-[10px] uppercase font-bold opacity-60 tracking-wider">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <p className="mt-12 text-[10px] text-emerald-100 opacity-40 text-center max-w-[200px]">
          By continuing, you join thousands of farmers improving their harvest with AI.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;