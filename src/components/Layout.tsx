import { 
  LayoutDashboard, Home, PlusCircle, Rocket, CreditCard, MessageSquare, 
  BarChart2, Settings, User as UserIcon, Bell, Crown, Headset,
  FileText, Heart, Search as SearchIcon, FileQuestion, Users, Activity, LogOut, MapPin, Shield,
  Menu, X, ChevronDown
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NestoraLogo from './brand/NestoraLogo';
import Footer from './Footer';
import EditProfileModal from './forms/EditProfileModal';

export default function Layout() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  let menuItems = [];

  if (role === 'SEEKER') {
    menuItems = [
      { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/dashboard/seeker' },
      { icon: <SearchIcon size={20} />, label: 'Rechercher un logement', path: '/recherche' },
      { icon: <Heart size={20} />, label: 'Mes favoris', path: '/favoris' },
      { icon: <Activity size={20} />, label: 'Mes visites', path: '/visites' },
      { icon: <FileText size={20} />, label: 'Recherches sauvegardées', path: '#' },
      { icon: <FileQuestion size={20} />, label: 'Mes demandes', path: '/mes-annonces' },
      { icon: <PlusCircle size={20} />, label: 'Publier une demande', path: '/publier' },
      { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
      { icon: <CreditCard size={20} />, label: 'Abonnement', path: '/abonnement' },
      { icon: <FileText size={20} />, label: 'Paiements & Factures', path: '/paiements' },
      { icon: <UserIcon size={20} />, label: 'Profil', path: '#' },
    ];
  } else if (role === 'OWNER') {
    menuItems = [
      { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/dashboard/owner' },
      { icon: <Home size={20} />, label: 'Mes annonces', badge: '7', path: '/mes-annonces' },
      { icon: <PlusCircle size={20} />, label: 'Ajouter une annonce', path: '/publier' },
      { icon: <Heart size={20} />, label: 'Mes favoris', path: '/favoris' },
      { icon: <Activity size={20} />, label: 'Mes visites', path: '/visites' },
      { icon: <SearchIcon size={20} />, label: 'Recherches Clients', path: '/recherches-clients' },
      { icon: <FileQuestion size={20} />, label: 'Demandes reçues', path: '/demandes-visites' },
      { icon: <Rocket size={20} />, label: 'Boost & Visibilité', path: '/boost' },
      { icon: <CreditCard size={20} />, label: 'Premium', path: '/tarifs' },
      { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
      { icon: <BarChart2 size={20} />, label: 'Statistiques', path: '/statistiques' },
      { icon: <FileText size={20} />, label: 'Paiements & Factures', path: '/paiements' },
      { icon: <UserIcon size={20} />, label: 'Profil', path: '#' },
    ];
  } else if (role === 'ADMIN') {
    menuItems = [
      { icon: <Shield size={20} />, label: 'Tableau de bord Admin', path: '/admin' },
      { icon: <UserIcon size={20} />, label: 'Mon Profil', path: '#' },
    ];
  } else {
    menuItems = [
      { icon: <LayoutDashboard size={20} />, label: 'Vue d\'ensemble', path: '/dashboard/agency' },
      { icon: <Home size={20} />, label: 'Portefeuille immobilier', path: '/mes-annonces' },
      { icon: <PlusCircle size={20} />, label: 'Ajouter un bien', path: '/publier' },
      { icon: <Heart size={20} />, label: 'Mes favoris', path: '/favoris' },
      { icon: <Activity size={20} />, label: 'Mes visites', path: '/visites' },
      { icon: <SearchIcon size={20} />, label: 'Recherches Clients', path: '/recherches-clients' },
      { icon: <FileQuestion size={20} />, label: 'Demandes reçues', path: '/demandes-visites' },
      { icon: <Rocket size={20} />, label: 'Boost & Visibilité', path: '/boost' },
      { icon: <CreditCard size={20} />, label: 'Premium', path: '/tarifs' },
      { icon: <Users size={20} />, label: 'Agents', path: '/agents' },
      { icon: <Activity size={20} />, label: 'Prospects / Leads', path: '/prospects' },
      { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
      { icon: <BarChart2 size={20} />, label: 'Statistiques', path: '/statistiques' },
      { icon: <FileText size={20} />, label: 'Paiements & Factures', path: '/paiements' },
      { icon: <Settings size={20} />, label: 'Paramètres', path: '#' },
    ];
  }

  return (
    <div className="app-layout">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '1rem' }}>
          <Link to="/dashboard" className="brand" style={{ textDecoration: 'none' }} onClick={() => setMobileSidebarOpen(false)}>
            <NestoraLogo size="medium" />
          </Link>
          <button 
            className="mobile-only sidebar-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            style={{ color: '#fff', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item, index) => (
            item.label === 'Profil' || item.label === 'Mon Profil' ? (
              <button 
                key={index} 
                className={`nav-item ${showProfileModal ? 'active' : ''}`}
                onClick={() => { setShowProfileModal(true); setMobileSidebarOpen(false); }} 
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <Link 
                key={index} 
                to={item.path} 
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            )
          ))}
          <button 
            className="nav-item text-danger" 
            onClick={() => { setMobileSidebarOpen(false); logout(); }} 
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', fontFamily: 'inherit' }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </nav>

        <div className="sidebar-widget" style={{ marginTop: 'auto' }}>
          <div className="sidebar-widget-title">
            <Crown size={18} color="#C9A227" />
            Boostez vos annonces
          </div>
          <div className="sidebar-widget-text">
            Plus de visibilité, plus de contacts, plus de résultats !
          </div>
          <Link to="/boost" className="btn btn-primary btn-block" onClick={() => setMobileSidebarOpen(false)}>Voir les offres</Link>
        </div>

        <div className="sidebar-widget" style={{ marginBottom: '2rem' }}>
          <div className="sidebar-widget-title">
            <Headset size={18} />
            Besoin d'aide ?
          </div>
          <div className="sidebar-widget-text">
            Notre équipe est disponible 7j/7
          </div>
          <button className="btn btn-outline-light btn-block" onClick={() => setMobileSidebarOpen(false)}>Contacter le support</button>
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '0.5rem 0.75rem', maxWidth: '500px', flex: 1, minWidth: '0' }}>
            <SearchIcon size={18} color="#94a3b8" style={{ minWidth: '18px' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Rechercher..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: '0 0.5rem', minWidth: '0', fontSize: '0.9rem' }}
            />
            <div className="desktop-only-divider" style={{ height: '24px', width: '1px', backgroundColor: '#cbd5e1', margin: '0 0.5rem' }}></div>
            <MapPin size={18} color="#94a3b8" className="desktop-only-icon" style={{ minWidth: '18px' }} />
            <select className="desktop-only-select" style={{ border: 'none', background: 'transparent', outline: 'none', color: '#64748b', fontWeight: 500, cursor: 'pointer', paddingLeft: '0.25rem', maxWidth: '120px' }}>
              <option>Toutes les villes</option>
            </select>
          </div>

          <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="header-action-icon">
              <Bell size={22} />
              <div className="notification-badge">5</div>
            </div>

            {/* User profile dropdown trigger */}
            <div 
              className="user-profile" 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '4px 6px', borderRadius: '8px' }}
            >
              <img 
                src={user?.profile?.avatar || "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&q=80"} 
                alt="User" 
                className="user-avatar" 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div className="user-info">
                <span className="user-name">{user?.profile?.firstName || user?.agency?.name?.split(' ')[0] || 'Utilisateur'}</span>
                <span className="user-role">{role === 'ADMIN' ? 'Administrateur' : role === 'OWNER' ? 'Propriétaire' : role === 'AGENCY' ? 'Agence' : 'Chercheur'}</span>
              </div>
              <ChevronDown size={16} color="#64748b" style={{ transform: userDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {/* Quick logout button on mobile header */}
            <button 
              className="mobile-only" 
              onClick={logout}
              title="Se déconnecter"
              style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', padding: '6px', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Se déconnecter"
            >
              <LogOut size={18} />
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <div 
                className="user-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  border: '1px solid var(--color-border)',
                  minWidth: '220px',
                  padding: '0.5rem',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                    {user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName || ''}` : user?.agency?.name || 'Mon Compte'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    {user?.phone || user?.email || (role === 'ADMIN' ? 'Admin' : role === 'OWNER' ? 'Propriétaire' : role === 'AGENCY' ? 'Agence' : 'Chercheur')}
                  </div>
                </div>

                <button 
                  onClick={() => { setShowProfileModal(true); setUserDropdownOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--color-text-dark)', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <UserIcon size={18} color="#64748b" />
                  <span>Mon Profil</span>
                </button>

                <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />

                <button 
                  onClick={() => { setUserDropdownOpen(false); logout(); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', fontSize: '0.9rem', color: '#dc2626', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  <LogOut size={18} color="#dc2626" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="page-content" style={{ minHeight: 'calc(100vh - 80px)', paddingBottom: '3rem' }}>
          <Outlet />
        </main>
        <div className="layout-footer" style={{ marginTop: 'auto', borderTop: '1px solid var(--color-border)', backgroundColor: '#fff' }}>
          <Footer />
        </div>
      </div>
      
      {showProfileModal && (
        <EditProfileModal 
          onClose={() => setShowProfileModal(false)}
          onSuccess={() => setShowProfileModal(false)}
        />
      )}

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {menuItems.slice(0, 3).map((item, index) => (
            <Link key={index} to={item.path} className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <div className="bottom-nav-icon">{item.icon}</div>
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          ))}
          <button 
            className={`bottom-nav-item ${showProfileModal ? 'active' : ''}`}
            onClick={() => setShowProfileModal(true)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div className="bottom-nav-icon"><UserIcon size={20} /></div>
            <span>Profil</span>
          </button>
          <button 
            className="bottom-nav-item"
            onClick={() => setMobileSidebarOpen(true)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <div className="bottom-nav-icon"><Menu size={20} /></div>
            <span>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
