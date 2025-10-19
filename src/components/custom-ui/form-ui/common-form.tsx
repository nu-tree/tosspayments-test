'use client';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { UseFormReturn, SubmitErrorHandler, FieldValues, useFormState, FieldError } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type Props<T extends FieldValues> = React.HTMLAttributes<HTMLFormElement> & {
  handleSubmit: (data: T) => void;
  onInvalid?: SubmitErrorHandler<T>;
  formInstance: UseFormReturn<T>;
};

export const CommonForm = <T extends FieldValues>({
  className,
  handleSubmit,
  onInvalid = console.error,
  formInstance,
  children,
  ...props
}: Readonly<Props<T>>) => {
  // 실시간으로 formState를 감지
  const { errors, isSubmitted } = useFormState({ control: formInstance.control });
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form {...formInstance}>
      <form
        className={cn('space-y-6', className)}
        onSubmit={formInstance.handleSubmit(handleSubmit, onInvalid)}
        {...props}
      >
        {children}

        {/* 폼 하단에 첫 번째 에러 메시지만 표시 - submit 시도 후에만 표시 */}
        {isSubmitted && hasErrors && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">
                {(Object.values(errors)[0] as FieldError)?.message || '입력값을 확인해주세요'}
              </span>
            </AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
};
