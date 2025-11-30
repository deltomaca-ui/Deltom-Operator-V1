import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/types';
import { Shield, Key, User, Briefcase, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { signIn, signUp, loading, user } = useAuth();
  
  // ✅ SÉCURITÉ : Redirection automatique si déjà connecté
  if (user && !loading) {
    const defaultPath = user.role === 'admin' ? '/admin' : user.role === 'client' ? '/client' : '/prestataire';
    return <Navigate to={defaultPath} replace />;
  }

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);
  
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();

    try {
      if (mode === 'login') {
        const { error } = await signIn(cleanEmail, password);
        if (error) throw error;
      } else {
        if (!fullName.trim()) {
          setError("Le nom complet est requis pour l'inscription");
          return;
        }
        const { error, data } = await signUp(cleanEmail, password, fullName, selectedRole);
        if (error) throw error;
        
        if (data.user && !data.session) {
          setSuccessMessage("Compte créé ! Si 'Confirm Email' est activé dans Supabase, veuillez valider votre email.");
          setMode('login');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('Invalid login credentials')) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError(err.message || 'Une erreur est survenue');
      }
    }
  };

  const roleConfig = {
    [UserRole.ADMIN]: { 
      icon: Shield, 
      color: 'text-purple-600', 
      bg: 'bg-purple-100',
      desc: 'Gestion globale, statistiques et attributions.' 
    },
    [UserRole.CLIENT]: { 
      icon: User, 
      color: 'text-blue-600', 
      bg: 'bg-blue-100',
      desc: 'Suivi des biens et historique des interventions.' 
    },
    [UserRole.PRESTATAIRE]: { 
      icon: Briefcase, 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      desc: 'Planning des missions et rapports d\'intervention.' 
    }
  };

  const ActiveIcon = roleConfig[selectedRole].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h1>
            <p className="text-gray-500 text-sm">
              {mode === 'login' ? 'Accédez à votre espace CleanManager' : 'Rejoignez la plateforme de gestion'}
            </p>
          </div>

          {/* Sélecteur de Rôle */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-6 shadow-inner">
            {(Object.keys(roleConfig) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                type="button"
                className={`flex-1 py-2 text-xs md:text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedRole === role 
                    ? 'bg-white text-gray-900 shadow-sm transform scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Info bulle rôle */}
          <div className={`flex items-start gap-4 p-4 rounded-xl mb-6 ${roleConfig[selectedRole].bg} transition-colors duration-300 border border-transparent`}>
            <ActiveIcon className={`w-6 h-6 mt-1 flex-shrink-0 ${roleConfig[selectedRole].color}`} />
            <div>
              <h3 className={`font-semibold text-sm ${roleConfig[selectedRole].color}`}>
                {mode === 'login' ? `Espace ${selectedRole}` : `Inscription ${selectedRole}`}
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{roleConfig[selectedRole].desc}</p>
            </div>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center gap-2">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={mode === 'register'}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                />
                <Key className="w-5 h-5 text-gray-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
              {mode === 'register' && (
                <p className="text-xs text-gray-500 mt-1">6 caractères minimum</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                mode === 'login' ? 'Se connecter' : 'Créer mon compte'
              )}
            </button>
          </form>

          {/* Toggle login/register */}
          <div className="mt-6 text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Pas encore de compte ?" : "Déjà inscrit ?"}
              <button 
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700 hover:underline focus:outline-none transition-colors"
              >
                {mode === 'login' ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;