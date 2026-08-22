// Mock local state storage for the Exam Cell workflow
// Allows developers to test the full flow (Assistant schedule -> Officer approve -> Results consolidation) purely on the frontend.

export interface MockCourseOffering {
  id: string;
  course_code: string;
  course_name: string;
  department: string;
  year: number;
  semester: number;
  credits: number;
  course_type?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  sections: any[];
}

export interface MockExamSchedule {
  id: string;
  name: string;
  type: string;
  department: string;
  year: number;
  semester: number;
  startDate: string;
  endDate: string;
  status: 'Pending Approval' | 'Upcoming' | 'Completed';
  enrollmentDeadline?: string;
  examFee?: number;
}

export interface MockStudent {
  id: string;
  roll_number: string;
  full_name: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  is_registered: boolean;
  mid1_marks?: number;
  assignment_marks?: number;
  external_marks?: number;
  grade?: string;
  status?: string;
  
  attendance_percentage?: number;
  fee_balance?: number;
  hall_ticket_status?: 'Not Generated' | 'Generated';
  is_overridden?: boolean;
}

export interface MockTimetableSlot {
  subjectCode: string;
  subjectName: string;
  examDate: string;
  sessionSlot: string;
  halls: string[];
}

export interface MockExamTimetable {
  id: string;
  examScheduleId: string;
  department: string;
  year: number;
  semester: number;
  status: 'Draft' | 'Submitted' | 'Pending Approval' | 'Approved';
  slots: MockTimetableSlot[];
}

export interface FacultyAssignedSubjectItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  year: number;
  semester: number;
  section: string;
  studentCount: number;
  courseType: string;
  credits: number;
  status: 'Draft' | 'In Progress' | 'Submitted to Exam Cell';
  students: {
    roll_number: string;
    name: string;
    attendance: number;
    mid1: number;
    mid2: number;
    assignment: number;
    status: 'Draft' | 'Submitted';
    is_registered: boolean;
  }[];
}

const DEFAULT_COURSES: MockCourseOffering[] = [
  {
    id: '1',
    course_code: '26DS301',
    course_name: 'Java Programming',
    department: 'AIDS',
    year: 1,
    semester: 1,
    credits: 4,
    course_type: 'Integrated Subject',
    status: 'Approved',
    sections: [
      { section: 'A', dept: 'AIDS', mentor_id: 'f1', mentor_name: 'Arjun Shastri' },
      { section: 'B', dept: 'AIDS', mentor_id: 'f2', mentor_name: 'Karan Mishra' }
    ]
  },
  {
    id: '2',
    course_code: '23DS302',
    course_name: 'C Programming',
    department: 'AIDS',
    year: 1,
    semester: 1,
    credits: 3,
    course_type: 'Normal Subject',
    status: 'Approved',
    sections: [
      { section: 'A', dept: 'AIDS', mentor_id: 'f2', mentor_name: 'Karan Mishra' },
      { section: 'B', dept: 'AIDS', mentor_id: 'f1', mentor_name: 'Arjun Shastri' }
    ]
  },
  {
    id: '3',
    course_code: 'CS501',
    course_name: 'Data Structures & Algorithms',
    department: 'CSE',
    year: 3,
    semester: 5,
    credits: 4,
    course_type: 'Integrated Subject',
    status: 'Approved',
    sections: [
      { section: 'A', dept: 'CSE', mentor_id: 'f1', mentor_name: 'Arjun Shastri' },
      { section: 'B', dept: 'CSE', mentor_id: 'f3', mentor_name: 'Dr. Suresh Babu' }
    ]
  },
  {
    id: '4',
    course_code: 'CS502',
    course_name: 'Database Management Systems',
    department: 'CSE',
    year: 3,
    semester: 5,
    credits: 3,
    course_type: 'Normal Subject',
    status: 'Approved',
    sections: [
      { section: 'A', dept: 'CSE', mentor_id: 'f3', mentor_name: 'Dr. Suresh Babu' },
      { section: 'B', dept: 'CSE', mentor_id: 'f1', mentor_name: 'Arjun Shastri' }
    ]
  }
];

