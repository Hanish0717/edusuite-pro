import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Printer,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  RefreshCw,
  FileSpreadsheet,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllStudentSubmissions } from "@/lib/shared-assessment-store";


export interface InstitutionalReportItem {
  id: string;
  title: string;
  category: "Accreditation (NAAC/NIRF)" | "Annual Institutional" | "Corporate Hiring Audit" | "Branch Outcome";
  academicYear: string;
  generatedDate: string;
  fileSize: string;
  status: "Verified Audit" | "Draft";
}

const REPORTS_LIST: InstitutionalReportItem[] = [
  {
    id: "REP-101",
    title: "NAAC Criterion 5.2 Student Placement Audit Report",
    category: "Accreditation (NAAC/NIRF)",
    academicYear: "2025–2026",
    generatedDate: "2026-08-01",
    fileSize: "14.2 MB (PDF)",
    status: "Verified Audit",
  },
  {
    id: "REP-102",
    title: "NIRF India Rankings 2026 Placement Data Submission",
    category: "Accreditation (NAAC/NIRF)",
    academicYear: "2025–2026",
    generatedDate: "2026-08-01",
    fileSize: "8.6 MB (PDF)",
    status: "Verified Audit",
  },
  {
    id: "REP-103",
    title: "Comprehensive Annual Institutional Placement Report 2025–26",
    category: "Annual Institutional",
    academicYear: "2025–2026",
    generatedDate: "2026-07-28",
    fileSize: "22.5 MB (PDF)",
    status: "Verified Audit",
  },
  {
    id: "REP-104",
    title: "NBA Branch-wise Outcome & Higher Education Report",
    category: "Branch Outcome",
    academicYear: "2025–2026",
    generatedDate: "2026-07-25",
    fileSize: "11.0 MB (PDF)",
    status: "Verified Audit",
  },
];

