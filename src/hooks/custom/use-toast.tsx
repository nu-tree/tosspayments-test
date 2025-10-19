import { ExternalToast, toast } from 'sonner';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '../use-mobile';

export function useToast() {
  const isMobile = useIsMobile();

  function error(message: React.ReactNode, data?: Omit<ExternalToast, 'id'>) {
    const id = nanoid();
    return toast.error(message, {
      id,
      position: isMobile ? 'bottom-right' : 'top-center',
      cancel: (
        <Button className="ml-auto font-semibold" variant="destructive" size="sm" onClick={() => toast.dismiss(id)}>
          닫기
        </Button>
      ),
      classNames: { toast: '!border-destructive/20 !bg-red-50 !text-destructive' },
      descriptionClassName: '!text-destructive/80',
      ...data,
    });
  }

  function success(message: React.ReactNode, data?: Omit<ExternalToast, 'id'>) {
    const id = nanoid();
    return toast.success(message, {
      id,
      position: isMobile ? 'bottom-right' : 'top-center',
      cancel: (
        <Button className="ml-auto font-semibold" variant="success" size="sm" onClick={() => toast.dismiss(id)}>
          닫기
        </Button>
      ),
      classNames: { toast: '!border-green-400 !bg-green-50 !text-green-800' },
      descriptionClassName: '!text-green-800',
      ...data,
    });
  }

  function warning(message: React.ReactNode, data?: Omit<ExternalToast, 'id'>) {
    const id = nanoid();
    return toast.warning(message, {
      id,
      position: isMobile ? 'bottom-right' : 'top-center',
      cancel: (
        <Button className="ml-auto font-semibold" variant="warning" size="sm" onClick={() => toast.dismiss(id)}>
          닫기
        </Button>
      ),
      classNames: { toast: '!border-yellow-400 !bg-yellow-50 !text-yellow-800' },
      descriptionClassName: '!text-yellow-800',
      ...data,
    });
  }

  function info(message: React.ReactNode, data?: Omit<ExternalToast, 'id'>) {
    const id = nanoid();
    return toast.info(message, {
      id,
      position: isMobile ? 'bottom-right' : 'top-center',
      cancel: (
        <Button className="ml-auto" variant="outline" size="sm" onClick={() => toast.dismiss(id)}>
          닫기
        </Button>
      ),
      ...data,
    });
  }

  return {
    error,
    success,
    warning,
    info,
  };
}
