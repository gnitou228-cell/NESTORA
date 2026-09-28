import { useState } from 'react';
import { Link } from 'react-router-dom';
import NestoraLogo from '../components/brand/NestoraLogo';
import { supabase } from '../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (authError) {
        throw new Error(authError.message);
      }

      setSuccessMessage('Si cet email existe, un lien de réinitialisation a été envoyé.');
    } catch (err: any) {
      setError(err.message || 'Erreur réseau.');
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
          <h3 className="mb-2">Mot de passe oublié ?</h3>
          <p className="text-light text-sm">Entrez votre adresse email, nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
        </div>

        {error && <div className="badge-warning" style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#b45309', border: '1px solid #fcd34d', backgroundColor: '#fffbeb' }}>{error}</div>}
        {successMessage && <div className="badge-success" style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#166534', border: '1px solid #86efac', backgroundColor: '#dcfce7' }}>{successMessage}</div>}

        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Adresse E-mail</label>
              <input 
                type="email" 
                className="form-control" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com" 
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <div className="text-center mt-4 text-sm">
          <Link to="/connexion" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>← Retour à la connexion</Link>
        </div>
      </div>
      <style>{`
        .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); font-family: inherit; font-size: 0.95rem; margin-top: 0.25rem; }
        .form-control:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(11, 31, 58, 0.1); }
        .form-group label { font-weight: 500; font-size: 0.9rem; color: var(--color-text-dark); }
      `}</style>
    </div>
  );
}
