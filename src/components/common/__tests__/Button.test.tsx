import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  describe('렌더링', () => {
    it('children을 렌더링한다', () => {
      render(<Button>클릭</Button>);
      expect(screen.getByRole('button', { name: '클릭' })).toBeInTheDocument();
    });

    it('primary variant가 기본값이다', () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('secondary variant를 렌더링한다', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button).toBeInTheDocument();
    });

    it('fullWidth prop을 적용한다', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveStyle({ width: '100%' });
    });
  });

  describe('상호작용', () => {
    it('클릭 이벤트를 처리한다', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>클릭</Button>);

      const button = screen.getByRole('button', { name: '클릭' });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 상태에서는 클릭 이벤트가 발생하지 않는다', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          비활성
        </Button>
      );

      const button = screen.getByRole('button', { name: '비활성' });
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });
  });

  describe('접근성', () => {
    it('button role을 가진다', () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('type prop을 전달할 수 있다', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('aria-label을 전달할 수 있다', () => {
      render(<Button aria-label="Close modal">×</Button>);
      const button = screen.getByRole('button', { name: 'Close modal' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('조합', () => {
    it('primary + fullWidth', () => {
      const { container } = render(
        <Button variant="primary" fullWidth>
          Primary Full
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toHaveStyle({ width: '100%' });
    });

    it('secondary + disabled', () => {
      const { container } = render(
        <Button variant="secondary" disabled>
          Secondary Disabled
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toBeDisabled();
    });

    it('fullWidth + disabled', () => {
      const { container } = render(
        <Button fullWidth disabled>
          Full Disabled
        </Button>
      );
      const button = container.querySelector('button');
      expect(button).toHaveStyle({ width: '100%' });
      expect(button).toBeDisabled();
    });
  });
});
