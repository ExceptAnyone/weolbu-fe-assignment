import { useState, FormEvent } from 'react';
import styled from '@emotion/styled';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { useCreateCourse } from '../hooks/useCreateCourse';
import { validateNumber } from '@/utils/validation';
import { theme } from '@/styles/theme';
import { useCurrentUser } from '@/domains/user/context/UserContext';

export function CourseForm() {
  const { user } = useCurrentUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxStudents, setMaxStudents] = useState('');
  const [price, setPrice] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: createCourse, isPending } = useCreateCourse();

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title || title.trim() === '') {
      newErrors.title = '강의명을 입력해주세요.';
    }

    const maxStudentsNum = Number(maxStudents);
    const maxStudentsValidation = validateNumber(maxStudentsNum, 1, 100, '최대 수강 인원');
    if (!maxStudentsValidation.ok) {
      newErrors.maxStudents = maxStudentsValidation.reason;
    }

    const priceNum = Number(price);
    const priceValidation = validateNumber(priceNum, 0, 1000000, '가격');
    if (!priceValidation.ok) {
      newErrors.price = priceValidation.reason;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    createCourse({
      title: title.trim(),
      description: description.trim() || undefined,
      instructorName: user.name,
      maxStudents: Number(maxStudents),
      price: Number(price),
    });
  };

  // 등록 버튼 활성화 조건
  const isFormValid = title && maxStudents && price && !Object.keys(errors).length;

  return (
    <Form onSubmit={handleSubmit}>
      <Title>강의 개설</Title>

      <FormFields>
        <Input
          type="text"
          label="강의명"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예) 너나위의 내집마련 기초반"
          error={errors.title}
        />

        <Input
          type="text"
          label="강의 설명 (선택)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="강의에 대한 간단한 설명을 입력하세요"
        />

        <Input
          type="number"
          label="최대 수강 인원"
          value={maxStudents}
          onChange={(e) => setMaxStudents(e.target.value)}
          placeholder="예) 10"
          error={errors.maxStudents}
          min="1"
          max="100"
        />

        <Input
          type="number"
          label="가격 (원)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="예) 200000"
          error={errors.price}
          min="0"
          max="1000000"
          helperText="백만원 이하로 입력하세요"
        />
      </FormFields>

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

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;
