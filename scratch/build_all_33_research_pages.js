import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function writeResearchPage(filename, routePath, pageTitleText, subTitleText, badgeText, kpis, headers, rowsJS, chartType) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  FolderGit2,
  BookOpen,
  Award,
  Landmark,
  GraduationCap,
  FlaskConical,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Send,
  Inbox,
  Bell,
  Save,
  Lock,
  Globe,
  Shield,
  User,
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
    meta: [{ title: "${pageTitleText} — R&D Dean" }],
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
            <span className="text-xs text-muted-foreground">• R&D Dean Research ERP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${pageTitleText}</h1>
          <p className="text-sm text-muted-foreground">${subTitleText}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 cursor-pointer">
            <Download className="size-3.5" /> Export PDF / Excel
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Add Research Record
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="${kpis[0].label}" value="${kpis[0].val}" icon={FolderGit2} tone="purple" />
        <KpiCard label="${kpis[1].label}" value="${kpis[1].val}" icon={BookOpen} tone="success" />
        <KpiCard label="${kpis[2].label}" value="${kpis[2].val}" icon={Award} tone="info" />
        <KpiCard label="${kpis[3].label}" value="${kpis[3].val}" icon={CheckCircle2} tone="warning" />
      </div>

      ${chartType === "GroupedBarChart" ? `
      <Panel title="${pageTitleText} Breakdown Chart" description="Quantitative research metrics across departments.">
        <GroupedBarChart
          data={[
            { category: "CSE Dept", count: 142 },
            { category: "ECE Dept", count: 98 },
            { category: "ME Dept", count: 45 },
            { category: "EEE Dept", count: 38 },
            { category: "Civil Dept", count: 19 },
          ] as unknown as Record<string, unknown>[]}
          xKey="category"
          series={[{ key: "count", label: "Research Output" }]}
          height={200}
        />
      </Panel>
      ` : ""}

      {/* MAIN DATA TABLE */}
      <Panel title="${pageTitleText} Master Ledger" description="Official institutional research projects, publications, grants, and patent dossiers.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search research records, projects, faculty..."
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
                <SelectItem value="completed">Completed / Granted</SelectItem>
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
                        {String(val).toLowerCase().includes("active") || String(val).toLowerCase().includes("approved") || String(val).toLowerCase().includes("granted") || String(val).toLowerCase().includes("completed") || String(val).toLowerCase().includes("published") || String(val).toLowerCase().includes("indexed") ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 font-mono text-[0.65rem]">{String(val)}</Badge>
                        ) : String(val).toLowerCase().includes("pending") || String(val).toLowerCase().includes("filed") || String(val).toLowerCase().includes("under review") ? (
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
  console.log(`Saved Research subpage: ${filename}`);
}

// ----------------------------------------------------
// GENERATE ALL 33 R&D SUBPAGES
// ----------------------------------------------------

