import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import NestoraLogo from './brand/NestoraLogo';
import { useAuth } from '../context/AuthContext';
import '../home.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`public-navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <NestoraLogo size="small" />
        </Link>
        
        <div className="nav-links">
          <Link to="/">Accueil</Link>
          <Link to="/recherche">Rechercher</Link>
          <Link to="/annonces">Annonces</Link>
          <Link to="/agences">Agences</Link>
          <Link to="/comment-ca-marche">Comment ça marche</Link>
          <Link to="/tarifs">Tarifs</Link>
        </div>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/dashboard" className="nav-login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img 
                  src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user.profile?.firstName || 'User'}`} 
                  alt="Avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }} 
                />
                <span style={{ fontWeight: 600 }}>Mon espace</span>
              </Link>
              <button 
                onClick={logout} 
                className="desktop-only"
                title="Se déconnecter"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#dc2626', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/connexion" className="nav-login">Connexion</Link>
          )}
          {!user && <Link to="/inscription" className="btn btn-outline" style={{ display: 'none' }}>Créer un compte</Link>}
          <Link to="/publier" className="btn btn-primary">Publier une annonce</Link>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
        <Link to="/recherche" onClick={() => setMobileMenuOpen(false)}>Rechercher</Link>
        <Link to="/annonces" onClick={() => setMobileMenuOpen(false)}>Annonces</Link>
        <Link to="/agences" onClick={() => setMobileMenuOpen(false)}>Agences</Link>
        <Link to="/comment-ca-marche" onClick={() => setMobileMenuOpen(false)}>Comment ça marche</Link>
        <Link to="/tarifs" onClick={() => setMobileMenuOpen(false)}>Tarifs</Link>
        <hr className="divider" />
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
            <Link 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--color-primary)' }}
            >
              <img 
                src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user.profile?.firstName || 'User'}`} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} 
              />
              <span>Mon espace ({user.profile?.firstName || 'Mon Compte'})</span>
            </Link>
            <button 
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#dc2626', fontWeight: 600, padding: '0.6rem 0', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '1rem', fontFamily: 'inherit' }}
            >
              <LogOut size={18} />
              <span>Se déconnecter</span>
            </button>
          </div>
        ) : (
          <>
            <Link to="/connexion" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
            <Link to="/inscription" onClick={() => setMobileMenuOpen(false)}>Créer un compte</Link>
          </>
        )}
        <Link to="/publier" className="btn btn-primary text-center mt-2" onClick={() => setMobileMenuOpen(false)}>Publier une annonce</Link>
      </div>
    </>
  );
}
