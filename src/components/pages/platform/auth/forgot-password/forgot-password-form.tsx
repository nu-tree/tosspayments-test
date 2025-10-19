'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword } from '@/hooks/pages/auth/platform/use-forgot-password';
import { Mail, CheckCircle2 } from 'lucide-react';

/**
 * 비밀번호 찾기 폼
 */
export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const { handleSubmit, isLoading, error } = useForgotPassword();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit(email);
    if (success) {
      setIsSuccess(true);
    }
  };

  // 성공 메시지
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">이메일을 확인해주세요</h3>
          <p className="text-muted-foreground text-sm">
            <strong className="text-foreground">{email}</strong>
            <br />
            위 주소로 비밀번호 재설정 링크를 보내드렸습니다.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setEmail('');
            setIsSuccess(false);
          }}
        >
          다른 이메일로 재시도
        </Button>
      </div>
    );
  }

  // 폼
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* 이메일 입력 */}
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="example@meetica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="pl-10"
          />
          <Mail className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">{error}</div>
      )}

      {/* 제출 버튼 */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '전송 중...' : '비밀번호 재설정 링크 받기'}
      </Button>
    </form>
  );
};
