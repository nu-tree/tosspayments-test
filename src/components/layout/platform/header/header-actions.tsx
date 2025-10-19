import Link from 'next/link';
import { LogIn, Shield, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { UserDropdown } from './user-dropdown';

type HeaderActionsProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * 헤더 액션 버튼 영역
 * 로그인 상태에 따라 사용자 드롭다운 또는 로그인 버튼 표시
 */
export const HeaderActions = async ({ className }: Readonly<HeaderActionsProps>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {session ? (
        <>
          <UserDropdown
            userName={session.user.name || session.user.email}
            userEmail={session.user.email}
            userRole={session.user.role}
          />

          <Button variant="outline" size="sm" asChild className="gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
            <Link href="/host">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">호스트</span>
            </Link>
          </Button>

          {session.user.role === 'admin' && (
            <Button variant="outline" size="sm" asChild className="gap-2 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800">
              <Link href="/admin">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">관리자</span>
              </Link>
            </Button>
          )}
        </>
      ) : (
        <Button variant="default" size="sm" asChild className="gap-2">
          <Link href="/sign-in">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">로그인</span>
          </Link>
        </Button>
      )}
    </div>
  );
};
