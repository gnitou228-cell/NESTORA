import { useState } from 'react';
import { Search, Filter, Phone, Mail, MapPin, Clock, ArrowRight, User } from 'lucide-react';

const MOCK_LEADS = [
  { id: '1', name: 'Alice Dubois', email: 'alice.d@email.com', phone: '+228 90 00 11 22', property: 'Villa T4 - Ouagadougou', type: 'Vente', status: 'Nouveau', date: '2023-11-20', lastContact: 'Hier' },
  { id: '2', name: 'Komi Mensah', email: 'komi.m@email.com', phone: '+228 99 11 22 33', property: 'Appartement Centre-ville', type: 'Location', status: 'En contact', date: '2023-11-18', lastContact: 'Il y a 2 jours' },
  { id: '3', name: 'Sarah L.', email: 'sarah.l@email.com', phone: '+228 91 22 33 44', property: 'Terrain 500m² - Banlieue', type: 'Vente', status: 'Visite planifiée', date: '2023-11-15', lastContact: 'Ce matin' },
  { id: '4', name: 'Marc Koffi', email: 'marc.k@email.com', phone: '+228 92 33 44 55', property: 'Bureau commercial', type: 'Location', status: 'Conclu', date: '2023-11-01', lastContact: 'Il y a 1 semaine' },
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
              
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex gap-3">
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{lead.name}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Client potentiel</span>
                  </div>
                </div>
                <span style={{ 
                  backgroundColor: getStatusColor(lead.status).bg, 
                  color: getStatusColor(lead.status).text, 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '2rem', 
                  fontSize: '0.8rem', 
                  fontWeight: 600 
                }}>
                  {lead.status}
                </span>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '0.9rem' }}>
                  <MapPin size={16} color="#64748b" /> <strong>Intéressé par :</strong> {lead.property}
                </div>
                <div className="d-flex gap-4">
                  <div className="d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '0.9rem' }}>
                    <Phone size={14} color="#64748b" /> {lead.phone}
                  </div>
                  <div className="d-flex align-items-center gap-2" style={{ color: '#334155', fontSize: '0.9rem' }}>
                    <Mail size={14} color="#64748b" /> Email envoyé
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <Clock size={14} /> Dernier contact : {lead.lastContact}
                </div>
                <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', color: 'var(--color-primary)', borderColor: 'var(--color-border)' }}>
                  Gérer <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
