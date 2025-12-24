export type UserRole = 'STUDENT' | 'INSTRUCTOR';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
}
