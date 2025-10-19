import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      {/* 왼쪽: 브랜드 이미지 영역 (데스크톱만 표시) */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          src="https://placehold.co/1920x1080/6366f1/white?text=Meetica"
          alt="Meetica Brand"
          className="h-full w-full object-cover object-center"
          priority
          width={1920}
          height={1080}
        />
      </div>

      {/* 오른쪽: 콘텐츠 영역 */}
      <ScrollArea className="h-screen w-full flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex h-full min-h-screen flex-col items-center justify-center px-0 py-4 sm:px-4 sm:py-12">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
