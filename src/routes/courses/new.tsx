import { createFileRoute } from '@tanstack/react-router';
import styled from '@emotion/styled';
import { AuthGuard } from '@/components/guards/AuthGuard';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { CourseForm } from '@/domains/course/components/CourseForm';
import { flexCenter } from '@/styles/mixins';

export const Route = createFileRoute('/courses/new')({
  component: CourseNewPage,
});

function CourseNewPage() {
  return (
    <AuthGuard requireAuth={true} redirectTo="/signup">
      <RoleGuard allowedRoles={['INSTRUCTOR']} redirectTo="/">
        <Container>
          <CourseForm />
        </Container>
      </RoleGuard>
    </AuthGuard>
  );
}

const Container = styled.div`
  ${flexCenter};
  min-height: 100vh;
  padding: 20px;
`;