const DEFAULT_EXAMS: MockExamSchedule[] = [
  { id: 'e1', name: 'B.Tech CSE Sem 5 End Exams 2026', type: 'Regular', department: 'CSE', year: 3, semester: 5, startDate: '2026-08-10', endDate: '2026-08-20', status: 'Upcoming', enrollmentDeadline: '2026-08-08', examFee: 2000 },
  { id: 'e2', name: 'B.Tech AIML Sem 3 Regular Mid-term', type: 'Mid-term', department: 'AIML', year: 2, semester: 3, startDate: '2026-08-15', endDate: '2026-08-22', status: 'Pending Approval', examFee: 1500 },
  { id: 'e3', name: 'B.Tech CSE Sem 1 End Exams 2026', type: 'Regular', department: 'CSE', year: 1, semester: 1, startDate: '2026-11-20', endDate: '2026-11-30', status: 'Upcoming', enrollmentDeadline: '2026-11-15', examFee: 1800 }
];

const DEFAULT_TIMETABLES: MockExamTimetable[] = [
  {
    id: "t1",
    examScheduleId: "e1",
    department: "CSE",
    year: 3,
    semester: 5,
    status: "Approved",
    slots: [
      { subjectCode: "CS301", subjectName: "Formal Languages and Automata", examDate: "2026-08-10", sessionSlot: "FN (09:30 AM - 12:30 PM)", halls: ["Block A - Room 101", "Block A - Room 102"] },
      { subjectCode: "CS302", subjectName: "Computer Networks", examDate: "2026-08-12", sessionSlot: "FN (09:30 AM - 12:30 PM)", halls: ["Block A - Room 101", "Block A - Room 102"] }
    ]
  }
];

const DEFAULT_STUDENTS: MockStudent[] = [
  { id: 's1', roll_number: '22CS101', full_name: 'K. Sai Teja', department: 'CSE', year: 3, semester: 5, section: 'A', is_registered: true, mid1_marks: 18, assignment_marks: 8, attendance_percentage: 95, fee_balance: 0, hall_ticket_status: 'Not Generated' },
  { id: 's2', roll_number: '22CS114', full_name: 'A. Meghana', department: 'CSE', year: 3, semester: 5, section: 'A', is_registered: true, mid1_marks: 19, assignment_marks: 9, attendance_percentage: 92, fee_balance: 0, hall_ticket_status: 'Not Generated' },
  { id: 's3', roll_number: '22EC067', full_name: 'R. Karthik', department: 'ECE', year: 3, semester: 5, section: 'A', is_registered: true, mid1_marks: 14, assignment_marks: 7, attendance_percentage: 71, fee_balance: 75000, hall_ticket_status: 'Not Generated' },
  { id: 's4', roll_number: '22CS102', full_name: 'J. Rahul', department: 'CSE', year: 3, semester: 5, section: 'B', is_registered: false, mid1_marks: 0, assignment_marks: 0, attendance_percentage: 80, fee_balance: 15000, hall_ticket_status: 'Not Generated' },
  { id: 's5', roll_number: 'AIML26001', full_name: 'Alapati Charan', department: 'AIML', year: 2, semester: 3, section: 'B', is_registered: true, mid1_marks: 0, assignment_marks: 0, attendance_percentage: 100, fee_balance: 75000, hall_ticket_status: 'Not Generated' },
  { id: 's6', roll_number: 'AIML26002', full_name: 'Meka Krishna', department: 'AIML', year: 2, semester: 3, section: 'B', is_registered: true, mid1_marks: 0, assignment_marks: 0, attendance_percentage: 100, fee_balance: 75000, hall_ticket_status: 'Not Generated' },
  { id: 's7', roll_number: 'AIML26003', full_name: 'Boddu Varun', department: 'AIML', year: 2, semester: 3, section: 'A', is_registered: true, mid1_marks: 0, assignment_marks: 0, attendance_percentage: 90, fee_balance: 75000, hall_ticket_status: 'Not Generated' }
];

