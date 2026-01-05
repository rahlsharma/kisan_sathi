
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { TRANSLATIONS } from '../constants';
import { User, MapPin, LandPlot, Sprout } from 'lucide-react';

interface AuthProps {
  language: Language;
  onRegister: (profile: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ language, onRegister }) => {
  const t = TRANSLATIONS[language].auth;
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    location: '',
    landSize: '',
    crops: [],
  });
  const [cropsInput, setCropsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.location) {
      onRegister({
        ...formData,
        crops: cropsInput.split(',').map(c => c.trim()).filter(c => c),
      });
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-3xl mb-4">
          <Sprout size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{t.registerTitle}</h1>
        <p className="text-sm text-slate-500">Help us personalize your farming journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <User size={14} /> {t.fullName}
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="e.g. Ramesh Kumar"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <MapPin size={14} /> {t.location}
          </label>
          <input
            required
            type="text"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="e.g. Village, District"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <LandPlot size={14} /> {t.landSize}
            </label>
            <input
              type="number"
              value={formData.landSize}
              onChange={e => setFormData({ ...formData, landSize: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="e.g. 5"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Sprout size={14} /> Crops
            </label>
            <input
              type="text"
              value={cropsInput}
              onChange={e => setCropsInput(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Rice, Wheat..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white font-bold py-5 rounded-3xl mt-6 shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
        >
          {t.submit}
        </button>
      </form>
    </div>
  );
};

export default Auth;
