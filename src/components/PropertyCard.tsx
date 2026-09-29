import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Move, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

interface PropertyCardProps {
  property: any;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const favorite = isFavorite(property.id);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/connexion');
      return;
    }

    if (favorite) {
      await removeFavorite(property.id);
    } else {
      await addFavorite(property.id);
    }
  };

  return (
    <div className="property-card">
      <div className="property-img-container" style={{ position: 'relative' }}>
        <img 
          src={property.images && property.images.length > 0 ? property.images[0].url : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
          alt={property.title} 
          className="property-img" 
        />
        <button 
          className="property-fav" 
          onClick={toggleFavorite}
          style={{
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: favorite ? '#ef4444' : '#9ca3af'
          }}
          aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="property-content">
        <div className="property-title">{property.title}</div>
        <div className="property-location">
          <MapPin size={12} />
          {property.neighborhood ? `${property.neighborhood.name}, ` : ''}{property.city?.name}
        </div>
        <div className="property-features">
          {property.bedrooms > 0 && (
            <div className="feature">
              <Bed size={14} /> {property.bedrooms} ch
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="feature">
              <Bath size={14} /> {property.bathrooms} sdb
            </div>
          )}
          {property.surface && (
            <div className="feature">
              <Move size={14} /> {property.surface} m²
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div>
            <div className="property-price">{property.price.toLocaleString('fr-FR')} {property.currency}</div>
            <div className={`property-type ${property.transactionType === 'SALE' ? 'property-type-sell' : ''}`}>
              {property.transactionType === 'RENT' ? 'À louer' : 'À vendre'}
            </div>
          </div>
          <Link to={`/annonces/${property.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            Voir l'annonce
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
