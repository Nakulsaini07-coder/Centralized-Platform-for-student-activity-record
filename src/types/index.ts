export interface User {
  id: string;
  email: string;
  password: string;
  role: "student" | "faculty";
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
  type: "academic" | "extracurricular" | "volunteering";
  title: string;
  description: string;
  date: string;
  fileUrl?: string;
  fileName?: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id">) => Promise<boolean>;
  logout: () => void;
}

// Analytics & Reporting Types
export interface ReportFilter {
  year?: number[];
  department?: string[];
  activityType?: ("academic" | "extracurricular" | "volunteering")[];
  studentStatus?: ("active" | "graduated" | "inactive")[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ReportData {
  summary: {
    totalActivities: number;
    totalStudents: number;
    approvalRate: number;
    activitiesByType: Record<string, number>;
    activitiesByDepartment: Record<string, number>;
    monthlyTrends: Array<{
      month: string;
      count: number;
    }>;
  };
  activities: Activity[];
  students: User[];
}

export interface ReportFormat {
  type: "PDF" | "Excel";
  template: "NAAC" | "AICTE" | "NIRF" | "Internal";
}

// API Types
export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  isActive: boolean;
  createdAt: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
