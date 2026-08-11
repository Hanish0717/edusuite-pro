import type { NotificationItem, NotificationSettingsState } from "./types";

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "📚 Assignment Submitted",
    description: "Section CSE-A has submitted Assignment 3 (Memory Management Analysis).",
    time: "10 Minutes Ago",
    date: "2026-08-06",
    priority: "High",
    category: "Assignments",
    isRead: false,
    isActionRequired: true,
    department: "Computer Science and Engineering",
    subject: "Operating Systems",
    section: "CSE-A",
    action: {
      label: "View Assignment",
      type: "view_assignment",
      href: "/faculty/assignments"
    }
  },
  {
    id: "notif-2",
    title: "📝 Attendance Reminder",
    description: "Attendance for Operating Systems (Period 2) has not been submitted.",
    time: "Today, 11:00 AM",
    date: "2026-08-06",
    priority: "Medium",
    category: "Attendance",
    isRead: false,
    isActionRequired: true,
    department: "Computer Science and Engineering",
    subject: "Operating Systems",
    section: "CSE-B",
    action: {
      label: "Take Attendance",
      type: "take_attendance",
      href: "/faculty/attendance"
    }
  },
  {
    id: "notif-3",
    title: "🎓 Internal Marks Deadline",
    description: "Upload Mid-Semester Exam (Internal-2) marks before 5:00 PM today.",
    time: "Today, 9:30 AM",
    date: "2026-08-06",
    priority: "High",
    category: "Examinations",
    isRead: false,
    isActionRequired: true,
    department: "Computer Science and Engineering",
    subject: "Database Management Systems",
    action: {
      label: "Enter Marks",
      type: "enter_marks",
      href: "/faculty/exams"
    }
  },
  {
    id: "notif-4",
    title: "📅 Timetable Updated",
    description: "Wednesday Period 3 (Compiler Design) has been shifted to Room A-305.",
    time: "Yesterday",
    date: "2026-08-05",
    priority: "Low",
    category: "Timetable",
    isRead: true,
    isActionRequired: false,
    department: "Computer Science and Engineering",
    subject: "Compiler Design",
    section: "CSE-A",
    action: {
      label: "View Timetable",
      type: "view_timetable",
      href: "/faculty/timetable"
    }
  },
  {
    id: "notif-5",
    title: "👨‍🎓 Student Leave Request",
    description: "A medical leave request from Roll No. CSE22115 (Rahul Verma) requires your approval.",
    time: "Today, 8:15 AM",
    date: "2026-08-06",
    priority: "Medium",
    category: "Leave",
    isRead: false,
    isActionRequired: true,
    department: "Computer Science and Engineering",
    studentName: "Rahul Verma (CSE22115)",
    action: {
      label: "Review Request",
      type: "review_leave",
      href: "/faculty/students"
    }
  },
  {
    id: "notif-6",
    title: "🔬 Research Reminder",
    description: "IEEE International Conference paper camera-ready submission deadline is in 2 days.",
    time: "2 Days Left",
    date: "2026-08-04",
    priority: "Low",
    category: "Research",
    isRead: true,
    isActionRequired: false,
    department: "Computer Science and Engineering",
    action: {
      label: "Open Research",
      type: "open_research",
      href: "/faculty/research"
    }
  },
  {
    id: "notif-7",
    title: "📢 Department Circular",
    description: "Departmental Curriculum Revision Committee meeting scheduled for Friday at 3:00 PM.",
    time: "3 Hours Ago",
    date: "2026-08-06",
    priority: "Medium",
    category: "Announcements",
    isRead: false,
    isActionRequired: false,
    department: "Computer Science and Engineering",
    action: {
      label: "Read Circular",
      type: "view_announcement"
    }
  },
  {
    id: "notif-8",
    title: "⚙️ System Maintenance Alert",
    description: "ERP portal back-end database upgrade scheduled for Sunday 12:00 AM to 4:00 AM.",
    time: "1 Day Ago",
    date: "2026-08-05",
    priority: "Low",
    category: "System",
    isRead: true,
    isActionRequired: false
  }
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsState = {
  emailAlerts: true,
  pushNotifications: true,
  categories: {
    Assignments: true,
    Attendance: true,
    Examinations: true,
    Leave: true,
    Research: true,
    Students: true,
    System: true,
    Announcements: true,
    Timetable: true,
    Payroll: true,
    Reports: true
  }
};
