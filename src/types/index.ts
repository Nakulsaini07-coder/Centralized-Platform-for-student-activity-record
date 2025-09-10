export interface User {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'faculty';
  name: string;
  // Student specific fields
  course?: string;
  branch?: string;
  year?: number;
  // Faculty specific fields
  department?: string;
}

export interface Activity {
  id: string;
  studentId: string;
  studentName: string;
  type: 'academic' | 'extracurricular' | 'volunteering';
  title: string;
  description: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
}