import { useMutation } from '@tanstack/react-query';
import { fetchClient } from '@/utils/fetch-client';
import { useToast } from '@/hooks/custom/use-toast';

type SendOTPParams = {
  email: string;
};

/**
 * OTP 발송 훅
 */
export function useSendOTP() {
  const toast = useToast();

  return useMutation({
    mutationFn: async ({ email }: SendOTPParams) => {
      const result = await fetchClient('/api/otp/send', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!result.ok) {
        throw new Error(result.error.message);
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('인증 코드가 발송되었습니다.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'OTP 발송에 실패했습니다.');
    },
  });
}

