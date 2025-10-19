'use client';

import { SignUpSchema } from '@/components/pages/platform/auth/schema/sign-up-schema';
import { useToast } from '@/hooks/custom/use-toast';
import { signUp } from '@/lib/auth/auth-client';
import { CreateUserConsentBodySchema } from '@/lib/hono/api/schema/user-consent-schema';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * 회원가입 훅
 * 약관 동의 정보는 회원가입 후 별도로 저장됩니다.
 */
export const useSignUp = () => {
  const toast = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (data: SignUpSchema) => {
    setIsPending(true);
    try {
      const { name, email, phoneNumber, password, termsAgreed, privacyAgreed, marketingAgreed } = data;
      const signUpName = name || email;

      // 1. 회원가입
      const res = await signUp.email({
        name: signUpName,
        email,
        password,
        phoneNumber
      });
      if (res.error) {
        switch (res.error.code) {
          case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
            toast.error('이미 존재하는 이메일입니다.');
            break;
          default:
            toast.error(res.error.message);
        }
        return res;
      }

      // 2. 약관 동의 정보 저장
      if (res.data?.user?.id) {
        try {
          const consentMap = {
            terms_of_service: termsAgreed,
            privacy_policy: privacyAgreed,
            marketing: marketingAgreed,
          };

          const consents = Object.entries(consentMap)
            .filter(([_, agreed]) => agreed)
            .map(([termsKey]) => ({ termsKey, agreed: true }));

          if (consents.length > 0) {
            const payload: CreateUserConsentBodySchema = {
              userId: res.data.user.id,
              consents,
            };

            await fetch('/api/user-consent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            });
          }
        } catch (error) {
          console.error('약관 동의 정보 저장 실패:', error);
        }
      }

      // 3. 회원가입 성공 및 리다이렉트
      router.push('/sign-in');

      return res;
    } finally {
      setIsPending(false);
    }
  };

  return { handleSubmit, isPending };
};
