import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Edit, Trash2, Globe, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import api from '../lib/api';
import BoostModal from '../components/BoostModal';

export default function MyListings() {
  const { role } = useAuth();
  const location = useLocation();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Boost Modal state
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedPropertyToBoost, setSelectedPropertyToBoost] = useState<string>('');

  // Check for success param from Publish page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setSuccessMsg("Votre annonce a été publiée avec succès !");
      // Remove query param without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) throw new Error("Veuillez vous connecter.");

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Erreur lors du chargement des annonces.");
      
      const data = await response.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === 'OWNER' || role === 'AGENCY' || role === 'ADMIN') {
      fetchProperties();
    }
  }, [role]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.")) return;
    
    try {
      await api.delete(`/properties/${id}`);
      
      setProperties(prev => prev.filter(p => p.id !== id));
      setSuccessMsg("Annonce supprimée avec succès.");
    } catch (err: any) {
      alert("Erreur lors de la suppression de l'annonce.");
    }
  };

  if (role === 'SEEKER') {
    return (
      <div className="mylistings-page" style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <Search size={48} color="#C9A227" style={{ margin: '0 auto 1rem' }} />
        <h1 className="page-title mb-3">Mes demandes de logement</h1>
        <p className="text-light mb-4">
          L'historique de vos demandes sera affiché ici. Cette fonctionnalité est en cours de développement.
        </p>
      </div>
    );
  }

  return (
    <div className="mylistings-page">
      <div className="d-flex justify-between mb-4" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Mes annonces</h1>
          <p className="page-subtitle text-light">Gérez vos publications et analysez leurs performances.</p>
        </div>
        <Link to="/publier" className="btn btn-primary">
          Publier une annonce
        </Link>
      </div>

      {successMsg && (
        <div className="alert alert-success mb-4" style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', border: '1px solid #10b981' }}>
          {successMsg}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mb-4" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="card p-0 mb-4">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            Chargement de vos annonces...
          </div>
        ) : properties.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
            Vous n'avez publié aucune annonce pour le moment.<br/><br/>
            <Link to="/publier" className="btn btn-outline mt-2">Commencer à publier</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Annonce</th>
                  <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Statut</th>
                  <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Prix</th>
                  <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex" style={{ gap: '1rem', alignItems: 'center' }}>
                        <img 
                          src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'} 
                          alt={property.title} 
                          style={{ width: '80px', height: '60px', borderRadius: '4px', objectFit: 'cover', backgroundColor: '#eee' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 600, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {property.title}
                          </div>
                          <div className="text-light" style={{ fontSize: '0.85rem' }}>
                            {property.city?.name} • {property.propertyType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className={`mini-badge ${property.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                        {property.status === 'PUBLISHED' ? 'En ligne' : property.status}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      {property.price} {property.currency}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex" style={{ gap: '0.5rem' }}>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#0ea5e9', borderColor: '#e0f2fe' }} title="Voir l'annonce">
                          <Globe size={16} />
                        </button>
                        <button 
                          className="btn btn-primary d-flex align-items-center" 
                          style={{ gap: '0.2rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          onClick={() => {
                            setSelectedPropertyToBoost(property.id);
                            setIsBoostModalOpen(true);
                          }}
                        >
                          <Rocket size={14} />
                          Booster
                        </button>
                        <button onClick={() => alert("La modification d'annonce sera disponible dans une prochaine mise à jour.")} className="btn btn-outline" style={{ padding: '0.4rem', color: 'var(--color-primary)' }} title="Modifier">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#ef4444', borderColor: '#fee2e2' }} title="Supprimer" onClick={() => handleDelete(property.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BoostModal 
        isOpen={isBoostModalOpen} 
        onClose={() => setIsBoostModalOpen(false)} 
        propertyId={selectedPropertyToBoost} 
      />
    </div>
  );
}
