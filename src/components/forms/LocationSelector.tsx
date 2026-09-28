import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/locations';

// Fallback data if DB is unreachable
const FALLBACK_COUNTRIES = [
  { id: 'DZ', name: 'Algérie', code: 'DZ' },
  { id: 'AO', name: 'Angola', code: 'AO' },
  { id: 'BJ', name: 'Bénin', code: 'BJ' },
  { id: 'BW', name: 'Botswana', code: 'BW' },
  { id: 'BF', name: 'Burkina Faso', code: 'BF' },
  { id: 'BI', name: 'Burundi', code: 'BI' },
  { id: 'CM', name: 'Cameroun', code: 'CM' },
  { id: 'CV', name: 'Cap-Vert', code: 'CV' },
  { id: 'CF', name: 'République centrafricaine', code: 'CF' },
  { id: 'TD', name: 'Tchad', code: 'TD' },
  { id: 'KM', name: 'Comores', code: 'KM' },
  { id: 'CG', name: 'République du Congo', code: 'CG' },
  { id: 'CD', name: 'République démocratique du Congo', code: 'CD' },
  { id: 'CI', name: 'Côte d’Ivoire', code: 'CI' },
  { id: 'DJ', name: 'Djibouti', code: 'DJ' },
  { id: 'EG', name: 'Égypte', code: 'EG' },
  { id: 'GQ', name: 'Guinée équatoriale', code: 'GQ' },
  { id: 'ER', name: 'Érythrée', code: 'ER' },
  { id: 'SZ', name: 'Eswatini', code: 'SZ' },
  { id: 'ET', name: 'Éthiopie', code: 'ET' },
  { id: 'GA', name: 'Gabon', code: 'GA' },
  { id: 'GM', name: 'Gambie', code: 'GM' },
  { id: 'GH', name: 'Ghana', code: 'GH' },
  { id: 'GN', name: 'Guinée', code: 'GN' },
  { id: 'GW', name: 'Guinée-Bissau', code: 'GW' },
  { id: 'KE', name: 'Kenya', code: 'KE' },
  { id: 'LS', name: 'Lesotho', code: 'LS' },
  { id: 'LR', name: 'Liberia', code: 'LR' },
  { id: 'LY', name: 'Libye', code: 'LY' },
  { id: 'MG', name: 'Madagascar', code: 'MG' },
  { id: 'MW', name: 'Malawi', code: 'MW' },
  { id: 'ML', name: 'Mali', code: 'ML' },
  { id: 'MR', name: 'Mauritanie', code: 'MR' },
  { id: 'MU', name: 'Maurice', code: 'MU' },
  { id: 'MA', name: 'Maroc', code: 'MA' },
  { id: 'MZ', name: 'Mozambique', code: 'MZ' },
  { id: 'NA', name: 'Namibie', code: 'NA' },
  { id: 'NE', name: 'Niger', code: 'NE' },
  { id: 'NG', name: 'Nigeria', code: 'NG' },
  { id: 'RW', name: 'Rwanda', code: 'RW' },
  { id: 'ST', name: 'São Tomé-et-Príncipe', code: 'ST' },
  { id: 'SN', name: 'Sénégal', code: 'SN' },
  { id: 'SC', name: 'Seychelles', code: 'SC' },
  { id: 'SL', name: 'Sierra Leone', code: 'SL' },
  { id: 'SO', name: 'Somalie', code: 'SO' },
  { id: 'ZA', name: 'Afrique du Sud', code: 'ZA' },
  { id: 'SS', name: 'Soudan du Sud', code: 'SS' },
  { id: 'SD', name: 'Soudan', code: 'SD' },
  { id: 'TZ', name: 'Tanzanie', code: 'TZ' },
  { id: 'TG', name: 'Togo', code: 'TG' },
  { id: 'TN', name: 'Tunisie', code: 'TN' },
  { id: 'UG', name: 'Ouganda', code: 'UG' },
  { id: 'ZM', name: 'Zambie', code: 'ZM' },
  { id: 'ZW', name: 'Zimbabwe', code: 'ZW' },
];
const FALLBACK_REGIONS: Record<string, any[]> = {
  'BF': [
    { id: 'BF-C', name: 'Centre' },
    { id: 'BF-HB', name: 'Hauts-Bassins' },
    { id: 'BF-CAS', name: 'Cascades' },
    { id: 'BF-CO', name: 'Centre-Ouest' },
    { id: 'BF-CE', name: 'Centre-Est' },
    { id: 'BF-CN', name: 'Centre-Nord' },
    { id: 'BF-CS', name: 'Centre-Sud' },
    { id: 'BF-EST', name: 'Est' },
    { id: 'BF-N', name: 'Nord' },
    { id: 'BF-PC', name: 'Plateau-Central' },
    { id: 'BF-SAH', name: 'Sahel' },
    { id: 'BF-BM', name: 'Boucle du Mouhoun' },
    { id: 'BF-SO', name: 'Sud-Ouest' }
  ],
  'CI': [
    { id: 'CI-ABJ', name: 'District Autonome d\'Abidjan' },
    { id: 'CI-YAM', name: 'District Autonome de Yamoussoukro' },
    { id: 'CI-LG', name: 'Lagunes' },
    { id: 'CI-VB', name: 'Vallée du Bandama' }
  ],
  'SN': [
    { id: 'SN-DKR', name: 'Dakar' },
    { id: 'SN-THS', name: 'Thiès' },
    { id: 'SN-SL', name: 'Saint-Louis' }
  ]
};
const FALLBACK_CITIES: Record<string, any[]> = {
  'BF-C': [{ id: 'OUA', name: 'Ouagadougou' }, { id: 'KOMB', name: 'Kombissiri' }],
  'BF-HB': [{ id: 'BOB', name: 'Bobo-Dioulasso' }, { id: 'OROD', name: 'Orodara' }, { id: 'HOU', name: 'Houndé' }],
  'BF-CO': [{ id: 'KOUD', name: 'Koudougou' }, { id: 'REO', name: 'Réo' }, { id: 'LEO', name: 'Léo' }],
  'BF-CAS': [{ id: 'BANF', name: 'Banfora' }, { id: 'SIND', name: 'Sindou' }],
  'BF-N': [{ id: 'OUAH', name: 'Ouahigouya' }, { id: 'YAKO', name: 'Yako' }],
  'BF-BM': [{ id: 'DED', name: 'Dédougou' }, { id: 'NOU', name: 'Nouna' }, { id: 'TOUG', name: 'Tougan' }],
  'BF-EST': [{ id: 'FADA', name: 'Fada N\'Gourma' }, { id: 'BOG', name: 'Bogandé' }],
  'BF-CE': [{ id: 'TENK', name: 'Tenkodogo' }, { id: 'KOUP', name: 'Koupéla' }, { id: 'POUY', name: 'Pouytenga' }],
  'CI-ABJ': [{ id: 'ABJ', name: 'Abidjan' }],
  'CI-YAM': [{ id: 'YAM', name: 'Yamoussoukro' }],
  'CI-VB': [{ id: 'BOU', name: 'Bouaké' }],
  'SN-DKR': [{ id: 'DKR', name: 'Dakar' }, { id: 'RUF', name: 'Rufisque' }]
};
const FALLBACK_NEIGHBORHOODS: Record<string, any[]> = {
  'OUA': [
    { id: 'O2000', name: 'Ouaga 2000' }, { id: 'ZAD', name: 'ZAD' }, 
    { id: 'PATT', name: 'Patte d\'Oie' }, { id: 'KOU', name: 'Koulouba' }, 
    { id: 'GOU', name: 'Gounghin' }, { id: 'ZOG', name: 'Zogona' },
    { id: 'DAS', name: 'Dassasgho' }, { id: 'PIS', name: 'Pissy' }
  ],
  'BOB': [{ id: 'KOK', name: 'Kôkô' }, { id: 'COL', name: 'Colsama' }, { id: 'BOLO', name: 'Bolomakoté' }],
  'ABJ': [{ id: 'COC', name: 'Cocody' }, { id: 'YOP', name: 'Yopougon' }, { id: 'MAR', name: 'Marcory' }, { id: 'TRE', name: 'Treichville' }, { id: 'PLA', name: 'Plateau' }]
};

function SearchableSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  disabled = false, 
  required = false 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: any[]; 
  placeholder: string; 
  disabled?: boolean; 
  required?: boolean; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.id === value);
  const filteredOptions = options.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="searchable-select-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        className={`form-control ${disabled ? 'disabled' : ''}`}
        style={{ 
          cursor: disabled ? 'not-allowed' : 'pointer', 
          backgroundColor: disabled ? '#f8fafc' : '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm('');
          }
        }}
      >
        <span style={{ color: selectedOption ? 'inherit' : '#94a3b8' }}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>▼</span>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: '#fff',
          border: '1px solid var(--color-border)',
          borderRadius: '4px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '4px',
          maxHeight: '250px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border)' }}>
            <input 
              type="text" 
              className="form-control"
              placeholder="🔍 Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', padding: '6px', fontSize: '0.9rem' }}
              autoFocus
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '8px 12px', color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
                Aucune donnée disponible
              </div>
            ) : (
              filteredOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: option.id === value ? '#f1f5f9' : 'transparent',
                    fontSize: '0.95rem'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = option.id === value ? '#f1f5f9' : 'transparent')}
                >
                  {option.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Hidden native input for required validation */}
      {required && (
        <input 
          type="text" 
          value={value} 
          onChange={() => {}} 
          required 
          style={{ opacity: 0, position: 'absolute', height: 0, width: 0, pointerEvents: 'none' }} 
        />
      )}
    </div>
  );
}

