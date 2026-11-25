import React, { useState } from 'react';
import { ComponentIllustration } from './ComponentIllustration';
import { SchematicSymbol } from './SchematicSymbol';

interface ComponentImageProps {
  src: string;
  alt: string;
  componentId: string;
  className?: string;
}

export const ComponentImage: React.FC<ComponentImageProps> = ({
  src,
  alt,
  componentId,
  className = 'h-full w-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  if (src.startsWith('illustration:')) {
    return (
      <ComponentIllustration
        componentId={src.replace('illustration:', '')}
        className={className}
      />
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 dark:bg-[#0F172A] p-4 text-slate-500 dark:text-slate-400">
        <SchematicSymbol componentId={componentId} className="h-20 w-36" />
        <span className="mt-2 text-xs font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
