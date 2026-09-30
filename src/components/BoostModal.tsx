import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, X, TrendingUp, Clock, ChevronLeft, Crown } from 'lucide-react';
import api from '../lib/api';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export default function BoostModal({ isOpen, onClose, propertyId }: BoostModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [plans, setPlans] = useState<any[]>([]);
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

  const handleSelectPlan = async (plan: any) => {
    if (!propertyId) {
      setSelectedPlan(plan);
      setStep(3);
      try {
        const response = await api.get('/properties/my');
        setUserProperties(response.data || []);
      } catch (err) {
        console.error('Erreur chargement annonces', err);
      }
      return;
    }
    navigate('/paiement', { state: { plan, type: 'Boost Annonce', propertyId } });
  };

  const handleSelectProperty = (propId: string) => {
    navigate('/paiement', { state: { plan: selectedPlan, type: 'Boost Annonce', propertyId: propId } });
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
              <span className="boost-feature premium-feature"><Crown size={16} /> Premium</span>
            </div>

            <button className="btn btn-primary btn-block boost-primary-btn" onClick={() => setStep(2)}>
              <Rocket size={18} style={{ marginRight: '8px' }} /> Acheter un Boost
            </button>
            <button className="btn btn-outline btn-block boost-secondary-btn" onClick={onClose}>
              Plus tard
            </button>
          </div>
        ) : step === 2 ? (
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
        ) : (
          <div className="boost-step-3">
            <h2 className="boost-title-sm">Sélectionnez l'annonce</h2>
            
            <div className="boost-plans-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {userProperties.length === 0 ? (
                <p className="text-center text-light" style={{ padding: '2rem 0' }}>Aucune annonce disponible.</p>
              ) : (
                userProperties.map(prop => (
                  <div key={prop.id} className="boost-plan-card" onClick={() => handleSelectProperty(prop.id)} style={{ alignItems: 'flex-start' }}>
                    <img 
                      src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'} 
                      alt="" 
                      style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', marginRight: '1rem' }} 
                    />
                    <div className="boost-plan-left" style={{ flex: 1, overflow: 'hidden' }}>
                      <span className="boost-plan-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</span>
                      <span className="boost-plan-duration" style={{ fontSize: '0.8rem' }}>{prop.city?.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button className="boost-back-btn" onClick={() => setStep(2)}>
              <ChevronLeft size={16} /> Retour
            </button>
          </div>
        )}
      </div>
      <style>{`
        .boost-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .boost-modal-content {
          background: #fff;
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          max-width: 450px;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .boost-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #f1f5f9;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: background 0.2s;
        }
        .boost-modal-close:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .boost-step-1 {
          text-align: center;
        }
        .boost-icon-container {
          background: #d1fae5;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .boost-rocket-icon {
          color: #059669;
        }
        .boost-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .boost-subtitle {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          padding: 0 1rem;
        }
        .boost-features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .boost-feature {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #059669;
          font-weight: 500;
          font-size: 0.9rem;
        }
        .premium-feature {
          color: #d97706;
        }
        .boost-primary-btn {
          background-color: #059669;
          border-color: #059669;
          color: #fff;
          font-size: 1.1rem;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .boost-primary-btn:hover {
          background-color: #047857;
          border-color: #047857;
        }
        .boost-secondary-btn {
          background-color: #fff;
          border: 1px solid #cbd5e1;
          color: #64748b;
          font-size: 1rem;
          padding: 1rem;
          border-radius: 12px;
        }
        .boost-secondary-btn:hover {
          background-color: #f8fafc;
        }
        .boost-title-sm {
          font-size: 1.25rem;
          font-weight: 700;
          text-align: center;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        .boost-plans-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .boost-plan-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .boost-plan-card:hover {
          border-color: #059669;
          background-color: #f0fdf4;
        }
        .boost-plan-left {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .boost-plan-name {
          font-weight: 600;
          color: #0f172a;
          font-size: 1.05rem;
        }
        .boost-plan-duration {
          color: #64748b;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .boost-plan-price {
          font-weight: 700;
          color: #059669;
          font-size: 1.1rem;
        }
        .boost-back-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 0.5rem;
          padding: 0.5rem;
          cursor: pointer;
        }
        .boost-back-btn:hover {
          color: #0f172a;
        }
      `}</style>
    </div>
  );
}