export type LocationSelectorProps = {
  onLocationChange: (location: { countryId?: string; regionId?: string; cityId?: string; neighborhoodId?: string }) => void;
  required?: boolean;
  layout?: 'grid' | 'inline';
};

export default function LocationSelector({ onLocationChange, required = false, layout = 'grid' }: LocationSelectorProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  // Fetch Countries
  useEffect(() => {
    fetch(`${API_URL}/countries`)
      .then(res => res.json())
      .then(data => setCountries(data.length ? data : FALLBACK_COUNTRIES))
      .catch(() => setCountries(FALLBACK_COUNTRIES));
  }, []);

  // Fetch Regions
  useEffect(() => {
    if (!selectedCountry) {
      setRegions([]);
      return;
    }
    fetch(`${API_URL}/regions?countryId=${selectedCountry}`)
      .then(res => res.json())
      .then(data => setRegions(data.length ? data : (FALLBACK_REGIONS[selectedCountry] || [])))
      .catch(() => setRegions(FALLBACK_REGIONS[selectedCountry] || []));
  }, [selectedCountry]);

  // Fetch Cities
  useEffect(() => {
    if (!selectedRegion) {
      setCities([]);
      return;
    }
    fetch(`${API_URL}/cities?regionId=${selectedRegion}`)
      .then(res => res.json())
      .then(data => setCities(data.length ? data : (FALLBACK_CITIES[selectedRegion] || [])))
      .catch(() => setCities(FALLBACK_CITIES[selectedRegion] || []));
  }, [selectedRegion]);

  // Fetch Neighborhoods
  useEffect(() => {
    if (!selectedCity) {
      setNeighborhoods([]);
      return;
    }
    fetch(`${API_URL}/neighborhoods?cityId=${selectedCity}`)
      .then(res => res.json())
      .then(data => setNeighborhoods(data.length ? data : (FALLBACK_NEIGHBORHOODS[selectedCity] || [])))
      .catch(() => setNeighborhoods(FALLBACK_NEIGHBORHOODS[selectedCity] || []));
  }, [selectedCity]);

  const handleCountryChange = (val: string) => {
    setSelectedCountry(val);
    setSelectedRegion('');
    setSelectedCity('');
    setSelectedNeighborhood('');
    onLocationChange({ countryId: val });
  };

  const handleRegionChange = (val: string) => {
    setSelectedRegion(val);
    setSelectedCity('');
    setSelectedNeighborhood('');
    onLocationChange({ countryId: selectedCountry, regionId: val });
  };

  const handleCityChange = (val: string) => {
    setSelectedCity(val);
    setSelectedNeighborhood('');
    onLocationChange({ countryId: selectedCountry, regionId: selectedRegion, cityId: val });
  };

  const handleNeighborhoodChange = (val: string) => {
    setSelectedNeighborhood(val);
    onLocationChange({ countryId: selectedCountry, regionId: selectedRegion, cityId: selectedCity, neighborhoodId: val });
  };

  const containerStyle = layout === 'inline' 
    ? { display: 'flex', gap: '0.5rem', width: '100%', flexWrap: 'wrap' as any }
    : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' };

  return (
    <div className={`location-selector ${layout}`} style={containerStyle}>
      <div className="form-group mb-0" style={layout === 'inline' ? { flex: 1, minWidth: '150px' } : {}}>
        <label>Pays {required && '*'}</label>
        <SearchableSelect 
          options={countries}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="🔎 Rechercher un pays..."
          required={required}
        />
      </div>

      <div className="form-group mb-0" style={layout === 'inline' ? { flex: 1, minWidth: '150px' } : {}}>
        <label>Région / Province</label>
        <SearchableSelect 
          options={regions}
          value={selectedRegion}
          onChange={handleRegionChange}
          placeholder="🔎 Rechercher une région..."
          disabled={!selectedCountry}
        />
      </div>

      <div className="form-group mb-0" style={layout === 'inline' ? { flex: 1, minWidth: '150px' } : {}}>
        <label>Ville</label>
        <SearchableSelect 
          options={cities}
          value={selectedCity}
          onChange={handleCityChange}
          placeholder="🔎 Rechercher une ville..."
          disabled={!selectedRegion}
        />
      </div>

      <div className="form-group mb-0" style={layout === 'inline' ? { flex: 1, minWidth: '150px' } : {}}>
        <label>Quartier / Localité</label>
        <SearchableSelect 
          options={neighborhoods}
          value={selectedNeighborhood}
          onChange={handleNeighborhoodChange}
          placeholder="🔎 Rechercher un quartier..."
          disabled={!selectedCity}
        />
      </div>
    </div>
  );
}
