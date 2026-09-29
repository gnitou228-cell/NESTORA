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

  const total = plan?.price || 0;

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
        
        <div className="card p-3 mb-3" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left', border: '1px solid var(--color-border)' }}>
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
    <div className="checkout-page" style={{ padding: '2rem 1rem' }}>
      <div className="mb-3">
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>
      </div>

      <div className="checkout-grid" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="checkout-summary" style={{ maxWidth: '450px', width: '100%' }}>
          <div className="card" style={{ padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: 'none', borderRadius: '12px' }}>
            <div className="text-center mb-4">
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', backgroundColor: 'rgba(201, 162, 39, 0.1)', color: 'var(--color-accent)', borderRadius: '50%', marginBottom: '1rem' }}>
                <CreditCard size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Récapitulatif de commande</h2>
              <p className="text-light text-sm">Veuillez vérifier les détails avant de valider votre paiement.</p>
            </div>
            
            <div className="summary-item mb-4 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px' }}>
              <div className="d-flex justify-between align-center mb-1">
                <span className="text-light text-sm">{type === 'BOOST' ? 'Type' : 'Abonnement'}</span>
                <span style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{type === 'BOOST' ? 'Boost Annonce' : 'Forfait Pro'}</span>
              </div>
              <div className="d-flex justify-between align-center">
                <span className="text-light text-sm">Plan choisi</span>
                <span style={{ fontWeight: '600' }}>{plan.name}</span>
              </div>
            </div>

            <hr className="divider my-3" />
            
            <div className="summary-total d-flex justify-between align-center" style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
              <span>Total à payer</span>
              <span>{formatPrice(plan.price, plan.currency)}</span>
            </div>

            <button 
              className="btn btn-primary btn-block mt-4" 
              onClick={() => setShowPaymentModal(true)}
              style={{ padding: '1.2rem', fontSize: '1.1rem', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              <span>Payer maintenant</span>
            </button>
            
            <div className="secure-payment text-center mt-3 text-sm text-light">
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
          justifyContent: 'center', zIndex: 9999, padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', borderRadius: '12px', padding: '2rem' }}>
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#333' }}
            >
              &times;
            </button>
            
            <div className="text-center mb-4">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Validez votre paiement</h2>
              <p className="text-light text-sm">Veuillez remplir vos informations et choisir votre méthode de paiement.</p>
            </div>

            {errorMessage && (
              <div className="alert alert-danger mb-3" style={{ borderRadius: '8px' }}>
                {errorMessage}
              </div>
            )}

            <div className="form-group mb-3">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Pays de facturation</label>
              <select className="form-control" value={country} onChange={e => setCountry(e.target.value)} style={{ padding: '0.8rem', borderRadius: '8px' }}>
                <option value="BF">Burkina Faso</option>
                <option value="CI">Côte d'Ivoire</option>
                <option value="SN">Sénégal</option>
                <option value="ML">Mali</option>
                <option value="FR">France</option>
              </select>
            </div>
            
            <div className="d-flex mb-3" style={{ gap: '1rem' }}>
              <div className="form-group flex-1">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Prénom</label>
                <input type="text" className="form-control" placeholder="Votre prénom" value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px' }} />
              </div>
              <div className="form-group flex-1">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Nom</label>
                <input type="text" className="form-control" placeholder="Votre nom" value={lastName} onChange={e => setLastName(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px' }} />
              </div>
            </div>
            <div className="form-group mb-4">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Adresse Email</label>
              <input type="email" className="form-control" placeholder="Email pour le reçu" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '8px' }} />
            </div>

            <hr className="divider mb-4" style={{ borderColor: 'rgba(0,0,0,0.05)' }} />
            
            <h3 className="mb-3" style={{ fontSize: '1.2rem' }}>Choisissez votre moyen de paiement</h3>
            <div className="payment-providers mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {availableProviders.map(p => (
                <div 
                  key={p} 
                  className={`provider-card ${provider === p ? 'active' : ''}`}
                  onClick={() => setProvider(p)}
                  style={{ 
                    border: provider === p ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    backgroundColor: provider === p ? 'rgba(201, 162, 39, 0.05)' : 'white'
                  }}
                >
                  <div className="provider-icon mb-2" style={{ color: provider === p ? 'var(--color-accent)' : '#666' }}>
                    {p === 'Carte Bancaire' ? <CreditCard size={32} /> : <Smartphone size={32} />}
                  </div>
                  <div className="provider-name" style={{ fontWeight: provider === p ? '600' : '400', fontSize: '0.9rem', textAlign: 'center' }}>{p}</div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-primary btn-block btn-lg" 
              onClick={handlePayment}
              disabled={loading || status === 'PENDING' || !firstName || !lastName || !email}
              style={{ padding: '1rem', borderRadius: '8px', fontSize: '1.1rem' }}
            >
              {loading ? (
                <span>Traitement en cours...</span>
              ) : (
                <span><ShieldCheck size={18} /> Confirmer et payer {formatPrice(total, plan.currency)}</span>
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
