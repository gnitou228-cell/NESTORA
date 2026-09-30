import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, X, TrendingUp, Clock, ChevronLeft } from 'lucide-react';
import api from '../lib/api';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export default function BoostModal({ isOpen, onClose, propertyId }: BoostModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [plans, setPlans] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStep(1); // Reset to step 1 when opened
      const fetchPlans = async () => {
        try {
          const response = await api.get('/payments/plans');
          setPlans(response.data.boostPlans || []);
        } catch (error) {
          console.error('Erreur chargement des plans de boost', error);
        }
      };
      fetchPlans();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: any) => {
    navigate('/paiement', { state: { plan, type: 'Boost Annonce', propertyId } });
    onClose();
  };

  const formatDurationText = (duration: number) => {
    if (duration === 1) return '24h';
    return `${duration} jours`;
  };

  return (
    <div className="boost-modal-overlay" onClick={onClose}>
      <div className="boost-modal-content" onClick={e => e.stopPropagation()}>
        <button className="boost-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {step === 1 ? (
          <div className="boost-step-1">
            <div className="boost-icon-container">
              <Rocket size={36} className="boost-rocket-icon" />
            </div>
            <h2 className="boost-title">Boostez votre visibilité</h2>
            <p className="boost-subtitle">
              Apparaissez en priorité dans les recherches et recevez jusqu'à 10x plus de vues sur votre profil
            </p>
            
            <div className="boost-features">
              <span className="boost-feature"><TrendingUp size={16} /> 10x visibilité</span>
              <span className="boost-feature premium-feature">👑 Premium</span>
            </div>

            <button className="btn btn-primary btn-block boost-primary-btn" onClick={() => setStep(2)}>
              <Rocket size={18} style={{ marginRight: '8px' }} /> Acheter un Boost
            </button>
            <button className="btn btn-outline btn-block boost-secondary-btn" onClick={onClose}>
              Plus tard
            </button>
          </div>
        ) : (
          <div className="boost-step-2">
            <h2 className="boost-title-sm">Choisissez votre boost</h2>
            
            <div className="boost-plans-list">
              {plans.map(plan => (
                <div key={plan.id} className="boost-plan-card" onClick={() => handleSelectPlan(plan)}>
                  <div className="boost-plan-left">
                    <span className="boost-plan-name">{plan.name}</span>
                    <span className="boost-plan-duration"><Clock size={14} /> {formatDurationText(plan.duration)}</span>
                  </div>
                  <div className="boost-plan-right">
                    <span className="boost-plan-price">{plan.price} F</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="boost-back-btn" onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
