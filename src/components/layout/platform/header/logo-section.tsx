import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoSectionProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 헤더 로고 영역
 * 메인 로고와 부가 로고를 표시
 */
export const LogoSection = ({ className }: Readonly<LogoSectionProps>) => {
  return (
    <div className={cn('flex items-center gap-6', className)}>
      <Link href="/" className="w-[150px] transition-opacity hover:opacity-80 sm:w-[200px]">
        <Image src="/logo.png" alt="Meetica" width={200} height={40} className="aspect-[5/1] object-contain" priority />
      </Link>
    </div>
  );
};
