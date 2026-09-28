import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Plan } from '../config/monetization';
import { MONETIZATION_CONFIG, formatPrice } from '../config/monetization';

export default function Pricing() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState(role);
  const navigate = useNavigate();

  const handleSelectPlan = (plan: Plan, type: string) => {
    // Navigate to checkout with plan details in state
    navigate('/paiement', { state: { plan, type } });
  };

  const renderPlanCard = (plan: Plan, type: string, features: string[]) => {
    return (
      <div 
        key={plan.id} 
        className={`pricing-card ${plan.isPopular ? 'popular' : ''} ${plan.isBestValue ? 'best-value' : ''}`}
      >
        {plan.isPopular && <div className="pricing-badge popular-badge"><Star size={14} fill="currentColor" /> POPULAIRE</div>}
        {plan.isBestValue && <div className="pricing-badge best-value-badge">💰 MEILLEURE VALEUR</div>}
        
        <div className="pricing-duration">{plan.label}</div>
        <div className="pricing-price">{formatPrice(plan.price)}</div>
        
        <ul className="pricing-features">
          {features.map((feature, idx) => (
            <li key={idx}><Check size={16} className="text-success" /> {feature}</li>
          ))}
        </ul>
        
        <button 
          className={`btn btn-block ${plan.isPopular || plan.isBestValue ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectPlan(plan, type)}
        >
          Choisir ce plan
        </button>
      </div>
    );
  };

  return (
    <div className="pricing-page">
      <div className="text-center mb-4">
        <h1 className="page-title">Tarifs & Monétisation</h1>
        <p className="page-subtitle">Choisissez le plan adapté à vos besoins immobiliers.</p>
      </div>

      <div className="tabs-container">
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
        <div className="pricing-section">
          <div className="section-header text-center mb-3">
            <h2>Publier une demande de logement</h2>
            <p>Trouvez la perle rare en publiant votre recherche (ex: Maison 2 chambres, budget 150k FCFA).</p>
          </div>
          <div className="pricing-grid">
            {MONETIZATION_CONFIG.chercheurPlans.map(plan => 
              renderPlanCard(plan, 'Demande de logement', [
                'Publication immédiate',
                'Visibilité auprès des propriétaires',
                'Alertes e-mail'
              ])
            )}
          </div>
        </div>
      )}

      {activeTab === 'OWNER' && (
        <div className="pricing-section">
          <div className="section-header text-center mb-3">
            <h2>Publier un bien</h2>
            <p>Mettez en location ou en vente votre propriété rapidement.</p>
          </div>
          <div className="pricing-grid">
            {MONETIZATION_CONFIG.proprietairePlans.map(plan => 
              renderPlanCard(plan, 'Annonce immobilière', [
                'Photos haute qualité',
                'Contact direct locataires/acheteurs',
                'Statistiques de vues',
                'Support prioritaire'
              ])
            )}
          </div>
        </div>
      )}

      {activeTab === 'AGENCY' && (
        <div className="pricing-section">
          <div className="section-header text-center mb-3">
            <h2>Abonnement Professionnel</h2>
            <p>La solution complète pour gérer votre portefeuille immobilier.</p>
          </div>
          
          <div className="agency-plans-container">
            <div className="agency-tier">
              <h3 className="tier-name">STARTER</h3>
              <p className="tier-desc">Jusqu'à 10 annonces actives</p>
              <div className="pricing-grid mini-grid">
                {MONETIZATION_CONFIG.agencePlans.starter.map(plan => 
                  renderPlanCard(plan, 'Abonnement Agence - STARTER', ['10 annonces actives', '1 agent', 'Support basique'])
                )}
              </div>
            </div>
            
            <div className="agency-tier highlight-tier">
              <div className="tier-badge"><Crown size={16} /> POPULAIRE</div>
              <h3 className="tier-name">PRO</h3>
              <p className="tier-desc">Jusqu'à 50 annonces actives</p>
              <div className="pricing-grid mini-grid">
                {MONETIZATION_CONFIG.agencePlans.pro.map(plan => 
                  renderPlanCard(plan, 'Abonnement Agence - PRO', ['50 annonces actives', '5 agents', 'Support prioritaire'])
                )}
              </div>
            </div>

            <div className="agency-tier">
              <h3 className="tier-name">BUSINESS</h3>
              <p className="tier-desc">Annonces illimitées</p>
              <div className="pricing-grid mini-grid">
                {MONETIZATION_CONFIG.agencePlans.business.map(plan => 
                  renderPlanCard(plan, 'Abonnement Agence - BUSINESS', ['Annonces illimitées', 'Agents illimités', 'API & Intégrations'])
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
