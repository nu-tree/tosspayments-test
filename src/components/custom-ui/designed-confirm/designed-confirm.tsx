'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDesignedConfirmStore } from './designed-confirm.hook';

export const DesignedConfirm = () => {
  const isOpened = useDesignedConfirmStore((state) => state.isOpened);
  const message = useDesignedConfirmStore((state) => state.message);
  const confirmButtonText = useDesignedConfirmStore((state) => state.confirmButtonText);
  const close = useDesignedConfirmStore((state) => state.close);
  const onCancel = useDesignedConfirmStore((state) => state.onCancel);
  const onConfirm = useDesignedConfirmStore((state) => state.onConfirm);

  const cancelAction = () => {
    if (onCancel) onCancel();
    close();
  };

  const confirmAction = () => {
    if (onConfirm) onConfirm();
    close();
  };

  return (
    <AlertDialog open={isOpened}>
      <AlertDialogContent className="w-[calc(100vw_-_2rem)] rounded-md">
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row justify-end gap-x-2 sm:space-x-0">
          <AlertDialogCancel className="mt-0" asChild>
            <Button
              className="border-secondary-foreground text-secondary-foreground"
              variant={'outline'}
              onClick={cancelAction}
            >
              닫기
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction className="" asChild>
            <Button className="" variant={'secondary'} onClick={confirmAction}>
              {confirmButtonText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
