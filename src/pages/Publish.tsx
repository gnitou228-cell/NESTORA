import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { FileText, MapPin, Info, Image as ImageIcon, CheckCircle, Trash2, Plus, ArrowLeft, ArrowRight, Loader, Crown, Lock } from 'lucide-react';
import { LocationPicker } from '../components/LocationPicker';
const SeekerPublishForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    propertyType: 'HOUSE',
    budget: '',
    countryId: '',
    regionId: '',
    cityId: '',
    neighborhoodId: '',
    description: '',
  });

  const propertyTypes = [
    { value: 'HOUSE', label: 'Maison / Villa' },
    { value: 'APARTMENT', label: 'Appartement' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'ROOM', label: 'Chambre' },
    { value: 'LAND', label: 'Terrain' },
    { value: 'OFFICE', label: 'Bureau / Commerce' }
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/countries`)
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, countryId: data[0].id }));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/regions?countryId=${formData.countryId}`)
        .then(res => res.json())
        .then(data => {
          setRegions(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, regionId: data[0].id }));
          else setFormData(prev => ({ ...prev, regionId: '' }));
        });
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.regionId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/cities?regionId=${formData.regionId}`)
        .then(res => res.json())
        .then(data => {
          setCities(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, cityId: data[0].id }));
          else setFormData(prev => ({ ...prev, cityId: '' }));
        });
    }
  }, [formData.regionId]);

  useEffect(() => {
    if (formData.cityId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/neighborhoods?cityId=${formData.cityId}`)
        .then(res => res.json())
        .then(data => {
          setNeighborhoods(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, neighborhoodId: data[0].id }));
          else setFormData(prev => ({ ...prev, neighborhoodId: '' }));
        });
    }
  }, [formData.cityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('nestora_token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/housing-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Erreur lors de la publication');
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite lors de la publication de la demande.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Demande publiée avec succès !</h2>
        <p className="text-light text-lg">Votre recherche a été partagée. Les propriétaires et agences de cette zone vous contacteront s'ils ont un bien correspondant à vos critères.</p>
      </div>
    );
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '8px',
    border: '1px solid #e2e8f0', background: '#f8fafc',
    fontSize: '0.95rem', color: '#0f172a', outline: 'none',
  };

  const sectionCard = {
    background: '#fff', borderRadius: '16px', padding: '1.75rem',
    border: '2px solid var(--color-accent)', marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(201,162,39,0.08)',
  };

  const sectionTitle = {
    fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)',
    marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem',
    paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9',
  };

  const label = { display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#475569', marginBottom: '0.4rem' };

  const grid2 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' };

  return (
    <div style={{ maxWidth: '820px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-primary)', borderRadius: '16px', padding: '1.75rem 2rem', marginBottom: '2rem', color: 'white' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Que recherchez-vous ?</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.95rem' }}>
          Décrivez votre bien idéal. Les propriétaires et agences correspondants vous contacteront directement.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Section 1 — Critères */}
        <div style={sectionCard}>
          <h3 style={sectionTitle}>
            <FileText size={18} color="var(--color-accent)" /> Critères principaux
          </h3>
          <div style={grid2}>
            <div>
              <label style={label}>Type de bien souhaité <span style={{ color: '#ef4444' }}>*</span></label>
              <select style={inputStyle} value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})} required>
                {propertyTypes.map(pt => <option key={pt.value} value={pt.value}>{pt.label}</option>)}
              </select>
            </div>
            <div>
              <label style={label}>Budget maximum (FCFA) <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="number" style={inputStyle} value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                placeholder="Ex: 150 000" required />
            </div>
          </div>
        </div>

        {/* Section 2 — Localisation */}
        <div style={sectionCard}>
          <h3 style={sectionTitle}>
            <MapPin size={18} color="var(--color-accent)" /> Localisation souhaitée
          </h3>

          <div style={{ ...grid2, marginBottom: '1rem' }}>
            {/* Pays */}
            <div>
              <label style={label}>Pays</label>
              {countries.length === 0
                ? <input style={inputStyle} placeholder="Chargement des pays..." disabled />
                : <select style={inputStyle} value={formData.countryId} onChange={e => setFormData({...formData, countryId: e.target.value, regionId: '', cityId: '', neighborhoodId: ''})}>
                    <option value="">-- Sélectionner un pays --</option>
                    {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
              }
            </div>

            {/* Région */}
            <div>
              <label style={label}>Région / Province</label>
              {formData.countryId && regions.length > 0
                ? <select style={inputStyle} value={formData.regionId} onChange={e => setFormData({...formData, regionId: e.target.value, cityId: '', neighborhoodId: ''})}>
                    <option value="">-- Sélectionner --</option>
                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                : <input style={{ ...inputStyle, color: '#94a3b8' }} placeholder="Sélectionnez d'abord un pays" disabled />
              }
            </div>
          </div>

          <div style={grid2}>
            {/* Ville */}
            <div>
              <label style={label}>Ville</label>
              {formData.regionId && cities.length > 0
                ? <select style={inputStyle} value={formData.cityId} onChange={e => setFormData({...formData, cityId: e.target.value, neighborhoodId: ''})}>
                    <option value="">-- Sélectionner --</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    <option value="__other__">Autre ville (saisir manuellement)</option>
                  </select>
                : formData.regionId
                  ? <input style={inputStyle} placeholder="Saisissez votre ville" value={formData.cityId.startsWith('__') ? '' : formData.cityId}
                      onChange={e => setFormData({...formData, cityId: '__manual__:' + e.target.value})} />
                  : <input style={{ ...inputStyle, color: '#94a3b8' }} placeholder="Sélectionnez d'abord une région" disabled />
              }
              {formData.cityId === '__other__' && (
                <input style={{ ...inputStyle, marginTop: '0.5rem', border: '1px solid var(--color-accent)' }}
                  placeholder="Nom de votre ville" autoFocus
                  onChange={e => setFormData({...formData, cityId: '__manual__:' + e.target.value})} />
              )}
            </div>

            {/* Quartier */}
            <div>
              <label style={label}>Quartier <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optionnel)</span></label>
              {formData.cityId && !formData.cityId.startsWith('__') && neighborhoods.length > 0
                ? <select style={inputStyle} value={formData.neighborhoodId} onChange={e => setFormData({...formData, neighborhoodId: e.target.value})}>
                    <option value="">-- Sélectionner --</option>
                    {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                    <option value="__other__">Autre quartier (saisir manuellement)</option>
                  </select>
                : <input style={inputStyle} placeholder="Ex: Adidogomé, Tokoin..."
                    value={formData.neighborhoodId.startsWith('__') ? formData.neighborhoodId.replace('__manual__:', '') : ''}
                    onChange={e => setFormData({...formData, neighborhoodId: '__manual__:' + e.target.value})} />
              }
              {formData.neighborhoodId === '__other__' && (
                <input style={{ ...inputStyle, marginTop: '0.5rem', border: '1px solid var(--color-accent)' }}
                  placeholder="Nom de votre quartier" autoFocus
                  onChange={e => setFormData({...formData, neighborhoodId: '__manual__:' + e.target.value})} />
              )}
            </div>
          </div>
        </div>

        {/* Section 3 — Description */}
        <div style={sectionCard}>
          <h3 style={sectionTitle}>
            <Info size={18} color="var(--color-accent)" /> Description de votre recherche
          </h3>
          <label style={label}>Décrivez vos exigences (commodités, sécurité, durée, etc.) <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
            rows={5}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Ex: Je cherche une chambre avec cuisine interne, carrelée, dans une zone sécurisée, pas trop loin de la route principale, avec eau courante et électricité..."
            required
          />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 700,
          borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          background: 'var(--color-primary)', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(11,31,58,0.3)', transition: 'opacity 0.2s',
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? <Loader className="spin" size={22} /> : <><Plus size={20} /> Soumettre ma demande de logement</>}
        </button>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', marginTop: '0.75rem' }}>
          Votre demande sera visible par les propriétaires et agences de la zone choisie.
        </p>
      </form>
    </div>
  );
};

