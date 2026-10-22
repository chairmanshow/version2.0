import { fetchWithFallback } from '../lib/api-config';
import { getWikiImage } from '../lib/getWikiImage';
import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Square,
  RotateCcw,
  FileDown,
  Star,
  Volume2,
} from 'lucide-react';
import { ChotelalFace } from './ChotelalFace';
import { YouTubeVideoRecommendation } from '../lib/youtubeRecommendations';
import { generatePrescription } from '../lib/pdfGenerator';
import { generateClientAyurvedicDiagnosis } from '../lib/clientAyurvedicDiagnosis';

function HerbCard({ herbName, howToUse }: { herbName: string; howToUse: string }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWikiImage(herbName).then((res: string | null) => {
      setImage(res);
      setLoading(false);
    });
  }, [herbName]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {loading ? (
        <div className="w-full h-32 bg-gray-100 animate-pulse rounded" />
      ) : image ? (
        <div className="w-full h-32 bg-gray-50 flex items-center justify-center">
          <img src={image} alt={herbName} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
      ) : (
        <div className="w-full h-32 bg-orange-50 flex items-center justify-center text-5xl">🌿</div>
      )}
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-sm">{herbName}</h3>
        <p className="text-xs text-gray-600 mt-1">{howToUse}</p>
      </div>
    </div>
  );
}

function YogaCard({ title, instructions }: { title: string; instructions: string }) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchTerm = title.split('(')[0].trim();
    getWikiImage(searchTerm).then((res: string | null) => {
      setImage(res);
      setLoading(false);
    });
  }, [title]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {loading ? (
        <div className="w-full h-32 bg-gray-100 animate-pulse rounded" />
      ) : image ? (
        <div className="w-full h-32 bg-gray-50">
          <img src={image} alt={title} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>
      ) : (
        <div className="w-full h-32 bg-blue-50 flex items-center justify-center text-5xl">🧘</div>
      )}
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">{instructions}</p>
      </div>
    </div>
  );
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'chotelal';
  text: string;
  timestamp: string;
  isQuestion?: boolean;
  questionNumber?: number;
  isFinalDiagnosis?: boolean;
  diagnosisData?: {
    diagnosis: string;
    remedies: Array<{ name: string; dosage?: string; howToTake?: string }> | string[];
    exercises: string[];
    dietAdvice: { foodsToEat: string[]; foodsToAvoid: string[] };
    recommendedVideo?: YouTubeVideoRecommendation;
    chotelalAdvice: string;
    isExpertPlus?: boolean;
  };
}

interface ChotelalChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosisContext?: any;
  startWithExpertPlus?: boolean;
}

