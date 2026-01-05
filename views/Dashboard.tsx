
import React, { useState } from 'react';
import { Language, WeatherData, AppView, UserProfile, Notification } from '../types';
import { TRANSLATIONS } from '../constants';
import { CloudSun, Mic, Stethoscope, BarChart3, BookOpen, AlertCircle, Bell, X, Settings } from 'lucide-react';

interface DashboardProps {
  language: Language;
  weather: WeatherData | null;
  userProfile: UserProfile | null;
  notifications: Notification[];
  onAction: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ language, weather, userProfile, notifications, onAction }) => {
  const t = TRANSLATIONS[language].dashboard;
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-slate-400 text-sm font-medium">{t.greeting},</h2>
          <h1 className="text-2xl font-bold text-slate-900">{userProfile?.name || 'Farmer'}! 👋</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 bg-slate-100 rounded-full text-slate-600 active:scale-95 transition-transform"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => onAction(AppView.SETTINGS)}
            className="p-2 bg-slate-100 rounded-full text-slate-600 active:scale-95 transition-transform"
          >
            <Settings size={20} />
          </button>

          <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold border-2 border-emerald-50">
            {userProfile?.name ? userProfile.name.charAt(0) : 'KS'}
          </div>
        </div>
      </header>

      {/* Weather Card */}
      <section className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] bg-white/10 w-40 h-40 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t.weather}</p>
              <p className="text-lg font-bold">{weather?.location || userProfile?.location || 'Detecting...'}</p>
            </div>
            <CloudSun size={32} />
          </div>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-5xl font-bold">{weather?.temp ?? '--'}°C</span>
            <span className="text-emerald-100 mb-2">{weather?.condition || '...'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4">
            {(weather?.forecast || [
              { day: 'Tomorrow', temp: '--', icon: '☀️' },
              { day: 'Wed', temp: '--', icon: '☀️' },
              { day: 'Thu', temp: '--', icon: '⛅' },
            ]).map((f, idx) => (
              <div key={idx} className="text-center">
                <p className="text-[10px] text-emerald-100 mb-1">{f.day}</p>
                <div className="flex items-center justify-center gap-1">
                  <span>{f.icon}</span>
                  <span className="font-bold">{f.temp !== '--' ? `${f.temp}°` : '--'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary Voice Action */}
      <button 
        onClick={() => onAction(AppView.CHAT)}
        className="w-full bg-white border-2 border-slate-50 rounded-3xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow group active:scale-95 duration-150"
      >
        <div className="bg-emerald-100 p-4 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Mic size={32} />
        </div>
        <div className="text-left">
          <p className="text-lg font-bold text-slate-900">{t.tapToSpeak}</p>
          <p className="text-sm text-slate-500">Ask about {userProfile?.crops[0] || 'crops'} or fertilizers</p>
        </div>
      </button>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => onAction(AppView.CROP_DOCTOR)}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 cursor-pointer active:scale-95 duration-150"
        >
          <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <Stethoscope size={24} />
          </div>
          <p className="font-bold text-slate-900">{t.cropDoctor}</p>
          <p className="text-[10px] text-slate-500">Scan leaves for disease</p>
        </div>

        <div 
          onClick={() => onAction(AppView.MARKET)}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 cursor-pointer active:scale-95 duration-150"
        >
          <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <p className="font-bold text-slate-900">{t.marketRates}</p>
          <p className="text-[10px] text-slate-500">Prices in {userProfile?.location.split(',')[0] || 'your area'}</p>
        </div>

        <div 
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 cursor-pointer active:scale-95 duration-150"
        >
          <div className="bg-purple-100 text-purple-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <p className="font-bold text-slate-900">{t.govSchemes}</p>
          <p className="text-[10px] text-slate-500">Subsidy & help news</p>
        </div>

        <div 
          className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex flex-col gap-3 cursor-pointer group"
        >
          <div className="bg-emerald-100 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <p className="font-bold text-emerald-900">Crop Tips</p>
          <p className="text-[10px] text-emerald-700">Guide for {userProfile?.crops[0] || 'your crops'}</p>
        </div>
      </div>

      {/* Notifications Overlay */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {notifications.map(n => (
                <div key={n.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`p-2 h-fit rounded-lg ${
                    n.type === 'weather' ? 'bg-blue-100 text-blue-600' : 
                    n.type === 'market' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {n.type === 'weather' ? <CloudSun size={18} /> : 
                     n.type === 'market' ? <BarChart3 size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">{n.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-400">{new Date(n.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Bell size={40} className="mx-auto mb-2 opacity-20" />
                  <p>All caught up!</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setShowNotifications(false)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl mt-6 active:scale-95 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