export function PlacementReportsWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const handleGenerateNaac = () => {
    toast.success("Generated NAAC Criterion 5.2 Accreditation Audit Report PDF!");
  };

  const handleGenerateNirf = () => {
    toast.success("Generated NIRF Data Submission Report PDF!");
  };

  const allSubmissions = getAllStudentSubmissions();

  const handleExportStudentSubmissionsCSV = () => {
    const headers = [
      "Submission ID",
      "Student Roll No",
      "Student Email",
      "Department",
      "Assessment Title",
      "MCQ Score",
      "Coding Score",
      "Total Percentage",
      "Qualification Status",
      "Proctoring Violations",
      "Submission Timestamp",
    ];

    const rows = allSubmissions.map((sub) => [
      sub.id,
      sub.rollNo,
      sub.studentEmail,
      sub.department,
      sub.assessmentTitle,
      `${sub.mcqScore}/${sub.mcqTotal}`,
      `${sub.codingScore}/${sub.codingTotal}`,
      `${sub.totalPercentage}%`,
      sub.isAutoSubmitted ? "Auto-Submitted (Flagged)" : sub.passStatus ? "Passed Cutoff" : "Completed",
      `${sub.violationsLogged}/3`,
      sub.submissionTime,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `tpo_student_assessment_results_${new Date().toISOString().split("T")[0]}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${allSubmissions.length} student assessment results to Excel CSV!`);
  };


  const filteredReports = REPORTS_LIST.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudentSubmissions = allSubmissions.filter(
    (sub) =>
      sub.studentName?.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      sub.studentEmail.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      sub.rollNo.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      sub.department.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      sub.assessmentTitle.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );


  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <FileText className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-mono text-[0.7rem]">
                  Institutional Audit Ready
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  NAAC / NIRF / NBA Compliance
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Institutional Reports &amp; Assessment Scorecard Repository
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                View auto-graded student test responses, proctoring violation logs, and export Excel results for TPO records.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleExportStudentSubmissionsCSV}

              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5 shadow-md"
            >
              <FileSpreadsheet className="size-4" /> Export Student Results to Excel (.csv)
            </Button>
            <Button
              onClick={handleGenerateNaac}
              variant="outline"
              className="font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Printer className="size-4" /> Generate NAAC Report
            </Button>
          </div>
        </div>
      </div>

      {/* ── NEW SECTION: TPO STUDENT ASSESSMENT RESULTS STORED EXCEL VIEW ── */}
      <Panel
        title="Student Assessment Submissions & Auto-Graded Scorecards"
        action={
          <Button
            size="sm"
            onClick={handleExportStudentSubmissionsCSV}

            className="h-8 text-xs bg-emerald-600 text-white font-bold rounded-xl cursor-pointer gap-1"
          >
            <FileSpreadsheet className="size-3.5" /> Export Excel CSV
          </Button>
        }
      >
        <div className="space-y-4 pt-1">
          {/* SEARCH BAR FOR STUDENT RESULTS */}
          <div className="relative flex-1 w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder="Search by Roll No (e.g. 23341A4229), Student Email, Department, or Test Title..."
              className="h-9 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl font-mono"
            />
          </div>

          {/* RESULTS TABLE */}
          <div className="overflow-x-auto border border-border/70 rounded-2xl">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-mono uppercase text-[0.65rem]">
                  <th className="p-3">Roll No &amp; Email ID</th>
                  <th className="p-3">Dept</th>
                  <th className="p-3">Assessment Title</th>
                  <th className="p-3">MCQ Score</th>
                  <th className="p-3">Coding Marks</th>
                  <th className="p-3">Total %</th>
                  <th className="p-3">Proctoring</th>
                  <th className="p-3">Result Status</th>
                  <th className="p-3 text-right">Submitted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-medium font-mono text-[0.72rem]">
                {filteredStudentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-foreground">{sub.rollNo}</div>
                      <div className="text-[0.65rem] text-blue-600 font-mono">{sub.studentEmail}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[0.65rem]">{sub.department}</Badge>
                    </td>
                    <td className="p-3 font-sans font-semibold text-foreground max-w-xs truncate">
                      {sub.assessmentTitle}
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-200">
                      {sub.mcqScore} / {sub.mcqTotal}
                    </td>
                    <td className="p-3 font-bold text-purple-600">
                      {sub.codingScore} / {sub.codingTotal}
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      {sub.totalPercentage}%
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[0.62rem] font-bold ${sub.violationsLogged > 0 ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"}`}>
                        {sub.violationsLogged > 0 ? `⚠️ ${sub.violationsLogged}/3 Violations` : "✓ Clean"}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge className={sub.isAutoSubmitted ? "bg-rose-600 text-white" : sub.passStatus ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"}>
                        {sub.isAutoSubmitted ? "Auto-Submitted" : sub.passStatus ? "Passed Cutoff" : "Completed"}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-muted-foreground text-[0.65rem]">
                      {sub.submissionTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      {/* INSTITUTIONAL REPORTS DIRECTORY */}
      <Panel title="Official Institutional Reports Directory">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Report Document Title</th>
                <th className="p-3">Compliance Category</th>
                <th className="p-3">Academic Year</th>
                <th className="p-3">Generated Date</th>
                <th className="p-3">File Size</th>
                <th className="p-3">Audit Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-bold text-foreground flex items-center gap-2">
                    <FileText className="size-4 text-primary shrink-0" /> {r.title}
                  </td>
                  <td className="p-3 font-mono font-semibold text-muted-foreground">{r.category}</td>
                  <td className="p-3 font-mono">{r.academicYear}</td>
                  <td className="p-3 font-mono">{r.generatedDate}</td>
                  <td className="p-3 font-mono font-bold text-purple-600">{r.fileSize}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600">{r.status}</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Previewing ${r.title}`)} className="h-7 text-xs rounded-xl cursor-pointer">
                        <Eye className="size-3 mr-1" /> Preview
                      </Button>
                      <Button size="sm" onClick={() => toast.success(`Downloaded ${r.title}`)} className="h-7 text-xs bg-emerald-600 text-white rounded-xl cursor-pointer">
                        <Download className="size-3 mr-1" /> Download PDF
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
