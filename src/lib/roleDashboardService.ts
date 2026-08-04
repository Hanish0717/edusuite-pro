export interface RoleKpi {
  label: string;
  value: string;
  iconName: string;
  tone?: "primary" | "info" | "warning" | "success";
  delta?: string;
}

export interface StatusListItem {
  id: string;
  title: string;
  meta: string;
  status: string;
  statusTone?: "success" | "warning" | "info" | "primary";
}

// 1. EXAM CELL SERVICE
export function fetchExamCellStats(): RoleKpi[] {
  return [
    { label: "Upcoming Exams", value: "48 Papers", iconName: "Calendar" },
    { label: "Hall Tickets Issued", value: "4,850 Generated", iconName: "FileSpreadsheet", tone: "info" },
    { label: "Valuation Completed", value: "98.4%", iconName: "CheckCircle2", tone: "success" },
    { label: "Revaluation Requests", value: "14 Pending", iconName: "Award", tone: "warning" },
  ];
}

export function fetchExamBatches(): StatusListItem[] {
  return [
    { id: "EX-1", title: "B.Tech Sem 6 End Examinations 2026", meta: "Aug 1 - Aug 12", status: "Valuation Complete", statusTone: "success" },
    { id: "EX-2", title: "M.Tech Sem 2 Regular Examinations", meta: "Aug 15 - Aug 22", status: "Hall Tickets Ready", statusTone: "info" },
    { id: "EX-3", title: "MBA Semester 4 Final Viva & Project", meta: "Jul 28 - Jul 30", status: "Marks Locked", statusTone: "default" },
  ];
}

// 2. PLACEMENT SERVICE
export function fetchPlacementStats(): RoleKpi[] {
  return [
    { label: "Active Drives", value: "12 Companies", iconName: "Briefcase" },
    { label: "Students Placed", value: "412 Students", iconName: "Users", tone: "success" },
    { label: "Highest Package", value: "₹44.0 LPA", iconName: "Award", tone: "info" },
    { label: "Average Package", value: "₹8.5 LPA", iconName: "TrendingUp" },
  ];
}

export function fetchPlacementDrives(): StatusListItem[] {
  return [
    { id: "DRV-1", title: "Google India Campus Drive (Software Engineer)", meta: "25 Shortlisted • 5 Aug", status: "Interview Round", statusTone: "warning" },
    { id: "DRV-2", title: "Microsoft ADC Off-Campus Pool Drive", meta: "142 Applicants • 12 Aug", status: "Registrations Open", statusTone: "info" },
    { id: "DRV-3", title: "TCS Digital & Ninja Recruitment", meta: "310 Placed • Batch 2026", status: "Completed", statusTone: "success" },
  ];
}

// 3. LIBRARIAN SERVICE
export function fetchLibrarianStats(): RoleKpi[] {
  return [
    { label: "Total Books Roster", value: "48,500 Volumes", iconName: "Library" },
    { label: "Active Issues", value: "1,240 Books", iconName: "BookOpen", tone: "info" },
    { label: "Overdue Returns", value: "42 Students", iconName: "Clock", tone: "warning" },
    { label: "E-Journal Subscriptions", value: "12 Journals", iconName: "Globe", tone: "success" },
  ];
}

export function fetchLibraryCirculation(): StatusListItem[] {
  return [
    { id: "LIB-1", title: "Data Structures & Algorithms in Java", meta: "Borrowed by K. Sai Teja (22CS101)", status: "Due Tomorrow", statusTone: "warning" },
    { id: "LIB-2", title: "Modern Operating Systems (4th Ed)", meta: "Borrowed by A. Meghana (22CS114)", status: "Returned", statusTone: "success" },
    { id: "LIB-3", title: "IEEE Microprocessor Systems Journal", meta: "Digital Access Requested by ECE Dept", status: "Granted", statusTone: "info" },
  ];
}

// 4. TRANSPORT SERVICE
export function fetchTransportStats(): RoleKpi[] {
  return [
    { label: "Active Fleet", value: "24 Buses", iconName: "Bus" },
    { label: "Route Pass Holders", value: "1,420 Students", iconName: "Users", tone: "info" },
    { label: "On-Time Compliance", value: "97.8%", iconName: "CheckCircle2", tone: "success" },
    { label: "Maintenance Due", value: "2 Vehicles", iconName: "ShieldAlert", tone: "warning" },
  ];
}

export function fetchBusRoutes(): StatusListItem[] {
  return [
    { id: "RT-14", title: "Route 14: KPHB - LB Nagar - Campus", meta: "Driver: Ramesh K. • Bus #TS-09-UB-1029", status: "On Route", statusTone: "success" },
    { id: "RT-08", title: "Route 08: Secunderabad - Paradise - Campus", meta: "Driver: M. Yadaiah • Bus #TS-09-UB-1034", status: "On Route", statusTone: "success" },
    { id: "RT-21", title: "Route 21: Gachibowli - Miyapur - Campus", meta: "Driver: S. Raju • Bus #TS-09-UB-1040", status: "Service Scheduled", statusTone: "warning" },
  ];
}

// 5. HOSTEL WARDEN SERVICE
export function fetchWardenStats(): RoleKpi[] {
  return [
    { label: "Hostel Occupancy", value: "840 / 1,000 Beds", iconName: "BedDouble" },
    { label: "Leave Passes Issued", value: "18 Active", iconName: "CalendarCheck", tone: "info" },
    { label: "Maintenance Requests", value: "4 Open", iconName: "ShieldAlert", tone: "warning" },
    { label: "Mess Inspection Score", value: "4.8 / 5.0", iconName: "CheckCircle2", tone: "success" },
  ];
}

