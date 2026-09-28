import { useState, useMemo } from 'react';
import { Search, ChevronDown, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../home.css';

const FAQ_DATA = [
  { category: 'Général', q: "Qu'est-ce que NESTORA ?", a: "NESTORA est une plateforme immobilière innovante qui met en relation des chercheurs de logement, des propriétaires et des agences immobilières pour simplifier et sécuriser les transactions." },
  { category: 'Général', q: "Est-ce que NESTORA est disponible dans mon pays ?", a: "Nous sommes actuellement actifs dans plusieurs pays d'Afrique de l'Ouest (Burkina Faso, Côte d'Ivoire, Sénégal, etc.) et continuons de nous étendre." },
  { category: 'Général', q: "Comment contacter le support NESTORA ?", a: "Vous pouvez nous contacter via la page 'Nous contacter' accessible depuis le pied de page, ou directement à l'adresse support@nestora.com." },
  
  { category: 'Compte', q: "L'inscription est-elle gratuite ?", a: "Oui, la création d'un compte sur NESTORA est 100% gratuite, que vous soyez chercheur, propriétaire ou agence." },
  { category: 'Compte', q: "Comment modifier mes informations personnelles ?", a: "Connectez-vous à votre compte, allez dans 'Mon Profil' puis cliquez sur 'Modifier mes informations'." },
  { category: 'Compte', q: "J'ai oublié mon mot de passe, que faire ?", a: "Sur la page de connexion, cliquez sur 'Mot de passe oublié' et suivez les instructions envoyées par email." },
  
  { category: 'Recherche', q: "Comment trouver un logement ?", a: "Utilisez la barre de recherche sur la page d'accueil pour filtrer par ville, type de bien, budget et bien plus encore." },
  { category: 'Recherche', q: "Puis-je sauvegarder mes recherches ?", a: "Oui, en étant connecté, vous pouvez cliquer sur 'Sauvegarder cette recherche' pour recevoir des alertes lorsque de nouveaux biens correspondent à vos critères." },
  
  { category: 'Annonces', q: "Que signifie le badge 'Vérifié' sur une annonce ?", a: "Cela signifie que notre équipe a vérifié l'identité du propriétaire ou de l'agence, et/ou l'existence réelle du bien." },
  { category: 'Annonces', q: "Puis-je signaler une fausse annonce ?", a: "Absolument. Sur chaque page d'annonce, un bouton 'Signaler' vous permet de nous avertir d'un contenu suspect." },
  
  { category: 'Propriétaires', q: "Comment publier une annonce ?", a: "Créez un compte 'Propriétaire', connectez-vous, et cliquez sur 'Publier une annonce' en haut à droite de l'écran." },
  { category: 'Propriétaires', q: "Combien coûte la publication d'une annonce ?", a: "La première annonce est souvent gratuite. Ensuite, nous proposons des formules à l'unité ou des abonnements très abordables." },
  { category: 'Propriétaires', q: "Puis-je modifier mon annonce après sa publication ?", a: "Oui, depuis votre tableau de bord, vous pouvez modifier le prix, la description ou les photos à tout moment." },
  
  { category: 'Agences', q: "Quels sont les avantages d'un compte Agence ?", a: "Un compte Agence permet de gérer un grand volume de biens, d'ajouter des agents collaborateurs, et d'accéder à des statistiques avancées." },
  { category: 'Agences', q: "Comment migrer mon compte Propriétaire vers Agence ?", a: "Contactez notre support client qui se chargera de vérifier votre statut professionnel et de basculer votre compte." },
  
  { category: 'Visites', q: "Comment planifier une visite ?", a: "Une fois un bien trouvé, contactez l'annonceur via la messagerie pour convenir d'une date et d'une heure de visite." },
  { category: 'Visites', q: "Dois-je payer pour visiter un logement ?", a: "NESTORA interdit fermement les frais de visite. Si un annonceur vous demande de payer pour visiter, signalez-le immédiatement." },
  
  { category: 'Messagerie', q: "Où puis-je retrouver mes conversations ?", a: "Dans votre espace personnel, cliquez sur l'onglet 'Messages' pour retrouver tout votre historique d'échanges." },
  { category: 'Messagerie', q: "Puis-je envoyer des pièces jointes ?", a: "Oui, notre messagerie permet d'envoyer des documents PDF ou des images pour faciliter vos démarches." },
  
  { category: 'Paiements', q: "Quels moyens de paiement acceptez-vous ?", a: "Nous acceptons les cartes bancaires (Visa, Mastercard) et les principaux services de Mobile Money (Orange, MTN, Moov, Wave)." },
  { category: 'Paiements', q: "Le paiement en ligne est-il sécurisé ?", a: "Oui, tous nos paiements sont cryptés et traités par des partenaires de paiement certifiés." },
  
  { category: 'Abonnements', q: "Puis-je annuler mon abonnement Agence ?", a: "Oui, les abonnements sont sans engagement. Vous pouvez l'annuler depuis vos paramètres de facturation." },
  
  { category: 'Boost', q: "Qu'est-ce qu'un Boost ?", a: "Un Boost met votre annonce en évidence (bannière, tête de liste) pendant une période donnée pour maximiser sa visibilité." },
  { category: 'Boost', q: "Le Boost garantit-il de trouver un locataire ?", a: "Il garantit plus de vues et de contacts, mais le choix final dépend de l'attractivité de votre bien et de son prix." },
  
  { category: 'Vérification', q: "Quels documents fournir pour faire vérifier mon profil ?", a: "Généralement une pièce d'identité valide (CNI, Passeport) et un justificatif de domicile ou document de propriété." },
  
  { category: 'Sécurité', q: "Comment éviter les arnaques ?", a: "Ne payez jamais avant d'avoir visité le bien et signé un contrat. Lisez nos conseils sur la page 'Sécurité et confiance'." },
  { category: 'Sécurité', q: "Mes données personnelles sont-elles protégées ?", a: "Oui, nous respectons les normes de protection des données et ne vendons jamais vos informations à des tiers." },
];

const CATEGORIES = ['Toutes', 'Général', 'Compte', 'Recherche', 'Annonces', 'Propriétaires', 'Agences', 'Visites', 'Messagerie', 'Paiements', 'Abonnements', 'Boost', 'Vérification', 'Sécurité'];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Toutes');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(i => i !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchCategory = activeCategory === 'Toutes' || item.category === activeCategory;
      const matchSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem' }}>
      <section className="hero-section" style={{ minHeight: '40vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title">Foire Aux Questions</h1>
        <p className="hero-subtitle">Trouvez rapidement des réponses à toutes vos questions.</p>
        
        <div className="search-box" style={{ maxWidth: '600px', margin: '2rem auto 0', padding: '0.5rem', background: 'white', borderRadius: '50px', display: 'flex', alignItems: 'center' }}>
          <Search color="var(--color-text-light)" style={{ marginLeft: '1rem' }} />
          <input 
            type="text" 
            placeholder="Rechercher une réponse..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', padding: '1rem', width: '100%', borderRadius: '50px', fontSize: '1rem' }}
          />
        </div>
      </section>

      <div style={{ maxWidth: '1000px', margin: '-2rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%', display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Catégories (Sidebar) */}
        <div className="card" style={{ flex: 1, minWidth: '250px', padding: '1.5rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Catégories</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => setActiveCategory(cat)}
                  style={{ 
                    width: '100%', 
                    textAlign: 'left', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
                    color: activeCategory === cat ? 'white' : 'var(--color-text-dark)',
                    fontWeight: activeCategory === cat ? 600 : 400,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Liste FAQ */}
        <div style={{ flex: 3, minWidth: '300px' }}>
          {filteredFaq.length === 0 ? (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <Search size={48} color="var(--color-text-light)" style={{ margin: '0 auto 1rem' }} />
              <h3>Aucun résultat trouvé</h3>
              <p className="text-light">Essayez de reformuler votre recherche.</p>
            </div>
          ) : (
            <div className="faq-container">
              {filteredFaq.map((item, index) => {
                const isOpen = openItems.includes(index);
                return (
                  <div className={`faq-item ${isOpen ? 'active' : ''}`} key={index} style={{ backgroundColor: 'white', borderRadius: '8px', marginBottom: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                    <button 
                      onClick={() => toggleItem(index)}
                      style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '1.1rem', color: isOpen ? 'var(--color-primary)' : 'inherit' }}
                      aria-expanded={isOpen}
                    >
                      {item.q}
                      <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    </button>
                    {isOpen && (
                      <div className="faq-answer" style={{ padding: '0 1.5rem 1.5rem', color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="card mt-4" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-primary)', color: 'white' }}>
            <MessageCircle size={40} color="var(--color-accent)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Vous n'avez pas trouvé votre réponse ?</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Notre équipe de support est là pour vous aider.</p>
            <Link to="/nous-contacter" className="btn btn-primary" style={{ background: 'var(--color-accent)' }}>Nous contacter</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
