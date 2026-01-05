
import React from 'react';
import { AppView, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Home, MessageCircle, Stethoscope, BarChart3, Settings } from 'lucide-react';

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
    { id: AppView.CHAT, icon: MessageCircle, label: t.chat },
    { id: AppView.CROP_DOCTOR, icon: Stethoscope, label: t.doctor },
    { id: AppView.MARKET, icon: BarChart3, label: t.market },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-xl overflow-hidden relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-3 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive ? 'text-emerald-600 scale-110' : 'text-slate-400'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
