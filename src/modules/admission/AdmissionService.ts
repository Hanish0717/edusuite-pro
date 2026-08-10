import api from "@/lib/api";
import { createStudentRecord } from "@/modules/students/StudentsService";

export type QuotaCategory = "Category A (Convener / EAPCET)" | "Category B (Management Quota)";

export type CategoryASocialGroup = "OC" | "BC-A" | "BC-B" | "BC-C" | "BC-D" | "BC-E" | "SC" | "ST" | "EWS";

export type GranularDocumentStatus = "Verified" | "Pending" | "Rejected";

export type AdmissionLifecycleStage =
  | "Application Submitted"
  | "Documents Uploaded"
  | "Documents Verified"
  | "Seat Allocated"
  | "Fee Paid"
  | "Admission Approved"
  | "Student ID Generated"
  | "ERP Activated"
  | "Waitlisted"
  | "Rejected";

export interface ConvenerQuotaDetails {
  eamcetHallTicketNo: string;
  eamcetRank: number;
  allotmentOrderNo: string;
  category: CategoryASocialGroup;
  allottedBranch: string;
  counselingPhase: "Phase 1" | "Phase 2" | "Final Phase" | "Spot Admission";
  reservationVerified: boolean;
  isGovtFeeReimbursementEligible: boolean;
  reimbursementScheme?: "AP Jagananna Vidya Deevena" | "Telangana ePASS" | "N/A" | undefined;
}

export interface ManagementQuotaDetails {
  fatherName: string;
  dob: string;
  tenthPercentage: number;
  interPercentage: number;
  mpcPercentage: number;
  boardName: string;
  passingYear: number;
  preferredBranch: string;
  secondaryBranchPref?: string | undefined;
  tertiaryBranchPref?: string | undefined;
  interviewStatus?: "Not Required" | "Scheduled" | "Completed / Cleared" | undefined;
  seatAvailabilityStatus: "Available" | "Waitlisted" | "Allocated";
  feeQuotationGiven?: number | undefined;
}

export interface DocumentVerificationItem {
  name: string;
  required: boolean;
  status: GranularDocumentStatus;
  uploadedFileName?: string | undefined;
  uploadedTime?: string | undefined;
  verifiedAt?: string | undefined;
  verifiedBy?: string | undefined;
  remarks?: string | undefined;
}

export interface FeeBreakdown {
  tuitionFee: number;
  developmentFee: number;
  specialFee: number;
  govtReimbursement: number;
  scholarshipDiscount: number;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  seatLockStatus: "Unreserved" | "Seat Reserved" | "Seat Locked";
  paymentRef?: string | undefined;
  paymentMethod?: "Online UPI" | "Net Banking" | "Bank Challan / DD" | "Cash" | undefined;
  paymentDate?: string | undefined;
  receiptNumber?: string | undefined;
  qrVerificationCode?: string | undefined;
}

export interface AuditTrailItem {
  id: string;
  officerName: string;
  action: string;
  timestamp: string;
  remarks?: string | undefined;
}

export interface ERPActivationModuleStatus {
  studentAccount: boolean;
  parentAccount: boolean;
  feeAccount: boolean;
  attendanceRecord: boolean;
  libraryMembership: boolean;
  hostelRecord: boolean;
  transportRecord: boolean;
  lmsAccount: boolean;
  placementProfile: boolean;
  notifications: boolean;
}

export interface Provisioned10ModulesDetails {
  studentAccountId: string;
  parentAccountId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  feeAccountId: string;
  attendanceRecordId: string;
  libraryMembershipId: string;
  hostelRecordId: string;
  transportRecordId: string;
  lmsAccountId: string;
  placementProfileId: string;
  rollNumber: string;
  admissionNumber: string;
  collegeEmail: string;
  tempPassword: string;
  department: string;
  section: "Section A" | "Section B" | "Section C";
  academicYear: string;
  semester: string;
  idCardIssued: boolean;
  qrVerificationCode: string;
  activationProgress: ERPActivationModuleStatus;
}

export interface NotificationLog {
  id: string;
  title: string;
  message: string;
  type: "Application Submitted" | "Documents Pending" | "Documents Verified" | "Seat Allocated" | "Fee Reminder" | "Admission Approved" | "Login Credentials" | "Welcome Email" | "Waitlisted";
  timestamp: string;
  channel: "Email & SMS";
  dispatchedTo: string;
}

