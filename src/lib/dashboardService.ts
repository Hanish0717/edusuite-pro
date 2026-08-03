export interface ActivityLogItem {
  id: string;
  title: string;
  meta: string;
}

export const MOCK_ACTIVITIES: ActivityLogItem[] = [
  { id: "ACT-01", title: "Admission approved for 12 applicants", meta: "Admissions - 8 min ago" },
  { id: "ACT-02", title: "Attendance override request raised", meta: "CSE - 42 min ago" },
  { id: "ACT-03", title: "Fee receipt #INV-20481 generated", meta: "Finance - 1 hr ago" },
  { id: "ACT-04", title: "Placement drive scheduled: Infosys", meta: "Placements - 3 hrs ago" },
];

export const AI_INSIGHTS_MAP: Record<string, string[]> = {
  "super-admin": [
    "32 students are at risk academically across 4 departments.",
    "Fee collection is 18% higher than the same month last year.",
    "Hostel occupancy has reached 82% - plan room allocation.",
    "5 departments have pending NAAC documentation.",
  ],
  staff: [
    "7 students in CSE II-A are below 75% attendance.",
    "Suggested revision topics for DBMS Unit 3 based on quiz scores.",
    "Assignment evaluation backlog can be cleared in ~2 hours.",
  ],
  student: [
    "Your attendance is 88% - safe, but 2 more absences drops you below 85%.",
    "Focus on Operating Systems: scores trail your CGPA by 6%.",
    "3 placement drives match your profile this month.",
  ],
  parent: [
    "Sai Teja's attendance improved by 4% this month.",
    "No pending fee dues for the current semester.",
    "Internal test results will be published on 27 May.",
  ],
  hod: [
    "Department results improved by 8% this month.",
    "12 students are at risk in DBMS - schedule remedial classes.",
    "Faculty workload is unbalanced across 3 subjects.",
  ],
};

export function fetchActivities(): ActivityLogItem[] {
  return MOCK_ACTIVITIES;
}

export function fetchAiInsightsForRole(role: string): string[] {
  return AI_INSIGHTS_MAP[role] || AI_INSIGHTS_MAP["staff"];
}
