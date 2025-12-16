
'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function Poster({
  src,
  alt,
  width = 300,
  height = 450,
  className = ''
}: Props) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-800 text-gray-300 text-sm ${className}`}
        style={{ width, height }}
      >
        нет постера
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}
