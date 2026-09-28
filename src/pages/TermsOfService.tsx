import { useState, useEffect } from 'react';
import { Search, ChevronUp, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../home.css';

const SECTIONS = [
  { id: 'preambule', title: '1. Préambule' },
  { id: 'definitions', title: '2. Définitions' },
  { id: 'objet', title: '3. Objet des CGU' },
  { id: 'compte', title: '4. Création du compte' },
  { id: 'roles', title: '5. Rôles des utilisateurs' },
  { id: 'annonces', title: '6. Annonces immobilières' },
  { id: 'verification', title: '7. Vérification' },
  { id: 'contact', title: '8. Contact et messagerie' },
  { id: 'visites', title: '9. Demandes de visite' },
  { id: 'abonnements', title: '10. Abonnements' },
  { id: 'publication', title: '11. Publication payante' },
  { id: 'boost', title: '12. Boost des annonces' },
  { id: 'paiements', title: '13. Paiements' },
  { id: 'responsabilites', title: '14. Responsabilités' },
  { id: 'transactions', title: '15. Transactions immobilières' },
  { id: 'fraudes', title: '16. Lutte contre les fraudes' },
  { id: 'contenu', title: '17. Contenu utilisateur' },
  { id: 'moderation', title: '18. Modération' },
  { id: 'resiliation', title: '19. Suspension et résiliation' },
  { id: 'propriete', title: '20. Propriété intellectuelle' },
  { id: 'donnees', title: '21. Données personnelles' },
  { id: 'cookies', title: '22. Cookies' },
  { id: 'disponibilite', title: '23. Disponibilité du service' },
  { id: 'limitation', title: '24. Limitation de responsabilité' },
  { id: 'tiers', title: '25. Liens et services tiers' },
  { id: 'modifications', title: '26. Modifications des CGU' },
  { id: 'juridiction', title: '27. Droit applicable' },
  { id: 'contact-juridique', title: '28. Contact juridique' },
  { id: 'acceptation', title: '29. Acceptation' }
];

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState('preambule');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);

      const sectionElements = SECTIONS.map(s => document.getElementById(s.id));
      const currentScroll = window.scrollY + 150; // offset for sticky header

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= currentScroll) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredSections = SECTIONS.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="landing-page bg-secondary" style={{ paddingBottom: '4rem' }}>
      <section className="hero-section" style={{ minHeight: '35vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Conditions générales d’utilisation</h1>
        <p className="hero-subtitle" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Les règles qui encadrent l’utilisation de la plateforme NESTORA.
        </p>
        <p style={{ marginTop: '1rem', opacity: 0.8 }}>Dernière mise à jour : [DATE À COMPLÉTER]</p>
      </section>

      <div style={{ maxWidth: '1200px', margin: '-2rem auto 0', position: 'relative', zIndex: 2, padding: '0 5%', display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Sidebar Sommaire */}
        <div className="cgu-sidebar card" style={{ flex: '1 1 300px', position: 'sticky', top: '100px', padding: '1.5rem', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', paddingBottom: '1rem', zIndex: 10 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="var(--color-primary)" /> Sommaire
            </h3>
            <div className="search-box" style={{ display: 'flex', alignItems: 'center', background: 'var(--color-secondary)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
              <Search size={16} color="var(--color-text-light)" />
              <input 
                type="text" 
                placeholder="Rechercher une section..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', marginLeft: '0.5rem', fontSize: '0.9rem' }}
              />
            </div>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {filteredSections.map(section => (
              <li key={section.id}>
                <a 
                  href={`#${section.id}`}
                  style={{ 
                    display: 'block', 
                    padding: '0.5rem 0.75rem', 
                    borderRadius: '6px',
                    textDecoration: 'none',
                    color: activeSection === section.id ? 'var(--color-primary)' : 'var(--color-text-dark)',
                    backgroundColor: activeSection === section.id ? 'var(--color-secondary)' : 'transparent',
                    fontWeight: activeSection === section.id ? 600 : 400,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {section.title}
                </a>
              </li>
            ))}
            {filteredSections.length === 0 && (
              <li style={{ padding: '1rem', color: 'var(--color-text-light)', fontSize: '0.9rem', textAlign: 'center' }}>Aucune section trouvée.</li>
            )}
          </ul>
        </div>

        {/* Content */}
        <div className="cgu-content card" style={{ flex: '3 1 600px', padding: '3rem', backgroundColor: 'white' }}>
          
          <section id="preambule" style={{ marginBottom: '3rem' }}>
            <h2>1. Préambule</h2>
            <p>
              Bienvenue sur NESTORA, une plateforme technologique facilitant la mise en relation entre les personnes à la recherche d’un logement (les "Chercheurs"), les propriétaires immobiliers (les "Propriétaires") et les agences immobilières (les "Agences").
            </p>
            <p>
              Le principe général de notre service est d'offrir un espace numérique sécurisé, fluide et transparent pour publier, rechercher et gérer des biens immobiliers, ainsi que faciliter la prise de contact et les demandes de visites. 
            </p>
            <p>
              L’utilisation de la Plateforme vaut acceptation pleine et entière des présentes Conditions Générales d’Utilisation (les "CGU"). NESTORA se réserve le droit d’évoluer, et certaines fonctionnalités décrites peuvent n'être disponibles que progressivement ou dans certains pays spécifiques.
            </p>
          </section>

          <section id="definitions" style={{ marginBottom: '3rem' }}>
            <h2>2. Définitions</h2>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>NESTORA</strong> : désigne la plateforme, le site web, l'application et l'entité juridique qui l'exploite.</li>
              <li><strong>Plateforme</strong> : l'ensemble des services numériques fournis par NESTORA.</li>
              <li><strong>Utilisateur</strong> : toute personne naviguant sur la Plateforme, connectée ou non.</li>
              <li><strong>Chercheur</strong> : Utilisateur ayant créé un compte pour rechercher un logement.</li>
              <li><strong>Propriétaire</strong> : Utilisateur publiant des Annonces pour des biens dont il a la propriété ou le droit de location/vente légal.</li>
              <li><strong>Agence</strong> : Entité professionnelle utilisant la Plateforme pour diffuser ses biens immobiliers.</li>
              <li><strong>Agent</strong> : Utilisateur rattaché et autorisé par une Agence à agir en son nom.</li>
              <li><strong>Annonceur</strong> : Propriétaire, Agence ou Agent publiant une Annonce.</li>
              <li><strong>Annonce</strong> : Publication présentant un Bien immobilier à la location ou à la vente.</li>
              <li><strong>Bien immobilier</strong> : Logement, terrain ou local professionnel objet d'une Annonce.</li>
              <li><strong>Visite</strong> : Rendez-vous physique ou virtuel convenu entre un Chercheur et un Annonceur via la Plateforme.</li>
              <li><strong>Messagerie</strong> : Outil de communication interne à la Plateforme.</li>
              <li><strong>Abonnement / Boost</strong> : Services optionnels et payants permettant d'accéder à des fonctionnalités supplémentaires ou d'augmenter la visibilité d'une Annonce.</li>
              <li><strong>Vérification</strong> : Procédure par laquelle NESTORA s'assure de la validité de certaines informations fournies par l'Utilisateur.</li>
            </ul>
          </section>

          <section id="objet" style={{ marginBottom: '3rem' }}>
            <h2>3. Objet des CGU</h2>
            <p>Les présentes CGU ont pour objet de définir :</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Les conditions d'accès et de navigation sur la Plateforme.</li>
              <li>Les règles d'utilisation des différentes fonctionnalités.</li>
              <li>Les droits et obligations de NESTORA et des Utilisateurs.</li>
              <li>Les règles encadrant la publication et la gestion des Annonces.</li>
              <li>Les conditions générales des services payants, la modération, la sécurité et les responsabilités respectives.</li>
            </ul>
          </section>

          <section id="compte" style={{ marginBottom: '3rem' }}>
            <h2>4. Création du compte</h2>
            <p>
              Pour accéder aux fonctionnalités avancées de NESTORA, l'Utilisateur doit créer un Compte en fournissant des informations exactes, complètes et à jour (prénom, nom, email, téléphone, pays, région/province, ville, quartier, et rôle choisi).
            </p>
            <p><strong>Il est strictement interdit de :</strong></p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>S'inscrire sous une fausse identité ou usurper l'identité d'un tiers.</li>
              <li>Créer des comptes multiples abusifs pour contourner les règles ou limites de la Plateforme.</li>
              <li>Faire une utilisation frauduleuse de son compte ou le céder à un tiers.</li>
            </ul>
            <p>L'Utilisateur est seul responsable du maintien de l'exactitude de son profil.</p>
          </section>

          <section id="roles" style={{ marginBottom: '3rem' }}>
            <h2>5. Rôles des utilisateurs</h2>
            
            <h3 style={{ marginTop: '1.5rem' }}>Chercheur</h3>
            <p>Le Chercheur peut rechercher des biens, utiliser les filtres avancés, sauvegarder des annonces, contacter les annonceurs, demander des visites et, lorsque la fonctionnalité est disponible, publier une demande de logement. Il est responsable de ses échanges et du respect des engagements pris pour les visites.</p>

            <h3 style={{ marginTop: '1.5rem' }}>Propriétaire</h3>
            <p>Le Propriétaire peut créer un profil, publier ses propres biens, modifier ses annonces, recevoir des demandes, communiquer avec les Chercheurs, gérer les visites, et utiliser les options payantes (Abonnements, Boosts). Il garantit l'exactitude des informations publiées et sa légitimité à louer ou vendre le bien.</p>

            <h3 style={{ marginTop: '1.5rem' }}>Agence</h3>
            <p>L'Agence immobilière bénéficie d'un espace professionnel pour présenter son activité, publier de multiples biens, gérer un portefeuille d'annonces, administrer ses agents autorisés, traiter les prospects et utiliser les abonnements professionnels. L'Agence est pleinement responsable des actes de ses Agents sur la Plateforme.</p>

            <h3 style={{ marginTop: '1.5rem' }}>Agent</h3>
            <p>L'Agent intervient sous la responsabilité et l'autorité de l'Agence qui l'a invité. Ses permissions sont définies par l'Agence et il doit respecter les présentes CGU lors de toute action effectuée au nom de l'Agence.</p>
          </section>

          <section id="annonces" style={{ marginBottom: '3rem' }}>
            <h2>6. Annonces immobilières</h2>
            <p>Toute Annonce doit contenir des informations véridiques et à jour. Une annonce peut détailler : le titre, la transaction, le type, le prix, la devise, la géographie, la surface, les pièces, les équipements, une description claire, des photos/vidéos, la disponibilité et les moyens de contact.</p>
            <p><strong>Sont strictement interdits :</strong></p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Les fausses annonces ou les biens inexistants.</li>
              <li>Les prix volontairement trompeurs ou non représentatifs.</li>
              <li>L'utilisation de photos ne correspondant pas au bien réel.</li>
              <li>La duplication abusive de la même annonce.</li>
              <li>La publication de biens pour lesquels l'Annonceur n'a aucun mandat ou droit légal.</li>
              <li>Les contenus frauduleux ou illégaux.</li>
            </ul>
          </section>

          <section id="verification" style={{ marginBottom: '3rem' }}>
            <h2>7. Vérification</h2>
            <p>NESTORA propose divers niveaux de vérification optionnels ou obligatoires pour accroître la confiance (ex: téléphone, email, identité, statut de propriétaire ou d'agence, informations du bien).</p>
            <div className="badge-warning" style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', marginTop: '1rem' }}>
              <strong>IMPORTANT :</strong> Un badge de vérification indique qu'une procédure de contrôle a été effectuée par nos équipes, mais <strong>ne garantit en aucun cas l'absence totale de fraude</strong>. La vigilance reste de mise lors de vos transactions.
            </div>
            <p style={{ marginTop: '1rem' }}>Les documents sensibles fournis pour la vérification (pièce d'identité, titre de propriété) sont traités confidentiellement et ne sont jamais publiés sur la Plateforme.</p>
          </section>

          <section id="contact" style={{ marginBottom: '3rem' }}>
            <h2>8. Contact et messagerie</h2>
            <p>Les Utilisateurs peuvent utiliser la messagerie intégrée pour discuter des annonces. Tous les Utilisateurs doivent adopter un comportement courtois.</p>
            <p>Sont formellement interdits via la messagerie : le harcèlement, les menaces, l'escroquerie, l'envoi de liens malveillants, le spam et la prospection non sollicitée. NESTORA se réserve le droit de modérer les messages signalés ou détectés comme abusifs, conformément aux lois applicables.</p>
          </section>

          <section id="visites" style={{ marginBottom: '3rem' }}>
            <h2>9. Demandes de visite</h2>
            <p>La Plateforme permet de planifier des visites (date, heure) et de gérer leur statut (confirmation, modification, refus, annulation, historique). NESTORA n'agit qu'en tant qu'outil de mise en relation et de planification. NESTORA ne participe à aucune visite et ne devient à aucun moment partie à l'éventuel contrat immobilier conclu par la suite.</p>
          </section>

          <section id="abonnements" style={{ marginBottom: '3rem' }}>
            <h2>10. Abonnements</h2>
            <p>NESTORA propose des formules d'abonnement (Chercheur, Propriétaire, Agence) pour accéder à des services premium. Les durées varient généralement entre 15 jours, 1 mois, 3 mois, 6 mois et 1 an.</p>
            <p>Les tarifs exacts sont affichés clairement avant tout paiement. L'abonnement est activé dès validation du paiement. Selon l'offre choisie, il peut se renouveler automatiquement ou expirer à terme. L'Utilisateur peut suspendre, annuler ou changer d'offre depuis les paramètres de son compte, selon les conditions de remboursement en vigueur applicables au type de service numérique fourni.</p>
          </section>

          <section id="publication" style={{ marginBottom: '3rem' }}>
            <h2>11. Publication payante</h2>
            <p>Selon le rôle ou la région, la publication de certaines annonces ou d'annonces au-delà d'un quota gratuit peut nécessiter un paiement. Les conditions exactes (prix, durée de visibilité, expiration) sont clairement affichées lors de la création de l'Annonce. Une annonce supprimée ou désactivée prématurément par l'Utilisateur ne donne pas lieu à remboursement.</p>
          </section>

          <section id="boost" style={{ marginBottom: '3rem' }}>
            <h2>12. Boost des annonces</h2>
            <p>Un "Boost" est une option payante permettant d'augmenter la visibilité d'une Annonce (par exemple, en tête de liste) pour une durée et un prix définis au moment de l'achat.</p>
            <div className="badge-warning" style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', marginTop: '1rem' }}>
              <strong>IMPORTANT :</strong> Le Boost augmente uniquement l'exposition de l'annonce sur la Plateforme et ne garantit en aucun cas que le bien sera loué ou vendu. Si une annonce boostée est suspendue pour non-respect des CGU, le Boost est perdu sans compensation.
            </div>
          </section>

          <section id="paiements" style={{ marginBottom: '3rem' }}>
            <h2>13. Paiements</h2>
            <p>Les paiements sont traités de manière sécurisée via des prestataires de paiement tiers intégrés à la Plateforme, incluant les cartes bancaires et les moyens de paiement locaux pertinents (Mobile Money, etc.). L'Utilisateur a accès à l'historique et aux factures/reçus depuis son espace. En cas d'échec de paiement, le service lié n'est pas activé.</p>
          </section>

          <section id="responsabilites" style={{ marginBottom: '3rem' }}>
            <h2>14. Responsabilités des Utilisateurs</h2>
            <p>Chaque Utilisateur s'engage à :</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Protéger et conserver secrets ses identifiants de connexion.</li>
              <li>Fournir des informations exactes.</li>
              <li>Respecter la législation locale et internationale en vigueur.</li>
              <li>Ne pas utiliser la Plateforme à des fins de fraude, blanchiment d'argent, ou activités illicites.</li>
              <li>Ne pas utiliser de robots, scrapers ou tenter de contourner les systèmes de sécurité.</li>
            </ul>
          </section>

          <section id="transactions" style={{ marginBottom: '3rem' }}>
            <h2>15. Transactions immobilières</h2>
            <p><strong>NESTORA n'est qu'un intermédiaire technologique de mise en relation.</strong> La Plateforme n'est propriétaire d'aucun des biens publiés, n'est pas une agence immobilière physique et ne participe pas aux transactions financières concernant les loyers, ventes ou cautions.</p>
            <p>Par conséquent, NESTORA ne garantit pas automatiquement :</p>
            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>L'existence réelle ou l'état physique d'un Bien.</li>
              <li>La solvabilité des Chercheurs ou la bonne foi des Annonceurs.</li>
              <li>La conclusion effective d'un contrat ou la disponibilité permanente du logement.</li>
            </ul>
            <p>Il appartient aux Utilisateurs de faire preuve de diligence, de visiter le bien et de vérifier la validité juridique des documents avant tout paiement hors Plateforme.</p>
          </section>

          <section id="fraudes" style={{ marginBottom: '3rem' }}>
            <h2>16. Lutte contre les fraudes</h2>
            <p>NESTORA déploie des moyens techniques et humains pour assurer la sécurité de la plateforme via la vérification de comptes, la modération et la suppression des annonces suspectes. Tout utilisateur peut signaler un contenu douteux. Nous coopérons avec les autorités judiciaires lorsqu'une requête légale valide nous est adressée.</p>
            <div className="badge-warning" style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', marginTop: '1rem' }}>
              <strong>CONSEIL DE SÉCURITÉ :</strong> Ne versez <strong>jamais</strong> d'argent ou d'acompte (Western Union, Mobile Money, etc.) uniquement sur la base d'une annonce ou d'un échange virtuel sans avoir visité le bien et vérifié l'identité de l'interlocuteur.
            </div>
          </section>

          <section id="contenu" style={{ marginBottom: '3rem' }}>
            <h2>17. Contenu Utilisateur</h2>
            <p>En publiant du contenu (textes, photos, vidéos, documents, logos, avis), l'Utilisateur garantit disposer des droits d'auteur et autorisations nécessaires. Sont rigoureusement interdits : les contenus diffamatoires, illégaux, pornographiques, discriminatoires, ou contenant des données personnelles de tiers sans leur accord formel.</p>
          </section>

          <section id="moderation" style={{ marginBottom: '3rem' }}>
            <h2>18. Modération</h2>
            <p>NESTORA se réserve le droit, mais n'a pas l'obligation absolue d'examiner chaque contenu en temps réel. En cas de violation des présentes CGU ou d'un signalement pertinent, NESTORA peut masquer, modifier ou supprimer une annonce, ainsi que suspendre ou bloquer l'accès à un Compte, sans préavis ni indemnité.</p>
          </section>

          <section id="resiliation" style={{ marginBottom: '3rem' }}>
            <h2>19. Suspension et résiliation</h2>
            <p>Une violation grave ou répétée des règles entraînera la suspension temporaire ou la résiliation définitive du compte Utilisateur. Tout Utilisateur peut également demander la fermeture de son compte à tout moment depuis ses paramètres ou en contactant le support, entraînant la suppression ou l'anonymisation de ses données selon la législation applicable.</p>
          </section>

          <section id="propriete" style={{ marginBottom: '3rem' }}>
            <h2>20. Propriété intellectuelle</h2>
            <p>La marque NESTORA, ses logos, designs, interfaces, codes sources, bases de données et textes éditoriaux sont la propriété exclusive de [ENTITÉ JURIDIQUE NESTORA]. Toute reproduction, copie ou extraction substantielle non autorisée est strictement interdite. Les Utilisateurs restent seuls propriétaires intellectuels de leurs propres contenus publiés.</p>
          </section>

          <section id="donnees" style={{ marginBottom: '3rem' }}>
            <h2>21. Données personnelles</h2>
            <p>La protection de vos données personnelles est primordiale. L'ensemble des règles régissant la collecte, l'utilisation, et vos droits (accès, rectification, suppression) sont détaillés dans notre <Link to="/confidentialite" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Politique de confidentialité</Link>.</p>
          </section>

          <section id="cookies" style={{ marginBottom: '3rem' }}>
            <h2>22. Cookies</h2>
            <p>Pour le fonctionnement, la sécurité et l'analyse de l'audience, NESTORA utilise des traceurs et cookies. Vous pouvez configurer vos préférences à tout moment. Plus d'informations dans notre <Link to="/cookies" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Politique relative aux cookies</Link>.</p>
          </section>

          <section id="disponibilite" style={{ marginBottom: '3rem' }}>
            <h2>23. Disponibilité du service</h2>
            <p>NESTORA s'efforce de maintenir la Plateforme accessible 24h/24, mais ne peut garantir une disponibilité de 100 %. Des opérations de maintenance, des mises à jour, ou des problèmes techniques imprévisibles peuvent entraîner une interruption temporaire des services. La Plateforme se réserve également le droit d'ajouter, de modifier ou de supprimer des fonctionnalités.</p>
          </section>

          <section id="limitation" style={{ marginBottom: '3rem' }}>
            <h2>24. Limitation de responsabilité</h2>
            <p>Dans les limites autorisées par la loi, NESTORA ne saurait être tenu responsable des dommages indirects, pertes de profits, ou dommages découlant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme, ni des conflits survenant entre les Utilisateurs hors du strict périmètre technique du service fourni.</p>
          </section>

          <section id="tiers" style={{ marginBottom: '3rem' }}>
            <h2>25. Liens et services tiers</h2>
            <p>La Plateforme peut inclure des liens vers des sites tiers, des services de géolocalisation ou utiliser des passerelles de paiement externes. NESTORA n'exerce aucun contrôle sur ces services tiers et ne peut être tenu responsable de leur contenu, disponibilité ou de leurs propres conditions générales d'utilisation.</p>
          </section>

          <section id="modifications" style={{ marginBottom: '3rem' }}>
            <h2>26. Modifications des CGU</h2>
            <p>NESTORA se réserve le droit de modifier les présentes CGU à tout moment pour s'adapter aux évolutions légales ou techniques. La date de dernière mise à jour sera indiquée en haut de la page. Les Utilisateurs seront informés des modifications substantielles et devront, le cas échéant, accepter les nouvelles conditions pour continuer à utiliser la Plateforme.</p>
          </section>

          <section id="juridiction" style={{ marginBottom: '3rem' }}>
            <h2>27. Droit applicable et juridiction</h2>
            <div className="badge-warning" style={{ padding: '1rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <p><em>À compléter avant mise en production :</em></p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
                <li><strong>Entité légale :</strong> [ENTITÉ JURIDIQUE NESTORA]</li>
                <li><strong>Droit applicable :</strong> [DROIT APPLICABLE]</li>
                <li><strong>Juridiction compétente :</strong> Tribunal de [JURIDICTION COMPÉTENTE], [PAYS]</li>
              </ul>
            </div>
            <p style={{ marginTop: '1rem' }}>Sauf disposition d'ordre public national plus favorable au consommateur, les présentes CGU sont soumises au droit visé ci-dessus. En cas de litige, une solution amiable sera priorisée avant tout recours judiciaire.</p>
          </section>

          <section id="contact-juridique" style={{ marginBottom: '3rem' }}>
            <h2>28. Contact juridique</h2>
            <div className="badge-warning" style={{ padding: '1rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <p><em>À compléter avant mise en production :</em></p>
              <p>Pour toute question d'ordre légal ou administratif, vous pouvez nous contacter à :</p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
                <li><strong>Email juridique :</strong> [EMAIL JURIDIQUE]</li>
                <li><strong>Adresse postale :</strong> [ADRESSE DE LA SOCIÉTÉ]</li>
              </ul>
            </div>
          </section>

          <section id="acceptation" style={{ marginBottom: '1rem' }}>
            <h2>29. Acceptation</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 500, backgroundColor: 'var(--color-secondary)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              En créant un compte NESTORA, l'utilisateur reconnaît avoir pris connaissance des présentes Conditions générales d'utilisation et, lorsque cela est requis, les accepter.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <Link to="/confidentialite" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>Politique de confidentialité</Link>
              <Link to="/cookies" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>Politique cookies</Link>
              <Link to="/centre-d-aide" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>Centre d'aide</Link>
              <Link to="/nous-contacter" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>Contact</Link>
            </div>
          </section>
        </div>
      </div>

      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, boxShadow: 'var(--shadow-md)' }}
          aria-label="Retour en haut"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <style>{`
        h2 { color: var(--color-primary); font-size: 1.6rem; margin-bottom: 1.2rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; }
        p { color: var(--color-text-light); line-height: 1.7; margin-bottom: 1rem; }
        li { color: var(--color-text-light); line-height: 1.6; }
        @media (max-width: 768px) {
          .cgu-sidebar { display: none; }
          .cgu-content { padding: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
