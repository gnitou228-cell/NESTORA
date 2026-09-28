import { Info } from 'lucide-react';
import '../home.css';

export default function CookiePolicy() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Politique relative aux cookies</h1>
        <p className="hero-subtitle">Transparence sur l'utilisation des traceurs.</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '-2rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <div className="card" style={{ padding: '3rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <Info size={32} color="var(--color-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>Utilisation des Cookies</h2>
          </div>

          <div style={{ lineHeight: 1.7, color: 'var(--color-text-light)' }}>
            <p>
              Lors de votre navigation sur la Plateforme NESTORA, des cookies ou traceurs sont susceptibles d'être déposés sur votre terminal (ordinateur, tablette, smartphone).
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>Qu'est-ce qu'un cookie ?</h3>
            <p>
              Un cookie est un petit fichier texte enregistré par le navigateur de votre terminal lors de la consultation d'un site web. Il permet de conserver des données utilisateur afin de faciliter la navigation et d'activer certaines fonctionnalités.
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>Cookies nécessaires</h3>
            <p>
              Ces cookies sont indispensables au bon fonctionnement de la plateforme (sauvegarde de session, mémorisation de vos choix en matière de consentement, sécurité). Ils ne peuvent pas être désactivés.
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>Cookies d'analyse</h3>
            <p>
              Ces cookies nous permettent de mesurer l'audience de la plateforme (nombre de visites, pages les plus consultées) afin d'améliorer nos services. Vous pouvez choisir de les désactiver via notre bandeau de consentement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
