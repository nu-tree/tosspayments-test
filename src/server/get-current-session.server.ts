import 'server-only';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const getCurrentSession = async () => {
  const res = await auth.api.getSession({
    headers: await headers(),
  });
  if (!res) return { ok: false, error: { message: '세션이 존재하지 않습니다.' } };
  return { ok: true, data: res };
};
