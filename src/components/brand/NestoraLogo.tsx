import React from 'react';

type NestoraLogoProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'full' | 'compact';
};

export default function NestoraLogo({ className = '', style, size = 'medium', variant = 'full' }: NestoraLogoProps) {
  // Base sizing
  let width = 'auto';
  let height = '40px';

  switch (size) {
    case 'small':
      height = '32px';
      break;
    case 'medium':
      height = '48px';
      break;
    case 'large':
      height = '64px';
      break;
    case 'xlarge':
      height = '96px';
      break;
  }

  // Si on voulait faire un recadrage CSS pour le mode 'compact' (juste l'icône N),
  // on pourrait utiliser object-position et un width fixe.
  // Pour le moment, l'image sera affichée entièrement de manière propre.
  const objectFitStyles: React.CSSProperties = variant === 'compact' 
    ? { width: height, height: height, objectFit: 'cover', objectPosition: 'center 15%' } 
    : { width, height, objectFit: 'contain' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', ...style }}>
      <img
        src="/brand/logo.jpg"
        alt="NESTORA IMMO Logo"
        className={`nestora-logo ${className}`}
        style={{ ...objectFitStyles, borderRadius: '4px' }}
      />
      {variant === 'full' && (
        <span style={{ 
          fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.8rem' : size === 'xlarge' ? '2.5rem' : '1.3rem', 
          fontWeight: 800, 
          color: '#C9A227',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          lineHeight: 1
        }}>
          IMMO
        </span>
      )}
    </div>
  );
}
