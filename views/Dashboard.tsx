
import React, { useState } from 'react';
import { Language, WeatherData, AppView, UserProfile, Notification } from '../types';
import { TRANSLATIONS } from '../constants';
import { CloudSun, Mic, Stethoscope, BarChart3, BookOpen, AlertCircle, Bell, X, Settings } from 'lucide-react';

interface DashboardProps {
  language: Language;
  weather: WeatherData | null;
  userProfile: UserProfile | null;
  notifications: Notification[];
  onAction: (view: AppView, extra?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ language, weather, userProfile, notifications, onAction }) => {
  const t = TRANSLATIONS[language].dashboard;
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCropTips = () => {
    const crop = userProfile?.crops[0] || 'crops';
    const loc = userProfile?.location || 'my area';
    const prompt = `Give me 5 expert tips for growing ${crop} in ${loc} considering current farming practices.`;
    onAction(AppView.CHAT, { prompt });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-4">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-slate-400 text-sm font-bold tracking-tight">{t.greeting},</h2>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {userProfile?.name?.split(' ')[0] || 'Farmer'}! 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 active:scale-90 transition-all shadow-sm"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-[-2px] right-[-2px] w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => onAction(AppView.SETTINGS)}
            className="p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-600 active:scale-90 transition-all shadow-sm"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Weather Card */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
        <div className="absolute top-[-20px] right-[-20px] bg-white/10 w-48 h-48 rounded-full blur-3xl transition-transform group-hover:scale-125 duration-1000"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{t.weather}</p>
              <p className="text-xl font-extrabold leading-tight">{weather?.location || userProfile?.location || 'Detecting...'}</p>
            </div>
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-md">
              <CloudSun size={36} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-6xl font-black tracking-tighter">{weather?.temp ?? '--'}°</span>
            <span className="text-emerald-100 font-bold text-lg">{weather?.condition || '...'}</span>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-white/20 pt-6">
            {(weather?.forecast || [
              { day: 'Tomorrow', temp: '--', icon: '☀️' },
              { day: 'Wed', temp: '--', icon: '☀️' },
              { day: 'Thu', temp: '--', icon: '⛅' },
            ]).map((f, idx) => (
              <div key={idx} className="bg-white/10 rounded-2xl p-2 text-center backdrop-blur-sm border border-white/5">
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-tighter mb-1">{f.day}</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-black">{f.temp !== '--' ? `${f.temp}°` : '--'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Voice Action */}
      <button 
        onClick={() => onAction(AppView.CHAT)}
        className="w-full bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-6 flex items-center gap-5 shadow-inner hover:bg-emerald-100 transition-all active:scale-[0.98] duration-150 group"
      >
        <div className="bg-emerald-600 p-4 rounded-full text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
          <Mic size={32} />
        </div>
        <div className="text-left">
          <p className="text-xl font-black text-emerald-900 tracking-tight">{t.tapToSpeak}</p>
          <p className="text-sm font-bold text-emerald-600/80">Ask about {userProfile?.crops[0] || 'crops'} or urea</p>
        </div>
      </button>

      {/* Grid of Actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: AppView.CROP_DOCTOR, icon: Stethoscope, color: 'orange', label: t.cropDoctor, desc: 'Scan leaves' },
          { id: AppView.MARKET, icon: BarChart3, color: 'blue', label: t.marketRates, desc: 'Current rates' },
          { id: AppView.SCHEMES, icon: BookOpen, color: 'purple', label: t.govSchemes, desc: 'Subsidies' },
          { id: AppView.CHAT, icon: AlertCircle, color: 'emerald', label: 'Crop Tips', desc: 'Best practices', action: handleCropTips }
        ].map((action, idx) => (
          <div 
            key={idx}
            onClick={action.action ? action.action : () => onAction(action.id)}
            className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-4 cursor-pointer active:scale-95 hover:border-emerald-200 transition-all duration-200 group"
          >
            <div className={`bg-${action.color}-100 text-${action.color}-600 w-12 h-12 rounded-[1.2rem] flex items-center justify-center group-hover:rotate-12 transition-transform`}>
              <action.icon size={26} />
            </div>
            <div>
              <p className="font-black text-slate-900 leading-tight">{action.label}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{action.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[3rem] p-8 animate-in slide-in-from-bottom-full duration-300 shadow-2xl relative">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Updates</h3>
              <button onClick={() => setShowNotifications(false)} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 active:scale-90">
                <X size={22} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {notifications.map(n => (
                <div key={n.id} className="flex gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className={`p-3 h-fit rounded-2xl shadow-sm ${
                    n.type === 'weather' ? 'bg-blue-500 text-white' : 
                    n.type === 'market' ? 'bg-orange-500 text-white' : 'bg-purple-500 text-white'
                  }`}>
                    {n.type === 'weather' ? <CloudSun size={20} /> : 
                     n.type === 'market' ? <BarChart3 size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-slate-900 text-sm leading-tight">{n.title}</p>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-1">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setShowNotifications(false)}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] mt-8 active:scale-95 transition-all shadow-xl shadow-slate-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
