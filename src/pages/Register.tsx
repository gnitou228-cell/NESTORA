import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Crown, Briefcase } from 'lucide-react';
import { useAuth, type Role } from '../context/AuthContext';
import NestoraLogo from '../components/brand/NestoraLogo';
import LocationSelector from '../components/forms/LocationSelector';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>('SEEKER');
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
    countryId: '',
    regionId: '',
    cityId: '',
    neighborhoodId: '',
    address: '',
    agencyName: '',
    description: '',
    registrationNumber: '',
    ownerType: 'PARTICULIER',
    acceptTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!formData.acceptTerms) {
      setError('Vous devez accepter les conditions d\'utilisation.');
      return;
    }
    if (!formData.countryId) {
      setError('Veuillez sélectionner au minimum votre pays.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("Tentative d'inscription sur Supabase...");
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: selectedRole
          }
        }
      });

      if (authError) {
        console.error("Supabase Auth Error:", authError);
        throw new Error(authError.message || 'Erreur lors de l\'inscription avec Supabase.');
      }

      if (!authData.user) {
        throw new Error('Erreur inconnue lors de la création de l\'utilisateur.');
      }

      const userId = authData.user.id;
      console.log("Utilisateur créé avec succès. ID :", userId);

      // Création du profil utilisateur dans la table `profiles`
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: selectedRole,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          country_id: formData.countryId,
          region_id: formData.regionId,
          city_id: formData.cityId,
          neighborhood_id: formData.neighborhoodId,
          address: formData.address,
          owner_type: formData.ownerType,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error("Supabase Profile Error:", profileError);
        // On ne bloque pas si c'est une erreur de RLS, on log simplement
      } else {
        console.log("Profil inséré avec succès.");
      }

      // Création de l'agence si rôle = AGENCY
      if (selectedRole === 'AGENCY' && formData.agencyName) {
        const { error: agencyError } = await supabase
          .from('agencies')
          .insert({
            owner_id: userId,
            name: formData.agencyName,
            email: formData.email,
            phone: formData.whatsapp || formData.phone,
            description: formData.description,
            registration_number: formData.registrationNumber,
            address: formData.address,
            country_id: formData.countryId,
            region_id: formData.regionId,
            city_id: formData.cityId,
            neighborhood_id: formData.neighborhoodId
          });
          
        if (agencyError) console.error("Supabase Agency Error:", agencyError);
      }

      setSuccess(true);
      
      // Si la confirmation d'email est requise sur Supabase, on n'aura pas de session immédiatement
      if (!authData.session) {
        setNeedsEmailVerification(true);
      } else {
        // Redirection si l'email est déjà vérifié ou non requis
        login();
        setTimeout(() => {
          if (selectedRole === 'SEEKER') navigate('/dashboard/seeker');
          else if (selectedRole === 'OWNER') navigate('/dashboard/owner');
          else if (selectedRole === 'AGENCY') navigate('/dashboard/agency');
        }, 1500);
      }

    } catch (err: any) {
      console.error(err);
      if (err.message.includes('fetch')) {
        setError("Erreur réseau: impossible de contacter Supabase. Veuillez vérifier vos clés (URL, Anon Key) dans .env.");
      } else {
        // Traduction de quelques erreurs fréquentes
        if (err.message.includes('User already registered')) {
          setError("Un compte existe déjà avec cet e-mail.");
        } else if (err.message.includes('Password should be')) {
          setError("Le mot de passe est trop faible. Veuillez utiliser au moins 6 caractères.");
        } else {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-secondary)', padding: '2rem' }}>
        <div className="card text-center" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem' }}>
          <NestoraLogo size="large" />
          <h2 className="mt-4" style={{ color: 'var(--color-primary)' }}>Inscription réussie !</h2>
          <p className="mt-2 text-light">Votre compte a été créé avec succès.</p>
          
          {needsEmailVerification ? (
            <div className="badge-primary" style={{ padding: '1rem', marginTop: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-primary)' }}>
              <strong>Action requise :</strong> Veuillez vérifier votre boîte mail. Un lien de confirmation vous a été envoyé.
              <br/><br/>
              <Link to="/connexion" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Aller à la connexion</Link>
            </div>
          ) : (
            <>
              <div className="badge-success" style={{ padding: '1rem', marginTop: '1.5rem', borderRadius: '8px' }}>
                Connexion automatique réussie.
              </div>
              <p className="mt-4 text-sm text-light">Redirection vers votre tableau de bord en cours...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-secondary)', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
        <div className="text-center mb-4">
          <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
            <NestoraLogo size="large" />
          </Link>
          <p className="text-light">Rejoignez la plateforme immobilière de référence.</p>
        </div>

        {error && <div className="badge-warning" style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#b45309', border: '1px solid #fcd34d', backgroundColor: '#fffbeb' }}>{error}</div>}

        {step === 1 && (
          <div>
            <h3 className="mb-3 text-center">Choisissez votre profil</h3>
            <div className="role-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div 
                className={`provider-card ${selectedRole === 'SEEKER' ? 'active' : ''}`}
                onClick={() => setSelectedRole('SEEKER')}
              >
                <div className="provider-icon"><User size={24} /></div>
                <div className="provider-name">
                  <div style={{ fontSize: '1.1rem' }}>Chercheur</div>
                  <div className="text-light" style={{ fontSize: '0.85rem' }}>Je cherche un logement à louer ou acheter</div>
                </div>
                <div className="provider-radio"><div className={`radio-inner ${selectedRole === 'SEEKER' ? 'checked' : ''}`}></div></div>
              </div>

              <div 
                className={`provider-card ${selectedRole === 'OWNER' ? 'active' : ''}`}
                onClick={() => setSelectedRole('OWNER')}
              >
                <div className="provider-icon" style={{ color: '#C9A227' }}><Crown size={24} /></div>
                <div className="provider-name">
                  <div style={{ fontSize: '1.1rem' }}>Propriétaire</div>
                  <div className="text-light" style={{ fontSize: '0.85rem' }}>Je souhaite publier mes biens immobiliers</div>
                </div>
                <div className="provider-radio"><div className={`radio-inner ${selectedRole === 'OWNER' ? 'checked' : ''}`}></div></div>
              </div>

              <div 
                className={`provider-card ${selectedRole === 'AGENCY' ? 'active' : ''}`}
                onClick={() => setSelectedRole('AGENCY')}
              >
                <div className="provider-icon" style={{ color: '#10b981' }}><Briefcase size={24} /></div>
                <div className="provider-name">
                  <div style={{ fontSize: '1.1rem' }}>Agence Immobilière</div>
                  <div className="text-light" style={{ fontSize: '0.85rem' }}>Je gère un portefeuille pour mes clients</div>
                </div>
                <div className="provider-radio"><div className={`radio-inner ${selectedRole === 'AGENCY' ? 'checked' : ''}`}></div></div>
              </div>

            </div>
            
            <button className="btn btn-primary btn-block btn-lg mt-4" onClick={() => setStep(2)}>
              Continuer
            </button>
            <div className="text-center mt-3 text-sm">
              Déjà un compte ? <Link to="/connexion" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Se connecter</Link>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister}>
            <div className="d-flex justify-between mb-3" style={{ alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Profil {selectedRole === 'SEEKER' ? 'Chercheur' : selectedRole === 'OWNER' ? 'Propriétaire' : 'Agence'}</h3>
              <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => setStep(1)}>Modifier le rôle</button>
            </div>

            {selectedRole === 'OWNER' && (
              <div className="form-group mb-3">
                <label>Type de propriétaire *</label>
                <select name="ownerType" className="form-control" onChange={handleChange} value={formData.ownerType}>
                  <option value="PARTICULIER">Particulier</option>
                  <option value="PRO">Professionnel</option>
                </select>
              </div>
            )}

            <div className="d-flex" style={{ gap: '1rem' }}>
              <div className="form-group mb-3" style={{ flex: 1 }}>
                <label>Prénom *</label>
                <input type="text" name="firstName" className="form-control" required onChange={handleChange} value={formData.firstName} />
              </div>
              <div className="form-group mb-3" style={{ flex: 1 }}>
                <label>Nom *</label>
                <input type="text" name="lastName" className="form-control" required onChange={handleChange} value={formData.lastName} />
              </div>
            </div>

            <div className="d-flex" style={{ gap: '1rem' }}>
              <div className="form-group mb-3" style={{ flex: 1 }}>
                <label>Email *</label>
                <input type="email" name="email" className="form-control" required onChange={handleChange} value={formData.email} />
              </div>
              <div className="form-group mb-3" style={{ flex: 1 }}>
                <label>Téléphone *</label>
                <input type="tel" name="phone" className="form-control" required onChange={handleChange} value={formData.phone} />
              </div>
            </div>

            {(selectedRole === 'AGENCY' || selectedRole === 'OWNER') && (
              <div className="form-group mb-3">
                <label>WhatsApp (Optionnel)</label>
                <input type="tel" name="whatsapp" className="form-control" onChange={handleChange} value={formData.whatsapp} />
              </div>
            )}

            <div className="d-flex" style={{ gap: '1rem' }}>
              <div className="form-group mb-3" style={{ flex: 1 }}>
                <label>Mot de passe *</label>
                <input type="password" name="password" className="form-control" required onChange={handleChange} value={formData.password} minLength={6} />
              </div>
              <div className="form-group mb-3" style={{ flex: 1 }}>
                <label>Confirmation *</label>
                <input type="password" name="confirmPassword" className="form-control" required onChange={handleChange} value={formData.confirmPassword} minLength={6} />
              </div>
            </div>

            <div className="mb-3">
              <LocationSelector 
                required={true} 
                onLocationChange={(loc) => setFormData({...formData, ...loc})}
              />
            </div>

            {(selectedRole === 'OWNER' || selectedRole === 'AGENCY') && (
              <div className="form-group mb-3">
                <label>Adresse physique exacte</label>
                <input type="text" name="address" className="form-control" placeholder="Quartier, Secteur, Rue..." onChange={handleChange} value={formData.address} />
              </div>
            )}

            {selectedRole === 'AGENCY' && (
              <>
                <hr className="divider my-4" />
                <h4 className="mb-3">Informations de l'Agence</h4>
                <div className="form-group mb-3">
                  <label>Nom de l'agence *</label>
                  <input type="text" name="agencyName" className="form-control" required onChange={handleChange} value={formData.agencyName} />
                </div>
                <div className="form-group mb-3">
                  <label>Numéro RCCM (Enregistrement)</label>
                  <input type="text" name="registrationNumber" className="form-control" onChange={handleChange} value={formData.registrationNumber} />
                </div>
                <div className="form-group mb-3">
                  <label>Description de l'agence</label>
                  <textarea name="description" className="form-control" rows={3} onChange={handleChange} value={formData.description}></textarea>
                </div>
              </>
            )}

            <div className="form-group mb-4 mt-2" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <input type="checkbox" id="acceptTerms" name="acceptTerms" onChange={handleChange} checked={formData.acceptTerms} style={{ marginTop: '0.25rem' }} />
              <label htmlFor="acceptTerms" style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', cursor: 'pointer', lineHeight: 1.4 }}>
                J'accepte les <a href="#" style={{ color: 'var(--color-primary)' }}>conditions générales d'utilisation</a> et la politique de confidentialité de NESTORA.
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Création en cours avec Supabase...' : 'Terminer l\'inscription'}
            </button>
          </form>
        )}
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
