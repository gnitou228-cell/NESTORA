import { Home, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../home.css';

export default function ListingsPage() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Toutes les annonces</h1>
        <p className="hero-subtitle">Parcourez notre catalogue complet de biens immobiliers.</p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <Home size={64} color="var(--color-primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h2 style={{ color: 'var(--color-text-dark)', marginBottom: '1rem', fontSize: '1.8rem' }}>Découvrez nos offres</h2>
          <p style={{ color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Que vous cherchiez un appartement en centre-ville, une villa familiale ou un terrain pour construire, NESTORA a ce qu'il vous faut.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/recherche" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} /> Lancer une recherche
            </Link>
            <Link to="/publier" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Publier un bien
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
