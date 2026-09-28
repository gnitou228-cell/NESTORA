import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
import '../home.css';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulation d'un appel API (à remplacer par le vrai backend)
    setTimeout(() => {
      setStatus('success');
      // Réinitialiser le formulaire ici si besoin
    }, 1500);
  };

  const contactConfig = {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'support@nestora.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+226 00 00 00 00',
    whatsapp: import.meta.env.VITE_CONTACT_WHATSAPP || '+226 00 00 00 00',
    address: 'Centre des affaires, Ouagadougou',
    hours: 'Lundi - Vendredi : 8h00 - 18h00'
  };

  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem' }}>
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title">Nous contacter</h1>
        <p className="hero-subtitle">Une question ? Un problème ? Notre équipe est là pour vous aider.</p>
      </section>

      <div className="contact-container" style={{ maxWidth: '1200px', margin: '-4rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <div className="d-flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Formulaire */}
          <div className="card" style={{ flex: 2, minWidth: '300px', padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Envoyez-nous un message</h2>
            
            {status === 'success' ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--border-radius)', color: 'var(--color-success)' }}>
                <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
                <h3>Message envoyé avec succès !</h3>
                <p style={{ marginTop: '0.5rem' }}>Notre équipe vous répondra dans les plus brefs délais.</p>
                <button className="btn btn-outline mt-3" onClick={() => setStatus('idle')}>Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500 }}>Prénom *</label>
                    <input type="text" required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500 }}>Nom *</label>
                    <input type="text" required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500 }}>Email *</label>
                    <input type="email" required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500 }}>Téléphone</label>
                    <input type="tel" className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500 }}>Pays *</label>
                    <select required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                      <option value="">Sélectionnez un pays</option>
                      <option value="bf">Burkina Faso</option>
                      <option value="ci">Côte d'Ivoire</option>
                      <option value="sn">Sénégal</option>
                      <option value="bj">Bénin</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 500 }}>Catégorie *</label>
                    <select required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'white' }}>
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="support">Support technique</option>
                      <option value="account">Mon compte</option>
                      <option value="listing">Annonce</option>
                      <option value="payment">Paiement</option>
                      <option value="agency">Espace agence</option>
                      <option value="report">Signalement</option>
                      <option value="partner">Partenariat</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500 }}>Sujet *</label>
                  <input type="text" required className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500 }}>Message *</label>
                  <textarea required rows={5} className="form-control" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }}></textarea>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 500 }}>Pièce jointe (facultatif)</label>
                  <input type="file" className="form-control" style={{ padding: '0.5rem', borderRadius: '8px', border: '1px dashed var(--color-border)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>Format accepté : JPG, PNG, PDF (Max 5Mo)</span>
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <input type="checkbox" id="privacy" required style={{ marginTop: '0.25rem' }} />
                  <label htmlFor="privacy" style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
                    J'accepte que mes données personnelles soient traitées pour répondre à ma demande, conformément à la <Link to="/confidentialite" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>politique de confidentialité</Link>.
                  </label>
                </div>

                {status === 'error' && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '8px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <AlertCircle size={20} /> Une erreur est survenue. Veuillez réessayer.
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'} style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
                  {status === 'loading' ? 'Envoi en cours...' : (
                    <>
                      Envoyer le message
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Coordonnées */}
          <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>Informations de contact</h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <Mail size={24} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Email</h4>
                  <a href={`mailto:${contactConfig.email}`} style={{ color: 'rgba(255,255,255,0.8)' }}>{contactConfig.email}</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <Phone size={24} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Téléphone</h4>
                  <a href={`tel:${contactConfig.phone}`} style={{ color: 'rgba(255,255,255,0.8)' }}>{contactConfig.phone}</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <MessageCircle size={24} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>WhatsApp</h4>
                  <a href={`https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.8)' }}>{contactConfig.whatsapp}</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin size={24} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Adresse</h4>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>{contactConfig.address}</p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Horaires d'ouverture</h3>
              <p style={{ color: 'var(--color-text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} color="var(--color-success)" /> {contactConfig.hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
