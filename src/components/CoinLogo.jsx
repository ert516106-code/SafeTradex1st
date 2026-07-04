import { useState } from 'react';
import { COIN_LOGOS } from "../lib/coinLogos";

export default function CoinLogo({ symbol, size = 'md' }) {
  const [imgError, setImgError] = useState(false);
  const src = COIN_LOGOS[symbol?.toUpperCase()];
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  if (!src || imgError) {
    return (
      <div className={`${sizeClass} rounded-full ${getFallbackColor(symbol)} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold">{symbol?.[0] ?? '?'}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={symbol}
      onError={() => setImgError(true)}
      className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
    />
  );
}
