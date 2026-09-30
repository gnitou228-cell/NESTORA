import { createClient } from '@supabase/supabase-js';

// Utiliser des valeurs par défaut au lieu d'une chaîne vide pour éviter le crash de l'application (Page blanche)
// createClient de Supabase jette une exception immédiatement si l'URL est invalide.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nqouspwizrkasuyelghv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb3VzcHdpenJrYXN1eWVsZ2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MzU4NTYsImV4cCI6MjEwNjIxMTg1Nn0.vSXuiADgmUhbjCRoeTxleF3x860zO5VL1Wyv5JKDhqo';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase URL ou clé Anon manquante. Veuillez configurer le fichier .env à la racine de votre projet frontend.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
