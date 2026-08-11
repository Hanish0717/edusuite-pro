export interface StudentRecord {
  id: string;
  rollNo: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  department: string;
  academicYear: string;
  semester: number;
  batchCode: string;
  section: string;
  cgpa: number;
  attendancePct: number;
  feeStatus: "Paid" | "Pending" | "Partial";
  feeAmount: number;
  feePaid: number;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Graduated" | "Risk";
  hostelResident: boolean;
  hostelRoom?: string;
  transportUser: boolean;
  transportRoute?: string;
  placementEligible: boolean;
  placementStatus?: "Applied" | "Placed" | "Unplaced" | "In-Progress";
  scholarshipStudent: boolean;
}

export interface StudentFilters {
  search: string;
  department: string;
  academicYear: string;
  feeStatus: string;
  status: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  status: "Verified" | "Pending" | "Rejected";
  uploadedAt: string;
  fileUrl: string;
}

export interface StudentTimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "academic" | "finance" | "hostel" | "transport" | "placement" | "system";
  actor: string;
}

export interface StudentConnections {
  attendanceUrl: string;
  libraryUrl: string;
  transportUrl: string;
  financeUrl: string;
  placementUrl: string;
  hostelUrl: string;
  lmsUrl: string;
}

export interface StandardQueryParams {
  search?: string;
  filters?: Record<string, any>;
  sort?: { field: string; order: "asc" | "desc" };
  pagination?: { page: number; limit: number };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
