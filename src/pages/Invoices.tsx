import { Download } from 'lucide-react';
import { invoices } from '../data/mockData';

export default function Invoices() {
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
              {invoices.map((inv, idx) => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>#NST-00{idx + 1}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>{inv.date}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{inv.desc}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{inv.amount}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem' }}>Orange Money</td>
                  <td style={{ padding: '1rem' }}>
                    <div className="mini-badge badge-success" style={{ display: 'inline-block' }}>{inv.status}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} title="Télécharger">
                      <Download size={14} />
                    </button>
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
