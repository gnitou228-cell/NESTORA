import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Role = 'SEEKER' | 'OWNER' | 'AGENCY' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: string;
  emailVerified: boolean;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  agency?: {
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  role: Role | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    setLoading(true);
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      // Récupérer le profil pour avoir le rôle exact
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      let currentRole: Role = 'SEEKER';
      let firstName = '';
      let lastName = '';
      
      if (profile) {
        currentRole = profile.role as Role;
        firstName = profile.first_name;
        lastName = profile.last_name;
      } else if (session.user.user_metadata?.role) {
        currentRole = session.user.user_metadata.role as Role;
        firstName = session.user.user_metadata.first_name || '';
        lastName = session.user.user_metadata.last_name || '';
      }

      const userData: User = {
        id: session.user.id,
        email: session.user.email || '',
        role: currentRole,
        status: 'ACTIVE',
        emailVerified: !!session.user.email_confirmed_at,
        profile: {
          firstName,
          lastName,
        }
      };

      setUser(userData);
      setRole(currentRole);
    } catch (err) {
      console.error('Session check failed', err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkSession();
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = () => {
    // Avec Supabase, la session est gérée automatiquement via les cookies/localStorage internes de @supabase/supabase-js
    // On force juste le rechargement.
    checkSession();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    window.location.href = '/connexion';
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
