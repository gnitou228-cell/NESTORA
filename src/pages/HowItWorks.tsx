import { Link } from 'react-router-dom';
import { Search, Filter, Eye, MessageSquare, Calendar, UserPlus, Home, Tag, CheckCircle, TrendingUp, Users, Building } from 'lucide-react';
import '../home.css';

export default function HowItWorks() {
  return (
    <div className="landing-page">
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title">Le concept NESTORA</h1>
        <p className="hero-subtitle">Une plateforme bilatérale où l'offre et la demande se rencontrent naturellement.</p>
      </section>

      {/* Diagramme de mise en relation */}
      <section className="section" style={{ backgroundColor: '#fff', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #0B1F3A 0%, #1a365d 100%)',
            borderRadius: '24px',
            padding: '3rem',
            color: 'white',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background elements */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(201,162,39,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }}></div>
            
            <h2 className="text-center mb-5" style={{ fontSize: '2rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>Le Cœur de NESTORA</h2>
            
            <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
              
              {/* Côté Chercheur */}
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '2rem', height: '100%', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Search size={32} color="#0B1F3A" />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>CHERCHEUR</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Publie une demande détaillée</p>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    "Je cherche un appartement 3 pièces à Kégué..."
                  </div>
                </div>
              </div>

              {/* Centre (Mise en relation) */}
              <div className="col-md-4 text-center d-flex flex-column align-items-center justify-content-center mb-4 mb-md-0" style={{ minHeight: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%' }}>
                  <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #C9A227)', flex: 1 }}></div>
                  <div style={{ 
                    width: '80px', height: '80px', 
                    background: '#C9A227', 
                    borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(201, 162, 39, 0.4)',
                    border: '4px solid rgba(255,255,255,0.2)'
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 8L21 12M21 12L17 16M21 12H3M7 16L3 12M3 12L7 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ height: '2px', background: 'linear-gradient(270deg, transparent, #C9A227)', flex: 1 }}></div>
                </div>
                <h3 className="mt-4" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#C9A227', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Mise en relation
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Les deux côtés trouvent ce qui correspond parfaitement.
                </p>
              </div>

              {/* Côté Propriétaire */}
              <div className="col-md-4 text-center">
                <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '2rem', height: '100%', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: '64px', height: '64px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <Home size={32} color="#0B1F3A" />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem', color: '#fff' }}>PROPRIÉTAIRE / AGENCE</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Publie un bien disponible</p>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    "Je propose une villa avec piscine à louer..."
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Pour les chercheurs */}
      <section className="section bg-secondary">
        <h2 className="section-title text-center">Pour les chercheurs de logement</h2>
        <div className="steps-container mt-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div className="step card" style={{ padding: '2rem' }}>
            <Search size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>1. Rechercher</h3>
            <p className="text-light">Saisissez la ville, le quartier ou le type de bien que vous souhaitez trouver.</p>
          </div>
          <div className="step card" style={{ padding: '2rem' }}>
            <Filter size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>2. Filtrer</h3>
            <p className="text-light">Affinez vos résultats avec votre budget et vos critères spécifiques.</p>
          </div>
          <div className="step card" style={{ padding: '2rem' }}>
            <Eye size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>3. Consulter</h3>
            <p className="text-light">Découvrez les détails, les photos et les équipements de chaque logement.</p>
          </div>
          <div className="step card" style={{ padding: '2rem' }}>
            <MessageSquare size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>4. Contacter</h3>
            <p className="text-light">Discutez directement avec le propriétaire ou l'agence via notre messagerie.</p>
          </div>
          <div className="step card" style={{ padding: '2rem' }}>
            <Calendar size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>5. Visiter</h3>
            <p className="text-light">Organisez une visite et trouvez enfin votre futur chez-vous.</p>
          </div>
        </div>
      </section>

      {/* Pour les propriétaires */}
      <section className="section">
        <h2 className="section-title text-center">Pour les propriétaires</h2>
        <div className="steps-container mt-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div className="step card" style={{ padding: '2rem', borderColor: 'var(--color-primary)' }}>
            <UserPlus size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>1. Créer son compte</h3>
            <p className="text-light">Inscrivez-vous gratuitement en tant que propriétaire sur la plateforme.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', borderColor: 'var(--color-primary)' }}>
            <Home size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>2. Publier son bien</h3>
            <p className="text-light">Ajoutez des photos, une description détaillée et le prix de votre logement.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', borderColor: 'var(--color-primary)' }}>
            <Tag size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>3. Choisir sa formule</h3>
            <p className="text-light">Optez pour la visibilité qui vous correspond (annonces standard ou premium).</p>
          </div>
          <div className="step card" style={{ padding: '2rem', borderColor: 'var(--color-primary)' }}>
            <CheckCircle size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>4. Recevoir des demandes</h3>
            <p className="text-light">Recevez des messages de locataires potentiels directement sur votre tableau de bord.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', borderColor: 'var(--color-primary)' }}>
            <Calendar size={40} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem' }}>5. Gérer les visites</h3>
            <p className="text-light">Planifiez vos visites et sélectionnez le meilleur profil pour votre bien.</p>
          </div>
        </div>
      </section>

      {/* Pour les agences */}
      <section className="section bg-secondary">
        <h2 className="section-title text-center">Pour les agences immobilières</h2>
        <div className="steps-container mt-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div className="step card" style={{ padding: '2rem', background: 'var(--color-primary)', color: 'white' }}>
            <Building size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem', color: 'white' }}>1. Espace pro</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Créez votre profil d'agence et invitez vos collaborateurs.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', background: 'var(--color-primary)', color: 'white' }}>
            <Home size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem', color: 'white' }}>2. Ajouter des biens</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Synchronisez ou ajoutez vos biens pour maximiser leur visibilité.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', background: 'var(--color-primary)', color: 'white' }}>
            <Users size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem', color: 'white' }}>3. Portefeuille</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Gérez vos annonces et assignez-les à vos différents agents.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', background: 'var(--color-primary)', color: 'white' }}>
            <MessageSquare size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem', color: 'white' }}>4. Prospects</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Centralisez toutes les demandes et répondez rapidement aux prospects.</p>
          </div>
          <div className="step card" style={{ padding: '2rem', background: 'var(--color-primary)', color: 'white' }}>
            <TrendingUp size={40} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 className="step-title" style={{ fontSize: '1.2rem', color: 'white' }}>5. Activité</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Suivez vos statistiques et développez votre chiffre d'affaires.</p>
          </div>
        </div>
      </section>

      {/* FAQ courte */}
      <section className="section">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title text-center">Questions fréquentes</h2>
          <div className="faq-container mt-4">
            <div className="faq-item">
              <div className="faq-question">Puis-je utiliser NESTORA gratuitement ?</div>
              <div className="faq-answer" style={{ display: 'block', padding: '0 1.5rem 1.5rem', color: 'var(--color-text-light)' }}>L'inscription et la recherche de logement sont 100% gratuites pour les chercheurs. Pour publier des annonces, nous proposons des formules gratuites et payantes.</div>
            </div>
            <div className="faq-item">
              <div className="faq-question">Comment contacter un propriétaire ?</div>
              <div className="faq-answer" style={{ display: 'block', padding: '0 1.5rem 1.5rem', color: 'var(--color-text-light)' }}>Une fois connecté, cliquez sur le bouton "Contacter" depuis la page d'une annonce pour envoyer un message direct au propriétaire ou à l'agence.</div>
            </div>
            <div className="faq-item">
              <div className="faq-question">Les annonces sont-elles vérifiées ?</div>
              <div className="faq-answer" style={{ display: 'block', padding: '0 1.5rem 1.5rem', color: 'var(--color-text-light)' }}>Nous mettons en place un système de vérification des profils. Les annonces des utilisateurs vérifiés portent un badge spécifique pour plus de confiance.</div>
            </div>
          </div>
          <div className="text-center mt-4">
            <Link to="/faq" className="btn btn-outline">Voir toute la FAQ</Link>
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="section section-dark text-center">
        <h2 className="section-title">Prêt à démarrer ?</h2>
        <div className="d-flex justify-center gap-2 flex-wrap mt-4">
          <Link to="/recherche" className="btn btn-primary btn-lg" style={{ background: 'var(--color-accent)' }}>Commencer ma recherche</Link>
          <Link to="/inscription" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>Créer mon compte</Link>
        </div>
      </section>
    </div>
  );
}
