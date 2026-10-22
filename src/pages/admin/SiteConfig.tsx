import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const SiteConfig: React.FC = () => {
  const [config, setConfig] = useState({ siteName: '', tagline: '', greeting: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'site-config'), (doc) => {
      if (doc.exists()) setConfig(doc.data() as any);
    });
    return unsub;
  }, []);

  const saveConfig = async () => {
    setLoading(true);
    await setDoc(doc(db, 'settings', 'site-config'), config);
    alert('Settings updated!');
    setLoading(false);
  };

  return (
    <div className="space-y-4 max-w-lg">
      <h1 className="text-2xl font-bold">Site Configuration</h1>
      <input className="w-full p-2 border rounded" value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} placeholder="Site Name" />
      <input className="w-full p-2 border rounded" value={config.tagline} onChange={e => setConfig({...config, tagline: e.target.value})} placeholder="Tagline" />
      <textarea className="w-full p-2 border rounded" value={config.greeting} onChange={e => setConfig({...config, greeting: e.target.value})} placeholder="Greeting" />
      <button onClick={saveConfig} className="bg-orange-500 text-white px-4 py-2 rounded">{loading ? 'Saving...' : 'Save'}</button>
    </div>
  );
};
