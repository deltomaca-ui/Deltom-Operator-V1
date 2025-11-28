import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Layers, 
  Code2, 
  Terminal,
  Wifi,
  AlertCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { HashRouter } from 'react-router-dom';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Si le client n'est pas initialisé (config manquante), on ne tente pas de connexion
    if (!supabase) return;

    const checkConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setIsSupabaseConnected(true);
        console.log('✅ Connexion Supabase établie avec succès');
      } catch (err: any) {
        console.error('❌ Erreur de connexion Supabase:', err);
        setIsSupabaseConnected(false);
        setConnectionError(err.message || 'Erreur inconnue');
      }
    };

    checkConnection();
  }, []);

  // 🔴 CAS 1 : Configuration manquante (Variable d'environnement non chargées)
  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-xl border border-amber-200 overflow-hidden">
          <div className="bg-amber-50 p-6 border-b border-amber-100 flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-900">Configuration Requise</h1>
              <p className="text-amber-700 text-sm">L'application ne peut pas démarrer.</p>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="text-slate-600">
              <p className="mb-4">
                Les variables d'environnement Supabase ne sont pas détectées par Vite. 
                Cela arrive souvent lors de la première configuration ou si le fichier <code>.env.local</code> n'est pas chargé.
              </p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono text-green-400">
                # Vérifiez que ce fichier existe :<br/>
                .env.local<br/><br/>
                # Et qu'il contient vos clés :<br/>
                VITE_SUPABASE_URL=...<br/>
                VITE_SUPABASE_ANON_KEY=...
              </code>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <strong>Action requise :</strong> Redémarrez le serveur de développement pour charger les nouvelles variables.
                <br/>
                <code className="bg-blue-100 px-1 py-0.5 rounded mt-1 inline-block">Ctrl+C</code> puis <code className="bg-blue-100 px-1 py-0.5 rounded mt-1 inline-block">npm run dev</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 CAS 2 : Application Normale
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
              <span className={`h-2 w-2 rounded-full ${isSupabaseConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-xs font-medium text-slate-300">
                {isSupabaseConnected === null ? 'Connexion...' : isSupabaseConnected ? 'Système Connecté' : 'Déconnecté'}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">État de l'Infrastructure</h2>
                <p className="text-slate-600">
                  Vérification des services et de la base de données.
                </p>
              </div>
            </div>

            {/* Connection Status Alert */}
            {isSupabaseConnected && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
                <Wifi className="h-5 w-5 mr-3" />
                <div>
                  <span className="font-semibold">Connexion Supabase active.</span>
                </div>
              </div>
            )}

            {connectionError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-3" />
                <div>
                  <span className="font-semibold">Erreur de connexion :</span> {connectionError}
                </div>
              </div>
            )}

            {/* Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <Code2 className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Frontend Core</h3>
                  <p className="text-sm text-slate-500">React 19, TS, Vite, Tailwind</p>
                </div>
              </div>
              
              <div className={`p-4 border rounded-lg flex items-start space-x-3 transition-colors ${isSupabaseConnected ? 'border-green-200 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                <Database className={`h-5 w-5 mt-1 ${isSupabaseConnected ? 'text-green-600' : 'text-slate-400'}`} />
                <div>
                  <h3 className={`font-semibold ${isSupabaseConnected ? 'text-green-900' : 'text-slate-900'}`}>Backend & Data</h3>
                  <p className={`text-sm ${isSupabaseConnected ? 'text-green-700' : 'text-slate-500'}`}>
                    {isSupabaseConnected ? 'Supabase Connecté & Prêt' : 'En attente de connexion...'}
                  </p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Architecture</h3>
                  <p className="text-sm text-slate-500">Multi-rôles</p>
                </div>
              </div>

              <div className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start space-x-3">
                <Terminal className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-slate-900">Protocole</h3>
                  <p className="text-sm text-slate-500">Mode Strict</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;