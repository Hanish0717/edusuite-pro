export type AlumniTab =
  | "dashboard"
  | "directory"
  | "career"
  | "mentorship"
  | "events"
  | "donations"
  | "analytics"
  | "profile";

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  badge?: string;
  iconType?: "education" | "work" | "award" | "event";
}

export interface AlumniProfileItem {
  id: string;
  name: string;
  avatar: string;
  batch: string;
  dept: string;
  company: string;
  designation: string;
  location: string;
  country: string;
  experienceYears: number;
  skills: string[];
  mentoringStatus: "Active Mentor" | "Open to Referrals" | "Guest Speaker" | "Industry Advisor";
  employmentStatus: "Employed" | "Entrepreneur" | "Higher Studies" | "Research Fellow";
  email: string;
  phone: string;
  bio: string;
  achievements: string[];
  educationTimeline: { degree: string; institution: string; year: string }[];
  workExperience: { role: string; company: string; duration: string }[];
  referralsSharedCount: number;
  contributionsTotal: string;
  linkedInUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  connectionsCount?: number;
  endorsements?: { skill: string; count: number }[];
}

export interface AlumniJobItem {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: "Full-Time" | "Remote" | "Hybrid" | "Contract" | "Internship";
  ctcRange: string;
  expRequired: string;
  postedBy: string;
  postedByBatch: string;
  postedByAvatar?: string;
  skills: string[];
  postedDate: string;
  department: string;
  applicationsCount: number;
  description: string;
}

export interface MentorItem {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  company: string;
  domain: string;
  expYears: number;
  availableSlots: string[];
  status: "Available" | "Busy" | "Upcoming Session";
  rating: number;
  reviewsCount: number;
  sessionsCompleted: number;
  bio: string;
  topics: string[];
}

export interface AlumniEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  speakers: { name: string; role: string; avatar?: string }[];
  registeredCount: number;
  maxCapacity: number;
  category: "Global Reunion" | "Tech Symposium" | "Career Fireside" | "Regional Meetup" | "Workshop";
  bannerImage: string;
  isRegistered?: boolean;
}

export interface DonationCampaignItem {
  id: string;
  title: string;
  category: "Merit Scholarship" | "AI Research Lab" | "Library Expansion" | "Student Emergency Fund";
  targetAmount: number;
  raisedAmount: number;
  donorsCount: number;
  daysLeft: number;
  image: string;
  description: string;
}

export interface TopContributorItem {
  id: string;
  name: string;
  avatar: string;
  batch: string;
  company: string;
  totalDonated: number;
  tier: "Platinum Visionary" | "Gold Patron" | "Silver Ambassador" | "Bronze Supporter";
  campaignName: string;
}

export interface ActivityItem {
  id: string;
  type: "job" | "mentorship" | "donation" | "event" | "profile";
  user: string;
  avatar?: string;
  action: string;
  target: string;
  timeAgo: string;
}

export interface PlacementStat {
  year: string;
  placedPercentage: number;
  avgPackageLpa: number;
  highestPackageLpa: number;
  totalOffers: number;
}

export interface InvitationItem {
  id: string;
  recipientName: string;
  recipientEmail: string;
  batch: string;
  dept: string;
  invitedBy: string;
  invitedByAvatar?: string;
  invitedDate: string;
  status: "Pending" | "Accepted" | "Expired" | "Rejected";
}

export interface StudentRecord {
  rollNumber: string;
  fullName: string;
  dept: string;
  graduationYear: string;
  dateOfBirth: string;
  degree: string;
  cgpa: string;
  verified: boolean;
}

export interface VerificationQueueItem {
  id: string;
  fullName: string;
  rollNumber: string;
  dept: string;
  graduationYear: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  studentRecordVerified: boolean;
  status: "Pending Approval" | "Approved" | "Rejected" | "Info Requested";
  submittedDate: string;
  invitedBy?: string;
}

export interface AlumniRegistrationFormData {
  fullName: string;
  rollNumber: string;
  graduationYear: string;
  dept: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  location: string;
  password?: string;
}

// PHASE 2 ENHANCEMENT TYPES
export interface PlacementDriveRequest {
  id: string;
  company: string;
  logo?: string | undefined;
  title: string;
  driveType: "On-Campus" | "Off-Campus Referral" | "Pool Drive" | "Virtual Drive";
  ctcPackage: string;
  eligibleBranches: string[];
  minCgpa: number;
  driveDate: string;
  postedByAlumni: string;
  alumniRole: string;
  status: "Pending Review" | "Approved" | "Scheduled" | "Completed" | "Rejected";
  registeredStudentsCount: number;
  description?: string | undefined;
  applicationDeadline?: string | undefined;
  hasApplied?: boolean | undefined;
  officerReviewNotes?: string | undefined;
}

export interface GuestLectureSession {
  id: string;
  speakerName: string;
  speakerAvatar: string;
  speakerRole: string;
  speakerCompany: string;
  speakerBatch: string;
  title: string;
  sessionType: "Guest Lecture" | "Technical Workshop" | "Career Guidance" | "Industry Webinar" | "Entrepreneurship Talk" | "Mock Interview Session" | "Research Seminar";
  targetDepartment: string;
  scheduledDate: string;
  scheduledTime: string;
  venueOrLink: string;
  status: "Proposed" | "Approved" | "Scheduled" | "Completed" | "Feedback Collected";
  registeredCount: number;
  rating?: number;
  certificateId?: string;
  description: string;
}

export interface StudentNetworkQuestion {
  id: string;
  studentName: string;
  studentAvatar: string;
  studentYear: string;
  studentDept: string;
  category: "Career Guidance" | "Interview Tips" | "Higher Studies" | "Tech Stack" | "Resume Feedback";
  questionTitle: string;
  questionDetail: string;
  askedDate: string;
  upvotesCount: number;
  answers: {
    id: string;
    alumniName: string;
    alumniAvatar: string;
    alumniRole: string;
    alumniCompany: string;
    alumniBatch: string;
    answerText: string;
    answeredDate: string;
    upvotes: number;
  }[];
}

export interface AlumniNewsItem {
  id: string;
  title: string;
  category: "University News" | "Placement News" | "Accreditation News" | "Research Achievements" | "Faculty Achievements" | "Student Achievements" | "Alumni Success" | "Upcoming Events";
  summary: string;
  content: string;
  publishedDate: string;
  author: string;
  readTime: string;
  image: string;
  isPinned?: boolean;
}

