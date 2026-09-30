import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Move, Calendar, User, Building, 
  Heart, MessageCircle, Share2, X, ChevronLeft, 
  ChevronRight, CheckCircle2, AlertCircle, Loader, Flag
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

  const handleContact = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (property?.ownerId === user.id) {
      alert('Vous ne pouvez pas vous contacter vous-même.');
      return;
    }

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId: property?.id })
      });

      if (res.ok) {
        navigate('/messages');
      } else {
        const error = await res.json();
        alert(error.error || 'Erreur lors de la création de la conversation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur serveur');
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
    <div className="bg-secondary" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* HEADER LOCALISATION */}
      <div style={{ backgroundColor: 'var(--color-primary)', padding: '2rem 1.5rem', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            <Link to="/recherche" style={{ color: 'white', textDecoration: 'none' }}>Recherche</Link>
            <span>&gt;</span>
            <span>{property.country?.name}</span>
            <span>&gt;</span>
            <span>{property.region?.name}</span>
            <span>&gt;</span>
            <span>{property.city?.name}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>{property.title}</h1>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          
          {/* COLONNE GAUCHE : DÉTAILS */}
          <div style={{ flex: '1 1 65%', minWidth: '300px' }}>
            
            {/* GALERIE */}
            <div 
              style={{ 
                position: 'relative', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                backgroundColor: '#e2e8f0',
                aspectRatio: '16/9',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
              onClick={() => setShowGallery(true)}
            >
              <img 
                src={images[0]} 
                alt={property.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              {hasMultipleImages && (
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                  1 / {images.length} photos
                </div>
              )}
            </div>

            {hasMultipleImages && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.slice(1, 5).map((img: string, idx: number) => (
                  <img 
                    key={idx}
                    src={img}
                    alt={`Vue ${idx+2}`}
                    onClick={() => {
                      setCurrentImageIndex(idx + 1);
                      setShowGallery(true);
                    }}
                    style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}
                  />
                ))}
                {images.length > 5 && (
                  <div 
                    onClick={() => { setCurrentImageIndex(5); setShowGallery(true); }}
                    style={{ width: '120px', height: '80px', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, position: 'relative' }}
                  >
                    <img src={images[5]} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, borderRadius: '8px' }} />
                    <span style={{ fontWeight: 'bold' }}>+{images.length - 5}</span>
                  </div>
                )}
              </div>
            )}

            {/* INFO PRINCIPALES */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {formatPrice(property.price)} {property.currency}
                    {property.transactionType === 'RENT' && <span style={{ fontSize: '1rem', color: 'var(--color-text-light)' }}> / mois</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                      {formatTransactionType(property.transactionType)}
                    </span>
                    <span className="badge" style={{ backgroundColor: '#f1f5f9', color: 'var(--color-primary)' }}>
                      {formatPropertyType(property.propertyType)}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }} onClick={handleShare}>
                    <Share2 size={18} /> Partager
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={toggleFavorite}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                      color: favorite ? '#ef4444' : 'inherit',
                      borderColor: favorite ? '#ef4444' : 'inherit'
                    }}
                  >
                    <Heart size={18} fill={favorite ? 'currentColor' : 'none'} /> {favorite ? 'Retirer' : 'Favori'}
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      if (!user) navigate('/connexion');
                      else setShowReportModal(true);
                    }}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                      color: 'var(--color-danger)', borderColor: 'var(--color-danger)'
                    }}
                  >
                    <Flag size={18} /> Signaler
                  </button>
                </div>
              </div>

              {shareSuccess && (
                <div style={{ backgroundColor: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '1rem', display: 'inline-block', fontSize: '0.9rem' }}>
                  Lien de l'annonce copié.
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text-light)', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={16} />
                  {property.neighborhood?.name ? `${property.neighborhood.name}, ` : ''}{property.city?.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={16} />
                  Publié {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true, locale: fr })}
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '1.5rem 0' }}></div>

              {/* CARACTÉRISTIQUES */}
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Caractéristiques</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '1.5rem' }}>
                {property.surface > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.8rem', backgroundColor: '#f1f5f9', borderRadius: '50%' }}>
                      <Move size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Surface</div>
                      <div style={{ fontWeight: 600 }}>{property.surface} m²</div>
                    </div>
                  </div>
                )}
                {property.bedrooms > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.8rem', backgroundColor: '#f1f5f9', borderRadius: '50%' }}>
                      <Bed size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Chambres</div>
                      <div style={{ fontWeight: 600 }}>{property.bedrooms}</div>
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ padding: '0.8rem', backgroundColor: '#f1f5f9', borderRadius: '50%' }}>
                      <Bath size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Salles de bain</div>
                      <div style={{ fontWeight: 600 }}>{property.bathrooms}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Description</h3>
              <div style={{ 
                color: 'var(--color-text-dark)', 
                lineHeight: 1.6,
                maxHeight: showFullDesc ? 'none' : '150px',
                overflow: 'hidden',
                position: 'relative',
                whiteSpace: 'pre-wrap'
              }}>
                {property.description}
                {!showFullDesc && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to bottom, transparent, white)' }}></div>
                )}
              </div>
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, marginTop: '1rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {showFullDesc ? 'Réduire' : 'Lire plus'}
              </button>
            </div>

            {/* EQUIPEMENTS */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Équipements</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {property.amenities.map((pa: any) => (
                    <div key={pa.amenityId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={18} color="var(--color-accent)" />
                      <span>{pa.amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOCALISATION MAP */}
            {property.latitude && property.longitude && (
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Localisation</h3>
                
                <div style={{ marginBottom: '1rem', color: 'var(--color-text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="var(--color-accent)" />
                  <span style={{ fontWeight: 600 }}>{property.city?.name}</span>
                  {property.neighborhood?.name && (
                    <span> - {property.neighborhood.name}</span>
                  )}
                </div>
                
                <div style={{ height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  <NestoraMap 
                    properties={[property]}
                    center={[property.latitude, property.longitude]}
                    zoom={14}
                  />
                </div>
                <div style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--color-text-light)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <AlertCircle size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>La localisation affichée est approximative pour protéger la confidentialité de l'annonceur.</span>
                </div>
              </div>
            )}
          </div>

          {/* COLONNE DROITE : CONTACT / ANNONCEUR */}
          <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
            <div className="card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
              
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                {property.agency ? (
                  <>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden' }}>
                      {property.agency.logoUrl ? (
                         <img src={property.agency.logoUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                         <Building size={32} color="var(--color-primary)" />
                      )}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{property.agency.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Agence immobilière</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: '1rem', display: 'inline-block' }}>
                      {getMemberDuration(property.agency.createdAt)}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', overflow: 'hidden' }}>
                      {property.owner?.profile?.avatarUrl ? (
                         <img src={property.owner.profile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                         <User size={32} color="var(--color-primary)" />
                      )}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                      {property.owner?.profile?.firstName} {property.owner?.profile?.lastName}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Propriétaire</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f8fafc', padding: '0.25rem 0.75rem', borderRadius: '1rem', display: 'inline-block' }}>
                      {getMemberDuration(property.owner?.createdAt)}
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '1.5rem 0' }}></div>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Vous êtes intéressé par ce bien ?</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={handleContact}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                >
                  <MessageCircle size={20} />
                  Contacter l'annonceur
                </button>
                <button 
                  className="btn btn-outline btn-block" 
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
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}
                >
                  <Calendar size={20} />
                  Demander une visite
                </button>
              </div>



            </div>
          </div>

        </div>

        {/* ANNONCES SIMILAIRES */}
        {similarProperties.length > 0 && (
          <div style={{ marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Vous pourriez également aimer</h2>
            <div className="properties-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
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

    </div>
  );
};

export default PropertyDetail;
