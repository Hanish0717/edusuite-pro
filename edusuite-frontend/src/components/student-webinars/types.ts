export type WebinarStatus = "upcoming" | "live" | "completed";

export type WebinarTab =
  | "upcoming"
  | "live"
  | "registered"
  | "completed"
  | "certificates"
  | "recordings";

export interface Speaker {
  id: string;
  name: string;
  role: string;
  organization?: string;
  avatar: string;
  bio?: string;
}

export interface Webinar {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  bannerImage: string;
  status: WebinarStatus;
  dateBadge: { month: string; day: string }; // e.g. { month: "AUG", day: "10" }
  startDate: string; // ISO date
  displayTime: string; // e.g. "11:00 AM - 12:30 PM"
  duration: string; // e.g. "1h 30m"
  speaker: Speaker;
  description?: string;
  agenda?: string[];
  totalSeats: number;
  registeredCount: number;
  seatsLeft: number;
  isRegistered: boolean;
  isFeatured?: boolean;
  isBookmarked?: boolean;
}

export interface CertificateItem {
  id: string;
  webinarId: string;
  certificateName: string;
  webinarTitle: string;
  issueDate: string;
  issuerName: string;
  certificateCode: string;
  downloadUrl: string;
}

export interface RecordingItem {
  id: string;
  webinarId: string;
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  speaker: Speaker;
  views: number;
  recordedDate: string;
  isBookmarked: boolean;
}

export interface ScheduleTimelineItem {
  id: string;
  dateLabel: string; // e.g. "Today, Aug 8"
  title: string;
  time: string;
  speakerName?: string;
}

export interface WebinarKpi {
  id: string;
  title: string;
  value: string | number;
  subtext: string;
  icon: string; // icon name or key
  targetTab: WebinarTab;
}
