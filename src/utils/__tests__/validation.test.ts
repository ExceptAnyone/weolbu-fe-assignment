import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  validateEmail,
  validatePhone,
  validateName,
  validateNumber,
} from '../validation';

describe('validatePassword', () => {
  describe('성공 케이스', () => {
    it('영문 소문자 + 숫자 조합 (6자)', () => {
      const result = validatePassword('abc123');
      expect(result).toEqual({ ok: true });
    });

    it('영문 대문자 + 숫자 조합 (10자)', () => {
      const result = validatePassword('ABCDEFG123');
      expect(result).toEqual({ ok: true });
    });

    it('영문 소문자 + 대문자 조합', () => {
      const result = validatePassword('AbCdEf');
      expect(result).toEqual({ ok: true });
    });

    it('영문 소문자 + 대문자 + 숫자 조합', () => {
      const result = validatePassword('Abc123');
      expect(result).toEqual({ ok: true });
    });
  });

  describe('실패 케이스 - 빈 값', () => {
    it('빈 문자열', () => {
      const result = validatePassword('');
      expect(result).toEqual({ ok: false, reason: '비밀번호를 입력해주세요.' });
    });
  });

  describe('실패 케이스 - 길이', () => {
    it('5자 이하', () => {
      const result = validatePassword('Abc12');
      expect(result).toEqual({ ok: false, reason: '비밀번호는 6자 이상 10자 이하로 입력해주세요.' });
    });

    it('11자 이상', () => {
      const result = validatePassword('Abc12345678');
      expect(result).toEqual({ ok: false, reason: '비밀번호는 6자 이상 10자 이하로 입력해주세요.' });
    });
  });

  describe('실패 케이스 - 조합', () => {
    it('숫자만', () => {
      const result = validatePassword('123456');
      expect(result).toEqual({ ok: false, reason: '영문 소문자, 대문자, 숫자 중 2가지 이상을 조합해주세요.' });
    });

    it('영문 소문자만', () => {
      const result = validatePassword('abcdef');
      expect(result).toEqual({ ok: false, reason: '영문 소문자, 대문자, 숫자 중 2가지 이상을 조합해주세요.' });
    });

    it('영문 대문자만', () => {
      const result = validatePassword('ABCDEF');
      expect(result).toEqual({ ok: false, reason: '영문 소문자, 대문자, 숫자 중 2가지 이상을 조합해주세요.' });
    });
  });
});

describe('validateEmail', () => {
  describe('성공 케이스', () => {
    it('일반 이메일', () => {
      const result = validateEmail('test@example.com');
      expect(result).toEqual({ ok: true });
    });

    it('하위 도메인 포함', () => {
      const result = validateEmail('user@mail.example.com');
      expect(result).toEqual({ ok: true });
    });

    it('숫자 포함', () => {
      const result = validateEmail('user123@example.com');
      expect(result).toEqual({ ok: true });
    });
  });

  describe('실패 케이스', () => {
    it('빈 문자열', () => {
      const result = validateEmail('');
      expect(result).toEqual({ ok: false, reason: '이메일을 입력해주세요.' });
    });

    it('@ 없음', () => {
      const result = validateEmail('testexample.com');
      expect(result).toEqual({ ok: false, reason: '올바른 이메일 형식이 아닙니다.' });
    });

    it('도메인 없음', () => {
      const result = validateEmail('test@');
      expect(result).toEqual({ ok: false, reason: '올바른 이메일 형식이 아닙니다.' });
    });

    it('최상위 도메인 없음', () => {
      const result = validateEmail('test@example');
      expect(result).toEqual({ ok: false, reason: '올바른 이메일 형식이 아닙니다.' });
    });

    it('공백 포함', () => {
      const result = validateEmail('test @example.com');
      expect(result).toEqual({ ok: false, reason: '올바른 이메일 형식이 아닙니다.' });
    });
  });
});

