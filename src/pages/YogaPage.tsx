import React, { useState, useMemo } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Clock, Search, Dumbbell, Activity } from 'lucide-react';
import { YOGA_PRACTICES, YogaItem } from '../data/yogaPoses';

export const YogaPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'asanas' | 'pranayama' | 'mudras'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return YOGA_PRACTICES.filter((p) => {
      const matchesCategory = filter === 'all' || p.category === filter;
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.hindiName.includes(searchTerm) ||
        p.targetConditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchTerm]);

  return (
    <PageLayout
      pageTitle="Yoga Video Library"
      pageSubtitle="Complete guide with video tutorials for your health."
      badge="Yoga Library"
    >
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name or condition..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-xl border border-stone-200 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All</option>
            <option value="asanas">Asanas</option>
            <option value="pranayama">Pranayama</option>
            <option value="mudras">Mudras</option>
          </select>
        </div>

        {/* Practices Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col">
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${item.youtubeId}`}
                title={item.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="p-6 flex-grow space-y-4">
                <h3 className="text-xl font-bold">{item.hindiName} ({item.name})</h3>
                <div className="flex gap-2 text-sm text-stone-600">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {item.duration}</span>
                  <span className="flex items-center gap-1"><Dumbbell className="w-4 h-4" /> {item.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.targetConditions.map(c => <span key={c} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-xs">{c}</span>)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Steps:</h4>
                  <ul className="list-disc pl-5 text-sm text-stone-700">
                    {item.instructions.map((step, idx) => <li key={idx}>{step}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
