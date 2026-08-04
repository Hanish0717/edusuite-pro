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
  status: 'Pending' | 'Approved' | 'Rejected';
  sections: string[];
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
  
  // Eligibility & Hall Ticket Fields
  attendance_percentage?: number;
  fee_balance?: number;
  hall_ticket_status?: 'Not Generated' | 'Generated';
}

const DEFAULT_COURSES: MockCourseOffering[] = [
  { id: '1', course_code: 'ML03301', course_name: 'Probability and Statistics', department: 'AIML', year: 2, semester: 3, credits: 4, status: 'Pending', sections: ['A', 'B'] },
  { id: '2', course_code: 'ML03302', course_name: 'Introduction to Neural Networks', department: 'AIML', year: 2, semester: 3, credits: 3, status: 'Pending', sections: ['A', 'B'] },
  { id: '3', course_code: 'CS301', course_name: 'Formal Languages and Automata', department: 'CSE', year: 3, semester: 5, credits: 4, status: 'Approved', sections: ['A', 'B', 'C'] },
  { id: '4', course_code: 'CS302', course_name: 'Computer Networks', department: 'CSE', year: 3, semester: 5, credits: 3, status: 'Approved', sections: ['A', 'B', 'C'] }
];

const DEFAULT_EXAMS: MockExamSchedule[] = [
  { id: 'e1', name: 'B.Tech CSE Sem 5 End Exams 2026', type: 'Regular', department: 'CSE', year: 3, semester: 5, startDate: '2026-08-10', endDate: '2026-08-20', status: 'Upcoming', enrollmentDeadline: '2026-08-08' },
  { id: 'e2', name: 'B.Tech AIML Sem 3 Regular Mid-term', type: 'Mid-term', department: 'AIML', year: 2, semester: 3, startDate: '2026-08-15', endDate: '2026-08-22', status: 'Pending Approval' }
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

export const getMockCourses = (): MockCourseOffering[] => {
  const data = localStorage.getItem('mock_offered_courses_v3');
  if (!data) {
    localStorage.setItem('mock_offered_courses_v3', JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  }
  return JSON.parse(data);
};

export const saveMockCourses = (courses: MockCourseOffering[]) => {
  localStorage.setItem('mock_offered_courses_v3', JSON.stringify(courses));
};

export const getMockExams = (): MockExamSchedule[] => {
  const data = localStorage.getItem('mock_scheduled_exams_v3');
  if (!data) {
    localStorage.setItem('mock_scheduled_exams_v3', JSON.stringify(DEFAULT_EXAMS));
    return DEFAULT_EXAMS;
  }
  return JSON.parse(data);
};

export const saveMockExams = (exams: MockExamSchedule[]) => {
  localStorage.setItem('mock_scheduled_exams_v3', JSON.stringify(exams));
};

export const getMockStudents = (): MockStudent[] => {
  const data = localStorage.getItem('mock_students_db_v3');
  if (!data) {
    localStorage.setItem('mock_students_db_v3', JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  }
  return JSON.parse(data);
};

export const saveMockStudents = (students: MockStudent[]) => {
  localStorage.setItem('mock_students_db_v3', JSON.stringify(students));
};

export interface MockTimetableSlot {
  subjectCode: string;
  subjectName: string;
  examDate: string;
  sessionSlot: string;
  halls: string[];
  duration: string;
}

export interface MockExamTimetable {
  id: string;
  examScheduleId: string;
  department: string;
  year: number;
  semester: number;
  status: 'Draft' | 'Submitted' | 'Approved';
  slots: MockTimetableSlot[];
}

export const getMockTimetables = (): MockExamTimetable[] => {
  const data = localStorage.getItem('mock_timetables_v3');
  if (!data) {
    return [];
  }
  return JSON.parse(data);
};

export const saveMockTimetables = (timetables: MockExamTimetable[]) => {
  localStorage.setItem('mock_timetables_v3', JSON.stringify(timetables));
};
