import { Button } from '@/components/common/Button';
import { useEnrollCourse } from '../hooks/useEnrollCourse';
import { Course } from '../types/course.types';

interface EnrollButtonProps {
  course: Course;
}

export function EnrollButton({ course }: EnrollButtonProps) {
  const { mutate: enroll, isPending } = useEnrollCourse();

  const handleEnroll = () => {
    if (window.confirm(`"${course.title}" 강의를 신청하시겠습니까?`)) {
      enroll(course.id);
    }
  };

  // 정원 마감
  if (course.isFull) {
    return (
      <Button variant="secondary" disabled fullWidth>
        정원 마감
      </Button>
    );
  }

  return (
    <Button onClick={handleEnroll} disabled={isPending} fullWidth>
      {isPending ? '신청 중...' : '수강 신청'}
    </Button>
  );
}
