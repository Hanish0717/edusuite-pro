export interface FacultyFeedbackForm {
  facultyName: string;
  subject: string;
  semester: string;
  teachingQuality: number;
  communication: number;
  punctuality: number;
  courseCoverage: number;
  comments: string;
}

export interface CourseFeedbackForm {
  courseName: string;
  laboratory: number;
  assignments: number;
  courseMaterial: number;
  difficulty: number;
  overallRating: number;
  remarks: string;
}

export interface FeedbackSummaryKPIs {
  facultyFeedbackSubmitted: number;
  pendingFeedback: number;
  openGrievances: number;
  serviceRequests: number;
}

export interface ActiveSurveyItem {
  id: string;
  title: string;
  facultyName: string;
  subject: string;
  semester: string;
  dueDate: string;
  status: "Pending" | "Completed";
  type: "Faculty" | "Course";
}

export interface GrievanceCategoryItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  badge: string;
}

export interface GrievanceRecord {
  id: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  title: string;
  description: string;
  date: string;
  status: "Submitted" | "Under Review" | "Committee Assigned" | "Resolved";
  department: string;
  attachmentName?: string;
}

export interface StudentServiceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  fee: string;
  estimatedDays: string;
  department: string;
}

export interface HistoryRecord {
  id: string;
  type: "Faculty Feedback" | "Course Feedback" | "Grievance" | "Service Request";
  title: string;
  date: string;
  status: "Pending" | "In Progress" | "Approved" | "Resolved" | "Submitted" | "Rejected";
  department: string;
  referenceId: string;
  details?: string;
}
