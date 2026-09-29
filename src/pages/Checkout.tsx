import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<string>('Orange Money');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { plan, type, propertyId } = location.state as { plan: any, type: string, propertyId?: string } || { plan: null, type: '' };

  if (!plan) {
    return (
      <div className="text-center mt-5">
        <h2>Aucun plan sélectionné</h2>
        <Link to="/tarifs" className="btn btn-primary mt-2">Retour aux tarifs</Link>
      </div>
    );
  }

  // Define payment type internally based on context
  const paymentType = type.toLowerCase().includes('boost') ? 'BOOST' : 'SUBSCRIPTION';

  const taxAmount = plan.price * 0.18; // 18% tax
  const total = plan.price + taxAmount;

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      // 1. Initialiser le paiement côté serveur (sécurisé)
      const initResponse = await api.post('/payments/checkout', {
        type: paymentType,
        planId: plan.id,
        propertyId,
        provider
      });
      
      const { paymentId } = initResponse.data;
      setStatus('PENDING');

      // 2. Simuler le traitement par le fournisseur (car on n'a pas encore la vraie API OrangeMoney)
      setTimeout(async () => {
        try {
          // Simulation du Webhook
          await api.post(`/payments/webhook/${provider.toLowerCase().replace(' ', '')}`, {
            paymentId,
            status: 'SUCCESS',
            providerTransactionId: 'TXN-' + Math.floor(Math.random() * 100000000)
          });
          
          setStatus('SUCCESS');
          setPaymentResult({ paymentId, total });
        } catch (webhookErr) {
          console.error(webhookErr);
          setStatus('FAILED');
          setErrorMessage('Erreur lors de la confirmation du paiement.');
        } finally {
          setLoading(false);
        }
      }, 3000);

    } catch (error: any) {
      console.error(error);
      setLoading(false);
      setStatus('FAILED');
      setErrorMessage(error.response?.data?.error || 'Erreur lors de l\'initialisation du paiement');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="checkout-success text-center">
        <div className="success-icon mb-2">
          <ShieldCheck size={64} color="#10b981" />
        </div>
        <h1 className="mb-1">Paiement Réussi !</h1>
        <p className="text-light mb-3">Votre achat de <strong>{plan.name}</strong> a été validé avec succès.</p>
        
        <div className="card p-3 mb-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="d-flex justify-between mb-1">
            <span className="text-light">Référence:</span>
            <strong>{paymentResult?.paymentId?.substring(0, 8).toUpperCase()}</strong>
          </div>
          <div className="d-flex justify-between mb-1">
            <span className="text-light">Montant:</span>
            <strong>{formatPrice(total, plan.currency)}</strong>
          </div>
          <div className="d-flex justify-between">
            <span className="text-light">Moyen de paiement:</span>
            <strong>{provider}</strong>
          </div>
        </div>

        <Link to="/dashboard" className="btn btn-primary">Retour au tableau de bord</Link>
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
            <p className="text-light mb-3">Sélectionnez votre méthode de paiement préférée. (Mode simulation actif)</p>
            
            {errorMessage && (
              <div className="alert alert-danger mb-3">
                {errorMessage}
              </div>
            )}
            
            <div className="payment-providers">
              {['Orange Money', 'Moov Money', 'MTN Mobile Money', 'Wave', 'Carte Bancaire'].map(p => (
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
              <div className="summary-desc">Plan : {plan.name}</div>
            </div>

            <hr className="divider my-2" />
            
            <div className="summary-row">
              <span>Sous-total</span>
              <span>{formatPrice(plan.price, plan.currency)}</span>
            </div>
            <div className="summary-row">
              <span>TVA (18%)</span>
              <span>{formatPrice(taxAmount, plan.currency)}</span>
            </div>
            
            <hr className="divider my-2" />
            
            <div className="summary-total">
              <span>Total à payer</span>
              <span>{formatPrice(total, plan.currency)}</span>
            </div>

            <button 
              className="btn btn-primary btn-block btn-lg mt-4" 
              onClick={handlePayment}
              disabled={loading || status === 'PENDING'}
            >
              {loading ? (
                <span>Traitement en cours...</span>
              ) : (
                <span><ShieldCheck size={18} /> Payer {formatPrice(total, plan.currency)}</span>
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
