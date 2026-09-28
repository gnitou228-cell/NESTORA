import { Building, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../home.css';

export default function AgenciesPage() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Annuaire des Agences</h1>
        <p className="hero-subtitle">Trouvez des professionnels de confiance pour vous accompagner.</p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 5%' }}>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <Building size={64} color="var(--color-primary)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h2 style={{ color: 'var(--color-text-dark)', marginBottom: '1rem', fontSize: '1.8rem' }}>Recherchez une agence partenaire</h2>
          <p style={{ color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Les agences immobilières certifiées sur NESTORA sont là pour faciliter vos démarches, que ce soit pour louer, acheter ou mettre en gestion votre bien.
          </p>
          <div className="search-box" style={{ maxWidth: '600px', margin: '0 auto 2rem', padding: '0.5rem', background: 'var(--color-secondary)', borderRadius: '50px', display: 'flex', alignItems: 'center' }}>
            <MapPin color="var(--color-text-light)" style={{ marginLeft: '1rem' }} />
            <input 
              type="text" 
              placeholder="Saisissez une ville ou une région..." 
              style={{ border: 'none', outline: 'none', padding: '1rem', width: '100%', borderRadius: '50px', fontSize: '1rem', background: 'transparent' }}
            />
            <button className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 2rem' }}>Rechercher</button>
          </div>
          <p style={{ color: 'var(--color-text-light)' }}>Vous êtes un professionnel ? <Link to="/partenaire" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Devenez agence partenaire</Link></p>
        </div>
      </div>
    </div>
  );
}
