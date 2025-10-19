'use server';

import { headers } from 'next/headers';

export async function getIpAddress() {
  const header = await headers();

  const cfIp = header.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const xff = header.get('x-forwarded-for');
  const xffIp = xff?.split(',')[0].trim();
  if (xffIp) return xffIp;

  const remoteIp = header.get('x-real-ip');
  if (remoteIp) return remoteIp;

  return 'unknown';
}
