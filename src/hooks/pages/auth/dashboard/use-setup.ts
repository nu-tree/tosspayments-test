'use client';

import { SetupAdminSchema } from '@/components/pages/dashboard/auth/schema/setup-admin-schema';
import { useToast } from '@/hooks/custom/use-toast';
import { signUp } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';

export const useSetup = () => {
  const toast = useToast();
  const router = useRouter();
  const handleSubmit = async (data: SetupAdminSchema) => {
    const { name, email, password, phoneNumber } = data;
    const signUpName = name || email;
    const res = await signUp.email({ name: signUpName, email, password, phoneNumber });
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    router.push('/setup/owner-organization');
    return res;
  };

  return { handleSubmit };
};
