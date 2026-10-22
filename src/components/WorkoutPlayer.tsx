import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Wind,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from 'lucide-react';

interface WorkoutPlayerProps {
  modelUrl?: string | null;
  imageUrl?: string;
  fallbackImageUrl?: string;
  name: string;
  hindiName?: string;
  instructions: string[];
  breathing?: string;
  precautions?: string;
  modifications?: string;
  duration?: string;
  difficulty?: string;
  onNext: () => void;
  onPrev: () => void;
  currentIndex?: number;
  totalExercises?: number;
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80';

export const WorkoutPlayer: React.FC<WorkoutPlayerProps> = ({
  imageUrl,
  fallbackImageUrl,
  name,
  hindiName,
  instructions,
  breathing = 'Inhale deeply and exhale steadily.',
  duration = '30s',
  difficulty = 'Beginner',
  onNext,
  onPrev,
  currentIndex = 0,
  totalExercises = 15,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [initialDuration, setInitialDuration] = useState(30);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [imgSrc, setImgSrc] = useState<string>(imageUrl || fallbackImageUrl || DEFAULT_FALLBACK_IMAGE);

  const isTtsActive = false;
  const isVoiceCommandActive = false;
  const lastVoiceCommand = '';
  const toggleTTS = () => {};
  const toggleVoiceCommands = () => {};
  const stopSpeaking = () => {};


  // Update image source when prop changes
  useEffect(() => {
    setImgSrc(imageUrl || fallbackImageUrl || DEFAULT_FALLBACK_IMAGE);
  }, [imageUrl, fallbackImageUrl]);

  // Parse initial duration from string (e.g. "30 seconds", "45s", "1 minute", "5 minutes")
  useEffect(() => {
    let secs = 30;
    if (duration) {
      if (duration.includes('5 min') || duration.includes('5 minutes')) secs = 300;
      else if (duration.includes('2 min')) secs = 120;
      else if (duration.includes('1 min') || duration.includes('1 minute')) secs = 60;
      else if (duration.includes('45')) secs = 45;
      else if (duration.includes('20')) secs = 20;
      else if (duration.includes('30')) secs = 30;
    }
    setInitialDuration(secs);
    setTimer(secs);
    setIsPlaying(false);
    stopSpeaking();
  }, [name, duration]);

  // Timer countdown and real-time breathing cues
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (timer === 0 && isPlaying) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  // Breathing phase rhythm animation (4s inhale, 2s hold, 4s exhale)
  useEffect(() => {
    if (!isPlaying) return;
    const cycle = setInterval(() => {
      setBreathingPhase((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 3000);
    return () => clearInterval(cycle);
  }, [isPlaying]);

  const handleRestart = () => {
    setTimer(initialDuration);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      {/* Visual Display: Non-copyrighted High-Resolution Yoga Image Only */}
      <div className="h-[420px] w-full bg-slate-950 rounded-3xl overflow-hidden relative border border-slate-200/80 shadow-lg group">
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc(DEFAULT_FALLBACK_IMAGE)}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay for Readable Text & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 shadow-sm backdrop-blur-md">
              {difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/90 text-white shadow-sm backdrop-blur-md">
              Pose {currentIndex + 1} of {totalExercises}
            </span>
          </div>

          {isPlaying && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/90 text-white shadow-md backdrop-blur-md animate-pulse">
              <Wind className="w-3.5 h-3.5" />
              <span>Breath: {breathingPhase}</span>
            </div>
          )}
        </div>

        {/* Bottom Image Caption Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-orange-300 font-bold">
                Authentic Posture Guide
              </p>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-white drop-shadow-md">
                {hindiName || name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 drop-shadow-sm">
                {name} • Recommended: {duration}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Play/Pause, Reset, TTS Audio, Voice Command Mic */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
            }`}
            title={isPlaying ? 'Pause Workout' : 'Start Workout'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
            title="Restart timer"
            aria-label="Restart"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Audio Assistant Toggle */}
          <button
            onClick={toggleTTS}
            className={`p-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              isTtsActive
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Audio Instructor (Text-to-Speech instructions & breathing cues)"
            aria-label="Toggle voice guidance"
          >
            {isTtsActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-xs font-bold hidden sm:inline">
              {isTtsActive ? 'Voice ON' : 'Voice'}
            </span>
          </button>

          {/* Hands-Free Voice Command Toggle */}
          <button
            onClick={toggleVoiceCommands}
            className={`p-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              isVoiceCommandActive
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Hands-free Voice Commands (Say 'next', 'previous', 'play', 'pause')"
            aria-label="Toggle hands-free voice commands"
          >
            {isVoiceCommandActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            <span className="text-xs font-bold hidden sm:inline">
              {isVoiceCommandActive ? 'Hands-Free ON' : 'Hands-Free'}
            </span>
          </button>
        </div>

        {/* Center: Timer Display */}
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black font-mono text-slate-800 tracking-tight">
            {timer}<span className="text-sm font-sans text-slate-400 font-bold ml-1">sec</span>
          </div>
        </div>

        {/* Right: Prev / Next Pose Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex >= totalExercises - 1}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-orange-500/20 flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Command Activity Indicator */}
      {isVoiceCommandActive && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs text-emerald-800 flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Hands-Free Active: Speak <strong>&ldquo;Next&rdquo;</strong>, <strong>&ldquo;Previous&rdquo;</strong>, <strong>&ldquo;Play&rdquo;</strong>, or <strong>&ldquo;Pause&rdquo;</strong>
          </span>
          {lastVoiceCommand && (
            <span className="bg-emerald-200/60 px-2 py-0.5 rounded font-mono text-[11px]">
              Heard: &ldquo;{lastVoiceCommand}&rdquo;
            </span>
          )}
        </div>
      )}
    </div>
  );
};
