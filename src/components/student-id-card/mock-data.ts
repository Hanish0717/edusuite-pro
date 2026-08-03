import { StudentIdCardData, IdCardRequest, IdCardHistoryItem } from "./types";

export const MOCK_STUDENT_ID_CARD: StudentIdCardData = {
  studentId: "STU-2022-8941",
  rollNumber: "22CS101",
  registrationNumber: "REG-2022-CSE-0914",
  name: "Sai Teja Varma",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  initials: "ST",
  department: "Computer Science & Engineering",
  departmentCode: "CSE",
  course: "Bachelor of Technology (B.Tech)",
  degree: "B.Tech",
  year: "3rd Year",
  semester: 5,
  section: "Section A",
  bloodGroup: "O+ Positive",
  dob: "15-06-2004",
  validTill: "31-07-2026",
  status: "Active",
  
  address: "Plot No. 42, Green Meadows Colony, Jubilee Hills, Hyderabad, Telangana - 500033",
  emergencyContact: {
    name: "S. Anitha (Mother)",
    relationship: "Mother",
    phone: "+91 99887 76655",
  },
  parentContact: {
    fatherName: "S. Venkat Rao",
    fatherPhone: "+91 98480 11223",
  },
  
  libraryId: "LIB-2022-CSE-0101",
  hostelStatus: "Block B - Room 304",
  transportStatus: "Route 14 (Bus #AP-28-Z-4590)",
  
  studentSignatureText: "SaiTeja.V",
  principalSignatureText: "Dr. K. R. Sharma (Principal)",
  barcodeValue: "22CS101-2022-2026",
  qrCodeValue: "https://edusuite.edu.in/verify/STU-2022-8941",
  
  collegeName: "EduSuite Pro College of Engineering & Technology",
  collegeLogoText: "EduSuite ERP",
  collegeAddress: "EduSuite Campus, Tech Park Road, Gachibowli, Hyderabad - 500032",
  collegePhone: "+91 40 2345 6789",
  collegeEmail: "registrar@edusuite.edu.in",
  instructions: [
    "This identity card is mandatory for campus entry, library access, and examinations.",
    "If lost, report immediately to the Chief Librarian or Administrative Block.",
    "Card is non-transferable. Misuse will result in immediate disciplinary action.",
    "Keep card away from heat, moisture, and strong magnetic fields.",
  ],
};

export const MOCK_ID_CARD_REQUESTS: IdCardRequest[] = [
  {
    requestId: "REQ-2026-9041",
    studentId: "22CS101",
    requestType: "Request Correction",
    submittedDate: "01-08-2026",
    status: "Pending",
    assignedTo: "Librarian",
    details: "Requested update to Emergency Phone Number to +91 99887 76655.",
    remarks: "Under verification by Chief Librarian Mr. M. K. Reddi.",
    expectedCompletionDate: "04-08-2026",
  },
  {
    requestId: "REQ-2025-4120",
    studentId: "22CS101",
    requestType: "Request Reprint",
    submittedDate: "15-11-2025",
    status: "Completed",
    assignedTo: "Librarian",
    details: "Reprint requested due to barcode surface wear.",
    remarks: "Printed and issued by Library Registration Desk.",
    expectedCompletionDate: "17-11-2025",
  },
  {
    requestId: "REQ-2024-1180",
    studentId: "22CS101",
    requestType: "Lost ID Card",
    submittedDate: "10-04-2024",
    status: "Approved",
    assignedTo: "Librarian",
    details: "Duplicate card issued after verified police report submission.",
    remarks: "Approved by Librarian. Card collected from Help Desk.",
    expectedCompletionDate: "12-04-2024",
  },
];

export const MOCK_ID_CARD_HISTORY: IdCardHistoryItem[] = [
  {
    id: "hist-1",
    title: "ID Card Issued",
    date: "01-08-2022",
    actor: "Library Admissions Office",
    statusBadge: "Original Issue",
    description: "Official smart digital identity pass generated upon 1st year admission enrollment.",
  },
  {
    id: "hist-2",
    title: "Photo & Address Updated",
    date: "14-07-2023",
    actor: "Student Records Portal",
    statusBadge: "Verified Update",
    description: "Student updated profile photo and permanent residential address.",
  },
  {
    id: "hist-3",
    title: "Duplicate Card Issued",
    date: "12-04-2024",
    actor: "Chief Librarian",
    statusBadge: "Replacement",
    description: "Issued duplicate RFID pass following lost card report REQ-2024-1180.",
  },
  {
    id: "hist-4",
    title: "Correction Requested",
    date: "01-08-2026",
    actor: "Student (Sai Teja Varma)",
    statusBadge: "Pending Librarian Approval",
    description: "Submitted correction request REQ-2026-9041 to update emergency contact details.",
  },
];
