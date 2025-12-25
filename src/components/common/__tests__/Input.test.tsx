import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  describe('렌더링', () => {
    it('input을 렌더링한다', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('label을 렌더링한다', () => {
      render(<Input label="이름" />);
      const label = screen.getByText('이름');
      expect(label).toBeInTheDocument();
    });

    it('placeholder를 렌더링한다', () => {
      render(<Input placeholder="이름을 입력하세요" />);
      const input = screen.getByPlaceholderText('이름을 입력하세요');
      expect(input).toBeInTheDocument();
    });

    it('error 메시지를 렌더링한다', () => {
      render(<Input error="필수 입력 항목입니다" />);
      const error = screen.getByText('필수 입력 항목입니다');
      expect(error).toBeInTheDocument();
    });

    it('helperText를 렌더링한다', () => {
      render(<Input helperText="20자 이하로 입력하세요" />);
      const helperText = screen.getByText('20자 이하로 입력하세요');
      expect(helperText).toBeInTheDocument();
    });

    it('error가 있으면 helperText를 숨긴다', () => {
      render(<Input error="에러 메시지" helperText="도움말" />);

      expect(screen.getByText('에러 메시지')).toBeInTheDocument();
      expect(screen.queryByText('도움말')).not.toBeInTheDocument();
    });

    it('type prop을 적용한다', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('value prop을 적용한다', () => {
      render(<Input value="테스트 값" onChange={() => {}} />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('테스트 값');
    });
  });

  describe('ID 자동 생성', () => {
    it('label에서 id를 자동 생성한다', () => {
      render(<Input label="이메일 주소" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', '이메일-주소');
    });

    it('직접 제공한 id를 사용한다', () => {
      render(<Input id="custom-id" label="이름" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id', 'custom-id');
    });

    it('label과 input이 연결된다', () => {
      render(<Input label="이메일" />);
      const label = screen.getByText('이메일');
      const input = screen.getByRole('textbox');

      expect(label).toHaveAttribute('for', input.id);
    });
  });

  describe('상호작용', () => {
    it('입력 값이 변경된다', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, '테스트');

      expect(input.value).toBe('테스트');
    });

    it('onChange 이벤트가 발생한다', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'a');

      expect(handleChange).toHaveBeenCalled();
    });

    it('disabled 상태에서는 입력할 수 없다', async () => {
      const user = userEvent.setup();
      render(<Input disabled />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      await user.type(input, '테스트');

      expect(input.value).toBe('');
      expect(input).toBeDisabled();
    });
  });

  describe('접근성', () => {
    it('textbox role을 가진다', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('label을 클릭하면 input에 포커스된다', async () => {
      const user = userEvent.setup();
      render(<Input label="이름" />);

      const label = screen.getByText('이름');
      await user.click(label);

      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('required 속성을 적용할 수 있다', () => {
      render(<Input required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });

    it('aria-label을 적용할 수 있다', () => {
      render(<Input aria-label="검색" />);
      const input = screen.getByRole('textbox', { name: '검색' });
      expect(input).toBeInTheDocument();
    });
  });

  describe('조합', () => {
    it('label + error + placeholder', () => {
      render(
        <Input label="이메일" error="올바른 이메일을 입력하세요" placeholder="example@email.com" />
      );

      expect(screen.getByText('이메일')).toBeInTheDocument();
      expect(screen.getByText('올바른 이메일을 입력하세요')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('example@email.com')).toBeInTheDocument();
    });

    it('label + helperText (error 없음)', () => {
      render(<Input label="비밀번호" helperText="6-10자로 입력하세요" />);

      expect(screen.getByText('비밀번호')).toBeInTheDocument();
      expect(screen.getByText('6-10자로 입력하세요')).toBeInTheDocument();
    });

    it('disabled + placeholder', () => {
      render(<Input disabled placeholder="비활성" />);

      const input = screen.getByPlaceholderText('비활성');
      expect(input).toBeDisabled();
    });
  });
});
