
import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Camera, Upload, AlertCircle, RefreshCw, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { analyzeCropImage } from '../services/gemini';

interface CropDoctorProps {
  language: Language;
}

const CropDoctor: React.FC<CropDoctorProps> = ({ language }) => {
  const t = TRANSLATIONS[language].cropDoctor;
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ diagnosis: string; treatment: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        performAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const performAnalysis = async (base64: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      // Remove data:image/jpeg;base64, prefix for the API
      const base64Data = base64.split(',')[1];
      const data = await analyzeCropImage(base64Data, language);
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ 
        diagnosis: "Analysis failed", 
        treatment: "Make sure your internet is working and the photo is clear." 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-sm text-slate-500">{t.description}</p>
      </header>

      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-3xl p-12 flex flex-col items-center gap-4 text-center cursor-pointer hover:bg-emerald-100 transition-colors"
        >
          <div className="bg-white p-6 rounded-full shadow-md text-emerald-600">
            <Camera size={48} />
          </div>
          <div>
            <p className="font-bold text-lg text-emerald-900">{t.uploadLabel}</p>
            <p className="text-sm text-emerald-600">Takes less than 10 seconds</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-square">
            <img src={image} alt="Crop" className="w-full h-full object-cover" />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-bold text-lg animate-pulse">{t.analyzing}</p>
                
                {/* Scanning Animation Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
            )}
          </div>

          {result && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6 animate-in slide-in-from-bottom-4">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.diagnosis}</h3>
                  <p className="text-xl font-bold text-slate-900 mt-1">{result.diagnosis}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Sparkles size={18} />
                  <h3 className="font-bold">{t.treatment}</h3>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed">
                  {result.treatment}
                </div>
              </div>

              <button 
                onClick={reset}
                className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200"
              >
                <RefreshCw size={18} />
                Scan Another Plant
              </button>
            </div>
          )}
        </div>
      )}

      {/* Guide Section */}
      {!result && (
        <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4">
          <div className="bg-blue-50 text-blue-500 p-2 rounded-lg shrink-0 h-fit">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">How it works?</h4>
            <p className="text-xs text-slate-500 mt-1">Our AI analyzes patterns on the leaf to detect 50+ diseases common in Indian agriculture.</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CropDoctor;
