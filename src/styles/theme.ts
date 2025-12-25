export const theme = {
  colors: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    error: '#EF4444',
    success: '#10B981',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      disabled: '#F3F4F6',
    },
    border: '#E5E7EB',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    smPlus: '14px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
  // 모바일 터치 친화적 크기
  minTouchSize: '44px',
  // 모바일 최대 너비
  maxMobileWidth: '640px',
} as const;

export type Theme = typeof theme;
