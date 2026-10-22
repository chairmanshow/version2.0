import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { PlusCircle, Activity } from 'lucide-react';

export const SymptomTracker: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [severity, setSeverity] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, 'symptomLogs'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const parsedLogs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let timestamp = 0;
        let displayDate = 'Today';
        if (data.date) {
          if (typeof data.date.toDate === 'function') {
            const d = data.date.toDate();
            timestamp = d.getTime();
            displayDate = d.toLocaleDateString();
          } else if (data.date instanceof Date) {
            timestamp = data.date.getTime();
            displayDate = data.date.toLocaleDateString();
          } else if (typeof data.date === 'string' || typeof data.date === 'number') {
            const d = new Date(data.date);
            timestamp = d.getTime();
            displayDate = d.toLocaleDateString();
          }
        }
        return {
          id: docSnap.id,
          ...data,
          timestamp,
          date: displayDate,
        };
      });

      // Sort by date ascending in memory
      parsedLogs.sort((a, b) => a.timestamp - b.timestamp);
      setLogs(parsedLogs);
    } catch (err) {
      console.warn('Note on symptom logs fetch:', err);
    }
  };

  const handleLog = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'symptomLogs'), {
        userId: user.uid,
        date: new Date(),
        severity,
        createdAt: new Date().toISOString(),
      });
      await fetchLogs();
    } catch (err) {
      console.warn('Note on symptom logging:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-orange-500" />
          Symptom Progress Tracker
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Daily Severity (1-10): {severity}</label>
          <input 
            type="range" min="1" max="10" value={severity} 
            onChange={(e) => setSeverity(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <button 
            onClick={handleLog} disabled={loading}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition"
          >
            {loading ? 'Logging...' : 'Log Daily Progress'}
          </button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="severity" stroke="#f97316" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
