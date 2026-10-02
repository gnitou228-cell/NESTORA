import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Move, Calendar, User, Building, 
  Heart, MessageCircle, Share2, X, ChevronLeft, 
  ChevronRight, CheckCircle2, AlertCircle, Loader, Flag,
  Lock, Phone, Crown, CheckCircle
} from 'lucide-react';
import { NestoraMap } from '../components/Map';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import '../home.css';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { supabase } from '../lib/supabase';

// Constantes pour formater
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

const formatPropertyType = (type: string) => {
  const types: Record<string, string> = {
    APARTMENT: 'Appartement',
    HOUSE: 'Maison / Villa',
    LAND: 'Terrain',
    COMMERCIAL: 'Bureau / Commerce',
    ROOM: 'Chambre',
  };
  return types[type] || type;
};

const formatTransactionType = (type: string) => {
  return type === 'RENT' ? 'Location' : 'Vente';
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  const [property, setProperty] = useState<any>(null);
  const [similarProperties, setSimilarProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Galerie
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const [contactForm, setContactForm] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    whatsapp: '',
    locality: ''
  });

  // Partage
  const [shareSuccess, setShareSuccess] = useState(false);

  // Visite Modal
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [visitMessage, setVisitMessage] = useState('');
  const [submittingVisit, setSubmittingVisit] = useState(false);
  const [visitSuccess, setVisitSuccess] = useState(false);
  const [visitError, setVisitError] = useState('');

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState('SPAM');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');

  const favorite = id ? isFavorite(id) : false;

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (id) {
      if (favorite) await removeFavorite(id);
      else await addFavorite(id);
    }
  };

  const handleVisitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/connexion');
      return;
    }
    setSubmittingVisit(true);
    setVisitError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/visits/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestedDate: visitDate,
          requestedTime: visitTime,
          message: visitMessage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setVisitSuccess(true);
        setTimeout(() => {
          setShowVisitModal(false);
          setVisitSuccess(false);
          setVisitDate('');
          setVisitTime('');
          setVisitMessage('');
        }, 3000);
      } else {
        setVisitError(data.message || 'Erreur lors de la demande');
      }
    } catch (err) {
      setVisitError('Erreur réseau');
    } finally {
      setSubmittingVisit(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/connexion');
      return;
    }
    setSubmittingReport(true);
    setReportError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: id,
          category: reportCategory,
          description: reportDescription
        })
      });
      const data = await res.json();
      if (res.ok) {
        setReportSuccess(true);
        setTimeout(() => {
          setShowReportModal(false);
          setReportSuccess(false);
          setReportCategory('SPAM');
          setReportDescription('');
        }, 3000);
      } else {
        setReportError(data.error || 'Erreur lors du signalement');
      }
    } catch (err) {
      setReportError('Erreur réseau');
    } finally {
      setSubmittingReport(false);
    }
  };

  const getMemberDuration = (createdAt?: string) => {
    if (!createdAt) return 'Membre de la plateforme';
    try {
      const date = new Date(createdAt);
      const formattedDate = format(date, 'dd MMMM yyyy', { locale: fr });
      const duration = formatDistanceToNow(date, { locale: fr });
      return `Inscrit le ${formattedDate} (sur la plateforme depuis ${duration})`;
    } catch(e) {
      return 'Membre de la plateforme';
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/${id}`);
      if (res.status === 404) {
        setError('Propriété introuvable ou indisponible.');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error('Erreur réseau');
      const data = await res.json();
      setProperty(data);
      
      // Update SEO Title
      document.title = `${data.title} à ${data.city?.name} | NESTORA`;

      fetchSimilarProperties(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarProperties = async (currentProperty: any) => {
    try {
      const params = new URLSearchParams({
        cityId: currentProperty.cityId,
        transactionType: currentProperty.transactionType,
        limit: '4', // fetch 4 in case one is current
        page: '1'
      });
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const filtered = (data.properties || []).filter((p: any) => p.id !== currentProperty.id).slice(0, 3);
        setSimilarProperties(filtered);
      }
    } catch (err) {
      console.error('Erreur annonces similaires', err);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = property?.title || 'Annonce NESTORA';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (err) {
        console.log('Partage annulé ou échoué', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (property?.images?.length) {
      setCurrentImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
    }
  };

  const handleContactClick = () => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (property?.ownerId === user.id) {
      alert('Vous ne pouvez pas vous contacter vous-même.');
      return;
    }

    // Logique Freemium
    if (user.role === 'SEEKER') {
      const freeContactsUsed = parseInt(localStorage.getItem('nestora_free_contacts') || '0', 10);
      const hasUnlocked = user?.hasActiveSubscription || localStorage.getItem('nestora_is_premium') === 'true' || localStorage.getItem(`unlocked_contact_${property?.id}`) === 'true';

      if (!hasUnlocked && freeContactsUsed < 3) {
        localStorage.setItem('nestora_free_contacts', (freeContactsUsed + 1).toString());
        localStorage.setItem(`unlocked_contact_${property?.id}`, 'true');
        alert(`Contact débloqué gratuitement ! Il vous reste ${2 - freeContactsUsed} contact(s) gratuit(s).`);
      }
    }

    setShowContactModal(true);
  };

  const handleMessageClick = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (property?.ownerId === user.id) {
      alert('Vous ne pouvez pas vous envoyer un message à vous-même.');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId: property?.id })
      });
      
      const data = await res.json();
      if (res.ok) {
        navigate(`/messages`);
      } else {
        alert(data.error || 'Erreur lors de la création de la conversation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur réseau');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      // Simulation de l'envoi du lead
      console.log("Nouveau lead généré:", contactForm);
      
      // Optionnel: Créer quand même une conversation
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId: property?.id })
      });

      setShowContactModal(false);
      alert('Votre demande de contact a bien été envoyée à l\'annonceur !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi de la demande');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showGallery) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setShowGallery(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGallery, property]);

  if (loading) {
    return (
      <div className="bg-secondary" style={{ minHeight: '100vh', padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <Loader className="spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-secondary" style={{ minHeight: '100vh', padding: '4rem 2rem', textAlign: 'center' }}>
        <AlertCircle size={64} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Oups !</h1>
        <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '1.2rem' }}>
          {error || "Cette annonce n'existe pas ou n'est plus disponible."}
        </p>
        <Link to="/recherche" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
          Retour à la recherche
        </Link>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";
  const images = property.images?.length > 0 ? property.images.map((img: any) => img.url) : [defaultImage];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="property-detail-page bg-secondary">
      
      {/* HEADER LOCALISATION & RETOUR */}
      <div className="property-detail-header">
        <div className="property-detail-header-inner">
          <div className="property-nav-row">
            <Link to="/annonces" className="property-back-btn">
              <ChevronLeft size={18} />
              <span>Toutes les annonces</span>
            </Link>
            <div className="property-breadcrumbs">
              <Link to="/recherche">Recherche</Link>
              <span className="breadcrumb-sep">&gt;</span>
              <span>{property.country?.name}</span>
              <span className="breadcrumb-sep">&gt;</span>
              <span>{property.city?.name}</span>
              {property.neighborhood?.name && (
                <>
                  <span className="breadcrumb-sep">&gt;</span>
                  <span>{property.neighborhood.name}</span>
                </>
              )}
            </div>
          </div>
          <h1 className="property-page-title">{property.title}</h1>
        </div>
      </div>

      <div className="property-detail-container">
        <div className="property-layout-grid">
          
          {/* COLONNE GAUCHE : DÉTAILS */}
          <div className="property-main-col">
            
            {/* GALERIE */}
            <div 
              className="property-main-gallery"
              onClick={() => setShowGallery(true)}
            >
              <img 
                src={images[0]} 
                alt={property.title} 
                className="property-main-img"
              />
              <div className="gallery-badge-top-left">
                <span className="badge badge-accent-gold">
                  {formatTransactionType(property.transactionType)}
                </span>
                <span className="badge badge-type-white">
                  {formatPropertyType(property.propertyType)}
                </span>
              </div>
              {hasMultipleImages && (
                <div className="gallery-photo-counter">
                  1 / {images.length} photos
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div className="property-thumbnails-track">
                {images.slice(1, 6).map((img: string, idx: number) => (
                  <div 
                    key={idx}
                    className="thumbnail-item"
                    onClick={() => {
                      setCurrentImageIndex(idx + 1);
                      setShowGallery(true);
                    }}
                  >
                    <img 
                      src={img} 
                      alt={`Photo ${idx + 2}`}
                      className="thumbnail-img"
                    />
                  </div>
                ))}
                {images.length > 6 && (
                  <div 
                    className="thumbnail-item thumbnail-more"
                    onClick={() => { setCurrentImageIndex(6); setShowGallery(true); }}
                  >
                    <img src={images[6]} alt="Plus de photos" className="thumbnail-img" />
                    <span className="thumbnail-more-overlay">+{images.length - 6}</span>
                  </div>
                )}
              </div>
            )}

            {/* INFO PRINCIPALES */}
            <div className="card property-detail-card">
              <div className="property-header-price-row">
                <div className="property-price-block">
                  <div className="property-price-display">
                    {formatPrice(property.price)} <span className="property-currency">{property.currency}</span>
                    {property.transactionType === 'RENT' && <span className="property-period"> / mois</span>}
                  </div>
                </div>
                
                <div className="property-actions-grid">
                  <button className="btn btn-outline property-action-btn" onClick={handleShare}>
                    <Share2 size={16} /> <span>Partager</span>
                  </button>
                  <button 
                    className={`btn btn-outline property-action-btn ${favorite ? 'btn-fav-active' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
                    <span>{favorite ? 'Favori' : 'Favori'}</span>
                  </button>
                  <button 
                    className="btn btn-outline property-action-btn btn-report-subtle"
                    onClick={() => {
                      if (!user) navigate('/connexion');
                      else setShowReportModal(true);
                    }}
                  >
                    <Flag size={16} /> <span>Signaler</span>
                  </button>
                </div>
              </div>

              {shareSuccess && (
                <div className="property-alert-success">
                  Lien de l&apos;annonce copié dans le presse-papiers.
                </div>
              )}

              <div className="property-meta-row">
                <div className="property-meta-item">
                  <MapPin size={16} color="#d97706" />
                  <span>{property.neighborhood?.name ? `${property.neighborhood.name}, ` : ''}{property.city?.name}</span>
                </div>
                <div className="property-meta-item">
                  <Calendar size={16} color="#64748b" />
                  <span>Publié {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true, locale: fr })}</span>
                </div>
              </div>

              <div className="property-card-divider"></div>

              {/* CARACTÉRISTIQUES */}
              <h3 className="property-section-title">Caractéristiques</h3>
              <div className="property-features-grid">
                {property.surface > 0 && (
                  <div className="feature-box">
                    <div className="feature-icon-wrap">
                      <Move size={18} color="var(--color-primary)" />
                    </div>
                    <div className="feature-value">{property.surface} m²</div>
                    <div className="feature-label">Surface</div>
                  </div>
                )}
                {property.bedrooms > 0 && (
                  <div className="feature-box">
                    <div className="feature-icon-wrap">
                      <Bed size={18} color="var(--color-primary)" />
                    </div>
                    <div className="feature-value">{property.bedrooms}</div>
                    <div className="feature-label">Chambres</div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="feature-box">
                    <div className="feature-icon-wrap">
                      <Bath size={18} color="var(--color-primary)" />
                    </div>
                    <div className="feature-value">{property.bathrooms}</div>
                    <div className="feature-label">Salles de bain</div>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="card property-detail-card">
              <h3 className="property-section-title">Description du bien</h3>
              <div className={`property-description-body ${!showFullDesc ? 'collapsed' : ''}`}>
                {property.description}
                {!showFullDesc && (
                  <div className="property-description-fade"></div>
                )}
              </div>
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="btn-read-more"
              >
                {showFullDesc ? 'Réduire la description' : 'Lire la description complète'}
              </button>
            </div>

            {/* EQUIPEMENTS */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="card property-detail-card">
                <h3 className="property-section-title">Équipements & Commodités</h3>
                <div className="property-amenities-grid">
                  {property.amenities.map((pa: any) => (
                    <div key={pa.amenityId} className="amenity-pill">
                      <CheckCircle2 size={16} color="#16a34a" />
                      <span>{pa.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCALISATION MAP */}
            {property.latitude && property.longitude && (
              <div className="card property-detail-card">
                <h3 className="property-section-title">Localisation</h3>
                
                <div className="property-location-tag">
                  <MapPin size={18} color="var(--color-accent)" />
                  <span style={{ fontWeight: 600 }}>{property.city?.name}</span>
                  {property.neighborhood?.name && (
                    <span> — {property.neighborhood.name}</span>
                  )}
                </div>
                
                <div className="property-map-wrapper">
                  <NestoraMap 
                    properties={[property]}
                    center={[property.latitude, property.longitude]}
                    zoom={14}
                  />
                </div>
                <div className="property-map-disclaimer">
                  <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>La localisation affichée est approximative pour protéger la confidentialité du bien.</span>
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE : CONTACT / ANNONCEUR */}
          <div className="property-sidebar-col">
            <div className="card property-detail-card property-advertiser-sticky">
              
              <div className="advertiser-profile-header">
                {property.agency ? (
                  <>
                    <div className="advertiser-avatar-box">
                      {property.agency.logoUrl ? (
                         <img src={property.agency.logoUrl} alt="Logo" className="advertiser-avatar-img" />
                      ) : (
                         <Building size={32} color="var(--color-primary)" />
                      )}
                    </div>
                    <div className="advertiser-name">{property.agency.name}</div>
                    <div className="advertiser-role-label">Agence immobilière partenaire</div>
                    <div className="advertiser-duration-pill">
                      {getMemberDuration(property.agency.createdAt)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="advertiser-avatar-box">
                      {property.owner?.profile?.avatarUrl ? (
                         <img src={property.owner.profile.avatarUrl} alt="Avatar" className="advertiser-avatar-img" />
                      ) : (
                         <User size={32} color="var(--color-primary)" />
                      )}
                    </div>
                    <div className="advertiser-name">
                      {property.owner?.profile?.firstName} {property.owner?.profile?.lastName}
                    </div>
                    <div className="advertiser-role-label">Propriétaire vérifié</div>
                    <div className="advertiser-duration-pill">
                      {getMemberDuration(property.owner?.createdAt)}
                    </div>
                  </>
                )}
              </div>
              
              <div className="property-card-divider"></div>

              <h4 className="advertiser-cta-title">Vous êtes intéressé par ce bien ?</h4>
              
              <div className="advertiser-actions-stack">
                <button 
                  className="btn btn-primary btn-block btn-advertiser-primary" 
                  onClick={handleContactClick}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}
                >
                  <Phone size={20} />
                  <span>Contacter (Voir Numéro)</span>
                </button>
                <button 
                  className="btn btn-outline btn-block btn-advertiser-secondary" 
                  onClick={handleMessageClick}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}
                >
                  <MessageCircle size={20} />
                  <span>Envoyer un message</span>
                </button>
                <button 
                  className="btn btn-outline btn-block btn-advertiser-secondary" 
                  onClick={() => {
                    if (!user) {
                      navigate('/connexion');
                      return;
                    }
                    if (property.ownerId === user.id) {
                      alert('Vous ne pouvez pas demander une visite pour votre propre bien.');
                      return;
                    }
                    setShowVisitModal(true);
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Calendar size={20} />
                  <span>Demander une visite</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ANNONCES SIMILAIRES */}
        {similarProperties.length > 0 && (
          <div className="similar-properties-section">
            <h2 className="similar-section-title">Vous pourriez également aimer</h2>
            <div className="properties-grid">
              {similarProperties.map(sim => {
                const simImages = sim.images?.length > 0 ? sim.images : [{ url: defaultImage }];
                return (
                  <Link to={`/annonces/${sim.id}`} className="property-card" key={sim.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="property-img-container" style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                      <img 
                        src={simImages[0].url || simImages[0]} 
                        alt={sim.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                    <div className="property-content" style={{ padding: '1rem' }}>
                      <div className="property-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sim.title}</div>
                      <div className="property-location" style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <MapPin size={12} />
                        {sim.city?.name}
                      </div>
                      <div className="property-price" style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.2rem' }}>
                        {formatPrice(sim.price)} {sim.currency}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL GALERIE PLEIN ECRAN */}
      {showGallery && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', color: 'white' }}>
            <div style={{ fontSize: '1.2rem' }}>
              {currentImageIndex + 1} / {images.length}
            </div>
            <button 
              onClick={() => setShowGallery(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={32} />
            </button>
          </div>
          
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <button 
              onClick={prevImage}
              style={{ position: 'absolute', left: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}
            >
              <ChevronLeft size={32} />
            </button>
            
            <img 
              src={images[currentImageIndex]} 
              alt="Vue plein écran" 
              style={{ maxWidth: '90%', maxHeight: '90vh', objectFit: 'contain' }}
            />
            
            <button 
              onClick={nextImage}
              style={{ position: 'absolute', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', zIndex: 10 }}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL VISITE */}
      {showVisitModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', backgroundColor: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>Demander une visite</h3>
              <button onClick={() => setShowVisitModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--color-text-light)" />
              </button>
            </div>
            
            {visitSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Demande envoyée avec succès !</h4>
                <p style={{ color: 'var(--color-text-light)' }}>L'annonceur reviendra vers vous très prochainement.</p>
              </div>
            ) : (
              <form onSubmit={handleVisitRequest}>
                {visitError && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '8px', marginBottom: '1rem' }}>
                    {visitError}
                  </div>
                )}
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date souhaitée <span style={{ color: 'red' }}>*</span></label>
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Heure souhaitée <span style={{ color: 'red' }}>*</span></label>
                  <input 
                    type="time" 
                    required 
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Message (facultatif)</label>
                  <textarea 
                    rows={4}
                    value={visitMessage}
                    onChange={(e) => setVisitMessage(e.target.value)}
                    placeholder="Précisez vos disponibilités ou toute autre information utile..."
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }} 
                  ></textarea>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowVisitModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submittingVisit}>
                    {submittingVisit ? <Loader className="spin" size={20} /> : 'Envoyer la demande'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL SIGNALEMENT */}
      {showReportModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9998,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2rem', backgroundColor: 'white', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-danger)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={24} /> Signaler l'annonce
              </h3>
              <button onClick={() => setShowReportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="var(--color-text-light)" />
              </button>
            </div>
            
            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Signalement envoyé</h4>
                <p style={{ color: 'var(--color-text-light)' }}>Notre équipe de modération va examiner cette annonce dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                {reportError && (
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '8px', marginBottom: '1rem' }}>
                    {reportError}
                  </div>
                )}
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Raison du signalement <span style={{ color: 'red' }}>*</span></label>
                  <select 
                    required 
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                  >
                    <option value="FRAUD">Fraude / Arnaque</option>
                    <option value="INACCURATE">Prix trompeur / Fausse annonce</option>
                    <option value="SPAM">Annonce déjà vendue/louée ou Spam</option>
                    <option value="INAPPROPRIATE">Contenu inapproprié ou interdit</option>
                    <option value="OTHER">Autre</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description détaillée <span style={{ color: 'red' }}>*</span></label>
                  <textarea 
                    rows={4}
                    required
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Veuillez fournir plus de détails pour aider nos modérateurs..."
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'vertical' }} 
                  ></textarea>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setShowReportModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} disabled={submittingReport}>
                    {submittingReport ? <Loader className="spin" size={20} /> : 'Envoyer le signalement'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* Modal de Contact / Lead */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '450px', position: 'relative' }}>
            <button 
              onClick={() => setShowContactModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={24} />
            </button>
            
            {(() => {
              const isVIP = user?.hasActiveSubscription || localStorage.getItem('nestora_is_premium') === 'true';
              const hasUnlocked = isVIP || localStorage.getItem(`unlocked_contact_${property?.id}`) === 'true' || user?.role !== 'SEEKER';
              
              if (!hasUnlocked) {
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ background: '#f1f5f9', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <Lock size={32} color="#64748b" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Contact Masqué</h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                      Le numéro de l'annonceur est masqué. Débloquez-le pour le contacter directement ou passez Premium.
                    </p>

                    <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <Phone size={20} color="#94a3b8" />
                      <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#475569', letterSpacing: '2px' }}>+228 ** ** ** **</span>
                    </div>

                    <div className="d-flex flex-column" style={{ gap: '1rem' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '1rem', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={() => {
                          // Simulate payment page navigation for single unlock
                          navigate(`/paiement`, { state: { plan: { name: 'Contact Annonceur', price: 1000 }, type: 'Unlock Contact', propertyId: property?.id } });
                        }}
                      >
                        <CheckCircle size={18} /> Contacter l'annonceur (1000 FCFA)
                      </button>
                      
                      <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ padding: '0 1rem', color: '#94a3b8', fontSize: '0.9rem' }}>OU</span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                      </div>

                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '1rem', fontSize: '1.05rem', fontWeight: 600, color: '#d97706', borderColor: '#fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={() => navigate(`/paiement`, { state: { plan: { id: 'c_1m', name: 'Pass VIP (1 mois)', price: 5000 }, type: 'Subscription' } })}
                      >
                        <Crown size={18} /> Devenir VIP (Accès illimité)
                      </button>
                    </div>
                  </div>
                );
              }

              // Normal form when unlocked
              const phoneNumber = property?.agency?.phone || property?.owner?.profile?.phone || '+228 90 00 00 00';
              return (
                <>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Contacter l'annonceur</h2>
                  <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    Vous pouvez appeler l'annonceur directement ou lui laisser un message.
                  </p>

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <Phone size={20} color="#16a34a" />
                    <a href={`tel:${phoneNumber}`} style={{ fontSize: '1.2rem', fontWeight: 700, color: '#166534', textDecoration: 'none' }}>{phoneNumber}</a>
                  </div>

                  <form onSubmit={handleContactSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Prénom</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        value={contactForm.firstName}
                        onChange={e => setContactForm({...contactForm, firstName: e.target.value})}
                        placeholder="Ex: Komi"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nom</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        value={contactForm.lastName}
                        onChange={e => setContactForm({...contactForm, lastName: e.target.value})}
                        placeholder="Ex: Mensah"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Numéro WhatsApp</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        required
                        value={contactForm.whatsapp}
                        onChange={e => setContactForm({...contactForm, whatsapp: e.target.value})}
                        placeholder="Ex: 90 00 11 22"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Votre Localité / Ville</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        required
                        value={contactForm.locality}
                        onChange={e => setContactForm({...contactForm, locality: e.target.value})}
                        placeholder="Ex: Ouagadougou, Zone 1"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.1rem' }}>
                      <MessageCircle size={20} />
                      Envoyer ma demande
                    </button>
                  </form>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* MOBILE STICKY ACTION BAR */}
      <div className="mobile-sticky-actions">
        <div className="mobile-bar-price-wrap">
          <div className="mobile-bar-price">
            {formatPrice(property.price)} <span className="mobile-bar-curr">{property.currency}</span>
          </div>
          {property.transactionType === 'RENT' && (
            <div className="mobile-bar-period">/ mois</div>
          )}
        </div>

        <div className="mobile-bar-btns">
          <button 
            className={`btn btn-outline mobile-bar-fav-btn ${favorite ? 'fav-active' : ''}`}
            onClick={toggleFavorite}
            aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
          </button>

          <button 
            className="btn btn-outline mobile-bar-action-btn" 
            onClick={() => {
              if (!user) { navigate('/connexion'); return; }
              setShowVisitModal(true);
            }}
          >
            <Calendar size={16} />
            <span>Visite</span>
          </button>

          <button 
            className="btn btn-primary mobile-bar-action-btn btn-contact-gold" 
            onClick={handleContactClick}
          >
            <MessageCircle size={16} />
            <span>Contacter</span>
          </button>
        </div>
      </div>

      <style>{`
        /* Container & Layout */
        .property-detail-page {
          min-height: 100vh;
          padding-bottom: calc(110px + env(safe-area-inset-bottom)) !important;
        }
        .property-detail-header {
          background-color: var(--color-primary, #0B1F3A);
          padding: 1.75rem 1.5rem;
          color: white;
        }
        .property-detail-header-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .property-nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
        }
        .property-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: #C9A227;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.3rem 0.65rem;
          background: rgba(201, 162, 39, 0.12);
          border-radius: 8px;
          border: 1px solid rgba(201, 162, 39, 0.25);
          transition: all 0.2s;
        }
        .property-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          flex-wrap: wrap;
        }
        .property-breadcrumbs a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
        }
        .breadcrumb-sep {
          color: rgba(255, 255, 255, 0.4);
        }
        .property-page-title {
          margin: 0;
          font-size: clamp(1.3rem, 4.5vw, 1.95rem);
          font-weight: 800;
          line-height: 1.25;
          color: #ffffff;
        }

        .property-detail-container {
          max-width: 1200px;
          margin: 1.5rem auto 3rem;
          padding: 0 1.25rem;
        }
        .property-layout-grid {
          display: flex;
          gap: 1.75rem;
          align-items: flex-start;
        }
        .property-main-col {
          flex: 1 1 65%;
          min-width: 0;
        }
        .property-sidebar-col {
          flex: 0 0 35%;
          min-width: 320px;
        }

        /* Gallery */
        .property-main-gallery {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background-color: #0f172a;
          aspect-ratio: 16/9;
          cursor: pointer;
          margin-bottom: 0.85rem;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }
        .property-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .property-main-gallery:hover .property-main-img {
          transform: scale(1.02);
        }
        .gallery-badge-top-left {
          position: absolute;
          top: 1rem;
          left: 1rem;
          display: flex;
          gap: 0.5rem;
          z-index: 2;
        }
        .badge-accent-gold {
          background-color: #C9A227 !important;
          color: #ffffff !important;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.82rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .badge-type-white {
          background-color: rgba(255, 255, 255, 0.95) !important;
          color: #0B1F3A !important;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          font-size: 0.82rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .gallery-photo-counter {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background-color: rgba(11, 31, 58, 0.85);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          z-index: 2;
        }

        .property-thumbnails-track {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          padding-bottom: 0.35rem;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }
        .thumbnail-item {
          width: 100px;
          height: 68px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          border: 2px solid transparent;
          transition: all 0.2s;
          background: #e2e8f0;
        }
        .thumbnail-item:hover {
          border-color: #C9A227;
        }
        .thumbnail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .thumbnail-more {
          position: relative;
          background-color: rgba(0,0,0,0.7);
        }
        .thumbnail-more-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1rem;
          background: rgba(11, 31, 58, 0.7);
        }

        /* Property Detail Card */
        .property-detail-card {
          padding: 1.75rem 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          background: #ffffff;
        }
        .property-header-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .property-price-display {
          font-size: clamp(1.5rem, 5vw, 2.1rem);
          font-weight: 800;
          color: #0B1F3A;
          line-height: 1.2;
        }
        .property-currency {
          font-size: 1.1rem;
          color: #C9A227;
          font-weight: 700;
        }
        .property-period {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 500;
        }
        .property-actions-grid {
          display: flex;
          gap: 0.5rem;
        }
        .property-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 0.85rem;
          font-size: 0.85rem;
          border-radius: 9px;
          font-weight: 600;
        }
        .btn-fav-active {
          color: #ef4444 !important;
          border-color: #fca5a5 !important;
          background-color: #fef2f2 !important;
        }
        .btn-report-subtle {
          color: #94a3b8;
          border-color: #e2e8f0;
        }
        .btn-report-subtle:hover {
          color: #ef4444;
          border-color: #ef4444;
        }

        .property-alert-success {
          background-color: #10b981;
          color: white;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.88rem;
          font-weight: 600;
        }
        .property-meta-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          color: #64748b;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          font-size: 0.9rem;
        }
        .property-meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .property-card-divider {
          height: 1px;
          background-color: #e2e8f0;
          margin: 1.25rem 0;
        }

        .property-section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0B1F3A;
          margin-bottom: 1rem;
        }

        /* Features Grid */
        .property-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .feature-box {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 12px;
          padding: 0.85rem 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .feature-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.35rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .feature-value {
          font-size: 1rem;
          font-weight: 800;
          color: #0B1F3A;
          line-height: 1.2;
        }
        .feature-label {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 2px;
        }

        /* Description */
        .property-description-body {
          color: #334155;
          line-height: 1.65;
          white-space: pre-wrap;
          position: relative;
          font-size: 0.95rem;
        }
        .property-description-body.collapsed {
          max-height: 140px;
          overflow: hidden;
        }
        .property-description-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, white);
        }
        .btn-read-more {
          background: none;
          border: none;
          color: #0B1F3A;
          font-weight: 700;
          margin-top: 0.75rem;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: 0.9rem;
        }

        /* Amenities */
        .property-amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.75rem;
        }
        .amenity-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          border: 1px solid #f1f5f9;
          font-size: 0.88rem;
          color: #1e293b;
          font-weight: 500;
        }

        /* Map */
        .property-location-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #1e293b;
          margin-bottom: 0.85rem;
          font-size: 0.95rem;
        }
        .property-map-wrapper {
          height: 320px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .property-map-disclaimer {
          margin-top: 0.75rem;
          font-size: 0.82rem;
          color: #64748b;
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
        }

        /* Advertiser Card */
        .property-advertiser-sticky {
          position: sticky;
          top: 2rem;
        }
        .advertiser-profile-header {
          text-align: center;
        }
        .advertiser-avatar-box {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }
        .advertiser-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .advertiser-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0B1F3A;
          margin-bottom: 0.2rem;
        }
        .advertiser-role-label {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }
        .advertiser-duration-pill {
          font-size: 0.78rem;
          color: #475569;
          background-color: #f1f5f9;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          display: inline-block;
        }
        .advertiser-cta-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0B1F3A;
          margin-bottom: 1rem;
        }
        .advertiser-actions-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .btn-advertiser-primary {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem;
          border-radius: 12px;
          font-weight: 700;
          background: #C9A227;
          color: #ffffff;
          border: none;
        }
        .btn-advertiser-primary:hover {
          background: #b38f22;
        }
        .btn-advertiser-secondary {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem;
          border-radius: 12px;
          font-weight: 600;
          border: 1px solid #0B1F3A;
          color: #0B1F3A;
        }

        /* Similar Properties */
        .similar-properties-section {
          margin-top: 3.5rem;
        }
        .similar-section-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0B1F3A;
          margin-bottom: 1.25rem;
        }

        /* Mobile Sticky Action Bar */
        .mobile-sticky-actions {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1050;
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
          padding: 0.65rem 1rem calc(0.65rem + env(safe-area-inset-bottom));
          justify-content: space-between;
          align-items: center;
          gap: 0.65rem;
        }
        .mobile-bar-price-wrap {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .mobile-bar-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0B1F3A;
          line-height: 1.1;
        }
        .mobile-bar-curr {
          font-size: 0.78rem;
          color: #C9A227;
          font-weight: 700;
        }
        .mobile-bar-period {
          font-size: 0.7rem;
          color: #64748b;
        }
        .mobile-bar-btns {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex: 1;
          justify-content: flex-end;
        }
        .mobile-bar-fav-btn {
          width: 42px;
          height: 42px;
          padding: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          flex-shrink: 0;
        }
        .mobile-bar-fav-btn.fav-active {
          color: #ef4444;
          border-color: #fca5a5;
          background: #fef2f2;
        }
        .mobile-bar-action-btn {
          height: 42px;
          border-radius: 10px;
          padding: 0 0.85rem !important;
          font-size: 0.85rem !important;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
        }
        .btn-contact-gold {
          background-color: #C9A227 !important;
          color: #ffffff !important;
          border: none !important;
        }

        /* Mobile Media Queries */
        @media (max-width: 992px) {
          .property-layout-grid {
            flex-direction: column;
          }
          .property-sidebar-col {
            width: 100%;
            min-width: 0;
          }
        }

        @media (max-width: 768px) {
          .property-detail-header {
            padding: 1.25rem 1rem;
          }
          .property-detail-container {
            padding: 0 0.75rem;
            margin: 1rem auto 2rem;
          }
          .property-detail-card {
            padding: 1.25rem 1rem;
            border-radius: 14px;
            margin-bottom: 1rem;
          }
          .property-actions-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            width: 100%;
            gap: 0.4rem;
          }
          .property-action-btn {
            width: 100%;
            justify-content: center;
            padding: 0.5rem 0.25rem;
            font-size: 0.78rem;
          }
          .property-features-grid {
            gap: 0.5rem;
          }
          .feature-box {
            padding: 0.65rem 0.35rem;
          }
          .property-map-wrapper {
            height: 240px;
          }
          .property-amenities-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .mobile-sticky-actions {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetail;
