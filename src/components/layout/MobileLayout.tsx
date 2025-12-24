import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { theme } from '@/styles/theme';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <LayoutContainer>
      <LayoutContent>{children}</LayoutContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-color: ${theme.colors.background.secondary};
`;

const LayoutContent = styled.main`
  width: 100%;
  max-width: ${theme.maxMobileWidth};
  background-color: ${theme.colors.background.primary};
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  min-height: 100vh;
`;
