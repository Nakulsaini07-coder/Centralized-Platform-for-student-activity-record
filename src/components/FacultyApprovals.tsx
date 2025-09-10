import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, MessageSquare, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Activity } from '../types';
import { getActivities, saveActivities } from '../utils/storage';

const FacultyApprovals: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    const allActivities = getActivities();
    setActivities(allActivities);
  };

  const handleApproval = (activityId: string, status: 'approved' | 'rejected', feedback: string) => {
    if (!user) return;

    const allActivities = getActivities();
    const updatedActivities = allActivities.map(activity =>
      activity.id === activityId
        ? {
            ...activity,
            status,
            feedback,
            reviewedBy: user.name,
            reviewedAt: new Date().toISOString()
          }
        : activity
    );

    saveActivities(updatedActivities);
    loadActivities();
    setSelectedActivity(null);
    setFeedback('');
  };

  const filteredActivities = activities.filter(activity => 
    filter === 'all' || activity.status === 'pending'
  );

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

  if (!user || user.role !== 'faculty') return null;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Activity Approvals</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              filter === 'pending'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Pending ({activities.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Activities ({activities.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              {filter === 'pending' ? 'No pending activities' : 'No activities found'}
            </h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? 'All activities have been reviewed!' 
                : 'No student activities have been submitted yet.'}
            </p>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 mr-3">
                      {activity.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Student:</strong> {activity.studentName}
                  </p>
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
                <div className="flex items-center ml-4">
                  {getStatusIcon(activity.status)}
                  {activity.status === 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setFeedback('');
                      }}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
              {activity.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">
                    <strong>Feedback:</strong> {activity.feedback}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed by {activity.reviewedBy} on {new Date(activity.reviewedAt!).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Review Activity</h3>
            <div className="mb-4">
              <h4 className="font-medium text-gray-900">{selectedActivity.title}</h4>
              <p className="text-sm text-gray-600">By {selectedActivity.studentName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide feedback to the student..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleApproval(selectedActivity.id, 'approved', feedback)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleApproval(selectedActivity.id, 'rejected', feedback)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => {
                  setSelectedActivity(null);
                  setFeedback('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyApprovals;