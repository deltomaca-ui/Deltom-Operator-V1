import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/types';
import { 
  Shield, Key, User, Briefcase, Loader2, AlertCircle, 
  ArrowRight, CheckCircle2, Building2, Sparkles 
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { signIn, signUp, loading, user } = useAuth();
  
  // Si déjà connecté, ne pas afficher le login (sécurité visuelle supplémentaire)
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim();

    try {
      if (mode === 'login') {
        const { error } = await signIn(cleanEmail, password);
        if (error) throw error;
        // La redirection sera gérée par le composant parent (AppRoutes)
      } else {
        if (!fullName.trim()) {
          throw new Error("Le nom complet est requis");
        }
        const { error, data } = await signUp(cleanEmail, password, fullName, selectedRole);
        if (error) throw error;
        
        if (data.user && !data.session) {
          setSuccessMessage("Compte créé avec succès ! Vérifiez vos emails.");
          setMode('login');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('Invalid login credentials')) {
        setError("Identifiants incorrects.");
      } else {
        setError(err.message || 'Une erreur est survenue');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleConfig = {
    [UserRole.ADMIN]: { 
      label: 'Administrateur',
      icon: Shield, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      ring: 'focus:ring-purple-500',
      desc: 'Gestion globale' 
    },
    [UserRole.CLIENT]: { 
      label: 'Client / Propriétaire',
      icon: User, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      ring: 'focus:ring-blue-500',
      desc: 'Mes logements' 
    },
    [UserRole.PRESTATAIRE]: { 
      label: 'Prestataire',
      icon: Briefcase, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      ring: 'focus:ring-emerald-500',
      desc: 'Mes missions' 
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* SECTION GAUCHE : FORMULAIRE */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white z-10 relative">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Header Mobile Only */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">CleanManager</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'login' ? 'Bon retour' : 'Commencer'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'login' 
                ? 'Connectez-vous pour gérer vos interventions.' 
                : 'Créez votre compte en quelques secondes.'}
            </p>
          </div>

          {/* Alertes */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champs Inscription Uniquement */}
            {mode === 'register' && (
              <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Sélecteur de Rôle */}
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                    const Icon = roleConfig[role].icon;
                    const isActive = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`
                          flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
                          ${isActive 
                            ? `${roleConfig[role].bg} ${roleConfig[role].border} ring-2 ${roleConfig[role].ring.replace('focus:', '')} ring-offset-1` 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500'}
                        `}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isActive ? roleConfig[role].color : 'text-slate-400'}`} />
                        <span className={`text-[10px] font-semibold ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                          {roleConfig[role].label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      placeholder="Jean Dupont"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Champs Communs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email professionnel</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                    placeholder="contact@entreprise.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Connexion sécurisée' : 'Créer mon compte'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              {mode === 'login' ? "Pas encore membre ?" : "Déjà un compte ?"}
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="ml-2 font-semibold text-blue-600 hover:text-blue-500 transition-colors"
              >
                {mode === 'login' ? "Créer un compte" : "Se connecter"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION DROITE : BRANDING (Masqué sur mobile) */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900 overflow-hidden">
        {/* Motif de fond abstrait */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-slate-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />
        
        {/* Contenu Branding */}
        <div className="absolute inset-0 flex flex-col justify-between p-20 z-10 text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-5 h-5 text-blue-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">CleanManager SaaS</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Gérez vos interventions <span className="text-blue-400">sans effort</span>.
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              La plateforme tout-en-un pour les conciergeries, propriétaires et prestataires de services. Planification, suivi et facturation simplifiés.
            </p>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-medium overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="text-white block">Rejoint par +2000 pros</span>
                <span className="text-blue-400">★★★★★ 4.9/5</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end text-xs text-slate-500 font-medium tracking-wide uppercase">
            <span>© 2024 CleanManager</span>
            <span>v2.0.1 Beta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;