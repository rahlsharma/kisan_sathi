
import React, { useState } from 'react';
import { Language, WeatherData, AppView, UserProfile, Notification } from '../types';
import { TRANSLATIONS } from '../constants';
import { CloudSun, Mic, Stethoscope, BarChart3, BookOpen, AlertCircle, Bell, X, Settings, ShoppingBag, ArrowRight } from 'lucide-react';

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
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Top Profile Bar */}
      <header className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <span className="font-bold text-xl">{userProfile?.name?.[0] || 'F'}</span>
          </div>
          <div>
            <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.greeting},</h2>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {userProfile?.name?.split(' ')[0] || 'Farmer'}! 👋
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 active:scale-95 transition-all shadow-sm"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => onAction(AppView.SETTINGS)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 active:scale-95 shadow-sm"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Weather Card - More Modern & Clean */}
      <section className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t.weather}</p>
              <p className="text-lg font-bold text-slate-100">{weather?.location || 'Detecting...'}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <CloudSun size={32} className="text-emerald-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
              {weather?.temp ?? '--'}°
            </span>
            <div>
              <span className="block text-emerald-400 font-bold text-lg uppercase tracking-tight">{weather?.condition || '...'}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t.forecast}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(weather?.forecast || [
              { day: 'Tue', temp: '--', icon: '☀️' },
              { day: 'Wed', temp: '--', icon: '☀️' },
              { day: 'Thu', temp: '--', icon: '⛅' },
            ]).map((f, idx) => (
              <div key={idx} className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{f.day}</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-bold text-sm">{f.temp !== '--' ? `${f.temp}°` : '--'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Sell Action - Primary Call to Action */}
      <button 
        onClick={() => onAction(AppView.MARKETPLACE)}
        className="w-full bg-emerald-600 rounded-[2rem] p-5 flex items-center justify-between shadow-xl shadow-emerald-200 group active:scale-95 transition-all overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShoppingBag size={80} />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/20 p-3.5 rounded-2xl text-white">
            <ShoppingBag size={28} />
          </div>
          <div className="text-left">
            <p className="text-lg font-black text-white tracking-tight leading-none mb-1">{t.directSell}</p>
            <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest opacity-80">Skip Middlemen • Get Paid More</p>
          </div>
        </div>
        <ArrowRight size={24} className="text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Grid of Bento Actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: AppView.CHAT, icon: Mic, color: 'emerald', label: t.tapToSpeak, desc: 'AI Assistant', primary: true },
          { id: AppView.CROP_DOCTOR, icon: Stethoscope, color: 'orange', label: t.cropDoctor, desc: 'Leaf Scan' },
          { id: AppView.MARKET, icon: BarChart3, color: 'blue', label: t.marketRates, desc: 'Mandi Feed' },
          { id: AppView.SCHEMES, icon: BookOpen, color: 'purple', label: t.govSchemes, desc: 'Govt Subsidy' }
        ].map((action, idx) => (
          <div 
            key={idx}
            onClick={() => onAction(action.id)}
            className={`p-5 rounded-[2rem] border transition-all duration-300 active:scale-95 flex flex-col gap-4 cursor-pointer ${
              action.primary 
                ? 'bg-white border-emerald-100 shadow-lg shadow-emerald-50 col-span-2 flex-row items-center py-6' 
                : 'bg-white border-slate-100 shadow-sm'
            }`}
          >
            <div className={`bg-${action.color}-100 text-${action.color}-600 ${action.primary ? 'w-14 h-14' : 'w-12 h-12'} rounded-2xl flex items-center justify-center transition-transform`}>
              <action.icon size={action.primary ? 30 : 24} />
            </div>
            <div className="text-left">
              <p className={`font-black text-slate-900 ${action.primary ? 'text-lg' : 'text-base'} leading-tight`}>{action.label}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-80">{action.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications Modal Refined */}
      {showNotifications && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNotifications(false)}></div>
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 animate-in slide-in-from-bottom-full duration-400 shadow-2xl relative">
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Updates</h3>
              <button onClick={() => setShowNotifications(false)} className="p-2.5 bg-slate-50 rounded-2xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {notifications.map(n => (
                <div key={n.id} className="flex gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className={`p-3 h-fit rounded-2xl shadow-sm ${
                    n.type === 'weather' ? 'bg-blue-500 text-white' : 
                    n.type === 'market' ? 'bg-orange-500 text-white' : 'bg-purple-500 text-white'
                  }`}>
                    {n.type === 'weather' ? <CloudSun size={18} /> : 
                     n.type === 'market' ? <BarChart3 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div className="space-y-1 pr-2">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{n.title}</p>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{n.message}</p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest pt-1">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
