
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
    <>
      {/* Header Spacer for Notch/Safe Area */}
      <div className="pt-safe bg-white" />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-32 scroll-smooth scrollbar-hide">
        {children}
      </main>

      {/* Tactile Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around items-end py-3 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)] z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 min-w-[64px] pb-1 transition-all duration-300 active:scale-90 ${
                isActive ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-emerald-50 scale-110 shadow-sm' : ''}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[11px] font-bold tracking-tight transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Layout;
