import { Search, MapPin, Filter, Home } from 'lucide-react';
import '../home.css';

export default function SearchPage() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Rechercher un bien</h1>
        <p className="hero-subtitle">Trouvez la perle rare parmi des milliers d'annonces vérifiées.</p>
        
        <div className="search-box" style={{ maxWidth: '800px', margin: '2rem auto 0', padding: '0.5rem', background: 'white', borderRadius: '50px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px', padding: '0 1rem' }}>
            <MapPin color="var(--color-text-light)" size={20} />
            <input type="text" placeholder="Ville, quartier, région..." style={{ border: 'none', outline: 'none', padding: '1rem 0.5rem', width: '100%', fontSize: '1rem' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', borderLeft: '1px solid var(--color-border)', minWidth: '150px' }}>
            <Home color="var(--color-text-light)" size={20} />
            <select style={{ border: 'none', outline: 'none', padding: '1rem 0.5rem', width: '100%', fontSize: '1rem', background: 'transparent' }}>
              <option value="">Type de bien</option>
              <option value="appartement">Appartement</option>
              <option value="maison">Maison / Villa</option>
              <option value="terrain">Terrain</option>
              <option value="bureau">Bureau / Commerce</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 2rem', marginLeft: 'auto' }}>
            <Search size={20} />
          </button>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 5%', display: 'flex', gap: '2rem' }}>
        {/* Sidebar Filtres */}
        <div className="card" style={{ width: '300px', padding: '1.5rem', height: 'fit-content', display: 'none' }}>
          {/* Dans une vraie implémentation, on afficherait ceci sur desktop */}
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.2rem' }}><Filter size={20} /> Filtres avancés</h3>
          {/* ... Filtres ... */}
        </div>

        {/* Résultats (Mock) */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Dernières annonces</h2>
            <select style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <option>Les plus récentes</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
            </select>
          </div>

          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
            <Search size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>Utilisez la barre de recherche</h3>
            <p style={{ color: 'var(--color-text-light)' }}>Saisissez une ville ou un type de bien pour commencer à explorer notre catalogue.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
