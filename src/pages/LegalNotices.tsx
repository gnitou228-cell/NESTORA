import { FileText } from 'lucide-react';
import '../home.css';

export default function LegalNotices() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Mentions Légales</h1>
        <p className="hero-subtitle">Informations légales et juridiques de l'entreprise.</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '-2rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <div className="card" style={{ padding: '3rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <FileText size={32} color="var(--color-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>Identification de l'éditeur</h2>
          </div>

          <div style={{ lineHeight: 1.7, color: 'var(--color-text-light)' }}>
            <div className="badge-warning" style={{ padding: '1rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '2rem' }}>
              <p style={{ margin: 0, color: 'var(--color-text-dark)' }}><em>Informations à compléter avant la mise en production :</em></p>
            </div>

            <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>Éditeur du site</h3>
            <p>
              <strong>Raison sociale :</strong> [NOM DE L'ENTREPRISE]<br />
              <strong>Forme juridique :</strong> [FORME JURIDIQUE]<br />
              <strong>Capital social :</strong> [MONTANT] €<br />
              <strong>Siège social :</strong> [ADRESSE COMPLÈTE]<br />
              <strong>Numéro d'immatriculation :</strong> [SIRET OU ÉQUIVALENT]<br />
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '0.5rem' }}>Directeur de la publication</h3>
            <p>
              [NOM DU DIRECTEUR DE LA PUBLICATION]
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '0.5rem' }}>Hébergement</h3>
            <p>
              Ce site est hébergé par :<br />
              <strong>Nom de l'hébergeur :</strong> [NOM HÉBERGEUR]<br />
              <strong>Adresse :</strong> [ADRESSE HÉBERGEUR]<br />
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '0.5rem' }}>Propriété intellectuelle</h3>
            <p>
              Tous les éléments accessibles sur le site (textes, images, graphismes, logo, icônes, logiciels, bases de données) restent la propriété exclusive de l'éditeur, en ce qui concerne les droits de propriété intellectuelle ou les droits d'usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
