import { Briefcase, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../home.css';

export default function PartnerPage() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(201,162,39,0.2)', color: 'var(--color-accent)', padding: '0.5rem 1rem', borderRadius: '50px', margin: '0 auto 1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
          <Briefcase size={16} /> B2B & Professionnels
        </div>
        <h1 className="hero-title" style={{ fontSize: '2.8rem' }}>Devenir Partenaire NESTORA</h1>
        <p className="hero-subtitle" style={{ maxWidth: '700px', margin: '0 auto' }}>
          Développez votre activité immobilière grâce à nos outils digitaux avancés et à notre vaste réseau d'utilisateurs.
        </p>
      </section>

      <section className="section bg-secondary" style={{ paddingTop: '4rem', paddingBottom: '4rem', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Pourquoi nous rejoindre ?</h2>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={32} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Visibilité décuplée</h3>
                <p className="text-light">Atteignez des milliers de chercheurs qualifiés actifs chaque jour sur notre plateforme.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <Users size={32} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Outils de gestion</h3>
                <p className="text-light">Un tableau de bord complet pour gérer vos agents, vos annonces et suivre vos statistiques de conversion.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <CheckCircle size={32} color="var(--color-accent)" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Image de marque</h3>
                <p className="text-light">Bénéficiez du badge "Agence Vérifiée" pour rassurer vos futurs clients et accélérer vos transactions.</p>
              </div>
            </div>
            
            <Link to="/inscription" className="btn btn-primary btn-lg mt-3">Créer un compte Agence</Link>
          </div>

          <div className="card" style={{ flex: 1, minWidth: '350px', padding: '3rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Prêt à franchir le cap ?</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', lineHeight: 1.6 }}>
              L'inscription en tant qu'agence nécessite une vérification de vos documents légaux pour garantir la qualité de notre réseau.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} color="var(--color-accent)" /> Registre de commerce (RCCM)</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} color="var(--color-accent)" /> Numéro d'Identifiant Fiscal</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} color="var(--color-accent)" /> Pièce d'identité du gérant</li>
            </ul>
            <Link to="/nous-contacter" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', width: '100%', textAlign: 'center' }}>
              Contacter le service commercial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
