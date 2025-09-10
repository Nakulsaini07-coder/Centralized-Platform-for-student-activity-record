import React, { useState, useEffect } from 'react';
import { BarChart3, Users, CheckCircle, Clock, XCircle, TrendingUp, Award, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Activity } from '../types';
import { getActivities, getUsers } from '../utils/storage';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    academic: 0,
    extracurricular: 0,
    volunteering: 0
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const allActivities = getActivities();
    
    let userActivities: Activity[] = [];
    if (user?.role === 'student') {
      userActivities = allActivities.filter(activity => activity.studentId === user.id);
    } else {
      userActivities = allActivities;
    }

    setActivities(userActivities);

    // Calculate statistics
    const newStats = {
      total: userActivities.length,
      pending: userActivities.filter(a => a.status === 'pending').length,
      approved: userActivities.filter(a => a.status === 'approved').length,
      rejected: userActivities.filter(a => a.status === 'rejected').length,
      academic: userActivities.filter(a => a.type === 'academic').length,
      extracurricular: userActivities.filter(a => a.type === 'extracurricular').length,
      volunteering: userActivities.filter(a => a.type === 'volunteering').length
    };

    setStats(newStats);
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    gradient: string;
    textColor: string;
  }> = ({ title, value, icon: Icon, gradient, textColor }) => (
    <div className="stat-card group">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-xl ${gradient} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );

  const getRecentActivities = () => {
    return activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-orange-600';
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

  if (!user) return null;

  const totalStudents = user.role === 'faculty' ? getUsers().filter(u => u.role === 'student').length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-lg text-slate-600">
          {user.role === 'student' 
            ? 'Track your activities and build your portfolio' 
            : 'Manage student activities and generate insights'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Activities"
          value={stats.total}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          textColor="text-blue-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          textColor="text-orange-600"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          textColor="text-emerald-600"
        />
        <StatCard
          title={user.role === 'faculty' ? 'Total Students' : 'Achievements'}
          value={user.role === 'faculty' ? totalStudents : stats.approved}
          icon={user.role === 'faculty' ? Users : Award}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          textColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Activity Breakdown
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-medium text-slate-700">Academic</span>
                </div>
                <span className="font-bold text-blue-600 text-lg">{stats.academic}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                  <span className="font-medium text-slate-700">Extra-curricular</span>
                </div>
                <span className="font-bold text-purple-600 text-lg">{stats.extracurricular}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="font-medium text-slate-700">Volunteering</span>
                </div>
                <span className="font-bold text-emerald-600 text-lg">{stats.volunteering}</span>
              </div>
              
              {stats.total > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Approval Rate</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activities
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {getRecentActivities().length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No activities found</p>
                  <p className="text-sm text-slate-500">Start by adding your first activity!</p>
                </div>
              ) : (
                getRecentActivities().map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                        {user.role === 'faculty' && (
                          <span className="text-xs text-slate-500">
                            by {activity.studentName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Faculty-specific stats */}
      {user.role === 'faculty' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              System Overview
            </h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
                <p className="text-slate-600 font-medium">Total Students</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-600">{activities.length}</p>
                <p className="text-slate-600 font-medium">Total Submissions</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-600">
                  {activities.length > 0 ? Math.round((stats.approved / activities.length) * 100) : 0}%
                </p>
                <p className="text-slate-600 font-medium">Overall Approval Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-lg text-slate-600">
          {user.role === 'student' 
            ? 'Track your activities and build your portfolio' 
            : 'Manage student activities and generate insights'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Activities"
          value={stats.total}
          icon={BookOpen}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          textColor="text-blue-600"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          textColor="text-orange-600"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          textColor="text-emerald-600"
        />
        <StatCard
          title={user.role === 'faculty' ? 'Total Students' : 'Achievements'}
          value={user.role === 'faculty' ? totalStudents : stats.approved}
          icon={user.role === 'faculty' ? Users : Award}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          textColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Activity Breakdown
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-medium text-slate-700">Academic</span>
                </div>
                <span className="font-bold text-blue-600 text-lg">{stats.academic}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                  <span className="font-medium text-slate-700">Extra-curricular</span>
                </div>
                <span className="font-bold text-purple-600 text-lg">{stats.extracurricular}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="font-medium text-slate-700">Volunteering</span>
                </div>
                <span className="font-bold text-emerald-600 text-lg">{stats.volunteering}</span>
              </div>
              
              {stats.total > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">Approval Rate</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activities
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {getRecentActivities().length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">No activities found</p>
                  <p className="text-sm text-slate-500">Start by adding your first activity!</p>
                </div>
              ) : (
                getRecentActivities().map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center mt-2 space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                        {user.role === 'faculty' && (
                          <span className="text-xs text-slate-500">
                            by {activity.studentName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Faculty-specific stats */}
      {user.role === 'faculty' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-slate-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              System Overview
            </h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
                <p className="text-slate-600 font-medium">Total Students</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-emerald-600">{activities.length}</p>
                <p className="text-slate-600 font-medium">Total Submissions</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-purple-600">
                  {activities.length > 0 ? Math.round((stats.approved / activities.length) * 100) : 0}%
                </p>
                <p className="text-slate-600 font-medium">Overall Approval Rate</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
          Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          {user.role === 'student' 
            ? 'Overview of your activities and achievements' 
            : 'System overview and activity management'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Activities"
          value={stats.total}
          icon={TrendingUp}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={Clock}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Academic</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.academic}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Extra-curricular</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.extracurricular}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Volunteering</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.volunteering}</span>
            </div>
            {stats.total > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Approval Rate: {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {getRecentActivities().length === 0 ? (
              <p className="text-gray-600 text-center py-4">No activities found</p>
            ) : (
              getRecentActivities().map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getTypeColor(activity.type)}`}>
                        {activity.type}
                      </span>
                      {user.role === 'faculty' && (
                        <span className="text-xs text-gray-500">
                          by {activity.studentName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Faculty-specific stats */}
      {user.role === 'faculty' && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            System Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-gray-600">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
              <p className="text-gray-600">Total Activities Submitted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {activities.length > 0 ? Math.round((stats.approved / activities.length) * 100) : 0}%
              </p>
              <p className="text-gray-600">Overall Approval Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;