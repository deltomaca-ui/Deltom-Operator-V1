import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { Profile, UserRole } from '../types/types';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const initializedRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    if (fetchingRef.current) return null;
    
    fetchingRef.current = true;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('⚠️ Profile not found:', error.message);
        return null;
      }
      console.log('✅ Profil récupéré:', data.full_name);
      return data as Profile;
    } catch (err) {
      console.error('❌ Erreur fetch profile:', err);
      return null;
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const createProfileIfMissing = useCallback(async (sessionUser: any) => {
    if (!supabase) return null;
    try {
      const newProfileDb = {
        id: sessionUser.id,
        full_name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Utilisateur',
        role: (sessionUser.user_metadata?.role as UserRole) || UserRole.CLIENT,
        email: sessionUser.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert([newProfileDb], { onConflict: 'id' });

      if (error) {
        console.error('❌ Erreur création profil auto:', error);
        return null;
      }
      console.log('✨ Profil créé/mis à jour:', newProfileDb.full_name);
      return newProfileDb as Profile;
    } catch (e) {
      console.error('❌ Exception création profil:', e);
      return null;
    }
  }, []);

  const processSession = useCallback(async (session: any) => {
    if (!session?.user) {
      if (mountedRef.current) {
        setUser(null);
        setLoading(false);
      }
      return;
    }

    try {
      let profile = await fetchProfile(session.user.id);

      if (!profile) {
        console.log('⚠️ Profil manquant, tentative de création...');
        profile = await createProfileIfMissing(session.user);
      }

      if (mountedRef.current) {
        if (profile) {
          if (!profile.email && session.user.email) {
            profile.email = session.user.email;
          }
          setUser(profile);
          console.log('👤 Utilisateur connecté:', profile.email, `(${profile.role})`);
        } else {
          const fallbackProfile: Profile = {
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as UserRole) || UserRole.CLIENT,
            full_name: session.user.user_metadata?.full_name || 'Utilisateur',
          };
          setUser(fallbackProfile);
          console.warn('⚠️ Mode fallback activé pour le profil');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Erreur processSession:', error);
      if (mountedRef.current) {
        if (session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: (session.user.user_metadata?.role as UserRole) || UserRole.CLIENT,
            full_name: 'Mode Secours'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    }
  }, [fetchProfile, createProfileIfMissing]);

  useEffect(() => {
    if (!supabase) {
      console.error("❌ Supabase client not initialized");
      setLoading(false);
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    mountedRef.current = true;
    let authListener: any = null;

    const initializeAuth = async () => {
      console.log('🔵 Initializing auth...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('✅ Session retrieved:', session ? 'Active' : 'No session');
        
        if (session) {
          await processSession(session);
        } else {
          if (mountedRef.current) setLoading(false);
        }
      } catch (error) {
        console.error('❌ Auth init error:', error);
        if (mountedRef.current) setLoading(false);
      }
    };

    initializeAuth();

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth event:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await processSession(session);
      } else if (event === 'SIGNED_OUT') {
        if (mountedRef.current) {
          setUser(null);
          setLoading(false);
        }
      }
    });
    authListener = data;

    return () => {
      console.log('🔴 Cleaning up auth');
      mountedRef.current = false;
      initializedRef.current = false;
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [processSession]);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase non initialisé' };
    console.log('🔵 Signing in:', email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('❌ Sign in failed:', error.message);
        return { error };
      }
      if (data.session) await processSession(data.session);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: string) => {
    if (!supabase) return { error: 'Supabase non initialisé', data: null };
    console.log('🔵 Signing up:', email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, role: role } }
      });
      if (error) {
        console.error('❌ Sign up failed:', error.message);
        return { error, data };
      }
      console.log('✅ Sign up successful');
      if (data.session) await processSession(data.session);
      return { error: null, data };
    } catch (err: any) {
      return { error: err, data: null };
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    console.log('🔵 Signing out...');
    setLoading(true);
    try {
      await supabase.auth.signOut();
      if (mountedRef.current) setUser(null);
      console.log('✅ Signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};