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
      <style>{`
        .contact-input {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          padding: 1rem 1.2rem !important;
          font-size: 1rem !important;
          transition: all 0.3s ease !important;
          width: 100%;
          color: #0f172a;
        }
        .contact-input::placeholder {
          color: #94a3b8;
        }
        .contact-input:focus {
          background-color: #ffffff !important;
          border-color: var(--color-accent) !important;
          box-shadow: 0 0 0 4px rgba(201, 162, 39, 0.15) !important;
          outline: none;
        }
        .contact-label {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-primary);
          margin-bottom: 0.6rem;
          display: block;
        }
        .contact-label span {
          color: #ef4444;
        }
        .file-upload-zone:hover {
          border-color: var(--color-accent) !important;
          background-color: #fffbeb !important;
        }
      `}</style>
      <section className="hero-section" style={{ minHeight: '45vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '4rem' }}>
        <h1 className="hero-title">Nous contacter</h1>
        <p className="hero-subtitle">Une question ? Un problème ? Notre équipe est là pour vous aider.</p>
      </section>

      <div className="contact-container" style={{ maxWidth: '1200px', margin: '-3rem auto 3rem', position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <div className="d-flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Formulaire */}
          <div className="card" style={{ flex: 2, minWidth: '300px', padding: '2.5rem', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Envoyez-nous un message</h2>
            
            {status === 'success' ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--border-radius)', color: 'var(--color-success)' }}>
                <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
                <h3>Message envoyé avec succès !</h3>
                <p style={{ marginTop: '0.5rem' }}>Notre équipe vous répondra dans les plus brefs délais.</p>
                <button className="btn btn-outline mt-3" onClick={() => setStatus('idle')}>Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label className="contact-label">Prénom <span>*</span></label>
                    <input type="text" required className="contact-input" placeholder="Ex: Jean" />
                  </div>
                  <div>
                    <label className="contact-label">Nom <span>*</span></label>
                    <input type="text" required className="contact-input" placeholder="Ex: Dupont" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label className="contact-label">Email <span>*</span></label>
                    <input type="email" required className="contact-input" placeholder="jean.dupont@email.com" />
                  </div>
                  <div>
                    <label className="contact-label">Téléphone</label>
                    <input type="tel" className="contact-input" placeholder="+226 00 00 00 00" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label className="contact-label">Pays <span>*</span></label>
                    <select required className="contact-input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem top 50%', backgroundSize: '0.65rem auto' }}>
                      <option value="">Sélectionnez un pays</option>
                      <option value="bf">Burkina Faso</option>
                      <option value="ci">Côte d'Ivoire</option>
                      <option value="sn">Sénégal</option>
                      <option value="bj">Bénin</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="contact-label">Catégorie <span>*</span></label>
                    <select required className="contact-input" style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.2rem top 50%', backgroundSize: '0.65rem auto' }}>
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

                <div>
                  <label className="contact-label">Sujet <span>*</span></label>
                  <input type="text" required className="contact-input" placeholder="En quelques mots..." />
                </div>

                <div>
                  <label className="contact-label">Message <span>*</span></label>
                  <textarea required rows={5} className="contact-input" style={{ resize: 'vertical' }} placeholder="Détaillez votre demande ici..."></textarea>
                </div>

                <div>
                  <label className="contact-label">Pièce jointe <span style={{ color: '#94a3b8', fontWeight: 500 }}>(facultatif)</span></label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', cursor: 'pointer', transition: 'all 0.3s' }} className="file-upload-zone">
                    <input type="file" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                    <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                      <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-primary)' }}>Cliquez pour uploader ou glissez un fichier</p>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Format accepté : JPG, PNG, PDF (Max 5Mo)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                  <input type="checkbox" id="privacy" required style={{ marginTop: '0.25rem', width: '20px', height: '20px', accentColor: 'var(--color-accent)', cursor: 'pointer' }} />
                  <label htmlFor="privacy" style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.5, cursor: 'pointer' }}>
                    J'accepte que mes données personnelles soient traitées pour répondre à ma demande, conformément à la <Link to="/confidentialite" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 700 }}>politique de confidentialité</Link>.
                  </label>
                </div>

                {status === 'error' && (
                  <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '12px', display: 'flex', gap: '0.5rem', alignItems: 'center', border: '1px solid #fca5a5' }}>
                    <AlertCircle size={20} /> Une erreur est survenue. Veuillez réessayer.
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'loading'} style={{ alignSelf: 'flex-start', padding: '1rem 3rem', borderRadius: '999px', fontWeight: 700, fontSize: '1.1rem', marginTop: '1rem', boxShadow: '0 10px 20px rgba(201,162,39,0.3)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  {status === 'loading' ? 'Envoi en cours...' : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      Envoyer mon message
                      <Send size={20} />
                    </span>
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
