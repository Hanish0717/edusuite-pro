import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type StudyMaterialItem,
} from "@/data/faculty-mock-data";

export interface MockFacultyUser {
  facultyId: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  program: string;
  assignedSubjects: string[];
  assignedSections: string[];
  assignedSemesters: string[];
  academicYear: string;
  role: "faculty";
}

export interface MockStudentUser {
  studentId: string;
  rollNumber: string;
  name: string;
  department: string;
  program: string;
  semester: string;
  section: string;
  enrolledSubjects: string[];
  academicYear: string;
  role: "student";
}

// 1. MOCK AUTHENTICATION CONTEXT GENERATORS
export function getCurrentFacultyUser(deptCode: string = "CSE"): MockFacultyUser {
  const deptData = FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"];
  const profile = deptData.profileData;

  const assignedSubjects = profile.academicInfo?.assignedSubjects || deptData.subjectsList.map((s) => s.name);
  const assignedSections = profile.academicInfo?.sections || [`${deptCode}-A`, `${deptCode}-B`];

  return {
    facultyId: profile.id || `FAC-${deptCode}-101`,
    employeeId: profile.employeeId || `EMP-${deptCode}-101`,
    name: profile.name || `Dr. ${deptCode} Faculty Lead`,
    designation: profile.designation || "Associate Professor",
    department: deptCode,
    program: "B.Tech",
    assignedSubjects,
    assignedSections,
    assignedSemesters: [deptData.semester || "5"],
    academicYear: deptData.academicYear || "2026-27",
    role: "faculty",
  };
}

export function getCurrentStudentUser(deptCode: string = "CSE", semester: string = "5", section: string = "A"): MockStudentUser {
  const deptData = FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"];
  const enrolledSubjects = deptData.subjectsList.map((s) => s.name);

  return {
    studentId: `STU-2026-${deptCode}-042`,
    rollNumber: `24${deptCode}042`,
    name: "Aarav Sharma",
    department: deptCode,
    program: "B.Tech",
    semester: semester || "5",
    section: `${deptCode}-${section}`,
    enrolledSubjects,
    academicYear: deptData.academicYear || "2026-27",
    role: "student",
  };
}

// Global state cache for mock environment persistence across tabs
const mockRepositoryStore: Record<string, StudyMaterialItem[]> = {};

function getRawDepartmentMaterials(deptCode: string): StudyMaterialItem[] {
  if (!mockRepositoryStore[deptCode]) {
    const deptData = FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"];
    mockRepositoryStore[deptCode] = [...(deptData.studyMaterialsList || [])];
  }
  return mockRepositoryStore[deptCode];
}

// 2. FACULTY COURSE MATERIALS API (Simulates GET /faculty/materials)
export function fetchFacultyCourseMaterials(facultyUser: MockFacultyUser): StudyMaterialItem[] {
  const allDeptMaterials = getRawDepartmentMaterials(facultyUser.department);

  // Filter ONLY materials for subjects assigned to this faculty
  return allDeptMaterials.filter((mat) => facultyUser.assignedSubjects.includes(mat.subject));
}

// 3. FACULTY UPLOAD MATERIAL API (Simulates POST /faculty/materials)
export function uploadFacultyCourseMaterial(
  payload: {
    title: string;
    subject: string;
    unit: string;
    topic?: string;
    description?: string;
    fileType?: "PDF" | "PPT" | "Video" | "DOC" | "ZIP";
    fileSize?: string;
    category?: any;
    visibility?: "Visible" | "Faculty Only" | "Scheduled" | "Draft";
    allowDownload?: boolean;
    allowPreview?: boolean;
    section?: string;
    semester?: string;
  },
  facultyUser: MockFacultyUser
): StudyMaterialItem {
  const deptCode = facultyUser.department;
  const materials = getRawDepartmentMaterials(deptCode);

  // Automatic metadata association from faculty context
  const newMaterial: StudyMaterialItem = {
    id: `mat-${deptCode}-${Date.now()}`,
    title: payload.title,
    description: payload.description || `Official study material for ${payload.subject}.`,
    subject: payload.subject,
    code: payload.subject.split(" ").map((w) => w[0]).join("").toUpperCase() + "301",
    section: payload.section || facultyUser.assignedSections[0] || `${deptCode}-A`,
    semester: payload.semester || facultyUser.assignedSemesters[0] || "5",
    academicYear: facultyUser.academicYear,
    uploadDate: "Today",
    lastUpdated: "Today",
    downloadCount: 0,
    studentViews: 0,
    uploadedBy: `${facultyUser.name} (${facultyUser.department} Dept)`,
    visibilityStatus: (payload.visibility as any) || "Visible",
    fileType: payload.fileType || "PDF",
    fileSize: payload.fileSize || "2.4 MB",
    unit: payload.unit || "Unit I",
    topic: payload.topic || payload.title,
    keywords: [payload.subject, payload.unit || "Unit I"],
    category: payload.category || (payload.fileType === "PPT" ? "PPT" : "Lecture Notes"),
    allowDownload: payload.allowDownload !== false,
    allowPreview: payload.allowPreview !== false,
    versions: [
      {
        versionNum: "v1.0",
        updatedBy: facultyUser.name,
        updatedDate: "Today",
        changeSummary: "Initial publication release",
      },
    ],
    timeline: [
      { event: "Uploaded by Faculty", date: "Today", status: "Completed" },
      { event: "Published to Student LMS", date: "Today", status: "Completed" },
    ],
  };

  materials.unshift(newMaterial);
  return newMaterial;
}

// 4. STUDENT COURSE MATERIALS API (Simulates GET /student/materials)
export function fetchStudentCourseMaterials(studentUser: MockStudentUser): StudyMaterialItem[] {
  const allDeptMaterials = getRawDepartmentMaterials(studentUser.department);

  // Student Filter:
  // Must match Department, Semester, Enrolled Subjects, and Published Status ("Visible")
  // MUST NOT see Draft, Hidden, or materials from other departments/semesters
  return allDeptMaterials.filter((mat) => {
    const isSubjectEnrolled = studentUser.enrolledSubjects.includes(mat.subject);
    const isSameSemester = mat.semester === studentUser.semester || !mat.semester;
    const isVisible = mat.visibilityStatus === "Visible";

    return isSubjectEnrolled && isSameSemester && isVisible;
  });
}

// 5. ROLE PERMISSION HELPER
export function getCourseMaterialPermissions(role: "faculty" | "student" | "admin") {
  const isFacultyOrAdmin = role === "faculty" || role === "admin";
  return {
    canUpload: isFacultyOrAdmin,
    canEdit: isFacultyOrAdmin,
    canDelete: isFacultyOrAdmin,
    canViewAnalytics: isFacultyOrAdmin,
    canManageVisibility: isFacultyOrAdmin,
    canPreview: true,
    canDownload: true,
    canBookmark: true,
    canSearch: true,
  };
}
