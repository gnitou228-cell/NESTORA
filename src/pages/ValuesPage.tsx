import { Heart, Shield, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../home.css';

export default function ValuesPage() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.8rem' }}>Nos Valeurs</h1>
        <p className="hero-subtitle">Ce qui nous anime chaque jour pour transformer l'immobilier.</p>
      </section>

      <section className="section bg-secondary" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s' }}>
            <Shield size={48} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Confiance</h3>
            <p className="text-light" style={{ lineHeight: 1.6 }}>Nous bâtissons des relations durables fondées sur l'intégrité, la transparence et la vérification rigoureuse des informations.</p>
          </div>

          <div className="card" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s' }}>
            <Zap size={48} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Simplicité</h3>
            <p className="text-light" style={{ lineHeight: 1.6 }}>L'immobilier est complexe. Notre mission est de rendre chaque étape fluide, intuitive et accessible à tous, sans jargon inutile.</p>
          </div>

          <div className="card" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s' }}>
            <Users size={48} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Communauté</h3>
            <p className="text-light" style={{ lineHeight: 1.6 }}>Nous croyons en la force du collectif. Chercheurs, propriétaires et professionnels collaborent pour créer un marché plus juste.</p>
          </div>

          <div className="card" style={{ padding: '3rem', textAlign: 'center', transition: 'transform 0.3s' }}>
            <Heart size={48} color="var(--color-accent)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Engagement</h3>
            <p className="text-light" style={{ lineHeight: 1.6 }}>Nous sommes déterminés à innover en permanence pour vous offrir la meilleure expérience et vous aider à trouver votre chez-vous.</p>
          </div>

        </div>
      </section>

      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title">Rejoignez l'aventure NESTORA</h2>
        <p className="text-light" style={{ maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>Partagez-vous nos valeurs ? Créez votre compte gratuitement et découvrez une nouvelle façon de vivre l'immobilier.</p>
        <Link to="/inscription" className="btn btn-primary btn-lg">Créer un compte</Link>
      </section>
    </div>
  );
}
