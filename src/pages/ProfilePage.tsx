import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { PageLayout } from '../components/PageLayout';
import { User, Mail, Phone, Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(docSnap.data() as any);
      }
    }
    loadProfile();
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setLoading(true);
    await setDoc(doc(db, 'users', user.uid), profile);
    alert('✅ Profile updated!');
    setLoading(false);
  }

  return (
    <PageLayout pageTitle="Mera Profile" pageSubtitle="Apni jankari update karein">
      <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
            <User className="text-orange-500" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-bold">{user?.email}</p>
            </div>
          </div>
          <input className="w-full p-3 border rounded-xl" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Full Name" />
          <input className="w-full p-3 border rounded-xl" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Phone Number" />
          <button onClick={handleSave} className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl">{loading ? <Loader2 className="animate-spin mx-auto"/> : 'Save Profile'}</button>
        </div>
      </div>
    </PageLayout>
  );
};