// ONLY Sanjay Gupta has started / completed course registration
const DEFAULT_STUDENT_COURSE_REGISTRATIONS: Record<string, string[]> = {
  "22CS101": ["26DS301", "23DS302", "CS501", "CS502"],
  "AIDS26005": ["26DS301", "23DS302", "CS501", "CS502"],
  "Sanjay Gupta": ["26DS301", "23DS302", "CS501", "CS502"]
};

const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

export const getMockCourses = (): MockCourseOffering[] => {
  if (!isBrowser) return DEFAULT_COURSES;
  try {
    const data = localStorage.getItem('mock_offered_courses_v3');
    if (!data) {
      localStorage.setItem('mock_offered_courses_v3', JSON.stringify(DEFAULT_COURSES));
      return DEFAULT_COURSES;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_COURSES;
  }
};

export const saveMockCourses = (courses: MockCourseOffering[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('mock_offered_courses_v3', JSON.stringify(courses));
  } catch (e) {}
};

export const getMockExams = (): MockExamSchedule[] => {
  if (!isBrowser) return DEFAULT_EXAMS;
  try {
    const data = localStorage.getItem('mock_scheduled_exams_v3');
    if (!data) {
      localStorage.setItem('mock_scheduled_exams_v3', JSON.stringify(DEFAULT_EXAMS));
      return DEFAULT_EXAMS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_EXAMS;
  }
};

export const saveMockExams = (exams: MockExamSchedule[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('mock_scheduled_exams_v3', JSON.stringify(exams));
  } catch (e) {}
};

export const getMockTimetables = (): MockExamTimetable[] => {
  if (!isBrowser) return DEFAULT_TIMETABLES;
  try {
    const data = localStorage.getItem('mock_timetables_v3');
    if (!data) {
      localStorage.setItem('mock_timetables_v3', JSON.stringify(DEFAULT_TIMETABLES));
      return DEFAULT_TIMETABLES;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_TIMETABLES;
  }
};

export const saveMockTimetables = (timetables: MockExamTimetable[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('mock_timetables_v3', JSON.stringify(timetables));
  } catch (e) {}
};

export const getMockStudents = (): MockStudent[] => {
  if (!isBrowser) return DEFAULT_STUDENTS;
  try {
    const data = localStorage.getItem('mock_students_db_v3');
    if (!data) {
      localStorage.setItem('mock_students_db_v3', JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_STUDENTS;
  }
};

export const saveMockStudents = (students: MockStudent[]) => {
  if (!isBrowser) return;
  try {
    localStorage.setItem('mock_students_db_v3', JSON.stringify(students));
  } catch (e) {}
};

export const getStudentCourseRegistrations = (): Record<string, string[]> => {
  if (!isBrowser) return DEFAULT_STUDENT_COURSE_REGISTRATIONS;
  try {
    const data = localStorage.getItem('mock_student_course_registrations');
    if (!data) {
      localStorage.setItem('mock_student_course_registrations', JSON.stringify(DEFAULT_STUDENT_COURSE_REGISTRATIONS));
      return DEFAULT_STUDENT_COURSE_REGISTRATIONS;
    }
    const map: Record<string, string[]> = JSON.parse(data);
    return { ...DEFAULT_STUDENT_COURSE_REGISTRATIONS, ...map };
  } catch (e) {
    return DEFAULT_STUDENT_COURSE_REGISTRATIONS;
  }
};

export const saveStudentCourseRegistration = (identifier: string, courseCode: string) => {
  if (!isBrowser || !identifier) return;
  try {
    const current = getStudentCourseRegistrations();
    const cleanId = identifier.trim();
    const userRegs = current[cleanId] || [];
    if (!userRegs.includes(courseCode)) {
      current[cleanId] = [...userRegs, courseCode];
      localStorage.setItem('mock_student_course_registrations', JSON.stringify(current));
    }
  } catch (e) {}
};

export const toggleStudentCourseRegistration = (identifier: string, courseCode: string) => {
  if (!isBrowser || !identifier) return false;
  try {
    const current = getStudentCourseRegistrations();
    const cleanId = identifier.trim();
    const userRegs = current[cleanId] || [];
    let isNowReg = false;
    if (userRegs.includes(courseCode)) {
      current[cleanId] = userRegs.filter(c => c !== courseCode);
      isNowReg = false;
    } else {
      current[cleanId] = [...userRegs, courseCode];
      isNowReg = true;
    }
    localStorage.setItem('mock_student_course_registrations', JSON.stringify(current));
    return isNowReg;
  } catch (e) {
    return false;
  }
};

const STUDENT_NAMES_24 = [
  "Alapati Charan", "Meka Krishna", "Boddu Varun", "K. Sai Teja",
  "Sanjay Gupta", "A. Meghana", "R. Karthik", "J. Rahul",
  "P. Ananya", "M. Vikram", "V. Swetha", "G. Harish",
  "K. Pooja", "T. Dinesh", "S. Kavya", "N. Pradeep",
  "D. Ramya", "B. Akhil", "C. Deepthi", "Y. Tarun",
  "L. Bhavana", "M. Naresh", "K. Bhavya", "Ch. Pawan"
];

const generate24StudentsForSection = (dept: string, secLabel: string, courseCode: string) => {
  const studentRegsMap = getStudentCourseRegistrations();

  return Array.from({ length: 24 }).map((_, i) => {
    const rollNum = `${dept}260${(i + 1).toString().padStart(2, "0")}`;
    const studentName = STUDENT_NAMES_24[i] || `Student ${i + 1}`;

    const rollRegs = studentRegsMap[rollNum] || [];
    const nameRegs = studentRegsMap[studentName] || [];

    // Evaluate exact registration status for this specific course
    const isRegistered = rollRegs.includes(courseCode) || nameRegs.includes(courseCode);

    return {
      roll_number: rollNum,
      name: studentName,
      attendance: isRegistered ? 86 : 0,
      mid1: isRegistered ? 19 : 0,
      mid2: isRegistered ? 19 : 0,
      assignment: isRegistered ? 7 : 0,
      status: "Draft" as const,
      is_registered: isRegistered
    };
  });
};

// Dynamic helper to resolve exact appointed/assigned section subjects for a logged-in faculty
export const getFacultyAssignedSections = (facultyName?: string): FacultyAssignedSubjectItem[] => {
  const courses = getMockCourses();
  let activeName = (facultyName || "").trim();

  if (!activeName && typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("cms_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u && u.name) activeName = u.name;
      }
    } catch (e) {}
  }
  if (!activeName) activeName = "Karan Mishra";

  const assigned: FacultyAssignedSubjectItem[] = [];

  courses.forEach(c => {
    if (Array.isArray(c.sections)) {
      c.sections.forEach((sec: any) => {
        let mentorName = "";
        let secLabel = "A";

        if (typeof sec === "object" && sec !== null) {
          mentorName = sec.mentor_name || "";
          secLabel = sec.section || "A";
        } else if (typeof sec === "string") {
          secLabel = sec;
          mentorName = "Arjun Shastri";
        }

        const isMatch = mentorName.toLowerCase().includes(activeName.toLowerCase()) || 
                        activeName.toLowerCase().includes(mentorName.toLowerCase()) ||
                        !mentorName;

        if (isMatch) {
          const studentRoster = generate24StudentsForSection(c.department, secLabel, c.course_code);
          const enrolledCount = studentRoster.filter(s => s.is_registered).length;

          assigned.push({
            id: `${c.id}-${secLabel}`,
            subjectCode: c.course_code,
            subjectName: c.course_name,
            department: c.department,
            year: c.year,
            semester: c.semester,
            section: secLabel,
            studentCount: enrolledCount,
            courseType: c.course_type || "Normal Subject",
            credits: c.credits || 3,
            status: c.status === 'Approved' ? 'In Progress' : 'Draft',
            students: studentRoster
          });
        }
      });
    }
  });

  return assigned;
};
