import { avatarStyles, type AvatarSize } from './avatar.styles';
import { Icon } from '../icon';

export type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  className?: string;
};

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const isFallback = !src;

  return (
    <div role="img" aria-label={alt} className={avatarStyles({ size, className, isFallback })}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <Icon name="user" className="h-2/3 w-2/3" />
      )}
    </div>
  );
}
