import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Loader, User, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

const ReceivedVisitsPage = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !['OWNER', 'AGENCY'].includes(role || '')) {
      navigate('/connexion');
      return;
    }
    fetchVisits();
  }, [user, role, navigate]);

  const fetchVisits = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visits/received`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVisits(data);
      }
    } catch (err) {
      console.error('Error fetching received visits', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (visitId: string, status: 'CONFIRMED' | 'DECLINED') => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visits/${visitId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status } : v));
      } else {
        alert('Impossible de mettre à jour le statut.');
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
      case 'CANCELLED': return <span className="badge" style={{ backgroundColor: '#9ca3af', color: 'white' }}>Annulée (Demander)</span>;
      case 'COMPLETED': return <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Terminée</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-nestora-ivory">
        <Loader className="w-12 h-12 text-nestora-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-nestora-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-nestora-navy mb-8">Demandes reçues</h1>

        {visits.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-nestora-navy mb-2">Aucune demande reçue</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Vous n'avez reçu aucune demande de visite pour vos annonces.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => {
              const p = visit.property;
              const requester = visit.requester;
              
              return (
                <div key={visit.id} className="bg-white rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                    <div className="text-sm font-semibold text-nestora-primary uppercase tracking-wider mb-2">Demandeur</div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                        {requester.profile?.avatarUrl ? (
                          <img src={requester.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-nestora-navy">{requester.profile?.firstName} {requester.profile?.lastName}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/annonces/${p.id}`} className="text-lg font-bold text-nestora-navy hover:underline">
                          {p.title}
                        </Link>
                        {getStatusBadge(visit.status)}
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-wrap gap-4 text-sm mt-3">
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
                        <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border-l-4 border-nestora-primary">
                          "{visit.message}"
                        </div>
                      )}
                    </div>
                    
                    {visit.status === 'PENDING' && (
                      <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => updateStatus(visit.id, 'DECLINED')}
                          className="btn flex items-center gap-2" 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}
                        >
                          <XCircle size={16} /> Refuser
                        </button>
                        <button 
                          onClick={() => updateStatus(visit.id, 'CONFIRMED')}
                          className="btn flex items-center gap-2" 
                          style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', backgroundColor: '#dcfce7', color: '#10b981', border: '1px solid #86efac' }}
                        >
                          <CheckCircle2 size={16} /> Confirmer
                        </button>
                      </div>
                    )}
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

export default ReceivedVisitsPage;
