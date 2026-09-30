import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Zap, ShieldCheck, Heart, Search, Lock, Unlock, Phone, Rocket, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const PREMIUM_UI_DATA = [
  { duration: 15, name: 'Premium 15 Jours', refPrice: 4900, discount: '-20%', boosts: 1, monthlyEq: '7 800 FCFA/mois', isPopular: false },
  { duration: 30, name: 'Premium 1 Mois', refPrice: 9900, discount: '-40%', boosts: 3, monthlyEq: '5 900 FCFA/mois', isPopular: true },
  { duration: 90, name: 'Premium 3 Mois', refPrice: 14700, discount: '-33%', boosts: 3, monthlyEq: '3 300 FCFA/mois', isPopular: false },
  { duration: 180, name: 'Premium 6 Mois', refPrice: 29400, discount: '-49%', boosts: 6, monthlyEq: '2 483 FCFA/mois', isPopular: false }
];



export default function Pricing() {
  const { role, user } = useAuth();
  const userRole = role || 'SEEKER';
  
  // Extract user first name for personalized hero
  let firstName = 'Cher Partenaire';
  if (user) {
    if (userRole === 'OWNER' && user.profile?.firstName) {
      firstName = user.profile.firstName;
    } else if (userRole === 'AGENCY' && user.agency?.name) {
      firstName = user.agency.name;
    }
  }
  
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState<any>({ seeker: [], owner: [], agency: [] });
  const [loading, setLoading] = useState(true);

  // Pour la nouvelle UI Premium
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // 1 mois par défaut

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
    // Trouver le plan DB correspondant à la durée sélectionnée pour le rôle actif
    const activePlans = userRole === 'OWNER' ? plans.owner : plans.agency;
    const dbPlan = activePlans.find((p: any) => p.duration === selectedDuration);
    
    if (dbPlan) {
      handleSelectPlan(dbPlan, 'Abonnement Premium');
    } else {
      alert("Ce plan n'est pas disponible pour le moment.");
    }
  };

  const renderPremiumHero = () => {
    return (
      <div style={{ padding: '0 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
            <i style={{ fontFamily: 'Georgia, serif', color: '#1e293b' }}>{firstName},</i><br/>
            ton futur {userRole === 'AGENCY' ? 'client' : 'locataire/acheteur'} t'attend. <span style={{ color: '#d97706' }}>Ne le rate pas.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', maxWidth: '800px', margin: '1.5rem auto', lineHeight: '1.6' }}>
            Sans Premium, ton annonce reste noyée. <strong>Avec Premium, tu apparais en premier, tu vois qui s'intéresse à toi, et tu réponds sans limite.</strong>
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', background: '#fef3c7', padding: '1.5rem', borderRadius: '16px', maxWidth: '800px', margin: '0 auto', border: '1px solid #fde68a' }}>
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <h3 style={{ fontSize: '2.2rem', color: '#d97706', fontWeight: 800, margin: 0, fontFamily: 'Georgia, serif' }}>3x</h3>
              <p style={{ fontSize: '0.95rem', color: '#92400e', margin: 0, fontWeight: 600 }}>plus de contacts</p>
            </div>
            <div style={{ width: '1px', background: '#fde68a' }}></div>
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <h3 style={{ fontSize: '2.2rem', color: '#d97706', fontWeight: 800, margin: 0, fontFamily: 'Georgia, serif' }}>10 000+</h3>
              <p style={{ fontSize: '0.95rem', color: '#92400e', margin: 0, fontWeight: 600 }}>chercheurs actifs</p>
            </div>
            <div style={{ width: '1px', background: '#fde68a' }}></div>
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <h3 style={{ fontSize: '2.2rem', color: '#d97706', fontWeight: 800, margin: 0, fontFamily: 'Georgia, serif' }}>100%</h3>
              <p style={{ fontSize: '0.95rem', color: '#92400e', margin: 0, fontWeight: 600 }}>visibilité garantie</p>
            </div>
          </div>
        </div>

        {/* Features list breakdown */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '800px', margin: '2rem auto', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>Ce que Premium débloque pour toi</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Tout ce qui change pour trouver ton preneur plus vite</p>
          </div>

          {/* Feature 1 */}
          <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', border: '1px solid #fef3c7', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#fcd34d', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={24} color="#b45309" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#92400e' }}>Vois qui t'a mis en favori</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#b45309', lineHeight: '1.4' }}>Découvre tous les chercheurs intéressés par tes biens. Le plus puissant signal d'intérêt.</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '80px' }}>
              <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Lock size={12}/> Bloqué</span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Unlock size={12}/> Débloqué</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', border: '1px solid #f1f5f9', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#e2e8f0', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Search size={24} color="#475569" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>Vois qui consulte ton annonce</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>Identifie en un clic les chercheurs actifs. Fini les doutes.</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '80px' }}>
              <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Lock size={12}/> Bloqué</span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Unlock size={12}/> Débloqué</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', border: '1px solid #f1f5f9', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#e2e8f0', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={24} color="#475569" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>Débloque les numéros des chercheurs</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>Contacte directement n'importe quel chercheur sans limites.</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '80px' }}>
              <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Lock size={12}/> Bloqué</span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Unlock size={12}/> Débloqué</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', border: '1px solid #f1f5f9', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ background: '#e2e8f0', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Rocket size={24} color="#475569" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>Apparais en tête de liste</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.4' }}>Ton badge Premium te propulse au-dessus de tout le monde dans les résultats.</p>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '80px' }}>
              <span style={{ fontSize: '0.8rem', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Lock size={12}/> Bloqué</span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}><Unlock size={12}/> Débloqué</span>
            </div>
          </div>
        </div>

        {/* Reassurance Block */}
        <div style={{ background: '#fffbeb', borderRadius: '16px', padding: '1.5rem 2rem', maxWidth: '800px', margin: '0 auto 3rem', border: '1px solid #fde68a', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={18} color="#16a34a" />
            </div>
            <span style={{ color: '#92400e', fontWeight: 600, fontSize: '1.05rem' }}>Annulable à tout moment, en 1 clic depuis tes paramètres</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={18} color="#16a34a" />
            </div>
            <span style={{ color: '#92400e', fontWeight: 600, fontSize: '1.05rem' }}>Sans engagement, tu gardes tes avantages jusqu'à la fin</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={18} color="#16a34a" />
            </div>
            <span style={{ color: '#92400e', fontWeight: 600, fontSize: '1.05rem' }}>Paiement 100% sécurisé, données jamais partagées</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPremiumUI = (uiDataArray: any[], activePlans: any[]) => {
    // On fusionne les données de l'UI avec les données de la DB
    const displayCards = uiDataArray.map(uiData => {
      const dbPlan = activePlans.find((p: any) => p.duration === uiData.duration);
      return { ...uiData, dbPlan };
    }).filter(card => card.dbPlan); // On n'affiche que les plans qui existent en DB

    if (displayCards.length === 0) {
      return <div className="text-center p-4">Aucun plan premium disponible.</div>;
    }

    return (
      <div className="premium-subscription-container">
        <div className="text-center mb-5">
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Choisis ta durée</h2>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Plus c'est long, plus tu économises</p>
        </div>

        <div className="premium-cards-stack">
          {displayCards.map((card) => {
            const isSelected = selectedDuration === card.duration;
            
            return (
              <div 
                key={card.duration}
                className={`premium-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDuration(card.duration)}
              >
                <div className="premium-card-left">
                  <div className={`premium-radio ${isSelected ? 'checked' : ''}`}>
                    {/* Le point du bouton radio est géré en CSS via ::after */}
                  </div>
                  <div className="premium-card-info">
                    <div className="premium-card-title-row">
                      <span className="premium-card-title">{card.name}</span>
                      {card.isPopular && <span className="premium-badge-popular">POPULAIRE</span>}
                      <span className="premium-badge-discount">{card.discount}</span>
                    </div>
                    <div className="premium-card-monthly">{card.monthlyEq}</div>
                  </div>
                </div>

                <div className="premium-card-right">
                  <div className="premium-badge-boost">
                    <Zap size={12} fill="currentColor" /> +{card.boosts} boost{card.boosts > 1 ? 's' : ''}
                  </div>
                  <div className="premium-price-container">
                    <div className="premium-price-old">{card.refPrice} FCFA</div>
                    <div className="premium-price-current">
                      <span className="price-number">{card.dbPlan.price}</span>
                      <span className="price-currency">FCFA</span>
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
            <ShieldCheck size={16} /> Paiement sécurisé
          </div>
          <p className="premium-disclaimer">
            Votre abonnement sera activé après confirmation du paiement.
          </p>
        </div>
      </div>
    );
  };

  const renderSeekerUI = () => {
    return (
      <div className="premium-subscription-container">
        <div className="text-center mb-5">
          <h2 style={{ color: 'var(--color-secondary)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Options Chercheur</h2>
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.1rem' }}>Payez uniquement pour ce dont vous avez besoin</p>
        </div>

        <div className="premium-cards-stack">
          {/* Card 1: Publier une annonce */}
          <div className="premium-card selected" style={{ cursor: 'default' }}>
            <div className="premium-card-left">
              <div className="premium-card-info">
                <div className="premium-card-title-row">
                  <span className="premium-card-title">Publier une annonce</span>
                </div>
                <div className="premium-card-monthly">Payez une seule fois pour poster votre demande</div>
              </div>
            </div>
            <div className="premium-card-right">
              <button className="btn btn-outline" onClick={() => navigate('/publier')}>
                Publier
              </button>
            </div>
          </div>

          {/* Card 2: Débloquer un numéro */}
          <div className="premium-card selected" style={{ cursor: 'default', marginTop: '1rem' }}>
            <div className="premium-card-left">
              <div className="premium-card-info">
                <div className="premium-card-title-row">
                  <span className="premium-card-title">Débloquer un numéro</span>
                </div>
                <div className="premium-card-monthly">Accédez aux coordonnées d'un propriétaire</div>
              </div>
            </div>
            <div className="premium-card-right">
              <button className="btn btn-primary" onClick={() => alert("Trouvez une annonce pour débloquer le numéro.")}>
                Rechercher
              </button>
            </div>
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
    <div className="pricing-page" style={{ paddingTop: '2rem' }}>
      {userRole === 'SEEKER' && (
        <div className="pricing-section premium-section">
          {renderSeekerUI()}
        </div>
      )}

      {userRole === 'OWNER' && (
        <div className="pricing-section premium-section">
          {renderPremiumHero()}
          {renderPremiumUI(PREMIUM_UI_DATA, plans.owner)}
        </div>
      )}

      {userRole === 'AGENCY' && (
        <div className="pricing-section premium-section">
          {renderPremiumHero()}
          {renderPremiumUI(PREMIUM_UI_DATA, plans.agency)}
        </div>
      )}
    </div>
  );
}
