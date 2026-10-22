import React from 'react';
import { Routes, Route, Navigate, MemoryRouter } from 'react-router-dom';
import { AdminLayout } from '../pages/admin/AdminLayout';
import { Dashboard } from '../pages/admin/Dashboard';
import { SiteConfig } from '../pages/admin/SiteConfig';
import { Colors } from '../pages/admin/Colors';
import { Categories } from '../pages/admin/Categories';
import { Blog } from '../pages/admin/Blog';
import { Herbs } from '../pages/admin/Herbs';
import { Ads } from '../pages/admin/Ads';
import { Courses } from '../pages/admin/Courses';
import { Doctors } from '../pages/admin/Doctors';
import { useAuth } from '../context/AuthContext';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.email !== 'sumitshrivas24@gmail.com') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

export const AdminRouter: React.FC = () => {
  return (
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="site-config" element={<SiteConfig />} />
          <Route path="colors" element={<Colors />} />
          <Route path="categories" element={<Categories />} />
          <Route path="blog" element={<Blog />} />
          <Route path="herbs" element={<Herbs />} />
          <Route path="ads" element={<Ads />} />
          <Route path="courses" element={<Courses />} />
          <Route path="doctors" element={<Doctors />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};
