import React from 'react';
import { Link } from '../router';
import { Stethoscope, Camera, Dumbbell, Apple, BookOpen, Leaf, Megaphone, Heart, Search, Book } from 'lucide-react';

const features = [
  { name: 'Diagnose', path: '/diagnose', icon: Stethoscope, desc: 'AI-powered symptom checker' },
  { name: 'Medicine Scanner', path: '/medicine-scanner', icon: Camera, desc: 'Scan and analyze medicines' },
  { name: 'Yoga & Training', path: '/body-training', icon: Dumbbell, desc: 'Yoga and wellness exercise guides' },
  { name: 'Diet Expert', path: '/diet', icon: Apple, desc: 'AI personalized diet plans' },
  { name: 'Herbs Encyclopedia', path: '/herbs', icon: Leaf, desc: 'Comprehensive herbs guide' },
  { name: 'Remedies', path: '/remedies', icon: Heart, desc: 'Ayurvedic home remedies' },
  { name: 'Blog', path: '/blog', icon: BookOpen, desc: 'Health articles' },
  { name: 'Rural Health', path: '/rural-health', icon: Search, desc: 'Rural health resources' },
];

export const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Features Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.name}
            href={feature.path}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex items-center space-x-4"
          >
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <feature.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">{feature.name}</h2>
              <p className="text-sm text-slate-500">{feature.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
