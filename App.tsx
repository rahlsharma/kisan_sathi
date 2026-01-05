
import React, { useState, useEffect } from 'react';
import { AppView, Language, UserProfile, WeatherData, Notification } from './types';
import { TRANSLATIONS, LANGUAGES } from './constants';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Chat from './views/Chat';
import CropDoctor from './views/CropDoctor';
import MarketRates from './views/MarketRates';
import Onboarding from './views/Onboarding';
import Auth from './views/Auth';
import Settings from './views/Settings';

const OPENWEATHER_API_KEY = "357a33c7ce3ea80e52cee9b7af1230f6";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [language, setLanguage] = useState<Language>('en');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
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
          // Fallback if location denied - Default to a central location like New Delhi
          fetchWeather(28.6139, 77.2090);
        }
      );
    }
  }, []);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      // Fetch current weather
      const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const currentData = await currentRes.json();
      
      // Fetch forecast
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`);
      const forecastData = await forecastRes.json();

      // Process forecast to get daily approx (every 8th item for 24h intervals)
      const dailyForecast = forecastData.list.filter((_: any, idx: number) => idx % 8 === 0).slice(1, 4).map((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        return {
          day: dayName,
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

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('kisanSathiProfile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    localStorage.removeItem('kisanSathiProfile');
    localStorage.removeItem('kisanSathiLang');
    setUserProfile(null);
    setView(AppView.ONBOARDING);
  };

  if (view === AppView.ONBOARDING) {
    return <Onboarding onSelectLanguage={handleLanguageSelect} />;
  }

  if (view === AppView.AUTH) {
    return <Auth language={language} onRegister={handleRegister} />;
  }

  const renderView = () => {
    switch (view) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            language={language} 
            weather={weather} 
            userProfile={userProfile}
            notifications={notifications}
            onAction={(v) => setView(v)} 
          />
        );
      case AppView.CHAT:
        return <Chat language={language} />;
      case AppView.CROP_DOCTOR:
        return <CropDoctor language={language} />;
      case AppView.MARKET:
        return <MarketRates language={language} />;
      case AppView.SETTINGS:
        return (
          <Settings 
            language={language}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onUpdateLanguage={handleLanguageSelect}
            onLogout={handleLogout}
            onBack={() => setView(AppView.DASHBOARD)}
          />
        );
      default:
        return <Dashboard language={language} weather={weather} userProfile={userProfile} notifications={notifications} onAction={(v) => setView(v)} />;
    }
  };

  return (
    <Layout activeView={view} setActiveView={setView} language={language}>
      {renderView()}
    </Layout>
  );
};

export default App;
