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
import { useForm } from '@/hooks/useForm';

interface SignupFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export function SignupForm() {
  const { mutate: signup, isPending } = useSignup();

  const form = useForm<SignupFormValues>({
    initialValues: {
      email: '',
      password: '',
      name: '',
      phone: '',
      role: 'STUDENT',
    },
    validateOnBlur: true,
    validate: (values) => {
      const errors: Partial<Record<keyof SignupFormValues, string>> = {};

      const emailValidation = validateEmail(values.email);
      if (!emailValidation.ok) errors.email = emailValidation.reason;

      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.ok) errors.password = passwordValidation.reason;

      const nameValidation = validateName(values.name);
      if (!nameValidation.ok) errors.name = nameValidation.reason;

      const phoneValidation = validatePhone(values.phone);
      if (!phoneValidation.ok) errors.phone = phoneValidation.reason;

      return errors;
    },
    onSubmit: (values) => {
      signup(values);
    },
  });

  // 가입 버튼 활성화 조건
  const isFormValid =
    form.values.email &&
    form.values.password &&
    form.values.name &&
    form.values.phone &&
    !Object.keys(form.errors).some((key) => form.errors[key as keyof SignupFormValues]);

  return (
    <Form onSubmit={form.handleSubmit}>
      <Title>회원가입</Title>

      <Fieldset>
        <Legend>기본 정보</Legend>
        <FormFields>
          <Input
            type="text"
            label="이름"
            {...form.getFieldProps('name')}
            placeholder="이름을 입력하세요"
            error={form.touched.name ? form.errors.name : ''}
          />

          <Input
            type="email"
            label="이메일"
            {...form.getFieldProps('email')}
            placeholder="example@email.com"
            error={form.touched.email ? form.errors.email : ''}
          />

          <PhoneInput
            label="휴대폰 번호"
            value={form.values.phone}
            onChange={(value) => form.handleChange('phone')(value)}
            onBlur={form.handleBlur('phone')}
            error={form.touched.phone ? form.errors.phone : ''}
            placeholder="010-0000-0000"
          />

          <PasswordInput
            value={form.values.password}
            onChange={(value) => form.handleChange('password')(value)}
            error={form.touched.password ? form.errors.password : ''}
          />

          <UserTypeSelector
            value={form.values.role}
            onChange={(value) => form.setFieldValue('role', value)}
          />
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
