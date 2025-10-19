import { cn } from '@/lib/utils';
import React from 'react';

type IconButtonWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const IconButtonWrapper = ({ children, className, ...props }: Readonly<IconButtonWrapperProps>) => {
  return (
    <div
      className={cn(
        'flex h-full cursor-pointer items-center justify-center gap-2 rounded-lg p-2 transition-all hover:bg-gray-100',
        '[&[data-state=on]]:border-blue-200 [&[data-state=on]]:bg-blue-50',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
