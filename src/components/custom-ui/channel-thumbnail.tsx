import Image from 'next/image';
import { cn } from '@/lib/utils';

type ChannelThumbnailProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

/**
 * 채널 썸네일을 표시하는 컴포넌트
 * 썸네일이 없을 경우 채널 이름 기반으로 생성된 기본 아바타를 표시합니다.
 */
export function ChannelThumbnail({ src, alt, width, height, className }: ChannelThumbnailProps) {
  // 썸네일이 없으면 DiceBear API를 사용하여 기본 아바타 생성
  const defaultSrc = src || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(alt)}&backgroundColor=6366f1,8b5cf6,ec4899,f59e0b,10b981`;

  return (
    <Image
      src={defaultSrc}
      alt={alt}
      width={width || 30}
      height={height || 30}
      className={cn(className, !src && 'bg-gray-100')}
    />
  );
}

