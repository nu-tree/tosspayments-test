'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDesignedAlertStore } from './designed-alert.hook';

export const DesignedAlert = () => {
  const isOpened = useDesignedAlertStore((state) => state.isOpened);
  const message = useDesignedAlertStore((state) => state.message);
  const buttonText = useDesignedAlertStore((state) => state.buttonText);
  const close = useDesignedAlertStore((state) => state.close);
  const onConfirm = useDesignedAlertStore((state) => state.onConfirm);

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
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className="" variant={'secondary'} onClick={confirmAction}>
              {buttonText}
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
