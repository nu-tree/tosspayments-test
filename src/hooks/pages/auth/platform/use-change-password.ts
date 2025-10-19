'use client';

import { useState } from 'react';
import { changePassword } from '@/lib/auth/auth-client';

/**
 * 비밀번호 변경 훅
 * 현재 비밀번호와 새 비밀번호를 사용하여 비밀번호를 변경
 */
export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setError('');
    setIsLoading(true);

    try {
      const res = await changePassword({
        currentPassword: oldPassword,
        newPassword,
      });

      if (res.error) {
        switch (res.error.code) {
          case 'INVALID_PASSWORD':
            setError('현재 비밀번호가 일치하지 않습니다.');
            break;
          default:
            setError(res.error.message || '비밀번호 변경에 실패했습니다.');
        }
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return true;
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      setIsLoading(false);
      return false;
    }
  };

  return {
    handleChangePassword,
    isLoading,
    error,
  };
};
