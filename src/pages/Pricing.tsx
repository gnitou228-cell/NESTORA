import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const PREMIUM_UI_DATA = [
  { duration: 15, name: 'Premium 15 Jours', refPrice: 4900, discount: '-20%', boosts: 1, monthlyEq: '7 800 FCFA/mois', isPopular: false },
  { duration: 30, name: 'Premium 1 Mois', refPrice: 9900, discount: '-40%', boosts: 3, monthlyEq: '5 900 FCFA/mois', isPopular: true },
  { duration: 90, name: 'Premium 3 Mois', refPrice: 14700, discount: '-33%', boosts: 3, monthlyEq: '3 300 FCFA/mois', isPopular: false },
  { duration: 180, name: 'Premium 6 Mois', refPrice: 29400, discount: '-49%', boosts: 6, monthlyEq: '2 483 FCFA/mois', isPopular: false }
];

const AGENCY_UI_DATA = [
  { duration: 30, name: 'STARTER - 1 Mois', refPrice: 20000, discount: '-25%', boosts: 5, monthlyEq: '15 000 FCFA/mois', isPopular: false },
  { duration: 90, name: 'PRO - 3 Mois', refPrice: 100000, discount: '-20%', boosts: 15, monthlyEq: '26 666 FCFA/mois', isPopular: true },
  { duration: 365, name: 'BUSINESS - 1 An', refPrice: 600000, discount: '-10%', boosts: 50, monthlyEq: '45 000 FCFA/mois', isPopular: false }
];

export default function Pricing() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState(role || 'SEEKER');
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
    const activePlans = activeTab === 'OWNER' ? plans.owner : plans.agency;
    const dbPlan = activePlans.find((p: any) => p.duration === selectedDuration);
    
    if (dbPlan) {
      handleSelectPlan(dbPlan, 'Abonnement Premium');
    } else {
      alert("Ce plan n'est pas disponible pour le moment.");
    }
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
    <div className="pricing-page">
      <div className="tabs-container" style={{ marginTop: '2rem' }}>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'SEEKER' ? 'active' : ''}`}
            onClick={() => setActiveTab('SEEKER')}
          >
            Chercheur
          </button>
          <button 
            className={`tab ${activeTab === 'OWNER' ? 'active' : ''}`}
            onClick={() => setActiveTab('OWNER')}
          >
            Propriétaire
          </button>
          <button 
            className={`tab ${activeTab === 'AGENCY' ? 'active' : ''}`}
            onClick={() => setActiveTab('AGENCY')}
          >
            Agence
          </button>
        </div>
      </div>

      {activeTab === 'SEEKER' && (
        <div className="pricing-section premium-section">
          {renderSeekerUI()}
        </div>
      )}

      {activeTab === 'OWNER' && (
        <div className="pricing-section premium-section">
          {renderPremiumUI(PREMIUM_UI_DATA, plans.owner)}
        </div>
      )}

      {activeTab === 'AGENCY' && (
        <div className="pricing-section premium-section">
          {renderPremiumUI(AGENCY_UI_DATA, plans.agency)}
        </div>
      )}
    </div>
  );
}
