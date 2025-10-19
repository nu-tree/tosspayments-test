export enum DateType {
  DATE = '년월일',
  TIME = '시간',
  DATE_TIME = '년월일-시간',
  MD_TIME = '월일-시간',
}

/**
 * NOTE: ISO 날짜를 한국식으로 변환
 *
 * - DATE: "2025년 09월 18일"
 * - TIME: "오전 11시 45분 09초"
 * - DATE_TIME: "2025년 09월 18일 오전 11시 45분 09초"
 * - MD_TIME: "09월 18일 오전 11시 45분 09초"
 */
export function dateFormat(isoString: string | Date, type: DateType = DateType.DATE_TIME): string {
  if (typeof isoString === 'string') {
    isoString = new Date(isoString);
  }
  const date = new Date(isoString);

  // 한국 시간대 보정
  const koreaDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

  const pad = (n: number) => n.toString().padStart(2, '0');

  const yyyy = koreaDate.getFullYear();
  const mm = pad(koreaDate.getMonth() + 1);
  const dd = pad(koreaDate.getDate());

  const hh = koreaDate.getHours();
  const mi = pad(koreaDate.getMinutes());
  const ss = pad(koreaDate.getSeconds());

  // 오전/오후 구분
  const ampm = hh >= 12 ? '오후' : '오전';
  const hh12 = pad(hh % 12 === 0 ? 12 : hh % 12);

  switch (type) {
    case DateType.DATE:
      return `${yyyy}년 ${mm}월 ${dd}일`;

    case DateType.TIME:
      return `${ampm} ${hh12}시 ${mi}분 ${ss}초`;

    case DateType.DATE_TIME:
      return `${yyyy}년 ${mm}월 ${dd}일 ${ampm} ${hh12}시 ${mi}분 ${ss}초`;

    case DateType.MD_TIME:
      return `${mm}월 ${dd}일 ${ampm} ${hh12}시 ${mi}분 ${ss}초`;

    default:
      return isoString.toISOString();
  }
}
