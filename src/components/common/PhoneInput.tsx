import { ChangeEvent } from 'react';
import { Input } from '@/components/common/Input';
import { formatPhone } from '@/utils/format';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  label = '휴대폰 번호',
  placeholder = '010-0000-0000',
}: PhoneInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onChange(formatted);
  };

  return (
    <Input
      type="tel"
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      placeholder={placeholder}
      error={error}
      maxLength={13} // 010-0000-0000 = 13자
    />
  );
}
