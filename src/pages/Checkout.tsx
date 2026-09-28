import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import type { Plan } from '../config/monetization';
import { MONETIZATION_CONFIG, formatPrice } from '../config/monetization';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<string>('Orange Money');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'>('IDLE');

  const { plan, type } = location.state as { plan: Plan, type: string } || { plan: null, type: '' };

  if (!plan) {
    return (
      <div className="text-center mt-5">
        <h2>Aucun plan sélectionné</h2>
        <Link to="/tarifs" className="btn btn-primary mt-2">Retour aux tarifs</Link>
      </div>
    );
  }

  const taxAmount = plan.price * MONETIZATION_CONFIG.countries[0].taxRate;
  const total = plan.price + taxAmount;

  const handlePayment = () => {
    setLoading(true);
    setStatus('PENDING');
    
    // Simulate API call and payment processing
    setTimeout(() => {
      setLoading(false);
      setStatus('SUCCESS');
      // In a real app, we would wait for a webhook before showing success
    }, 2500);
  };

  if (status === 'SUCCESS') {
    return (
      <div className="checkout-success text-center">
        <div className="success-icon mb-2">
          <ShieldCheck size={64} color="#10b981" />
        </div>
        <h1 className="mb-1">Paiement Réussi !</h1>
        <p className="text-light mb-3">Votre achat de <strong>{type} - {plan.label}</strong> a été validé avec succès.</p>
        
        <div className="card p-3 mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="d-flex justify-between mb-1">
            <span className="text-light">Référence:</span>
            <strong>#NST-{Math.floor(Math.random() * 1000000)}</strong>
          </div>
          <div className="d-flex justify-between mb-1">
            <span className="text-light">Montant:</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className="d-flex justify-between">
            <span className="text-light">Moyen de paiement:</span>
            <strong>{provider}</strong>
          </div>
        </div>

        <Link to="/" className="btn btn-primary">Retour au tableau de bord</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="mb-3">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
      </div>

      <div className="checkout-grid">
        <div className="checkout-form">
          <div className="card">
            <div className="card-header">
              <h2>Moyen de paiement</h2>
            </div>
            <p className="text-light mb-3">Sélectionnez votre méthode de paiement préférée. Les transactions sont sécurisées.</p>
            
            <div className="payment-providers">
              {MONETIZATION_CONFIG.paymentProviders.map(p => (
                <div 
                  key={p} 
                  className={`provider-card ${provider === p ? 'active' : ''}`}
                  onClick={() => setProvider(p)}
                >
                  <div className="provider-icon">
                    {p === 'Carte Bancaire' ? <CreditCard size={24} /> : <Smartphone size={24} />}
                  </div>
                  <div className="provider-name">{p}</div>
                  <div className="provider-radio">
                    <div className={`radio-inner ${provider === p ? 'checked' : ''}`}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="checkbox-container">
                <input type="checkbox" defaultChecked />
                <span className="checkmark"></span>
                <span className="text-sm">J'accepte les conditions générales de vente et certifie être autorisé à effectuer cet achat.</span>
              </label>
            </div>
          </div>
        </div>

        <div className="checkout-summary">
          <div className="card">
            <div className="card-header">
              <h2>Récapitulatif</h2>
            </div>
            
            <div className="summary-item mb-2">
              <div className="summary-title">{type}</div>
              <div className="summary-desc">Durée : {plan.label}</div>
            </div>

            <hr className="divider my-2" />
            
            <div className="summary-row">
              <span>Sous-total</span>
              <span>{formatPrice(plan.price)}</span>
            </div>
            <div className="summary-row">
              <span>TVA (18%)</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            
            <hr className="divider my-2" />
            
            <div className="summary-total">
              <span>Total à payer</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button 
              className="btn btn-primary btn-block btn-lg mt-4" 
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? (
                <span>Traitement en cours...</span>
              ) : (
                <span><ShieldCheck size={18} /> Payer {formatPrice(total)}</span>
              )}
            </button>
            <div className="secure-payment text-center mt-2">
              <ShieldCheck size={14} className="text-success" /> Paiement 100% sécurisé
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
