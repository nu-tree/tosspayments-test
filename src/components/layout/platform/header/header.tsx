import { cn } from '@/lib/utils';
import { LogoSection } from './logo-section';
import { HeaderActions } from './header-actions';

type HeaderProps = React.HTMLAttributes<HTMLElement>;

/**
 * 플랫폼 페이지의 메인 헤더 컴포넌트
 * - TopBar: 상단 정보 영역
 * - MainHeader: 로고 + 검색 + 액션 버튼
 * - GNB: 글로벌 네비게이션
 */
export const Header = ({ className }: Readonly<HeaderProps>) => {
  return (
    <header className={cn('bg-background sticky top-0 z-50 w-full border-b', className)}>
      {/* 상단 정보 바 */}

      {/* 메인 헤더 영역 */}
      <div className="border-border/40 border-b">
        <div className="container mx-auto flex h-(--header-height) items-center justify-between gap-4 px-4">
          <div className="flex flex-1 items-center gap-4">
            <LogoSection />
          </div>
          <HeaderActions />
        </div>

        <div className="container mx-auto mb-4 flex items-center justify-between gap-4 px-4 sm:hidden"> </div>
      </div>
    </header>
  );
};
