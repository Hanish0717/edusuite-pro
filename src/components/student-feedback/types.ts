export interface FacultyFeedbackForm {
  facultyName: string;
  subject: string;
  teachingQuality: number;
  communication: number;
  knowledge: number;
  interaction: number;
  punctuality: number;
  comments: string;
}

export interface CourseFeedbackForm {
  courseCode: string;
  courseName: string;
  courseContent: number;
  lab: number;
  assignments: number;
  resources: number;
  difficulty: number;
  overallExperience: number;
  suggestions: string;
}

export interface FeedbackSummaryKPIs {
  feedbackSubmitted: number;
  pendingFeedback: number;
  averageRating: number;
  activeSurveys: number;
}

export interface ActiveSurveyItem {
  id: string;
  title: string;
  type: "Faculty" | "Course" | "Institutional";
  dueDate: string;
  target: string;
  status: "Pending" | "Completed";
}

export interface PreviousFeedbackRecord {
  id: string;
  date: string;
  title: string;
  type: "Faculty Feedback" | "Course Feedback";
  rating: number;
  status: "Submitted";
}
