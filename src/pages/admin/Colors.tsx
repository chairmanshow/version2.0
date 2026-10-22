import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const Colors: React.FC = () => {
  const [colors, setColors] = useState({ primary: '#FF9933', secondary: '#0EA5E9', background: '#FFFFFF' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadColors() {
      const docSnap = await getDoc(doc(db, 'settings', 'theme'));
      if (docSnap.exists()) setColors(docSnap.data() as any);
    }
    loadColors();
  }, []);

  async function handleSave() {
    setSaving(true);
    await setDoc(doc(db, 'settings', 'theme'), colors);
    alert('✅ Colors saved!');
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">🎨 Colors Management</h1>
      {['primary', 'secondary', 'background'].map(c => (
        <div key={c}>
          <label className="block capitalize font-medium mb-1">{c} Color</label>
          <input type="color" value={colors[c as keyof typeof colors]} onChange={(e) => setColors({...colors, [c]: e.target.value})} className="w-full h-12 rounded cursor-pointer" />
        </div>
      ))}
      <button onClick={handleSave} className="bg-orange-500 text-white px-6 py-3 rounded-lg w-full">{saving ? 'Saving...' : 'Save Colors'}</button>
    </div>
  );
};
