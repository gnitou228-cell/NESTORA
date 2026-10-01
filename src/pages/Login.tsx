import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';
import NestoraLogo from '../components/brand/NestoraLogo';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion");
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log("Tentative de connexion depuis l'origine:", window.location.origin);

      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.session) {
        login();
        
        let role = data.user.user_metadata?.role as Role;
        
        if (!role) {
          try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`, {
              headers: { 'Authorization': `Bearer ${data.session.access_token}` }
            });
            if (res.ok) {
              const { user: dbUser } = await res.json();
              role = dbUser.role;
            }
          } catch (e) {
            console.error("Failed to fetch role from backend", e);
          }
        }

        if (role === 'SEEKER') navigate('/dashboard/seeker');
        else if (role === 'OWNER') navigate('/dashboard/owner');
        else if (role === 'AGENCY') navigate('/dashboard/agency');
        else navigate('/dashboard');
      }
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Email ou mot de passe incorrect.');
      } else if (err.message === 'Email not confirmed') {
        setError('Veuillez vérifier votre adresse email avant de vous connecter.');
      } else {
        setError(err.message || 'Erreur réseau.');
      }
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
          <p className="text-light">Connectez-vous à votre espace personnel.</p>
        </div>

        {error && <div className="badge-warning" style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#b45309', border: '1px solid #fcd34d', backgroundColor: '#fffbeb' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label>Adresse E-mail</label>
            <input type="email" name="email" className="form-control" required onChange={handleChange} placeholder="nom@exemple.com" />
          </div>

          <div className="form-group mb-2">
            <div className="d-flex justify-between" style={{ alignItems: 'center' }}>
              <label>Mot de passe</label>
              <Link to="/mot-de-passe-oublie" className="text-sm text-light" style={{ color: 'var(--color-primary)' }}>Mot de passe oublié ?</Link>
            </div>
            <input type="password" name="password" className="form-control" required onChange={handleChange} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg mt-4" disabled={loading}>
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="social-auth mt-4">
          <div className="divider-text mb-3" style={{ display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
            <span style={{ flex: 1, borderBottom: '1px solid var(--color-border)' }}></span>
            <span style={{ padding: '0 10px' }}>Ou se connecter avec</span>
            <span style={{ flex: 1, borderBottom: '1px solid var(--color-border)' }}></span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
            <button type="button" onClick={() => handleOAuthLogin('google')} className="btn btn-outline btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#fff', color: '#333', borderColor: '#ddd' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button type="button" onClick={() => handleOAuthLogin('facebook')} className="btn btn-outline btn-block" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#1877F2', color: '#fff', borderColor: '#1877F2' }}>
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>
        </div>

        <div className="text-center mt-4 text-sm">
          Nouveau sur Nestora ? <Link to="/inscription" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Créer un compte</Link>
        </div>
      </div>
      <style>{`
        .form-control { width: 100%; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--border-radius-sm); font-family: inherit; font-size: 0.95rem; margin-top: 0.25rem; }
        .form-control:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(11, 31, 58, 0.1); }
        .form-group label { font-weight: 500; font-size: 0.9rem; color: var(--color-text-dark); }
        .d-flex { display: flex; }
        .justify-between { justify-content: space-between; }
      `}</style>
    </div>
  );
}
