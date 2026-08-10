export interface AcademicDashboardData {
  totalStudents: number;
  totalFaculty: number;
  totalSubjects: number;
  currentSemester: string;
  activeCourses: number;
  averageAttendance: number;
  passPercentage: number;
  upcomingExams: number;
  pendingGradeApprovals: number;
  totalCredits: number;
}

export const MOCK_ACADEMIC_DASHBOARD_DATA: Record<string, AcademicDashboardData> = {
  CSE: {
    totalStudents: 1250,
    totalFaculty: 85,
    totalSubjects: 48,
    currentSemester: "Sem 5 & 7",
    activeCourses: 18,
    averageAttendance: 91.2,
    passPercentage: 96.8,
    upcomingExams: 4,
    pendingGradeApprovals: 8,
    totalCredits: 160,
  },
  ECE: {
    totalStudents: 980,
    totalFaculty: 64,
    totalSubjects: 42,
    currentSemester: "Sem 5 & 7",
    activeCourses: 15,
    averageAttendance: 89.5,
    passPercentage: 94.2,
    upcomingExams: 3,
    pendingGradeApprovals: 5,
    totalCredits: 160,
  },
  EEE: {
    totalStudents: 620,
    totalFaculty: 45,
    totalSubjects: 36,
    currentSemester: "Sem 5 & 7",
    activeCourses: 12,
    averageAttendance: 88.9,
    passPercentage: 93.5,
    upcomingExams: 2,
    pendingGradeApprovals: 3,
    totalCredits: 160,
  },
  ME: {
    totalStudents: 720,
    totalFaculty: 50,
    totalSubjects: 38,
    currentSemester: "Sem 5 & 7",
    activeCourses: 14,
    averageAttendance: 87.8,
    passPercentage: 92.0,
    upcomingExams: 3,
    pendingGradeApprovals: 4,
    totalCredits: 160,
  },
  Civil: {
    totalStudents: 480,
    totalFaculty: 35,
    totalSubjects: 32,
    currentSemester: "Sem 5 & 7",
    activeCourses: 10,
    averageAttendance: 86.4,
    passPercentage: 91.8,
    upcomingExams: 2,
    pendingGradeApprovals: 2,
    totalCredits: 160,
  },
  MBA: {
    totalStudents: 320,
    totalFaculty: 24,
    totalSubjects: 22,
    currentSemester: "Sem 3",
    activeCourses: 8,
    averageAttendance: 93.0,
    passPercentage: 97.1,
    upcomingExams: 1,
    pendingGradeApprovals: 6,
    totalCredits: 90,
  },
};

export async function getDashboardData(department: string): Promise<AcademicDashboardData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const code = (department === "Mechanical" || department === "ME") ? "ME" : department;
      const data = MOCK_ACADEMIC_DASHBOARD_DATA[code] || MOCK_ACADEMIC_DASHBOARD_DATA["CSE"];
      resolve(data);
    }, 500); // 500ms simulated API network delay
  });
}
