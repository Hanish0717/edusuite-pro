export type FinanceSubmodule =
  | "dashboard"
  | "payments"
  | "structure"
  | "scholarships"
  | "history"
  | "receipts"
  | "refunds"
  | "nodue";

export interface StudentFinanceSummary {
  studentId: string;
  rollNumber: string;
  studentName: string;
  branch: string;
  academicYear: string;
  currentSemester: number;
  totalAcademicFee: number;
  amountPaid: number;
  pendingAmount: number;
  scholarshipAmount: number;
  concessionAmount: number;
  nextDueDate: string;
  installmentsPaid: number;
  installmentsTotal: number;
  lateFeeCharged: number;
  convenienceCharge: number;
  paymentStatus: "Paid" | "Partially Paid" | "Overdue" | "Pending";
}

export interface FeeHeadItem {
  id: string;
  feeHead: string;
  category: "Academic" | "Library" | "Exam" | "Hostel" | "Transport" | "Miscellaneous";
  semester: number;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  lateFee: number;
  description: string;
}

export interface PaymentRecordItem {
  transactionId: string;
  date: string;
  amount: number;
  paymentMode: "UPI" | "Credit Card" | "Debit Card" | "Net Banking" | "Wallet" | "Bank Transfer";
  referenceNumber: string;
  status: "Success" | "Pending" | "Failed";
  semester: number;
  receiptNumber: string;
  feeHead: string;
}

export interface ReceiptItem {
  receiptNumber: string;
  transactionId: string;
  amount: number;
  paymentDate: string;
  paymentMode: string;
  academicYear: string;
  semester: number;
  downloadUrl?: string;
  qrVerified: boolean;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  category: "Government Scheme" | "Institution Scholarship" | "Merit Scholarship";
  approvedAmount: number;
  status: "Approved" | "Under Verification font-mono" | "Submitted" | "Rejected";
  approvalStage: "Document Verification" | "HOD Approval" | "Finance Officer Disbursal" | "Completed";
  renewalDate: string;
  appliedDate: string;
  disbursedAmount: number;
}

export interface RefundRequestItem {
  requestId: string;
  amount: number;
  reason: string;
  submittedDate: string;
  approvalStatus: "Under Review" | "Approved" | "Processed" | "Rejected";
  processingStage: "Document Audit" | "Bank Transfer Pending" | "Completed";
  expectedRefundDate: string;
}

export interface NoDueClearanceItem {
  department: "Library" | "Hostel" | "Transport" | "Finance" | "Academic / Department";
  clearanceStatus: "Approved" | "Pending" | "Blocked";
  clearedBy: string;
  clearedDate?: string;
  remarks: string;
  amountDue: number;
}

export interface InstallmentItem {
  installmentNo: number;
  dueDate: string;
  amount: number;
  status: "Paid" | "Upcoming" | "Overdue";
  paidDate?: string;
}
