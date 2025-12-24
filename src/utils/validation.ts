import { ValidationResult } from '@/domains/auth/types/auth.types';

/**
 * 비밀번호 검증
 * - 최소 6자 이상, 최대 10자 이하
 * - 영문 소문자, 영문 대문자, 숫자 중 최소 2가지 이상 조합
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { ok: false, reason: '비밀번호를 입력해주세요.' };
  }

  if (password.length < 6 || password.length > 10) {
    return { ok: false, reason: '비밀번호는 6자 이상 10자 이하로 입력해주세요.' };
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const typeCount = [hasLowerCase, hasUpperCase, hasNumber].filter(Boolean).length;

  if (typeCount < 2) {
    return {
      ok: false,
      reason: '영문 소문자, 대문자, 숫자 중 2가지 이상을 조합해주세요.',
    };
  }

  return { ok: true };
}

/**
 * 이메일 검증
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { ok: false, reason: '이메일을 입력해주세요.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, reason: '올바른 이메일 형식이 아닙니다.' };
  }

  return { ok: true };
}

/**
 * 휴대폰 번호 검증
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { ok: false, reason: '휴대폰 번호를 입력해주세요.' };
  }

  // 010-XXXX-XXXX 형식
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  if (!phoneRegex.test(phone)) {
    return { ok: false, reason: '010-0000-0000 형식으로 입력해주세요.' };
  }

  return { ok: true };
}

/**
 * 이름 검증
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === '') {
    return { ok: false, reason: '이름을 입력해주세요.' };
  }

  if (name.length > 20) {
    return { ok: false, reason: '이름은 20자 이하로 입력해주세요.' };
  }

  return { ok: true };
}

/**
 * 숫자 검증 (가격, 인원 등)
 */
export function validateNumber(
  value: number,
  min?: number,
  max?: number,
  fieldName = '값'
): ValidationResult {
  if (isNaN(value)) {
    return { ok: false, reason: `${fieldName}은(는) 숫자여야 합니다.` };
  }

  if (min !== undefined && value < min) {
    return { ok: false, reason: `${fieldName}은(는) ${min} 이상이어야 합니다.` };
  }

  if (max !== undefined && value > max) {
    return { ok: false, reason: `${fieldName}은(는) ${max} 이하여야 합니다.` };
  }

  return { ok: true };
}
