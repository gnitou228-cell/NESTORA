import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Edit, Trash2, Globe, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
      const token = localStorage.getItem('nestora_token');
      
      if (!token) throw new Error("Veuillez vous connecter.");

      const endpoint = role === 'SEEKER' ? '/api/housing-requests/my' : '/api/properties/my';
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error(`Erreur lors du chargement des ${role === 'SEEKER' ? 'demandes' : 'annonces'}.`);
      
      const data = await response.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) {
      fetchProperties();
    }
  }, [role]);

  const handleDelete = async (id: string) => {
    const isSeeker = role === 'SEEKER';
    const typeLabel = isSeeker ? 'demande' : 'annonce';
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cette ${typeLabel} ? Cette action est irréversible.`)) return;
    
    try {
      const endpoint = isSeeker ? `/housing-requests/${id}` : `/properties/${id}`;
      await api.delete(endpoint);
      
      setProperties(prev => prev.filter(p => p.id !== id));
      setSuccessMsg(`${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} supprimée avec succès.`);
    } catch (err: any) {
      alert(`Erreur lors de la suppression de l'${typeLabel}.`);
    }
  };

  if (role === 'SEEKER') {
    return (
      <div className="mylistings-page">
        <div className="d-flex justify-between mb-4" style={{ alignItems: 'center' }}>
          <div>
            <h1 className="page-title">Mes demandes</h1>
            <p className="page-subtitle text-light">Gérez vos demandes de logement publiées.</p>
          </div>
          <Link to="/publier" className="btn btn-primary">
            Publier une demande
          </Link>
        </div>

        {successMsg && (
          <div className="alert alert-success mb-4" style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: '8px', border: '1px solid #10b981' }}>
            {successMsg}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mb-4" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', border: '1px solid #ef4444' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-light">Chargement de vos demandes...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center p-5 card" style={{ border: '1px dashed #cbd5e1', backgroundColor: '#f8fafc' }}>
            <Search size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#334155', marginBottom: '0.5rem' }}>Aucune demande publiée</h3>
            <p className="text-light mb-4">Vous n'avez pas encore publié de demande de recherche.</p>
            <div>
              <Link to="/publier" className="btn btn-primary">
                Créer ma première demande
              </Link>
            </div>
          </div>
        ) : (
          <div className="row">
            {properties.map(req => (
              <div key={req.id} className="col-md-12 mb-4">
                <div className="card" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>{req.title}</h3>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Publié le {req.date}</span>
                    </div>
                    <span className={`badge ${req.status === 'PUBLISHED' ? 'bg-success' : 'bg-warning'}`} style={{ color: 'white', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                      {req.status === 'PUBLISHED' ? 'En ligne' : req.status}
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                    {req.description}
                  </p>
                  <div className="d-flex gap-3 mb-4 text-muted" style={{ fontSize: '0.9rem' }}>
                    <div><strong>Zone:</strong> {req.location}</div>
                    <div><strong>Budget:</strong> {req.budget}</div>
                  </div>
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary d-flex align-items-center" 
                      style={{ gap: '0.2rem', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      onClick={() => {
                        setSelectedPropertyToBoost(req.id);
                        setIsBoostModalOpen(true);
                      }}
                    >
                      <Rocket size={14} /> Booster
                    </button>
                    <button onClick={() => handleDelete(req.id)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', borderColor: '#ef4444' }}>
                      <Trash2 size={16} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
