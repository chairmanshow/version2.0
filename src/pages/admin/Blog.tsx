import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => { load(); }, []);
  async function load() {
    const snap = await getDocs(collection(db, 'posts'));
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Blog Posts</h1>
      <input className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post Title" />
      <button onClick={async()=>{if(title){await addDoc(collection(db,'posts'), {title}); setTitle(''); load()}}} className="bg-orange-500 text-white px-4 py-2 rounded">Publish</button>
      {posts.map(p => <div key={p.id} className="p-2 border">{p.title}</div>)}
    </div>
  );
};
