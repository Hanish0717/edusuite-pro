export type RequestPriority = "Low" | "Medium" | "High" | "Critical";

export type RequestStatus = "Pending" | "Under Review" | "Approved" | "Rejected" | "Returned";

export type RequestSort = "Newest" | "Oldest" | "Priority" | "Department" | "Status";

export type RequestType =
  | "Faculty Subject Assignment"
  | "Course Allocation"
  | "Department Creation"
  | "Curriculum Revision"
  | "Subject Creation"
  | "Subject Modification"
  | "Timetable Approval"
  | "Attendance Correction"
  | "Attendance Override"
  | "Leave Approval Recommendation"
  | "Exam Schedule Approval"
  | "Hall Allocation Approval"
  | "Invigilator Approval"
  | "Result Approval"
  | "Result Publication"
  | "Student Promotion"
  | "Academic Calendar Update"
  | "Classroom Allocation"
  | "Laboratory Allocation"
  | "Regulation Update";

export interface ApprovalComment {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
}

export interface ApprovalHistoryItem {
  id: string;
  stage: string;
  status: RequestStatus | "Submitted" | "Published";
  timestamp: string;
  actor: string;
  note: string;
}

export interface ApprovalAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
}

export interface ApprovalRequest {
  id: string;
  requestType: RequestType;
  department: string;
  program: string;
  requestedBy: string;
  submittedDate: string;
  priority: RequestPriority;
  status: RequestStatus;
  description: string;
  academicYear: string;
  supportingInformation: string[];
  attachments: ApprovalAttachment[];
  comments: ApprovalComment[];
  history: ApprovalHistoryItem[];
  pendingSince?: string;
  dueDate?: string;
  resolvedOn?: string;
  currentStage?: string;
}

export interface ApprovalNotification {
  id: string;
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  unread: boolean;
}

export interface ApprovalActivity {
  id: string;
  title: string;
  detail: string;
  actor: string;
  timestamp: string;
  tone: "success" | "warning" | "info" | "muted";
}

export interface ApprovalReportCard {
  id: string;
  title: string;
  description: string;
  metric: string;
  delta: string;
}

export interface ApprovalFiltersState {
  search: string;
  requestType: string;
  department: string;
  program: string;
  requestedBy: string;
  priority: string;
  status: string;
  submissionDate: string;
  academicYear: string;
  sortBy: RequestSort;
}

export interface ApprovalCenterModuleViewProps {
  mode?: "loaded" | "loading" | "empty" | "error";
  errorMessage?: string;
  onRetry?: () => void;
}
