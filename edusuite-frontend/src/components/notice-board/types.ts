export type NoticeCategory =
  | "All Notices"
  | "Academics"
  | "Examinations"
  | "Placements"
  | "Scholarships"
  | "Events"
  | "Hostel"
  | "Transport"
  | "Library"
  | "Finance";

export type NoticePriority = "Urgent" | "High" | "Normal" | "Low";

export interface NoticeAttachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "link";
  size?: string;
  url: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  shortDescription: string;
  fullNotice: string;
  category: NoticeCategory;
  priority: NoticePriority;
  department: string;
  issuedBy: string;
  publishedDate: string;
  expiryDate: string;
  read: boolean;
  bookmarked: boolean;
  pinned?: boolean;
  attachments?: NoticeAttachment[];
  relatedLinks?: { title: string; url: string }[];
}

export interface DeadlineItem {
  id: string;
  title: string;
  date: string;
  category: string;
  urgent?: boolean;
}

export interface HolidayItem {
  id: string;
  title: string;
  date: string;
  day: string;
}
