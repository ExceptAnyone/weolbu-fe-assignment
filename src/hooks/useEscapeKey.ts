import { useEffect } from 'react';

/**
 * ESC 키를 눌렀을 때 콜백 함수를 실행하는 훅
 * @param onEscape ESC 키를 눌렀을 때 실행할 콜백 함수
 * @param enabled 훅의 활성화 여부 (기본값: true)
 */
export function useEscapeKey(onEscape: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onEscape, enabled]);
}
