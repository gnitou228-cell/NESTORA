import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export type Role = 'SEEKER' | 'OWNER' | 'AGENCY' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: string;
  emailVerified: boolean;
  phone?: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    address?: string;
    documentUrl?: string;
    selfieUrl?: string;
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
  updateUser: (user: any) => void;
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

      // Récupérer le profil complet depuis le backend
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      
      if (res.ok) {
        const { user: dbUser } = await res.json();
        
        const userData: User = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role as Role,
          status: dbUser.status,
          emailVerified: dbUser.emailVerified || !!session.user.email_confirmed_at,
          phone: dbUser.phone,
          profile: dbUser.profile ? {
            firstName: dbUser.profile.firstName,
            lastName: dbUser.profile.lastName,
            avatar: dbUser.profile.avatar,
            bio: dbUser.profile.bio,
            address: dbUser.profile.address,
            documentUrl: dbUser.profile.documentUrl,
            selfieUrl: dbUser.profile.selfieUrl
          } : undefined,
          agency: dbUser.agency ? {
            name: dbUser.agency.name
          } : undefined
        };

        setUser(userData);
        setRole(userData.role);
      } else {
        // Fallback en cas d'erreur de l'API
        const fallbackRole = session.user.user_metadata?.role || 'SEEKER';
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: fallbackRole as Role,
          status: 'ACTIVE',
          emailVerified: !!session.user.email_confirmed_at,
          profile: {
            firstName: session.user.user_metadata?.first_name || '',
            lastName: session.user.user_metadata?.last_name || '',
          }
        });
        setRole(fallbackRole as Role);
      }
    } catch (err) {
      console.error('Session check failed', err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUserData: any) => {
    // Adapter le modèle renvoyé par le backend
    const userData: User = {
      id: updatedUserData.id,
      email: updatedUserData.email,
      role: updatedUserData.role as Role,
      status: updatedUserData.status,
      emailVerified: updatedUserData.emailVerified,
      phone: updatedUserData.phone,
      profile: updatedUserData.profile ? {
        firstName: updatedUserData.profile.firstName,
        lastName: updatedUserData.profile.lastName,
        avatar: updatedUserData.profile.avatar,
        bio: updatedUserData.profile.bio,
        address: updatedUserData.profile.address
      } : undefined,
      agency: updatedUserData.agency ? {
        name: updatedUserData.agency.name
      } : undefined
    };
    setUser(userData);
    setRole(userData.role);
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
    <AuthContext.Provider value={{ user, role, loading, login, logout, checkSession, updateUser }}>
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
