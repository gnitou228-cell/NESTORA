import { 
  Plus, Crown, Rocket, Home, Eye, Calendar, MessageSquare, 
  BarChart2, MapPin, Bed, Bath, Move, Heart, FileText,
  PieChart as PieChartIcon, Bell, Search, CreditCard
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { chartData, pieData } from '../data/mockData';
import EditProfileModal from '../components/forms/EditProfileModal';

export default function Dashboard() {
  const { role, user } = useAuth();
  
  const isOwnerOrAgency = role === 'OWNER' || role === 'AGENCY';

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsPremium(localStorage.getItem('nestora_is_premium') === 'true');
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [role]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader className="spin" size={40} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-grid">
        <div className="main-column">
          <div className="welcome-banner">
            <div className="welcome-content">
              <h1 className="welcome-title">Bonjour {user?.profile?.firstName || 'Utilisateur'} 👋</h1>
              <h2 className="welcome-subtitle">Votre espace {role?.toLowerCase() || ''} est prêt !</h2>
              <p className="welcome-desc">
                {isOwnerOrAgency 
                  ? "Gérez facilement vos annonces, suivez vos visites, boostez votre visibilité et développez votre activité." 
                  : "Retrouvez vos propriétés favorites, suivez vos demandes de visite et configurez vos alertes immobilières."}
              </p>
              {isOwnerOrAgency ? (
                <Link to="/publier" className="btn btn-primary">
                  <Plus size={18} />
                  Publier une annonce
                </Link>
              ) : (
                <Link to="/" className="btn btn-primary">
                  <Search size={18} />
                  Rechercher un bien
                </Link>
              )}
            </div>
          </div>

          <div className="stats-grid">
            {isOwnerOrAgency ? (
              <>
                <div className="stat-card">
                  <div className="stat-header">
                    <Home size={16} />
                    Mes annonces
                  </div>
                  <div className="stat-value-container">
                    <div className="stat-value">{stats?.totalProperties || 0}</div>
                  </div>
                  <div className="stat-sub">{stats?.publishedProperties || 0} actives | {stats?.pendingProperties || 0} en attente {stats?.expiredProperties !== undefined ? `| ${stats.expiredProperties} expirées` : ''}</div>
                </div>
                {role === 'AGENCY' ? (
                  <div className="stat-card">
                    <div className="stat-header">
                      <PieChartIcon size={16} />
                      Agents
                    </div>
                    <div className="stat-value-container">
                      <div className="stat-value">{stats?.agents || 0}</div>
                    </div>
                    <div className="stat-sub">Membres de l'agence</div>
                  </div>
                ) : (
                  <div className="stat-card">
                    <div className="stat-header">
                      <Eye size={16} />
                      Vues totales
                    </div>
                    <div className="stat-value-container">
                      <div className="stat-value">-</div>
                    </div>
                    <div className="stat-sub">Bientôt disponible</div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="stat-card">
                  <div className="stat-header">
                    <Heart size={16} />
                    Favoris
                  </div>
                  <div className="stat-value-container">
                    <div className="stat-value">{stats?.favorites || 0}</div>
                  </div>
                  <div className="stat-sub">Biens sauvegardés</div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <Bell size={16} />
                    Alertes actives
                  </div>
                  <div className="stat-value-container">
                    <div className="stat-value">-</div>
                  </div>
                  <div className="stat-sub">Bientôt disponible</div>
                </div>
              </>
            )}
            
            <div className="stat-card">
              <div className="stat-header">
                <Calendar size={16} />
                Demandes de visite
              </div>
              <div className="stat-value-container">
                <div className="stat-value">{stats?.visits || 0}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <MessageSquare size={16} />
                Conversations
              </div>
              <div className="stat-value-container">
                <div className="stat-value">{stats?.conversations || 0}</div>
              </div>
            </div>
          </div>

          {isOwnerOrAgency && (
            <div className="charts-grid">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <BarChart2 size={18} />
                    Évolution de vos annonces
                  </div>
                </div>
                <div style={{ height: '200px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="vues" stroke="#0B1F3A" strokeWidth={2} dot={{ r: 3, fill: '#0B1F3A' }} />
                      <Line type="monotone" dataKey="contacts" stroke="#C9A227" strokeWidth={2} dot={{ r: 3, fill: '#C9A227' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B1F3A' }}></div>
                    Vues
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C9A227' }}></div>
                    Contacts
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    <PieChartIcon size={18} />
                    Répartition
                  </div>
                </div>
                <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pieData.map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.fill }}></div>
                          {item.name}
                        </div>
                        <div style={{ fontWeight: 600 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {isOwnerOrAgency ? (
                  <><Home size={18} /> Mes annonces récentes</>
                ) : (
                  <><Heart size={18} /> Mes favoris récents</>
                )}
              </div>
              <Link to={isOwnerOrAgency ? "/mes-annonces" : "/favoris"} className="card-link">
                Voir tout →
              </Link>
            </div>
            <div className="properties-grid">
              {(stats?.recentProperties || []).map((property: any) => (
                <div className="property-card" key={property.id}>
                  <div className="property-img-container">
                    <img src={property.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={property.title} className="property-img" />
                    {isOwnerOrAgency && (
                      <div className={`property-status ${property.status === 'PUBLISHED' ? 'status-online' : property.status === 'PENDING' ? 'status-pending' : 'status-expired'}`}>
                        {property.status}
                      </div>
                    )}
                    <div className="property-fav">
                      <Heart size={16} fill={!isOwnerOrAgency ? "#C9A227" : "none"} color={!isOwnerOrAgency ? "#C9A227" : "currentColor"} />
                    </div>
                  </div>
                  <div className="property-content">
                    <div className="property-title">{property.title}</div>
                    <div className="property-location">
                      <MapPin size={12} />
                      {property.city?.name}
                    </div>
                    <div className="property-features">
                      {property.bedrooms > 0 && (
                        <div className="feature">
                          <Bed size={14} /> {property.bedrooms} ch
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="feature">
                          <Bath size={14} /> {property.bathrooms} sdb
                        </div>
                      )}
                      {property.surface > 0 && (
                        <div className="feature">
                          <Move size={14} /> {property.surface} m²
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div>
                        <div className="property-price">{property.price?.toLocaleString()} {property.currency}</div>
                        <div className={`property-type ${property.transactionType === 'SALE' ? 'property-type-sell' : ''}`}>
                          {property.transactionType === 'SALE' ? 'À vendre' : 'À louer'}
                        </div>
                      </div>
                      <Link to={`/annonces/${property.id}`} className="btn btn-outline" style={{ padding: '0.25rem' }}>
                        <Eye size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bottom-widgets">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Activités récentes</div>
                <Link to="#" className="card-link">Voir tout</Link>
              </div>
              <div className="mini-list">
                {stats?.recentActivities?.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '1rem' }}>Aucune activité récente</div>
                ) : (
                  (stats?.recentActivities || []).map((req: any, i: number) => (
                    <div className="mini-item" key={i}>
                      <div className="mini-item-icon">
                        <Calendar size={16} />
                      </div>
                      <div className="mini-item-content">
                        <div className="mini-item-title">{req.title}</div>
                        <div className="mini-item-sub">{req.desc}</div>
                      </div>
                      <div className="mini-item-sub">
                        {new Date(req.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Mes factures</div>
                <Link to="/paiements" className="card-link">Voir tout</Link>
              </div>
              <div className="mini-list" style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                Bientôt disponible
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Mon profil</div>
                <Link to="#" className="card-link">Voir tout</Link>
              </div>
              <div className="profile-summary">
                <img src={user?.profile?.avatar || "https://ui-avatars.com/api/?name=" + (user?.profile?.firstName || 'User')} alt="Profile" className="profile-summary-avatar" />
                <div className="profile-details">
                  <div className="profile-name">{user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'Utilisateur'}</div>
                  <div className="profile-role">{role}</div>
                  <div className="profile-location">
                    <MapPin size={12} />
                    Lomé, Togo
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-block" onClick={() => setShowEditProfile(true)}>Modifier mon profil</button>
            </div>
          </div>
        </div>

        <div className="side-column">
          <div className="subscription-card">
            <div className="subscription-header">
              <div className="subscription-title">
                <Crown size={20} color={isPremium ? "#C9A227" : "#94a3b8"} />
                Votre abonnement
              </div>
              <Link to="/abonnement" className="card-link">{isPremium ? "Détails" : "Découvrir"}</Link>
            </div>
            
            {isPremium ? (
              <>
                <div className="subscription-plan">Premium {role}</div>
                <div className="subscription-date">Jusqu'au 25 oct. 2025</div>
                
                <div className="progress-bar-container">
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: isOwnerOrAgency ? '30%' : '100%' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="progress-text">
                      {isOwnerOrAgency ? "Annonces illimitées" : "Recherches illimitées"}
                    </span>
                    <span className="progress-text" style={{ color: '#10b981', fontWeight: 600 }}>Actif</span>
                  </div>
                </div>
                
                <Link to="/abonnement" className="btn btn-outline btn-block" style={{textAlign: 'center'}}>Gérer mon abonnement</Link>
              </>
            ) : (
              <>
                <div className="subscription-plan" style={{ color: '#64748b' }}>Plan Gratuit</div>
                <div className="subscription-date" style={{ color: '#ef4444', fontWeight: 600 }}>Limité à 2 annonces</div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '1rem 0' }}>
                  Passez au Premium pour publier en illimité et booster votre visibilité.
                </p>
                <Link to="/tarifs" className="btn" style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: 'white', textAlign: 'center', display: 'block', padding: '0.75rem', borderRadius: '8px', fontWeight: 600 }}>Passer au Premium</Link>
              </>
            )}
          </div>

          <div className="action-menu">
            {isOwnerOrAgency ? (
              <>
                <Link to="/publier" className="action-item">
                  <div className="action-left">
                    <div className="action-icon">
                      <Plus size={20} />
                    </div>
                    <div>
                      <div className="action-title">Publier une annonce</div>
                      <div className="action-desc">Bien immobilier ou recherche</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </Link>
                <Link to="/boost" className="action-item">
                  <div className="action-left">
                    <div className="action-icon" style={{ color: '#C9A227' }}>
                      <Rocket size={20} />
                    </div>
                    <div>
                      <div className="action-title">Boostez une annonce</div>
                      <div className="action-desc">Plus de visibilité, plus de contacts</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </Link>
                <Link to="/abonnement" className="action-item">
                  <div className="action-left">
                    <div className="action-icon">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div className="action-title">Gérer mes abonnements</div>
                      <div className="action-desc">Profitez de plus d'avantages</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </Link>
              </>
            ) : (
              <>
                <Link to="/alertes" className="action-item">
                  <div className="action-left">
                    <div className="action-icon">
                      <Bell size={20} />
                    </div>
                    <div>
                      <div className="action-title">Créer une alerte</div>
                      <div className="action-desc">Soyez notifié des nouveautés</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </Link>
                <Link to="/demandes" className="action-item">
                  <div className="action-left">
                    <div className="action-icon" style={{ color: '#C9A227' }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="action-title">Déposer un dossier</div>
                      <div className="action-desc">Dossier locataire simplifié</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#94a3b8" />
                </Link>
              </>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Activités récentes (Toutes)</div>
              <Link to="#" className="card-link">Voir tout</Link>
            </div>
            <div className="activity-list">
              {stats?.recentActivities?.length === 0 ? (
                <div style={{ padding: '1rem', color: 'var(--color-text-light)', textAlign: 'center' }}>Aucune activité récente</div>
              ) : (
                (stats?.recentActivities || []).map((activity: any, i: number) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-icon blue">
                      <Calendar size={16} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-desc">{activity.desc}</div>
                      <div className="activity-time">{new Date(activity.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {isOwnerOrAgency && (
            <div className="banner-ad">
              <div className="banner-ad-content">
                <div className="banner-ad-title">
                  <Rocket size={18} />
                  Boostez vos annonces
                </div>
                <div className="banner-ad-desc">
                  Soyez en tête des résultats de recherche et attirez plus de contacts qualifiés.
                </div>
                <Link to="/boost" className="btn btn-primary" style={{display: 'inline-block'}}>Découvrir les offres</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showEditProfile && (
        <EditProfileModal 
          onClose={() => setShowEditProfile(false)} 
          onSuccess={() => {
            setShowEditProfile(false);
          }} 
        />
      )}
    </>
  );
}

const ChevronRight = ({ size, color }: { size: number, color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
