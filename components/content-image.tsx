'use client';
import {useState} from 'react';

/**
 * Site image with a dignified fallback: if an image cannot load, show a
 * monogram (the first letter of the alt text) on the brand green gradient
 * instead of an error-style message box.
 */
export default function ContentImage({src, alt, className, loading = 'lazy', compact = false}: {src: string; alt: string; className?: string; loading?: 'lazy' | 'eager'; compact?: boolean}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const initial = alt.trim().slice(0, 1) || 'ক';
    return <span className={className} role="img" aria-label={alt} style={{display: 'grid', placeItems: 'center', width: '100%', height: '100%', minHeight: compact ? 36 : 120, background: 'linear-gradient(135deg,#052e27,#0b5545)', color: '#f4d47c', fontSize: compact ? 16 : 44, fontWeight: 800, textAlign: 'center'}}>{initial}</span>;
  }
  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailed(true)}/>;
}
