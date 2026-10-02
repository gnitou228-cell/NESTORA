import { useState, useEffect } from 'react';
import { Eye, Heart, MessageSquare, Calendar, Rocket, TrendingUp, BarChart2, PlusCircle, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/stats/dashboard');
      setStats(res.data);
    } catch (err: any) {
      console.error('Erreur chargement stats:', err);
      // Fallback empty stats instead of blocking the user completely
      setStats({
        activeProperties: 0,
        totalProperties: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalVisits: 0,
        totalConversations: 0,
        activeBoosts: 0
      });
      setError('Impossible de synchroniser les dernières données. Affichage hors-ligne ou état vide.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (role === 'SEEKER') {
      navigate('/dashboard');
      return;
    }

    fetchStats();
  }, [user, role, navigate]);

  if (loading) {
    return (
      <div className="container mt-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', gap: '1rem' }}>
        <div className="loader" style={{ borderColor: 'var(--color-primary)', borderBottomColor: 'transparent', width: '40px', height: '40px' }}></div>
        <span style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Chargement de vos statistiques...</span>
      </div>
    );
  }

  const isEmpty = (stats?.totalProperties ?? 0) === 0;

  return (
    <div className="stats-page-container container mt-4" style={{ paddingBottom: '90px' }}>
      {/* Header */}
      <div className="stats-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>
            Statistiques & Performances
          </h1>
          <p className="text-light mt-1" style={{ margin: 0, fontSize: '0.95rem' }}>
            Suivez l'activité et l'engagement de vos annonces en temps réel.
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={fetchStats}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', fontSize: '0.85rem', borderRadius: '8px' }}
            title="Rafraîchir"
          >
            <RefreshCw size={15} />
            <span className="desktop-only">Actualiser</span>
          </button>

          <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.5rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <TrendingUp size={18} />
            Performances globales
          </div>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
          <span>{error}</span>
          <button onClick={fetchStats} style={{ background: 'none', border: 'none', color: '#b45309', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
            Réessayer
          </button>
        </div>
      )}

      {/* Empty State Banner if 0 properties */}
      {isEmpty && (
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <BarChart2 size={28} />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Aucune donnée disponible pour le moment
          </h3>
          <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem', lineHeight: '1.5' }}>
            Vous n'avez pas encore d'annonce publiée ou active. Dès que vous publiez des biens immobiliers, vos vues, favoris, messages et visites apparaîtront ici.
          </p>
          <Link to="/publier" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', fontWeight: 600 }}>
            <PlusCircle size={18} />
            Publier ma première annonce
          </Link>
        </div>
      )}

      {/* Grid of Key Performance Indicators */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <Eye size={24} />
          </div>
          <div className="stat-info">
            <h3>Vues totales</h3>
            <p className="stat-number">{(stats?.totalViews ?? 0).toLocaleString('fr-FR')}</p>
            <p className="stat-trend text-success">Sur l'ensemble de vos annonces</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
            <Heart size={24} />
          </div>
          <div className="stat-info">
            <h3>Mises en favoris</h3>
            <p className="stat-number">{(stats?.totalFavorites ?? 0).toLocaleString('fr-FR')}</p>
            <p className="stat-trend text-light">Clients intéressés</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            <MessageSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>Messages & Contacts</h3>
            <p className="stat-number">{(stats?.totalConversations ?? 0).toLocaleString('fr-FR')}</p>
            <p className="stat-trend text-success">Prospects engagés</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>Demandes de visite</h3>
            <p className="stat-number">{(stats?.totalVisits ?? 0).toLocaleString('fr-FR')}</p>
            <p className="stat-trend text-light">Rendez-vous sollicités</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Rocket size={24} />
          </div>
          <div className="stat-info">
            <h3>Boosts Actifs</h3>
            <p className="stat-number">{(stats?.activeBoosts ?? 0).toLocaleString('fr-FR')}</p>
            <p className="stat-trend text-light">Mises en avant en cours</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
            <BarChart2 size={24} />
          </div>
          <div className="stat-info">
            <h3>Annonces publiées</h3>
            <p className="stat-number">{stats?.activeProperties ?? 0} <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#94a3b8' }}>/ {stats?.totalProperties ?? 0}</span></p>
            <p className="stat-trend text-light">Biens en ligne / Total</p>
          </div>
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .stats-header {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }
        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 1.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
        }
        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-info {
          flex: 1;
          min-width: 0;
        }
        .stat-info h3 {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0 0 0.35rem 0;
          font-weight: 600;
        }
        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 0.2rem 0;
          line-height: 1.1;
        }
        .stat-trend {
          font-size: 0.8rem;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
}
