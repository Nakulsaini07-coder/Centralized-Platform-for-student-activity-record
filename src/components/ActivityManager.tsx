import React, { useState, useEffect } from 'react';
import { Plus, Calendar, FileText, Tag, Clock, CheckCircle, XCircle, Trash2, BookOpen, Award, Heart, Filter, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Activity } from '../types';
import { getActivities, saveActivities, generateId } from '../utils/storage';

const ActivityManager: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
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

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, statusFilter, typeFilter]);

  const loadActivities = () => {
    const allActivities = getActivities();
    const userActivities = allActivities.filter(activity => activity.studentId === user?.id);
    setActivities(userActivities);
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => activity.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    setFilteredActivities(filtered);
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
        return 'badge-academic';
      case 'extracurricular':
        return 'badge-extracurricular';
      default:
        return 'badge-volunteering';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      default:
        return 'badge-pending';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'academic':
        return BookOpen;
      case 'extracurricular':
        return Award;
      default:
        return Heart;
    }
  };

  if (!user || user.role !== 'student') return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Activities</h1>
          <p className="text-slate-600 mt-1">Track and manage your academic and extracurricular activities</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Activity
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="academic">Academic</option>
              <option value="extracurricular">Extra-curricular</option>
              <option value="volunteering">Volunteering</option>
            </select>
            <div className="flex items-center text-sm text-slate-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredActivities.length} of {activities.length} activities
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg animate-slide-in">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Add New Activity</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="academic">Academic</option>
                  <option value="extracurricular">Extra-curricular</option>
                  <option value="volunteering">Volunteering</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  File Name (optional)
                </label>
                <input
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleChange}
                  placeholder="e.g., certificate.pdf"
                  className="input-field"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-6">
        {filteredActivities.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {activities.length === 0 ? 'No activities yet' : 'No activities match your filters'}
              </h3>
              <p className="text-slate-600 mb-6">
                {activities.length === 0 
                  ? 'Add your first activity to get started!' 
                  : 'Try adjusting your search or filter criteria'}
              </p>
              {activities.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Activity
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredActivities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="card hover:shadow-lg transition-all duration-300 animate-slide-in">
                <div className="card-content">
                  <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="p-2 bg-slate-100 rounded-lg mr-3">
                          <ActivityIcon className="h-5 w-5 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mr-3">
                      {activity.title}
                    </h3>
                        <span className={`${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                      <p className="text-slate-600 mb-4 leading-relaxed">{activity.description}</p>
                      <div className="flex items-center text-sm text-slate-500 space-x-4">
                    <Calendar className="h-4 w-4 mr-1" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                    {activity.fileName && (
                      <>
                        <FileText className="h-4 w-4 ml-4 mr-1" />
                            <span>{activity.fileName}</span>
                      </>
                    )}
                  </div>
                </div>
                    <div className="flex items-center space-x-3 ml-4">
                  {getStatusIcon(activity.status)}
                      <span className={`${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                  <button
                    onClick={() => handleDelete(activity.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete activity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
                  
              {activity.feedback && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800 font-medium mb-1">Faculty Feedback:</p>
                      <p className="text-blue-700">{activity.feedback}</p>
                  </p>
                  {activity.reviewedBy && (
                        <p className="text-xs text-blue-600 mt-2">
                          Reviewed by {activity.reviewedBy} on {new Date(activity.reviewedAt!).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
                </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ActivityManager;