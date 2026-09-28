import { Link } from 'react-router-dom';
import { Search, User, Search as SearchIcon, Home, Edit3, Building, CreditCard, Calendar, MessageSquare, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import '../home.css';

const HELP_CATEGORIES = [
  { id: 'account', title: 'Mon compte', icon: <User size={32} />, desc: 'Gérer vos informations, mot de passe et notifications.' },
  { id: 'search', title: 'Trouver un logement', icon: <SearchIcon size={32} />, desc: 'Astuces de recherche, alertes et favoris.' },
  { id: 'publish', title: 'Publier une annonce', icon: <Home size={32} />, desc: 'Création d\'annonce, photos et description.' },
  { id: 'manage', title: 'Gérer mes annonces', icon: <Edit3 size={32} />, desc: 'Modification, suppression et boost de visibilité.' },
  { id: 'agency', title: 'Agence', icon: <Building size={32} />, desc: 'Comptes pro, gestion d\'équipe et facturation.' },
  { id: 'payments', title: 'Paiements', icon: <CreditCard size={32} />, desc: 'Moyens de paiement, factures et abonnements.' },
  { id: 'visits', title: 'Visites', icon: <Calendar size={32} />, desc: 'Organisation des visites et bonnes pratiques.' },
  { id: 'messages', title: 'Messages', icon: <MessageSquare size={32} />, desc: 'Utilisation de la messagerie interne.' },
  { id: 'verification', title: 'Vérification', icon: <ShieldCheck size={32} />, desc: 'Badges de confiance et documents requis.' },
  { id: 'security', title: 'Sécurité', icon: <Lock size={32} />, desc: 'Signaler un problème et éviter les fraudes.' },
];

export default function HelpCenter() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem' }}>
      <section className="hero-section" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title">Comment pouvons-nous vous aider ?</h1>
        
        <div className="search-box" style={{ maxWidth: '600px', margin: '2rem auto 0', padding: '0.5rem', background: 'white', borderRadius: '50px', display: 'flex', alignItems: 'center', width: '100%' }}>
          <Search color="var(--color-text-light)" style={{ marginLeft: '1rem' }} />
          <input 
            type="text" 
            placeholder="Rechercher des articles (ex: mot de passe oublié)..." 
            style={{ border: 'none', outline: 'none', padding: '1rem', width: '100%', borderRadius: '50px', fontSize: '1rem' }}
          />
          <button className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.75rem 1.5rem' }}>Chercher</button>
        </div>
      </section>

      <section className="section" style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '-4rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {HELP_CATEGORIES.map((cat) => (
            <Link to={`/faq?category=${cat.id}`} key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', padding: '2rem' }}>
              <div style={{ color: 'var(--color-primary)' }}>{cat.icon}</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-text-dark)', margin: 0 }}>{cat.title}</h3>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', flex: 1 }}>{cat.desc}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem', marginTop: 'auto' }}>
                Voir les articles <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-dark text-center mt-5" style={{ margin: '0 5%', borderRadius: 'var(--border-radius)' }}>
        <h2 className="section-title">Vous ne trouvez pas la réponse ?</h2>
        <p className="text-light" style={{ marginBottom: '2rem' }}>Notre équipe d'assistance est disponible pour répondre à toutes vos questions.</p>
        <Link to="/nous-contacter" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)' }}>Contactez-nous</Link>
      </section>
    </div>
  );
}
