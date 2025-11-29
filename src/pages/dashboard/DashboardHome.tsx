import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function DashboardHome() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bienvenue, {user?.full_name}</h1>
            <p className="text-slate-500 mt-1">
              Connecté en tant que <span className="font-semibold text-blue-600 capitalize">{user?.role}</span>
            </p>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900">Tableau de bord</h3>
            <p className="text-sm text-slate-500 mt-2">Ceci est une page temporaire pour valider l'authentification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}