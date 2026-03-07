
import React, { useState, useEffect } from 'react';
import { AppView, Language, UserProfile, WeatherData, Notification } from './types';
import { TRANSLATIONS } from './constants';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Chat from './views/Chat';
import CropDoctor from './views/CropDoctor';
import MarketRates from './views/MarketRates';
import Marketplace from './views/Marketplace';
import Schemes from './views/Schemes';
import Onboarding from './views/Onboarding';
import Auth from './views/Auth';
import Settings from './views/Settings';
import { MockBackend } from './services/api';

const OPENWEATHER_API_KEY = "357a33c7ce3ea80e52cee9b7af1230f6";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [language, setLanguage] = useState<Language>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);
  const [isSyncing, setIsSyncing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Weather Alert',
      message: 'Heavy rain expected tomorrow. Protect your harvested crops.',
      type: 'weather',
      timestamp: Date.now() - 3600000,
      read: false
    },
    {
      id: '2',
      title: 'Market Update',
      message: 'Tomato prices in your nearby Mandi rose by 15% today!',
      type: 'market',
      timestamp: Date.now() - 7200000,
      read: false
    }
  ]);

  useEffect(() => {
    const initApp = async () => {
      setIsSyncing(true);
      // Load existing profile from our Mock Backend
      const profile = await MockBackend.getProfile();
      const savedLang = localStorage.getItem('kisanSathiLang') as Language;
      
      if (profile) {
        setUserProfile(profile);
        setView(AppView.DASHBOARD);
      }
      if (savedLang) {
        setLanguage(savedLang);
      }
      setIsSyncing(false);
    };

    initApp();

    // Request location for real weather
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback if location denied - New Delhi
          fetchWeather(28.6139, 77.2090);
        }
      );
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const currentData = await currentRes.json();
      
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const forecastData = await forecastRes.json();

      const dailyForecast = forecastData.list.filter((_: any, idx: number) => idx % 8 === 0).slice(1, 4).map((item: any) => {
        const date = new Date(item.dt * 1000);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          icon: item.weather[0].main === 'Rain' ? '🌧️' : item.weather[0].main === 'Clouds' ? '⛅' : '☀️'
        };
      });

      setWeather({
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        location: currentData.name || userProfile?.location || 'Nearby',
        forecast: dailyForecast
      });
    } catch (error) {
      console.error("Weather fetch failed", error);
    }
  };

  const handleAction = (v: AppView, extra?: any) => {
    if (extra?.prompt) {
      setChatPrompt(extra.prompt);
    } else {
      setChatPrompt(undefined);
    }
    setView(v);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('kisanSathiLang', lang);
    if (userProfile) {
      setView(AppView.DASHBOARD);
    } else {
      setView(AppView.AUTH);
    }
  };

  const handleRegister = async (profile: UserProfile) => {
    setIsSyncing(true);
    await MockBackend.saveProfile(profile);
    setUserProfile(profile);
    setView(AppView.DASHBOARD);
    setIsSyncing(false);
  };

  const handleLogout = async () => {
    await MockBackend.clearProfile();
    setUserProfile(null);
    setView(AppView.ONBOARDING);
  };

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return <Dashboard language={language} weather={weather} userProfile={userProfile} notifications={notifications} onAction={handleAction} />;
      case AppView.CHAT:
        return <Chat language={language} initialPrompt={chatPrompt} />;
      case AppView.CROP_DOCTOR:
        return <CropDoctor language={language} />;
      case AppView.MARKET:
        return <MarketRates language={language} location={userProfile?.location} />;
      case AppView.MARKETPLACE:
        return <Marketplace language={language} userProfile={userProfile} />;
      case AppView.SCHEMES:
        return <Schemes language={language} userProfile={userProfile} />;
      case AppView.SETTINGS:
        return <Settings 
          language={language}
          userProfile={userProfile}
          onUpdateProfile={async (p) => { 
            setIsSyncing(true);
            await MockBackend.saveProfile(p);
            setUserProfile(p);
            setIsSyncing(false);
          }}
          onUpdateLanguage={handleLanguageSelect}
          onLogout={handleLogout}
          onBack={() => setView(AppView.DASHBOARD)}
        />;
      default:
        return <Dashboard language={language} weather={weather} userProfile={userProfile} notifications={notifications} onAction={handleAction} />;
    }
  };

  return (
    <div className="flex justify-center bg-slate-100 min-h-screen">
      <div className="relative flex flex-col w-full max-w-lg h-[100dvh] bg-white sm:shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden">
        {view === AppView.ONBOARDING ? (
          <Onboarding onSelectLanguage={handleLanguageSelect} />
        ) : view === AppView.AUTH ? (
          <div className="flex-1 overflow-y-auto pt-safe px-4 pt-4 pb-8 scrollbar-hide">
            <Auth language={language} onRegister={handleRegister} isLoading={isSyncing} />
          </div>
        ) : (
          <Layout activeView={view} setActiveView={setView} language={language}>
            {/* Cloud Sync Status */}
            {isSyncing && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-emerald-100 z-[200] flex items-center gap-2 animate-in fade-in zoom-in-95">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Syncing with Backend...</span>
              </div>
            )}
            {renderView()}
          </Layout>
        )}
      </div>
    </div>
  );
};

export default App;
