
import React from 'react';
import { AppView, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Home, MessageCircle, Stethoscope, BarChart3, ShoppingBag } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  language: Language;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, language }) => {
  const t = TRANSLATIONS[language].nav;

  const navItems = [
    { id: AppView.DASHBOARD, icon: Home, label: t.home },
    { id: AppView.MARKETPLACE, icon: ShoppingBag, label: t.sell },
    { id: AppView.CHAT, icon: MessageCircle, label: t.chat },
    { id: AppView.CROP_DOCTOR, icon: Stethoscope, label: t.doctor },
    { id: AppView.MARKET, icon: BarChart3, label: t.market },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-200 sm:p-4 lg:p-8">
      {/* 
        Responsive Container: 
        - Full screen on mobile (w-full h-screen)
        - Constrained and shadow on desktop (max-w-md sm:rounded-[3rem])
      */}
      <div className="relative flex flex-col w-full max-w-md h-[100dvh] sm:h-[850px] bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden border-slate-100 sm:border-8 border-white">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24 px-5 pt-8 scroll-smooth scrollbar-hide">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center py-4 px-2 safe-area-bottom shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center gap-1.5 min-w-[56px] transition-all duration-300 active:scale-90 ${
                  isActive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-emerald-50' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
