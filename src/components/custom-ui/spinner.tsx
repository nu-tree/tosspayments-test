import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type Props = React.HTMLAttributes<HTMLElement> & {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children?: ReactNode;
  centered?: boolean;
};

export const Spinner = ({ className, children, size = 'md', centered = true, ...props }: Readonly<Props>) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'xs':
        return 'h-4 w-4';
      case 'sm':
        return 'h-6 w-6';
      case 'md':
        return 'h-8 w-8';
      case 'lg':
        return 'h-12 w-12';
      case 'xl':
        return 'h-16 w-16';
      default:
        return 'h-8 w-8';
    }
  };

  const spinnerElement = (
    <div
      className={cn('animate-spin rounded-full border-4', getSizeClass(size))}
      style={{
        borderColor: 'var(--gray-25)',
        borderTopColor: 'var(--primary-50)',
      }}
    />
  );

  if (!centered) {
    return (
      <div className={cn('WF__SPINNER', className)} {...props}>
        {spinnerElement}
        {children && <span className="mt-2 text-gray-500">{children}</span>}
      </div>
    );
  }

  return (
    <div className={cn('WF__SPINNER flex h-full w-full flex-col items-center justify-center', className)} {...props}>
      {spinnerElement}
      {children && <span className="mt-2 text-gray-500">{children}</span>}
    </div>
  );
};
