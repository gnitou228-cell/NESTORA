import { useState, useEffect } from 'react';
import { Loader, FileText, CheckCircle2, Clock, XCircle, Printer, X, CreditCard, Sparkles } from 'lucide-react';
import { formatPrice } from '../config/monetization';
import api from '../lib/api';
import { Link } from 'react-router-dom';

interface PaymentItem {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  metadata?: string;
  invoice?: {
    id: string;
    invoiceNumber: string;
    issuedAt: string;
    amount: number;
    currency: string;
    status: string;
  } | null;
}

export default function Invoices() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentItem | null>(null);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/history');
      setPayments(response.data || []);
    } catch (error) {
      console.error('Erreur chargement paiements', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'PAID':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#dcfce7', color: '#15803d', padding: '0.25rem 0.65rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 600 }}>
            <CheckCircle2 size={12} /> Payé
          </span>
        );
      case 'PENDING':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '0.25rem 0.65rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 600 }}>
            <Clock size={12} /> En attente
          </span>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.25rem 0.65rem', borderRadius: '1rem', fontSize: '0.78rem', fontWeight: 600 }}>
            <XCircle size={12} /> Échoué
          </span>
        );
    }
  };

  const getProductName = (pay: PaymentItem) => {
    if (pay.type === 'SUBSCRIPTION') return 'Abonnement Professionnel';
    if (pay.type === 'BOOST') return 'Boost Visibilité Annonce';
    return pay.type || 'Service Nestora';
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '50vh', gap: '1rem' }}>
        <Loader className="spin" size={38} color="#0B1F3A" />
        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Chargement de vos transactions...</span>
      </div>
    );
  }

  return (
    <div className="invoices-page container mt-4" style={{ paddingBottom: '90px', maxWidth: '1080px' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-dark)', margin: 0, letterSpacing: '-0.02em' }}>
            Paiements & Factures
          </h1>
          <p className="text-light mt-1" style={{ margin: 0, fontSize: '0.95rem' }}>
            Consultez l'historique complet de vos règlements, abonnements et factures acquittées.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/tarifs" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <Sparkles size={16} /> Offres Premium
          </Link>
          <Link to="/boost" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600 }}>
            <CreditCard size={16} /> Booster un bien
          </Link>
        </div>
      </div>

      {payments.length === 0 ? (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          border: '1.5px dashed #cbd5e1',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#0B1F3A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <FileText size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            Aucun historique de paiement pour le moment
          </h3>
          <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem', lineHeight: '1.5' }}>
            Vos factures d'abonnements, packs et boosts de visibilité apparaîtront ici dès que vous effectuerez une transaction sur Nestora.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/tarifs" className="btn btn-primary" style={{ fontWeight: 600 }}>
              Découvrir les forfaits
            </Link>
            <Link to="/mes-annonces" className="btn btn-outline" style={{ fontWeight: 600 }}>
              Voir mes annonces
            </Link>
          </div>
        </div>
      ) : (
        <div className="card p-0" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Desktop Table View */}
          <div className="desktop-only table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', backgroundColor: '#f8fafc' }}>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Réf. / Facture</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Date</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Service</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Montant</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Mode de règlement</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>Statut</th>
                  <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Détails</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay) => {
                  const refNum = pay.invoice?.invoiceNumber || `#PAY-${pay.id.substring(0, 8).toUpperCase()}`;
                  return (
                    <tr key={pay.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>
                        {refNum}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.88rem' }}>
                        {new Date(pay.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
                        {getProductName(pay)}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                        {formatPrice(pay.amount, pay.currency as any)}
                      </td>
                      <td style={{ padding: '1rem', color: '#475569', fontSize: '0.88rem' }}>
                        {pay.provider || 'En ligne'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {getStatusBadge(pay.status)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} 
                          onClick={() => setSelectedInvoice(pay)}
                        >
                          <FileText size={14} /> Facture
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="mobile-only" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {payments.map((pay) => {
              const refNum = pay.invoice?.invoiceNumber || `#PAY-${pay.id.substring(0, 8).toUpperCase()}`;
              return (
                <div 
                  key={pay.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.15rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>{refNum}</div>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', marginTop: '2px' }}>
                        {getProductName(pay)}
                      </div>
                    </div>
                    {getStatusBadge(pay.status)}
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', marginBottom: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Date</div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{new Date(pay.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Moyen</div>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{pay.provider || 'En ligne'}</div>
                    </div>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Montant total</div>
                      <div style={{ fontWeight: 800, color: '#0B1F3A', fontSize: '1.05rem' }}>
                        {formatPrice(pay.amount, pay.currency as any)}
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-outline" 
                    style={{ width: '100%', minHeight: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}
                    onClick={() => setSelectedInvoice(pay)}
                  >
                    <FileText size={15} /> Voir le reçu / la facture
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedInvoice(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0B1F3A' }}>NESTORA</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Reçu de paiement officiel</span>
              </div>
              <button onClick={() => setSelectedInvoice(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ borderTop: '2px solid #0B1F3A', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Numéro de reçu :</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedInvoice.invoice?.invoiceNumber || `#PAY-${selectedInvoice.id.substring(0, 8).toUpperCase()}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Date d'émission :</span>
                <span style={{ fontWeight: 600 }}>{new Date(selectedInvoice.createdAt).toLocaleString('fr-FR')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Mode de règlement :</span>
                <span style={{ fontWeight: 600 }}>{selectedInvoice.provider || 'Paiement en ligne'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: '#64748b' }}>Statut :</span>
                <span>{getStatusBadge(selectedInvoice.status)}</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{getProductName(selectedInvoice)}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Prestation de visibilité plateforme Nestora</div>
                </div>
                <div style={{ fontWeight: 800, color: '#0B1F3A', fontSize: '1.15rem' }}>
                  {formatPrice(selectedInvoice.amount, selectedInvoice.currency as any)}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setSelectedInvoice(null)}
              >
                Fermer
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => window.print()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
              >
                <Printer size={16} /> Imprimer / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