describe('validatePhone', () => {
  describe('성공 케이스', () => {
    it('정상 형식', () => {
      const result = validatePhone('010-1234-5678');
      expect(result).toEqual({ ok: true });
    });

    it('다른 숫자 조합', () => {
      const result = validatePhone('010-9999-0000');
      expect(result).toEqual({ ok: true });
    });
  });

  describe('실패 케이스', () => {
    it('빈 문자열', () => {
      const result = validatePhone('');
      expect(result).toEqual({ ok: false, reason: '휴대폰 번호를 입력해주세요.' });
    });

    it('하이픈 없음', () => {
      const result = validatePhone('01012345678');
      expect(result).toEqual({ ok: false, reason: '010-0000-0000 형식으로 입력해주세요.' });
    });

    it('011로 시작', () => {
      const result = validatePhone('011-1234-5678');
      expect(result).toEqual({ ok: false, reason: '010-0000-0000 형식으로 입력해주세요.' });
    });

    it('중간 자리 5자리', () => {
      const result = validatePhone('010-12345-678');
      expect(result).toEqual({ ok: false, reason: '010-0000-0000 형식으로 입력해주세요.' });
    });

    it('뒷자리 3자리', () => {
      const result = validatePhone('010-1234-567');
      expect(result).toEqual({ ok: false, reason: '010-0000-0000 형식으로 입력해주세요.' });
    });
  });
});

describe('validateName', () => {
  describe('성공 케이스', () => {
    it('일반 이름', () => {
      const result = validateName('홍길동');
      expect(result).toEqual({ ok: true });
    });

    it('영문 이름', () => {
      const result = validateName('John Doe');
      expect(result).toEqual({ ok: true });
    });

    it('20자', () => {
      const result = validateName('a'.repeat(20));
      expect(result).toEqual({ ok: true });
    });

    it('1자', () => {
      const result = validateName('김');
      expect(result).toEqual({ ok: true });
    });
  });

  describe('실패 케이스', () => {
    it('빈 문자열', () => {
      const result = validateName('');
      expect(result).toEqual({ ok: false, reason: '이름을 입력해주세요.' });
    });

    it('공백만', () => {
      const result = validateName('   ');
      expect(result).toEqual({ ok: false, reason: '이름을 입력해주세요.' });
    });

    it('21자 이상', () => {
      const result = validateName('a'.repeat(21));
      expect(result).toEqual({ ok: false, reason: '이름은 20자 이하로 입력해주세요.' });
    });
  });
});

describe('validateNumber', () => {
  describe('성공 케이스', () => {
    it('정수', () => {
      const result = validateNumber(100);
      expect(result).toEqual({ ok: true });
    });

    it('소수', () => {
      const result = validateNumber(10.5);
      expect(result).toEqual({ ok: true });
    });

    it('최소값 경계', () => {
      const result = validateNumber(10, 10, 100);
      expect(result).toEqual({ ok: true });
    });

    it('최대값 경계', () => {
      const result = validateNumber(100, 10, 100);
      expect(result).toEqual({ ok: true });
    });

    it('범위 내', () => {
      const result = validateNumber(50, 10, 100);
      expect(result).toEqual({ ok: true });
    });
  });

  describe('실패 케이스 - 타입', () => {
    it('NaN', () => {
      const result = validateNumber(NaN);
      expect(result).toEqual({ ok: false, reason: '값은(는) 숫자여야 합니다.' });
    });

    it('커스텀 필드명', () => {
      const result = validateNumber(NaN, undefined, undefined, '가격');
      expect(result).toEqual({ ok: false, reason: '가격은(는) 숫자여야 합니다.' });
    });
  });

  describe('실패 케이스 - 최소값', () => {
    it('최소값 미만', () => {
      const result = validateNumber(5, 10);
      expect(result).toEqual({ ok: false, reason: '값은(는) 10 이상이어야 합니다.' });
    });

    it('커스텀 필드명 최소값', () => {
      const result = validateNumber(5, 10, undefined, '수강인원');
      expect(result).toEqual({ ok: false, reason: '수강인원은(는) 10 이상이어야 합니다.' });
    });
  });

  describe('실패 케이스 - 최대값', () => {
    it('최대값 초과', () => {
      const result = validateNumber(150, undefined, 100);
      expect(result).toEqual({ ok: false, reason: '값은(는) 100 이하여야 합니다.' });
    });

    it('커스텀 필드명 최대값', () => {
      const result = validateNumber(150, undefined, 100, '가격');
      expect(result).toEqual({ ok: false, reason: '가격은(는) 100 이하여야 합니다.' });
    });
  });
});
