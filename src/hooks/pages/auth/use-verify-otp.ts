import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/utils/fetch-client';
import { useToast } from '@/hooks/custom/use-toast';

type VerifyOTPParams = {
  email: string;
  code: string;
};

/**
 * OTP 검증 훅
 */
export function useVerifyOTP() {
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ email, code }: VerifyOTPParams) => {
      const result = await fetchClient('/api/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('이메일 인증이 완료되었습니다!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'OTP 검증에 실패했습니다.');
    },
  });
}

