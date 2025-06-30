import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/public/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import NotFoundPage from '@/pages/public/NotFoundPage';
import { PUBLIC_ROUTES, SPECIAL_ROUTES } from '@/constants/routes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={PUBLIC_ROUTES.HOME} element={<LandingPage />} />
      <Route path={PUBLIC_ROUTES.LOGIN} element={<LoginPage />} />
      
      {/* Redirect root to home */}
      <Route path="/" element={<Navigate to={PUBLIC_ROUTES.HOME} replace />} />
      
      {/* Error Routes */}
      <Route path={SPECIAL_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      
      {/* Catch all route - redirect to 404 */}
      <Route path="*" element={<Navigate to={SPECIAL_ROUTES.NOT_FOUND} replace />} />
    </Routes>
  );
};

export default AppRoutes; 