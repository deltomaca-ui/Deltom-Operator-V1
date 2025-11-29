import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardHome from './pages/dashboard/DashboardHome';

// Composant qui gère les routes internes pour accéder au hook useAuth
function AppRoutes() {
  const { user, loading } = useAuth();

  // Loader global pendant l'initialisation de l'auth
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

  // Logique de redirection par défaut
  const defaultPath = user 
    ? (user.role === 'admin' ? '/admin' : user.role === 'client' ? '/client' : '/prestataire')
    : '/login';

  return (
    <Routes>
      {/* Route par défaut : Redirection intelligente */}
      <Route path="/" element={<Navigate to={defaultPath} replace />} />

      {/* Route publique : Login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Route Protégée : Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardHome />
          </ProtectedRoute>
        }
      />
      
      {/* Route Protégée : Client */}
      <Route 
        path="/client/*" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
             <DashboardHome />
          </ProtectedRoute>
        } 
      />
      
      {/* Route Protégée : Prestataire */}
      <Route 
        path="/prestataire/*" 
        element={
          <ProtectedRoute allowedRoles={['prestataire']}>
             <DashboardHome />
          </ProtectedRoute>
        } 
      />

      {/* Fallback 404 -> Redirection Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}