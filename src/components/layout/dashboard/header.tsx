'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/auth-client';

export function Header() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length === 0) {
      return [{ label: '대시보드', href: '/admin' }];
    }

    return [
      { label: '대시보드', href: '/admin' },
      ...paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;

        let label = path;
        switch (path) {
          case 'admin':
            label = '';
            break;
          case 'members':
            label = '회원관리';
            break;
          case 'boards':
            label = '게시판관리';
            break;
          case 'inquiry-meta':
            label = '문의 게시판 관리';
            break;
          case 'inquiry':
            label = '문의 관리';
            break;
          case 'posts':
            label = '게시물관리';
            break;
          case 'banners':
            label = '배너관리';
            break;
          case 'popups':
            label = '팝업관리';
            break;
          case 'settings':
            label = '사이트설정';
            break;
          case 'terms-setting':
            label = '약관설정';
            break;
          case 'organizations':
            label = '조직관리';
            break;
          case 'menu-manage':
            label = '메뉴관리';
            break;
          case 'add':
            label = '추가';
            break;
          default:
            label = '상세보기';
        }

        return { label, href };
      }),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  const handleClickLogOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = '/admin/sign-in';
        },
        onError: () => {
          window.location.href = '/admin/sign-in';
        },
      },
    });
  };

  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="flex h-[var(--header-height)] items-center justify-between px-6">
        <SidebarTrigger className="cursor-pointer" />
        <Breadcrumb className="max-sm:hidden">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && crumb.label && <BreadcrumbSeparator />}
                {crumb.label && (
                  <div className="flex items-center">
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </div>
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleClickLogOut}
            variant="outline"
            size="icon"
            className="text-destructive outline-destructive/30 border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
