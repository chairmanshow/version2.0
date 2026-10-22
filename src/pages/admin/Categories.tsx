import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export const Categories: React.FC = () => {
  const [cats, setCats] = useState<any[]>([]);
  const [newCat, setNewCat] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    const snap = await getDocs(collection(db, 'categories'));
    setCats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }
  async function add() {
    if (!newCat) return;
    await addDoc(collection(db, 'categories'), { name: newCat });
    setNewCat(''); load();
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="flex gap-2">
        <input className="border p-2 rounded" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Category Name" />
        <button onClick={add} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
      </div>
      {cats.map(c => <div key={c.id} className="p-2 border flex justify-between">{c.name} <button onClick={async()=>{await deleteDoc(doc(db,'categories',c.id)); load()}} className="text-red-500">Delete</button></div>)}
    </div>
  );
};
