import { cn } from '@/lib/utils';
import React from 'react';

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export const IconButton = ({ children, className, ...props }: Readonly<IconButtonProps>) => {
  return (
    <span
      className={cn(
        'flex size-4 items-center text-gray-500 transition-colors hover:text-gray-900',
        '[&[data-state=on]]:text-blue-600',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};
