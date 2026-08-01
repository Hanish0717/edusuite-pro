import { FeedbackSummaryKPIs, ActiveSurveyItem, PreviousFeedbackRecord } from "./types";

export const mockFeedbackKPIs: FeedbackSummaryKPIs = {
  feedbackSubmitted: 14,
  pendingFeedback: 2,
  averageRating: 4.8,
  activeSurveys: 3,
};

export const mockFacultyList = [
  { id: "FAC-101", name: "Dr. A. Sharma", department: "Computer Science", subject: "CS301 - Design & Analysis of Algorithms" },
  { id: "FAC-102", name: "Prof. R. K. Varma", department: "Computer Science", subject: "CS302 - Database Management Systems" },
  { id: "FAC-103", name: "Dr. S. Mehta", department: "Information Tech", subject: "IT304 - Web Technologies & Frameworks" },
  { id: "FAC-104", name: "Prof. Ananya Roy", department: "Electronics", subject: "EC201 - Digital Signal Processing" },
  { id: "FAC-105", name: "Dr. Vikram Singh", department: "Mathematics", subject: "MA202 - Discrete Mathematics" },
];

export const mockCourseList = [
  { code: "CS301", title: "CS301 - Design & Analysis of Algorithms", dept: "CSE", sem: "Semester 5" },
  { code: "CS302", title: "CS302 - Database Management Systems & SQL", dept: "CSE", sem: "Semester 5" },
  { code: "CS303", title: "CS303 - Operating Systems & Kernel Design", dept: "CSE", sem: "Semester 5" },
  { code: "IT304", title: "IT304 - Web Technologies & Microservices", dept: "IT", sem: "Semester 5" },
  { code: "MA202", title: "MA202 - Discrete Mathematics & Graph Theory", dept: "Math", sem: "Semester 5" },
];

export const mockActiveSurveys: ActiveSurveyItem[] = [
  {
    id: "SRV-2026-01",
    title: "Mid-Semester Midterm Faculty Assessment (Fall 2026)",
    type: "Faculty",
    dueDate: "2026-08-10",
    target: "All Enrolled CSE Students",
    status: "Pending",
  },
  {
    id: "SRV-2026-02",
    title: "End-Course Evaluation & Lab Facility Audit",
    type: "Course",
    dueDate: "2026-08-15",
    target: "B.Tech Semester 5 Students",
    status: "Pending",
  },
  {
    id: "SRV-2026-03",
    title: "Campus Library & Digital Learning Portal Satisfaction Survey",
    type: "Institutional",
    dueDate: "2026-08-20",
    target: "All University Undergraduates",
    status: "Completed",
  },
];

export const mockPreviousFeedbackHistory: PreviousFeedbackRecord[] = [
  {
    id: "FB-8801",
    date: "2026-07-20",
    title: "Dr. A. Sharma — Design & Analysis of Algorithms",
    type: "Faculty Feedback",
    rating: 5.0,
    status: "Submitted",
  },
  {
    id: "FB-8802",
    date: "2026-07-15",
    title: "CS302 - Database Management Systems",
    type: "Course Feedback",
    rating: 4.6,
    status: "Submitted",
  },
  {
    id: "FB-8803",
    date: "2026-06-28",
    title: "Prof. R. K. Varma — Database Systems",
    type: "Faculty Feedback",
    rating: 4.8,
    status: "Submitted",
  },
  {
    id: "FB-8804",
    date: "2026-05-30",
    title: "MA202 - Discrete Mathematics",
    type: "Course Feedback",
    rating: 4.5,
    status: "Submitted",
  },
];

// Existing Grievances data preserved exactly
export const initialGrievanceTickets = [
  {
    id: "GRV-2026-081",
    category: "Academic / Internal Evaluation",
    subject: "Revaluation Request delay for Mathematics III",
    raisedBy: "Student (Roll 22CS089)",
    date: "2026-07-28",
    committee: "Academic Appeals Committee",
    status: "Under Review",
    sla: "48 Hours",
  },
  {
    id: "GRV-2026-082",
    category: "Hostel & Facilities",
    subject: "Wi-Fi connectivity issues in Block B 3rd Floor",
    raisedBy: "Student (Anonymous)",
    date: "2026-07-30",
    committee: "Hostel Oversight Committee",
    status: "Resolved",
    sla: "Closed",
  },
  {
    id: "GRV-2026-083",
    category: "Disciplinary / Anti-Ragging",
    subject: "Lab equipment damage incident report",
    raisedBy: "Faculty (CSE Lab Incharge)",
    date: "2026-07-31",
    committee: "Disciplinary Committee",
    status: "Committee Assigned",
    sla: "24 Hours",
  },
];
