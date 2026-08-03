export type UpdateCategory =
  | "New Feature"
  | "Enhancement"
  | "Bug Fix"
  | "Maintenance"
  | "Security"
  | "Announcement"
  | "Release Notes";

export type UpdateStatus = "Released" | "Live" | "Completed" | "Beta";

export interface ErpUpdateItem {
  id: string;
  version: string;
  title: string;
  category: UpdateCategory;
  status: UpdateStatus;
  isRead: boolean;
  isPinned?: boolean;
  publishedDate: string;
  shortDescription: string;
  fullDescription: string;
  featuresAdded: string[];
  attachmentName?: string;
  attachmentUrl?: string;
}
