import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Home, Building, MapPin, CheckCircle, 
  Bed, Bath, Move, Heart, ChevronDown
} from 'lucide-react';
import '../home.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('louer');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPropertyType, setSearchPropertyType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  
  // Fake FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const categories = [
    { name: 'Maisons', icon: <Home /> },
    { name: 'Appartements', icon: <Building /> },
    { name: 'Villas', icon: <Home /> },
    { name: 'Studios', icon: <Building /> },
    { name: 'Terrains', icon: <MapPin /> },
    { name: 'Bureaux', icon: <BriefcaseIcon /> },
  ];

  const featuredProperties = [
    { id: 1, title: 'Villa moderne avec piscine', price: '150 000 FCFA/mois', city: 'Ouagadougou', dist: 'Ouaga 2000', bed: 4, bath: 3, sqft: 350, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80', verified: true },
    { id: 2, title: 'Appartement de standing', price: '45 000 000 FCFA', city: 'Abidjan', dist: 'Cocody', bed: 3, bath: 2, sqft: 120, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80', premium: true },
    { id: 3, title: 'Maison familiale', price: '85 000 FCFA/mois', city: 'Bobo-Dioulasso', dist: 'Belleville', bed: 3, bath: 1, sqft: 200, img: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=600&q=80', verified: true },
  ];

  const cities = [
    { name: 'Ouagadougou', count: '1250 biens', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80' },
    { name: 'Abidjan', count: '3420 biens', img: 'https://images.unsplash.com/photo-1548625361-b4bb68804702?auto=format&fit=crop&w=600&q=80' },
    { name: 'Dakar', count: '890 biens', img: 'https://images.unsplash.com/photo-1580974582391-a6649c82a85f?auto=format&fit=crop&w=600&q=80' },
    { name: 'Cotonou', count: '450 biens', img: 'https://images.unsplash.com/photo-1623869263155-22d7156942ce?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="landing-page">


      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">Trouvez votre prochain chez-vous.</h1>
        <p className="hero-subtitle">Recherchez, comparez et trouvez le logement qui correspond vraiment à votre vie.</p>
        
        <div className="search-box-premium">
          <div className="search-tabs-premium">
            <button className={`search-tab-premium ${searchType === 'louer' ? 'active' : ''}`} onClick={() => setSearchType('louer')}>À louer</button>
            <button className={`search-tab-premium ${searchType === 'vendre' ? 'active' : ''}`} onClick={() => setSearchType('vendre')}>À vendre</button>
          </div>
          
          <form className="search-form-premium" onSubmit={(e) => { 
            e.preventDefault(); 
            const params = new URLSearchParams();
            params.set('transactionType', searchType === 'louer' ? 'RENT' : 'SALE');
            if (searchLocation) params.set('q', searchLocation);
            if (searchPropertyType) params.set('propertyType', searchPropertyType);
            if (searchBudget) params.set('maxPrice', searchBudget);
            navigate(`/recherche?${params.toString()}`); 
          }}>
            <div className="search-field-premium">
              <label>Localisation</label>
              <input type="text" placeholder="Ex: Ouaga 2000, Cocody..." className="search-input-premium" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
            </div>
            
            <div className="search-divider"></div>
            
            <div className="search-field-premium">
              <label>Type de bien</label>
              <select className="search-input-premium" value={searchPropertyType} onChange={(e) => setSearchPropertyType(e.target.value)}>
                <option value="">Tous les types</option>
                <option value="APARTMENT">Appartement</option>
                <option value="HOUSE">Maison</option>
                <option value="VILLA">Villa</option>
                <option value="STUDIO">Studio</option>
                <option value="LAND">Terrain</option>
                <option value="OFFICE">Bureau</option>
              </select>
            </div>

            <div className="search-divider"></div>

            <div className="search-field-premium">
              <label>Budget max.</label>
              <input type="number" placeholder="Ex: 150000" className="search-input-premium" value={searchBudget} onChange={(e) => setSearchBudget(e.target.value)} />
            </div>

            <button type="submit" className="search-btn-premium">
              <Search size={24} /> <span>Rechercher</span>
            </button>
          </form>
        </div>

        <div className="trust-badges">
          <div className="trust-badge"><CheckCircle size={20} color="#C9A227" /> Annonces vérifiées</div>
          <div className="trust-badge"><CheckCircle size={20} color="#C9A227" /> Propriétaires & Agences</div>
          <div className="trust-badge"><CheckCircle size={20} color="#C9A227" /> Recherche simple</div>
          <div className="trust-badge"><CheckCircle size={20} color="#C9A227" /> Visites organisées</div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-secondary">
        <h2 className="section-title">Trouvez le bien qui vous correspond</h2>
        <div className="categories-grid mt-4">
          {categories.map((cat, idx) => (
            <Link to="/recherche" className="category-card" key={idx}>
              <div className="category-icon">{cat.icon}</div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="section">
        <div className="d-flex justify-between align-center mb-4">
          <h2 className="section-title" style={{ margin: 0 }}>Découvrez les biens à la une</h2>
          <Link to="/annonces" className="btn btn-outline">Voir toutes les annonces</Link>
        </div>
        
        <div className="properties-grid mt-4">
          {featuredProperties.map(prop => (
            <div className="property-card" key={prop.id}>
              <div className="property-image-wrapper">
                <img src={prop.img} alt={prop.title} className="property-image" loading="lazy" />
                <div className="property-badges">
                  {prop.verified && <span className="badge-verified">Vérifié</span>}
                  {prop.premium && <span className="badge-premium">Premium</span>}
                </div>
                <button className="property-fav"><Heart size={20} /></button>
              </div>
              <div className="property-content">
                <div className="property-price">{prop.price}</div>
                <h3 className="property-title">{prop.title}</h3>
                <div className="property-location"><MapPin size={16} /> {prop.dist}, {prop.city}</div>
                <div className="property-features">
                  <div className="property-feature"><Bed size={16} /> {prop.bed}</div>
                  <div className="property-feature"><Bath size={16} /> {prop.bath}</div>
                  <div className="property-feature"><Move size={16} /> {prop.sqft} m²</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Housing Requests (Seekers) */}
      <section className="section seekers-section">
        <div className="d-flex" style={{ gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Vous cherchez un logement ? Publiez votre demande.</h2>
            <p className="text-light" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Décrivez le logement que vous recherchez et laissez les propriétaires et agences vous proposer des biens correspondants avant même qu'ils ne soient publiés.
            </p>
            <Link to="/publier" className="btn btn-primary btn-lg">Publier ma recherche</Link>
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="seeker-card">
              <div className="seeker-quote">
                « Je recherche un appartement 2 chambres à Ouagadougou (Zone du Bois ou ZAD) avec un budget max de 150 000 FCFA. »
              </div>
              <div className="d-flex align-center" style={{ gap: '1rem' }}>
                <div className="testimonial-avatar" style={{ background: '#0B1F3A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</div>
                <div>
                  <div className="testimonial-name">Sarah O.</div>
                  <div className="testimonial-role">Chercheur Vérifié</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="section">
        <h2 className="section-title">Explorez les logements près de chez vous</h2>
        <div className="cities-grid mt-4">
          {cities.map((city, idx) => (
            <Link to="/recherche" className="city-card" key={idx}>
              <img src={city.img} alt={city.name} loading="lazy" />
              <div className="city-overlay">
                <div>
                  <h3 className="city-name">{city.name}</h3>
                  <div className="city-count">{city.count}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="section bg-secondary">
        <h2 className="section-title">Trouvez votre logement en quelques étapes</h2>
        <div className="steps-container mt-5">
          <div className="step">
            <div className="step-num">01</div>
            <h3 className="step-title">Recherchez</h3>
            <p className="text-light">Utilisez nos filtres pour trouver les biens adaptés à vos critères.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3 className="step-title">Échangez</h3>
            <p className="text-light">Contactez directement le propriétaire ou l'agence de manière sécurisée.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3 className="step-title">Visitez</h3>
            <p className="text-light">Organisez une visite et trouvez votre prochain chez-vous.</p>
          </div>
        </div>
      </section>

      {/* For Owners (Dark) */}
      <section className="section section-dark">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title">Vous avez un bien à louer ou à vendre ?</h2>
          <p className="section-subtitle">Publiez votre annonce et donnez-lui la visibilité qu'elle mérite auprès de milliers de chercheurs actifs.</p>
          <div className="d-flex justify-center flex-wrap" style={{ gap: '1.5rem', marginTop: '2rem' }}>
            <Link to="/publier" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)', color: 'white' }}>Publier mon bien</Link>
            <Link to="/tarifs" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>Découvrir les tarifs</Link>
          </div>
        </div>
      </section>

      {/* Agencies */}
      <section className="section">
        <div className="d-flex" style={{ gap: '4rem', alignItems: 'center', flexWrap: 'wrap-reverse' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" alt="Agence immobilière" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} loading="lazy" />
          </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Développez votre activité immobilière avec NESTORA</h2>
            <ul className="pricing-features mb-4 mt-3">
              <li><CheckCircle className="text-success" size={20} /> Gestion complète du portefeuille immobilier</li>
              <li><CheckCircle className="text-success" size={20} /> Ajout et gestion de vos agents</li>
              <li><CheckCircle className="text-success" size={20} /> Suivi des prospects et visites</li>
              <li><CheckCircle className="text-success" size={20} /> Statistiques avancées et abonnements professionnels</li>
            </ul>
            <Link to="/inscription" className="btn btn-primary btn-lg">Créer mon espace agence</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-secondary">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-val">+1 000</div>
            <div className="stat-label">Biens publiés</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">+500</div>
            <div className="stat-label">Propriétaires</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">+100</div>
            <div className="stat-label">Agences</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">+10</div>
            <div className="stat-label">Villes couvertes</div>
          </div>
        </div>
        <div className="text-center mt-3 text-light text-sm">*Données de démonstration</div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <h2 className="section-title">Une plateforme pensée pour vous</h2>
        <div className="testimonials-grid mt-4">
          <div className="testimonial-card">
            <div className="testimonial-text">"Grâce à Nestora, j'ai trouvé ma villa à Abidjan en moins de 48h. La possibilité de publier sa recherche est un game-changer !"</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <p className="testimonial-name">Jean M.</p>
                <p className="testimonial-role">Locataire (Démo)</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">"Le tableau de bord pour propriétaire est extrêmement complet. Je gère mes locataires et mes annonces très facilement."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <p className="testimonial-name">Amina K.</p>
                <p className="testimonial-role">Propriétaire (Démo)</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-text">"L'abonnement Agence nous a permis de digitaliser tout notre portefeuille et d'augmenter nos ventes de 40%."</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar"></div>
              <div>
                <p className="testimonial-name">Agence Horizon</p>
                <p className="testimonial-role">Professionnel (Démo)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-secondary">
        <h2 className="section-title">Questions fréquentes</h2>
        <div className="faq-container mt-4">
          {[
            { q: "L'inscription est-elle gratuite ?", a: "Oui, la création d'un compte sur NESTORA est 100% gratuite pour tous les utilisateurs." },
            { q: "Comment publier une annonce ?", a: "Il suffit de créer un compte Propriétaire ou Agence, puis de cliquer sur 'Publier une annonce' en haut à droite." },
            { q: "Combien coûte une annonce ?", a: "Les tarifs varient selon la durée et votre statut. Consultez notre page Tarifs pour voir le détail." },
            { q: "Qu'est-ce qu'un Boost ?", a: "Un Boost est une option payante qui permet de mettre votre annonce en tête des résultats de recherche pendant une durée définie (3 à 30 jours)." },
            { q: "Quels moyens de paiement sont disponibles ?", a: "Nous acceptons les paiements par Mobile Money (Orange, MTN, Moov, Wave) et par carte bancaire." }
          ].map((faq, idx) => (
            <div className={`faq-item ${activeFaq === idx ? 'active' : ''}`} key={idx} onClick={() => toggleFaq(idx)}>
              <div className="faq-question">{faq.q} <ChevronDown size={20} style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.3s' }} /></div>
              <div className="faq-answer">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section-dark text-center" style={{ padding: '8rem 5%' }}>
        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Votre prochain chez-vous commence ici.</h2>
        <div className="d-flex justify-center flex-wrap" style={{ gap: '1.5rem' }}>
          <Link to="/recherche" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)' }}>Rechercher un logement</Link>
          <Link to="/publier" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>Publier une annonce</Link>
        </div>
      </section>

    </div>
  );
}

// Helper icon
function BriefcaseIcon(props: any) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}
