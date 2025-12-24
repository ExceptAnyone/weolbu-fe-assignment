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
