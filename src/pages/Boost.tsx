import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Rocket, TrendingUp, CheckCircle, Clock, ArrowLeft, Loader } from 'lucide-react';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';

export default function Boost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/payments/plans');
        setPlans(response.data.boostPlans || []);
      } catch (error) {
        console.error('Erreur chargement des plans de boost', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleBoost = (plan: any) => {
    if (!propertyId) {
      alert("Veuillez sélectionner une annonce à booster depuis vos annonces.");
      navigate('/mes-annonces');
      return;
    }
    navigate('/paiement', { state: { plan, type: 'Boost Annonce', propertyId } });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Loader className="spin" size={40} color="#C9A227" />
      </div>
    );
  }

  return (
    <div className="boost-page">
      <Link to="/mes-annonces" className="btn btn-outline mb-4 d-inline-flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
        <ArrowLeft size={16} /> Retour à mes annonces
      </Link>
      
      <div className="text-center mb-4">
        <Rocket size={48} color="#C9A227" style={{ margin: '0 auto 1rem' }} />
        <h1 className="page-title">Boostez vos annonces</h1>
        <p className="page-subtitle text-light" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Un boost augmente considérablement la visibilité de votre annonce dans les résultats de recherche. 
          Idéal pour louer ou vendre rapidement.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map(plan => (
          <div key={plan.id} className={`pricing-card ${plan.name.includes('Premium') ? 'popular' : ''}`}>
            {plan.name.includes('Premium') && <div className="pricing-badge popular-badge">⭐ POPULAIRE</div>}
            
            <div className="pricing-duration">{plan.name}</div>
            <div className="pricing-price">{formatPrice(plan.price, plan.currency)}</div>
            
            <ul className="pricing-features mb-3">
              <li><TrendingUp size={16} className="text-success" /> Jusqu'à 5x plus de vues</li>
              <li><CheckCircle size={16} className="text-success" /> En tête de liste</li>
              <li><Clock size={16} className="text-success" /> Actif {plan.duration} jours</li>
            </ul>

            <button 
              className={`btn btn-block ${plan.name.includes('Premium') || plan.name.includes('VIP') ? 'btn-primary' : 'btn-outline'}`}
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
