import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic } from 'lucide-react';
import { speak, subscribeSpeakingStatus, stopSpeaking } from '../lib/ttsService';

interface VoiceReadButtonProps {
  textToSpeak: string;
  label: string;
  sublabel?: string;
  variant?: 'banner' | 'compact' | 'pill';
  title?: string;
  className?: string;
}

export const VoiceReadButton: React.FC<VoiceReadButtonProps> = ({
  textToSpeak,
  label,
  sublabel,
  variant = 'compact',
  title,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return subscribeSpeakingStatus(setIsSpeaking);
  }, []);

  const handleToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(textToSpeak);
    }
  };

  if (variant === 'banner') {
    return (
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer ${className}`}
        title={title || label}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isSpeaking ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-600'}`}>
            {isSpeaking ? <Volume2 className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-950">{label}</h3>
            {sublabel && <p className="text-xs text-stone-500">{sublabel}</p>}
          </div>
        </div>
        <div className="text-xs font-bold text-orange-600 px-4 py-2 rounded-xl bg-orange-50 border border-orange-100">
          {isSpeaking ? 'रुकें (Stop)' : 'सुनें (Listen)'}
        </div>
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={handleToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
          isSpeaking
            ? 'bg-orange-500 text-white animate-pulse'
            : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
        } ${className}`}
        title={title || label}
      >
        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
        isSpeaking ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
      } ${className}`}
      title={title || label}
    >
      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      {label && <span className="text-xs font-bold">{label}</span>}
    </button>
  );
};
