import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

const VisitsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    fetchVisits();
  }, [user, navigate]);

  const fetchVisits = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visits/mine`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVisits(data);
      }
    } catch (err) {
      console.error('Error fetching visits', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelVisit = async (visitId: string) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette demande de visite ?')) return;
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visits/${visitId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'CANCELLED' } : v));
      } else {
        alert('Impossible d\'annuler cette visite.');
      }
    } catch (err) {
      alert('Erreur réseau.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="badge badge-warning">En attente</span>;
      case 'CONFIRMED': return <span className="badge badge-success">Confirmée</span>;
      case 'DECLINED': return <span className="badge badge-danger">Refusée</span>;
      case 'CANCELLED': return <span className="badge" style={{ backgroundColor: '#9ca3af', color: 'white' }}>Annulée</span>;
      case 'COMPLETED': return <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Terminée</span>;
      default: return <span className="badge">{status}</span>;
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
    <div className="visits-page" style={{ padding: '1rem 0 3rem 0' }}>
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <h1 className="page-title mb-4">Mes demandes de visite</h1>

        {visits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center" style={{ border: '1px solid #e2e8f0' }}>
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-nestora-navy mb-2">Aucune visite programmée</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Vous n'avez pas encore demandé à visiter de biens.
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
          <div className="space-y-4">
            {visits.map((visit) => {
              const p = visit.property;
              const img = p.images?.length ? p.images[0].url : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
              
              return (
                <div key={visit.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row" style={{ border: '1px solid #e2e8f0' }}>
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img src={img} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 sm:p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Link to={`/annonces/${p.id}`} className="text-base sm:text-xl font-bold text-nestora-navy hover:underline" style={{ lineHeight: 1.3 }}>
                          {p.title}
                        </Link>
                        {getStatusBadge(visit.status)}
                      </div>
                      <div className="text-gray-500 flex items-center gap-1 mb-3 text-sm">
                        <MapPin size={14} /> {p.neighborhood?.name ? `${p.neighborhood.name}, ` : ''}{p.city?.name}
                      </div>
                      
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-3 flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-nestora-primary" />
                          <span className="font-semibold text-nestora-navy">
                            {format(new Date(visit.requestedDate), 'EEEE d MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-nestora-primary" />
                          <span className="font-semibold text-nestora-navy">
                            {visit.requestedTime}
                          </span>
                        </div>
                      </div>
                      
                      {visit.message && (
                        <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg border-l-4 border-nestora-primary">
                          "{visit.message}"
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-end mt-3 pt-3 border-t border-gray-100">
                      <Link 
                        to={`/annonces/${p.id}`} 
                        className="btn btn-outline flex-1 sm:flex-initial text-center justify-center items-center" 
                        style={{ minHeight: '44px', padding: '0.6rem 1rem', fontSize: '0.88rem' }}
                      >
                        Voir l'annonce
                      </Link>
                      {['PENDING', 'CONFIRMED'].includes(visit.status) && (
                        <button 
                          onClick={() => cancelVisit(visit.id)}
                          className="btn flex-1 sm:flex-initial text-center justify-center items-center" 
                          style={{ minHeight: '44px', padding: '0.6rem 1rem', fontSize: '0.88rem', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitsPage;
