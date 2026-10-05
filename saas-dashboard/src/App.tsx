import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Tags, 
  CreditCard, 
  Settings, 
  Menu, 
  X,
  Bot,
  Zap,
  CheckCircle2
} from 'lucide-react';
import './index.css';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Tableau de bord' },
    { path: '/conversations', icon: <MessageSquare size={20} />, label: 'Conversations' },
    { path: '/produits', icon: <Tags size={20} />, label: 'Mes Produits' },
    { path: '/tarifs', icon: <CreditCard size={20} />, label: 'Abonnements' },
    { path: '/parametres', icon: <Settings size={20} />, label: 'Paramètres' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo">
        <Bot size={32} color="#6366F1" />
        <span>Nestora AI</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => { if(window.innerWidth <= 768) toggleSidebar(); }}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="glass" style={{ padding: '16px', marginTop: 'auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Mode WhatsApp</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10B981', fontWeight: 600 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
          En ligne
        </div>
      </div>
    </div>
  );
};

const DashboardHome = () => (
  <div>
    <h1 className="gradient-text">Bienvenue, Jeff ! 👋</h1>
    <p>Voici l'activité de votre robot vendeur aujourd'hui.</p>

    <div className="dashboard-grid">
      <div className="glass stat-card">
        <div className="stat-icon"><MessageSquare size={24} /></div>
        <div>
          <h3>Messages traités</h3>
          <div className="stat-value">1,284</div>
          <p style={{ color: '#10B981', fontSize: '0.9rem', marginTop: '8px' }}>+12% depuis hier</p>
        </div>
      </div>
      <div className="glass stat-card">
        <div className="stat-icon" style={{ color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)' }}><Zap size={24} /></div>
        <div>
          <h3>Ventes conclues par l'IA</h3>
          <div className="stat-value">47</div>
          <p style={{ color: '#10B981', fontSize: '0.9rem', marginTop: '8px' }}>+5% depuis hier</p>
        </div>
      </div>
      <div className="glass stat-card">
        <div className="stat-icon" style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)' }}><LayoutDashboard size={24} /></div>
        <div>
          <h3>Temps de réponse moyen</h3>
          <div className="stat-value">1.2s</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Instantané</p>
        </div>
      </div>
    </div>

    <div style={{ marginTop: '48px' }} className="glass">
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dernières conversations</h2>
        <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Voir tout</button>
      </div>
      <div style={{ padding: '24px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: i !== 3 ? '1px solid var(--border-light)' : 'none' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              +226
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '4px' }}>Client #{8473 + i}</h4>
              <p style={{ fontSize: '0.9rem' }}>"Est-ce que la formation Capcut est toujours disponible ?"</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Il y a {i * 5} min</span>
              <div style={{ color: '#10B981', fontSize: '0.85rem', marginTop: '4px' }}>Répondu par l'IA</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Pricing = () => (
  <div>
    <h1 className="gradient-text">Nos Tarifs</h1>
    <p>Choisissez l'abonnement qui correspond à votre volume de ventes. Sans engagement.</p>

    <div className="pricing-grid">
      {/* Plan Starter */}
      <div className="glass pricing-card">
        <h3>Starter</h3>
        <p>Idéal pour les petits commerçants qui se lancent.</p>
        <div className="price">15 000<span> CFA / mois</span></div>
        <ul className="feature-list">
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Jusqu'à 500 discussions/mois</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Robot IA personnalisé</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> 10 produits au catalogue</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Support par email</li>
        </ul>
        <button className="btn-outline">Choisir ce plan</button>
      </div>

      {/* Plan Pro */}
      <div className="glass pricing-card popular">
        <h3 className="gradient-text">Pro Business</h3>
        <p>Pour les agences immobilières et e-commerçants actifs.</p>
        <div className="price">35 000<span> CFA / mois</span></div>
        <ul className="feature-list">
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Discussions illimitées</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Robot IA ultra-performant</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Produits illimités</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Intégration Mobile Money</li>
          <li className="feature-item"><CheckCircle2 className="feature-icon" size={20} /> Support prioritaire 24/7</li>
        </ul>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Commencer l'essai gratuit</button>
      </div>
    </div>
  </div>
);

const Placeholder = ({ title }: { title: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
    <Bot size={64} color="var(--text-muted)" style={{ marginBottom: '24px', opacity: 0.5 }} />
    <h2>{title}</h2>
    <p>Cette fonctionnalité est en cours de développement.</p>
  </div>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/tarifs" element={<Pricing />} />
            <Route path="/conversations" element={<Placeholder title="Conversations en direct" />} />
            <Route path="/produits" element={<Placeholder title="Gestion du catalogue" />} />
            <Route path="/parametres" element={<Placeholder title="Paramètres du compte" />} />
          </Routes>
        </main>

        <button 
          className="mobile-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </BrowserRouter>
  );
}

export default App;
