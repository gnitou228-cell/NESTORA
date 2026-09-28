import { Link } from 'react-router-dom';
import { Eye, Calendar, MoreVertical, Rocket } from 'lucide-react';
import { properties } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function MyListings() {
  const { role } = useAuth();
  
  return (
    <div className="mylistings-page">
      <div className="d-flex justify-between mb-4" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{role === 'SEEKER' ? 'Mes demandes de logement' : 'Mes annonces'}</h1>
          <p className="page-subtitle text-light">Gérez vos publications et analysez leurs performances.</p>
        </div>
        <Link to="/publier" className="btn btn-primary">
          Publier
        </Link>
      </div>

      <div className="card p-0 mb-4">
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Annonce</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Statut</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Statistiques</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Expiration</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '1rem', alignItems: 'center' }}>
                      <img src={property.image} alt={property.title} style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{property.title}</div>
                        <div className="text-light" style={{ fontSize: '0.85rem' }}>{property.price} • {property.type}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className={`mini-badge ${property.status === 'En ligne' ? 'badge-success' : property.status === 'En attente' ? 'badge-warning' : ''}`} style={{ backgroundColor: property.status === 'Expirée' ? '#fee2e2' : undefined, color: property.status === 'Expirée' ? '#ef4444' : undefined, display: 'inline-block' }}>
                      {property.status}
                    </div>
                    {property.id === 'p1' && (
                      <div className="mt-1" style={{ fontSize: '0.75rem', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Rocket size={12} /> Boost actif (2j restants)
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                      <span title="Vues"><Eye size={14} /> {Math.floor(Math.random() * 1000)}</span>
                      <span title="Visites"><Calendar size={14} /> {Math.floor(Math.random() * 10)}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                    Dans 15 jours
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                      <Link to="/boost" className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Booster</Link>
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }}><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
