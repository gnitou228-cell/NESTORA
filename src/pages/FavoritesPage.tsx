import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PropertyCard from '../components/PropertyCard';

const FavoritesPage = () => {
  const { user } = useAuth();
  const { favorites, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }

    const fetchFavoriteProperties = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/favorites`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // data is an array of Favorite objects which include the property
          setProperties(data.map((fav: any) => fav.property));
        }
      } catch (err) {
        console.error('Error fetching favorites', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [user, navigate, favorites.length]); // refetch or update when length changes?
  // wait, if we remove a favorite from the context, we should probably just remove it from local state to be faster.

  const handleRemove = async (propertyId: string) => {
    const success = await removeFavorite(propertyId);
    if (success) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader className="w-10 h-10 text-nestora-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="favorites-page" style={{ padding: '1rem 0 3rem 0' }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="page-title mb-1">Mes favoris</h1>
            <p className="text-gray-600" style={{ fontSize: '0.9rem' }}>
              {properties.length} {properties.length > 1 ? 'biens enregistrés' : 'bien enregistré'}
            </p>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-nestora-navy mb-2">Vous n'avez encore aucun favori</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto" style={{ fontSize: '0.95rem' }}>
              Enregistrez les biens qui vous intéressent pour les retrouver facilement et organiser vos visites.
            </p>
            <Link 
              to="/recherche" 
              className="btn btn-primary inline-flex items-center justify-center px-6"
              style={{ minHeight: '46px' }}
            >
              Explorer les annonces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {properties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(property.id);
                  }}
                  className="absolute top-3 right-3 z-10 bg-white rounded-full shadow-md text-red-500 hover:scale-110 transition-transform"
                  style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Retirer des favoris"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
