import { Search, Grid, List, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSubject: string;
  onSubjectChange: (val: string) => void;
  selectedSection: string;
  onSectionChange: (val: string) => void;
  selectedType: string;
  onTypeChange: (val: string) => void;
  selectedSemester?: string;
  onSemesterChange?: (val: string) => void;
  selectedUnit?: string;
  onUnitChange?: (val: string) => void;
  selectedStatus?: string;
  onStatusChange?: (val: string) => void;
  selectedYear?: string;
  onYearChange?: (val: string) => void;
  uniqueSubjects: string[];
  uniqueSections: string[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedSection,
  onSectionChange,
  selectedType,
  onTypeChange,
  selectedSemester = "ALL",
  onSemesterChange,
  selectedUnit = "ALL",
  onUnitChange,
  selectedStatus = "ALL",
  onStatusChange,
  selectedYear = "ALL",
  onYearChange,
  uniqueSubjects,
  uniqueSections,
  viewMode,
  onViewModeChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 bg-muted/30 p-4 rounded-2xl border border-border/80 text-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input by Title */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search material title, keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-card rounded-xl h-9 text-xs"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex border rounded-xl bg-card overflow-hidden p-0.5 shrink-0">
            <Button
              onClick={() => onViewModeChange("grid")}
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              className="size-8 rounded-lg p-0 hover:bg-muted cursor-pointer flex justify-center items-center"
            >
              <Grid className="size-4 text-muted-foreground" />
            </Button>
            <Button
              onClick={() => onViewModeChange("list")}
              variant={viewMode === "list" ? "secondary" : "ghost"}
              className="size-8 rounded-lg p-0 hover:bg-muted cursor-pointer flex justify-center items-center"
            >
              <List className="size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Select Filters Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Academic Year */}
        {onYearChange && (
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[110px]">
              <SelectValue placeholder="AY 2026-27" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Years</SelectItem>
              <SelectItem value="2026-27">2026-27</SelectItem>
              <SelectItem value="2025-26">2025-26</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Semester */}
        {onSemesterChange && (
          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[100px]">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Semesters</SelectItem>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="3">Semester 3</SelectItem>
              <SelectItem value="5">Semester 5</SelectItem>
              <SelectItem value="7">Semester 7</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Subject */}
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[130px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Subjects</SelectItem>
            {uniqueSubjects.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Unit */}
        {onUnitChange && (
          <Select value={selectedUnit} onValueChange={onUnitChange}>
            <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[110px]">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Units</SelectItem>
              <SelectItem value="Unit I">Unit I</SelectItem>
              <SelectItem value="Unit II">Unit II</SelectItem>
              <SelectItem value="Unit III">Unit III</SelectItem>
              <SelectItem value="Unit IV">Unit IV</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Section */}
        <Select value={selectedSection} onValueChange={onSectionChange}>
          <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[110px]">
            <SelectValue placeholder="Section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Sections</SelectItem>
            {uniqueSections.map((sec) => (
              <SelectItem key={sec} value={sec}>
                {sec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Material Type */}
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="PDF">PDF Notes</SelectItem>
            <SelectItem value="PPT">PPT Slides</SelectItem>
            <SelectItem value="Video">Video Lectures</SelectItem>
            <SelectItem value="DOC">Assignments & DOC</SelectItem>
            <SelectItem value="ZIP">ZIP Bundles</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        {onStatusChange && (
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-8 rounded-xl bg-card text-[0.68rem] font-medium min-w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="Visible">Visible to Students</SelectItem>
              <SelectItem value="Scheduled">Scheduled Release</SelectItem>
              <SelectItem value="Draft">Hidden Draft</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

