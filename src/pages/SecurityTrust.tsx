import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Flag, AlertTriangle, Eye, Lock, MessageCircle, AlertCircle } from 'lucide-react';
import '../home.css';

export default function SecurityTrust() {
  return (
    <div className="landing-page">
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title">Sécurité et Confiance</h1>
        <p className="hero-subtitle">Parce que votre tranquillité d'esprit est notre priorité, découvrez nos mesures et nos conseils pour naviguer en toute sécurité.</p>
      </section>

      <section className="section bg-secondary">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="d-flex align-center gap-2 mb-4">
            <Shield size={32} color="var(--color-primary)" />
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Nos mécanismes de confiance</h2>
          </div>
          <p className="text-light mb-5" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            NESTORA s'efforce de créer un environnement sûr pour tous ses utilisateurs. Bien qu'aucune plateforme ne puisse garantir une sécurité absolue à 100%, nous mettons en place plusieurs mécanismes pour réduire au maximum les risques de fraude et de comportement abusif.
          </p>

          <div className="steps-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <CheckCircle size={32} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Vérification des profils</h3>
              <p className="text-light">
                Lorsque cela est disponible, nous demandons à nos propriétaires et agences partenaires de fournir des documents d'identité et justificatifs. Un badge "Vérifié" est alors ajouté à leur profil.
              </p>
            </div>
            
            <div className="card" style={{ padding: '2rem' }}>
              <Eye size={32} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Modération des annonces</h3>
              <p className="text-light">
                Notre équipe de modération effectue des contrôles réguliers sur les nouvelles annonces pour détecter les contenus inappropriés ou suspects avant ou peu après leur publication.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <Flag size={32} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Système de signalement</h3>
              <p className="text-light">
                Chaque annonce dispose d'un bouton de signalement. Grâce à la vigilance de notre communauté, nous pouvons réagir rapidement pour suspendre les annonces douteuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 className="section-title text-center mb-5">Nos conseils de sécurité</h2>

          <div className="d-flex" style={{ gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Avant toute visite</h3>
                  <p className="text-light" style={{ lineHeight: 1.6 }}>
                    Soyez vigilant si l'annonceur vous demande des documents personnels (pièce d'identité, fiche de paie) avant même d'avoir visité le bien. Ne transmettez pas de documents sensibles sans avoir rencontré la personne ou visité le logement.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Avant tout paiement</h3>
                  <p className="text-light" style={{ lineHeight: 1.6 }}>
                    <strong>Ne payez jamais</strong> via des transferts d'argent anonymes (Western Union, Mandat Cash) ou des virements internationaux pour réserver un bien que vous n'avez pas visité.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Privilégiez la messagerie interne</h3>
                  <p className="text-light" style={{ lineHeight: 1.6 }}>
                    Utilisez la messagerie NESTORA pour vos premiers échanges. Méfiez-vous des utilisateurs qui insistent pour communiquer immédiatement via WhatsApp ou email personnel avant de vous donner les détails.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Lock size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Protégez votre compte</h3>
                  <p className="text-light" style={{ lineHeight: 1.6 }}>
                    Utilisez un mot de passe complexe et unique pour NESTORA. Notre équipe ne vous demandera jamais votre mot de passe par email ou par téléphone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-secondary text-center">
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '3rem', borderRadius: 'var(--border-radius)', boxShadow: 'var(--shadow-md)' }}>
          <Flag size={48} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Une annonce vous semble suspecte ?</h2>
          <p className="text-light mb-4" style={{ fontSize: '1.1rem' }}>
            Si un bien semble trop beau pour être vrai (prix anormalement bas, photos irréalistes) ou si le comportement d'un annonceur vous paraît douteux, n'hésitez pas à nous le signaler.
          </p>
          <Link to="/signaler-une-annonce" className="btn btn-outline" style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
            Signaler une annonce
          </Link>
        </div>
      </section>
    </div>
  );
}
