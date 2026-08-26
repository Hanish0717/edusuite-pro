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
}

const ASSESSMENT_TYPES: (AssessmentType | "All Types")[] = [
  "All Types", "Internal 1", "Internal 2", "Quiz", "Assignment",
  "Lab Assessment", "Viva", "Seminar", "Project Evaluation",
];
const STATUSES: (AssessmentStatus | "All Status")[] = ["All Status", "Published", "Draft", "Closed"];

export function AssessmentToolbar({ academicYear, semester, assessments, onFilter }: AssessmentToolbarProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [sectionFilter, setSectionFilter] = useState<string>("All Sections");

  const sections = Array.from(new Set(assessments.map((a) => a.section)));

  const applyFilters = (q: string, type: string, status: string, sec: string) => {
    let list = assessments;
    if (q) list = list.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()) || a.subject.toLowerCase().includes(q.toLowerCase()));
    if (type !== "All Types") list = list.filter((a) => a.type === type);
    if (status !== "All Status") list = list.filter((a) => a.status === status);
    if (sec !== "All Sections") list = list.filter((a) => a.section === sec);
    onFilter(list);
  };

  const handleSearch = (v: string) => { setSearch(v); applyFilters(v, typeFilter, statusFilter, sectionFilter); };
  const handleType = (v: string) => { setTypeFilter(v); applyFilters(search, v, statusFilter, sectionFilter); };
  const handleStatus = (v: string) => { setStatusFilter(v); applyFilters(search, typeFilter, v, sectionFilter); };
  const handleSection = (v: string) => { setSectionFilter(v); applyFilters(search, typeFilter, statusFilter, v); };
  const handleReset = () => { setSearch(""); setTypeFilter("All Types"); setStatusFilter("All Status"); setSectionFilter("All Sections"); onFilter(assessments); };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
      {/* Row 1: Year/Semester + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium bg-muted/40 px-3 py-1.5 rounded-xl border border-border/40">
          <span>AY {academicYear}</span>
          <span className="text-border">|</span>
          <span>Sem {semester}</span>
        </div>

        <div className="relative flex-1 min-w-[180px]">
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
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-3.5 text-muted-foreground shrink-0" />

        <SelectFilter label="Type" value={typeFilter} options={ASSESSMENT_TYPES} onChange={handleType} />
        <SelectFilter label="Status" value={statusFilter} options={STATUSES} onChange={handleStatus} />
        <SelectFilter
          label="Section"
          value={sectionFilter}
          options={["All Sections", ...sections]}
          onChange={handleSection}
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
