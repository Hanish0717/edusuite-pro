export interface NaacCriteriaItem {
  id: string;
  name: string;
  score: string;
  numericScore: number;
  weightage: string;
  weightageNumber: number;
  readiness: number;
  evidencesCount: number;
}

export interface NaacEvidenceDocument {
  id: string;
  title: string;
  criteriaId: string;
  department: string;
  uploadedDate: string;
  status: "Verified" | "Under Audit" | "Action Needed";
}

export interface NbaProgramAttainment {
  code: string;
  departmentName: string;
  status: "Accredited (Tier-1)" | "Accredited (Tier-2)" | "Under Evaluation";
  validTill: string;
  attainmentPercentage: number;
}

export interface IqacReportItem {
  id: string;
  title: string;
  quarter: string;
  generatedDate: string;
  status: "Submitted to NAAC" | "Internal Approval" | "Draft";
  fileSize: string;
}

export interface NaacSummaryStats {
  targetGrade: string;
  nbaAccreditedRatio: string;
  overallReadinessPercentage: string;
  verifiedEvidencesCount: string;
  simulatedCgpa: string;
}

export const MOCK_NAAC_CRITERIA: NaacCriteriaItem[] = [
  {
    id: "C1",
    name: "Curricular Aspects",
    score: "3.75 / 4.0",
    numericScore: 3.75,
    weightage: "15%",
    weightageNumber: 15,
    readiness: 95,
    evidencesCount: 540,
  },
  {
    id: "C2",
    name: "Teaching-Learning and Evaluation",
    score: "3.60 / 4.0",
    numericScore: 3.6,
    weightage: "30%",
    weightageNumber: 30,
    readiness: 90,
    evidencesCount: 1280,
  },
  {
    id: "C3",
    name: "Research, Innovations and Extension",
    score: "3.45 / 4.0",
    numericScore: 3.45,
    weightage: "15%",
    weightageNumber: 15,
    readiness: 86,
    evidencesCount: 620,
  },
  {
    id: "C4",
    name: "Infrastructure and Learning Resources",
    score: "3.80 / 4.0",
    numericScore: 3.8,
    weightage: "10%",
    weightageNumber: 10,
    readiness: 95,
    evidencesCount: 480,
  },
  {
    id: "C5",
    name: "Student Support and Progression",
    score: "3.70 / 4.0",
    numericScore: 3.7,
    weightage: "10%",
    weightageNumber: 10,
    readiness: 92,
    evidencesCount: 510,
  },
  {
    id: "C6",
    name: "Governance, Leadership and Management",
    score: "3.65 / 4.0",
    numericScore: 3.65,
    weightage: "10%",
    weightageNumber: 10,
    readiness: 91,
    evidencesCount: 390,
  },
  {
    id: "C7",
    name: "Institutional Values and Best Practices",
    score: "3.90 / 4.0",
    numericScore: 3.9,
    weightage: "10%",
    weightageNumber: 10,
    readiness: 98,
    evidencesCount: 300,
  },
];

export const MOCK_NBA_PROGRAMS: NbaProgramAttainment[] = [
  {
    code: "CSE",
    departmentName: "Computer Science & Engineering",
    status: "Accredited (Tier-1)",
    validTill: "2028-06-30",
    attainmentPercentage: 92,
  },
  {
    code: "ECE",
    departmentName: "Electronics & Communication Engineering",
    status: "Accredited (Tier-1)",
    validTill: "2027-06-30",
    attainmentPercentage: 88,
  },
  {
    code: "EEE",
    departmentName: "Electrical & Electronics Engineering",
    status: "Accredited (Tier-2)",
    validTill: "2026-12-31",
    attainmentPercentage: 84,
  },
  {
    code: "ME",
    departmentName: "Mechanical Engineering",
    status: "Accredited (Tier-1)",
    validTill: "2028-06-30",
    attainmentPercentage: 86,
  },
  {
    code: "Civil",
    departmentName: "Civil Engineering",
    status: "Accredited (Tier-2)",
    validTill: "2026-06-30",
    attainmentPercentage: 82,
  },
  {
    code: "MBA",
    departmentName: "Master of Business Administration",
    status: "Under Evaluation",
    validTill: "Pending Renewal",
    attainmentPercentage: 90,
  },
];

export const MOCK_IQAC_REPORTS: IqacReportItem[] = [
  {
    id: "AQAR-2025",
    title: "Annual Quality Assurance Report (AQAR) 2024-25",
    quarter: "Annual Submission",
    generatedDate: "2026-07-15",
    status: "Submitted to NAAC",
    fileSize: "14.2 MB",
  },
  {
    id: "IQAC-Q1-26",
    title: "IQAC Q1 Action Taken Report (ATR) 2026",
    quarter: "Q1 2026",
    generatedDate: "2026-06-30",
    status: "Internal Approval",
    fileSize: "4.8 MB",
  },
  {
    id: "IQAC-OBE-AUDIT",
    title: "Outcome Based Education (OBE) Audit Log",
    quarter: "Sem 1 2026",
    generatedDate: "2026-05-20",
    status: "Submitted to NAAC",
    fileSize: "8.5 MB",
  },
];

export function fetchNaacCriteria(): NaacCriteriaItem[] {
  return MOCK_NAAC_CRITERIA;
}

export function fetchNbaPrograms(): NbaProgramAttainment[] {
  return MOCK_NBA_PROGRAMS;
}

export function fetchIqacReports(): IqacReportItem[] {
  return MOCK_IQAC_REPORTS;
}

export function calculateNaacSummaryStats(): NaacSummaryStats {
  const criteria = MOCK_NAAC_CRITERIA;

  // Weighted readiness calculation
  const totalReadiness = criteria.reduce(
    (acc, curr) => acc + (curr.readiness * curr.weightageNumber) / 100,
    0,
  );

  // Total evidences count
  const totalEvidences = criteria.reduce((acc, curr) => acc + curr.evidencesCount, 0);

  // Simulated weighted CGPA
  const weightedScoreSum = criteria.reduce(
    (acc, curr) => acc + curr.numericScore * curr.weightageNumber,
    0,
  );
  const simCgpa = (weightedScoreSum / 100).toFixed(2);

  const nbaAccreditedCount = MOCK_NBA_PROGRAMS.filter((p) =>
    p.status.includes("Accredited"),
  ).length;

  return {
    targetGrade: `A++ (CGPA > 3.6)`,
    nbaAccreditedRatio: `${nbaAccreditedCount} / ${MOCK_NBA_PROGRAMS.length}`,
    overallReadinessPercentage: `${totalReadiness.toFixed(1)}%`,
    verifiedEvidencesCount: `${totalEvidences.toLocaleString()} Files`,
    simulatedCgpa: simCgpa,
  };
}