export const ChotelalChatModal: React.FC<ChotelalChatModalProps> = ({
  isOpen,
  onClose,
  diagnosisContext,
  startWithExpertPlus = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isExpertPlusMode, setIsExpertPlusMode] = useState<boolean>(startWithExpertPlus);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const hasInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      if (!hasInitializedRef.current || messages.length === 0) {
        hasInitializedRef.current = true;
        setCurrentStep(1);
        setIsExpertPlusMode(startWithExpertPlus);

        const welcomeText = isExpertPlusMode
          ? 'Namaste beta! Main Chotelal Ji hoon. Aapka swagat hai Expert+ Consultation me. Batao, aapko kya takleef hai? Main aapki poori sthiti samajh kar nuskhe aur aahar chart banaunga.'
          : 'Namaste beta! Main Chotelal Ji hoon. Batao, aapko kya takleef hai?';

        const welcomeMsg: ChatMessage = {
          id: 'welcome-' + Date.now(),
          sender: 'chotelal',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([welcomeMsg]);
      }
    } else {
      stopListening();
    }
  }, [isOpen, startWithExpertPlus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Aapke browser me speech recognition support nahi hai. Kripya type karein.');
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition status:', event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Mic start error:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    stopListening();

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      let data: any = null;

      try {
        const response = await fetchWithFallback('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: [...messages, userMsg].map((m) => ({
              sender: m.sender,
              text: m.text,
            })),
            step: currentStep,
            isExpertPlus: isExpertPlusMode,
            currentDiagnosisContext: diagnosisContext,
          }),
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json();
          }
        }
      } catch (networkErr) {
        console.warn('Backend chat unreachable or static host, using client conversational engine:', networkErr);
      }

      if (!data || !data.reply) {
        const userMessages = [...messages, userMsg]
          .filter((m) => m.sender === 'user')
          .map((m) => m.text)
          .join(' ');

        if (currentStep === 1) {
          data = {
            reply: 'Haan beta, maine aapki takleef suni. Ye batao ki kitne din se ye pareshani hai, aur kya dard ya jalan zyada rehti hai?',
            stage: 'question',
            isFinalDiagnosis: false,
            questionNumber: 1,
          };
        } else if (currentStep === 2) {
          data = {
            reply: 'Theek hai beta. Ye batao ki kya roz subah pet theek se saaf hota hai, aur neend theek se aati hai ya stress rehta hai?',
            stage: 'question',
            isFinalDiagnosis: false,
            questionNumber: 2,
          };
        } else {
          const diagResult = generateClientAyurvedicDiagnosis(userMessages, 'general', 'medium', '1 hafta', 'बेटा');
          data = {
            reply: `Beta, maine aapki poori sthiti samajh li hai. Niche maine aapke liye classical Ayurvedic aushadhi, yoga, aahar aur Patanjali ka YouTube video jod diya hai. Inka niyam se palan karein. Apna khayal rakhna beta.`,
            stage: 'final',
            isFinalDiagnosis: true,
            questionNumber: 3,
            diagnosis: diagResult.diagnosis,
            remedies: diagResult.herbal_remedies,
            exercises: diagResult.exercises,
            dietAdvice: diagResult.dietAdvice,
            recommendedVideo: diagResult.recommendedVideo,
            chotelalAdvice: diagResult.chotelalAdvice,
          };
        }
      }

      const replyText = data.reply || 'Namaste beta! Gunguna paani piyo aur aaram karo. Apna khayal rakhna beta.';
      const isFinal = Boolean(data.isFinalDiagnosis);
      const nextStepNum = isFinal ? 4 : (data.questionNumber || currentStep) + 1;
      setCurrentStep(nextStepNum);

      const chotelalReply: ChatMessage = {
        id: 'chotelal-' + Date.now(),
        sender: 'chotelal',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isQuestion: !isFinal,
        questionNumber: data.questionNumber || currentStep,
        isFinalDiagnosis: isFinal,
        diagnosisData: isFinal
          ? {
              diagnosis: data.diagnosis || 'Ayurvedic Dosha Imbalance',
              remedies: data.remedies || [],
              exercises: data.exercises || [],
              dietAdvice: data.dietAdvice || { foodsToEat: [], foodsToAvoid: [] },
              recommendedVideo: data.recommendedVideo,
              chotelalAdvice: data.chotelalAdvice || 'Apna khayal rakhna beta. 7 din me sudhar na dikhe to doctor se milein.',
              isExpertPlus: isExpertPlusMode,
            }
          : undefined,
      };

      setMessages((prev) => [...prev, chotelalReply]);

    } catch (err) {
      console.error('Chat error:', err);
      const fallbackText = 'Namaste beta! Gunguna paani piyo aur saada khana khao. Apna khayal rakhna beta.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'chote-err-' + Date.now(),
          sender: 'chotelal',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (diagData: any) => {
    await generatePrescription({
      patientName: 'Aadarneey Mareez',
      symptoms: messages.filter((m) => m.sender === 'user').map((m) => m.text).join(', ') || 'Ayurvedic Health Consultation',
      diagnosis: diagData.diagnosis,
      remedies: diagData.remedies,
      exercises: diagData.exercises,
      dietAdvice: diagData.dietAdvice,
      advice: diagData.chotelalAdvice,
    });
  };

  const handleReset = () => {
    stopListening();
    setCurrentStep(1);
    setMessages([]);
    hasInitializedRef.current = false;
    setTimeout(() => {
      const welcome = 'Namaste beta! Main Chotelal Ji hoon. Batao, aapko kya takleef hai?';
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          sender: 'chotelal',
          text: welcome,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col h-[90vh] max-h-[750px] overflow-hidden">
        
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <ChotelalFace size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base font-serif">
                  Vaidya Chotelal Ji
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                3-Step Q&amp;A Consultation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer"
              title="Reset Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FFFFFF]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-1">
                    <ChotelalFace size="xs" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  <div
                    className={`rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-orange-500 text-white rounded-br-xs font-medium'
                        : 'bg-[#F8FAFC] text-slate-900 border border-[#E2E8F0] rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  {msg.isFinalDiagnosis && msg.diagnosisData && (
                    <div className="w-full bg-white rounded-2xl border-2 border-orange-300 shadow-md p-5 space-y-5 text-left mt-3">
                      <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-orange-100 text-orange-700 rounded-xl">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-base font-serif">
                              🧔 CHOTELAL JI KA JAWAB
                            </h4>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadPDF(msg.diagnosisData)}
                          className="inline-flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>📄 PDF Prescription</span>
                        </button>
                      </div>
                      <div className="bg-orange-50/70 rounded-xl p-3.5 border border-orange-200 text-xs space-y-1">
                        <p className="font-black text-orange-950 uppercase tracking-wide">
                          📋 Diagnosis &amp; Root Cause:
                        </p>
                        <p className="font-medium text-slate-800 leading-relaxed">
                          {msg.diagnosisData.diagnosis}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>🌿 Ayurvedic Remedies (Aushadhi):</span>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(Array.isArray(msg.diagnosisData.remedies) ? msg.diagnosisData.remedies : []).map((rem: any, idx: number) => {
                            const title = typeof rem === 'string' ? rem : rem.name;
                            const dosage = typeof rem === 'string' ? '1 chammach gungune paani ke saath' : (rem.dosage || rem.howToTake);
                            return (
                              <HerbCard key={idx} herbName={title} howToUse={dosage} />
                            );
                          })}
                        </div>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 flex items-start gap-2.5">
                        <ChotelalFace size="xs" />
                        <div>
                          <p className="font-bold text-amber-900">💬 Chotelal Ji Ki Salah:</p>
                          <p className="italic text-amber-800 font-medium pt-0.5">
                            &ldquo;{msg.diagnosisData.chotelalAdvice}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-fadeIn">
              <ChotelalFace size="xs" />
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-2 text-xs text-slate-500 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 font-semibold text-slate-600">छोटेलाल जी विचार कर रहे हैं...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 sm:p-4 bg-white border-t border-gray-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-3 rounded-2xl border transition cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md shadow-rose-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={isListening ? 'Listening... click to stop' : 'Click to speak in Hindi/English'}
            >
              {isListening ? <Square className="w-5 h-5 fill-white" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Apne lakshan likhein ya mic se bolein..."
              disabled={isLoading}
              className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-orange-500 focus:bg-white rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition"
            />

            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-2xl shadow-sm transition cursor-pointer shrink-0"
              title="Bhejein"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
