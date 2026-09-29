import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Home, CreditCard, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/api';
import { formatPrice } from '../../config/monetization';

export default function AdminDashboard() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'STATS' | 'USERS' | 'PROPERTIES' | 'PAYMENTS'>('STATS');
  
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

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
      } else if (activeTab === 'PAYMENTS' && payments.length === 0) {
        const res = await api.get('/admin/payments');
        setPayments(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/admin/properties/${id}/status`, { status });
      setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
    } catch (e) {
      console.error(e);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="mb-4">
        <h1 className="page-title">Administration & Modération</h1>
        <p className="text-light">Supervisez l'activité de la plateforme NESTORA.</p>
      </div>

      <div className="tabs mb-4">
        <button className={`tab ${activeTab === 'STATS' ? 'active' : ''}`} onClick={() => setActiveTab('STATS')}>
          <AlertCircle size={16} /> Vue d'ensemble
        </button>
        <button className={`tab ${activeTab === 'USERS' ? 'active' : ''}`} onClick={() => setActiveTab('USERS')}>
          <Users size={16} /> Utilisateurs
        </button>
        <button className={`tab ${activeTab === 'PROPERTIES' ? 'active' : ''}`} onClick={() => setActiveTab('PROPERTIES')}>
          <Home size={16} /> Annonces
        </button>
        <button className={`tab ${activeTab === 'PAYMENTS' ? 'active' : ''}`} onClick={() => setActiveTab('PAYMENTS')}>
          <CreditCard size={16} /> Paiements
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
              <Home color="#3b82f6" size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Annonces</h3>
              <p className="stat-value">{stats.totalProperties}</p>
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
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertCircle color="#ef4444" size={24} />
            </div>
            <div className="stat-info">
              <h3>Annonces en attente</h3>
              <p className="stat-value">{stats.pendingProperties}</p>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'USERS' && (
        <div className="card p-0">
          <table className="w-100" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Nom</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Rôle</th>
                <th style={{ padding: '1rem' }}>Vérifié</th>
                <th style={{ padding: '1rem' }}>Date d'inscription</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{u.firstName} {u.lastName}</td>
                  <td style={{ padding: '1rem' }}>{u.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge badge-${u.role === 'ADMIN' ? 'danger' : 'primary'}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{u.isVerified ? 'Oui' : 'Non'}</td>
                  <td style={{ padding: '1rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && activeTab === 'PROPERTIES' && (
        <div className="card p-0">
          <table className="w-100" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-secondary)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Titre</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Propriétaire</th>
                <th style={{ padding: '1rem' }}>Statut</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{p.title}</td>
                  <td style={{ padding: '1rem' }}>{p.transactionType} / {p.propertyType}</td>
                  <td style={{ padding: '1rem' }}>{p.owner?.firstName} {p.owner?.lastName}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`mini-badge ${p.status === 'PUBLISHED' ? 'badge-success' : p.status === 'SUSPENDED' ? 'badge-danger' : 'badge-warning'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                      {p.status !== 'PUBLISHED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handlePropertyStatus(p.id, 'PUBLISHED')} title="Approuver">
                          <CheckCircle size={14} className="text-success" />
                        </button>
                      )}
                      {p.status !== 'SUSPENDED' && (
                        <button className="btn btn-sm btn-outline" onClick={() => handlePropertyStatus(p.id, 'SUSPENDED')} title="Suspendre">
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

      {!loading && activeTab === 'PAYMENTS' && (
        <div className="card p-0">
          <table className="w-100" style={{ borderCollapse: 'collapse' }}>
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
                  <td style={{ padding: '1rem' }}>{pay.user?.firstName} {pay.user?.lastName}</td>
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

    </div>
  );
}
