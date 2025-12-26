import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';
import { ChangeEvent } from 'react';

describe('useForm', () => {
  describe('초기화', () => {
    it('초기값을 올바르게 설정한다', () => {
      const initialValues = { email: 'test@example.com', password: '123456' };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        })
      );

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('handleChange', () => {
    it('필드 값을 변경한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '', password: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleChange('email')('new@example.com');
      });

      expect(result.current.values.email).toBe('new@example.com');
    });

    it('이벤트 객체를 받아서 값을 추출한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          onSubmit: vi.fn(),
        })
      );

      const mockEvent = {
        target: { value: 'event@example.com' },
      } as ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleChange('email')(mockEvent);
      });

      expect(result.current.values.email).toBe('event@example.com');
    });

    it('validateOnChange가 true이고 필드가 touched일 때 검증을 실행한다', () => {
      const validate = vi.fn(() => ({}));
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate,
          validateOnChange: true,
          onSubmit: vi.fn(),
        })
      );

      // 먼저 필드를 touch
      act(() => {
        result.current.handleBlur('email')();
      });

      // 값 변경
      act(() => {
        result.current.handleChange('email')('test@example.com');
      });

      expect(validate).toHaveBeenCalled();
    });

    it('validateOnChange가 false이면 검증을 실행하지 않는다', () => {
      const validate = vi.fn(() => ({}));
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate,
          validateOnChange: false,
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleChange('email')('test@example.com');
      });

      expect(validate).not.toHaveBeenCalled();
    });
  });

  describe('handleBlur', () => {
    it('필드를 touched로 표시한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleBlur('email')();
      });

      expect(result.current.touched.email).toBe(true);
    });

    it('validateOnBlur가 true일 때 검증을 실행한다', () => {
      const validate = vi.fn(() => ({}));
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate,
          validateOnBlur: true,
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleBlur('email')();
      });

      expect(validate).toHaveBeenCalled();
    });

    it('validateOnBlur가 false이면 검증을 실행하지 않는다', () => {
      const validate = vi.fn(() => ({}));
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate,
          validateOnBlur: false,
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleBlur('email')();
      });

      expect(validate).not.toHaveBeenCalled();
    });
  });

  describe('검증 (validate)', () => {
    it('검증 함수가 에러를 반환하면 errors에 설정한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate: (values) => {
            const errors: { email?: string } = {};
            if (!values.email) {
              errors.email = '이메일을 입력하세요';
            }
            return errors;
          },
          validateOnBlur: true,
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleBlur('email')();
      });

      expect(result.current.errors.email).toBe('이메일을 입력하세요');
    });

    it('검증이 통과하면 에러를 제거한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate: (values) => {
            const errors: { email?: string } = {};
            if (!values.email) {
              errors.email = '이메일을 입력하세요';
            }
            return errors;
          },
          validateOnBlur: true,
          onSubmit: vi.fn(),
        })
      );

      // 먼저 에러 발생
      act(() => {
        result.current.handleBlur('email')();
      });
      expect(result.current.errors.email).toBe('이메일을 입력하세요');

      // 값을 입력하고 다시 blur
      act(() => {
        result.current.handleChange('email')('test@example.com');
      });
      act(() => {
        result.current.handleBlur('email')();
      });

      expect(result.current.errors.email).toBe('');
    });
  });

  describe('handleSubmit', () => {
    it('폼 제출 시 onSubmit을 호출한다', async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: 'test@example.com' },
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('폼 제출 시 모든 필드를 touched로 표시한다', async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '', password: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.handleSubmit();
      });

      expect(result.current.touched.email).toBe(true);
      expect(result.current.touched.password).toBe(true);
    });

    it('검증 에러가 있으면 onSubmit을 호출하지 않는다', async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          validate: (values) => {
            const errors: { email?: string } = {};
            if (!values.email) {
              errors.email = '이메일을 입력하세요';
            }
            return errors;
          },
          onSubmit,
        })
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors.email).toBe('이메일을 입력하세요');
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('setFieldValue', () => {
    it('필드 값을 직접 설정한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '', password: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.setFieldValue('email', 'direct@example.com');
      });

      expect(result.current.values.email).toBe('direct@example.com');
    });
  });

  describe('setFieldError', () => {
    it('필드 에러를 직접 설정한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          onSubmit: vi.fn(),
        })
      );

      act(() => {
        result.current.setFieldError('email', '커스텀 에러 메시지');
      });

      expect(result.current.errors.email).toBe('커스텀 에러 메시지');
    });
  });

  describe('resetForm', () => {
    it('폼을 초기 상태로 리셋한다', () => {
      const initialValues = { email: '', password: '' };
      const { result } = renderHook(() =>
        useForm({
          initialValues,
          onSubmit: vi.fn(),
        })
      );

      // 값 변경, 에러 설정, touched 설정
      act(() => {
        result.current.handleChange('email')('test@example.com');
        result.current.setFieldError('password', '에러');
        result.current.handleBlur('email')();
      });

      // 리셋
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.values).toEqual(initialValues);
      expect(result.current.errors).toEqual({});
      expect(result.current.touched).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('getFieldProps', () => {
    it('필드에 필요한 props를 반환한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: 'test@example.com' },
          onSubmit: vi.fn(),
        })
      );

      const fieldProps = result.current.getFieldProps('email');

      expect(fieldProps.value).toBe('test@example.com');
      expect(typeof fieldProps.onChange).toBe('function');
      expect(typeof fieldProps.onBlur).toBe('function');
    });

    it('getFieldProps의 onChange가 값을 변경한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          onSubmit: vi.fn(),
        })
      );

      const fieldProps = result.current.getFieldProps('email');

      act(() => {
        fieldProps.onChange('new@example.com');
      });

      expect(result.current.values.email).toBe('new@example.com');
    });

    it('getFieldProps의 onBlur가 필드를 touched로 표시한다', () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '' },
          onSubmit: vi.fn(),
        })
      );

      const fieldProps = result.current.getFieldProps('email');

      act(() => {
        fieldProps.onBlur();
      });

      expect(result.current.touched.email).toBe(true);
    });
  });

  describe('복합 시나리오', () => {
    it('실제 폼 사용 흐름을 시뮬레이션한다', async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues: { email: '', password: '' },
          validate: (values) => {
            const errors: { email?: string; password?: string } = {};
            if (!values.email) errors.email = '이메일을 입력하세요';
            if (!values.password) errors.password = '비밀번호를 입력하세요';
            if (values.password && values.password.length < 6) {
              errors.password = '비밀번호는 6자 이상이어야 합니다';
            }
            return errors;
          },
          validateOnBlur: true,
          onSubmit,
        })
      );

      // 1. 빈 상태에서 제출 시도 -> 실패
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(onSubmit).not.toHaveBeenCalled();
      expect(result.current.errors.email).toBe('이메일을 입력하세요');
      expect(result.current.errors.password).toBe('비밀번호를 입력하세요');

      // 2. 이메일 입력
      act(() => {
        result.current.handleChange('email')('test@example.com');
      });
      act(() => {
        result.current.handleBlur('email')();
      });
      expect(result.current.errors.email).toBe('');

      // 3. 짧은 비밀번호 입력
      act(() => {
        result.current.handleChange('password')('123');
      });
      act(() => {
        result.current.handleBlur('password')();
      });
      expect(result.current.errors.password).toBe('비밀번호는 6자 이상이어야 합니다');

      // 4. 올바른 비밀번호 입력
      act(() => {
        result.current.handleChange('password')('123456');
      });
      act(() => {
        result.current.handleBlur('password')();
      });
      expect(result.current.errors.password).toBe('');

      // 5. 제출 성공
      await act(async () => {
        await result.current.handleSubmit();
      });
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: '123456',
      });
    });
  });
});
