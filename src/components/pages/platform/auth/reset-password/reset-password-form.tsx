'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResetPassword } from '@/hooks/pages/auth/platform/use-reset-password';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * 비밀번호 재설정 폼
 */
export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { handleSubmit, isLoading, error } = useResetPassword();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      return;
    }

    if (password !== passwordConfirm) {
      return;
    }

    const success = await handleSubmit(password, token);
    if (success) {
      setIsSuccess(true);
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push('/sign-in');
      }, 3000);
    }
  };

  // 토큰이 없는 경우
  if (!token) {
    return (
      <div className="bg-destructive/10 text-destructive space-y-4 rounded-lg p-6 text-center">
        <p className="text-sm">유효하지 않은 링크입니다.</p>
        <Button variant="outline" className="w-full" onClick={() => router.push('/forgot-password')}>
          비밀번호 찾기로 돌아가기
        </Button>
      </div>
    );
  }

  // 성공 메시지
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">비밀번호가 변경되었습니다</h3>
          <p className="text-muted-foreground text-sm">
            새로운 비밀번호로 로그인하실 수 있습니다.
            <br />
            잠시 후 로그인 페이지로 이동합니다.
          </p>
        </div>
      </div>
    );
  }

  // 폼
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 새 비밀번호 입력 */}
      <div className="space-y-2">
        <Label htmlFor="password">새 비밀번호</Label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="8자 이상 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
            className="pl-10"
          />
          <Lock className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-2">
        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
        <div className="relative">
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            minLength={8}
            disabled={isLoading}
            className="pl-10"
          />
          <Lock className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>

      {/* 비밀번호 불일치 경고 */}
      {password && passwordConfirm && password !== passwordConfirm && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
          비밀번호가 일치하지 않습니다.
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !password || !passwordConfirm || password !== passwordConfirm}
      >
        {isLoading ? '변경 중...' : '비밀번호 변경'}
      </Button>
    </form>
  );
};

