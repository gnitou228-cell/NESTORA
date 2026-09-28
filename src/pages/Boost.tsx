import { useNavigate } from 'react-router-dom';
import { Rocket, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import type { Plan } from '../config/monetization';
import { MONETIZATION_CONFIG, formatPrice } from '../config/monetization';

export default function Boost() {
  const navigate = useNavigate();

  const handleBoost = (plan: Plan) => {
    navigate('/paiement', { state: { plan, type: 'Boost Annonce' } });
  };

  return (
    <div className="boost-page">
      <div className="text-center mb-4">
        <Rocket size={48} color="#C9A227" style={{ margin: '0 auto 1rem' }} />
        <h1 className="page-title">Boostez vos annonces</h1>
        <p className="page-subtitle text-light" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Un boost augmente considérablement la visibilité de votre annonce dans les résultats de recherche. 
          Idéal pour louer ou vendre rapidement.
        </p>
      </div>

      <div className="pricing-grid">
        {MONETIZATION_CONFIG.boostPlans.map(plan => (
          <div key={plan.id} className={`pricing-card ${plan.isPopular ? 'popular' : ''} ${plan.isBestValue ? 'best-value' : ''}`}>
            {plan.isPopular && <div className="pricing-badge popular-badge">⭐ POPULAIRE</div>}
            {plan.isBestValue && <div className="pricing-badge best-value-badge">💰 MEILLEURE VALEUR</div>}
            
            <div className="pricing-duration">{plan.label}</div>
            <div className="pricing-price">{formatPrice(plan.price)}</div>
            
            <ul className="pricing-features mb-3">
              <li><TrendingUp size={16} className="text-success" /> Jusqu'à 5x plus de vues</li>
              <li><CheckCircle size={16} className="text-success" /> En tête de liste</li>
              <li><Clock size={16} className="text-success" /> Actif {plan.label}</li>
            </ul>

            <button 
              className={`btn btn-block ${plan.isPopular || plan.isBestValue ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleBoost(plan)}
            >
              Acheter ce boost
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
