/**
 * 숫자를 천 단위 콤마로 포맷팅
 * @example formatNumber(1000) => "1,000"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 가격을 원화 형식으로 포맷팅
 * @example formatPrice(10000) => "10,000원"
 */
export function formatPrice(price: number): string {
  return `${formatNumber(price)}원`;
}

/**
 * 전화번호를 010-XXXX-XXXX 형식으로 포맷팅
 * @param value - 입력된 전화번호 (숫자만 또는 하이픈 포함)
 * @returns 포맷팅된 전화번호
 * @example
 * formatPhone('01012341234') => '010-1234-1234'
 * formatPhone('010-123') => '010-123'
 */
export function formatPhone(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, '');

  // 최대 11자리로 제한
  const limited = numbers.slice(0, 11);

  // 포맷팅 적용
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 7) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 7)}-${limited.slice(7)}`;
  }
}
