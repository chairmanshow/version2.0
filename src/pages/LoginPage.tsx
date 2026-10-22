import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChotelalLogo } from '../components/ChotelalLogo';
import { FirebaseSetupNotice } from '../components/FirebaseSetupNotice';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
} from 'lucide-react';
import { Link, useRouter } from '../router';

export const LoginPage: React.FC = () => {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    error,
    unauthorizedDomain,
    emailProviderDisabled,
    clearError,
  } = useAuth();
  const { navigate } = useRouter();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'google' | 'email_signin' | 'email_signup'>('google');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsSigningIn(true);
      setLocalError(null);
      clearError();
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError(err?.message || 'Google Login failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSigningIn(true);
      setLocalError(null);
      clearError();
      if (authMode === 'email_signup') {
        await signUpWithEmail(email, password, name || email.split('@')[0]);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setLocalError(err?.message || 'Email authentication failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const isFirebaseSetupIssue =
    Boolean(unauthorizedDomain) ||
    Boolean(emailProviderDisabled) ||
    Boolean(localError && (localError.includes('Firebase') || localError.includes('Authorized Domain') || localError.includes('operation-not-allowed'))) ||
    Boolean(error && (error.includes('Firebase') || error.includes('Authorized Domain') || error.includes('operation-not-allowed')));

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative"
      >
        {/* Animated Medical Cross */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-4xl mb-4 shadow-lg"
        >
          ＋
        </motion.div>
        
        <div className="relative z-10 space-y-5">
          {/* Chotelal Ji Circular Avatar Emblem */}
          <div className="flex justify-center">
            <ChotelalLogo size="lg" showSubtitle={false} badgeOnly={true} />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 px-3 py-0.5 rounded-full text-xs font-bold text-orange-600">
              <Sparkles className="w-3.5 h-3.5" />
              <span>30+ Years Ayurvedic Wisdom</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-serif tracking-tight">
              Chotelal Ji <span className="text-orange-500">Health</span>
            </h1>
          </div>

          {isFirebaseSetupIssue && (
            <FirebaseSetupNotice
              onSuccessDemoLogin={() => navigate('/')}
              defaultEmail={email}
              defaultName={name}
            />
          )}

          {!isFirebaseSetupIssue && (localError || error) && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center justify-between text-left">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{localError || error}</span>
              </div>
            </div>
          )}

          {authMode === 'google' ? (
            <div className="space-y-4 pt-1">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                {isSigningIn ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <span>Google से 1-क्लिक लॉगिन</span>}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('email_signin')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-orange-600" />
                <span>Email व Password से लॉगिन करें</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-left pt-1">
              {authMode === 'email_signup' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">आपका नाम</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="राहुल शर्मा" className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500" />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ईमेल</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">पासवर्ड</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="कम से कम 6 अक्षर" className="w-full p-2 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:border-orange-500" />
              </div>
              <button type="submit" disabled={isSigningIn} className="w-full py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer">
                {isSigningIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{authMode === 'email_signup' ? 'निःशुल्क खाता बनाएं' : 'लॉगिन करें'}</span>}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
