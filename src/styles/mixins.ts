import { css } from '@emotion/react';
import { theme } from './theme';

// 플렉스 중앙 정렬
export const flexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 플렉스 세로 정렬 (시작점)
export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

// 플렉스 세로 정렬 (중앙)
export const flexColumnCenter = css`
  ${flexColumn};
  justify-content: center;
  align-items: center;
`;

// 텍스트 말줄임
export const ellipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 모바일 터치 친화적 크기
export const touchFriendly = css`
  min-height: ${theme.minTouchSize};
  min-width: ${theme.minTouchSize};
`;

// 스크롤바 숨기기
export const hideScrollbar = css`
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
`;
