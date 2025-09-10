import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ReportData, ReportFilter } from "../types";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFilterSummary = (filters: ReportFilter): string => {
  const parts: string[] = [];

  if (filters.year && filters.year.length > 0) {
    parts.push(`Years: ${filters.year.join(", ")}`);
  }

  if (filters.department && filters.department.length > 0) {
    parts.push(`Departments: ${filters.department.join(", ")}`);
  }

  if (filters.activityType && filters.activityType.length > 0) {
    parts.push(`Types: ${filters.activityType.join(", ")}`);
  }

  if (filters.dateRange) {
    parts.push(
      `Date Range: ${formatDate(filters.dateRange.start)} - ${formatDate(
        filters.dateRange.end
      )}`
    );
  }

  return parts.length > 0 ? parts.join(" | ") : "No filters applied";
};

export const generatePDFReport = async (
  data: ReportData,
  template: "NAAC" | "AICTE" | "NIRF" | "Internal",
  filters: ReportFilter
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(`${template} Student Activity Report`, pageWidth / 2, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 20, 35);
  doc.text(`Report Filters: ${getFilterSummary(filters)}`, 20, 45);

  let yPosition = 60;

  // Summary Statistics
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 20, yPosition);
  yPosition += 15;

  const summaryData = [
    ["Total Activities", data.summary.totalActivities.toString()],
    ["Active Students", data.summary.totalStudents.toString()],
    ["Approval Rate", `${data.summary.approvalRate}%`],
    [
      "Academic Activities",
      data.summary.activitiesByType.academic?.toString() || "0",
    ],
    [
      "Extra-curricular Activities",
      data.summary.activitiesByType.extracurricular?.toString() || "0",
    ],
    [
      "Volunteering Activities",
      data.summary.activitiesByType.volunteering?.toString() || "0",
    ],
  ];

  doc.autoTable({
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [66, 139, 202] },
    styles: { fontSize: 10 },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Department-wise breakdown (for NAAC/AICTE format)
  if (template === "NAAC" || template === "AICTE") {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Department-wise Activity Distribution", 20, yPosition);
    yPosition += 15;

    const deptData = Object.entries(data.summary.activitiesByDepartment).map(
      ([dept, count]) => [
        dept,
        count.toString(),
        `${Math.round((count / data.summary.totalActivities) * 100)}%`,
      ]
    );

    doc.autoTable({
      startY: yPosition,
      head: [["Department", "Activities", "Percentage"]],
      body: deptData,
      theme: "grid",
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Monthly trends (for NIRF format)
  if (template === "NIRF") {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Activity Trends", 20, yPosition);
    yPosition += 15;

    const trendsData = data.summary.monthlyTrends.map((trend) => [
      trend.month,
      trend.count.toString(),
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [["Month", "Activities"]],
      body: trendsData,
      theme: "grid",
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Detailed activity list (for Internal format or all formats)
  if (template === "Internal" || data.activities.length <= 50) {
    doc.addPage();
    yPosition = 20;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Activity List", 20, yPosition);
    yPosition += 15;

    const activityData = data.activities
      .slice(0, 100)
      .map((activity) => [
        activity.studentName,
        activity.title,
        activity.type,
        formatDate(activity.date),
        activity.status,
      ]);

    doc.autoTable({
      startY: yPosition,
      head: [["Student", "Activity", "Type", "Date", "Status"]],
      body: activityData,
      theme: "grid",
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 8 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        1: { cellWidth: 60 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
      },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount} | Student Activity Platform | ${template} Report`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `${template}_Activity_Report_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
};

export const generateExcelReport = async (
  data: ReportData,
  template: "NAAC" | "AICTE" | "NIRF" | "Internal",
  filters: ReportFilter
) => {
  const workbook = XLSX.utils.book_new();

  // Summary Sheet
  const summaryData = [
    ["Student Activity Report - " + template],
    ["Generated on:", new Date().toLocaleDateString("en-IN")],
    ["Report Filters:", getFilterSummary(filters)],
    [""],
    ["Executive Summary"],
    ["Metric", "Value"],
    ["Total Activities", data.summary.totalActivities],
    ["Active Students", data.summary.totalStudents],
    ["Approval Rate", `${data.summary.approvalRate}%`],
    ["Academic Activities", data.summary.activitiesByType.academic || 0],
    [
      "Extra-curricular Activities",
      data.summary.activitiesByType.extracurricular || 0,
    ],
    [
      "Volunteering Activities",
      data.summary.activitiesByType.volunteering || 0,
    ],
    [""],
    ["Department-wise Distribution"],
    ["Department", "Activities", "Percentage"],
    ...Object.entries(data.summary.activitiesByDepartment).map(
      ([dept, count]) => [
        dept,
        count,
        `${Math.round((count / data.summary.totalActivities) * 100)}%`,
      ]
    ),
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Activities Sheet
  const activitiesData = [
    [
      "Student Name",
      "Activity Title",
      "Activity Type",
      "Date",
      "Status",
      "Description",
      "Reviewed By",
      "Feedback",
    ],
  ];

  data.activities.forEach((activity) => {
    activitiesData.push([
      activity.studentName,
      activity.title,
      activity.type,
      formatDate(activity.date),
      activity.status,
      activity.description,
      activity.reviewedBy || "",
      activity.feedback || "",
    ]);
  });

  const activitiesSheet = XLSX.utils.aoa_to_sheet(activitiesData);
  XLSX.utils.book_append_sheet(workbook, activitiesSheet, "Activities");

  // Students Sheet
  const studentsData = [
    [
      "Student Name",
      "Email",
      "Course/Department",
      "Year",
      "Total Activities",
      "Approved Activities",
    ],
  ];

  data.students.forEach((student) => {
    const studentActivities = data.activities.filter(
      (a) => a.studentId === student.id
    );
    const approvedActivities = studentActivities.filter(
      (a) => a.status === "approved"
    );

    studentsData.push([
      student.name,
      student.email,
      student.course || student.department || "",
      student.year?.toString() || "",
      studentActivities.length.toString(),
      approvedActivities.length.toString(),
    ]);
  });

  const studentsSheet = XLSX.utils.aoa_to_sheet(studentsData);
  XLSX.utils.book_append_sheet(workbook, studentsSheet, "Students");

  // Monthly Trends Sheet (for NIRF and Internal formats)
  if (template === "NIRF" || template === "Internal") {
    const trendsData = [
      ["Month", "Activity Count"],
      ...data.summary.monthlyTrends.map((trend) => [trend.month, trend.count]),
    ];

    const trendsSheet = XLSX.utils.aoa_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(workbook, trendsSheet, "Monthly Trends");
  }

  // NAAC/AICTE specific sheets
  if (template === "NAAC" || template === "AICTE") {
    // Criteria-wise breakdown
    const criteriaData = [
      ["Criteria", "Academic", "Extra-curricular", "Volunteering", "Total"],
      [
        "Student Participation",
        data.summary.activitiesByType.academic || 0,
        data.summary.activitiesByType.extracurricular || 0,
        data.summary.activitiesByType.volunteering || 0,
        data.summary.totalActivities,
      ],
      [
        "Approval Rate",
        `${Math.round(
          (data.activities.filter(
            (a) => a.type === "academic" && a.status === "approved"
          ).length /
            (data.summary.activitiesByType.academic || 1)) *
            100
        )}%`,
        `${Math.round(
          (data.activities.filter(
            (a) => a.type === "extracurricular" && a.status === "approved"
          ).length /
            (data.summary.activitiesByType.extracurricular || 1)) *
            100
        )}%`,
        `${Math.round(
          (data.activities.filter(
            (a) => a.type === "volunteering" && a.status === "approved"
          ).length /
            (data.summary.activitiesByType.volunteering || 1)) *
            100
        )}%`,
        `${data.summary.approvalRate}%`,
      ],
    ];

    const criteriaSheet = XLSX.utils.aoa_to_sheet(criteriaData);
    XLSX.utils.book_append_sheet(
      workbook,
      criteriaSheet,
      template + " Criteria"
    );
  }

  // Save the Excel file
  const fileName = `${template}_Activity_Report_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data_blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(data_blob, fileName);
};
