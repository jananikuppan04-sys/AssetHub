import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-12 w-12 text-base',
};

export function UserAvatar({ name, src, size = 'md', className }: UserAvatarProps) {
  const initials = getInitials(name);
  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {src && <AvatarImage src={src} alt={name ?? 'User'} />}
      <AvatarFallback className="font-semibold">{initials}</AvatarFallback>
    </Avatar>
  );
}
