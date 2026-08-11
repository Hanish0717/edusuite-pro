import api from "@/lib/api";

export interface CampusNotice {
  id: string;
  noticeNumber: string;
  title: string;
  category: "Academic" | "Examination" | "Placement" | "Fee Payment" | "Emergency Alert";
  audience: "All Students" | "Faculty & Staff" | "Parents" | "All Campus";
  publishDate: string;
  postedBy: string;
  priority: "High" | "Normal" | "Urgent";
  description: string;
}

export const INITIAL_NOTICES: CampusNotice[] = [
  {
    id: "N-101",
    noticeNumber: "NOT-2026-088",
    title: "Odd Semester Final Examination Schedule & Hall Ticket Download",
    category: "Examination",
    audience: "All Students",
    publishDate: "2026-08-01",
    postedBy: "Controller of Examinations",
    priority: "High",
    description: "All registered UG/PG students can download their hall tickets from the student portal effective Aug 5, 2026.",
  },
  {
    id: "N-102",
    noticeNumber: "NOT-2026-092",
    title: "Amazon AWS & Google Recruitment Drive Registration Open",
    category: "Placement",
    audience: "All Students",
    publishDate: "2026-08-02",
    postedBy: "Placement & Training Cell",
    priority: "Urgent",
    description: "Eligible B.Tech 7th Semester CSE, ECE & AI&DS students must submit their updated resumes before Aug 10, 2026.",
  },
];

export async function fetchCampusNotices(): Promise<CampusNotice[]> {
  try {
    const res = await api.get("/api/communication/notices");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_NOTICES;
}

export async function publishCampusNotice(data: Partial<CampusNotice>): Promise<CampusNotice> {
  try {
    const res = await api.post("/api/communication/notices", data);
    if (res && res.data && res.data.id) return res.data;
  } catch {}
  return {
    id: `N-${Math.floor(103 + Math.random() * 900)}`,
    noticeNumber: `NOT-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: data.title || "New Campus Announcement",
    category: data.category || "Academic",
    audience: data.audience || "All Campus",
    publishDate: new Date().toISOString().split("T")[0],
    postedBy: "Institutional Admin",
    priority: data.priority || "Normal",
    description: data.description || "Official announcement content.",
  };
}
