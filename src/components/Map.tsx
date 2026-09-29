import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Premium Marker for NESTORA
const customMarkerIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `<div style="background-color: var(--color-primary); width: 30px; height: 30px; border-radius: 50%; border: 2px solid var(--color-accent); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
         </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});


interface MapProps {
  properties: any[];
  center?: [number, number];
  zoom?: number;
  onBoundsChange?: (bounds: string) => void;
  style?: React.CSSProperties;
  showSearchHereButton?: boolean;
}

// Component to handle map center updates
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Component to handle bounds changes and "Search Here" functionality
const MapEvents = ({ onBoundsChange, showSearchHereButton }: { onBoundsChange?: (bounds: string) => void, showSearchHereButton?: boolean }) => {
  const map = useMap();
  const [showBtn, setShowBtn] = useState(false);

  useMapEvents({
    moveend: () => {
      if (showSearchHereButton && onBoundsChange) {
        setShowBtn(true);
      }
    },
    zoomend: () => {
      if (showSearchHereButton && onBoundsChange) {
        setShowBtn(true);
      }
    }
  });

  const handleSearchHere = () => {
    if (onBoundsChange) {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      onBoundsChange(`${sw.lat},${sw.lng},${ne.lat},${ne.lng}`);
      setShowBtn(false);
    }
  };

  if (!showSearchHereButton || !showBtn) return null;

  return (
    <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
      <button 
        onClick={handleSearchHere}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: 'white', 
          border: 'none', 
          borderRadius: '20px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          fontWeight: 'bold',
          color: 'var(--color-primary)',
          cursor: 'pointer'
        }}
      >
        Rechercher dans cette zone
      </button>
    </div>
  );
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

export const NestoraMap: React.FC<MapProps> = ({ 
  properties, 
  center = [12.368, -1.527], // Default to Ouagadougou or central WA
  zoom = 6, 
  onBoundsChange,
  style = { height: '100%', width: '100%' },
  showSearchHereButton = false
}) => {

  const mapCenter = properties.length > 0 && properties[0].latitude && properties[0].longitude
    ? [properties[0].latitude, properties[0].longitude] as [number, number]
    : center;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ChangeView center={mapCenter} zoom={zoom} />
        <MapEvents onBoundsChange={onBoundsChange} showSearchHereButton={showSearchHereButton} />
        
        <MarkerClusterGroup 
          chunkedLoading
          maxClusterRadius={50}
        >
          {properties.filter(p => p.latitude && p.longitude).map((property) => (
            <Marker 
              key={property.id} 
              position={[property.latitude, property.longitude]}
              icon={customMarkerIcon}
            >
              <Popup className="custom-popup">
                <div style={{ width: '200px' }}>
                  {property.images && property.images.length > 0 && (
                    <img 
                      src={property.images[0].url} 
                      alt={property.title} 
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px 4px 0 0' }} 
                    />
                  )}
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: 'var(--color-primary)' }}>
                      {formatPrice(property.price)} {property.currency}
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '4px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {property.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                      {property.propertyType === 'RENT' ? 'Location' : 'Vente'} • {property.city?.name} {property.neighborhood ? `(${property.neighborhood.name})` : ''}
                    </div>
                    <Link 
                      to={`/annonces/${property.id}`} 
                      className="btn btn-primary" 
                      style={{ display: 'block', textAlign: 'center', padding: '4px 8px', fontSize: '12px', textDecoration: 'none' }}
                    >
                      Voir l'annonce
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 8px;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </div>
  );
};
