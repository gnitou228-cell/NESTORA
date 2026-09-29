import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';

export default function Pricing() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState(role || 'SEEKER');
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState<any>({ seeker: [], owner: [], agency: [] });
  const [loading, setLoading] = useState(true);

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

  const renderPlanCard = (plan: any, type: string) => {
    const features = plan.features ? JSON.parse(plan.features) : [];
    
    return (
      <div 
        key={plan.id} 
        className={`pricing-card ${plan.popular ? 'popular' : ''}`}
      >
        {plan.popular && <div className="pricing-badge popular-badge"><Star size={14} fill="currentColor" /> POPULAIRE</div>}
        
        <div className="pricing-duration">{plan.name}</div>
        <div className="pricing-price">{formatPrice(plan.price, plan.currency)}</div>
        
        <ul className="pricing-features">
          {features.map((feature: string, idx: number) => (
            <li key={idx}><Check size={16} className="text-success" /> {feature}</li>
          ))}
        </ul>
        
        <button 
          className={`btn btn-block ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleSelectPlan(plan, type)}
        >
          Choisir ce plan
        </button>
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
            <h2>Avantages Premium Chercheur</h2>
            <p>Accédez en avant-première aux annonces et augmentez vos chances de trouver.</p>
          </div>
          <div className="pricing-grid">
            {plans.seeker.map((plan: any) => 
              renderPlanCard(plan, 'Abonnement Chercheur')
            )}
          </div>
        </div>
      )}

      {activeTab === 'OWNER' && (
        <div className="pricing-section">
          <div className="section-header text-center mb-3">
            <h2>Abonnement Propriétaire</h2>
            <p>Mettez en location ou en vente votre propriété avec une visibilité maximale.</p>
          </div>
          <div className="pricing-grid">
            {plans.owner.map((plan: any) => 
              renderPlanCard(plan, 'Abonnement Propriétaire')
            )}
          </div>
        </div>
      )}

      {activeTab === 'AGENCY' && (
        <div className="pricing-section">
          <div className="section-header text-center mb-3">
            <h2>Abonnement Professionnel Agence</h2>
            <p>La solution complète pour gérer votre portefeuille immobilier et vos agents.</p>
          </div>
          
          <div className="agency-plans-container">
            <div className="pricing-grid">
                {plans.agency.map((plan: any) => 
                  renderPlanCard(plan, 'Abonnement Agence')
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
