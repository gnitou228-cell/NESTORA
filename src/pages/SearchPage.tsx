import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';
import '../home.css';
import PropertyCard from '../components/PropertyCard';

const AMENITIES_LIST = [
  "Parking", "Garage", "Jardin", "Piscine", "Terrasse", "Balcon",
  "Climatisation", "Meublé", "Cuisine équipée", "Sécurité",
  "Eau", "Électricité", "Groupe électrogène", "Internet",
  "Ascenseur", "Gardien", "Accès véhicule"
];

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'LAND', label: 'Terrain' },
  { value: 'OFFICE', label: 'Bureau' },
  { value: 'SHOP', label: 'Local commercial' },
  { value: 'OTHER', label: 'Autre' }
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States based on URL params
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    countryId: searchParams.get('countryId') || '',
    regionId: searchParams.get('regionId') || '',
    cityId: searchParams.get('cityId') || '',
    neighborhoodId: searchParams.get('neighborhoodId') || '',
    transactionType: searchParams.get('transactionType') || '',
    propertyType: searchParams.get('propertyType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    minBathrooms: searchParams.get('minBathrooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [],
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1')
  });

  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initial fetches
  useEffect(() => {
    fetch('http://localhost:5000/api/locations/countries')
      .then(res => res.json())
      .then(setCountries)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (filters.countryId) {
      fetch(`http://localhost:5000/api/locations/regions?countryId=${filters.countryId}`)
        .then(res => res.json())
        .then(setRegions)
        .catch(console.error);
    } else {
      setRegions([]);
    }
  }, [filters.countryId]);

  useEffect(() => {
    if (filters.regionId) {
      fetch(`http://localhost:5000/api/locations/cities?regionId=${filters.regionId}`)
        .then(res => res.json())
        .then(setCities)
        .catch(console.error);
    } else {
      setCities([]);
    }
  }, [filters.regionId]);

  useEffect(() => {
    if (filters.cityId) {
      fetch(`http://localhost:5000/api/locations/neighborhoods?cityId=${filters.cityId}`)
        .then(res => res.json())
        .then(setNeighborhoods)
        .catch(console.error);
    } else {
      setNeighborhoods([]);
    }
  }, [filters.cityId]);

  // Handle URL syncing and fetching
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params.set(key, String(value));
        }
      }
    });
    setSearchParams(params, { replace: true });
    
    // Only fetch if we are mounted, but useEffect will run on mount anyway
    fetchResults(params);
  }, [filters, setSearchParams]);

  const fetchResults = async (params: URLSearchParams) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/properties/search?${params.toString()}`);
      if (!response.ok) throw new Error('Erreur lors de la recherche');
      const data = await response.json();
      setResults(data.properties || []);
      setTotal(data.pagination?.total || 0);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value, page: 1 };
      if (name === 'countryId') { newFilters.regionId = ''; newFilters.cityId = ''; newFilters.neighborhoodId = ''; }
      if (name === 'regionId') { newFilters.cityId = ''; newFilters.neighborhoodId = ''; }
      if (name === 'cityId') { newFilters.neighborhoodId = ''; }
      return newFilters;
    });
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId];
      return { ...prev, amenities: newAmenities, page: 1 };
    });
  };

  const removeFilter = (key: string, isArrayItem: string = '') => {
    if (isArrayItem) {
      setFilters(prev => ({
        ...prev,
        amenities: prev.amenities.filter(a => a !== isArrayItem),
        page: 1
      }));
    } else {
      setFilters(prev => ({ ...prev, [key]: '', page: 1 }));
    }
  };

  const resetFilters = () => {
    setFilters({
      q: '', countryId: '', regionId: '', cityId: '', neighborhoodId: '',
      transactionType: '', propertyType: '', minPrice: '', maxPrice: '',
      minBedrooms: '', minBathrooms: '', minArea: '', maxArea: '',
      amenities: [], sort: 'newest', page: 1
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'page' || key === 'sort' || key === 'q') return false;
    if (Array.isArray(val)) return val.length > 0;
    return Boolean(val);
  }).length;

  return (
    <div className="bg-secondary" style={{ minHeight: '100vh' }}>
      <div style={{ backgroundColor: 'var(--color-primary)', padding: '2rem 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'center' }}>
          <div className="search-box" style={{ padding: '0.5rem', background: 'white', borderRadius: '50px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', width: '100%', maxWidth: '900px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Champ Mot-clé */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 2, minWidth: '200px', padding: '0 1rem' }}>
              <Search color="var(--color-text-light)" size={20} />
              <input 
                type="text" 
                name="q"
                value={filters.q}
                onChange={handleChange}
                placeholder="Rechercher (titre, mot-clé...)" 
                style={{ border: 'none', outline: 'none', padding: '1rem 0.5rem', width: '100%', fontSize: '0.95rem' }} 
              />
            </div>
            
            {/* Séparateur */}
            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border)' }}></div>

            {/* Champ Ville */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1.5, minWidth: '150px', padding: '0 1rem' }}>
              <MapPin color="var(--color-text-light)" size={20} />
              <select 
                name="cityId" 
                value={filters.cityId} 
                onChange={handleChange} 
                style={{ border: 'none', outline: 'none', padding: '1rem 0.5rem', width: '100%', fontSize: '0.95rem', background: 'transparent', color: 'var(--color-text-dark)', cursor: 'pointer' }}
              >
                <option value="">Toutes les villes</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Séparateur */}
            <div style={{ width: '1px', height: '30px', backgroundColor: 'var(--color-border)' }}></div>

            {/* Champ Type de bien */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1.5, minWidth: '150px', padding: '0 1rem' }}>
              <select 
                name="propertyType" 
                value={filters.propertyType} 
                onChange={handleChange} 
                style={{ border: 'none', outline: 'none', padding: '1rem 0.5rem', width: '100%', fontSize: '0.95rem', background: 'transparent', color: 'var(--color-text-dark)', cursor: 'pointer' }}
              >
                <option value="">Tous les types</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Bouton Rechercher */}
            <button className="btn btn-primary" style={{ borderRadius: '50px', padding: '0.8rem 2rem', marginLeft: 'auto', fontWeight: 600 }}>
              Rechercher
            </button>
            
          </div>
        </div>
      </div>

      <div className="search-page-container">
        {/* BOUTON MOBILE FILTRES */}
        <div className="search-mobile-btn" style={{ width: '100%', marginBottom: '1rem' }}>
          <button className="btn btn-outline btn-block" onClick={() => setShowMobileFilters(true)}>
            <Filter size={18} />
            Filtres ({activeFiltersCount})
          </button>
        </div>

        {/* SIDEBAR FILTRES */}
        <div className={`search-sidebar card ${showMobileFilters ? 'mobile-open' : ''}`}>
          {showMobileFilters && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Filtres avancés</h2>
              <button onClick={() => setShowMobileFilters(false)} style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>
          )}
          
          {!showMobileFilters && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', margin: 0 }}>
                <Filter size={20} color="var(--color-accent)" /> Filtres
              </h3>
              {activeFiltersCount > 0 && (
                <button onClick={resetFilters} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'underline' }}>
                  Réinitialiser
                </button>
              )}
            </div>
          )}

          <div className="filter-section">
            <label className="filter-label">Transaction</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn ${filters.transactionType === 'RENT' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '0.5rem' }}
                onClick={() => setFilters(prev => ({ ...prev, transactionType: 'RENT', page: 1 }))}
              >
                Location
              </button>
              <button 
                className={`btn ${filters.transactionType === 'SALE' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, padding: '0.5rem' }}
                onClick={() => setFilters(prev => ({ ...prev, transactionType: 'SALE', page: 1 }))}
              >
                Vente
              </button>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Type de bien</label>
            <select name="propertyType" value={filters.propertyType} onChange={handleChange} className="filter-select">
              <option value="">Tous les types</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <label className="filter-label">Localisation</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <select name="countryId" value={filters.countryId} onChange={handleChange} className="filter-select">
                <option value="">Tous les pays</option>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              
              {filters.countryId && (
                <select name="regionId" value={filters.regionId} onChange={handleChange} className="filter-select">
                  <option value="">Toutes les régions</option>
                  {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              )}
              
              {filters.regionId && (
                <select name="cityId" value={filters.cityId} onChange={handleChange} className="filter-select">
                  <option value="">Toutes les villes</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
              
              {filters.cityId && (
                <select name="neighborhoodId" value={filters.neighborhoodId} onChange={handleChange} className="filter-select">
                  <option value="">Tous les quartiers</option>
                  {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Prix (FCFA)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} placeholder="Min" className="filter-input" />
              <span>-</span>
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} placeholder="Max" className="filter-input" />
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Caractéristiques</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Chambres min.</span>
                <select name="minBedrooms" value={filters.minBedrooms} onChange={handleChange} className="filter-select">
                  <option value="">Peu importe</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Salles de bain</span>
                <select name="minBathrooms" value={filters.minBathrooms} onChange={handleChange} className="filter-select">
                  <option value="">Peu importe</option>
                  {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
              <input type="number" name="minArea" value={filters.minArea} onChange={handleChange} placeholder="Surf. min (m²)" className="filter-input" />
              <span>-</span>
              <input type="number" name="maxArea" value={filters.maxArea} onChange={handleChange} placeholder="Surf. max (m²)" className="filter-input" />
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Équipements</label>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {/* Using static amenities for UI, backend handles creation mapping */}
              {AMENITIES_LIST.map(amenity => (
                <label key={amenity} className="filter-checkbox">
                  <input 
                    type="checkbox" 
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          {showMobileFilters && (
            <button className="btn btn-primary btn-block" style={{ marginTop: '1rem' }} onClick={() => setShowMobileFilters(false)}>
              Appliquer les filtres
            </button>
          )}
        </div>

        {/* RESULTATS */}
        <div className="search-results-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
              {total > 0 ? `${total} annonce${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}` : 'Recherche'}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Trier par :</span>
              <select name="sort" value={filters.sort} onChange={handleChange} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none' }}>
                <option value="newest">Plus récent</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="area_asc">Surface croissante</option>
                <option value="area_desc">Surface décroissante</option>
              </select>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {filters.transactionType && (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {filters.transactionType === 'RENT' ? 'Location' : 'Vente'}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('transactionType')} />
                </span>
              )}
              {filters.propertyType && (
                <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {PROPERTY_TYPES.find(t => t.value === filters.propertyType)?.label}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('propertyType')} />
                </span>
              )}
              {filters.cityId && (
                <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {cities.find(c => c.id === filters.cityId)?.name || 'Ville'}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('cityId')} />
                </span>
              )}
              {filters.neighborhoodId && (
                <span className="badge" style={{ backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {neighborhoods.find(n => n.id === filters.neighborhoodId)?.name || 'Quartier'}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('neighborhoodId')} />
                </span>
              )}
              {filters.minPrice && (
                <span className="badge" style={{ backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Min: {filters.minPrice}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('minPrice')} />
                </span>
              )}
              {filters.maxPrice && (
                <span className="badge" style={{ backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Max: {filters.maxPrice}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('maxPrice')} />
                </span>
              )}
              {filters.amenities.map(amenity => (
                <span key={amenity} className="badge" style={{ backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {amenity}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeFilter('amenities', amenity)} />
                </span>
              ))}
              
              <button onClick={resetFilters} style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'underline', padding: '0.2rem 0.5rem' }}>
                Tout effacer
              </button>
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)', borderRadius: '8px', marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <Loader className="spin" size={48} color="var(--color-accent)" />
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
              <Search size={48} color="var(--color-border)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>Aucune annonce ne correspond à votre recherche.</h3>
              <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>Essayez de modifier vos filtres ou d'élargir votre zone de recherche.</p>
              <button onClick={resetFilters} className="btn btn-outline">Réinitialiser les filtres</button>
            </div>
          ) : (
            <>
              <div className="properties-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {results.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '3rem' }}>
                  <button 
                    onClick={() => handlePageChange(filters.page - 1)} 
                    disabled={filters.page === 1}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem', borderRadius: '50%' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    Page {filters.page} sur {totalPages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(filters.page + 1)} 
                    disabled={filters.page === totalPages}
                    className="btn btn-outline"
                    style={{ padding: '0.5rem', borderRadius: '50%' }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
