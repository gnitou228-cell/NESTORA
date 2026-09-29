import { useState, useEffect } from 'react';
import { Download, Loader } from 'lucide-react';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';

export default function Invoices() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/payments/history');
        setPayments(response.data || []);
      } catch (error) {
        console.error('Erreur chargement paiements', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Loader className="spin" size={40} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div className="invoices-page">
      <div className="mb-4">
        <h1 className="page-title">Paiements & Factures</h1>
        <p className="page-subtitle text-light">Consultez l'historique de vos transactions et téléchargez vos factures.</p>
      </div>

      <div className="card p-0">
        <div className="table-responsive">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', backgroundColor: 'var(--color-secondary)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Référence</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Produit</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Montant</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Moyen de paiement</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Statut</th>
                <th style={{ padding: '1rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Facture</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center" style={{ padding: '2rem', color: 'var(--color-text-light)' }}>
                    Aucun paiement trouvé
                  </td>
                </tr>
              ) : payments.map((pay) => (
                <tr key={pay.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>#{pay.id.substring(0,8).toUpperCase()}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                    {new Date(pay.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{pay.type === 'SUBSCRIPTION' ? 'Abonnement' : 'Boost Annonce'}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{formatPrice(pay.amount, pay.currency)}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{pay.provider}</td>
                  <td style={{ padding: '1rem' }}>
                    <div className={`mini-badge ${pay.status === 'SUCCESS' ? 'badge-success' : pay.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`} style={{ display: 'inline-block' }}>
                      {pay.status === 'SUCCESS' ? 'Payé' : pay.status}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {pay.invoice ? (
                      <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} title="Télécharger">
                        <Download size={14} />
                      </button>
                    ) : (
                      <span className="text-light" style={{ fontSize: '0.8rem' }}>Non dispo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
