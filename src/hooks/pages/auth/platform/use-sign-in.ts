'use client';

import { SignInSchema } from '@/components/pages/platform/auth/schema/sign-in-schema';
import { useToast } from '@/hooks/custom/use-toast';
import { signIn } from '@/lib/auth/auth-client';

export const useSignIn = () => {
  const toast = useToast();
  const handleSubmit = async (data: SignInSchema) => {
    const { email, password } = data;
    const res = await signIn.email({ email, password, callbackURL: '/dashboard' });
    if (res.error) {
      switch (res.error.code) {
        case 'INVALID_EMAIL_OR_PASSWORD':
          toast.error('이메일 또는 비밀번호가 일치하지 않습니다.');
          break;
        default:
          toast.error(res.error.message);
      }
    }
    return res;
  };

  return { handleSubmit };
};
