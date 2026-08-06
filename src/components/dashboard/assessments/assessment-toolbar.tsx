import { Search, Filter, RefreshCw, Download, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AssessmentItem, AssessmentType, AssessmentStatus } from "./types";

interface AssessmentToolbarProps {
  academicYear: string;
  semester: string;
  assessments: AssessmentItem[];
  onFilter: (filtered: AssessmentItem[]) => void;
  onExport?: () => void;
}

const ASSESSMENT_TYPES: (AssessmentType | "All Types")[] = [
  "All Types", "Internal 1", "Internal 2", "Quiz", "Assignment",
  "Lab Assessment", "Viva", "Seminar", "Project Evaluation",
];
const STATUSES: (AssessmentStatus | "All Status")[] = ["All Status", "Published", "Draft", "Closed"];

export function AssessmentToolbar({ academicYear, semester, assessments, onFilter, onExport }: AssessmentToolbarProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [sectionFilter, setSectionFilter] = useState<string>("All Sections");
  const [yearFilter, setYearFilter] = useState<string>("All Years");
  const [semFilter, setSemFilter] = useState<string>("All Semesters");

  const sections = Array.from(new Set(assessments.map((a) => a.section)));
  const years = Array.from(new Set([academicYear, ...assessments.map((a) => a.academicYear)]));
  const semesters = Array.from(new Set([semester, ...assessments.map((a) => a.semester)]));

  const applyFilters = (q: string, type: string, status: string, sec: string, yr: string, sem: string) => {
    let list = assessments;
    if (q) list = list.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()) || a.subject.toLowerCase().includes(q.toLowerCase()));
    if (type !== "All Types") list = list.filter((a) => a.type === type);
    if (status !== "All Status") list = list.filter((a) => a.status === status);
    if (sec !== "All Sections") list = list.filter((a) => a.section === sec);
    if (yr !== "All Years") list = list.filter((a) => a.academicYear === yr);
    if (sem !== "All Semesters") list = list.filter((a) => a.semester === sem || `Semester ${a.semester}` === sem || `Sem ${a.semester}` === sem);
    onFilter(list);
  };

  const handleSearch = (v: string) => { setSearch(v); applyFilters(v, typeFilter, statusFilter, sectionFilter, yearFilter, semFilter); };
  const handleType = (v: string) => { setTypeFilter(v); applyFilters(search, v, statusFilter, sectionFilter, yearFilter, semFilter); };
  const handleStatus = (v: string) => { setStatusFilter(v); applyFilters(search, typeFilter, v, sectionFilter, yearFilter, semFilter); };
  const handleSection = (v: string) => { setSectionFilter(v); applyFilters(search, typeFilter, statusFilter, v, yearFilter, semFilter); };
  const handleYear = (v: string) => { setYearFilter(v); applyFilters(search, typeFilter, statusFilter, sectionFilter, v, semFilter); };
  const handleSem = (v: string) => { setSemFilter(v); applyFilters(search, typeFilter, statusFilter, sectionFilter, yearFilter, v); };

  const handleReset = () => {
    setSearch("");
    setTypeFilter("All Types");
    setStatusFilter("All Status");
    setSectionFilter("All Sections");
    setYearFilter("All Years");
    setSemFilter("All Semesters");
    onFilter(assessments);
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
      {/* Row 1: Search + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search assessment or subject..."
            className="pl-9 h-8 text-sm bg-muted/20 border-border/40"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={handleReset}>
            <RefreshCw className="size-3.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onExport}>
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Row 2: Filter Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground shrink-0" />

        <SelectFilter label="Assessment Type" value={typeFilter} options={ASSESSMENT_TYPES} onChange={handleType} />
        <SelectFilter label="Status" value={statusFilter} options={STATUSES} onChange={handleStatus} />
        <SelectFilter
          label="Section"
          value={sectionFilter}
          options={["All Sections", ...sections]}
          onChange={handleSection}
        />
        <SelectFilter
          label="Academic Year"
          value={yearFilter}
          options={["All Years", ...years.map((y) => (y.startsWith("AY ") ? y : `AY ${y}`))] }
          onChange={(v) => handleYear(v.replace(/^AY\s*/, ""))}
        />
        <SelectFilter
          label="Semester"
          value={semFilter}
          options={["All Semesters", ...semesters.map((s) => (s.startsWith("Sem ") || s.startsWith("Semester ") ? s : `Semester ${s}`))] }
          onChange={(v) => handleSem(v.replace(/^Semester\s*/, "").replace(/^Sem\s*/, ""))}
        />
      </div>
    </div>
  );
}

function SelectFilter({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        className="appearance-none h-7 pl-2 pr-7 text-xs rounded-lg border border-border/50 bg-muted/30 text-foreground font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
    </div>
  );
}
