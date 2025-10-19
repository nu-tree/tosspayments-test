'use server';

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

// 상수 정의
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits

/**
 * 환경변수에서 암호화 키를 가져오거나 기본값 사용
 */
function getKey(): string {
  return process.env.CRYPTO_KEY || 'default-secret-key-32-chars-long!';
}

/**
 * 환경변수에서 솔트를 가져오거나 기본값 사용
 */
function getSalt(): string {
  return process.env.CRYPTO_SALT || 'default-salt-16-chars';
}

/**
 * 키를 생성합니다 (PBKDF2 스타일)
 */
async function deriveKey(password: string, salt: string): Promise<Buffer> {
  const key = await scryptAsync(password, salt, KEY_LENGTH) as Buffer;
  return key;
}

/**
 * 데이터를 암호화합니다
 */
export async function encrypt(data: string): Promise<string> {
  try {
    const password = getKey();
    const salt = getSalt();

    // 키 생성
    const key = await deriveKey(password, salt);

    // IV 생성
    const iv = randomBytes(IV_LENGTH);

    // 암호화 객체 생성
    const cipher = createCipheriv(ALGORITHM, key, iv);

    // 데이터 암호화
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // 인증 태그 가져오기
    const tag = cipher.getAuthTag();

    // 결과 조합: salt:iv:tag:encrypted
    const result = `${salt}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;

    return result;
  } catch (error) {
    console.error('암호화 실패:', error);
    throw new Error('데이터 암호화에 실패했습니다.');
  }
}

/**
 * 데이터를 복호화합니다
 */
export async function decrypt(encryptedData: string): Promise<string> {
  try {
    const password = getKey();

    // 데이터 분리: salt:iv:tag:encrypted
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
      throw new Error('잘못된 암호화 형식입니다.');
    }

    const [salt, ivHex, tagHex, encrypted] = parts;

    // 키 생성
    const key = await deriveKey(password, salt);

    // IV와 태그 복원
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    // 복호화 객체 생성
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // 데이터 복호화
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('복호화 실패:', error);
    throw new Error('데이터 복호화에 실패했습니다.');
  }
}

/**
 * 간단한 해시 생성 (비밀번호용이 아닌 데이터 무결성 검증용)
 */
export async function createHash(data: string): Promise<string> {
  const { createHash: cryptoCreateHash } = await import('crypto');
  return cryptoCreateHash('sha256').update(data).digest('hex');
}

/**
 * 랜덤 문자열 생성
 */
export async function generateRandomString(length: number = 32): Promise<string> {
  return randomBytes(length).toString('hex');
}

/**
 * 랜덤 토큰 생성 (URL 안전)
 */
export async function generateToken(length: number = 32): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  const randomBytesArray = randomBytes(length);

  for (let i = 0; i < length; i++) {
    result += chars[randomBytesArray[i] % chars.length];
  }

  return result;
}
