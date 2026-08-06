import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeAcademicPage(filename, routePath, pageTitleText, subTitleText, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  Users,
  BookOpen,
  Calendar,
  Monitor,
  UserCheck,
  Award,
  AlertCircle,
  Trophy,
  Clock,
  Building,
  UserPlus,
  History,
  Briefcase,
  Layers,
  BarChart2,
  TrendingUp,
  Target,
  GitMerge,
  CheckSquare,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
${chartType ? `import { ${chartType} } from "@/components/dashboard/charts";` : ""}

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${pageTitleText} — Academic Dean" }],
  }),
  component: SubPageComponent,
});

function SubPageComponent() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const rawData = useMemo(() => {
    return ${rowsJS};
  }, []);

  const filteredData = useMemo(() => {
    return rawData.filter((item: Record<string, any>) => {
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );
      const matchFilter = filter === "all" || (item.status && String(item.status).toLowerCase().includes(filter.toLowerCase()));
      return matchSearch && matchFilter;
    });
  }, [rawData, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">
              ${badgeText}
            </Badge>
            <span className="text-xs text-muted-foreground">• Academic Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${pageTitleText}</h1>
          <p className="text-sm text-muted-foreground">${subTitleText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Academic Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={Building2} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={Users} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={BookOpen} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={Award} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${pageTitleText} Distribution Chart" description="Quantitative academic metrics across departments and programs.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", metric: 1240 },
            { category: "ECE Dept", metric: 980 },
            { category: "ME Dept", metric: 750 },
            { category: "EEE Dept", metric: 620 },
            { category: "Civil Dept", metric: 540 },
            { category: "MBA Dept", metric: 480 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "metric", label: "Academic Volume" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${pageTitleText} Master Ledger" description="Official Office of Academic Dean records, course allocations, workloads, and quality audits.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search academic records, faculty, departments..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <Select value={filter} onValueChange={(val) => { setFilter(val); setCurrentPage(1); }}>
              <SelectTrigger className="h-9 w-[150px] text-xs">
                <SelectValue placeholder="Status Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active / Approved</SelectItem>
                <SelectItem value="completed">Completed / Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  ${headers.map((h) => `<th className="p-3">${h}</th>`).join("")}
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {paginatedData.map((item: Record<string, any>, idx: number) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {Object.values(item).map((val: any, cIdx: number) => (
                      <td key={cIdx} className="p-3 font-mono text-foreground">
                        {String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("completed") || String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("accredited") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("under review") || String(val).toLowerCase().includes("remedial") ? (
                          <Badge className="bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : (
                          String(val)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-2">
            <span className="text-xs text-muted-foreground font-mono">
              Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </span>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                <ChevronLeft className="size-3.5" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button key={i} variant={currentPage === i + 1 ? "default" : "outline"} size="sm" className="h-7 w-7 p-0 text-xs font-mono cursor-pointer" onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-7 w-7 p-0 cursor-pointer" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routesDir, filename), code, "utf8");
  console.log(`Saved Academic subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL 31 ACADEMIC SUBPAGES
// ----------------------------------------------------

// Academic Management
writeAcademicPage("staff.academic-dean.departments.tsx", "/staff/academic-dean/departments", "Departments", "Master academic departments directory, HODs, faculty count, and student strength.", "ACADEMIC MANAGEMENT", [{ label: "Departments", val: "9 Departments" }, { label: "Total Faculty", val: "345 Faculty" }, { label: "Total Students", val: "5,820 Students" }, { label: "Accreditation", val: "100% NBA/NAAC" }], ["Dept Code", "Department Name", "Head of Department (HOD)", "Faculty Count", "Student Count", "Programs", "Status"], `[
  { code: "DEPT-CSE", name: "Computer Science & Engineering", hod: "Dr. Srinivas Rao", faculty: "64 Faculty", students: "1,240 Students", progs: "B.Tech, M.Tech, PhD", status: "NBA Accredited" },
  { code: "DEPT-ECE", name: "Electronics & Communication", hod: "Dr. Priya Sharma", faculty: "52 Faculty", students: "980 Students", progs: "B.Tech, M.Tech, PhD", status: "NBA Accredited" },
  { code: "DEPT-AIDS", name: "Artificial Intelligence & Data Science", hod: "Dr. Ravi Kumar", faculty: "44 Faculty", students: "810 Students", progs: "B.Tech, M.Tech", status: "Active" },
  { code: "DEPT-ME", name: "Mechanical Engineering", hod: "Dr. Mahesh Gupta", faculty: "42 Faculty", students: "750 Students", progs: "B.Tech, M.Tech", status: "Active" },
  { code: "DEPT-EEE", name: "Electrical & Electronics", hod: "Dr. Lakshmi Devi", faculty: "38 Faculty", students: "620 Students", progs: "B.Tech, M.Tech", status: "Active" }
]`, "GroupedBarChart");

writeAcademicPage("staff.academic-dean.faculty-management.tsx", "/staff/academic-dean/faculty-management", "Faculty Management", "Full-time academic faculty directory, designations, employee IDs, and assigned subjects.", "ACADEMIC MANAGEMENT", [{ label: "Total Faculty", val: "345 Faculty" }, { label: "Professors", val: "48 Professors" }, { label: "Assoc Professors", val: "85 Assoc Profs" }, { label: "Status", val: "Active" }], ["Emp ID", "Faculty Name", "Department", "Designation", "Assigned Subjects", "Weekly Workload", "Status"], `[
  { id: "FAC-101", name: "Dr. Ravi Kumar", dept: "AI & DS", desig: "Professor & HOD", sub: "Deep Learning, AI Ethics", load: "16 Hours / Wk", status: "Active" },
  { id: "FAC-102", name: "Dr. Priya Sharma", dept: "ECE", desig: "Professor & HOD", sub: "VLSI Design, Signal Processing", load: "16 Hours / Wk", status: "Active" },
  { id: "FAC-103", name: "Dr. Srinivas Rao", dept: "CSE", desig: "Professor & HOD", sub: "Software Engineering, Cloud", load: "18 Hours / Wk", status: "Active" }
]`);

writeAcademicPage("staff.academic-dean.course-management.tsx", "/staff/academic-dean/course-management", "Course Management", "Degree course catalog, credit structure, semester mapping, and faculty coordinators.", "ACADEMIC MANAGEMENT", [{ label: "Courses Mapped", val: "248 Courses" }, { label: "Total Credits", val: "160 Credits / Degree" }, { label: "L-T-P Structure", val: "Mapped" }, { label: "Status", val: "Approved" }], ["Course Code", "Course Name", "Credits", "Semester", "Department", "Faculty Coordinator", "Status"], `[
  { code: "CS501", name: "Advanced Software Engineering", cred: "4 Credits (3-1-0)", sem: "Semester 5", dept: "CSE", coord: "Dr. Srinivas Rao", status: "Approved" },
  { code: "EC304", name: "VLSI Design & Architecture", cred: "4 Credits (3-0-2)", sem: "Semester 5", dept: "ECE", coord: "Dr. Priya Sharma", status: "Approved" }
]`);

writeAcademicPage("staff.academic-dean.curriculum.tsx", "/staff/academic-dean/curriculum", "Curriculum & Syllabus", "BOS approved curriculum revisions, syllabus structures, and regulation schemes.", "ACADEMIC MANAGEMENT", [{ label: "Regulations", val: "R24 Scheme" }, { label: "Syllabus Revisions", val: "100% Up to Date" }, { label: "OBE Aligned", val: "Verified" }, { label: "Status", val: "Approved" }], ["Regulation Scheme", "Department", "Degree Program", "Syllabus Status", "BOS Approval Date", "Status"], `[
  { reg: "R24 Autonomous Regulation", dept: "Computer Science Engineering", prog: "B.Tech CSE", syl: "100% Approved", date: "2026-06-15", status: "Approved" }
]`);

writeAcademicPage("staff.academic-dean.academic-calendar.tsx", "/staff/academic-dean/academic-calendar", "Academic Calendar", "Institutional academic calendar, instructional days, mid-terms, and vacation schedules.", "ACADEMIC MANAGEMENT", [{ label: "Working Days", val: "90 Days" }, { label: "Academic Term", val: "Autumn 2026" }, { label: "Exam Weeks", val: "3 Weeks" }, { label: "Status", val: "Published" }], ["Academic Event Title", "Target Batches", "Start Date", "End Date", "Instructional Scope", "Status"], `[
  { title: "Commencement of Classwork", batch: "All B.Tech 2nd, 3rd & 4th Years", start: "2026-07-01", end: "2026-07-01", scope: "Instructional", status: "Active" },
  { title: "First Mid-Term Examinations", batch: "All Engineering Branches", start: "2026-09-14", end: "2026-09-19", scope: "Assessment", status: "Scheduled" }
]`);

// Student Academics
writeAcademicPage("staff.academic-dean.class-monitoring.tsx", "/staff/academic-dean/class-monitoring", "Class Monitoring", "Real-time class attendance tracking, daily lecture delivery, and faculty presence.", "STUDENT ACADEMICS", [{ label: "Active Live Classes", val: "148 Classes" }, { label: "Faculty On-Time", val: "96.5%" }, { label: "Syllabus Track", val: "On-Schedule" }, { label: "Status", val: "Active" }], ["Class ID", "Subject Title", "Department", "Faculty Name", "Room Venue", "Student Attendance", "Status"], `[
  { id: "CLS-CSE-501", sub: "Advanced Software Engineering", dept: "CSE", fac: "Dr. Srinivas Rao", room: "Block A - Room 101", att: "94.5% Present", status: "Active" }
]`, "GroupedBarChart");

writeAcademicPage("staff.academic-dean.attendance-monitoring.tsx", "/staff/academic-dean/attendance-monitoring", "Attendance Monitoring", "Campus-wide student attendance monitoring, shortage alerts, and condonation ledgers.", "STUDENT ACADEMICS", [{ label: "Overall Attendance", val: "91.2%" }, { label: "Eligible (>75%)", val: "5,310 Students" }, { label: "Shortage (<75%)", val: "510 Students" }, { label: "Status", val: "Active" }], ["Roll Number", "Student Name", "Department", "Semester", "Overall Attendance %", "Shortage Status", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", dept: "CSE", sem: "Semester 5", att: "95.8%", short: "Satisfactory (>75%)", status: "Eligible" },
  { roll: "22CE110", name: "Abhishek Kumar", dept: "Civil", sem: "Semester 5", att: "64.0%", short: "Shortage Alert (<75%)", status: "Shortage" }
]`);

writeAcademicPage("staff.academic-dean.academic-performance.tsx", "/staff/academic-dean/academic-performance", "Academic Performance", "Department-wise SGPA / CGPA performance breakdown, pass percentages, and subject backlogs.", "STUDENT ACADEMICS", [{ label: "Pass Rate", val: "92.6% Pass" }, { label: "Outstanding (9+)", val: "22.4%" }, { label: "Distinction", val: "38.6%" }, { label: "Status", val: "Verified" }], ["Department", "Appearing Students", "Passed Students", "Failed Students", "Pass %", "Average SGPA", "Status"], `[
  { dept: "Computer Science & Engineering", app: "1,240", pass: "1,160", fail: "80", pct: "93.5%", sgpa: "8.45", status: "Verified" },
  { dept: "Electronics & Communication", app: "980", pass: "910", fail: "70", pct: "92.8%", sgpa: "8.28", status: "Verified" }
]`);

writeAcademicPage("staff.academic-dean.slow-learners.tsx", "/staff/academic-dean/slow-learners", "Slow Learners", "Remedial class tracking, slow learners identification (<6.0 CGPA), and mentor allocation.", "STUDENT ACADEMICS", [{ label: "Identified Students", val: "290 Students (5.0%)" }, { label: "Remedial Classes", val: "48 Sessions" }, { label: "Improvement Rate", val: "+14.2%" }, { label: "Status", val: "Active" }], ["Roll Number", "Student Name", "Department", "Current CGPA", "Remedial Mentor", "Remedial Status", "Status"], `[
  { roll: "22ME114", name: "R. Dinesh", dept: "Mechanical", cgpa: "5.42", mentor: "Dr. Mahesh Gupta", rem: "Attending Remedial Classes", status: "Active" }
]`);

writeAcademicPage("staff.academic-dean.top-performers.tsx", "/staff/academic-dean/top-performers", "Top Performers", "Academic rank holders, merit scholarship awardees, and Dean's List honor roll.", "STUDENT ACADEMICS", [{ label: "Dean's List Honorees", val: "120 Students" }, { label: "Top Rank CGPA", val: "9.85 CGPA" }, { label: "Gold Medalists", val: "9 Rank Holders" }, { label: "Status", val: "Active" }], ["Rank #", "Student Name", "Roll Number", "Department", "CGPA", "Honor Roll", "Status"], `[
  { rank: "Rank 1", name: "Ananya Sharma", roll: "22CS107", dept: "CSE", cgpa: "9.85", honor: "Dean's Gold List", status: "Active" },
  { rank: "Rank 2", name: "Rahul Sharma", roll: "22CS101", dept: "CSE", cgpa: "9.28", honor: "Dean's Honor Roll", status: "Active" }
]`);

// Timetable Management
writeAcademicPage("staff.academic-dean.faculty-timetable.tsx", "/staff/academic-dean/faculty-timetable", "Faculty Timetable", "Master faculty teaching schedules, period breakdown, and room allocations.", "TIMETABLE MANAGEMENT", [{ label: "Faculty Mapped", val: "345 Faculty" }, { label: "Weekly Periods", val: "4,850 Periods" }, { label: "Conflict Free", val: "100%" }, { label: "Status", val: "Active" }], ["Faculty Name", "Employee ID", "Department", "Subject", "Weekly Teaching Load", "Allocated Room", "Status"], `[
  { name: "Dr. Srinivas Rao", id: "FAC-103", dept: "CSE", sub: "Advanced Software Engineering", load: "18 Hours / Wk", room: "Block A - Room 101", status: "Active" }
]`, "GroupedBarChart");

writeAcademicPage("staff.academic-dean.classroom-allocation.tsx", "/staff/academic-dean/classroom-allocation", "Classroom Allocation", "Classroom, lecture hall, and computer lab allocation master schedule.", "TIMETABLE MANAGEMENT", [{ label: "Total Lecture Halls", val: "84 Rooms" }, { label: "Utilization Rate", val: "92.5%" }, { label: "Capacity Average", val: "70 Seats" }, { label: "Status", val: "Allocated" }], ["Room Number", "Building Block", "Capacity", "Allocated Department", "Session Slots", "Status"], `[
  { room: "Room 101", bldg: "Academic Block A", cap: "70 Seats", dept: "CSE", slots: "09:00 AM - 04:30 PM", status: "Allocated" }
]`);

writeAcademicPage("staff.academic-dean.substitute-faculty.tsx", "/staff/academic-dean/substitute-faculty", "Substitute Faculty", "Faculty leave substitution requests, period reassignments, and substitution history.", "TIMETABLE MANAGEMENT", [{ label: "Substitutions Active", val: "4 Reassignments" }, { label: "SLA Clearance", val: "100%" }, { label: "Dean Sanction", val: "Approved" }, { label: "Status", val: "Approved" }], ["Original Faculty", "Substitute Faculty", "Department", "Date & Period", "Subject", "Reason", "Status"], `[
  { orig: "Dr. Anitha Rao", sub: "Dr. Srinivas Rao", dept: "CSE", date: "2026-08-05 (Period 3)", subject: "Software Engineering", reason: "Medical Leave", status: "Approved" }
]`);

writeAcademicPage("staff.academic-dean.timetable-history.tsx", "/staff/academic-dean/timetable-history", "Timetable History", "Historical semester timetable archives, changes log, and period revisions.", "TIMETABLE MANAGEMENT", [{ label: "Archived Terms", val: "10 Terms" }, { label: "Revisions Logged", val: "18 Changes" }, { label: "Audit Clearance", val: "Verified" }, { label: "Status", val: "Archived" }], ["Academic Term", "Department", "Version Code", "Revision Date", "Approved By", "Status"], `[
  { term: "Autumn 2026", dept: "CSE", ver: "v2.1", date: "2026-07-10", app: "Academic Dean", status: "Active" }
]`);

// Faculty Workload
writeAcademicPage("staff.academic-dean.teaching-load.tsx", "/staff/academic-dean/teaching-load", "Teaching Load", "Faculty teaching load audit, UGC / AICTE compliance, and weekly contact hours.", "FACULTY WORKLOAD", [{ label: "Avg Workload", val: "16 Hours / Wk" }, { label: "AICTE Compliant", val: "100%" }, { label: "Workload Balance", val: "Optimal" }, { label: "Status", val: "Verified" }], ["Faculty Name", "Designation", "Department", "Theory Hours", "Lab Hours", "Total Workload", "Status"], `[
  { name: "Dr. Srinivas Rao", desig: "Professor", dept: "CSE", theory: "12 Hours", lab: "6 Hours", total: "18 Hours / Wk", status: "Verified" },
  { name: "Dr. Priya Sharma", desig: "Professor", dept: "ECE", theory: "10 Hours", lab: "6 Hours", total: "16 Hours / Wk", status: "Verified" }
]`, "GroupedBarChart");

writeAcademicPage("staff.academic-dean.subject-allocation.tsx", "/staff/academic-dean/subject-allocation", "Subject Allocation", "Semester subject allocation to faculty based on domain expertise.", "FACULTY WORKLOAD", [{ label: "Subjects Allocated", val: "248 Subjects" }, { label: "Expertise Mapped", val: "100%" }, { label: "HOD Signed", val: "Verified" }, { label: "Status", val: "Approved" }], ["Subject Code", "Subject Name", "Department", "Allocated Faculty", "Semester", "Status"], `[
  { code: "CS501", name: "Advanced Software Engineering", dept: "CSE", fac: "Dr. Srinivas Rao", sem: "Semester 5", status: "Approved" }
]`);

writeAcademicPage("staff.academic-dean.dept-workload.tsx", "/staff/academic-dean/dept-workload", "Department Workload", "Department-level faculty strength, student-teacher ratio (STR 1:15), and load balance.", "FACULTY WORKLOAD", [{ label: "STR Ratio Avg", val: "1:16.8" }, { label: "Total Load", val: "5,520 Hours / Wk" }, { label: "Load Balance", val: "Optimal" }, { label: "Status", val: "Balanced" }], ["Department", "Faculty Count", "Student Count", "STR Ratio", "Total Workload Hours", "Status"], `[
  { dept: "Computer Science & Engineering", fac: "64", stud: "1,240", str: "1:19.3", load: "1,024 Hours / Wk", status: "Balanced" },
  { dept: "Electronics & Communication", fac: "52", stud: "980", str: "1:18.8", load: "832 Hours / Wk", status: "Balanced" }
]`);

writeAcademicPage("staff.academic-dean.faculty-performance.tsx", "/staff/academic-dean/faculty-performance", "Faculty Performance", "Annual academic performance index (API), student feedback ratings, and publication credits.", "FACULTY WORKLOAD", [{ label: "Avg Feedback", val: "4.7 / 5.0" }, { label: "API Clearance", val: "100%" }, { label: "Pass Rate Avg", val: "94.8%" }, { label: "Status", val: "Verified" }], ["Faculty Name", "Department", "Feedback Rating", "Pass % Delivered", "API Score", "Status"], `[
  { name: "Dr. Srinivas Rao", dept: "CSE", rat: "4.9 / 5.0", pass: "96.5%", api: "98 / 100", status: "Verified" },
  { name: "Dr. Priya Sharma", dept: "ECE", rat: "4.8 / 5.0", pass: "95.0%", api: "96 / 100", status: "Verified" }
]`);

// Academic Quality
writeAcademicPage("staff.academic-dean.obe-management.tsx", "/staff/academic-dean/obe-management", "OBE Management", "Outcome-Based Education (OBE) framework implementation and bloom's taxonomy audit.", "ACADEMIC QUALITY", [{ label: "OBE Framework", val: "Active 100%" }, { label: "Bloom's Mapped", val: "6 Levels" }, { label: "PO Attainment", val: "84.5% Avg" }, { label: "Status", val: "Verified" }], ["Program Code", "Degree Program", "OBE Alignment", "PO Attainment Avg", "Audit Status", "Status"], `[
  { code: "PRG-CSE", prog: "B.Tech Computer Science", align: "100% OBE Compliant", po: "84.5% Attainment", audit: "Passed NBA Standard", status: "Verified" }
]`, "GroupedBarChart");

writeAcademicPage("staff.academic-dean.copo-mapping.tsx", "/staff/academic-dean/copo-mapping", "CO-PO Mapping", "Course Outcomes (CO) to Program Outcomes (PO) & Program Specific Outcomes (PSO) mapping matrix.", "ACADEMIC QUALITY", [{ label: "COs Defined", val: "1,240 COs" }, { label: "POs Mapped", val: "12 POs" }, { label: "Correlation Matrix", val: "High (3.0 Avg)" }, { label: "Status", val: "Approved" }], ["Subject Code", "Subject Name", "CO Count", "PO Mapped Count", "Correlation Index", "Status"], `[
  { code: "CS501", name: "Advanced Software Engineering", cos: "5 COs", pos: "12 POs", corr: "2.8 / 3.0 (High)", status: "Approved" }
]`);

writeAcademicPage("staff.academic-dean.course-outcomes.tsx", "/staff/academic-dean/course-outcomes", "Course Outcomes", "Subject-wise Course Outcome (CO) attainment levels and direct/indirect assessment.", "ACADEMIC QUALITY", [{ label: "CO Attainment Avg", val: "82.4%" }, { label: "Direct Target", val: "75% Target" }, { label: "Indirect Target", val: "70% Target" }, { label: "Status", val: "Achieved" }], ["Course Code", "CO Code", "Outcome Description", "Target %", "Achieved %", "Status"], `[
  { code: "CS501", co: "CO1", desc: "Analyze software architectural design patterns", target: "75.0%", ach: "84.2%", status: "Achieved" }
]`);

writeAcademicPage("staff.academic-dean.academic-audit.tsx", "/staff/academic-dean/academic-audit", "Academic Audit", "Internal & external academic audit reports, course file verification, and lab audits.", "ACADEMIC QUALITY", [{ label: "Audits Completed", val: "Autumn 2026 Audit" }, { label: "Course Files Verified", val: "100%" }, { label: "Grade", val: "Grade A++" }, { label: "Status", val: "Verified" }], ["Audit ID", "Department", "Audit Panel Lead", "Course Files Checked", "Compliance Score", "Status"], `[
  { id: "AUD-ACAD-Q2", dept: "CSE", lead: "Dr. External Auditor (IIT Hyd)", files: "64 Files", comp: "98.5% Passed", status: "Verified" }
]`);

// Meetings & Approvals
writeAcademicPage("staff.academic-dean.academic-council.tsx", "/staff/academic-dean/academic-council", "Academic Council", "Academic Council meetings, policy decisions, and university approvals.", "MEETINGS & APPROVALS", [{ label: "Council Meetings", val: "4 Meetings / Yr" }, { label: "Resolutions", val: "24 Passed" }, { label: "Quorum Met", val: "100%" }, { label: "Status", val: "Approved" }], ["Meeting ID", "Meeting Date", "Key Agenda Scope", "Resolutions Passed", "Minutes Doc", "Status"], `[
  { id: "AC-2026-02", date: "2026-07-20", agenda: "Approval of R24 Autonomous Curriculum", res: "6 Resolutions Passed", doc: "MIN-AC-2026-02", status: "Approved" }
]`, "GroupedBarChart");

writeAcademicPage("staff.academic-dean.bos-meetings.tsx", "/staff/academic-dean/bos-meetings", "BOS Meetings", "Board of Studies (BOS) departmental curriculum approval meetings.", "MEETINGS & APPROVALS", [{ label: "BOS Meetings", val: "9 Dept Meetings" }, { label: "Syllabi Approved", val: "100%" }, { label: "BOS Minutes", val: "Signed" }, { label: "Status", val: "Approved" }], ["Department", "BOS Chair", "Meeting Date", "Syllabus Approved", "Status"], `[
  { dept: "Computer Science & Engineering", chair: "Dr. Srinivas Rao", date: "2026-06-15", syl: "R24 Curriculum Approved", status: "Approved" }
]`);

writeAcademicPage("staff.academic-dean.circulars.tsx", "/staff/academic-dean/circulars", "Circulars", "Official academic circulars, regulations notifications, and Dean orders.", "MEETINGS & APPROVALS", [{ label: "Circulars Issued", val: "36 Circulars" }, { label: "Target Audience", val: "All Faculty & Students" }, { label: "Dispatch SLA", val: "Immediate" }, { label: "Status", val: "Published" }], ["Circular Ref", "Subject / Title", "Issued Date", "Target Group", "Status"], `[
  { ref: "CIR-ACAD-2026-14", title: "Schedule for Autumn Semester Mid-Term Examinations", date: "2026-08-01", group: "All Faculty & Students", status: "Published" }
]`);

writeAcademicPage("staff.academic-dean.approvals.tsx", "/staff/academic-dean/approvals", "Approvals", "Executive academic approvals, elective choices, and course equivalence requests.", "MEETINGS & APPROVALS", [{ label: "Pending Approvals", val: "6 Requests" }, { label: "Approved Mtd", val: "48 Approvals" }, { label: "Turnaround Time", val: "24 Hours" }, { label: "Status", val: "Active" }], ["Approval Ref", "Request Description", "Submitted By", "Date", "Action Status", "Status"], `[
  { ref: "APP-ELECT-901", desc: "Open Elective Course Equivalence Approval", sub: "HOD CSE", date: "2026-08-04", act: "Approved by Dean", status: "Approved" }
]`);

// Reports
writeAcademicPage("staff.academic-dean.department-reports.tsx", "/staff/academic-dean/department-reports", "Department Reports", "Master academic department performance, faculty strength, and research output reports.", "REPORTS", [{ label: "Reports Archived", val: "18 Reports" }, { label: "NAAC Verified", val: "100%" }, { label: "Audit Clearance", val: "Passed" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "Generated Date", "Status"], `[
  { title: "Annual Departmental Academic Performance & Resource Utilization Report", scope: "9 Departments", date: "2026-08-01", status: "Verified" }
]`);

writeAcademicPage("staff.academic-dean.faculty-reports.tsx", "/staff/academic-dean/faculty-reports", "Faculty Reports", "Faculty teaching workload compliance, API index, and appraisal reports.", "REPORTS", [{ label: "Faculty Audited", val: "345 Faculty" }, { label: "API Rate", val: "96.5% Clear" }, { label: "Workload Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Total Faculty", "Performance Rating", "Status"], `[
  { title: "Annual Faculty Workload & Teaching Performance Audit Report", count: "345 Faculty", rat: "96.5% Satisfactory", status: "Verified" }
]`);

writeAcademicPage("staff.academic-dean.student-reports.tsx", "/staff/academic-dean/student-reports", "Student Performance Reports", "Comprehensive student pass percentage, SGPA distribution, and arrear reports.", "REPORTS", [{ label: "Pass Rate", val: "92.6%" }, { label: "Honors Students", val: "120 Students" }, { label: "Dean's List", val: "Published" }, { label: "Status", val: "Verified" }], ["Report Title", "Overall Pass %", "Top Department", "Status"], `[
  { title: "Autumn Semester Student Academic Performance & SGPA Analysis Report", pct: "92.6% Pass", top: "CSE Dept (93.5%)", status: "Verified" }
]`);

writeAcademicPage("staff.academic-dean.attendance-reports.tsx", "/staff/academic-dean/attendance-reports", "Attendance Reports", "Institutional student attendance tracking, condonation list, and shortage report.", "REPORTS", [{ label: "Overall Attendance", val: "91.2%" }, { label: "Shortage List", val: "510 Students" }, { label: "Shortage %", val: "8.7%" }, { label: "Status", val: "Verified" }], ["Report Title", "Average Attendance", "Shortage %", "Status"], `[
  { title: "Semester Attendance Audit & Eligibility Shortage Report", avg: "91.2% Attendance", short: "8.7% Shortage", status: "Verified" }
]`);

writeAcademicPage("staff.academic-dean.timetable-reports.tsx", "/staff/academic-dean/timetable-reports", "Timetable Reports", "Classroom utilization rate, lab period allocation, and substitution reports.", "REPORTS", [{ label: "Classrooms Mapped", val: "84 Rooms" }, { label: "Utilization Rate", val: "92.5%" }, { label: "Conflicts Logged", val: "Zero" }, { label: "Status", val: "Verified" }], ["Report Title", "Utilization Rate", "Conflicts Logged", "Status"], `[
  { title: "Master Timetable Efficiency & Classroom Utilization Audit Report", rate: "92.5% Utilized", conf: "0 Conflicts", status: "Verified" }
]`);

console.log("All 31 Academic Dean dedicated pages generated successfully.");
