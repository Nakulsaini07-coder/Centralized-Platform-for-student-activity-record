import React, { useState } from 'react';
import { BookOpen, User, GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onToggleMode: () => void;
  isRegisterMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onToggleMode, isRegisterMode }) => {
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as 'student' | 'faculty',
    course: '',
    branch: '',
    year: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        const userData = {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          ...(formData.role === 'student' && {
            course: formData.course,
            branch: formData.branch,
            year: parseInt(formData.year)
          }),
          ...(formData.role === 'faculty' && {
            department: formData.department
          })
        };

        const success = await register(userData);
        if (!success) {
          setError('Email already exists');
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (!success) {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Student Activity Platform
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            {isRegisterMode ? 'Create your account to get started' : 'Welcome back! Please sign in'}
          </p>
        </div>

        {/* Demo Credentials Card */}
        <div className="card mb-6 animate-slide-in">
          <div className="p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Demo Accounts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">Student:</span>
                <code className="text-blue-700 text-xs">arjun.sharma@college.edu</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">Faculty:</span>
                <code className="text-purple-700 text-xs">dr.rajesh@college.edu</code>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">Password: password123</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="card animate-slide-in">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="your-email@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {isRegisterMode && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>

                  {formData.role === 'student' && (
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Course
                        </label>
                        <input
                          type="text"
                          name="course"
                          value={formData.course}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Branch
                        </label>
                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="e.g., Software Engineering"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Year
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className="input-field"
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="5">5th Year</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {formData.role === 'faculty' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                  )}
                </>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-in">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isRegisterMode ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  isRegisterMode ? 'Create Account' : 'Sign In'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-slate-500 mt-8">
            © 2024 Student Activity Platform. All rights reserved.
          </p>
        </div>
        {/* Demo Credentials Card */}
        <div className="card mb-6 animate-slide-in">
          <div className="p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Demo Accounts
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                <span className="font-medium text-blue-800">Student:</span>
                <code className="text-blue-700 text-xs">arjun.sharma@college.edu</code>
              </div>
              <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                <span className="font-medium text-purple-800">Faculty:</span>
                <code className="text-purple-700 text-xs">dr.rajesh@college.edu</code>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">Password: password123</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="card animate-slide-in">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="your-email@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
      </div>
    </div>
  );
};

export default Login;