import type { DepartmentCode } from "@/config/roles";

export interface AttendancePrediction {
  studentId: string;
  name: string;
  department: DepartmentCode;
  currentAttendance: number;
  predictedAttendance: number;
  confidence: number; // percentage (e.g. 92)
  risk: "Low" | "Medium" | "High" | "Critical";
}

export interface StudentRisk {
  studentId: string;
  name: string;
  department: DepartmentCode;
  attendance: number;
  internalMarks: number; // e.g. 68%
  cgpa: number;
  feeStatus: "Paid" | "Pending" | "Overdue";
  riskScore: number; // 0 - 100
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  type?: "text" | "table" | "chart";
  data?: any;
}

export interface AnalyticsReport {
  id: string;
  title: string;
  category: string;
  lastGenerated: string;
  formats: ("PDF" | "Excel" | "CSV")[];
  size: string;
}

export interface AITriggerNotification {
  id: string;
  studentId: string;
  studentName: string;
  triggerType: "Attendance Shortage" | "Internal Performance" | "Fee Due" | "Exam Registry" | "Library Overdue" | "Hostel Alert" | "Transport Delay";
  channel: "Email" | "SMS" | "In-App" | "All";
  recipient: "Student" | "Parent" | "Faculty" | "HOD" | "All";
  message: string;
  timestamp: string;
  status: "Sent" | "Failed" | "Pending";
}
