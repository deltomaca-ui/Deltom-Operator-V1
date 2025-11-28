import { AuthProvider, useAuth } from './context/AuthContext';
   
function TestAuth() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-4">Chargement de la session...</div>;
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Authentification</h1>
      <div className="p-4 border rounded bg-slate-100">
        Statut : <strong>{user ? 'Connecté' : 'Non connecté'}</strong>
        {user && (
          <div className="mt-2 text-sm text-slate-600">
            Email: {user.email} <br/>
            Role: {user.role} <br/>
            Nom: {user.full_name}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TestAuth />
    </AuthProvider>
  );
}