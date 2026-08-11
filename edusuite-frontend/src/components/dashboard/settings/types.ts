export interface FacultyProfileSettings {
  photoUrl: string;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  cabinNumber: string;
  officeHours: string;
}

export interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AccountSecurityState {
  mfaEnabled: boolean;
  recoveryEmail: string;
  recoveryPhone: string;
  lastPasswordChange: string;
  activeSessions: ActiveSessionItem[];
}

export interface NotificationPreferencesState {
  assignmentNotifications: boolean;
  attendanceAlerts: boolean;
  researchUpdates: boolean;
  examNotifications: boolean;
  studentMessages: boolean;
  leaveRequests: boolean;
  announcements: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface AppearanceSettingsState {
  theme: "light" | "dark" | "system";
  fontSize: "normal" | "compact" | "large";
  compactMode: boolean;
  language: string;
  timezone: string;
}

export interface PrivacySettingsState {
  profileVisibility: "public" | "internal" | "private";
  hideEmail: boolean;
  hidePhone: boolean;
  showOfficeHours: boolean;
  profileSharing: boolean;
}

export interface TeachingPreferencesState {
  defaultSemester: string;
  defaultDepartment: string;
  defaultSection: string;
  preferredAttendanceView: "grid" | "list" | "quick";
  defaultTimetableView: "weekly" | "daily" | "calendar";
  defaultLessonPlanView: "module" | "timeline";
}

export interface FacultySettingsSummaryStats {
  accountStatus: string;
  securityStatus: string;
  activeDevicesCount: number;
  lastLogin: string;
}

export interface FullFacultySettingsState {
  profile: FacultyProfileSettings;
  security: AccountSecurityState;
  notifications: NotificationPreferencesState;
  appearance: AppearanceSettingsState;
  privacy: PrivacySettingsState;
  teaching: TeachingPreferencesState;
}
