import styled from '@emotion/styled';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useCreateCourse } from '../hooks/useCreateCourse';
import { validateNumber } from '@/utils/validation';
import { theme } from '@/styles/theme';
import { useCurrentUser } from '@/domains/user/context/UserContext';
import { useForm } from '@/hooks/useForm';

interface CourseFormValues {
  title: string;
  description: string;
  maxStudents: string;
  price: string;
}

export function CourseForm() {
  const { user } = useCurrentUser();
  const { mutate: createCourse, isPending } = useCreateCourse();

  const form = useForm<CourseFormValues>({
    initialValues: {
      title: '',
      description: '',
      maxStudents: '',
      price: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof CourseFormValues, string>> = {};

      if (!values.title || values.title.trim() === '') {
        errors.title = '강의명을 입력해주세요.';
      }

      const maxStudentsNum = Number(values.maxStudents);
      const maxStudentsValidation = validateNumber(maxStudentsNum, 1, 100, '최대 수강 인원');
      if (!maxStudentsValidation.ok) {
        errors.maxStudents = maxStudentsValidation.reason;
      }

      const priceNum = Number(values.price);
      const priceValidation = validateNumber(priceNum, 0, 1000000, '가격');
      if (!priceValidation.ok) {
        errors.price = priceValidation.reason;
      }

      return errors;
    },
    onSubmit: (values) => {
      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      createCourse({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
        instructorName: user.name,
        maxStudents: Number(values.maxStudents),
        price: Number(values.price),
      });
    },
  });

  // 등록 버튼 활성화 조건
  const isFormValid =
    form.values.title &&
    form.values.maxStudents &&
    form.values.price &&
    !Object.keys(form.errors).some((key) => form.errors[key as keyof CourseFormValues]);

  return (
    <Form onSubmit={form.handleSubmit}>
      <Title>강의 개설</Title>

      <Fieldset>
        <Legend>강의 정보</Legend>
        <FormFields>
          <Input
            type="text"
            label="강의명"
            {...form.getFieldProps('title')}
            placeholder="예) 너나위의 내집마련 기초반"
            error={form.touched.title ? form.errors.title : ''}
          />

          <Input
            type="text"
            label="강의 설명 (선택)"
            {...form.getFieldProps('description')}
            placeholder="강의에 대한 간단한 설명을 입력하세요"
          />

          <Input
            type="number"
            label="최대 수강 인원"
            {...form.getFieldProps('maxStudents')}
            placeholder="예) 10"
            error={form.touched.maxStudents ? form.errors.maxStudents : ''}
            min="1"
            max="100"
          />

          <Input
            type="number"
            label="가격 (원)"
            {...form.getFieldProps('price')}
            placeholder="예) 200000"
            error={form.touched.price ? form.errors.price : ''}
            min="0"
            max="1000000"
            helperText="백만원 이하로 입력하세요"
          />
        </FormFields>
      </Fieldset>

      <Button type="submit" fullWidth disabled={!isFormValid || isPending}>
        {isPending ? '등록 중...' : '등록하기'}
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
