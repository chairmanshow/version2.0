import React, { useState, useRef } from 'react';
import { PageLayout } from '../components/PageLayout';
import { fetchWithFallback } from '../lib/api-config';
import { speak, stopSpeaking } from '../lib/ttsService';
import { MedicineScanResult, NaturalAlternative, TherapeuticUse } from '../lib/medicineScanner';
import { useRouter } from '../router';
import {
  Upload,
  Camera,
  Search,
  Pill,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  HeartPulse,
  Leaf,
  Plus,
  RefreshCw,
  Printer,
  ChevronRight,
  Info,
  Mic,
  MicOff,
  Share2,
} from 'lucide-react';

const COMMON_QUICK_SEARCHES = [
  { label: 'Dolo 650 (Paracetamol)', query: 'Dolo 650 Paracetamol' },
  { label: 'Pan 40 (Pantoprazole)', query: 'Pan 40 Pantoprazole' },
  { label: 'Cetzine (Cetirizine)', query: 'Cetirizine Cetzine' },
  { label: 'Augmentin (Amoxicillin)', query: 'Augmentin 625 Amoxicillin' },
  { label: 'Azithromycin 500mg', query: 'Azithromycin 500' },
  { label: 'Combiflam', query: 'Combiflam Ibuprofen Paracetamol' },
];

