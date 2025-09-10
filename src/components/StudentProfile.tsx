import React, { useState } from 'react';
import { User, Edit3, Save, X, Mail, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, saveUsers } from '../utils/storage';

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    course: user?.course || '',
    branch: user?.branch || '',
    year: user?.year || 1
  });

  const handleSave = () => {
    if (!user) return;

    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, ...formData }
        : u
    );
    saveUsers(updatedUsers);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  if (!user || user.role !== 'student') return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Student Profile</h1>
        <p className="text-slate-600">Manage your personal information and academic details</p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-slate-600">{user.email}</p>
              </div>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="btn-success flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      course: user?.course || '',
                      branch: user?.branch || '',
                      year: user?.year || 1
                    });
                  }}
                  className="btn-secondary flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <User className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-slate-900 font-medium">{user.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Mail className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-900 font-medium">{user.email}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role
                  </label>
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-900 font-medium capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Academic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Course
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Computer Science"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <BookOpen className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-slate-900 font-medium">{user.course}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Branch/Specialization
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Software Engineering"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <BookOpen className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-slate-900 font-medium">{user.branch}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Academic Year
                  </label>
                  {isEditing ? (
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year</option>
                    </select>
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Calendar className="h-4 w-4 text-slate-500 mr-2" />
                      <span className="text-slate-900 font-medium">Year {user.year}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;