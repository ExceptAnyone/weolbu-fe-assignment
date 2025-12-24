import { useEffect } from 'react';

/**
 * 조건에 따라 body 스크롤을 잠그거나 해제하는 훅
 * @param isLocked 스크롤을 잠글지 여부
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
}
