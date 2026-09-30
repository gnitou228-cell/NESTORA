import { useState, useEffect } from 'react';
import { BarChart2, Eye, Heart, MessageSquare, Calendar, Rocket, TrendingUp } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface StatsData {
  activeProperties: number;
  totalProperties: number;
  totalViews: number;
  totalFavorites: number;
  totalVisits: number;
  totalConversations: number;
  activeBoosts: number;
}

export default function Statistics() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (role === 'SEEKER') {
      navigate('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/dashboard');
        setStats(res.data);
      } catch (err: any) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, role, navigate]);

  if (loading) {
    return (
      <div className="container mt-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loader" style={{ borderColor: 'var(--color-primary)', borderBottomColor: 'transparent', width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text-dark)', margin: 0 }}>Statistiques & Performances</h1>
          <p className="text-light mt-1">Suivez l'évolution de vos annonces sur la plateforme.</p>
        </div>
        <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <TrendingUp size={20} />
          Performances globales
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <Eye size={24} />
            </div>
            <div className="stat-info">
              <h3>Vues totales</h3>
              <p className="stat-number">{stats?.totalViews.toLocaleString()}</p>
              <p className="stat-trend text-success">Sur l'ensemble de vos annonces</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
              <Heart size={24} />
            </div>
            <div className="stat-info">
              <h3>Mises en favoris</h3>
              <p className="stat-number">{stats?.totalFavorites.toLocaleString()}</p>
              <p className="stat-trend text-light">Utilisateurs intéressés</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#22c55e' }}>
              <MessageSquare size={24} />
            </div>
            <div className="stat-info">
              <h3>Messages & Contacts</h3>
              <p className="stat-number">{stats?.totalConversations.toLocaleString()}</p>
              <p className="stat-trend text-success">Prospects générés</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <h3>Demandes de visite</h3>
              <p className="stat-number">{stats?.totalVisits.toLocaleString()}</p>
              <p className="stat-trend text-light">Visites planifiées</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#a855f7' }}>
              <Rocket size={24} />
            </div>
            <div className="stat-info">
              <h3>Boosts Actifs</h3>
              <p className="stat-number">{stats?.activeBoosts.toLocaleString()}</p>
              <p className="stat-trend text-light">Annonces propulsées</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
              <BarChart2 size={24} />
            </div>
            <div className="stat-info">
              <h3>Annonces Publiées</h3>
              <p className="stat-number">{stats?.activeProperties} / {stats?.totalProperties}</p>
              <p className="stat-trend text-light">Sur le total de vos biens</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stat-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          height: 100%;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-info h3 {
          font-size: 0.9rem;
          color: var(--color-text-light);
          margin: 0 0 0.5rem 0;
          font-weight: 600;
        }
        .stat-number {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--color-text-dark);
          margin: 0 0 0.25rem 0;
        }
        .stat-trend {
          font-size: 0.85rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
