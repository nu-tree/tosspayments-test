'use client';

import { useState } from 'react';
import { getSignedUploadUrl } from './s3-service.action';
import { tryCatch } from '@/lib/try-catch';

/**
 * @description 파일 업로드 훅
 * @returns {
 *  handleUpload: 파일 업로드 함수
 *  isLoading: 로딩 상태
 *  error: 에러 상태
 * }
 */
export const useS3 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    const { data: uploadedUrl, error } = await tryCatch(async () => {
      const { uploadUrl, uploadedUrl } = await getSignedUploadUrl(file.name);

      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      return uploadedUrl;
    });

    setError(error);
    setIsLoading(false);

    return uploadedUrl;
  };

  return {
    handleUpload,
    isLoading,
    error,
  };
};
