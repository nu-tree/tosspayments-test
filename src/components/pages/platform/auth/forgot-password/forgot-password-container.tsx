import Link from 'next/link';
import { ForgotPasswordForm } from './forgot-password-form';
import { ForgotPasswordHeader } from './forgot-password-header';

/**
 * 비밀번호 찾기 페이지 컨테이너
 */
export const ForgotPasswordContainer = () => {
  return (
    <div className="mx-auto w-full max-w-lg">
      {/* 비밀번호 찾기 카드 */}
      <div className="bg-card text-card-foreground rounded-lg border shadow-lg">
        <div className="p-6 sm:p-8 lg:p-10">
          {/* 헤더 */}
          <ForgotPasswordHeader />

          {/* 비밀번호 찾기 폼 */}
          <ForgotPasswordForm />

          {/* 로그인 링크 */}
          <div className="mt-6 text-center text-sm lg:mt-8">
            <Link href="/sign-in" className="text-primary hover:underline font-medium">
              ← 로그인으로 돌아가기
            </Link>
          </div>
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="bg-muted/50 mt-6 rounded-lg p-4">
        <p className="text-muted-foreground text-sm">
          <strong className="text-foreground">도움말:</strong>
          <br />
          가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
          <br />
          이메일이 도착하지 않으면 스팸 메일함을 확인해주세요.
        </p>
      </div>
    </div>
  );
};
