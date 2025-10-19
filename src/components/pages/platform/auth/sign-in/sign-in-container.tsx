import Link from 'next/link';
import { SignInForm } from './sign-in-form';
import { SignInHeader } from './sign-in-header';
import { SignInSocialButtons } from './sign-in-social-buttons';

/**
 * 로그인 페이지 컨테이너
 */
export const SignInContainer = () => {
  return (
    <div className="mx-auto w-full max-w-lg">
      {/* 로그인 카드 */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-lg">
        <div className="p-6 sm:p-8 lg:p-10">
          {/* 헤더 */}
          <SignInHeader />

          {/* 소셜 로그인 */}
          <SignInSocialButtons />

          {/* 구분선 */}
          <div className="relative my-6 lg:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card text-muted-foreground px-4">또는</span>
            </div>
          </div>

          {/* 이메일 로그인 폼 */}
          <SignInForm />

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center text-sm lg:mt-8">
            <span className="text-muted-foreground">계정이 없으신가요?</span>{' '}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 정보 */}
      <p className="text-muted-foreground mt-8 text-center text-xs">
        로그인하시면{' '}
        <Link href="/terms" className="hover:text-foreground underline">
          이용약관
        </Link>
        과{' '}
        <Link href="/privacy" className="hover:text-foreground underline">
          개인정보처리방침
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
};
