import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

import { supabase } from '../lib/supabase';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (propertyId: string) => Promise<boolean>;
  removeFavorite: (propertyId: string) => Promise<boolean>;
  isFavorite: (propertyId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.map((fav: any) => fav.propertyId));
      }
    } catch (err) {
      console.error('Error fetching favorites', err);
    }
  };

  const addFavorite = async (propertyId: string) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return false;
      const res = await fetch(`http://localhost:5000/api/favorites/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFavorites(prev => [...prev, propertyId]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding favorite', err);
      return false;
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return false;
      const res = await fetch(`http://localhost:5000/api/favorites/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFavorites(prev => prev.filter(id => id !== propertyId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing favorite', err);
      return false;
    }
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
