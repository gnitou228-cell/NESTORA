import { createClient } from '@supabase/supabase-js';

// Utiliser des valeurs par défaut au lieu d'une chaîne vide pour éviter le crash de l'application (Page blanche)
// createClient de Supabase jette une exception immédiatement si l'URL est invalide.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://veuillez-configurer-votre-env.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'veuillez-configurer-votre-env-anon-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase URL ou clé Anon manquante. Veuillez configurer le fichier .env à la racine de votre projet frontend.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
