'use client';

import { avatarStyles, type AvatarSize } from './avatar.styles';
import { Icon } from '../icon';

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  // const [hasError, setHasError] = useState(false);
  // const [prevSrc, setPrevSrc] = useState(src);

  // if (src !== prevSrc) {
  //   setPrevSrc(src);
  //   setHasError(false);
  // }

  // const showFallback = !src;

  return (
    <div
      role="img"
      aria-label={alt}
      className={avatarStyles({ size, className, isFallback: !src })}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Icon name="user" className="h-2/3 w-2/3" />
      )}
    </div>
  );
}
