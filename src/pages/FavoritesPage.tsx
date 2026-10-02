import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader, Search } from 'lucide-react';
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
    <div className="favorites-page container mt-4" style={{ paddingBottom: '90px', maxWidth: '1080px' }}>
      <div className="favorites-header mb-4">
        <div>
          <h1 className="favorites-title">
            Mes favoris
          </h1>
          <p className="text-light mt-1" style={{ margin: 0, fontSize: '0.95rem' }}>
            {properties.length} {properties.length > 1 ? 'biens enregistrés' : 'bien enregistré'}
          </p>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="favorites-empty-card">
          <div className="favorites-empty-icon">
            <Heart size={32} color="#ef4444" fill="rgba(239, 68, 68, 0.2)" />
          </div>
          <h2 className="favorites-empty-title">
            Vous n&apos;avez encore aucun favori
          </h2>
          <p className="favorites-empty-desc">
            Enregistrez les biens qui vous intéressent pour les retrouver facilement et organiser vos visites.
          </p>
          <Link 
            to="/recherche" 
            className="btn btn-primary favorites-empty-btn"
          >
            <Search size={18} />
            <span>Explorer les annonces</span>
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {properties.map((property) => (
            <div key={property.id} className="favorites-grid-item">
              <PropertyCard property={property} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(property.id);
                }}
                className="favorites-remove-btn"
                aria-label="Retirer des favoris"
                title="Retirer des favoris"
              >
                <Heart size={20} color="#ef4444" fill="#ef4444" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        .favorites-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-dark);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .favorites-empty-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1.5px dashed #cbd5e1;
          padding: 3.5rem 1.5rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .favorites-empty-icon {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #fef2f2;
          border: 1.5px solid #fee2e2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1);
        }
        .favorites-empty-title {
          font-size: 1.3rem;
          font-weight: 750;
          color: #0f172a;
          margin-bottom: 0.65rem;
        }
        .favorites-empty-desc {
          color: #64748b;
          max-width: 440px;
          margin: 0 auto 1.75rem;
          font-size: 0.95rem;
          line-height: 1.55;
        }
        .favorites-empty-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 48px;
          padding: 0.75rem 2rem;
          font-weight: 600;
          border-radius: 12px;
        }
        @media (max-width: 640px) {
          .favorites-title {
            font-size: 1.5rem;
          }
          .favorites-empty-card {
            padding: 2.75rem 1.25rem;
          }
          .favorites-empty-btn {
            width: 100%;
          }
        }
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .favorites-grid-item {
          position: relative;
        }
        .favorites-remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          background: #ffffff;
          border: none;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .favorites-remove-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;