export interface AdmissionApplication {
  id: string;
  quota: QuotaCategory;
  name: string;
  email: string;
  phone: string;
  dob?: string | undefined;
  gender?: "Male" | "Female" | "Other" | undefined;
  address?: string | undefined;
  aadhaarNumber?: string | undefined;
  targetBranch: string;
  branchChoices?: string[] | undefined;
  status: AdmissionLifecycleStage;
  currentWorkflowStep: number; // 1 to 9
  dateSubmitted: string;
  admissionNumber?: string | undefined;
  waitlistPosition?: number | undefined;
  
  // Payloads
  convenerDetails?: ConvenerQuotaDetails | undefined;
  managementDetails?: ManagementQuotaDetails | undefined;
  
  // Verification and Financials
  documents: Record<string, DocumentVerificationItem>;
  fee: FeeBreakdown;

  // Audit Logs & ERP Connections
  auditTrail: AuditTrailItem[];
  provisionedStudent?: Provisioned10ModulesDetails | undefined;
  notificationsLog?: NotificationLog[] | undefined;
  remarks?: string | undefined;
  qrVerificationCode?: string | undefined;
}

export interface SuperAdminAdmissionSettings {
  academicYear: string;
  admissionYear: string;
  admissionStartDate: string;
  admissionEndDate: string;
  categoryASeatPct: number;
  categoryBSeatPct: number;
  departmentIntakes: Record<string, number>;
  feeStructure: {
    convenerTuitionFee: number;
    convenerDevFee: number;
    managementTuitionFee: number;
    managementDevFee: number;
    specialFee: number;
  };
  scholarshipRules: {
    govtReimbursementEnabled: boolean;
    meritDiscountPctAbove95: number;
  };
  mandatoryDocuments: string[];
}

export const DEFAULT_ADMISSION_SETTINGS: SuperAdminAdmissionSettings = {
  academicYear: "2026-2027",
  admissionYear: "2026",
  admissionStartDate: "2026-06-01",
  admissionEndDate: "2026-09-30",
  categoryASeatPct: 70,
  categoryBSeatPct: 30,
  departmentIntakes: {
    "Computer Science & Engineering (CSE)": 180,
    "Electronics & Communication (ECE)": 135,
    "Artificial Intelligence & Data Science (AI&DS)": 90,
    "Electrical & Electronics (EEE)": 90,
    "Mechanical Engineering (ME)": 90,
    "Civil Engineering (CE)": 90,
  },
  feeStructure: {
    convenerTuitionFee: 70000,
    convenerDevFee: 5000,
    managementTuitionFee: 130000,
    managementDevFee: 15000,
    specialFee: 3000,
  },
  scholarshipRules: {
    govtReimbursementEnabled: true,
    meritDiscountPctAbove95: 10000,
  },
  mandatoryDocuments: ["10th SSC Memo", "12th Inter Memo", "Transfer Certificate (TC)", "Aadhaar Card Copy", "Passport Photo"],
};

export interface DetailedSeatMatrixItem {
  department: string;
  shortCode: string;
  totalIntake: number;
  categoryASeats: number;
  categoryBSeats: number;
  filledCategoryA: number;
  filledCategoryB: number;
  filledTotal: number;
  availableCategoryA: number;
  availableCategoryB: number;
  availableTotal: number;
  waitlistedCount: number;
}

export const INITIAL_DETAILED_SEAT_MATRIX: DetailedSeatMatrixItem[] = [
  { department: "Computer Science & Engineering (CSE)", shortCode: "CSE", totalIntake: 180, categoryASeats: 126, categoryBSeats: 54, filledCategoryA: 112, filledCategoryB: 48, filledTotal: 160, availableCategoryA: 14, availableCategoryB: 6, availableTotal: 20, waitlistedCount: 0 },
  { department: "Electronics & Communication (ECE)", shortCode: "ECE", totalIntake: 135, categoryASeats: 95, categoryBSeats: 40, filledCategoryA: 82, filledCategoryB: 32, filledTotal: 114, availableCategoryA: 13, availableCategoryB: 8, availableTotal: 21, waitlistedCount: 0 },
  { department: "Artificial Intelligence & Data Science (AI&DS)", shortCode: "AI&DS", totalIntake: 90, categoryASeats: 63, categoryBSeats: 27, filledCategoryA: 58, filledCategoryB: 24, filledTotal: 82, availableCategoryA: 5, availableCategoryB: 3, availableTotal: 8, waitlistedCount: 0 },
  { department: "Electrical & Electronics (EEE)", shortCode: "EEE", totalIntake: 90, categoryASeats: 63, categoryBSeats: 27, filledCategoryA: 42, filledCategoryB: 16, filledTotal: 58, availableCategoryA: 21, availableCategoryB: 11, availableTotal: 32, waitlistedCount: 0 },
  { department: "Mechanical Engineering (ME)", shortCode: "ME", totalIntake: 90, categoryASeats: 63, categoryBSeats: 27, filledCategoryA: 35, filledCategoryB: 12, filledTotal: 47, availableCategoryA: 28, availableCategoryB: 15, availableTotal: 43, waitlistedCount: 0 },
  { department: "Civil Engineering (CE)", shortCode: "CE", totalIntake: 90, categoryASeats: 63, categoryBSeats: 27, filledCategoryA: 28, filledCategoryB: 10, filledTotal: 38, availableCategoryA: 35, availableCategoryB: 17, availableTotal: 52, waitlistedCount: 0 },
];

