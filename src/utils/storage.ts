import { User, Activity } from '../types';

const USERS_KEY = 'sap_users';
const ACTIVITIES_KEY = 'sap_activities';
const CURRENT_USER_KEY = 'sap_current_user';

// Initialize with seed data
const seedUsers: User[] = [
  {
    id: '1',
    email: 'student1@university.edu',
    password: 'password123',
    role: 'student',
    name: 'Alice Johnson',
    course: 'Computer Science',
    branch: 'Software Engineering',
    year: 3
  },
  {
    id: '2',
    email: 'student2@university.edu',
    password: 'password123',
    role: 'student',
    name: 'Bob Smith',
    course: 'Electrical Engineering',
    branch: 'Electronics',
    year: 2
  },
  {
    id: '3',
    email: 'faculty1@university.edu',
    password: 'password123',
    role: 'faculty',
    name: 'Dr. Sarah Wilson',
    department: 'Computer Science'
  },
  {
    id: '4',
    email: 'faculty2@university.edu',
    password: 'password123',
    role: 'faculty',
    name: 'Prof. Michael Brown',
    department: 'Electrical Engineering'
  }
];

const seedActivities: Activity[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Alice Johnson',
    type: 'academic',
    title: 'Research Paper on Machine Learning',
    description: 'Published research paper on deep learning algorithms in IEEE conference',
    date: '2024-01-15',
    status: 'approved',
    feedback: 'Excellent research work with significant contributions',
    reviewedBy: 'Dr. Sarah Wilson',
    reviewedAt: '2024-01-20',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'Alice Johnson',
    type: 'extracurricular',
    title: 'Hackathon Winner',
    description: 'Won first place in university-wide hackathon with innovative mobile app',
    date: '2024-02-10',
    status: 'pending',
    createdAt: '2024-02-10'
  },
  {
    id: '3',
    studentId: '2',
    studentName: 'Bob Smith',
    type: 'volunteering',
    title: 'Community Tech Support',
    description: 'Volunteered to provide tech support for elderly community members',
    date: '2024-01-25',
    status: 'approved',
    feedback: 'Great community service initiative',
    reviewedBy: 'Prof. Michael Brown',
    reviewedAt: '2024-01-30',
    createdAt: '2024-01-25'
  }
];

// Initialize storage with seed data if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem(ACTIVITIES_KEY)) {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(seedActivities));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getActivities = (): Activity[] => {
  const activities = localStorage.getItem(ACTIVITIES_KEY);
  return activities ? JSON.parse(activities) : [];
};

export const saveActivities = (activities: Activity[]) => {
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};