export default function Publish() {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  
  // --- ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL RETURN ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasReachedLimit, setHasReachedLimit] = useState(false);

  // Localisation data
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    transactionType: 'RENT',
    propertyType: 'HOUSE',
    countryId: '',
    regionId: '',
    cityId: '',
    neighborhoodId: '',
    address: '',
    title: '',
    description: '',
    price: '',
    currency: 'XOF',
    surface: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    latitude: null as number | null,
    longitude: null as number | null
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const premium = localStorage.getItem('nestora_is_premium') === 'true';
    if (!premium) {
      setHasReachedLimit(true);
    }
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/countries`)
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        if (data.length > 0) setFormData(prev => ({ ...prev, countryId: data[0].id }));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/regions?countryId=${formData.countryId}`)
        .then(res => res.json())
        .then(data => {
          setRegions(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, regionId: data[0].id }));
          else setFormData(prev => ({ ...prev, regionId: '' }));
        });
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.regionId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/cities?regionId=${formData.regionId}`)
        .then(res => res.json())
        .then(data => {
          setCities(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, cityId: data[0].id }));
          else setFormData(prev => ({ ...prev, cityId: '' }));
        });
    }
  }, [formData.regionId]);

  useEffect(() => {
    if (formData.cityId) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/locations/neighborhoods?cityId=${formData.cityId}`)
        .then(res => res.json())
        .then(data => {
          setNeighborhoods(data);
          if (data.length > 0) setFormData(prev => ({ ...prev, neighborhoodId: data[0].id }));
          else setFormData(prev => ({ ...prev, neighborhoodId: '' }));
        });
    }
  }, [formData.cityId]);

  // --- CONDITIONAL RETURNS AFTER ALL HOOKS ---
  
  // SEEKER check
  if (role === 'SEEKER') {
    return <SeekerPublishForm />;
  }

  // UI Si la limite est atteinte
  if (hasReachedLimit) {
    return (
      <div className="publish-page" style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '3rem 2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ background: '#fef3c7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Lock size={40} color="#d97706" />
          </div>
          
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#92400e', marginBottom: '1rem' }}>
            Limite de publication atteinte
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#b45309', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            En tant qu'utilisateur gratuit, vous êtes limité à <strong>2 annonces actives</strong>. 
            De plus, vos annonces risquent d'être noyées dans les résultats de recherche.
          </p>
          
          <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Passez au Premium pour :</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                <CheckCircle size={18} color="#10b981" /> Publier des annonces en illimité
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                <CheckCircle size={18} color="#10b981" /> Apparaître en priorité dans les recherches
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                <CheckCircle size={18} color="#10b981" /> Voir qui s'intéresse à vos biens
              </li>
            </ul>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Retour au tableau de bord
            </button>
            <button 
              className="btn" 
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600 }}
              onClick={() => navigate('/tarifs')}
            >
              <Crown size={20} /> Découvrir Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  const transactionTypes = [
    { value: 'RENT', label: 'Location' },
    { value: 'SALE', label: 'Vente' }
  ];

  const propertyTypes = [
    { value: 'HOUSE', label: 'Maison' },
    { value: 'APARTMENT', label: 'Appartement' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'LAND', label: 'Terrain' },
    { value: 'OFFICE', label: 'Bureau' },
    { value: 'SHOP', label: 'Local commercial' },
    { value: 'OTHER', label: 'Autre' }
  ];

  const availableAmenities = [
    'Parking', 'Garage', 'Jardin', 'Piscine', 'Terrasse', 'Balcon',
    'Climatisation', 'Meublé', 'Cuisine équipée', 'Sécurité', 'Eau',
    'Électricité', 'Groupe électrogène', 'Internet', 'Ascenseur', 'Gardien', 'Accès véhicule'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      if (exists) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = images.length + newFiles.length;
      
      if (totalImages > 10) {
        setError('Vous ne pouvez télécharger que 10 images maximum.');
        return;
      }
      
      setError('');
      setImages(prev => [...prev, ...newFiles]);
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]); // Free memory
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 2) {
      if (!formData.countryId || !formData.regionId || !formData.cityId) {
        setError("Veuillez sélectionner au moins le pays, la région et la ville.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.title || !formData.description || !formData.price) {
        setError("Le titre, la description et le prix sont obligatoires.");
        return false;
      }
      if (Number(formData.price) < 0) {
        setError("Le prix ne peut pas être négatif.");
        return false;
      }
    }
    if (currentStep === 4) {
      if (images.length === 0) {
        setError("Veuillez ajouter au moins une photo.");
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Upload images to Supabase Storage
      const uploadedUrls: string[] = [];
      
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);
          
        if (uploadError) {
          throw new Error(`Erreur lors du téléchargement de l'image: ${uploadError.message}`);
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // 2. Submit data to backend

      // Wait, with Supabase, we get the token dynamically.
      const { data: { session } } = await supabase.auth.getSession();
      const jwt = session?.access_token;
      
      if (!jwt) throw new Error("Non autorisé. Veuillez vous reconnecter.");

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          ...formData,
          images: uploadedUrls
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erreur lors de la création de l\'annonce');
      }

      navigate('/mes-annonces?success=true');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue lors de la publication.');
      setLoading(false);
    }
  };

  return (
    <div className="publish-page" style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="publish-header text-center mb-4">
        <h1 className="page-title">Publier une annonce</h1>
        <p className="text-light">Complétez les informations pour mettre votre bien en ligne.</p>
      </div>

      <div className="publish-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <div className="step-label d-none d-md-block">Type de bien</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <div className="step-label d-none d-md-block">Localisation</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <div className="step-label d-none d-md-block">Informations</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <div className="step-label d-none d-md-block">Photos</div>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 5 ? 'active' : ''}`}>
          <div className="step-circle">5</div>
          <div className="step-label d-none d-md-block">Aperçu</div>
        </div>
      </div>

      {error && <div className="badge-warning mb-4" style={{ padding: '1rem', borderRadius: '8px' }}>{error}</div>}

      <div className="publish-content card p-4">
        {step === 1 && (
          <div className="step-container">
            <h2 className="mb-4 d-flex align-center gap-2"><FileText size={24} color="var(--color-primary)" /> Type de transaction et de bien</h2>
            
            <div className="form-group mb-4">
              <label>Type de transaction *</label>
              <div className="radio-group row mt-2" style={{ gap: '1rem' }}>
                {transactionTypes.map(t => (
                  <div 
                    key={t.value} 
                    className={`radio-card col ${formData.transactionType === t.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, transactionType: t.value })}
                  >
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group mb-4">
              <label>Type de bien *</label>
              <div className="radio-group-grid mt-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {propertyTypes.map(p => (
                  <div 
                    key={p.value} 
                    className={`radio-card ${formData.propertyType === p.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, propertyType: p.value })}
                  >
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-container">
            <h2 className="mb-4 d-flex align-center gap-2"><MapPin size={24} color="var(--color-primary)" /> Localisation</h2>
            
            <div className="row mb-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group col" style={{ flex: '1 1 200px' }}>
                <label>Pays *</label>
                <select name="countryId" className="form-control" value={formData.countryId} onChange={handleChange}>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group col" style={{ flex: '1 1 200px' }}>
                <label>Région *</label>
                <select name="regionId" className="form-control" value={formData.regionId} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>

            <div className="row mb-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group col" style={{ flex: '1 1 200px' }}>
                <label>Ville *</label>
                <select name="cityId" className="form-control" value={formData.cityId} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group col" style={{ flex: '1 1 200px' }}>
                <label>Quartier</label>
                <select name="neighborhoodId" className="form-control" value={formData.neighborhoodId} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group mb-3">
              <label>Adresse complète (Facultatif)</label>
              <input type="text" name="address" className="form-control" value={formData.address} onChange={handleChange} placeholder="Ex: Rue 123, Porte 45" />
            </div>

            <div className="form-group mb-3">
              <label>Emplacement exact sur la carte (Recommandé)</label>
              <p className="text-light" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Cliquez sur la carte pour placer un repère. La localisation restera approximative pour les visiteurs.</p>
              <LocationPicker 
                position={formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null}
                onChange={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-container">
            <h2 className="mb-4 d-flex align-center gap-2"><Info size={24} color="var(--color-primary)" /> Informations générales</h2>
            
            <div className="form-group mb-3">
              <label>Titre de l'annonce *</label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} placeholder="Ex: Magnifique Villa avec piscine" required />
            </div>

            <div className="form-group mb-3">
              <label>Description détaillée *</label>
              <textarea name="description" className="form-control" rows={6} value={formData.description} onChange={handleChange} placeholder="Décrivez votre bien en mettant en valeur ses atouts..." required />
            </div>

            <div className="row mb-3" style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group col" style={{ flex: 2 }}>
                <label>Prix *</label>
                <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} placeholder="Ex: 150000" min="0" required />
              </div>
              <div className="form-group col" style={{ flex: 1 }}>
                <label>Devise</label>
                <select name="currency" className="form-control" value={formData.currency} onChange={handleChange}>
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>

            {formData.propertyType !== 'LAND' && (
              <div className="row mb-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="form-group col" style={{ flex: '1 1 120px' }}>
                  <label>Surface (m²)</label>
                  <input type="number" name="surface" className="form-control" value={formData.surface} onChange={handleChange} min="0" />
                </div>
                <div className="form-group col" style={{ flex: '1 1 120px' }}>
                  <label>Chambres</label>
                  <input type="number" name="bedrooms" className="form-control" value={formData.bedrooms} onChange={handleChange} min="0" />
                </div>
                <div className="form-group col" style={{ flex: '1 1 120px' }}>
                  <label>Salles de bain</label>
                  <input type="number" name="bathrooms" className="form-control" value={formData.bathrooms} onChange={handleChange} min="0" />
                </div>
              </div>
            )}

            <div className="form-group mb-3 mt-4">
              <label className="mb-2 d-block">Caractéristiques & Équipements</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                {availableAmenities.map(amenity => (
                  <div key={amenity} className="d-flex align-center" style={{ gap: '0.5rem', cursor: 'pointer' }} onClick={() => handleAmenityToggle(amenity)}>
                    <input type="checkbox" checked={formData.amenities.includes(amenity)} readOnly />
                    <span style={{ fontSize: '0.9rem' }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-container">
            <h2 className="mb-4 d-flex align-center gap-2"><ImageIcon size={24} color="var(--color-primary)" /> Photos du bien</h2>
            <p className="text-light mb-4">Ajoutez au moins une photo. Les annonces avec plusieurs belles photos génèrent 3x plus de contacts. (Max 10 images)</p>
            
            <div className="photo-upload-container mb-4" style={{ border: '2px dashed var(--color-border)', borderRadius: '12px', padding: '3rem 1rem', textAlign: 'center', backgroundColor: '#fafafa' }}>
              <input type="file" id="photo-upload" multiple accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} style={{ display: 'none' }} />
              <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: '#eef2f6', padding: '1rem', borderRadius: '50%', color: 'var(--color-primary)' }}>
                  <Plus size={32} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Cliquez pour ajouter des photos</div>
                  <div className="text-light text-sm mt-1">JPG, PNG, WEBP (Max 5MB)</div>
                </div>
              </label>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="photos-preview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <img src={url} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'rgba(255,0,0,0.8)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                    {index === 0 && (
                      <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', backgroundColor: 'rgba(11,31,58,0.8)', color: '#fff', fontSize: '0.7rem', padding: '0.2rem', textAlign: 'center' }}>
                        Image Principale
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="step-container">
            <h2 className="mb-4 d-flex align-center gap-2"><CheckCircle size={24} color="#10b981" /> Aperçu avant publication</h2>
            
            <div className="preview-card" style={{ border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
              {imagePreviewUrls.length > 0 ? (
                <div style={{ height: '300px', width: '100%', overflow: 'hidden' }}>
                  <img src={imagePreviewUrls[0]} alt="Principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{ height: '300px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  Aucune image
                </div>
              )}
              
              <div className="p-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      {formData.transactionType === 'RENT' ? 'À LOUER' : 'À VENDRE'} • {propertyTypes.find(p => p.value === formData.propertyType)?.label?.toUpperCase()}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-dark)' }}>{formData.title}</h3>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {formData.price} {formData.currency}
                  </div>
                </div>

                <div className="text-light mb-4 d-flex align-center gap-2">
                  <MapPin size={16} /> 
                  {cities.find(c => c.id === formData.cityId)?.name}, {countries.find(c => c.id === formData.countryId)?.name}
                </div>

                <div className="mb-4 text-dark" style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {formData.description}
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />
                
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  {formData.surface && <div><strong style={{ color: 'var(--color-text-dark)' }}>Surface:</strong> <span className="text-light">{formData.surface} m²</span></div>}
                  {formData.bedrooms && <div><strong style={{ color: 'var(--color-text-dark)' }}>Chambres:</strong> <span className="text-light">{formData.bedrooms}</span></div>}
                  {formData.bathrooms && <div><strong style={{ color: 'var(--color-text-dark)' }}>Salles de bain:</strong> <span className="text-light">{formData.bathrooms}</span></div>}
                </div>
              </div>
            </div>
            
            <div className="alert alert-info mt-4" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '1rem', borderRadius: '8px', color: '#0369a1' }}>
              <strong>Note:</strong> En cliquant sur "Publier maintenant", votre annonce sera enregistrée en base de données et visible selon nos conditions de modération.
            </div>
          </div>
        )}

      </div>

      <div className="publish-footer mt-4" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0' }}>
        {step > 1 ? (
          <button className="btn btn-outline" onClick={handlePrev} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Précédent
          </button>
        ) : (
          <div></div>
        )}

        {step < 5 ? (
          <button className="btn btn-primary" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Suivant <ArrowRight size={18} />
          </button>
        ) : (
          <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? <><Loader size={18} className="spin" /> Publication en cours...</> : <><CheckCircle size={18} /> Publier maintenant</>}
          </button>
        )}
      </div>

      <style>{`
        .publish-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          background: #fff;
          padding: 1.5rem 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.5;
          transition: all 0.3s;
        }
        .progress-step.active {
          opacity: 1;
        }
        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-border);
          color: var(--color-text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s;
        }
        .progress-step.active .step-circle {
          background: var(--color-primary);
          color: #fff;
        }
        .progress-line {
          flex: 1;
          height: 2px;
          background: var(--color-border);
          margin: 0 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 768px) {
          .progress-label { display: none; }
          .progress-line { margin-bottom: 0; }
        }
        
        .radio-card {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
          color: var(--color-text-dark);
        }
        .radio-card:hover {
          border-color: var(--color-primary);
        }
        .radio-card.selected {
          border-color: var(--color-primary);
          background-color: rgba(11, 31, 58, 0.05);
          color: var(--color-primary);
        }
        
        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(11, 31, 58, 0.1);
        }
        label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-dark);
          margin-bottom: 0.5rem;
          display: inline-block;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
