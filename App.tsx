import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Database, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Terminal,
  AlertCircle
} from 'lucide-react';
import { HashRouter } from 'react-router-dom';

const App: React.FC = () => {
  const [activeStep] = useState<string>("Initialisation");

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CleanManager SaaS</h1>
                <p className="text-slate-400 text-sm">Assistant de Développement React + Supabase</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300">Système Prêt</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Configuration du Projet Validée</h2>
              <p className="text-slate-600">
                L'environnement de développement est initialisé selon tes spécifications strictes.
              </p>
            </div>

            {/* Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <Code2 className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Frontend Core</h3>
                  <p className="text-sm text-slate-500">React 19 (via 18+ API), TypeScript, Vite, TailwindCSS</p>
                </div>
              </div>
              
              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <Database className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Backend & Data</h3>
                  <p className="text-sm text-slate-500">Supabase PostgreSQL, Auth, Row Level Security (RLS)</p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Architecture</h3>
                  <p className="text-sm text-slate-500">Multi-rôles (Admin, Client, Prestataire)</p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <Terminal className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Protocole</h3>
                  <p className="text-sm text-slate-500">Développement incrémental & validation stricte</p>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-bold text-green-800 mb-2">Compris. Prêt à coder l'étape que tu vas me donner.</h3>
              <p className="text-green-700 max-w-md">
                J'attends ta première instruction (ex: "Étape 1 : Authentification" ou "Étape 2 : Modélisation DB").
                Je ne coderai rien de plus sans ton aval.
              </p>
            </div>

            {/* Guidelines Reminder */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Règles actives</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                  Pas de code superflu ou de TODOs
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                  Validation RLS systématique
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></span>
                  Confirmation des choix techniques
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;