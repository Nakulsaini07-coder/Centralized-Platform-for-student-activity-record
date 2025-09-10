import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import StudentProfile from './components/StudentProfile';
import ActivityManager from './components/ActivityManager';
import FacultyApprovals from './components/FacultyApprovals';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  if (!user) {
    return (
      <Login 
        onToggleMode={() => setIsRegisterMode(!isRegisterMode)}
        isRegisterMode={isRegisterMode}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <StudentProfile />;
      case 'activities':
        return <ActivityManager />;
      case 'approvals':
        return <FacultyApprovals />;
      case 'portfolio':
        return <Portfolio />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;