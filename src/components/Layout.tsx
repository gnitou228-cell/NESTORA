import { 
  LayoutDashboard, Home, PlusCircle, Rocket, CreditCard, MessageSquare, 
  BarChart2, Settings, User as UserIcon, Bell, Crown, Headset,
  FileText, Heart, Search as SearchIcon, FileQuestion, Users, Activity, LogOut, MapPin
} from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NestoraLogo from './brand/NestoraLogo';
import Footer from './Footer';
import EditProfileModal from './forms/EditProfileModal';

export default function Layout() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const [showProfileModal, setShowProfileModal] = useState(false);

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
      { icon: <FileQuestion size={20} />, label: 'Demandes reçues', path: '/demandes-visites' },
      { icon: <Rocket size={20} />, label: 'Boost & Visibilité', path: '/mes-annonces' },
      { icon: <CreditCard size={20} />, label: 'Premium', path: '/tarifs' },
      { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
      { icon: <BarChart2 size={20} />, label: 'Statistiques', path: '#' },
      { icon: <FileText size={20} />, label: 'Paiements & Factures', path: '/paiements' },
      { icon: <UserIcon size={20} />, label: 'Profil', path: '#' },
    ];
  } else {
    menuItems = [
      { icon: <LayoutDashboard size={20} />, label: 'Vue d\'ensemble', path: '/dashboard/agency' },
      { icon: <Home size={20} />, label: 'Portefeuille immobilier', path: '/mes-annonces' },
      { icon: <PlusCircle size={20} />, label: 'Ajouter un bien', path: '/publier' },
      { icon: <Heart size={20} />, label: 'Mes favoris', path: '/favoris' },
      { icon: <Activity size={20} />, label: 'Mes visites', path: '/visites' },
      { icon: <FileQuestion size={20} />, label: 'Demandes reçues', path: '/demandes-visites' },
      { icon: <Rocket size={20} />, label: 'Boost & Visibilité', path: '/mes-annonces' },
      { icon: <CreditCard size={20} />, label: 'Premium', path: '/tarifs' },
      { icon: <Users size={20} />, label: 'Agents', path: '#' },
      { icon: <Activity size={20} />, label: 'Prospects / Leads', path: '#' },
      { icon: <MessageSquare size={20} />, label: 'Messages', path: '/messages' },
      { icon: <BarChart2 size={20} />, label: 'Statistiques', path: '#' },
      { icon: <FileText size={20} />, label: 'Paiements & Factures', path: '/paiements' },
      { icon: <Settings size={20} />, label: 'Paramètres', path: '#' },
    ];
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand" style={{ textDecoration: 'none' }}>
          <NestoraLogo size="medium" />
        </Link>

        <nav className="nav-menu">
          {menuItems.map((item, index) => (
            item.label === 'Profil' ? (
              <button 
                key={index} 
                className={`nav-item ${showProfileModal ? 'active' : ''}`}
                onClick={() => setShowProfileModal(true)} 
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ) : (
              <Link key={index} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </Link>
            )
          ))}
          <button className="nav-item text-danger" onClick={logout} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', fontFamily: 'inherit' }}>
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
          <Link to="/boost" className="btn btn-primary btn-block">Voir les offres</Link>
        </div>

        <div className="sidebar-widget" style={{ marginBottom: '2rem' }}>
          <div className="sidebar-widget-title">
            <Headset size={18} />
            Besoin d'aide ?
          </div>
          <div className="sidebar-widget-text">
            Notre équipe est disponible 7j/7
          </div>
          <button className="btn btn-outline-light btn-block">Contacter le support</button>
        </div>
      </aside>

      <div className="main-content">
        <header className="header">
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '0.5rem 1rem', width: '500px' }}>
            <SearchIcon size={18} color="#94a3b8" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Rechercher un bien, une ville, un quartier..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', padding: '0 0.5rem' }}
            />
            <div style={{ height: '24px', width: '1px', backgroundColor: '#cbd5e1', margin: '0 0.5rem' }}></div>
            <MapPin size={18} color="#94a3b8" />
            <select style={{ border: 'none', background: 'transparent', outline: 'none', color: '#64748b', fontWeight: 500, cursor: 'pointer', paddingLeft: '0.25rem' }}>
              <option>Toutes les villes</option>
            </select>
          </div>
          <div className="header-actions">
            <div className="header-action-icon">
              <Bell size={22} />
              <div className="notification-badge">5</div>
            </div>
            <div className="user-profile">
              <img src={user?.profile?.avatar || "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&q=80"} alt="User" className="user-avatar" />
              <div className="user-info">
                <span className="user-name">{user?.profile?.firstName || user?.agency?.name?.split(' ')[0] || 'Utilisateur'}</span>
                <span className="user-role">{role === 'OWNER' ? 'Propriétaire' : role === 'AGENCY' ? 'Agence' : 'Chercheur'}</span>
              </div>
            </div>
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
    </div>
  );
}
