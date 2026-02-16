import React, { useState, useRef, useEffect } from 'react';
import { Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { Send, Mic, User, Bot, Loader2, StopCircle } from 'lucide-react';
import { getGeminiResponse } from '../services/gemini';

interface ChatProps {
  language: Language;
  initialPrompt?: string;
}

const Chat: React.FC<ChatProps> = ({ language, initialPrompt }) => {
  const t = TRANSLATIONS[language].chat;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Namaste! I am your KisanSathi assistant. How can I help you with your crops today?",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle pre-filled prompt
  useEffect(() => {
    if (initialPrompt) {
      setInputValue(initialPrompt);
      // Wait a tiny bit for UI to settle then send
      const timer = setTimeout(() => handleSend(initialPrompt), 500);
      return () => clearTimeout(timer);
    }
  }, [initialPrompt]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(text, language);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      // Trigger send automatically after short delay
      setTimeout(() => handleSend(transcript), 1000);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-t-3xl overflow-hidden -mt-6">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{t.aiTitle}</h3>
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Online Expert
          </p>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <span className={`text-[10px] mt-1 block opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-emerald-600" />
              <span className="text-sm text-slate-500">Typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 pb-8">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2">
          <button 
            onClick={isListening ? stopListening : startListening}
            className={`transition-colors ${isListening ? 'text-rose-500 animate-pulse' : 'text-slate-400 hover:text-emerald-600'}`}
          >
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : t.placeholder}
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 py-2"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isLoading}
            className={`p-2 rounded-xl transition-colors ${
              inputValue.trim() ? 'bg-emerald-600 text-white' : 'text-slate-300'
            }`}
          >
            <span className="sr-only">Send</span>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;