import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Global } from '@emotion/react';
import { globalStyles } from '@/styles/globalStyles';
import { queryClient } from '@/lib/queryClient';
import { UserProvider } from '@/domains/user/context/UserContext';
import { EnrolledCoursesProvider } from '@/domains/course/context/EnrolledCoursesContext';
import { ToastProvider, ToastContainer } from '@/components/common/Toast';
import { ModalProvider } from '@/components/common/Modal/ModalContext';
import { MobileLayout } from '@/components/layout/MobileLayout';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <EnrolledCoursesProvider>
          <ModalProvider>
            <ToastProvider>
              <Global styles={globalStyles} />
              <MobileLayout>
                <Outlet />
              </MobileLayout>
              <ToastContainer />
            </ToastProvider>
          </ModalProvider>
        </EnrolledCoursesProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
