'use client';

import { User, ChevronDown, ChevronRight, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

type UserDropdownProps = {
  userName: string;
  userEmail?: string;
  userRole?: string;
};

/**
 * 사용자 드롭다운 메뉴
 * 사용자 정보와 함께 마이페이지, 신청/관심 행사, 구독 채널, 로그아웃 메뉴 제공
 * 관리자인 경우 관리자 바로가기 메뉴도 표시
 */
export const UserDropdown = ({ userName, userEmail, userRole }: Readonly<UserDropdownProps>) => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
        onError: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{userName}님</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {/* 사용자 정보 영역 */}
        <div className="px-3 py-2">
          <div className="font-semibold text-sm flex items-center gap-1">
            <span>{userName}님</span>
          </div>
          {userEmail && (
            <div className="text-xs text-purple-600 mt-1">{userEmail}</div>
          )}
          <div
            className="text-xs text-gray-600 mt-1 cursor-pointer hover:text-gray-800"
            onClick={() => router.push('/mypage/edit')}
          >
            내 정보 수정 <ChevronRight className="inline h-3 w-3" />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* 메뉴 항목들 */}
        <DropdownMenuItem onClick={() => router.push('/mypage/applications')} className="px-3 py-2">
          <span>신청 행사</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/mypage/favorite-event')} className="px-3 py-2">
          <span>관심 행사</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/mypage/subscriptions')} className="px-3 py-2">
          <span>구독 채널</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 로그아웃 */}
        <DropdownMenuItem onClick={handleLogout} className="px-3 py-2 text-red-600 focus:text-red-600">
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

