import { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Rocket, Star, Gift, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';

const AFRICAN_COUNTRIES = [
  { code: 'TG', name: '🇹🇬 Togo', dialCode: '+228' },
  { code: 'BF', name: '🇧🇫 Burkina Faso', dialCode: '+226' },
  { code: 'CI', name: '🇨🇮 Côte d\'Ivoire', dialCode: '+225' },
  { code: 'SN', name: '🇸🇳 Sénégal', dialCode: '+221' },
  { code: 'ML', name: '🇲🇱 Mali', dialCode: '+223' },
  { code: 'BJ', name: '🇧🇯 Bénin', dialCode: '+229' },
  { code: 'CM', name: '🇨🇲 Cameroun', dialCode: '+237' },
  { code: 'FR', name: '🇫🇷 France', dialCode: '+33' },
];

const ProviderLogo = ({ provider }: { provider: string }) => {
  let bg = '#f0f0f0';
  let color = '#333';
  let text = '';
  let src = '';

  if (provider.includes('Orange')) {
    src = 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg';
  } else if (provider.includes('MTN')) {
    src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/MTN_Logo.svg';
  } else if (provider.includes('Moov')) {
    bg = '#E35C14'; color = '#FFF'; text = 'moov';
  } else if (provider.includes('Wave')) {
    src = 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Wave_logo.svg';
  } else if (provider.includes('Mixx')) {
    bg = '#0A2540'; color = '#F2C94C'; text = 'mixx';
  } else if (provider.includes('Carte')) {
    bg = '#2196F3'; color = '#FFF'; text = 'carte';
  } else if (provider.includes('Crypto')) {
    bg = '#8E24AA'; color = '#FFF'; text = 'crypto';
  }

  if (src) {
    return (
      <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
        <img src={src} alt={provider} style={{ width: 30, height: 30, objectFit: 'contain' }} />
      </div>
    );
  }

  if (text) {
    return (
      <div style={{ width: 40, height: 40, backgroundColor: bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>
        {text}
      </div>
    );
  }

  return (
    <div style={{ width: 40, height: 40, backgroundColor: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
      <ShieldCheck size={20} />
    </div>
  );
};

export default function Checkout() {
  const location = useLocation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('TG');
  const [discountCode, setDiscountCode] = useState('');

  // Payment State
  const [modalStep, setModalStep] = useState<'HIDDEN' | 'SELECT_PROVIDER' | 'ENTER_PHONE'>('HIDDEN');
  const [provider, setProvider] = useState<string>('');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes (600s)
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [searchParams] = useSearchParams();
  const urlStatus = searchParams.get('status');
  const urlPaymentId = searchParams.get('payment_id');

  const { plan, type, propertyId } = location.state as { plan: any, type: string, propertyId?: string } || { plan: null, type: '' };

  useEffect(() => {
    if (urlStatus === 'success' && urlPaymentId) {
      setStatus('SUCCESS');
    } else if (urlStatus === 'canceled') {
      setStatus('FAILED');
      setErrorMessage('Le paiement a été annulé.');
    }
  }, [urlStatus, urlPaymentId]);

  // Countdown timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (modalStep === 'ENTER_PHONE' && countdown > 0 && !loading && status !== 'SUCCESS') {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (countdown === 0 && modalStep === 'ENTER_PHONE') {
      setModalStep('HIDDEN');
      setErrorMessage('Temps de paiement expiré. Veuillez recommencer.');
    }
    return () => clearInterval(timer);
  }, [modalStep, countdown, loading, status]);

  if (!plan && status !== 'SUCCESS') {
    return (
      <div className="text-center mt-5">
        <h2>Aucun plan sélectionné</h2>
        <Link to="/tarifs" className="btn btn-primary mt-2">Retour aux tarifs</Link>
      </div>
    );
  }

  const paymentType = type?.toLowerCase().includes('boost') ? 'BOOST' : 'SUBSCRIPTION';
  const total = plan?.price || 0;

  const validateAndProceed = () => {
    if (!firstName || !lastName || !email || !phone) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    setErrorMessage('');
    setPaymentPhone(phone); // auto-fill payment phone with contact phone
    setModalStep('SELECT_PROVIDER');
  };

  const selectProviderAndContinue = (p: string) => {
    setProvider(p);
    setCountdown(600); // reset countdown
    setModalStep('ENTER_PHONE');
  };

  const handlePayment = async () => {
    if (!paymentPhone && !provider.includes('Carte') && !provider.includes('Crypto')) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    
    try {
      const selectedProvider = provider.includes('Carte') ? 'Stripe' : 'SaasPay';
      const initResponse = await api.post('/payments/checkout', {
        type: paymentType,
        planId: plan.id,
        propertyId,
        provider: selectedProvider,
        customerDetails: { firstName, lastName, email, country, phone: paymentPhone }
      });
      
      const { paymentId, url } = initResponse.data;
      
      if (url) {
        window.location.href = url;
        return;
      }

      setStatus('PENDING');

      // Simulate webhook for mobile money
      setTimeout(async () => {
        try {
          await api.post(`/payments/webhook/${selectedProvider.toLowerCase().replace(/ /g, '')}`, {
            paymentId,
            status: 'SUCCESS',
            providerTransactionId: 'TXN-' + Math.floor(Math.random() * 100000000)
          });
          
          setStatus('SUCCESS');
          setModalStep('HIDDEN');
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
      case 'TG': return ['Mixx par Yas', 'L\'argent Moov', 'Carte', 'Cryptomonnaies'];
      case 'BF': return ['Orange Money', 'L\'argent Moov', 'Carte', 'Cryptomonnaies'];
      case 'CI': return ['Orange Money', 'MTN Mobile Money', 'Wave', 'L\'argent Moov', 'Carte'];
      case 'SN': return ['Orange Money', 'Wave', 'Free Money', 'Carte'];
      case 'ML': return ['Orange Money', 'L\'argent Moov', 'Sama Money', 'Carte'];
      case 'CM': return ['Orange Money', 'MTN Mobile Money', 'Carte'];
      default: return ['Carte', 'Cryptomonnaies'];
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (status === 'SUCCESS') {
    return (
      <div className="checkout-success text-center mt-5">
        <div className="success-icon mb-2">
          <ShieldCheck size={64} color="#10b981" />
        </div>
        <h1 className="mb-1">Paiement Réussi !</h1>
        <p className="text-light mb-3">Votre achat de <strong>{plan.name}</strong> a été validé avec succès.</p>
        <Link to="/dashboard" className="btn btn-primary">Retour au tableau de bord</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page-modern">
      <div className="checkout-header text-center">
        <h1>Finaliser votre achat</h1>
      </div>

      <div className="checkout-container">
        
        {/* LEFT COLUMN: FORM */}
        <div className="checkout-form-section">
          <h3 className="section-title">Informations personnelles</h3>
          
          {errorMessage && modalStep === 'HIDDEN' && (
            <div className="alert alert-danger mb-3" style={{ borderRadius: '8px' }}>
              {errorMessage}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Prénom <span className="text-danger">*</span></label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" required />
            </div>
            <div className="form-group">
              <label>Nom <span className="text-danger">*</span></label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" required />
            </div>
          </div>

          <div className="form-group">
            <label>Adresse email <span className="text-danger">*</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemple.com" required />
          </div>

          <div className="form-group">
            <label>Numéro de téléphone (WhatsApp de préférence) <span className="text-danger">*</span></label>
            <div className="phone-input-container">
              <select className="country-select" value={country} onChange={e => setCountry(e.target.value)}>
                {AFRICAN_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code}>{c.name.split(' ')[0]}</option>
                ))}
              </select>
              <span className="dial-code">{AFRICAN_COUNTRIES.find(c => c.code === country)?.dialCode}</span>
              <input 
                type="tel" 
                className="phone-input" 
                placeholder="Numéro"
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="gift-option">
            <Gift size={18} color="#666" />
            <span>Offrir ce produit</span>
          </div>

          <button className="btn-pay-now" onClick={validateAndProceed}>
            Payer maintenant
          </button>
          
          <p className="terms-text">
            En cliquant sur le bouton « Payer maintenant », vous acceptez nos <a href="#">termes et conditions</a> et la <a href="#">politique de confidentialité</a>.
          </p>
        </div>

        {/* RIGHT COLUMN: SUMMARY */}
        <div className="checkout-summary-section">
          <div className="summary-card">
            <h3 className="summary-title">Résumé</h3>
            
            <div className="product-details">
              <div className="product-icon">
                {type === 'BOOST' ? <Rocket size={24} color="#FFF" /> : <Star size={24} color="#FFF" />}
              </div>
              <div className="product-info">
                <h4>{type === 'BOOST' ? 'Boost d\'Annonce Immo' : 'Abonnement Pro'}</h4>
                <p>Plan : {plan.name}</p>
              </div>
            </div>

            <div className="discount-row">
              <input 
                type="text" 
                placeholder="Code de réduction" 
                value={discountCode}
                onChange={e => setDiscountCode(e.target.value)}
              />
              <button className="btn-apply">Appliquer</button>
            </div>

            <hr className="divider" />

            <div className="price-row">
              <span className="label">Sous-total</span>
              <span className="value" style={{ fontWeight: 600, color: '#111' }}>{formatPrice(total, plan.currency)}</span>
            </div>

            <hr className="divider" />

            <div className="price-row total-row">
              <span className="label">Total</span>
              <span className="value">{formatPrice(total, plan.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL LAYER */}
      {modalStep !== 'HIDDEN' && (
        <div className="modal-backdrop">
          
          {modalStep === 'SELECT_PROVIDER' && (
            <div className="modal-card" style={{ maxWidth: '420px', padding: '1.5rem', borderRadius: '16px', background: '#fafafa' }}>
              <div className="user-profile-header">
                <div className="user-icon-circle">
                  <ShieldCheck size={20} color="#CA9429" />
                </div>
                <span className="user-name">{firstName} {lastName}</span>
              </div>

              <div className="country-selector-box mb-4">
                <label>Pays</label>
                <div className="custom-select-wrapper">
                   <select value={country} onChange={e => setCountry(e.target.value)}>
                     {AFRICAN_COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                     ))}
                   </select>
                </div>
              </div>

              <h4 className="providers-title">Choisissez un moyen de paiement</h4>
              <div className="providers-list">
                {getPaymentProviders().map(p => (
                  <div key={p} className="provider-option-item" onClick={() => selectProviderAndContinue(p)}>
                    <ProviderLogo provider={p} />
                    <span className="provider-name-text">{p}</span>
                    <ChevronRight size={18} color="#ccc" />
                  </div>
                ))}
              </div>
              <button className="btn btn-outline btn-block mt-3" onClick={() => setModalStep('HIDDEN')}>Annuler</button>
            </div>
          )}

          {modalStep === 'ENTER_PHONE' && (
            <div className="modal-card" style={{ maxWidth: '420px', padding: '2rem', borderRadius: '16px' }}>
              <button className="back-btn-clean" onClick={() => setModalStep('SELECT_PROVIDER')}>
                <ArrowLeft size={20} />
              </button>
              
              <div className="text-center mb-4">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <ProviderLogo provider={provider} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{provider}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>
                  {provider.includes('Carte') || provider.includes('Crypto') 
                    ? `Vous allez être redirigé vers le portail sécurisé pour payer via ${provider}.`
                    : 'Veuillez vérifier ou modifier votre numéro pour valider le paiement.'
                  }
                </p>
              </div>

              {!provider.includes('Carte') && !provider.includes('Crypto') && (
                <div className="phone-input-wrapper mb-4">
                  <div className="phone-input-container">
                    <div className="country-flag-box">
                      {AFRICAN_COUNTRIES.find(c => c.code === country)?.name.split(' ')[0]} 
                      <span style={{ marginLeft: '4px', color: '#666' }}>{AFRICAN_COUNTRIES.find(c => c.code === country)?.dialCode}</span>
                    </div>
                    <input 
                      type="tel" 
                      className="phone-input" 
                      value={paymentPhone}
                      onChange={e => setPaymentPhone(e.target.value)}
                      placeholder="Numéro de paiement"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="countdown-box mb-4">
                Cette page expire dans <span className="countdown-timer">{formatTime(countdown)}</span>
              </div>

              {errorMessage && (
                <div className="alert alert-danger mb-3" style={{ borderRadius: '8px' }}>
                  {errorMessage}
                </div>
              )}

              <button 
                className="btn btn-primary btn-block btn-lg" 
                onClick={handlePayment} 
                disabled={loading || status === 'PENDING'}
                style={{ borderRadius: '8px', padding: '1rem', background: '#111', color: '#fff' }}
              >
                {loading || status === 'PENDING' ? 'Vérification...' : 'Continuer'}
              </button>
            </div>
          )}

        </div>
      )}

      <style>{`
        .checkout-page-modern {
          max-width: 1000px;
          margin: 0 auto;
          padding: 3rem 1rem;
          font-family: 'Inter', sans-serif;
          color: #333;
        }
        .checkout-header { margin-bottom: 3rem; }
        .checkout-header h1 { font-size: 1.8rem; font-weight: 500; color: #111; }
        .checkout-container { display: flex; gap: 4rem; align-items: flex-start; }
        .checkout-form-section { flex: 1; }
        .section-title { font-size: 1.1rem; font-weight: 500; margin-bottom: 1.5rem; color: #555; }
        .form-row { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
        .form-row .form-group { flex: 1; margin-bottom: 0; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; color: #555; }
        .form-group input {
          width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd;
          border-radius: 8px; font-size: 1rem; outline: none; transition: border-color 0.2s;
        }
        .form-group input:focus { border-color: #22c55e; }
        
        .phone-input-container {
          display: flex; align-items: center; border: 1px solid #ddd;
          border-radius: 8px; background: white; overflow: hidden;
        }
        .phone-input-container:focus-within { border-color: #22c55e; }
        .country-select {
          padding: 0.8rem 0.5rem; border: none; background: transparent;
          font-size: 1.2rem; outline: none; cursor: pointer;
          padding-left: 1rem;
        }
        .dial-code { color: #666; font-size: 0.95rem; margin-left: 0.2rem; margin-right: 0.5rem; }
        .phone-input { flex: 1; border: none !important; border-radius: 0 !important; padding-left: 0 !important; }
        .phone-input:focus { border-color: transparent !important; box-shadow: none !important; }

        .gift-option { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; font-size: 0.95rem; color: #555; cursor: pointer; }
        
        .btn-pay-now {
          width: 100%; background-color: #15803d; color: white; border: none;
          padding: 1rem; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s;
        }
        .btn-pay-now:hover { background-color: #166534; }
        .terms-text { text-align: center; margin-top: 1rem; font-size: 0.8rem; color: #888; line-height: 1.4; }
        .terms-text a { color: #666; text-decoration: underline; }

        .checkout-summary-section { width: 420px; }
        .summary-card { background-color: #f8f9fa; border-radius: 12px; padding: 2rem; }
        .summary-title { font-size: 1.1rem; font-weight: 500; margin-bottom: 1.5rem; color: #333; }
        .product-details { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .product-icon { width: 70px; height: 70px; background: #111; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .product-info h4 { font-size: 0.95rem; margin: 0 0 0.4rem 0; font-weight: 500; line-height: 1.4; color: #111; }
        .product-info p { margin: 0; font-size: 0.85rem; color: #666; }
        
        .discount-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        .discount-row input { flex: 1; padding: 0.8rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; outline: none; background: white; }
        .btn-apply { padding: 0 1.2rem; background: white; border: 1px solid #111; border-radius: 8px; font-weight: 500; color: #111; cursor: pointer; transition: all 0.2s; }
        .btn-apply:hover { background: #f1f5f9; }

        .divider { border: 0; height: 1px; background: #e2e8f0; margin: 1.5rem 0; }
        .price-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.95rem; color: #555; }
        .price-row.total-row { font-size: 1.8rem; color: #111; font-weight: 700; margin-top: 1rem; }
        .total-row .label { font-size: 1.4rem; font-weight: 500; }

        /* Modal Styles */
        .modal-backdrop {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .modal-card { background: white; width: 100%; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        
        .user-profile-header {
          background: #fff; padding: 1rem; border-radius: 12px;
          display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .user-icon-circle {
          width: 40px; height: 40px; background: #FFF4E5; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .user-name { font-weight: 600; font-size: 1.05rem; color: #111; }

        .country-selector-box label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
        .custom-select-wrapper {
           border: 1px solid #eaeaea; border-radius: 12px; background: #fff; padding: 0.5rem 1rem;
        }
        .custom-select-wrapper select {
           width: 100%; border: none; background: transparent; font-size: 1rem; outline: none; cursor: pointer; font-family: inherit; color: #111;
        }

        .providers-title { font-size: 0.95rem; font-weight: 600; margin: 0 0 1rem 0; color: #111; }
        
        .provider-option-item {
          display: flex; align-items: center; gap: 1rem;
          padding: 1rem; background: #fff; border: 1px solid #eaeaea;
          border-radius: 12px; margin-bottom: 0.75rem; cursor: pointer; transition: all 0.2s;
        }
        .provider-option-item:hover { border-color: #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .provider-name-text { flex: 1; font-weight: 500; font-size: 1rem; color: #111; }

        .back-btn-clean {
          position: absolute; top: 1.5rem; left: 1.5rem; background: none; border: none; cursor: pointer; color: #666;
          display: flex; align-items: center; justify-content: center; padding: 0.5rem; border-radius: 50%;
        }
        .back-btn-clean:hover { background: #f5f5f5; color: #111; }

        .country-flag-box {
           background: #f8f9fa; padding: 0 1rem; height: 100%; display: flex; align-items: center;
           border-right: 1px solid #ddd; font-size: 1.1rem;
        }

        .countdown-box {
           background: #FFF9E6; border: 1px solid #FFE082; color: #B97700;
           padding: 0.75rem; border-radius: 8px; text-align: center; font-size: 0.9rem; font-weight: 500;
        }
        .countdown-timer { font-weight: 700; }

        @media (max-width: 900px) {
          .checkout-container { flex-direction: column-reverse; gap: 2rem; }
          .checkout-summary-section { width: 100%; }
        }
      `}</style>
    </div>
  );
}
