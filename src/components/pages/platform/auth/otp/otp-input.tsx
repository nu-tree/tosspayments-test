'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useVerifyOTP } from '@/hooks/pages/auth/use-verify-otp';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  email: string;
  value: string;
  onChange: (value: string) => void;
  onVerified?: () => void;
  isVerified?: boolean;
};

export const OTPInput = ({ email, value, onChange, onVerified, isVerified = false }: Props) => {
  const { mutateAsync, isPending } = useVerifyOTP();

  const handleVerify = async () => {
    if (value.length !== 6) return;

    try {
      await mutateAsync({ email, code: value });
      onVerified?.();
    } catch (error) {
      // 에러는 훅에서 처리
      onChange(''); // 실패 시 코드 초기화
    }
  };

  return (
    <div className="space-y-4">
      {isVerified ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-3 text-primary">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">이메일 인증이 완료되었습니다!</span>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              인증 코드 <span className="text-destructive">*</span>
            </label>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={value}
                onChange={onChange}
                disabled={isPending}
                onComplete={handleVerify}
              >
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`
                        h-12 w-12 rounded-lg border-2 text-center text-lg font-mono font-bold transition-all
                        ${value[index]
                          ? 'border-primary bg-primary/5 text-foreground'
                          : 'border-muted-foreground/20 bg-background text-foreground hover:border-primary/50'
                        }
                      `}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              이메일로 발송된 6자리 인증 코드를 입력해주세요 (영문자 + 숫자)
            </p>
          </div>

          {value.length === 6 && (
            <Button type="button" onClick={handleVerify} disabled={isPending} className="w-full">
              {isPending ? '인증 중...' : '인증 확인'}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

