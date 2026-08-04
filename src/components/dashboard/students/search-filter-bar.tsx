import { Search, Grid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedSection: string;
  onSectionChange: (val: string) => void;
  selectedPerformance: string;
  onPerformanceChange: (val: string) => void;
  selectedMentoring: string;
  onMentoringChange: (val: string) => void;
  uniqueSections: string[];
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedSection,
  onSectionChange,
  selectedPerformance,
  onPerformanceChange,
  selectedMentoring,
  onMentoringChange,
  uniqueSections,
  viewMode,
  onViewModeChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-muted/40 p-4 rounded-2xl border text-xs">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name, roll, or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background rounded-xl h-10 text-xs"
        />
      </div>

      {/* Select Filters and Action buttons */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <Select value={selectedSection} onValueChange={onSectionChange}>
          <SelectTrigger className="w-[110px] rounded-xl h-10 bg-background text-xs">
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

        <Select value={selectedPerformance} onValueChange={onPerformanceChange}>
          <SelectTrigger className="w-[130px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Shortage Alert" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Thresholds</SelectItem>
            <SelectItem value="Shortage">Attendance Shortage</SelectItem>
            <SelectItem value="AtRisk">Grades At Risk</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedMentoring} onValueChange={onMentoringChange}>
          <SelectTrigger className="w-[110px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Mentoring" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Students</SelectItem>
            <SelectItem value="Mentees">Mentees Only</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex border rounded-xl bg-background overflow-hidden p-0.5 shrink-0">
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
  );
}
