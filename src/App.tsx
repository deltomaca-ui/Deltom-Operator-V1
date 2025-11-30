import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardHome from './pages/dashboard/DashboardHome';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Chargement de l'application...</p>
        </div>
      </div>
    );
  }

  const defaultPath = user 
    ? (user.role === 'admin' ? '/admin' : user.role === 'client' ? '/client' : '/prestataire')
    : '/login';

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultPath} replace />} />
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardHome />
        </ProtectedRoute>
      } />
      
      <Route path="/client/*" element={
        <ProtectedRoute allowedRoles={['client']}>
           <DashboardHome />
        </ProtectedRoute>
      } />
      
      <Route path="/prestataire/*" element={
        <ProtectedRoute allowedRoles={['prestataire']}>
           <DashboardHome />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}