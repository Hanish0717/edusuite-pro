import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeExamPage(filename, routePath, pageTitleText, subTitleText, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  Ticket,
  Clock,
  UserCheck,
  Upload,
  CheckSquare,
  Award,
  RefreshCw,
  AlertTriangle,
  Building2,
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
    meta: [{ title: "${pageTitleText} — Examination Dean" }],
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
            <span className="text-xs text-muted-foreground">• Examination Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${pageTitleText}</h1>
          <p className="text-sm text-muted-foreground">${subTitleText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Exam Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={Users} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={Calendar} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={Ticket} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={Award} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${pageTitleText} Statistics Chart" description="Quantitative examination ledgers across academic departments.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", count: 1240 },
            { category: "ECE Dept", count: 980 },
            { category: "ME Dept", count: 750 },
            { category: "EEE Dept", count: 620 },
            { category: "Civil Dept", count: 540 },
            { category: "MBA Dept", count: 480 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "count", label: "Student Volume" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${pageTitleText} Master Ledger" description="Official Controller of Examinations records, schedules, marks entries, and hall allocations.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search examination records, students, subjects..."
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
                <SelectItem value="scheduled">Scheduled / Active</SelectItem>
                <SelectItem value="completed">Completed / Published</SelectItem>
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
                        {String(val).toLowerCase().includes("scheduled") || String(val).toLowerCase().includes("published") || String(val).toLowerCase().includes("generated") || String(val).toLowerCase().includes("passed") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("verified") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("open") || String(val).toLowerCase().includes("under review") ? (
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
  console.log(`Saved Exam subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL 38 EXAMINATION SUBPAGES
// ----------------------------------------------------

// Exam Planning
writeExamPage("staff.examination-dean.academic-calendar.tsx", "/staff/examination-dean/academic-calendar", "Academic Calendar", "Official Controller of Examinations calendar, mid-term dates, and end-sem schedules.", "EXAM PLANNING", [{ label: "Working Days", val: "90 Days" }, { label: "Exam Weeks", val: "3 Weeks" }, { label: "Semester Scope", val: "Autumn 2026" }, { label: "Status", val: "Published" }], ["Event Title", "Target Audience", "Start Date", "End Date", "Scope", "Status"], `[
  { title: "Mid-Term Examination 1", aud: "All B.Tech Batches", start: "2026-09-14", end: "2026-09-19", scope: "Internal Assessment", status: "Published" },
  { title: "End-Semester Practical Exams", aud: "All Departments", start: "2026-11-02", end: "2026-11-07", scope: "Lab Assessment", status: "Published" },
  { title: "End-Semester Theory Examinations", aud: "All UG & PG Batches", start: "2026-11-10", end: "2026-11-28", scope: "University End-Sem", status: "Published" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.exam-schedule.tsx", "/staff/examination-dean/exam-schedule", "Exam Schedule", "Master examination timetable, session slots, and subject codes.", "EXAM PLANNING", [{ label: "Total Exams", val: "184 Exams" }, { label: "Session Slots", val: "Morning / Afternoon" }, { label: "Schedules Released", val: "100%" }, { label: "Status", val: "Active" }], ["Course Code", "Subject Name", "Department", "Semester", "Exam Date", "Session Time", "Exam Hall", "Status"], `[
  { code: "CS501", subject: "Advanced Software Engineering", dept: "CSE", sem: "Semester 5", date: "2026-08-18", time: "Morning (09:30 AM)", hall: "Block A - Hall 101", status: "Scheduled" },
  { code: "EC304", subject: "VLSI Design & Architecture", dept: "ECE", sem: "Semester 5", date: "2026-08-19", time: "Afternoon (02:00 PM)", hall: "Block B - Hall 204", status: "Scheduled" },
  { code: "AI502", subject: "Deep Learning & Neural Networks", dept: "AI & DS", sem: "Semester 5", date: "2026-08-20", time: "Morning (09:30 AM)", hall: "Block A - Hall 302", status: "Scheduled" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.timetable-generation.tsx", "/staff/examination-dean/timetable-generation", "Timetable Generation", "Automated exam timetable scheduling algorithm, gap checks, and room conflict resolution.", "EXAM PLANNING", [{ label: "Conflict Free", val: "100% Passed" }, { label: "Gaps Verified", val: "1 Day Between Exams" }, { label: "Algorithm Status", val: "Optimized" }, { label: "Status", val: "Approved" }], ["Schedule Ref", "Department Scope", "Total Subjects", "Conflict Checks", "Generated Date", "Status"], `[
  { ref: "TT-AUTUMN-2026", scope: "All B.Tech & M.Tech Batches", count: "184 Subjects", check: "0 Conflicts Detected", date: "2026-08-01", status: "Approved" }
]`);

writeExamPage("staff.examination-dean.hall-allocation.tsx", "/staff/examination-dean/hall-allocation", "Hall Allocation", "Examination hall capacity, seating plan allocation, and floor distribution.", "EXAM PLANNING", [{ label: "Total Halls", val: "36 Halls" }, { label: "Seating Capacity", val: "6,000 Seats" }, { label: "Halls Allocated", val: "32 Halls" }, { label: "Status", val: "Allocated" }], ["Hall Number", "Building Block", "Floor", "Seating Capacity", "Allocated Students", "Available Seats", "Status"], `[
  { hall: "Hall 101", bldg: "Academic Block A", floor: "Ground Floor", cap: "180 Seats", alloc: "160 Students", avail: "20 Seats", status: "Allocated" },
  { hall: "Hall 204", bldg: "Academic Block B", floor: "2nd Floor", cap: "150 Seats", alloc: "140 Students", avail: "10 Seats", status: "Allocated" }
]`);

writeExamPage("staff.examination-dean.invigilator-allocation.tsx", "/staff/examination-dean/invigilator-allocation", "Invigilator Allocation", "Faculty invigilation duty assignment, hall duty rosters, and substitute invigilators.", "EXAM PLANNING", [{ label: "Faculty Assigned", val: "245 Faculty" }, { label: "Invigilation Duties", val: "368 Sessions" }, { label: "Duty Load Avg", val: "3 Duties / Faculty" }, { label: "Status", val: "Assigned" }], ["Faculty Name", "Department", "Assigned Exam Hall", "Exam Date", "Session Slot", "Duty Status", "Status"], `[
  { name: "Dr. Ravi Kumar", dept: "CSE", hall: "Block A - Hall 101", date: "2026-08-18", session: "Morning (09:30 AM)", duty: "Chief Invigilator", status: "Assigned" },
  { name: "Dr. Priya Sharma", dept: "ECE", hall: "Block B - Hall 204", date: "2026-08-19", session: "Afternoon (02:00 PM)", duty: "Assistant Invigilator", status: "Assigned" }
]`);

// Hall Tickets
writeExamPage("staff.examination-dean.generate-hall-tickets.tsx", "/staff/examination-dean/generate-hall-tickets", "Generate Hall Tickets", "Batch hall ticket generation, fee clearance check, and barcode embedding.", "HALL TICKETS", [{ label: "Appearing Students", val: "5,420 Students" }, { label: "Generated", val: "4,850 Tickets" }, { label: "Fee Cleared", val: "96.2%" }, { label: "Status", val: "Generated" }], ["Batch Code", "Department", "Semester", "Eligible Students", "Generated Count", "Generation Date", "Status"], `[
  { code: "GEN-CSE-SEM5", dept: "CSE", sem: "Semester 5", elig: "420 Students", gen: "420 Tickets", date: "2026-08-04", status: "Generated" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.hall-ticket-status.tsx", "/staff/examination-dean/hall-ticket-status", "Hall Ticket Status", "Student hall ticket dispatch status, attendance eligibility, and fee NOC.", "HALL TICKETS", [{ label: "Hall Tickets Issued", val: "4,850 Issued" }, { label: "Withheld (Attendance)", val: "120 Students" }, { label: "Attendance Pass", val: "97.5%" }, { label: "Status", val: "Active" }], ["Roll Number", "Student Name", "Department", "Semester", "Attendance %", "Hall Ticket Status", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", dept: "CSE", sem: "Semester 5", att: "95.8%", ht: "Issued & Downloadable", status: "Issued" },
  { roll: "22CE110", name: "Abhishek Kumar", dept: "Civil", sem: "Semester 5", att: "64.0%", ht: "Withheld (Deficit Shortage)", status: "Withheld" }
]`);

writeExamPage("staff.examination-dean.download-history.tsx", "/staff/examination-dean/download-history", "Download History", "Student hall ticket download logs, IP timestamps, and verified downloads.", "HALL TICKETS", [{ label: "Downloads Logged", val: "4,680 Downloads" }, { label: "Download Rate", val: "96.5%" }, { label: "IP Audit", val: "Passed" }, { label: "Status", val: "Verified" }], ["Roll Number", "Student Name", "Hall Ticket Number", "Download Timestamp", "IP Address", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", ht: "HT-2026-90124", time: "2026-08-04 10:15 AM", ip: "192.168.1.45", status: "Downloaded" }
]`);

// Question Paper Management
writeExamPage("staff.examination-dean.question-paper-upload.tsx", "/staff/examination-dean/question-paper-upload", "Question Paper Upload", "Encrypted question paper submission portal for paper setters.", "QUESTION PAPER MANAGEMENT", [{ label: "Total Papers", val: "184 Subjects" }, { label: "Uploaded", val: "184 Papers" }, { label: "AES-256 Encrypted", val: "100%" }, { label: "Status", val: "Completed" }], ["Subject Code", "Subject Title", "Paper Setter Faculty", "Department", "Upload Date", "Encryption Status", "Status"], `[
  { code: "CS501", title: "Advanced Software Engineering", faculty: "Dr. Srinivas Rao", dept: "CSE", date: "2026-08-01", enc: "AES-256 Encrypted", status: "Uploaded" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.question-paper-approval.tsx", "/staff/examination-dean/question-paper-approval", "Question Paper Approval", "Board of Studies (BOS) question paper moderation & approval ledger.", "QUESTION PAPER MANAGEMENT", [{ label: "BOS Approved", val: "184 Papers" }, { label: "Syllabus Match", val: "100% Verified" }, { label: "Moderator Rating", val: "Grade A" }, { label: "Status", val: "Approved" }], ["Subject Code", "Subject Title", "BOS Moderator", "Approval Date", "Difficulty Index", "Status"], `[
  { code: "CS501", title: "Advanced Software Engineering", mod: "Dr. Ravi Kumar (BOS Chair)", date: "2026-08-02", diff: "Balanced (Medium-Hard)", status: "Approved" }
]`);

writeExamPage("staff.examination-dean.confidential-storage.tsx", "/staff/examination-dean/confidential-storage", "Confidential Storage", "Secure encrypted vault storage for question paper master files.", "QUESTION PAPER MANAGEMENT", [{ label: "Vault Security", val: "2FA Biometric Lock" }, { label: "Master Files", val: "184 Files" }, { label: "Audit Clearance", val: "Secure" }, { label: "Status", val: "Secure" }], ["Paper Code", "Subject Name", "Vault Storage ID", "Decryption Key Status", "Access Control", "Status"], `[
  { code: "CS501", name: "Advanced Software Engineering", vault: "VLT-2026-09", key: "Locked (Decrypts at T-30m)", acc: "Controller of Exams Only", status: "Secure" }
]`);

writeExamPage("staff.examination-dean.paper-distribution.tsx", "/staff/examination-dean/paper-distribution", "Paper Distribution", "Exam hall question paper print dispatch & digital distribution audit.", "QUESTION PAPER MANAGEMENT", [{ label: "Dispatched Halls", val: "36 Halls" }, { label: "Print Passcode", val: "Generated" }, { label: "Dispatch SLA", val: "T-30m" }, { label: "Status", val: "Dispatched" }], ["Exam Date", "Session", "Hall Number", "Subject Code", "Print Dispatch Time", "Hall Invigilator", "Status"], `[
  { date: "2026-08-18", session: "Morning", hall: "Hall 101", code: "CS501", time: "09:00 AM (T-30m)", invig: "Dr. Ravi Kumar", status: "Dispatched" }
]`);

// Examinations
writeExamPage("staff.examination-dean.internal-exams.tsx", "/staff/examination-dean/internal-exams", "Internal Exams", "Continuous internal evaluation (CIE), quiz marks, and assignment marks.", "EXAMINATIONS", [{ label: "CIE Weightage", val: "40 Marks" }, { label: "Tests Held", val: "2 CIE Tests" }, { label: "Entry Completion", val: "98.5%" }, { label: "Status", val: "Completed" }], ["Subject Code", "Subject Title", "Department", "Internal Test #", "Average Marks", "Entry Status", "Status"], `[
  { code: "CS501", title: "Advanced Software Engineering", dept: "CSE", test: "Internal Test 1 & 2", avg: "34.5 / 40", entry: "Completed & Frozen", status: "Completed" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.mid-exams.tsx", "/staff/examination-dean/mid-exams", "Mid Exams", "Mid-semester examination timetables, evaluation, and score ledgers.", "EXAMINATIONS", [{ label: "Mid Exams", val: "2 Mid Terms" }, { label: "Students Evaluated", val: "5,420 Students" }, { label: "Pass Score", val: "89.2%" }, { label: "Status", val: "Completed" }], ["Mid Ref", "Subject Code", "Department", "Exam Date", "Evaluated Count", "Average Score", "Status"], `[
  { ref: "MID-1-2026", code: "CS501", dept: "CSE", date: "2026-07-15", count: "420 Students", avg: "24.2 / 30", status: "Completed" }
]`);

writeExamPage("staff.examination-dean.semester-exams.tsx", "/staff/examination-dean/semester-exams", "Semester Exams", "End-semester main theory examination schedule and attendance ledgers.", "EXAMINATIONS", [{ label: "Semester Exams", val: "184 Exams" }, { label: "Present Rate", val: "98.2%" }, { label: "Attendance Pass", val: "98.2%" }, { label: "Status", val: "Active" }], ["Subject Code", "Subject Title", "Department", "Exam Date", "Present Students", "Absent Students", "Status"], `[
  { code: "CS501", title: "Advanced Software Engineering", dept: "CSE", date: "2026-08-18", pres: "412 Students", abs: "8 Students", status: "Completed" }
]`);

writeExamPage("staff.examination-dean.supplementary-exams.tsx", "/staff/examination-dean/supplementary-exams", "Supplementary Exams", "Arrear & supplementary exam registrations, fee payment, and schedules.", "EXAMINATIONS", [{ label: "Arrear Registrations", val: "340 Students" }, { label: "Fee Collected", val: "₹5.10 Lacs" }, { label: "Schedules Dispatched", val: "100%" }, { label: "Status", val: "Scheduled" }], ["Roll Number", "Student Name", "Arrear Subject Code", "Subject Title", "Exam Date", "Status"], `[
  { roll: "21CS145", name: "K. Vikrant", code: "CS302", title: "Data Structures & Algorithms", date: "2026-08-25", status: "Scheduled" }
]`);

writeExamPage("staff.examination-dean.practical-exams.tsx", "/staff/examination-dean/practical-exams", "Practical Exams", "Laboratory practical examinations, external examiner appointments, and viva.", "EXAMINATIONS", [{ label: "Lab Exams", val: "48 Lab Exams" }, { label: "External Examiners", val: "24 External Faculty" }, { label: "Marks Entry", val: "100%" }, { label: "Status", val: "Completed" }], ["Lab Code", "Practical Subject Title", "Department", "External Examiner", "Exam Date", "Status"], `[
  { code: "CS505", title: "AI & Machine Learning Lab", dept: "CSE", ext: "Dr. External Professor (IIT Hyd)", date: "2026-08-05", status: "Completed" }
]`);

// Evaluation
writeExamPage("staff.examination-dean.answer-script-allocation.tsx", "/staff/examination-dean/answer-script-allocation", "Answer Script Allocation", "Digital coding & answer booklet bundle allocation to valuation faculty.", "EVALUATION", [{ label: "Scripts Coded", val: "24,800 Scripts" }, { label: "Bundles Created", val: "248 Bundles" }, { label: "Evaluator Faculty", val: "120 Evaluators" }, { label: "Status", val: "Active" }], ["Bundle ID", "Subject Code", "Script Count", "Assigned Evaluator", "Valuation Center", "Status"], `[
  { id: "BNDL-CS501-01", code: "CS501", count: "100 Scripts", eval: "Dr. Srinivas Rao", center: "Central Valuation Camp", status: "Allocated" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.valuation-status.tsx", "/staff/examination-dean/valuation-status", "Valuation Status", "Valuation camp progress tracking, evaluated scripts count, and pending bundles.", "EVALUATION", [{ label: "Scripts Evaluated", val: "21,950 / 24,800 (88.5%)" }, { label: "Camp Completion", val: "88.5%" }, { label: "Camp SLA", val: "On-Time" }, { label: "Status", val: "Active" }], ["Evaluator Name", "Subject Code", "Allocated Scripts", "Evaluated Count", "Pending Count", "Status"], `[
  { name: "Dr. Srinivas Rao", code: "CS501", alloc: "100 Scripts", eval: "100 Scripts", pend: "0 Scripts", status: "Completed" }
]`);

writeExamPage("staff.examination-dean.marks-entry.tsx", "/staff/examination-dean/marks-entry", "Marks Entry", "Faculty marks entry portal, OMR scan import, and double entry verification.", "EVALUATION", [{ label: "Marks Entries", val: "21,950 Entries" }, { label: "Double Verification", val: "100% Verified" }, { label: "Anomalies Checked", val: "Zero" }, { label: "Status", val: "Verified" }], ["Roll Number", "Student Name", "Subject Code", "Internal (40)", "External (60)", "Total (100)", "Grade", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", code: "CS501", int: "36", ext: "54", tot: "90", grade: "O Grade", status: "Verified" },
  { roll: "22CS102", name: "Priya Reddy", code: "CS501", int: "34", ext: "51", tot: "85", grade: "A+ Grade", status: "Verified" }
]`);

writeExamPage("staff.examination-dean.marks-verification.tsx", "/staff/examination-dean/marks-verification", "Marks Verification", "Controller of Examinations marks verification audit and outlier check.", "EVALUATION", [{ label: "Audit Clearance", val: "100% Passed" }, { label: "Outliers Checked", val: "0 Anomalies" }, { label: "Controller Seal", val: "Applied" }, { label: "Status", val: "Verified" }], ["Subject Code", "Evaluator Name", "Highest Mark", "Lowest Mark", "Average Mark", "Audit Check", "Status"], `[
  { code: "CS501", eval: "Dr. Srinivas Rao", max: "98 / 100", min: "42 / 100", avg: "76.4 / 100", audit: "Verified Clean", status: "Verified" }
]`);

// Results
writeExamPage("staff.examination-dean.result-processing.tsx", "/staff/examination-dean/result-processing", "Result Processing", "Automated result processing engine, grace marks rule, and SGPA calculation.", "RESULTS", [{ label: "Students Processed", val: "5,420 Students" }, { label: "Pass Rate", val: "92.6%" }, { label: "Rule Engine", val: "R24 Regulations" }, { label: "Status", val: "Processed" }], ["Batch Code", "Department", "Semester", "Total Processed", "Passed Count", "Failed Count", "Pass Rate", "Status"], `[
  { code: "RES-CSE-SEM5", dept: "CSE", sem: "Semester 5", tot: "420 Students", pass: "392 Students", fail: "28 Students", pct: "93.3%", status: "Processed" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.result-publication.tsx", "/staff/examination-dean/result-publication", "Result Publication", "Official result publication portal, web portal release, and SMS alert dispatch.", "RESULTS", [{ label: "Published Date", val: "04-Aug-2026" }, { label: "Portal Release", val: "Active Live" }, { label: "SMS Dispatched", val: "100%" }, { label: "Status", val: "Published" }], ["Result Title", "Academic Session", "Publication Date", "Access Status", "Status"], `[
  { title: "Autumn Semester 2026 End-Semester Examinations Result", sess: "2025-26 Autumn", date: "2026-08-04", acc: "Live on Student Portal", status: "Published" }
]`);

writeExamPage("staff.examination-dean.grade-sheets.tsx", "/staff/examination-dean/grade-sheets", "Grade Sheets", "Official semester grade sheets, credit points, and transcript generation.", "RESULTS", [{ label: "Grade Sheets Printed", val: "4,850 Sheets" }, { label: "Security Hologram", val: "Applied" }, { label: "Dispatched", val: "100%" }, { label: "Status", val: "Active" }], ["Roll Number", "Student Name", "Department", "Semester", "SGPA", "CGPA", "Grade Sheet Status", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", dept: "CSE", sem: "Semester 5", sgpa: "9.45", cgpa: "9.28", gs: "Generated & Sealed", status: "Active" }
]`);

writeExamPage("staff.examination-dean.cgpa-calculation.tsx", "/staff/examination-dean/cgpa-calculation", "CGPA Calculation", "Cumulative Grade Point Average (CGPA) credit weightage calculation ledger.", "RESULTS", [{ label: "Students Calculated", val: "5,420 Students" }, { label: "Formula Mapped", val: "CBCS / OBE 10-Point Scale" }, { label: "Credit Audit", val: "Verified" }, { label: "Status", val: "Verified" }], ["Roll Number", "Student Name", "Total Credits", "Earned Credits", "SGPA", "CGPA", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", cred: "120 Credits", earn: "120 Credits", sgpa: "9.45", cgpa: "9.28", status: "Verified" }
]`);

writeExamPage("staff.examination-dean.rank-list.tsx", "/staff/examination-dean/rank-list", "Rank List", "Department gold medalist & top academic rank holders list.", "RESULTS", [{ label: "Rank 1 Gold Medalist", val: "CGPA 9.85" }, { label: "Top 10 Ranks", val: "Published" }, { label: "Medals Sanctioned", val: "Gold & Silver" }, { label: "Status", val: "Published" }], ["Rank #", "Student Name", "Roll Number", "Department", "CGPA", "Academic Distinction", "Status"], `[
  { rank: "Rank 1 (Gold Medalist)", name: "Ananya Sharma", roll: "22CS107", dept: "CSE", cgpa: "9.85", dist: "First Class with Distinction", status: "Published" },
  { rank: "Rank 2", name: "Rahul Sharma", roll: "22CS101", dept: "CSE", cgpa: "9.28", dist: "First Class with Distinction", status: "Published" }
]`);

// Revaluation
writeExamPage("staff.examination-dean.revaluation-requests.tsx", "/staff/examination-dean/revaluation-requests", "Revaluation Requests", "Student revaluation & script recounting application requests.", "REVALUATION", [{ label: "Revaluation Reqs", val: "14 Requests" }, { label: "Fee Paid", val: "₹14,000" }, { label: "Camp Allocated", val: "100%" }, { label: "Status", val: "Active" }], ["Application ID", "Student Name", "Roll Number", "Subject Code", "Subject Title", "Original Marks", "Fee Paid", "Status"], `[
  { id: "REV-2026-01", student: "K. Sai Teja", roll: "22EC104", code: "EC304", title: "VLSI Design", orig: "32 / 60", fee: "₹1,000", status: "Under Review" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.revaluation-status.tsx", "/staff/examination-dean/revaluation-status", "Revaluation Status", "Re-evaluation valuation camp progress and independent re-checker marks.", "REVALUATION", [{ label: "Re-evaluated", val: "10 / 14 Scripts" }, { label: "Marks Updated", val: "6 Students" }, { label: "Re-checker SLA", val: "Completed" }, { label: "Status", val: "Active" }], ["Application ID", "Student Name", "Subject Code", "Re-Evaluator Name", "Updated Marks", "Status"], `[
  { id: "REV-2026-01", student: "K. Sai Teja", code: "EC304", eval: "Dr. External Re-checker", marks: "38 / 60 (+6 Marks)", status: "Completed" }
]`);

writeExamPage("staff.examination-dean.recounting.tsx", "/staff/examination-dean/recounting", "Recounting", "Totaling error verification and script totaling re-check ledger.", "REVALUATION", [{ label: "Recounting Reqs", val: "4 Requests" }, { label: "Totaling Error", val: "1 Corrected" }, { label: "Verification SLA", val: "Passed" }, { label: "Status", val: "Verified" }], ["Recount ID", "Student Name", "Subject Code", "Original Total", "Recounted Total", "Status"], `[
  { id: "REC-2026-01", student: "Nikhil Reddy", code: "CS501", orig: "64", recount: "68 (+4 Totaling Error)", status: "Corrected" }
]`);

writeExamPage("staff.examination-dean.updated-results.tsx", "/staff/examination-dean/updated-results", "Updated Results", "Post-revaluation revised marks memo and updated CGPA transcripts.", "REVALUATION", [{ label: "Revised Memos", val: "7 Issued" }, { label: "CGPA Updated", val: "100%" }, { label: "Portal Released", val: "Active" }, { label: "Status", val: "Published" }], ["Roll Number", "Student Name", "Subject Code", "Old Grade", "New Grade", "Updated CGPA", "Status"], `[
  { roll: "22EC104", name: "K. Sai Teja", code: "EC304", old: "B Grade", new: "B+ Grade", cgpa: "8.12", status: "Updated" }
]`);

// Malpractice
writeExamPage("staff.examination-dean.malpractice-cases.tsx", "/staff/examination-dean/malpractice-cases", "Malpractice Cases", "Exam hall malpractice violation reports, squad seizure ledgers, and hall tickets.", "MALPRACTICE", [{ label: "Malpractice Cases", val: "2 Cases" }, { label: "Seized Material", val: "Confiscated" }, { label: "Committee Hearing", val: "Scheduled" }, { label: "Status", val: "Under Review" }], ["Case Ref", "Student Name", "Roll Number", "Exam Hall", "Violation Description", "Seized Evidence", "Status"], `[
  { ref: "MP-2026-01", student: "R. Dinesh (22ME114)", roll: "22ME114", hall: "Hall 102", desc: "Possession of unauthorized notes during theory exam", ev: "Written Notes Seized", status: "Under Review" }
]`, "GroupedBarChart");

writeExamPage("staff.examination-dean.committee-reports.tsx", "/staff/examination-dean/committee-reports", "Committee Reports", "Malpractice Standing Committee inquiry reports and hearing minutes.", "MALPRACTICE", [{ label: "Committee Hearings", val: "2 Hearings" }, { label: "Findings", val: "Documented" }, { label: "Dean Sanction", val: "Approved" }, { label: "Status", val: "Completed" }], ["Case Ref", "Student Name", "Committee Chair", "Hearing Date", "Committee Recommendation", "Status"], `[
  { ref: "MP-2026-01", student: "R. Dinesh", chair: "Dean Examination & Disciplinary Chair", date: "2026-08-03", rec: "Cancellation of CS501 Exam & Fine of ₹5,000", status: "Approved" }
]`);

writeExamPage("staff.examination-dean.punishment-history.tsx", "/staff/examination-dean/punishment-history", "Punishment History", "Past malpractice disciplinary actions, exam cancellations, and fine collection.", "MALPRACTICE", [{ label: "Disciplinary Actions", val: "8 Cases Total" }, { label: "Fines Collected", val: "100%" }, { label: "Enforcement Audit", val: "Passed" }, { label: "Status", val: "Archived" }], ["Case Ref", "Student Name", "Academic Session", "Punishment Enforced", "Fine Paid", "Status"], `[
  { ref: "MP-2025-04", student: "V. Anil (21CE108)", sess: "2024-25 Autumn", pun: "Suspension for 1 Exam & Fine", fine: "₹5,000 Paid", status: "Enforced" }
]`);

// Reports
writeExamPage("staff.examination-dean.exam-reports.tsx", "/staff/examination-dean/exam-reports", "Exam Reports", "Master examination statistics, hall utilization, and invigilator attendance reports.", "REPORTS", [{ label: "Reports Archived", val: "18 Reports" }, { label: "Audit Clearance", val: "100%" }, { label: "Compliance Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "Generated Date", "Status"], `[
  { title: "Annual Institutional End-Semester Examinations Master Audit Report 2025-26", scope: "Entire Campus", date: "2026-08-01", status: "Verified" }
]`);

writeExamPage("staff.examination-dean.result-reports.tsx", "/staff/examination-dean/result-reports", "Result Reports", "Department pass percentage analysis, grade distribution, and SGPA statistics.", "REPORTS", [{ label: "Pass Rate", val: "92.6%" }, { label: "Gold Medalists", val: "8 Rank Holders" }, { label: "BOS Verification", val: "Clean" }, { label: "Status", val: "Verified" }], ["Report Title", "Overall Pass %", "Top Department", "Status"], `[
  { title: "Autumn Semester 2026 Comprehensive Result Analysis & Pass % Report", pct: "92.6% Pass", top: "CSE Dept (93.3%)", status: "Verified" }
]`);

writeExamPage("staff.examination-dean.hall-ticket-reports.tsx", "/staff/examination-dean/hall-ticket-reports", "Hall Ticket Reports", "Hall ticket issuance audit, attendance shortage withheld list, and download logs.", "REPORTS", [{ label: "Tickets Issued", val: "4,850 Tickets" }, { label: "Withheld List", val: "120 Students" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Issued Count", "Withheld Count", "Status"], `[
  { title: "Semester Hall Ticket Dispatch & Attendance Shortage Withheld Report", iss: "4,850 Tickets", with: "120 Shortage", status: "Verified" }
]`);

writeExamPage("staff.examination-dean.invigilator-reports.tsx", "/staff/examination-dean/invigilator-reports", "Invigilator Reports", "Faculty invigilation duty attendance, duty load compliance, and honorarium audit.", "REPORTS", [{ label: "Faculty Duties", val: "368 Sessions" }, { label: "Duty Compliance", val: "100%" }, { label: "Honorarium Disb", val: "Cleared" }, { label: "Status", val: "Verified" }], ["Report Title", "Total Duties", "Compliance Score", "Status"], `[
  { title: "Faculty Invigilation Duty Attendance & Honorarium Performance Report", count: "368 Duties", comp: "100% On-Time", status: "Verified" }
]`);

writeExamPage("staff.examination-dean.malpractice-reports.tsx", "/staff/examination-dean/malpractice-reports", "Malpractice Reports", "Malpractice incident ledgers, squad inspection reports, and committee actions.", "REPORTS", [{ label: "Malpractice Rate", val: "0.03%" }, { label: "Disciplinary Actions", val: "100% Enforced" }, { label: "Squad Inspections", val: "36 Runs" }, { label: "Status", val: "Verified" }], ["Report Title", "Cases Reported", "Committee Enforcement", "Status"], `[
  { title: "Annual Malpractice Standing Committee Audit & Action Taken Report", count: "2 Cases", enf: "100% Enforced", status: "Verified" }
]`);

console.log("All 38 Examination dedicated pages generated successfully.");
