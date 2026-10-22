import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { yogaExercises } from '../data/yogaExercises';
import { WorkoutPlayer } from '../components/WorkoutPlayer';
import { ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export const BodyTrainingPage: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const selected = yogaExercises[idx];

  const next = () => {
    if (idx < yogaExercises.length - 1) setIdx(idx + 1);
  };
  const prev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const progressPercent = Math.round(((idx + 1) / yogaExercises.length) * 100);

  return (
    <PageLayout
      pageTitle="Yoga Asanas & Wellness Training"
      pageSubtitle="15 Classical Yoga Exercises with Authentic Photographic Visuals, Audio Guidance & Hands-Free Navigation"
      badge="Authentic Yoga Photography • Audio Assistant"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Medical & Practice Precautions Disclaimer */}
        <section className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-amber-900 text-xs sm:text-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-amber-950">Important Wellness Guidance:</h3>
              <p className="text-amber-900/90 leading-relaxed">
                Yoga exercises are intended for educational wellness, flexibility, and gentle strength. Yoga is not a cure for medical emergencies or structural injuries. If you have severe spinal issues, uncontrolled hypertension, vertigo, recent surgery, or pregnancy, please consult your doctor or physical therapist before attempting any new posture. Always listen to your body and never force a stretch.
              </p>
            </div>
          </div>
        </section>

        {/* Session Progress Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Session Progress
            </span>
            <h2 className="text-lg font-black text-slate-900">
              Pose {idx + 1} of {yogaExercises.length}: {selected.englishName} ({selected.name})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 min-w-[40px]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Left Viewer & Pose Details */}
          <div className="lg:col-span-8 space-y-6">
            <WorkoutPlayer
              imageUrl={selected.imageUrl || selected.thumbnailUrl}
              fallbackImageUrl={selected.thumbnailUrl}
              name={selected.englishName}
              hindiName={selected.name}
              instructions={selected.instructions}
              breathing={selected.breathing}
              precautions={selected.precautions}
              modifications={selected.modifications}
              duration={selected.duration}
              difficulty={selected.difficulty}
              onNext={next}
              onPrev={prev}
              currentIndex={idx}
              totalExercises={yogaExercises.length}
            />

            {/* Comprehensive Pose Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                    {selected.name}
                    <span className="text-base sm:text-lg font-sans font-normal text-slate-500 ml-2">
                      ({selected.englishName})
                    </span>
                  </h2>
                  <span className="text-xs font-bold px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full">
                    {selected.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {selected.description}
                </p>
              </div>

              {/* Key Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Difficulty Level</span>
                  <p className="font-bold text-slate-800 text-sm">{selected.difficulty}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Recommended Duration</span>
                  <p className="font-bold text-slate-800 text-sm">{selected.duration}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Breathing Rule</span>
                  <p className="font-bold text-slate-800 text-xs">{selected.breathing}</p>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-3">
                <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>चरण-दर-चरण अभ्यास निर्देश (Instructions):</span>
                </h3>
                <ol className="space-y-2.5">
                  {selected.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Beginner Modification & Precautions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                {selected.modifications && (
                  <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl space-y-1.5">
                    <h4 className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      <span>Beginner Modification:</span>
                    </h4>
                    <p className="text-xs text-sky-800 leading-relaxed">
                      {selected.modifications}
                    </p>
                  </div>
                )}

                {selected.precautions && (
                  <div className="p-4 bg-rose-50/70 border border-rose-100 rounded-2xl space-y-1.5">
                    <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Precautions &amp; Contraindications:</span>
                    </h4>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      {selected.precautions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Exercise Playlist */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-slate-900 text-base">
                  15 Exercises Playlist
                </h3>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  {idx + 1} / {yogaExercises.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {yogaExercises.map((ex, i) => {
                  const isCurrent = idx === i;
                  return (
                    <button
                      key={ex.id}
                      onClick={() => setIdx(i)}
                      className={`w-full p-2.5 rounded-2xl text-left transition-all duration-150 flex items-center justify-between border cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-50/90 border-orange-300 shadow-xs'
                          : 'bg-white border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* High quality exercise photo thumbnail */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                          <img
                            src={ex.thumbnailUrl}
                            alt={ex.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-4 h-4 rounded-tl text-[10px] font-bold flex items-center justify-center ${
                              isCurrent
                                ? 'bg-orange-500 text-white'
                                : 'bg-slate-900/70 text-white'
                            }`}
                          >
                            {i + 1}
                          </span>
                        </div>
                        <div className="truncate">
                          <p
                            className={`text-xs font-bold leading-tight truncate ${
                              isCurrent ? 'text-orange-950 font-serif' : 'text-slate-800'
                            }`}
                          >
                            {ex.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{ex.englishName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">
                        {ex.difficulty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
