import { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, MapPin, Clock, User, Lock, MessageCircle, Crown, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_LEADS = [
  { id: '1', name: 'Alice Dubois', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', email: 'alice.d@email.com', phone: '22890001122', property: 'Villa T4 - Ouagadougou', type: 'Vente', status: 'Nouveau', date: '2023-11-20', lastContact: 'Hier' },
  { id: '2', name: 'Komi Mensah', avatar: '', email: 'komi.m@email.com', phone: '22899112233', property: 'Appartement Centre-ville', type: 'Location', status: 'En contact', date: '2023-11-18', lastContact: 'Il y a 2 jours' },
  { id: '3', name: 'Sarah L.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', email: 'sarah.l@email.com', phone: '22891223344', property: 'Terrain 500m² - Banlieue', type: 'Vente', status: 'Visite planifiée', date: '2023-11-15', lastContact: 'Ce matin' },
  { id: '4', name: 'Marc Koffi', avatar: '', email: 'marc.k@email.com', phone: '22892334455', property: 'Bureau commercial', type: 'Location', status: 'Conclu', date: '2023-11-01', lastContact: 'Il y a 1 semaine' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Nouveau': return { bg: '#e0f2fe', text: '#0284c7' };
    case 'En contact': return { bg: '#fef3c7', text: '#d97706' };
    case 'Visite planifiée': return { bg: '#f3e8ff', text: '#9333ea' };
    case 'Conclu': return { bg: '#d1fae5', text: '#059669' };
    default: return { bg: '#f1f5f9', text: '#475569' };
  }
};

export default function LeadsPage() {
  const [leads] = useState(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsPremium(localStorage.getItem('nestora_is_premium') === 'true');
  }, []);

  const handleUnlockLead = (lead: any) => {
    navigate('/paiement', { state: { plan: { name: 'Contact Prospect', price: 1000 }, type: 'Unlock Lead', leadId: lead.id } });
  };

  const handleGoPremium = () => {
    navigate('/tarifs');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>Prospects & Leads</h1>
          <p className="text-light mt-1">Gérez vos clients potentiels et suivez l'avancement des négociations.</p>
        </div>
      </div>

      <div className="card p-4 mb-4" style={{ backgroundColor: '#fff' }}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="d-flex align-items-center" style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.5rem 1rem', border: '1px solid #e2e8f0' }}>
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Rechercher un prospect..." 
                style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="d-flex align-items-center gap-2" style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
              <Filter size={18} color="#94a3b8" />
              <span style={{ color: '#64748b' }}>Filtrer par statut</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {leads.map(lead => (
          <div key={lead.id} className="col-md-6 mb-4">
            <div className="card h-100" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex" style={{ gap: '1.5rem', alignItems: 'center' }}>
                  {lead.avatar ? (
                    <img src={lead.avatar} alt={lead.name} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }} />
                  ) : (
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', border: '2px solid #e2e8f0' }}>
                      <User size={28} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{lead.name}</h3>
                    <span style={{ 
                      backgroundColor: getStatusColor(lead.status).bg, 
                      color: getStatusColor(lead.status).text, 
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      whiteSpace: 'nowrap'
                    }}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '0.95rem' }}>
                  <MapPin size={16} color="#64748b" /> <strong>Intéressé par :</strong> {lead.property}
                </div>
                
                <div className="d-flex flex-column" style={{ gap: '0.5rem', marginTop: '0.5rem' }}>
                  {isPremium ? (
                    <>
                      <div className="d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>
                        <Phone size={16} color="#64748b" /> +{lead.phone.replace(/(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5")}
                      </div>
                      <div className="d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '0.95rem' }}>
                        <Mail size={16} color="#64748b" /> {lead.email}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex align-items-center gap-2" style={{ color: '#94a3b8', fontSize: '0.95rem', fontStyle: 'italic' }}>
                        <Phone size={16} color="#cbd5e1" /> <span style={{ filter: 'blur(4px)' }}>+228 90 00 11 22</span> <Lock size={14} color="#f59e0b" style={{ marginLeft: '0.5rem' }}/> Premium requis
                      </div>
                      <div className="d-flex align-items-center gap-2" style={{ color: '#94a3b8', fontSize: '0.95rem', fontStyle: 'italic' }}>
                        <Mail size={16} color="#cbd5e1" /> <span style={{ filter: 'blur(4px)' }}>contact@email.com</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <Clock size={14} /> Contact : {lead.lastContact}
                </div>
                
                {isPremium ? (
                  <a 
                    href={`https://wa.me/${lead.phone}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn" 
                    style={{ background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, border: 'none', textDecoration: 'none' }}
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                ) : (
                  <button 
                    onClick={() => setSelectedLead(lead)}
                    className="btn" 
                    style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}
                  >
                    <Lock size={16} /> Débloquer
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {selectedLead && !isPremium && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050, padding: '1rem' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedLead(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={24} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Lock size={32} color="#64748b" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Contact Masqué</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Le numéro et l'email de ce prospect sont masqués. Débloquez-le pour le contacter directement.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone size={20} color="#94a3b8" />
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#475569', letterSpacing: '2px' }}>+228 90 ** ** **</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail size={16} color="#94a3b8" />
                <span style={{ fontSize: '1rem', fontWeight: 500, color: '#475569' }}>contact@*******.com</span>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              <button 
                className="btn btn-primary" 
                style={{ padding: '1rem', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={() => handleUnlockLead(selectedLead)}
              >
                <CheckCircle size={18} /> Débloquer ce contact (1000 CFA)
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                <span style={{ padding: '0 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>OU</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
              </div>

              <button 
                className="btn btn-outline" 
                style={{ padding: '1rem', fontSize: '1.05rem', fontWeight: 600, color: '#d97706', borderColor: '#fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                onClick={handleGoPremium}
              >
                <Crown size={18} /> Débloquer en illimité (Premium)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