export function generateVerificationQRCode(text: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="#ffffff" />
    <path d="M10 10h30v30h-30zM15 15v20h20v-20zM20 20h10v10h-10z" fill="#0f172a" />
    <path d="M60 10h30v30h-30zM65 15v20h20v-20zM70 20h10v10h-10z" fill="#0f172a" />
    <path d="M10 60h30v30h-30zM15 65v20h20v-20zM20 70h10v10h-10z" fill="#0f172a" />
    <path d="M45 10h10v20h-10zM10 45h20v10h-20zM45 45h10v10h-10zM60 45h25v10h-25zM45 60h10v30h-10zM60 60h15v10h-15zM75 70h15v20h-15z" fill="#0f172a" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateStandardizedAdmissionNumber(year: string, dept: string, sequence: number): string {
  let deptCode = "CSE";
  if (dept.includes("Electronics")) deptCode = "ECE";
  else if (dept.includes("Artificial")) deptCode = "AIDS";
  else if (dept.includes("Electrical")) deptCode = "EEE";
  else if (dept.includes("Mechanical")) deptCode = "ME";
  else if (dept.includes("Civil")) deptCode = "CE";

  const seqPadded = sequence.toString().padStart(4, "0");
  return `${year}${deptCode}${seqPadded}`;
}

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: "PRE-2026-101",
    quota: "Category A (Convener / EAPCET)",
    name: "Sai Kumar Reddy",
    email: "saikumar.reddy@gmail.com",
    phone: "+91 9849012345",
    aadhaarNumber: "8842-1049-9021",
    dob: "2008-03-12",
    gender: "Male",
    address: "Door No. 12-4, Guntur, AP",
    targetBranch: "Computer Science & Engineering (CSE)",
    branchChoices: ["Computer Science & Engineering (CSE)", "Artificial Intelligence & Data Science (AI&DS)"],
    status: "ERP Activated",
    currentWorkflowStep: 8,
    dateSubmitted: "2026-07-20",
    admissionNumber: "2026CSE0001",
    qrVerificationCode: generateVerificationQRCode("PRE-2026-101|Sai Kumar Reddy|2026CSE0001"),
    convenerDetails: {
      eamcetHallTicketNo: "2451098432",
      eamcetRank: 8450,
      allotmentOrderNo: "AP-EAMCET-2026-77821",
      category: "OC",
      allottedBranch: "Computer Science & Engineering (CSE)",
      counselingPhase: "Phase 1",
      reservationVerified: true,
      isGovtFeeReimbursementEligible: true,
      reimbursementScheme: "AP Jagananna Vidya Deevena",
    },
    documents: {
      rankCard: { name: "EAPCET Rank Card", required: true, status: "Verified", uploadedFileName: "EAPCET_RankCard_2451098432.pdf", verifiedAt: "2026-07-21", verifiedBy: "Ramesh Kumar" },
      allotmentOrder: { name: "Govt Allotment Order", required: true, status: "Verified", uploadedFileName: "Allotment_77821.pdf", verifiedAt: "2026-07-21", verifiedBy: "Ramesh Kumar" },
      marksheet10th: { name: "10th SSC Memo", required: true, status: "Verified", uploadedFileName: "10th_Memo.pdf", verifiedAt: "2026-07-21", verifiedBy: "Ramesh Kumar" },
      marksheet12th: { name: "12th Inter Memo", required: true, status: "Verified", uploadedFileName: "12th_Memo.pdf", verifiedAt: "2026-07-21", verifiedBy: "Ramesh Kumar" },
      tc: { name: "Transfer Certificate (TC)", required: true, status: "Verified", uploadedFileName: "TC_Original.pdf", verifiedAt: "2026-07-21", verifiedBy: "Ramesh Kumar" },
      aadhaar: { name: "Aadhaar Card Copy", required: true, status: "Verified", uploadedFileName: "Aadhaar.pdf", verifiedAt: "2026-07-21", verifiedBy: "Ramesh Kumar" },
    },
    fee: {
      tuitionFee: 70000,
      developmentFee: 5000,
      specialFee: 3000,
      govtReimbursement: 70000,
      scholarshipDiscount: 0,
      totalFee: 78000,
      paidAmount: 8000,
      pendingAmount: 0,
      paymentStatus: "Paid",
      seatLockStatus: "Seat Locked",
      paymentRef: "UPI/20260722/992813",
      paymentMethod: "Online UPI",
      paymentDate: "2026-07-22",
      receiptNumber: "REC-2026-8801",
      qrVerificationCode: generateVerificationQRCode("REC-2026-8801|₹8000|Paid"),
    },
    auditTrail: [
      { id: "AUD-1", officerName: "System Engine", action: "Application Created", timestamp: "2026-07-20 10:30 AM", remarks: "Candidate portal submission" },
      { id: "AUD-2", officerName: "Ramesh Kumar (Admission Officer)", action: "Documents Verified", timestamp: "2026-07-21 10:45 AM", remarks: "All original certificates verified" },
      { id: "AUD-3", officerName: "Srinivas Rao (Accounts Officer)", action: "Fee Settlement & Seat Lock", timestamp: "2026-07-22 11:00 AM", remarks: "Seat locked in CSE Sec A" },
    ],
    provisionedStudent: {
      studentAccountId: "STU-1006",
      parentAccountId: "PAR-209",
      parentName: "Venkata Reddy",
      parentPhone: "+91 9849012345",
      parentEmail: "venkat.reddy@gmail.com",
      feeAccountId: "FEE-ACC-8801",
      attendanceRecordId: "ATT-2026CSE0001",
      libraryMembershipId: "LIB-2026CSE0001",
      hostelRecordId: "HST-ROOM-304",
      transportRecordId: "TRN-BUS-04",
      lmsAccountId: "LMS-2026CSE0001",
      placementProfileId: "PLC-2026CSE0001",
      rollNumber: "26CSE-A-012",
      admissionNumber: "2026CSE0001",
      collegeEmail: "saikumar.reddy@edusuite.edu.in",
      tempPassword: "Edu@2026Student",
      department: "CSE",
      section: "Section A",
      academicYear: "2026-2027",
      semester: "Semester 1",
      idCardIssued: true,
      qrVerificationCode: generateVerificationQRCode("2026CSE0001|Sai Kumar Reddy|CSE"),
      activationProgress: {
        studentAccount: true,
        parentAccount: true,
        feeAccount: true,
        attendanceRecord: true,
        libraryMembership: true,
        hostelRecord: true,
        transportRecord: true,
        lmsAccount: true,
        placementProfile: true,
        notifications: true,
      },
    },
    notificationsLog: [
      { id: "NOTIF-1", title: "Application Submitted", message: "Application PRE-2026-101 submitted.", type: "Application Submitted", timestamp: "2026-07-20 10:30 AM", channel: "Email & SMS", dispatchedTo: "saikumar.reddy@gmail.com" },
      { id: "NOTIF-2", title: "Documents Verified", message: "All documents verified.", type: "Documents Verified", timestamp: "2026-07-21 10:45 AM", channel: "Email & SMS", dispatchedTo: "saikumar.reddy@gmail.com" },
      { id: "NOTIF-3", title: "Seat Locked & ERP Activated", message: "Admission No: 2026CSE0001. Email: saikumar.reddy@edusuite.edu.in", type: "Welcome Email", timestamp: "2026-07-22 11:00 AM", channel: "Email & SMS", dispatchedTo: "saikumar.reddy@gmail.com" },
    ],
  },
];

