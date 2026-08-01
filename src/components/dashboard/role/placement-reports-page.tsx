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
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleGenerateNaac = () => {
    toast.success("Generated NAAC Criterion 5.2 Accreditation Audit Report PDF!");
  };

  const handleGenerateNirf = () => {
    toast.success("Generated NIRF Data Submission Report PDF!");
  };

  const filteredReports = REPORTS_LIST.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                Institutional Reports & Audit Center
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Generate, verify, and export official placement documents for NAAC accreditation, NIRF ranking, and board audits.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS — NO GENERIC CREATE MODAL */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={handleGenerateNaac}
              className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <Printer className="size-4" /> Generate NAAC Report
            </Button>
            <Button
              onClick={handleGenerateNirf}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
            >
              <ShieldCheck className="size-4" /> Generate NIRF Report
            </Button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institutional report by title or compliance category..."
            className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
          />
        </div>
      </div>

      {/* REPORTS LIST TABLE */}
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
