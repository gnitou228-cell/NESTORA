import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Zap, ShieldCheck, Lock, Unlock, Phone, Rocket, Check, Crown, Search, Heart, Users, Building, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const PREMIUM_UI_DATA = [
  { duration: 15, name: 'Premium 15 Jours', refPrice: 4900, discount: '-20%', boosts: 1, monthlyEq: '7 800 FCFA/mois', isPopular: false },
  { duration: 30, name: 'Premium 1 Mois', refPrice: 9900, discount: '-40%', boosts: 3, monthlyEq: '5 900 FCFA/mois', isPopular: true },
  { duration: 90, name: 'Premium 3 Mois', refPrice: 14700, discount: '-33%', boosts: 3, monthlyEq: '3 300 FCFA/mois', isPopular: false },
  { duration: 180, name: 'Premium 6 Mois', refPrice: 29400, discount: '-49%', boosts: 6, monthlyEq: '2 483 FCFA/mois', isPopular: false },
];

type Tab = 'SEEKER' | 'OWNER' | 'AGENCY';

export default function Pricing() {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const userRole = (role as Tab) || 'SEEKER';

  const [activeTab, setActiveTab] = useState<Tab>(userRole);
  const [plans, setPlans] = useState<any>({ seeker: [], owner: [], agency: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/payments/plans');
        const subscriptionPlans = response.data.subscriptionPlans || [];
        setPlans({
          seeker: subscriptionPlans.filter((p: any) => p.targetRole === 'SEEKER'),
          owner: subscriptionPlans.filter((p: any) => p.targetRole === 'OWNER'),
          agency: subscriptionPlans.filter((p: any) => p.targetRole === 'AGENCY'),
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: any) => {
    navigate('/paiement', { state: { plan, type: 'Abonnement Premium' } });
  };

  const handlePremiumCheckout = () => {
    const activePlans = activeTab === 'OWNER' ? plans.owner : plans.agency;
    const dbPlan = activePlans.find((p: any) => p.duration === selectedDuration);
    if (dbPlan) {
      handleSelectPlan(dbPlan);
    } else {
      alert("Ce plan n'est pas disponible pour le moment.");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader className="spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'SEEKER', label: 'Chercheurs', icon: <Search size={18} /> },
    { key: 'OWNER', label: 'Propriétaires', icon: <Star size={18} /> },
    { key: 'AGENCY', label: 'Agences', icon: <Building size={18} /> },
  ];

  /* ─── Content per tab ─── */
  const tabContent: Record<Tab, React.ReactNode> = {
    SEEKER: (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Pricing card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Free */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={20} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>Gratuit</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pour toujours</div>
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>0 <span style={{ fontSize: '1rem', fontWeight: 400, color: '#64748b' }}>FCFA</span></div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Recherche de biens illimitée</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Alertes personnalisées</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Messagerie sécurisée</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Publier une demande "Je cherche"</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Numéros de contact (payant)</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Accès prioritaire aux offres (payant)</li>
            </ul>
            {!user ? (
              <button className="btn btn-outline" style={{ width: '100%', borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => navigate('/inscription', { state: { role: 'SEEKER' } })}>
                S'inscrire gratuitement
              </button>
            ) : userRole === 'SEEKER' ? (
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/recherche')}>
                Rechercher des biens
              </button>
            ) : null}
          </div>

          {/* Pay-per-use */}
          <div style={{ background: 'var(--color-primary)', borderRadius: '16px', padding: '2rem', border: '2px solid var(--color-accent)', boxShadow: '0 8px 24px rgba(201,162,39,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,162,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={20} color="var(--color-accent)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'white' }}>À la carte</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>Payez ce que vous utilisez</div>
              </div>
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '1.5rem' }}>500 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>FCFA / contact</span></div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Check size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Déblocage de numéro propriétaire</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Check size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Contact direct sans intermédiaire</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Check size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Validité 30 jours après achat</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Check size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Disponible sur toutes les annonces</li>
            </ul>
            <button className="btn btn-primary" style={{ width: '100%', background: 'var(--color-accent)' }} onClick={() => navigate('/recherche')}>
              Trouver une annonce
            </button>
          </div>
        </div>
      </div>
    ),

    OWNER: (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Free vs Premium comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Freemium */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Gratuit</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>0 <span style={{ fontSize: '1rem', fontWeight: 400, color: '#64748b' }}>FCFA</span></div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Profil propriétaire vérifié</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Publication d'annonces</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Messagerie avec locataires</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Gestion des visites</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Tête de recherche</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Voir qui vous met en favori</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Statistiques détaillées</li>
            </ul>
            {!user && (
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => navigate('/inscription', { state: { role: 'OWNER' } })}>
                Devenir annonceur
              </button>
            )}
          </div>

          {/* Premium */}
          <div style={{ background: 'var(--color-primary)', borderRadius: '16px', padding: '2rem', border: '2px solid var(--color-accent)', boxShadow: '0 8px 24px rgba(201,162,39,0.2)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent)', color: 'white', padding: '0.2rem 1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ PREMIUM</div>
            <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Premium</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>dès 3 900 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>FCFA</span></div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Check size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Tout le plan gratuit inclus</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Apparaître en tête de recherche</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Voir qui met en favori</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Statistiques avancées</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Boosts d'annonces offerts</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Accès contacts chercheurs</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Badge priorité visible</li>
            </ul>
          </div>
        </div>

        {/* Premium Plans */}
        {(user && (userRole === 'OWNER')) || !user ? renderPremiumPlans(plans.owner) : renderPremiumPlans(plans.owner)}
      </div>
    ),

    AGENCY: (
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Freemium */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Gratuit</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>0 <span style={{ fontSize: '1rem', fontWeight: 400, color: '#64748b' }}>FCFA</span></div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Profil Agence Certifié</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Gestion multi-agents</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Publication d'annonces</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem' }}><Check size={16} color="#10b981" style={{ flexShrink: 0 }} />Tableau de bord performance</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Boosts groupés d'annonces</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />Accès prioritaire aux Leads</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: '#94a3b8' }}><Lock size={16} color="#94a3b8" style={{ flexShrink: 0 }} />API / Export de données</li>
            </ul>
            {!user && (
              <button className="btn btn-outline" style={{ width: '100%', borderColor: '#8b5cf6', color: '#8b5cf6' }} onClick={() => navigate('/inscription', { state: { role: 'AGENCY' } })}>
                Créer un compte Agence
              </button>
            )}
          </div>

          {/* Premium */}
          <div style={{ background: 'var(--color-primary)', borderRadius: '16px', padding: '2rem', border: '2px solid var(--color-accent)', boxShadow: '0 8px 24px rgba(201,162,39,0.2)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent)', color: 'white', padding: '0.2rem 1rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap' }}>⚡ PREMIUM AGENCE</div>
            <div style={{ fontWeight: 700, color: 'var(--color-accent)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Premium Agence</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: '1.5rem' }}>dès 3 900 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>FCFA</span></div>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Check size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Tout le plan gratuit inclus</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Boosts groupés d'annonces</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Accès prioritaire aux Leads</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Statistiques de conversion</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Agents illimités</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />Badge Agence Vérifiée renforcé</li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.9rem', color: 'white' }}><Unlock size={16} color="var(--color-accent)" style={{ flexShrink: 0 }} />API / Export de données</li>
            </ul>
          </div>
        </div>

        {renderPremiumPlans(plans.agency)}
      </div>
    ),
  };

  function renderPremiumPlans(activePlans: any[]) {
    const displayCards = PREMIUM_UI_DATA.map(uiData => {
      const dbPlan = activePlans.find((p: any) => p.duration === uiData.duration);
      return { ...uiData, dbPlan };
    }).filter(card => card.dbPlan);

    if (displayCards.length === 0) return null;

    return (
      <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.25rem' }}>
            <Crown size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle', color: 'var(--color-accent)' }} />
            Choisissez votre durée Premium
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Plus c'est long, plus vous économisez</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {displayCards.map(card => {
            const isSelected = selectedDuration === card.duration;
            return (
              <div
                key={card.duration}
                onClick={() => setSelectedDuration(card.duration)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '1rem 1.25rem', borderRadius: '12px', cursor: 'pointer',
                  border: isSelected ? '2px solid var(--color-accent)' : '2px solid #e2e8f0',
                  background: isSelected ? 'rgba(201,162,39,0.06)' : 'white',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', border: isSelected ? '6px solid var(--color-accent)' : '2px solid #cbd5e1',
                    flexShrink: 0, transition: 'all 0.2s'
                  }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{card.name}</span>
                      {card.isPopular && <span style={{ background: 'var(--color-accent)', color: 'white', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '20px' }}>POPULAIRE</span>}
                      <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '20px' }}>{card.discount}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{card.monthlyEq} · +{card.boosts} boost{card.boosts > 1 ? 's' : ''} offert{card.boosts > 1 ? 's' : ''}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>{card.refPrice} FCFA</div>
                  <div style={{ fontWeight: 800, color: isSelected ? 'var(--color-accent)' : '#0f172a', fontSize: '1.1rem' }}>{card.dbPlan?.price} FCFA</div>
                </div>
              </div>
            );
          })}
        </div>

        {user ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%', background: 'var(--color-accent)', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: '12px' }}
            onClick={handlePremiumCheckout}
          >
            <Zap size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Activer Premium maintenant
          </button>
        ) : (
          <button
            className="btn btn-primary"
            style={{ width: '100%', background: 'var(--color-accent)', padding: '0.9rem', fontSize: '1rem', fontWeight: 700, borderRadius: '12px' }}
            onClick={() => navigate('/inscription')}
          >
            Créer un compte pour commencer
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#64748b', fontSize: '0.8rem' }}>
          <ShieldCheck size={14} /> Paiement sécurisé · Sans engagement · Annulable à tout moment
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero */}
      <div style={{ background: 'var(--color-primary)', padding: '4rem 1rem 5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
          Une tarification <span style={{ color: 'var(--color-accent)' }}>simple et transparente</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Choisissez votre profil et découvrez ce qui est inclus. Commencez toujours gratuitement.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: '900px', margin: '-2rem auto 0', padding: '0 1rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '0.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.85rem 1rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.25s',
                background: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab.key ? 'white' : '#64748b',
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(11,31,58,0.3)' : 'none',
              }}
            >
              {tab.icon} {tab.label}
              {user && userRole === tab.key && (
                <span style={{ background: 'var(--color-accent)', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 700 }}>Vous</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ paddingBottom: '4rem' }}>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