export async function fetchAdmissionApplications(): Promise<AdmissionApplication[]> {
  try {
    const res = await api.get("/api/admission");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_ADMISSIONS;
}

export function checkDuplicateApplication(
  allApps: AdmissionApplication[],
  payload: { email: string; phone: string; aadhaarNumber?: string; eamcetHallTicketNo?: string }
): AdmissionApplication | null {
  return (
    allApps.find(
      (a) =>
        a.email.toLowerCase() === payload.email.toLowerCase().trim() ||
        a.phone.trim() === payload.phone.trim() ||
        (payload.aadhaarNumber && a.aadhaarNumber === payload.aadhaarNumber.trim()) ||
        (payload.eamcetHallTicketNo &&
          a.convenerDetails &&
          a.convenerDetails.eamcetHallTicketNo === payload.eamcetHallTicketNo.trim())
    ) || null
  );
}

export async function submitCategoryAConvenerApplication(payload: {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  aadhaarNumber?: string;
  eamcetHallTicketNo: string;
  eamcetRank: number;
  allotmentOrderNo: string;
  category: CategoryASocialGroup;
  counselingPhase: ConvenerQuotaDetails["counselingPhase"];
  allottedBranch: string;
  isGovtFeeReimbursementEligible: boolean;
}): Promise<AdmissionApplication> {
  const tFee = 70000;
  const devFee = 5000;
  const specFee = 3000;
  const reimbursement = payload.isGovtFeeReimbursementEligible ? tFee : 0;
  const total = tFee + devFee + specFee;
  const pending = total - reimbursement;

  const appId = `PRE-2026-${Math.floor(105 + Math.random() * 894)}`;
  const qrCode = generateVerificationQRCode(`${appId}|${payload.name}|Category A`);

  const newApp: AdmissionApplication = {
    id: appId,
    quota: "Category A (Convener / EAPCET)",
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    dob: payload.dob,
    gender: payload.gender,
    address: payload.address,
    aadhaarNumber: payload.aadhaarNumber,
    targetBranch: payload.allottedBranch,
    status: "Application Submitted",
    currentWorkflowStep: 1,
    dateSubmitted: new Date().toISOString().split("T")[0] || "",
    qrVerificationCode: qrCode,
    convenerDetails: {
      eamcetHallTicketNo: payload.eamcetHallTicketNo,
      eamcetRank: payload.eamcetRank,
      allotmentOrderNo: payload.allotmentOrderNo,
      category: payload.category,
      allottedBranch: payload.allottedBranch,
      counselingPhase: payload.counselingPhase,
      reservationVerified: true,
      isGovtFeeReimbursementEligible: payload.isGovtFeeReimbursementEligible,
      reimbursementScheme: payload.isGovtFeeReimbursementEligible ? "AP Jagananna Vidya Deevena" : "N/A",
    },
    documents: {
      rankCard: { name: "EAPCET Rank Card", required: true, status: "Pending", uploadedFileName: "EAPCET_Rank.pdf" },
      allotmentOrder: { name: "Govt Counseling Allotment Order", required: true, status: "Pending", uploadedFileName: "Allotment_Order.pdf" },
      marksheet10th: { name: "10th SSC Memo", required: true, status: "Pending", uploadedFileName: "10th_Memo.pdf" },
      marksheet12th: { name: "12th Inter Memo", required: true, status: "Pending", uploadedFileName: "12th_Memo.pdf" },
      tc: { name: "Transfer Certificate (TC)", required: true, status: "Pending", uploadedFileName: "TC_Original.pdf" },
      aadhaar: { name: "Aadhaar Card Copy", required: true, status: "Pending", uploadedFileName: "Aadhaar.pdf" },
    },
    fee: {
      tuitionFee: tFee,
      developmentFee: devFee,
      specialFee: specFee,
      govtReimbursement: reimbursement,
      scholarshipDiscount: 0,
      totalFee: total,
      paidAmount: 0,
      pendingAmount: pending,
      paymentStatus: pending === 0 ? "Paid" : "Unpaid",
      seatLockStatus: "Seat Reserved",
    },
    auditTrail: [
      { id: `AUD-${Date.now()}`, officerName: "Candidate Self-Service", action: "Submitted Application", timestamp: new Date().toLocaleString(), remarks: "Category A application created" },
    ],
    notificationsLog: [
      {
        id: `NOTIF-${Date.now()}`,
        title: "Category A Application Submitted",
        message: `Your Category A application (${appId}) was received. Department: ${payload.allottedBranch}.`,
        type: "Application Submitted",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: "Email & SMS",
        dispatchedTo: payload.email,
      },
    ],
  };

  try {
    const res = await api.post("/api/admission", newApp);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  return newApp;
}

export async function submitCategoryBManagementApplication(payload: {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  fatherName: string;
  tenthPercentage: number;
  interPercentage: number;
  mpcPercentage: number;
  boardName: string;
  preferredBranch: string;
  secondaryBranchPref?: string;
  tertiaryBranchPref?: string;
}): Promise<AdmissionApplication> {
  const tFee = 130000;
  const devFee = 15000;
  const specFee = 5000;
  const total = tFee + devFee + specFee;

  const appId = `PRE-2026-${Math.floor(105 + Math.random() * 894)}`;
  const qrCode = generateVerificationQRCode(`${appId}|${payload.name}|Category B`);

  const newApp: AdmissionApplication = {
    id: appId,
    quota: "Category B (Management Quota)",
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    dob: payload.dob,
    gender: payload.gender,
    address: payload.address,
    targetBranch: payload.preferredBranch,
    branchChoices: [payload.preferredBranch, payload.secondaryBranchPref, payload.tertiaryBranchPref].filter(Boolean) as string[],
    status: "Application Submitted",
    currentWorkflowStep: 1,
    dateSubmitted: new Date().toISOString().split("T")[0] || "",
    qrVerificationCode: qrCode,
    managementDetails: {
      fatherName: payload.fatherName,
      dob: payload.dob,
      tenthPercentage: payload.tenthPercentage,
      interPercentage: payload.interPercentage,
      mpcPercentage: payload.mpcPercentage,
      boardName: payload.boardName,
      passingYear: 2026,
      preferredBranch: payload.preferredBranch,
      secondaryBranchPref: payload.secondaryBranchPref,
      tertiaryBranchPref: payload.tertiaryBranchPref,
      interviewStatus: "Scheduled",
      seatAvailabilityStatus: "Available",
      feeQuotationGiven: total,
    },
    documents: {
      marksheet10th: { name: "10th SSC Marksheet", required: true, status: "Pending", uploadedFileName: "10th_Memo.pdf" },
      marksheet12th: { name: "12th Inter Marks Memo", required: true, status: "Pending", uploadedFileName: "12th_Memo.pdf" },
      aadhaarCard: { name: "Aadhaar Card Copy", required: true, status: "Pending", uploadedFileName: "Aadhaar.pdf" },
      studyCerts: { name: "Study Certificates", required: true, status: "Pending", uploadedFileName: "Study_Certs.pdf" },
    },
    fee: {
      tuitionFee: tFee,
      developmentFee: devFee,
      specialFee: specFee,
      govtReimbursement: 0,
      scholarshipDiscount: 0,
      totalFee: total,
      paidAmount: 0,
      pendingAmount: total,
      paymentStatus: "Unpaid",
      seatLockStatus: "Seat Reserved",
    },
    auditTrail: [
      { id: `AUD-${Date.now()}`, officerName: "Candidate Self-Service", action: "Submitted Category B App", timestamp: new Date().toLocaleString(), remarks: "Category B Direct Merit" },
    ],
    notificationsLog: [
      {
        id: `NOTIF-${Date.now()}`,
        title: "Category B Application Submitted",
        message: `Management Quota application (${appId}) submitted. Target: ${payload.preferredBranch}.`,
        type: "Application Submitted",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: "Email & SMS",
        dispatchedTo: payload.email,
      },
    ],
  };

  try {
    const res = await api.post("/api/admission", newApp);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  return newApp;
}

export function updateGranularDocumentStatus(
  app: AdmissionApplication,
  docKey: string,
  newStatus: GranularDocumentStatus,
  officerName: string = "Ramesh Kumar (Officer)",
  remarks?: string
): AdmissionApplication {
  const updatedDocs = { ...app.documents };
  if (updatedDocs[docKey]) {
    updatedDocs[docKey] = {
      ...updatedDocs[docKey],
      status: newStatus,
      verifiedAt: newStatus === "Verified" ? new Date().toISOString().split("T")[0] : undefined,
      verifiedBy: officerName,
      remarks: remarks || updatedDocs[docKey].remarks,
    };
  }

  const allVerified = Object.values(updatedDocs).every((d) => !d.required || d.status === "Verified");
  const anyRejected = Object.values(updatedDocs).some((d) => d.status === "Rejected");

  const newLifecycleStatus: AdmissionLifecycleStage = anyRejected
    ? "Documents Uploaded"
    : allVerified
    ? "Documents Verified"
    : "Documents Uploaded";

  const auditItem: AuditTrailItem = {
    id: `AUD-${Date.now()}`,
    officerName: officerName,
    action: `Document ${updatedDocs[docKey]?.name}: ${newStatus}`,
    timestamp: new Date().toLocaleString(),
    remarks: remarks || `Marked status as ${newStatus}`,
  };

  return {
    ...app,
    documents: updatedDocs,
    status: newLifecycleStatus,
    currentWorkflowStep: allVerified ? 3 : 2,
    auditTrail: [auditItem, ...app.auditTrail],
  };
}

export function recordFeePayment(
  app: AdmissionApplication,
  amountPaid: number,
  payRef: string,
  payMethod: FeeBreakdown["paymentMethod"] = "Online UPI",
  officerName: string = "Srinivas Rao (Accounts)"
): AdmissionApplication {
  const currentPaid = app.fee.paidAmount + amountPaid;
  const newPending = Math.max(0, app.fee.totalFee - app.fee.govtReimbursement - app.fee.scholarshipDiscount - currentPaid);
  const isFullyPaid = newPending === 0;

  const receiptNo = app.fee.receiptNumber || `REC-2026-${Math.floor(8000 + Math.random() * 1999)}`;
  const receiptQr = generateVerificationQRCode(`${receiptNo}|₹${amountPaid}|${payRef}`);

  const newFee: FeeBreakdown = {
    ...app.fee,
    paidAmount: currentPaid,
    pendingAmount: newPending,
    paymentStatus: isFullyPaid ? "Paid" : "Partial",
    seatLockStatus: isFullyPaid ? "Seat Locked" : "Seat Reserved",
    paymentRef: payRef,
    paymentMethod: payMethod,
    paymentDate: new Date().toISOString().split("T")[0],
    receiptNumber: receiptNo,
    qrVerificationCode: receiptQr,
  };

  const newStatus: AdmissionLifecycleStage = isFullyPaid ? "Fee Paid" : "Documents Verified";
  const step = isFullyPaid ? 5 : 4;

  const auditItem: AuditTrailItem = {
    id: `AUD-${Date.now()}`,
    officerName: officerName,
    action: `Collected Fee ₹${amountPaid.toLocaleString()}`,
    timestamp: new Date().toLocaleString(),
    remarks: `Payment Ref: ${payRef}, Receipt: ${receiptNo}. Seat status: Seat Locked`,
  };

  const notif: NotificationLog = {
    id: `NOTIF-${Date.now()}`,
    title: isFullyPaid ? "Fee Paid - Seat Locked" : "Partial Payment Received",
    message: `Payment of ₹${amountPaid.toLocaleString()} recorded. Receipt No: ${receiptNo}. Seat is Locked.`,
    type: isFullyPaid ? "Admission Approved" : "Fee Reminder",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    channel: "Email & SMS",
    dispatchedTo: app.email,
  };

  return {
    ...app,
    fee: newFee,
    status: newStatus,
    currentWorkflowStep: step,
    auditTrail: [auditItem, ...app.auditTrail],
    notificationsLog: [...(app.notificationsLog || []), notif],
  };
}

export async function provisionFullStudentAndParentAccount(
  app: AdmissionApplication,
  section: "Section A" | "Section B" | "Section C" = "Section A",
  scholarshipDiscount: number = 0,
  officerName: string = "K. V. Raman (Dean Admissions)"
): Promise<{ updatedApp: AdmissionApplication; createdStudent: any }> {
  let dept = "CSE";
  if (app.targetBranch.includes("Electronics")) dept = "ECE";
  else if (app.targetBranch.includes("Artificial")) dept = "AI&DS";
  else if (app.targetBranch.includes("Electrical")) dept = "EEE";
  else if (app.targetBranch.includes("Mechanical")) dept = "ME";
  else if (app.targetBranch.includes("Civil")) dept = "CE";

  const stdAdmNo = generateStandardizedAdmissionNumber("2026", dept, Math.floor(1 + Math.random() * 899));
  const rollNo = `26${dept}-${section.replace("Section ", "")}-${Math.floor(10 + Math.random() * 89)}`;
  const emailName = app.name.toLowerCase().replace(/\s+/g, ".");
  const collegeEmail = `${emailName}@edusuite.edu.in`;

  // Create core student record in Student Information System
  const createdStudent = await createStudentRecord({
    rollNo: rollNo,
    fullName: app.name,
    email: collegeEmail,
    phone: app.phone,
    department: dept,
    academicYear: "Year 1 (Sem 1)",
    batchCode: "2026-2030",
    cgpa: 0.0,
    attendancePct: 100.0,
    feeStatus: app.fee.paymentStatus === "Paid" ? "Paid" : "Pending",
    guardianName: app.managementDetails?.fatherName || "Parent / Guardian",
    guardianPhone: app.phone,
  });

  const studentQr = generateVerificationQRCode(`${stdAdmNo}|${app.name}|${dept}|EduSuite Pro`);

  const provisioned: Provisioned10ModulesDetails = {
    studentAccountId: createdStudent.id,
    parentAccountId: `PAR-${Math.floor(200 + Math.random() * 799)}`,
    parentName: app.managementDetails?.fatherName || "Parent / Guardian",
    parentPhone: app.phone,
    parentEmail: `${emailName}.parent@gmail.com`,
    feeAccountId: `FEE-ACC-${Math.floor(8000 + Math.random() * 1999)}`,
    attendanceRecordId: `ATT-${stdAdmNo}`,
    libraryMembershipId: `LIB-${stdAdmNo}`,
    hostelRecordId: `HST-ROOM-${Math.floor(100 + Math.random() * 399)}`,
    transportRecordId: `TRN-BUS-${Math.floor(1 + Math.random() * 20)}`,
    lmsAccountId: `LMS-${stdAdmNo}`,
    placementProfileId: `PLC-${stdAdmNo}`,
    rollNumber: rollNo,
    admissionNumber: stdAdmNo,
    collegeEmail: collegeEmail,
    tempPassword: `Edu@2026${dept}`,
    department: dept,
    section: section,
    academicYear: "2026-2027",
    semester: "Semester 1",
    idCardIssued: true,
    qrVerificationCode: studentQr,
    activationProgress: {
      studentAccount: true,
      parentAccount: true,
      feeAccount: true,
      attendanceRecord: true,
      libraryMembership: true,
      hostelRecord: true,
      transportRecord: true,
      lmsAccount: true,
      placementProfile: true,
      notifications: true,
    },
  };

  const auditItem: AuditTrailItem = {
    id: `AUD-${Date.now()}`,
    officerName: officerName,
    action: "Approved Admission & Activated ERP",
    timestamp: new Date().toLocaleString(),
    remarks: `Generated Standard Admission No: ${stdAdmNo}, Roll No: ${rollNo}. Activated all 10 ERP modules.`,
  };

  const newLog: NotificationLog = {
    id: `NOTIF-${Date.now()}`,
    title: "Admission Finalized & Credentials Issued",
    message: `Congratulations ${app.name}! Admission No: ${stdAdmNo}, Roll No: ${rollNo}. Email: ${collegeEmail}`,
    type: "Welcome Email",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    channel: "Email & SMS",
    dispatchedTo: app.email,
  };

  const updatedApp: AdmissionApplication = {
    ...app,
    admissionNumber: stdAdmNo,
    status: "ERP Activated",
    currentWorkflowStep: 8,
    provisionedStudent: provisioned,
    auditTrail: [auditItem, ...app.auditTrail],
    notificationsLog: [...(app.notificationsLog || []), newLog],
  };

  try {
    await api.put(`/api/admission/${app.id}`, updatedApp);
  } catch {}

  return { updatedApp, createdStudent };
}

// Backward compatibility helpers
export async function submitPreAdmissionWizardApplication(payload: any): Promise<AdmissionApplication> {
  return submitCategoryAConvenerApplication({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    dob: payload.dob,
    gender: payload.gender,
    address: payload.address,
    eamcetHallTicketNo: `2451${Math.floor(100000 + Math.random() * 899999)}`,
    eamcetRank: payload.entranceRank || 10000,
    allotmentOrderNo: `AP-EAMCET-2026-${Math.floor(10000 + Math.random() * 89999)}`,
    category: "OC",
    counselingPhase: "Phase 1",
    allottedBranch: payload.branch1,
    isGovtFeeReimbursementEligible: true,
  });
}

export async function registerConvenerQuotaApplication(payload: any): Promise<AdmissionApplication> {
  return submitCategoryAConvenerApplication(payload);
}

export async function applyManagementQuotaApplication(payload: any): Promise<AdmissionApplication> {
  return submitCategoryBManagementApplication(payload);
}

export function verifyDocument(app: AdmissionApplication, docKey: string, verified: boolean): AdmissionApplication {
  return updateGranularDocumentStatus(app, docKey, verified ? "Verified" : "Pending");
}

export const createAdmissionApplication = submitPreAdmissionWizardApplication;
export const updateAdmissionStatus = (app: AdmissionApplication, status: any) => ({ ...app, status });
export const deleteAdmissionApplication = async (id: string) => true;

