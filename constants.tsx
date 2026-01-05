
import React from 'react';
import { TranslationStrings, Language } from './types';

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    onboarding: {
      welcome: "Welcome to KisanSathi",
      selectLanguage: "Choose your language",
      getStarted: "Start Farming Better"
    },
    auth: {
      registerTitle: "Farmer Registration",
      fullName: "Full Name",
      location: "Village/District",
      landSize: "Land Size (Acres)",
      primaryCrops: "Primary Crops (e.g. Rice, Wheat)",
      submit: "Register & Continue"
    },
    dashboard: {
      greeting: "Hello",
      weather: "Current Weather",
      tapToSpeak: "Tap to Speak with AI",
      marketRates: "Mandi Rates",
      govSchemes: "Govt Schemes",
      cropDoctor: "Crop Doctor",
      forecast: "3-Day Forecast"
    },
    settings: {
      title: "Settings",
      profile: "Farmer Profile",
      language: "App Language",
      notifications: "Alert Notifications",
      logout: "Sign Out",
      save: "Update Profile"
    },
    chat: {
      placeholder: "Ask anything about farming...",
      aiTitle: "KisanSathi AI Assistant",
      expertAdvice: "Expert Advice"
    },
    cropDoctor: {
      title: "Crop Doctor",
      description: "Take a photo of a leaf to identify diseases",
      uploadLabel: "Scan Leaf",
      analyzing: "Analyzing with AI...",
      diagnosis: "AI Diagnosis",
      treatment: "Treatment Plan"
    },
    market: {
      title: "Mandi Rates",
      commodity: "Commodity",
      price: "Rate/Quintal",
      location: "Market"
    },
    schemes: {
      title: "Government Schemes",
      explore: "Explore Benefits"
    },
    nav: {
      home: "Home",
      chat: "Chat",
      doctor: "Doctor",
      market: "Market"
    }
  },
  hi: {
    onboarding: {
      welcome: "किसानसाथी में आपका स्वागत है",
      selectLanguage: "अपनी भाषा चुनें",
      getStarted: "बेहतर खेती शुरू करें"
    },
    auth: {
      registerTitle: "किसान पंजीकरण",
      fullName: "पूरा नाम",
      location: "गाँव/ज़िला",
      landSize: "भूमि का आकार (एकड़)",
      primaryCrops: "मुख्य फसलें (जैसे चावल, गेहूं)",
      submit: "पंजीकरण करें और जारी रखें"
    },
    dashboard: {
      greeting: "नमस्ते",
      weather: "वर्तमान मौसम",
      tapToSpeak: "AI से बात करने के लिए टैप करें",
      marketRates: "मंडी भाव",
      govSchemes: "सरकारी योजनाएं",
      cropDoctor: "फसल डॉक्टर",
      forecast: "3-दिन का पूर्वानुमान"
    },
    settings: {
      title: "सेटिंग्स",
      profile: "किसान प्रोफाइल",
      language: "ऐप की भाषा",
      notifications: "अलर्ट सूचनाएं",
      logout: "साइन आउट",
      save: "प्रोफ़ाइल अपडेट करें"
    },
    chat: {
      placeholder: "खेती के बारे में कुछ भी पूछें...",
      aiTitle: "किसानसाथी AI सहायक",
      expertAdvice: "विशेषज्ञ सलाह"
    },
    cropDoctor: {
      title: "फसल डॉक्टर",
      description: "रोगों की पहचान के लिए पत्ती की फोटो लें",
      uploadLabel: "पत्ती स्कैन करें",
      analyzing: "AI विश्लेषण कर रहा है...",
      diagnosis: "AI निदान",
      treatment: "उपचार योजना"
    },
    market: {
      title: "मंडी भाव",
      commodity: "वस्तु",
      price: "दर/क्विंटल",
      location: "बाजार"
    },
    schemes: {
      title: "सरकारी योजनाएं",
      explore: "लाभ देखें"
    },
    nav: {
      home: "मुख्य",
      chat: "चैट",
      doctor: "डॉक्टर",
      market: "बाजार"
    }
  },
  ta: {
    onboarding: {
      welcome: "கிசான்சாத்திக்கு வரவேற்கிறோம்",
      selectLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
      getStarted: "சிறந்த விவசாயத்தைத் தொடங்குங்கள்"
    },
    auth: {
      registerTitle: "விவசாயி பதிவு",
      fullName: "முழு பெயர்",
      location: "கிராமம்/மாவட்டம்",
      landSize: "நிலத்தின் அளவு (ஏக்கர்)",
      primaryCrops: "முக்கிய பயிர்கள் (உதாரணம்: நெல், கோதுமை)",
      submit: "பதிவு செய்து தொடரவும்"
    },
    dashboard: {
      greeting: "வணக்கம்",
      weather: "தற்போதைய வானிலை",
      tapToSpeak: "AI உடன் பேச தட்டவும்",
      marketRates: "மண்டி விலைகள்",
      govSchemes: "அரசு திட்டங்கள்",
      cropDoctor: "பயிர் மருத்துவர்",
      forecast: "3 நாள் முன்னறிவிப்பு"
    },
    settings: {
      title: "அமைப்புகள்",
      profile: "விவசாயி சுயவிவரம்",
      language: "பயன்பாட்டு மொழி",
      notifications: "அறிவிப்புகள்",
      logout: "வெளியேறு",
      save: "சுயவிவரத்தைப் புதுப்பிக்கவும்"
    },
    chat: {
      placeholder: "விவசாயம் பற்றி எதையும் கேளுங்கள்...",
      aiTitle: "கிசான்சாத்தி AI உதவியாளர்",
      expertAdvice: "நிபுணர் ஆலோசனை"
    },
    cropDoctor: {
      title: "பயிர் மருத்துவர்",
      description: "நோய்களைக் கண்டறிய இலை புகைப்படத்தை எடுக்கவும்",
      uploadLabel: "இலையை ஸ்கேன் செய்க",
      analyzing: "AI பகுப்பாய்வு செய்கிறது...",
      diagnosis: "AI கண்டறிதல்",
      treatment: "சிகிச்சை திட்டம்"
    },
    market: {
      title: "மண்டி விலைகள்",
      commodity: "பொருள்",
      price: "விலை/குவிண்டால்",
      location: "சந்தை"
    },
    schemes: {
      title: "அரசு திட்டங்கள்",
      explore: "பலன்களை ஆராயுங்கள்"
    },
    nav: {
      home: "முகப்பு",
      chat: "அரட்டை",
      doctor: "மருத்துவர்",
      market: "சந்தை"
    }
  },
  te: {
    onboarding: {
      welcome: "కిసాన్ సాథికి స్వాగతం",
      selectLanguage: "మీ భాషను ఎంచుకోండి",
      getStarted: "మెరుగైన వ్యవసాయాన్ని ప్రారంభించండి"
    },
    auth: {
      registerTitle: "రైతు నమోదు",
      fullName: "పూర్తి పేరు",
      location: "గ్రామం/జిల్లా",
      landSize: "భూమి పరిమాణం (ఎకరాలు)",
      primaryCrops: "ప్రధాన పంటలు (ఉదా. వరి, గోధుమలు)",
      submit: "నమోదు చేసి కొనసాగించండి"
    },
    dashboard: {
      greeting: "నమస్కారం",
      weather: "ప్రస్తుత వాతావరణం",
      tapToSpeak: "AI తో మాట్లాడటానికి నొక్కండి",
      marketRates: "మార్కెట్ ధరలు",
      govSchemes: "ప్రభుత్వ పథకాలు",
      cropDoctor: "పంట డాక్టర్",
      forecast: "3 రోజుల వాతావరణం"
    },
    settings: {
      title: "సెట్టింగులు",
      profile: "రైతు ప్రొఫైల్",
      language: "యాప్ భాష",
      notifications: "నోటిఫికేషన్లు",
      logout: "లాగ్ అవుట్",
      save: "ప్రొఫైల్ అప్‌డేట్ చేయండి"
    },
    chat: {
      placeholder: "వ్యవసాయం గురించి ఏదైనా అడగండి...",
      aiTitle: "కిసాన్ సాథి AI అసిస్టెంట్",
      expertAdvice: "నిపుణుల సలహా"
    },
    cropDoctor: {
      title: "పంట డాక్టర్",
      description: "వ్యాధులను గుర్తించడానికి ఆకు ఫోటో తీయండి",
      uploadLabel: "ఆకును స్కాన్ చేయండి",
      analyzing: "AI విశ్లేషిస్తోంది...",
      diagnosis: "AI నిర్ధారణ",
      treatment: "చికిత్స ప్రణాళిక"
    },
    market: {
      title: "మార్కెట్ ధరలు",
      commodity: "వస్తువు",
      price: "ధర/క్వింటాల్",
      location: "మార్కెట్"
    },
    schemes: {
      title: "ప్రభుత్వ పథకాలు",
      explore: "ప్రయోజనాలను చూడండి"
    },
    nav: {
      home: "హోమ్",
      chat: "చాట్",
      doctor: "డాక్టర్",
      market: "మార్కెట్"
    }
  },
  kn: {
    onboarding: {
      welcome: "ಕಿಸಾನ್‌ಸಾಥಿಗೆ ಸುಸ್ವಾಗತ",
      selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
      getStarted: "ಉತ್ತಮ ಕೃಷಿ ಆರಂಭಿಸಿ"
    },
    auth: {
      registerTitle: "ರೈತರ ನೋಂದಣಿ",
      fullName: "ಪೂರ್ಣ ಹೆಸರು",
      location: "ಗ್ರಾಮ/ಜಿಲ್ಲೆ",
      landSize: "ಭೂಮಿಯ ಗಾತ್ರ (ಎಕರೆ)",
      primaryCrops: "ಪ್ರಾಥಮಿಕ ಬೆಳೆಗಳು (ಉದಾ. ಅಕ್ಕಿ, ಗೋಧಿ)",
      submit: "ನೋಂದಾಯಿಸಿ ಮತ್ತು ಮುಂದುವರಿಯಿರಿ"
    },
    dashboard: {
      greeting: "ನಮಸ್ಕಾರ",
      weather: "ಪ್ರಸ್ತುತ ಹವಾಮಾನ",
      tapToSpeak: "AI ನೊಂದಿಗೆ ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
      marketRates: "ಮಾರುಕಟ್ಟೆ ದರಗಳು",
      govSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      cropDoctor: "ಬೆಳೆ ವೈದ್ಯ",
      forecast: "3 ದಿನಗಳ ಮುನ್ಸೂಚನೆ"
    },
    settings: {
      title: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      profile: "ರೈತರ ವಿವರ",
      language: "ಭಾಷೆ",
      notifications: "ಸೂಚನೆಗಳು",
      logout: "ಲಾಗ್ ಔಟ್",
      save: "ವಿವರ ನವೀಕರಿಸಿ"
    },
    chat: {
      placeholder: "ಕೃಷಿಯ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
      aiTitle: "ಕಿಸಾನ್‌ಸಾಥಿ AI ಸಹಾಯಕಿ",
      expertAdvice: "ತಜ್ಞರ ಸಲಹೆ"
    },
    cropDoctor: {
      title: "ಬೆಳೆ ವೈದ್ಯ",
      description: "ರೋಗಗಳನ್ನು ಗುರುತಿಸಲು ಎಲೆಯ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
      uploadLabel: "ಎಲೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
      analyzing: "AI ವಿಲೇಷಿಸುತ್ತಿದೆ...",
      diagnosis: "AI ರೋಗನಿರ್ಣಯ",
      treatment: "ಚಿಕಿತ್ಸಾ ಕ್ರಮಗಳು"
    },
    market: {
      title: "ಮಾರುಕಟ್ಟೆ ದರಗಳು",
      commodity: "ಸರಕು",
      price: "ದರ/ಕ್ವಿಂಟಲ್",
      location: "ಮಾರುಕಟ್ಟೆ"
    },
    schemes: {
      title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      explore: "ಪ್ರಯೋಜನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ"
    },
    nav: {
      home: "ಮುಖಪುಟ",
      chat: "ಚಾಟ್",
      doctor: "ವೈದ್ಯ",
      market: "ಮಾರುಕಟ್ಟೆ"
    }
  }
};

export const LANGUAGES: Array<{ code: Language; label: string; native: string }> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const COMMODITIES = [
  { name: 'Wheat', price: '₹2,450', market: 'Chandigarh', change: '+2.5%' },
  { name: 'Rice (Basmati)', price: '₹4,800', market: 'Amritsar', change: '-1.2%' },
  { name: 'Tomato', price: '₹1,200', market: 'Nashik', change: '+15.0%' },
  { name: 'Cotton', price: '₹7,100', market: 'Nagpur', change: '+0.8%' },
  { name: 'Onion', price: '₹1,850', market: 'Lasalgaon', change: '-3.4%' },
];
