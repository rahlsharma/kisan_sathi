
import React from 'react';
import { Language } from '../types';
import { LANGUAGES, TRANSLATIONS } from '../constants';
import { Sprout } from 'lucide-react';

interface OnboardingProps {
  onSelectLanguage: (lang: Language) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onSelectLanguage }) => {
  return (
    <div className="h-screen max-w-md mx-auto bg-emerald-600 flex flex-col items-center justify-center p-8 text-white">
      <div className="bg-white p-6 rounded-full mb-8 shadow-2xl">
        <Sprout size={64} className="text-emerald-600" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2 text-center">KisanSathi</h1>
      <p className="text-emerald-100 mb-12 text-center font-medium">Your digital partner for smarter farming</p>
      
      <div className="w-full space-y-3">
        <p className="text-sm font-semibold text-emerald-100 uppercase tracking-wider mb-2">Select Language / भाषा चुनें</p>
        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className="bg-white/10 border border-white/20 hover:bg-white/20 transition-all rounded-xl p-4 flex flex-col items-center gap-1 group"
            >
              <span className="text-lg font-bold group-hover:scale-110 transition-transform">{lang.native}</span>
              <span className="text-xs opacity-70">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <p className="mt-12 text-xs text-emerald-100 opacity-60 text-center">
        By continuing, you agree to improve your harvest with AI.
      </p>
    </div>
  );
};

export default Onboarding;
