export interface RegistrationRoleOption {
  id: string;
  label: string;
  description: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export const REGISTRATION_ROLES: RegistrationRoleOption[] = [
  {
    id: "institution_head",
    label: "Institution Head / Super Admin",
    description: "Onboard new college campus or university workspace",
  },
  {
    id: "staff",
    label: "Staff / Faculty Member",
    description: "Teaching faculty, department heads & administration",
  },
  {
    id: "student",
    label: "Student",
    description: "Enrolled student registering for portal access",
  },
  {
    id: "parent",
    label: "Parent / Guardian",
    description: "Parent or guardian monitoring student progress",
  },
  {
    id: "external",
    label: "External User (Recruiter / Vendor / Applicant)",
    description: "Campus recruiters, vendors, applicants & guest faculty",
  },
];

export const REGISTRATION_DEPARTMENTS: OptionItem[] = [
  { value: "CSE", label: "Computer Science & Engineering (CSE)" },
  { value: "ECE", label: "Electronics & Communication (ECE)" },
  { value: "EEE", label: "Electrical & Electronics (EEE)" },
  { value: "ME", label: "Mechanical Engineering (ME)" },
  { value: "Civil", label: "Civil Engineering" },
  { value: "MBA", label: "Master of Business Administration (MBA)" },
];

export const REGISTRATION_DESIGNATIONS_MAP: Record<string, OptionItem[]> = {
  institution_head: [
    { value: "principal", label: "Principal / Director" },
    { value: "chancellor", label: "Chancellor / Vice Chancellor" },
    { value: "super_admin", label: "Global System Administrator" },
    { value: "registrar", label: "Registrar / Academic Head" },
  ],
  staff: [
    { value: "faculty", label: "Faculty / Assistant Professor" },
    { value: "hod", label: "Head of Department (HOD)" },
    { value: "dean", label: "Academic Dean" },
    { value: "exam_controller", label: "Exam Controller" },
    { value: "placement_officer", label: "Placement Officer" },
    { value: "hr_manager", label: "HR Manager" },
    { value: "finance_officer", label: "Finance Officer" },
    { value: "lab_incharge", label: "Lab Incharge" },
  ],
  student: [
    { value: "btech_ug", label: "Undergraduate (B.Tech / B.E.)" },
    { value: "mtech_pg", label: "Postgraduate (M.Tech / M.E.)" },
    { value: "mba_pg", label: "Postgraduate (MBA)" },
    { value: "phd_research", label: "Research Scholar (Ph.D.)" },
  ],
  parent: [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "guardian", label: "Legal Guardian" },
  ],
  external: [
    { value: "recruiter", label: "Campus Recruiter" },
    { value: "vendor", label: "Services Vendor / Supplier" },
    { value: "applicant", label: "Admissions Applicant" },
    { value: "guest_faculty", label: "Guest Faculty / Visiting Speaker" },
  ],
};

export const STUDENT_STRENGTH_OPTIONS: OptionItem[] = [
  { value: "0-500", label: "Up to 500 Students" },
  { value: "500-1000", label: "500 - 1,000 Students" },
  { value: "1000-3000", label: "1,000 - 3,000 Students" },
  { value: "3000+", label: "3,000+ Students" },
];

export function getRegistrationRoles(): RegistrationRoleOption[] {
  return REGISTRATION_ROLES;
}

export function getDepartments(): OptionItem[] {
  return REGISTRATION_DEPARTMENTS;
}

export function getDesignationsForRole(roleId: string): OptionItem[] {
  return REGISTRATION_DESIGNATIONS_MAP[roleId] || [];
}

export function getStrengthOptions(): OptionItem[] {
  return STUDENT_STRENGTH_OPTIONS;
}

export interface RegistrationSubmitPayload {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  department?: string;
  designation?: string;
  institutionName?: string;
  studentStrength?: string;
  rollNumber?: string;
  organization?: string;
}

export function registerUser(payload: RegistrationSubmitPayload): { success: boolean; message: string } {
  // Mock registration service processing
  return {
    success: true,
    message: `Account registration initiated for ${payload.firstName} ${payload.lastName} (${payload.role}).`,
  };
}
