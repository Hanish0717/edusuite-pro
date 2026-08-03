import api from "@/lib/api";

export interface AdmissionApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  category: "General" | "OBC" | "SC/ST" | "Management Quota";
  meritScore: string;
  status: "Under Review" | "Verified" | "Seat Allotted" | "Admitted" | "Rejected";
  dateSubmitted: string;
  documents: string;
  previousInstitute?: string;
}

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: "APP-2026-001",
    name: "Rohan Verma",
    email: "rohan.v@gmail.com",
    phone: "+91 9876543210",
    course: "B.Tech Computer Science (CSE)",
    category: "General",
    meritScore: "96.4%",
    status: "Verified",
    dateSubmitted: "2026-07-28",
    documents: "All 5 Verified (10th, 12th, TC, Aadhaar)",
    previousInstitute: "Delhi Public School, HYD",
  },
  {
    id: "APP-2026-002",
    name: "Priya Sundaram",
    email: "priya.s@outlook.com",
    phone: "+91 9123456789",
    course: "B.Tech Electronics (ECE)",
    category: "OBC",
    meritScore: "94.8%",
    status: "Under Review",
    dateSubmitted: "2026-07-29",
    documents: "Pending Migration Certificate",
    previousInstitute: "Chaitanya Junior College",
  },
  {
    id: "APP-2026-003",
    name: "Anish Kulkarni",
    email: "akulkarni@yahoo.com",
    phone: "+91 9988776655",
    course: "B.Tech Mechanical (ME)",
    category: "General",
    meritScore: "88.2%",
    status: "Admitted",
    dateSubmitted: "2026-07-25",
    documents: "All Verified & Fees Paid",
    previousInstitute: "Narayana STEM Academy",
  },
  {
    id: "APP-2026-004",
    name: "Sneha Reddy",
    email: "snehareddy@gmail.com",
    phone: "+91 9765432109",
    course: "MBA (Data Analytics)",
    category: "General",
    meritScore: "91.0%",
    status: "Seat Allotted",
    dateSubmitted: "2026-07-30",
    documents: "Degree Certificates Verified",
    previousInstitute: "Loyola Academy Degree College",
  },
  {
    id: "APP-2026-005",
    name: "Karthik Raja",
    email: "karthik.r@gmail.com",
    phone: "+91 9848022334",
    course: "B.Tech AI & Data Science",
    category: "Management Quota",
    meritScore: "93.5%",
    status: "Under Review",
    dateSubmitted: "2026-08-01",
    documents: "12th Marksheet & Rank Card Attached",
    previousInstitute: "FIITJEE Junior College",
  },
];

export async function fetchAdmissionApplications(): Promise<AdmissionApplication[]> {
  try {
    const res = await api.get("/api/admission");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_ADMISSIONS;
}

export async function createAdmissionApplication(
  appData: Partial<AdmissionApplication>,
): Promise<AdmissionApplication> {
  try {
    const res = await api.post("/api/admission", appData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newApp: AdmissionApplication = {
    id: `APP-2026-${Math.floor(106 + Math.random() * 900)}`,
    name: appData.name || "New Applicant",
    email: appData.email || "applicant@gmail.com",
    phone: appData.phone || "+91 9000000000",
    course: appData.course || "B.Tech Computer Science (CSE)",
    category: appData.category || "General",
    meritScore: appData.meritScore || "90.0%",
    status: appData.status || "Under Review",
    dateSubmitted: new Date().toISOString().split("T")[0],
    documents: appData.documents || "Application Submitted",
    previousInstitute: appData.previousInstitute || "Central Board School",
  };

  return newApp;
}

export async function updateAdmissionStatus(
  id: string,
  status: AdmissionApplication["status"],
): Promise<Partial<AdmissionApplication>> {
  try {
    const res = await api.put(`/api/admission/${id}`, { status });
    if (res && res.data) return res.data;
  } catch {}
  return { id, status };
}

export async function deleteAdmissionApplication(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/admission/${id}`);
  } catch {}
  return true;
}
