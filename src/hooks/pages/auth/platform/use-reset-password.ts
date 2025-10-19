'use client';

import { useState } from 'react';
import { resetPassword } from '@/lib/auth/auth-client';

/**
 * 비밀번호 재설정 훅
 */
export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (newPassword: string, token: string): Promise<boolean> => {
    setError('');
    setIsLoading(true);

    try {
      const res = await resetPassword({
        newPassword,
        token,
      });

      if (res.error) {
        setError(res.error.message || '비밀번호 재설정에 실패했습니다.');
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
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

