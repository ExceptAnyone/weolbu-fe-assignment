import { describe, it, expect } from 'vitest';
import { formatNumber, formatPrice, formatPhone } from '../format';

describe('formatNumber', () => {
  it('천 단위 콤마', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('백만 단위 콤마', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('0', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('작은 숫자 (콤마 없음)', () => {
    expect(formatNumber(999)).toBe('999');
  });

  it('소수점', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });

  it('음수', () => {
    expect(formatNumber(-5000)).toBe('-5,000');
  });
});

describe('formatPrice', () => {
  it('기본 가격', () => {
    expect(formatPrice(10000)).toBe('10,000원');
  });

  it('백만원', () => {
    expect(formatPrice(1000000)).toBe('1,000,000원');
  });

  it('0원', () => {
    expect(formatPrice(0)).toBe('0원');
  });

  it('작은 금액', () => {
    expect(formatPrice(500)).toBe('500원');
  });
});

describe('formatPhone', () => {
  describe('정상 포맷팅', () => {
    it('11자리 숫자 → 010-XXXX-XXXX', () => {
      expect(formatPhone('01012345678')).toBe('010-1234-5678');
    });

    it('다른 번호', () => {
      expect(formatPhone('01099990000')).toBe('010-9999-0000');
    });
  });

  describe('부분 입력', () => {
    it('3자리 이하', () => {
      expect(formatPhone('010')).toBe('010');
    });

    it('4-7자리 → 010-XXXX', () => {
      expect(formatPhone('01012')).toBe('010-12');
      expect(formatPhone('0101234')).toBe('010-1234');
    });

    it('8-10자리 → 010-XXXX-XXX', () => {
      expect(formatPhone('01012345')).toBe('010-1234-5');
      expect(formatPhone('010123456')).toBe('010-1234-56');
      expect(formatPhone('0101234567')).toBe('010-1234-567');
    });
  });

  describe('숫자 추출', () => {
    it('하이픈 포함 → 제거 후 포맷팅', () => {
      expect(formatPhone('010-1234-5678')).toBe('010-1234-5678');
    });

    it('공백 포함', () => {
      expect(formatPhone('010 1234 5678')).toBe('010-1234-5678');
    });

    it('괄호 포함', () => {
      expect(formatPhone('(010)1234-5678')).toBe('010-1234-5678');
    });

    it('알파벳 포함', () => {
      expect(formatPhone('010abc1234def5678')).toBe('010-1234-5678');
    });
  });

  describe('11자리 제한', () => {
    it('12자리 → 11자리로 제한', () => {
      expect(formatPhone('010123456789')).toBe('010-1234-5678');
    });

    it('15자리 → 11자리로 제한', () => {
      expect(formatPhone('010123456789012')).toBe('010-1234-5678');
    });
  });

  describe('엣지 케이스', () => {
    it('빈 문자열', () => {
      expect(formatPhone('')).toBe('');
    });

    it('1자리', () => {
      expect(formatPhone('0')).toBe('0');
    });

    it('2자리', () => {
      expect(formatPhone('01')).toBe('01');
    });

    it('숫자 없음 (문자만)', () => {
      expect(formatPhone('abc')).toBe('');
    });

    it('특수문자만', () => {
      expect(formatPhone('---')).toBe('');
    });
  });
});
