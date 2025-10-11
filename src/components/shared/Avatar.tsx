import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center overflow-hidden ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'User'}
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`${iconSizes[size]} text-white`} />
      )}
    </div>
  );
}