export function fetchHostelOccupancy(): StatusListItem[] {
  return [
    { id: "HST-A", title: "Boys Hostel Block A (Sem 1 & 2)", meta: "Occupancy: 380 / 400 Beds (95%)", status: "Full", statusTone: "info" },
    { id: "HST-B", title: "Boys Hostel Block B (Sem 3 & 4)", meta: "Occupancy: 260 / 300 Beds (86%)", status: "Available", statusTone: "success" },
    { id: "HST-C", title: "Girls Hostel Block C (All Years)", meta: "Occupancy: 200 / 300 Beds (66%)", status: "Available", statusTone: "success" },
  ];
}

// 6. ACCOUNTS & FINANCE SERVICE
export function fetchAccountsStats(): RoleKpi[] {
  return [
    { label: "Fee Collections Today", value: "₹18.4 Lakhs", iconName: "Wallet", tone: "success" },
    { label: "Pending Dues (Sem 4)", value: "₹8.2 Lakhs", iconName: "Clock", tone: "warning" },
    { label: "Payroll Processed", value: "100% (623 Staff)", iconName: "UserCog", tone: "info" },
    { label: "Vendor Invoices Paid", value: "42 Cleaned", iconName: "CheckCircle2" },
  ];
}

export function fetchFeeCollections(): StatusListItem[] {
  return [
    { id: "INV-20481", title: "B.Tech Sem 4 Tuition Fee Receipt #20481", meta: "Paid by K. Sai Teja (22CS101) • ₹45,000", status: "Verified", statusTone: "success" },
    { id: "INV-20482", title: "Hostel & Mess Fee Receipt #20482", meta: "Paid by A. Meghana (22CS114) • ₹28,000", status: "Verified", statusTone: "success" },
    { id: "INV-20483", title: "Revaluation Processing Fee #20483", meta: "Paid by R. Karthik (22EC067) • ₹1,500", status: "Pending Audit", statusTone: "warning" },
  ];
}

// 7. LMS SERVICE
export function fetchLmsStats(): RoleKpi[] {
  return [
    { label: "Active Courses", value: "142 Modules", iconName: "BookOpen" },
    { label: "Courseware Uploads", value: "1,240 Slides", iconName: "FileSpreadsheet", tone: "info" },
    { label: "Quiz Completion Rate", value: "94.2%", iconName: "CheckCircle2", tone: "success" },
    { label: "Assignment Backlog", value: "23 Pending", iconName: "Clock", tone: "warning" },
  ];
}

export function fetchLmsCourses(): StatusListItem[] {
  return [
    { id: "LMS-CS301", title: "Data Structures & Algorithms (CS301)", meta: "Instructors: Dr. S. K. Gupta • 184 Enrolled", status: "Active", statusTone: "success" },
    { id: "LMS-CS302", title: "Database Management Systems (CS302)", meta: "Instructors: Dr. Ravi Kumar • 184 Enrolled", status: "Active", statusTone: "success" },
    { id: "LMS-EC201", title: "Microprocessor & VLSI Systems (EC201)", meta: "Instructors: Prof. Anand Kumar • 140 Enrolled", status: "Updated Today", statusTone: "info" },
  ];
}

// 8. ALUMNI SERVICE
export function fetchAlumniStats(): RoleKpi[] {
  return [
    { label: "Registered Alumni", value: "12,450 Alumni", iconName: "Globe" },
    { label: "Mentorship Sessions", value: "48 Conducted", iconName: "Users", tone: "info" },
    { label: "Endowment Contributions", value: "₹45.0 Lakhs", iconName: "Award", tone: "success" },
    { label: "Upcoming Meetups", value: "2 Re-Unions", iconName: "Calendar", tone: "warning" },
  ];
}

export function fetchAlumniEvents(): StatusListItem[] {
  return [
    { id: "ALM-1", title: "Batch of 2016 Decennial Reunion Meet", meta: "Auditorium Main Hall • 28 Aug 2026", status: "Registrations Open", statusTone: "success" },
    { id: "ALM-2", title: "Global Alumni Mentorship Series - Tech Talks", meta: "Virtual Google Meet • 15 Aug 2026", status: "Confirmed", statusTone: "info" },
  ];
}

// 9. VICE PRINCIPAL SERVICE
export function fetchVicePrincipalStats(): RoleKpi[] {
  return [
    { label: "Academic Audit Score", value: "3.85 / 4.0", iconName: "Award", tone: "success" },
    { label: "Faculty Compliance", value: "96.4%", iconName: "UserCog", tone: "info" },
    { label: "Class Timetable Clashes", value: "0 Resolved", iconName: "CheckCircle2", tone: "success" },
    { label: "Pending Grievance Appeals", value: "2 Cases", iconName: "ShieldAlert", tone: "warning" },
  ];
}

export function fetchVicePrincipalAudits(): StatusListItem[] {
  return [
    { id: "AUD-01", title: "Sem 4 Mid-Term Valuation Audit", meta: "Computer Science & Engineering Dept", status: "Audit Complete", statusTone: "success" },
    { id: "AUD-02", title: "Lab Infrastructure Safety Compliance", meta: "Mechanical & Civil Engineering Labs", status: "Under Review", statusTone: "warning" },
  ];
}
