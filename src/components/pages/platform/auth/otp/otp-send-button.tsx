'use client';

import { Button } from '@/components/ui/button';
import { useSendOTP } from '@/hooks/pages/auth/use-send-otp';
import { useTimer } from 'react-timer-hook';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  email: string;
  onSent?: () => void;
  disabled?: boolean;
  isVerified?: boolean;
};

export const OTPSendButton = ({ email, onSent, disabled, isVerified }: Props) => {
  const { mutateAsync, isPending } = useSendOTP();

  const getExpiryTime = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 300); // 5분
    return time;
  };

  const { minutes, seconds, isRunning, restart, pause } = useTimer({
    expiryTimestamp: getExpiryTime(),
    autoStart: false,
  });

  useEffect(() => {
    // 컴포넌트 언마운트 시 타이머 정리
    return () => pause();
  }, [pause]);

  const handleSend = async () => {
    // 사용자 경험 개선: 즉시 타이머 시작 및 OTP 입력 표시
    restart(getExpiryTime(), true);
    onSent?.();

    // 백그라운드에서 이메일 발송
    try {
      await mutateAsync({ email });
    } catch (error) {
      // 에러 발생 시 타이머 중지
      pause();
    }
  };

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isDisabled = disabled || isPending || !email || !isValidEmail(email);

  const formatTime = (min: number, sec: number) => {
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const getButtonText = () => {
    if (isVerified) return '인증 완료';
    if (isRunning) return `재발송 (${formatTime(minutes, seconds)})`;
    return '인증 코드 발송';
  };

  return (
    <Button
      type="button"
      onClick={handleSend}
      disabled={isDisabled}
      variant={isVerified ? 'default' : 'outline'}
      className="whitespace-nowrap"
    >
      {isVerified && <CheckCircle2 className="mr-1.5 h-4 w-4" />}
      {getButtonText()}
    </Button>
  );
};

