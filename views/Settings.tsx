
import React, { useState } from 'react';
import { Language, UserProfile, AppView } from '../types';
import { TRANSLATIONS, LANGUAGES } from '../constants';
import { User, MapPin, LandPlot, Sprout, Bell, Globe, LogOut, ChevronLeft, Save } from 'lucide-react';

interface SettingsProps {
  language: Language;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateLanguage: (lang: Language) => void;
  onLogout: () => void;
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  language, 
  userProfile, 
  onUpdateProfile, 
  onUpdateLanguage, 
  onLogout, 
  onBack 
}) => {
  const t = TRANSLATIONS[language].settings;
  const authT = TRANSLATIONS[language].auth;
  
  const [formData, setFormData] = useState<UserProfile>(userProfile || {
    name: '',
    location: '',
    landSize: '',
    crops: [],
    notificationsEnabled: true
  });
  const [cropsInput, setCropsInput] = useState(userProfile?.crops.join(', ') || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const updatedProfile = {
      ...formData,
      crops: cropsInput.split(',').map(c => c.trim()).filter(c => c),
    };
    onUpdateProfile(updatedProfile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 -mt-6 rounded-t-3xl overflow-hidden animate-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="bg-white px-6 py-6 border-b border-slate-100 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-full text-slate-400">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-slate-900">{t.title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        {/* Profile Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <User size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider">{t.profile}</h3>
          </div>
          
          <div className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{authT.fullName}</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{authT.location}</label>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">{authT.landSize}</label>
                <input
                  type="number"
                  value={formData.landSize}
                  onChange={e => setFormData({ ...formData, landSize: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Crops</label>
                <input
                  type="text"
                  value={cropsInput}
                  onChange={e => setCropsInput(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all ${
                isSaved ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-600 text-white active:scale-95'
              }`}
            >
              {isSaved ? <Globe size={18} className="animate-pulse" /> : <Save size={18} />}
              {isSaved ? 'Updated!' : t.save}
            </button>
          </div>
        </section>

        {/* Language Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Globe size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider">{t.language}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onUpdateLanguage(lang.code)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                  language === lang.code 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' 
                    : 'bg-white border-slate-100 text-slate-600'
                }`}
              >
                <span className="text-base">{lang.native}</span>
                <span className="text-[10px] opacity-60 uppercase tracking-tighter">{lang.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notification Toggle */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Bell size={16} />
            <h3 className="text-xs font-bold uppercase tracking-wider">{t.notifications}</h3>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-900">Push Notifications</p>
              <p className="text-[10px] text-slate-500">Receive weather and mandi alerts</p>
            </div>
            <button 
              onClick={() => setFormData({...formData, notificationsEnabled: !formData.notificationsEnabled})}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Logout Section */}
        <section className="pt-4">
          <button 
            onClick={onLogout}
            className="w-full bg-rose-50 text-rose-600 font-bold py-5 rounded-3xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <LogOut size={20} />
            {t.logout}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
