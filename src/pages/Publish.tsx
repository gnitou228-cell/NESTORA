import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText } from 'lucide-react';

export default function Publish() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      // For agencies with a subscription, we might bypass checkout.
      // But for demo, redirect to pricing page to select plan.
      navigate('/tarifs');
    }, 1000);
  };

  const renderChercheurForm = () => (
    <form onSubmit={handleSubmit} className="publish-form">
      <div className="card p-3 mb-3">
        <h3 className="mb-2">Votre recherche</h3>
        <div className="form-group mb-2">
          <label>Type de logement souhaité</label>
          <select className="form-control" required>
            <option>Maison</option>
            <option>Appartement</option>
            <option>Terrain</option>
          </select>
        </div>
        <div className="form-group mb-2">
          <label>Budget maximum (FCFA)</label>
          <input type="number" className="form-control" required placeholder="Ex: 150000" />
        </div>
        <div className="form-group mb-2">
          <label>Quartiers ciblés</label>
          <input type="text" className="form-control" required placeholder="Ex: Ouaga 2000, ZAD" />
        </div>
        <div className="form-group mb-2">
          <label>Description de votre besoin</label>
          <textarea className="form-control" rows={4} required placeholder="Détaillez votre recherche..."></textarea>
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
        {loading ? 'Traitement...' : 'Valider ma recherche et choisir un forfait'}
      </button>
    </form>
  );

  const renderProprietaireForm = () => (
    <form onSubmit={handleSubmit} className="publish-form">
      <div className="card p-3 mb-3">
        <h3 className="mb-2">Informations sur le bien</h3>
        <div className="form-group mb-2">
          <label>Titre de l'annonce</label>
          <input type="text" className="form-control" required placeholder="Ex: Belle villa 4 pièces" />
        </div>
        <div className="d-flex" style={{ gap: '1rem' }}>
          <div className="form-group mb-2" style={{ flex: 1 }}>
            <label>Transaction</label>
            <select className="form-control" required>
              <option>À louer</option>
              <option>À vendre</option>
            </select>
          </div>
          <div className="form-group mb-2" style={{ flex: 1 }}>
            <label>Type de bien</label>
            <select className="form-control" required>
              <option>Villa</option>
              <option>Appartement</option>
              <option>Studio</option>
              <option>Terrain</option>
              <option>Bureau</option>
            </select>
          </div>
        </div>
        <div className="d-flex" style={{ gap: '1rem' }}>
          <div className="form-group mb-2" style={{ flex: 1 }}>
            <label>Prix (FCFA)</label>
            <input type="number" className="form-control" required />
          </div>
          <div className="form-group mb-2" style={{ flex: 1 }}>
            <label>Surface (m²)</label>
            <input type="number" className="form-control" required />
          </div>
        </div>
        <div className="form-group mb-2">
          <label>Description complète</label>
          <textarea className="form-control" rows={5} required placeholder="Décrivez votre bien en détail..."></textarea>
        </div>
        <div className="form-group mb-2">
          <label>Photos (jusqu'à 10)</label>
          <input type="file" className="form-control" multiple accept="image/*" />
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
        {loading ? 'Traitement...' : 'Continuer vers le paiement'}
      </button>
    </form>
  );

  return (
    <div className="publish-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-4">
        <FileText size={48} color="#0B1F3A" style={{ margin: '0 auto 1rem' }} />
        <h1 className="page-title">
          {role === 'SEEKER' ? 'Publier une demande' : 'Publier une annonce'}
        </h1>
        <p className="page-subtitle text-light">
          Remplissez les informations ci-dessous pour publier sur NESTORA.
        </p>
      </div>

      {role === 'SEEKER' ? renderChercheurForm() : renderProprietaireForm()}
      
      <style>{`
        .form-control {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          font-family: inherit;
          font-size: 0.95rem;
          margin-top: 0.25rem;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(11, 31, 58, 0.1);
        }
        .form-group label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-text-dark);
        }
      `}</style>
    </div>
  );
}
