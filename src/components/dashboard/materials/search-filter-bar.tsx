import { Search, Grid, List } from "lucide-react";
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
  uniqueSubjects,
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
          placeholder="Search materials by title or keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background rounded-xl h-10 text-xs"
        />
      </div>

      {/* Select Filters */}
      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger className="w-full sm:w-[130px] rounded-xl h-10 bg-background text-xs">
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

        <Select value={selectedSection} onValueChange={onSectionChange}>
          <SelectTrigger className="w-full sm:w-[110px] rounded-xl h-10 bg-background text-xs">
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

        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="w-full sm:w-[110px] rounded-xl h-10 bg-background text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="PDF">PDF Documents</SelectItem>
            <SelectItem value="PPT">PowerPoints</SelectItem>
            <SelectItem value="Video">Video Lectures</SelectItem>
            <SelectItem value="DOC">DOC Sheets</SelectItem>
            <SelectItem value="ZIP">ZIP Archives</SelectItem>
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
