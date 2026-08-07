import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writePlacementPage(filename, routePath, pageTitleText, subTitleText, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Building2,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Rocket,
  CheckCircle2,
  Clock,
  UserCheck,
  Globe,
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
    meta: [{ title: "${pageTitleText} — Placement Dean" }],
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
            <span className="text-xs text-muted-foreground">• Placement Dean ERP Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${pageTitleText}</h1>
          <p className="text-sm text-muted-foreground">${subTitleText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Placement Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={Building2} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={Users} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={Briefcase} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={Award} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${pageTitleText} Distribution Chart" description="Quantitative placement metrics across academic departments and recruiters.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", placed: 465 },
            { category: "ECE Dept", placed: 350 },
            { category: "ME Dept", placed: 210 },
            { category: "EEE Dept", placed: 195 },
            { category: "Civil Dept", placed: 150 },
            { category: "MBA Dept", placed: 130 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "placed", label: "Placed Students" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${pageTitleText} Master Ledger" description="Official Corporate Relations & Placement Cell ledgers, student selections, and drive details.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search placement records, companies, students..."
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
                <SelectItem value="completed">Completed / Placed</SelectItem>
                <SelectItem value="active">Active / Scheduled</SelectItem>
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
                        {String(val).toLowerCase().includes("completed") || String(val).toLowerCase().includes("placed") || String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("released") || String(val).toLowerCase().includes("verified") || String(val).toLowerCase().includes("selected") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("upcoming") || String(val).toLowerCase().includes("shortlisted") ? (
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
  console.log(`Saved Placement subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL 31 PLACEMENT SUBPAGES
// ----------------------------------------------------

// Company Management
writePlacementPage("staff.placement-dean.companies.tsx", "/staff/placement-dean/companies", "Companies", "Master directory of empanelled recruiters, industry partners, and annual CTC bands.", "COMPANY MANAGEMENT", [{ label: "Total Companies", val: "142 Partners" }, { label: "Tier 1 Corporate", val: "48 Companies" }, { label: "MoUs Signed", val: "36 Active" }, { label: "Status", val: "Active" }], ["Company Name", "Industry Domain", "HQ Location", "HR Contact", "Package Offered", "Eligible Branches", "Status"], `[
  { name: "Microsoft India", ind: "Software & Cloud", loc: "Hyderabad / Bengaluru", hr: "Dr. Ananya Rao", pkg: "₹52.0 LPA", branches: "CSE, ECE, AI & DS", status: "Active" },
  { name: "TCS (Tata Consultancy Services)", ind: "IT Services", loc: "Mumbai / Hyderabad", hr: "Mr. Rajesh Sharma", pkg: "₹7.5 - ₹11.5 LPA", branches: "All Engineering Branches", status: "Active" },
  { name: "Deloitte India", ind: "Management Consulting", loc: "Hyderabad / Gurugram", hr: "Ms. Sneha Reddy", pkg: "₹14.5 LPA", branches: "CSE, ECE, MBA", status: "Active" },
  { name: "Cognizant", ind: "IT Services", loc: "Chennai / Hyderabad", hr: "Mr. Nikhil Verma", pkg: "₹6.8 LPA", branches: "All Branches", status: "Active" },
  { name: "Accenture India", ind: "Technology & Consulting", loc: "Bengaluru", hr: "Ms. Priya Nair", pkg: "₹8.5 LPA", branches: "CSE, ECE, EEE", status: "Active" }
]`, "GroupedBarChart");

writePlacementPage("staff.placement-dean.company-profiles.tsx", "/staff/placement-dean/company-profiles", "Company Profiles", "Corporate recruiter profiles, job descriptions, eligibility criteria, and CTC perks.", "COMPANY MANAGEMENT", [{ label: "Profiles Active", val: "142 Profiles" }, { label: "Tier 1 Dream", val: "32 Recruiters" }, { label: "JD Verified", val: "100%" }, { label: "Status", val: "Active" }], ["Company Name", "Job Role", "Min CGPA Criteria", "Bond Period", "Base Pay CTC", "Selection Process", "Status"], `[
  { name: "Microsoft India", role: "Software Development Engineer (SDE-1)", cgpa: "8.5 CGPA", bond: "No Bond", base: "₹52.0 LPA", proc: "OA + 3 Tech Interviews", status: "Active" },
  { name: "Deloitte India", role: "Technology Consultant", cgpa: "7.5 CGPA", bond: "No Bond", base: "₹14.5 LPA", proc: "Aptitude + Case Study + Interview", status: "Active" }
]`);

writePlacementPage("staff.placement-dean.recruitment-partners.tsx", "/staff/placement-dean/recruitment-partners", "Recruitment Partners", "Long-term corporate campus hiring partners and Industry Advisory Board ledgers.", "COMPANY MANAGEMENT", [{ label: "Partners", val: "48 Companies" }, { label: "Annual Repeat Rate", val: "94.0%" }, { label: "MoU Validity", val: "3 Years Avg" }, { label: "Status", val: "Active" }], ["Partner Name", "Tier Level", "Partnership Since", "Annual Hires Avg", "MoU Status", "Status"], `[
  { name: "TCS", tier: "Tier 1 Mass Recruiter", since: "2012", hires: "220 / Year", mou: "MoU Signed & Active", status: "Active" },
  { name: "Infosys", tier: "Tier 1 Partner", since: "2014", hires: "180 / Year", mou: "MoU Signed & Active", status: "Active" }
]`);

writePlacementPage("staff.placement-dean.company-visits.tsx", "/staff/placement-dean/company-visits", "Company Visits", "Scheduled corporate campus visits, HR executive hospitality, and auditorium slots.", "COMPANY MANAGEMENT", [{ label: "Campus Visits", val: "64 Visits" }, { label: "Auditorium Booked", val: "100%" }, { label: "HR Guests", val: "180 Executives" }, { label: "Status", val: "Scheduled" }], ["Company Name", "Visit Date", "Auditorium Venue", "HR Lead", "Drive Type", "Status"], `[
  { name: "Microsoft India", date: "2026-08-15", venue: "Main Auditorium Block A", lead: "Dr. Ananya Rao", type: "On-Campus Drive", status: "Scheduled" }
]`);

// Placement Drives
writePlacementPage("staff.placement-dean.upcoming-drives.tsx", "/staff/placement-dean/upcoming-drives", "Upcoming Drives", "Scheduled campus recruitment drives, registration deadlines, and eligibility criteria.", "PLACEMENT DRIVES", [{ label: "Upcoming Drives", val: "18 Drives" }, { label: "Registered Students", val: "1,420 Registrations" }, { label: "Venue Ready", val: "Verified" }, { label: "Status", val: "Scheduled" }], ["Company", "Drive Date", "Venue", "Eligible Branches", "Eligible CGPA", "Rounds", "Status"], `[
  { comp: "Oracle India", date: "2026-08-20", venue: "Seminar Hall 1", branch: "CSE, ECE, AI & DS", cgpa: "8.0 CGPA", rounds: "Online Test + Tech + HR", status: "Upcoming" },
  { comp: "Capgemini", date: "2026-08-22", venue: "Central Computer Lab", branch: "All Engineering Branches", cgpa: "6.5 CGPA", rounds: "Pseudocode + Interview", status: "Upcoming" }
]`, "GroupedBarChart");

writePlacementPage("staff.placement-dean.ongoing-drives.tsx", "/staff/placement-dean/ongoing-drives", "Ongoing Drives", "Live recruitment drive progress, online assessment monitoring, and interview shortlists.", "PLACEMENT DRIVES", [{ label: "Live Drives", val: "4 Active Drives" }, { label: "Students Testing", val: "680 Students" }, { label: "Live Round", val: "Round 2 Tech Interview" }, { label: "Status", val: "Active" }], ["Company Name", "Current Round", "Venue / Platform", "Students Appearing", "Shortlisted", "Status"], `[
  { name: "Wipro Turbo", round: "Technical Interview Round 2", venue: "Block B Placement Cell", app: "120 Students", short: "45 Students", status: "Active" }
]`);

writePlacementPage("staff.placement-dean.completed-drives.tsx", "/staff/placement-dean/completed-drives", "Completed Drives", "Completed recruitment drive ledgers, total selections, and package announcements.", "PLACEMENT DRIVES", [{ label: "Completed Drives", val: "42 Drives" }, { label: "Total Selections", val: "1,640 Offers" }, { label: "Highest CTC", val: "₹52.0 LPA" }, { label: "Status", val: "Completed" }], ["Company Name", "Drive Date", "Total Offers", "Highest CTC", "Average CTC", "Status"], `[
  { name: "Microsoft India", date: "2026-07-28", offers: "18 Offers", high: "₹52.0 LPA", avg: "₹45.0 LPA", status: "Completed" },
  { name: "Deloitte India", date: "2026-08-01", offers: "45 Offers", high: "₹14.5 LPA", avg: "₹14.5 LPA", status: "Completed" }
]`);

writePlacementPage("staff.placement-dean.off-campus-drives.tsx", "/staff/placement-dean/off-campus-drives", "Off-Campus Drives", "Pool campus & off-campus hiring opportunities, referral drives, and external venues.", "PLACEMENT DRIVES", [{ label: "Off-Campus Drives", val: "12 Drives" }, { label: "Referral Offers", val: "85 Offers" }, { label: "Venue Verification", val: "Passed" }, { label: "Status", val: "Active" }], ["Company Name", "Off-Campus Venue", "Drive Date", "Eligible Batch", "Registered Students", "Status"], `[
  { name: "Amazon India", venue: "Amazon Campus Hyderabad", date: "2026-08-25", batch: "2026 Graduating Batch", reg: "140 Students", status: "Active" }
]`);

// Student Placement
writePlacementPage("staff.placement-dean.eligible-students.tsx", "/staff/placement-dean/eligible-students", "Eligible Students", "Placement eligible student directory, backlogs clearance, and CGPA audit.", "STUDENT PLACEMENT", [{ label: "Eligible Students", val: "1,850 Students" }, { label: "Eligibility Rate", val: "94.2%" }, { label: "No Active Backlogs", val: "1,850 Students" }, { label: "Status", val: "Eligible" }], ["Roll Number", "Student Name", "Department", "CGPA", "Active Backlogs", "Eligibility Status", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", dept: "CSE", cgpa: "9.28", backlogs: "0 Backlogs", elig: "Eligible for All Tiers", status: "Eligible" },
  { roll: "22EC102", name: "Ananya Reddy", dept: "ECE", cgpa: "9.15", backlogs: "0 Backlogs", elig: "Eligible for All Tiers", status: "Eligible" },
  { roll: "22ME104", name: "Sai Kiran", dept: "Mechanical", cgpa: "8.40", backlogs: "0 Backlogs", elig: "Eligible for Core & IT", status: "Eligible" }
]`, "GroupedBarChart");

writePlacementPage("staff.placement-dean.registered-students.tsx", "/staff/placement-dean/registered-students", "Registered Students", "Placement portal registered students, resume uploads, and tier choices.", "STUDENT PLACEMENT", [{ label: "Registered", val: "1,820 / 1,850 (98.3%)" }, { label: "Resumes Uploaded", val: "100%" }, { label: "Portal NOC", val: "Clear" }, { label: "Status", val: "Registered" }], ["Roll Number", "Student Name", "Department", "Target Domain", "Resume Status", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", dept: "CSE", dom: "Software / AI", res: "Verified & Uploaded", status: "Registered" }
]`);

writePlacementPage("staff.placement-dean.shortlisted-students.tsx", "/staff/placement-dean/shortlisted-students", "Shortlisted Students", "Round-wise student shortlists for interview rounds.", "STUDENT PLACEMENT", [{ label: "Shortlisted", val: "1,420 Students" }, { label: "Shortlist Ratio", val: "78.0%" }, { label: "Interviews Booked", val: "100%" }, { label: "Status", val: "Shortlisted" }], ["Student Name", "Roll Number", "Department", "Company", "Shortlisted Round", "Status"], `[
  { name: "Rahul Sharma", roll: "22CS101", dept: "CSE", comp: "Microsoft India", round: "Final HR Interview", status: "Shortlisted" }
]`);

writePlacementPage("staff.placement-dean.selected-students.tsx", "/staff/placement-dean/selected-students", "Selected Students", "Placed students master ledger, company selections, and salary package CTCs.", "STUDENT PLACEMENT", [{ label: "Placed Students", val: "1,640 Placed" }, { label: "Placement Rate", val: "89.6%" }, { label: "Highest Package", val: "₹52.0 LPA" }, { label: "Status", val: "Placed" }], ["Student Name", "Roll Number", "Department", "CGPA", "Placed Company", "Salary CTC Package", "Status"], `[
  { name: "Rahul Sharma", roll: "22CS101", dept: "CSE", cgpa: "9.28", comp: "Microsoft India", pkg: "₹52.0 LPA", status: "Placed" },
  { name: "Ananya Reddy", roll: "22EC102", dept: "ECE", cgpa: "9.15", comp: "Deloitte India", pkg: "₹14.5 LPA", status: "Placed" },
  { name: "Sneha Rao", roll: "22CS105", dept: "CSE", cgpa: "8.90", comp: "TCS Digital", pkg: "₹11.5 LPA", status: "Placed" }
]`);

writePlacementPage("staff.placement-dean.offer-letters.tsx", "/staff/placement-dean/offer-letters", "Offer Letters", "Official corporate offer letters, join date acceptance, and NOC issuance.", "STUDENT PLACEMENT", [{ label: "Offer Letters Issued", val: "1,640 Offers" }, { label: "Acceptance Rate", val: "97.5%" }, { label: "Joining Dates Set", val: "Verified" }, { label: "Status", val: "Released" }], ["Student Name", "Roll Number", "Company Name", "Offer Date", "Joining Date", "Offer Letter Doc", "Status"], `[
  { name: "Rahul Sharma", roll: "22CS101", comp: "Microsoft India", date: "2026-07-30", join: "2026-09-01", doc: "OL-MSFT-2026-901", status: "Released" }
]`);

// Internships
writePlacementPage("staff.placement-dean.internship-opportunities.tsx", "/staff/placement-dean/internship-opportunities", "Internship Opportunities", "Summer internship postings, PPO pathways, and corporate stipend packages.", "INTERNSHIPS", [{ label: "Opportunities", val: "85 Postings" }, { label: "Stipend Range", val: "₹25k - ₹1.2L / Mo" }, { label: "PPO Offered", val: "65%" }, { label: "Status", val: "Active" }], ["Company Name", "Role / Domain", "Duration", "Stipend / Month", "Department Scope", "Students Selected", "Status"], `[
  { comp: "Amazon India", role: "SDE Intern", dur: "6 Months", stipend: "₹1,10,000 / Mo", dept: "CSE, ECE, AI & DS", sel: "15 Students", status: "Active" },
  { comp: "Deloitte", role: "Consulting Intern", dur: "3 Months", stipend: "₹45,000 / Mo", dept: "CSE, MBA", sel: "20 Students", status: "Active" }
]`, "GroupedBarChart");

writePlacementPage("staff.placement-dean.internship-tracking.tsx", "/staff/placement-dean/internship-tracking", "Internship Tracking", "Real-time internship progress monitoring, monthly attendance, and mentor evaluation.", "INTERNSHIPS", [{ label: "Active Interns", val: "420 Students" }, { label: "Attendance Rate", val: "98.5%" }, { label: "Monthly Log Clearance", val: "100%" }, { label: "Status", val: "Active" }], ["Student Name", "Roll Number", "Company", "Mentor Name", "Progress Rating", "Status"], `[
  { name: "Nikhil Reddy", roll: "22CS108", comp: "Amazon India", mentor: "Mr. Corporate Mentor", rat: "Outstanding (A+)", status: "Active" }
]`);

writePlacementPage("staff.placement-dean.internship-reports.tsx", "/staff/placement-dean/internship-reports", "Internship Reports", "Internship completion certificates, PPO conversion rates, and stipend audit.", "INTERNSHIPS", [{ label: "Completed Internships", val: "420 Students" }, { label: "PPOs Converted", val: "273 PPO Offers (65%)" }, { label: "Audit Clearance", val: "Verified" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "PPO Conversion Rate", "Status"], `[
  { title: "Summer Internship & PPO Conversion Performance Report 2026", scope: "All Batches", ppo: "65% PPO Conversion Rate", status: "Verified" }
]`);

// Training & Development
writePlacementPage("staff.placement-dean.aptitude-training.tsx", "/staff/placement-dean/aptitude-training", "Aptitude Training", "Quantitative aptitude, logical reasoning, and verbal training modules.", "TRAINING & DEVELOPMENT", [{ label: "Training Hours", val: "120 Hours" }, { label: "Students Trained", val: "1,850 Students" }, { label: "Pass Score Avg", val: "86.5%" }, { label: "Status", val: "Completed" }], ["Training Program", "Trainer Agency / Faculty", "Department Scope", "Schedule", "Attendance %", "Completion %", "Status"], `[
  { prog: "Advanced Quantitative Aptitude & Reasoning", trainer: "Dr. Priya Sharma & TIME Agency", dept: "All Departments", sched: "Mon, Wed, Fri (04:00 PM)", att: "96.5%", comp: "100% Completed", status: "Completed" }
]`, "GroupedBarChart");

writePlacementPage("staff.placement-dean.coding-training.tsx", "/staff/placement-dean/coding-training", "Coding Training", "Data Structures, Algorithms, System Design, and LeetCode bootcamp.", "TRAINING & DEVELOPMENT", [{ label: "Coding Bootcamps", val: "150 Hours" }, { label: "Problems Solved Avg", val: "250 Problems" }, { label: "Mock OA Clear Rate", val: "92.0%" }, { label: "Status", val: "Completed" }], ["Program Title", "Lead Trainer", "Target Companies", "Coverage", "Student Rating", "Status"], `[
  { title: "DSA & Competitive Programming Bootcamp", trainer: "Dr. Srinivas Rao", target: "Tier 1 Product Companies", cov: "Arrays, Graphs, DP, System Design", rat: "4.9 / 5.0", status: "Completed" }
]`);

writePlacementPage("staff.placement-dean.soft-skills.tsx", "/staff/placement-dean/soft-skills", "Soft Skills", "Corporate etiquette, group discussions (GD), and presentation skills workshops.", "TRAINING & DEVELOPMENT", [{ label: "GD Workshops", val: "40 Sessions" }, { label: "Soft Skill Rating", val: "Excellent" }, { label: "Attendance Rate", val: "97.8%" }, { label: "Status", val: "Completed" }], ["Workshop Title", "Corporate Trainer", "Target Group", "Session Scope", "Status"], `[
  { title: "Corporate Communication & Executive GD Mastery", trainer: "Dr. Lakshmi Devi", group: "Final Year Students", scope: "GD, Email Writing, Personal Interview", status: "Completed" }
]`);

writePlacementPage("staff.placement-dean.mock-interviews.tsx", "/staff/placement-dean/mock-interviews", "Mock Interviews", "Alumni & industry expert 1-on-1 mock technical & HR interviews.", "TRAINING & DEVELOPMENT", [{ label: "Mock Interviews Held", val: "1,820 Interviews" }, { label: "Alumni Panelists", val: "45 Alumni Experts" }, { label: "Readiness Index", val: "94.5%" }, { label: "Status", val: "Completed" }], ["Student Name", "Roll Number", "Department", "Panelist Name", "Interview Score", "Feedback", "Status"], `[
  { name: "Rahul Sharma", roll: "22CS101", dept: "CSE", pan: "Mr. Alumni SDE (Google)", score: "9.5 / 10", fb: "Strong DSA skills, ready for Tier 1", status: "Completed" }
]`);

writePlacementPage("staff.placement-dean.resume-reviews.tsx", "/staff/placement-dean/resume-reviews", "Resume Reviews", "ATS resume formatting, keyword optimization, and placement cell verification.", "TRAINING & DEVELOPMENT", [{ label: "Resumes Reviewed", val: "1,850 Resumes" }, { label: "ATS Score Avg", val: "88 / 100" }, { label: "NOC Issued", val: "100%" }, { label: "Status", val: "Verified" }], ["Roll Number", "Student Name", "Department", "ATS Score", "Reviewer Faculty", "Status"], `[
  { roll: "22CS101", name: "Rahul Sharma", dept: "CSE", ats: "94 / 100", rev: "Placement Cell Team", status: "Verified" }
]`);

// Placement Analytics
writePlacementPage("staff.placement-dean.placement-statistics.tsx", "/staff/placement-dean/placement-statistics", "Placement Statistics", "Master campus placement rate analytics, year-on-year growth, and offer distribution.", "PLACEMENT ANALYTICS", [{ label: "Overall Placement", val: "89.6%" }, { label: "Offers Generated", val: "1,640 Offers" }, { label: "Highest CTC", val: "₹52.0 LPA" }, { label: "Status", val: "Verified" }], ["Metric Title", "Current Session 2025-26", "Previous Session 2024-25", "YoY Growth", "Status"], `[
  { title: "Total Placed Students", cur: "1,640 Students", prev: "1,520 Students", yoy: "+7.89% Growth", status: "Verified" },
  { title: "Average Package CTC", cur: "₹12.4 LPA", prev: "₹10.8 LPA", yoy: "+14.81% Growth", status: "Verified" }
]`, "GroupedBarChart");

writePlacementPage("staff.placement-dean.dept-placements.tsx", "/staff/placement-dean/dept-placements", "Department-wise Placements", "Department breakdown of placement percentage, highest CTC, and average CTC.", "PLACEMENT ANALYTICS", [{ label: "Departments", val: "8 Departments" }, { label: "Top Dept", val: "CSE (96.8%)" }, { label: "Avg CTC Highest", val: "CSE (₹16.5 LPA)" }, { label: "Status", val: "Verified" }], ["Department", "Eligible Students", "Placed Students", "Placement %", "Highest CTC", "Average CTC", "Status"], `[
  { dept: "Computer Science Engineering", elig: "480", placed: "465", pct: "96.8%", high: "₹52.0 LPA", avg: "₹16.5 LPA", status: "Verified" },
  { dept: "Electronics & Communication", elig: "380", placed: "350", pct: "92.1%", high: "₹28.0 LPA", avg: "₹12.2 LPA", status: "Verified" },
  { dept: "Mechanical Engineering", elig: "250", placed: "210", pct: "84.0%", high: "₹14.0 LPA", avg: "₹8.5 LPA", status: "Verified" }
]`);

writePlacementPage("staff.placement-dean.package-analysis.tsx", "/staff/placement-dean/package-analysis", "Package Analysis", "CTC band distribution analysis, base pay vs variable pay ledgers.", "PLACEMENT ANALYTICS", [{ label: "Highest CTC", val: "₹52.0 LPA" }, { label: "Average CTC", val: "₹12.4 LPA" }, { label: "Median CTC", val: "₹10.5 LPA" }, { label: "Status", val: "Verified" }], ["CTC Band Range", "Total Placed Students", "Percentage Share", "Top Recruiter in Band", "Status"], `[
  { band: "Dream Tier (₹20+ LPA)", count: "303 Students", pct: "18.5%", top: "Microsoft, Amazon", status: "Verified" },
  { band: "Super Dream (₹12 - ₹20 LPA)", count: "561 Students", pct: "34.2%", top: "Deloitte, TCS Digital", status: "Verified" }
]`);

writePlacementPage("staff.placement-dean.company-hiring.tsx", "/staff/placement-dean/company-hiring", "Company-wise Hiring", "Recruiter-wise total selections, CTC range, and department breakdown.", "PLACEMENT ANALYTICS", [{ label: "Recruiters", val: "142 Companies" }, { label: "Top Recruiter", val: "TCS (240 Offers)" }, { label: "SLA Clearance", val: "Passed" }, { label: "Status", val: "Verified" }], ["Company Name", "Total Offers Dispatched", "Package Offered", "Top Department Hired", "Status"], `[
  { comp: "TCS", offers: "240 Offers", pkg: "₹7.5 - ₹11.5 LPA", dept: "CSE, ECE, EEE, Civil, ME", status: "Verified" },
  { comp: "Infosys", offers: "180 Offers", pkg: "₹6.5 - ₹9.5 LPA", dept: "All Branches", status: "Verified" }
]`);

// Reports
writePlacementPage("staff.placement-dean.placement-reports.tsx", "/staff/placement-dean/placement-reports", "Placement Reports", "Master institutional placement audit report and NIRF placement metrics.", "REPORTS", [{ label: "Reports Archived", val: "18 Reports" }, { label: "NIRF Verified", val: "100%" }, { label: "Audit Clearance", val: "Grade A" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "Generated Date", "Status"], `[
  { title: "Annual Institutional Placement Audit & NIRF Ranking Data Report 2025-26", scope: "Entire Campus", date: "2026-08-01", status: "Verified" }
]`);

writePlacementPage("staff.placement-dean.internship-reports-list.tsx", "/staff/placement-dean/internship-reports-list", "Internship Reports", "Summer internship performance ledgers and corporate stipend audit.", "REPORTS", [{ label: "Internships", val: "420 Students" }, { label: "Stipend Total", val: "₹1.85 Cr" }, { label: "PPO Rate", val: "65%" }, { label: "Status", val: "Verified" }], ["Report Title", "Total Interns", "Stipend Disbursed", "Status"], `[
  { title: "Annual Corporate Internship & Stipend Disbursement Audit Report", count: "420 Students", amt: "₹1.85 Cr", status: "Verified" }
]`);

writePlacementPage("staff.placement-dean.company-reports.tsx", "/staff/placement-dean/company-reports", "Company Reports", "Recruiter feedback reports, HR satisfaction index, and salary trend analysis.", "REPORTS", [{ label: "Recruiters Audited", val: "142 Companies" }, { label: "HR Rating", val: "4.8 / 5.0" }, { label: "Repeat Hiring", val: "94.0%" }, { label: "Status", val: "Verified" }], ["Report Title", "Companies Audited", "Satisfaction Score", "Status"], `[
  { title: "Empanelled Corporate Recruiters Feedback & Satisfaction Report", count: "142 Companies", score: "4.8 / 5.0 Rating", status: "Verified" }
]`);

writePlacementPage("staff.placement-dean.student-reports.tsx", "/staff/placement-dean/student-reports", "Student Reports", "Student placement status summary, branch-wise placement ledgers, and unplaced list.", "REPORTS", [{ label: "Students Mapped", val: "1,850 Students" }, { label: "Unplaced List", val: "210 Students (Active Drives)" }, { label: "Placement Rate", val: "89.6%" }, { label: "Status", val: "Verified" }], ["Report Title", "Eligible Count", "Placed Ratio", "Status"], `[
  { title: "Branch-wise Student Placement Status & Unplaced Remedial Tracking Report", count: "1,850 Students", ratio: "89.6% Placed", status: "Verified" }
]`);

writePlacementPage("staff.placement-dean.training-reports.tsx", "/staff/placement-dean/training-reports", "Training Reports", "Aptitude, coding, and soft skills training effectiveness & score improvement reports.", "REPORTS", [{ label: "Training Programs", val: "12 Modules" }, { label: "Score Gain", val: "+28% Avg" }, { label: "Completion Rate", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Total Hours", "Score Gain Avg", "Status"], `[
  { title: "Pre-Placement Training & Mock Interview Performance Audit Report", hrs: "310 Hours", gain: "+28% Score Gain", status: "Verified" }
]`);

console.log("All 31 Placement dedicated pages generated successfully.");
