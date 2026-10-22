import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { ChotelalAvatar } from '../components/ChotelalAvatar';
import { ChotelalFace } from '../components/ChotelalFace';
import { ChotelalChatModal } from '../components/ChotelalChatModal';
import { useRouter, Link } from '../router';
import {
  Sparkles,
  MessageCircle,
  Activity,
  Brain,
  Scissors,
  Flame,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  HelpCircle,
  Dumbbell,
  Pill,
} from 'lucide-react';
import { WHATSAPP_CHANNEL_URL } from '../lib/constants';
import { ScrollReveal } from '../components/ScrollReveal';
import { TiltCard } from '../components/TiltCard';
import { ParallaxItem } from '../components/ParallaxSection';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartConsultation = () => {
    setIsChatOpen(true);
  };

  const categories = [
    {
      id: 'piles',
      path: '/category/piles',
      title: 'Piles & Sitting Care',
      englishTitle: 'Piles, Fissure & Sitting Pain',
      description:
        'Lataar baithne se hone wala guda dard, jalan, bawasir aur purani kabz ka pramanit Ayurvedic samadhan.',
      icon: Activity,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-100',
      badge: 'Most Common',
    },
    {
      id: 'mental-health',
      path: '/category/mental-health',
      title: 'Stress & Mental Peace',
      englishTitle: 'Stress, Anxiety & Insomnia',
      description:
        'Overthinking, office stress, ghabrahat aur anidra ko shant karne wale prachin Medhya Rasayan.',
      icon: Brain,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      badge: 'Deep Peace',
    },
    {
      id: 'hair',
      path: '/category/hair',
      title: 'Hair Fall & Growth',
      englishTitle: 'Hair Fall & Scalp Health',
      description:
        'Atyadhik baal jhadna, samay se pehle safed hona, dandruff aur rusi ko jad se poshan dene wale aushadhi.',
      icon: Scissors,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      badge: 'Natural Herbs',
    },
    {
      id: 'general',
      path: '/category/digestion',
      title: 'Digestion & Gut Health',
      englishTitle: 'Digestion, Gas & Acidity',
      description:
        'Khatti dakarein, seene me jalan, bloating, mandagni aur pet theek se saaf na hone ke achook nuskhe.',
      icon: Flame,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-100',
      badge: 'Jathragni Care',
    },
  ];

  return (
    <PageLayout showBreadcrumbs={false}>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-orange-50/80 via-white to-blue-50/60 border-b border-gray-100">
        {/* Parallax Floating Ambient Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <ParallaxItem speed={-35} className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-br from-orange-200/30 to-amber-100/20 blur-3xl" />
          <ParallaxItem speed={45} className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-sky-200/30 to-blue-100/20 blur-3xl" />
          <ParallaxItem speed={-20} className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-100/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <ScrollReveal direction="down" delay={0.05} distance={25}>
                <div className="inline-flex items-center gap-2 bg-orange-100/80 border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-800 shadow-xs backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span>AI Ayurvedic Chatbot with Q&amp;A • Fast Male Voice • 100% Free</span>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.1} distance={35}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 font-serif leading-[1.15] tracking-tight">
                  Aapki Sehat, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                    Hamari Zimmedari
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.15} distance={30}>
                <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Aap apne lakshan batayein, Chotelal Ji aapse 2-3 sawal puch kar pramanit Ayurvedic aushadhi, aahar aur Patanjali ka verified YouTube video suggest karenge.
                </p>
              </ScrollReveal>

              {/* Action Buttons */}
              <ScrollReveal direction="up" delay={0.2} distance={30}>
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleStartConsultation}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black px-7 py-4 rounded-2xl text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 text-orange-200" />
                    <span>Start Free Diagnosis (Chatbot)</span>
                  </button>

                  <Link
                    href="/medicine-scanner"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-black px-6 py-4 rounded-2xl text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-blue-400/40"
                  >
                    <Pill className="w-5 h-5 text-blue-200" />
                    <span>Medicine Scanner (AI Scan)</span>
                  </Link>

                  <Link
                    href="/body-training"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-5 py-4 rounded-2xl text-sm transition-all duration-200 cursor-pointer border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
                  >
                    <Dumbbell className="w-4 h-4 text-orange-600" />
                    <span>Yoga &amp; Exercises</span>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Trust Badges */}
              <ScrollReveal direction="fade" delay={0.25}>
                <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    3-Step Q&amp;A Analysis
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    Fast Indian Male Voice
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    Patanjali &amp; AYUSH Verified
                  </span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Mascot Hero Card (Apple/Stripe 3D Tilt Card with Sheen) */}
            <div className="lg:col-span-5 flex justify-center">
              <ScrollReveal direction="zoom" delay={0.2} distance={20} className="w-full max-w-sm">
                <TiltCard maxTilt={10} scale={1.03} glareOpacity={0.2} className="rounded-3xl shadow-xl shadow-slate-200/50">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-gray-100 text-center">
                    <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl border border-orange-200 inline-block mb-4 shadow-inner">
                      <ChotelalFace size="xl" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 font-serif">
                      Vaidya Chotelal Ji
                    </h3>
                    <p className="text-xs text-orange-600 font-bold mt-0.5 tracking-wide">
                      Senior Ayurvedic Physician • 30+ Years Wisdom
                    </p>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed font-normal">
                      &ldquo;Ghabraiye mat beta! Ayurveda me har bimari ka samadhan prakriti aur sahi aahar me maujood hai. Mujhse be-jhijhak baat karein.&rdquo;
                    </p>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
                      <span>30+ Years Wisdom</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">10,000+ Relieved Patients</span>
                    </div>
                  </div>
                </TiltCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 CATEGORIES SECTION */}
      <section className="py-20 bg-[#F8FAFC] border-b border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.05} distance={30}>
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Focus Areas
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
                4 Mukhya Samasyaayein Aur Unka Upchar
              </h2>
              <p className="text-sm text-slate-600">
                Aapki takleef chahe baithne se ho ya office stress se — sahi category chun kar jaanch karein.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <ScrollReveal key={cat.id} direction="up" delay={0.1 + idx * 0.08} distance={40}>
                  <TiltCard maxTilt={8} scale={1.02} glareOpacity={0.12} className="h-full rounded-2xl">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 h-full">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-xl border ${cat.iconColor} shadow-xs`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            {cat.badge}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-900 font-serif group-hover:text-orange-600 transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <Link
                        href={cat.path}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 pt-3 border-t border-slate-50 transition-colors"
                      >
                        <span>Vistrit Jankari &amp; Nuskhe</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3-STEP Q&A FLOW) */}
      <section className="py-20 bg-white border-b border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Simple 3-Step Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
                Kaise Kaam Karta Hai Chotelal Ji AI
              </h2>
              <p className="text-sm text-slate-600">
                Bina doctor ki lambi line ke, ghar baithe authentic Ayurvedic consult payein.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <ScrollReveal direction="up" delay={0.1} distance={40}>
              <TiltCard maxTilt={6} scale={1.02} className="rounded-2xl h-full">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-7 text-center space-y-3 h-full hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-orange-500/20">
                    1
                  </div>
                  <h3 className="font-black text-slate-900 text-base font-serif">
                    Symptoms Batayein
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Type karein ya mic dabakar apni bhasha me bolein. Jaise: &ldquo;Mujhe pet me jalan aur baal jhadne ki takleef hai.&rdquo;
                  </p>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal direction="up" delay={0.2} distance={40}>
              <TiltCard maxTilt={6} scale={1.02} className="rounded-2xl h-full">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-7 text-center space-y-3 h-full hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
                    2
                  </div>
                  <h3 className="font-black text-slate-900 text-base font-serif">
                    Chotelal Ji 2-3 Sawal Puchenge
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Vaidya Chotelal Ji aapse ek-ek karke takleef ki gehraai, neend aur khane-peene ke bare me sawal puchenge.
                  </p>
                </div>
              </TiltCard>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal direction="up" delay={0.3} distance={40}>
              <TiltCard maxTilt={6} scale={1.02} className="rounded-2xl h-full">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-7 text-center space-y-3 h-full hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
                    3
                  </div>
                  <h3 className="font-black text-slate-900 text-base font-serif">
                    Aushadhi + Patanjali Video + Voice
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Exact aushadhi dosage, yoga, aahar chart, aur Patanjali / Swami Ramdev ka pramanit YouTube video embed milega.
                  </p>
                </div>
              </TiltCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. CTA & WHATSAPP SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white relative overflow-hidden">
        <ScrollReveal direction="zoom" delay={0.1} distance={30}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 shadow-sm animate-bounce duration-1000">
              <MessageCircle className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
              Judie Hamare WhatsApp Channel Se
            </h2>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Har roz naye gharelu nuskhe, seasonal diet tips aur Ayurvedic aushadhi ki jankari seedhe apne phone par paayein.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WHATSAPP_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join WhatsApp Channel (Official)</span>
              </a>

              <button
                type="button"
                onClick={handleStartConsultation}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-bold text-sm px-7 py-4 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span>Free AI Consultation Shuru Karein</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* CHOTELAL JI CHATBOT MODAL */}
      <ChotelalChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </PageLayout>
  );
};
