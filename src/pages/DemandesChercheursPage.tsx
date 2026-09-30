import { useState } from 'react';
import { Search, MapPin, Filter, Home, DollarSign, BedDouble, User } from 'lucide-react';

// Mock data for searchers' requests (Housing Requests)
const MOCK_REQUESTS = [
  { id: '1', seekerName: 'Komi A.', type: 'Location', propertyType: 'Appartement', location: 'Ouagadougou (Centre)', budget: 'Max 150 000 CFA', bedrooms: '2-3', description: 'Je cherche un appartement sécurisé et proche des commodités pour ma petite famille.', date: 'Il y a 2h' },
  { id: '2', seekerName: 'Sarah D.', type: 'Achat', propertyType: 'Villa', location: 'Ouagadougou (Ouaga 2000)', budget: 'Max 60 000 000 CFA', bedrooms: '4+', description: 'Recherche grande villa avec jardin et piscine si possible. Paiement comptant.', date: 'Hier' },
  { id: '3', seekerName: 'Marc O.', type: 'Location', propertyType: 'Bureau', location: 'Bobo-Dioulasso', budget: 'Max 300 000 CFA', bedrooms: 'N/A', description: 'Recherche espace commercial ou bureau pour ouverture d\'une nouvelle agence. Environ 100m².', date: 'Il y a 3 jours' },
];

export default function DemandesChercheursPage() {
  const [requests] = useState(MOCK_REQUESTS);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>Recherches des clients</h1>
          <p className="text-light mt-1">Découvrez ce que les chercheurs recherchent et proposez-leur vos biens correspondants.</p>
        </div>
      </div>

      <div className="card p-4 mb-4" style={{ backgroundColor: '#fff' }}>
        <div className="row g-3">
          <div className="col-md-5">
            <div className="d-flex align-items-center" style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.5rem 1rem', border: '1px solid #e2e8f0' }}>
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Rechercher par zone ou type de bien..." 
                style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', marginLeft: '0.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline d-flex align-items-center gap-2" style={{ width: '100%', justifyContent: 'center' }}>
              <Filter size={18} /> Filtrer
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        {requests.map(req => (
          <div key={req.id} className="col-md-12 mb-4">
            <div className="card" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex gap-3 align-items-center">
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{req.seekerName} recherche : {req.propertyType}</h3>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Publié {req.date}</span>
                  </div>
                </div>
                <span className={`badge ${req.type === 'Location' ? 'bg-primary' : 'bg-success'}`} style={{ color: 'white', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                  {req.type}
                </span>
              </div>

              <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                "{req.description}"
              </p>

              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2" style={{ color: '#475569', fontSize: '0.9rem' }}>
                    <MapPin size={16} color="#64748b" /> <strong>Zone :</strong> {req.location}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2" style={{ color: '#475569', fontSize: '0.9rem' }}>
                    <DollarSign size={16} color="#64748b" /> <strong>Budget :</strong> {req.budget}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-2" style={{ color: '#475569', fontSize: '0.9rem' }}>
                    <BedDouble size={16} color="#64748b" /> <strong>Chambres :</strong> {req.bedrooms}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary d-flex align-items-center gap-2">
                  <Home size={16} /> Proposer un bien
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
