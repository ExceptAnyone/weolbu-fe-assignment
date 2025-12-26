import { useState, FormEvent, useCallback, useMemo, ChangeEvent } from 'react';

// Input 이벤트 또는 직접 값을 받을 수 있는 타입
type ChangeHandler<T> =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  | T;

// useForm 훅 설정 타입
interface UseFormConfig<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  onSubmit: (values: T) => void | Promise<void>;
}

// useForm 훅 반환 타입
interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;

  // Field 핸들러
  handleChange: <K extends keyof T>(field: K) => (value: ChangeHandler<T[K]>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: FormEvent) => void;

  // 헬퍼 메서드
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;

  // 유틸리티
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    onChange: (e: ChangeHandler<T[K]>) => void;
    onBlur: () => void;
  };
}

/**
 * 폼 상태 관리를 위한 커스텀 훅
 *
 * @example
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (values) => {
 *     const errors = {};
 *     if (!values.email) errors.email = '이메일을 입력하세요';
 *     return errors;
 *   },
 *   onSubmit: (values) => console.log(values),
 * });
 *
 * <input {...form.getFieldProps('email')} />
 */
export function useForm<T extends object>({
  initialValues,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  onSubmit,
}: UseFormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 필드 검증
  const validateField = useCallback(
    (field: keyof T, value: unknown) => {
      if (!validate) return;

      const newErrors = validate({ ...values, [field]: value } as T);
      setErrors((prev) => ({
        ...prev,
        [field]: newErrors[field] || '',
      }));
    },
    [validate, values]
  );

  // 필드 값 변경
  const handleChange = useMemo(
    () =>
      <K extends keyof T>(field: K) =>
      (value: ChangeHandler<T[K]>) => {
        // 이벤트 객체인 경우 value 추출
        const actualValue =
          value && typeof value === 'object' && 'target' in value ? value.target.value : value;

        setValues((prev) => ({ ...prev, [field]: actualValue }));

        if (validateOnChange && touched[field]) {
          validateField(field, actualValue);
        }
      },
    [validateOnChange, touched, validateField]
  );

  // 필드 블러
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      if (validateOnBlur) {
        validateField(field, values[field]);
      }
    },
    [validateOnBlur, values, validateField]
  );

  // 폼 제출
  const handleSubmit = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();

      // 모든 필드를 touched로 표시
      const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);

      // 전체 검증
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);

        // 에러가 있으면 중단
        if (Object.keys(newErrors).some((key) => newErrors[key as keyof T])) {
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  // 필드 값 직접 설정
  const setFieldValue = useMemo(
    () =>
      <K extends keyof T>(field: K, value: T[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  // 필드 에러 직접 설정
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // getFieldProps: Input 컴포넌트에 바로 spread 가능
  const getFieldProps = useMemo(
    () =>
      <K extends keyof T>(field: K) => ({
        value: values[field],
        onChange: (e: ChangeHandler<T[K]>) => handleChange(field)(e),
        onBlur: handleBlur(field),
      }),
    [values, handleChange, handleBlur]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    getFieldProps,
  };
}
