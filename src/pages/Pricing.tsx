import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, ShieldCheck, Heart, Search, Lock, Phone, Rocket, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const PREMIUM_UI_DATA = [
  { duration: 30, name: 'Premium 1 Mois', discount: '', boosts: 3, monthlyEq: '3 000 FCFA/mois', isPopular: true }
];

export default function Pricing() {
  const { role, user } = useAuth();
  const userRole = role || 'SEEKER';

  let firstName = 'Cher Partenaire';
  if (user) {
    if (userRole === 'OWNER' && (user as any).profile?.firstName) {
      firstName = (user as any).profile.firstName;
    } else if (userRole === 'AGENCY' && (user as any).agency?.name) {
      firstName = (user as any).agency.name;
    }
  }

  const navigate = useNavigate();

  const [plans, setPlans] = useState<any>({ seeker: [], owner: [], agency: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPremiumPlanId, setSelectedPremiumPlanId] = useState<string>('');
  const [selectedSeekerPlanId, setSelectedSeekerPlanId] = useState<string>('');
  const [publicTab, setPublicTab] = useState<'OWNER' | 'SEEKER' | 'AGENCY'>('OWNER');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/payments/plans');
        const subscriptionPlans = response.data.subscriptionPlans || [];
        const seekerList = subscriptionPlans.filter((p: any) => p.targetRole === 'SEEKER');
        setPlans({
          seeker: seekerList,
          owner: subscriptionPlans.filter((p: any) => p.targetRole === 'OWNER'),
          agency: subscriptionPlans.filter((p: any) => p.targetRole === 'AGENCY'),
        });
        if (seekerList.length > 0) {
          const pop = seekerList.find((p: any) => p.popular) || seekerList[0];
          setSelectedSeekerPlanId(pop?.id || '');
        }
        
        const activeList = userRole === 'OWNER' ? subscriptionPlans.filter((p: any) => p.targetRole === 'OWNER') : subscriptionPlans.filter((p: any) => p.targetRole === 'AGENCY');
        if (activeList.length > 0) {
          setSelectedPremiumPlanId(activeList[0].id);
        }
      } catch (error) {
        console.error('Erreur chargement des plans', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: any, type: string) => {
    navigate('/paiement', { state: { plan, type } });
  };

  const handlePremiumCheckout = () => {
    const activePlans = userRole === 'OWNER' ? plans.owner : plans.agency;
    const dbPlan = activePlans.find((p: any) => p.id === selectedPremiumPlanId);
    if (dbPlan) {
      handleSelectPlan(dbPlan, 'Abonnement Premium');
    } else {
      alert("Veuillez sélectionner un forfait.");
    }
  };

  const handleSeekerCheckout = () => {
    const selectedPlan = plans.seeker.find((p: any) => p.id === selectedSeekerPlanId);
    if (selectedPlan) {
      handleSelectPlan(selectedPlan, 'Pass Chercheur VIP');
    } else {
      alert("Veuillez sélectionner un forfait.");
    }
  };

  const renderPremiumHero = () => {
    return (
      <div className="premium-hero-wrapper">
        <div className="premium-hero-header">
          <div className="premium-pill-tag">
            <Sparkles size={14} />
            <span>{userRole === 'AGENCY' ? 'Partenaire Agence' : 'Partenaire Propriétaire'}</span>
          </div>

          <h1 className="premium-hero-title">
            <span className="premium-hero-name">{firstName},</span> ton futur {userRole === 'AGENCY' ? 'client' : 'locataire'} t&apos;attend.
            <span className="premium-accent-text">Ne le rate pas.</span>
          </h1>
          <p className="premium-hero-subtitle">
            Sans Premium, ton annonce reste noyée. <strong>Avec Premium, tu apparais en premier, tu vois qui s&apos;intéresse à toi, et tu réponds sans limite.</strong>
          </p>

          <div className="premium-stats-bar">
            <div className="premium-stat-item">
              <h3 className="premium-stat-number">3x</h3>
              <p className="premium-stat-label">plus de contacts</p>
            </div>
            <div className="premium-stat-item">
              <h3 className="premium-stat-number">10 000+</h3>
              <p className="premium-stat-label">chercheurs actifs</p>
            </div>
            <div className="premium-stat-item">
              <h3 className="premium-stat-number">100%</h3>
              <p className="premium-stat-label">visibilité garantie</p>
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="premium-benefits-card">
          <div className="text-center mb-4">
            <h3 className="premium-benefits-title">Ce que Premium débloque pour toi</h3>
            <p className="premium-benefits-desc">Tout ce qui change pour trouver ton preneur plus vite</p>
          </div>

          <div className="premium-benefit-row benefit-highlight">
            <div className="benefit-icon-box icon-highlight">
              <Heart size={22} color="#b45309" />
            </div>
            <div className="benefit-content">
              <h4 className="benefit-title title-highlight">Vois qui t&apos;a mis en favori</h4>
              <p className="benefit-desc desc-highlight">Découvre tous les chercheurs intéressés par tes biens en temps réel.</p>
            </div>
            <div className="benefit-status">
              <span className="status-unlocked"><Check size={14}/> Inclus avec Premium</span>
            </div>
          </div>

          <div className="premium-benefit-row">
            <div className="benefit-icon-box">
              <Search size={22} color="#475569" />
            </div>
            <div className="benefit-content">
              <h4 className="benefit-title">Vois qui consulte ton annonce</h4>
              <p className="benefit-desc">Identifie en un clic les chercheurs actifs sur tes biens.</p>
            </div>
            <div className="benefit-status">
              <span className="status-unlocked"><Check size={14}/> Inclus avec Premium</span>
            </div>
          </div>

          <div className="premium-benefit-row">
            <div className="benefit-icon-box">
              <Phone size={22} color="#475569" />
            </div>
            <div className="benefit-content">
              <h4 className="benefit-title">Débloque les numéros des chercheurs</h4>
              <p className="benefit-desc">Contacte directement n&apos;importe quel chercheur sans limites.</p>
            </div>
            <div className="benefit-status">
              <span className="status-unlocked"><Check size={14}/> Inclus avec Premium</span>
            </div>
          </div>

          <div className="premium-benefit-row">
            <div className="benefit-icon-box">
              <Rocket size={22} color="#475569" />
            </div>
            <div className="benefit-content">
              <h4 className="benefit-title">Apparais en tête de liste</h4>
              <p className="benefit-desc">Ton badge Premium te propulse au-dessus de tout le monde dans les résultats.</p>
            </div>
            <div className="benefit-status">
              <span className="status-unlocked"><Check size={14}/> Inclus avec Premium</span>
            </div>
          </div>
        </div>

        {/* Guarantees Box */}
        <div className="premium-guarantees-card">
          <div className="guarantee-row">
            <div className="guarantee-check">
              <Check size={18} color="#16a34a" />
            </div>
            <span className="guarantee-text">Annulable à tout moment, en 1 clic depuis tes paramètres</span>
          </div>
          <div className="guarantee-row">
            <div className="guarantee-check">
              <Check size={18} color="#16a34a" />
            </div>
            <span className="guarantee-text">Sans engagement, tu gardes tes avantages jusqu&apos;à la fin</span>
          </div>
          <div className="guarantee-row">
            <div className="guarantee-check">
              <ShieldCheck size={18} color="#16a34a" />
            </div>
            <span className="guarantee-text">Paiement 100% sécurisé, données confidentielles</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPremiumUI = (_ignored: any, activePlans: any[]) => {
    if (!activePlans || activePlans.length === 0) {
      return <div className="text-center p-4">Aucun plan premium disponible actuellement.</div>;
    }

    return (
      <div className="premium-subscription-container">
        <div className="text-center mb-4">
          <h2 className="premium-section-heading">Choisis ton plan</h2>
          <p className="premium-section-subheading">Développe ton activité avec le plan adapté</p>
        </div>

        <div className="premium-cards-stack">
          {activePlans.map((card: any) => {
            const isSelected = selectedPremiumPlanId === card.id;
            return (
              <div
                key={card.id}
                className={`premium-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedPremiumPlanId(card.id)}
              >
                <div className="premium-card-left">
                  <div className={`premium-radio ${isSelected ? 'checked' : ''}`}></div>
                  <div className="premium-card-info">
                    <div className="premium-card-title-row">
                      <span className="premium-card-title">{card.name}</span>
                    </div>
                    <div className="premium-card-monthly">{card.duration} jours</div>
                  </div>
                </div>

                <div className="premium-card-right">
                  <div className="premium-price-container">
                    <div className="premium-price-old" style={{ display: 'none' }}></div>
                    <div className="premium-price-current">
                      <span className="price-number">{card.price}</span>
                      <span className="price-currency">{card.currency || 'FCFA'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="premium-action-container">
          <button className="btn btn-primary btn-premium-checkout" onClick={handlePremiumCheckout}>
            Continuer vers le paiement
          </button>
          <div className="premium-secure-text">
            <ShieldCheck size={16} /> Paiement 100% sécurisé via Mobile Money & Carte
          </div>
          <p className="premium-disclaimer">
            Votre abonnement sera activé immédiatement après confirmation du paiement.
          </p>
        </div>
      </div>
    );
  };

  const renderSeekerUI = () => {
    return (
      <div className="premium-subscription-container">
        {/* Pass VIP Section */}
        <div className="text-center mb-4">
          <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 700, padding: '0.35rem 0.85rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            ESPACE CHERCHEUR
          </span>
          <h2 className="premium-section-heading">Pass Chercheur VIP</h2>
          <p className="premium-section-subheading">Accédez directement aux propriétaires sans limites et sans payer par annonce</p>
        </div>

        {plans.seeker && plans.seeker.length > 0 && (
          <div className="premium-cards-stack">
            {plans.seeker.map((plan: any) => {
              const isSelected = selectedSeekerPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  className={`premium-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSeekerPlanId(plan.id)}
                >
                  <div className="premium-card-left">
                    <div className={`premium-radio ${isSelected ? 'checked' : ''}`}></div>
                    <div className="premium-card-info">
                      <div className="premium-card-title-row">
                        <span className="premium-card-title">{plan.name}</span>
                        {plan.popular && <span className="premium-badge-popular">POPULAIRE</span>}
                      </div>
                      <div className="premium-card-monthly">Contacts directs illimités pendant {plan.duration} jours</div>
                    </div>
                  </div>

                  <div className="premium-card-right">
                    <div className="premium-price-current">
                      <span className="price-number">{new Intl.NumberFormat('fr-FR').format(plan.price)}</span>
                      <span className="price-currency">{plan.currency || 'FCFA'}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="premium-action-container mb-5">
              <button className="btn btn-primary btn-premium-checkout" onClick={handleSeekerCheckout}>
                Souscrire au Pass VIP
              </button>
              <div className="premium-secure-text">
                <ShieldCheck size={16} /> Déblocage immédiat via TMoney, Flooz & Carte
              </div>
            </div>
          </div>
        )}

        {/* Options à l'acte */}
        <div className="text-center mb-3 mt-4">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '0.25rem' }}>Options à l&apos;acte</h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>Flexibilité totale selon vos besoins ponctuels</p>
        </div>

        <div className="premium-cards-stack">
          <div className="premium-card" style={{ cursor: 'default' }}>
            <div className="premium-card-left">
              <div className="benefit-icon-box" style={{ background: '#e0f2fe' }}>
                <Rocket size={20} color="#0284c7" />
              </div>
              <div className="premium-card-info">
                <div className="premium-card-title-row">
                  <span className="premium-card-title">Publier une demande &quot;Je cherche&quot;</span>
                  <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', fontSize: '0.7rem' }}>GRATUIT</span>
                </div>
                <div className="premium-card-monthly">Les propriétaires et agences consultent vos critères et vous contactent directement.</div>
              </div>
            </div>
            <div className="premium-card-right">
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/publier')}>
                Publier
              </button>
            </div>
          </div>

          <div className="premium-card" style={{ cursor: 'default' }}>
            <div className="premium-card-left">
              <div className="benefit-icon-box" style={{ background: '#fef3c7' }}>
                <Phone size={20} color="#d97706" />
              </div>
              <div className="premium-card-info">
                <div className="premium-card-title-row">
                  <span className="premium-card-title">Débloquer un numéro à l&apos;unité</span>
                  <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.7rem' }}>1 000 FCFA</span>
                </div>
                <div className="premium-card-monthly">Accédez instantanément au téléphone WhatsApp de l&apos;annonceur sur l&apos;annonce choisie.</div>
              </div>
            </div>
            <div className="premium-card-right">
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/annonces')}>
                Parcourir
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPublicPricing = () => {
    return (
      <div className="public-pricing-wrapper">
        <div className="public-pricing-header">
          <h1 className="public-pricing-title">Une tarification simple et transparente</h1>
          <p className="public-pricing-subtitle">
            Choisissez le plan qui correspond à vos besoins. Créez votre compte gratuitement pour commencer.
          </p>

          {/* Mobile Segmented Control */}
          <div className="pricing-mobile-segmented">
            <button 
              className={`segmented-btn ${publicTab === 'OWNER' ? 'active' : ''}`}
              onClick={() => setPublicTab('OWNER')}
            >
              Propriétaires
            </button>
            <button 
              className={`segmented-btn ${publicTab === 'SEEKER' ? 'active' : ''}`}
              onClick={() => setPublicTab('SEEKER')}
            >
              Chercheurs
            </button>
            <button 
              className={`segmented-btn ${publicTab === 'AGENCY' ? 'active' : ''}`}
              onClick={() => setPublicTab('AGENCY')}
            >
              Agences
            </button>
          </div>
        </div>

        <div className="public-pricing-grid">
          {/* Chercheurs */}
          <div className={`public-pricing-card ${publicTab !== 'SEEKER' ? 'mobile-hidden' : ''}`}>
            <h3 className="pricing-card-role text-blue">Chercheurs</h3>
            <p className="pricing-card-target">Tout ce qu'il faut pour trouver gratuitement</p>
            <div className="pricing-card-price">
              Gratuit<span className="pricing-card-period"> / à vie</span>
            </div>
            <div className="pricing-features-heading">Inclus dans la version gratuite :</div>
            <ul className="pricing-features-list">
              <li><Check size={18} color="#10b981" /> <span>Recherche de biens illimitée</span></li>
              <li><Check size={18} color="#10b981" /> <span>Création d&apos;alertes personnalisées</span></li>
              <li><Check size={18} color="#10b981" /> <span>Messagerie interne sécurisée</span></li>
              <li><Check size={18} color="#10b981" /> <span>Publier une demande &quot;Je cherche&quot;</span></li>
              <div className="pricing-divider"></div>
              <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Déblocage de numéros (1 000 FCFA)</span></li>
              <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Pass VIP contacts illimités</span></li>
            </ul>
            <button className="btn btn-outline pricing-btn" onClick={() => navigate('/inscription', { state: { role: 'SEEKER' } })}>
              S&apos;inscrire comme chercheur
            </button>
          </div>

          {/* Propriétaires */}
          <div className={`public-pricing-card card-featured ${publicTab !== 'OWNER' ? 'mobile-hidden' : ''}`}>
            <div className="pricing-popular-pill">LE PLUS POPULAIRE</div>
            <h3 className="pricing-card-role text-gold">Propriétaires</h3>
            <p className="pricing-card-target text-slate">Publiez gratuitement. Développez votre visibilité quand vous le souhaitez.</p>
            <div className="pricing-card-price text-white">
              Freemium<span className="pricing-card-period text-slate"> / dès 3 900 FCFA</span>
            </div>
            <div className="pricing-features-heading text-gold">Inclus dans la version gratuite :</div>
            <ul className="pricing-features-list list-light">
              <li><Check size={18} color="#C9A227" /> <span>Profil propriétaire vérifié</span></li>
              <li><Check size={18} color="#C9A227" /> <span>Publication d&apos;annonces basiques</span></li>
              <li><Check size={18} color="#C9A227" /> <span>Réception des messages locataires</span></li>
              <li><Check size={18} color="#C9A227" /> <span>Outil de gestion des visites</span></li>
              <div className="pricing-divider divider-light"></div>
              <li><Lock size={16} color="#64748b" /> <span className="text-slate">Apparaître en tête de recherche (Premium)</span></li>
              <li><Lock size={16} color="#64748b" /> <span className="text-slate">Voir qui vous met en favori (Premium)</span></li>
              <li><Lock size={16} color="#64748b" /> <span className="text-slate">Statistiques détaillées (Premium)</span></li>
            </ul>
            <button className="btn btn-primary pricing-btn btn-gold" onClick={() => navigate('/inscription', { state: { role: 'OWNER' } })}>
              Devenir annonceur
            </button>
          </div>

          {/* Agences */}
          <div className={`public-pricing-card ${publicTab !== 'AGENCY' ? 'mobile-hidden' : ''}`}>
            <h3 className="pricing-card-role text-purple">Agences</h3>
            <p className="pricing-card-target">Starter / Pro / Business</p>
            <div className="pricing-card-price">
              Dès<span className="pricing-card-period"> 7 500 FCFA / mois</span>
            </div>
            <div className="pricing-features-heading">Inclus dans la version gratuite :</div>
            <ul className="pricing-features-list">
              <li><Check size={18} color="#10b981" /> <span>Profil Agence Vitrine Certifiée</span></li>
              <li><Check size={18} color="#10b981" /> <span>Gestion de multiples agents</span></li>
              <li><Check size={18} color="#10b981" /> <span>Publication d&apos;annonces basiques</span></li>
              <li><Check size={18} color="#10b981" /> <span>Tableau de bord de performance</span></li>
              <div className="pricing-divider"></div>
              <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Boosts groupés d&apos;annonces (Premium)</span></li>
              <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">Accès prioritaire aux Leads (Premium)</span></li>
              <li><Lock size={16} color="#94a3b8" /> <span className="text-muted">API / Export de données (Premium)</span></li>
            </ul>
            <button className="btn btn-outline pricing-btn btn-purple" onClick={() => navigate('/inscription', { state: { role: 'AGENCY' } })}>
              Créer un compte Agence
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loader className="spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div className="pricing-page-container">
      {!user && (
        <div className="public-pricing-section">
          {renderPublicPricing()}
        </div>
      )}

      {user && userRole === 'SEEKER' && (
        <div className="pricing-section">
          {renderSeekerUI()}
        </div>
      )}

      {user && (userRole === 'OWNER' || userRole === 'AGENCY') && (
        <div className="pricing-section">
          {renderPremiumHero()}
          {renderPremiumUI(PREMIUM_UI_DATA, userRole === 'OWNER' ? plans.owner : plans.agency)}
        </div>
      )}

      <style>{`
        .pricing-page-container {
          padding: 1.5rem 1rem calc(100px + env(safe-area-inset-bottom));
          min-height: calc(100vh - 80px);
          background: #f8fafc;
        }

        /* Mobile Segmented Control for Public Pricing */
        .pricing-mobile-segmented {
          display: none;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 12px;
          margin: 1.5rem auto 0;
          max-width: 380px;
          width: 100%;
        }
        .segmented-btn {
          flex: 1;
          padding: 0.65rem 0.5rem;
          border: none;
          background: transparent;
          border-radius: 9px;
          font-weight: 600;
          font-size: 0.88rem;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .segmented-btn.active {
          background: #ffffff;
          color: #0B1F3A;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        @media (max-width: 768px) {
          .pricing-mobile-segmented {
            display: flex;
          }
          .public-pricing-card.mobile-hidden {
            display: none !important;
          }
        }

        /* Hero Wrapper */
        .premium-hero-wrapper {
          max-width: 820px;
          margin: 0 auto;
        }
        .premium-hero-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .premium-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
          padding: 0.35rem 0.95rem;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 1.15rem;
        }
        .premium-hero-title {
          font-size: clamp(1.4rem, 5vw, 2.15rem);
          font-weight: 800;
          color: #0B1F3A;
          line-height: 1.3;
          margin-bottom: 0.85rem;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          font-family: inherit;
        }
        .premium-hero-name {
          color: #0B1F3A;
          font-weight: 800;
          font-family: inherit;
        }
        .premium-accent-text {
          color: #d97706;
          display: block;
          margin-top: 0.25rem;
          font-family: inherit;
        }
        .premium-hero-subtitle {
          font-size: clamp(0.9rem, 3.2vw, 1.05rem);
          color: #475569;
          max-width: 680px;
          margin: 0 auto 1.5rem;
          line-height: 1.55;
        }

        /* Stats Bar */
        .premium-stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 1rem 0.5rem;
          border-radius: 14px;
          max-width: 680px;
          margin: 0 auto;
        }
        .premium-stat-item {
          text-align: center;
        }
        .premium-stat-number {
          font-size: clamp(1.3rem, 4.5vw, 1.85rem);
          color: #d97706;
          font-weight: 800;
          margin: 0;
          font-family: inherit;
        }
        .premium-stat-label {
          font-size: clamp(0.72rem, 2.5vw, 0.82rem);
          color: #92400e;
          margin: 0;
          font-weight: 600;
        }

        /* Benefits Card */
        .premium-benefits-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem 1.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04);
          margin: 2rem 0;
        }
        .premium-benefits-title {
          font-size: clamp(1.2rem, 4vw, 1.45rem);
          font-weight: 800;
          color: #0B1F3A;
          margin: 0 0 0.25rem;
        }
        .premium-benefits-desc {
          color: #64748b;
          font-size: 0.88rem;
          margin: 0;
        }

        /* Benefit Row */
        .premium-benefit-row {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border: 1px solid #f1f5f9;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
        }
        .premium-benefit-row.benefit-highlight {
          background: #fffbeb;
          border-color: #fef3c7;
        }
        .benefit-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .benefit-icon-box.icon-highlight {
          background: #fcd34d;
        }
        .benefit-content {
          flex: 1;
          min-width: 180px;
        }
        .benefit-title {
          font-size: 0.98rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.2rem;
        }
        .benefit-title.title-highlight {
          color: #92400e;
        }
        .benefit-desc {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }
        .benefit-desc.desc-highlight {
          color: #b45309;
        }
        .benefit-status {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .status-unlocked {
          font-size: 0.82rem;
          color: #15803d;
          background: #dcfce7;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Guarantees Box */
        .premium-guarantees-card {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 14px;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
        }
        .guarantee-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .guarantee-check {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .guarantee-text {
          font-size: 0.88rem;
          color: #92400e;
          font-weight: 600;
          line-height: 1.35;
        }

        /* Duration Selection Section */
        .premium-subscription-container {
          max-width: 760px;
          margin: 0 auto;
        }
        .premium-section-heading {
          font-size: clamp(1.4rem, 4.5vw, 1.85rem);
          font-weight: 800;
          color: #0B1F3A;
          margin-bottom: 0.25rem;
        }
        .premium-section-subheading {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0;
        }

        .premium-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin: 1.5rem 0 2rem;
        }
        .premium-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 0.75rem;
        }
        .premium-card.selected {
          border-color: #C9A227;
          background: #fffdf5;
          box-shadow: 0 4px 16px rgba(201, 162, 39, 0.12);
        }
        .premium-card-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }
        .premium-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .premium-radio.checked {
          border-color: #C9A227;
          background: #C9A227;
          box-shadow: inset 0 0 0 3px #ffffff;
        }
        .premium-card-title-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .premium-card-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0B1F3A;
        }
        .premium-badge-popular {
          background: #fef3c7;
          color: #b45309;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .premium-badge-discount {
          background: #dcfce7;
          color: #15803d;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
        }
        .premium-card-monthly {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 2px;
        }
        .premium-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          flex-shrink: 0;
        }
        .premium-badge-boost {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }
        .premium-price-old {
          font-size: 0.78rem;
          color: #94a3b8;
          text-decoration: line-through;
        }
        .premium-price-current .price-number {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0B1F3A;
        }
        .premium-price-current .price-currency {
          font-size: 0.78rem;
          font-weight: 600;
          color: #C9A227;
          margin-left: 2px;
        }

        @media (max-width: 580px) {
          .premium-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 0.9rem;
          }
          .premium-card-right {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f1f5f9;
            padding-top: 0.5rem;
            margin-top: 0.25rem;
          }
        }

        /* Action Section */
        .premium-action-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.65rem;
          margin-top: 1.5rem;
        }
        .btn-premium-checkout {
          width: 100%;
          min-height: 48px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          background: #0B1F3A;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(11, 31, 58, 0.15);
        }
        .btn-premium-checkout:hover {
          background: #15325b;
        }
        .premium-secure-text {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: #64748b;
          text-align: center;
        }
        .premium-disclaimer {
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
          margin: 0;
        }

        /* Public Pricing Grid */
        .public-pricing-wrapper {
          max-width: 1100px;
          margin: 0 auto;
        }
        .public-pricing-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .public-pricing-title {
          font-size: clamp(1.6rem, 5vw, 2.5rem);
          font-weight: 800;
          color: #0B1F3A;
          margin-bottom: 0.5rem;
        }
        .public-pricing-subtitle {
          font-size: 1rem;
          color: #64748b;
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .public-pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          align-items: stretch;
        }
        .public-pricing-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem 1.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          text-align: center;
          position: relative;
        }
        .public-pricing-card.card-featured {
          background: #0B1F3A;
          border: 2px solid #C9A227;
          box-shadow: 0 10px 25px rgba(11, 31, 58, 0.2);
        }
        .pricing-popular-pill {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #C9A227;
          color: #ffffff;
          padding: 0.2rem 0.85rem;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .pricing-card-role {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .text-blue { color: #3b82f6; }
        .text-gold { color: #C9A227; }
        .text-purple { color: #8b5cf6; }
        .text-white { color: #ffffff !important; }
        .text-slate { color: #94a3b8 !important; }
        .text-muted { color: #94a3b8; }

        .pricing-card-target {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1.25rem;
        }
        .pricing-card-price {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        .pricing-card-period {
          font-size: 0.9rem;
          font-weight: 400;
          color: #64748b;
        }
        .pricing-features-heading {
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.85rem;
        }
        .pricing-features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
        }
        .pricing-features-list li {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #334155;
        }
        .pricing-features-list.list-light li {
          color: #f1f5f9;
        }
        .pricing-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 0.25rem 0;
        }
        .pricing-divider.divider-light {
          background: rgba(255,255,255,0.12);
        }
        .pricing-btn {
          width: 100%;
          min-height: 44px;
          font-weight: 600;
          border-radius: 10px;
          margin-top: auto;
        }
        .btn-gold {
          background: #C9A227 !important;
          color: #ffffff !important;
          border: none !important;
        }
        .btn-purple {
          border-color: #8b5cf6 !important;
          color: #8b5cf6 !important;
        }
      `}</style>
    </div>
  );
}