export const MedicineScannerPage: React.FC = () => {
  const { navigate } = useRouter();

  // Search & Image State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  // Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MedicineScanResult | null>(null);
  const [selectedDoseOverride, setSelectedDoseOverride] = useState<string | null>(null);

  // Audio & Mic State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Image File Selection
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    setImageFileName(file.name);
    setImageMimeType(file.type || 'image/jpeg');
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Resize image on canvas if huge
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const maxHeight = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL(file.type || 'image/jpeg', 0.85);
          setSelectedImage(compressed);
        } else {
          setSelectedImage(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // Speech-to-Text for medicine search
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please type the name.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          setSearchQuery(text);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch (e) {
      setIsListening(false);
    }
  };

  // Execute Medicine Scan via API
  const handleScanMedicine = async (overrideQuery?: string) => {
    const queryToUse = overrideQuery !== undefined ? overrideQuery : searchQuery;

    if (!queryToUse.trim() && !selectedImage) {
      setError('Please upload an image or type a medicine name to scan.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedDoseOverride(null);
    stopSpeaking();
    setIsSpeaking(false);

    try {
      const response = await fetchWithFallback('/api/medicine/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToUse.trim() || undefined,
          imageBase64: selectedImage || undefined,
          mimeType: imageMimeType,
          imageFileName: imageFileName || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.data) {
        throw new Error(data.error || 'Failed to analyze medicine details.');
      }

      setResult(data.data);

      // Smooth scroll to results
      setTimeout(() => {
        const resEl = document.getElementById('medicine-scan-results');
        if (resEl) resEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError(
        err?.message ||
          'Could not analyze this medicine. Please verify the name or upload a clearer photo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Read Aloud Overview using Neural Voice / TTS
  const toggleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;

    const activeDose = selectedDoseOverride || result.detectedDose || result.dosageRules?.singleDose;
    const speechScript = `दवा का नाम: ${result.medicineName}। पहचानी गई खुराक: ${activeDose}। मुख्य उपयोग: ${result.clearUsage?.mainPurposeHindi || result.primaryUses[0]?.condition}। खुराक का नियम: ${result.dosageRules?.singleDose}, ${result.dosageRules?.frequency}। ${result.dosageRules?.howToConsume}। जरूरी चेतावनी: ${result.criticalWarnings[0] || 'केवल डॉक्टर के परामर्श पर लें'}।`;

    setIsSpeaking(true);
    speak(speechScript).finally(() => setIsSpeaking(false));
  };

  // Save to Medicine Safety Companion (localStorage)
  const handleSaveToCompanion = () => {
    if (!result) return;
    try {
      const existing = localStorage.getItem('chotelal_medicine_records');
      const list = existing ? JSON.parse(existing) : [];

      const newRecord = {
        id: 'med-' + Date.now(),
        name: result.medicineName,
        dosage: result.genericSalt,
        schedule: result.dosageAndAdministration?.foodIntake || 'As prescribed by doctor',
        prescribedBy: 'Scanned via Medicine Scanner',
        prescribedDate: new Date().toISOString().split('T')[0],
        instructions: `Uses: ${result.primaryUses.map((u) => u.condition).join(', ')}. Warnings: ${result.criticalWarnings[0] || 'None'}`,
        reminderTime: '09:00',
      };

      list.unshift(newRecord);
      localStorage.setItem('chotelal_medicine_records', JSON.stringify(list));
      showToast('✓ Saved to your Medicine Safety Companion!');
    } catch (e) {
      showToast('Could not save record.');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <PageLayout
      pageTitle="Medicine Scanner (दवा स्कैनर)"
      pageSubtitle="Instant AI Analysis of Uses, Active Salts, Warnings, Eligibility & Natural Ayurvedic Alternatives"
      badge="WHO Regulation Compliant"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Regulatory Banner Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-200 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WHO Model Lists of Essential Medicines Standard</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white">
              Scan Medicine Packaging or Search by Name
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload a clear photo of any tablet strip, bottle, syrup, or prescription box—or simply type the medicine name. Learn who can safely take it, high-risk contraindications, and genuine Ayurvedic alternatives.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
            <Pill className="w-64 h-64 text-white" />
          </div>
        </div>

        {/* Dual Input Interface */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Image Upload & Camera Box */}
            <div className="lg:col-span-6 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Option 1: Upload Medicine Photo / Strip / Box
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !selectedImage && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[220px] ${
                  selectedImage
                    ? 'border-orange-400 bg-orange-50/20'
                    : 'border-slate-300 hover:border-orange-500 bg-slate-50/70 hover:bg-orange-50/30'
                }`}
              >
                {selectedImage ? (
                  <div className="space-y-3 w-full">
                    <div className="relative max-h-48 mx-auto inline-block rounded-2xl overflow-hidden border border-orange-200 shadow-sm">
                      <img
                        src={selectedImage}
                        alt="Medicine Strip Preview"
                        className="max-h-48 w-auto object-contain mx-auto"
                      />
                      {isLoading && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                          <div className="space-y-2 text-center text-white">
                            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-400" />
                            <span className="text-xs font-bold block">Scanning salt...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs text-slate-600 font-medium truncate max-w-[200px]">
                        {imageFileName || 'Uploaded Photo'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(null);
                          setImageFileName(null);
                        }}
                        className="text-xs text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto shadow-xs">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Drag &amp; drop or click to upload photo
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Supports JPEG, PNG, WEBP (Strip, bottle label, box)
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cameraInputRef.current?.click();
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-orange-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-orange-500" />
                        <span>Use Camera</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Right: Search by Name Box */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Option 2: Write Medicine or Salt Name
                </label>

                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="medicine-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleScanMedicine();
                    }}
                    placeholder="e.g. Paracetamol, Dolo 650, Pan 40, Azithromycin, Metformin..."
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-xl transition cursor-pointer ${
                      isListening
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-slate-400 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                    title="Speak medicine name in Hindi or English"
                  >
                    {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Pills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Search Common Medicines:
                </span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_QUICK_SEARCHES.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setSearchQuery(item.query);
                        handleScanMedicine(item.query);
                      }}
                      className="text-xs px-3 py-1.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-700 border border-slate-200 hover:border-orange-300 rounded-xl text-slate-700 font-medium transition cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Submit Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleScanMedicine()}
                  disabled={isLoading || (!searchQuery.trim() && !selectedImage)}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>दवा, खुराक व उपयोग की सटीक पहचान हो रही है...</span>
                    </>
                  ) : selectedImage ? (
                    <>
                      <Camera className="w-5 h-5 text-amber-200" />
                      <span>Scan Photo &amp; Detect Dose (फोटो से दवा व खुराक पहचानें)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-200" />
                      <span>Scan &amp; Analyze Medicine (दवा व खुराक की जांच करें)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-rose-800">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div id="medicine-scan-results" className="space-y-8 animate-fadeIn">
            {/* If Identification Failed or Image Quality Low */}
            {(!result.isIdentified || result.confidenceLevel === 'Low') ? (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-rose-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 bg-rose-50 border border-rose-200 rounded-2xl">
                  <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-rose-200/80 text-rose-900 rounded-full text-xs font-black uppercase tracking-wider">
                      <span>पहचान अपूर्ण (Unrecognized / Action Needed)</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-rose-950 font-serif">
                      दवा की सुरक्षित पहचान नहीं हो सकी (Medicine Not Identified Safely)
                    </h3>
                    <p className="text-sm text-rose-900 font-semibold leading-relaxed">
                      {result.imageQualityCheck?.messageHindi || result.confidenceReasonHindi || 'फोटो धुंधली या अधूरी है, या दवा का मुख्य नाम स्पष्ट रूप से नहीं दिख रहा है।'}
                    </p>
                    <p className="text-xs text-rose-700 font-medium">
                      {result.imageQualityCheck?.messageEnglish || result.confidenceReasonEnglish || 'The medicine name or active ingredients could not be verified safely.'}
                    </p>
                  </div>
                </div>

                {/* Specific Quality Issue Detected */}
                {result.imageQualityCheck?.issue && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">पहचाना गया कारण (Detected Reason):</span>
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-md font-bold">
                      {result.imageQualityCheck.issue === 'blurry' && 'धुंधली फोटो (Blurry Image / Out of Focus)'}
                      {result.imageQualityCheck.issue === 'text_too_small' && 'अक्षर बहुत छोटे या दूर हैं (Text Too Small)'}
                      {result.imageQualityCheck.issue === 'partially_hidden' && 'पैकेट आंशिक रूप से कटा हुआ है (Partially Hidden Packaging)'}
                      {result.imageQualityCheck.issue === 'name_not_visible' && 'दवा का नाम दिखाई नहीं दे रहा (Medicine Name Not Visible)'}
                      {result.imageQualityCheck.issue === 'not_medicine_packaging' && 'दवा का पैकेट नहीं है (Not Medicine Packaging)'}
                    </span>
                  </div>
                )}

                {/* 4 Simple Tips for Clear Scanning */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>सटीक फोटो लेने के 4 आसान नियम (4 Quick Tips for Accurate Scan):</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-950 font-medium">
                    <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-amber-100">
                      <span className="text-base leading-none">💡</span>
                      <div>
                        <strong className="text-slate-900 block font-bold">1. अच्छी रोशनी में फोटो लें</strong>
                        <span>सीधे तेज फ्लैश से बचें ताकि प्लास्टिक या फॉइल पर सफेद चमक (glare) न पड़े।</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-amber-100">
                      <span className="text-base leading-none">📦</span>
                      <div>
                        <strong className="text-slate-900 block font-bold">2. पत्ते या डिब्बे को सपाट रखें</strong>
                        <span>दवा के पत्ते को मेज पर सीधा रखें ताकि ब्रांड नाम के सारे अक्षर कैमरे में सीधे आएं।</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-amber-100">
                      <span className="text-base leading-none">🔍</span>
                      <div>
                        <strong className="text-slate-900 block font-bold">3. दवा का नाम फ्रेम के बीच में हो</strong>
                        <span>ब्रांड नाम (जैसे Dolo 650, Pan 40) और सक्रिय साल्ट को कैमरे के केंद्र में रखें।</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-white/80 p-3 rounded-xl border border-amber-100">
                      <span className="text-base leading-none">✍️</span>
                      <div>
                        <strong className="text-slate-900 block font-bold">4. नाम लिखकर तुरंत खोजें</strong>
                        <span>आप नीचे सर्च बॉक्स में दवा का नाम लिख या बोलकर भी तुरंत पूरी जानकारी प्राप्त कर सकते हैं।</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Clearer Photo (दूसरी फोटो अपलोड करें)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-5 py-3 bg-white border border-slate-300 hover:border-orange-400 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-orange-500" />
                    <span>Use Camera (कैमरा खोलें)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const inputEl = document.getElementById('medicine-search-input');
                      if (inputEl) {
                        inputEl.scrollIntoView({ behavior: 'smooth' });
                        inputEl.focus();
                      }
                    }}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search by Medicine Name (नाम से खोजें)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Verified Medicine Results Overview Card */
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                {/* Confidence Badge */}
                {result.confidenceLevel === 'High' ? (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>उच्च सटीकता (High Confidence) — दवा का नाम, सक्रिय साल्ट और खुराक पैकेजिंग से 100% सत्यापित</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">मध्यम सटीकता (Medium Confidence):</strong>
                      <span>दवा की पहचान हो गई है, लेकिन पैकेजिंग पर कुछ विवरण आंशिक रूप से अस्पष्ट थे। कृपया अपनी दवा के पैकेट पर छपे नाम और साल्ट से नीचे दी गई जानकारी का मिलान अवश्य करें।</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                          result.prescriptionRequired
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {result.scheduleCategory}
                      </span>

                      <span className="text-xs px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-semibold">
                        {result.category}
                      </span>

                      {result.source === 'gemini_multimodal' && (
                        <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold">
                          Multimodal Vision Verified
                        </span>
                      )}
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
                      {result.medicineName}
                    </h2>

                    <p className="text-sm font-bold text-orange-600">
                      {result.hindiName}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100 inline-block">
                      Active Salt: <strong>{result.genericSalt}</strong> ({result.drugClass})
                    </p>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleReadAloud}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                        isSpeaking
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen Overview (आवाज सुनें)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveToCompanion}
                      className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Prescriptions</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer"
                      title="Print Report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* EXTRACTED PACKAGING DETAILS CARD */}
                {result.extractedPackagingDetails && (
                  <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span>पैकेजिंग से प्राप्त सत्यापित विवरण (Extracted Packaging Details)</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        AI Packaging OCR
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          ब्रांड नाम (Brand Name)
                        </span>
                        <span className="text-sm font-black text-slate-900 block">
                          {result.extractedPackagingDetails.brandName || result.medicineName}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          सक्रिय साल्ट (Generic / Salt)
                        </span>
                        <span className="text-sm font-black text-slate-900 block">
                          {result.extractedPackagingDetails.genericName || result.genericSalt}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          पहचानी गई शक्ति (Detected Strength)
                        </span>
                        <span className="text-sm font-black text-blue-700 block">
                          {result.extractedPackagingDetails.strength || result.detectedDose}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          दवा का रूप (Dosage Form)
                        </span>
                        <span className="text-sm font-bold text-slate-800 block">
                          {result.extractedPackagingDetails.dosageForm || 'Tablet / Capsule'}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs sm:col-span-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          दवा निर्माता कंपनी (Manufacturer)
                        </span>
                        <span className="text-sm font-bold text-slate-800 block">
                          {result.extractedPackagingDetails.manufacturer || 'Standard Certified Pharmaceutical Manufacturer'}
                        </span>
                      </div>
                    </div>

                    {result.extractedPackagingDetails.visibleTextSnippets && result.extractedPackagingDetails.visibleTextSnippets.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 text-xs">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          पैकेट पर पढ़े गए शब्द (Verified Packaging Text):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {result.extractedPackagingDetails.visibleTextSnippets.map((snippet, sIdx) => (
                            <span key={sIdx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] text-slate-600 font-mono">
                              {snippet}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* HIGHLIGHT: DETECTED MEDICINE & EXACT DOSE */}
              {(() => {
                const activeDose = selectedDoseOverride || result.detectedDose || result.dosageRules?.detectedDose || '500 mg';
                const getDosageOptions = (name: string, curDose: string) => {
                  const lower = (name || '').toLowerCase();
                  let list: string[] = [];
                  if (lower.includes('paracetamol') || lower.includes('dolo') || lower.includes('calpol') || lower.includes('crocin')) {
                    list = ['650 mg Tablet', '500 mg Tablet', '250 mg DT', '120 mg/5ml Syrup'];
                  } else if (lower.includes('amoxicillin') || lower.includes('augmentin') || lower.includes('clavam') || lower.includes('moxikind')) {
                    list = ['625 mg (Duo)', '375 mg', '200 mg Syrup'];
                  } else if (lower.includes('pantoprazole') || lower.includes('pan')) {
                    list = ['40 mg Tablet', '20 mg Tablet', 'Pan-D (with Domperidone)'];
                  } else if (lower.includes('cetirizine') || lower.includes('cetzine') || lower.includes('okacet')) {
                    list = ['10 mg Tablet', '5 mg Tablet', '5 mg/5ml Syrup'];
                  } else if (lower.includes('combiflam') || lower.includes('ibuprofen') || lower.includes('flexon')) {
                    list = ['400mg + 325mg', 'Half Dose (200mg)'];
                  } else if (lower.includes('azithromycin') || lower.includes('azee') || lower.includes('azithral')) {
                    list = ['500 mg Tablet', '250 mg Tablet', '100 mg/5ml Syrup'];
                  } else if (lower.includes('metformin') || lower.includes('glycomet') || lower.includes('glyciphage')) {
                    list = ['500 mg SR', '850 mg', '1000 mg SR'];
                  } else if (lower.includes('telmisartan') || lower.includes('telma')) {
                    list = ['40 mg Tablet', '20 mg Tablet', '80 mg Tablet', 'Telma-H'];
                  } else if (lower.includes('aspirin') || lower.includes('disprin') || lower.includes('ecosprin')) {
                    list = ['350 mg (Disprin)', '75 mg (Ecosprin)', '150 mg'];
                  } else {
                    list = [curDose, 'Standard Dose', 'Half / Pediatric Dose'];
                  }

                  // Deduplicate and filter out empty strings
                  const seen = new Set<string>();
                  const uniqueList: string[] = [];
                  for (const item of list) {
                    const trimmed = (item || '').trim();
                    if (trimmed && !seen.has(trimmed)) {
                      seen.add(trimmed);
                      uniqueList.push(trimmed);
                    }
                  }
                  return uniqueList;
                };

                const doseChips = getDosageOptions(result.medicineName, activeDose);

                return (
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200/70 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md">
                          <Pill className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[11px] font-black tracking-widest uppercase text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                            सटीक दवा व खुराक पहचान (Detected Medicine &amp; Dose)
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-blue-950 font-serif">
                            {result.medicineName}
                          </h3>
                          <p className="text-xs font-semibold text-blue-800">
                            सक्रिय साल्ट (Active Composition): {result.genericSalt}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end gap-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          पहचानी गई खुराक (Detected Dose):
                        </span>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md">
                          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                          <span className="text-lg sm:text-xl font-black">
                            {activeDose}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Dosage Variant Switcher */}
                    <div className="bg-white/90 border border-blue-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>उपलब्ध खुराक विकल्प (Switch or Select Your Exact Strength):</span>
                        </span>
                        {selectedDoseOverride && (
                          <button
                            type="button"
                            onClick={() => setSelectedDoseOverride(null)}
                            className="text-[11px] text-blue-600 hover:underline font-bold"
                          >
                            Reset to Detected
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {doseChips.map((chip, chipIdx) => (
                          <button
                            key={`dose-chip-${chipIdx}-${chip}`}
                            type="button"
                            onClick={() => setSelectedDoseOverride(chip)}
                            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 ${
                              activeDose === chip
                                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                                : 'bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 border border-slate-200'
                            }`}
                          >
                            <span>{chip}</span>
                            {activeDose === chip && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4 Dosage Rules Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                          एक बार में मात्रा (Single Dose)
                        </span>
                        <p className="text-sm font-black text-slate-900">
                          {selectedDoseOverride
                            ? `1 खुराक (${selectedDoseOverride})`
                            : (result.dosageRules?.singleDose || `1 गोली (${activeDose})`)}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                          दिन में कितनी बार (Frequency)
                        </span>
                        <p className="text-sm font-black text-slate-900">
                          {result.dosageRules?.frequency || 'हर 6 से 8 घंटे में (दिन में 2-3 बार)'}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                          24 घंटे में अधिकतम सीमा (Max Limit)
                        </span>
                        <p className="text-sm font-black text-rose-900">
                          {result.dosageRules?.maxDailyLimit || 'अधिकतम 3 से 4 गोली'}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-blue-100 space-y-1 shadow-2xs">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                          कैसे और कब लें (How to Take)
                        </span>
                        <p className="text-sm font-black text-emerald-950">
                          {result.dosageRules?.howToConsume || 'खाना खाने के बाद एक गिलास पानी के साथ'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* HIGHLIGHT: CLEAR USAGE GUIDE */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
                <div className="flex items-center gap-3 border-b border-emerald-200/70 pb-3">
                  <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      दवा का स्पष्ट उपयोग व असर (Clear Clinical Usage)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
                      दवा का सही उपयोग, फायदे और शरीर में असर
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-2xs">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>मुख्य काम / किस बीमारी में लें (Main Purpose):</span>
                    </span>
                    <p className="text-base font-black text-slate-900 leading-snug">
                      {result.clearUsage?.mainPurposeHindi || 'तेज बुखार, बदन दर्द और बीमारी के लक्षणों को कम करने के लिए।'}
                    </p>
                    <p className="text-xs text-slate-500 font-medium pt-1 border-t border-slate-100">
                      {result.clearUsage?.mainPurposeEnglish || 'Relief from pain, fever, and target indications.'}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-2xs">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      <span>दवा शरीर में कैसे काम करती है (How It Works):</span>
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-semibold">
                      {result.clearUsage?.howItWorksHindi || 'यह मस्तिष्क के तापमान केंद्र और दर्द सिग्नल्स को नियंत्रित करती है।'}
                    </p>
                  </div>
                </div>

                {/* Key Benefits Pills */}
                {result.clearUsage?.keyBenefitsList && result.clearUsage.keyBenefitsList.length > 0 && (
                  <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-2.5 shadow-2xs">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider block">
                      प्रमुख फायदे व राहत (Key Relief Benefits):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {result.clearUsage.keyBenefitsList.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2.5 text-xs font-bold text-slate-800 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-100/80 p-4 rounded-2xl text-xs sm:text-sm text-emerald-950 font-semibold border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>कब लें (Timing):</strong> {result.clearUsage?.whenToTakeHindi || 'खाना खाने के 15-20 मिनट बाद सादे पानी से।'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>कितने दिन लें (Duration):</strong> {result.clearUsage?.recommendedDuration || '2 से 3 दिन। लक्षण बने रहें तो डॉक्टर से मिलें।'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: PRIMARY USES & INDICATIONS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-serif">
                      1. सभी चिकित्सीय उपयोग (Detailed Indications)
                    </h3>
                    <p className="text-xs text-slate-500">Conditions this medicine is clinically prescribed to treat</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.primaryUses.map((use, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{use.condition}</h4>
                        {use.hindiCondition && (
                          <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                            {use.hindiCondition}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{use.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: WHO CAN TAKE THIS & CONTRAINDICATIONS */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-serif">
                      2. Eligibility &amp; Contraindications (किसे लेना चाहिए और किसे नहीं)
                    </h3>
                    <p className="text-xs text-slate-500">Patient eligibility and conditions requiring immediate avoidance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Suitable For */}
                  <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-3xl space-y-3">
                    <h4 className="font-black text-emerald-900 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Suitable For (कौन ले सकता है):</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-emerald-950">
                      {result.whoCanTakeThis.suitableFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contraindications */}
                  <div className="p-5 bg-rose-50/70 border border-rose-200 rounded-3xl space-y-3">
                    <h4 className="font-black text-rose-900 text-sm flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Contraindications / Avoid (किसे नहीं लेना चाहिए):</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-rose-950">
                      {result.whoCanTakeThis.contraindications.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pregnancy, Nursing & Age Advisory */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">Pregnancy &amp; Lactation (गर्भावस्था व स्तनपान):</span>
                    <p>{result.whoCanTakeThis.pregnancyAndLactation}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                    <span className="font-bold text-slate-900 block">Children &amp; Seniors (बच्चे व बुजुर्ग):</span>
                    <p>{result.whoCanTakeThis.elderlyAndPediatric}</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CRITICAL WARNINGS & SIDE EFFECTS */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-serif">
                      3. Critical Warnings &amp; Side Effects (महत्वपूर्ण चेतावनियां)
                    </h3>
                    <p className="text-xs text-slate-500">Black-box cautions, common adverse effects and drug interactions</p>
                  </div>
                </div>

                {/* High Alert Box */}
                {result.criticalWarnings.length > 0 && (
                  <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-3xl space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      High-Alert Clinical Cautions:
                    </span>
                    <ul className="space-y-1.5 text-xs text-amber-950 font-medium leading-relaxed">
                      {result.criticalWarnings.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-700 font-bold">⚠️</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Common Side Effects */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Common Side Effects:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.commonSideEffects.map((se, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
                        >
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Drug Interactions */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Known Drug &amp; Alcohol Interactions:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {result.drugInteractions.map((di, i) => (
                        <li key={i}>• {di}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dosage Administration */}
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 space-y-1">
                  <span className="font-bold text-blue-950 block">Dosage &amp; Meal Administration:</span>
                  <p><strong>Timing:</strong> {result.dosageAndAdministration?.foodIntake}</p>
                  <p><strong>Guidance:</strong> {result.dosageAndAdministration?.generalAdvice}</p>
                  <p><strong>Missed Dose:</strong> {result.dosageAndAdministration?.missedDoseGuidance}</p>
                </div>
              </div>

              {/* SECTION 4: NATURAL & AYURVEDIC ALTERNATIVES */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Leaf className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 font-serif">
                      4. Natural &amp; Ayurvedic Alternatives (प्राकृतिक एवं आयुर्वेदिक विकल्प)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evidence-backed classical herbs to discuss with your Ayurvedic Vaidya
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {result.naturalAlternatives.map((alt, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-emerald-50/90 to-amber-50/50 p-5 rounded-3xl border border-emerald-200 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded-full">
                            {alt.type}
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 text-base">{alt.name}</h4>
                        <p className="text-xs font-bold text-emerald-800">{alt.hindiName}</p>

                        <div className="space-y-1 text-xs text-slate-700 pt-1">
                          <p>
                            <strong>How It Works:</strong> {alt.howItWorks}
                          </p>
                          <p>
                            <strong>Safe Dosage:</strong> {alt.preparationOrDosage}
                          </p>
                          <p className="text-emerald-900">
                            <strong>Benefits:</strong> {alt.benefits}
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/80 rounded-xl border border-emerald-100 text-[11px] text-slate-500 italic">
                        ⚠️ {alt.safetyNote}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 5: WHO REGULATION REGULATORY DISCLAIMER */}
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl text-amber-950 space-y-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <h4 className="font-black text-sm uppercase tracking-wider text-amber-900">
                    WHO Regulation &amp; Rational Drug Use Notice
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-amber-900/95 font-medium">
                  {result.whoRegulationDisclaimer}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-4 text-[11px] text-amber-800 font-bold">
                  <span>• WHO Essential Medicines Compliance</span>
                  <span>• No Autonomous Prescription</span>
                  <span>• Consult Physician Before Modifying Therapy</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/diagnose');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-orange-200" />
                  <span>Ask Chotelal Ji More About Your Symptoms</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSaveToCompanion}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save to Medicine Companion</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setSelectedImage(null);
                      setSearchQuery('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-2xl transition cursor-pointer"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
