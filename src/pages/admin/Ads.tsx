import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const Ads: React.FC = () => {
  const [ads, setAds] = useState({ adsense: '', adsterra: '' });

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'settings', 'ads'));
      if (snap.exists()) setAds(snap.data() as any);
    }
    load();
  }, []);

  async function save() {
    await setDoc(doc(db, 'settings', 'ads'), ads);
    alert('✅ Ads updated!');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Ads Management</h1>
      <textarea className="w-full h-32 p-2 border rounded" value={ads.adsense} onChange={e => setAds({...ads, adsense: e.target.value})} placeholder="AdSense Code" />
      <textarea className="w-full h-32 p-2 border rounded" value={ads.adsterra} onChange={e => setAds({...ads, adsterra: e.target.value})} placeholder="Adsterra Code" />
      <button onClick={save} className="bg-orange-500 text-white px-6 py-2 rounded">Save Ads</button>
    </div>
  );
};
