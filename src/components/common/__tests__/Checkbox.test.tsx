import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../Checkbox';

describe('Checkbox', () => {
  describe('렌더링', () => {
    it('체크박스를 렌더링한다', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('label을 렌더링한다', () => {
      render(<Checkbox label="동의합니다" />);
      const label = screen.getByText('동의합니다');
      expect(label).toBeInTheDocument();
    });

    it('checked 상태를 렌더링한다', () => {
      render(<Checkbox checked onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
    });

    it('unchecked 상태를 렌더링한다', () => {
      render(<Checkbox checked={false} onChange={() => {}} />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);
    });

    it('checked일 때 체크 아이콘을 표시한다', () => {
      const { container } = render(<Checkbox checked onChange={() => {}} />);
      const checkIcon = container.querySelector('span');
      expect(checkIcon).toBeInTheDocument();
      expect(checkIcon).toHaveTextContent('✓');
    });

    it('unchecked일 때 체크 아이콘을 숨긴다', () => {
      const { container } = render(<Checkbox checked={false} onChange={() => {}} />);
      const checkIcon = container.querySelector('span');
      expect(checkIcon).not.toBeInTheDocument();
    });

    it('disabled 상태를 렌더링한다', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
  });

  describe('ID 생성', () => {
    it('직접 제공한 id를 사용한다', () => {
      render(<Checkbox id="custom-checkbox" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-checkbox');
    });

    it('id가 없으면 자동으로 생성한다', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      const id = checkbox.getAttribute('id');
      expect(id).toBeTruthy();
      expect(id).toMatch(/^checkbox-/);
    });
  });

  describe('상호작용', () => {
    it('클릭 시 onChange 이벤트가 발생한다', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('체크박스를 토글한다', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      await user.click(checkbox);
      expect(checkbox.checked).toBe(true);

      await user.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });

    it('label 클릭 시에도 체크박스가 토글된다', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="동의" />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      const label = screen.getByText('동의');

      expect(checkbox.checked).toBe(false);

      await user.click(label);
      expect(checkbox.checked).toBe(true);
    });

    it('disabled 상태에서는 클릭할 수 없다', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox disabled onChange={handleChange} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).toBeDisabled();
    });

    it('disabled 상태에서 label 클릭도 무효화된다', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox label="동의" disabled onChange={handleChange} />);

      const label = screen.getByText('동의');
      await user.click(label);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('접근성', () => {
    it('checkbox role을 가진다', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('label과 연결된다', () => {
      render(<Checkbox label="동의합니다" id="agree" />);
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('동의합니다');

      expect(checkbox).toHaveAttribute('id', 'agree');
      expect(label).toHaveAttribute('for', 'agree');
    });

    it('aria-label을 적용할 수 있다', () => {
      render(<Checkbox aria-label="전체 선택" />);
      const checkbox = screen.getByRole('checkbox', { name: '전체 선택' });
      expect(checkbox).toBeInTheDocument();
    });

    it('required 속성을 적용할 수 있다', () => {
      render(<Checkbox required />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeRequired();
    });
  });

  describe('조합', () => {
    it('checked + label', () => {
      render(<Checkbox checked label="동의합니다" onChange={() => {}} />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      expect(screen.getByText('동의합니다')).toBeInTheDocument();
    });

    it('disabled + label', () => {
      render(<Checkbox disabled label="비활성" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
      expect(screen.getByText('비활성')).toBeInTheDocument();
    });

    it('checked + disabled', () => {
      render(<Checkbox checked disabled onChange={() => {}} />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      expect(checkbox).toBeDisabled();
    });

    it('checked + disabled + label', () => {
      render(<Checkbox checked disabled label="이미 동의함" onChange={() => {}} />);

      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.checked).toBe(true);
      expect(checkbox).toBeDisabled();
      expect(screen.getByText('이미 동의함')).toBeInTheDocument();
    });
  });
});
