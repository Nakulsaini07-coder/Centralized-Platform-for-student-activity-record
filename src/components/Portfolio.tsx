import React, { useEffect, useState } from 'react';
import { Calendar, Download, FileText, Tag, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getActivities } from '../utils/storage';
import { Activity } from '../types';
import jsPDF from 'jspdf';

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user) {
      const allActivities = getActivities();
      const approvedActivities = allActivities.filter(
        activity => activity.studentId === user.id && activity.status === 'approved'
      );
      setActivities(approvedActivities);
    }
  }, [user]);

  const handleDownload = () => {
    if (!user) return;

    const portfolioContent = `
STUDENT PORTFOLIO
==================

PERSONAL INFORMATION
--------------------
Name: ${user.name}
Email: ${user.email}
Course: ${user.course}
Branch: ${user.branch}
Year: ${user.year}

APPROVED ACTIVITIES
-------------------
${activities.length === 0 ? 'No approved activities yet.' : activities.map((activity, index) => `
${index + 1}. ${activity.title}
   Type: ${activity.type}
   Date: ${new Date(activity.date).toLocaleDateString()}
   Description: ${activity.description}
   ${activity.fileName ? `File: ${activity.fileName}` : ''}
   Reviewed by: ${activity.reviewedBy}
   Feedback: ${activity.feedback || 'No feedback provided'}
`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(12);
    
    const splitText = doc.splitTextToSize(portfolioContent, 180);
    doc.text(splitText, 15, 15);
    doc.save(`${user.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
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
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Digital Portfolio</h1>
              <p className="text-blue-100 mt-1">Comprehensive Activity Record</p>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Portfolio
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Course</p>
              <p className="text-gray-900">{user.course}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Branch</p>
              <p className="text-gray-900">{user.branch}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Year</p>
              <p className="text-gray-900">Year {user.year}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Approved Activities</p>
              <p className="text-gray-900 font-semibold">{activities.length}</p>
            </div>
          </div>
        </div>

        {/* Activities Summary */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Activities Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900">Academic</h3>
              <p className="text-2xl font-bold text-blue-600">
                {activities.filter(a => a.type === 'academic').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900">Extra-curricular</h3>
              <p className="text-2xl font-bold text-purple-600">
                {activities.filter(a => a.type === 'extracurricular').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900">Volunteering</h3>
              <p className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.type === 'volunteering').length}
              </p>
            </div>
          </div>
        </div>

        {/* Approved Activities */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Approved Activities
          </h2>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No approved activities yet</h3>
              <p className="text-gray-600">Submit activities for faculty approval to build your portfolio!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={activity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-500 mr-3">#{index + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{activity.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {activity.feedback && (
                    <div className="mt-3 p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-800">
                        <strong>Faculty Feedback:</strong> {activity.feedback}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Approved by {activity.reviewedBy} on {new Date(activity.reviewedAt!).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 rounded-b-lg text-center">
          <p className="text-sm text-gray-600">
            Portfolio generated on {new Date().toLocaleDateString()} | Student Activity Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;