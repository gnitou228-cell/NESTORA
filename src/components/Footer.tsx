import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
    <path d="m10 15 5-3-5-3z"></path>
  </svg>
);

const TiktokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.13 4.49-3.02 5.92-1.92 1.45-4.49 1.83-6.73 1.1-2.26-.74-4.2-2.48-4.9-4.73-.72-2.31-.22-4.93 1.25-6.85 1.5-1.96 3.99-2.93 6.43-2.61.02 1.4.01 2.8.01 4.2-1.15-.22-2.39-.12-3.44.42-1.07.55-1.89 1.53-2.22 2.69-.32 1.13-.1 2.37.56 3.32.65.94 1.7 1.55 2.83 1.7 1.15.15 2.33-.24 3.19-.97.87-.75 1.4-1.83 1.46-2.98.05-5.63.03-11.26.04-16.89z" />
  </svg>
);
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
              NESTORA IMMO facilite la mise en relation entre personnes à la recherche d’un logement, propriétaires et agences immobilières.
            </p>
            <div className="footer-socials" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="https://web.facebook.com/profile.php?id=61590474261365" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color 0.2s' }}>
                <FacebookIcon size={24} />
              </a>
              <a href="https://www.tiktok.com/@nestoraimmo" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color 0.2s' }}>
                <TiktokIcon size={24} />
              </a>
              <a href="https://youtube.com/@jeffmaxwell-t2l?si=WhBtRDtyrCOZFPy6" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="YouTube" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color 0.2s' }}>
                <YoutubeIcon size={26} />
              </a>
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
              <li><Link to="/telecharger">Télécharger l'application</Link></li>
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
          <p className="copyright">© {currentYear} NESTORA IMMO. Tous droits réservés.</p>
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
