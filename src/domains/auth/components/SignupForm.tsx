import { useState, FormEvent } from 'react';
import styled from '@emotion/styled';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { PhoneInput } from '@/components/common/PhoneInput';
import { PasswordInput } from './PasswordInput';
import { UserTypeSelector } from './UserTypeSelector';
import { useSignup } from '../hooks/useSignup';
import { UserRole } from '@/domains/user/types/user.types';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from '@/utils/validation';
import { theme } from '@/styles/theme';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: signup, isPending } = useSignup();

  // 실시간 필드 검증
  const validateField = (field: string, value: string) => {
    let result;
    switch (field) {
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        result = validatePassword(value);
        break;
      case 'name':
        result = validateName(value);
        break;
      case 'phone':
        result = validatePhone(value);
        break;
      default:
        return;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: result.ok ? '' : result.reason,
    }));
  };

  // 전체 폼 검증
  const validateForm = (): boolean => {
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const nameValidation = validateName(name);
    const phoneValidation = validatePhone(phone);

    const newErrors: Record<string, string> = {};

    if (!emailValidation.ok) newErrors.email = emailValidation.reason;
    if (!passwordValidation.ok) newErrors.password = passwordValidation.reason;
    if (!nameValidation.ok) newErrors.name = nameValidation.reason;
    if (!phoneValidation.ok) newErrors.phone = phoneValidation.reason;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    signup({
      email,
      password,
      name,
      phone,
      role,
    });
  };

  // 가입 버튼 활성화 조건: 모든 필드가 입력되고 에러가 없어야 함
  const isFormValid =
    email &&
    password &&
    name &&
    phone &&
    !errors.email &&
    !errors.password &&
    !errors.name &&
    !errors.phone;

  return (
    <Form onSubmit={handleSubmit}>
      <Title>회원가입</Title>

      <Fieldset>
        <Legend>기본 정보</Legend>
        <FormFields>
          <Input
            type="text"
            label="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => validateField('name', name)}
            placeholder="이름을 입력하세요"
            error={errors.name}
          />

          <Input
            type="email"
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateField('email', email)}
            placeholder="example@email.com"
            error={errors.email}
          />

          <PhoneInput
            value={phone}
            onChange={(value) => setPhone(value)}
            onBlur={() => validateField('phone', phone)}
            error={errors.phone}
            placeholder="010-0000-0000"
            label="휴대폰 번호"
          />

          <PasswordInput
            value={password}
            onChange={(value) => {
              setPassword(value);
              if (value) validateField('password', value);
            }}
            error={errors.password}
          />

          <UserTypeSelector value={role} onChange={setRole} />
        </FormFields>
      </Fieldset>

      <Button type="submit" fullWidth disabled={!isFormValid || isPending}>
        {isPending ? '가입 중...' : '가입하기'}
      </Button>
    </Form>
  );
}

const Form = styled.form`
  width: 100%;
  max-width: 480px;
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`;

const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
`;

const Legend = styled.legend`
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.md};
  padding: 0;
`;

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;
