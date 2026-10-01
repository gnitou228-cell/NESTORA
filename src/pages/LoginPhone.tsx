import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NestoraLogo from '../components/brand/NestoraLogo';
import { supabase } from '../lib/supabase';

export default function LoginPhone() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Convert to international format if not already (basic logic)
    const formattedPhone = phone.startsWith('+') ? phone : `+228${phone.replace(/^0+/, '')}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'whatsapp'
        }
      });

      if (error) throw error;
      
      setSuccess('Code envoyé avec succès sur WhatsApp !');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedPhone = phone.startsWith('+') ? phone : `+228${phone.replace(/^0+/, '')}`;

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms'
      });

      if (error) throw error;

      if (data.session) {
        login();
        navigate('/dashboard'); // Can be optimized based on role later
      }
    } catch (err: any) {
      setError('Code invalide ou expiré.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-secondary)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
        <div className="text-center mb-4">
          <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <NestoraLogo size="large" />
          </Link>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>
            Connexion via WhatsApp
          </h2>
          <p className="text-light mt-2">Authentification sécurisée avec votre numéro.</p>
        </div>

        {error && <div className="alert alert-danger" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', border: '1px solid #ef4444', marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '1rem', borderRadius: '8px', border: '1px solid #22c55e', marginBottom: '1rem' }}>{success}</div>}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group mb-3">
              <label>Numéro de téléphone</label>
              <div className="d-flex gap-2">
                <select className="form-control" style={{ width: '100px', backgroundColor: '#f1f5f9' }} disabled>
                  <option>🇹🇬 +228</option>
                </select>
                <input 
                  type="tel" 
                  className="form-control flex-grow-1" 
                  placeholder="Ex: 90000000" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button type="submit" className="btn btn-block btn-lg mt-4" style={{ backgroundColor: '#25D366', color: '#fff', fontWeight: 600 }} disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Recevoir le code WhatsApp'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group mb-3">
              <label>Code de vérification</label>
              <input 
                type="text" 
                className="form-control text-center" 
                placeholder="Ex: 123456" 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{ fontSize: '1.5rem', letterSpacing: '4px' }}
                required 
              />
              <p className="text-sm text-light mt-2 text-center">Entrez le code à 6 chiffres reçu sur WhatsApp.</p>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
              {loading ? 'Vérification...' : 'Valider et se connecter'}
            </button>
            <button type="button" className="btn btn-link btn-block mt-3" onClick={() => setStep('phone')}>
              Modifier le numéro
            </button>
          </form>
        )}
        
        <div className="text-center mt-4">
          <Link to="/connexion" className="text-sm" style={{ color: 'var(--color-text-light)' }}>
            ← Retour à la connexion classique
          </Link>
        </div>
      </div>
      <style>{`
        .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); font-family: inherit; font-size: 0.95rem; margin-top: 0.25rem; }
        .form-control:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(11, 31, 58, 0.1); }
        .form-group label { font-weight: 500; font-size: 0.9rem; color: var(--color-text-dark); }
        .d-flex { display: flex; }
      `}</style>
    </div>
  );
}
