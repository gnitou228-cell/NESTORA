import { useState } from 'react';
import { UserPlus, Mail, Phone, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';

// Mock data
const MOCK_AGENTS = [
  { id: '1', name: 'Kossi Armand', email: 'armand@agence.com', phone: '+228 90 12 34 56', role: 'Agent Senior', status: 'Actif', properties: 12, joinedAt: '2023-05-12' },
  { id: '2', name: 'Afiwa Sophie', email: 'sophie@agence.com', phone: '+228 99 88 77 66', role: 'Agent', status: 'Actif', properties: 8, joinedAt: '2023-08-01' },
  { id: '3', name: 'Jean-Paul', email: 'jeanpaul@agence.com', phone: '+228 92 33 44 55', role: 'Agent Junior', status: 'En attente', properties: 0, joinedAt: '2023-10-15' },
];

export default function AgentsPage() {
  const [agents] = useState(MOCK_AGENTS);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>Gestion des Agents</h1>
          <p className="text-light mt-1" style={{ margin: 0 }}>Gérez les membres de votre agence et suivez leurs performances.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2" style={{ minHeight: '44px', padding: '0.6rem 1.25rem' }} onClick={() => setShowInviteModal(true)}>
          <UserPlus size={18} />
          Inviter un agent
        </button>
      </div>

      <div className="card p-0">
        {/* Desktop View: Full Table */}
        <div className="desktop-only table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: '#f8fafc', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Agent</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Contact</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Rôle</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Annonces</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>Statut</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 'bold' }}>
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{agent.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Inscrit le {new Date(agent.joinedAt).toLocaleDateString('fr-FR')}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className="d-flex align-items-center gap-2"><Mail size={14} /> {agent.email}</span>
                      <span className="d-flex align-items-center gap-2"><Phone size={14} /> {agent.phone}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569' }}>{agent.role}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    {agent.properties} {agent.properties === 1 ? 'bien' : 'biens'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {agent.status === 'Actif' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#d1fae5', color: '#059669', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 500 }}>
                        <CheckCircle2 size={14} /> Actif
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 500 }}>
                        <Clock size={14} /> En attente
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#3b82f6', borderColor: '#bfdbfe' }} title="Modifier">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '0.4rem', color: '#ef4444', borderColor: '#fecaca' }} title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High-Touch Cards */}
        <div className="mobile-only" style={{ padding: '0.875rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {agents.map((agent) => (
              <div 
                key={agent.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A227', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{agent.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{agent.role}</div>
                    </div>
                  </div>
                  {agent.status === 'Actif' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#d1fae5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> Actif
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      <Clock size={12} /> En attente
                    </span>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <a href={`mailto:${agent.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none' }}>
                    <Mail size={14} color="#64748b" /> {agent.email}
                  </a>
                  <a href={`tel:${agent.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none' }}>
                    <Phone size={14} color="#64748b" /> {agent.phone}
                  </a>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.4rem', marginTop: '0.2rem', color: '#64748b', fontSize: '0.8rem' }}>
                    <span>Biens gérés: <strong style={{ color: '#0f172a' }}>{agent.properties}</strong></span>
                    <span>Depuis: {new Date(agent.joinedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#3b82f6', borderColor: '#bfdbfe', fontSize: '0.88rem' }}
                    onClick={() => alert(`Modifier l'agent ${agent.name}`)}
                  >
                    <Edit2 size={16} /> Modifier
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ minHeight: '44px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#ef4444', borderColor: '#fecaca', fontSize: '0.88rem' }}
                    onClick={() => {
                      if (window.confirm(`Supprimer l'agent ${agent.name} ?`)) {
                        alert('Agent supprimé.');
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Inviter un agent</h3>
            <p className="text-light" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Un email d'invitation sera envoyé à cet agent pour qu'il rejoigne votre agence.</p>
            
            <div className="form-group mb-3">
              <label>Adresse email de l'agent</label>
              <input type="email" className="form-control" placeholder="agent@exemple.com" />
            </div>
            
            <div className="form-group mb-4">
              <label>Rôle</label>
              <select className="form-control">
                <option>Agent Junior</option>
                <option>Agent Senior</option>
                <option>Manager</option>
              </select>
            </div>
            
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-outline" onClick={() => setShowInviteModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => { alert('Invitation envoyée !'); setShowInviteModal(false); }}>Envoyer l'invitation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
