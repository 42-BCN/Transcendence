'use client';

import { useState } from 'react';
import { avatarStyles, type AvatarSize, avatarFallbackClasses } from './avatar.styles';
import { Icon } from '../icon';
import { cn } from '@/lib/styles/cn';

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const showFallback = !src || hasError;

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(avatarStyles({ size, className }), showFallback && avatarFallbackClasses)}
    >
      {showFallback ? (
        <Icon name="user" className="h-2/3 w-2/3" />
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
