import { cn } from '@/lib/utils';

type Props = React.HTMLAttributes<HTMLElement>;

export const Header = ({ className }: Readonly<Props>) => {
  return <div className={cn('', className)}></div>;
};
