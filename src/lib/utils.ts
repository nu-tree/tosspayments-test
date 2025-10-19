import { clsx, type ClassValue } from 'clsx';
import { twMerge } from './twmerge-extension/twmerge-extension';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isServer = typeof window === 'undefined';

export function orUndefined<T>(value: T, condition: () => boolean = () => !!value) {
  return condition() ? (value as NonNullable<T>) : undefined;
}

/**
 * NOTE 딜레이 함수
 * @param ms 딜레이 시간 (밀리초)
 * @returns Promise
 */
export async function wf__delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * INFO 눈에 띄는 콘솔 log
 *
 * NOTE 사용자에게 보여줘야하는 정보출력에는 사용하지 마세요
 *
 * @param message 콘솔 로그 메시지
 * @param params 콘솔 로그 파라미터 (string | object | any)
 * @param type 로그 타입 ('log' | 'error' | 'warn' | 'info')
 */
export function wf__console(
  message: string,
  params?: string | object | any,
  type: 'log' | 'error' | 'warn' | 'info' = 'log',
) {
  if (process.env.NODE_ENV !== 'development') return;

  // type별 스타일 매핑
  const styles: Record<string, string> = {
    log: 'color: #fff; background-color: #333; font-size: 14px; padding: 3px; border-radius: 5px;',
    error: 'color: #fff; background-color: #ff0000; font-size: 14px; padding: 3px; border-radius: 5px;',
    warn: 'color: #000; background-color: #ffc107; font-size: 14px; padding: 3px; border-radius: 5px;',
    info: 'color: #fff; background-color: #007bff; font-size: 14px; padding: 3px; border-radius: 5px;',
  };

  const style = styles[type] || styles.log;

  if (params !== undefined) {
    if (typeof params === 'object' && params !== null) {
      console.log('%c' + message, style);
      console.table(params);
    } else {
      console[type]('%c' + message, style, params);
    }
  } else {
    console[type]('%c' + message, style);
  }
}

export function getPlaceholderImage(width: number, height: number) {
  return `https://placehold.co/${width}x${height}/png`;
}
