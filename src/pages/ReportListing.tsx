import { useState } from 'react';
import { Flag, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import '../home.css';

export default function ReportListing() {
  const [searchParams] = useSearchParams();
  const prefilledId = searchParams.get('id') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulation d'un appel API (à remplacer par le vrai backend)
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Signaler une annonce</h1>
        <p className="hero-subtitle">Aidez-nous à maintenir une plateforme sûre et fiable pour tous.</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '-4rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <div className="card" style={{ padding: '3rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Formulaire de signalement</h2>
              <p className="text-light" style={{ fontSize: '0.9rem', margin: 0 }}>Vos signalements sont traités de manière confidentielle.</p>
            </div>
          </div>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <CheckCircle size={64} color="var(--color-success)" style={{ margin: '0 auto 1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Signalement envoyé</h3>
              <p className="text-light" style={{ marginBottom: '2rem' }}>
                Merci pour votre vigilance. Notre équipe de modération va examiner cette annonce dans les plus brefs délais et prendre les mesures nécessaires.
              </p>
              <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>ID ou lien de l'annonce *</label>
                <input 
                  type="text" 
                  defaultValue={prefilledId}
                  placeholder="Ex: #12345 ou coller l'URL de l'annonce"
                  required 
                  className="form-control" 
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>Motif du signalement *</label>
                <select required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                  <option value="">Sélectionnez un motif</option>
                  <option value="scam">Tentative d'arnaque (demande de mandat cash, etc.)</option>
                  <option value="fake">Fausse annonce ou photos non réalistes</option>
                  <option value="unavailable">Le bien est déjà loué / vendu</option>
                  <option value="wrong_price">Le prix ne correspond pas à la réalité</option>
                  <option value="agency_hidden">Agence se faisant passer pour un particulier</option>
                  <option value="inappropriate">Contenu inapproprié ou offensant</option>
                  <option value="other">Autre raison</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>Description détaillée *</label>
                <textarea 
                  required 
                  rows={5} 
                  placeholder="Veuillez décrire le problème avec le plus de détails possible pour aider notre équipe..."
                  className="form-control" 
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }}
                ></textarea>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>Votre adresse email (pour le suivi) *</label>
                <input 
                  type="email" 
                  required 
                  className="form-control" 
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>Preuve (capture d'écran, etc.) - Facultatif</label>
                <input type="file" className="form-control" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} />
              </div>

              {status === 'error' && (
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <AlertCircle size={20} /> Une erreur est survenue lors de l'envoi. Veuillez réessayer.
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'} style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', backgroundColor: 'var(--color-danger)' }}>
                {status === 'loading' ? 'Envoi en cours...' : (
                  <>
                    <Flag size={18} />
                    Envoyer le signalement
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
