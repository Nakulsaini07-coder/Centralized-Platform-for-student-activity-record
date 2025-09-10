import React from 'react';
import { User, BookOpen, Activity, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();

  const studentPages = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'portfolio', label: 'Portfolio', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
  ];

  const facultyPages = [
    { id: 'approvals', label: 'Approvals', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
  ];

  const pages = user?.role === 'student' ? studentPages : facultyPages;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Student Activity Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4">
              {pages.map((page) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => onPageChange(page.id)}
                    className={`w-full flex items-center px-4 py-2 mt-2 text-sm font-medium rounded-md ${
                      currentPage === page.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {page.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;