import React, { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Tag, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Activity } from '../types';
import { getActivities, saveActivities, generateId } from '../utils/storage';

const ActivityManager: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'academic' as 'academic' | 'extracurricular' | 'volunteering',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    fileName: ''
  });

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = () => {
    const allActivities = getActivities();
    const userActivities = allActivities.filter(activity => activity.studentId === user?.id);
    setActivities(userActivities);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newActivity: Activity = {
      id: generateId(),
      studentId: user.id,
      studentName: user.name,
      type: formData.type,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      fileName: formData.fileName || undefined,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const allActivities = getActivities();
    saveActivities([...allActivities, newActivity]);
    loadActivities();
    setShowForm(false);
    setFormData({
      type: 'academic',
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      fileName: ''
    });
  };

  const handleDelete = (activityId: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      const allActivities = getActivities();
      const updatedActivities = allActivities.filter(activity => activity.id !== activityId);
      saveActivities(updatedActivities);
      loadActivities();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'extracurricular':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  if (!user || user.role !== 'student') return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Activities</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Activity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="academic">Academic</option>
                  <option value="extracurricular">Extra-curricular</option>
                  <option value="volunteering">Volunteering</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Name (optional)
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  placeholder="e.g., certificate.pdf"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No activities yet</h3>
            <p className="text-gray-600">Add your first activity to get started!</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {activity.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{activity.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(activity.date).toLocaleDateString()}
                    {activity.fileName && (
                      <>
                        <FileText className="h-4 w-4 ml-4 mr-1" />
                        {activity.fileName}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {getStatusIcon(activity.status)}
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete activity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {activity.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Feedback:</strong> {activity.feedback}
                  </p>
                  {activity.reviewedBy && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reviewed by {activity.reviewedBy} on {new Date(activity.reviewedAt!).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityManager;