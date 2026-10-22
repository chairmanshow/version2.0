import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Settings, Palette, List, BookOpen, Leaf, Megaphone, Video, Stethoscope } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const menu = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Site Config', path: '/admin/site-config', icon: Settings },
    { name: 'Colors', path: '/admin/colors', icon: Palette },
    { name: 'Categories', path: '/admin/categories', icon: List },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen },
    { name: 'Herbs', path: '/admin/herbs', icon: Leaf },
    { name: 'Ads', path: '/admin/ads', icon: Megaphone },
    { name: 'Courses', path: '/admin/courses', icon: Video },
    { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {menu.map(item => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name} 
                to={item.path} 
                end={item.path === '/admin'}
                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-orange-500 text-white' : 'hover:bg-orange-50'}`}
              >
                <Icon size={20} /> {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto"><Outlet /></main>
    </div>
  );
};
