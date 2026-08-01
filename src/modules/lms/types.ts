export interface ResourceItem {
  id: string;
  title: string;
  type: "PDF Document" | "Video Lecture" | "Assignment Sheet";
  subject: string;
  department: string;
  size: string;
  url?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  subject: string;
  department: string;
  duration: string;
  instructor: string;
  videoUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  department: string;
  dueDate: string;
  description: string;
  submissionCount: number;
  totalStudents: number;
  status: "Pending" | "Submitted" | "Graded";
  submittedFile?: string;
  grade?: string;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  department: string;
  date: string;
  durationMins: number;
  questionsCount: number;
  questions: QuizQuestion[];
  completed?: boolean;
  score?: number;
}

export interface ForumComment {
  id: string;
  author: string;
  role: "Student" | "Faculty" | "Admin" | "Super Admin";
  content: string;
  date: string;
}

export interface ForumPost {
  id: string;
  title: string;
  category: "General" | "Doubts" | "Announcements";
  department: string;
  author: string;
  role: string;
  date: string;
  content: string;
  comments: ForumComment[];
}

export interface ClassItem {
  id: string;
  subject: string;
  department: string;
  topic: string;
  instructor: string;
  date: string;
  time: string;
  link: string;
  status: "Upcoming" | "Live" | "Completed";
}

export interface SyllabusSubject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  coveragePct: number;
  credits: number;
  regulation: string;
}
