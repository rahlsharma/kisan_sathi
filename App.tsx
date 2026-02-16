
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

const OPENWEATHER_API_KEY = "357a33c7ce3ea80e52cee9b7af1230f6";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [language, setLanguage] = useState<Language>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);
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
    // Load existing profile from localStorage
    const savedProfile = localStorage.getItem('kisanSathiProfile');
    const savedLang = localStorage.getItem('kisanSathiLang') as Language;
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setView(AppView.DASHBOARD);
    }
    if (savedLang) {
      setLanguage(savedLang);
    }

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

  const handleRegister = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('kisanSathiProfile', JSON.stringify(profile));
    setView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    localStorage.removeItem('kisanSathiProfile');
    localStorage.removeItem('kisanSathiLang');
    setUserProfile(null);
    setView(AppView.ONBOARDING);
  };

  if (view === AppView.ONBOARDING) return <Onboarding onSelectLanguage={handleLanguageSelect} />;
  if (view === AppView.AUTH) return <Auth language={language} onRegister={handleRegister} />;

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
          onUpdateProfile={(p) => { setUserProfile(p); localStorage.setItem('kisanSathiProfile', JSON.stringify(p)); }}
          onUpdateLanguage={handleLanguageSelect}
          onLogout={handleLogout}
          onBack={() => setView(AppView.DASHBOARD)}
        />;
      default:
        return <Dashboard language={language} weather={weather} userProfile={userProfile} notifications={notifications} onAction={handleAction} />;
    }
  };

  return (
    <Layout activeView={view} setActiveView={setView} language={language}>
      {renderView()}
    </Layout>
  );
};

export default App;
