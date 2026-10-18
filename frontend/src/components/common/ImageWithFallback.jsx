import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export const ImageWithFallback = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-square',
  fallbackIcon = ShoppingBag,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const FallbackIconComponent = fallbackIcon;

  if (hasError || !src) {
    return (
      <div
        className={`${aspectRatio} w-full bg-[#E9F0E7] flex flex-col items-center justify-center p-4 text-[#285943] select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#FFFFFF]/80 flex items-center justify-center shadow-xs mb-2">
          <FallbackIconComponent className="w-6 h-6 text-[#285943]" />
        </div>
        <span className="text-xs font-medium text-[#667168] text-center line-clamp-1 max-w-[85%]">
          {alt || 'Fresh Market'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#E9F0E7]/60 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#285943]/20 border-t-[#285943] animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};
