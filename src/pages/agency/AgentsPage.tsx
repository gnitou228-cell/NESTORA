import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Phone, Edit2, Trash2, CheckCircle2, Clock, Users, X, Save, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

interface Agent {
  id: string;
  userId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  properties: number;
  joinedAt: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteFirstName, setInviteFirstName] = useState('');
  const [inviteLastName, setInviteLastName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('Agent');
  const [editStatus, setEditStatus] = useState('Actif');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/agency/agents');
      setAgents(res.data || []);
    } catch (err: any) {
      console.error('Erreur chargement agents:', err);
      setError('Impossible de charger les agents pour le moment.');
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setEditFirstName(agent.firstName || agent.name.split(' ')[0] || '');
    setEditLastName(agent.lastName || agent.name.split(' ').slice(1).join(' ') || '');
    setEditPhone(agent.phone || '');
    setEditRole(agent.role || 'Agent');
    setEditStatus(agent.status || 'Actif');
  };

  const handleInviteAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    setSubmittingInvite(true);
    setError('');
    try {
      const res = await api.post('/agency/agents', {
        email: inviteEmail,
        firstName: inviteFirstName,
        lastName: inviteLastName,
        phone: invitePhone,
        role: inviteRole
      });

      setAgents(prev => [res.data, ...prev]);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteFirstName('');
      setInviteLastName('');
      setInvitePhone('');
      setInviteRole('Agent');

      setActionSuccess("L'agent a été ajouté à votre agence avec succès !");
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de l'ajout de l'agent.");
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setSubmittingEdit(true);
    setError('');
    try {
      const res = await api.put(`/agency/agents/${editingAgent.id}`, {
        firstName: editFirstName,
        lastName: editLastName,
        phone: editPhone,
        role: editRole,
        status: editStatus
      });

      setAgents(prev => prev.map(a => a.id === editingAgent.id ? res.data : a));
      setEditingAgent(null);

      setActionSuccess(`Les coordonnées de l'agent ${res.data.name} ont été mises à jour !`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Erreur lors de la modification de l'agent.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    if (!window.confirm(`Confirmez-vous le retrait de l'agent ${agent.name} de votre agence ?`)) {
      return;
    }

    try {
      await api.delete(`/agency/agents/${agent.id}`);
      setAgents(prev => prev.filter(a => a.id !== agent.id));
      setActionSuccess(`L'agent ${agent.name} a été retiré de l'agence.`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de la suppression de l'agent.");
    }
  };

  return (
    <div className="container mt-4" style={{ paddingBottom: '90px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>
            Gestion des Agents
          </h1>
          <p className="text-light mt-1" style={{ margin: 0, fontSize: '0.95rem' }}>
            Gérez les collaborateurs de votre agence, assignez des rôles et suivez leurs mandats.
          </p>
        </div>

        <button 
          className="btn btn-primary d-flex align-items-center justify-content-center gap-2" 
          style={{ minHeight: '44px', padding: '0.65rem 1.35rem', fontWeight: 600 }} 
          onClick={() => setShowInviteModal(true)}
        >
          <UserPlus size={18} />
          Inviter un agent
        </button>
      </div>

      {actionSuccess && (
        <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 500 }}>
          <AlertCircle size={20} color="#dc2626" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <div className="loader" style={{ borderColor: 'var(--color-primary)', borderBottomColor: 'transparent', width: '36px', height: '36px' }}></div>
        </div>
      ) : agents.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1.5px dashed #cbd5e1',
          padding: '3rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <Users size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Aucun agent dans votre agence
          </h3>
          <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem', lineHeight: '1.5' }}>
            Constituez votre équipe commerciale en invitant vos collaborateurs. Ils pourront gérer des annonces et répondre aux clients sous la bannière de votre agence.
          </p>
          <button 
            className="btn btn-primary" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.5rem', fontWeight: 600 }}
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus size={18} />
            Ajouter mon premier agent
          </button>
        </div>
      ) : (
        <div className="card p-0" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Desktop Table View */}
          <div className="desktop-only table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Agent</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Contact</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Rôle</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Mandats</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.88rem' }}>Statut</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.88rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A227', fontWeight: 'bold' }}>
                          {agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{agent.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            Inscrit le {new Date(agent.joinedAt).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span className="d-flex align-items-center gap-2"><Mail size={13} color="#94a3b8" /> {agent.email}</span>
                        {agent.phone && (
                          <span className="d-flex align-items-center gap-2"><Phone size={13} color="#94a3b8" /> {agent.phone}</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#0f172a', fontWeight: 500, fontSize: '0.9rem' }}>
                      {agent.role}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                      {agent.properties} {agent.properties === 1 ? 'bien' : 'biens'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {agent.status === 'Actif' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> Actif
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
                          <Clock size={13} /> En attente
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div className="d-flex justify-content-end gap-2">
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem', color: '#2563eb', borderColor: '#bfdbfe' }} 
                          title="Modifier les coordonnées"
                          onClick={() => openEditModal(agent)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.45rem', color: '#dc2626', borderColor: '#fecaca' }} 
                          title="Retirer"
                          onClick={() => handleDeleteAgent(agent)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {agents.map((agent) => (
              <div 
                key={agent.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.15rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A227', fontWeight: 'bold', fontSize: '1.15rem' }}>
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.98rem' }}>{agent.name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{agent.role}</div>
                    </div>
                  </div>

                  {agent.status === 'Actif' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.2rem 0.65rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      <CheckCircle2 size={12} /> Actif
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.2rem 0.65rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
                      <Clock size={12} /> En attente
                    </span>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem' }}>
                  <a href={`mailto:${agent.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none' }}>
                    <Mail size={14} color="#64748b" /> {agent.email}
                  </a>
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', textDecoration: 'none' }}>
                      <Phone size={14} color="#64748b" /> {agent.phone}
                    </a>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem', color: '#64748b', fontSize: '0.8rem' }}>
                    <span>Biens gérés: <strong style={{ color: '#0f172a' }}>{agent.properties}</strong></span>
                    <span>Depuis: {new Date(agent.joinedAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button 
                    className="btn btn-outline" 
                    style={{ flex: 1, minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: '#2563eb', borderColor: '#bfdbfe', fontSize: '0.9rem', fontWeight: 600, borderRadius: '8px' }}
                    onClick={() => openEditModal(agent)}
                  >
                    <Edit2 size={16} /> Modifier
                  </button>
                  <button 
                    className="btn btn-outline" 
                    style={{ minHeight: '44px', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', color: '#dc2626', borderColor: '#fecaca', fontSize: '0.9rem', borderRadius: '8px' }}
                    onClick={() => handleDeleteAgent(agent)}
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Agent Modal */}
      {editingAgent && (
        <div className="modal-overlay" onClick={() => setEditingAgent(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                Modifier les coordonnées de l'agent
              </h3>
              <button onClick={() => setEditingAgent(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Modifiez le profil et les permissions de cet agent au sein de votre agence.
            </p>

            <form onSubmit={handleUpdateAgent}>
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Prénom</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editFirstName} 
                    onChange={e => setEditFirstName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nom</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={editLastName} 
                    onChange={e => setEditLastName(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={editingAgent.email} 
                  disabled 
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} 
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Téléphone</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={editPhone} 
                  onChange={e => setEditPhone(e.target.value)} 
                  placeholder="+228 90 00 00 00" 
                />
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Rôle</label>
                  <select 
                    className="form-control" 
                    value={editRole} 
                    onChange={e => setEditRole(e.target.value)}
                  >
                    <option value="Agent">Agent commercial</option>
                    <option value="Manager">Manager d'équipe</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Statut</label>
                  <select 
                    className="form-control" 
                    value={editStatus} 
                    onChange={e => setEditStatus(e.target.value)}
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif / Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setEditingAgent(null)}
                  disabled={submittingEdit}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submittingEdit}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', minHeight: '44px', fontWeight: 600 }}
                >
                  <Save size={16} />
                  {submittingEdit ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Agent Modal */}
      {showInviteModal && (
        <div className="modal-overlay" onClick={() => setShowInviteModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '440px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Inviter un agent</h3>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Ajoutez un collaborateur à votre agence pour lui permettre de publier et gérer des annonces.
            </p>
            
            <form onSubmit={handleInviteAgent}>
              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Adresse email de l'agent *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="agent@agence.com" 
                  value={inviteEmail} 
                  onChange={e => setInviteEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Prénom</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Armand" 
                    value={inviteFirstName} 
                    onChange={e => setInviteFirstName(e.target.value)} 
                  />
                </div>
                <div className="col-6">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Nom</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Kossi" 
                    value={inviteLastName} 
                    onChange={e => setInviteLastName(e.target.value)} 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Téléphone</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="+228 90 00 00 00" 
                  value={invitePhone} 
                  onChange={e => setInvitePhone(e.target.value)} 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>Rôle</label>
                <select 
                  className="form-control" 
                  value={inviteRole} 
                  onChange={e => setInviteRole(e.target.value)}
                >
                  <option value="Agent">Agent commercial</option>
                  <option value="Manager">Manager d'agence</option>
                </select>
              </div>
              
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline" onClick={() => setShowInviteModal(false)}>
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submittingInvite}
                  style={{ minHeight: '44px', fontWeight: 600 }}
                >
                  {submittingInvite ? 'Ajout en cours...' : 'Ajouter l\'agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
