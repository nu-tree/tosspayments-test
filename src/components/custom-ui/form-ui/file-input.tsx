import React, { useRef } from 'react';
import { FieldValues, Path, PathValue, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { asyncConfirm } from '@/components/custom-ui/designed-confirm/designed-confirm.hook';

type Props<T extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  'name' | 'type' | 'accept' | 'multiple'
> & {
  name: Path<T>; // react-hook-form의 필드명
  label: string; // 라벨 텍스트
  className?: string;
  accept?: string; // 허용할 파일 타입 (MIME 타입)
  multiple?: boolean; // 다중 파일 선택 허용 여부
  schema: z.ZodType<T>; // Zod 스키마 (타입 검증용)
  maxSize?: number; // 파일 최대 크기 (MB 단위)
  maxCount?: number; // 최대 파일 개수
  allowTypes?: string[]; // 허용할 파일 확장자 배열
};

export const FileInput = <T extends FieldValues>({
  name,
  label,
  className,
  accept = '*/*',
  multiple = false,
  maxSize,
  maxCount,
  allowTypes,
  ...props
}: Props<T>) => {
  const form = useFormContext<T>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 파일 확장자를 카테고리별로 분류하여 사용자 친화적인 텍스트로 변환
   *
   * @param allowTypes - 허용할 파일 확장자 배열
   * @returns 카테고리별로 분류된 텍스트 배열
   */
  const getFileTypeCategories = (allowTypes: string[]): string[] => {
    const categories: string[] = [];
    const allTypes = allowTypes.join(',').toLowerCase();

    // 이미지 파일 확인
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
    if (imageTypes.some((type) => allTypes.includes(type))) {
      categories.push('이미지 파일');
    }

    // 문서 파일 확인
    const documentTypes = ['pdf', 'doc', 'docx', 'hwp', 'hwpx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];
    if (documentTypes.some((type) => allTypes.includes(type))) {
      categories.push('문서 파일');
    }

    // 압축 파일 확인
    const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
    if (archiveTypes.some((type) => allTypes.includes(type))) {
      categories.push('압축 파일');
    }

    return categories;
  };

  /**
   * 파일 유효성 검사 함수
   * 파일 크기, 확장자 등을 검증하여 오류 메시지를 반환
   *
   * @param file - 검사할 파일 객체
   * @returns 오류 메시지 (유효하면 null)
   */
  const validateFile = (file: File): string | null => {
    // 파일 크기 검사 (MB 단위)
    if (maxSize) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return `파일 크기가 ${maxSize}MB를 초과합니다. (현재: ${fileSizeMB.toFixed(2)}MB)`;
      }
    }

    // 파일 확장자 검사
    if (allowTypes && allowTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const allowedTypes = allowTypes.join(',').toLowerCase().split(',');

      if (fileExtension && !allowedTypes.includes(fileExtension)) {
        return `허용되지 않는 파일 형식입니다. (허용: ${allowTypes.join(', ')})`;
      }
    }

    return null;
  };

  /**
   * 파일 선택 이벤트 핸들러
   * 선택된 파일들의 유효성을 검사하고 폼 값을 업데이트
   *
   * @param event - 파일 input의 change 이벤트
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // 다중 파일 모드에서 파일 개수 제한 검사
    if (multiple && maxCount) {
      const currentFiles = (form.getValues(name) as File[]) || [];
      if (currentFiles.length + fileArray.length > maxCount) {
        form.setError(name, {
          type: 'manual',
          message: `최대 ${maxCount}개까지 첨부할 수 있습니다.`,
        });
        return;
      }
    }

    // 각 파일에 대한 유효성 검사
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        form.setError(name, {
          type: 'manual',
          message: error,
        });
        return;
      }
    }

    // 유효성 검사 통과 시 에러 클리어 및 값 설정
    form.clearErrors(name);

    if (multiple) {
      // 다중 파일: 기존 파일들에 새 파일들 추가
      const currentFiles = (form.getValues(name) as File[]) || [];
      const updatedFiles = [...currentFiles, ...fileArray];
      form.setValue(name, updatedFiles as PathValue<T, Path<T>>);
    } else {
      // 단일 파일: 첫 번째 파일만 선택
      form.setValue(name, fileArray[0] as PathValue<T, Path<T>>);
    }
  };

  /**
   * 파일 제거 핸들러
   * 다중 파일 모드에서는 특정 인덱스의 파일을, 단일 파일 모드에서는 전체 파일을 제거
   *
   * @param indexToRemove - 제거할 파일의 인덱스 (다중 파일 모드에서만 사용)
   */
  const handleRemoveFile = async (indexToRemove?: number) => {
    const confirmed = await asyncConfirm('삭제하시겠습니까?', { buttonText: '삭제' });
    if (!confirmed) return;
    if (multiple && typeof indexToRemove === 'number') {
      // 다중 파일: 특정 인덱스의 파일 제거
      const currentFiles = form.getValues(name) as (File | string)[];

      // currentFiles가 배열인지 확인
      if (Array.isArray(currentFiles)) {
        const updatedFiles = currentFiles.filter((_, index) => index !== indexToRemove);

        // 빈 배열이면 undefined로, 아니면 배열로 설정
        form.setValue(name, (updatedFiles.length > 0 ? updatedFiles : []) as PathValue<T, Path<T>>);
      }
    } else {
      // 단일 파일: 전체 파일 제거
      form.setValue(name, undefined as any);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    // 파일 제거 시 관련 에러 클리어
    form.clearErrors(name);
  };

  /**
   * 파일 선택 버튼 클릭 핸들러
   * 숨겨진 파일 input을 클릭하여 파일 선택 대화상자 열기
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 파일명 길이 제한 함수
   * 긴 파일명을 지정된 길이로 줄이고 확장자는 유지
   *
   * @param fileName - 원본 파일명
   * @param maxLength - 최대 허용 길이 (기본값: 30)
   * @returns 잘린 파일명
   */
  const truncateFileName = (fileName: string, maxLength: number = 60) => {
    if (!fileName) return '';
    if (fileName?.length <= maxLength) return fileName;

    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncatedName = nameWithoutExt.substring(0, maxLength - extension!.length - 4);

    return `${truncatedName}...${extension}`;
  };

  /**
   * 허용된 파일 타입을 기반으로 accept 속성 값 생성
   * allowTypes가 있으면 해당 확장자들을, 없으면 기본 accept 값 사용
   *
   * @returns HTML input의 accept 속성 값
   */
  const getAcceptProp = () => {
    if (allowTypes && allowTypes.length > 0) {
      return allowTypes.map((type) => `.${type}`).join(',');
    }
    return accept;
  };

  /**
   * URL에서 파일명을 추출하는 함수
   * URL 형식: https://example.com/숫자-파일명.확장자
   *
   * @param url - 파일 URL
   * @returns 파일명.확장자
   */
  const extractFileNameFromUrl = (url: string): string => {
    try {
      const fileName = url.split('/').pop() || '';
      const nameWithoutPrefix = fileName.replace(/^\d+-/, '');
      return nameWithoutPrefix;
    } catch {
      return url;
    }
  };

  /**
   * 파일명을 안전하게 가져오는 함수
   * File 객체면 name 속성을, URL 문자열이면 파일명을 추출
   *
   * @param file - File 객체 또는 URL 문자열
   * @returns 파일명
   */
  const getFileName = (file: File | string): string => {
    // 파일이 문자열(URL)인 경우 파일명 추출
    if (typeof file === 'string') {
      return extractFileNameFromUrl(file);
    }
    // 파일이 문자열 배열인 경우 첫 번째 문자열의 파일명 추출
    if (Array.isArray(file) && typeof file[0] === 'string') {
      return extractFileNameFromUrl(file[0]);
    }
    // File이 배열인 경우 첫 번째 파일의 이름 반환
    if (Array.isArray(file) && file[0] instanceof File) {
      return file[0]?.name || '';
    }
    return file.name;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {/* 파일 제한 정보를 라벨에 표시 */}
            {(maxSize || (maxCount && multiple)) && (
              <span className="ml-2 text-sm text-gray-500">
                {maxSize && `개당 최대 ${maxSize}MB`}
                {maxCount && multiple && ` | 최대 ${maxCount}개`}
              </span>
            )}
          </FormLabel>
          <FormControl>
            <div className="space-y-2">
              {/* 파일 선택 버튼과 숨겨진 input */}
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" onClick={handleButtonClick} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  파일 선택
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptProp()}
                  multiple={multiple}
                  onChange={handleFileSelect}
                  className="hidden"
                  {...props}
                />
              </div>

              {/* 파일 제한 정보 안내 텍스트 */}
              {allowTypes && allowTypes.length > 0 && (
                <div className="text-xs text-gray-500">허용 형식: {getFileTypeCategories(allowTypes).join(', ')}</div>
              )}

              {/* 선택된 파일들 표시 영역 */}
              {field.value &&
                (Array.isArray(field.value) ? field.value.length > 0 : true) &&
                (multiple
                  ? Array.isArray(field.value) && field.value.length > 0
                  : field.value !== undefined && field.value !== null) && (
                  <div className="space-y-1">
                    {multiple
                      ? // 다중 파일 표시
                        Array.isArray(field.value) &&
                        (field.value as (File | string)[]).map((file, index) => {
                          const fileName = getFileName(file);
                          return (
                            <FileDisplay
                              key={`${index}-${fileName}`}
                              fileName={fileName}
                              onClick={() => handleRemoveFile(index)}
                            >
                              {truncateFileName(fileName)}
                            </FileDisplay>
                          );
                        })
                      : // 단일 파일 표시
                        (() => {
                          const fileName = getFileName(field.value as File | string);
                          return (
                            <FileDisplay fileName={fileName} onClick={() => handleRemoveFile()}>
                              {truncateFileName(fileName)}
                            </FileDisplay>
                          );
                        })()}
                  </div>
                )}
            </div>
          </FormControl>
          {/* 폼 유효성 검사 에러 메시지 표시 */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const FileDisplay = ({
  fileName,
  onClick,
  children,
}: {
  fileName: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between rounded border bg-gray-50 p-2 text-sm">
      <span className="mr-2 flex-1 truncate" title={fileName}>
        {children}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="size-6 p-0 hover:bg-gray-200"
        title="파일 제거"
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};
