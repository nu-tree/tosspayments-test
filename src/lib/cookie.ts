'use server';

import { cookies } from 'next/headers';
// import { CryptoService } from '@/server/service/crypto/crypto.service';

type Cookie = {
  key: string;
  value: string;
};

export async function setEncryptedCookie(data: Cookie[], path: string) {
  const store = await cookies();

  for (const { key, value } of data) {
    store.set(key, value, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      path: path,
      maxAge: 60 * 60 * 24,
    });
  }
}

export async function getDecryptedCookie(key: Cookie['key']) {
  const store = await cookies();
  const encryptedValue = store.get(key)?.value || null;

  return encryptedValue;
}

export async function deleteCookie(key: Cookie['key']) {
  const store = await cookies();
  store.delete(key);
}
