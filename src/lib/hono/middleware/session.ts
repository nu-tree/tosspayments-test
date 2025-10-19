import { auth } from '@/lib/auth';
import { Context, Next } from 'hono';

export const session = async (c: Context, next: Next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  c.set('user', session ? session.user : null);
  c.set('session', session ? session.session : null);
  return next();
};
