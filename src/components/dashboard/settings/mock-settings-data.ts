import type { FullFacultySettingsState, FacultySettingsSummaryStats } from "./types";

export const INITIAL_SETTINGS_DATA: FullFacultySettingsState = {
  profile: {
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    name: "Dr. Ananya Sharma",
    employeeId: "EMP-CSE-2041",
    department: "Computer Science and Engineering",
    designation: "Associate Professor",
    email: "ananya.sharma@edusuite.edu.in",
    phone: "+91 98765 43210",
    cabinNumber: "CS-Building, Room 304-B",
    officeHours: "Mon - Thu: 2:00 PM - 4:00 PM",
  },
  security: {
    mfaEnabled: true,
    recoveryEmail: "ananya.personal@gmail.com",
    recoveryPhone: "+91 98765 *****",
    lastPasswordChange: "45 days ago",
    activeSessions: [
      {
        id: "sess-1",
        device: "Windows PC (Office Workstation)",
        browser: "Chrome 122.0",
        location: "Campus Network (IP: 192.168.1.104)",
        lastActive: "Active Now",
        isCurrent: true,
      },
      {
        id: "sess-2",
        device: "MacBook Pro (Personal)",
        browser: "Safari 17.2",
        location: "Home Network",
        lastActive: "Yesterday, 8:30 PM",
        isCurrent: false,
      },
    ],
  },
  notifications: {
    assignmentNotifications: true,
    attendanceAlerts: true,
    researchUpdates: true,
    examNotifications: true,
    studentMessages: true,
    leaveRequests: true,
    announcements: true,
    emailNotifications: true,
    pushNotifications: true,
  },
  appearance: {
    theme: "system",
    fontSize: "normal",
    compactMode: false,
    language: "English (US)",
    timezone: "Asia/Kolkata (IST +5:30)",
  },
  privacy: {
    profileVisibility: "internal",
    hideEmail: false,
    hidePhone: true,
    showOfficeHours: true,
    profileSharing: true,
  },
  teaching: {
    defaultSemester: "Semester 6 (AY 2025-26)",
    defaultDepartment: "Computer Science and Engineering",
    defaultSection: "CSE-A",
    preferredAttendanceView: "grid",
    defaultTimetableView: "weekly",
    defaultLessonPlanView: "module",
  },
};

export const INITIAL_SETTINGS_STATS: FacultySettingsSummaryStats = {
  accountStatus: "Active",
  securityStatus: "Protected",
  activeDevicesCount: 2,
  lastLogin: "Today, 10:45 AM",
};
