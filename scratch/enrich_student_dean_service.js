import fs from 'fs';
import path from 'path';

const servicePath = path.join(process.cwd(), 'src/lib/deansService.ts');
let code = fs.readFileSync(servicePath, 'utf8');

const indianNames = [
  "Rahul Sharma", "Priya Reddy", "K. Sai Teja", "Anjali Verma", "Rohit Kumar",
  "Nikhil Reddy", "Sneha Rao", "Harsha Vardhan", "Akhila Devi", "Abhishek Kumar",
  "Kavya Nair", "Vikram Malhotra", "Sunita Sharma", "Rohan Varma", "Priya Sundaram",
  "Aravind Swamy", "Divya Sharma", "Siddharth Rao", "Arjun Verma", "Meera Nair",
  "Rajesh Varma", "Sujatha Reddy", "Karthik Raja", "Deepika Padukone", "Vijay Kumar"
];

const indianDepts = ["CSE", "ECE", "EEE", "Civil", "Mechanical", "MBA", "MCA", "AI & DS", "Cyber Security", "IoT"];

// Write complete rich Student Dean data provider generator
const studentDeanDataCode = `
export interface StudentRecord {
  rollNo: string;
  name: string;
  department: string;
  year: string;
  section: string;
  attendance: number;
  cgpa: number;
  gender: "Male" | "Female";
  admissionQuota: "Merit" | "Management" | "Convenor";
  scholarshipStatus: "Approved" | "Pending" | "None";
  hostelStatus: "Hosteller" | "Day Scholar";
  guardianName: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  status: "Active" | "Detained" | "Graduated";
}

export interface GrievanceRecord {
  id: string;
  student: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Closed";
  assignedOfficer: string;
  timeline: string;
  date: string;
}

export interface ScholarshipRecord {
  id: string;
  student: string;
  scheme: string;
  category: "Government" | "Merit" | "Private" | "Minority" | "SC/ST" | "BC" | "EWS";
  amount: string;
  appliedDate: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface DisciplineRecord {
  id: string;
  student: string;
  incidentType: string;
  actionTaken: "Warning Letter" | "Suspension" | "Counselling" | "Resolved";
  hearingDate: string;
  status: "Open" | "Under Review" | "Closed";
}

export interface CounsellingRecord {
  id: string;
  student: string;
  counsellor: string;
  issueCategory: string;
  sessionDate: string;
  status: "Upcoming" | "Completed" | "Pending";
}

export interface StudentRequestRecord {
  id: string;
  student: string;
  requestType: "Bonafide" | "Transfer Certificate (TC)" | "Migration" | "ID Card Reissue" | "Fee Receipt" | "Hall Ticket" | "Conduct Certificate";
  appliedDate: string;
  status: "Approved" | "In Process" | "Rejected";
}

export interface StudentActivityRecord {
  id: string;
  activityName: string;
  category: "Sports" | "NSS" | "NCC" | "Technical Club" | "Hackathon" | "Workshop";
  date: string;
  participantsCount: number;
  achievement: string;
}

export interface StudentDeanDashboardData {
  kpis: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    overallAttendancePct: string;
    activeGrievances: number;
    scholarshipsApproved: string;
    hostelStudents: number;
    activeClubs: number;
    eventsThisMonth: number;
    boysHostel: number;
    girlsHostel: number;
    vacantHostelRooms: number;
  };
  deptCounts: { dept: string; count: number }[];
  genderRatio: { gender: string; percentage: number }[];
  yearDistribution: { year: string; count: number }[];
  students: StudentRecord[];
  grievances: GrievanceRecord[];
  scholarships: ScholarshipRecord[];
  disciplineCases: DisciplineRecord[];
  counsellingSessions: CounsellingRecord[];
  studentRequests: StudentRequestRecord[];
  studentActivities: StudentActivityRecord[];
  clubs: { name: string; category: string; facultyCoordinator: string; studentCoordinator: string; members: number }[];
  hostelComplaints: { id: string; hostelBlock: string; issue: string; warden: string; status: string }[];
  attendanceHistory: { date: string; department: string; section: string; faculty: string; attendancePct: number; present: number; absent: number; lateEntries: number }[];
  officialSchedule: { day: string; period: string; subject: string; section: string; room: string; time: string; type: string }[];
  facultyTimetables: { facultyName: string; department: string; subject: string; day: string; period: string; room: string }[];
  substitutionHistory: { date: string; subject: string; originalFaculty: string; substituteFaculty: string; reason: string; status: string }[];
  notificationsSystem: {
    received: { id: string; sender: string; title: string; category: string; priority: string; date: string; read: boolean }[];
    sent: { id: string; receiver: string; title: string; category: string; priority: string; date: string; read: boolean }[];
  };
}

export function getStudentDeanDashboardData(): StudentDeanDashboardData {
  const students: StudentRecord[] = Array.from({ length: 25 }).map((_, i) => {
    const name = [
      "Rahul Sharma", "Priya Reddy", "K. Sai Teja", "Anjali Verma", "Rohit Kumar",
      "Nikhil Reddy", "Sneha Rao", "Harsha Vardhan", "Akhila Devi", "Abhishek Kumar",
      "Kavya Nair", "Vikram Malhotra", "Sunita Sharma", "Rohan Varma", "Priya Sundaram",
      "Arvind Swamy", "Divya Sharma", "Siddharth Rao", "Arjun Verma", "Meera Nair",
      "Rajesh Varma", "Sujatha Reddy", "Karthik Raja", "Deepika Padukone", "Vijay Kumar"
    ][i % 25];

    const dept = indianDepts[i % indianDepts.length];
    const rollNo = "22" + dept.substring(0, 2).toUpperCase() + (101 + i);
    const gender = i % 2 === 0 ? "Male" : "Female";

    return {
      rollNo,
      name,
      department: dept,
      year: "Year " + ((i % 4) + 1),
      section: "Sec " + String.fromCharCode(65 + (i % 3)),
      attendance: 78 + (i % 21),
      cgpa: +(7.2 + (i % 25) * 0.1).toFixed(2),
      gender,
      admissionQuota: ["Convenor", "Merit", "Management"][i % 3] as any,
      scholarshipStatus: i % 2 === 0 ? "Approved" : "Pending",
      hostelStatus: i % 3 === 0 ? "Hosteller" : "Day Scholar",
      guardianName: name.split(" ")[0] + " Father/Guardian",
      phone: "+91 98480 " + (10000 + i * 111),
      email: name.toLowerCase().replace(/[^a-z]/g, "") + "@edusuite.edu.in",
      address: "Plot " + (12 + i) + ", Jubilee Hills, Hyderabad, Telangana",
      bloodGroup: ["O+", "A+", "B+", "AB+"][i % 4],
      emergencyContact: "+91 99490 " + (20000 + i * 222),
      status: i % 12 === 0 ? "Detained" : "Active",
    };
  });

  return {
    kpis: {
      totalStudents: 5420,
      activeStudents: 5280,
      inactiveStudents: 140,
      overallAttendancePct: "92.4%",
      activeGrievances: 4,
      scholarshipsApproved: "₹1.85 Cr",
      hostelStudents: 1850,
      activeClubs: 42,
      eventsThisMonth: 8,
      boysHostel: 1100,
      girlsHostel: 750,
      vacantHostelRooms: 45,
    },
    deptCounts: [
      { dept: "CSE", count: 1240 },
      { dept: "ECE", count: 980 },
      { dept: "EEE", count: 650 },
      { dept: "Civil", count: 480 },
      { dept: "Mechanical", count: 620 },
      { dept: "MBA", count: 320 },
      { dept: "MCA", count: 240 },
      { dept: "AI & DS", count: 480 },
      { dept: "Cyber Security", count: 260 },
      { dept: "IoT", count: 150 },
    ],
    genderRatio: [
      { gender: "Male", percentage: 58 },
      { gender: "Female", percentage: 42 },
    ],
    yearDistribution: [
      { year: "1st Year", count: 1450 },
      { year: "2nd Year", count: 1380 },
      { year: "3rd Year", count: 1320 },
      { year: "4th Year", count: 1270 },
    ],
    students,
    grievances: [
      { id: "GRV-901", student: "K. Sai Teja (22CS101)", category: "Hostel Wi-Fi Bandwidth", priority: "Medium", status: "In Progress", assignedOfficer: "Col. R. S. Rathore", timeline: "Resolution in 2 Days", date: "2026-08-01" },
      { id: "GRV-902", student: "Rahul Sharma (22CS102)", category: "Cafeteria Hygiene Audit", priority: "High", status: "Closed", assignedOfficer: "Prof. Student Dean", timeline: "Resolved", date: "2026-08-02" },
      { id: "GRV-903", student: "Priya Reddy (22EC103)", category: "Library Night Facility", priority: "Low", status: "Closed", assignedOfficer: "M. N. Swamy", timeline: "Resolved", date: "2026-08-03" },
      { id: "GRV-904", student: "Ananya Roy (23EC204)", category: "Sports Ground Lighting", priority: "Medium", status: "Open", assignedOfficer: "Dr. Ananya Sen", timeline: "Under Investigation", date: "2026-08-04" },
    ],
    scholarships: [
      { id: "SCH-101", student: "Rahul Sharma", scheme: "State Govt Fee Reimbursement", category: "BC", amount: "₹35,000", appliedDate: "2026-07-15", status: "Approved" },
      { id: "SCH-102", student: "Priya Reddy", scheme: "National Merit Scholarship", category: "Merit", amount: "₹50,000", appliedDate: "2026-07-18", status: "Approved" },
      { id: "SCH-103", student: "K. Sai Teja", scheme: "Post-Matric SC/ST Welfare Fund", category: "SC/ST", amount: "₹45,000", appliedDate: "2026-07-20", status: "Approved" },
      { id: "SCH-104", student: "Anjali Verma", scheme: "Economically Weaker Section Support", category: "EWS", amount: "₹30,000", appliedDate: "2026-07-22", status: "Pending" },
    ],
    disciplineCases: [
      { id: "DIS-01", student: "Harsha Vardhan (22ME108)", incidentType: "Campus Attendance Deficit", actionTaken: "Warning Letter", hearingDate: "2026-08-02", status: "Closed" },
      { id: "DIS-02", student: "Abhishek Kumar (22CE110)", incidentType: "Library Late Book Return Penalty", actionTaken: "Counselling", hearingDate: "2026-08-04", status: "Closed" },
    ],
    counsellingSessions: [
      { id: "CNS-901", student: "Sneha Rao (22CS107)", counsellor: "Dr. Sunita Sharma", issueCategory: "Academic Stress & Career Guidance", sessionDate: "2026-08-10", status: "Upcoming" },
      { id: "CNS-902", student: "Nikhil Reddy (22EC106)", counsellor: "Dr. Ravi Kumar", issueCategory: "Peer Mentoring & Time Management", sessionDate: "2026-08-03", status: "Completed" },
    ],
    studentRequests: [
      { id: "REQ-501", student: "Rahul Sharma", requestType: "Bonafide Certificate", appliedDate: "2026-08-02", status: "Approved" },
      { id: "REQ-502", student: "Priya Reddy", requestType: "ID Card Reissue", appliedDate: "2026-08-03", status: "In Process" },
      { id: "REQ-503", student: "K. Sai Teja", requestType: "Fee Receipt Duplicate", appliedDate: "2026-08-04", status: "Approved" },
    ],
    studentActivities: [
      { id: "ACT-01", activityName: "Inter-College Cricket Tournament 2026", category: "Sports", date: "2026-08-01", participantsCount: 140, achievement: "Winners Trophy" },
      { id: "ACT-02", activityName: "National Hackathon 24-Hour Codefest", category: "Hackathon", date: "2026-07-28", participantsCount: 220, achievement: "1st Prize ₹50,000" },
    ],
    clubs: [
      { name: "Coding & Hackathon Society", category: "Technical", facultyCoordinator: "Dr. S. K. Gupta", studentCoordinator: "Rahul Sharma", members: 340 },
      { name: "Robotics & Embedded Guild", category: "Technical", facultyCoordinator: "Dr. Meera Rao", studentCoordinator: "K. Sai Teja", members: 210 },
      { name: "Literary & Public Speaking Club", category: "Cultural", facultyCoordinator: "Dr. Sunita Sharma", studentCoordinator: "Priya Reddy", members: 185 },
    ],
    hostelComplaints: [
      { id: "HMC-01", hostelBlock: "Boys Hostel Block A", issue: "Geyser Maintenance", warden: "Col. R. S. Rathore", status: "Resolved" },
      { id: "HMC-02", hostelBlock: "Girls Hostel Block C", issue: "Mess Menu Variation", warden: "Mrs. G. Sujatha", status: "In Progress" },
    ],
    attendanceHistory: [
      { date: "2026-08-04", department: "CSE", section: "Sec A", faculty: "Prof. Student Dean", attendancePct: 95.8, present: 46, absent: 2, lateEntries: 1 },
      { date: "2026-08-03", department: "CSE", section: "Sec B", faculty: "Dr. S. K. Gupta", attendancePct: 93.4, present: 44, absent: 3, lateEntries: 2 },
    ],
    officialSchedule: [
      { day: "Monday", period: "Period 1 (09:00 - 10:00 AM)", subject: "CS501 Advanced Software Engg", section: "CSE Sem 5 - Sec A", room: "Lab-301", time: "09:00 AM", type: "Teaching Class" },
      { day: "Tuesday", period: "Period 3 (11:15 - 12:15 PM)", subject: "Student Grievance Redressal Hearing", section: "All Batches", room: "Dean Senate Office", time: "11:15 AM", type: "Committee Meeting" },
      { day: "Wednesday", period: "Period 2 (10:00 - 11:00 AM)", subject: "Hostel Welfare Inspection", section: "Boys Hostel Block A", room: "Hostel Premises", time: "10:00 AM", type: "Inspection Schedule" },
    ],
    facultyTimetables: [
      { facultyName: "Dr. S. K. Gupta", department: "CSE", subject: "CS501 Software Engg", day: "Monday", period: "09:00 AM", room: "Hall-101" },
      { facultyName: "Dr. Meera Rao", department: "ECE", subject: "EC304 VLSI Design", day: "Tuesday", period: "10:00 AM", room: "Hall-204" },
    ],
    substitutionHistory: [
      { date: "2026-08-02", subject: "CS501 Advanced Software Engg", originalFaculty: "Prof. Student Dean", substituteFaculty: "Dr. S. K. Gupta", reason: "Attending University Academic Council", status: "Approved" },
    ],
    notificationsSystem: {
      received: [
        { id: "NOT-R1", sender: "Controller of Examinations", title: "Autumn Semester Hall Tickets Dispatch Complete", category: "Examinations", priority: "High", date: "2026-08-04", read: false },
        { id: "NOT-R2", sender: "Principal Office", title: "Monthly Student Welfare Committee Meeting on Friday", category: "Meeting", priority: "Medium", date: "2026-08-03", read: true },
      ],
      sent: [
        { id: "NOT-S1", receiver: "All HODs", title: "Attendance Deficit Shortage Warning Letters Issued", category: "Attendance", priority: "High", date: "2026-08-04", read: true },
      ],
    },
  };
}
`;

// Replace getStudentDeanDashboardData definition in deansService.ts
const startIndex = code.indexOf("export interface StudentRecord");
if (startIndex !== -1) {
  code = code.substring(0, startIndex) + studentDeanDataCode;
  fs.writeFileSync(servicePath, code, 'utf8');
  console.log("deansService.ts updated with comprehensive rich Indian student dummy data!");
} else {
  console.log("Could not find insert position in deansService.ts");
}
