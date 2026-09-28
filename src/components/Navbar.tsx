import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import NestoraLogo from './brand/NestoraLogo';
import '../home.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`public-navbar ${scrolled ? 'scrolled' : ''}`} style={!scrolled ? { backgroundColor: 'var(--color-primary)' } : {}}>
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
          <Link to="/connexion" className="nav-login">Connexion</Link>
          <Link to="/inscription" className="btn btn-outline" style={{ display: 'none' }}>Créer un compte</Link>
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
        <Link to="/connexion" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
        <Link to="/inscription" onClick={() => setMobileMenuOpen(false)}>Créer un compte</Link>
        <Link to="/publier" className="btn btn-primary text-center mt-2" onClick={() => setMobileMenuOpen(false)}>Publier une annonce</Link>
      </div>
    </>
  );
}
