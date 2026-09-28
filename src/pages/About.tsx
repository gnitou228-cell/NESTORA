import { Link } from 'react-router-dom';
import { Shield, Eye, Zap, Heart } from 'lucide-react';
import '../home.css';

export default function About() {
  return (
    <div className="landing-page">
      <section className="hero-section" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title">NESTORA, une nouvelle façon de trouver son chez-soi</h1>
        <p className="hero-subtitle">Votre plateforme de confiance pour l'immobilier moderne, transparent et accessible.</p>
      </section>

      <section className="section bg-secondary">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title text-center">Qui sommes-nous ?</h2>
          <p className="text-light" style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            NESTORA est une plateforme innovante qui facilite la mise en relation entre les personnes à la recherche d’un logement, les propriétaires et les agences immobilières. Nous croyons que trouver un toit ne devrait pas être une source de stress, mais une étape excitante de la vie.
          </p>

          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Le problème du marché actuel</h3>
          <p className="text-light" style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Le marché immobilier est souvent perçu comme opaque, complexe et parfois peu sécurisé. Entre les fausses annonces, les frais cachés et la difficulté à joindre les bons interlocuteurs, la recherche d'un logement ou d'un locataire peut s'avérer être un véritable parcours du combattant.
          </p>

          <div className="d-flex" style={{ gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Notre Mission</h3>
              <p className="text-light" style={{ lineHeight: 1.8 }}>
                Simplifier et sécuriser les transactions immobilières en offrant une plateforme intuitive, transparente et accessible à tous, où chaque utilisateur peut trouver ou proposer un bien en toute confiance.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Notre Vision</h3>
              <p className="text-light" style={{ lineHeight: 1.8 }}>
                Devenir la référence incontournable de l'immobilier, en créant un écosystème où la technologie sert l'humain pour fluidifier l'accès au logement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title text-center">Nos Valeurs</h2>
        <div className="stats-grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <Shield size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Confiance</h3>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>Des profils et annonces vérifiés pour des échanges sereins.</p>
          </div>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <Eye size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Transparence</h3>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>Pas de frais cachés, toutes les informations sont claires.</p>
          </div>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <Zap size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Simplicité</h3>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>Une interface pensée pour une utilisation fluide et rapide.</p>
          </div>
          <div className="stat-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <Heart size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Accessibilité</h3>
            <p className="text-light" style={{ fontSize: '0.9rem' }}>Des solutions adaptées à tous les budgets et tous les besoins.</p>
          </div>
        </div>
      </section>

      <section className="section bg-secondary">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title text-center">L'écosystème NESTORA</h2>
          
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Pour les particuliers</h3>
            <p className="text-light" style={{ marginBottom: '1.5rem' }}>Cherchez, comparez et contactez directement les propriétaires ou agences. Vous pouvez également publier une demande de logement si vous ne trouvez pas votre bonheur.</p>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Pour les propriétaires</h3>
            <p className="text-light" style={{ marginBottom: '1.5rem' }}>Publiez vos annonces, gérez vos locataires et recevez des demandes qualifiées. Vous gardez le contrôle total sur vos biens.</p>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Pour les agences</h3>
            <p className="text-light" style={{ marginBottom: '1.5rem' }}>Un espace professionnel dédié pour digitaliser votre portefeuille, gérer vos agents et suivre vos performances pour développer votre activité.</p>
          </div>
        </div>
      </section>

      <section className="section section-dark text-center">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title">Notre ambition</h2>
          <p className="text-light" style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Nous nous engageons à maintenir une plateforme de haute qualité. Chaque annonce signalée est examinée, et nous mettons en place des outils technologiques pour assurer la sécurité de tous nos membres. Notre ambition est de redéfinir les standards de l'immobilier.
          </p>
          <div className="d-flex justify-center gap-2 flex-wrap mt-4">
            <Link to="/recherche" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)' }}>Rechercher un logement</Link>
            <Link to="/publier" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>Publier une annonce</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
