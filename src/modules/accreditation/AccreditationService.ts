import api from "@/lib/api";

export interface NaacCriterion {
  id: string;
  code: string; // e.g., C1, C2
  name: string;
  weightage: number;
  scoreObtained: number;
  maxScore: number;
  status: "Completed" | "In Review" | "Pending Data";
}

export interface NbaProgram {
  id: string;
  programName: string;
  department: string;
  tier: "Tier-1 (WA Accredited)" | "Tier-2";
  accreditationStatus: "Accredited (6 Years)" | "Accredited (3 Years)" | "Application Submitted";
  validUntil: string;
  sarProgress: number;
}

export const INITIAL_NAAC: NaacCriterion[] = [
  { id: "1", code: "Criterion I", name: "Curricular Aspects", weightage: 100, scoreObtained: 96, maxScore: 100, status: "Completed" },
  { id: "2", code: "Criterion II", name: "Teaching-Learning and Evaluation", weightage: 350, scoreObtained: 338, maxScore: 350, status: "Completed" },
  { id: "3", code: "Criterion III", name: "Research, Innovations and Extension", weightage: 120, scoreObtained: 112, maxScore: 120, status: "In Review" },
  { id: "4", code: "Criterion IV", name: "Infrastructure and Learning Resources", weightage: 100, scoreObtained: 95, maxScore: 100, status: "Completed" },
  { id: "5", code: "Criterion V", name: "Student Support and Progression", weightage: 130, scoreObtained: 124, maxScore: 130, status: "Completed" },
  { id: "6", code: "Criterion VI", name: "Governance, Leadership and Management", weightage: 100, scoreObtained: 92, maxScore: 100, status: "In Review" },
  { id: "7", code: "Criterion VII", name: "Institutional Values and Best Practices", weightage: 100, scoreObtained: 98, maxScore: 100, status: "Completed" },
];

export const INITIAL_NBA: NbaProgram[] = [
  { id: "N1", programName: "B.Tech Computer Science & Engineering", department: "CSE", tier: "Tier-1 (WA Accredited)", accreditationStatus: "Accredited (6 Years)", validUntil: "2030-06-30", sarProgress: 100 },
  { id: "N2", programName: "B.Tech Electronics & Communication", department: "ECE", tier: "Tier-1 (WA Accredited)", accreditationStatus: "Accredited (6 Years)", validUntil: "2029-06-30", sarProgress: 100 },
  { id: "N3", programName: "B.Tech Artificial Intelligence & Data Science", department: "AI&DS", tier: "Tier-1 (WA Accredited)", accreditationStatus: "Accredited (3 Years)", validUntil: "2027-06-30", sarProgress: 88 },
];

export async function fetchNaacCriteria(): Promise<NaacCriterion[]> {
  try {
    const res = await api.get("/api/accreditation/naac");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_NAAC;
}

export async function fetchNbaPrograms(): Promise<NbaProgram[]> {
  try {
    const res = await api.get("/api/accreditation/nba");
    if (res && Array.isArray(res.data) && res.data.length > 0) return res.data;
  } catch {}
  return INITIAL_NBA;
}

export async function updateNaacScore(id: string, score: number): Promise<void> {
  try {
    await api.patch(`/api/accreditation/naac/${id}`, { scoreObtained: score });
  } catch {}
}
