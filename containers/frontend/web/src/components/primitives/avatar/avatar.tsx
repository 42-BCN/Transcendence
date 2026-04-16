'use client';

import { useState } from 'react';
import { avatarStyles, type AvatarSize } from './avatar.styles';
import { Icon } from '../icon';

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !src || hasError;

  return (
    <div className={avatarStyles({ size, className })}>
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center text-text-tertiary">
          <Icon name="user" className="h-2/3 w-2/3" />
        </div>
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
