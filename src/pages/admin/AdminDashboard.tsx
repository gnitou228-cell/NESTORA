import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Users, Home, CreditCard, AlertCircle, CheckCircle, XCircle, 
  Flag, Shield, Building, Zap, Activity, BookOpen, Ban 
} from 'lucide-react';
import api from '../../lib/api';
import { formatPrice } from '../../config/monetization';

type TabType = 'STATS' | 'USERS' | 'PROPERTIES' | 'REPORTS' | 'VERIFICATIONS' | 'AGENCIES' | 'SUBSCRIPTIONS' | 'BOOSTS' | 'PAYMENTS' | 'AUDIT';

export default function AdminDashboard() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('STATS');
  
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [boosts, setBoosts] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'STATS' && !stats) {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'USERS' && users.length === 0) {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'PROPERTIES' && properties.length === 0) {
        const res = await api.get('/admin/properties');
        setProperties(res.data);
      } else if (activeTab === 'REPORTS' && reports.length === 0) {
        const res = await api.get('/admin/reports');
        setReports(res.data);
      } else if (activeTab === 'VERIFICATIONS' && verifications.length === 0) {
        const res = await api.get('/admin/verifications');
        setVerifications(res.data);
      } else if (activeTab === 'AGENCIES' && agencies.length === 0) {
        const res = await api.get('/admin/agencies');
        setAgencies(res.data);
      } else if (activeTab === 'SUBSCRIPTIONS' && subscriptions.length === 0) {
        const res = await api.get('/admin/subscriptions');
        setSubscriptions(res.data);
      } else if (activeTab === 'BOOSTS' && boosts.length === 0) {
        const res = await api.get('/admin/boosts');
        setBoosts(res.data);
      } else if (activeTab === 'PAYMENTS' && payments.length === 0) {
        const res = await api.get('/admin/payments');
        setPayments(res.data);
      } else if (activeTab === 'AUDIT' && audit.length === 0) {
        const res = await api.get('/admin/audit');
        setAudit(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyStatus = async (id: string, status: string, reason?: string) => {
    if (status === 'REJECTED' && !reason) {
      reason = prompt("Raison du rejet:") || "Non conforme";
    }
    try {
      await api.patch(`/admin/properties/${id}/status`, { status, reason });
      setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleUserStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      setUsers(users.map(u => u.id === id ? { ...u, status } : u));
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleReportStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/reports/${id}/status`, { status });
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleVerificationStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/verifications/${id}/status`, { status });
      setVerifications(verifications.map(v => v.id === id ? { ...v, status } : v));
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="mb-4">
        <h1 className="page-title">Espace Administration</h1>
        <p className="text-light">Supervisez l'activité de la plateforme NESTORA en temps réel.</p>
      </div>

      <div className="tabs mb-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className={`tab ${activeTab === 'STATS' ? 'active' : ''}`} onClick={() => setActiveTab('STATS')}>
          <Activity size={16} /> Statistiques
        </button>
        <button className={`tab ${activeTab === 'USERS' ? 'active' : ''}`} onClick={() => setActiveTab('USERS')}>
          <Users size={16} /> Utilisateurs
        </button>
        <button className={`tab ${activeTab === 'AGENCIES' ? 'active' : ''}`} onClick={() => setActiveTab('AGENCIES')}>
          <Building size={16} /> Agences
        </button>
        <button className={`tab ${activeTab === 'PROPERTIES' ? 'active' : ''}`} onClick={() => setActiveTab('PROPERTIES')}>
          <Home size={16} /> Annonces
        </button>
        <button className={`tab ${activeTab === 'REPORTS' ? 'active' : ''}`} onClick={() => setActiveTab('REPORTS')}>
          <Flag size={16} /> Signalements
        </button>
        <button className={`tab ${activeTab === 'VERIFICATIONS' ? 'active' : ''}`} onClick={() => setActiveTab('VERIFICATIONS')}>
          <Shield size={16} /> Vérifications
        </button>
        <button className={`tab ${activeTab === 'SUBSCRIPTIONS' ? 'active' : ''}`} onClick={() => setActiveTab('SUBSCRIPTIONS')}>
          <BookOpen size={16} /> Abonnements
        </button>
        <button className={`tab ${activeTab === 'BOOSTS' ? 'active' : ''}`} onClick={() => setActiveTab('BOOSTS')}>
          <Zap size={16} /> Boosts
        </button>
        <button className={`tab ${activeTab === 'PAYMENTS' ? 'active' : ''}`} onClick={() => setActiveTab('PAYMENTS')}>
          <CreditCard size={16} /> Paiements
        </button>
        <button className={`tab ${activeTab === 'AUDIT' ? 'active' : ''}`} onClick={() => setActiveTab('AUDIT')}>
          <AlertCircle size={16} /> Journal (Audit)
        </button>
      </div>

      {loading && <div className="text-center py-5">Chargement...</div>}

      {!loading && activeTab === 'STATS' && stats && (
        <div className="dashboard-grid mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(201, 162, 39, 0.1)' }}>
              <Users color="#C9A227" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Utilisateurs</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Building color="#3b82f6" size={24} />
            </div>
            <div className="stat-info">
              <h3>Agences</h3>
              <p className="stat-value">{stats.totalAgencies}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <Home color="#3b82f6" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Annonces</h3>
              <p className="stat-value">{stats.totalProperties}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle color="#ef4444" size={24} />
            </div>
            <div className="stat-info">
              <h3>Annonces en attente</h3>
              <p className="stat-value">{stats.pendingProperties}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <Flag color="#ef4444" size={24} />
            </div>
            <div className="stat-info">
              <h3>Signalements</h3>
              <p className="stat-value">{stats.totalReports}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <CreditCard color="#10b981" size={24} />
            </div>
            <div className="stat-info">
              <h3>Revenus</h3>
              <p className="stat-value">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'USERS' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Nom</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Rôle</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Inscription</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{u.profile?.firstName} {u.profile?.lastName}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge badge-${u.role === 'ADMIN' ? 'danger' : 'primary'}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                      {u.status !== 'SUSPENDED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleUserStatus(u.id, 'SUSPENDED')} title="Suspendre">
                          <Ban size={14} className="text-danger" />
                        </button>
                      )}
                      {u.status !== 'ACTIVE' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleUserStatus(u.id, 'ACTIVE')} title="Activer">
                          <CheckCircle size={14} className="text-success" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'AGENCIES' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Nom</th>
                <th style={{ padding: '1rem' }}>Propriétaire</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Statut Vérif.</th>
                <th style={{ padding: '1rem' }}>Annonces</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{a.name}</td>
                  <td style={{ padding: '1rem' }}>{a.owner?.profile?.firstName} {a.owner?.profile?.lastName}</td>
                  <td style={{ padding: '1rem' }}>{a.email}</td>
                  <td style={{ padding: '1rem' }}>{a.verificationStatus}</td>
                  <td style={{ padding: '1rem' }}>{a._count?.properties || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'PROPERTIES' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Titre</th>
                <th style={{ padding: '1rem' }}>Propriétaire</th>
                <th style={{ padding: '1rem' }}>Lieu</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Signalements</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    {p.title}
                    {p.boosts?.length > 0 && <span className="mini-badge" style={{ backgroundColor: 'var(--color-gold)', color: 'white', marginLeft: '5px' }}><Zap size={10} /></span>}
                  </td>
                  <td style={{ padding: '1rem' }}>{p.owner?.profile?.firstName} {p.owner?.profile?.lastName}</td>
                  <td style={{ padding: '1rem' }}>{p.city?.name}, {p.country?.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${p.status === 'PUBLISHED' ? 'badge-success' : p.status === 'REJECTED' || p.status === 'ARCHIVED' ? 'badge-danger' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{p._count?.reports || 0}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                      {p.status !== 'PUBLISHED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handlePropertyStatus(p.id, 'PUBLISHED')} title="Approuver">
                          <CheckCircle size={14} className="text-success" />
                        </button>
                      )}
                      {p.status !== 'REJECTED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handlePropertyStatus(p.id, 'REJECTED')} title="Rejeter">
                          <XCircle size={14} className="text-danger" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'REPORTS' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Annonce / Utilisateur</th>
                <th style={{ padding: '1rem' }}>Catégorie</th>
                <th style={{ padding: '1rem' }}>Signalé par</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{r.property ? r.property.title : r.reportedUser?.email}</td>
                  <td style={{ padding: '1rem' }}>{r.category}</td>
                  <td style={{ padding: '1rem' }}>{r.reporter?.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${r.status === 'RESOLVED' ? 'badge-success' : r.status === 'DISMISSED' ? 'badge-danger' : 'badge-warning'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                      {r.status === 'PENDING' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleReportStatus(r.id, 'UNDER_REVIEW')} title="En cours de révision">
                          <Shield size={14} className="text-warning" />
                        </button>
                      )}
                      {r.status !== 'RESOLVED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleReportStatus(r.id, 'RESOLVED')} title="Résoudre">
                          <CheckCircle size={14} className="text-success" />
                        </button>
                      )}
                      {r.status !== 'DISMISSED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleReportStatus(r.id, 'DISMISSED')} title="Rejeter">
                          <XCircle size={14} className="text-danger" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'VERIFICATIONS' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Utilisateur / Agence</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{v.type}</td>
                  <td style={{ padding: '1rem' }}>{v.user ? v.user.email : v.agency ? v.agency.name : '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${v.status === 'VERIFIED' ? 'badge-success' : v.status === 'REJECTED' ? 'badge-danger' : 'badge-warning'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                      {v.status !== 'VERIFIED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleVerificationStatus(v.id, 'VERIFIED')} title="Approuver">
                          <CheckCircle size={14} className="text-success" />
                        </button>
                      )}
                      {v.status !== 'REJECTED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handleVerificationStatus(v.id, 'REJECTED')} title="Rejeter">
                          <XCircle size={14} className="text-danger" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'SUBSCRIPTIONS' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Utilisateur</th>
                <th style={{ padding: '1rem' }}>Plan</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Date de fin</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{s.user?.email}</td>
                  <td style={{ padding: '1rem' }}>{s.plan?.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${s.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(s.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'BOOSTS' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Annonce</th>
                <th style={{ padding: '1rem' }}>Utilisateur</th>
                <th style={{ padding: '1rem' }}>Plan</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Date de fin</th>
              </tr>
            </thead>
            <tbody>
              {boosts.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{b.property?.title}</td>
                  <td style={{ padding: '1rem' }}>{b.user?.email}</td>
                  <td style={{ padding: '1rem' }}>{b.plan?.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${b.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{b.status}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{new Date(b.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'PAYMENTS' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>ID</th>
                <th style={{ padding: '1rem' }}>Utilisateur</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Montant</th>
                <th style={{ padding: '1rem' }}>Fournisseur</th>
                <th style={{ padding: '1rem' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{pay.id.substring(0,8).toUpperCase()}</td>
                  <td style={{ padding: '1rem' }}>{pay.user?.email}</td>
                  <td style={{ padding: '1rem' }}>{pay.type}</td>
                  <td style={{ padding: '1rem' }}>{formatPrice(pay.amount, pay.currency)}</td>
                  <td style={{ padding: '1rem' }}>{pay.provider}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${pay.status === 'SUCCESS' ? 'badge-success' : 'badge-warning'}`}>
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'AUDIT' && (
        <div className="card p-0" style={{ overflowX: 'auto' }}>
          <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Admin</th>
                <th style={{ padding: '1rem' }}>Action</th>
                <th style={{ padding: '1rem' }}>Entité</th>
                <th style={{ padding: '1rem' }}>ID Entité</th>
              </tr>
            </thead>
            <tbody>
              {audit.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(a.createdAt).toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{a.admin?.email}</td>
                  <td style={{ padding: '1rem' }}><strong>{a.action}</strong></td>
                  <td style={{ padding: '1rem' }}>{a.entityType}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{a.entityId.substring(0,8)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
