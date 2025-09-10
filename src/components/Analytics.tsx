import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Filter,
  FileText,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  Activity,
  User,
  ReportFilter,
  ReportData,
  ReportFormat,
} from "../types";
import { getActivities, getUsers } from "../utils/storage";
import {
  generatePDFReport,
  generateExcelReport,
} from "../utils/reportGenerator";

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [filters, setFilters] = useState<ReportFilter>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  const loadAnalyticsData = () => {
    const activities = getActivities();
    const users = getUsers();

    // Apply filters
    let filteredActivities = activities;
    let filteredUsers = users.filter((u) => u.role === "student");

    if (filters.year && filters.year.length > 0) {
      filteredActivities = filteredActivities.filter((activity) => {
        const activityYear = new Date(activity.date).getFullYear();
        return filters.year!.includes(activityYear);
      });
    }

    if (filters.department && filters.department.length > 0) {
      filteredUsers = filteredUsers.filter((user) =>
        filters.department!.includes(user.department || user.course || "")
      );
      const userIds = filteredUsers.map((u) => u.id);
      filteredActivities = filteredActivities.filter((activity) =>
        userIds.includes(activity.studentId)
      );
    }

    if (filters.activityType && filters.activityType.length > 0) {
      filteredActivities = filteredActivities.filter((activity) =>
        filters.activityType!.includes(activity.type)
      );
    }

    if (filters.dateRange) {
      filteredActivities = filteredActivities.filter((activity) => {
        const activityDate = new Date(activity.date);
        const startDate = new Date(filters.dateRange!.start);
        const endDate = new Date(filters.dateRange!.end);
        return activityDate >= startDate && activityDate <= endDate;
      });
    }

    // Calculate analytics
    const activitiesByType = filteredActivities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activitiesByDepartment = filteredActivities.reduce(
      (acc, activity) => {
        const student = users.find((u) => u.id === activity.studentId);
        const dept = student?.department || student?.course || "Unknown";
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Monthly trends for the last 12 months
    const monthlyTrends: Array<{ month: string; count: number }> = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const count = filteredActivities.filter((activity) =>
        activity.date.startsWith(monthKey)
      ).length;
      monthlyTrends.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        count,
      });
    }

    const approvedActivities = filteredActivities.filter(
      (a) => a.status === "approved"
    ).length;
    const approvalRate =
      filteredActivities.length > 0
        ? Math.round((approvedActivities / filteredActivities.length) * 100)
        : 0;

    setReportData({
      summary: {
        totalActivities: filteredActivities.length,
        totalStudents: filteredUsers.length,
        approvalRate,
        activitiesByType,
        activitiesByDepartment,
        monthlyTrends,
      },
      activities: filteredActivities,
      students: filteredUsers,
    });
  };

  const handleGenerateReport = async (format: ReportFormat) => {
    if (!reportData) return;

    setIsGenerating(true);
    try {
      if (format.type === "PDF") {
        await generatePDFReport(reportData, format.template, filters);
      } else {
        await generateExcelReport(reportData, format.template, filters);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateFilter = (key: keyof ReportFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  if (user?.role !== "faculty") {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          Analytics & Reporting is available for faculty members only.
        </p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const departments = [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Information Technology",
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="h-6 w-6 mr-3" />
          Analytics & Reporting
        </h2>
        <p className="text-gray-600 mt-1">
          Generate comprehensive reports for NAAC, AICTE, NIRF, and internal use
        </p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear All
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Year
              </label>
              <select
                multiple
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.year || []}
                onChange={(e) => {
                  const selectedYears = Array.from(
                    e.target.selectedOptions,
                    (option) => parseInt(option.value)
                  );
                  updateFilter("year", selectedYears);
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                multiple
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.department || []}
                onChange={(e) => {
                  const selectedDepts = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  updateFilter("department", selectedDepts);
                }}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Activity Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </label>
              <select
                multiple
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.activityType || []}
                onChange={(e) => {
                  const selectedTypes = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ) as ("academic" | "extracurricular" | "volunteering")[];
                  updateFilter("activityType", selectedTypes);
                }}
              >
                <option value="academic">Academic</option>
                <option value="extracurricular">Extra-curricular</option>
                <option value="volunteering">Volunteering</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
                value={filters.dateRange?.start || ""}
                onChange={(e) =>
                  updateFilter("dateRange", {
                    ...filters.dateRange,
                    start: e.target.value,
                  })
                }
                placeholder="Start Date"
              />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={filters.dateRange?.end || ""}
                onChange={(e) =>
                  updateFilter("dateRange", {
                    ...filters.dateRange,
                    end: e.target.value,
                  })
                }
                placeholder="End Date"
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Activities
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.summary.totalActivities}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">
                Active Students
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.summary.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">
                Approval Rate
              </h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.summary.approvalRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {reportData.summary.monthlyTrends[
                  reportData.summary.monthlyTrends.length - 1
                ]?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Types Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activity Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(reportData.summary.activitiesByType).map(
              ([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        type === "academic"
                          ? "bg-blue-500"
                          : type === "extracurricular"
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-gray-700 capitalize">{type}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Wise Activities
          </h3>
          <div className="space-y-4">
            {Object.entries(reportData.summary.activitiesByDepartment).map(
              ([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-gray-700">{dept}</span>
                  <span className="font-semibold text-gray-900">{count}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Monthly Activity Trends
        </h3>
        <div className="flex items-end justify-between h-32 space-x-2">
          {reportData.summary.monthlyTrends.map((trend, index) => {
            const maxCount = Math.max(
              ...reportData.summary.monthlyTrends.map((t) => t.count)
            );
            const height = maxCount > 0 ? (trend.count / maxCount) * 100 : 0;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 w-full rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${trend.month}: ${trend.count} activities`}
                ></div>
                <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-top-left">
                  {trend.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Generate Reports
        </h3>
        <p className="text-gray-600 mb-6">
          Download comprehensive reports in various formats for accreditation
          bodies and internal use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* NAAC Report */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">NAAC Format</h4>
            <p className="text-sm text-gray-600 mb-4">
              National Assessment and Accreditation Council format
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGenerateReport({ type: "PDF", template: "NAAC" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Download PDF
              </button>
              <button
                onClick={() =>
                  handleGenerateReport({ type: "Excel", template: "NAAC" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Download Excel
              </button>
            </div>
          </div>

          {/* AICTE Report */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">AICTE Format</h4>
            <p className="text-sm text-gray-600 mb-4">
              All India Council for Technical Education format
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGenerateReport({ type: "PDF", template: "AICTE" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Download PDF
              </button>
              <button
                onClick={() =>
                  handleGenerateReport({ type: "Excel", template: "AICTE" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Download Excel
              </button>
            </div>
          </div>

          {/* NIRF Report */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">NIRF Format</h4>
            <p className="text-sm text-gray-600 mb-4">
              National Institutional Ranking Framework format
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGenerateReport({ type: "PDF", template: "NIRF" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Download PDF
              </button>
              <button
                onClick={() =>
                  handleGenerateReport({ type: "Excel", template: "NIRF" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Download Excel
              </button>
            </div>
          </div>

          {/* Internal Report */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Internal Format
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Detailed internal reporting format
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleGenerateReport({ type: "PDF", template: "Internal" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Download PDF
              </button>
              <button
                onClick={() =>
                  handleGenerateReport({ type: "Excel", template: "Internal" })
                }
                disabled={isGenerating}
                className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Download Excel
              </button>
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-4 flex items-center justify-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Generating report...
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
