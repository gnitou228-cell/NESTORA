import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import NestoraLogo from './brand/NestoraLogo';
import '../index.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="global-footer">
      <div className="footer-top">
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Recevez nos nouveautés et conseils immobiliers</h3>
            <p className="newsletter-desc">Inscrivez-vous à notre newsletter pour ne rien manquer.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Votre adresse email" className="newsletter-input" required />
            <button type="submit" className="newsletter-btn">
              <span>S'inscrire</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      
      <div className="footer-main">
        <div className="footer-grid">
          {/* Colonne 1 : NESTORA */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand" style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <NestoraLogo size="large" />
            </Link>
            <p className="footer-slogan">Trouvez votre prochain chez-vous.</p>
            <p className="footer-about">
              NESTORA facilite la mise en relation entre personnes à la recherche d’un logement, propriétaires et agences immobilières.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook">F</a>
              <a href="#" className="social-link" aria-label="Twitter">X</a>
              <a href="#" className="social-link" aria-label="Instagram">In</a>
              <a href="#" className="social-link" aria-label="LinkedIn">Li</a>
            </div>
          </div>

          {/* Colonne 2 : NAVIGATION */}
          <div className="footer-col">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/recherche">Rechercher</Link></li>
              <li><Link to="/annonces">Annonces</Link></li>
              <li><Link to="/agences">Agences</Link></li>
              <li><Link to="/tarifs">Tarifs</Link></li>
              <li><Link to="/comment-ca-marche">Comment ça marche</Link></li>
              <li><Link to="/publier">Publier une annonce</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : SUPPORT */}
          <div className="footer-col">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/centre-d-aide">Centre d’aide</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/nous-contacter">Nous contacter</Link></li>
              <li><Link to="/signaler-une-annonce">Signaler une annonce</Link></li>
              <li><Link to="/securite-et-confiance">Sécurité et confiance</Link></li>
              <li><Link to="/comment-ca-marche">Comment ça marche</Link></li>
            </ul>
          </div>

          {/* Colonne 4 : ENTREPRISE */}
          <div className="footer-col">
            <h4 className="footer-title">Entreprise</h4>
            <ul className="footer-links">
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/valeurs">Nos valeurs</Link></li>
              <li><Link to="/partenaire">Devenir partenaire</Link></li>
              <li><Link to="/conditions-generales">Conditions générales</Link></li>
              <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
              <li><Link to="/cookies">Politique relative aux cookies</Link></li>
              <li><Link to="/mentions-legales">Mentions légales</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">© {currentYear} NESTORA. Tous droits réservés.</p>
          <div className="footer-legal-links">
            <Link to="/confidentialite">Confidentialité</Link>
            <span className="separator">•</span>
            <Link to="/conditions-generales">Conditions</Link>
            <span className="separator">•</span>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
