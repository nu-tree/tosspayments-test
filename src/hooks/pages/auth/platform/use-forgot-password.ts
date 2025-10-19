'use client';

import { useState } from 'react';
import { forgetPassword } from '@/lib/auth/auth-client';

/**
 * 비밀번호 찾기 훅
 */
export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (email: string): Promise<boolean> => {
    setError('');
    setIsLoading(true);

    try {
      const res = await forgetPassword({
        email,
        redirectTo: '/reset-password',
      });

      if (res.error) {
        setError(res.error.message || '이메일 전송에 실패했습니다.');
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
      return false;
    }
  };

  return {
    handleSubmit,
    isLoading,
    error,
  };
};
