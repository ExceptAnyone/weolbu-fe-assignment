import { Select } from '@/components/common/Select';
import { CourseSortType } from '../types/course.types';

interface CourseSortSelectProps {
  value: CourseSortType;
  onChange: (value: CourseSortType) => void;
}

const SORT_OPTIONS = [
  { value: 'recent', label: '최근 등록순' },
  { value: 'popular', label: '신청자 많은 순' },
  { value: 'rate', label: '신청률 높은 순' },
];

export function CourseSortSelect({ value, onChange }: CourseSortSelectProps) {
  return (
    <Select
      label="정렬 기준"
      value={value}
      onChange={(e) => onChange(e.target.value as CourseSortType)}
      options={SORT_OPTIONS}
    />
  );
}
