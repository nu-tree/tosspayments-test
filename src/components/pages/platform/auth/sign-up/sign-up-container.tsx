import Link from 'next/link';
import { SignUpForm } from './sign-up-form';
import { SignUpHeader } from './sign-up-header';

/**
 * 회원가입 페이지 컨테이너
 */
export const SignUpContainer = () => {
  return (
    <div className="mx-auto w-full max-w-lg">
      {/* 회원가입 카드 */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-lg">
        <div className="p-6 sm:p-8 lg:p-10">
          {/* 헤더 */}
          <SignUpHeader />

          {/* 구분선 */}
          <div className="relative my-6 lg:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card text-muted-foreground px-4">또는</span>
            </div>
          </div>

          {/* 이메일 회원가입 폼 */}
          <SignUpForm />

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm lg:mt-8">
            <span className="text-muted-foreground">이미 계정이 있으신가요?</span>{' '}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 정보 */}
      <p className="text-muted-foreground mt-8 text-center text-xs">
        회원가입하시면{' '}
        <Link href="/terms" className="hover:text-foreground underline" target="_blank">
          이용약관
        </Link>
        ,{' '}
        <Link href="/privacy" className="hover:text-foreground underline" target="_blank">
          개인정보처리방침
        </Link>
        ,{' '}
        <Link href="/marketing" className="hover:text-foreground underline" target="_blank">
          마케팅 정보 수신 동의
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </div>
  );
};
