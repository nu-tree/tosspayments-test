import Link from 'next/link';
import { Suspense } from 'react';
import { ResetPasswordForm } from './reset-password-form';
import { ResetPasswordHeader } from './reset-password-header';

/**
 * 비밀번호 재설정 페이지 컨테이너
 */
export const ResetPasswordContainer = () => {
  return (
    <div className="mx-auto w-full max-w-lg">
      {/* 비밀번호 재설정 카드 */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-lg">
        <div className="p-6 sm:p-8 lg:p-10">
          {/* 헤더 */}
          <ResetPasswordHeader />

          {/* 비밀번호 재설정 폼 */}
          <Suspense fallback={<div className="text-center">로딩 중...</div>}>
            <ResetPasswordForm />
          </Suspense>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm lg:mt-8">
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              ← 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
