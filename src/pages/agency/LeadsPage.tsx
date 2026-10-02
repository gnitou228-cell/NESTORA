import { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, MessageCircle, ExternalLink, Calendar, Users, PlusCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';

interface Lead {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  property: string;
  propertyId: string;
  type: string;
  status: string;
  date: string;
  visitDate?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Nouveau':
    case 'En attente':
      return { bg: '#e0f2fe', text: '#0284c7' };
    case 'En contact':
      return { bg: '#fef3c7', text: '#d97706' };
    case 'Visite planifiée':
      return { bg: '#f3e8ff', text: '#9333ea' };
    case 'Conclu':
    case 'Effectué':
      return { bg: '#dcfce7', text: '#15803d' };
    case 'Annulé':
      return { bg: '#fee2e2', text: '#b91c1c' };
    default:
      return { bg: '#f1f5f9', text: '#475569' };
  }
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/agency/leads');
      setLeads(res.data || []);
    } catch (err: any) {
      console.error('Erreur chargement leads:', err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mt-4" style={{ paddingBottom: '90px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>
            Prospects & Leads
          </h1>
          <p className="text-light mt-1" style={{ margin: 0, fontSize: '0.95rem' }}>
            Suivez les demandes de visite et les prospects générés par vos annonces immobilières.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="leads-filter-card mb-4">
        <div className="leads-search-box mb-3">
          <Search size={18} className="leads-search-icon" />
          <input 
            type="text" 
            className="leads-search-input"
            placeholder="Rechercher par nom, email, téléphone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={() => setSearchTerm('')}
              className="leads-search-clear"
              title="Effacer"
            >
              ×
            </button>
          )}
        </div>

        <div className="leads-chips-container">
          <div className="leads-chips-scroll">
            <span className="leads-filter-label">
              <Filter size={14} /> Filtres :
            </span>
            <button 
              onClick={() => setStatusFilter('ALL')}
              className={`leads-chip ${statusFilter === 'ALL' ? 'active' : ''}`}
            >
              Tous ({leads.length})
            </button>
            <button 
              onClick={() => setStatusFilter('En attente')}
              className={`leads-chip ${statusFilter === 'En attente' ? 'active' : ''}`}
            >
              En attente
            </button>
            <button 
              onClick={() => setStatusFilter('Visite planifiée')}
              className={`leads-chip ${statusFilter === 'Visite planifiée' ? 'active' : ''}`}
            >
              Visites planifiées
            </button>
            <button 
              onClick={() => setStatusFilter('Conclu')}
              className={`leads-chip ${statusFilter === 'Conclu' ? 'active' : ''}`}
            >
              Conclus
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <div className="loader" style={{ borderColor: 'var(--color-primary)', borderBottomColor: 'transparent', width: '36px', height: '36px' }}></div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1.5px dashed #cbd5e1',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Users size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            {searchTerm || statusFilter !== 'ALL' ? 'Aucun prospect ne correspond à vos filtres' : 'Aucun prospect pour le moment'}
          </h3>
          <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem', lineHeight: '1.5' }}>
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Essayez de modifier vos termes de recherche ou de réinitialiser le filtre de statut.'
              : 'Dès qu\'un client réserve un créneau de visite ou contacte votre agence pour l\'une de vos annonces publiées, il sera automatiquement enregistré ici.'
            }
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/publier" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <PlusCircle size={16} /> Publier un bien
            </Link>
            <Link to="/boost" className="btn btn-outline" style={{ fontWeight: 600 }}>
              Booster mes annonces
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredLeads.map(lead => {
            const statusStyle = getStatusColor(lead.status);
            return (
              <div key={lead.id} className="col-md-6">
                <div 
                  className="card h-100" 
                  style={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    padding: '1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    backgroundColor: '#fff'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-3">
                      {lead.avatar ? (
                        <img 
                          src={lead.avatar} 
                          alt={lead.name} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} 
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0B1F3A', color: '#C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                          {lead.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Contacté le {new Date(lead.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    <span style={{ 
                      backgroundColor: statusStyle.bg, 
                      color: statusStyle.text, 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.78rem', 
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {lead.status}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '0.9rem', borderRadius: '12px', marginBottom: '1rem', flex: 1 }}>
                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Annonce concernée:</span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#334155', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                        {lead.type}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem', marginBottom: '0.65rem' }}>
                      {lead.property}
                    </div>

                    {lead.visitDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#9333ea', fontWeight: 600, marginBottom: '0.5rem' }}>
                        <Calendar size={14} />
                        Visite souhaitée le {new Date(lead.visitDate).toLocaleDateString('fr-FR')}
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.84rem' }}>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#475569', textDecoration: 'none' }}>
                          <Mail size={13} color="#94a3b8" /> {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#475569', textDecoration: 'none' }}>
                          <Phone size={13} color="#94a3b8" /> {lead.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="d-flex gap-2">
                    {lead.phone && (
                      <a 
                        href={`tel:${lead.phone}`} 
                        className="btn btn-outline"
                        style={{ flex: 1, minHeight: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '8px' }}
                      >
                        <Phone size={14} /> Appeler
                      </a>
                    )}
                    <button 
                      onClick={() => navigate('/messages')}
                      className="btn btn-primary"
                      style={{ flex: 1, minHeight: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, borderRadius: '8px' }}
                    >
                      <MessageCircle size={14} /> Écrire
                    </button>
                    {lead.propertyId && (
                      <Link 
                        to={`/annonces/${lead.propertyId}`}
                        className="btn btn-outline"
                        style={{ minHeight: '42px', padding: '0 0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}
                        title="Voir l'annonce"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Inline Styles */}
      <style>{`
        .leads-filter-card {
          background-color: #ffffff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .leads-search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 1rem;
          transition: all 0.2s ease;
        }
        .leads-search-box:focus-within {
          background: #ffffff;
          border-color: #C9A227;
          box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
        }
        .leads-search-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }
        .leads-search-input {
          border: none;
          background: transparent;
          width: 100%;
          height: 46px;
          outline: none;
          margin-left: 0.65rem;
          font-size: 0.92rem;
          color: #0f172a;
          font-family: inherit;
        }
        .leads-search-clear {
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0 0.25rem;
          line-height: 1;
        }
        .leads-chips-container {
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          margin: 0 -0.5rem;
          padding: 0 0.5rem;
        }
        .leads-chips-container::-webkit-scrollbar {
          display: none;
        }
        .leads-chips-scroll {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          padding: 2px 0;
        }
        .leads-filter-label {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-right: 0.25rem;
          flex-shrink: 0;
        }
        .leads-chip {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 1rem;
          font-size: 0.84rem;
          font-weight: 600;
          border-radius: 999px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .leads-chip:hover {
          border-color: #cbd5e1;
          color: #0B1F3A;
        }
        .leads-chip.active {
          background: #C9A227;
          border-color: #C9A227;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(201, 162, 39, 0.25);
        }
      `}</style>
    </div>
  );
}
