import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Rocket, TrendingUp, Crown, Clock, ChevronLeft } from 'lucide-react';
import api from '../lib/api';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string | null;
}

export default function BoostModal({ isOpen, onClose, propertyId }: BoostModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await api.get('/payments/plans');
      setPlans(response.data.boostPlans || []);
    } catch (error) {
      console.error('Erreur chargement des plans de boost', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan: any) => {
    if (!propertyId) {
      alert("Erreur: ID de l'annonce manquant.");
      return;
    }
    // Redirect to checkout
    onClose();
    navigate('/paiement', { state: { plan, type: 'Boost Annonce', propertyId } });
  };

  if (!isOpen) return null;

  return (
    <div className="boost-modal-overlay" onClick={onClose}>
      <div className="boost-modal-content" onClick={e => e.stopPropagation()}>
        <button className="boost-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {step === 1 && (
          <div className="boost-modal-step1">
            <div className="boost-modal-icon-wrapper">
              <Rocket size={32} />
            </div>
            <h3 className="boost-modal-title">Boostez votre visibilité</h3>
            <p className="boost-modal-text">
              Apparaissez en priorité dans les recherches et recevez jusqu'à 10x plus de vues sur votre profil
            </p>
            
            <div className="boost-modal-badges">
              <div className="boost-modal-badge">
                <TrendingUp size={16} /> 10x visibilité
              </div>
              <div className="boost-modal-badge gold">
                <Crown size={16} /> Premium
              </div>
            </div>

            <button 
              className="boost-modal-btn-primary"
              onClick={() => setStep(2)}
            >
              <Rocket size={18} /> Acheter un Boost
            </button>
            <button 
              className="boost-modal-btn-secondary"
              onClick={onClose}
            >
              Plus tard
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="boost-modal-step2">
            <h3 className="boost-modal-step2-title">Choisissez votre boost</h3>
            
            <div className="boost-plans-container">
              {loading ? (
                <div style={{ padding: '20px' }}>Chargement...</div>
              ) : (
                plans.map(plan => (
                  <div 
                    key={plan.id} 
                    className="boost-plan-card"
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <div>
                      <div className="boost-plan-name">{plan.name}</div>
                      <div className="boost-plan-duration">
                        <Clock size={12} /> {plan.duration} {plan.duration > 1 ? 'jours' : 'jour'}
                      </div>
                    </div>
                    <div className="boost-plan-price">
                      {plan.price} F
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="boost-modal-back" onClick={() => setStep(1)}>
              <ChevronLeft size={16} /> Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
