import React, { useState } from 'react';
import { ProductIllustration } from './ProductIllustration';

interface ProductImageProps {
  src?: string;
  name: string;
  category?: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  name,
  category,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  // If no src or error occurred, render custom bespoke illustration
  if (!src || hasError) {
    return (
      <ProductIllustration
        name={name}
        category={category}
        className={className}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      <img
        src={src}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover transition-transform duration-200"
      />
    </div>
  );
};
