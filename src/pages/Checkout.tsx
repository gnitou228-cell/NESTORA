import { useState, useEffect } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Rocket, Star, Gift } from 'lucide-react';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';

const AFRICAN_COUNTRIES = [
  { code: 'BF', name: '🇧🇫', dialCode: '+226' },
  { code: 'CI', name: '🇨🇮', dialCode: '+225' },
  { code: 'SN', name: '🇸🇳', dialCode: '+221' },
  { code: 'ML', name: '🇲🇱', dialCode: '+223' },
  { code: 'TG', name: '🇹🇬', dialCode: '+228' },
  { code: 'BJ', name: '🇧🇯', dialCode: '+229' },
  { code: 'CM', name: '🇨🇲', dialCode: '+237' },
  { code: 'FR', name: '🇫🇷', dialCode: '+33' },
];

export default function Checkout() {
  const location = useLocation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('BF');
  const [discountCode, setDiscountCode] = useState('');

  // We keep the payment modal logic for the next step (until user gives screenshot)
  const [modalStep, setModalStep] = useState<'HIDDEN' | 'PAYMENT'>('HIDDEN');
  const [provider, setProvider] = useState<string>('Orange Money');
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
    setModalStep('PAYMENT');
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const selectedProvider = provider === 'Carte Bancaire' ? 'Stripe' : provider;
      const initResponse = await api.post('/payments/checkout', {
        type: paymentType,
        planId: plan.id,
        propertyId,
        provider: selectedProvider,
        customerDetails: { firstName, lastName, email, country, phone }
      });
      
      const { paymentId, url } = initResponse.data;
      
      if (url) {
        window.location.href = url;
        return;
      }

      setStatus('PENDING');

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
          
          {errorMessage && (
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
                  <option key={c.code} value={c.code}>{c.name}</option>
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

      {/* TEMPORARY MODAL FOR STEP 2 UNTIL USER PROVIDES SCREENSHOT */}
      {modalStep === 'PAYMENT' && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <button className="close-btn" onClick={() => setModalStep('HIDDEN')}>&times;</button>
            <h2>Moyens de paiement</h2>
            <p>En attente de ta maquette pour cette page ! En attendant, choisis un moyen de paiement :</p>
            <div className="providers-list mt-3">
              {['Orange Money', 'Moov Money', 'MTN Mobile Money', 'Wave', 'Carte Bancaire'].map(p => (
                <label key={p} className="provider-option" style={{ display: 'block', margin: '10px 0' }}>
                  <input type="radio" name="provider" checked={provider === p} onChange={() => setProvider(p)} /> {p}
                </label>
              ))}
            </div>
            <button className="btn btn-primary btn-block mt-3" onClick={handlePayment} disabled={loading}>
              {loading ? 'Traitement...' : `Payer ${formatPrice(total, plan.currency)}`}
            </button>
          </div>
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

        .checkout-header {
          margin-bottom: 3rem;
        }
        
        .checkout-header h1 {
          font-size: 1.8rem;
          font-weight: 500;
          color: #111;
        }

        .checkout-container {
          display: flex;
          gap: 4rem;
          align-items: flex-start;
        }

        /* Left Form */
        .checkout-form-section {
          flex: 1;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #555;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
        }

        .form-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          border-color: #22c55e;
        }

        .phone-input-container {
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          overflow: hidden;
        }

        .phone-input-container:focus-within {
          border-color: #22c55e;
        }

        .country-select {
          padding: 0.8rem 0.5rem;
          border: none;
          background: transparent;
          font-size: 1.2rem;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          padding-left: 1rem;
        }

        .dial-code {
          color: #666;
          font-size: 0.95rem;
          margin-left: 0.2rem;
          margin-right: 0.5rem;
        }

        .phone-input {
          flex: 1;
          border: none !important;
          border-radius: 0 !important;
          padding-left: 0 !important;
        }
        .phone-input:focus {
          border-color: transparent !important;
          box-shadow: none !important;
        }

        .gift-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.95rem;
          color: #555;
          cursor: pointer;
        }

        .btn-pay-now {
          width: 100%;
          background-color: #15803d; /* Nice green like in the image */
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-pay-now:hover {
          background-color: #166534;
        }

        .terms-text {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #888;
          line-height: 1.4;
        }
        
        .terms-text a {
          color: #666;
          text-decoration: underline;
        }

        /* Right Summary */
        .checkout-summary-section {
          width: 420px;
        }

        .summary-card {
          background-color: #f8f9fa;
          border-radius: 12px;
          padding: 2rem;
        }

        .summary-title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .product-details {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .product-icon {
          width: 70px;
          height: 70px;
          background: #111;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .product-info h4 {
          font-size: 0.95rem;
          margin: 0 0 0.4rem 0;
          font-weight: 500;
          line-height: 1.4;
          color: #111;
        }

        .product-info p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }

        .discount-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .discount-row input {
          flex: 1;
          padding: 0.8rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          background: white;
        }

        .btn-apply {
          padding: 0 1.2rem;
          background: white;
          border: 1px solid #111;
          border-radius: 8px;
          font-weight: 500;
          color: #111;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-apply:hover {
          background: #f1f5f9;
        }

        .divider {
          border: 0;
          height: 1px;
          background: #e2e8f0;
          margin: 1.5rem 0;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          color: #555;
        }

        .price-row.total-row {
          font-size: 1.8rem;
          color: #111;
          font-weight: 700;
          margin-top: 1rem;
        }

        .total-row .label {
          font-size: 1.4rem;
          font-weight: 500;
        }

        /* Modal backdrop for the temp step 2 */
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 400px;
          position: relative;
        }
        .close-btn {
          position: absolute;
          top: 1rem; right: 1rem;
          background: none; border: none; font-size: 1.5rem; cursor: pointer;
        }

        @media (max-width: 900px) {
          .checkout-container {
            flex-direction: column-reverse;
            gap: 2rem;
          }
          .checkout-summary-section {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
