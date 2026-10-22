import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const Herbs: React.FC = () => {
  const [herbs, setHerbs] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    const snap = await getDocs(collection(db, 'herbs'));
    setHerbs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Herbs Database</h1>
      <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} placeholder="Herb Name" />
      <button onClick={async()=>{if(name){await addDoc(collection(db,'herbs'), {name}); setName(''); load()}}} className="bg-green-500 text-white px-4 py-2 rounded">Add Herb</button>
      {herbs.map(h => <div key={h.id} className="p-2 border">{h.name}</div>)}
    </div>
  );
};