// Research Projects
writeResearchPage("staff.research-development.ongoing-projects.tsx", "/staff/research-development/ongoing-projects", "Ongoing Projects", "Active sponsored research projects, principal investigators, and funding agencies.", "RESEARCH PROJECTS", [{ label: "Active Projects", val: "28 Active" }, { label: "Total Budget", val: "₹5.40 Cr" }, { label: "Lead PIs", val: "24 Faculty" }, { label: "Status", val: "Active" }], ["Project ID", "Project Title", "Principal Investigator", "Department", "Funding Agency", "Budget", "Duration", "Status"], `[
  { id: "PRJ-2024-01", title: "AI-Based Smart Healthcare & Diagnostic Intelligence", pi: "Dr. Ravi Kumar", dept: "CSE", agency: "DST SERB", budget: "₹45.0 Lacs", duration: "2024 - 2027", status: "Active" },
  { id: "PRJ-2025-02", title: "IoT Smart Agriculture & Soil Health Monitoring", pi: "Dr. Priya Sharma", dept: "ECE", agency: "MeitY Govt of India", budget: "₹32.5 Lacs", duration: "2025 - 2028", status: "Active" },
  { id: "PRJ-2024-03", title: "Cyber Threat Detection using AI & Behavioral Biometrics", pi: "Dr. Srinivas Rao", dept: "CSE", agency: "DRDO CARS", budget: "₹58.0 Lacs", duration: "2024 - 2026", status: "Active" },
  { id: "PRJ-2025-04", title: "Renewable Energy Grid Optimization & Battery Storage", pi: "Dr. Lakshmi Devi", dept: "EEE", agency: "MNRE Govt of India", budget: "₹42.0 Lacs", duration: "2025 - 2027", status: "Active" },
  { id: "PRJ-2024-05", title: "Smart Traffic Management using Edge Computing", pi: "Dr. Karthik Reddy", dept: "CSE", agency: "AICTE RPS", budget: "₹25.0 Lacs", duration: "2024 - 2026", status: "Active" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.completed-projects.tsx", "/staff/research-development/completed-projects", "Completed Projects", "Successfully completed research projects and final utilization reports.", "RESEARCH PROJECTS", [{ label: "Completed", val: "20 Projects" }, { label: "Total Value", val: "₹3.05 Cr" }, { label: "Reports Filed", val: "100%" }, { label: "Status", val: "Completed" }], ["Project ID", "Project Title", "Principal Investigator", "Department", "Funding Agency", "Final Budget", "Completion Date", "Status"], `[
  { id: "PRJ-2022-01", title: "Deep Learning for Autonomous Drone Navigation", pi: "Dr. Ravi Kumar", dept: "CSE", agency: "DST", budget: "₹35.0 Lacs", date: "2024-12-15", status: "Completed" }
]`);

writeResearchPage("staff.research-development.sponsored-projects.tsx", "/staff/research-development/sponsored-projects", "Sponsored Projects", "External government & international sponsored research projects.", "RESEARCH PROJECTS", [{ label: "Sponsored Grants", val: "18 Grants" }, { label: "DST / SERB", val: "12 Projects" }, { label: "DRDO / ISRO", val: "6 Projects" }, { label: "Status", val: "Active" }], ["Project ID", "Project Title", "Sponsoring Agency", "PI Name", "Sanctioned Amount", "Status"], `[
  { id: "SP-DST-901", title: "Quantum Cryptography for Secure Communication", agency: "DST SERB", pi: "Dr. Srinivas Rao", amt: "₹65.0 Lacs", status: "Active" }
]`);

writeResearchPage("staff.research-development.consultancy-projects.tsx", "/staff/research-development/consultancy-projects", "Consultancy Projects", "Industry consultancy projects and institutional revenue.", "RESEARCH PROJECTS", [{ label: "Consultancy Reqs", val: "10 Projects" }, { label: "Revenue Earned", val: "₹85.0 Lacs" }, { label: "Corporate Clients", val: "8 Companies" }, { label: "Status", val: "Active" }], ["Project Ref", "Client Organization", "Project Scope", "Faculty Consultant", "Consultancy Fee", "Status"], `[
  { ref: "CNS-2026-01", client: "L&T Infotech", scope: "Enterprise AI Security Audit", consultant: "Dr. Ravi Kumar", fee: "₹15.0 Lacs", status: "Active" }
]`);

// Research Publications
writeResearchPage("staff.research-development.journal-publications.tsx", "/staff/research-development/journal-publications", "Journal Publications", "SCI, Scopus, & Web of Science indexed journal papers.", "RESEARCH PUBLICATIONS", [{ label: "SCI Journals", val: "185 Papers" }, { label: "Scopus Papers", val: "157 Papers" }, { label: "Avg Impact Factor", val: "4.85 IF" }, { label: "Status", val: "Published" }], ["Title", "Authors", "Journal Name", "Publisher", "Scopus / SCI", "DOI", "Year", "Status"], `[
  { title: "Deep Residual Networks for Medical Image Diagnostics", authors: "Dr. Ravi Kumar, Dr. Priya Sharma", journal: "IEEE Transactions on Medical Imaging", pub: "IEEE", index: "SCI & Scopus", doi: "10.1109/TMI.2025.90124", year: "2025", status: "Published" },
  { title: "IoT Sensor Fusion for Soil Nutrient Prediction", authors: "Dr. Priya Sharma", journal: "Computers and Electronics in Agriculture", pub: "Elsevier", index: "SCI & Scopus", doi: "10.1016/j.compag.2025.1092", year: "2025", status: "Published" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.conference-publications.tsx", "/staff/research-development/conference-publications", "Conference Publications", "IEEE, ACM, & Springer international conference proceedings.", "RESEARCH PUBLICATIONS", [{ label: "Conferences", val: "180 Papers" }, { label: "IEEE / ACM", val: "120 Papers" }, { label: "Citations", val: "1,240 Count" }, { label: "Status", val: "Published" }], ["Paper Title", "Authors", "Conference Name", "Organizer", "Indexing", "Year", "Status"], `[
  { title: "Edge AI Acceleration for Autonomous Vehicles", authors: "Dr. Karthik Reddy", conf: "IEEE International Conference on Robotics (ICRA 2025)", org: "IEEE Robotics", index: "Scopus", year: "2025", status: "Published" }
]`);

writeResearchPage("staff.research-development.book-chapters.tsx", "/staff/research-development/book-chapters", "Book Chapters", "Authored books and Springer/CRC Press book chapters.", "RESEARCH PUBLICATIONS", [{ label: "Book Chapters", val: "42 Chapters" }, { label: "Authored Books", val: "8 Books" }, { label: "Publishers", val: "Springer / CRC" }, { label: "Status", val: "Published" }], ["Chapter Title", "Book Title", "Authors", "Publisher", "ISBN", "Year", "Status"], `[
  { title: "Chapter 4: Deep Learning in Smart Cities", book: "Handbook of Smart City Technologies", authors: "Dr. Ravi Kumar", pub: "Springer Nature", isbn: "978-3-030-90124-1", year: "2025", status: "Published" }
]`);

writeResearchPage("staff.research-development.publications-repo.tsx", "/staff/research-development/publications-repo", "Publications Repository", "Central repository of all institutional publication PDFs & DOIs.", "RESEARCH PUBLICATIONS", [{ label: "Repository Size", val: "522 Papers" }, { label: "Citations Total", val: "4,850 Count" }, { label: "h-index Avg", val: "18.4 Index" }, { label: "Status", val: "Active" }], ["Doc ID", "Paper Title", "Department", "Index Type", "Download Link", "Status"], `[
  { id: "PUB-2025-001", title: "Deep Residual Networks for Medical Image Diagnostics", dept: "CSE", type: "SCI Journal", link: "PDF Download", status: "Active" }
]`);

// Patents & Innovation
writeResearchPage("staff.research-development.patents-list.tsx", "/staff/research-development/patents-list", "Patents", "Indian & International patent disclosures, filed dates, & grant certificates.", "PATENTS & INNOVATION", [{ label: "Patents Filed", val: "42 Filed" }, { label: "Patents Granted", val: "18 Granted" }, { label: "Commercialized", val: "4 Patents" }, { label: "Status", val: "Active" }], ["Patent Ref", "Patent Title", "Inventors", "Patent Number", "Filed Date", "Granted Date", "Domain", "Status"], `[
  { ref: "PAT-2024-01", title: "AI System for Real-Time Cardiac Arrhythmia Detection", inventors: "Dr. Ravi Kumar, Dr. Priya Sharma", num: "IN-202411090124", filed: "2024-03-15", granted: "2025-10-12", domain: "Artificial Intelligence", status: "Granted" },
  { ref: "PAT-2025-02", title: "Self-Healing Solar Panel Coating Material", inventors: "Dr. Lakshmi Devi", num: "IN-202511018920", filed: "2025-01-20", granted: "Under Examination", domain: "Renewable Energy", status: "Filed" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.copyrights.tsx", "/staff/research-development/copyrights", "Copyrights", "Software code copyrights, algorithms, & manual registrations.", "PATENTS & INNOVATION", [{ label: "Copyrights Registered", val: "24 Filed" }, { label: "Approved", val: "20 Granted" }, { label: "Software Code", val: "18 Algorithms" }, { label: "Status", val: "Verified" }], ["CR Reg No", "Copyright Title", "Authors / Developers", "Registration Date", "Status"], `[
  { reg: "SW-2025-9012", title: "EduSuite Smart AI Attendance Analytics Software", authors: "Dr. Ravi Kumar", date: "2025-05-14", status: "Granted" }
]`);

writeResearchPage("staff.research-development.innovations.tsx", "/staff/research-development/innovations", "Innovations", "Institutional student & faculty innovative prototypes & TRL levels.", "PATENTS & INNOVATION", [{ label: "Prototypes", val: "32 Innovations" }, { label: "TRL Level 7-9", val: "12 Projects" }, { label: "Commercial Target", val: "8 Projects" }, { label: "Status", val: "Active" }], ["Innovation Code", "Innovation Title", "Lead Innovator", "TRL Stage", "Domain", "Status"], `[
  { code: "INV-2026-01", title: "Autonomous Drone for Forest Fire Prevention", lead: "Dr. Karthik Reddy", trl: "TRL Level 7 (Prototype)", domain: "Robotics", status: "Active" }
]`);

writeResearchPage("staff.research-development.incubation.tsx", "/staff/research-development/incubation", "Startups & Incubation", "Campus innovation incubator, seed funding, and incubated startups.", "PATENTS & INNOVATION", [{ label: "Incubated Startups", val: "8 Startups" }, { label: "Seed Funding", val: "₹1.20 Cr" }, { label: "Jobs Created", val: "45 Jobs" }, { label: "Status", val: "Active" }], ["Startup Name", "Founders", "Domain Focus", "Incubation Stage", "Seed Grant", "Status"], `[
  { name: "HealthAI Innovations Pvt Ltd", founders: "Dr. Ravi Kumar (Faculty Founder)", domain: "MedTech AI", stage: "Growth Stage", seed: "₹25.0 Lacs", status: "Active" }
]`);

// Research Grants
writeResearchPage("staff.research-development.govt-grants.tsx", "/staff/research-development/govt-grants", "Government Grants", "Central & State government research grants (DST, SERB, DRDO, ISRO, AICTE).", "RESEARCH GRANTS", [{ label: "Govt Grants", val: "14 Grants" }, { label: "Total Fund", val: "₹7.20 Cr" }, { label: "Agencies", val: "DST, SERB, DRDO" }, { label: "Status", val: "Active" }], ["Grant Code", "Funding Agency", "Scheme Name", "Sanctioned Amount", "PI Name", "Department", "Status"], `[
  { code: "GRT-DST-01", agency: "DST SERB", scheme: "Core Research Grant (CRG)", amt: "₹45.0 Lacs", pi: "Dr. Ravi Kumar", dept: "CSE", status: "Approved" },
  { code: "GRT-DRDO-02", agency: "DRDO CARS", scheme: "Contract for Acquisition of Research Services", amt: "₹58.0 Lacs", pi: "Dr. Srinivas Rao", dept: "CSE", status: "Approved" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.industry-grants.tsx", "/staff/research-development/industry-grants", "Industry Grants", "Corporate sponsored R&D grants and CSR research funding.", "RESEARCH GRANTS", [{ label: "Industry Grants", val: "6 Grants" }, { label: "Total Fund", val: "₹1.25 Cr" }, { label: "Corporate Partners", val: "Google, L&T, Intel" }, { label: "Status", val: "Active" }], ["Grant Code", "Corporate Sponsor", "Research Focus", "Grant Amount", "PI Name", "Status"], `[
  { code: "IND-GGL-01", sponsor: "Google Cloud India", focus: "AI & Distributed Systems Research", amt: "₹35.0 Lacs", pi: "Dr. Ravi Kumar", status: "Approved" }
]`);

writeResearchPage("staff.research-development.funding-agencies.tsx", "/staff/research-development/funding-agencies", "Funding Agencies", "Empanelled funding agencies, grant call schedules, and contact details.", "RESEARCH GRANTS", [{ label: "Agencies Mapped", val: "12 Agencies" }, { label: "Open Calls", val: "4 Grants" }, { label: "Contact SLA", val: "Active" }, { label: "Status", val: "Active" }], ["Agency Name", "Category", "Nodal Officer", "Official Portal", "Status"], `[
  { name: "Science and Engineering Research Board (SERB)", cat: "Govt of India", officer: "Dr. V. K. Sharma", portal: "serbonline.in", status: "Active" }
]`);

writeResearchPage("staff.research-development.grant-utilization.tsx", "/staff/research-development/grant-utilization", "Grant Utilization", "Financial utilization certificates (UC) and audit clearances.", "RESEARCH GRANTS", [{ label: "Total Received", val: "₹8.45 Cr" }, { label: "Utilized", val: "₹6.80 Cr (80.4%)" }, { label: "UC Submitted", val: "100%" }, { label: "Status", val: "Verified" }], ["Grant Ref", "Agency", "Sanctioned Amount", "Utilized Amount", "UC Status", "Auditor Clearance", "Status"], `[
  { ref: "UC-DST-2025", agency: "DST SERB", amt: "₹45.0 Lacs", util: "₹38.5 Lacs", uc: "UC Submitted & Accepted", audit: "Verified", status: "Verified" }
]`);

// Research Scholars
writeResearchPage("staff.research-development.phd-scholars-list.tsx", "/staff/research-development/phd-scholars-list", "PhD Scholars", "Full-time & part-time PhD scholars, guides, research areas, and progress.", "RESEARCH SCHOLARS", [{ label: "PhD Scholars", val: "145 Scholars" }, { label: "Full-Time", val: "98 Scholars" }, { label: "Part-Time", val: "47 Scholars" }, { label: "Status", val: "Active" }], ["Reg Number", "Scholar Name", "Research Guide", "Department", "Research Topic / Area", "Joining Year", "Status"], `[
  { reg: "PHD-CSE-2024-01", name: "Ananya Sharma", guide: "Dr. Ravi Kumar", dept: "CSE", area: "Deep Learning in Brain MRI Analysis", year: "2024", status: "Active" },
  { reg: "PHD-ECE-2024-02", name: "Rajesh Varma", guide: "Dr. Priya Sharma", dept: "ECE", area: "IoT Sensor Fusion Protocols", year: "2024", status: "Active" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.research-guides.tsx", "/staff/research-development/research-guides", "Research Guides", "Approved PhD supervisor list, vacancy slots, and scholar quotas.", "RESEARCH SCHOLARS", [{ label: "Approved Guides", val: "48 Guides" }, { label: "Total Quota", val: "280 Slots" }, { label: "Vacancy", val: "135 Slots" }, { label: "Status", val: "Active" }], ["Guide Name", "Department", "Designation", "Scholars Guided", "Available Slots", "Status"], `[
  { name: "Dr. Ravi Kumar", dept: "CSE", desig: "Professor", guided: "6 Scholars", slots: "2 Slots Available", status: "Active" },
  { name: "Dr. Priya Sharma", dept: "ECE", desig: "Associate Professor", guided: "4 Scholars", slots: "2 Slots Available", status: "Active" }
]`);

writeResearchPage("staff.research-development.scholar-progress.tsx", "/staff/research-development/scholar-progress", "Scholar Progress", "Doctoral Committee (DC) review progress, seminars, and thesis status.", "RESEARCH SCHOLARS", [{ label: "DC Reviews Mtd", val: "145 Reviews" }, { label: "Seminars Given", val: "92 Seminars" }, { label: "Thesis Submitted", val: "12 Scholars" }, { label: "Status", val: "Active" }], ["Scholar Name", "Guide Name", "DC Review #", "Progress %", "Expected Completion", "Status"], `[
  { name: "Ananya Sharma", guide: "Dr. Ravi Kumar", dc: "3rd DC Review", pct: "75%", comp: "Dec 2026", status: "On Track" }
]`);

writeResearchPage("staff.research-development.thesis-repo.tsx", "/staff/research-development/thesis-repo", "Thesis Repository", "Submitted PhD dissertations, Shodhganga uploads, and viva records.", "RESEARCH SCHOLARS", [{ label: "Theses Archived", val: "68 Dissertations" }, { label: "Shodhganga Upload", val: "100%" }, { label: "Viva Cleared", val: "68 Scholars" }, { label: "Status", val: "Verified" }], ["Thesis ID", "Scholar Name", "Thesis Title", "Guide Name", "Viva Date", "Shodhganga Status", "Status"], `[
  { id: "THS-2025-08", name: "Vikram Malhotra", title: "Optimization of Renewable Energy Smart Grids", guide: "Dr. Lakshmi Devi", date: "2025-11-20", shodh: "Uploaded", status: "Awarded" }
]`);

// Research Laboratories
writeResearchPage("staff.research-development.research-labs.tsx", "/staff/research-development/research-labs", "Research Labs", "Dedicated R&D laboratories, supercomputing nodes, and lab incharge.", "RESEARCH LABORATORIES", [{ label: "R&D Labs", val: "8 Specialized Labs" }, { label: "GPU Nodes", val: "32 Nodes" }, { label: "Scholars", val: "98 Users" }, { label: "Status", val: "Active" }], ["Lab Name", "Department", "Faculty Incharge", "Supercomputing Nodes", "Running Projects", "Status"], `[
  { name: "Center for Artificial Intelligence & Supercomputing", dept: "CSE", incharge: "Dr. Ravi Kumar", nodes: "16 NVIDIA A100 Nodes", prj: "8 Projects", status: "Operational" },
  { name: "Advanced Microelectronics & VLSI Research Lab", dept: "ECE", incharge: "Dr. Priya Sharma", nodes: "Cadence & Synopsys Suite", prj: "6 Projects", status: "Operational" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.lab-equipment.tsx", "/staff/research-development/lab-equipment", "Lab Equipment", "High-end R&D equipment, Spectrum Analyzers, and GPU Servers.", "RESEARCH LABORATORIES", [{ label: "High-End Assets", val: "64 Assets" }, { label: "Valuation", val: "₹3.20 Cr" }, { label: "Working", val: "100%" }, { label: "Status", val: "Operational" }], ["Asset Code", "Equipment Description", "Laboratory", "Brand & Model", "Cost", "Status"], `[
  { code: "RD-EQ-01", desc: "NVIDIA DGX A100 AI Supercomputer Server", lab: "Center for AI", brand: "NVIDIA DGX", cost: "₹85.0 Lacs", status: "Operational" }
]`);

writeResearchPage("staff.research-development.lab-booking.tsx", "/staff/research-development/lab-booking", "Lab Booking", "Research lab slot reservation for scholars & experimental trials.", "RESEARCH LABORATORIES", [{ label: "Bookings", val: "42 Bookings" }, { label: "Approved", val: "100%" }, { label: "Active Slots", val: "18 Slots" }, { label: "Status", val: "Active" }], ["Booking ID", "Scholar Name", "Research Lab", "Slot Time", "Purpose", "Status"], `[
  { id: "RDBK-901", scholar: "Ananya Sharma", lab: "Center for AI", slot: "2026-08-10 (09:00 - 05:00 PM)", purpose: "Deep Model Training", status: "Approved" }
]`);

writeResearchPage("staff.research-development.lab-utilization.tsx", "/staff/research-development/lab-utilization", "Lab Utilization", "Research lab compute usage, GPU hours logged, and efficiency statistics.", "RESEARCH LABORATORIES", [{ label: "GPU Hours Logged", val: "4,850 Hours" }, { label: "Utilization Rate", val: "92.4%" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Laboratory Name", "Weekly Hours Logged", "Active Scholars", "Efficiency Score", "Status"], `[
  { name: "Center for Artificial Intelligence", hours: "168 Hours / Wk", scholars: "38 Scholars", score: "96.5%", status: "Optimal" }
]`);

// Research Events
writeResearchPage("staff.research-development.conferences.tsx", "/staff/research-development/conferences", "Conferences", "IEEE & International research conferences organized by R&D Cell.", "RESEARCH EVENTS", [{ label: "Conferences", val: "4 International" }, { label: "Delegates", val: "850 Delegates" }, { label: "IEEE Papers", val: "120 Papers" }, { label: "Status", val: "Active" }], ["Conference Title", "Scope / Tier", "Organizing Dept", "Dates", "Venue", "Status"], `[
  { title: "IEEE International Conference on Smart Systems & Artificial Intelligence (ICSSAI 2026)", scope: "IEEE Sponsored", dept: "CSE & R&D Cell", dates: "2026-11-14 to 16", venue: "Main Auditorium", status: "Upcoming" }
]`, "GroupedBarChart");

writeResearchPage("staff.research-development.fdps.tsx", "/staff/research-development/fdps", "FDPs", "Faculty Development Programs on Research Methodology and IPR.", "RESEARCH EVENTS", [{ label: "FDPs Organized", val: "8 Programs" }, { label: "Faculty Participants", val: "180 Faculty" }, { label: "Certificates", val: "Issued" }, { label: "Status", val: "Completed" }], ["FDP Title", "Target Audience", "Dates", "Participants", "Status"], `[
  { title: "National FDP on Writing High-Impact SCI Research Papers", audience: "All Faculty & Scholars", dates: "2026-07-05 to 09", count: "180 Faculty", status: "Completed" }
]`);

writeResearchPage("staff.research-development.workshops.tsx", "/staff/research-development/workshops", "Workshops", "Hands-on research workshops on Patent Filing & Grant Writing.", "RESEARCH EVENTS", [{ label: "Workshops", val: "12 Workshops" }, { label: "Attendees", val: "650 Attendees" }, { label: "Patents Drafted", val: "14 Drafts" }, { label: "Status", val: "Active" }], ["Workshop Title", "Focus Area", "Date", "Resource Person", "Status"], `[
  { title: "Hands-on Workshop on Indian Patent Office Filing & Claims Draft", focus: "IPR & Patents", date: "2026-07-22", speaker: "Dr. Senior Patent Attorney", status: "Completed" }
]`);

writeResearchPage("staff.research-development.seminars.tsx", "/staff/research-development/seminars", "Seminars", "Distinguished R&D expert lecture series and doctoral seminars.", "RESEARCH EVENTS", [{ label: "Seminars", val: "16 Lectures" }, { label: "Keynote Speakers", val: "16 Experts" }, { label: "Attendance", val: "100%" }, { label: "Status", val: "Active" }], ["Seminar Title", "Keynote Speaker", "Organization", "Date", "Status"], `[
  { title: "Keynote Lecture on Quantum Computing Frontiers", speaker: "Dr. Eminent Scientist", org: "TIFR Mumbai", date: "2026-08-02", status: "Completed" }
]`);

// Reports
writeResearchPage("staff.research-development.research-reports.tsx", "/staff/research-development/research-reports", "Research Reports", "Annual institutional research dossiers and research performance audits.", "REPORTS", [{ label: "Reports Archived", val: "12 Reports" }, { label: "Research Score", val: "Grade A++" }, { label: "Audit Pass", val: "100%" }, { label: "Status", val: "Verified" }], ["Report Title", "Scope", "Generated Date", "Status"], `[
  { title: "Annual Institutional Research & Development Performance Audit Report 2025-26", scope: "All Departments", date: "2026-08-01", status: "Verified" }
]`);

writeResearchPage("staff.research-development.publication-reports.tsx", "/staff/research-development/publication-reports", "Publication Reports", "SCI & Scopus publication compilations, impact factors & citations.", "REPORTS", [{ label: "Total Publications", val: "522 Papers" }, { label: "Citations", val: "4,850 Count" }, { label: "h-Index", val: "18.4" }, { label: "Status", val: "Verified" }], ["Report Title", "Paper Count", "SCI Ratio", "Status"], `[
  { title: "Annual Faculty SCI & Scopus Journal Publication Audit Report", count: "342 Papers", ratio: "54.1% SCI", status: "Verified" }
]`);

writeResearchPage("staff.research-development.patent-reports.tsx", "/staff/research-development/patent-reports", "Patent Reports", "Patent filing ledgers, granted patent dossiers, and IPR metrics.", "REPORTS", [{ label: "Patents", val: "42 Filed / 18 Granted" }, { label: "Commercialized", val: "4 Patents" }, { label: "Royalty Value", val: "₹45.0 Lacs" }, { label: "Status", val: "Verified" }], ["Report Title", "Patents Included", "Commercialization Value", "Status"], `[
  { title: "Institutional Patent Portfolio & Commercialization Report", count: "60 Dossiers", val: "₹45.0 Lacs Royalty", status: "Verified" }
]`);

writeResearchPage("staff.research-development.grant-reports.tsx", "/staff/research-development/grant-reports", "Grant Reports", "Sponsored research grants audit reports and utilization ledgers.", "REPORTS", [{ label: "Grant Funds", val: "₹8.45 Cr" }, { label: "UC Clearance", val: "100%" }, { label: "Sanction Pass", val: "Verified" }, { label: "Status", val: "Verified" }], ["Report Title", "Grant Total", "Utilization %", "Status"], `[
  { title: "Annual Sponsored Research Grants & Utilization Audit Report", val: "₹8.45 Cr", pct: "80.4% Utilized", status: "Verified" }
]`);

writeResearchPage("staff.research-development.scholar-reports.tsx", "/staff/research-development/scholar-reports", "Scholar Reports", "PhD scholar progress reports, thesis submissions, and viva outcomes.", "REPORTS", [{ label: "PhD Scholars", val: "145 Scholars" }, { label: "Theses Awarded", val: "68 Degrees" }, { label: "SLA Clearance", val: "98.5%" }, { label: "Status", val: "Verified" }], ["Report Title", "Scholars Tracked", "DC Review Clearance", "Status"], `[
  { title: "Annual PhD Scholars Progress & Dissertation Performance Report", count: "145 Scholars", rate: "98.5% Clear", status: "Verified" }
]`);

console.log("All 33 Research dedicated pages generated successfully.");
