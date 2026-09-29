import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useSearchParams } from 'react-router-dom';
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [country, setCountry] = useState('BF');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');
  const urlPaymentId = searchParams.get('payment_id');

  const { plan, type, propertyId } = location.state as { plan: any, type: string, propertyId?: string } || { plan: null, type: '' };

  useEffect(() => {
    if (urlStatus === 'success' && urlPaymentId) {
      setStatus('SUCCESS');
      setPaymentResult({ paymentId: urlPaymentId });
    } else if (urlStatus === 'canceled') {
      setStatus('FAILED');
      setErrorMessage('Le paiement a été annulé.');
    }
  }, [urlStatus, urlPaymentId]);

  if (!plan && status !== 'SUCCESS') {
    return (
      <div className="text-center mt-5">
        <h2>Aucun plan sélectionné</h2>
        <Link to="/tarifs" className="btn btn-primary mt-2">Retour aux tarifs</Link>
      </div>
    );
  }

  // Define payment type internally based on context
  const paymentType = type?.toLowerCase().includes('boost') ? 'BOOST' : 'SUBSCRIPTION';

  let taxRate = 0.18;
  if (country === 'FR') taxRate = 0.20;
  
  const taxAmount = (plan?.price || 0) * taxRate;
  const total = (plan?.price || 0) + taxAmount;

  const handlePayment = async () => {
    if (!firstName || !lastName || !email) {
      setErrorMessage('Veuillez remplir vos informations.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    
    try {
      const selectedProvider = provider === 'Carte Bancaire' ? 'Stripe' : provider;
      // 1. Initialiser le paiement côté serveur (sécurisé)
      const initResponse = await api.post('/payments/checkout', {
        type: paymentType,
        planId: plan.id,
        propertyId,
        provider: selectedProvider,
        customerDetails: { firstName, lastName, email, country }
      });
      
      const { paymentId, url } = initResponse.data;
      
      if (url) {
        // Redirection vers Stripe
        window.location.href = url;
        return;
      }

      setStatus('PENDING');

      // 2. Simuler le traitement par le fournisseur (car on n'a pas encore la vraie API OrangeMoney)
      setTimeout(async () => {
        try {
          // Simulation du Webhook
          await api.post(`/payments/webhook/${selectedProvider.toLowerCase().replace(/ /g, '')}`, {
            paymentId,
            status: 'SUCCESS',
            providerTransactionId: 'TXN-' + Math.floor(Math.random() * 100000000)
          });
          
          setStatus('SUCCESS');
          setPaymentResult({ paymentId, total });
          setShowPaymentModal(false);
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

  const getPaymentProviders = () => {
    switch (country) {
      case 'BF': return ['Orange Money', 'Moov Money', 'Carte Bancaire'];
      case 'CI': return ['Orange Money', 'MTN Mobile Money', 'Wave', 'Carte Bancaire'];
      case 'SN': return ['Orange Money', 'Wave', 'Carte Bancaire'];
      case 'ML': return ['Orange Money', 'Moov Money', 'Sama Money', 'Carte Bancaire'];
      case 'FR': return ['Carte Bancaire'];
      default: return ['Carte Bancaire'];
    }
  };

  const availableProviders = getPaymentProviders();
  // Ensure selected provider is valid for country
  useEffect(() => {
    if (!availableProviders.includes(provider)) {
      setProvider(availableProviders[0]);
    }
  }, [country, availableProviders, provider]);


  if (status === 'SUCCESS') {
    return (
      <div className="checkout-success text-center">
        <div className="success-icon mb-2">
          <ShieldCheck size={64} color="#10b981" />
        </div>
        <h1 className="mb-1">Paiement Réussi !</h1>
        <p className="text-light mb-3">Votre achat de <strong>{plan.name}</strong> a été validé avec succès.</p>
        
        <div className="card p-3 mb-3" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
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

      <div className="checkout-grid" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="checkout-summary" style={{ maxWidth: '500px', width: '100%' }}>
          <div className="card">
            <div className="card-header text-center border-bottom pb-3 mb-3">
              <h2>Récapitulatif de votre commande</h2>
              <p className="text-light mt-1">Veuillez vérifier les détails avant de payer.</p>
            </div>
            
            <div className="summary-item mb-3 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
              <div className="summary-title" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{type === 'BOOST' ? 'Boost Annonce' : 'Abonnement'}</div>
              <div className="summary-desc" style={{ color: 'var(--color-primary)' }}>Plan : {plan.name}</div>
            </div>

            <hr className="divider my-2" />
            
            <div className="summary-row" style={{ fontSize: '1.1rem' }}>
              <span>Sous-total HT</span>
              <span>{formatPrice(plan.price, plan.currency)}</span>
            </div>
            <div className="summary-row text-light">
              <span>TVA estimée</span>
              <span>Calculée à l'étape suivante</span>
            </div>
            
            <hr className="divider my-2" />
            
            <div className="summary-total" style={{ fontSize: '1.4rem' }}>
              <span>Total à payer</span>
              <span>{formatPrice(plan.price, plan.currency)} <small className="text-sm text-light">HT</small></span>
            </div>

            <button 
              className="btn btn-primary btn-block btn-lg mt-4" 
              onClick={() => setShowPaymentModal(true)}
              style={{ padding: '1rem', fontSize: '1.1rem' }}
            >
              <span>Continuer vers le paiement</span>
            </button>
            
            <div className="secure-payment text-center mt-3 text-sm">
              <ShieldCheck size={16} className="text-success" style={{ verticalAlign: 'middle', marginRight: '4px' }} /> 
              Paiement 100% sécurisé et chiffré
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 9999, padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}
            >
              &times;
            </button>
            
            <div className="text-center mb-4">
              <h2>Finalisez votre paiement</h2>
              <p className="text-light">Sélectionnez votre pays pour voir les modes de paiement disponibles.</p>
            </div>

            {errorMessage && (
              <div className="alert alert-danger mb-3">
                {errorMessage}
              </div>
            )}

            <div className="form-group mb-3">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Pays de facturation</label>
              <select className="form-control" value={country} onChange={e => setCountry(e.target.value)}>
                <option value="BF">Burkina Faso (TVA 18%)</option>
                <option value="CI">Côte d'Ivoire (TVA 18%)</option>
                <option value="SN">Sénégal (TVA 18%)</option>
                <option value="ML">Mali (TVA 18%)</option>
                <option value="FR">France (TVA 20%)</option>
              </select>
            </div>
            
            <div className="d-flex mb-3" style={{ gap: '1rem' }}>
              <div className="form-group flex-1">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Prénom</label>
                <input type="text" className="form-control" placeholder="Votre prénom" value={firstName} onChange={e => setFirstName(e.target.value)} required />
              </div>
              <div className="form-group flex-1">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nom</label>
                <input type="text" className="form-control" placeholder="Votre nom" value={lastName} onChange={e => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group mb-4">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Adresse Email</label>
              <input type="email" className="form-control" placeholder="Email pour la facture" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <hr className="divider mb-4" />
            
            <h3 className="mb-3">Moyens de paiement disponibles</h3>
            <div className="payment-providers mb-4">
              {availableProviders.map(p => (
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

            <div className="summary-total mb-4 p-3" style={{ backgroundColor: 'var(--color-secondary)', borderRadius: '8px' }}>
              <span>Total TTC ({taxRate * 100}% TVA)</span>
              <span>{formatPrice(total, plan.currency)}</span>
            </div>

            <button 
              className="btn btn-primary btn-block btn-lg" 
              onClick={handlePayment}
              disabled={loading || status === 'PENDING' || !firstName || !lastName || !email}
            >
              {loading ? (
                <span>Traitement en cours...</span>
              ) : (
                <span><ShieldCheck size={18} /> Confirmer et Payer {formatPrice(total, plan.currency)}</span>
              )}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .form-control { 
          width: 100%; 
          padding: 0.75rem; 
          border: 1px solid var(--color-border); 
          border-radius: var(--border-radius-sm); 
          font-family: inherit; 
          font-size: 0.95rem; 
          margin-top: 0.25rem; 
          background-color: white;
        }
        .form-control:focus { 
          outline: none; 
          border-color: var(--color-primary); 
          box-shadow: 0 0 0 2px rgba(11, 31, 58, 0.1); 
        }
      `}</style>
    </div>
  );
}
