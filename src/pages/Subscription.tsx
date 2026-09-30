import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, CreditCard, Check, AlertCircle, XCircle, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { invoices } from '../data/mockData';

export default function Subscription() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check if user has premium in local storage (mock for now)
    const premium = localStorage.getItem('nestora_is_premium') === 'true';
    setIsPremium(premium);
  }, []);

  const handleCancelSubscription = () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler votre abonnement Premium ? Vos avantages resteront actifs jusqu'à la fin de la période de facturation en cours.")) {
      localStorage.setItem('nestora_is_premium', 'false');
      setIsPremium(false);
      alert("Votre abonnement a été annulé avec succès.");
      // Optionnellement, rafraîchir ou rediriger
      navigate('/dashboard');
    }
  };

  if (role === 'SEEKER') {
    return (
      <div className="subscription-page">
        <div className="mb-4">
          <h1 className="page-title">Pass Premium (Chercheur VIP)</h1>
          <p className="page-subtitle text-light">Débloquez les meilleures opportunités en exclusivité.</p>
        </div>
        <div className="text-center mt-5" style={{ background: '#fff', borderRadius: '16px', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
          {isPremium ? (
            <>
              <Crown size={48} color="#C9A227" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Votre Pass Premium est Actif !</h2>
              <p className="text-light mb-4" style={{ fontSize: '1.1rem' }}>
                Vous avez accès à toutes les annonces exclusives en avant-première pendant 48h et votre badge VIP accélère vos demandes de visite.
              </p>
              <button onClick={handleCancelSubscription} className="btn" style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b' }}>Résilier mon pass</button>
            </>
          ) : (
            <>
              <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Lock size={32} color="#64748b" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Passez au statut VIP</h2>
              <p className="text-light mb-4" style={{ fontSize: '1.1rem' }}>
                Accédez aux annonces exclusives 48h avant tout le monde, et obtenez le badge VIP pour que les propriétaires priorisent vos demandes.
              </p>
              <Link to="/tarifs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.1rem', background: 'linear-gradient(135deg, #C9A227 0%, #B89320 100%)', border: 'none' }}>
                <Crown size={20} /> Découvrir les Pass VIP
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="subscription-page">
        <div className="mb-4">
          <h1 className="page-title">Mon Abonnement</h1>
          <p className="page-subtitle text-light">Gérez votre formule, vos quotas et vos factures.</p>
        </div>
        <div className="text-center mt-5" style={{ background: '#fff', borderRadius: '16px', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <XCircle size={32} color="#64748b" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Aucun abonnement actif</h2>
          <p className="text-light mb-4" style={{ fontSize: '1.1rem' }}>
            Passez au Premium pour publier vos annonces en illimité et obtenir un maximum de visibilité sur Nestora.
          </p>
          <Link to="/tarifs" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.1rem' }}>
            <Crown size={20} /> Découvrir les offres Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="mb-4">
        <h1 className="page-title">Mon Abonnement</h1>
        <p className="page-subtitle text-light">Gérez votre formule, vos quotas et vos factures.</p>
      </div>

      <div className="dashboard-grid">
        <div className="main-column">
          <div className="card mb-4" style={{ borderTop: '4px solid #C9A227' }}>
            <div className="d-flex justify-between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="d-flex" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Crown size={24} color="#C9A227" />
                  <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Pack {role} - Standard</h2>
                  <span className="badge-success" style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600 }}>Actif</span>
                </div>
                <p className="text-light mb-3">Renouvellement automatique le 25 oct. 2025</p>
                
                <div className="d-flex" style={{ gap: '2rem', marginBottom: '1.5rem' }}>
                  <div>
                    <div className="text-light" style={{ fontSize: '0.85rem' }}>Date de début</div>
                    <div style={{ fontWeight: 600 }}>25 oct. 2024</div>
                  </div>
                  <div>
                    <div className="text-light" style={{ fontSize: '0.85rem' }}>Prochain paiement</div>
                    <div style={{ fontWeight: 600 }}>40 000 FCFA</div>
                  </div>
                </div>

                <div className="progress-bar-container mb-2" style={{ maxWidth: '400px' }}>
                  <div className="d-flex justify-between mb-1" style={{ fontSize: '0.85rem' }}>
                    <span>Annonces utilisées : <strong>3</strong></span>
                    <span>Restantes : <strong>7</strong> / 10</span>
                  </div>
                  <div className="progress-bar-bg" style={{ height: '8px' }}>
                    <div className="progress-bar-fill" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <Link to="/tarifs" className="btn btn-primary mb-2" style={{ display: 'block' }}>Passer à la formule supérieure</Link>
                <button className="btn btn-outline" style={{ display: 'block', width: '100%', color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }} onClick={handleCancelSubscription}>Résilier l'abonnement</button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-3">Fonctionnalités incluses</h3>
            <div className="pricing-grid mini-grid">
              <ul className="pricing-features" style={{ margin: 0 }}>
                <li><Check size={16} className="text-success" /> Jusqu'à 10 annonces actives</li>
                <li><Check size={16} className="text-success" /> Statistiques de base</li>
                <li><Check size={16} className="text-success" /> Messagerie intégrée</li>
              </ul>
              <ul className="pricing-features" style={{ margin: 0 }}>
                <li><Check size={16} className="text-success" /> Gestion des visites</li>
                <li><Check size={16} className="text-success" /> Support email</li>
                <li className="text-light"><AlertCircle size={16} /> Pas de boost mensuel inclus</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="side-column">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <CreditCard size={18} /> Moyen de paiement
              </div>
            </div>
            <div className="d-flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '32px', background: '#f1f5f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                💳
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Orange Money</div>
                <div className="text-light" style={{ fontSize: '0.85rem' }}>Se termine par **** 4567</div>
              </div>
            </div>
            <button className="btn btn-outline btn-block text-sm">Modifier le moyen de paiement</button>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Dernières factures</div>
              <Link to="/paiements" className="card-link">Voir tout</Link>
            </div>
            <div className="mini-list">
              {invoices.map(inv => (
                <div className="mini-item" key={inv.id}>
                  <div className="mini-item-content">
                    <div className="mini-item-title">{inv.desc}</div>
                    <div className="mini-item-sub">{inv.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{inv.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
