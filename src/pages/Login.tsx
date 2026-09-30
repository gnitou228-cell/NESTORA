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
      if (!import.meta.env.VITE_SUPABASE_URL) {
        throw new Error("L'URL Supabase est vide. Vite n'a pas rechargé le fichier .env !");
      }
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY?.startsWith('eyJ')) {
        throw new Error("La clé Supabase est invalide. Vite n'a pas rechargé le fichier .env !");
      }
      
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
        
        // Wait a small tick so AuthContext can fetch profile for exact role redirection
        // or we check user metadata if available
        let role = data.user.user_metadata?.role as Role;
        
        // Let's manually fetch profile for reliable routing
        if (!role) {
          const { data: userRecord } = await supabase
            .from('User')
            .select('role')
            .eq('id', data.user.id)
            .single();
          if (userRecord) role = userRecord.role as Role;
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
