/**
 * NOTE 정규표현식 패턴들을 RegExp 객체로 정의
 *
 * 대표적인 정규식 패턴들을 정의
 */

const defaultPatterns: Record<string, RegExp> = {
  eng: /^[a-zA-Z]*$/, // 영문자만 (대소문자 구분 없음)
  korean: /^[가-힣]*$/, // 한글만
  num: /^[0-9]*$/, // 숫자만
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // 이메일 형식 (좀 더 정확한 패턴)
  phone: /^\d{2,3}-\d{3,4}-\d{4}$/, // 전화번호 형식 (000-0000-0000 또는 00-000-0000)
  jumin: /^\d{6}-[1-4]\d{6}$/, // 주민등록번호 형식 (000000-0000000) - 하이픈 앞뒤 공백 제거
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, // URL 형식
  creditCard: /^\d{4}-\d{4}-\d{4}-\d{4}$/, // 신용카드 번호 (0000-0000-0000-0000)
  businessNumber: /^\d{3}-\d{2}-\d{5}$/, // 사업자등록번호 (000-00-00000)

  /**
   * INFO 간단한 비밀번호
   * 허용 특수문자: !@#$%^&*
   */
  password: /^[a-zA-Z0-9!@#$%^&*]*$/,

  /**
   * INFO 강한 비밀번호: 12자 이상
   * 허용 특수문자: !@#$%^&*
   */
  passwordStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{12,}$/,
} as const;

const customPatterns: Record<string, RegExp> = {
  engNum: /^[a-zA-Z0-9]*$/, // 영문자 + 숫자 조합
  koreanEngNum: /^[가-힣a-zA-Z0-9]*$/, // 한글 + 영문 + 숫자
  engNumUnderscore: /^[a-zA-Z0-9_]+$/, // 영문자 + 숫자 + 언더스코어 (1글자 이상)
} as const;

export const REGEXP: Record<string, RegExp> = {
  ...defaultPatterns,
  ...customPatterns,
} as const;

/**
 * NOTE 정규식 체크
 *
 * 체크할 value와 정규식 정보를 전달하면 체크 결과를 true/false로 반환
 * @param value
 * @param pattern
 * @returns boolean
 */
export function regExpCheck(value: string, pattern: RegExp): boolean {
  return pattern.test(value);
}

/**
 * NOTE 문자열 정제(sanitize) 함수
 *
 * - 주어진 value에서 특정 정규식 패턴(허용 문자 클래스 기반)에 맞지 않는 문자들을 제거합니다.
 * - 지원하는 정규식 형태는 `/^[...]+$/` 또는 `/^[...]*$/` 입니다.
 *   (즉, 전체 문자열이 특정 문자 집합만으로 구성되어 있는지 확인하는 단순한 케이스)
 *
 * 예시:
 *   pattern: /^[a-zA-Z0-9_]+$/   // 영문, 숫자, 언더스코어만 허용
 *   value: "abc!@#123"
 *   결과: "abc123"               // 허용되지 않은 !@# 제거
 *
 * @param value   정제 대상 문자열
 * @param pattern /^[...]+$/ 형태의 정규식 (허용 문자 집합 기반)
 * @returns       허용된 문자만 남은 문자열
 */
export function regExpSanitize(value: string, pattern: RegExp): string {
  // 정규식 패턴 소스에서 문자 클래스([...]) 부분만 추출
  const m = pattern.source.match(/^\^\[([^\]]+)\]\+?\$$/);
  if (!m) {
    // 지원하지 않는 정규식 형태라면 원본 반환
    return value;
  }

  const inner = m[1]; // 대괄호 내부 추출 (예: a-zA-Z0-9_)
  const deny = new RegExp(`[^${inner}]`, 'g'); // 허용되지 않은 문자에 매칭
  return value.replace(deny, ''); // 불필요한 문자 제거 후 반환
}
