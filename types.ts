
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn';

export interface UserProfile {
  name: string;
  location: string;
  landSize: string;
  crops: string[];
  notificationsEnabled?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'market' | 'scheme' | 'sell';
  timestamp: number;
  read: boolean;
}

export interface TranslationStrings {
  onboarding: {
    welcome: string;
    selectLanguage: string;
    getStarted: string;
  };
  auth: {
    registerTitle: string;
    fullName: string;
    location: string;
    landSize: string;
    primaryCrops: string;
    submit: string;
  };
  dashboard: {
    greeting: string;
    weather: string;
    tapToSpeak: string;
    marketRates: string;
    govSchemes: string;
    cropDoctor: string;
    forecast: string;
    directSell: string;
  };
  settings: {
    title: string;
    profile: string;
    language: string;
    notifications: string;
    logout: string;
    save: string;
  };
  chat: {
    placeholder: string;
    aiTitle: string;
    expertAdvice: string;
  };
  cropDoctor: {
    title: string;
    description: string;
    uploadLabel: string;
    analyzing: string;
    diagnosis: string;
    treatment: string;
  };
  market: {
    title: string;
    commodity: string;
    price: string;
    location: string;
  };
  marketplace: {
    title: string;
    subtitle: string;
    sellTitle: string;
    buyTitle: string;
    listButton: string;
    pricePerUnit: string;
    quantity: string;
    companyDemands: string;
  };
  schemes: {
    title: string;
    explore: string;
  };
  nav: {
    home: string;
    chat: string;
    doctor: string;
    market: string;
    sell: string;
  };
}

export enum AppView {
  ONBOARDING = 'onboarding',
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  CROP_DOCTOR = 'crop_doctor',
  MARKET = 'market',
  MARKETPLACE = 'marketplace',
  SCHEMES = 'schemes',
  NOTIFICATIONS = 'notifications',
  SETTINGS = 'settings'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  forecast: Array<{ day: string; temp: number; icon: string }>;
}

export interface MandiRate {
  commodity: string;
  price: string;
  market: string;
  change: string;
}
