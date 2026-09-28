import { Shield } from 'lucide-react';
import '../home.css';

export default function PrivacyPolicy() {
  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <section className="hero-section" style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Politique de confidentialité</h1>
        <p className="hero-subtitle">Comment nous protégeons et gérons vos données personnelles.</p>
        <p style={{ marginTop: '1rem', opacity: 0.8 }}>Dernière mise à jour : [DATE À COMPLÉTER]</p>
      </section>

      <div style={{ maxWidth: '800px', margin: '-2rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%' }}>
        <div className="card" style={{ padding: '3rem', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <Shield size={32} color="var(--color-primary)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>Vos données sont en sécurité</h2>
          </div>

          <div style={{ lineHeight: 1.7, color: 'var(--color-text-light)' }}>
            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>1. Collecte des données</h3>
            <p>
              Nous collectons uniquement les données strictement nécessaires au bon fonctionnement de la plateforme NESTORA : nom, prénom, adresse e-mail, numéro de téléphone, informations de facturation (le cas échéant) et données de navigation.
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>2. Utilisation des données</h3>
            <p>
              Vos données sont utilisées pour :
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Créer et gérer votre compte.</li>
              <li>Faciliter la mise en relation entre Utilisateurs.</li>
              <li>Assurer la sécurité et prévenir la fraude.</li>
              <li>Améliorer nos services.</li>
            </ul>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>3. Partage des informations</h3>
            <p>
              NESTORA ne vend aucune de vos données personnelles à des tiers. Vos informations de contact ne sont partagées avec d'autres Utilisateurs qu'avec votre consentement explicite (ex: lors d'une demande de visite).
            </p>

            <h3 style={{ color: 'var(--color-text-dark)', marginTop: '2rem', marginBottom: '1rem' }}>4. Vos droits</h3>
            <p>
              Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données. Vous pouvez exercer ces droits depuis les paramètres de votre compte ou en contactant notre support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
