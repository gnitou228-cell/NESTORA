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
    <img
      src="/brand/logo.jpg"
      alt="NESTORA Logo"
      className={`nestora-logo ${className}`}
      style={{ ...objectFitStyles, borderRadius: '4px', ...style }}
    />
  );
}
