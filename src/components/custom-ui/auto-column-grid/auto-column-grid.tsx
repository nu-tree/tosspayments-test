import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  children?: React.ReactNode;
  maxColSize?: string;
  gap?: string;
  maxColCount?: string;
  gridAutoType?: 'auto-fit' | 'auto-fill';
};

/**
 * style을 직접 적용하는 것이 아니라, 클래스를 추가하여 스타일을 적용합니다.
 * NOTE globals.css 등에 스타일이 반듯이 필요함
 */

export const AutoColumnGrid = ({
  className,
  children,
  maxColSize,
  gap,
  maxColCount,
  gridAutoType,
}: Readonly<Props>) => {
  return (
    <article
      className={cn('grid-auto-columns', className)}
      style={
        {
          '--grid-max-col-size': maxColSize ?? '100%',
          '--grid-gap': gap ?? '0rem',
          '--grid-max-col-count': maxColCount ?? '1',
          '--grid-auto-type': gridAutoType ?? 'auto-fit',
        } as React.CSSProperties
      }
    >
      {children}
    </article>
  );
};
